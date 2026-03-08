

# MD CertManager — Implementation Plan

## Overview
Build a modern, dark-themed certificate management dashboard in React with mock data. Glassmorphism UI with colored glow accents, collapsible sidebar, and 13+ pages ported from the Blazor app.

## Pages & Routes

| Route | Page | Source |
|-------|------|--------|
| `/` | Dashboard | Home.razor |
| `/certificates` | Certificates | Certificates.razor |
| `/issued-certificates` | Issued Certificates | IssuedCertificates.razor |
| `/agents` | Agents | Agents.razor |
| `/agents/:id` | Agent Detail | AgentDetail.razor |
| `/alerts` | Alerts | Alerts.razor |
| `/ca-management` | Certificate Authority | CaManagement.razor |
| `/templates` | Templates | Templates.razor |
| `/request-certificate` | Request Certificate | RequestCertificate.razor |
| `/authorization` | Authorization & Roles | Authorization.razor |
| `/settings` | Settings (tabbed) | Settings.razor |
| `/settings/enrollment-keys` | Enrollment Keys | EnrollmentKeys.razor |
| `/settings/agents` | Agent Management | AgentManagement.razor |
| `/settings/msi` | MSI Packages | MsiPackages.razor |
| `/settings/compliance` | Compliance | ComplianceSettings.razor |

## Design System
- Deep navy/slate background (`#0a0e1a` → `#111827`)
- Glass cards: `background: rgba(17,24,39,0.6)`, `backdrop-filter: blur(12px)`, subtle border `rgba(255,255,255,0.08)`
- Glow variants: blue, green, orange, red, purple, cyan — applied as left-border or box-shadow accents on stat cards
- Status badges with animated dot indicators (Online/green, Offline/red, Pending/yellow, etc.)
- Staggered fade-in animations on page load
- Monospace for thumbprints/serial numbers

## Layout Structure
- `SidebarProvider` + collapsible `Sidebar` with icon navigation
- Sidebar groups: **Main** (Dashboard, Agents, Certificates, Issued Certs, Alerts), **CA** (Certificate Authority, Templates, Request Certificate, Authorization), **Settings** (Settings, Agent Mgmt, Enrollment Keys, MSI Packages, Compliance)
- Header bar with `SidebarTrigger` and "MD CertManager" title

## File Structure
```text
src/
├── components/
│   ├── AppSidebar.tsx          — sidebar with grouped nav
│   ├── Layout.tsx              — sidebar + header + main wrapper
│   ├── StatCard.tsx            — reusable glass stat card
│   ├── StatusBadge.tsx         — colored status indicator
│   └── FilterPills.tsx         — reusable filter pill bar
├── data/
│   └── mockData.ts             — all mock agents, certs, alerts, templates, CAs
├── pages/
│   ├── Dashboard.tsx
│   ├── Agents.tsx
│   ├── AgentDetail.tsx
│   ├── Alerts.tsx
│   ├── Certificates.tsx
│   ├── IssuedCertificates.tsx
│   ├── CaManagement.tsx
│   ├── Templates.tsx
│   ├── RequestCertificate.tsx
│   ├── Authorization.tsx
│   ├── Settings.tsx
│   ├── AgentManagement.tsx
│   ├── EnrollmentKeys.tsx
│   ├── MsiPackages.tsx
│   └── ComplianceSettings.tsx
├── index.css                   — dark theme CSS variables + glass-card styles
└── App.tsx                     — routes + layout
```

## Implementation Order (batched)

1. **Theme + Layout** — CSS variables, glass-card classes, animations in `index.css`. `Layout.tsx` with sidebar provider. `AppSidebar.tsx` with all nav groups.

2. **Shared Components + Mock Data** — `StatCard`, `StatusBadge`, `FilterPills`. `mockData.ts` with ~15 agents, ~30 certificates, ~20 alerts, templates, CAs, role assignments.

3. **Dashboard** — 6 stat cards, Recharts donut for agent status, recent alerts list, agent status table.

4. **Agents + Agent Detail** — Filter pills (All/Online/Offline/Pending), search, agent table with status badges. Detail page with back link, agent header card, certificate list, scan history.

5. **Certificates + Issued Certificates** — Filter tabs, search, data tables with status badges and truncated thumbprints.

6. **Alerts** — Severity filter pills (All/Critical/Warning/Info), alert cards with colored left border and severity icons, acknowledge/dismiss actions.

7. **CA Management + Templates + Request Certificate** — CA cards with connection status. Template cards with publish toggle. Multi-step request wizard (template → subject → key options → review).

8. **Authorization** — Stat cards, role assignment table, assign role dialog with user/role/template scope selectors.

9. **Settings pages** — Tabbed settings page, Agent Management with license bar, Enrollment Keys table, MSI Packages cards, Compliance profile selector.

## Technical Notes
- All data is mock/static — no API calls, no Supabase
- Recharts for the dashboard donut chart (already installed)
- Shadcn Table, Dialog, Tabs, Badge, Switch, Progress components used throughout
- React Router `useParams` for agent detail page
- Search and filter state managed with `useState` per page

