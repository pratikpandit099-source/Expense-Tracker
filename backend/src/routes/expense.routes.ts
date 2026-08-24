import { Router } from 'express';
import { expenseController } from '../controllers/expense.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validateBody, validateQuery } from '../middleware/validate.middleware.js';
import {
  createExpenseSchema,
  updateExpenseSchema,
  expenseQuerySchema,
  categoryAnalyticsQuerySchema,
  monthlyAnalyticsQuerySchema,
  trendAnalyticsQuerySchema,
} from '../validations/expense.validation.js';

const router = Router();

// Public categories endpoint
router.get('/categories', expenseController.getCategories);

// Protected routes below
router.use(authMiddleware);

// Analytics and Dashboard routes (must come before /:id)
router.get('/dashboard/summary', expenseController.getSummary);
router.get('/analytics/category', validateQuery(categoryAnalyticsQuerySchema), expenseController.getCategoryAnalytics);
router.get('/analytics/monthly', validateQuery(monthlyAnalyticsQuerySchema), expenseController.getMonthlyAnalytics);
router.get('/analytics/trend', validateQuery(trendAnalyticsQuerySchema), expenseController.getTrendAnalytics);
router.post('/seed', expenseController.seedExpenses);

// CRUD operations
router.post('/', validateBody(createExpenseSchema), expenseController.createExpense);
router.get('/', validateQuery(expenseQuerySchema), expenseController.getExpenses);
router.get('/:id', expenseController.getExpenseById);
router.put('/:id', validateBody(updateExpenseSchema), expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);

export default router;
