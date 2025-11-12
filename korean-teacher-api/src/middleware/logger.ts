import { Context, Next } from 'hono'
import { Env, Variables } from '../index'

/**
 * Logging middleware
 * Logs request/response information in development mode
 * Logs: method, path, status code, duration
 * Only enabled when ENVIRONMENT=development
 * 
 * Usage:
 *   app.use('*', loggerMiddleware)
 */
export async function loggerMiddleware(
  c: Context<{ Bindings: Env; Variables: Variables }>,
  next: Next
) {
  // Only log in development mode
  if (c.env.ENVIRONMENT !== 'development') {
    await next()
    return
  }
  
  const start = Date.now()
  const method = c.req.method
  const path = c.req.path
  
  // Log incoming request
  console.log(`→ ${method} ${path}`)
  
  await next()
  
  const duration = Date.now() - start
  const status = c.res.status
  
  // Log response with color coding based on status
  const statusColor = getStatusColor(status)
  console.log(`← ${method} ${path} ${statusColor}${status}\x1b[0m ${duration}ms`)
}

/**
 * Get ANSI color code based on HTTP status code
 */
function getStatusColor(status: number): string {
  if (status >= 500) return '\x1b[31m' // Red for 5xx
  if (status >= 400) return '\x1b[33m' // Yellow for 4xx
  if (status >= 300) return '\x1b[36m' // Cyan for 3xx
  if (status >= 200) return '\x1b[32m' // Green for 2xx
  return '\x1b[0m' // Default
}
