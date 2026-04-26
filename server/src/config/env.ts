import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number(),
  JWT_SECRET: z.string().min(32),
  CORS_ORIGIN: z.string().url()
});

export const env = schema.parse(process.env);
