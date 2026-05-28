'use client'

import Link from 'next/link'
import { useState } from 'react'

const ROADMAP = [
  { phase: 'Kairos Trace',   desc: 'Execution telemetry, replay, governance, operational memory', status: 'Now',     active: true  },
  { phase: 'Kairos Control', desc: 'Runtime policy enforcement, approvals, escalation routing',   status: 'Next',    active: false },
  { phase: 'Kairos Runtime', desc: 'Autonomous execution environments, sandboxed runtimes',       status: 'Phase 3', active: false },
  { phase: 'Kairos Grid',    desc: 'Multi-agent coordination, distributed orchestration',          status: 'Phase 4', active: false },
  { phase: 'Kairos Sim',     desc: 'Simulation, adversarial testing, execution forecasting',      status: 'Phase 5', active: false },
]

const PILLARS = [
  {
    icon: '◎',
    label: 'Observe',
    headline: 'Every execution, captured.',
    body: 'Every prompt, tool call, decision, approval, and failure — recorded with timing, cost, and full context. Nothing inferred. Nothing lost.',
  },
  {
    icon: '↺',
    label: 'Replay',
    headline: 'Step through any failure.',
    body: 'Reconstruct any autonomous execution exactly as it happened. Inspect every decision point. Debug without guessing.',
  },
  {
    icon: '⊡',
    label: 'Govern',
    headline: 'Policies that execute at runtime.',
    body: 'Define rules, require human approvals, and enforce escalation paths — enforced before the agent takes the next action.',
  },
  {
    icon: '⌘',
    label: 'Control',
    headline: 'Infrastructure for scale.',
    body: 'Sub-millisecond ingestion, async event pipelines, and a structured data model designed for production autonomous systems.',
  },
]

const TRACE_EVENTS = [
  { color: '#1a56ff', label: 'workflow.started',    detail: 'agent: research-agent · run_id: a3f9' },
  { color: '#8b5cf6', label: 'prompt.sent',         detail: 'model: claude-sonnet-4-6 · 312 tokens' },
  { color: '#f59e0b', label: 'tool.called',         detail: 'web_search · "EU AI Act obligations 2024"' },
  { color: '#10b981', label: 'tool.completed',      detail: '8 results · 1640ms · latency ok' },
  { color: '#ec4899', label: 'decision.scored',     detail: 'reasoning: EU Act most credible · confidence: 0.91' },
  { color: '#06b6d4', label: 'memory.written',      detail: 'key: search_results · 4.2KB stored' },
  { color: '#f97316', label: 'policy.checked',      detail: 'require_human_approval · result: pass' },
  { color: '#8b5cf6', label: 'output.received',     detail: '1840 tokens · 3480ms · $0.0118' },
  { color: '#10b981', label: 'run.completed',       detail: 'total: 8.42s · 2152 tokens · $0.0118' },
]

function EarlyAccessForm({ large }: { large?: boolean }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#1a56ff]/10 border border-[#1a56ff]/30 rounded text-sm text-[#1a56ff] font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-[#1a56ff]" />
        You&apos;re on the list.
      </div>
    )
  }

  return (
    <form onSubmit={e => { e.preventDefault(); if (email) setSubmitted(true) }} className="flex items-center gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="your@email.com"
        className={`px-4 py-2.5 bg-[#0d1017] border border-[#1e2232] rounded text-sm text-white placeholder-[#4b5563] focus:outline-none focus:border-[#1a56ff]/50 font-mono transition-colors ${large ? 'w-72' : 'w-60'}`}
      />
      <button
        type="submit"
        className="px-5 py-2.5 bg-[#1a56ff] text-white text-sm font-semibold rounded hover:bg-[#1849e0] transition-colors tracking-wide whitespace-nowrap"
      >
        Request Access
      </button>
    </form>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#080a0f] text-[#e8eaf0]">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-[#13161f] bg-[#080a0f]/95 backdrop-blur-md">
        <span className="font-mono text-sm font-semibold text-white tracking-widest">Kairos</span>
        <div className="hidden md:flex items-center gap-8">
          {['Product', 'Docs', 'Company'].map(l => (
            <a key={l} href="#" className="text-xs text-[#4b5563] hover:text-[#6b7280] transition-colors tracking-wide uppercase">
              {l}
            </a>
          ))}
        </div>
        <Link
          href="/app"
          className="px-4 py-1.5 text-xs font-semibold tracking-wider uppercase border border-[#1e2232] text-[#6b7280] rounded hover:text-white hover:border-[#2d3350] transition-colors"
        >
          Open Dashboard
        </Link>
      </nav>

      {/* HERO */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(26,86,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(26,86,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_45%,rgba(26,86,255,0.05)_0%,transparent_70%)]" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-10 px-3 py-1.5 border border-[#1a56ff]/20 rounded-full bg-[#1a56ff]/5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1a56ff] animate-pulse" />
            <span className="text-xs text-[#1a56ff] tracking-widest uppercase font-mono">Kairos Trace — Early Access</span>
          </div>

          <h1 className="text-5xl md:text-[72px] font-semibold tracking-tight text-white leading-[1.05] mb-6">
            The flight recorder for<br />
            <span className="text-[#1a56ff]">autonomous operations.</span>
          </h1>

          <p className="text-xl text-[#6b7280] max-w-2xl mx-auto leading-relaxed mb-4">
            Kairos captures every prompt, decision, tool call, approval, and failure —
            so autonomous systems can be replayed, governed, and controlled.
          </p>

          <p className="text-sm text-[#4b5563] font-mono mb-10 tracking-wide">
            Observe what happened.&nbsp;&nbsp;Replay why it happened.&nbsp;&nbsp;Control what happens next.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
            <EarlyAccessForm />
            <Link href="/app" className="text-sm text-[#4b5563] hover:text-[#6b7280] transition-colors font-mono">
              View live dashboard →
            </Link>
          </div>

          {/* Execution console */}
          <div className="w-full max-w-2xl mx-auto text-left bg-[#0d1017] border border-[#1e2232] rounded-xl overflow-hidden shadow-2xl shadow-black/60">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#13161f] bg-[#080a0f]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28ca41]" />
                <span className="ml-3 text-xs text-[#4b5563] font-mono">kairos — research-agent · execution trace</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono border border-emerald-400/20 bg-emerald-400/5 px-2 py-0.5 rounded">completed · 8.42s</span>
            </div>
            <div className="p-5">
              {TRACE_EVENTS.map((ev, i) => (
                <div key={i} className="flex gap-3 group">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full mt-[13px] flex-shrink-0" style={{ background: ev.color }} />
                    {i < TRACE_EVENTS.length - 1 && <div className="w-px flex-1 bg-[#13161f] my-0.5 min-h-[10px]" />}
                  </div>
                  <div className="py-1.5 flex items-baseline gap-3 flex-1 min-w-0">
                    <span className="text-xs font-mono font-semibold flex-shrink-0 w-36" style={{ color: ev.color }}>{ev.label}</span>
                    <span className="text-[11px] text-[#4b5563] font-mono truncate">{ev.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-[#13161f] bg-[#0d1017]">
        <div className="max-w-5xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '< 1ms',  label: 'Ingestion latency' },
            { value: '100%',   label: 'Execution captured' },
            { value: 'Full',   label: 'Replay fidelity'   },
            { value: 'Any',    label: 'Agent framework'   },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-semibold text-white mb-1.5">{s.value}</div>
              <div className="text-xs text-[#4b5563] uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY NOW */}
      <section className="max-w-3xl mx-auto px-6 py-32 text-center">
        <p className="text-xs text-[#1a56ff] tracking-widest uppercase font-mono mb-5">Why now</p>
        <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight leading-[1.2] mb-8">
          Autonomous systems are moving<br />from chat to action.
        </h2>
        <p className="text-[#6b7280] leading-relaxed text-base max-w-xl mx-auto mb-6">
          When AI agents browse the web, execute code, move money, and control infrastructure —
          failures become expensive and dangerous. You need visibility, replay, and control.
          Not just logs.
        </p>
        <p className="text-sm text-[#4b5563] font-mono">
          Competitors answer: &ldquo;what happened in my AI app?&rdquo;<br />
          Kairos answers: &ldquo;can I safely operate autonomous systems at scale?&rdquo;
        </p>
      </section>

      {/* PILLARS */}
      <section className="border-t border-[#13161f] bg-[#0d1017]">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <p className="text-xs text-[#1a56ff] tracking-widest uppercase font-mono mb-5 text-center">Capabilities</p>
          <h2 className="text-3xl font-semibold text-white text-center tracking-tight mb-4">
            Built for operational infrastructure.
          </h2>
          <p className="text-sm text-[#4b5563] text-center mb-16 max-w-lg mx-auto">
            Not a dashboard. Not a debugger. Operational infrastructure for autonomous systems.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PILLARS.map(p => (
              <div key={p.label} className="p-8 border border-[#13161f] rounded-xl hover:border-[#1e2232] transition-colors">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-xl text-[#1a56ff] font-mono">{p.icon}</span>
                  <span className="text-xs font-mono text-[#1a56ff] uppercase tracking-widest">{p.label}</span>
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{p.headline}</h3>
                <p className="text-sm text-[#6b7280] leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SDK */}
      <section className="max-w-5xl mx-auto px-6 py-28">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-xs text-[#1a56ff] tracking-widest uppercase font-mono mb-5">Developer SDK</p>
            <h2 className="text-3xl font-semibold text-white tracking-tight mb-5">
              Integrate in under<br />5 minutes.
            </h2>
            <p className="text-[#6b7280] leading-relaxed mb-8 text-sm">
              One call wraps your agent execution. Kairos captures everything automatically —
              no schema changes, no infrastructure work, any model or framework.
            </p>
            <div className="space-y-3">
              {[
                'Zero-config agent wrapping',
                'Automatic tool call and decision capture',
                'Human approval checkpoints',
                'Step-by-step replay from day one',
              ].map(f => (
                <div key={f} className="flex items-center gap-2.5 text-sm text-[#6b7280]">
                  <span className="text-[#1a56ff] font-mono text-xs">✓</span>
                  {f}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0d1017] border border-[#1e2232] rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#13161f] bg-[#080a0f]">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28ca41]" />
              <span className="ml-2 text-xs text-[#4b5563] font-mono">agent.ts</span>
            </div>
            <div className="p-6 font-mono text-[13px] leading-7">
              <p>
                <span className="text-[#4b5563]">import</span>{' '}
                <span className="text-white">{'{ createKairos }'}</span>{' '}
                <span className="text-[#4b5563]">from</span>{' '}
                <span className="text-[#1a56ff]">&apos;kairos-sdk&apos;</span>
              </p>
              <p className="mt-4">
                <span className="text-[#4b5563]">const</span>{' '}
                <span className="text-white">kairos</span>{' '}
                <span className="text-[#4b5563]">=</span>{' '}
                <span className="text-white">createKairos</span>
                <span className="text-[#4b5563]">()</span>
              </p>
              <p className="mt-5">
                <span className="text-[#4b5563]">const</span>{' '}
                <span className="text-white">exec</span>{' '}
                <span className="text-[#4b5563]">=</span>{' '}
                <span className="text-white">kairos</span>
                <span className="text-[#4b5563]">.</span>
                <span className="text-white">execution</span>
                <span className="text-[#4b5563]">{'({'}</span>
              </p>
              <p className="pl-5">
                <span className="text-[#4b5563]">workflowName:</span>{' '}
                <span className="text-[#1a56ff]">&apos;research-agent&apos;</span>
              </p>
              <p><span className="text-[#4b5563]">{'})'})</span></p>
              <p className="mt-1 pl-5">
                <span className="text-[#4b5563]">.</span>
                <span className="text-white">setPrompt</span>
                <span className="text-[#4b5563]">(prompt)</span>
              </p>
              <p className="pl-5">
                <span className="text-[#4b5563]">.</span>
                <span className="text-white">toolCall</span>
                <span className="text-[#4b5563]">{'({'}</span>
                <span className="text-[#4b5563]"> name:</span>{' '}
                <span className="text-[#1a56ff]">&apos;web_search&apos;</span>
                <span className="text-[#4b5563]">, input, output </span>
                <span className="text-[#4b5563]">{'})'}</span>
              </p>
              <p className="pl-5">
                <span className="text-[#4b5563]">.</span>
                <span className="text-white">decision</span>
                <span className="text-[#4b5563]">(</span>
                <span className="text-[#1a56ff]">&apos;Selected best source&apos;</span>
                <span className="text-[#4b5563]">, </span>
                <span className="text-white">0.94</span>
                <span className="text-[#4b5563]">)</span>
              </p>
              <p className="mt-4">
                <span className="text-[#4b5563]">await</span>{' '}
                <span className="text-white">exec</span>
                <span className="text-[#4b5563]">.</span>
                <span className="text-white">complete</span>
                <span className="text-[#4b5563]">(output)</span>
              </p>
              <p className="mt-5 text-[#1a56ff] text-xs">// 9 events captured · 0.4ms overhead</p>
            </div>
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="border-t border-[#13161f] bg-[#0d1017]">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <p className="text-xs text-[#1a56ff] tracking-widest uppercase font-mono mb-5 text-center">Architecture</p>
          <h2 className="text-3xl font-semibold text-white text-center mb-4 tracking-tight">
            The full autonomy stack.
          </h2>
          <p className="text-sm text-[#4b5563] text-center mb-14 max-w-lg mx-auto">
            Kairos is being built layer by layer — from execution visibility up to full autonomous operational infrastructure.
          </p>
          <div className="flex flex-col gap-0 border border-[#13161f] rounded-xl overflow-hidden">
            {ROADMAP.map((row, i) => (
              <div
                key={row.phase}
                className={`flex items-center justify-between px-7 py-5 ${i > 0 ? 'border-t border-[#13161f]' : ''} ${row.active ? 'bg-[#080a0f]' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${row.active ? 'bg-[#1a56ff] animate-pulse' : 'bg-[#1e2232]'}`} />
                  <div>
                    <div className={`text-sm font-semibold ${row.active ? 'text-white' : 'text-[#4b5563]'}`}>{row.phase}</div>
                    <div className="text-xs text-[#4b5563] mt-0.5">{row.desc}</div>
                  </div>
                </div>
                <span className={`text-xs font-mono px-2 py-0.5 rounded border ${row.active ? 'text-[#1a56ff] border-[#1a56ff]/30 bg-[#1a56ff]/10' : 'text-[#4b5563] border-[#13161f]'}`}>
                  {row.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#13161f]">
        <div className="max-w-2xl mx-auto px-6 py-32 text-center">
          <p className="text-xs text-[#1a56ff] tracking-widest uppercase font-mono mb-5">Early Access</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-5 tracking-tight leading-[1.2]">
            Build autonomous systems<br />you can trust.
          </h2>
          <p className="text-[#6b7280] mb-12 text-base leading-relaxed max-w-lg mx-auto">
            Join early teams building on Kairos Trace. API access, SDK, and live dashboard — free during beta.
          </p>
          <div className="flex flex-col items-center gap-4">
            <EarlyAccessForm large />
            <p className="text-xs text-[#4b5563] font-mono">No credit card. No commitment. Cancel any time.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#13161f] px-8 py-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-mono text-xs text-[#4b5563] tracking-widest">Kairos</span>
          <span className="text-xs text-[#4b5563]">The control layer for autonomous operations.</span>
        </div>
      </footer>

    </div>
  )
}
