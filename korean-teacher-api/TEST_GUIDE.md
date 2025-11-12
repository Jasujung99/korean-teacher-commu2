# Local Testing Guide

This guide explains how to test the Korean Teacher API locally.

## Prerequisites

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   - Copy `.dev.vars.example` to `.dev.vars`
   - Fill in your actual values for Notion API, GitHub OAuth, etc.

3. Set up local database:
   ```bash
   npx wrangler d1 execute DB --local --file=./schema.sql
   npx wrangler d1 execute DB --local --file=./seed.sql
   ```

## Running the Dev Server

Start the local development server:

```bash
npm run dev
```

The API will be available at `http://localhost:8787`

## Running Test Scripts

### Windows (PowerShell)

```powershell
.\test-local.ps1
```

### Linux/Mac (Bash)

```bash
chmod +x test-local.sh
./test-local.sh
```

## Test Coverage

The test scripts cover the following endpoints:

### Public Endpoints
- ✓ `GET /api/health` - Health check
- ✓ `GET /api/resources` - List approved resources
- ✓ `GET /api/resources?category=X&level=Y` - Filtered resources

### Authenticated Endpoints (requires JWT token)
- ✓ `GET /api/auth/me` - Get current user
- ✓ `GET /api/users/me/mileage` - Get mileage balance and transactions
- ✓ `POST /api/resources/:id/download` - Download resource
- ⚠ `POST /api/resources/upload` - Upload resource (manual test required)

### Admin Endpoints (requires admin JWT token)
- ✓ `GET /api/admin/resources/pending` - List pending resources
- ✓ `POST /api/admin/resources/:id/approve` - Approve resource
- ✓ `POST /api/admin/resources/:id/reject` - Reject resource

## Manual Testing with Tokens

To test authenticated endpoints, you need to obtain JWT tokens:

### Option 1: Use Test Database Users

The seed data includes test users:
- Regular user: `testuser` (user-001)
- Admin user: `adminuser` (admin-001)
- Low mileage user: `lowmileageuser` (user-002)

You can generate tokens for these users using the AuthService or by implementing a test token endpoint.

### Option 2: Set Tokens in Test Scripts

Edit the test script and set the token variables:

**PowerShell:**
```powershell
$TOKEN = "your-jwt-token-here"
$ADMIN_TOKEN = "your-admin-jwt-token-here"
```

**Bash:**
```bash
TOKEN="your-jwt-token-here"
ADMIN_TOKEN="your-admin-jwt-token-here"
```

## Manual Testing with curl

### Health Check
```bash
curl http://localhost:8787/api/health
```

### Get Resources
```bash
curl http://localhost:8787/api/resources
```

### Get Current User (with auth)
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8787/api/auth/me
```

### Download Resource (with auth)
```bash
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8787/api/resources/notion-page-001/download
```

### Upload Resource (with auth)
```bash
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/file.pdf" \
  -F "title=Test Resource" \
  -F "description=Test Description" \
  -F "category=문법" \
  -F "level=초급" \
  -F "requiredMileage=30" \
  -F "copyrightConfirmed=true" \
  -F "license=CC BY-SA 4.0" \
  http://localhost:8787/api/resources/upload
```

### Approve Resource (admin)
```bash
curl -X POST -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  http://localhost:8787/api/admin/resources/notion-page-001/approve
```

### Reject Resource (admin)
```bash
curl -X POST -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason":"Not suitable for platform"}' \
  http://localhost:8787/api/admin/resources/notion-page-002/reject
```

## Testing with Postman/Insomnia

You can import the following collection structure:

1. Create environment variables:
   - `base_url`: `http://localhost:8787`
   - `token`: Your JWT token
   - `admin_token`: Your admin JWT token

2. Create requests for each endpoint listed above

## Troubleshooting

### Database Not Found
Run the migration scripts:
```bash
npx wrangler d1 execute DB --local --file=./schema.sql
npx wrangler d1 execute DB --local --file=./seed.sql
```

### Notion API Errors
- Check your `NOTION_API_KEY` in `.dev.vars`
- Verify `NOTION_DATABASE_ID` is correct
- Ensure your Notion integration has access to the database

### R2 Bucket Errors
- R2 buckets may not work fully in local development
- Consider mocking R2 operations for local testing
- Use `wrangler dev --remote` to test with actual R2 bucket

### GitHub OAuth Errors
- Ensure `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are set
- Verify your GitHub OAuth app callback URL includes `http://localhost:8787`

## Next Steps

After local testing is successful:

1. Deploy to Cloudflare Workers:
   ```bash
   npm run deploy
   ```

2. Set production secrets:
   ```bash
   npx wrangler secret put JWT_SECRET
   npx wrangler secret put NOTION_API_KEY
   npx wrangler secret put GITHUB_CLIENT_SECRET
   ```

3. Run migrations on production database:
   ```bash
   npx wrangler d1 execute DB --remote --file=./schema.sql
   ```
