import axios from 'axios';
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api',
    withCredentials: true
});
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('ops_token');
    const csrf = localStorage.getItem('ops_csrf');
    if (token)
        config.headers.Authorization = `Bearer ${token}`;
    if (csrf && ['post', 'put', 'patch', 'delete'].includes((config.method ?? '').toLowerCase())) {
        config.headers['x-csrf-token'] = csrf;
    }
    return config;
});
