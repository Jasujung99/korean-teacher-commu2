-- Mileage transactions table
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
