export enum ExpenseCategory {
  FOOD_DINING = 'Food & Dining',
  TRANSPORT = 'Transport',
  SHOPPING = 'Shopping',
  RENT = 'Rent',
  BILLS = 'Bills',
  GROCERIES = 'Groceries',
  ENTERTAINMENT = 'Entertainment',
  HEALTH = 'Health',
  EDUCATION = 'Education',
  TRAVEL = 'Travel',
  OTHERS = 'Others',
}

export interface CategoryMetadata {
  id: ExpenseCategory;
  name: string;
  icon: string;
  color: string;
  badgeBg: string;
  badgeText: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  _id: string;
  userId: string;
  category: ExpenseCategory;
  amount: number; // in cents
  currency: string;
  expenseDate: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSummary {
  totalSpent: number;
  spentToday: number;
  spentThisWeek: number;
  spentThisMonth: number;
  totalCount: number;
}

export interface CategoryAnalyticsItem {
  category: ExpenseCategory;
  totalAmount: number;
  count: number;
  percentage: number;
}

export interface MonthlyAnalyticsItem {
  month: string;
  year: number;
  monthNumber: number;
  totalAmount: number;
  count: number;
}

export interface TrendAnalyticsItem {
  date: string;
  totalAmount: number;
  count: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errors?: Array<{ field?: string; issue: string }>;
}

export interface PaginatedExpenses {
  expenses: Expense[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ExpenseFilterParams {
  category?: string;
  from?: string;
  to?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'expenseDate' | 'amount' | 'category' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}
