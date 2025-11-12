import { Client } from '@notionhq/client'
import { ServiceUnavailableError, NotFoundError } from '../utils/errors'

/**
 * Resource interface representing a teaching material
 */
export interface Resource {
  id: string
  title: string
  description: string
  fileKey: string
  category: string
  level: string
  requiredMileage: number
  fileSize: string
  uploadedBy: string
  uploadedAt: string
  views: number
  downloads: number
  status?: '대기' | '승인' | '거절'
}

/**
 * Notion property types for resource database
 */
interface NotionResourceProperties {
  제목: { title: Array<{ text: { content: string } }> }
  설명: { rich_text: Array<{ text: { content: string } }> }
  파일키: { rich_text: Array<{ text: { content: string } }> }
  카테고리: { select: { name: string } | null }
  난이도: { select: { name: string } | null }
  필요마일리지: { number: number | null }
  파일크기: { rich_text: Array<{ text: { content: string } }> }
  상태: { select: { name: '대기' | '승인' | '거절' } | null }
  업로더: { rich_text: Array<{ text: { content: string } }> }
  업로드일: { date: { start: string } | null }
  조회수: { number: number | null }
  다운로드수: { number: number | null }
}

/**
 * NotionService handles all interactions with Notion API
 * - Query approved and pending resources
 * - Create new resource entries
 * - Update resource status
 * - Increment download counters
 */
export class NotionService {
  private client: Client
  private databaseId: string

  constructor(apiKey: string, databaseId: string) {
    this.client = new Client({ auth: apiKey })
    this.databaseId = databaseId
  }

  /**
   * Retry a function with exponential backoff
   * @param fn - Function to retry
   * @param retries - Maximum number of retries (default: 3)
   * @returns Result of the function
   */
  private async retryWithBackoff<T>(
    fn: () => Promise<T>,
    retries: number = 3
  ): Promise<T> {
    let lastError: any

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        return await fn()
      } catch (error: any) {
        lastError = error

        // Check if it's a rate limit error
        const isRateLimit = error.code === 'rate_limited' || 
                           error.status === 429 ||
                           (error.message && error.message.includes('rate limit'))

        // If not a rate limit error or last attempt, throw immediately
        if (!isRateLimit || attempt === retries - 1) {
          throw error
        }

        // Calculate exponential backoff delay: 1s, 2s, 4s
        const delay = Math.pow(2, attempt) * 1000

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    throw lastError
  }

  /**
   * Transform Notion page properties to Resource interface
   * @param page - Notion page object
   * @returns Resource object
   */
  formatResource(page: any): Resource {
    const props = page.properties as NotionResourceProperties

    return {
      id: page.id,
      title: props.제목?.title?.[0]?.text?.content || '',
      description: props.설명?.rich_text?.[0]?.text?.content || '',
      fileKey: props.파일키?.rich_text?.[0]?.text?.content || '',
      category: props.카테고리?.select?.name || '',
      level: props.난이도?.select?.name || '',
      requiredMileage: props.필요마일리지?.number || 0,
      fileSize: props.파일크기?.rich_text?.[0]?.text?.content || '',
      uploadedBy: props.업로더?.rich_text?.[0]?.text?.content || '',
      uploadedAt: props.업로드일?.date?.start || '',
      views: props.조회수?.number || 0,
      downloads: props.다운로드수?.number || 0,
      status: props.상태?.select?.name
    }
  }

  /**
   * Get approved resources with pagination and filters
   * @param limit - Number of resources per page (max 20)
   * @param cursor - Pagination cursor from previous request
   * @param filters - Optional filters for category and level
   * @returns Object with resources array, hasMore flag, and nextCursor
   */
  async getApprovedResources(
    limit: number = 20,
    cursor?: string,
    filters?: { category?: string; level?: string }
  ): Promise<{ resources: Resource[]; hasMore: boolean; nextCursor?: string }> {
    try {
      // Build filter conditions
      const filterConditions: any[] = [
        {
          property: '상태',
          select: {
            equals: '승인'
          }
        }
      ]

      if (filters?.category) {
        filterConditions.push({
          property: '카테고리',
          select: {
            equals: filters.category
          }
        })
      }

      if (filters?.level) {
        filterConditions.push({
          property: '난이도',
          select: {
            equals: filters.level
          }
        })
      }

      const response = await this.retryWithBackoff(() =>
        (this.client.databases as any).query({
          database_id: this.databaseId,
          filter: {
            and: filterConditions
          },
          sorts: [
            {
              property: '업로드일',
              direction: 'descending'
            }
          ],
          page_size: Math.min(limit, 20),
          start_cursor: cursor
        })
      )

      const resources = (response as any).results.map((page: any) => this.formatResource(page))

      return {
        resources,
        hasMore: (response as any).has_more,
        nextCursor: (response as any).next_cursor || undefined
      }
    } catch (error) {
      throw new ServiceUnavailableError('Notion API')
    }
  }

  /**
   * Get single resource by Notion page ID
   * @param pageId - Notion page ID
   * @returns Resource object
   */
  async getResource(pageId: string): Promise<Resource> {
    try {
      const page = await this.retryWithBackoff(() =>
        this.client.pages.retrieve({ page_id: pageId })
      )
      return this.formatResource(page)
    } catch (error: any) {
      if (error.code === 'object_not_found') {
        throw new NotFoundError('Resource')
      }
      throw new ServiceUnavailableError('Notion API')
    }
  }

  /**
   * Get pending resources for admin review
   * @returns Array of pending resources
   */
  async getPendingResources(): Promise<Resource[]> {
    try {
      const response = await this.retryWithBackoff(() =>
        (this.client.databases as any).query({
          database_id: this.databaseId,
          filter: {
            property: '상태',
            select: {
              equals: '대기'
            }
          },
          sorts: [
            {
              property: '업로드일',
              direction: 'descending'
            }
          ]
        })
      )

      return (response as any).results.map((page: any) => this.formatResource(page))
    } catch (error) {
      throw new ServiceUnavailableError('Notion API')
    }
  }

  /**
   * Create new resource entry in Notion with status "대기"
   * @param data - Resource data for creation
   * @returns Notion page ID of created resource
   */
  async createResource(data: {
    title: string
    description: string
    fileKey: string
    category: string
    level: string
    requiredMileage: number
    fileSize: string
    uploadedBy: string
  }): Promise<string> {
    try {
      const response = await this.retryWithBackoff(() =>
        this.client.pages.create({
          parent: { database_id: this.databaseId },
          properties: {
            제목: {
              title: [
                {
                  text: {
                    content: data.title
                  }
                }
              ]
            },
            설명: {
              rich_text: [
                {
                  text: {
                    content: data.description
                  }
                }
              ]
            },
            파일키: {
              rich_text: [
                {
                  text: {
                    content: data.fileKey
                  }
                }
              ]
            },
            카테고리: {
              select: {
                name: data.category
              }
            },
            난이도: {
              select: {
                name: data.level
              }
            },
            필요마일리지: {
              number: data.requiredMileage
            },
            파일크기: {
              rich_text: [
                {
                  text: {
                    content: data.fileSize
                  }
                }
              ]
            },
            상태: {
              select: {
                name: '대기'
              }
            },
            업로더: {
              rich_text: [
                {
                  text: {
                    content: data.uploadedBy
                  }
                }
              ]
            },
            업로드일: {
              date: {
                start: new Date().toISOString()
              }
            },
            조회수: {
              number: 0
            },
            다운로드수: {
              number: 0
            }
          }
        })
      )

      return response.id
    } catch (error) {
      throw new ServiceUnavailableError('Notion API')
    }
  }

  /**
   * Update resource status (승인 or 거절)
   * @param pageId - Notion page ID
   * @param status - New status value
   */
  async updateResourceStatus(
    pageId: string,
    status: '승인' | '거절'
  ): Promise<void> {
    try {
      await this.retryWithBackoff(() =>
        this.client.pages.update({
          page_id: pageId,
          properties: {
            상태: {
              select: {
                name: status
              }
            }
          }
        })
      )
    } catch (error: any) {
      if (error.code === 'object_not_found') {
        throw new NotFoundError('Resource')
      }
      throw new ServiceUnavailableError('Notion API')
    }
  }

  /**
   * Increment download count for a resource
   * @param pageId - Notion page ID
   */
  async incrementDownloadCount(pageId: string): Promise<void> {
    try {
      // First, get the current download count
      const page = await this.retryWithBackoff(() =>
        this.client.pages.retrieve({ page_id: pageId })
      )
      const props = (page as any).properties as NotionResourceProperties
      const currentDownloads = props.다운로드수?.number || 0

      // Update with incremented value
      await this.retryWithBackoff(() =>
        this.client.pages.update({
          page_id: pageId,
          properties: {
            다운로드수: {
              number: currentDownloads + 1
            }
          }
        })
      )
    } catch (error: any) {
      if (error.code === 'object_not_found') {
        throw new NotFoundError('Resource')
      }
      throw new ServiceUnavailableError('Notion API')
    }
  }
}
