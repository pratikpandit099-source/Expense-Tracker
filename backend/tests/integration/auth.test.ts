import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { setupTestDB } from '../setup.js';

describe('Auth Integration Tests', () => {
  setupTestDB();
  const app = createApp();

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully and set refresh cookie', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'Password123',
          confirmPassword: 'Password123',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.user.email).toBe('jane@example.com');
      expect(res.body.data.user.passwordHash).toBeUndefined(); // Never expose passwordHash!
      expect(res.body.data.accessToken).toBeDefined();

      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toContain('refreshToken=');
    });

    it('should reject duplicate email registration with 409', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Doe',
          email: 'duplicate@example.com',
          password: 'Password123',
        });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Another Jane',
          email: 'duplicate@example.com',
          password: 'Password123',
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should log in with valid credentials and return access token', async () => {
      // Register first
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Bob Smith',
          email: 'bob@example.com',
          password: 'SecretPassword99',
        });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'bob@example.com',
          password: 'SecretPassword99',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.user.email).toBe('bob@example.com');
    });

    it('should reject invalid credentials with generic 401 error', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'WrongPassword1',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid email or password');
    });
  });

  describe('POST /api/auth/refresh & GET /api/auth/me', () => {
    it('should refresh access token using refresh cookie', async () => {
      const regRes = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Sarah Connor',
          email: 'sarah@example.com',
          password: 'CyberPassword84',
        });

      const cookie = regRes.headers['set-cookie'];

      const refreshRes = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', cookie);

      expect(refreshRes.status).toBe(200);
      expect(refreshRes.body.success).toBe(true);
      expect(refreshRes.body.data.accessToken).toBeDefined();

      const newAccessToken = refreshRes.body.data.accessToken;

      // Access protected /api/auth/me
      const meRes = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${newAccessToken}`);

      expect(meRes.status).toBe(200);
      expect(meRes.body.data.user.email).toBe('sarah@example.com');
    });
  });
});
