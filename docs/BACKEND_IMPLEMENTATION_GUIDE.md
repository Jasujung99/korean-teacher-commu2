# 백엔드 구현 가이드 (Cloudflare Workers)

> 현재 상태: 프론트엔드만 구현됨  
> 목표: 서버리스 백엔드 추가

## 🚀 빠른 시작

### 1. 로컬 개발 환경 설정

```bash
# Workers 프로젝트 생성
npm create cloudflare@latest korean-teacher-api
cd korean-teacher-api

# 선택 옵션:
# - "Hello World" Worker
# - TypeScript: Yes
# - Git: Yes
# - Deploy: No (아직)

# 필요한 패키지 설치
npm install hono @notionhq/client
npm install -D @cloudflare/workers-types
```

### 2. 프로젝트 구조

```
korean-teacher-api/
├── src/
│   ├── index.ts          # 메인 엔트리
│   ├── routes/
│   │   ├── auth.ts       # 인증 관련
│   │   ├── users.ts      # 사용자 관련
│   │   ├── resources.ts  # 자료실 관련
│   │   └── admin.ts      # 관리자 관련
│   ├── middleware/
│   │   ├── auth.ts       # JWT 검증
│   │   └── rateLimit.ts  # Rate limiting
│   └── utils/
│       ├── notion.ts     # Notion API 헬퍼
│       └── r2.ts         # R2 스토리지 헬퍼
├── wrangler.toml         # Cloudflare 설정
└── package.json
```

### 3. 환경 변수 설정

```toml name=wrangler.toml
name = "korean-teacher-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"

# KV 네임스페이스 (캐시용)
[[kv_namespaces]]
binding = "CACHE"
id = "your-kv-namespace-id"

# D1 데이터베이스
[[d1_databases]]
binding = "DB"
database_name = "korean-teacher-db"
database_id = "your-database-id"

# R2 버킷
[[r2_buckets]]
binding = "BUCKET"
bucket_name = "korean-teacher-resources"

# 환경 변수 (개발용)
[vars]
ENVIRONMENT = "development"

# 비밀 환경 변수 (별도 설정)
# wrangler secret put NOTION_API_KEY
# wrangler secret put JWT_SECRET
# wrangler secret put GITHUB_CLIENT_SECRET
```

## 🔄 프론트엔드 연동 수정사항

### 1. API 호출 레이어 추가

```typescript name=src/services/api.service.ts
class ApiService {
  private baseUrl = import.meta.env.VITE_API_URL
  private token: string | null = null

  constructor() {
    this.token = localStorage.getItem('auth_token')
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
    }

    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }
    
    return response.json()
  }

  // 인증
  async loginWithGithub(code: string) {
    const data = await this.request('/auth/github', {
      method: 'POST',
      body: JSON.stringify({ code }),
    })
    this.token = data.token
    localStorage.setItem('auth_token', data.token)
    return data
  }

  // 자료 목록
  async getResources(page = 1, limit = 20) {
    return this.request(`/resources?page=${page}&limit=${limit}`)
  }

  // 다운로드
  async getDownloadUrl(resourceId: string) {
    const data = await this.request(`/resources/${resourceId}/download`)
    return data.downloadUrl
  }

  // 마일리지 조회
  async getMileage() {
    return this.request('/users/me/mileage')
  }
}

export const apiService = new ApiService()
```

### 2. React Query 통합 (선택사항)

```typescript name=src/hooks/useResources.ts
import { useQuery, useMutation } from '@tanstack/react-query'
import { apiService } from '@/services/api.service'

export const useResources = (page = 1) => {
  return useQuery({
    queryKey: ['resources', page],
    queryFn: () => apiService.getResources(page),
    staleTime: 5 * 60 * 1000, // 5분
  })
}

export const useDownloadResource = () => {
  return useMutation({
    mutationFn: (resourceId: string) => apiService.getDownloadUrl(resourceId),
    onSuccess: (data) => {
      // 다운로드 URL로 리디렉션
      window.location.href = data.downloadUrl
    },
    onError: (error) => {
      // 에러 처리 (예: 마일리지 부족)
      console.error('Download failed:', error)
    },
  })
}
```

## 🧪 로컬 테스트

```bash
# D1 데이터베이스 로컬 생성
wrangler d1 create korean-teacher-db
wrangler d1 execute korean-teacher-db --local --file=./schema.sql

# 개발 서버 실행
wrangler dev

# 별도 터미널에서 프론트엔드 실행
cd ../korean-teacher-commu
npm run dev
```

## 🚀 배포

```bash
# Workers 배포
wrangler deploy

# 프론트엔드는 Cloudflare Pages가 자동 배포
# (GitHub push 시)
```

## 📝 다음 단계

1. **인증 시스템 완성**
   - GitHub OAuth 플로우 구현
   - JWT 토큰 발급 및 검증

2. **자료실 기능 구현**
   - Notion API 연동
   - R2 파일 업로드/다운로드

3. **마일리지 시스템**
   - 트랜잭션 처리
   - 잔액 확인 API

4. **관리자 기능**
   - 자료 승인/거절
   - 사용자 관리

---

*질문이나 이슈는 GitHub Issues에 등록해주세요.*