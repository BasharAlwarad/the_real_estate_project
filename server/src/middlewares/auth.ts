import { Request, Response, NextFunction } from 'express';

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
  // Check for session in Authorization header (Bearer token format)
  const authHeader = req.headers.authorization;
  const session = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!session) {
    res.status(401).json({
      success: false,
      message: 'Authentication required. Please login first.',
    });
    return;
  }

  // In a real app, you would verify the session/token here
  // For teaching: just check if session exists and is not empty
  if (session.length < 5) {
    res.status(401).json({
      success: false,
      message: 'Invalid session. Please login again.',
    });
    return;
  }

  // In a real app, you would decode the token and attach user info
  // For teaching: just continue to the next middleware
  next();
};
