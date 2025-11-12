import { InsufficientMileageError } from '../utils/errors'

/**
 * Transaction interface for mileage history
 */
export interface Transaction {
  id: string
  userId: string
  type: 'earn' | 'spend'
  amount: number
  description: string
  resourceId: string | null
  resourceTitle: string | null
  createdAt: string
}

/**
 * MileageService handles all mileage-related operations
 * - Query user balance and transaction history
 * - Add mileage for uploads and rewards
 * - Deduct mileage for downloads
 * - Ensure atomic transactions and balance consistency
 */
export class MileageService {
  private db: D1Database

  constructor(db: D1Database) {
    this.db = db
  }

  /**
   * Get current mileage balance for a user
   * @param userId - User ID
   * @returns Current mileage balance
   */
  async getBalance(userId: string): Promise<number> {
    const result = await this.db
      .prepare('SELECT mileage FROM users WHERE id = ?')
      .bind(userId)
      .first<{ mileage: number }>()

    if (!result) {
      throw new Error('User not found')
    }

    return result.mileage
  }

  /**
   * Get transaction history for a user
   * @param userId - User ID
   * @param limit - Maximum number of transactions to retrieve (default: 50)
   * @returns Array of transactions ordered by most recent first
   */
  async getTransactions(userId: string, limit: number = 50): Promise<Transaction[]> {
    const results = await this.db
      .prepare(`
        SELECT id, user_id as userId, type, amount, description, 
               resource_id as resourceId, resource_title as resourceTitle, 
               created_at as createdAt
        FROM mileage_transactions
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT ?
      `)
      .bind(userId, limit)
      .all<Transaction>()

    return results.results || []
  }

  /**
   * Check if user has sufficient mileage for a purchase
   * @param userId - User ID
   * @param required - Required mileage amount
   * @returns True if user has sufficient mileage, false otherwise
   */
  async hasSufficientMileage(userId: string, required: number): Promise<boolean> {
    const balance = await this.getBalance(userId)
    return balance >= required
  }

  /**
   * Add mileage to user account (for uploads, rewards)
   * @param userId - User ID
   * @param amount - Amount of mileage to add
   * @param description - Description of the transaction
   * @param resourceId - Optional resource ID associated with the transaction
   * @param resourceTitle - Optional resource title associated with the transaction
   */
  async addMileage(
    userId: string,
    amount: number,
    description: string,
    resourceId?: string,
    resourceTitle?: string
  ): Promise<void> {
    await this.executeTransaction(
      userId,
      'earn',
      amount,
      description,
      resourceId,
      resourceTitle
    )
  }

  /**
   * Deduct mileage from user account (for downloads)
   * @param userId - User ID
   * @param amount - Amount of mileage to deduct
   * @param description - Description of the transaction
   * @param resourceId - Resource ID associated with the transaction
   * @param resourceTitle - Resource title associated with the transaction
   * @throws InsufficientMileageError if user doesn't have enough mileage
   */
  async deductMileage(
    userId: string,
    amount: number,
    description: string,
    resourceId: string,
    resourceTitle: string
  ): Promise<void> {
    // Check if user has sufficient mileage
    const currentBalance = await this.getBalance(userId)
    if (currentBalance < amount) {
      throw new InsufficientMileageError(amount, currentBalance)
    }

    await this.executeTransaction(
      userId,
      'spend',
      amount,
      description,
      resourceId,
      resourceTitle
    )
  }

  /**
   * Execute a mileage transaction atomically
   * Updates user balance and inserts transaction record in a single transaction
   * Validates that balance matches sum of all transactions
   * @param userId - User ID
   * @param type - Transaction type ('earn' or 'spend')
   * @param amount - Transaction amount
   * @param description - Transaction description
   * @param resourceId - Optional resource ID
   * @param resourceTitle - Optional resource title
   * @private
   */
  private async executeTransaction(
    userId: string,
    type: 'earn' | 'spend',
    amount: number,
    description: string,
    resourceId?: string,
    resourceTitle?: string
  ): Promise<void> {
    const transactionId = crypto.randomUUID()
    const now = new Date().toISOString()

    // Calculate new balance
    const currentBalance = await this.getBalance(userId)
    const newBalance = type === 'earn' ? currentBalance + amount : currentBalance - amount

    // Execute both operations in a batch for atomicity
    // D1 batch operations are atomic
    const batch = [
      // Update user balance
      this.db
        .prepare('UPDATE users SET mileage = ?, updated_at = ? WHERE id = ?')
        .bind(newBalance, now, userId),
      
      // Insert transaction record
      this.db
        .prepare(`
          INSERT INTO mileage_transactions 
          (id, user_id, type, amount, description, resource_id, resource_title, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(
          transactionId,
          userId,
          type,
          amount,
          description,
          resourceId || null,
          resourceTitle || null,
          now
        )
    ]

    await this.db.batch(batch)

    // Validate balance consistency
    await this.validateBalance(userId)
  }

  /**
   * Validate that user's balance matches the sum of all transactions
   * @param userId - User ID
   * @throws Error if balance is inconsistent
   * @private
   */
  private async validateBalance(userId: string): Promise<void> {
    // Get current balance from users table
    const currentBalance = await this.getBalance(userId)

    // Calculate expected balance from transactions
    // Initial balance is 100 (from user creation)
    const transactionSum = await this.db
      .prepare(`
        SELECT 
          COALESCE(SUM(CASE WHEN type = 'earn' THEN amount ELSE 0 END), 0) as earned,
          COALESCE(SUM(CASE WHEN type = 'spend' THEN amount ELSE 0 END), 0) as spent
        FROM mileage_transactions
        WHERE user_id = ?
      `)
      .bind(userId)
      .first<{ earned: number; spent: number }>()

    if (!transactionSum) {
      // No transactions yet, balance should be initial 100
      if (currentBalance !== 100) {
        throw new Error(`Balance inconsistency detected for user ${userId}`)
      }
      return
    }

    const expectedBalance = 100 + transactionSum.earned - transactionSum.spent

    if (Math.abs(currentBalance - expectedBalance) > 0.01) {
      throw new Error(
        `Balance inconsistency detected for user ${userId}. ` +
        `Current: ${currentBalance}, Expected: ${expectedBalance}`
      )
    }
  }
}
