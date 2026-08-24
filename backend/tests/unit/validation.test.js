"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const auth_validation_js_1 = require("../../src/validations/auth.validation.js");
const expense_validation_js_1 = require("../../src/validations/expense.validation.js");
const categories_js_1 = require("../../src/constants/categories.js");
(0, vitest_1.describe)('Validation Schemas Unit Tests', () => {
    (0, vitest_1.describe)('registerSchema', () => {
        (0, vitest_1.it)('should validate valid registration input', () => {
            const valid = {
                name: 'Alex Johnson',
                email: 'alex@example.com',
                password: 'Password123',
                confirmPassword: 'Password123',
            };
            const result = auth_validation_js_1.registerSchema.safeParse(valid);
            (0, vitest_1.expect)(result.success).toBe(true);
        });
        (0, vitest_1.it)('should fail if password has no number', () => {
            const invalid = {
                name: 'Alex Johnson',
                email: 'alex@example.com',
                password: 'PasswordOnly',
            };
            const result = auth_validation_js_1.registerSchema.safeParse(invalid);
            (0, vitest_1.expect)(result.success).toBe(false);
        });
        (0, vitest_1.it)('should fail if password is shorter than 8 chars', () => {
            const invalid = {
                name: 'Alex',
                email: 'alex@example.com',
                password: 'Pass1',
            };
            const result = auth_validation_js_1.registerSchema.safeParse(invalid);
            (0, vitest_1.expect)(result.success).toBe(false);
        });
        (0, vitest_1.it)('should fail if passwords do not match', () => {
            const invalid = {
                name: 'Alex Johnson',
                email: 'alex@example.com',
                password: 'Password123',
                confirmPassword: 'Password456',
            };
            const result = auth_validation_js_1.registerSchema.safeParse(invalid);
            (0, vitest_1.expect)(result.success).toBe(false);
        });
    });
    (0, vitest_1.describe)('createExpenseSchema', () => {
        (0, vitest_1.it)('should validate valid expense input', () => {
            const valid = {
                category: categories_js_1.ExpenseCategory.FOOD_DINING,
                amount: 2500, // $25.00
                expenseDate: '2026-08-24T12:00:00.000Z',
                description: 'Dinner at Italian restaurant',
            };
            const result = expense_validation_js_1.createExpenseSchema.safeParse(valid);
            (0, vitest_1.expect)(result.success).toBe(true);
        });
        (0, vitest_1.it)('should fail if amount is negative or 0', () => {
            const invalid = {
                category: categories_js_1.ExpenseCategory.FOOD_DINING,
                amount: 0,
                expenseDate: '2026-08-24T12:00:00.000Z',
            };
            const result = expense_validation_js_1.createExpenseSchema.safeParse(invalid);
            (0, vitest_1.expect)(result.success).toBe(false);
        });
        (0, vitest_1.it)('should fail if category is invalid enum value', () => {
            const invalid = {
                category: 'Gambling & Crypto',
                amount: 5000,
                expenseDate: '2026-08-24T12:00:00.000Z',
            };
            const result = expense_validation_js_1.createExpenseSchema.safeParse(invalid);
            (0, vitest_1.expect)(result.success).toBe(false);
        });
    });
});
