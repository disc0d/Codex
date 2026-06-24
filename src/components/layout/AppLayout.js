import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink } from 'react-router-dom';
import { AlertIcon, BillingIcon, CopilotIcon, DashboardIcon, ForecastIcon, GovernanceIcon, PulseLogo, ShieldIcon, WorkflowIcon } from '@/components/icons/Icons';
import { useAuth } from '@/features/auth/AuthContext';
const navItems = [
    { label: 'Dashboard', to: '/dashboard', icon: DashboardIcon },
    { label: 'Workflows', to: '/workflows', icon: WorkflowIcon },
    { label: 'Alerts', to: '/alerts', icon: AlertIcon },
    { label: 'Forecast', to: '/forecast', icon: ForecastIcon },
    { label: 'Copilot', to: '/copilot', icon: CopilotIcon },
    { label: 'Governance', to: '/governance', icon: GovernanceIcon },
    { label: 'Billing', to: '/billing', icon: BillingIcon },
    { label: 'Security', to: '/security', icon: ShieldIcon }
];
export const AppLayout = ({ children }) => {
    const { user, logout } = useAuth();
    return (_jsxs("div", { className: "app-shell", children: [_jsxs("aside", { className: "sidebar", children: [_jsx(PulseLogo, { style: { width: 120, color: 'white', marginBottom: 24 } }), _jsx("p", { style: { fontSize: 13, margin: '0 0 16px' }, children: "Workflow command center for operations teams." }), _jsx("div", { style: { display: 'grid', gap: 8 }, children: navItems.map(({ label, to, icon: Icon }) => (_jsxs(NavLink, { to: to, style: ({ isActive }) => ({ color: isActive ? 'white' : '#9fb1ff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, padding: '10px', borderRadius: 10, background: isActive ? 'rgba(255,255,255,0.14)' : 'transparent' }), children: [_jsx(Icon, { width: 16, height: 16 }), label] }, to))) }), _jsxs("div", { style: { marginTop: 24, borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 16 }, children: [_jsx("small", { children: user?.email }), _jsx("br", {}), _jsxs("small", { children: ["Role: ", user?.role] }), _jsx("button", { className: "button button-secondary", style: { marginTop: 12, width: '100%' }, onClick: logout, children: "Sign out" })] })] }), _jsx("main", { className: "main-content", children: children })] }));
};
