export const AUTH_ERROR = {
  INVALID_CREDENTIALS: {
    code: 'AUTH_INVALID_CREDENTIALS',
    message: 'Invalid email or password.'
  },
  ACCOUNT_UNVERIFIED: {
    code: 'AUTH_ACCOUNT_UNVERIFIED',
    message: 'Your account is not verified. Please verify your email before signing in.'
  },
  ACCOUNT_LOCKED: {
    code: 'AUTH_ACCOUNT_LOCKED',
    message: 'Your account is locked. Please contact support.'
  },
  TOKEN_INVALID: {
    code: 'AUTH_TOKEN_INVALID',
    message: 'The authentication token is invalid.'
  },
  TOKEN_EXPIRED: {
    code: 'AUTH_TOKEN_EXPIRED',
    message: 'The authentication token has expired. Please sign in again.'
  },
  REFRESH_TOKEN_MISSING: {
    code: 'AUTH_REFRESH_TOKEN_MISSING',
    message: 'No refresh token was provided.'
  }
} as const;

export type AuthErrorCode = (typeof AUTH_ERROR)[keyof typeof AUTH_ERROR]['code'];

export const authErrorResponse = (error: (typeof AUTH_ERROR)[keyof typeof AUTH_ERROR]) => ({
  error: {
    code: error.code,
    message: error.message
  }
});
