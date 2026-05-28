'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

// ── Platform hierarchy (LOCKED — do not reorder) ─────────────────────────────
const PLATFORM = [
  { name: 'Kairos Trace',   desc: 'Replay autonomous execution',          status: 'Now',     on: true  },
  { name: 'Kairos Control', desc: 'Govern autonomous operations',          status: 'Next',    on: false },
  { name: 'Kairos Runtime', desc: 'Coordinate execution at scale',         status: 'Phase 3', on: false },
  { name: 'Kairos Grid',    desc: 'Multi-agent coordination',              status: 'Phase 4', on: false },
  { name: 'Kairos Sim',     desc: 'Adversarial testing and forecasting',   status: 'Phase 5', on: false },
]

const CAPABILITIES = [
  { label: 'Trace',   body: 'Every prompt, tool call, decision, memory op, and failure — recorded with full context and timing.' },
  { label: 'Replay',  body: 'Step through any execution exactly as it ran. Inspect every decision point and failure branch.' },
  { label: 'Control', body: 'Human approval checkpoints, policy enforcement, and intervention before the next action executes.' },
  { label: 'Runtime', body: 'Execution environments, orchestration, scheduling, and state coordination at scale.' },
  { label: 'Memory',  body: 'Every execution becomes operational intelligence. Decisions, failures, and interventions — retained.' },
]

const EVENTS = [
  { color: '#1a56ff', type: 'workflow.started',  detail: 'agent: research-agent · run_id: a3f9b1',        t: '+0ms'     },
  { color: '#8b5cf6', type: 'prompt.sent',       detail: 'claude-sonnet-4-6 · 312 tokens',                t: '+12ms'    },
  { color: '#f59e0b', type: 'tool.called',       detail: 'web_search · "EU AI Act obligations 2025"',     t: '+84ms'    },
  { color: '#10b981', type: 'tool.completed',    detail: '8 results · latency 1640ms',                    t: '+1724ms'  },
  { color: '#ec4899', type: 'decision.scored',   detail: 'EUR-Lex most authoritative · confidence 0.93',  t: '+1731ms'  },
  { color: '#06b6d4', type: 'memory.written',    detail: 'key: eu_act_summary · 4.2KB stored',            t: '+1734ms'  },
  { color: '#f97316', type: 'policy.checked',    detail: 'require_human_approval · result: pass',         t: '+1736ms'  },
  { color: '#8b5cf6', type: 'output.received',   detail: '1840 tokens · 3480ms · $0.0118',                t: '+5210ms'  },
  { color: '#10b981', type: 'run.completed',     detail: 'total: 8.42s · 2152 tokens · $0.0118',          t: '+8420ms'  },
]

// ── Metallic wordmark ─────────────────────────────────────────────────────────
function Wordmark({ size = 'lg' }: { size?: 'sm' | 'lg' }) {
  const isLg = size === 'lg'
  return (
    <span
      className="select-none uppercase"
      style={{
        fontFamily: 'var(--font-michroma), "Exo 2", "Rajdhani", system-ui, sans-serif',
        fontSize: isLg ? 'clamp(52px, 8vw, 96px)' : '11px',
        fontWeight: 400,
        letterSpacing: isLg ? '0.42em' : '0.35em',
        backgroundImage: 'linear-gradient(180deg, #6b7280 0%, #9ca3af 18%, #ffffff 42%, #e8eaf0 52%, #9ca3af 72%, #6b7280 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        display: 'inline-block',
      }}
    >
      KAIROS
    </span>
  )
}

export default function Home() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [copied, setCopied] = useState<string | null>(null)
  const [capIdx, setCapIdx] = useState(0)

  useEffect(() => {
    const a = setInterval(() => setActiveIdx(i => (i + 1) % EVENTS.length), 950)
    return () => clearInterval(a)
  }, [])

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const pct = (activeIdx / (EVENTS.length - 1)) * 100

  return (
    <div className="min-h-screen bg-[#080a0f] text-[#e8eaf0] overflow-x-hidden">

      {/* ── NAV ────────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-[#13161f]/80 bg-[#080a0f]/90 backdrop-blur-md">
        <Wordmark size="sm" />
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'API',    href: 'https://kairos-production-64c5.up.railway.app/docs' },
            { label: 'SDK',    href: 'https://www.npmjs.com/package/kairos-sdk' },
            { label: 'GitHub', href: 'https://github.com/kylenalamvelil/kairos' },
          ].map(({ label, href }) => (
            <a key={label} href={href} className="text-xs text-[#4b5563] hover:text-[#6b7280] transition-colors tracking-widest uppercase font-mono">
              {label}
            </a>
          ))}
        </div>
        <Link
          href="/app"
          className="px-4 py-1.5 text-xs font-mono tracking-widest uppercase border border-[#1e2232] text-[#4b5563] rounded hover:text-[#6b7280] hover:border-[#2d3350] transition-colors"
        >
          Dashboard →
        </Link>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-24 overflow-hidden">

        {/* Background — faint execution topology */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(26,86,255,0.008)_1px,transparent_1px),linear-gradient(90deg,rgba(26,86,255,0.008)_1px,transparent_1px)] bg-[size:100px_100px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[radial-gradient(ellipse,rgba(26,86,255,0.04)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 w-full max-w-5xl mx-auto text-center">

          {/* Wordmark */}
          <div className="mb-10">
            <Wordmark size="lg" />
          </div>

          {/* Headline */}
          <p className="text-lg md:text-xl text-white font-semibold mb-3 tracking-wide">
            Autonomous systems run on Kairos.
          </p>
          <p className="text-sm text-[#4b5563] font-mono mb-14 tracking-wide">
            Operational infrastructure for autonomous execution.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-20">
            <Link
              href="/app"
              className="px-7 py-3 bg-[#1a56ff] text-white text-sm font-semibold rounded hover:bg-[#1849e0] transition-colors tracking-wide"
            >
              Open Dashboard
            </Link>
            <button
              onClick={() => copy('npm install kairos-sdk', 'npm')}
              className="flex items-center gap-3 px-5 py-3 bg-[#0d1017] border border-[#13161f] rounded text-sm font-mono text-[#4b5563] hover:border-[#1e2232] hover:text-[#6b7280] transition-colors"
            >
              <span className="text-[#2d3350]">$</span>
              npm install kairos-sdk
              <span className="text-[9px] text-[#2d3350] border border-[#13161f] px-1.5 py-0.5 rounded">
                {copied === 'npm' ? 'copied' : 'copy'}
              </span>
            </button>
          </div>

          {/* REPLAY CONSOLE */}
          <div className="w-full max-w-3xl mx-auto bg-[#0d1017] border border-[#1e2232] rounded-xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)]">

            <div className="flex items-center justify-between px-5 py-3 border-b border-[#13161f] bg-[#080a0f]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28ca41]" />
                <span className="ml-3 text-[11px] text-[#4b5563] font-mono">research-agent · execution replay</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-[#4b5563] font-mono">{activeIdx + 1} / {EVENTS.length}</span>
                <span className="text-[10px] text-emerald-400 font-mono border border-emerald-400/15 bg-emerald-400/5 px-2 py-0.5 rounded">completed</span>
              </div>
            </div>

            <div className="px-5 py-2.5 border-b border-[#13161f] bg-[#080a0f]/50">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-[#1a56ff] font-mono flex-shrink-0">▶ replay</span>
                <div className="flex-1 h-[2px] bg-[#13161f] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: '#1a56ff' }}
                  />
                </div>
                <span className="text-[10px] text-[#2d3350] font-mono flex-shrink-0">8.42s</span>
              </div>
            </div>

            <div className="px-5 py-4 space-y-0.5">
              {EVENTS.map((ev, i) => {
                const past    = i < activeIdx
                const current = i === activeIdx
                const future  = i > activeIdx
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-4 py-1.5 rounded-sm px-2 transition-all duration-300 ${current ? 'bg-[#080a0f] -mx-2 px-4' : ''}`}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-500"
                      style={{
                        background: future ? '#1e2232' : ev.color,
                        opacity: past ? 0.3 : 1,
                        boxShadow: current ? `0 0 8px ${ev.color}` : 'none',
                      }}
                    />
                    <span
                      className="text-[11px] font-mono font-semibold w-36 flex-shrink-0 transition-colors duration-300"
                      style={{ color: future ? '#1e2232' : past ? ev.color + '44' : ev.color }}
                    >
                      {ev.type}
                    </span>
                    <span className={`text-[10px] font-mono w-16 flex-shrink-0 ${future ? 'text-[#13161f]' : past ? 'text-[#1e2232]' : 'text-[#4b5563]'}`}>
                      {ev.t}
                    </span>
                    <span className={`text-[10px] font-mono truncate ${future ? 'text-[#13161f]' : past ? 'text-[#1e2232]' : 'text-[#6b7280]'}`}>
                      {ev.detail}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── CAPABILITIES ────────────────────────────────────────────────────── */}
      <section className="border-t border-[#13161f] bg-[#0d1017]">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <p className="text-[10px] text-[#1a56ff] tracking-[0.3em] uppercase font-mono mb-16 text-center">Capabilities</p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-0 border border-[#13161f] rounded-xl overflow-hidden">
            {CAPABILITIES.map((cap, i) => (
              <button
                key={cap.label}
                onClick={() => setCapIdx(i)}
                className={`text-left p-6 border-r border-[#13161f] last:border-r-0 transition-colors ${capIdx === i ? 'bg-[#080a0f]' : 'hover:bg-[#080a0f]/50'}`}
              >
                <div className={`text-xs font-mono font-semibold mb-2 tracking-widest uppercase transition-colors ${capIdx === i ? 'text-[#1a56ff]' : 'text-[#2d3350]'}`}>
                  {cap.label}
                </div>
                <div className={`text-[11px] leading-relaxed transition-colors ${capIdx === i ? 'text-[#4b5563]' : 'text-[#1e2232]'}`}>
                  {cap.body}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATFORM ─────────────────────────────────────────────────────────── */}
      <section className="border-t border-[#13161f]">
        <div className="max-w-3xl mx-auto px-6 py-24">
          <p className="text-[10px] text-[#1a56ff] tracking-[0.3em] uppercase font-mono mb-16 text-center">Platform</p>
          <div className="border border-[#13161f] rounded-xl overflow-hidden">
            {PLATFORM.map((layer, i) => (
              <div
                key={layer.name}
                className={`flex items-center justify-between px-8 py-5 ${i > 0 ? 'border-t border-[#13161f]' : ''} ${layer.on ? 'bg-[#0d1017]' : ''}`}
              >
                <div className="flex items-center gap-5">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${layer.on ? 'bg-[#1a56ff] animate-pulse' : 'bg-[#1e2232]'}`} />
                  <div>
                    <div className={`text-sm font-mono font-semibold ${layer.on ? 'text-white' : 'text-[#2d3350]'}`}>{layer.name}</div>
                    <div className={`text-xs mt-0.5 ${layer.on ? 'text-[#4b5563]' : 'text-[#1e2232]'}`}>{layer.desc}</div>
                  </div>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${layer.on ? 'text-[#1a56ff] border-[#1a56ff]/20 bg-[#1a56ff]/5' : 'text-[#1e2232] border-[#13161f]'}`}>
                  {layer.status}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-[#1e2232] text-center mt-6 font-mono tracking-wide">
            Each layer is a natural expansion of the one below it.
          </p>
        </div>
      </section>

      {/* ── WHY ──────────────────────────────────────────────────────────────── */}
      <section className="border-t border-[#13161f] bg-[#0d1017]">
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <p className="text-[10px] text-[#1a56ff] tracking-[0.3em] uppercase font-mono mb-10">Why this exists</p>
          <p className="text-xl font-semibold text-white leading-[1.5] mb-8 tracking-tight">
            Autonomous systems are moving<br />from conversation to action.
          </p>
          <p className="text-sm text-[#4b5563] leading-relaxed font-mono">
            When AI agents execute code, move capital, control infrastructure, and coordinate operations —
            failures become expensive. Visibility becomes mandatory. Governance becomes existential.
          </p>
          <div className="mt-8 pt-8 border-t border-[#13161f]">
            <p className="text-xs text-[#2d3350] font-mono tracking-wide">
              Kairos is not observability.<br />
              Kairos is the operational layer that makes autonomous execution trustworthy at scale.
            </p>
          </div>
        </div>
      </section>

      {/* ── SDK ──────────────────────────────────────────────────────────────── */}
      <section className="border-t border-[#13161f]">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div className="pt-2">
              <p className="text-[10px] text-[#1a56ff] tracking-[0.3em] uppercase font-mono mb-6">SDK</p>
              <h2 className="text-2xl font-semibold text-white mb-5 tracking-tight leading-snug">
                Instrument any agent<br />in three lines.
              </h2>
              <p className="text-sm text-[#4b5563] leading-relaxed mb-10 font-mono">
                TypeScript and Python. Zero-config. Any model, any framework. Executions appear in the dashboard instantly.
              </p>
              <div className="space-y-2">
                {[
                  { cmd: 'npm install kairos-sdk', key: 'npm' },
                  { cmd: 'pip install kairos-sdk', key: 'pip' },
                ].map(({ cmd, key }) => (
                  <button
                    key={key}
                    onClick={() => copy(cmd, key)}
                    className="flex items-center gap-3 w-full px-4 py-3 bg-[#0d1017] border border-[#13161f] rounded text-xs font-mono text-[#4b5563] hover:border-[#1e2232] hover:text-[#6b7280] transition-colors text-left"
                  >
                    <span className="text-[#2d3350]">$</span>
                    {cmd}
                    <span className="ml-auto text-[9px] text-[#2d3350] border border-[#13161f] px-1.5 py-0.5 rounded">
                      {copied === key ? 'copied' : 'copy'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#0d1017] border border-[#13161f] rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-[#13161f] bg-[#080a0f]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28ca41]" />
                <span className="ml-2 text-[10px] text-[#4b5563] font-mono">agent.ts</span>
              </div>
              <div className="p-6 font-mono text-[13px] leading-[2]">
                <p>
                  <span className="text-[#2d3350]">import</span>{' '}
                  <span className="text-[#6b7280]">{'{ createKairos }'}</span>{' '}
                  <span className="text-[#2d3350]">from</span>{' '}
                  <span className="text-[#1a56ff]">&apos;kairos-sdk&apos;</span>
                </p>
                <br />
                <p>
                  <span className="text-[#2d3350]">const</span>{' '}
                  <span className="text-white">exec</span>{' '}
                  <span className="text-[#2d3350]">=</span>{' '}
                  <span className="text-[#6b7280]">kairos.execution</span>
                  <span className="text-[#2d3350]">({'{ workflowName }'})</span>
                </p>
                <br />
                <p className="text-[#4b5563]">exec<span className="text-[#2d3350]">.</span>setPrompt<span className="text-[#2d3350]">(prompt)</span></p>
                <p className="text-[#4b5563]">exec<span className="text-[#2d3350]">.</span>toolCall<span className="text-[#2d3350]">({'{ name, input, output }'})</span></p>
                <p className="text-[#4b5563]">exec<span className="text-[#2d3350]">.</span>decision<span className="text-[#2d3350]">(reasoning, confidence)</span></p>
                <br />
                <p>
                  <span className="text-[#2d3350]">await</span>{' '}
                  <span className="text-white">exec</span>
                  <span className="text-[#2d3350]">.</span>
                  <span className="text-[#6b7280]">complete</span>
                  <span className="text-[#2d3350]">(output)</span>
                </p>
                <br />
                <p className="text-[11px] text-[#1a56ff]/60">{'// 9 events · replay immediately available'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="border-t border-[#13161f] bg-[#0d1017]">
        <div className="max-w-xl mx-auto px-6 py-32 text-center">
          <div className="mb-8">
            <Wordmark size="lg" />
          </div>
          <p className="text-xs text-[#2d3350] font-mono tracking-widest mb-12 uppercase">
            Free during early access
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/app"
              className="px-7 py-3 bg-[#1a56ff] text-white text-sm font-semibold rounded hover:bg-[#1849e0] transition-colors"
            >
              Open Dashboard
            </Link>
            <a
              href="https://github.com/kylenalamvelil/kairos"
              className="px-7 py-3 border border-[#13161f] text-[#4b5563] text-sm rounded hover:border-[#1e2232] hover:text-[#6b7280] transition-colors font-mono"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#13161f] px-8 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-mono text-[10px] text-[#1e2232] tracking-[0.3em] uppercase">Kairos</span>
          <span className="text-[10px] text-[#1e2232] font-mono">Operational infrastructure for autonomous systems.</span>
        </div>
      </footer>

    </div>
  )
}
