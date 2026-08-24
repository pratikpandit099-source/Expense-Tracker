import { ExpenseCategory } from '../constants/categories.js';

export interface ExpenseQueryParams {
  category?: ExpenseCategory;
  from?: string;
  to?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'expenseDate' | 'amount' | 'category' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface DashboardSummary {
  totalSpent: number; // in cents
  spentToday: number; // in cents
  spentThisWeek: number; // in cents
  spentThisMonth: number; // in cents
  totalCount: number;
}

export interface CategoryAnalyticsItem {
  category: ExpenseCategory;
  totalAmount: number; // in cents
  count: number;
  percentage: number;
}

export interface MonthlyAnalyticsItem {
  month: string; // e.g. "2026-01" or "Jan"
  year: number;
  monthNumber: number;
  totalAmount: number; // in cents
  count: number;
}

export interface TrendAnalyticsItem {
  date: string; // e.g. "2026-08-01" or "Aug 26"
  totalAmount: number; // in cents
  count: number;
}
