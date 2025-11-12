import { Context, Next } from 'hono'
import { Env, Variables } from '../index'

/**
 * CORS middleware
 * Configures CORS for localhost:5173 (development) and production domain
 * Allows GET, POST, PUT, DELETE, OPTIONS methods
 * Allows Content-Type and Authorization headers
 * Enables credentials
 * 
 * Usage:
 *   app.use('*', corsMiddleware)
 */
export async function corsMiddleware(
  c: Context<{ Bindings: Env; Variables: Variables }>,
  next: Next
) {
  const origin = c.req.header('Origin')
  
  // Define allowed origins
  const allowedOrigins = [
    'http://localhost:5173',
    'https://korean-teacher.pages.dev'
  ]
  
  // Check if origin is allowed
  if (origin && allowedOrigins.includes(origin)) {
    c.header('Access-Control-Allow-Origin', origin)
    c.header('Access-Control-Allow-Credentials', 'true')
  }
  
  // Set allowed methods
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  
  // Set allowed headers
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  // Set max age for preflight cache
  c.header('Access-Control-Max-Age', '86400')
  
  // Handle preflight requests
  if (c.req.method === 'OPTIONS') {
    return c.text('', 204)
  }
  
  await next()
}
