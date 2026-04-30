import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { useAlerts } from '@/hooks/useAlerts';
export const AlertsPage = () => {
    const { alerts, loading, acknowledge } = useAlerts();
    return (_jsxs("section", { className: "grid", style: { gap: 20 }, children: [_jsxs("header", { children: [_jsx("h1", { children: "Phase 3: Revenue Risk Alerts" }), _jsx("small", { children: "AI-prioritized issues affecting retention, SLA compliance, and expansion opportunities." })] }), loading ? _jsx(Loading, { label: "Loading alerts" }) : (_jsx("div", { className: "grid", children: alerts.map((alert) => (_jsxs("article", { className: "card", style: { display: 'grid', gap: 8 }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }, children: [_jsx("h3", { children: alert.title }), _jsx("span", { className: `badge ${alert.severity === 'high' ? 'badge-error' : alert.severity === 'medium' ? 'badge-warning' : 'badge-success'}`, children: alert.severity.toUpperCase() })] }), _jsx("small", { children: alert.impact }), _jsxs("small", { children: ["Status: ", alert.status, alert.acknowledgedBy ? ` • Ack by ${alert.acknowledgedBy}` : ''] }), _jsx(Button, { variant: "secondary", onClick: () => void acknowledge(alert.id), disabled: alert.status === 'resolved', children: alert.status === 'resolved' ? 'Acknowledged' : 'Acknowledge' })] }, alert.id))) }))] }));
};
