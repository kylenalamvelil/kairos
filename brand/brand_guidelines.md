# KAIROS Brand Guidelines
**Version 1.0 — May 2026**

---

## 1. Company Positioning

**Tagline:** The system of record for autonomous execution.

**What KAIROS is:**
KAIROS is infrastructure for teams running autonomous AI agents. It captures, stores, and replays every decision an agent makes — giving operators the observability they need to debug, audit, and trust their systems.

**What KAIROS is not:**
KAIROS is not an AI product. It is not a no-code builder. It is not a ChatGPT wrapper. It is the layer beneath all of them.

**Market position:**
- Engineering teams building with LLM agents need production-grade observability
- Existing tools (logging, APM) were designed for deterministic systems
- KAIROS is purpose-built for probabilistic, long-running, multi-step agent behavior
- Category: Agent Observability / Autonomous Systems Infrastructure

**Target user:**
A senior engineer or platform team lead at a company that has deployed AI agents to production and is dealing with failures they cannot explain. They've tried logs. Logs don't cut it.

---

## 2. Brand Voice

### Principles

**Builder-to-builder.** Write like a senior engineer talking to another senior engineer. You've both been in production at 2am. Skip the pitch.

**Direct.** Say what you mean in the fewest words that carry the full weight. If it can be cut, cut it.

**Technical without gatekeeping.** Use precise language. Reference real systems. Don't define every term, but don't exclude people who are one step behind either.

**Honest.** Share failures. Publish postmortems. Acknowledge tradeoffs. The infrastructure companies people trust most (AWS, Stripe, Cloudflare) earned trust by being honest about how hard the problems are.

### Tone by context

| Context | Tone |
|---|---|
| Documentation | Precise, neutral, no personality. Facts only. |
| Blog / engineering posts | Technical narrative. First-person. Real data. |
| Social media | Short. Sharp. Specific. One idea per post. |
| Marketing copy | Clean, direct. No adjectives that don't do work. |
| Error messages | Clear. Actionable. Never apologetic. |
| Release notes | What changed and why. No "excited to announce." |

### What to avoid

- AI buzzwords: "revolutionary," "groundbreaking," "transformative," "paradigm shift"
- Vague claims: "10x better," "the future of," "AI-powered" (unless the power is what's being described)
- Marketing voice: "we're thrilled," "excited to share," "game-changer"
- Passive voice as a hedge: don't say "mistakes were made" — say what broke and why
- Anthropomorphizing agents unnecessarily: they're systems, not beings
- Blue color cliches, robot imagery, brain illustrations, neural network graphics

### Voice examples

**Wrong:** "We're excited to announce our groundbreaking AI observability platform that revolutionizes how teams understand their intelligent agents."

**Right:** "KAIROS 0.4 ships with structured replay. You can now step through an agent run decision-by-decision, with full context at each node."

---

**Wrong:** "Our cutting-edge infrastructure provides enterprise-grade reliability."

**Right:** "Every trace is written to an append-only log. Nothing is mutable after capture."

---

## 3. Color System

### Primary Palette

| Name | Hex | Usage |
|---|---|---|
| Black | `#050606` | Backgrounds, primary surfaces |
| Mint | `#9cffc7` | Primary accent — interactive elements, highlights, data points |
| Off-white | `#f6f7f4` | Primary text on dark backgrounds |
| Muted | `#6b7280` | Secondary text, metadata, timestamps |

### Extended Palette

| Name | Hex | Usage |
|---|---|---|
| Surface | `#0d0f0e` | Cards, panels on black |
| Border | `#1a1f1e` | Borders, dividers |
| Border Strong | `#2a3330` | Hover states, focus rings |
| Mint Dark | `#5ecc96` | Mint at lower opacity / hover state |
| Mint Muted | `#9cffc720` | Mint at 12.5% opacity — subtle highlights |
| Error | `#ff6b6b` | Errors, failures, anomalies |
| Warning | `#fbbf24` | Warnings, degraded states |
| Success | `#9cffc7` | (same as Mint) — success states |

### Color Rules

1. **Never use gradients.** Flat surfaces only.
2. **Never add glow effects.** No box-shadow glows, no text glow, no neon aesthetics.
3. **Mint is an accent, not a background.** It appears sparingly — on active states, highlights, key data, links.
4. **Text on black uses off-white (`#f6f7f4`), not pure white (`#ffffff`).** Pure white is harsh and untrue to the brand.
5. **Muted text (`#6b7280`) for metadata only.** Never use muted color for primary content.
6. **Error red is for genuine errors.** Don't use it for emphasis or decoration.

### Contrast Compliance

- `#f6f7f4` on `#050606`: 19.2:1 (AAA)
- `#9cffc7` on `#050606`: 12.4:1 (AAA)
- `#6b7280` on `#050606`: 4.8:1 (AA)
- `#050606` on `#9cffc7`: 12.4:1 (AAA)

---

## 4. Typography

### Primary Typeface: Inter

Inter is the only typeface used in KAIROS brand materials. It is geometric, neutral, and designed for screens. Do not substitute it.

**Loading:** `https://fonts.google.com/specimen/Inter` (Variable font where possible)

### Type Scale

| Role | Size | Weight | Letter-spacing | Line-height |
|---|---|---|---|---|
| Display | 64px | 700 | -0.02em | 1.1 |
| H1 | 48px | 700 | -0.01em | 1.15 |
| H2 | 36px | 600 | -0.005em | 1.2 |
| H3 | 24px | 600 | 0 | 1.3 |
| H4 | 18px | 600 | 0 | 1.4 |
| Body Large | 18px | 400 | 0 | 1.6 |
| Body | 16px | 400 | 0 | 1.6 |
| Body Small | 14px | 400 | 0 | 1.5 |
| Label | 12px | 500 | 0.06em | 1.4 |
| Caption | 11px | 400 | 0.04em | 1.4 |

### Monospace: JetBrains Mono

Used exclusively for: code, trace IDs, timestamps, event names, terminal output.

Never mix monospace into body copy. It signals "this is a system value" — use it only when that meaning is intended.

**Loading:** `https://fonts.google.com/specimen/JetBrains+Mono`

### Typography Rules

1. **No italic text in UI.** Use weight changes for emphasis.
2. **No all-caps except labels.** Labels at 12px/500 with 0.06em tracking.
3. **Wordmark tracking:** 0.08em — apply only to "KAIROS" in the logo lockup.
4. **Max line length:** 72 characters for prose, 90 for technical content.
5. **No text shadow.** Ever.

---

## 5. Logo

### Wordmark

"KAIROS" set in Inter 700 with letter-spacing 0.08em. All caps. No tagline in the wordmark lockup.

The wordmark is the primary logo. It is used in the majority of contexts.

### Mark (Symbol)

A minimal geometric diamond composed of two triangles meeting at the midpoint — representing a trace path through time: a starting node, a decision point, an endpoint. The top triangle points up (origin), the bottom points down (destination).

The mark is used:
- As a favicon / app icon
- In contexts where the wordmark would be too small (< 80px wide)
- As a standalone element in social media headers

### Versions

| Version | Use |
|---|---|
| Dark (white text on black background) | Default — website, dark UI, social media |
| Light (black text on white/light background) | Print, white-background documents |
| Mark only | Favicon, icon, small contexts |

### Clear Space

Maintain clear space equal to the cap-height of the "K" on all sides of the wordmark.

### Minimum Size

- Wordmark: 80px wide minimum
- Mark only: 16px minimum

### What not to do

- Do not recolor the wordmark in any color other than `#f6f7f4` (dark version) or `#050606` (light version)
- Do not add drop shadows
- Do not stretch or distort
- Do not place on a busy photographic background without an overlay
- Do not add the mark adjacent to other icons at the same visual weight
- Do not use the wordmark at weights other than 700

---

## 6. Design Principles

### Precision
Every element is where it is for a reason. Margins are consistent. Alignment is strict. There is no decorative whitespace — whitespace is structural.

### Trust
Infrastructure products earn trust through consistency and correctness. The UI should look like it was built by engineers who care about the details, because the details in production matter.

### Infrastructure, Not Consumer
KAIROS is used by people who have deployed code to production. The visual language should reflect that context. Dense information is acceptable. Technical labels are acceptable. Gradients and animations are not.

### Signal Over Noise
Data visualization should prioritize legibility. Highlight anomalies, failures, and decision points. Don't add decorative chart elements. Color is used to communicate state, not aesthetics.

---

## 7. Imagery and Photography

### Allowed

- Terminal / code editor screenshots (dark theme, real code)
- Infrastructure environments: server rooms, cables, rack-mounted hardware
- Data visualizations: graphs, traces, timelines
- Abstract geometric forms: grids, dots, paths — black and white or mint accent
- Hands on keyboards (technical work, not lifestyle)

### Not Allowed

- Robots, humanoid AI representations
- Brain illustrations, neural network graphics
- Blue color palette (the default "AI" look)
- Stock photography of people smiling at laptops
- Lightning bolts, rockets, speedometers (growth metaphors)
- Glowing orbs, particle effects, lens flares
- Circuit board textures as decoration

### Data Visualization Style

- Dark background (`#050606` or `#0d0f0e`)
- Lines and data points in mint (`#9cffc7`)
- Anomalies and errors in red (`#ff6b6b`)
- Axes and gridlines in `#1a1f1e` (barely visible)
- Labels in muted (`#6b7280`)
- No fill under line charts — lines only
- No 3D charts

---

## 8. Social Media

### Platform Focus

Primary: X (Twitter), LinkedIn, Hacker News
Secondary: GitHub (README, releases), personal founder posts

### Post Format

**X / Twitter:**
- 3-5 sentences max
- Technical substance in every post
- Code snippets welcome — use backticks or image cards
- No hashtags (looks desperate)
- No emojis unless they're literally just punctuation (—, →)
- Link to docs, GitHub, or blog — not to the homepage

**LinkedIn:**
- Same voice as X, but 2-3 paragraphs
- Founders write in first person
- Share what you've learned, not what you've launched
- Never use: "I'm excited to share," "thrilled to announce"

**Hacker News:**
- Show HN posts follow the pattern: what it is, how it works, why you built it
- Ask HN for genuine questions only
- Never use HN as a press release

### Post Quality Bar

Before publishing, ask:
1. Is there one specific, true, useful thing in this post?
2. Would a senior engineer find this credible?
3. Does it require buzzwords to land? (If yes, rewrite.)
4. Am I sharing something we actually built or learned? (If no, cut.)

### Example posts (correct voice)

> An agent called the same API 847 times in a loop before we caught it. The fix was a guard at the trace level, not the prompt level. We added loop detection to KAIROS. Ships in 0.4.

---

> EU AI Act Article 13: high-risk AI systems must maintain logs sufficient to reconstruct decisions. If you're running agents in any regulated workflow, your current logging probably doesn't meet this standard. Here's what it requires.

---

> We rebuilt our trace storage from JSONB to an append-only event log. Query time dropped from 340ms to 18ms at p95. The schema is on GitHub.

---

## 9. UI Components

### Buttons

- Primary: mint background (`#9cffc7`), black text (`#050606`), no border-radius or 2px max
- Secondary: transparent background, `#1a1f1e` border, off-white text
- Danger: `#ff6b6b` background, black text
- Disabled: opacity 40%, not grayed out
- No rounded buttons. Border-radius max 4px.

### Cards

- Background: `#0d0f0e`
- Border: 1px solid `#1a1f1e`
- Border-radius: 6px
- Padding: 24px
- No box-shadow (no drop shadows on cards)

### Code Blocks

- Background: `#0a0c0b`
- Font: JetBrains Mono 13px
- Border: 1px solid `#1a1f1e`
- Border-radius: 4px
- Syntax highlighting: keywords in mint, strings in off-white, comments in muted

### Badges / Tags

- Background: mint at 12.5% opacity (`#9cffc720`)
- Text: mint (`#9cffc7`)
- Font: Inter 11px/500, uppercase, 0.06em tracking
- Border-radius: 3px
- Padding: 2px 6px

### Tables

- Header background: `#0d0f0e`
- Header text: muted (`#6b7280`), uppercase, 11px
- Row border: 1px solid `#1a1f1e`
- Hover: `#0d0f0e`
- No zebra striping

### Forms / Inputs

- Background: `#0a0c0b`
- Border: 1px solid `#1a1f1e`
- Border-radius: 4px
- Focus: border color `#9cffc7`
- Placeholder: `#6b7280`
- Error: border color `#ff6b6b`

---

## 10. Motion and Animation

Kairos uses minimal animation. The rule: animation communicates state change, not decoration.

- **Duration:** 120-200ms for UI transitions, 300ms max
- **Easing:** ease-out for entrances, ease-in for exits, linear for loaders
- **No:** parallax, scroll animations, hero animations, lottie files, animated backgrounds
- **Yes:** hover state transitions, skeleton loading, progress indicators for real operations
- **Loading states:** simple spinner or progress bar. No skeleton screens unless content reflow is significant.

---

## 11. Brand Application Checklist

Before shipping any brand asset, verify:

- [ ] Colors are from the defined palette only
- [ ] No gradients
- [ ] No glow or drop-shadow effects (except 1px `#1a1f1e` borders)
- [ ] Typography is Inter or JetBrains Mono only
- [ ] Mint appears as accent only, not as a dominant background color
- [ ] Copy passes the voice check (direct, technical, no buzzwords)
- [ ] Logo clear space is maintained
- [ ] All text meets AA contrast minimum (AAA preferred)
- [ ] No robot/brain/gradient AI imagery

---

*KAIROS Brand Guidelines — maintained by the founding team. Questions: kylenalamvelil@icloud.com*
