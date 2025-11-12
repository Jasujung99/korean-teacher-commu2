# API Documentation

Complete API reference for the Korean Teacher Community Platform backend.

**Base URL**: `https://korean-teacher-api.<your-subdomain>.workers.dev/api`

## Table of Contents

- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Authentication Routes](#authentication-routes)
  - [Resource Routes](#resource-routes)
  - [User Routes](#user-routes)
  - [Admin Routes](#admin-routes)
  - [Health Check](#health-check)
- [Error Responses](#error-responses)
- [Rate Limiting](#rate-limiting)

## Authentication

The API uses JWT (JSON Web Token) for authentication. Most endpoints require a valid JWT token in the Authorization header.

### Authentication Flow

1. **User initiates GitHub OAuth login** on the frontend
2. **GitHub redirects back** with an authorization code
3. **Frontend sends code** to `POST /api/auth/github`
4. **Backend exchanges code** for GitHub access token
5. **Backend creates/updates user** in database
6. **Backend returns JWT token** (valid for 7 days)
7. **Frontend stores token** and includes it in subsequent requests

### Using the Token

Include the JWT token in the Authorization header for protected endpoints:

```
Authorization: Bearer <your-jwt-token>
```

### Token Expiration

Tokens expire after 7 days. When a token expires, the user must re-authenticate through GitHub OAuth.

---

## Endpoints

### Authentication Routes

#### POST /api/auth/github

Exchange GitHub OAuth code for JWT token and user profile.

**Request Body**:
```json
{
  "code": "github_oauth_code_here"
}
```

**Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "githubId": "12345678",
    "username": "johndoe",
    "email": "john@example.com",
    "avatarUrl": "https://avatars.githubusercontent.com/u/12345678",
    "mileage": 100
  }
}
```

**Error Responses**:
- `400 Bad Request`: Missing authorization code
- `401 Unauthorized`: Invalid GitHub code
- `503 Service Unavailable`: GitHub API unavailable

**Example**:
```bash
curl -X POST https://api.example.com/api/auth/github \
  -H "Content-Type: application/json" \
  -d '{"code": "abc123def456"}'
```

---

#### GET /api/auth/me

Get current authenticated user information.

**Authentication**: Required

**Response** (200 OK):
```json
{
  "user": {
    "id": "user_123",
    "username": "johndoe",
    "email": "john@example.com",
    "avatarUrl": "https://avatars.githubusercontent.com/u/12345678",
    "mileage": 150,
    "role": "user"
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: User not found

**Example**:
```bash
curl https://api.example.com/api/auth/me \
  -H "Authorization: Bearer <your-token>"
```

---

### Resource Routes

#### GET /api/resources

Get list of approved resources with pagination and filters.

**Query Parameters**:
- `page` (optional): Page number, default: 1
- `limit` (optional): Items per page, default: 20, max: 20
- `category` (optional): Filter by category (e.g., "문법", "어휘", "읽기")
- `level` (optional): Filter by level (e.g., "초급", "중급", "고급")

**Response** (200 OK):
```json
{
  "resources": [
    {
      "id": "notion_page_id_123",
      "title": "초급 문법 워크시트",
      "description": "초급 학습자를 위한 기본 문법 연습 자료",
      "fileKey": "2024/01/grammar-worksheet-uuid.pdf",
      "category": "문법",
      "level": "초급",
      "requiredMileage": 30,
      "fileSize": "2.5 MB",
      "uploadedBy": "teacher_kim",
      "uploadedAt": "2024-01-15T10:30:00.000Z",
      "views": 150,
      "downloads": 45
    }
  ],
  "hasMore": true,
  "nextCursor": "cursor_string_here"
}
```

**Caching**: Results are cached for 5 minutes in KV store.

**Example**:
```bash
# Get first page
curl https://api.example.com/api/resources

# Get second page with filters
curl "https://api.example.com/api/resources?page=2&category=문법&level=초급"
```

---

#### GET /api/resources/:id

Get detailed information about a specific resource.

**Path Parameters**:
- `id`: Notion page ID of the resource

**Response** (200 OK):
```json
{
  "resource": {
    "id": "notion_page_id_123",
    "title": "초급 문법 워크시트",
    "description": "초급 학습자를 위한 기본 문법 연습 자료",
    "fileKey": "2024/01/grammar-worksheet-uuid.pdf",
    "category": "문법",
    "level": "초급",
    "requiredMileage": 30,
    "fileSize": "2.5 MB",
    "uploadedBy": "teacher_kim",
    "uploadedAt": "2024-01-15T10:30:00.000Z",
    "views": 150,
    "downloads": 45
  }
}
```

**Error Responses**:
- `404 Not Found`: Resource not found
- `503 Service Unavailable`: Notion API unavailable

**Example**:
```bash
curl https://api.example.com/api/resources/notion_page_id_123
```

---

#### POST /api/resources/:id/download

Download a resource by deducting mileage and generating a signed download URL.

**Authentication**: Required

**Path Parameters**:
- `id`: Notion page ID of the resource

**Response** (200 OK):
```json
{
  "downloadUrl": "https://korean-teacher-resources.r2.cloudflarestorage.com/...",
  "expiresIn": 600
}
```

**Process**:
1. Verifies user authentication
2. Checks user has sufficient mileage
3. Deducts required mileage from user balance
4. Generates signed R2 URL (valid for 600 seconds / 10 minutes)
5. Increments download count in Notion
6. Returns download URL

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `402 Payment Required`: Insufficient mileage
- `404 Not Found`: Resource not found
- `503 Service Unavailable`: Notion API unavailable
- `500 Internal Server Error`: R2 storage error

**Example**:
```bash
curl -X POST https://api.example.com/api/resources/notion_page_id_123/download \
  -H "Authorization: Bearer <your-token>"
```

**Error Example** (Insufficient Mileage):
```json
{
  "error": {
    "code": "INSUFFICIENT_MILEAGE",
    "message": "Insufficient mileage. Required: 30, Current: 20",
    "details": {
      "required": 30,
      "current": 20
    },
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

---

#### POST /api/resources/upload

Upload a new resource file to the platform.

**Authentication**: Required

**Content-Type**: `multipart/form-data`

**Form Fields**:
- `file` (required): File to upload (max 100MB)
- `title` (required): Resource title
- `description` (required): Resource description
- `category` (required): Category (e.g., "문법", "어휘", "읽기")
- `level` (required): Difficulty level (e.g., "초급", "중급", "고급")
- `requiredMileage` (required): Mileage cost for download
- `copyrightConfirmed` (optional): Copyright confirmation
- `license` (optional): License type

**Response** (200 OK):
```json
{
  "resourceId": "notion_page_id_456",
  "fileKey": "2024/01/my-resource-uuid.pdf",
  "status": "pending"
}
```

**Process**:
1. Validates file size (max 100MB)
2. Generates unique file key with format: `YYYY/MM/filename-{uuid}.ext`
3. Uploads file to R2 bucket
4. Creates Notion entry with status "대기" (pending)
5. Awards 50 mileage to uploader
6. Returns resource ID and status

**Error Responses**:
- `400 Bad Request`: Missing required fields or file too large
- `401 Unauthorized`: Missing or invalid token
- `500 Internal Server Error`: Upload failed

**Example**:
```bash
curl -X POST https://api.example.com/api/resources/upload \
  -H "Authorization: Bearer <your-token>" \
  -F "file=@/path/to/resource.pdf" \
  -F "title=초급 문법 워크시트" \
  -F "description=기본 문법 연습 자료" \
  -F "category=문법" \
  -F "level=초급" \
  -F "requiredMileage=30"
```

---

### User Routes

#### GET /api/users/me/mileage

Get current user's mileage balance and transaction history.

**Authentication**: Required

**Response** (200 OK):
```json
{
  "balance": 150,
  "transactions": [
    {
      "id": "txn_123",
      "type": "earn",
      "amount": 50,
      "description": "Resource upload reward",
      "resourceTitle": "초급 문법 워크시트",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": "txn_124",
      "type": "spend",
      "amount": -30,
      "description": "Resource download",
      "resourceTitle": "중급 읽기 자료",
      "createdAt": "2024-01-15T11:00:00.000Z"
    }
  ]
}
```

**Transaction Types**:
- `earn`: Mileage earned (positive amount)
  - Initial signup: +100
  - Resource upload: +50
  - Admin rewards: variable
- `spend`: Mileage spent (negative amount)
  - Resource download: varies by resource

**Note**: Returns last 50 transactions, ordered by most recent first.

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token

**Example**:
```bash
curl https://api.example.com/api/users/me/mileage \
  -H "Authorization: Bearer <your-token>"
```

---

### Admin Routes

All admin routes require both authentication and admin role.

#### GET /api/admin/resources/pending

Get all resources awaiting admin review.

**Authentication**: Required (Admin only)

**Response** (200 OK):
```json
{
  "resources": [
    {
      "id": "notion_page_id_789",
      "title": "고급 작문 가이드",
      "description": "고급 학습자를 위한 작문 지도 자료",
      "fileKey": "2024/01/writing-guide-uuid.pdf",
      "category": "쓰기",
      "level": "고급",
      "requiredMileage": 40,
      "fileSize": "5.2 MB",
      "uploadedBy": "teacher_park",
      "uploadedAt": "2024-01-15T09:00:00.000Z",
      "views": 0,
      "downloads": 0
    }
  ]
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User is not an admin

**Example**:
```bash
curl https://api.example.com/api/admin/resources/pending \
  -H "Authorization: Bearer <admin-token>"
```

---

#### POST /api/admin/resources/:id/approve

Approve a pending resource, making it visible to all users.

**Authentication**: Required (Admin only)

**Path Parameters**:
- `id`: Notion page ID of the resource

**Response** (200 OK):
```json
{
  "success": true,
  "resourceId": "notion_page_id_789"
}
```

**Process**:
1. Updates Notion resource status to "승인" (approved)
2. Invalidates resource list cache in KV
3. Resource becomes visible in public resource list

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User is not an admin
- `404 Not Found`: Resource not found

**Example**:
```bash
curl -X POST https://api.example.com/api/admin/resources/notion_page_id_789/approve \
  -H "Authorization: Bearer <admin-token>"
```

---

#### POST /api/admin/resources/:id/reject

Reject a pending resource with a reason.

**Authentication**: Required (Admin only)

**Path Parameters**:
- `id`: Notion page ID of the resource

**Request Body**:
```json
{
  "reason": "저작권 문제로 인해 승인할 수 없습니다."
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "resourceId": "notion_page_id_789"
}
```

**Process**:
1. Updates Notion resource status to "거절" (rejected)
2. Invalidates resource list cache in KV
3. Resource remains hidden from public list

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User is not an admin
- `404 Not Found`: Resource not found

**Example**:
```bash
curl -X POST https://api.example.com/api/admin/resources/notion_page_id_789/reject \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"reason": "저작권 문제"}'
```

---

### Health Check

#### GET /api/health

Check API and service health status.

**Authentication**: Not required

**Response** (200 OK - All services healthy):
```json
{
  "status": "healthy",
  "services": {
    "d1": {
      "status": "up",
      "responseTime": 5
    },
    "kv": {
      "status": "up",
      "responseTime": 2
    },
    "r2": {
      "status": "up",
      "responseTime": 3
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Response** (200 OK - Degraded service):
```json
{
  "status": "degraded",
  "services": {
    "d1": {
      "status": "up",
      "responseTime": 5
    },
    "kv": {
      "status": "down",
      "responseTime": 0
    },
    "r2": {
      "status": "up",
      "responseTime": 3
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Status Values**:
- `healthy`: All services operational
- `degraded`: One or more services down

**Note**: Always returns HTTP 200, even when degraded. Check the `status` field and individual service statuses.

**Example**:
```bash
curl https://api.example.com/api/health
```

---

## Error Responses

All errors follow a consistent format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {},
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### Error Codes

| Status Code | Error Code | Description |
|-------------|------------|-------------|
| 400 | `BAD_REQUEST` | Invalid request parameters or body |
| 401 | `UNAUTHORIZED` | Missing or invalid authentication token |
| 402 | `INSUFFICIENT_MILEAGE` | User doesn't have enough mileage |
| 403 | `FORBIDDEN` | User doesn't have required permissions |
| 404 | `NOT_FOUND` | Requested resource not found |
| 429 | `RATE_LIMIT_EXCEEDED` | Too many requests |
| 500 | `STORAGE_ERROR` | R2 storage operation failed |
| 500 | `INTERNAL_SERVER_ERROR` | Unexpected server error |
| 503 | `SERVICE_UNAVAILABLE` | External service (Notion, GitHub) unavailable |

### Example Error Responses

**401 Unauthorized**:
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Unauthorized",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

**402 Insufficient Mileage**:
```json
{
  "error": {
    "code": "INSUFFICIENT_MILEAGE",
    "message": "Insufficient mileage. Required: 30, Current: 20",
    "details": {
      "required": 30,
      "current": 20
    },
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

**403 Forbidden**:
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Forbidden",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

**404 Not Found**:
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

**429 Rate Limit**:
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

**503 Service Unavailable**:
```json
{
  "error": {
    "code": "SERVICE_UNAVAILABLE",
    "message": "Notion API is unavailable",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Limit**: 100 requests per minute per user
- **Identification**: By user ID (authenticated) or IP address (unauthenticated)
- **Response**: HTTP 429 with `RATE_LIMIT_EXCEEDED` error code
- **Reset**: Counter resets after 60 seconds

**Rate Limit Headers** (future enhancement):
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248600
```

---

## Performance Targets

The API is designed with the following performance targets:

- **Cached resource lists**: < 50ms response time
- **Notion API queries**: < 2s response time
- **R2 download URL generation**: < 500ms response time
- **File uploads**: < 30s for files up to 100MB

---

## CORS Configuration

The API supports CORS for the following origins:

- `http://localhost:5173` (local development)
- `https://korean-teacher.pages.dev` (production frontend)

**Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS

**Allowed Headers**: Content-Type, Authorization

**Credentials**: Enabled

---

## Best Practices

### Token Storage

- Store JWT tokens securely (e.g., httpOnly cookies or secure localStorage)
- Never expose tokens in URLs or logs
- Implement token refresh before expiration

### Error Handling

- Always check response status codes
- Parse error responses for user-friendly messages
- Implement retry logic for 503 errors (with exponential backoff)

### File Uploads

- Validate file size on client before uploading
- Show upload progress to users
- Handle upload failures gracefully

### Mileage Management

- Check user balance before initiating downloads
- Display clear error messages for insufficient mileage
- Show transaction history for transparency

---

## Support

For API issues or questions:
- GitHub Issues: [repository-url]
- Email: support@korean-teacher.com

