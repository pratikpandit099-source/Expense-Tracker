"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const app_js_1 = require("../../src/app.js");
const setup_js_1 = require("../setup.js");
(0, vitest_1.describe)('Auth Integration Tests', () => {
    (0, setup_js_1.setupTestDB)();
    const app = (0, app_js_1.createApp)();
    (0, vitest_1.describe)('POST /api/auth/register', () => {
        (0, vitest_1.it)('should register a new user successfully and set refresh cookie', async () => {
            const res = await (0, supertest_1.default)(app)
                .post('/api/auth/register')
                .send({
                name: 'Jane Doe',
                email: 'jane@example.com',
                password: 'Password123',
                confirmPassword: 'Password123',
            });
            (0, vitest_1.expect)(res.status).toBe(201);
            (0, vitest_1.expect)(res.body.success).toBe(true);
            (0, vitest_1.expect)(res.body.data.user).toBeDefined();
            (0, vitest_1.expect)(res.body.data.user.email).toBe('jane@example.com');
            (0, vitest_1.expect)(res.body.data.user.passwordHash).toBeUndefined(); // Never expose passwordHash!
            (0, vitest_1.expect)(res.body.data.accessToken).toBeDefined();
            const cookies = res.headers['set-cookie'];
            (0, vitest_1.expect)(cookies).toBeDefined();
            (0, vitest_1.expect)(cookies[0]).toContain('refreshToken=');
        });
        (0, vitest_1.it)('should reject duplicate email registration with 409', async () => {
            await (0, supertest_1.default)(app)
                .post('/api/auth/register')
                .send({
                name: 'Jane Doe',
                email: 'duplicate@example.com',
                password: 'Password123',
            });
            const res = await (0, supertest_1.default)(app)
                .post('/api/auth/register')
                .send({
                name: 'Another Jane',
                email: 'duplicate@example.com',
                password: 'Password123',
            });
            (0, vitest_1.expect)(res.status).toBe(409);
            (0, vitest_1.expect)(res.body.success).toBe(false);
            (0, vitest_1.expect)(res.body.message).toContain('already exists');
        });
    });
    (0, vitest_1.describe)('POST /api/auth/login', () => {
        (0, vitest_1.it)('should log in with valid credentials and return access token', async () => {
            // Register first
            await (0, supertest_1.default)(app)
                .post('/api/auth/register')
                .send({
                name: 'Bob Smith',
                email: 'bob@example.com',
                password: 'SecretPassword99',
            });
            const res = await (0, supertest_1.default)(app)
                .post('/api/auth/login')
                .send({
                email: 'bob@example.com',
                password: 'SecretPassword99',
            });
            (0, vitest_1.expect)(res.status).toBe(200);
            (0, vitest_1.expect)(res.body.success).toBe(true);
            (0, vitest_1.expect)(res.body.data.accessToken).toBeDefined();
            (0, vitest_1.expect)(res.body.data.user.email).toBe('bob@example.com');
        });
        (0, vitest_1.it)('should reject invalid credentials with generic 401 error', async () => {
            const res = await (0, supertest_1.default)(app)
                .post('/api/auth/login')
                .send({
                email: 'nonexistent@example.com',
                password: 'WrongPassword1',
            });
            (0, vitest_1.expect)(res.status).toBe(401);
            (0, vitest_1.expect)(res.body.success).toBe(false);
            (0, vitest_1.expect)(res.body.message).toBe('Invalid email or password');
        });
    });
    (0, vitest_1.describe)('POST /api/auth/refresh & GET /api/auth/me', () => {
        (0, vitest_1.it)('should refresh access token using refresh cookie', async () => {
            const regRes = await (0, supertest_1.default)(app)
                .post('/api/auth/register')
                .send({
                name: 'Sarah Connor',
                email: 'sarah@example.com',
                password: 'CyberPassword84',
            });
            const cookie = regRes.headers['set-cookie'];
            const refreshRes = await (0, supertest_1.default)(app)
                .post('/api/auth/refresh')
                .set('Cookie', cookie);
            (0, vitest_1.expect)(refreshRes.status).toBe(200);
            (0, vitest_1.expect)(refreshRes.body.success).toBe(true);
            (0, vitest_1.expect)(refreshRes.body.data.accessToken).toBeDefined();
            const newAccessToken = refreshRes.body.data.accessToken;
            // Access protected /api/auth/me
            const meRes = await (0, supertest_1.default)(app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${newAccessToken}`);
            (0, vitest_1.expect)(meRes.status).toBe(200);
            (0, vitest_1.expect)(meRes.body.data.user.email).toBe('sarah@example.com');
        });
    });
});
