import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
export const IntelligencePage = () => {
    const [items, setItems] = useState([]);
    const [impact, setImpact] = useState(0);
    const refresh = async () => {
        const { data } = await api.get('/intelligence/recommendations');
        setItems(data.recommendations);
        setImpact(data.totalPotentialImpact);
    };
    useEffect(() => {
        void refresh();
    }, []);
    const applyRecommendation = async (id) => {
        await api.post(`/intelligence/${id}/apply`);
        await refresh();
    };
    return (_jsxs("section", { className: "grid", style: { gap: 20 }, children: [_jsxs("header", { children: [_jsx("h1", { children: "Phase 5: AI Revenue Copilot" }), _jsx("small", { children: "Prioritized recommendations to maximize retained and expansion ARR." })] }), _jsxs("div", { className: "badge badge-success", children: ["Open potential impact: $", impact.toLocaleString()] }), _jsx("div", { className: "grid", children: items.map((item) => (_jsxs("article", { className: "card", style: { display: 'grid', gap: 8 }, children: [_jsx("h3", { children: item.title }), _jsx("small", { children: item.rationale }), _jsxs("small", { children: ["Annual impact: $", item.annualImpact.toLocaleString()] }), _jsx(Button, { onClick: () => void applyRecommendation(item.id), disabled: item.applied, variant: "secondary", children: item.applied ? 'Applied' : 'Apply Recommendation' })] }, item.id))) })] }));
};
