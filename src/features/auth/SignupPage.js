import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PulseLogo } from '@/components/icons/Icons';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
export const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [state, setState] = useState('idle');
    const [error, setError] = useState('');
    const hint = useMemo(() => {
        if (state === 'success')
            return 'Account created. Check your inbox for a verification link, then continue on Verify.';
        if (state === 'failure')
            return error || 'Could not create account. Please review details and try again.';
        if (state === 'submitting')
            return 'Creating your account...';
        return 'Create an account to get started, then verify your email before signing in.';
    }, [error, state]);
    const onSubmit = async (e) => {
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
        }
        catch (err) {
            setState('failure');
            setError(err?.response?.data?.message ?? 'Signup failed due to a server or network issue.');
        }
    };
    return (_jsx("div", { style: { minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 16 }, children: _jsxs("form", { className: "card", style: { width: '100%', maxWidth: 460, display: 'grid', gap: 12 }, onSubmit: onSubmit, children: [_jsx(PulseLogo, { style: { width: 130 } }), _jsx("h1", { children: "Create your OpsPulse account" }), _jsx("small", { children: hint }), _jsxs("label", { children: ["Full name", _jsx(Input, { value: name, onChange: (e) => setName(e.target.value), required: true })] }), _jsxs("label", { children: ["Email", _jsx(Input, { value: email, type: "email", onChange: (e) => setEmail(e.target.value), required: true })] }), _jsxs("label", { children: ["Password", _jsx(Input, { value: password, type: "password", onChange: (e) => setPassword(e.target.value), required: true, minLength: 8 })] }), state === 'failure' && _jsx("span", { className: "badge badge-error", children: error }), state === 'success' && _jsx("span", { className: "badge badge-ok", children: "Signup complete \u2014 continue to verification." }), _jsx(Button, { type: "submit", disabled: state === 'submitting', children: state === 'submitting' ? 'Creating account...' : 'Create account' }), _jsxs("small", { children: ["Already verified? ", _jsx(Link, { to: "/login", children: "Log in" }), " \u00B7 Need to verify now? ", _jsx(Link, { to: "/verify", children: "Go to Verify" })] })] }) }));
};
