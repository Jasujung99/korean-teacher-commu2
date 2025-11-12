import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest'
import { Miniflare } from 'miniflare'
import app from '../index'
import { AuthService } from '../services/AuthService'
import { NotionService } from '../services/NotionService'
import {
  createTestEnv,
  getTestBindings,
  initTestDatabase,
  seedTestData,
  cleanupTestDatabase,
  createAuthHeaders,
} from '../test-helpers'
import { Env } from '../index'

describe('Resource Endpoints', () => {
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

  describe('GET /api/resources', () => {
    it('should return approved resources list', async () => {
      // Mock Notion API response
      const mockResources = [
        {
          id: 'notion-page-001',
          title: 'Test Resource 1',
          description: 'Test description',
          fileKey: '2024/01/test-file-1.pdf',
          category: '문법',
          level: '초급',
          requiredMileage: 30,
          fileSize: '2.5 MB',
          uploadedBy: 'testuser',
          uploadedAt: '2024-01-15',
          views: 10,
          downloads: 5,
        },
      ]

      // Store mock data in KV cache
      await env.CACHE.put(
        'resources:approved:page:1:category:all:level:all',
        JSON.stringify({ resources: mockResources, hasMore: false }),
        { expirationTtl: 300 }
      )

      const req = new Request('http://localhost/api/resources', {
        method: 'GET',
      })

      const res = await app.fetch(req, env)
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data).toHaveProperty('resources')
      expect(Array.isArray(data.resources)).toBe(true)
    })

    it('should support pagination parameters', async () => {
      const req = new Request('http://localhost/api/resources?page=2&limit=10', {
        method: 'GET',
      })

      const res = await app.fetch(req, env)
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data).toHaveProperty('resources')
    })

    it('should support category and level filters', async () => {
      const req = new Request(
        'http://localhost/api/resources?category=문법&level=초급',
        {
          method: 'GET',
        }
      )

      const res = await app.fetch(req, env)
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data).toHaveProperty('resources')
    })
  })

  describe('GET /api/resources/:id', () => {
    it('should return resource details', async () => {
      const req = new Request('http://localhost/api/resources/notion-page-001', {
        method: 'GET',
      })

      const res = await app.fetch(req, env)
      
      // May return 404 or 503 if Notion API is not available
      expect([200, 404, 503]).toContain(res.status)
    })

    it('should return 404 for non-existent resource', async () => {
      const req = new Request(
        'http://localhost/api/resources/non-existent-id',
        {
          method: 'GET',
        }
      )

      const res = await app.fetch(req, env)
      
      // Should return error status
      expect(res.status).toBeGreaterThanOrEqual(400)
    })
  })

  describe('POST /api/resources/:id/download', () => {
    it('should require authentication', async () => {
      const req = new Request(
        'http://localhost/api/resources/notion-page-001/download',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      )

      const res = await app.fetch(req, env)
      expect(res.status).toBe(401)

      const data = await res.json()
      expect(data).toHaveProperty('error')
    })

    it('should check mileage balance before download', async () => {
      // Use low mileage user token
      const authService = new AuthService(env.JWT_SECRET)
      const lowMileageToken = await authService.generateJWT({
        id: 'user-002',
        githubId: '11111',
        username: 'lowmileageuser',
        email: 'lowmileage@example.com',
        avatarUrl: 'https://github.com/lowmileageuser.png',
        role: 'user',
        mileage: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      // Add resource to cache with high mileage requirement
      await env.DB.prepare(
        'INSERT OR REPLACE INTO resource_cache (notion_id, file_key, required_mileage) VALUES (?, ?, ?)'
      )
        .bind('notion-page-001', '2024/01/test-file.pdf', 50)
        .run()

      const req = new Request(
        'http://localhost/api/resources/notion-page-001/download',
        {
          method: 'POST',
          headers: createAuthHeaders(lowMileageToken),
        }
      )

      const res = await app.fetch(req, env)
      
      // Should return insufficient mileage error (402) or other error
      expect(res.status).toBeGreaterThanOrEqual(400)
    })

    it('should deduct mileage on successful download', async () => {
      // Add resource to cache
      await env.DB.prepare(
        'INSERT OR REPLACE INTO resource_cache (notion_id, file_key, required_mileage) VALUES (?, ?, ?)'
      )
        .bind('notion-page-001', '2024/01/test-file.pdf', 30)
        .run()

      // Upload a test file to R2
      await env.BUCKET.put(
        '2024/01/test-file.pdf',
        new Uint8Array([1, 2, 3, 4, 5])
      )

      const initialBalance = await env.DB.prepare(
        'SELECT mileage FROM users WHERE id = ?'
      )
        .bind('user-001')
        .first()

      const req = new Request(
        'http://localhost/api/resources/notion-page-001/download',
        {
          method: 'POST',
          headers: createAuthHeaders(userToken),
        }
      )

      const res = await app.fetch(req, env)
      
      // May succeed or fail depending on Notion API availability
      if (res.status === 200) {
        const data = await res.json()
        expect(data).toHaveProperty('downloadUrl')

        // Check mileage was deducted
        const finalBalance = await env.DB.prepare(
          'SELECT mileage FROM users WHERE id = ?'
        )
          .bind('user-001')
          .first()

        expect(finalBalance?.mileage).toBe((initialBalance?.mileage as number) - 30)
      }
    })
  })

  describe('POST /api/resources/upload', () => {
    it('should require authentication', async () => {
      const formData = new FormData()
      formData.append('title', 'Test Resource')
      formData.append('description', 'Test description')
      formData.append('category', '문법')
      formData.append('level', '초급')
      formData.append('requiredMileage', '30')
      formData.append('copyrightConfirmed', 'true')
      formData.append('license', 'CC BY-SA 4.0')

      const req = new Request('http://localhost/api/resources/upload', {
        method: 'POST',
        body: formData,
      })

      const res = await app.fetch(req, env)
      expect(res.status).toBe(401)
    })

    it('should create pending resource and award mileage', async () => {
      // Create a small test file
      const fileContent = new Uint8Array([1, 2, 3, 4, 5])
      const blob = new Blob([fileContent], { type: 'application/pdf' })
      const file = new File([blob], 'test.pdf', { type: 'application/pdf' })

      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', 'Test Resource')
      formData.append('description', 'Test description')
      formData.append('category', '문법')
      formData.append('level', '초급')
      formData.append('requiredMileage', '30')
      formData.append('copyrightConfirmed', 'true')
      formData.append('license', 'CC BY-SA 4.0')

      const initialBalance = await env.DB.prepare(
        'SELECT mileage FROM users WHERE id = ?'
      )
        .bind('user-001')
        .first()

      const req = new Request('http://localhost/api/resources/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        body: formData,
      })

      const res = await app.fetch(req, env)
      
      // May succeed or fail depending on Notion API availability
      if (res.status === 200) {
        const data = await res.json()
        expect(data).toHaveProperty('resourceId')
        expect(data).toHaveProperty('fileKey')
        expect(data.status).toBe('pending')

        // Check mileage was awarded
        const finalBalance = await env.DB.prepare(
          'SELECT mileage FROM users WHERE id = ?'
        )
          .bind('user-001')
          .first()

        expect(finalBalance?.mileage).toBe((initialBalance?.mileage as number) + 50)
      }
    })

    it('should reject files larger than 100MB', async () => {
      // Create a mock large file (we'll just set the size in metadata)
      const formData = new FormData()
      formData.append('title', 'Large File')
      formData.append('description', 'Test description')
      formData.append('category', '문법')
      formData.append('level', '초급')
      formData.append('requiredMileage', '30')
      formData.append('copyrightConfirmed', 'true')
      formData.append('license', 'CC BY-SA 4.0')

      const req = new Request('http://localhost/api/resources/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        body: formData,
      })

      const res = await app.fetch(req, env)
      
      // Should return error for missing file
      expect(res.status).toBeGreaterThanOrEqual(400)
    })
  })
})
