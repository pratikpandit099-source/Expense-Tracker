import { Response, NextFunction } from 'express';
import { expenseService, ExpenseService } from '../services/expense.service.js';
import { AuthRequest } from '../types/auth.types.js';
import { CATEGORIES_LIST } from '../constants/categories.js';
import { AppError } from '../services/auth.service.js';

export class ExpenseController {
  constructor(private service: ExpenseService = expenseService) {}

  getCategories = async (_req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({
        success: true,
        message: 'Categories retrieved successfully',
        data: {
          categories: CATEGORIES_LIST,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  createExpense = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);

      const expense = await this.service.createExpense(req.user._id, req.body);

      res.status(201).json({
        success: true,
        message: 'Expense created successfully',
        data: {
          expense,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  getExpenses = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);

      const result = await this.service.getExpenses(req.user._id, req.query as any);

      res.status(200).json({
        success: true,
        message: 'Expenses retrieved successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getExpenseById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);

      const expense = await this.service.getExpenseById(req.params.id, req.user._id);

      res.status(200).json({
        success: true,
        message: 'Expense retrieved successfully',
        data: {
          expense,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  updateExpense = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);

      const expense = await this.service.updateExpense(req.params.id, req.user._id, req.body);

      res.status(200).json({
        success: true,
        message: 'Expense updated successfully',
        data: {
          expense,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  deleteExpense = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);

      await this.service.deleteExpense(req.params.id, req.user._id);

      res.status(200).json({
        success: true,
        message: 'Expense deleted successfully',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  };

  getSummary = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);

      const summary = await this.service.getSummary(req.user._id);

      res.status(200).json({
        success: true,
        message: 'Dashboard summary retrieved successfully',
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  };

  getCategoryAnalytics = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);

      const { from, to } = req.query as { from?: string; to?: string };
      const analytics = await this.service.getCategoryAnalytics(req.user._id, from, to);

      res.status(200).json({
        success: true,
        message: 'Category analytics retrieved successfully',
        data: {
          categories: analytics,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  getMonthlyAnalytics = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);

      const year = req.query.year ? Number(req.query.year) : undefined;
      const analytics = await this.service.getMonthlyAnalytics(req.user._id, year);

      res.status(200).json({
        success: true,
        message: 'Monthly analytics retrieved successfully',
        data: {
          monthly: analytics,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  getTrendAnalytics = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);

      const months = req.query.months ? Number(req.query.months) : undefined;
      const analytics = await this.service.getTrendAnalytics(req.user._id, months);

      res.status(200).json({
        success: true,
        message: 'Trend analytics retrieved successfully',
        data: {
          trend: analytics,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  seedExpenses = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);

      const result = await this.service.seedSampleExpenses(req.user._id);

      res.status(201).json({
        success: true,
        message: `Successfully generated ${result.count} demo expenses across categories`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const expenseController = new ExpenseController();
