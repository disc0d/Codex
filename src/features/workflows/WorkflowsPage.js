import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { useWorkflows } from '@/hooks/useWorkflows';
export const WorkflowsPage = () => {
    const { workflows, loading, trigger } = useWorkflows();
    return (_jsxs("section", { className: "grid", style: { gap: 24 }, children: [_jsxs("header", { children: [_jsx("h1", { children: "Phase 2: Automation Orchestration" }), _jsx("small", { children: "Operational playbooks for incidents, renewals, and utilization remediation." })] }), loading ? _jsx(Loading, { label: "Fetching workflow status" }) : (_jsx("div", { className: "grid grid-2", children: workflows.map((workflow) => (_jsxs("article", { className: "card", children: [_jsx("h3", { children: workflow.name }), _jsxs("small", { children: ["Owner: ", workflow.owner] }), _jsxs("p", { style: { margin: '8px 0' }, children: ["Automation coverage: ", workflow.automationCoverage, "%"] }), _jsxs("small", { children: ["Runs: ", workflow.runCount, " ", workflow.lastRunAt ? `• Last run ${new Date(workflow.lastRunAt).toLocaleString()}` : ''] }), _jsx("div", { style: { margin: '8px 0' }, children: _jsx("span", { className: `badge ${workflow.status === 'healthy' ? 'badge-success' : workflow.status === 'warning' ? 'badge-warning' : 'badge-error'}`, children: workflow.status }) }), _jsx(Button, { onClick: () => void trigger(workflow.id), variant: "secondary", children: "Trigger Runbook" })] }, workflow.id))) }))] }));
};
