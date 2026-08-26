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

  // Security headers (configure cross-origin policies)
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // CORS configuration
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, Postman)
        if (!origin) return callback(null, true);

        const originClean = origin.replace(/\/+$/, '');
        const clientUrlClean = (env.CLIENT_URL || '').replace(/\/+$/, '');

        const isAllowed =
          env.NODE_ENV === 'development' ||
          originClean === clientUrlClean ||
          originClean === 'http://localhost:5173' ||
          originClean === 'http://localhost:3000' ||
          originClean === 'http://127.0.0.1:5173' ||
          originClean.endsWith('.vercel.app') ||
          originClean.endsWith('.onrender.com');

        if (isAllowed) {
          return callback(null, true);
        }

        return callback(new Error(`CORS blocked for origin: ${origin}`));
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

  // Root health check endpoint
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
