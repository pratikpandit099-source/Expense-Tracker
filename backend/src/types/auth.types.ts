import { Request } from 'express';
import { IUserDocument } from '../models/User.js';

export interface TokenPayload {
  userId: string;
  email: string;
  tokenVersion?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthenticatedUser {
  _id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}
