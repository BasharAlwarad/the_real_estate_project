import { Request, Response } from 'express';
import { User, RefreshToken } from '#models';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// TEACHING: This controller handles login, refresh, and logout using JWT and refresh tokens.
// - Access token: short-lived, sent as httpOnly cookie
// - Refresh token: long-lived, sent as httpOnly cookie, allows getting new access tokens

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  const user = await User.findOne({ email });
  if (!user || !user.password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Compare password with bcrypt
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Create access token (short-lived: 15 minutes)
  const jwtSecret = process.env.JWT_SECRET || 'devsecret';
  const accessToken = jwt.sign({ userId: user._id }, jwtSecret, {
    expiresIn: '15m',
  });

  // Create refresh token (long-lived: 7 days)
  const refreshToken = jwt.sign({ userId: user._id }, jwtSecret, {
    expiresIn: '7d',
  });

  // Hash refresh token before storing in database using bcrypt
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

  // Save refresh token to database
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

  await RefreshToken.create({
    userId: user._id,
    token: hashedRefreshToken,
    expiresAt,
  });

  // Set access token cookie (short-lived)
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  // Set refresh token cookie (long-lived)
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Return user info (excluding password)
  const { _id, userName, image, createdAt, updatedAt } = user;
  return res.json({
    user: { _id, userName, email, image, createdAt, updatedAt },
  });
};
// Create user controller (example, add to your user controller file)

export const getMe = async (req: Request, res: Response) => {
  const userId = (req as any).userId as string | undefined;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const user = await User.findById(userId).select('-password');
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  return res.json({ user });
};

/**
 * Refresh Access Token
 *
 * This endpoint accepts a refresh token and issues a new access token.
 * Teaching points:
 * 1. Reads refresh token from httpOnly cookie
 * 2. Verifies token is valid JWT
 * 3. Checks token exists in database
 * 4. Issues new short-lived access token
 */
export const refresh = async (req: Request, res: Response) => {
  // TEACHING: This endpoint lets the user get a new access token using a valid refresh token
  // 1. Checks refresh token cookie
  // 2. Verifies JWT
  // 3. Looks up hashed token in DB
  // 4. If valid, sends new access token as cookie
  // NOTE: In real apps, rotate refresh tokens for more security

  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  try {
    // Verify refresh token is valid JWT
    const jwtSecret = process.env.JWT_SECRET || 'devsecret';
    const payload = jwt.verify(refreshToken, jwtSecret) as { userId: string };

    // Find all refresh tokens for this user
    const tokenDocs = await RefreshToken.find({
      userId: payload.userId,
    });

    // Check each token to find a match using bcrypt.compare
    let validTokenDoc = null;
    for (const tokenDoc of tokenDocs) {
      const isMatch = await bcrypt.compare(refreshToken, tokenDoc.token);
      if (isMatch) {
        validTokenDoc = tokenDoc;
        break;
      }
    }

    if (!validTokenDoc) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Check if token is expired
    if (validTokenDoc.expiresAt < new Date()) {
      // Clean up expired token
      await RefreshToken.deleteOne({ _id: validTokenDoc._id });
      return res.status(401).json({ message: 'Refresh token expired' });
    }

    // Create new access token (15 minutes)
    const newAccessToken = jwt.sign({ userId: payload.userId }, jwtSecret, {
      expiresIn: '15m',
    });

    // Set new access token cookie
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return res.json({ message: 'Token refreshed successfully' });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};

/**
 * Logout Controller
 *
 * Clears both access and refresh token cookies and removes refresh token from database.
 * Teaching points:
 * 1. Clear both cookies
 * 2. Delete refresh token from database to revoke it
 */
export const logout = async (req: Request, res: Response) => {
  // TEACHING: This endpoint logs the user out by clearing both cookies and deleting the refresh token from DB
  const refreshToken = req.cookies?.refreshToken;

  // If there's a refresh token, delete it from database
  if (refreshToken) {
    try {
      // Verify the JWT to get userId
      const jwtSecret = process.env.JWT_SECRET || 'devsecret';
      const payload = jwt.verify(refreshToken, jwtSecret) as { userId: string };

      // Find all refresh tokens for this user
      const tokenDocs = await RefreshToken.find({
        userId: payload.userId,
      });

      // Find and delete the matching token using bcrypt.compare
      for (const tokenDoc of tokenDocs) {
        const isMatch = await bcrypt.compare(refreshToken, tokenDoc.token);
        if (isMatch) {
          await RefreshToken.deleteOne({ _id: tokenDoc._id });
          break;
        }
      }
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
