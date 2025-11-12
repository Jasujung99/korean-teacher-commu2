import { Hono } from 'hono'
import { Env } from '../index'

const health = new Hono<{ Bindings: Env }>()

interface ServiceStatus {
  status: 'up' | 'down'
  responseTime: number
}

interface HealthResponse {
  status: 'healthy' | 'degraded'
  services: {
    d1: ServiceStatus
    kv: ServiceStatus
    r2: ServiceStatus
  }
  timestamp: string
}

health.get('/', async (c) => {
  const services = {
    d1: { status: 'down' as 'up' | 'down', responseTime: 0 },
    kv: { status: 'down' as 'up' | 'down', responseTime: 0 },
    r2: { status: 'down' as 'up' | 'down', responseTime: 0 }
  }

  // Test D1 connectivity with SELECT 1 query
  const d1Start = Date.now()
  try {
    await c.env.DB.prepare('SELECT 1').first()
    services.d1 = { status: 'up', responseTime: Date.now() - d1Start }
  } catch (e) {
    console.error('D1 health check failed:', e)
    services.d1 = { status: 'down', responseTime: Date.now() - d1Start }
  }

  // Test KV connectivity with test read operation
  const kvStart = Date.now()
  try {
    await c.env.CACHE.get('health-check-test')
    services.kv = { status: 'up', responseTime: Date.now() - kvStart }
  } catch (e) {
    console.error('KV health check failed:', e)
    services.kv = { status: 'down', responseTime: Date.now() - kvStart }
  }

  // Test R2 connectivity with head operation
  const r2Start = Date.now()
  try {
    await c.env.BUCKET.head('health-check-test')
    services.r2 = { status: 'up', responseTime: Date.now() - r2Start }
  } catch (e) {
    console.error('R2 health check failed:', e)
    services.r2 = { status: 'down', responseTime: Date.now() - r2Start }
  }

  // Determine overall status - healthy if all services up, degraded otherwise
  const allHealthy = Object.values(services).every(s => s.status === 'up')

  const response: HealthResponse = {
    status: allHealthy ? 'healthy' : 'degraded',
    services,
    timestamp: new Date().toISOString()
  }

  // Always return 200 status code with service details
  return c.json(response, 200)
})

export default health
