import { Context } from 'hono';
import { APIError } from '../utils/errors';

/**
 * Error handler middleware
 * Catches and formats all errors into consistent JSON responses
 * Logs errors to console for debugging
 */
export async function errorHandler(err: Error, c: Context) {
  // Log error to console for debugging
  console.error('Error:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString()
  });

  // Handle known API errors
  if (err instanceof APIError) {
    return c.json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
        timestamp: new Date().toISOString()
      }
    }, err.statusCode as any);
  }

  // Handle unknown errors
  return c.json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
      timestamp: new Date().toISOString()
    }
  }, 500 as any);
}
