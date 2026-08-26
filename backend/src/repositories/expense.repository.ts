import mongoose, { Types } from 'mongoose';
import { Expense, IExpenseDocument } from '../models/Expense.js';
import {
  ExpenseQueryParams,
  DashboardSummary,
  CategoryAnalyticsItem,
  MonthlyAnalyticsItem,
  TrendAnalyticsItem,
} from '../types/expense.types.js';
import { ExpenseCategory } from '../constants/categories.js';

export class ExpenseRepository {
  async create(data: {
    userId: string;
    category: ExpenseCategory;
    amount: number;
    currency?: string;
    expenseDate: Date;
    description?: string;
  }): Promise<IExpenseDocument> {
    return Expense.create({
      ...data,
      userId: new Types.ObjectId(data.userId),
    });
  }

  async findById(id: string, userId: string): Promise<IExpenseDocument | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    // Strict query-level tenant isolation
    return Expense.findOne({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId),
    });
  }

  async findAll(
    userId: string,
    params: ExpenseQueryParams
  ): Promise<{ expenses: IExpenseDocument[]; total: number; page: number; limit: number; totalPages: number }> {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(1000, Math.max(1, Number(params.limit) || 10));
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {
      userId: new Types.ObjectId(userId),
    };

    if (params.category) {
      filter.category = params.category;
    }

    if (params.from || params.to) {
      filter.expenseDate = {};
      if (params.from) {
        filter.expenseDate.$gte = new Date(params.from);
      }
      if (params.to) {
        // Set to end of day if only date is passed
        const toDate = new Date(params.to);
        toDate.setHours(23, 59, 59, 999);
        filter.expenseDate.$lte = toDate;
      }
    }

    if (params.search && params.search.trim() !== '') {
      // Escape regex special chars to prevent ReDoS / injection
      const escaped = params.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.description = { $regex: escaped, $options: 'i' };
    }

    const sortField = params.sortBy || 'expenseDate';
    const sortDirection = params.sortOrder === 'asc' ? 1 : -1;
    const sort: Record<string, 1 | -1> = { [sortField]: sortDirection, _id: -1 };

    const [expenses, total] = await Promise.all([
      Expense.find(filter).sort(sort).skip(skip).limit(limit),
      Expense.countDocuments(filter),
    ]);

    return {
      expenses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async update(
    id: string,
    userId: string,
    updateData: Partial<{
      category: ExpenseCategory;
      amount: number;
      currency: string;
      expenseDate: Date;
      description: string;
    }>
  ): Promise<IExpenseDocument | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    // Strict query-level tenant isolation
    return Expense.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId),
      },
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  async delete(id: string, userId: string): Promise<IExpenseDocument | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    // Strict query-level tenant isolation
    return Expense.findOneAndDelete({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId),
    });
  }

  async getSummary(userId: string): Promise<DashboardSummary> {
    const userObjectId = new Types.ObjectId(userId);
    const now = new Date();

    // Start of Today (local server date)
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Start of Current Week (Sunday)
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    
    // Start of Current Month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const result = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: '$amount' },
          totalCount: { $sum: 1 },
          spentToday: {
            $sum: {
              $cond: [{ $gte: ['$expenseDate', startOfToday] }, '$amount', 0],
            },
          },
          spentThisWeek: {
            $sum: {
              $cond: [{ $gte: ['$expenseDate', startOfWeek] }, '$amount', 0],
            },
          },
          spentThisMonth: {
            $sum: {
              $cond: [{ $gte: ['$expenseDate', startOfMonth] }, '$amount', 0],
            },
          },
        },
      },
    ]);

    if (!result || result.length === 0) {
      return {
        totalSpent: 0,
        spentToday: 0,
        spentThisWeek: 0,
        spentThisMonth: 0,
        totalCount: 0,
      };
    }

    const { totalSpent, spentToday, spentThisWeek, spentThisMonth, totalCount } = result[0];
    return {
      totalSpent: totalSpent || 0,
      spentToday: spentToday || 0,
      spentThisWeek: spentThisWeek || 0,
      spentThisMonth: spentThisMonth || 0,
      totalCount: totalCount || 0,
    };
  }

  async getCategoryAnalytics(userId: string, from?: Date, to?: Date): Promise<CategoryAnalyticsItem[]> {
    const matchStage: Record<string, any> = {
      userId: new Types.ObjectId(userId),
    };

    if (from || to) {
      matchStage.expenseDate = {};
      if (from) matchStage.expenseDate.$gte = from;
      if (to) {
        const toEnd = new Date(to);
        toEnd.setHours(23, 59, 59, 999);
        matchStage.expenseDate.$lte = toEnd;
      }
    }

    const [categoryGroups, totalAggregate] = await Promise.all([
      Expense.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: '$category',
            totalAmount: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { totalAmount: -1 } },
      ]),
      Expense.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            overallTotal: { $sum: '$amount' },
          },
        },
      ]),
    ]);

    const overallTotal = totalAggregate[0]?.overallTotal || 0;

    return categoryGroups.map((group) => ({
      category: group._id as ExpenseCategory,
      totalAmount: group.totalAmount,
      count: group.count,
      percentage: overallTotal > 0 ? Number(((group.totalAmount / overallTotal) * 100).toFixed(2)) : 0,
    }));
  }

  async getMonthlyAnalytics(userId: string, year: number = new Date().getFullYear()): Promise<MonthlyAnalyticsItem[]> {
    const userObjectId = new Types.ObjectId(userId);
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const monthlyData = await Expense.aggregate([
      {
        $match: {
          userId: userObjectId,
          expenseDate: { $gte: startOfYear, $lte: endOfYear },
        },
      },
      {
        $group: {
          _id: { $month: '$expenseDate' },
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id': 1 } },
    ]);

    const dataMap = new Map<number, { totalAmount: number; count: number }>();
    monthlyData.forEach((item) => {
      dataMap.set(item._id, { totalAmount: item.totalAmount, count: item.count });
    });

    // Populate all 12 months for consistent charts
    const result: MonthlyAnalyticsItem[] = [];
    for (let m = 1; m <= 12; m++) {
      const monthData = dataMap.get(m) || { totalAmount: 0, count: 0 };
      result.push({
        month: `${monthNames[m - 1]} ${year}`,
        year,
        monthNumber: m,
        totalAmount: monthData.totalAmount,
        count: monthData.count,
      });
    }

    return result;
  }

  async getTrendAnalytics(userId: string, monthsCount: number = 6): Promise<TrendAnalyticsItem[]> {
    const userObjectId = new Types.ObjectId(userId);
    const now = new Date();
    
    // Calculate start date N months ago
    const startDate = new Date(now.getFullYear(), now.getMonth() - (monthsCount - 1), 1);

    const trendData = await Expense.aggregate([
      {
        $match: {
          userId: userObjectId,
          expenseDate: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$expenseDate' },
            month: { $month: '$expenseDate' },
          },
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dataMap = new Map<string, { totalAmount: number; count: number }>();
    trendData.forEach((item) => {
      const key = `${item._id.year}-${String(item._id.month).padStart(2, '0')}`;
      dataMap.set(key, { totalAmount: item.totalAmount, count: item.count });
    });

    const result: TrendAnalyticsItem[] = [];
    for (let i = monthsCount - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const key = `${year}-${String(month).padStart(2, '0')}`;
      const label = `${monthNames[month - 1]} ${year}`;
      const data = dataMap.get(key) || { totalAmount: 0, count: 0 };
      
      result.push({
        date: label,
        totalAmount: data.totalAmount,
        count: data.count,
      });
    }

    return result;
  }

  async bulkInsert(expenses: Array<{
    userId: string;
    category: ExpenseCategory;
    amount: number;
    currency?: string;
    expenseDate: Date;
    description?: string;
  }>): Promise<IExpenseDocument[]> {
    const docs = expenses.map((e) => ({
      ...e,
      userId: new Types.ObjectId(e.userId),
    }));
    return Expense.insertMany(docs) as unknown as IExpenseDocument[];
  }
}

export const expenseRepository = new ExpenseRepository();
