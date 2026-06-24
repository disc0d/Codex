import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from '@/app/AppRouter';
import { AuthProvider } from '@/features/auth/AuthContext';
import '@/styles/global.css';
ReactDOM.createRoot(document.getElementById('root')).render(_jsx(React.StrictMode, { children: _jsx(BrowserRouter, { children: _jsx(AuthProvider, { children: _jsx(AppRouter, {}) }) }) }));
