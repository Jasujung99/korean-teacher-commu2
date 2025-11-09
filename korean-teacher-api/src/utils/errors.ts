/**
 * Base API Error class
 * All custom errors extend from this class
 */
export class APIError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
    Object.setPrototypeOf(this, APIError.prototype);
  }
}

/**
 * 401 Unauthorized Error
 * Thrown when authentication is required but not provided or invalid
 */
export class UnauthorizedError extends APIError {
  constructor(message = 'Unauthorized') {
    super(401, 'UNAUTHORIZED', message);
    this.name = 'UnauthorizedError';
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

/**
 * 403 Forbidden Error
 * Thrown when user doesn't have permission to access a resource
 */
export class ForbiddenError extends APIError {
  constructor(message = 'Forbidden') {
    super(403, 'FORBIDDEN', message);
    this.name = 'ForbiddenError';
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

/**
 * 402 Insufficient Mileage Error
 * Thrown when user doesn't have enough mileage for a download
 */
export class InsufficientMileageError extends APIError {
  constructor(required: number, current: number) {
    super(
      402,
      'INSUFFICIENT_MILEAGE',
      `Insufficient mileage. Required: ${required}, Current: ${current}`,
      { required, current }
    );
    this.name = 'InsufficientMileageError';
    Object.setPrototypeOf(this, InsufficientMileageError.prototype);
  }
}

/**
 * 404 Not Found Error
 * Thrown when a requested resource doesn't exist
 */
export class NotFoundError extends APIError {
  constructor(resource: string) {
    super(404, 'NOT_FOUND', `${resource} not found`);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * 429 Rate Limit Error
 * Thrown when user exceeds rate limit
 */
export class RateLimitError extends APIError {
  constructor(message = 'Too many requests') {
    super(429, 'RATE_LIMIT_EXCEEDED', message);
    this.name = 'RateLimitError';
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

/**
 * 503 Service Unavailable Error
 * Thrown when external services (like Notion API) are unavailable
 */
export class ServiceUnavailableError extends APIError {
  constructor(service: string) {
    super(503, 'SERVICE_UNAVAILABLE', `${service} is unavailable`);
    this.name = 'ServiceUnavailableError';
    Object.setPrototypeOf(this, ServiceUnavailableError.prototype);
  }
}

/**
 * 500 Storage Error
 * Thrown when R2 storage operations fail
 */
export class StorageError extends APIError {
  constructor(message = 'R2 storage error') {
    super(500, 'STORAGE_ERROR', message);
    this.name = 'StorageError';
    Object.setPrototypeOf(this, StorageError.prototype);
  }
}
