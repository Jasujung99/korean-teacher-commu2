# Deployment Guide

This guide covers deploying the Korean Teacher API to Cloudflare Workers in production.

## Prerequisites

- Cloudflare account with Workers enabled
- Wrangler CLI installed (`npm install -g wrangler`)
- Authenticated with Wrangler (`wrangler login`)
- GitHub OAuth app created (for authentication)
- Notion integration created with API key

## Production Secrets Setup

Secrets are sensitive values that should never be committed to version control. Cloudflare Workers stores secrets securely and makes them available as environment variables at runtime.

### Setting Secrets

Use the `wrangler secret put` command to set each secret. You'll be prompted to enter the value securely:

#### 1. JWT_SECRET

This secret is used to sign and verify JWT authentication tokens.

```bash
wrangler secret put JWT_SECRET
```

**Recommended value**: Generate a strong random string (at least 32 characters). You can use:

```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

#### 2. NOTION_API_KEY

Your Notion integration API key for accessing the resource database.

```bash
wrangler secret put NOTION_API_KEY
```

**How to get this value**:
1. Go to https://www.notion.so/my-integrations
2. Create a new integration or use an existing one
3. Copy the "Internal Integration Token" (starts with `secret_`)
4. Make sure the integration has access to your resource database

#### 3. GITHUB_CLIENT_SECRET

Your GitHub OAuth app client secret for user authentication.

```bash
wrangler secret put GITHUB_CLIENT_SECRET
```

**How to get this value**:
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Select your OAuth app (or create a new one)
3. Copy the "Client Secret"
4. Set the Authorization callback URL to: `https://your-domain.com/auth/callback`

### Verifying Secrets

To list all secrets (without showing their values):

```bash
wrangler secret list
```

### Updating Secrets

To update a secret, simply run the `put` command again with the same secret name:

```bash
wrangler secret put JWT_SECRET
```

### Deleting Secrets

If you need to remove a secret:

```bash
wrangler secret delete SECRET_NAME
```

### Environment-Specific Secrets

For staging or preview environments, you can specify the environment:

```bash
wrangler secret put JWT_SECRET --env staging
```

## Public Environment Variables

Non-sensitive configuration values are set in `wrangler.toml` under the `[vars]` section:

```toml
[vars]
ENVIRONMENT = "production"
NOTION_DATABASE_ID = "your-notion-database-id"
GITHUB_CLIENT_ID = "your-github-client-id"
```

**Update these values** in `wrangler.toml` before deploying:

- `NOTION_DATABASE_ID`: The ID of your Notion database (found in the database URL)
- `GITHUB_CLIENT_ID`: Your GitHub OAuth app client ID (public value)

## Security Best Practices

1. **Never commit secrets** to version control
2. **Rotate secrets regularly** (every 90 days recommended)
3. **Use different secrets** for development and production
4. **Limit access** to production secrets to authorized team members only
5. **Monitor secret usage** through Cloudflare dashboard logs
6. **Use strong random values** for JWT_SECRET (minimum 32 characters)

## Next Steps

After setting up secrets, proceed to [Deployment Process](#deployment-process) to create resources and deploy the API.


## Deployment Process

Follow these steps to deploy the Korean Teacher API to Cloudflare Workers.

### Step 1: Create Cloudflare Resources

Before deploying, you need to create the required Cloudflare resources: D1 database, KV namespace, and R2 bucket.

#### Create D1 Database

D1 is Cloudflare's serverless SQL database. Create the production database:

```bash
wrangler d1 create korean-teacher-db
```

This will output something like:

```
✅ Successfully created DB 'korean-teacher-db'

[[d1_databases]]
binding = "DB"
database_name = "korean-teacher-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**Copy the `database_id`** and update it in `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "korean-teacher-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  # Replace with your ID
```

#### Create KV Namespace

KV is used for caching resource lists and other temporary data:

```bash
wrangler kv:namespace create CACHE
```

This will output:

```
✅ Successfully created KV namespace

[[kv_namespaces]]
binding = "CACHE"
id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

**Copy the `id`** and update it in `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "CACHE"
id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"  # Replace with your ID
preview_id = "your-preview-kv-id"  # Optional: create preview namespace for testing
```

For preview/testing environment:

```bash
wrangler kv:namespace create CACHE --preview
```

#### Create R2 Bucket

R2 is used for storing uploaded resource files:

```bash
wrangler r2 bucket create korean-teacher-resources
```

This will output:

```
✅ Created bucket 'korean-teacher-resources'
```

Update `wrangler.toml`:

```toml
[[r2_buckets]]
binding = "BUCKET"
bucket_name = "korean-teacher-resources"
preview_bucket_name = "korean-teacher-resources-preview"  # Optional: for testing
```

For preview/testing environment:

```bash
wrangler r2 bucket create korean-teacher-resources-preview
```

### Step 2: Run Database Migrations

After creating the D1 database, you need to initialize it with the schema:

```bash
# Run the schema migration
wrangler d1 execute korean-teacher-db --remote --file=./schema.sql
```

**Important**: Use `--remote` flag for production database. The `--local` flag is only for local development.

Verify the migration succeeded:

```bash
wrangler d1 execute korean-teacher-db --remote --command="SELECT name FROM sqlite_master WHERE type='table';"
```

You should see tables: `users`, `mileage_transactions`, `resource_cache`

### Step 3: Update Configuration

Ensure your `wrangler.toml` has all the correct values:

```toml
name = "korean-teacher-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

# KV namespace for caching
[[kv_namespaces]]
binding = "CACHE"
id = "your-actual-kv-id"  # Update this
preview_id = "your-preview-kv-id"  # Optional

# D1 database for users and mileage
[[d1_databases]]
binding = "DB"
database_name = "korean-teacher-db"
database_id = "your-actual-database-id"  # Update this

# R2 bucket for file storage
[[r2_buckets]]
binding = "BUCKET"
bucket_name = "korean-teacher-resources"
preview_bucket_name = "korean-teacher-resources-preview"  # Optional

# Environment variables (non-sensitive)
[vars]
ENVIRONMENT = "production"
NOTION_DATABASE_ID = "your-notion-database-id"  # Update this
GITHUB_CLIENT_ID = "your-github-client-id"  # Update this
```

### Step 4: Deploy to Production

Once all resources are created and configured, deploy the Worker:

```bash
wrangler deploy
```

Or using npm script:

```bash
npm run deploy
```

This will:
1. Build your TypeScript code
2. Bundle all dependencies
3. Upload to Cloudflare Workers
4. Make your API live at `https://korean-teacher-api.<your-subdomain>.workers.dev`

### Step 5: Verify Deployment

Test the health check endpoint to verify everything is working:

```bash
curl https://korean-teacher-api.<your-subdomain>.workers.dev/api/health
```

Expected response:

```json
{
  "status": "healthy",
  "services": {
    "d1": { "status": "up", "responseTime": 5 },
    "kv": { "status": "up", "responseTime": 2 },
    "r2": { "status": "up", "responseTime": 3 }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Step 6: Set Up Custom Domain (Optional)

To use a custom domain instead of `workers.dev`:

1. Go to Cloudflare Dashboard → Workers & Pages → your worker
2. Click "Triggers" tab
3. Click "Add Custom Domain"
4. Enter your domain (e.g., `api.korean-teacher.com`)
5. Cloudflare will automatically configure DNS

Update your frontend to use the custom domain in API calls.

## Deployment Checklist

Before deploying to production, verify:

- [ ] All secrets are set (`wrangler secret list`)
- [ ] D1 database created and migrated
- [ ] KV namespace created
- [ ] R2 bucket created
- [ ] `wrangler.toml` updated with correct IDs
- [ ] Public environment variables set in `wrangler.toml`
- [ ] GitHub OAuth callback URL updated to production domain
- [ ] Notion integration has access to the database
- [ ] Health check endpoint returns "healthy" status

## Updating the Deployment

To deploy updates after making code changes:

```bash
# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Deploy
wrangler deploy
```

Workers deployments are atomic and instant - no downtime during updates.

## Rolling Back

If you need to rollback to a previous version:

```bash
# View deployment history
wrangler deployments list

# Rollback to a specific deployment
wrangler rollback [deployment-id]
```

## Environment-Specific Deployments

For staging or preview environments, use named environments:

```toml
# In wrangler.toml
[env.staging]
name = "korean-teacher-api-staging"
vars = { ENVIRONMENT = "staging" }
```

Deploy to staging:

```bash
wrangler deploy --env staging
```

## Troubleshooting

### "Binding not found" errors

- Verify resource IDs in `wrangler.toml` match the created resources
- Run `wrangler d1 list`, `wrangler kv:namespace list`, `wrangler r2 bucket list` to check

### Database migration fails

- Ensure you're using `--remote` flag for production
- Check SQL syntax in `schema.sql`
- Verify database ID is correct

### Secrets not working

- Verify secrets are set: `wrangler secret list`
- Secrets are environment-specific - set them for each environment if using multiple

### Health check shows "degraded"

- Check individual service status in the response
- Verify each resource (D1, KV, R2) is properly configured
- Check Cloudflare dashboard for service status

## Monitoring and Logs

View real-time logs:

```bash
wrangler tail
```

View logs in Cloudflare Dashboard:
1. Go to Workers & Pages → your worker
2. Click "Logs" tab
3. View real-time logs and errors


## Monitoring Setup

After deployment, set up monitoring and alerting to ensure API reliability. See [MONITORING.md](./MONITORING.md) for detailed instructions.

### Quick Setup

1. **Configure Cloudflare Analytics**:
   - Go to Cloudflare Dashboard → Workers & Pages → korean-teacher-api → Metrics
   - Create custom dashboard with key metrics

2. **Set up Error Rate Alerts**:
   - Go to Cloudflare Dashboard → Notifications → Add
   - Configure alert for error rate > 5%
   - Add email/Slack notification

3. **Enable External Health Checks**:
   - Sign up for UptimeRobot or Pingdom
   - Add monitor for `https://your-api.workers.dev/api/health`
   - Configure alerts for downtime or degraded status

4. **Set up Real-Time Logging**:
   ```bash
   # Monitor logs in real-time
   wrangler tail
   
   # Filter errors only
   wrangler tail --status error
   ```

5. **Create Performance Dashboard**:
   - Track response times, error rates, and request volume
   - Set up alerts for performance degradation
   - Review metrics weekly

For complete monitoring setup instructions, see [MONITORING.md](./MONITORING.md).

---

## Additional Resources

- [API Documentation](./API.md) - Complete API reference
- [Monitoring Guide](./MONITORING.md) - Monitoring and alerting setup
- [Test Guide](./TEST_GUIDE.md) - Testing instructions
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Hono Framework Docs](https://hono.dev/)

