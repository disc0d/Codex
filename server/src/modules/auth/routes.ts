import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../../middleware/validate.js';
import { signToken } from '../../utils/jwt.js';
import { requireAuth } from '../../middleware/auth.js';
import { issueCsrfToken } from '../../middleware/csrf.js';
import { AUTH_ERROR, authErrorResponse } from './errors.js';

const router = Router();

const loginSchema = z.object({
  body: z.object({ email: z.string().trim().email(), password: z.string().trim().min(12).max(72) })
});

router.post('/login', validate(loginSchema), (req, res) => {
  const email = (req.body.email as string).trim();
  const password = (req.body.password as string).trim();
  if (email !== 'ameer.mubarak1235@gmail.com' || password !== 'ameer1234ameer') {
    return void res.status(401).json(authErrorResponse(AUTH_ERROR.INVALID_CREDENTIALS));
  }
  const user = { id: 'usr_1', email, role: 'owner' as const };
  const token = signToken({ sub: user.id, role: user.role, email: user.email });
  res.json({ token, user });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: { id: req.auth!.sub, email: req.auth!.email, role: req.auth!.role } });
});

router.get('/csrf', requireAuth, (req, res) => {
  const csrfToken = issueCsrfToken(req.auth!.sub);
  res.json({ csrfToken });
});

export default router;
