import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async (uri: string = env.MONGO_URI): Promise<typeof mongoose> => {
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    if (env.NODE_ENV !== 'test') {
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    }
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
};
