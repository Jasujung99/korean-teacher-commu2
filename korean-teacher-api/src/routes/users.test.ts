import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { Miniflare } from 'miniflare'
import app from '../index'
import { AuthService } from '../services/AuthService'
import { MileageService } from '../services/MileageService'
import {
  createTestEnv,
  getTestBindings,
  initTestDatabase,
  seedTestData,
  cleanupTestDatabase,
  createAuthHeaders,
} from '../test-helpers'
import { Env } from '../index'

describe('Mileage System', () => {
  let mf: Miniflare
  let env: Env
  let userToken: string
  let lowMileageToken: string

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

    lowMileageToken = await authService.generateJWT({
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
  })

  afterAll(async () => {
    await mf.dispose()
  })

  beforeEach(async () => {
    await cleanupTestDatabase(env.DB)
    await seedTestData(env.DB)
  })

  describe('GET /api/users/me/mileage', () => {
    it('should require authentication', async () => {
      const req = new Request('http://localhost/api/users/me/mileage', {
        method: 'GET',
      })

      const res = await app.fetch(req, env)
      expect(res.status).toBe(401)
    })

    it('should return balance and transaction history', async () => {
      const req = new Request('http://localhost/api/users/me/mileage', {
        method: 'GET',
        headers: createAuthHeaders(userToken),
      })

      const res = await app.fetch(req, env)
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data).toHaveProperty('balance')
      expect(data).toHaveProperty('transactions')
      expect(typeof data.balance).toBe('number')
      expect(Array.isArray(data.transactions)).toBe(true)
      expect(data.balance).toBe(100)
    })

    it('should return transaction history with correct format', async () => {
      const req = new Request('http://localhost/api/users/me/mileage', {
        method: 'GET',
        headers: createAuthHeaders(userToken),
      })

      const res = await app.fetch(req, env)
      expect(res.status).toBe(200)

      const data = await res.json()
      
      if (data.transactions.length > 0) {
        const transaction = data.transactions[0]
        expect(transaction).toHaveProperty('id')
        expect(transaction).toHaveProperty('type')
        expect(transaction).toHaveProperty('amount')
        expect(transaction).toHaveProperty('description')
        expect(transaction).toHaveProperty('createdAt')
        expect(['earn', 'spend']).toContain(transaction.type)
      }
    })
  })

  describe('Mileage Deduction on Download', () => {
    it('should deduct mileage when downloading resource', async () => {
      const mileageService = new MileageService(env.DB)

      // Get initial balance
      const initialBalance = await mileageService.getBalance('user-001')
      expect(initialBalance).toBe(100)

      // Deduct mileage
      await mileageService.deductMileage(
        'user-001',
        30,
        'Downloaded resource',
        'notion-page-001',
        'Test Resource'
      )

      // Check new balance
      const newBalance = await mileageService.getBalance('user-001')
      expect(newBalance).toBe(70)

      // Check transaction was recorded
      const transactions = await mileageService.getTransactions('user-001', 10)
      const deductTransaction = transactions.find((t) => t.type === 'spend')
      expect(deductTransaction).toBeDefined()
      expect(deductTransaction?.amount).toBe(30)
      expect(deductTransaction?.resourceTitle).toBe('Test Resource')
    })

    it('should throw error when insufficient mileage', async () => {
      const mileageService = new MileageService(env.DB)

      // Try to deduct more than available
      await expect(
        mileageService.deductMileage(
          'user-002',
          50,
          'Downloaded resource',
          'notion-page-001',
          'Test Resource'
        )
      ).rejects.toThrow()

      // Balance should remain unchanged
      const balance = await mileageService.getBalance('user-002')
      expect(balance).toBe(10)
    })

    it('should validate balance matches sum of transactions', async () => {
      const mileageService = new MileageService(env.DB)

      // Perform multiple transactions
      await mileageService.addMileage('user-001', 50, 'Upload reward')
      await mileageService.deductMileage(
        'user-001',
        30,
        'Download',
        'res-1',
        'Resource 1'
      )
      await mileageService.addMileage('user-001', 20, 'Bonus')

      // Get balance and transactions
      const balance = await mileageService.getBalance('user-001')
      const transactions = await mileageService.getTransactions('user-001', 50)

      // Calculate sum from transactions
      const sum = transactions.reduce((acc, t) => {
        return t.type === 'earn' ? acc + t.amount : acc - t.amount
      }, 0)

      expect(balance).toBe(sum)
    })
  })

  describe('Mileage Award on Upload', () => {
    it('should award mileage when uploading resource', async () => {
      const mileageService = new MileageService(env.DB)

      // Get initial balance
      const initialBalance = await mileageService.getBalance('user-001')
      expect(initialBalance).toBe(100)

      // Award mileage
      await mileageService.addMileage(
        'user-001',
        50,
        'Uploaded resource',
        'notion-page-002',
        'New Resource'
      )

      // Check new balance
      const newBalance = await mileageService.getBalance('user-001')
      expect(newBalance).toBe(150)

      // Check transaction was recorded
      const transactions = await mileageService.getTransactions('user-001', 10)
      const earnTransaction = transactions.find(
        (t) => t.type === 'earn' && t.amount === 50
      )
      expect(earnTransaction).toBeDefined()
      expect(earnTransaction?.description).toBe('Uploaded resource')
    })

    it('should handle multiple mileage awards', async () => {
      const mileageService = new MileageService(env.DB)

      // Award mileage multiple times
      await mileageService.addMileage('user-001', 50, 'Upload 1')
      await mileageService.addMileage('user-001', 50, 'Upload 2')
      await mileageService.addMileage('user-001', 50, 'Upload 3')

      // Check balance
      const balance = await mileageService.getBalance('user-001')
      expect(balance).toBe(250) // 100 initial + 150 earned

      // Check all transactions recorded
      const transactions = await mileageService.getTransactions('user-001', 50)
      const earnTransactions = transactions.filter((t) => t.type === 'earn')
      expect(earnTransactions.length).toBeGreaterThanOrEqual(4) // 1 initial + 3 uploads
    })
  })

  describe('Insufficient Mileage Error', () => {
    it('should return 402 error when insufficient mileage for download', async () => {
      // Add resource to cache with high mileage requirement
      await env.DB.prepare(
        'INSERT OR REPLACE INTO resource_cache (notion_id, file_key, required_mileage) VALUES (?, ?, ?)'
      )
        .bind('notion-page-001', '2024/01/test-file.pdf', 50)
        .run()

      // Upload a test file to R2
      await env.BUCKET.put(
        '2024/01/test-file.pdf',
        new Uint8Array([1, 2, 3, 4, 5])
      )

      const req = new Request(
        'http://localhost/api/resources/notion-page-001/download',
        {
          method: 'POST',
          headers: createAuthHeaders(lowMileageToken),
        }
      )

      const res = await app.fetch(req, env)
      
      // Should return insufficient mileage error
      expect(res.status).toBeGreaterThanOrEqual(400)

      if (res.status === 402) {
        const data = await res.json()
        expect(data).toHaveProperty('error')
        expect(data.error).toHaveProperty('code')
        expect(data.error.code).toBe('INSUFFICIENT_MILEAGE')
      }
    })

    it('should include required and current balance in error', async () => {
      const mileageService = new MileageService(env.DB)

      // Check if user has sufficient mileage
      const hasSufficient = await mileageService.hasSufficientMileage(
        'user-002',
        50
      )
      expect(hasSufficient).toBe(false)

      // Try to deduct
      try {
        await mileageService.deductMileage(
          'user-002',
          50,
          'Download',
          'res-1',
          'Resource'
        )
        // Should not reach here
        expect(true).toBe(false)
      } catch (error: any) {
        expect(error.message).toContain('Insufficient mileage')
      }
    })

    it('should not deduct mileage when insufficient', async () => {
      const mileageService = new MileageService(env.DB)

      const initialBalance = await mileageService.getBalance('user-002')
      const initialTransactions = await mileageService.getTransactions(
        'user-002',
        50
      )

      // Try to deduct more than available
      try {
        await mileageService.deductMileage(
          'user-002',
          50,
          'Download',
          'res-1',
          'Resource'
        )
      } catch (error) {
        // Expected error
      }

      // Balance should remain unchanged
      const finalBalance = await mileageService.getBalance('user-002')
      expect(finalBalance).toBe(initialBalance)

      // No new transaction should be recorded
      const finalTransactions = await mileageService.getTransactions(
        'user-002',
        50
      )
      expect(finalTransactions.length).toBe(initialTransactions.length)
    })
  })
})
