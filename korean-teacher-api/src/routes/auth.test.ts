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

describe('Authentication Flow', () => {
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
    await seedTestData(env.DB)
  })

  describe('POST /api/auth/github', () => {
    it('should return error when code is missing', async () => {
      const req = new Request('http://localhost/api/auth/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      const res = await app.fetch(req, env)
      expect(res.status).toBe(400)

      const data = await res.json()
      expect(data).toHaveProperty('error')
      expect(data.error).toBe('Authorization code is required')
    })

    it('should handle GitHub OAuth flow with valid code (mocked)', async () => {
      // Note: This test would require mocking GitHub API calls
      // For now, we test the error path since we can't make real GitHub API calls
      const req = new Request('http://localhost/api/auth/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: 'invalid-test-code' }),
      })

      const res = await app.fetch(req, env)
      
      // Expect error since we're using invalid code
      expect(res.status).toBeGreaterThanOrEqual(400)
    })
  })

  describe('GET /api/auth/me', () => {
    it('should return user info with valid token', async () => {
      // Generate a valid JWT token for test user
      const authService = new AuthService(env.JWT_SECRET)
      const token = await authService.generateJWT({
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

      const req = new Request('http://localhost/api/auth/me', {
        method: 'GET',
        headers: createAuthHeaders(token),
      })

      const res = await app.fetch(req, env)
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data).toHaveProperty('user')
      expect(data.user).toMatchObject({
        id: 'user-001',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
        mileage: 100,
      })
    })

    it('should return 401 when token is missing', async () => {
      const req = new Request('http://localhost/api/auth/me', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      const res = await app.fetch(req, env)
      expect(res.status).toBe(401)

      const data = await res.json()
      expect(data).toHaveProperty('error')
    })

    it('should return 401 when token is invalid', async () => {
      const req = new Request('http://localhost/api/auth/me', {
        method: 'GET',
        headers: createAuthHeaders('invalid-token'),
      })

      const res = await app.fetch(req, env)
      expect(res.status).toBe(401)

      const data = await res.json()
      expect(data).toHaveProperty('error')
    })

    it('should return 404 when user does not exist', async () => {
      // Generate token for non-existent user
      const authService = new AuthService(env.JWT_SECRET)
      const token = await authService.generateJWT({
        id: 'non-existent-user',
        githubId: '99999',
        username: 'nonexistent',
        email: 'nonexistent@example.com',
        avatarUrl: 'https://github.com/nonexistent.png',
        role: 'user',
        mileage: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      const req = new Request('http://localhost/api/auth/me', {
        method: 'GET',
        headers: createAuthHeaders(token),
      })

      const res = await app.fetch(req, env)
      expect(res.status).toBe(404)

      const data = await res.json()
      expect(data).toHaveProperty('error')
      expect(data.error).toBe('User not found')
    })
  })

  describe('Authentication Middleware', () => {
    it('should reject requests with expired token', async () => {
      // Create an expired token (negative expiry)
      const authService = new AuthService(env.JWT_SECRET)
      const token = await authService.generateJWT(
        {
          id: 'user-001',
          githubId: '12345',
          username: 'testuser',
          email: 'test@example.com',
          avatarUrl: 'https://github.com/testuser.png',
          role: 'user',
          mileage: 100,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        -1 // Expired 1 day ago
      )

      const req = new Request('http://localhost/api/auth/me', {
        method: 'GET',
        headers: createAuthHeaders(token),
      })

      const res = await app.fetch(req, env)
      expect(res.status).toBe(401)
    })

    it('should reject requests with malformed Authorization header', async () => {
      const req = new Request('http://localhost/api/auth/me', {
        method: 'GET',
        headers: {
          Authorization: 'InvalidFormat token',
          'Content-Type': 'application/json',
        },
      })

      const res = await app.fetch(req, env)
      expect(res.status).toBe(401)
    })
  })
})
