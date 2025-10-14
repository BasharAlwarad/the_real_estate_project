import { Request, Response } from 'express';
import { User } from '#models';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

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

  // Create JWT
  const jwtSecret = process.env.JWT_SECRET || 'devsecret';
  const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '7d' });
  // Set JWT cookie
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
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
