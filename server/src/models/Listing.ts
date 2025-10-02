import mongoose, { Document, Schema } from 'mongoose';

interface IListing extends Document {
  title: string;
  price: number;
  image: string;
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
  },
  {
    timestamps: true,
  }
);

export const Listing = mongoose.model<IListing>('Home', ListingSchema);
