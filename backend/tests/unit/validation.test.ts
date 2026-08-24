import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema } from '../../src/validations/auth.validation.js';
import { createExpenseSchema, expenseQuerySchema } from '../../src/validations/expense.validation.js';
import { ExpenseCategory } from '../../src/constants/categories.js';

describe('Validation Schemas Unit Tests', () => {
  describe('registerSchema', () => {
    it('should validate valid registration input', () => {
      const valid = {
        name: 'Alex Johnson',
        email: 'alex@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
      };
      const result = registerSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should fail if password has no number', () => {
      const invalid = {
        name: 'Alex Johnson',
        email: 'alex@example.com',
        password: 'PasswordOnly',
      };
      const result = registerSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should fail if password is shorter than 8 chars', () => {
      const invalid = {
        name: 'Alex',
        email: 'alex@example.com',
        password: 'Pass1',
      };
      const result = registerSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should fail if passwords do not match', () => {
      const invalid = {
        name: 'Alex Johnson',
        email: 'alex@example.com',
        password: 'Password123',
        confirmPassword: 'Password456',
      };
      const result = registerSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('createExpenseSchema', () => {
    it('should validate valid expense input', () => {
      const valid = {
        category: ExpenseCategory.FOOD_DINING,
        amount: 2500, // $25.00
        expenseDate: '2026-08-24T12:00:00.000Z',
        description: 'Dinner at Italian restaurant',
      };
      const result = createExpenseSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should fail if amount is negative or 0', () => {
      const invalid = {
        category: ExpenseCategory.FOOD_DINING,
        amount: 0,
        expenseDate: '2026-08-24T12:00:00.000Z',
      };
      const result = createExpenseSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should fail if category is invalid enum value', () => {
      const invalid = {
        category: 'Gambling & Crypto',
        amount: 5000,
        expenseDate: '2026-08-24T12:00:00.000Z',
      };
      const result = createExpenseSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });
});
