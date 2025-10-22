import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Authentication Middleware (Local JWT Verification)
 *
 * Verifies JWT access token from httpOnly cookie.
 * On success, attaches userId to request object for downstream use.
 * Uses local verification for optimal performance.
 */

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies?.accessToken;

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
    return;
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'devsecret';
    const payload = jwt.verify(token, jwtSecret) as { userId: string };

    // Attach userId for downstream usage
    (req as any).userId = payload.userId;
    next();
  } catch (error) {
    // Log error for debugging (helpful in production)
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Token expired',
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Authentication failed',
      });
    }
  }
};
