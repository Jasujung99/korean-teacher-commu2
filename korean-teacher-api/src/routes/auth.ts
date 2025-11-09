import { Hono } from 'hono'
import { AuthService } from '../services/AuthService'
import { authMiddleware, getUser } from '../middleware/auth'
import { Env, Variables } from '../index'

const auth = new Hono<{ Bindings: Env; Variables: Variables }>()

/**
 * POST /api/auth/github
 * Handle GitHub OAuth callback
 * 
 * Request body:
 *   { code: string }
 * 
 * Response:
 *   {
 *     token: string,
 *     user: {
 *       id: string,
 *       githubId: string,
 *       username: string,
 *       email: string | null,
 *       avatarUrl: string,
 *       mileage: number
 *     }
 *   }
 */
auth.post('/github', async (c) => {
  const { code } = await c.req.json<{ code: string }>()

  if (!code) {
    return c.json({ error: 'Authorization code is required' }, 400)
  }

  const authService = new AuthService(c.env.JWT_SECRET)

  // Exchange code for access token
  const accessToken = await authService.exchangeGitHubCode(
    code,
    c.env.GITHUB_CLIENT_ID,
    c.env.GITHUB_CLIENT_SECRET
  )

  // Get GitHub user profile
  const githubUser = await authService.getGitHubUser(accessToken)

  // Create or update user in database
  const user = await authService.upsertUser(c.env.DB, githubUser)

  // Generate JWT token (default 7 days expiration)
  const token = await authService.generateJWT(user)

  return c.json({
    token,
    user: {
      id: user.id,
      githubId: user.githubId,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl,
      mileage: user.mileage
    }
  })
})

/**
 * GET /api/auth/me
 * Get current authenticated user information
 * Requires: Authorization header with Bearer token
 * 
 * Response:
 *   {
 *     user: {
 *       id: string,
 *       username: string,
 *       email: string | null,
 *       avatarUrl: string,
 *       mileage: number,
 *       role: 'user' | 'admin'
 *     }
 *   }
 */
auth.get('/me', authMiddleware, async (c) => {
  const jwtPayload = getUser(c)

  // Fetch full user details from database
  const user = await c.env.DB
    .prepare('SELECT * FROM users WHERE id = ?')
    .bind(jwtPayload.userId)
    .first()

  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }

  return c.json({
    user: {
      id: user.id as string,
      username: user.username as string,
      email: user.email as string | null,
      avatarUrl: user.avatarUrl as string,
      mileage: user.mileage as number,
      role: user.role as 'user' | 'admin'
    }
  })
})

export default auth
