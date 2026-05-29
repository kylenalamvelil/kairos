# Kairos — User Research System

Every user who installs Kairos is data. Capture everything.

---

## BEFORE THE CALL — Screening message

Send this before booking:

```
Before we jump on a call — three quick questions:

1. What are you building? (type of agent, framework used)
2. Have you hit any debugging or observability pain with your agents?
3. Do you currently use any tracing/monitoring tools?

Takes 2 min. Helps me make the call more useful for you.
```

---

## ON THE CALL — Watch, don't pitch

Rules:
- Do NOT explain the product. Let them read the docs.
- Do NOT help unless they've been stuck for 3+ minutes.
- Do NOT defend anything. Just listen and take notes.
- DO ask "what were you expecting?" whenever they look confused.
- DO ask "what would you do next?" when they pause.

---

## INSTALL OBSERVATION CHECKLIST

Track exactly where they go and what they do:

### Landing page (withkairos.dev)
- [ ] Did they immediately understand what it does?
- [ ] Did they click docs or try to install first?
- [ ] What did they read first?
- [ ] What confused them?
- [ ] What did they skip?

### Docs page (withkairos.dev/docs)
- [ ] Did they find the install command without help?
- [ ] Did they try TypeScript or Python?
- [ ] Did they copy the quickstart and run it?
- [ ] What was the first error (if any)?
- [ ] How long from landing on docs to first command?

### Install
- [ ] Did `pip install kairos-trace` or `npm install kairos-sdk` work first try?
- [ ] Any errors?
- [ ] How long to first trace sent?

### Dashboard (withkairos.dev/app)
- [ ] Did they find it without being told?
- [ ] Did they understand the replay immediately?
- [ ] What did they click first?
- [ ] What confused them?
- [ ] Did they say anything positive unprompted?

---

## POST-INSTALL INTERVIEW — Questions to ask

Ask these after they've installed (or given up trying):

### About the install experience
1. "Walk me through what just happened in your head."
2. "Where did you get confused or slow down?"
3. "What were you expecting to happen that didn't?"
4. "What would have made that faster?"

### About the product
5. "What does Kairos do, in your own words?"
6. "Is that useful to you? Why or why not?"
7. "When would you actually use this?"
8. "What's missing that would make you use it every day?"

### About replay specifically
9. "When you looked at the replay — did you understand what happened?"
10. "What did you want to do in the replay that you couldn't?"

### About pain
11. "How do you currently debug your agents when something goes wrong?"
12. "How painful is that? 1-10."
13. "What's the most frustrating part of building agents right now?"

### About willingness to pay
14. "If Kairos solved that debugging problem completely — would you pay for it?"
15. "What would you pay per month if it saved you 2 hours of debugging per week?"

### The retention question
16. "If I turned Kairos off tomorrow — would you notice?"
17. "Would you be annoyed? Why?"

---

## AFTER EACH CALL — Log this immediately

Fill this out within 10 minutes of hanging up:

```
Date:
Developer name:
Framework they use:
What they build:

INSTALL
- Time from landing to first trace: ____ minutes
- Got stuck at: 
- First error (if any):
- Needed help with:

REPLAY
- Understood it: YES / NO / PARTIALLY
- Said something positive: YES / NO
- Quote (if any):

FEEDBACK
- Biggest confusion:
- Biggest missing feature:
- Would they use it again: YES / NO / MAYBE
- Would they pay: YES / NO / MAYBE
- Retention signal (1-10):

QUOTE
Best thing they said (exact words):

ACTION
What to fix based on this call:
```

---

## FRICTION TRACKER

Every time a user hits friction, add it here. Track frequency.

| Friction point | Times hit | Priority |
|---|---|---|
| | | |

Common friction points to watch for:
- Can't find install command
- Import error after install
- No data showing in dashboard
- Confused by replay controls
- Don't understand what events mean
- API not connecting
- Empty state with no guidance

When 3+ users hit the same friction point — fix it immediately before finding more users.

---

## METRICS TO TRACK

After each user, update this:

| Metric | Count |
|---|---|
| Calls booked | 0 |
| Installs attempted | 0 |
| Installs successful | 0 |
| First trace sent | 0 |
| Replay viewed | 0 |
| Would use again | 0 |
| Would pay | 0 |

---

## THE SIGNAL

The thing you're listening for:

**"I can't debug my agent without this."**

Not: "Nice dashboard."
Not: "Cool idea."
Not: "Interesting."

Dependency. That's the signal.

If 3 out of 10 users say some version of "I'd be annoyed if this went away" — you have something.

If 0 out of 10 say it — the product needs to change before you find more users.
