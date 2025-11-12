# Korean Teacher API - Cloudflare Workers Backend

Serverless backend API for the Korean Teacher Community Platform, built with Cloudflare Workers, Hono, and Notion.

## Tech Stack

- **Runtime**: Cloudflare Workers
- **Framework**: Hono
- **Database**: Cloudflare D1 (SQLite)
- **Cache**: Cloudflare KV
- **Storage**: Cloudflare R2
- **CMS**: Notion API
- **Language**: TypeScript

## Project Structure

```
korean-teacher-api/
├── src/
│   ├── routes/         # API route handlers
│   ├── middleware/     # Authentication, CORS, error handling
│   ├── services/       # Business logic (Notion, R2, Auth, Mileage)
│   ├── utils/          # Helper functions
│   └── index.ts        # Main application entry point
├── wrangler.toml       # Cloudflare Workers configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies and scripts
```

## Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Cloudflare account
- Wrangler CLI

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .dev.vars.example .dev.vars
```

3. Fill in your actual values in `.dev.vars`

### Local Development

Run the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:8787`

### Type Checking

Run TypeScript type checking:
```bash
npm run typecheck
```

## Deployment

### Setup Production Resources

1. Create D1 database:
```bash
wrangler d1 create korean-teacher-db
```

2. Create KV namespace:
```bash
wrangler kv:namespace create CACHE
```

3. Create R2 bucket:
```bash
wrangler r2 bucket create korean-teacher-resources
```

4. Update `wrangler.toml` with the generated IDs

### Set Production Secrets

```bash
wrangler secret put JWT_SECRET
wrangler secret put NOTION_API_KEY
wrangler secret put GITHUB_CLIENT_SECRET
```

### Deploy

```bash
npm run deploy
```

## Environment Variables

### Required Secrets (set via `wrangler secret put`)
- `JWT_SECRET` - Secret key for JWT token signing
- `NOTION_API_KEY` - Notion API integration key
- `GITHUB_CLIENT_SECRET` - GitHub OAuth client secret

### Public Variables (set in `wrangler.toml`)
- `ENVIRONMENT` - Environment name (development/production)
- `NOTION_DATABASE_ID` - Notion database ID
- `GITHUB_CLIENT_ID` - GitHub OAuth client ID

## Documentation

- **[API Documentation](./API.md)** - Complete API reference with endpoints, request/response examples, and error codes
- **[Deployment Guide](./DEPLOYMENT.md)** - Production deployment instructions, secrets setup, and resource configuration
- **[Monitoring Guide](./MONITORING.md)** - Monitoring, alerting, and performance tracking setup
- **[Test Guide](./TEST_GUIDE.md)** - Testing instructions and examples

## License

ISC
