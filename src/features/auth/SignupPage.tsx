import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PulseLogo } from '@/components/icons/Icons';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';

type SignupState = 'idle' | 'submitting' | 'success' | 'failure';

export const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useState<SignupState>('idle');
  const [error, setError] = useState('');

  const hint = useMemo(() => {
    if (state === 'success') return 'Account created. Check your inbox for a verification link, then continue on Verify.';
    if (state === 'failure') return error || 'Could not create account. Please review details and try again.';
    if (state === 'submitting') return 'Creating your account...';
    return 'Create an account to get started, then verify your email before signing in.';
  }, [error, state]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('submitting');
    setError('');
    try {
      await api.post('/auth/signup', {
        name: name.trim(),
        email: email.trim(),
        password: password.trim()
      });
      setState('success');
      setPassword('');
    } catch (err: any) {
      setState('failure');
      setError(err?.response?.data?.message ?? 'Signup failed due to a server or network issue.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 16 }}>
      <form className="card" style={{ width: '100%', maxWidth: 460, display: 'grid', gap: 12 }} onSubmit={onSubmit}>
        <PulseLogo style={{ width: 130 }} />
        <h1>Create your OpsPulse account</h1>
        <small>{hint}</small>

        <label>Full name<Input value={name} onChange={(e) => setName(e.target.value)} required /></label>
        <label>Email<Input value={email} type="email" onChange={(e) => setEmail(e.target.value)} required /></label>
        <label>Password<Input value={password} type="password" onChange={(e) => setPassword(e.target.value)} required minLength={8} /></label>

        {state === 'failure' && <span className="badge badge-error">{error}</span>}
        {state === 'success' && <span className="badge badge-ok">Signup complete — continue to verification.</span>}

        <Button type="submit" disabled={state === 'submitting'}>
          {state === 'submitting' ? 'Creating account...' : 'Create account'}
        </Button>

        <small>
          Already verified? <Link to="/login">Log in</Link> · Need to verify now? <Link to="/verify">Go to Verify</Link>
        </small>
      </form>
    </div>
  );
};
