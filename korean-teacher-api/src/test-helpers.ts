import { Miniflare } from 'miniflare'
import { Env } from './index'
import app from './index'

/**
 * Test helper to create a Miniflare instance for integration tests
 */
export async function createTestEnv(): Promise<Miniflare> {
  const mf = new Miniflare({
    script: '',
    modules: true,
    d1Databases: {
      DB: 'test-db',
    },
    kvNamespaces: {
      CACHE: 'test-cache',
    },
    r2Buckets: {
      BUCKET: 'test-bucket',
    },
    bindings: {
      JWT_SECRET: 'test-secret-key-for-testing-only',
      NOTION_API_KEY: 'secret_test_notion_key',
      NOTION_DATABASE_ID: 'test-database-id',
      GITHUB_CLIENT_ID: 'test-github-client-id',
      GITHUB_CLIENT_SECRET: 'test-github-client-secret',
      ENVIRONMENT: 'test',
    },
  })

  return mf
}

/**
 * Helper to get environment bindings from Miniflare
 */
export async function getTestBindings(mf: Miniflare): Promise<Env> {
  const db = await mf.getD1Database('DB')
  const kv = await mf.getKVNamespace('CACHE')
  const r2 = await mf.getR2Bucket('BUCKET')

  return {
    DB: db,
    CACHE: kv,
    BUCKET: r2,
    JWT_SECRET: 'test-secret-key-for-testing-only',
    NOTION_API_KEY: 'secret_test_notion_key',
    NOTION_DATABASE_ID: 'test-database-id',
    GITHUB_CLIENT_ID: 'test-github-client-id',
    GITHUB_CLIENT_SECRET: 'test-github-client-secret',
    ENVIRONMENT: 'test',
  }
}

/**
 * Helper to initialize test database with schema
 */
export async function initTestDatabase(db: D1Database): Promise<void> {
  // Create users table
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        github_id TEXT UNIQUE NOT NULL,
        username TEXT NOT NULL,
        email TEXT,
        avatar_url TEXT,
        role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
        mileage INTEGER DEFAULT 100,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    )
    .run()

  await db
    .prepare('CREATE INDEX IF NOT EXISTS idx_users_github_id ON users(github_id)')
    .run()

  await db
    .prepare('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)')
    .run()

  // Create mileage_transactions table
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS mileage_transactions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('earn', 'spend')),
        amount INTEGER NOT NULL,
        description TEXT NOT NULL,
        resource_id TEXT,
        resource_title TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`
    )
    .run()

  await db
    .prepare(
      'CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON mileage_transactions(user_id)'
    )
    .run()

  await db
    .prepare(
      'CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON mileage_transactions(created_at)'
    )
    .run()

  // Create resource_cache table
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS resource_cache (
        notion_id TEXT PRIMARY KEY,
        file_key TEXT NOT NULL,
        required_mileage INTEGER NOT NULL,
        cached_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    )
    .run()

  await db
    .prepare(
      'CREATE INDEX IF NOT EXISTS idx_resource_cache_file_key ON resource_cache(file_key)'
    )
    .run()
}

/**
 * Helper to seed test data
 */
export async function seedTestData(db: D1Database): Promise<void> {
  // Insert test users
  await db
    .prepare(
      `INSERT OR REPLACE INTO users (id, github_id, username, email, avatar_url, role, mileage)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      'user-001',
      '12345',
      'testuser',
      'test@example.com',
      'https://github.com/testuser.png',
      'user',
      100
    )
    .run()

  await db
    .prepare(
      `INSERT OR REPLACE INTO users (id, github_id, username, email, avatar_url, role, mileage)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      'admin-001',
      '67890',
      'adminuser',
      'admin@example.com',
      'https://github.com/adminuser.png',
      'admin',
      200
    )
    .run()

  await db
    .prepare(
      `INSERT OR REPLACE INTO users (id, github_id, username, email, avatar_url, role, mileage)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      'user-002',
      '11111',
      'lowmileageuser',
      'lowmileage@example.com',
      'https://github.com/lowmileageuser.png',
      'user',
      10
    )
    .run()

  // Insert initial mileage transactions
  await db
    .prepare(
      `INSERT OR REPLACE INTO mileage_transactions (id, user_id, type, amount, description)
       VALUES (?, ?, ?, ?, ?)`
    )
    .bind('tx-001', 'user-001', 'earn', 100, 'Initial onboarding mileage')
    .run()

  await db
    .prepare(
      `INSERT OR REPLACE INTO mileage_transactions (id, user_id, type, amount, description)
       VALUES (?, ?, ?, ?, ?)`
    )
    .bind('tx-002', 'admin-001', 'earn', 200, 'Initial admin mileage')
    .run()

  await db
    .prepare(
      `INSERT OR REPLACE INTO mileage_transactions (id, user_id, type, amount, description)
       VALUES (?, ?, ?, ?, ?)`
    )
    .bind('tx-003', 'user-002', 'earn', 10, 'Initial onboarding mileage')
    .run()
}

/**
 * Helper to clean up test database
 */
export async function cleanupTestDatabase(db: D1Database): Promise<void> {
  await db.prepare('DELETE FROM mileage_transactions').run()
  await db.prepare('DELETE FROM users').run()
  await db.prepare('DELETE FROM resource_cache').run()
}

/**
 * Helper to make authenticated requests
 */
export function createAuthHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}
