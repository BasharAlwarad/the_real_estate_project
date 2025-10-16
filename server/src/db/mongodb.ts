import mongoose from 'mongoose';
const MONGO_URL = process.env.MONGO_URL;
export const mongoDBConnect = async () => {
  if (!MONGO_URL) {
    console.error('❌❌❌ MONGO_URL environment variable is not set.');
    process.exit(1);
  }
  try {
    await mongoose.connect(MONGO_URL);
    console.log('🟢🟢🟢 Connected to MongoDB 🤖 with Mongoose');
  } catch (error) {
    console.error('❌❌❌ Database connection error:', error);
    process.exit(1);
  }
};
