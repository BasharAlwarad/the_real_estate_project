import { Request, Response } from 'express';
import { User } from '#models';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  const user = await User.findOne({ email });
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  // Generate a random session string
  const session = Math.random().toString(36).slice(2);
  // Return session string and user info (excluding password)
  const { _id, userName, image, createdAt, updatedAt } = user;
  res.json({
    session,
    user: { _id, userName, email, image, createdAt, updatedAt },
  });
  return;
};
