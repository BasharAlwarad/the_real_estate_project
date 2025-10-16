import mongoose from 'mongoose';
export const mongoDBConnect = async () => {
  const url = process.env.MONGO_URL;
  if (!url) {
    console.error('❌❌❌ MONGO_URL environment variable is not defined');
    process.exit(1);
  }

  try {
    await mongoose.connect(url);
    console.log('🟢🟢🟢 Connected to MongoDB 🤖 with Mongoose');
  } catch (error) {
    console.error('❌❌❌ Database connection error:', error);
    process.exit(1);
  }
};
