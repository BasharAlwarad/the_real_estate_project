import mongoose, { Document, Schema } from 'mongoose';

/**
 * RefreshToken Model
 *
 * Stores refresh tokens for users to enable token refresh functionality.
 * Each refresh token is hashed before storage for security.
 */

interface IRefreshToken extends Document {
  userId: mongoose.Types.ObjectId;
  token: string; // hashed token
  expiresAt: Date;
  createdAt: Date;
}

const RefreshTokenSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true, // For cleanup queries
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient cleanup of expired tokens
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshToken = mongoose.model<IRefreshToken>(
  'RefreshToken',
  RefreshTokenSchema
);
