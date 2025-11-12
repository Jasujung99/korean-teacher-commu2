import { StorageError } from '../utils/errors'

/**
 * R2Service handles all interactions with Cloudflare R2 storage
 * - Upload files to R2 bucket
 * - Generate signed download URLs
 * - Check file existence
 * - Delete files for cleanup
 */
export class R2Service {
  private bucket: R2Bucket

  constructor(bucket: R2Bucket) {
    this.bucket = bucket
  }

  /**
   * Generate unique file key with format "YYYY/MM/original-filename-{uuid}.ext"
   * @param originalFilename - Original filename from upload
   * @returns Generated file key
   */
  generateFileKey(originalFilename: string): string {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    
    // Generate UUID
    const uuid = crypto.randomUUID()
    
    // Extract extension
    const ext = originalFilename.split('.').pop() || ''
    
    // Extract filename without extension
    const name = originalFilename.replace(/\.[^/.]+$/, '')
    
    return `${year}/${month}/${name}-${uuid}.${ext}`
  }

  /**
   * Upload file to R2 bucket with metadata
   * @param fileKey - Unique file key for storage
   * @param file - File data as ArrayBuffer
   * @param metadata - File metadata (contentType, size)
   */
  async uploadFile(
    fileKey: string,
    file: ArrayBuffer,
    metadata: { contentType: string; size: number }
  ): Promise<void> {
    try {
      await this.bucket.put(fileKey, file, {
        httpMetadata: {
          contentType: metadata.contentType
        },
        customMetadata: {
          size: metadata.size.toString(),
          uploadedAt: new Date().toISOString()
        }
      })
    } catch (error) {
      throw new StorageError(`Failed to upload file: ${error}`)
    }
  }

  /**
   * Generate signed download URL with expiration
   * Note: R2 doesn't have native signed URLs like S3. This method generates
   * a time-limited token that will be validated by the download endpoint.
   * The actual file serving happens through the Worker's download route.
   * 
   * @param fileKey - File key in R2 bucket
   * @param expiresIn - Expiration time in seconds (default: 600)
   * @returns Signed download URL with token
   */
  async getSignedUrl(
    fileKey: string,
    expiresIn: number = 600
  ): Promise<string> {
    try {
      // Check if file exists first
      const object = await this.bucket.head(fileKey)
      if (!object) {
        throw new StorageError(`File not found: ${fileKey}`)
      }

      // Generate a simple token with expiration
      // In production, this would be a JWT or similar signed token
      const expiresAt = Date.now() + (expiresIn * 1000)
      const token = btoa(JSON.stringify({ fileKey, expiresAt }))
      
      // Return URL that points to the Worker's download endpoint
      // The actual implementation will be in the download route handler
      return `/api/download/${encodeURIComponent(fileKey)}?token=${token}`
    } catch (error) {
      throw new StorageError(`Failed to generate signed URL: ${error}`)
    }
  }

  /**
   * Check if file exists in R2 bucket
   * @param fileKey - File key to check
   * @returns True if file exists, false otherwise
   */
  async fileExists(fileKey: string): Promise<boolean> {
    try {
      const object = await this.bucket.head(fileKey)
      return object !== null
    } catch (error) {
      return false
    }
  }

  /**
   * Delete file from R2 bucket
   * @param fileKey - File key to delete
   */
  async deleteFile(fileKey: string): Promise<void> {
    try {
      await this.bucket.delete(fileKey)
    } catch (error) {
      throw new StorageError(`Failed to delete file: ${error}`)
    }
  }
}
