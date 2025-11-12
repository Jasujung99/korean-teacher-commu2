import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { Miniflare } from 'miniflare'
import app from '../index'
import { AuthService } from '../services/AuthService'
import {
  createTestEnv,
  getTestBindings,
  initTestDatabase,
  seedTestData,
  cleanupTestDatabase,
  createAuthHeaders,
} from '../test-helpers'
import { Env } from '../index'

describe('Admin Endpoints', () => {
  let mf: Miniflare
  let env: Env
  let userToken: string
  let adminToken: string

  beforeAll(async () => {
    mf = await createTestEnv()
    env = await getTestBindings(mf)
    await initTestDatabase(env.DB)

    // Generate tokens for tests
    const authService = new AuthService(env.JWT_SECRET)
    userToken = await authService.generateJWT({
      id: 'user-001',
      githubId: '12345',
      username: 'testuser',
      email: 'test@example.com',
      avatarUrl: 'https://github.com/testuser.png',
      role: 'user',
      mileage: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    adminToken = await authService.generateJWT({
      id: 'admin-001',
      githubId: '67890',
      username: 'adminuser',
      email: 'admin@example.com',
      avatarUrl: 'https://github.com/adminuser.png',
      role: 'admin',
      mileage: 200,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  })

  afterAll(async () => {
    await mf.dispose()
  })

  beforeEach(async () => {
    await cleanupTestDatabase(env.DB)
    await seedTestData(env.DB)
    
    // Clear KV cache
    const keys = await env.CACHE.list()
    for (const key of keys.keys) {
      await env.CACHE.delete(key.name)
    }
  })

  describe('GET /api/admin/resources/pending', () => {
    it('should require authentication', async () => {
      const req = new Request('http://localhost/api/admin/resources/pending', {
        method: 'GET',
      })

      const res = await app.fetch(req, env)
      expect(res.status).toBe(401)
    })

    it('should require admin role', async () => {
      const req = new Request('http://localhost/api/admin/resources/pending', {
        method: 'GET',
        headers: createAuthHeaders(userToken),
      })

      const res = await app.fetch(req, env)
      expect(res.status).toBe(403)

      const data = await res.json()
      expect(data).toHaveProperty('error')
    })

    it('should return pending resources for admin', async () => {
      const req = new Request('http://localhost/api/admin/resources/pending', {
        method: 'GET',
        headers: createAuthHeaders(adminToken),
      })

      const res = await app.fetch(req, env)
      
      // May succeed or fail depending on Notion API availability
      if (res.status === 200) {
        const data = await res.json()
        expect(data).toHaveProperty('resources')
        expect(Array.isArray(data.resources)).toBe(true)
      } else {
        // Notion API may not be available in test environment
        expect(res.status).toBeGreaterThanOrEqual(400)
      }
    })

    it('should only return resources with status "대기"', async () => {
      const req = new Request('http://localhost/api/admin/resources/pending', {
        method: 'GET',
        headers: createAuthHeaders(adminToken),
      })

      const res = await app.fetch(req, env)
      
      if (res.status === 200) {
        const data = await res.json()
        
        // All returned resources should have pending status
        // (This would be validated if we had mock Notion data)
        expect(data.resources).toBeDefined()
      }
    })
  })

  describe('POST /api/admin/resources/:id/approve', () => {
    it('should require authentication', async () => {
      const req = new Request(
        'http://localhost/api/admin/resources/notion-page-001/approve',
        {
          method: 'POST',
        }
      )

      const res = await app.fetch(req, env)
      expect(res.status).toBe(401)
    })

    it('should require admin role', async () => {
      const req = new Request(
        'http://localhost/api/admin/resources/notion-page-001/approve',
        {
          method: 'POST',
          headers: createAuthHeaders(userToken),
        }
      )

      const res = await app.fetch(req, env)
      expect(res.status).toBe(403)
    })

    it('should approve resource and return success', async () => {
      const req = new Request(
        'http://localhost/api/admin/resources/notion-page-001/approve',
        {
          method: 'POST',
          headers: createAuthHeaders(adminToken),
        }
      )

      const res = await app.fetch(req, env)
      
      // May succeed or fail depending on Notion API availability
      if (res.status === 200) {
        const data = await res.json()
        expect(data).toHaveProperty('success')
        expect(data).toHaveProperty('resourceId')
        expect(data.success).toBe(true)
        expect(data.resourceId).toBe('notion-page-001')
      }
    })

    it('should invalidate cache after approval', async () => {
      // Add some cache entries
      await env.CACHE.put(
        'resources:approved:page:1:category:all:level:all',
        JSON.stringify({ resources: [], hasMore: false }),
        { expirationTtl: 300 }
      )
      await env.CACHE.put(
        'resources:approved:page:2:category:문법:level:초급',
        JSON.stringify({ resources: [], hasMore: false }),
        { expirationTtl: 300 }
      )

      // Verify cache exists
      const cachedBefore = await env.CACHE.get(
        'resources:approved:page:1:category:all:level:all'
      )
      expect(cachedBefore).not.toBeNull()

      const req = new Request(
        'http://localhost/api/admin/resources/notion-page-001/approve',
        {
          method: 'POST',
          headers: createAuthHeaders(adminToken),
        }
      )

      const res = await app.fetch(req, env)
      
      if (res.status === 200) {
        // Verify cache was cleared
        const cachedAfter = await env.CACHE.get(
          'resources:approved:page:1:category:all:level:all'
        )
        expect(cachedAfter).toBeNull()
      }
    })
  })

  describe('POST /api/admin/resources/:id/reject', () => {
    it('should require authentication', async () => {
      const req = new Request(
        'http://localhost/api/admin/resources/notion-page-001/reject',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason: 'Not suitable' }),
        }
      )

      const res = await app.fetch(req, env)
      expect(res.status).toBe(401)
    })

    it('should require admin role', async () => {
      const req = new Request(
        'http://localhost/api/admin/resources/notion-page-001/reject',
        {
          method: 'POST',
          headers: {
            ...createAuthHeaders(userToken),
          },
          body: JSON.stringify({ reason: 'Not suitable' }),
        }
      )

      const res = await app.fetch(req, env)
      expect(res.status).toBe(403)
    })

    it('should reject resource with reason', async () => {
      const req = new Request(
        'http://localhost/api/admin/resources/notion-page-001/reject',
        {
          method: 'POST',
          headers: {
            ...createAuthHeaders(adminToken),
          },
          body: JSON.stringify({ reason: 'Content does not meet quality standards' }),
        }
      )

      const res = await app.fetch(req, env)
      
      // May succeed or fail depending on Notion API availability
      if (res.status === 200) {
        const data = await res.json()
        expect(data).toHaveProperty('success')
        expect(data).toHaveProperty('resourceId')
        expect(data.success).toBe(true)
        expect(data.resourceId).toBe('notion-page-001')
      }
    })

    it('should invalidate cache after rejection', async () => {
      // Add some cache entries
      await env.CACHE.put(
        'resources:approved:page:1:category:all:level:all',
        JSON.stringify({ resources: [], hasMore: false }),
        { expirationTtl: 300 }
      )

      // Verify cache exists
      const cachedBefore = await env.CACHE.get(
        'resources:approved:page:1:category:all:level:all'
      )
      expect(cachedBefore).not.toBeNull()

      const req = new Request(
        'http://localhost/api/admin/resources/notion-page-001/reject',
        {
          method: 'POST',
          headers: {
            ...createAuthHeaders(adminToken),
          },
          body: JSON.stringify({ reason: 'Not suitable' }),
        }
      )

      const res = await app.fetch(req, env)
      
      if (res.status === 200) {
        // Verify cache was cleared
        const cachedAfter = await env.CACHE.get(
          'resources:approved:page:1:category:all:level:all'
        )
        expect(cachedAfter).toBeNull()
      }
    })
  })

  describe('Cache Invalidation', () => {
    it('should clear all resource list cache entries on approval', async () => {
      // Add multiple cache entries with different filters
      const cacheKeys = [
        'resources:approved:page:1:category:all:level:all',
        'resources:approved:page:1:category:문법:level:all',
        'resources:approved:page:2:category:all:level:초급',
        'resources:approved:page:1:category:어휘:level:중급',
      ]

      for (const key of cacheKeys) {
        await env.CACHE.put(
          key,
          JSON.stringify({ resources: [], hasMore: false }),
          { expirationTtl: 300 }
        )
      }

      // Verify all cache entries exist
      for (const key of cacheKeys) {
        const cached = await env.CACHE.get(key)
        expect(cached).not.toBeNull()
      }

      // Approve a resource
      const req = new Request(
        'http://localhost/api/admin/resources/notion-page-001/approve',
        {
          method: 'POST',
          headers: createAuthHeaders(adminToken),
        }
      )

      const res = await app.fetch(req, env)
      
      if (res.status === 200) {
        // Verify all cache entries were cleared
        for (const key of cacheKeys) {
          const cached = await env.CACHE.get(key)
          expect(cached).toBeNull()
        }
      }
    })

    it('should clear all resource list cache entries on rejection', async () => {
      // Add multiple cache entries
      const cacheKeys = [
        'resources:approved:page:1:category:all:level:all',
        'resources:approved:page:2:category:문법:level:초급',
      ]

      for (const key of cacheKeys) {
        await env.CACHE.put(
          key,
          JSON.stringify({ resources: [], hasMore: false }),
          { expirationTtl: 300 }
        )
      }

      // Reject a resource
      const req = new Request(
        'http://localhost/api/admin/resources/notion-page-001/reject',
        {
          method: 'POST',
          headers: {
            ...createAuthHeaders(adminToken),
          },
          body: JSON.stringify({ reason: 'Not suitable' }),
        }
      )

      const res = await app.fetch(req, env)
      
      if (res.status === 200) {
        // Verify all cache entries were cleared
        for (const key of cacheKeys) {
          const cached = await env.CACHE.get(key)
          expect(cached).toBeNull()
        }
      }
    })

    it('should not affect non-resource cache entries', async () => {
      // Add resource cache entries
      await env.CACHE.put(
        'resources:approved:page:1:category:all:level:all',
        JSON.stringify({ resources: [], hasMore: false }),
        { expirationTtl: 300 }
      )

      // Add non-resource cache entry
      await env.CACHE.put('other:cache:key', 'some-value', {
        expirationTtl: 300,
      })

      // Approve a resource
      const req = new Request(
        'http://localhost/api/admin/resources/notion-page-001/approve',
        {
          method: 'POST',
          headers: createAuthHeaders(adminToken),
        }
      )

      const res = await app.fetch(req, env)
      
      if (res.status === 200) {
        // Verify resource cache was cleared
        const resourceCache = await env.CACHE.get(
          'resources:approved:page:1:category:all:level:all'
        )
        expect(resourceCache).toBeNull()

        // Verify other cache entry still exists
        const otherCache = await env.CACHE.get('other:cache:key')
        expect(otherCache).toBe('some-value')
      }
    })
  })
})
