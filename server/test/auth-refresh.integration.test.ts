import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import request from 'supertest';

process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.JWT_SECRET = '12345678901234567890123456789012';
process.env.CORS_ORIGIN = 'http://localhost:5173';

const authModule = await import('../src/modules/auth/routes.js');
const authRoutes = authModule.default;
const { __authTestUtils } = authModule;

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

test('old refresh token reuse after rotation is rejected and revokes active user tokens', async () => {
  __authTestUtils.resetRefreshTokens();

  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({ email: 'ameer.mubarak1235@gmail.com', password: 'ameer1234ameer' })
    .expect(200);

  const oldRefreshToken = loginResponse.body.refreshToken as string;
  assert.ok(oldRefreshToken);

  const rotateResponse = await request(app).post('/api/auth/refresh').send({ refreshToken: oldRefreshToken }).expect(200);
  const currentRefreshToken = rotateResponse.body.refreshToken as string;
  assert.ok(currentRefreshToken);
  assert.equal(__authTestUtils.activeRefreshTokenCountForUser('usr_1'), 1);

  await request(app)
    .post('/api/auth/refresh')
    .send({ refreshToken: oldRefreshToken })
    .expect(401)
    .expect(({ body }) => {
      assert.equal(body.error, 'Refresh token reuse detected');
    });

  assert.equal(__authTestUtils.activeRefreshTokenCountForUser('usr_1'), 0);

  await request(app)
    .post('/api/auth/refresh')
    .send({ refreshToken: currentRefreshToken })
    .expect(401)
    .expect(({ body }) => {
      assert.equal(body.error, 'Refresh token reuse detected');
    });
});
