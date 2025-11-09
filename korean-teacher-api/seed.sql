-- Korean Teacher API Seed Data
-- Test data for local development

-- ============================================
-- Test Users
-- ============================================

-- Regular user with initial mileage
INSERT INTO users (id, github_id, username, email, avatar_url, role, mileage, created_at, updated_at)
VALUES (
  'user-001',
  '12345678',
  'testuser',
  'testuser@example.com',
  'https://avatars.githubusercontent.com/u/12345678',
  'user',
  100,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Admin user with higher mileage
INSERT INTO users (id, github_id, username, email, avatar_url, role, mileage, created_at, updated_at)
VALUES (
  'admin-001',
  '87654321',
  'adminuser',
  'admin@example.com',
  'https://avatars.githubusercontent.com/u/87654321',
  'admin',
  500,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- User with low mileage for testing insufficient balance
INSERT INTO users (id, github_id, username, email, avatar_url, role, mileage, created_at, updated_at)
VALUES (
  'user-002',
  '11111111',
  'lowmileageuser',
  'lowmileage@example.com',
  'https://avatars.githubusercontent.com/u/11111111',
  'user',
  10,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- ============================================
-- Test Mileage Transactions
-- ============================================

-- Initial onboarding mileage for testuser
INSERT INTO mileage_transactions (id, user_id, type, amount, description, resource_id, resource_title, created_at)
VALUES (
  'txn-001',
  'user-001',
  'earn',
  100,
  'Initial onboarding mileage',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
);

-- Upload reward for testuser
INSERT INTO mileage_transactions (id, user_id, type, amount, description, resource_id, resource_title, created_at)
VALUES (
  'txn-002',
  'user-001',
  'earn',
  50,
  'Resource upload reward',
  'notion-page-001',
  'Korean Grammar Worksheet',
  CURRENT_TIMESTAMP
);

-- Download deduction for testuser
INSERT INTO mileage_transactions (id, user_id, type, amount, description, resource_id, resource_title, created_at)
VALUES (
  'txn-003',
  'user-001',
  'spend',
  -30,
  'Resource download',
  'notion-page-002',
  'Vocabulary Flashcards',
  CURRENT_TIMESTAMP
);

-- Initial onboarding mileage for adminuser
INSERT INTO mileage_transactions (id, user_id, type, amount, description, resource_id, resource_title, created_at)
VALUES (
  'txn-004',
  'admin-001',
  'earn',
  100,
  'Initial onboarding mileage',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
);

-- Admin bonus
INSERT INTO mileage_transactions (id, user_id, type, amount, description, resource_id, resource_title, created_at)
VALUES (
  'txn-005',
  'admin-001',
  'earn',
  400,
  'Admin bonus',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
);

-- Initial onboarding mileage for lowmileageuser
INSERT INTO mileage_transactions (id, user_id, type, amount, description, resource_id, resource_title, created_at)
VALUES (
  'txn-006',
  'user-002',
  'earn',
  100,
  'Initial onboarding mileage',
  NULL,
  NULL,
  CURRENT_TIMESTAMP
);

-- Multiple downloads for lowmileageuser
INSERT INTO mileage_transactions (id, user_id, type, amount, description, resource_id, resource_title, created_at)
VALUES (
  'txn-007',
  'user-002',
  'spend',
  -30,
  'Resource download',
  'notion-page-003',
  'Reading Comprehension Pack',
  CURRENT_TIMESTAMP
);

INSERT INTO mileage_transactions (id, user_id, type, amount, description, resource_id, resource_title, created_at)
VALUES (
  'txn-008',
  'user-002',
  'spend',
  -30,
  'Resource download',
  'notion-page-004',
  'Listening Practice Audio',
  CURRENT_TIMESTAMP
);

INSERT INTO mileage_transactions (id, user_id, type, amount, description, resource_id, resource_title, created_at)
VALUES (
  'txn-009',
  'user-002',
  'spend',
  -30,
  'Resource download',
  'notion-page-005',
  'Writing Templates',
  CURRENT_TIMESTAMP
);

-- ============================================
-- Test Resource Cache
-- ============================================

-- Cached resource entries
INSERT INTO resource_cache (notion_id, file_key, required_mileage, cached_at)
VALUES (
  'notion-page-001',
  '2024/01/korean-grammar-worksheet-abc123.pdf',
  30,
  CURRENT_TIMESTAMP
);

INSERT INTO resource_cache (notion_id, file_key, required_mileage, cached_at)
VALUES (
  'notion-page-002',
  '2024/01/vocabulary-flashcards-def456.pdf',
  30,
  CURRENT_TIMESTAMP
);

INSERT INTO resource_cache (notion_id, file_key, required_mileage, cached_at)
VALUES (
  'notion-page-003',
  '2024/02/reading-comprehension-ghi789.pdf',
  30,
  CURRENT_TIMESTAMP
);

INSERT INTO resource_cache (notion_id, file_key, required_mileage, cached_at)
VALUES (
  'notion-page-004',
  '2024/02/listening-practice-jkl012.mp3',
  30,
  CURRENT_TIMESTAMP
);

INSERT INTO resource_cache (notion_id, file_key, required_mileage, cached_at)
VALUES (
  'notion-page-005',
  '2024/02/writing-templates-mno345.docx',
  30,
  CURRENT_TIMESTAMP
);
