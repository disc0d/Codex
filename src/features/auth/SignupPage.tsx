import { useState } from 'react';
import { api } from '@/lib/api';
import { Link } from 'react-router-dom';

export const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await api.post('/auth/signup', { email, password });
      setMessage('Signup complete. Check your email for verification link.');
    } catch (err: unknown) {
      setError('Signup failed');
    }
  };
  return <form onSubmit={submit}><h1>Sign up</h1><input value={email} onChange={(e)=>setEmail(e.target.value)} /><input type='password' value={password} onChange={(e)=>setPassword(e.target.value)} />{error && <p>{error}</p>}{message && <p>{message}</p>}<button type='submit'>Create account</button><Link to='/login'>Login</Link></form>;
};
