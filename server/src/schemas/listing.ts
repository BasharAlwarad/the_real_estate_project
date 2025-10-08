import { z } from 'zod';
import { Types } from 'mongoose';

export const listingInputSchema = z
  .object({
    title: z
      .string({ message: 'Title must be a string' })
      .min(1, { message: 'Title is required' })
      .trim()
      .optional(),
    price: z
      .number({ message: 'Price must be a number' })
      .min(0, { message: 'Price must be positive' })
      .optional(),
    // Flexible image field that accepts:
    // 1. URL strings (when user provides a URL)
    // 2. Any string (when cloudUploader middleware sets the Cloudinary URL)
    // 3. undefined (when no image is provided in updates)
    image: z
      .union([
        z.string().url('Invalid image URL'), // For direct URL inputs
        z.string().min(1, 'Image cannot be empty'), // For any non-empty string (Cloudinary URLs)
      ])
      .optional(),
  })
  .strict();

// Schema for listing creation - requires essential fields
export const listingCreateSchema = listingInputSchema.extend({
  title: z
    .string({ message: 'Title must be a string' })
    .min(1, { message: 'Title is required' })
    .trim(),
  price: z
    .number({ message: 'Price must be a number' })
    .min(0, { message: 'Price must be positive' }),
});

// Alias for updates (same as base schema with all optional fields)
export const listingUpdateSchema = listingInputSchema;

export const listingSchema = z
  .object({
    _id: z.instanceof(Types.ObjectId),
    ...listingCreateSchema.shape, // Use create schema shape to ensure all required fields exist
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();
