import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
export const DashboardPage = () => {
    const [kpis, setKpis] = useState([]);
    useEffect(() => {
        api.get('/metrics/kpis').then(({ data }) => setKpis(data.kpis)).catch(() => setKpis([]));
    }, []);
    return (_jsxs("section", { className: "grid", style: { gap: 24 }, children: [_jsxs("header", { children: [_jsx("h1", { children: "Revenue Operations Command" }), _jsx("small", { children: "Automate incident triage, prevent SLA breaches, and recover at-risk ARR." })] }), _jsx("div", { className: "grid grid-3", children: kpis.map((kpi) => (_jsxs("article", { className: "card", children: [_jsx("small", { children: kpi.label }), _jsx("h2", { style: { marginTop: 8 }, children: kpi.value }), _jsx("span", { className: `badge ${kpi.trend === 'up' ? 'badge-success' : kpi.trend === 'down' ? 'badge-error' : 'badge-warning'}`, children: kpi.trend === 'up' ? 'Improving' : kpi.trend === 'down' ? 'Needs action' : 'Stable' })] }, kpi.label))) }), _jsxs("div", { className: "grid grid-2", children: [_jsxs("article", { className: "card", children: [_jsx("h3", { children: "Automations" }), _jsxs("ul", { children: [_jsx("li", { children: "Smart escalation for high-severity tickets (avg save: 11.2 hrs/week)" }), _jsx("li", { children: "Renewal risk scoring synced to CRM" }), _jsx("li", { children: "Usage-based overage recommendations" })] })] }), _jsxs("article", { className: "card", children: [_jsx("h3", { children: "Retention Drivers" }), _jsxs("ul", { children: [_jsx("li", { children: "Playbooks triggered by product inactivity" }), _jsx("li", { children: "Contract utilization alerts 30 days before renewal" }), _jsx("li", { children: "NPS + incident response correlation panel" })] })] })] })] }));
};
