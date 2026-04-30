import request from 'supertest';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

const FIXED_NOW = new Date('2026-01-10T00:00:00.000Z');

let createApp: () => ReturnType<typeof import('express').default>;

beforeAll(async () => {
  process.env.PORT = process.env.PORT ?? '4010';
  process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-jwt-secret-0123456789-abcdef';
  process.env.CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:3000';

  ({ createApp } = await import('../../src/app.js'));
});

const uniqueEmail = () => `auth-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`;

const signup = async (app: ReturnType<typeof createApp>, email: string, password = 'CorrectHorseBatteryStaple1!') =>
  request(app).post('/api/auth/signup').send({
    email,
    password,
    firstName: 'Test',
    lastName: 'User'
  });

describe('Auth API integration', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('POST /api/auth/signup returns 201 and creates unverified user', async () => {
    const app = createApp();
    const email = uniqueEmail();

    const res = await signup(app, email);

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe(email);
    expect(res.body.user.verified).toBe(false);
  });

  it('GET /api/auth/verify marks user verified and rejects reused/expired token', async () => {
    const app = createApp();
    const email = uniqueEmail();
    const signupRes = await signup(app, email);

    const verifyToken = signupRes.body.verifyToken;
    expect(verifyToken).toBeTypeOf('string');

    const verifyRes = await request(app).get('/api/auth/verify').query({ token: verifyToken });
    expect(verifyRes.status).toBe(200);

    const reusedRes = await request(app).get('/api/auth/verify').query({ token: verifyToken });
    expect(reusedRes.status).toBeGreaterThanOrEqual(400);

    vi.setSystemTime(new Date(FIXED_NOW.getTime() + 1000 * 60 * 60 * 25));
    const expiredRes = await request(app).get('/api/auth/verify').query({ token: verifyToken });
    expect(expiredRes.status).toBeGreaterThanOrEqual(400);
  });

  it('POST /api/auth/login success issues JWT + ops_rt cookie', async () => {
    const app = createApp();
    const email = uniqueEmail();

    const signupRes = await signup(app, email);
    await request(app).get('/api/auth/verify').query({ token: signupRes.body.verifyToken });

    const loginRes = await request(app).post('/api/auth/login').send({ email, password: 'CorrectHorseBatteryStaple1!' });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.token).toBeTypeOf('string');
    expect(loginRes.headers['set-cookie']?.join(';')).toContain('ops_rt=');
  });

  it('POST /api/auth/login invalid credentials increments failures', async () => {
    const app = createApp();
    const email = uniqueEmail();

    const signupRes = await signup(app, email);
    await request(app).get('/api/auth/verify').query({ token: signupRes.body.verifyToken });

    const invalidRes = await request(app).post('/api/auth/login').send({ email, password: 'wrong-password' });
    expect(invalidRes.status).toBe(401);
    expect(invalidRes.body.failures).toBeGreaterThan(0);
  });

  it('POST /api/auth/login unverified user gets 403', async () => {
    const app = createApp();
    const email = uniqueEmail();

    await signup(app, email);
    const loginRes = await request(app).post('/api/auth/login').send({ email, password: 'CorrectHorseBatteryStaple1!' });

    expect(loginRes.status).toBe(403);
  });

  it('POST /api/auth/refresh rotates refresh token and rejects old token', async () => {
    const app = createApp();
    const email = uniqueEmail();

    const signupRes = await signup(app, email);
    await request(app).get('/api/auth/verify').query({ token: signupRes.body.verifyToken });

    const loginRes = await request(app).post('/api/auth/login').send({ email, password: 'CorrectHorseBatteryStaple1!' });
    const cookie = loginRes.headers['set-cookie'];

    const refreshRes = await request(app).post('/api/auth/refresh').set('Cookie', cookie);
    expect(refreshRes.status).toBe(200);

    const oldTokenReuseRes = await request(app).post('/api/auth/refresh').set('Cookie', cookie);
    expect(oldTokenReuseRes.status).toBeGreaterThanOrEqual(401);
  });

  it('POST /api/auth/logout revokes refresh token and clears cookie', async () => {
    const app = createApp();
    const email = uniqueEmail();

    const signupRes = await signup(app, email);
    await request(app).get('/api/auth/verify').query({ token: signupRes.body.verifyToken });

    const loginRes = await request(app).post('/api/auth/login').send({ email, password: 'CorrectHorseBatteryStaple1!' });
    const cookie = loginRes.headers['set-cookie'];

    const logoutRes = await request(app).post('/api/auth/logout').set('Cookie', cookie);
    expect(logoutRes.status).toBe(200);
    expect(logoutRes.headers['set-cookie']?.join(';')).toMatch(/ops_rt=;/);

    const refreshAfterLogout = await request(app).post('/api/auth/refresh').set('Cookie', cookie);
    expect(refreshAfterLogout.status).toBeGreaterThanOrEqual(401);
  });

  it('Lockout after threshold returns 423', async () => {
    const app = createApp();
    const email = uniqueEmail();

    const signupRes = await signup(app, email);
    await request(app).get('/api/auth/verify').query({ token: signupRes.body.verifyToken });

    for (let i = 0; i < 10; i += 1) {
      await request(app).post('/api/auth/login').send({ email, password: `wrong-${i}` });
    }

    const lockedRes = await request(app).post('/api/auth/login').send({ email, password: 'CorrectHorseBatteryStaple1!' });
    expect(lockedRes.status).toBe(423);
  });
});
