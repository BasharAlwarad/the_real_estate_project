import { z } from 'zod';
import { Types } from 'mongoose';

export const userInputSchema = z
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
    image: z
      .union([
        z.string().url('Invalid image URL'),
        z.string().min(1, 'Image cannot be empty'),
      ])
      .optional(),
    password: z
      .string({ message: 'Password must be a string' })
      .min(6, { message: 'Password must be at least 6 characters' })
      .optional(),
  })
  .strict();

// Schema for user creation - requires essential fields
export const userCreateSchema = userInputSchema.extend({
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
  password: z
    .string({ message: 'Password must be a string' })
    .min(6, { message: 'Password must be at least 6 characters' }),
});

// Alias for updates (same as base schema with all optional fields)
export const userUpdateSchema = userInputSchema;

export const userSchema = z
  .object({
    _id: z.instanceof(Types.ObjectId),
    ...userCreateSchema.shape,
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();
