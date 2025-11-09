import { sign, verify } from '@tsndr/cloudflare-worker-jwt'
import { UnauthorizedError } from '../utils/errors'

/**
 * GitHub User interface from GitHub API
 */
interface GitHubUser {
  id: number
  login: string
  email: string | null
  avatar_url: string
  name: string | null
}

/**
 * User interface for database
 */
export interface User {
  id: string
  githubId: string
  username: string
  email: string | null
  avatarUrl: string
  role: 'user' | 'admin'
  mileage: number
  createdAt: string
  updatedAt: string
}

/**
 * JWT Payload interface
 */
export interface JWTPayload {
  userId: string
  role: 'user' | 'admin'
  iat: number
  exp: number
}

/**
 * AuthService handles authentication operations
 * - GitHub OAuth flow
 * - JWT token generation and verification
 * - User management in D1 database
 */
export class AuthService {
  private jwtSecret: string

  constructor(jwtSecret: string) {
    this.jwtSecret = jwtSecret
  }

  /**
   * Exchange GitHub OAuth code for access token
   * @param code - OAuth authorization code from GitHub
   * @param clientId - GitHub OAuth app client ID
   * @param clientSecret - GitHub OAuth app client secret
   * @returns GitHub access token
   */
  async exchangeGitHubCode(
    code: string,
    clientId: string,
    clientSecret: string
  ): Promise<string> {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code
      })
    })

    if (!response.ok) {
      throw new UnauthorizedError('Failed to exchange GitHub code')
    }

    const data = await response.json() as { access_token?: string; error?: string }
    
    if (data.error || !data.access_token) {
      throw new UnauthorizedError('Invalid GitHub authorization code')
    }

    return data.access_token
  }

  /**
   * Fetch GitHub user profile using access token
   * @param accessToken - GitHub access token
   * @returns GitHub user profile
   */
  async getGitHubUser(accessToken: string): Promise<GitHubUser> {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Korean-Teacher-API'
      }
    })

    if (!response.ok) {
      throw new UnauthorizedError('Failed to fetch GitHub user profile')
    }

    const user = await response.json() as GitHubUser
    return user
  }

  /**
   * Create or update user in D1 database
   * @param db - D1 database instance
   * @param githubUser - GitHub user profile
   * @returns User record from database
   */
  async upsertUser(db: D1Database, githubUser: GitHubUser): Promise<User> {
    const userId = crypto.randomUUID()
    const now = new Date().toISOString()

    // Check if user exists
    const existingUser = await db
      .prepare('SELECT * FROM users WHERE github_id = ?')
      .bind(githubUser.id.toString())
      .first<User>()

    if (existingUser) {
      // Update existing user
      await db
        .prepare(`
          UPDATE users 
          SET username = ?, email = ?, avatar_url = ?, updated_at = ?
          WHERE github_id = ?
        `)
        .bind(
          githubUser.login,
          githubUser.email,
          githubUser.avatar_url,
          now,
          githubUser.id.toString()
        )
        .run()

      // Fetch updated user
      const updatedUser = await db
        .prepare('SELECT * FROM users WHERE github_id = ?')
        .bind(githubUser.id.toString())
        .first<User>()

      if (!updatedUser) {
        throw new Error('Failed to fetch updated user')
      }

      return {
        id: updatedUser.id,
        githubId: updatedUser.githubId,
        username: updatedUser.username,
        email: updatedUser.email,
        avatarUrl: updatedUser.avatarUrl,
        role: updatedUser.role,
        mileage: updatedUser.mileage,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      }
    }

    // Create new user with initial 100 mileage
    await db
      .prepare(`
        INSERT INTO users (id, github_id, username, email, avatar_url, role, mileage, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, 'user', 100, ?, ?)
      `)
      .bind(
        userId,
        githubUser.id.toString(),
        githubUser.login,
        githubUser.email,
        githubUser.avatar_url,
        now,
        now
      )
      .run()

    // Fetch newly created user
    const newUser = await db
      .prepare('SELECT * FROM users WHERE id = ?')
      .bind(userId)
      .first<User>()

    if (!newUser) {
      throw new Error('Failed to create user')
    }

    return {
      id: newUser.id,
      githubId: newUser.githubId,
      username: newUser.username,
      email: newUser.email,
      avatarUrl: newUser.avatarUrl,
      role: newUser.role,
      mileage: newUser.mileage,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
    }
  }

  /**
   * Generate JWT token for user
   * @param user - User record
   * @param expiryDays - Token expiration in days (default: 7)
   * @returns JWT token string
   */
  async generateJWT(user: User, expiryDays: number = 7): Promise<string> {
    const now = Math.floor(Date.now() / 1000)
    const exp = now + (expiryDays * 24 * 60 * 60)

    const payload: JWTPayload = {
      userId: user.id,
      role: user.role,
      iat: now,
      exp
    }

    const token = await sign(payload, this.jwtSecret)
    return token
  }

  /**
   * Verify and decode JWT token
   * @param token - JWT token string
   * @returns Decoded JWT payload
   * @throws UnauthorizedError if token is invalid or expired
   */
  async verifyJWT(token: string): Promise<JWTPayload> {
    try {
      const isValid = await verify(token, this.jwtSecret)
      
      if (!isValid) {
        throw new UnauthorizedError('Invalid token')
      }

      // Decode the token to get payload
      const parts = token.split('.')
      if (parts.length !== 3) {
        throw new UnauthorizedError('Malformed token')
      }

      const payload = JSON.parse(atob(parts[1])) as JWTPayload

      // Check expiration
      const now = Math.floor(Date.now() / 1000)
      if (payload.exp && payload.exp < now) {
        throw new UnauthorizedError('Token expired')
      }

      return payload
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw error
      }
      throw new UnauthorizedError('Invalid token')
    }
  }
}
