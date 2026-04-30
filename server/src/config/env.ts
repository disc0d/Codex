import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  CORS_ORIGIN: z.string().min(1),
  FRONTEND_URL: z.string().url(),
  TRUST_PROXY: z.string().default('false'),
  EMAIL_FROM: z.string().email(),
  SENDGRID_API_KEY: z.string().optional()
});

export const env = schema.parse(process.env);
