import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
export const ForecastPage = () => {
    const [scenario, setScenario] = useState(null);
    const [history, setHistory] = useState([]);
    const [churnReductionPct, setChurnReductionPct] = useState('8');
    const [expansionLiftPct, setExpansionLiftPct] = useState('12');
    const [result, setResult] = useState('');
    const refresh = async () => {
        const { data } = await api.get('/forecast/scenarios');
        setScenario(data.scenario);
        setHistory(data.history ?? []);
    };
    useEffect(() => {
        void refresh();
    }, []);
    const runSimulation = async () => {
        const { data } = await api.post('/forecast/simulate', {
            churnReductionPct: Number(churnReductionPct),
            expansionLiftPct: Number(expansionLiftPct)
        });
        setResult(data.message);
        await refresh();
    };
    return (_jsxs("section", { className: "grid", style: { gap: 20 }, children: [_jsxs("header", { children: [_jsx("h1", { children: "Phase 4: Executive Forecast Studio" }), _jsx("small", { children: "Model annual ARR outcomes from churn reduction and expansion optimization." })] }), scenario && (_jsxs("div", { className: "grid grid-2", children: [_jsxs("article", { className: "card", children: [_jsx("h3", { children: "Current ARR" }), _jsxs("h2", { children: ["$", scenario.currentArr.toLocaleString()] })] }), _jsxs("article", { className: "card", children: [_jsx("h3", { children: "Renewal Risk ARR" }), _jsxs("h2", { children: ["$", scenario.renewalRiskArr.toLocaleString()] })] }), _jsxs("article", { className: "card", children: [_jsx("h3", { children: "Expansion Pipeline" }), _jsxs("h2", { children: ["$", scenario.expansionPipeline.toLocaleString()] })] }), _jsxs("article", { className: "card", children: [_jsx("h3", { children: "Gross Retention" }), _jsxs("h2", { children: [Math.round(scenario.grossRetention * 100), "%"] })] })] })), _jsxs("article", { className: "card", style: { display: 'grid', gap: 12 }, children: [_jsx("h3", { children: "Scenario Simulator" }), _jsxs("label", { children: ["Churn Reduction (%)", _jsx(Input, { value: churnReductionPct, onChange: (e) => setChurnReductionPct(e.target.value) })] }), _jsxs("label", { children: ["Expansion Lift (%)", _jsx(Input, { value: expansionLiftPct, onChange: (e) => setExpansionLiftPct(e.target.value) })] }), _jsx(Button, { onClick: () => void runSimulation(), children: "Run Forecast" }), result && _jsx("span", { className: "badge badge-success", children: result })] }), _jsxs("article", { className: "card", children: [_jsx("h3", { children: "Simulation History" }), history.length === 0 ? _jsx("small", { children: "No simulations run yet." }) : (_jsx("ul", { children: history.map((run) => (_jsxs("li", { children: [run.actor, " ran ", run.churnReductionPct, "%/", run.expansionLiftPct, "% \u2192 $", run.projectedNetRevenueImpact.toLocaleString()] }, run.id))) }))] })] }));
};
