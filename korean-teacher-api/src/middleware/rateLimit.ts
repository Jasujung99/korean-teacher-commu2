import { Context, Next } from 'hono'
import { RateLimitError } from '../utils/errors'
import { Env, Variables } from '../index'

/**
 * Rate limit middleware
 * Limits requests to 100 per minute per user
 * Uses KV to track request count with 60-second TTL
 * 
 * Usage:
 *   app.get('/api/resource', rateLimitMiddleware, (c) => { ... })
 * 
 * @throws RateLimitError when limit exceeded (429)
 */
export async function rateLimitMiddleware(
  c: Context<{ Bindings: Env; Variables: Variables }>,
  next: Next
) {
  // Get user ID from context (if authenticated) or use IP address as fallback
  const user = c.get('user')
  const userId = user?.userId || c.req.header('CF-Connecting-IP') || 'anonymous'
  
  const key = `ratelimit:${userId}`
  
  // Get current count from KV
  const countStr = await c.env.CACHE.get(key)
  const count = countStr ? parseInt(countStr, 10) : 0
  
  // Check if limit exceeded
  if (count >= 100) {
    throw new RateLimitError('Rate limit exceeded. Maximum 100 requests per minute.')
  }
  
  // Increment counter
  const newCount = count + 1
  
  // Store with 60-second TTL
  await c.env.CACHE.put(key, String(newCount), {
    expirationTtl: 60
  })
  
  // Add rate limit headers to response
  c.header('X-RateLimit-Limit', '100')
  c.header('X-RateLimit-Remaining', String(100 - newCount))
  c.header('X-RateLimit-Reset', String(Math.floor(Date.now() / 1000) + 60))
  
  await next()
}
