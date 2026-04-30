import { authLogger } from './logger.js';

type VerificationEmailPayload = {
  email: string;
  verificationToken: string;
  verificationUrl: string;
};

export function logVerificationEmailDispatch(payload: VerificationEmailPayload): void {
  const isProduction = process.env.NODE_ENV === 'production';

  authLogger.info('auth.verification_email.dispatch', {
    email: payload.email,
    verificationToken: payload.verificationToken,
    verificationUrl: payload.verificationUrl,
    previewEnabled: !isProduction,
    tokenPreview: !isProduction ? `${payload.verificationToken.slice(0, 6)}...` : '[disabled]'
  });
}
