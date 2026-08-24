import { createApp } from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';

const startServer = async () => {
  try {
    // Connect to MongoDB Atlas / Local MongoDB
    await connectDB(env.MONGO_URI);

    const app = createApp();

    const server = app.listen(env.PORT, () => {
      console.log(`🚀 ExpenseFlow API server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
      console.log(`📡 Health check available at: http://localhost:${env.PORT}/`);
    });

    // Graceful shutdown handling
    const shutdown = async (signal: string) => {
      console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        console.log('🔒 HTTP server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('💥 Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
