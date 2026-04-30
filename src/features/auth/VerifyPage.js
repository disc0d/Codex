import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PulseLogo } from '@/components/icons/Icons';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
export const VerifyPage = () => {
    const [searchParams] = useSearchParams();
    const [manualToken, setManualToken] = useState('');
    const initialToken = searchParams.get('token') ?? '';
    const token = (manualToken || initialToken).trim();
    const [state, setState] = useState(initialToken ? 'idle' : 'token-missing');
    const [error, setError] = useState('');
    const message = useMemo(() => {
        if (state === 'success')
            return 'Verification complete. You can now sign in.';
        if (state === 'token-missing')
            return 'Verification token missing. Paste your token or open the full link from your email.';
        if (state === 'token-expired/reused')
            return 'This token is expired or has already been used. Request a new verification link by signing up again.';
        if (state === 'failure')
            return error || 'Unable to verify this token right now.';
        if (state === 'submitting')
            return 'Verifying your account token...';
        return 'Verify your account using the token from your signup email.';
    }, [error, state]);
    const onVerify = async (e) => {
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
        }
        catch (err) {
            const code = err?.response?.data?.code ?? err?.response?.status;
            if (code === 'TOKEN_EXPIRED' || code === 'TOKEN_REUSED' || code === 410 || code === 409) {
                setState('token-expired/reused');
                return;
            }
            setState('failure');
            setError(err?.response?.data?.message ?? 'Verification failed due to a server or network issue.');
        }
    };
    return (_jsx("div", { style: { minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 16 }, children: _jsxs("form", { className: "card", style: { width: '100%', maxWidth: 460, display: 'grid', gap: 12 }, onSubmit: onVerify, children: [_jsx(PulseLogo, { style: { width: 130 } }), _jsx("h1", { children: "Verify your account" }), _jsx("small", { children: message }), _jsxs("label", { children: ["Verification token", _jsx(Input, { value: manualToken || initialToken, onChange: (e) => {
                                setManualToken(e.target.value);
                                if (state === 'token-missing' && e.target.value.trim())
                                    setState('idle');
                            }, placeholder: "Paste token from email", required: true })] }), state === 'failure' && _jsx("span", { className: "badge badge-error", children: error }), state === 'token-expired/reused' && _jsx("span", { className: "badge badge-error", children: "Token expired/reused \u2014 start over with signup." }), state === 'token-missing' && _jsx("span", { className: "badge badge-error", children: "No token found in URL or input." }), state === 'success' && _jsx("span", { className: "badge badge-ok", children: "Account verified successfully." }), _jsx(Button, { type: "submit", disabled: state === 'submitting', children: state === 'submitting' ? 'Verifying...' : 'Verify account' }), _jsxs("small", { children: ["Need an account? ", _jsx(Link, { to: "/signup", children: "Go to Signup" }), " \u00B7 Already verified? ", _jsx(Link, { to: "/login", children: "Go to Login" })] })] }) }));
};
