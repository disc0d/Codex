import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
export const SecurityPage = () => {
    const [entries, setEntries] = useState([]);
    useEffect(() => {
        api.get('/security/audit').then(({ data }) => setEntries(data.entries)).catch(() => setEntries([]));
    }, []);
    return (_jsxs("section", { className: "grid", children: [_jsx("h1", { children: "Security Control Plane" }), _jsxs("div", { className: "grid grid-2", children: [_jsxs("article", { className: "card", children: [_jsx("h3", { children: "Auth" }), _jsx("p", { children: "JWT access token + refresh strategy, password policy, optional MFA, session revocation." })] }), _jsxs("article", { className: "card", children: [_jsx("h3", { children: "RBAC" }), _jsx("p", { children: "Role matrix: owner, manager, analyst. API authorization middleware enforces route-level permissions." })] }), _jsxs("article", { className: "card", children: [_jsx("h3", { children: "Input Validation" }), _jsx("p", { children: "Zod validation for request body/query/params with strict schemas and sanitization." })] }), _jsxs("article", { className: "card", children: [_jsx("h3", { children: "API Shield" }), _jsx("p", { children: "Helmet CSP, CORS allowlist, rate limiting, anti-injection checks, CSRF token flow for state changes." })] })] }), _jsxs("article", { className: "card", children: [_jsx("h3", { children: "Phase 3: Audit Trail" }), entries.length === 0 ? _jsx("small", { children: "No security events yet." }) : (_jsx("ul", { children: entries.slice(0, 8).map((entry) => (_jsxs("li", { children: [_jsx("strong", { children: entry.actor }), " ", entry.action, " ", entry.resource, " on ", new Date(entry.at).toLocaleString()] }, entry.id))) }))] })] }));
};
