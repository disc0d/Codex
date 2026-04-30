import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PulseLogo } from '@/components/icons/Icons';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from './AuthContext';

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
    } catch (error: unknown) {
      const payload = (error as { response?: { data?: { error?: { code?: string } } } }).response?.data;
      const code = payload?.error?.code;
      if (code === 'EMAIL_NOT_VERIFIED') setError('Please verify your email before login.');
      else if (code === 'ACCOUNT_LOCKED') setError('Account is temporarily locked due to failed attempts.');
      else setError('Invalid credentials.');
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
