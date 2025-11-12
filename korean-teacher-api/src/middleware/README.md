# Middleware

Request/response middleware for the Korean Teacher API.

## Available Middleware

- `auth.ts` - JWT authentication and admin role verification middleware
- `cors.ts` - CORS configuration for localhost and production
- `errorHandler.ts` - Global error handling
- `rateLimit.ts` - Rate limiting (100 requests per minute per user)
- `logger.ts` - Request/response logging (development mode only)
- `performance.ts` - Performance monitoring and tracking

## Usage Example

```typescript
import { Hono } from 'hono'
import {
  corsMiddleware,
  loggerMiddleware,
  performanceMiddleware,
  rateLimitMiddleware,
  authMiddleware,
  adminMiddleware,
  errorHandler
} from './middleware'

const app = new Hono()

// Apply global middleware
app.use('*', corsMiddleware)
app.use('*', loggerMiddleware)
app.use('*', performanceMiddleware)

// Apply error handler
app.onError(errorHandler)

// Protected route with rate limiting
app.get('/api/resources', rateLimitMiddleware, authMiddleware, (c) => {
  // Route handler
})

// Admin-only route
app.post('/api/admin/approve', authMiddleware, adminMiddleware, (c) => {
  // Admin route handler
})
```
