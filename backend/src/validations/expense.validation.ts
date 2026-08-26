import { z } from 'zod';
import { ExpenseCategory } from '../constants/categories.js';

export const createExpenseSchema = z.object({
  category: z.nativeEnum(ExpenseCategory, {
    errorMap: () => ({ message: 'Invalid category. Must be one of the supported expense categories' }),
  }),
  amount: z
    .number({ required_error: 'Amount is required' })
    .int('Amount must be an integer represented in minor units (cents)')
    .positive('Amount must be greater than 0'),
  currency: z.string().trim().min(3).max(3).default('USD').optional(),
  expenseDate: z
    .string({ required_error: 'Expense date is required' })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid expense date format. Must be a valid ISO date string',
    })
    .transform((val) => new Date(val)),
  description: z
    .string()
    .trim()
    .max(500, 'Description cannot exceed 500 characters')
    .default('')
    .optional(),
});

export const updateExpenseSchema = z.object({
  category: z.nativeEnum(ExpenseCategory).optional(),
  amount: z
    .number()
    .int('Amount must be an integer represented in minor units (cents)')
    .positive('Amount must be greater than 0')
    .optional(),
  currency: z.string().trim().min(3).max(3).optional(),
  expenseDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid expense date format',
    })
    .transform((val) => new Date(val))
    .optional(),
  description: z.string().trim().max(500, 'Description cannot exceed 500 characters').optional(),
});

export const expenseQuerySchema = z.object({
  category: z.nativeEnum(ExpenseCategory).optional(),
  from: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid "from" date format' })
    .optional(),
  to: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid "to" date format' })
    .optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(1000).default(10).optional(),
  sortBy: z.enum(['expenseDate', 'amount', 'category', 'createdAt']).default('expenseDate').optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
});

export const categoryAnalyticsQuerySchema = z.object({
  from: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid "from" date' })
    .optional(),
  to: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid "to" date' })
    .optional(),
});

export const monthlyAnalyticsQuerySchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100).default(new Date().getFullYear()).optional(),
});

export const trendAnalyticsQuerySchema = z.object({
  months: z.coerce.number().int().min(2).max(24).default(6).optional(),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
