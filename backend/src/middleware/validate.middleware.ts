import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from '../services/auth.service.js';

export const validateBody = (schema: ZodSchema) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync(req.body);
      req.body = parsed;
      next();
    } catch (error: any) {
      if (error instanceof ZodError || error?.errors) {
        const errors = (error.errors || []).map((err: any) => ({
          field: Array.isArray(err.path) ? err.path.join('.') : String(err.path || ''),
          issue: err.message || 'Validation error',
        }));
        next(new AppError('Validation failed', 400, errors));
      } else {
        next(error);
      }
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync(req.query);
      req.query = parsed as any;
      next();
    } catch (error: any) {
      if (error instanceof ZodError || error?.errors) {
        const errors = (error.errors || []).map((err: any) => ({
          field: Array.isArray(err.path) ? err.path.join('.') : String(err.path || ''),
          issue: err.message || 'Invalid parameter',
        }));
        next(new AppError('Invalid query parameters', 400, errors));
      } else {
        next(error);
      }
    }
  };
};
