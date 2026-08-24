import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';
import { apiLimiter } from './middleware/rateLimit.middleware.js';

export const createApp = (): Express => {
  const app = express();

  // Trust proxy for secure cookies on Render / reverse proxies
  app.set('trust proxy', 1);

  // Security headers
  app.use(helmet());

  // CORS configuration
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        
        // Match exact CLIENT_URL or localhost in development
        const allowedOrigins = [
          env.CLIENT_URL,
          'http://localhost:5173',
          'http://localhost:3000',
          'http://127.0.0.1:5173',
        ];
        
        if (allowedOrigins.includes(origin) || env.NODE_ENV === 'development') {
          return callback(null, true);
        }
        
        return callback(new Error('Blocked by CORS policy'));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Body and cookie parsing
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cookieParser());

  // Root health check endpoint (as specified in Section 13)
  app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'ExpenseFlow API is running',
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  });

  // Apply general API rate limiter to /api
  app.use('/api', apiLimiter);

  // Mount API routes
  app.use('/api', routes);

  // Catch-all 404 handler for undefined API routes
  app.use('*', (_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: 'Resource or endpoint not found',
    });
  });

  // Centralized error handler
  app.use(errorHandler);

  return app;
};
