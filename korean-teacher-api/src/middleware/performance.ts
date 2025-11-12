import { Context, Next } from 'hono'
import { Env, Variables } from '../index'

/**
 * Performance monitoring middleware
 * Tracks response times against targets:
 * - Cached responses: < 50ms
 * - Notion API calls: < 2s (2000ms)
 * - R2 operations: < 500ms
 * 
 * Logs slow requests for optimization
 * Adds performance metrics to response headers in development mode
 * 
 * Usage:
 *   app.use('*', performanceMiddleware)
 */
export async function performanceMiddleware(
  c: Context<{ Bindings: Env; Variables: Variables }>,
  next: Next
) {
  const start = Date.now()
  const path = c.req.path
  const method = c.req.method
  
  await next()
  
  const duration = Date.now() - start
  
  // Determine performance target based on endpoint
  const target = getPerformanceTarget(path)
  
  // Log slow requests
  if (duration > target) {
    console.warn(
      `⚠️  Slow request: ${method} ${path} took ${duration}ms (target: ${target}ms)`
    )
  }
  
  // Add performance headers in development mode
  if (c.env.ENVIRONMENT === 'development') {
    c.header('X-Response-Time', `${duration}ms`)
    c.header('X-Performance-Target', `${target}ms`)
    c.header('X-Performance-Status', duration > target ? 'slow' : 'ok')
  }
}

/**
 * Get performance target based on endpoint path
 * Returns target response time in milliseconds
 */
function getPerformanceTarget(path: string): number {
  // Cached resource list endpoints - target < 50ms
  if (path.includes('/api/resources') && !path.includes('/download') && !path.includes('/upload')) {
    return 50
  }
  
  // R2 operations (download URL generation, upload) - target < 500ms
  if (path.includes('/download') || path.includes('/upload')) {
    return 500
  }
  
  // Notion API operations (admin endpoints, resource details) - target < 2000ms
  if (path.includes('/admin') || path.match(/\/api\/resources\/[^/]+$/)) {
    return 2000
  }
  
  // Default target for other endpoints
  return 1000
}

/**
 * Performance tracker utility
 * Use this to track specific operations within route handlers
 * 
 * Example:
 *   const tracker = new PerformanceTracker('Notion API call')
 *   const result = await notionService.getResource(id)
 *   tracker.end()
 */
export class PerformanceTracker {
  private start: number
  private operation: string
  
  constructor(operation: string) {
    this.operation = operation
    this.start = Date.now()
  }
  
  end(target?: number): number {
    const duration = Date.now() - this.start
    
    if (target && duration > target) {
      console.warn(
        `⚠️  Slow operation: ${this.operation} took ${duration}ms (target: ${target}ms)`
      )
    }
    
    return duration
  }
}
