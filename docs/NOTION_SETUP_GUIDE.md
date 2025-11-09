# Notion CMS 설정 가이드

## 1. Notion 데이터베이스 생성

### 1.1 새 페이지 생성
1. Notion에서 새 페이지 생성
2. 제목: "한국어 교사 커뮤니티 자료실"
3. 데이터베이스 → 테이블 뷰 선택

### 1.2 필드 구성

| 필드명 | 타입 | 설명 | 예시 |
|--------|------|------|------|
| 제목 | Title | 자료 제목 | "초급 한국어 문법 정리" |
| 설명 | Text | 자료 설명 | "초급 학습자를 위한..." |
| 파일키 | Text | R2 파일 경로 | "2024/11/grammar-basic.pdf" |
| 카테고리 | Select | 자료 분류 | 문법, 회화, 읽기, 쓰기 |
| 난이도 | Select | 난이도 | 초급, 중급, 고급 |
| 필요마일리지 | Number | 다운로드 비용 | 30 |
| 파일크기 | Text | 파일 용량 | "45MB" |
| 상태 | Select | 공개 상태 | 대기, 승인, 거절 |
| 업로더 | Text | 업로드한 사람 | "@username" |
| 업로드일 | Date | 업로드 날짜 | 2024-11-09 |
| 조회수 | Number | 조회 횟수 | 152 |
| 다운로드수 | Number | 다운로드 횟수 | 23 |

### 1.3 뷰(View) 설정

**공개 자료 뷰**
- 필터: 상태 = "승인"
- 정렬: 업로드일 내림차순
- 숨김: 파일키, 상태

**관리자 뷰**
- 필터: 없음
- 그룹: 상태별
- 정렬: 업로드일 내림차순

**대기 중 뷰**
- 필터: 상태 = "대기"
- 정렬: 업로드일 오름차순

## 2. Notion API 설정

### 2.1 Integration 생성
1. [Notion Developers](https://www.notion.so/my-integrations) 접속
2. "New integration" 클릭
3. 설정:
   ```
   Name: Korean Teacher Community
   Associated workspace: [Your Workspace]
   Capabilities:
   - Read content ✅
   - Update content ✅
   - Insert content ✅
   ```
4. Submit → Integration Token 복사

### 2.2 데이터베이스 연결
1. 생성한 자료실 데이터베이스 페이지로 이동
2. 우측 상단 ⋯ 메뉴 → Connections
3. "Korean Teacher Community" Integration 추가
4. 데이터베이스 ID 확인:
   - URL: `https://notion.so/xxxxx?v=yyyyy`
   - `xxxxx` 부분이 Database ID

## 3. Workers에서 Notion API 사용

### 3.1 Notion 클라이언트 설정
```typescript name=src/utils/notion.ts
import { Client } from '@notionhq/client'

export class NotionService {
  private client: Client
  private databaseId: string

  constructor(apiKey: string, databaseId: string) {
    this.client = new Client({ auth: apiKey })
    this.databaseId = databaseId
  }

  // 승인된 자료 목록 조회
  async getApprovedResources(limit = 20, startCursor?: string) {
    const response = await this.client.databases.query({
      database_id: this.databaseId,
      filter: {
        property: '상태',
        select: {
          equals: '승인'
        }
      },
      sorts: [
        {
          property: '업로드일',
          direction: 'descending'
        }
      ],
      page_size: limit,
      start_cursor: startCursor
    })

    return {
      results: response.results.map(this.formatResource),
      hasMore: response.has_more,
      nextCursor: response.next_cursor
    }
  }

  // 자료 상세 조회
  async getResource(pageId: string) {
    const page = await this.client.pages.retrieve({
      page_id: pageId
    })
    return this.formatResource(page)
  }

  // 자료 승인 처리
  async approveResource(pageId: string) {
    await this.client.pages.update({
      page_id: pageId,
      properties: {
        '상태': {
          select: {
            name: '승인'
          }
        }
      }
    })
  }

  // 응답 포맷팅
  private formatResource(page: any) {
    const props = page.properties
    return {
      id: page.id,
      title: props['제목']?.title[0]?.text?.content || '',
      description: props['설명']?.rich_text[0]?.text?.content || '',
      fileKey: props['파일키']?.rich_text[0]?.text?.content || '',
      category: props['카테고리']?.select?.name || '',
      level: props['난이도']?.select?.name || '',
      requiredMileage: props['필요마일리지']?.number || 0,
      fileSize: props['파일크기']?.rich_text[0]?.text?.content || '',
      uploadedAt: props['업로드일']?.date?.start || '',
      views: props['조회수']?.number || 0,
      downloads: props['다운로드수']?.number || 0
    }
  }
}
```

### 3.2 캐싱 전략
```typescript name=src/routes/resources.ts
import { NotionService } from '../utils/notion'

export async function handleGetResources(c: Context) {
  const { CACHE, NOTION_API_KEY, NOTION_DATABASE_ID } = c.env
  
  // 1. 캐시 확인
  const cacheKey = 'resources:approved:page1'
  const cached = await CACHE.get(cacheKey, 'json')
  
  if (cached) {
    return c.json(cached)
  }
  
  // 2. Notion API 호출
  const notion = new NotionService(NOTION_API_KEY, NOTION_DATABASE_ID)
  const resources = await notion.getApprovedResources()
  
  // 3. 5분간 캐싱
  await CACHE.put(cacheKey, JSON.stringify(resources), {
    expirationTtl: 300 // 5분
  })
  
  return c.json(resources)
}
```

## 4. 관리 워크플로우

### 4.1 자료 업로드 프로세스
1. **파일 업로드** (R2)
   - Workers API를 통해 파일을 R2에 업로드
   - 고유한 파일키 생성

2. **메타데이터 등록** (Notion)
   - API를 통해 Notion 데이터베이스에 새 항목 추가
   - 상태: "대기"로 설정

3. **관리자 검토** (Notion)
   - 관리자가 Notion에서 직접 검토
   - 승인/거절 처리

4. **사용자 접근** (Workers + Notion)
   - 승인된 자료만 API로 노출
   - 다운로드 시 마일리지 차감

### 4.2 일일 운영 체크리스트
```markdown
## 일일 체크리스트
- [ ] 대기 중인 자료 검토 (Notion)
- [ ] 부적절한 자료 거절 처리
- [ ] 승인된 자료 태그 정리
- [ ] 인기 자료 확인 (다운로드 수)
- [ ] 신고된 자료 검토
```

## 5. 자동화 팁

### 5.1 Notion 자동화 (내장 기능)
- **반복 템플릿**: 주간 보고서 자동 생성
- **연결된 데이터베이스**: 사용자 DB와 자료 DB 연결
- **수식 필드**: 자동 계산 (예: 인기도 점수)

### 5.2 Zapier/Make 연동 (선택사항)
- 새 자료 등록 시 Slack 알림
- 일정 조회수 도달 시 "인기" 태그 자동 추가
- 주간 통계 이메일 발송

## 6. 문제 해결

### Rate Limit 대응
```typescript
// Exponential backoff 구현
async function notionApiCall(fn: Function, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (error: any) {
      if (error.code === 'rate_limited' && i < retries - 1) {
        await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000))
      } else {
        throw error
      }
    }
  }
}
```

### 대용량 데이터 처리
```typescript
// 페이지네이션 구현
async function getAllResources(notion: NotionService) {
  let allResults = []
  let hasMore = true
  let cursor = undefined
  
  while (hasMore) {
    const response = await notion.getApprovedResources(100, cursor)
    allResults = allResults.concat(response.results)
    hasMore = response.hasMore
    cursor = response.nextCursor
  }
  
  return allResults
}
```

---

*Notion 설정 관련 질문은 GitHub Discussions에서 논의해주세요.*