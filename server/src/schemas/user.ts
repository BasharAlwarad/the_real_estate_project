import { z } from 'zod';
import { Types } from 'mongoose';

export const userInputSchema = z
  .object({
    userName: z
      .string({ message: 'Username must be a string' })
      .min(2, { message: 'Username must be at least 2 characters' })
      .max(50, { message: 'Username cannot exceed 50 characters' })
      .trim(),
    email: z
      .string({ message: 'Email must be a string' })
      .email({ message: 'Please enter a valid email' })
      .toLowerCase()
      .trim(),
    image: z.string().url('Invalid image URL').optional(),
    password: z
      .string({ message: 'Password must be a string' })
      .min(6, { message: 'Password must be at least 6 characters' }),
  })
  .strict();

export const userUpdateSchema = z
  .object({
    userName: z
      .string({ message: 'Username must be a string' })
      .min(2, { message: 'Username must be at least 2 characters' })
      .max(50, { message: 'Username cannot exceed 50 characters' })
      .trim()
      .optional(),
    email: z
      .string({ message: 'Email must be a string' })
      .email({ message: 'Please enter a valid email' })
      .toLowerCase()
      .trim()
      .optional(),
    image: z.string().url('Invalid image URL').optional(),
    password: z
      .string({ message: 'Password must be a string' })
      .min(6, { message: 'Password must be at least 6 characters' })
      .optional(),
  })
  .strict();

export const userSchema = z
  .object({
    _id: z.instanceof(Types.ObjectId),
    ...userInputSchema.shape,
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();
