# Kairos — Activation Funnel

## The Funnel

```
withkairos.dev (landing)
       ↓
withkairos.dev/docs
       ↓
pip install kairos-trace / npm install kairos-sdk
       ↓
First trace sent (first event in dashboard)
       ↓
First replay viewed
       ↓
Second session (retained)
       ↓
Paying customer
```

## Where to Watch for Drop-Off

| Step | Tracked By | Drop Signal |
|---|---|---|
| Landing → Docs | PostHog pageview | High bounce on landing = messaging problem |
| Docs → Install | PostHog copy button click | Nobody copying install = docs too confusing |
| Install → First trace | Backend: first event received | Install but no trace = SDK too hard to use |
| First trace → Replay | PostHog: replay tab click | Trace sent but no replay = dashboard not obvious |
| Replay → Return | Backend: second workflow | Viewed replay, never came back = not useful enough |
| Return → Pay | Manual (for now) | Using but not paying = wrong pricing/no payment flow |

## PostHog Events to Track (already set up)

All pageviews are automatic.

Custom events to add over time:
- `docs_copy_install` — copied pip/npm install command
- `docs_copy_quickstart` — copied quickstart code
- `replay_started` — hit play on replay
- `replay_completed` — watched to end
- `event_filter_used` — clicked an event type filter
- `jump_to_error_used` — clicked jump to error

## How to Read This as Founder

### Session Recordings (PostHog)
Go to posthog.com → Session Recordings.
Watch real users navigate your site without talking to them.
Look for: hesitation, rage clicks, confusion, where they leave.

### Funnel Analytics (PostHog)
Go to Funnels → create funnel:
Step 1: pageview /
Step 2: pageview /docs
Step 3: pageview /app

This shows % of people making each step.

### The Number That Matters Most Right Now

**Install → First trace rate.**

If someone installs but never sends a trace, the SDK onboarding is broken.
Fix that before anything else.

## Fixing Drop-Off

| Where They Drop | What To Fix |
|---|---|
| Landing page | Clarify what Kairos does in 1 sentence |
| Docs | Make quickstart shorter and faster |
| Install → trace | Add a 1-command demo mode (`kairos demo`) |
| Trace → replay | Make dashboard link more obvious in CLI output |
| Replay → return | Email/follow-up when trace is sent |
| Return → pay | Add pricing page |

## The One Metric That Matters This Month

```
Developers who sent at least 1 trace: ____
```

Everything else is secondary.
