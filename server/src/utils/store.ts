export type Workflow = {
  id: string;
  name: string;
  owner: string;
  status: 'healthy' | 'warning' | 'critical';
  automationCoverage: number;
  lastRunAt: string | null;
  runCount: number;
};

export type Alert = {
  id: string;
  title: string;
  severity: 'high' | 'medium' | 'low';
  status: 'open' | 'resolved';
  impact: string;
  acknowledgedBy: string | null;
  acknowledgedAt: string | null;
};

export type ForecastRun = {
  id: string;
  churnReductionPct: number;
  expansionLiftPct: number;
  projectedNetRevenueImpact: number;
  actor: string;
  createdAt: string;
};

export type Recommendation = {
  id: string;
  title: string;
  rationale: string;
  annualImpact: number;
  applied: boolean;
};

export type GovernanceAction = {
  id: string;
  title: string;
  riskLevel: 'low' | 'medium' | 'high';
  category: 'security' | 'billing' | 'workflow';
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: string;
  requestedAt: string;
  decidedAt: string | null;
};

export type SubscriptionState = {
  plan: 'Scale' | 'Enterprise';
  seatCount: number;
  status: 'active' | 'past_due' | 'trialing';
  updatedAt: string;
};

export const store = {
  workflows: [
    { id: 'wf_incident', name: 'Incident Escalation Matrix', owner: 'Support Ops', status: 'healthy', automationCoverage: 89, lastRunAt: null, runCount: 0 },
    { id: 'wf_renewal', name: 'Renewal Risk Recovery', owner: 'CS Ops', status: 'warning', automationCoverage: 67, lastRunAt: null, runCount: 0 },
    { id: 'wf_usage', name: 'Usage Drop-off Remediation', owner: 'RevOps', status: 'critical', automationCoverage: 52, lastRunAt: null, runCount: 0 }
  ] as Workflow[],
  alerts: [
    { id: 'alt_1', title: 'SLA Breach Risk: Acme Corp', severity: 'high', status: 'open', impact: '$12,000 ARR at risk', acknowledgedBy: null, acknowledgedAt: null },
    { id: 'alt_2', title: 'Renewal Churn Signal: Lumio', severity: 'medium', status: 'open', impact: 'Usage dropped 42%', acknowledgedBy: null, acknowledgedAt: null },
    { id: 'alt_3', title: 'Overage Threshold Hit: Datagrid', severity: 'low', status: 'open', impact: 'Potential upsell opportunity', acknowledgedBy: null, acknowledgedAt: null }
  ] as Alert[],
  forecastRuns: [] as ForecastRun[],
  recommendations: [
    { id: 'rec_1', title: 'Auto-escalate P1 tickets at 15m', rationale: 'Cuts mean time to mitigation', annualImpact: 94000, applied: false },
    { id: 'rec_2', title: 'Trigger CSM outreach at 30% usage drop', rationale: 'Prevents silent churn', annualImpact: 126000, applied: false },
    { id: 'rec_3', title: 'Convert top overage accounts to enterprise plan', rationale: 'Captures expansion ARR', annualImpact: 211000, applied: false }
  ] as Recommendation[],
  governanceActions: [
    { id: 'gov_1', title: 'Enable automated credit notes above $10k', riskLevel: 'high', category: 'billing', status: 'pending', requestedBy: 'ameer.mubarak1235@gmail.com', requestedAt: new Date().toISOString(), decidedAt: null },
    { id: 'gov_2', title: 'Increase P1 auto-close timer to 48h', riskLevel: 'medium', category: 'workflow', status: 'pending', requestedBy: 'manager@opspulse.io', requestedAt: new Date().toISOString(), decidedAt: null }
  ] as GovernanceAction[],
  subscription: {
    plan: 'Scale',
    seatCount: 25,
    status: 'active',
    updatedAt: new Date().toISOString()
  } as SubscriptionState
};
