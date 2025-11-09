# Requirements Document

## Introduction

이 문서는 한국어 교사 커뮤니티 플랫폼을 위한 Cloudflare Workers 기반 서버리스 백엔드 시스템의 요구사항을 정의합니다. 백엔드는 인증, 자료실 관리, 마일리지 시스템, 관리자 기능을 제공하며, Notion을 CMS로 사용하고 R2를 파일 스토리지로 활용합니다.

## Glossary

- **Backend System**: Cloudflare Workers 환경에서 실행되는 서버리스 API 시스템
- **User**: 플랫폼에 가입한 한국어 교사
- **Admin**: 자료 승인 권한을 가진 관리자
- **Resource**: 사용자가 업로드한 교육 자료 (PDF, 문서 등)
- **Mileage**: 자료 다운로드에 사용되는 가상 포인트
- **Notion Database**: 자료 메타데이터를 저장하는 Notion 데이터베이스
- **R2 Bucket**: Cloudflare R2에 저장된 파일 스토리지
- **JWT Token**: 사용자 인증을 위한 JSON Web Token
- **KV Store**: Cloudflare KV를 사용한 캐시 저장소
- **D1 Database**: Cloudflare D1 SQLite 데이터베이스

## Requirements

### Requirement 1

**User Story:** As a User, I want to authenticate using my GitHub account, so that I can securely access the platform

#### Acceptance Criteria

1. WHEN a User initiates GitHub OAuth login, THE Backend System SHALL redirect the User to GitHub authorization page
2. WHEN GitHub returns an authorization code, THE Backend System SHALL exchange the code for a GitHub access token
3. WHEN the Backend System receives a valid GitHub access token, THE Backend System SHALL create or retrieve the User record from D1 Database
4. WHEN the Backend System creates a User session, THE Backend System SHALL generate a JWT Token with 7 days expiration
5. WHEN the Backend System generates a JWT Token, THE Backend System SHALL return the token and User profile to the client

### Requirement 2

**User Story:** As a User, I want to browse approved resources, so that I can find teaching materials for my classes

#### Acceptance Criteria

1. WHEN a User requests the resource list, THE Backend System SHALL query the Notion Database for resources with status "승인"
2. WHEN the Backend System queries the Notion Database, THE Backend System SHALL cache the results in KV Store for 5 minutes
3. WHEN the Backend System returns resource data, THE Backend System SHALL include title, description, category, level, required mileage, and file size
4. WHEN a User requests resources with pagination, THE Backend System SHALL return up to 20 resources per page with next cursor
5. WHEN the Backend System encounters a Notion API rate limit, THE Backend System SHALL retry with exponential backoff up to 3 attempts

### Requirement 3

**User Story:** As a User, I want to download resources using my mileage, so that I can access teaching materials

#### Acceptance Criteria

1. WHEN a User requests a resource download, THE Backend System SHALL verify the User has a valid JWT Token
2. WHEN the Backend System verifies the User, THE Backend System SHALL check the User mileage balance in D1 Database
3. IF the User mileage is less than the required mileage, THEN THE Backend System SHALL return an error with status code 402
4. WHEN the User has sufficient mileage, THE Backend System SHALL deduct the required mileage from the User balance
5. WHEN the Backend System deducts mileage, THE Backend System SHALL generate a signed R2 download URL with 600 seconds expiration
6. WHEN the Backend System generates a download URL, THE Backend System SHALL increment the download count in Notion Database

### Requirement 4

**User Story:** As a User, I want to upload resources to the library, so that I can share my teaching materials with other teachers

#### Acceptance Criteria

1. WHEN a User uploads a file, THE Backend System SHALL verify the User has a valid JWT Token
2. WHEN the Backend System receives a file upload, THE Backend System SHALL validate the file size is less than 100MB
3. WHEN the Backend System validates the file, THE Backend System SHALL generate a unique file key with format "YYYY/MM/original-filename-{uuid}.ext"
4. WHEN the Backend System generates a file key, THE Backend System SHALL upload the file to R2 Bucket
5. WHEN the Backend System uploads to R2 Bucket, THE Backend System SHALL create a new entry in Notion Database with status "대기"
6. WHEN the Backend System creates a Notion entry, THE Backend System SHALL award 50 mileage to the User

### Requirement 5

**User Story:** As an Admin, I want to approve or reject pending resources, so that I can maintain content quality

#### Acceptance Criteria

1. WHEN an Admin requests pending resources, THE Backend System SHALL verify the Admin role from JWT Token
2. WHEN the Backend System verifies Admin role, THE Backend System SHALL query Notion Database for resources with status "대기"
3. WHEN an Admin approves a resource, THE Backend System SHALL update the Notion Database status to "승인"
4. WHEN an Admin rejects a resource, THE Backend System SHALL update the Notion Database status to "거절"
5. WHEN the Backend System updates resource status, THE Backend System SHALL invalidate the resource list cache in KV Store

### Requirement 6

**User Story:** As a User, I want to view my mileage balance and transaction history, so that I can track my points

#### Acceptance Criteria

1. WHEN a User requests mileage information, THE Backend System SHALL verify the User has a valid JWT Token
2. WHEN the Backend System verifies the User, THE Backend System SHALL query the current mileage balance from D1 Database
3. WHEN the Backend System queries mileage, THE Backend System SHALL retrieve the last 50 transactions from D1 Database
4. WHEN the Backend System returns transaction history, THE Backend System SHALL include transaction type, amount, resource title, and timestamp
5. WHEN the Backend System calculates mileage, THE Backend System SHALL ensure the balance matches the sum of all transactions

### Requirement 7

**User Story:** As the Backend System, I want to handle errors gracefully, so that users receive helpful error messages

#### Acceptance Criteria

1. WHEN the Backend System encounters an authentication error, THE Backend System SHALL return status code 401 with error message
2. WHEN the Backend System encounters insufficient mileage, THE Backend System SHALL return status code 402 with current balance
3. WHEN the Backend System encounters a Notion API error, THE Backend System SHALL log the error and return status code 503
4. WHEN the Backend System encounters an R2 storage error, THE Backend System SHALL log the error and return status code 500
5. WHEN the Backend System returns an error response, THE Backend System SHALL include error code, message, and timestamp

### Requirement 8

**User Story:** As a Developer, I want to test the API locally, so that I can develop features efficiently

#### Acceptance Criteria

1. THE Backend System SHALL support local development using Wrangler dev command
2. WHEN running locally, THE Backend System SHALL use local D1 Database instance
3. WHEN running locally, THE Backend System SHALL accept environment variables from .dev.vars file
4. THE Backend System SHALL provide CORS headers for local frontend development on port 5173
5. THE Backend System SHALL log all API requests and responses in development mode

### Requirement 9

**User Story:** As a User, I want the API to respond quickly, so that I have a smooth experience

#### Acceptance Criteria

1. WHEN the Backend System serves cached resource lists, THE Backend System SHALL respond within 50 milliseconds
2. WHEN the Backend System queries Notion Database, THE Backend System SHALL respond within 2 seconds
3. WHEN the Backend System generates R2 download URLs, THE Backend System SHALL respond within 500 milliseconds
4. WHEN the Backend System processes file uploads, THE Backend System SHALL accept files up to 100MB within 30 seconds
5. THE Backend System SHALL implement rate limiting of 100 requests per minute per User

### Requirement 10

**User Story:** As a System Administrator, I want to monitor API health, so that I can ensure system reliability

#### Acceptance Criteria

1. THE Backend System SHALL expose a health check endpoint at /api/health
2. WHEN the health check endpoint is called, THE Backend System SHALL verify D1 Database connectivity by executing a test query
3. WHEN the health check endpoint is called, THE Backend System SHALL verify KV Store connectivity by performing a test read operation
4. WHEN the health check endpoint is called, THE Backend System SHALL verify R2 Bucket connectivity by checking bucket accessibility
5. WHEN all services are healthy, THE Backend System SHALL return status code 200 with individual service status and response times
