import { Request, Response, NextFunction } from 'express';
import { authService, AuthService, AppError } from '../services/auth.service.js';
import { AuthRequest } from '../types/auth.types.js';
import { env } from '../config/env.js';

const REFRESH_COOKIE_NAME = 'refreshToken';

const getCookieOptions = () => ({
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: (env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  path: '/',
});

export class AuthController {
  constructor(private service: AuthService = authService) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user, tokens } = await this.service.register(req.body);

      res.cookie(REFRESH_COOKIE_NAME, tokens.refreshToken, getCookieOptions());

      res.status(201).json({
        success: true,
        message: 'Account registered successfully',
        data: {
          user,
          accessToken: tokens.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user, tokens } = await this.service.login(req.body);

      res.cookie(REFRESH_COOKIE_NAME, tokens.refreshToken, getCookieOptions());

      res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        data: {
          user,
          accessToken: tokens.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tokenFromCookie = req.cookies?.[REFRESH_COOKIE_NAME];
      const tokenFromBody = req.body?.refreshToken;
      const refreshToken = tokenFromCookie || tokenFromBody;

      if (!refreshToken) {
        throw new AppError('Refresh token is required', 401);
      }

      const { user, tokens } = await this.service.refreshTokens(refreshToken);

      res.cookie(REFRESH_COOKIE_NAME, tokens.refreshToken, getCookieOptions());

      res.status(200).json({
        success: true,
        message: 'Session refreshed successfully',
        data: {
          user,
          accessToken: tokens.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.user) {
        await this.service.logout(req.user._id);
      }

      res.clearCookie(REFRESH_COOKIE_NAME, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: (env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
        path: '/',
      });

      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const user = await this.service.getMe(req.user._id);

      res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
