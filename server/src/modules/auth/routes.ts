import { Router, type Response } from 'express';
import { z } from 'zod';
import { validate } from '../../middleware/validate.js';
import { requireAuth } from '../../middleware/auth.js';
import { issueCsrfToken } from '../../middleware/csrf.js';
import { prisma } from '../../utils/prisma.js';
import { generateOpaqueToken, hashPassword, hashToken, signAccessToken, verifyPassword } from '../../utils/auth.js';
import { sendVerificationEmail } from './email.js';
import { env } from '../../config/env.js';
import { AuthErrorCode, authError } from './errors.js';

const router = Router();
const LOCK_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const loginSchema = z.object({ body: z.object({ email: z.string().trim().email(), password: z.string().trim().min(12).max(72) }) });
const signupSchema = loginSchema;
const verifySchema = z.object({ query: z.object({ token: z.string().min(64) }) });

const setRefreshCookie = (res: Response, token: string) => {
  res.cookie('ops_rt', token, { httpOnly: true, secure: env.NODE_ENV === 'production', sameSite: 'lax', path: '/api/auth', maxAge: 30 * 24 * 60 * 60 * 1000 });
};

router.post('/signup', validate(signupSchema), async (req, res) => {
  const email = req.body.email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return void res.status(409).json(authError(AuthErrorCode.EMAIL_EXISTS, 'Email already registered'));

  const user = await prisma.user.create({ data: { email, passwordHash: await hashPassword(req.body.password.trim()), role: 'owner' } });
  const verifyToken = generateOpaqueToken();
  await prisma.verificationToken.create({ data: { userId: user.id, tokenHash: hashToken(verifyToken), expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) } });

  const verifyUrl = `${env.FRONTEND_URL}/verify?token=${verifyToken}`;
  await sendVerificationEmail(email, verifyUrl);

  res.status(201).json({ message: 'Signup successful. Verify your email.', user: { id: user.id, email: user.email, role: user.role } });
});

router.get('/verify', validate(verifySchema), async (req, res) => {
  const verifyToken = req.query.token;
  const resolvedToken = Array.isArray(verifyToken) ? verifyToken[0] : verifyToken;
  if (typeof resolvedToken !== 'string') return void res.status(400).json(authError(AuthErrorCode.INVALID_OR_EXPIRED_TOKEN, 'Invalid or expired token'));
  const tokenHash = hashToken(resolvedToken);
  const record = await prisma.verificationToken.findUnique({ where: { tokenHash } });
  if (!record || record.usedAt || record.expiresAt < new Date()) return void res.status(400).json(authError(AuthErrorCode.INVALID_OR_EXPIRED_TOKEN, 'Invalid or expired token'));
  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { isVerified: true } }),
    prisma.verificationToken.update({ where: { id: record.id }, data: { usedAt: new Date() } })
  ]);
  res.json({ message: 'Email verified' });
});

router.post('/login', validate(loginSchema), async (req, res) => {
  const email = req.body.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return void res.status(401).json(authError(AuthErrorCode.INVALID_CREDENTIALS, 'Invalid credentials'));
  if (user.lockUntil && user.lockUntil > new Date()) return void res.status(423).json(authError(AuthErrorCode.ACCOUNT_LOCKED, 'Account locked'));

  const valid = await verifyPassword(req.body.password.trim(), user.passwordHash);
  if (!valid) {
    const attempts = user.failedLoginAttempts + 1;
    await prisma.user.update({ where: { id: user.id }, data: { failedLoginAttempts: attempts, lockUntil: attempts >= MAX_ATTEMPTS ? new Date(Date.now() + LOCK_MS) : null } });
    return void res.status(401).json(authError(AuthErrorCode.INVALID_CREDENTIALS, 'Invalid credentials'));
  }

  if (!user.isVerified) return void res.status(403).json(authError(AuthErrorCode.EMAIL_NOT_VERIFIED, 'Email not verified'));
  await prisma.user.update({ where: { id: user.id }, data: { failedLoginAttempts: 0, lockUntil: null } });

  const accessToken = signAccessToken({ sub: user.id, role: user.role, email: user.email });
  const refresh = generateOpaqueToken();
  await prisma.refreshToken.create({ data: { userId: user.id, tokenHash: hashToken(refresh), expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } });
  setRefreshCookie(res, refresh);
  res.json({ token: accessToken, user: { id: user.id, email: user.email, role: user.role } });
});

router.post('/refresh', async (req, res) => {
  const token = req.cookies?.ops_rt as string | undefined;
  if (!token) return void res.status(401).json(authError(AuthErrorCode.MISSING_REFRESH_TOKEN, 'Missing refresh token'));

  const tokenHash = hashToken(token);
  const record = await prisma.refreshToken.findUnique({ where: { tokenHash }, include: { user: true } });
  if (!record || record.revokedAt || record.expiresAt < new Date()) return void res.status(401).json(authError(AuthErrorCode.INVALID_REFRESH_TOKEN, 'Invalid refresh token'));

  const newRefresh = generateOpaqueToken();
  await prisma.$transaction([
    prisma.refreshToken.update({ where: { id: record.id }, data: { revokedAt: new Date() } }),
    prisma.refreshToken.create({ data: { userId: record.user.id, tokenHash: hashToken(newRefresh), expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } })
  ]);

  setRefreshCookie(res, newRefresh);
  const accessToken = signAccessToken({ sub: record.user.id, role: record.user.role, email: record.user.email });
  res.json({ token: accessToken });
});

router.post('/logout', async (req, res) => {
  const token = req.cookies?.ops_rt as string | undefined;
  if (token) await prisma.refreshToken.updateMany({ where: { tokenHash: hashToken(token), revokedAt: null }, data: { revokedAt: new Date() } });
  res.clearCookie('ops_rt', { path: '/api/auth' });
  res.status(204).send();
});

router.get('/me', requireAuth, (req, res) => res.json({ user: { id: req.auth!.sub, email: req.auth!.email, role: req.auth!.role } }));
router.get('/csrf', requireAuth, (req, res) => res.json({ csrfToken: issueCsrfToken(req.auth!.sub) }));

export default router;
