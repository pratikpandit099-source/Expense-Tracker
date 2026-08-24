import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { setupTestDB } from '../setup.js';
import { ExpenseCategory } from '../../src/constants/categories.js';

describe('Expense Integration Tests', () => {
  setupTestDB();
  const app = createApp();
  let token: string;

  beforeEach(async () => {
    const reg = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'tester@example.com',
        password: 'Password123',
      });
    token = reg.body.data.accessToken;
  });

  describe('GET /api/expenses/categories', () => {
    it('should return fixed categories metadata without authentication', async () => {
      const res = await request(app).get('/api/expenses/categories');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.categories.length).toBe(11);
    });
  });

  describe('Expense CRUD & Filters', () => {
    it('should create an expense and retrieve it in the list', async () => {
      const createRes = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${token}`)
        .send({
          category: ExpenseCategory.GROCERIES,
          amount: 4550, // $45.50
          expenseDate: new Date().toISOString(),
          description: 'Weekly milk and eggs',
        });

      expect(createRes.status).toBe(201);
      expect(createRes.body.success).toBe(true);
      expect(createRes.body.data.expense.amount).toBe(4550);
      expect(createRes.body.data.expense.category).toBe(ExpenseCategory.GROCERIES);

      const listRes = await request(app)
        .get('/api/expenses')
        .set('Authorization', `Bearer ${token}`);

      expect(listRes.status).toBe(200);
      expect(listRes.body.data.expenses.length).toBe(1);
      expect(listRes.body.data.total).toBe(1);
    });

    it('should update an existing expense', async () => {
      const createRes = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${token}`)
        .send({
          category: ExpenseCategory.TRANSPORT,
          amount: 1500,
          expenseDate: new Date().toISOString(),
          description: 'Bus ticket',
        });

      const expenseId = createRes.body.data.expense._id;

      const updateRes = await request(app)
        .put(`/api/expenses/${expenseId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 2000,
          description: 'Updated bus & metro pass',
        });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.data.expense.amount).toBe(2000);
      expect(updateRes.body.data.expense.description).toBe('Updated bus & metro pass');
    });

    it('should delete an existing expense', async () => {
      const createRes = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${token}`)
        .send({
          category: ExpenseCategory.ENTERTAINMENT,
          amount: 1200,
          expenseDate: new Date().toISOString(),
          description: 'Cinema ticket',
        });

      const expenseId = createRes.body.data.expense._id;

      const delRes = await request(app)
        .delete(`/api/expenses/${expenseId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(delRes.status).toBe(200);

      // Verify it no longer exists
      const getRes = await request(app)
        .get(`/api/expenses/${expenseId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(getRes.status).toBe(404);
    });
  });

  describe('Analytics & Dashboard Aggregations', () => {
    it('should compute dashboard summary and category analytics correctly', async () => {
      // Seed expenses
      const seedRes = await request(app)
        .post('/api/expenses/seed')
        .set('Authorization', `Bearer ${token}`);

      expect(seedRes.status).toBe(201);
      expect(seedRes.body.data.count).toBeGreaterThan(0);

      // Check summary
      const summaryRes = await request(app)
        .get('/api/expenses/dashboard/summary')
        .set('Authorization', `Bearer ${token}`);

      expect(summaryRes.status).toBe(200);
      expect(summaryRes.body.data.totalSpent).toBeGreaterThan(0);
      expect(summaryRes.body.data.totalCount).toBeGreaterThan(0);

      // Check category analytics
      const catRes = await request(app)
        .get('/api/expenses/analytics/category')
        .set('Authorization', `Bearer ${token}`);

      expect(catRes.status).toBe(200);
      expect(catRes.body.data.categories.length).toBeGreaterThan(0);

      // Check monthly analytics
      const monthlyRes = await request(app)
        .get('/api/expenses/analytics/monthly')
        .set('Authorization', `Bearer ${token}`);

      expect(monthlyRes.status).toBe(200);
      expect(monthlyRes.body.data.monthly.length).toBe(12);

      // Check trend analytics
      const trendRes = await request(app)
        .get('/api/expenses/analytics/trend?months=6')
        .set('Authorization', `Bearer ${token}`);

      expect(trendRes.status).toBe(200);
      expect(trendRes.body.data.trend.length).toBe(6);
    });
  });
});
