import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
export const GovernancePage = () => {
    const [actions, setActions] = useState([]);
    const [pendingCount, setPendingCount] = useState(0);
    const refresh = async () => {
        const { data } = await api.get('/governance/actions');
        setActions(data.actions);
        setPendingCount(data.pendingCount);
    };
    useEffect(() => {
        void refresh();
    }, []);
    const decide = async (id, decision) => {
        await api.post(`/governance/${id}/decision`, { decision });
        await refresh();
    };
    return (_jsxs("section", { className: "grid", style: { gap: 20 }, children: [_jsxs("header", { children: [_jsx("h1", { children: "Phase 6: Governance Control Tower" }), _jsx("small", { children: "Approval workflows for high-risk automation and billing policy changes." })] }), _jsxs("div", { className: "badge badge-warning", children: ["Pending approvals: ", pendingCount] }), _jsx("div", { className: "grid", children: actions.map((action) => (_jsxs("article", { className: "card", style: { display: 'grid', gap: 8 }, children: [_jsx("h3", { children: action.title }), _jsxs("small", { children: [action.category, " \u2022 risk: ", action.riskLevel] }), _jsxs("small", { children: ["Requested by ", action.requestedBy] }), _jsx("span", { className: `badge ${action.status === 'approved' ? 'badge-success' : action.status === 'rejected' ? 'badge-error' : 'badge-warning'}`, children: action.status }), _jsxs("div", { style: { display: 'flex', gap: 8 }, children: [_jsx(Button, { variant: "secondary", onClick: () => void decide(action.id, 'approved'), disabled: action.status !== 'pending', children: "Approve" }), _jsx(Button, { variant: "secondary", onClick: () => void decide(action.id, 'rejected'), disabled: action.status !== 'pending', children: "Reject" })] })] }, action.id))) })] }));
};
