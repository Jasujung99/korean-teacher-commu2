# Implementation Plan

- [x] 1. Set up Cloudflare Workers project structure





  - Create new Workers project using `npm create cloudflare@latest korean-teacher-api`
  - Install dependencies: hono, @notionhq/client, @cloudflare/workers-types
  - Configure wrangler.toml with D1, KV, R2 bindings
  - Set up TypeScript configuration
  - Create directory structure: src/routes, src/middleware, src/services, src/utils
  - _Requirements: 8.1, 8.3_

- [x] 2. Create D1 database schema and migrations






  - [x] 2.1 Write SQL schema for users table

    - Create users table with id, github_id, username, email, avatar_url, role, mileage (default 100), timestamps
    - Add indexes on github_id and email
    - _Requirements: 1.3, 6.1_
  
  - [x] 2.2 Write SQL schema for mileage_transactions table


    - Create mileage_transactions table with id, user_id, type, amount, description, resource_id, resource_title, created_at
    - Add indexes on user_id and created_at
    - Add foreign key constraint to users table
    - _Requirements: 6.3, 6.4_
  

  - [x] 2.3 Write SQL schema for resource_cache table

    - Create resource_cache table with notion_id, file_key, required_mileage, cached_at
    - Add index on file_key
    - _Requirements: 2.2_
  

  - [x] 2.4 Create migration script

    - Combine all schemas into schema.sql file
    - Create seed.sql with test data for local development
    - _Requirements: 8.2_

- [x] 3. Implement error handling system






  - [x] 3.1 Create error classes

    - Implement APIError base class with statusCode, code, message, details
    - Implement UnauthorizedError (401)
    - Implement ForbiddenError (403)
    - Implement InsufficientMileageError (402) with required and current balance
    - Implement NotFoundError (404)
    - Implement RateLimitError (429)
    - Implement ServiceUnavailableError (503) for Notion API errors
    - Implement StorageError (500) for R2 errors
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  

  - [x] 3.2 Create error handler middleware

    - Implement errorHandler function to catch and format errors
    - Return JSON error response with code, message, details, timestamp
    - Log errors to console
    - _Requirements: 7.5_

- [x] 4. Implement authentication service





  - [x] 4.1 Create AuthService class


    - Implement exchangeGitHubCode method to exchange OAuth code for access token
    - Implement getGitHubUser method to fetch user profile from GitHub API
    - Implement upsertUser method to create or update user in D1
    - Implement generateJWT method (expiration configurable via environment variable, default 7 days)
    - Implement verifyJWT method to validate tokens
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  
  - [x] 4.2 Create authentication middleware


    - Implement authMiddleware to verify JWT token from Authorization header
    - Extract and validate token
    - Attach user payload to context
    - Throw UnauthorizedError if token is invalid or missing
    - _Requirements: 3.1, 4.1_
  
  - [x] 4.3 Create admin middleware


    - Implement adminMiddleware to verify user has admin role
    - Check role from context user
    - Throw ForbiddenError if not admin
    - _Requirements: 5.1_
  
  - [x] 4.4 Implement auth routes


    - Create POST /api/auth/github endpoint to handle GitHub OAuth callback
    - Create GET /api/auth/me endpoint to return current user info
    - Return JWT token and user profile on successful login
    - _Requirements: 1.5_

- [x] 5. Implement Notion service




  - [x] 5.1 Create NotionService class


    - Initialize Notion client with API key and database ID
    - Implement formatResource method to transform Notion properties to Resource interface
    - _Requirements: 2.1_
  
  - [x] 5.2 Implement resource query methods


    - Implement getApprovedResources with pagination and filters (category, level)
    - Sort by upload date (업로드일) in descending order
    - Implement getResource to fetch single resource by ID
    - Implement getPendingResources for admin review
    - Apply Notion API filters for status "승인" and "대기"
    - _Requirements: 2.1, 5.2_
  
  - [x] 5.3 Implement resource mutation methods


    - Implement createResource to add new entry with status "대기"
    - Implement updateResourceStatus to change status to "승인" or "거절"
    - Implement incrementDownloadCount to update download counter
    - _Requirements: 4.5, 5.3, 5.4, 3.6_
  
  - [x] 5.4 Implement retry logic with exponential backoff


    - Create retryWithBackoff helper method
    - Retry up to 3 times on rate limit errors
    - Use exponential delay: 1s, 2s, 4s
    - _Requirements: 2.5_

- [x] 6. Implement R2 storage service





  - [x] 6.1 Create R2Service class


    - Initialize with R2 bucket binding
    - Implement generateFileKey method with format "YYYY/MM/original-filename-{uuid}.ext"
    - _Requirements: 4.3_
  
  - [x] 6.2 Implement file operations

    - Implement uploadFile method to store file in R2 with metadata
    - Implement getSignedUrl method to generate download URL with 600 seconds expiration
    - Implement fileExists method to check file presence
    - Implement deleteFile method for cleanup
    - _Requirements: 4.4, 3.5_

- [x] 7. Implement mileage service






  - [x] 7.1 Create MileageService class

    - Initialize with D1 database binding
    - _Requirements: 6.1_
  

  - [x] 7.2 Implement mileage query methods

    - Implement getBalance to fetch current user mileage from users table
    - Implement getTransactions to retrieve last 50 transactions
    - Implement hasSufficientMileage to check if user can afford download
    - _Requirements: 6.2, 6.3, 3.2_

  

  - [x] 7.3 Implement mileage transaction methods

    - Implement addMileage for earning points (uploads, rewards)
    - Implement deductMileage for spending points (downloads)
    - Implement executeTransaction helper to atomically update balance and insert transaction record
    - Use D1 transactions to ensure consistency
    - Ensure balance matches sum of all transactions (validate on each operation)
    - _Requirements: 3.4, 4.6, 6.5_

- [x] 8. Implement resource routes





  - [x] 8.1 Create GET /api/resources endpoint


    - Accept query parameters: page, limit (max 20 per page), category, level
    - Check KV cache first with key pattern "resources:approved:page:{page}:category:{category}:level:{level}"
    - If cache miss, query Notion via NotionService with descending sort by upload date
    - Store results in KV with 5-minute TTL
    - Return resource list with pagination cursor
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 9.1_
  
  - [x] 8.2 Create GET /api/resources/:id endpoint


    - Fetch single resource from Notion by page ID
    - Return resource details
    - _Requirements: 2.3_
  
  - [x] 8.3 Create POST /api/resources/:id/download endpoint


    - Apply authMiddleware to verify user
    - Check user mileage balance via MileageService
    - Throw InsufficientMileageError if balance too low
    - Deduct required mileage from user balance
    - Generate signed R2 download URL with 600 seconds expiration
    - Increment download count in Notion
    - Return download URL
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 9.3_
  
  - [x] 8.4 Create POST /api/resources/upload endpoint


    - Apply authMiddleware to verify user
    - Validate file size is less than 100MB
    - Generate unique file key using R2Service
    - Upload file to R2 bucket
    - Create Notion entry with status "대기"
    - Award 50 mileage to user via MileageService
    - Return resource ID and file key
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 9.4_

- [x] 9. Implement user routes






  - [x] 9.1 Create GET /api/users/me/mileage endpoint

    - Apply authMiddleware to verify user
    - Fetch current mileage balance from MileageService
    - Fetch last 50 transactions from MileageService
    - Return balance and transaction history
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 10. Implement admin routes





  - [x] 10.1 Create GET /api/admin/resources/pending endpoint


    - Apply authMiddleware and adminMiddleware
    - Query Notion for resources with status "대기"
    - Return pending resources list
    - _Requirements: 5.1, 5.2_
  
  - [x] 10.2 Create POST /api/admin/resources/:id/approve endpoint


    - Apply authMiddleware and adminMiddleware
    - Update Notion resource status to "승인"
    - Invalidate resource list cache in KV
    - Return success response
    - _Requirements: 5.1, 5.3, 5.5_
  
  - [x] 10.3 Create POST /api/admin/resources/:id/reject endpoint


    - Apply authMiddleware and adminMiddleware
    - Accept rejection reason in request body
    - Update Notion resource status to "거절"
    - Invalidate resource list cache in KV
    - Return success response
    - _Requirements: 5.1, 5.4, 5.5_

- [x] 11. Implement middleware and utilities




  - [x] 11.1 Create rate limit middleware


    - Implement rateLimitMiddleware to limit 100 requests per minute per user
    - Use KV to track request count with key "ratelimit:{userId}"
    - Set 60-second TTL on counter
    - Throw RateLimitError when limit exceeded
    - _Requirements: 9.5_
  
  - [x] 11.2 Create CORS middleware


    - Configure CORS for localhost:5173 and production domain
    - Allow GET, POST, PUT, DELETE, OPTIONS methods
    - Allow Content-Type and Authorization headers
    - Enable credentials
    - _Requirements: 8.4_
  
  - [x] 11.3 Create logging utility


    - Implement request/response logger for development mode
    - Log method, path, status code, duration
    - Only enable when ENVIRONMENT=development
    - _Requirements: 8.5_
  
  - [x] 11.4 Create performance monitoring


    - Track response times against targets: cached < 50ms, Notion < 2s, R2 < 500ms
    - Log slow requests for optimization
    - Add performance metrics to response headers in development mode
    - _Requirements: 9.1, 9.2, 9.3_

- [x] 12. Implement health check endpoint







  - [ ] 12.1 Create GET /api/health endpoint
    - Test D1 connectivity with SELECT 1 query
    - Test KV connectivity with test read operation
    - Test R2 connectivity with head operation
    - Measure response time for each service
    - Return status "healthy" if all services up, "degraded" otherwise
    - Always return 200 status code with service details
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 13. Wire up main application




  - [x] 13.1 Create main Hono app instance


    - Initialize Hono app
    - Apply CORS middleware
    - Apply error handler middleware
    - Apply logging middleware for development
    - _Requirements: 8.4, 8.5_
  
  - [x] 13.2 Register all routes


    - Mount auth routes at /api/auth
    - Mount resource routes at /api/resources
    - Mount user routes at /api/users
    - Mount admin routes at /api/admin
    - Mount health check at /api/health
    - Export app as default
    - _Requirements: All route requirements_

- [x] 14. Configure local development environment







  - [x] 14.1 Create wrangler.toml configuration

    - Configure D1 database binding
    - Configure KV namespace binding
    - Configure R2 bucket binding
    - Set compatibility_date and node_compat
    - _Requirements: 8.1_
  

  - [x] 14.2 Create .dev.vars file

    - Add JWT_SECRET for local development
    - Add NOTION_API_KEY
    - Add NOTION_DATABASE_ID
    - Add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET
    - Set ENVIRONMENT=development
    - _Requirements: 8.3_
  

  - [x] 14.3 Set up local database

    - Run D1 migrations locally: `wrangler d1 execute DB --local --file=./schema.sql`
    - Run seed data: `wrangler d1 execute DB --local --file=./seed.sql`
    - _Requirements: 8.2_
  

  - [x] 14.4 Create local test script

    - Create test-local.sh script with curl commands for all endpoints
    - Include authentication flow test
    - Include resource upload/download test
    - Include admin approval test
    - _Requirements: 8.5_

- [x] 15. Write integration tests (Required - Comprehensive approach)




  - [x] 15.1 Test authentication flow


    - Test POST /api/auth/github with valid code
    - Test GET /api/auth/me with valid token
    - Test authentication middleware with invalid token
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  
  - [x] 15.2 Test resource endpoints


    - Test GET /api/resources returns approved resources
    - Test GET /api/resources/:id returns resource details
    - Test POST /api/resources/:id/download requires authentication
    - Test POST /api/resources/:id/download deducts mileage
    - Test POST /api/resources/upload creates pending resource
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_
  
  - [x] 15.3 Test mileage system


    - Test GET /api/users/me/mileage returns balance and transactions
    - Test mileage deduction on download
    - Test mileage award on upload
    - Test insufficient mileage error
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 3.2, 3.3_
  
  - [x] 15.4 Test admin endpoints


    - Test GET /api/admin/resources/pending requires admin role
    - Test POST /api/admin/resources/:id/approve updates status
    - Test POST /api/admin/resources/:id/reject updates status
    - Test cache invalidation on approval/rejection
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [x] 15.5 Test health check


    - Test GET /api/health returns service status
    - Test health check with D1, KV, R2 connectivity
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 16. Create deployment documentation




  - [x] 16.1 Document production secrets setup


    - Document how to set JWT_SECRET via `wrangler secret put`
    - Document how to set NOTION_API_KEY
    - Document how to set GITHUB_CLIENT_SECRET
    - _Requirements: 8.1_
  
  - [x] 16.2 Document deployment process


    - Document D1 database creation and migration
    - Document KV namespace creation
    - Document R2 bucket creation
    - Document deployment command: `wrangler deploy`
    - _Requirements: 8.1_
  
  - [x] 16.3 Create API documentation


    - Document all endpoints with request/response examples
    - Document authentication flow
    - Document error codes and responses
    - _Requirements: All requirements_
  
  - [x] 16.4 Set up monitoring and alerting


    - Configure Cloudflare Analytics for API metrics
    - Set up error rate alerting
    - Create performance dashboard for response times
    - Document monitoring setup in deployment guide
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
