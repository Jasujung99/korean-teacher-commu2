import { Hono } from 'hono'
import { NotionService } from '../services/NotionService'
import { MileageService } from '../services/MileageService'
import { R2Service } from '../services/R2Service'
import { authMiddleware, getUser } from '../middleware/auth'
import { Env, Variables } from '../index'

const resources = new Hono<{ Bindings: Env; Variables: Variables }>()

/**
 * GET /api/resources
 * Get list of approved resources with pagination and filters
 * 
 * Query parameters:
 *   - page: number (optional, default: 1)
 *   - limit: number (optional, default: 20, max: 20)
 *   - category: string (optional)
 *   - level: string (optional)
 * 
 * Response:
 *   {
 *     resources: Resource[],
 *     hasMore: boolean,
 *     nextCursor?: string
 *   }
 */
resources.get('/', async (c) => {
  const page = parseInt(c.req.query('page') || '1')
  const limit = Math.min(parseInt(c.req.query('limit') || '20'), 20)
  const category = c.req.query('category')
  const level = c.req.query('level')

  // Build cache key
  const cacheKey = `resources:approved:page:${page}:category:${category || 'all'}:level:${level || 'all'}`

  // Check KV cache first
  const cached = await c.env.CACHE.get(cacheKey)
  if (cached) {
    return c.json(JSON.parse(cached))
  }

  // Cache miss - query Notion
  const notionService = new NotionService(
    c.env.NOTION_API_KEY,
    c.env.NOTION_DATABASE_ID
  )

  const filters: { category?: string; level?: string } = {}
  if (category) filters.category = category
  if (level) filters.level = level

  const result = await notionService.getApprovedResources(
    limit,
    undefined, // cursor - for now we'll use simple pagination
    filters
  )

  // Store in KV cache with 5-minute TTL (300 seconds)
  await c.env.CACHE.put(cacheKey, JSON.stringify(result), {
    expirationTtl: 300
  })

  return c.json(result)
})

/**
 * GET /api/resources/:id
 * Get single resource details by Notion page ID
 * 
 * Response:
 *   {
 *     resource: Resource
 *   }
 */
resources.get('/:id', async (c) => {
  const id = c.req.param('id')

  const notionService = new NotionService(
    c.env.NOTION_API_KEY,
    c.env.NOTION_DATABASE_ID
  )

  const resource = await notionService.getResource(id)

  return c.json({ resource })
})

/**
 * POST /api/resources/:id/download
 * Download a resource by deducting mileage and generating signed URL
 * Requires: Authentication
 * 
 * Response:
 *   {
 *     downloadUrl: string,
 *     expiresIn: number
 *   }
 */
resources.post('/:id/download', authMiddleware, async (c) => {
  const id = c.req.param('id')
  const user = getUser(c)

  // Initialize services
  const notionService = new NotionService(
    c.env.NOTION_API_KEY,
    c.env.NOTION_DATABASE_ID
  )
  const mileageService = new MileageService(c.env.DB)
  const r2Service = new R2Service(c.env.BUCKET)

  // Get resource details
  const resource = await notionService.getResource(id)

  // Check user mileage balance
  const hasSufficient = await mileageService.hasSufficientMileage(
    user.userId,
    resource.requiredMileage
  )

  if (!hasSufficient) {
    const currentBalance = await mileageService.getBalance(user.userId)
    throw new Error(`Insufficient mileage. Required: ${resource.requiredMileage}, Current: ${currentBalance}`)
  }

  // Deduct mileage from user balance
  await mileageService.deductMileage(
    user.userId,
    resource.requiredMileage,
    'Resource download',
    resource.id,
    resource.title
  )

  // Generate signed R2 download URL with 600 seconds expiration
  const downloadUrl = await r2Service.getSignedUrl(resource.fileKey, 600)

  // Increment download count in Notion
  await notionService.incrementDownloadCount(id)

  return c.json({
    downloadUrl,
    expiresIn: 600
  })
})

/**
 * POST /api/resources/upload
 * Upload a new resource file
 * Requires: Authentication
 * 
 * Request body (multipart/form-data):
 *   - file: File
 *   - title: string
 *   - description: string
 *   - category: string
 *   - level: string
 *   - requiredMileage: number
 *   - copyrightConfirmed: boolean
 *   - license: string
 * 
 * Response:
 *   {
 *     resourceId: string,
 *     fileKey: string,
 *     status: 'pending'
 *   }
 */
resources.post('/upload', authMiddleware, async (c) => {
  const user = getUser(c)

  // Parse form data
  const formData = await c.req.formData()
  const fileEntry = formData.get('file')
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string
  const level = formData.get('level') as string
  const requiredMileageStr = formData.get('requiredMileage') as string

  if (!fileEntry || typeof fileEntry === 'string' || !title || !description || !category || !level || !requiredMileageStr) {
    return c.json({ error: 'Missing required fields' }, 400)
  }

  const file = fileEntry as File
  const requiredMileage = parseInt(requiredMileageStr)

  // Validate file size is less than 100MB
  const maxSize = 100 * 1024 * 1024 // 100MB in bytes
  if (file.size > maxSize) {
    return c.json({ 
      error: `File size exceeds maximum allowed size of 100MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB` 
    }, 400)
  }

  // Initialize services
  const r2Service = new R2Service(c.env.BUCKET)
  const notionService = new NotionService(
    c.env.NOTION_API_KEY,
    c.env.NOTION_DATABASE_ID
  )
  const mileageService = new MileageService(c.env.DB)

  // Generate unique file key using R2Service
  const fileKey = r2Service.generateFileKey(file.name)

  // Upload file to R2 bucket
  const fileBuffer = await file.arrayBuffer()
  await r2Service.uploadFile(fileKey, fileBuffer, {
    contentType: file.type,
    size: file.size
  })

  // Format file size for display
  const fileSizeFormatted = `${(file.size / 1024 / 1024).toFixed(2)} MB`

  // Get username from database for uploader field
  const userRecord = await c.env.DB
    .prepare('SELECT username FROM users WHERE id = ?')
    .bind(user.userId)
    .first<{ username: string }>()

  const username = userRecord?.username || 'Unknown'

  // Create Notion entry with status "대기"
  const resourceId = await notionService.createResource({
    title,
    description,
    fileKey,
    category,
    level,
    requiredMileage,
    fileSize: fileSizeFormatted,
    uploadedBy: username
  })

  // Award 50 mileage to user via MileageService
  await mileageService.addMileage(
    user.userId,
    50,
    'Resource upload reward',
    resourceId,
    title
  )

  return c.json({
    resourceId,
    fileKey,
    status: 'pending'
  })
})

export default resources
