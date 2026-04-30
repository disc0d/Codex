import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { api } from '@/lib/api';
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const syncCsrf = async () => {
        const { data } = await api.get('/auth/csrf');
        localStorage.setItem('ops_csrf', data.csrfToken);
    };
    useEffect(() => {
        const hydrate = async () => {
            const token = localStorage.getItem('ops_token');
            if (!token)
                return setLoading(false);
            try {
                const { data } = await api.get('/auth/me');
                setUser(data.user);
                await syncCsrf();
            }
            catch {
                localStorage.removeItem('ops_token');
                localStorage.removeItem('ops_csrf');
            }
            finally {
                setLoading(false);
            }
        };
        void hydrate();
    }, []);
    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('ops_token', data.token);
            setUser(data.user);
            await syncCsrf();
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                const payload = error.response?.data;
                if (payload?.error?.code)
                    throw payload.error;
            }
            throw { code: 'AUTH_UNKNOWN', message: 'Unable to sign in. Please try again.' };
        }
    };
    const logout = () => {
        localStorage.removeItem('ops_token');
        localStorage.removeItem('ops_csrf');
        setUser(null);
    };
    const value = useMemo(() => ({ user, login, logout, loading }), [user, loading]);
    return _jsx(AuthContext.Provider, { value: value, children: children });
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error('useAuth must be used within AuthProvider');
    return context;
};
