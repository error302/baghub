import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, extractBearerToken } from '../utils/jwt';
import prisma from '../db';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: 'customer' | 'staff' | 'admin';
      };
    }
  }
}

/**
 * Authentication middleware - verifies JWT token
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractBearerToken(req.headers.authorization);
    
    if (!token) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Access token required',
        },
      });
      return;
    }
    
    const payload = verifyAccessToken(token);
    
    // Check if user still exists and is not deleted
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        role: true,
        deletedAt: true,
      },
    });
    
    if (!user || user.deletedAt) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not found or account deactivated',
        },
      });
      return;
    }
    
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role as 'customer' | 'staff' | 'admin',
    };
    
    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Token has expired') {
        res.status(401).json({
          success: false,
          error: {
            code: 'TOKEN_EXPIRED',
            message: 'Access token has expired',
          },
        });
        return;
      }
    }
    
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid access token',
      },
    });
  }
};

/**
 * Optional authentication - doesn't require token but adds user if present
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractBearerToken(req.headers.authorization);
    
    if (token) {
      const payload = verifyAccessToken(token);
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          email: true,
          role: true,
          deletedAt: true,
        },
      });
      
      if (user && !user.deletedAt) {
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role as 'customer' | 'staff' | 'admin',
        };
      }
    }
    
    next();
  } catch {
    // Continue without user
    next();
  }
};

/**
 * Role-based authorization middleware factory
 */
export const requireRole = (...allowedRoles: ('customer' | 'staff' | 'admin')[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
      return;
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to access this resource',
        },
      });
      return;
    }
    
    next();
  };
};

/**
 * Require admin role
 */
export const requireAdmin = requireRole('admin');

/**
 * Require staff or admin role
 */
export const requireStaff = requireRole('staff', 'admin');

/**
 * Require customer or higher (any authenticated user)
 */
export const requireCustomer = requireRole('customer', 'staff', 'admin');

/**
 * Check if user owns the resource or is admin
 */
export const requireOwnerOrAdmin = (
  getUserId: (req: Request) => string | Promise<string>
) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
      return;
    }
    
    const resourceUserId = await getUserId(req);
    
    if (req.user.role !== 'admin' && req.user.id !== resourceUserId) {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to access this resource',
        },
      });
      return;
    }
    
    next();
  };
};

export default {
  authenticate,
  optionalAuth,
  requireRole,
  requireAdmin,
  requireStaff,
  requireCustomer,
  requireOwnerOrAdmin,
};
