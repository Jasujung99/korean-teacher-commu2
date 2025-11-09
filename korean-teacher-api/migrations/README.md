# Database Migrations

This directory contains individual migration files for the Korean Teacher API D1 database.

## Migration Files

- `0001_users_table.sql` - Creates the users table with GitHub OAuth data
- `0002_mileage_transactions_table.sql` - Creates the mileage transactions table
- `0003_resource_cache_table.sql` - Creates the resource cache table

## Usage

### Local Development

To set up the database locally, use the combined schema file:

```bash
# Run the complete schema
wrangler d1 execute korean-teacher-db --local --file=./schema.sql

# Seed with test data
wrangler d1 execute korean-teacher-db --local --file=./seed.sql
```

### Production

For production deployment:

```bash
# Create the database (first time only)
wrangler d1 create korean-teacher-db

# Run migrations
wrangler d1 execute korean-teacher-db --file=./schema.sql
```

### Individual Migrations

If you need to run migrations individually:

```bash
wrangler d1 execute korean-teacher-db --local --file=./migrations/0001_users_table.sql
wrangler d1 execute korean-teacher-db --local --file=./migrations/0002_mileage_transactions_table.sql
wrangler d1 execute korean-teacher-db --local --file=./migrations/0003_resource_cache_table.sql
```

## Schema Overview

### Users Table
- Stores user authentication data from GitHub OAuth
- Tracks user role (user/admin) and mileage balance
- Indexed on github_id and email for fast lookups

### Mileage Transactions Table
- Records all mileage earning and spending activities
- Maintains transaction history for auditing
- Foreign key relationship with users table

### Resource Cache Table
- Caches resource metadata from Notion
- Maps Notion page IDs to R2 file keys
- Indexed on file_key for quick lookups
