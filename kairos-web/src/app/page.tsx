'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

const PLATFORM_LAYERS = [
  { name: 'Kairos Trace',   desc: 'Replay autonomous execution',         status: 'Now',     active: true  },
  { name: 'Kairos Control', desc: 'Govern autonomous operations',         status: 'Next',    active: false },
  { name: 'Kairos Runtime', desc: 'Coordinate execution at scale',        status: 'Phase 3', active: false },
  { name: 'Kairos Grid',    desc: 'Multi-agent coordination',             status: 'Phase 4', active: false },
  { name: 'Kairos Sim',     desc: 'Adversarial testing and forecasting',  status: 'Phase 5', active: false },
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

export default function Home() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx(i => (i + 1) % EVENTS.length)
    }, 950)
    return () => clearInterval(interval)
  }, [])

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const pct = (activeIdx / (EVENTS.length - 1)) * 100

  return (
    <div className="min-h-screen bg-[#080a0f] text-[#e8eaf0]">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-[#13161f] bg-[#080a0f]/95 backdrop-blur-md">
        <span className="font-mono text-sm font-semibold text-white tracking-widest">Kairos</span>
        <div className="hidden md:flex items-center gap-8">
          <a href="https://kairos-production-64c5.up.railway.app/docs" className="text-xs text-[#4b5563] hover:text-[#6b7280] transition-colors tracking-wide">API</a>
          <a href="https://www.npmjs.com/package/kairos-sdk" className="text-xs text-[#4b5563] hover:text-[#6b7280] transition-colors tracking-wide">SDK</a>
          <a href="https://github.com/kylenalamvelil/kairos" className="text-xs text-[#4b5563] hover:text-[#6b7280] transition-colors tracking-wide">GitHub</a>
        </div>
        <Link
          href="/app"
          className="px-4 py-1.5 text-xs font-semibold tracking-wider uppercase border border-[#1e2232] text-[#6b7280] rounded hover:text-white hover:border-[#2d3350] transition-colors font-mono"
        >
          Dashboard →
        </Link>
      </nav>

      {/* HERO */}
      <section className="relative pt-44 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(26,86,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(26,86,255,0.012)_1px,transparent_1px)] bg-[size:80px_80px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_35%_at_50%_25%,rgba(26,86,255,0.035)_0%,transparent_70%)]" />

        <div className="relative z-10 max-w-5xl mx-auto">

          {/* Badge */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#1a56ff]/15 rounded-full bg-[#1a56ff]/5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1a56ff] animate-pulse" />
              <span className="text-[11px] text-[#1a56ff] tracking-widest uppercase font-mono">Kairos Trace — Early Access</span>
            </div>
          </div>

          {/* Headline */}
          <div className="text-center mb-16">
            <h1 className="text-[52px] md:text-[76px] font-semibold tracking-tight leading-[1.0] mb-8">
              <span className="text-white">Operational Infrastructure</span><br />
              <span className="text-[#2d3350]">for Autonomous Systems.</span>
            </h1>
            <p className="text-sm text-[#4b5563] font-mono leading-relaxed max-w-lg mx-auto">
              Every prompt, decision, tool call, approval, and failure —<br />
              captured, replayable, and operationally governed.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <Link
              href="/app"
              className="px-7 py-3 bg-[#1a56ff] text-white text-sm font-semibold rounded hover:bg-[#1849e0] transition-colors"
            >
              Open Dashboard
            </Link>
            <button
              onClick={() => copy('npm install kairos-sdk', 'npm')}
              className="flex items-center gap-3 px-5 py-3 bg-[#0d1017] border border-[#13161f] rounded text-sm font-mono text-[#6b7280] hover:border-[#1e2232] hover:text-[#9ca3af] transition-colors"
            >
              <span className="text-[#2d3350]">$</span>
              npm install kairos-sdk
              <span className="text-[9px] text-[#4b5563] border border-[#1e2232] px-1.5 py-0.5 rounded">
                {copied === 'npm' ? 'copied' : 'copy'}
              </span>
            </button>
          </div>

          {/* REPLAY CONSOLE */}
          <div className="w-full max-w-3xl mx-auto bg-[#0d1017] border border-[#1e2232] rounded-xl overflow-hidden shadow-2xl shadow-black/80">

            {/* Title bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#13161f] bg-[#080a0f]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28ca41]" />
                <span className="ml-3 text-[11px] text-[#4b5563] font-mono">research-agent · execution replay</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-[#4b5563] font-mono">{activeIdx + 1} / {EVENTS.length} events</span>
                <span className="text-[10px] text-emerald-400 font-mono border border-emerald-400/15 bg-emerald-400/5 px-2 py-0.5 rounded">completed</span>
              </div>
            </div>

            {/* Scrubber */}
            <div className="px-5 py-2.5 border-b border-[#13161f] bg-[#080a0f]/60">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-[#1a56ff] font-mono flex-shrink-0">▶ 1x</span>
                <div className="flex-1 h-[3px] bg-[#13161f] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1a56ff] rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[10px] text-[#4b5563] font-mono flex-shrink-0">8.42s</span>
              </div>
            </div>

            {/* Events */}
            <div className="px-5 py-4 space-y-0.5">
              {EVENTS.map((ev, i) => {
                const isPast    = i < activeIdx
                const isCurrent = i === activeIdx
                const isFuture  = i > activeIdx
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-4 py-1.5 px-2 rounded transition-all duration-300 ${isCurrent ? 'bg-[#080a0f] -mx-2 px-4' : ''}`}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-500"
                      style={{
                        background: isFuture ? '#1e2232' : ev.color,
                        boxShadow: isCurrent ? `0 0 8px ${ev.color}88` : 'none',
                      }}
                    />
                    <span
                      className="text-[11px] font-mono font-semibold w-36 flex-shrink-0 transition-colors duration-300"
                      style={{ color: isFuture ? '#1e2232' : isPast ? ev.color + '55' : ev.color }}
                    >
                      {ev.type}
                    </span>
                    <span className={`text-[10px] font-mono w-16 flex-shrink-0 transition-colors duration-300 ${isFuture ? 'text-[#13161f]' : isPast ? 'text-[#1e2232]' : 'text-[#4b5563]'}`}>
                      {ev.t}
                    </span>
                    <span className={`text-[10px] font-mono truncate transition-colors duration-300 ${isFuture ? 'text-[#13161f]' : isPast ? 'text-[#1e2232]' : 'text-[#6b7280]'}`}>
                      {ev.detail}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM */}
      <section className="border-t border-[#13161f] bg-[#0d1017]">
        <div className="max-w-3xl mx-auto px-6 py-28">
          <p className="text-[11px] text-[#1a56ff] tracking-widest uppercase font-mono mb-14 text-center">Platform</p>
          <div className="border border-[#13161f] rounded-xl overflow-hidden">
            {PLATFORM_LAYERS.map((layer, i) => (
              <div
                key={layer.name}
                className={`flex items-center justify-between px-8 py-5 ${i > 0 ? 'border-t border-[#13161f]' : ''} ${layer.active ? 'bg-[#080a0f]' : ''}`}
              >
                <div className="flex items-center gap-5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${layer.active ? 'bg-[#1a56ff] animate-pulse' : 'bg-[#1e2232]'}`}
                  />
                  <div>
                    <div className={`text-sm font-mono font-semibold ${layer.active ? 'text-white' : 'text-[#2d3350]'}`}>{layer.name}</div>
                    <div className={`text-xs mt-0.5 ${layer.active ? 'text-[#4b5563]' : 'text-[#1e2232]'}`}>{layer.desc}</div>
                  </div>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${layer.active ? 'text-[#1a56ff] border-[#1a56ff]/20 bg-[#1a56ff]/5' : 'text-[#1e2232] border-[#13161f]'}`}>
                  {layer.status}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-[#1e2232] text-center mt-6 font-mono">
            Each layer is a natural expansion of the one below it.
          </p>
        </div>
      </section>

      {/* WHY */}
      <section className="max-w-2xl mx-auto px-6 py-28 text-center">
        <p className="text-[11px] text-[#1a56ff] tracking-widest uppercase font-mono mb-10">Why this exists</p>
        <h2 className="text-2xl font-semibold text-white leading-[1.4] mb-8 tracking-tight">
          Autonomous systems are moving<br />from conversation to action.
        </h2>
        <p className="text-sm text-[#4b5563] leading-relaxed font-mono">
          When AI agents execute code, move capital, control infrastructure, and coordinate operations —
          failures become expensive. Visibility becomes mandatory. Governance becomes existential.
        </p>
        <p className="text-sm text-[#2d3350] leading-relaxed font-mono mt-6">
          Kairos is not observability.<br />
          Kairos is the operational layer that makes autonomous execution trustworthy at scale.
        </p>
      </section>

      {/* SDK */}
      <section className="border-t border-[#13161f] bg-[#0d1017]">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div className="pt-2">
              <p className="text-[11px] text-[#1a56ff] tracking-widest uppercase font-mono mb-6">SDK</p>
              <h2 className="text-2xl font-semibold text-white mb-5 leading-tight tracking-tight">
                Instrument any agent<br />in three lines.
              </h2>
              <p className="text-sm text-[#4b5563] leading-relaxed mb-10 font-mono">
                TypeScript and Python. Zero-config. Any model, any framework.
                Executions appear in the dashboard instantly.
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => copy('npm install kairos-sdk', 'ts')}
                  className="flex items-center gap-3 w-full px-4 py-3 bg-[#080a0f] border border-[#13161f] rounded text-xs font-mono text-[#6b7280] hover:border-[#1e2232] hover:text-[#9ca3af] transition-colors text-left"
                >
                  <span className="text-[#2d3350]">$</span>
                  npm install kairos-sdk
                  <span className="ml-auto text-[9px] text-[#4b5563] border border-[#1e2232] px-1.5 py-0.5 rounded">
                    {copied === 'ts' ? 'copied' : 'copy'}
                  </span>
                </button>
                <button
                  onClick={() => copy('pip install kairos-sdk', 'py')}
                  className="flex items-center gap-3 w-full px-4 py-3 bg-[#080a0f] border border-[#13161f] rounded text-xs font-mono text-[#6b7280] hover:border-[#1e2232] hover:text-[#9ca3af] transition-colors text-left"
                >
                  <span className="text-[#2d3350]">$</span>
                  pip install kairos-sdk
                  <span className="ml-auto text-[9px] text-[#4b5563] border border-[#1e2232] px-1.5 py-0.5 rounded">
                    {copied === 'py' ? 'copied' : 'copy'}
                  </span>
                </button>
              </div>
            </div>

            <div className="bg-[#080a0f] border border-[#13161f] rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-[#13161f]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28ca41]" />
                <span className="ml-2 text-[10px] text-[#4b5563] font-mono">agent.ts</span>
              </div>
              <div className="p-6 font-mono text-[13px] leading-[1.9]">
                <p>
                  <span className="text-[#2d3350]">import</span>{' '}
                  <span className="text-[#6b7280]">{'{ createKairos }'}</span>{' '}
                  <span className="text-[#2d3350]">from</span>{' '}
                  <span className="text-[#1a56ff]">&apos;kairos-sdk&apos;</span>
                </p>
                <br />
                <p>
                  <span className="text-[#2d3270]">const</span>{' '}
                  <span className="text-white">exec</span>{' '}
                  <span className="text-[#2d3270]">=</span>{' '}
                  <span className="text-[#6b7280]">kairos</span>
                  <span className="text-[#2d3270]">.</span>
                  <span className="text-[#6b7280]">execution</span>
                  <span className="text-[#2d3270]">({'{ workflowName }'})</span>
                </p>
                <br />
                <p className="text-[#4b5563]">exec<span className="text-[#2d3270]">.</span>setPrompt<span className="text-[#2d3270]">(prompt)</span></p>
                <p className="text-[#4b5563]">exec<span className="text-[#2d3270]">.</span>toolCall<span className="text-[#2d3270]">({'{ name, input, output }'})</span></p>
                <p className="text-[#4b5563]">exec<span className="text-[#2d3270]">.</span>decision<span className="text-[#2d3270]">(reasoning, </span>confidence<span className="text-[#2d3270]">)</span></p>
                <br />
                <p>
                  <span className="text-[#2d3270]">await</span>{' '}
                  <span className="text-white">exec</span>
                  <span className="text-[#2d3270]">.</span>
                  <span className="text-[#6b7280]">complete</span>
                  <span className="text-[#2d3270]">(output)</span>
                </p>
                <br />
                <p className="text-[11px] text-[#1a56ff] opacity-70">{'// '} 9 events captured · replay available immediately</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#13161f]">
        <div className="max-w-xl mx-auto px-6 py-32 text-center">
          <h2 className="text-xl font-semibold text-white mb-4 tracking-tight">
            Operate autonomous systems<br />with confidence.
          </h2>
          <p className="text-xs text-[#2d3350] font-mono mb-12">
            Free during early access. No credit card required.
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

      {/* FOOTER */}
      <footer className="border-t border-[#13161f] px-8 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-mono text-xs text-[#1e2232] tracking-widest">Kairos</span>
          <span className="text-[10px] text-[#1e2232] font-mono">Operational infrastructure for autonomous systems.</span>
        </div>
      </footer>

    </div>
  )
}
