# Services Studio - Frontend Prototype

A frontend-only, interactive prototype of the Services Studio module for x1.new.

## Overview

Services Studio helps users configure production-ready service stacks for their iOS apps. The prototype simulates the full flow from template selection to stack lock, including AI-assisted service connection.

## How to Run

```bash
cd x1-foreman
npm install
npm run dev
```

Then open [http://localhost:3000/services-studio](http://localhost:3000/services-studio)

## Routes

| Route | Description |
|-------|-------------|
| `/services-studio` | Main entry point - Welcome screen → Overview → Cost → Review |
| `/services-studio/service/[serviceId]` | Service detail page |

## User Flow

1. **Welcome Screen**: Choose between Livestream App or Job Swipe App template
2. **Overview Board**: View recommended services stack, connect services via modal
3. **Cost Scenarios**: Adjust MAU, usage, concurrency sliders to see estimated costs
4. **Review & Lock**: Review all services and lock the stack to generate artifacts

## Key Features

### Service Cards
Each service displays:
- Provider name and logo
- Connection status pill (Not connected → Needs action → Connected → Locked)
- Risk level chip (Low/Medium/High)
- Cost driver label

### Connect Flow Modal
Three connection methods:
1. **x1 Connector** - Quick one-click connect (when available)
2. **Paste API Key** - Manual credential entry
3. **Agent Assist** - AI agent simulates account creation with user pause points

### Agent Assist Simulation
The Agent Assist flow includes interactive pause states:
- Verify email → User clicks "I verified my email"
- Complete 2FA → User clicks "Done with 2FA"  
- Billing → User chooses "Skip for now (Sandbox)" or "Add billing (Production)"

### Verification Outcomes
Configurable per provider in `mockServicesConfig.ts`:
- `success` - Connection verified
- `partial` - Needs action (e.g., missing permissions)
- `fail` - Error state

## How to Tweak Mock Outcomes

Edit `/src/config/mockServicesConfig.ts`:

### Change Verification Outcomes
```typescript
// Find the provider and modify defaultVerificationOutcome
'mux': {
  ...
  defaultVerificationOutcome: 'success', // Change to 'partial' or 'fail'
}
```

### Enable/Disable Quick Connector
```typescript
'mux': {
  ...
  hasConnector: true, // Set to false to disable x1 Connector option
}
```

### Add/Remove Services
Modify the `livestreamServices` or `jobSwipeServices` arrays to change template contents.

### Adjust Cost Formulas
Edit the `calculateCostForTemplate` function to modify how costs are calculated.

## State Persistence

All state is persisted to localStorage under key `x1-services-studio`:
- Selected template
- Provider selections per service
- Connection status and environment
- Cost scenario values
- Lock state

State persists across page refreshes.

## File Structure

```
src/
├── app/services-studio/
│   ├── page.tsx                    # Main page
│   └── service/[serviceId]/
│       └── page.tsx                # Service detail page
├── components/services-studio/
│   ├── index.ts                    # Exports
│   ├── ServicesStudioLayout.tsx    # Shell with top bar + left rail
│   ├── WelcomeScreen.tsx           # Template selection
│   ├── OverviewBoard.tsx           # Services grid + recommendations
│   ├── ServiceCard.tsx             # Individual service card
│   ├── ServiceDetail.tsx           # Full service detail view
│   ├── ConnectFlowModal.tsx        # Connection modal with Agent Assist
│   ├── ComparePanel.tsx            # Provider comparison slide-out
│   ├── CostScenarios.tsx           # Cost sliders + estimation
│   └── ReviewLock.tsx              # Summary + lock + artifacts
├── config/
│   └── mockServicesConfig.ts       # Templates, providers, cost formulas
├── store/
│   └── useServicesStudioStore.ts   # Zustand store with localStorage
└── types/
    └── servicesStudio.ts           # TypeScript types
```

## Acceptance Criteria ✓

- [x] Open `/services-studio`
- [x] Select Livestream App
- [x] Generate recommended stack
- [x] Connect Live Video via Agent Assist, choose Sandbox vs Production
- [x] Run verify and see a success/partial/fail outcome
- [x] Connect at least one more service via Paste Key or Connector
- [x] Adjust cost sliders and see estimated monthly cost update
- [x] Review artifacts
- [x] Lock stack and see all services become Locked
- [x] Refresh page and state persists

## Templates

### Livestream App
- Auth: Apple Sign-In
- Live Video: Mux (alts: AWS IVS, Agora, LiveKit)
- Payments: StoreKit (optional)
- Analytics: Firebase (alts: PostHog)
- Notifications: APNs (optional)

### Job Swipe App
- Auth: Apple Sign-In
- Job Data: Aggregator (alts: ATS Scraping, Partnerships)
- Analytics: PostHog (alts: Firebase)
- Notifications: APNs (optional)
- Payments: StoreKit (optional)

## Design Notes

- Dark UI following x1 brand palette
- Premium spacing and typography
- Studio-style left rail navigation
- Smooth transitions using Framer Motion
- No dev jargon in user-facing copy
