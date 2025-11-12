import { Hono } from 'hono'
import { NotionService } from '../services/NotionService'
import { authMiddleware, adminMiddleware } from '../middleware/auth'
import { Env, Variables } from '../index'

const admin = new Hono<{ Bindings: Env; Variables: Variables }>()

/**
 * GET /api/admin/resources/pending
 * Get all pending resources awaiting admin review
 * Requires: Authentication + Admin role
 * 
 * Response:
 *   {
 *     resources: Resource[]
 *   }
 */
admin.get('/resources/pending', authMiddleware, adminMiddleware, async (c) => {
  // Initialize NotionService
  const notionService = new NotionService(
    c.env.NOTION_API_KEY,
    c.env.NOTION_DATABASE_ID
  )

  // Query Notion for resources with status "대기"
  const resources = await notionService.getPendingResources()

  return c.json({
    resources
  })
})

/**
 * POST /api/admin/resources/:id/approve
 * Approve a pending resource
 * Requires: Authentication + Admin role
 * 
 * Response:
 *   {
 *     success: boolean,
 *     resourceId: string
 *   }
 */
admin.post('/resources/:id/approve', authMiddleware, adminMiddleware, async (c) => {
  const resourceId = c.req.param('id')

  // Initialize NotionService
  const notionService = new NotionService(
    c.env.NOTION_API_KEY,
    c.env.NOTION_DATABASE_ID
  )

  // Update Notion resource status to "승인"
  await notionService.updateResourceStatus(resourceId, '승인')

  // Invalidate resource list cache in KV
  // Delete all cached resource list keys
  const cacheKeys = await c.env.CACHE.list({ prefix: 'resources:approved:' })
  for (const key of cacheKeys.keys) {
    await c.env.CACHE.delete(key.name)
  }

  return c.json({
    success: true,
    resourceId
  })
})

/**
 * POST /api/admin/resources/:id/reject
 * Reject a pending resource
 * Requires: Authentication + Admin role
 * 
 * Request body:
 *   { reason: string }
 * 
 * Response:
 *   {
 *     success: boolean,
 *     resourceId: string
 *   }
 */
admin.post('/resources/:id/reject', authMiddleware, adminMiddleware, async (c) => {
  const resourceId = c.req.param('id')
  const { reason } = await c.req.json<{ reason: string }>()

  // Initialize NotionService
  const notionService = new NotionService(
    c.env.NOTION_API_KEY,
    c.env.NOTION_DATABASE_ID
  )

  // Update Notion resource status to "거절"
  await notionService.updateResourceStatus(resourceId, '거절')

  // Invalidate resource list cache in KV
  // Delete all cached resource list keys
  const cacheKeys = await c.env.CACHE.list({ prefix: 'resources:approved:' })
  for (const key of cacheKeys.keys) {
    await c.env.CACHE.delete(key.name)
  }

  return c.json({
    success: true,
    resourceId
  })
})

export default admin
