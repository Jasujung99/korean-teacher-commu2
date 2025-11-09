-- Korean Teacher API Database Schema
-- Combined migration script for D1 database

-- ============================================
-- Users table
-- ============================================
-- Stores user information from GitHub OAuth authentication
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  github_id TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
  mileage INTEGER DEFAULT 100,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_users_github_id ON users(github_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================
-- Mileage transactions table
-- ============================================
-- Tracks all mileage earning and spending activities
CREATE TABLE IF NOT EXISTS mileage_transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('earn', 'spend')),
  amount INTEGER NOT NULL,
  description TEXT NOT NULL,
  resource_id TEXT,
  resource_title TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON mileage_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON mileage_transactions(created_at);

-- ============================================
-- Resource cache table
-- ============================================
-- Stores cached resource metadata for quick lookups
CREATE TABLE IF NOT EXISTS resource_cache (
  notion_id TEXT PRIMARY KEY,
  file_key TEXT NOT NULL,
  required_mileage INTEGER NOT NULL,
  cached_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for efficient file key lookups
CREATE INDEX IF NOT EXISTS idx_resource_cache_file_key ON resource_cache(file_key);
