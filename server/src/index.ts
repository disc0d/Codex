import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
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

export const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  }
}));

app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '200kb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true }));

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

if (process.env.NODE_ENV !== 'test') {
  app.listen(env.PORT, () => {
    console.log(`OpsPulse API running on :${env.PORT}`);
  });
}
