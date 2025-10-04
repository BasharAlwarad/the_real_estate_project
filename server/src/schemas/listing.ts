import { z } from 'zod';
import { Types } from 'mongoose';

export const listingInputSchema = z
  .object({
    title: z
      .string({ message: 'Title must be a string' })
      .min(1, {
        message: 'Title is required',
      })
      .trim(),
    price: z.number({ message: 'Price must be a number' }).min(0, {
      message: 'Price must be positive',
    }),
    image: z.string().url('Invalid image URL').optional(),
  })
  .strict();

export const listingSchema = z
  .object({
    _id: z.instanceof(Types.ObjectId),
    ...listingInputSchema.shape,
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();
