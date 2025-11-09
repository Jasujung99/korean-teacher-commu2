-- Resource cache table
-- Stores cached resource metadata for quick lookups
CREATE TABLE IF NOT EXISTS resource_cache (
  notion_id TEXT PRIMARY KEY,
  file_key TEXT NOT NULL,
  required_mileage INTEGER NOT NULL,
  cached_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for efficient file key lookups
CREATE INDEX IF NOT EXISTS idx_resource_cache_file_key ON resource_cache(file_key);
