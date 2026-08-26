import mongoose from 'mongoose';
import dns from 'node:dns';
import { env } from './env.js';

// Configure public DNS servers (Google / Cloudflare) to ensure reliable MongoDB Atlas SRV resolution
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch {
  // Ignore in environments where custom DNS servers cannot be set
}

export const connectDB = async (uri: string = env.MONGO_URI): Promise<typeof mongoose> => {
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
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
