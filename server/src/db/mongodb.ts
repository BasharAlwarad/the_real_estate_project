import mongoose from 'mongoose';
const MONGO_URL: string = process.env.MONGO_URL || '';
export const mongoDBConnect = async () => {
  try {
    if (!MONGO_URL) {
      throw new Error('MONGO_URL is not defined');
    }
    await mongoose.connect(MONGO_URL);
    console.log('🟢🟢🟢 Connected to MongoDB 🤖 with Mongoose');
  } catch (error) {
    console.error('❌❌❌ Database connection error:', error);
    process.exit(1);
  }
};
