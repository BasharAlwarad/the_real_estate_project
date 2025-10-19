import mongoose from 'mongoose';

const MONGO_URL = process.env.MONGO_URL || '';

export const mongoDBConnect = async () => {
  try {
    if (!MONGO_URL) {
      throw new Error('MONGO_URL environment variable is not defined');
    }
    await mongoose.connect(MONGO_URL);
    console.log('🟢🟢🟢 Auth Service Connected to MongoDB 🤖 with Mongoose');
  } catch (error) {
    console.error('❌❌❌ Auth Service Database connection error:', error);
    process.exit(1);
  }
};
