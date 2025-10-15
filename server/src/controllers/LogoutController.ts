import { Request, Response } from 'express';
import { RefreshToken } from '#models';
import crypto from 'crypto';

/**
 * Logout Controller
 *
 * Clears both access and refresh token cookies and removes refresh token from database.
 * Teaching points:
 * 1. Clear both cookies
 * 2. Delete refresh token from database to revoke it
 */
export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  // If there's a refresh token, delete it from database
  if (refreshToken) {
    try {
      const hashedRefreshToken = crypto
        .createHash('sha256')
        .update(refreshToken)
        .digest('hex');

      await RefreshToken.deleteOne({ token: hashedRefreshToken });
    } catch (error) {
      // Continue with logout even if deletion fails
      console.error('Error deleting refresh token:', error);
    }
  }

  // Clear both cookies
  res.clearCookie('accessToken', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(200).json({ message: 'Logged out successfully' });
};
