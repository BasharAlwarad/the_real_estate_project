import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Simple authorization middleware for teaching purposes
 *
 * In a real app, this would:
 * 1. Check for JWT token in Authorization header
 * 2. Verify token signature and expiration
 * 3. Attach user info to req.user
 *
 * For this teaching branch, we just check for a simple session string
 */

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies?.accessToken; // Changed from 'token' to 'accessToken'
  if (!token) {
    res
      .status(401)
      .json({ success: false, message: 'Authentication required' });
    return;
  }
  try {
    const jwtSecret = process.env.JWT_SECRET || 'devsecret';
    const payload = jwt.verify(token, jwtSecret) as { userId: string };
    // attach userId for downstream usage
    (req as any).userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
