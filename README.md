# OpsPulse — Enterprise Workflow Intelligence SaaS

OpsPulse is a production-intent B2B SaaS concept focused on reducing incident-resolution time, preventing SLA penalties, and improving renewal retention for post-sales operations teams.

## Why this product
- **Pain point**: Ops and support leaders lose revenue due to SLA breaches, reactive escalations, and poor visibility into renewal risk.
- **ROI path**: automated playbooks, risk scoring, and billing insights drive measurable time savings and retained ARR.
- **Monetization**: recurring subscription tiers (Scale/Enterprise), seat expansion, and usage-based overage services.

## Product phases (roadmap)
- **Phase 1 (Completed)**: secure command center for auth, KPIs, billing plan selection, and seat management.
- **Phase 2 (Completed)**: workflow orchestration with execution tracking (`runCount`, `lastRunAt`) and role-based runbook triggers.
- **Phase 3 (Completed)**: risk alert center with acknowledgment workflow and auditable security events.
- **Phase 4 (Completed)**: executive forecast simulation with scenario history and auditable simulations.
- **Phase 5 (Completed)**: AI copilot recommendation engine with ranked actions and one-click application flows.
- **Phase 6 (Completed)**: governance control tower for approval/rejection of high-risk changes.
- **Phase 7 (Planned)**: external integrations (CRM, ticketing, data warehouse sync).
- **Phase 8 (Planned)**: enterprise compliance package (SAML, SCIM, advanced audit exports).

## Frontend architecture
```
src/
  app/                 # Routing and app shell composition
  components/
    icons/             # Inline SVG icon + logo system
    layout/            # Sidebar shell
    ui/                # Button, Input, Loading states
  features/
    auth/
    dashboard/
    workflows/
    alerts/
    forecast/
    intelligence/
    governance/        # Phase 6 approvals workspace
    billing/
    admin/
  hooks/               # Workflow + alerts data hooks
  lib/                 # API service and interceptors
  styles/              # Design tokens + responsive system
```

## Security layer implemented
- JWT access-token authentication (`/api/auth/login`, `/api/auth/me`)
- CSRF token issuance + verification (`/api/auth/csrf`, `x-csrf-token`)
- Route-level RBAC middleware (`allowRoles`)
- Zod input validation per endpoint
- Rate limiting globally with 15-min windows
- Helmet headers with CSP
- CORS allowlist and credential handling
- Structured env validation via Zod
- Audit trail endpoint for privileged roles (`/api/security/audit`)

## Backend production design
- `server/src/modules/*` route modules organized by domain.
- `server/prisma/schema.prisma` models for users, orgs, sessions, and subscriptions.
- Billing endpoints include plan + seat updates.
- Workflow endpoints include execution state updates.
- Alert endpoints include status transitions and acknowledgment metadata.
- Forecast endpoints include simulation history.
- Intelligence endpoints include recommendation ranking and apply actions.
- Governance endpoints include approval decisions with audit recording.

## Run
```bash
npm install
npm run dev           # frontend
npm run server:dev    # backend
```

Set environment:
```
JWT_SECRET=<minimum 32 char secret>
CORS_ORIGIN=<your-frontend-origin>
PORT=<server-port>
DATABASE_URL=<postgres-connection-string>
```
