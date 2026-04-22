import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiError } from './error';

/**
 * Request validation middleware factory
 */
export const validate = <T>(
  schema: ZodSchema<T>,
  source: 'body' | 'query' | 'params' = 'body'
) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await schema.parseAsync(req[source]);
      
      // Replace request data with validated data
      req[source] = data as unknown as typeof req[typeof source];
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));
        
        res.status(422).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: formattedErrors,
          },
        });
        return;
      }
      
      next(error);
    }
  };
};

/**
 * Validate request body
 */
export const validateBody = <T>(schema: ZodSchema<T>) => validate(schema, 'body');

/**
 * Validate query parameters
 */
export const validateQuery = <T>(schema: ZodSchema<T>) => validate(schema, 'query');

/**
 * Validate route parameters
 */
export const validateParams = <T>(schema: ZodSchema<T>) => validate(schema, 'params');

/**
 * Validate multiple sources at once
 */
export const validateRequest = <
  B = unknown,
  Q = unknown,
  P = unknown
>(schemas: {
  body?: ZodSchema<B>;
  query?: ZodSchema<Q>;
  params?: ZodSchema<P>;
}) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors: Array<{ source: string; errors: unknown[] }> = [];
    
    try {
      // Validate body
      if (schemas.body) {
        try {
          req.body = await schemas.body.parseAsync(req.body);
        } catch (error) {
          if (error instanceof ZodError) {
            errors.push({
              source: 'body',
              errors: error.errors.map((e) => ({
                field: e.path.join('.'),
                message: e.message,
                code: e.code,
              })),
            });
          }
        }
      }
      
      // Validate query
      if (schemas.query) {
        try {
          req.query = await schemas.query.parseAsync(req.query);
        } catch (error) {
          if (error instanceof ZodError) {
            errors.push({
              source: 'query',
              errors: error.errors.map((e) => ({
                field: e.path.join('.'),
                message: e.message,
                code: e.code,
              })),
            });
          }
        }
      }
      
      // Validate params
      if (schemas.params) {
        try {
          req.params = await schemas.params.parseAsync(req.params);
        } catch (error) {
          if (error instanceof ZodError) {
            errors.push({
              source: 'params',
              errors: error.errors.map((e) => ({
                field: e.path.join('.'),
                message: e.message,
                code: e.code,
              })),
            });
          }
        }
      }
      
      // If any validation errors occurred, return them
      if (errors.length > 0) {
        res.status(422).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: errors,
          },
        });
        return;
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Sanitize middleware - removes undefined values and trims strings
 */
export const sanitize = (sources: Array<'body' | 'query' | 'params'> = ['body']) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    sources.forEach((source) => {
      if (req[source] && typeof req[source] === 'object') {
        req[source] = sanitizeObject(req[source] as Record<string, unknown>);
      }
    });
    next();
  };
};

/**
 * Sanitize object recursively
 */
const sanitizeObject = (obj: Record<string, unknown>): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue;
    
    if (typeof value === 'string') {
      result[key] = value.trim();
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result[key] = sanitizeObject(value as Record<string, unknown>);
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        typeof item === 'object' && item !== null
          ? sanitizeObject(item as Record<string, unknown>)
          : item
      );
    } else {
      result[key] = value;
    }
  }
  
  return result;
};

/**
 * Common validation schemas
 */
export const commonSchemas = {
  // UUID validation
  uuid: (field: string) => ({
    refine: (val: string) => 
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val),
    message: `${field} must be a valid UUID`,
  }),
  
  // Email validation
  email: (field: string) => ({
    refine: (val: string) => 
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    message: `${field} must be a valid email address`,
  }),
  
  // Phone validation (Kenya format)
  phone: (field: string) => ({
    refine: (val: string) => 
      /^(?:\+254|0)[17]\d{8}$/.test(val.replace(/\s/g, '')),
    message: `${field} must be a valid Kenyan phone number`,
  }),
  
  // Positive integer
  positiveInt: (field: string) => ({
    refine: (val: number) => Number.isInteger(val) && val > 0,
    message: `${field} must be a positive integer`,
  }),
  
  // Positive decimal
  positiveDecimal: (field: string) => ({
    refine: (val: number) => typeof val === 'number' && val >= 0,
    message: `${field} must be a positive number`,
  }),
};

/**
 * File upload validation middleware
 */
export const validateFileUpload = (options: {
  maxSize?: number;
  allowedTypes?: string[];
  maxFiles?: number;
}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    maxFiles = 5,
  } = options;
  
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.files && !req.file) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'No file uploaded',
        },
      });
      return;
    }
    
    const files = req.files 
      ? (Array.isArray(req.files) ? req.files : Object.values(req.files).flat())
      : [req.file];
    
    if (files.length > maxFiles) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: `Maximum ${maxFiles} files allowed`,
        },
      });
      return;
    }
    
    for (const file of files) {
      if (!file) continue;
      
      if (file.size > maxSize) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: `File size must be less than ${maxSize / 1024 / 1024}MB`,
          },
        });
        return;
      }
      
      if (allowedTypes.length > 0 && !allowedTypes.includes(file.mimetype)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: `File type must be one of: ${allowedTypes.join(', ')}`,
          },
        });
        return;
      }
    }
    
    next();
  };
};

export default {
  validate,
  validateBody,
  validateQuery,
  validateParams,
  validateRequest,
  sanitize,
  commonSchemas,
  validateFileUpload,
};
