import { Hono } from 'hono'
import { MileageService } from '../services/MileageService'
import { authMiddleware, getUser } from '../middleware/auth'
import { Env, Variables } from '../index'

const users = new Hono<{ Bindings: Env; Variables: Variables }>()

/**
 * GET /api/users/me/mileage
 * Get current user's mileage balance and transaction history
 * Requires: Authentication
 * 
 * Response:
 *   {
 *     balance: number,
 *     transactions: Transaction[]
 *   }
 */
users.get('/me/mileage', authMiddleware, async (c) => {
  const user = getUser(c)

  // Initialize MileageService
  const mileageService = new MileageService(c.env.DB)

  // Fetch current mileage balance
  const balance = await mileageService.getBalance(user.userId)

  // Fetch last 50 transactions
  const transactions = await mileageService.getTransactions(user.userId, 50)

  return c.json({
    balance,
    transactions
  })
})

export default users
