import { expenseRepository, ExpenseRepository } from '../repositories/expense.repository.js';
import { IExpenseDocument } from '../models/Expense.js';
import {
  ExpenseQueryParams,
  DashboardSummary,
  CategoryAnalyticsItem,
  MonthlyAnalyticsItem,
  TrendAnalyticsItem,
} from '../types/expense.types.js';
import { CreateExpenseInput, UpdateExpenseInput } from '../validations/expense.validation.js';
import { ExpenseCategory } from '../constants/categories.js';
import { AppError } from './auth.service.js';

export class ExpenseService {
  constructor(private expenseRepo: ExpenseRepository = expenseRepository) {}

  async createExpense(userId: string, input: CreateExpenseInput): Promise<IExpenseDocument> {
    return this.expenseRepo.create({
      userId,
      category: input.category,
      amount: input.amount,
      currency: input.currency || 'USD',
      expenseDate: input.expenseDate,
      description: input.description || '',
    });
  }

  async getExpenses(userId: string, params: ExpenseQueryParams) {
    return this.expenseRepo.findAll(userId, params);
  }

  async getExpenseById(id: string, userId: string): Promise<IExpenseDocument> {
    const expense = await this.expenseRepo.findById(id, userId);
    if (!expense) {
      // 404 (not 403) to prevent leaking the existence of other users' IDs
      throw new AppError('Expense not found', 404);
    }
    return expense;
  }

  async updateExpense(id: string, userId: string, input: UpdateExpenseInput): Promise<IExpenseDocument> {
    const updated = await this.expenseRepo.update(id, userId, input as any);
    if (!updated) {
      // 404 to prevent leaking existence
      throw new AppError('Expense not found', 404);
    }
    return updated;
  }

  async deleteExpense(id: string, userId: string): Promise<void> {
    const deleted = await this.expenseRepo.delete(id, userId);
    if (!deleted) {
      // 404 to prevent leaking existence
      throw new AppError('Expense not found', 404);
    }
  }

  async getSummary(userId: string): Promise<DashboardSummary> {
    return this.expenseRepo.getSummary(userId);
  }

  async getCategoryAnalytics(userId: string, from?: string, to?: string): Promise<CategoryAnalyticsItem[]> {
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;
    return this.expenseRepo.getCategoryAnalytics(userId, fromDate, toDate);
  }

  async getMonthlyAnalytics(userId: string, year?: number): Promise<MonthlyAnalyticsItem[]> {
    return this.expenseRepo.getMonthlyAnalytics(userId, year);
  }

  async getTrendAnalytics(userId: string, months?: number): Promise<TrendAnalyticsItem[]> {
    return this.expenseRepo.getTrendAnalytics(userId, months);
  }

  async seedSampleExpenses(userId: string): Promise<{ count: number }> {
    const now = new Date();
    
    // Helper to generate a date N days ago
    const daysAgo = (days: number, hour: number = 12) => {
      const d = new Date(now);
      d.setDate(d.getDate() - days);
      d.setHours(hour, 30, 0, 0);
      return d;
    };

    const sampleExpenses = [
      // Today / This week
      {
        userId,
        category: ExpenseCategory.FOOD_DINING,
        amount: 2450, // $24.50
        currency: 'USD',
        expenseDate: daysAgo(0, 13),
        description: 'Lunch with colleagues at Bistro Cafe',
      },
      {
        userId,
        category: ExpenseCategory.TRANSPORT,
        amount: 1800, // $18.00
        currency: 'USD',
        expenseDate: daysAgo(1, 9),
        description: 'Uber ride to city center',
      },
      {
        userId,
        category: ExpenseCategory.GROCERIES,
        amount: 8640, // $86.40
        currency: 'USD',
        expenseDate: daysAgo(2, 17),
        description: 'Weekly organic grocery run at Whole Foods',
      },
      {
        userId,
        category: ExpenseCategory.ENTERTAINMENT,
        amount: 1599, // $15.99
        currency: 'USD',
        expenseDate: daysAgo(3, 20),
        description: 'Netflix monthly subscription',
      },
      {
        userId,
        category: ExpenseCategory.SHOPPING,
        amount: 4999, // $49.99
        currency: 'USD',
        expenseDate: daysAgo(5, 15),
        description: 'New wireless desk keyboard',
      },
      {
        userId,
        category: ExpenseCategory.BILLS,
        amount: 7500, // $75.00
        currency: 'USD',
        expenseDate: daysAgo(7, 10),
        description: 'High-speed fiber internet bill',
      },
      {
        userId,
        category: ExpenseCategory.HEALTH,
        amount: 3500, // $35.00
        currency: 'USD',
        expenseDate: daysAgo(10, 11),
        description: 'Monthly gym membership fee',
      },
      {
        userId,
        category: ExpenseCategory.FOOD_DINING,
        amount: 1450, // $14.50
        currency: 'USD',
        expenseDate: daysAgo(12, 14),
        description: 'Chipotle burrito bowl',
      },
      {
        userId,
        category: ExpenseCategory.RENT,
        amount: 120000, // $1200.00
        currency: 'USD',
        expenseDate: daysAgo(20, 9),
        description: 'Monthly apartment rent payment',
      },
      {
        userId,
        category: ExpenseCategory.EDUCATION,
        amount: 2999, // $29.99
        currency: 'USD',
        expenseDate: daysAgo(25, 16),
        description: 'TypeScript & System Design masterclass book',
      },
      {
        userId,
        category: ExpenseCategory.TRAVEL,
        amount: 18500, // $185.00
        currency: 'USD',
        expenseDate: daysAgo(35, 8),
        description: 'Weekend train tickets for mountain getaway',
      },
      {
        userId,
        category: ExpenseCategory.FOOD_DINING,
        amount: 4500, // $45.00
        currency: 'USD',
        expenseDate: daysAgo(45, 19),
        description: 'Dinner with friends at Italian Trattoria',
      },
      {
        userId,
        category: ExpenseCategory.SHOPPING,
        amount: 8900, // $89.00
        currency: 'USD',
        expenseDate: daysAgo(60, 12),
        description: 'Winter waterproof jacket',
      },
      {
        userId,
        category: ExpenseCategory.BILLS,
        amount: 6200, // $62.00
        currency: 'USD',
        expenseDate: daysAgo(75, 10),
        description: 'Electric and utilities bill',
      },
      {
        userId,
        category: ExpenseCategory.OTHERS,
        amount: 2200, // $22.00
        currency: 'USD',
        expenseDate: daysAgo(90, 15),
        description: 'Postal courier packaging and shipping',
      },
    ];

    const inserted = await this.expenseRepo.bulkInsert(sampleExpenses);
    return { count: inserted.length };
  }
}

export const expenseService = new ExpenseService();
