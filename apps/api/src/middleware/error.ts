import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  statusCode: number;
  code: string;
  details?: unknown;
  
  constructor(
    statusCode: number,
    code: string,
    message: string,
    details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    
    // Maintain proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Common API error factories
 */
export const Errors = {
  badRequest: (message: string, details?: unknown) =>
    new ApiError(400, 'BAD_REQUEST', message, details),
  
  unauthorized: (message: string = 'Authentication required') =>
    new ApiError(401, 'UNAUTHORIZED', message),
  
  forbidden: (message: string = 'Access denied') =>
    new ApiError(403, 'FORBIDDEN', message),
  
  notFound: (resource: string = 'Resource') =>
    new ApiError(404, 'NOT_FOUND', `${resource} not found`),
  
  conflict: (message: string) =>
    new ApiError(409, 'CONFLICT', message),
  
  validation: (message: string, details?: unknown) =>
    new ApiError(422, 'VALIDATION_ERROR', message, details),
  
  tooManyRequests: (message: string = 'Too many requests') =>
    new ApiError(429, 'TOO_MANY_REQUESTS', message),
  
  internal: (message: string = 'Internal server error') =>
    new ApiError(500, 'INTERNAL_ERROR', message),
  
  serviceUnavailable: (message: string = 'Service temporarily unavailable') =>
    new ApiError(503, 'SERVICE_UNAVAILABLE', message),
};

/**
 * Prisma error handler
 */
const handlePrismaError = (error: Error): ApiError => {
  const message = error.message || '';
  
  // Unique constraint violation
  if (message.includes('Unique constraint')) {
    const match = message.match(/Unique constraint failed on the \(([^)]+)\)/);
    const field = match ? match[1] : 'field';
    return Errors.conflict(`A record with this ${field} already exists`);
  }
  
  // Foreign key constraint violation
  if (message.includes('Foreign key constraint')) {
    return Errors.badRequest('Referenced record does not exist');
  }
  
  // Record not found
  if (message.includes('Record not found') || message.includes('Record to update not found')) {
    return Errors.notFound('Record');
  }
  
  // Prisma client known request error
  if ((error as { code?: string }).code === 'P2002') {
    return Errors.conflict('Duplicate entry');
  }
  
  if ((error as { code?: string }).code === 'P2025') {
    return Errors.notFound('Record');
  }
  
  if ((error as { code?: string }).code === 'P2003') {
    return Errors.badRequest('Referenced record does not exist');
  }
  
  return Errors.internal();
};

/**
 * JWT error handler
 */
const handleJWTError = (error: Error): ApiError => {
  if (error.name === 'TokenExpiredError') {
    return Errors.unauthorized('Token has expired');
  }
  if (error.name === 'JsonWebTokenError') {
    return Errors.unauthorized('Invalid token');
  }
  return Errors.unauthorized('Authentication failed');
};

/**
 * Zod validation error handler
 */
const handleZodError = (error: Error & { errors?: unknown[] }): ApiError => {
  return Errors.validation('Validation failed', error.errors);
};

/**
 * Global error handler middleware
 */
export const errorHandler: ErrorRequestHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let apiError: ApiError;
  
  // Handle known error types
  if (error instanceof ApiError) {
    apiError = error;
  } else if (error.name === 'PrismaClientKnownRequestError' || 
             error.name === 'PrismaClientValidationError') {
    apiError = handlePrismaError(error);
  } else if (error.name === 'TokenExpiredError' || 
             error.name === 'JsonWebTokenError' ||
             error.name === 'NotBeforeError') {
    apiError = handleJWTError(error);
  } else if (error.name === 'ZodError') {
    apiError = handleZodError(error as Error & { errors?: unknown[] });
  } else {
    // Unknown error
    console.error('Unhandled error:', error);
    apiError = Errors.internal();
  }
  
  const response: {
    success: false;
    error: {
      code: string;
      message: string;
      details?: unknown;
      stack?: string;
    };
  } = {
    success: false,
    error: {
      code: apiError.code,
      message: apiError.message,
    },
  };
  
  // Include details if available
  if (apiError.details) {
    response.error.details = apiError.details;
  }
  
  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.error.stack = error.stack;
  }
  
  res.status(apiError.statusCode).json(response);
};

/**
 * 404 handler for unknown routes
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
};

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Request timeout middleware
 */
export const requestTimeout = (timeoutMs: number = 30000) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    req.setTimeout(timeoutMs, () => {
      res.status(408).json({
        success: false,
        error: {
          code: 'REQUEST_TIMEOUT',
          message: 'Request timeout',
        },
      });
    });
    next();
  };
};

export default {
  ApiError,
  Errors,
  errorHandler,
  notFoundHandler,
  asyncHandler,
  requestTimeout,
};
