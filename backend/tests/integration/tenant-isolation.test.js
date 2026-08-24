"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const app_js_1 = require("../../src/app.js");
const setup_js_1 = require("../setup.js");
const categories_js_1 = require("../../src/constants/categories.js");
(0, vitest_1.describe)('Multi-Tenant Data Isolation Security Tests', () => {
    (0, setup_js_1.setupTestDB)();
    const app = (0, app_js_1.createApp)();
    (0, vitest_1.it)('proves User B cannot access, edit, delete, or aggregate User A’s data (returns 404 and isolated summaries)', async () => {
        // 1. Register User A
        const userARes = await (0, supertest_1.default)(app)
            .post('/api/auth/register')
            .send({
            name: 'User A',
            email: 'usera@example.com',
            password: 'Password123',
        });
        const tokenA = userARes.body.data.accessToken;
        // 2. Register User B
        const userBRes = await (0, supertest_1.default)(app)
            .post('/api/auth/register')
            .send({
            name: 'User B',
            email: 'userb@example.com',
            password: 'Password123',
        });
        const tokenB = userBRes.body.data.accessToken;
        // 3. User A creates a confidential expense ($500.00)
        const expenseARes = await (0, supertest_1.default)(app)
            .post('/api/expenses')
            .set('Authorization', `Bearer ${tokenA}`)
            .send({
            category: categories_js_1.ExpenseCategory.RENT,
            amount: 50000, // $500.00
            expenseDate: new Date().toISOString(),
            description: 'User A Confidential Rent Payment',
        });
        const expenseAId = expenseARes.body.data.expense._id;
        (0, vitest_1.expect)(expenseAId).toBeDefined();
        // 4. User B attempts to GET User A's expense by exact ID
        const userBGetRes = await (0, supertest_1.default)(app)
            .get(`/api/expenses/${expenseAId}`)
            .set('Authorization', `Bearer ${tokenB}`);
        // Must return 404 (Not Found) rather than 403 to prevent ID enumeration
        (0, vitest_1.expect)(userBGetRes.status).toBe(404);
        (0, vitest_1.expect)(userBGetRes.body.success).toBe(false);
        (0, vitest_1.expect)(userBGetRes.body.message).toBe('Expense not found');
        // 5. User B attempts to PUT / update User A's expense
        const userBUpdateRes = await (0, supertest_1.default)(app)
            .put(`/api/expenses/${expenseAId}`)
            .set('Authorization', `Bearer ${tokenB}`)
            .send({
            amount: 100, // Attempt to tamper amount
            description: 'Hacked by User B',
        });
        (0, vitest_1.expect)(userBUpdateRes.status).toBe(404);
        (0, vitest_1.expect)(userBUpdateRes.body.success).toBe(false);
        // 6. User B attempts to DELETE User A's expense
        const userBDeleteRes = await (0, supertest_1.default)(app)
            .delete(`/api/expenses/${expenseAId}`)
            .set('Authorization', `Bearer ${tokenB}`);
        (0, vitest_1.expect)(userBDeleteRes.status).toBe(404);
        (0, vitest_1.expect)(userBDeleteRes.body.success).toBe(false);
        // 7. Verify User A's expense was NOT tampered with or deleted
        const userAGetRes = await (0, supertest_1.default)(app)
            .get(`/api/expenses/${expenseAId}`)
            .set('Authorization', `Bearer ${tokenA}`);
        (0, vitest_1.expect)(userAGetRes.status).toBe(200);
        (0, vitest_1.expect)(userAGetRes.body.data.expense.amount).toBe(50000);
        (0, vitest_1.expect)(userAGetRes.body.data.expense.description).toBe('User A Confidential Rent Payment');
        // 8. Verify User B listing expenses shows 0 items
        const userBListRes = await (0, supertest_1.default)(app)
            .get('/api/expenses')
            .set('Authorization', `Bearer ${tokenB}`);
        (0, vitest_1.expect)(userBListRes.status).toBe(200);
        (0, vitest_1.expect)(userBListRes.body.data.expenses.length).toBe(0);
        (0, vitest_1.expect)(userBListRes.body.data.total).toBe(0);
        // 9. Verify User B's dashboard summary is 0
        const userBSummaryRes = await (0, supertest_1.default)(app)
            .get('/api/expenses/dashboard/summary')
            .set('Authorization', `Bearer ${tokenB}`);
        (0, vitest_1.expect)(userBSummaryRes.status).toBe(200);
        (0, vitest_1.expect)(userBSummaryRes.body.data.totalSpent).toBe(0);
        (0, vitest_1.expect)(userBSummaryRes.body.data.totalCount).toBe(0);
    });
});
