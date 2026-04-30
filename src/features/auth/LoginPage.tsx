import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PulseLogo } from '@/components/icons/Icons';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth, type AuthApiError } from './AuthContext';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('ameer.mubarak1235@gmail.com');
  const [password, setPassword] = useState('ameer1234ameer');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await login(email.trim(), password.trim());
      navigate('/dashboard');
    } catch (caught) {
      const authError = caught as AuthApiError;
      switch (authError.code) {
        case 'AUTH_INVALID_CREDENTIALS':
          setError('Invalid email or password.');
          break;
        case 'AUTH_ACCOUNT_UNVERIFIED':
          setError('Please verify your account before signing in.');
          break;
        case 'AUTH_ACCOUNT_LOCKED':
          setError('Your account is locked. Please contact support.');
          break;
        case 'AUTH_TOKEN_INVALID':
        case 'AUTH_TOKEN_EXPIRED':
        case 'AUTH_REFRESH_TOKEN_MISSING':
          setError('Your session is no longer valid. Please sign in again.');
          break;
        default:
          setError(authError.message || 'Unable to sign in right now.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 16 }}>
      <form className="card" style={{ width: '100%', maxWidth: 460, display: 'grid', gap: 12 }} onSubmit={onSubmit}>
        <PulseLogo style={{ width: 130 }} />
        <h1>Operations intelligence, secured.</h1>
        <small>Sign in to orchestrate SLAs, billing utilization and customer health.</small>
        <label>Email<Input value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label>Password<Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required /></label>
        {error && <span className="badge badge-error">{error}</span>}
        <Button type="submit" disabled={submitting}>{submitting ? 'Authenticating...' : 'Enter Workspace'}</Button>
      </form>
    </div>
  );
};
