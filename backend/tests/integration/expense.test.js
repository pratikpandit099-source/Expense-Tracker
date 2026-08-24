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
(0, vitest_1.describe)('Expense Integration Tests', () => {
    (0, setup_js_1.setupTestDB)();
    const app = (0, app_js_1.createApp)();
    let token;
    (0, vitest_1.beforeEach)(async () => {
        const reg = await (0, supertest_1.default)(app)
            .post('/api/auth/register')
            .send({
            name: 'Test User',
            email: 'tester@example.com',
            password: 'Password123',
        });
        token = reg.body.data.accessToken;
    });
    (0, vitest_1.describe)('GET /api/expenses/categories', () => {
        (0, vitest_1.it)('should return fixed categories metadata without authentication', async () => {
            const res = await (0, supertest_1.default)(app).get('/api/expenses/categories');
            (0, vitest_1.expect)(res.status).toBe(200);
            (0, vitest_1.expect)(res.body.success).toBe(true);
            (0, vitest_1.expect)(res.body.data.categories.length).toBe(11);
        });
    });
    (0, vitest_1.describe)('Expense CRUD & Filters', () => {
        (0, vitest_1.it)('should create an expense and retrieve it in the list', async () => {
            const createRes = await (0, supertest_1.default)(app)
                .post('/api/expenses')
                .set('Authorization', `Bearer ${token}`)
                .send({
                category: categories_js_1.ExpenseCategory.GROCERIES,
                amount: 4550, // $45.50
                expenseDate: new Date().toISOString(),
                description: 'Weekly milk and eggs',
            });
            (0, vitest_1.expect)(createRes.status).toBe(201);
            (0, vitest_1.expect)(createRes.body.success).toBe(true);
            (0, vitest_1.expect)(createRes.body.data.expense.amount).toBe(4550);
            (0, vitest_1.expect)(createRes.body.data.expense.category).toBe(categories_js_1.ExpenseCategory.GROCERIES);
            const listRes = await (0, supertest_1.default)(app)
                .get('/api/expenses')
                .set('Authorization', `Bearer ${token}`);
            (0, vitest_1.expect)(listRes.status).toBe(200);
            (0, vitest_1.expect)(listRes.body.data.expenses.length).toBe(1);
            (0, vitest_1.expect)(listRes.body.data.total).toBe(1);
        });
        (0, vitest_1.it)('should update an existing expense', async () => {
            const createRes = await (0, supertest_1.default)(app)
                .post('/api/expenses')
                .set('Authorization', `Bearer ${token}`)
                .send({
                category: categories_js_1.ExpenseCategory.TRANSPORT,
                amount: 1500,
                expenseDate: new Date().toISOString(),
                description: 'Bus ticket',
            });
            const expenseId = createRes.body.data.expense._id;
            const updateRes = await (0, supertest_1.default)(app)
                .put(`/api/expenses/${expenseId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                amount: 2000,
                description: 'Updated bus & metro pass',
            });
            (0, vitest_1.expect)(updateRes.status).toBe(200);
            (0, vitest_1.expect)(updateRes.body.data.expense.amount).toBe(2000);
            (0, vitest_1.expect)(updateRes.body.data.expense.description).toBe('Updated bus & metro pass');
        });
        (0, vitest_1.it)('should delete an existing expense', async () => {
            const createRes = await (0, supertest_1.default)(app)
                .post('/api/expenses')
                .set('Authorization', `Bearer ${token}`)
                .send({
                category: categories_js_1.ExpenseCategory.ENTERTAINMENT,
                amount: 1200,
                expenseDate: new Date().toISOString(),
                description: 'Cinema ticket',
            });
            const expenseId = createRes.body.data.expense._id;
            const delRes = await (0, supertest_1.default)(app)
                .delete(`/api/expenses/${expenseId}`)
                .set('Authorization', `Bearer ${token}`);
            (0, vitest_1.expect)(delRes.status).toBe(200);
            // Verify it no longer exists
            const getRes = await (0, supertest_1.default)(app)
                .get(`/api/expenses/${expenseId}`)
                .set('Authorization', `Bearer ${token}`);
            (0, vitest_1.expect)(getRes.status).toBe(404);
        });
    });
    (0, vitest_1.describe)('Analytics & Dashboard Aggregations', () => {
        (0, vitest_1.it)('should compute dashboard summary and category analytics correctly', async () => {
            // Seed expenses
            const seedRes = await (0, supertest_1.default)(app)
                .post('/api/expenses/seed')
                .set('Authorization', `Bearer ${token}`);
            (0, vitest_1.expect)(seedRes.status).toBe(201);
            (0, vitest_1.expect)(seedRes.body.data.count).toBeGreaterThan(0);
            // Check summary
            const summaryRes = await (0, supertest_1.default)(app)
                .get('/api/expenses/dashboard/summary')
                .set('Authorization', `Bearer ${token}`);
            (0, vitest_1.expect)(summaryRes.status).toBe(200);
            (0, vitest_1.expect)(summaryRes.body.data.totalSpent).toBeGreaterThan(0);
            (0, vitest_1.expect)(summaryRes.body.data.totalCount).toBeGreaterThan(0);
            // Check category analytics
            const catRes = await (0, supertest_1.default)(app)
                .get('/api/expenses/analytics/category')
                .set('Authorization', `Bearer ${token}`);
            (0, vitest_1.expect)(catRes.status).toBe(200);
            (0, vitest_1.expect)(catRes.body.data.categories.length).toBeGreaterThan(0);
            // Check monthly analytics
            const monthlyRes = await (0, supertest_1.default)(app)
                .get('/api/expenses/analytics/monthly')
                .set('Authorization', `Bearer ${token}`);
            (0, vitest_1.expect)(monthlyRes.status).toBe(200);
            (0, vitest_1.expect)(monthlyRes.body.data.monthly.length).toBe(12);
            // Check trend analytics
            const trendRes = await (0, supertest_1.default)(app)
                .get('/api/expenses/analytics/trend?months=6')
                .set('Authorization', `Bearer ${token}`);
            (0, vitest_1.expect)(trendRes.status).toBe(200);
            (0, vitest_1.expect)(trendRes.body.data.trend.length).toBe(6);
        });
    });
});
