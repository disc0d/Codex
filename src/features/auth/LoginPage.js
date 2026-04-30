import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    const onSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            await login(email.trim(), password.trim());
            navigate('/dashboard');
        }
        catch (caught) {
            const authError = caught;
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
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsx("div", { style: { minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 16 }, children: _jsxs("form", { className: "card", style: { width: '100%', maxWidth: 460, display: 'grid', gap: 12 }, onSubmit: onSubmit, children: [_jsx(PulseLogo, { style: { width: 130 } }), _jsx("h1", { children: "Operations intelligence, secured." }), _jsx("small", { children: "Sign in to orchestrate SLAs, billing utilization and customer health." }), _jsxs("label", { children: ["Email", _jsx(Input, { value: email, onChange: (e) => setEmail(e.target.value), required: true })] }), _jsxs("label", { children: ["Password", _jsx(Input, { value: password, onChange: (e) => setPassword(e.target.value), type: "password", required: true })] }), error && _jsx("span", { className: "badge badge-error", children: error }), _jsx(Button, { type: "submit", disabled: submitting, children: submitting ? 'Authenticating...' : 'Enter Workspace' })] }) }));
};
