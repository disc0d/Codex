import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../../middleware/validate.js';
import { signToken } from '../../utils/jwt.js';
import { requireAuth } from '../../middleware/auth.js';
import { issueCsrfToken } from '../../middleware/csrf.js';
import crypto from 'node:crypto';

const router = Router();

type RefreshTokenRecord = {
  id: string;
  userId: string;
  tokenHash: string;
  revokedAt: string | null;
};

const refreshTokens: RefreshTokenRecord[] = [];

const hashRefreshToken = (token: string) => crypto.createHash('sha256').update(token).digest('hex');
const createRefreshToken = () => crypto.randomBytes(32).toString('hex');

const revokeActiveRefreshTokensForUser = (userId: string) => {
  const revokedAt = new Date().toISOString();
  let updated = 0;
  for (const token of refreshTokens) {
    if (token.userId === userId && token.revokedAt === null) {
      token.revokedAt = revokedAt;
      updated += 1;
    }
  }
  return updated;
};

export const __authTestUtils = {
  resetRefreshTokens: () => {
    refreshTokens.length = 0;
  },
  activeRefreshTokenCountForUser: (userId: string) => refreshTokens.filter((token) => token.userId === userId && token.revokedAt === null).length
};

const loginSchema = z.object({
  body: z.object({ email: z.string().trim().email(), password: z.string().trim().min(12).max(72) })
});

router.post('/login', validate(loginSchema), (req, res) => {
  const email = (req.body.email as string).trim();
  const password = (req.body.password as string).trim();
  if (email !== 'ameer.mubarak1235@gmail.com' || password !== 'ameer1234ameer') return void res.status(401).json({ error: 'Invalid credentials' });
  const user = { id: 'usr_1', email, role: 'owner' as const };
  const token = signToken({ sub: user.id, role: user.role, email: user.email });
  const refreshToken = createRefreshToken();
  refreshTokens.push({ id: crypto.randomUUID(), userId: user.id, tokenHash: hashRefreshToken(refreshToken), revokedAt: null });
  res.json({ token, refreshToken, user });
});

router.post('/refresh', (req, res) => {
  const providedToken = typeof req.body?.refreshToken === 'string' ? req.body.refreshToken : '';
  if (!providedToken) return void res.status(401).json({ error: 'Invalid refresh token' });

  const providedHash = hashRefreshToken(providedToken);
  const tokenRecord = refreshTokens.find((token) => token.tokenHash === providedHash);

  if (!tokenRecord) return void res.status(401).json({ error: 'Invalid refresh token' });

  if (tokenRecord.revokedAt) {
    revokeActiveRefreshTokensForUser(tokenRecord.userId);
    return void res.status(401).json({ error: 'Refresh token reuse detected' });
  }

  tokenRecord.revokedAt = new Date().toISOString();
  const newRefreshToken = createRefreshToken();
  refreshTokens.push({ id: crypto.randomUUID(), userId: tokenRecord.userId, tokenHash: hashRefreshToken(newRefreshToken), revokedAt: null });

  return void res.json({ refreshToken: newRefreshToken });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: { id: req.auth!.sub, email: req.auth!.email, role: req.auth!.role } });
});

router.get('/csrf', requireAuth, (req, res) => {
  const csrfToken = issueCsrfToken(req.auth!.sub);
  res.json({ csrfToken });
});

export default router;
