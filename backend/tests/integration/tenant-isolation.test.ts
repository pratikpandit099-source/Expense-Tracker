import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { setupTestDB } from '../setup.js';
import { ExpenseCategory } from '../../src/constants/categories.js';

describe('Multi-Tenant Data Isolation Security Tests', () => {
  setupTestDB();
  const app = createApp();

  it('proves User B cannot access, edit, delete, or aggregate User A’s data (returns 404 and isolated summaries)', async () => {
    // 1. Register User A
    const userARes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'User A',
        email: 'usera@example.com',
        password: 'Password123',
      });
    const tokenA = userARes.body.data.accessToken;

    // 2. Register User B
    const userBRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'User B',
        email: 'userb@example.com',
        password: 'Password123',
      });
    const tokenB = userBRes.body.data.accessToken;

    // 3. User A creates a confidential expense ($500.00)
    const expenseARes = await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        category: ExpenseCategory.RENT,
        amount: 50000, // $500.00
        expenseDate: new Date().toISOString(),
        description: 'User A Confidential Rent Payment',
      });

    const expenseAId = expenseARes.body.data.expense._id;
    expect(expenseAId).toBeDefined();

    // 4. User B attempts to GET User A's expense by exact ID
    const userBGetRes = await request(app)
      .get(`/api/expenses/${expenseAId}`)
      .set('Authorization', `Bearer ${tokenB}`);

    // Must return 404 (Not Found) rather than 403 to prevent ID enumeration
    expect(userBGetRes.status).toBe(404);
    expect(userBGetRes.body.success).toBe(false);
    expect(userBGetRes.body.message).toBe('Expense not found');

    // 5. User B attempts to PUT / update User A's expense
    const userBUpdateRes = await request(app)
      .put(`/api/expenses/${expenseAId}`)
      .set('Authorization', `Bearer ${tokenB}`)
      .send({
        amount: 100, // Attempt to tamper amount
        description: 'Hacked by User B',
      });

    expect(userBUpdateRes.status).toBe(404);
    expect(userBUpdateRes.body.success).toBe(false);

    // 6. User B attempts to DELETE User A's expense
    const userBDeleteRes = await request(app)
      .delete(`/api/expenses/${expenseAId}`)
      .set('Authorization', `Bearer ${tokenB}`);

    expect(userBDeleteRes.status).toBe(404);
    expect(userBDeleteRes.body.success).toBe(false);

    // 7. Verify User A's expense was NOT tampered with or deleted
    const userAGetRes = await request(app)
      .get(`/api/expenses/${expenseAId}`)
      .set('Authorization', `Bearer ${tokenA}`);

    expect(userAGetRes.status).toBe(200);
    expect(userAGetRes.body.data.expense.amount).toBe(50000);
    expect(userAGetRes.body.data.expense.description).toBe('User A Confidential Rent Payment');

    // 8. Verify User B listing expenses shows 0 items
    const userBListRes = await request(app)
      .get('/api/expenses')
      .set('Authorization', `Bearer ${tokenB}`);

    expect(userBListRes.status).toBe(200);
    expect(userBListRes.body.data.expenses.length).toBe(0);
    expect(userBListRes.body.data.total).toBe(0);

    // 9. Verify User B's dashboard summary is 0
    const userBSummaryRes = await request(app)
      .get('/api/expenses/dashboard/summary')
      .set('Authorization', `Bearer ${tokenB}`);

    expect(userBSummaryRes.status).toBe(200);
    expect(userBSummaryRes.body.data.totalSpent).toBe(0);
    expect(userBSummaryRes.body.data.totalCount).toBe(0);
  });
});
