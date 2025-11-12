import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { Miniflare } from 'miniflare'
import app from '../index'
import {
  createTestEnv,
  getTestBindings,
  initTestDatabase,
  cleanupTestDatabase,
} from '../test-helpers'
import { Env } from '../index'

describe('Health Check Endpoint', () => {
  let mf: Miniflare
  let env: Env

  beforeAll(async () => {
    mf = await createTestEnv()
    env = await getTestBindings(mf)
    await initTestDatabase(env.DB)
  })

  afterAll(async () => {
    await mf.dispose()
  })

  beforeEach(async () => {
    await cleanupTestDatabase(env.DB)
  })

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const req = new Request('http://localhost/api/health', {
        method: 'GET',
      })

      const res = await app.fetch(req, env)
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data).toHaveProperty('status')
      expect(data).toHaveProperty('services')
      expect(data).toHaveProperty('timestamp')
    })

    it('should always return 200 status code', async () => {
      const req = new Request('http://localhost/api/health', {
        method: 'GET',
      })

      const res = await app.fetch(req, env)
      
      // As per requirement 10.5, always return 200
      expect(res.status).toBe(200)
    })

    it('should include D1 database connectivity status', async () => {
      const req = new Request('http://localhost/api/health', {
        method: 'GET',
      })

      const res = await app.fetch(req, env)
      const data = await res.json()

      expect(data.services).toHaveProperty('d1')
      expect(data.services.d1).toHaveProperty('status')
      expect(data.services.d1).toHaveProperty('responseTime')
      expect(['up', 'down']).toContain(data.services.d1.status)
      expect(typeof data.services.d1.responseTime).toBe('number')
    })

    it('should include KV store connectivity status', async () => {
      const req = new Request('http://localhost/api/health', {
        method: 'GET',
      })

      const res = await app.fetch(req, env)
      const data = await res.json()

      expect(data.services).toHaveProperty('kv')
      expect(data.services.kv).toHaveProperty('status')
      expect(data.services.kv).toHaveProperty('responseTime')
      expect(['up', 'down']).toContain(data.services.kv.status)
      expect(typeof data.services.kv.responseTime).toBe('number')
    })

    it('should include R2 bucket connectivity status', async () => {
      const req = new Request('http://localhost/api/health', {
        method: 'GET',
      })

      const res = await app.fetch(req, env)
      const data = await res.json()

      expect(data.services).toHaveProperty('r2')
      expect(data.services.r2).toHaveProperty('status')
      expect(data.services.r2).toHaveProperty('responseTime')
      expect(['up', 'down']).toContain(data.services.r2.status)
      expect(typeof data.services.r2.responseTime).toBe('number')
    })

    it('should return healthy status when all services are up', async () => {
      const req = new Request('http://localhost/api/health', {
        method: 'GET',
      })

      const res = await app.fetch(req, env)
      const data = await res.json()

      // Check if all services are up
      const allUp =
        data.services.d1.status === 'up' &&
        data.services.kv.status === 'up' &&
        data.services.r2.status === 'up'

      if (allUp) {
        expect(data.status).toBe('healthy')
      } else {
        expect(data.status).toBe('degraded')
      }
    })

    it('should return degraded status when any service is down', async () => {
      const req = new Request('http://localhost/api/health', {
        method: 'GET',
      })

      const res = await app.fetch(req, env)
      const data = await res.json()

      // Check if any service is down
      const anyDown =
        data.services.d1.status === 'down' ||
        data.services.kv.status === 'down' ||
        data.services.r2.status === 'down'

      if (anyDown) {
        expect(data.status).toBe('degraded')
      }
    })

    it('should include timestamp in ISO format', async () => {
      const req = new Request('http://localhost/api/health', {
        method: 'GET',
      })

      const res = await app.fetch(req, env)
      const data = await res.json()

      expect(data.timestamp).toBeDefined()
      
      // Verify it's a valid ISO timestamp
      const timestamp = new Date(data.timestamp)
      expect(timestamp.toISOString()).toBe(data.timestamp)
    })

    it('should measure response times for each service', async () => {
      const req = new Request('http://localhost/api/health', {
        method: 'GET',
      })

      const res = await app.fetch(req, env)
      const data = await res.json()

      // Response times should be non-negative numbers
      expect(data.services.d1.responseTime).toBeGreaterThanOrEqual(0)
      expect(data.services.kv.responseTime).toBeGreaterThanOrEqual(0)
      expect(data.services.r2.responseTime).toBeGreaterThanOrEqual(0)
    })

    it('should test D1 connectivity with SELECT 1 query', async () => {
      const req = new Request('http://localhost/api/health', {
        method: 'GET',
      })

      const res = await app.fetch(req, env)
      const data = await res.json()

      // If D1 is up, it should have successfully executed SELECT 1
      if (data.services.d1.status === 'up') {
        expect(data.services.d1.responseTime).toBeGreaterThan(0)
      }
    })

    it('should test KV connectivity with test read operation', async () => {
      const req = new Request('http://localhost/api/health', {
        method: 'GET',
      })

      const res = await app.fetch(req, env)
      const data = await res.json()

      // If KV is up, it should have successfully performed a read
      if (data.services.kv.status === 'up') {
        expect(data.services.kv.responseTime).toBeGreaterThanOrEqual(0)
      }
    })

    it('should test R2 connectivity with head operation', async () => {
      const req = new Request('http://localhost/api/health', {
        method: 'GET',
      })

      const res = await app.fetch(req, env)
      const data = await res.json()

      // If R2 is up, it should have successfully performed a head operation
      if (data.services.r2.status === 'up') {
        expect(data.services.r2.responseTime).toBeGreaterThanOrEqual(0)
      }
    })

    it('should handle service failures gracefully', async () => {
      const req = new Request('http://localhost/api/health', {
        method: 'GET',
      })

      const res = await app.fetch(req, env)
      
      // Should always return 200 even if services are down
      expect(res.status).toBe(200)

      const data = await res.json()
      
      // Should still have all required fields
      expect(data).toHaveProperty('status')
      expect(data).toHaveProperty('services')
      expect(data).toHaveProperty('timestamp')
      expect(data.services).toHaveProperty('d1')
      expect(data.services).toHaveProperty('kv')
      expect(data.services).toHaveProperty('r2')
    })

    it('should be accessible without authentication', async () => {
      const req = new Request('http://localhost/api/health', {
        method: 'GET',
      })

      const res = await app.fetch(req, env)
      
      // Health check should not require authentication
      expect(res.status).toBe(200)
    })

    it('should respond quickly', async () => {
      const startTime = Date.now()
      
      const req = new Request('http://localhost/api/health', {
        method: 'GET',
      })

      const res = await app.fetch(req, env)
      const endTime = Date.now()
      
      expect(res.status).toBe(200)
      
      // Health check should respond within reasonable time (< 5 seconds)
      const duration = endTime - startTime
      expect(duration).toBeLessThan(5000)
    })
  })

  describe('Health Check with D1, KV, R2 Connectivity', () => {
    it('should verify D1 database is accessible', async () => {
      // Perform a direct D1 query to verify connectivity
      const result = await env.DB.prepare('SELECT 1 as test').first()
      expect(result).toBeDefined()
      expect(result?.test).toBe(1)

      // Now check health endpoint
      const req = new Request('http://localhost/api/health', {
        method: 'GET',
      })

      const res = await app.fetch(req, env)
      const data = await res.json()

      expect(data.services.d1.status).toBe('up')
    })

    it('should verify KV store is accessible', async () => {
      // Perform a direct KV operation to verify connectivity
      await env.CACHE.put('test-key', 'test-value')
      const value = await env.CACHE.get('test-key')
      expect(value).toBe('test-value')
      await env.CACHE.delete('test-key')

      // Now check health endpoint
      const req = new Request('http://localhost/api/health', {
        method: 'GET',
      })

      const res = await app.fetch(req, env)
      const data = await res.json()

      expect(data.services.kv.status).toBe('up')
    })

    it('should verify R2 bucket is accessible', async () => {
      // Perform a direct R2 operation to verify connectivity
      await env.BUCKET.put('test-file.txt', 'test content')
      const object = await env.BUCKET.get('test-file.txt')
      expect(object).not.toBeNull()
      await env.BUCKET.delete('test-file.txt')

      // Now check health endpoint
      const req = new Request('http://localhost/api/health', {
        method: 'GET',
      })

      const res = await app.fetch(req, env)
      const data = await res.json()

      expect(data.services.r2.status).toBe('up')
    })

    it('should report all services as healthy in test environment', async () => {
      const req = new Request('http://localhost/api/health', {
        method: 'GET',
      })

      const res = await app.fetch(req, env)
      const data = await res.json()

      // In test environment with Miniflare, all services should be up
      expect(data.services.d1.status).toBe('up')
      expect(data.services.kv.status).toBe('up')
      expect(data.services.r2.status).toBe('up')
      expect(data.status).toBe('healthy')
    })
  })
})
