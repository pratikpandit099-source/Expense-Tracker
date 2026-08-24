import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository, UserRepository } from '../repositories/user.repository.js';
import { env } from '../config/env.js';
import { TokenPayload, AuthTokens, AuthenticatedUser } from '../types/auth.types.js';
import { RegisterInput, LoginInput } from '../validations/auth.validation.js';
import { IUserDocument } from '../models/User.js';

export class AppError extends Error {
  public statusCode: number;
  public errors?: Array<{ field?: string; issue: string }>;

  constructor(message: string, statusCode: number = 500, errors?: Array<{ field?: string; issue: string }>) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class AuthService {
  constructor(private userRepo: UserRepository = userRepository) {}

  generateTokens(user: IUserDocument): AuthTokens {
    const payload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      tokenVersion: user.tokenVersion,
    };

    // 15-minute access token
    const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: '15m',
    });

    // 7-day refresh token
    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async register(input: RegisterInput): Promise<{ user: AuthenticatedUser; tokens: AuthTokens }> {
    const existingUser = await this.userRepo.findByEmail(input.email);
    if (existingUser) {
      throw new AppError('An account with this email address already exists', 409, [
        { field: 'email', issue: 'Email already in use' },
      ]);
    }

    // Hash password with bcrypt cost factor 12
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(input.password, salt);

    const user = await this.userRepo.create({
      name: input.name,
      email: input.email,
      passwordHash,
    });

    const tokens = this.generateTokens(user);

    return {
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      tokens,
    };
  }

  async login(input: LoginInput): Promise<{ user: AuthenticatedUser; tokens: AuthTokens }> {
    const user = await this.userRepo.findByEmail(input.email);
    if (!user) {
      // Generic message to prevent email enumeration
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await user.comparePassword(input.password);
    if (!isMatch) {
      // Generic message to prevent password inference
      throw new AppError('Invalid email or password', 401);
    }

    const tokens = this.generateTokens(user);

    return {
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      tokens,
    };
  }

  async refreshTokens(refreshToken: string): Promise<{ user: AuthenticatedUser; tokens: AuthTokens }> {
    try {
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as TokenPayload;
      const user = await this.userRepo.findById(decoded.userId);

      if (!user) {
        throw new AppError('User account not found', 401);
      }

      // Check if refresh token was revoked via tokenVersion bump
      if (decoded.tokenVersion !== undefined && decoded.tokenVersion !== user.tokenVersion) {
        throw new AppError('Session has been revoked or expired. Please sign in again', 401);
      }

      const tokens = this.generateTokens(user);

      return {
        user: {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        tokens,
      };
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError('Invalid or expired session. Please sign in again', 401);
    }
  }

  async logout(userId: string): Promise<void> {
    await this.userRepo.incrementTokenVersion(userId);
  }

  async getMe(userId: string): Promise<AuthenticatedUser> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new AppError('User profile not found', 404);
    }

    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

export const authService = new AuthService();
