import { Hono } from 'hono'
import auth from './routes/auth'
import { errorHandler } from './middleware/errorHandler'
import { JWTPayload } from './services/AuthService'

// Define environment bindings type
export interface Env {
  DB: D1Database
  CACHE: KVNamespace
  BUCKET: R2Bucket
  JWT_SECRET: string
  NOTION_API_KEY: string
  NOTION_DATABASE_ID: string
  GITHUB_CLIENT_ID: string
  GITHUB_CLIENT_SECRET: string
  ENVIRONMENT: string
}

// Define context variables type
export type Variables = {
  user: JWTPayload
}

const app = new Hono<{ Bindings: Env; Variables: Variables }>()

// Apply error handler middleware
app.onError(errorHandler)

// Basic health check route
app.get('/', (c) => {
  return c.json({ message: 'Korean Teacher API - Cloudflare Workers' })
})

// Mount auth routes
app.route('/api/auth', auth)

export default app
