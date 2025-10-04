import mongoose from 'mongoose';
const MONGO_URL = process.env.MONGO_URL;
export const mongoDBConnect = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('🟢🟢🟢 Connected to MongoDB 🤖 with Mongoose');
  } catch (error) {
    console.error('❌❌❌ Database connection error:', error);
    process.exit(1);
  }
};
