import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Authentication middleware for auth service
 *
 * Verifies JWT access token from cookies and attaches userId to request.
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
    // attach userId for downstream usage
    (req as any).userId = payload.userId;
    next();
  } catch {
    res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }
};
