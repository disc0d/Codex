import test from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, verifyPassword, generateOpaqueToken, hashToken } from '../src/utils/auth.js';

test('password hashing and verification', async () => {
  const hash = await hashPassword('averystrongpassword');
  const ok = await verifyPassword('averystrongpassword', hash);
  const bad = await verifyPassword('wrongpassword', hash);
  assert.equal(ok, true);
  assert.equal(bad, false);
});

test('token hashing is deterministic and one-way-ish', () => {
  const token = generateOpaqueToken();
  const a = hashToken(token);
  const b = hashToken(token);
  const c = hashToken(generateOpaqueToken());
  assert.equal(a, b);
  assert.notEqual(a, c);
  assert.equal(a.length, 64);
});
