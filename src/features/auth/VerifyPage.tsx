import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PulseLogo } from '@/components/icons/Icons';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';

type VerifyState = 'idle' | 'submitting' | 'success' | 'failure' | 'token-missing' | 'token-expired/reused';

export const VerifyPage = () => {
  const [searchParams] = useSearchParams();
  const [manualToken, setManualToken] = useState('');
  const initialToken = searchParams.get('token') ?? '';
  const token = (manualToken || initialToken).trim();

  const [state, setState] = useState<VerifyState>(initialToken ? 'idle' : 'token-missing');
  const [error, setError] = useState('');

  const message = useMemo(() => {
    if (state === 'success') return 'Verification complete. You can now sign in.';
    if (state === 'token-missing') return 'Verification token missing. Paste your token or open the full link from your email.';
    if (state === 'token-expired/reused') return 'This token is expired or has already been used. Request a new verification link by signing up again.';
    if (state === 'failure') return error || 'Unable to verify this token right now.';
    if (state === 'submitting') return 'Verifying your account token...';
    return 'Verify your account using the token from your signup email.';
  }, [error, state]);

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setState('token-missing');
      return;
    }

    setState('submitting');
    setError('');

    try {
      await api.post('/auth/verify', { token });
      setState('success');
    } catch (err: any) {
      const code = err?.response?.data?.code ?? err?.response?.status;
      if (code === 'TOKEN_EXPIRED' || code === 'TOKEN_REUSED' || code === 410 || code === 409) {
        setState('token-expired/reused');
        return;
      }
      setState('failure');
      setError(err?.response?.data?.message ?? 'Verification failed due to a server or network issue.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 16 }}>
      <form className="card" style={{ width: '100%', maxWidth: 460, display: 'grid', gap: 12 }} onSubmit={onVerify}>
        <PulseLogo style={{ width: 130 }} />
        <h1>Verify your account</h1>
        <small>{message}</small>

        <label>
          Verification token
          <Input
            value={manualToken || initialToken}
            onChange={(e) => {
              setManualToken(e.target.value);
              if (state === 'token-missing' && e.target.value.trim()) setState('idle');
            }}
            placeholder="Paste token from email"
            required
          />
        </label>

        {state === 'failure' && <span className="badge badge-error">{error}</span>}
        {state === 'token-expired/reused' && <span className="badge badge-error">Token expired/reused — start over with signup.</span>}
        {state === 'token-missing' && <span className="badge badge-error">No token found in URL or input.</span>}
        {state === 'success' && <span className="badge badge-ok">Account verified successfully.</span>}

        <Button type="submit" disabled={state === 'submitting'}>
          {state === 'submitting' ? 'Verifying...' : 'Verify account'}
        </Button>

        <small>
          Need an account? <Link to="/signup">Go to Signup</Link> · Already verified? <Link to="/login">Go to Login</Link>
        </small>
      </form>
    </div>
  );
};
