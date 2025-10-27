import mongoose, { Document, Schema, Types } from 'mongoose';

interface IListing extends Document {
  title: string;
  price: number;
  image: string;
  owner: Types.ObjectId; // reference to User
  createdAt: Date;
  updatedAt: Date;
}

const ListingSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Listing = mongoose.model<IListing>('Home', ListingSchema);
