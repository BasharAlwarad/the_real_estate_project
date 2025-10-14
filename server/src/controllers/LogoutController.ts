import { Request, Response } from 'express';

export const logout = (req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  res.status(200).json({ message: 'Logged out successfully' });
};
