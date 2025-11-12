import { Hono } from 'hono'
import auth from './routes/auth'
import resources from './routes/resources'
import users from './routes/users'
import admin from './routes/admin'
import health from './routes/health'
import { errorHandler, corsMiddleware, loggerMiddleware } from './middleware'
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

// Initialize Hono app
const app = new Hono<{ Bindings: Env; Variables: Variables }>()

// Apply CORS middleware
app.use('*', corsMiddleware)

// Apply logging middleware for development
app.use('*', loggerMiddleware)

// Apply error handler middleware
app.onError(errorHandler)

// Basic health check route
app.get('/', (c) => {
  return c.json({ message: 'Korean Teacher API - Cloudflare Workers' })
})

// Mount auth routes at /api/auth
app.route('/api/auth', auth)

// Mount resource routes at /api/resources
app.route('/api/resources', resources)

// Mount user routes at /api/users
app.route('/api/users', users)

// Mount admin routes at /api/admin
app.route('/api/admin', admin)

// Mount health check at /api/health
app.route('/api/health', health)

// Export app as default
export default app
