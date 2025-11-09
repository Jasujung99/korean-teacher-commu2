import { Context, Next } from 'hono'
import { AuthService, JWTPayload } from '../services/AuthService'
import { UnauthorizedError, ForbiddenError } from '../utils/errors'
import { Env, Variables } from '../index'

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header and attaches user payload to context
 * 
 * Usage:
 *   app.get('/protected', authMiddleware, (c) => { ... })
 * 
 * @throws UnauthorizedError if token is missing or invalid
 */
export async function authMiddleware(c: Context<{ Bindings: Env; Variables: Variables }>, next: Next) {
  const authHeader = c.req.header('Authorization')
  
  if (!authHeader) {
    throw new UnauthorizedError('Authorization header is required')
  }

  // Extract token from "Bearer <token>" format
  const token = authHeader.replace(/^Bearer\s+/i, '')
  
  if (!token || token === authHeader) {
    throw new UnauthorizedError('Invalid authorization header format. Expected: Bearer <token>')
  }

  // Verify token
  const authService = new AuthService(c.env.JWT_SECRET)
  const payload = await authService.verifyJWT(token)

  // Attach user payload to context
  c.set('user', payload)

  await next()
}

/**
 * Type helper to get user from context
 * Use this in route handlers after authMiddleware
 */
export function getUser(c: Context): JWTPayload {
  const user = c.get('user') as JWTPayload
  if (!user) {
    throw new UnauthorizedError('User not found in context')
  }
  return user
}

/**
 * Admin middleware
 * Verifies that the authenticated user has admin role
 * Must be used after authMiddleware
 * 
 * Usage:
 *   app.get('/admin/resource', authMiddleware, adminMiddleware, (c) => { ... })
 * 
 * @throws ForbiddenError if user is not an admin
 */
export async function adminMiddleware(c: Context<{ Bindings: Env; Variables: Variables }>, next: Next) {
  const user = c.get('user') as JWTPayload
  
  if (!user) {
    throw new UnauthorizedError('Authentication required')
  }

  if (user.role !== 'admin') {
    throw new ForbiddenError('Admin access required')
  }

  await next()
}
