import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AuthRequest, TokenPayload } from '../types/auth.types.js';
import { userRepository } from '../repositories/user.repository.js';
import { AppError } from '../services/auth.service.js';

export const authMiddleware = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      throw new AppError('Authentication required. Please provide a valid token', 401);
    }

    let decoded: TokenPayload;
    try {
      decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        throw new AppError('Access token has expired. Please refresh your session', 401);
      }
      throw new AppError('Invalid authentication token', 401);
    }

    const user = await userRepository.findById(decoded.userId);
    if (!user) {
      throw new AppError('The user account associated with this token no longer exists', 401);
    }

    // Attach minimal authenticated user info to request
    req.user = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    next();
  } catch (error) {
    next(error);
  }
};
