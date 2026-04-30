import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import authRoutes from './modules/auth/routes.js';
import metricsRoutes from './modules/metrics/routes.js';
import subscriptionsRoutes from './modules/subscriptions/routes.js';
import workflowsRoutes from './modules/workflows/routes.js';
import alertsRoutes from './modules/alerts/routes.js';
import securityRoutes from './modules/security/routes.js';
import forecastRoutes from './modules/forecast/routes.js';
import intelligenceRoutes from './modules/intelligence/routes.js';
import governanceRoutes from './modules/governance/routes.js';

const allowlist = env.CORS_ORIGIN.split(',').map((v) => v.trim()).filter(Boolean);

export const createApp = () => {
  const app = express();
  app.set('trust proxy', env.TRUST_PROXY === 'true');

  app.use(helmet());
  app.use(cors({
    credentials: true,
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowlist.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    }
  }));
  app.use(express.json({ limit: '200kb' }));
  app.use(cookieParser());
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true }));
  app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 30, standardHeaders: true }));

  app.get('/api/health', (_req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));
  app.use('/api/auth', authRoutes);
  app.use('/api/metrics', metricsRoutes);
  app.use('/api/subscriptions', subscriptionsRoutes);
  app.use('/api/workflows', workflowsRoutes);
  app.use('/api/alerts', alertsRoutes);
  app.use('/api/security', securityRoutes);
  app.use('/api/forecast', forecastRoutes);
  app.use('/api/intelligence', intelligenceRoutes);
  app.use('/api/governance', governanceRoutes);
  app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

  return app;
};
