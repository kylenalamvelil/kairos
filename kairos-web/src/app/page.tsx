'use client'

import Link from 'next/link'
import { useState, useEffect, useRef, useCallback } from 'react'

const PLATFORM = [
  { tag: 'TRACE',   name: 'Kairos Trace',   desc: 'Replayable execution telemetry for autonomous agents.',    status: 'Live',    on: true  },
  { tag: 'CONTROL', name: 'Kairos Control', desc: 'Human checkpoints, policy enforcement, and governance.',   status: 'Next',    on: false },
  { tag: 'RUNTIME', name: 'Kairos Runtime', desc: 'Execution environments and orchestration at scale.',       status: 'Q3 2026', on: false },
  { tag: 'GRID',    name: 'Kairos Grid',    desc: 'Multi-agent coordination and network execution.',          status: 'Q4 2026', on: false },
  { tag: 'SIM',     name: 'Kairos Sim',     desc: 'Adversarial testing and execution forecasting.',           status: 'Future',  on: false },
]

const EVENTS = [
  { color: '#1a56ff', type: 'workflow.started',  detail: 'agent: research-agent · run_id: a3f9b1',       t: '+0ms'    },
  { color: '#8b5cf6', type: 'prompt.sent',       detail: 'claude-sonnet-4-6 · 312 tokens',               t: '+12ms'   },
  { color: '#f59e0b', type: 'tool.called',       detail: 'web_search · "EU AI Act obligations 2025"',    t: '+84ms'   },
  { color: '#10b981', type: 'tool.completed',    detail: '8 results · latency 1640ms',                   t: '+1724ms' },
  { color: '#ec4899', type: 'decision.scored',   detail: 'EUR-Lex most authoritative · confidence 0.93', t: '+1731ms' },
  { color: '#06b6d4', type: 'memory.written',    detail: 'key: eu_act_summary · 4.2KB stored',           t: '+1734ms' },
  { color: '#f97316', type: 'policy.checked',    detail: 'require_human_approval · result: pass',        t: '+1736ms' },
  { color: '#8b5cf6', type: 'output.received',   detail: '1840 tokens · 3480ms · $0.0118',               t: '+5210ms' },
  { color: '#10b981', type: 'run.completed',     detail: 'total: 8.42s · 2152 tokens · $0.0118',         t: '+8420ms' },
]

const REPLAY_PRIMITIVES = [
  { label: 'Operational Memory',   desc: 'Every run is retained and queryable.' },
  { label: 'Failure Forensics',    desc: 'Reconstruct the exact path to failure.' },
  { label: 'Decision Audit',       desc: 'Inspect every choice and its confidence.' },
  { label: 'Policy Replay',        desc: 'Validate governance against past runs.' },
  { label: 'Rollback Surface',     desc: 'Identify the exact point to rewind from.' },
  { label: 'Runtime Intelligence', desc: 'Past executions inform future control.' },
]

function Wordmark({ size = 'lg' }: { size?: 'sm' | 'lg' }) {
  const isLg = size === 'lg'
  return (
    <span
      className="select-none uppercase"
      style={{
        fontFamily: 'var(--font-michroma), system-ui, sans-serif',
        fontSize: isLg ? 'clamp(44px, 7vw, 96px)' : '11px',
        fontWeight: 400,
        letterSpacing: isLg ? '0.72em' : '0.3em',
        backgroundImage: 'linear-gradient(180deg, #1a2535 0%, #3d5068 22%, #7090a8 36%, #9ab0c0 44%, #b4c4d0 50%, #9ab0c0 56%, #7090a8 64%, #3d5068 78%, #1a2535 100%)',
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

function useReveal() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.1 })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

export default function Home() {
  // Scroll-driven replay state
  const heroWrapperRef = useRef<HTMLDivElement>(null)
  const [scrollIdx, setScrollIdx] = useState(-1)   // -1 = not yet scrolled
  const [copied, setCopied] = useState<string | null>(null)
  const archReveal  = useReveal()
  const replayReveal = useReveal()
  const stmtReveal  = useReveal()
  const sdkReveal   = useReveal()

  // Map scroll position inside hero wrapper → event index
  useEffect(() => {
    const onScroll = () => {
      const el = heroWrapperRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const scrolled = -rect.top                          // px scrolled into wrapper
      const total    = el.offsetHeight - window.innerHeight  // total scrollable range
      const progress = Math.max(0, Math.min(1, scrolled / total))
      if (scrolled <= 0) { setScrollIdx(-1); return }
      setScrollIdx(Math.round(progress * (EVENTS.length - 1)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const activeIdx  = scrollIdx < 0 ? -1 : scrollIdx
  const pct        = scrollIdx < 0 ? 0 : (scrollIdx / (EVENTS.length - 1)) * 100
  const isComplete = scrollIdx === EVENTS.length - 1
  const isPending  = scrollIdx < 0

  const sectionStyle = (visible: boolean): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(20px)',
    transition: 'opacity 0.7s ease, transform 0.7s ease',
  })

  return (
    <div className="bg-[#080a0f] text-[#e8eaf0] overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-[#0d1017]/90 bg-[#080a0f]/95 backdrop-blur-md">
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
        <Link href="/app" className="px-4 py-1.5 text-xs font-mono tracking-widest uppercase border border-[#1e2232] text-[#4b5563] rounded hover:text-[#6b7280] hover:border-[#2d3350] transition-colors">
          Dashboard →
        </Link>
      </nav>

      {/* ── HERO — sticky scroll-driven replay ─────────────────── */}
      {/* Wrapper is tall so the sticky inner stays on screen while scrolling */}
      <div ref={heroWrapperRef} style={{ height: '420vh' }} className="relative">
        <section className="sticky top-0 h-screen flex flex-col items-center justify-center px-6 overflow-hidden">

          {/* Barely-visible operational grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none" />

          <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">

            {/* Wordmark */}
            <div className="mb-10 text-center" style={{ animation: 'fade-up 1s ease both' }}>
              <Wordmark size="lg" />
            </div>

            {/* Tagline */}
            <div className="text-center mb-12" style={{ animation: 'fade-up 1s ease 0.15s both' }}>
              <p className="text-base text-white font-semibold tracking-wide mb-2">
                Autonomous systems run on Kairos.
              </p>
              <p className="text-xs text-[#4b5563] font-mono tracking-widest uppercase">
                Observe · Replay · Govern · Control
              </p>
            </div>

            {/* Replay console — scroll-driven */}
            <div
              className="w-full bg-[#070910] border border-[#1a1f2e] rounded-xl overflow-hidden"
              style={{
                animation: 'fade-up 1s ease 0.3s both',
                boxShadow: '0 0 0 1px rgba(26,86,255,0.04), 0 32px 80px rgba(0,0,0,0.8)',
              }}
            >
              {/* Title bar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-[#13161f] bg-[#050709]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28ca41]" />
                  <span className="ml-3 text-[11px] text-[#2d3350] font-mono">research-agent · execution replay</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-[#2d3350] font-mono">
                    {isPending ? '0 / 9' : `${scrollIdx + 1} / ${EVENTS.length}`}
                  </span>
                  <span className={`text-[10px] font-mono border px-2 py-0.5 rounded transition-all duration-500 ${
                    isComplete
                      ? 'text-emerald-400 border-emerald-400/15 bg-emerald-400/5'
                      : isPending
                      ? 'text-[#1e2232] border-[#1a1f2e]'
                      : 'text-[#1a56ff] border-[#1a56ff]/20 bg-[#1a56ff]/5'
                  }`}>
                    {isComplete ? 'completed' : isPending ? 'pending' : 'executing'}
                  </span>
                </div>
              </div>

              {/* Scrubber */}
              <div className="px-5 py-2.5 border-b border-[#13161f] bg-[#050709]/60">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono flex-shrink-0 w-28 transition-colors duration-300"
                    style={{ color: isPending ? '#1e2232' : '#1a56ff' }}>
                    {isPending ? '○ scroll to replay' : isComplete ? '◉ replay complete' : '▶ replaying'}
                  </span>
                  <div className="flex-1 h-[2px] bg-[#0d1017] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-150"
                      style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #1a56ff, #4b7fff)' }}
                    />
                  </div>
                  <span className="text-[10px] text-[#1e2232] font-mono flex-shrink-0">8.42s</span>
                </div>
              </div>

              {/* Event stream */}
              <div className="px-5 py-4 space-y-0.5">
                {EVENTS.map((ev, i) => {
                  const past    = activeIdx >= 0 && i < activeIdx
                  const current = i === activeIdx
                  const future  = activeIdx < 0 || i > activeIdx
                  return (
                    <div
                      key={i}
                      className="relative flex items-center gap-4 py-1.5 px-2 rounded-sm"
                      style={{
                        marginLeft:  current ? '-8px' : '0',
                        paddingLeft: current ? '24px' : '8px',
                        background:  current ? 'rgba(5,7,9,0.9)' : 'transparent',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {current && (
                        <div className="absolute left-0 top-1 bottom-1 w-[2px] rounded-full"
                          style={{ background: ev.color, boxShadow: `0 0 6px ${ev.color}` }} />
                      )}
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{
                          background: future ? '#1a1f2e' : ev.color,
                          opacity: past ? 0.2 : 1,
                          boxShadow: current ? `0 0 10px ${ev.color}80` : 'none',
                          transition: 'all 0.3s ease',
                        }}
                      />
                      <span
                        className="text-[11px] font-mono font-semibold w-36 flex-shrink-0"
                        style={{
                          color: future ? '#13161f' : past ? ev.color + '30' : ev.color,
                          transition: 'color 0.3s ease',
                        }}
                      >{ev.type}</span>
                      <span className="text-[10px] font-mono w-16 flex-shrink-0"
                        style={{ color: future ? '#0d1017' : past ? '#1e2232' : '#4b5563', transition: 'color 0.3s ease' }}>
                        {ev.t}
                      </span>
                      <span className="text-[10px] font-mono truncate"
                        style={{ color: future ? '#0d1017' : past ? '#1e2232' : '#6b7280', transition: 'color 0.3s ease' }}>
                        {ev.detail}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Console footer */}
              <div className="px-5 py-3 border-t border-[#13161f] bg-[#050709]/60 flex items-center justify-between">
                <Link href="/app" className="text-[10px] font-mono text-[#1a56ff] hover:text-[#4b7fff] transition-colors tracking-widest uppercase">
                  Open Dashboard →
                </Link>
                <button
                  onClick={() => copy('npm install kairos-sdk', 'npm')}
                  className="flex items-center gap-2 text-[10px] font-mono text-[#2d3350] hover:text-[#4b5563] transition-colors"
                >
                  <span className="text-[#1a1f2e]">$</span> npm install kairos-sdk
                  <span className="text-[8px] border border-[#13161f] px-1.5 py-0.5 rounded ml-1">
                    {copied === 'npm' ? 'copied' : 'copy'}
                  </span>
                </button>
              </div>
            </div>

            {/* Scroll cue — disappears once scrolled */}
            <div
              className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-500"
              style={{ opacity: isPending ? 1 : 0, pointerEvents: 'none' }}
            >
              <span className="text-[9px] font-mono text-[#1e2232] tracking-[0.3em] uppercase">scroll to replay</span>
              <div className="w-px h-8 bg-gradient-to-b from-[#1e2232] to-transparent" />
            </div>

          </div>
        </section>
      </div>
      {/* END HERO */}

      {/* ── ARCHITECTURE ────────────────────────────────────────── */}
      <section
        ref={archReveal.ref as React.RefObject<HTMLElement>}
        className="border-t border-[#0d1017]"
        style={sectionStyle(archReveal.visible)}
      >
        <div className="max-w-5xl mx-auto px-6 py-24">
          <div className="flex items-start gap-16">
            <div className="w-52 flex-shrink-0 pt-1">
              <p className="text-[10px] text-[#1a56ff] tracking-[0.3em] uppercase font-mono mb-4">Architecture</p>
              <p className="text-xs text-[#2d3350] font-mono leading-relaxed">
                Five layers. Each builds on the one below. Trace is the foundation. Sim is the ceiling.
              </p>
              <div className="mt-8 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1a56ff]" style={{ animation: 'glow-pulse 2s ease-in-out infinite' }} />
                <span className="text-[9px] font-mono text-[#1a56ff] tracking-widest uppercase">Live now</span>
              </div>
            </div>
            <div className="flex-1 flex gap-5">
              {/* Data flow line */}
              <div className="relative w-px flex-shrink-0 self-stretch bg-[#0d1017]">
                <div className="absolute w-full rounded-full"
                  style={{
                    height: '35%',
                    background: 'linear-gradient(to top, transparent, #1a56ff60, #1a56ff, #1a56ff60, transparent)',
                    animation: archReveal.visible ? 'data-flow 4s ease-in-out infinite' : 'none',
                  }} />
              </div>
              {/* Stack */}
              <div className="flex-1 border border-[#13161f] rounded-xl overflow-hidden">
                {[...PLATFORM].reverse().map((layer, i) => (
                  <div key={layer.name}
                    className={`relative flex items-center justify-between px-8 py-5 ${i > 0 ? 'border-t border-[#13161f]' : ''}`}
                    style={{ opacity: layer.on ? 1 : 0.35, background: layer.on ? '#0a0c14' : 'transparent' }}
                  >
                    {layer.on && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#1a56ff]" style={{ boxShadow: '2px 0 12px rgba(26,86,255,0.3)' }} />}
                    <div className="flex items-center gap-6">
                      <span className="text-[9px] font-mono text-[#1e2232] w-14 tracking-widest">{layer.tag}</span>
                      <div>
                        <div className={`text-sm font-mono font-semibold ${layer.on ? 'text-white' : 'text-[#2d3350]'}`}>{layer.name}</div>
                        <div className={`text-xs mt-0.5 ${layer.on ? 'text-[#4b5563]' : 'text-[#1e2232]'}`}>{layer.desc}</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border flex-shrink-0 ${layer.on ? 'text-[#1a56ff] border-[#1a56ff]/20 bg-[#1a56ff]/5' : 'text-[#1e2232] border-[#13161f]'}`}>
                      {layer.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── REPLAY ──────────────────────────────────────────────── */}
      <section
        ref={replayReveal.ref as React.RefObject<HTMLElement>}
        className="border-t border-[#0d1017] bg-[#050709]"
        style={sectionStyle(replayReveal.visible)}
      >
        <div className="max-w-5xl mx-auto px-6 py-24">
          <div className="flex items-start gap-16">
            <div className="w-52 flex-shrink-0 pt-1">
              <p className="text-[10px] text-[#1a56ff] tracking-[0.3em] uppercase font-mono mb-4">Replay</p>
            </div>
            <div className="flex-1">
              <p className="text-2xl font-semibold text-white leading-[1.4] tracking-tight mb-8">
                Replay is not a debugger.<br />It is operational memory.
              </p>
              <p className="text-sm text-[#4b5563] leading-relaxed font-mono mb-10">
                Every execution is recorded at the event level — every prompt, tool call, decision,
                policy check, and failure. Replay reconstructs that execution exactly as it ran,
                at any timestamp, for any agent. This is the primitive everything else is built on.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {REPLAY_PRIMITIVES.map(item => (
                  <div key={item.label} className="border border-[#13161f] rounded-lg p-4 bg-[#080a0f]">
                    <div className="text-[10px] font-mono text-[#6b7280] mb-1.5 tracking-wide">{item.label}</div>
                    <div className="text-[11px] text-[#2d3350] font-mono leading-relaxed">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATEMENT ───────────────────────────────────────────── */}
      <section
        ref={stmtReveal.ref as React.RefObject<HTMLElement>}
        className="border-t border-[#0d1017]"
        style={sectionStyle(stmtReveal.visible)}
      >
        <div className="max-w-3xl mx-auto px-6 py-28 text-center">
          <p className="text-xl font-semibold text-white leading-[1.6] tracking-tight">
            Autonomous systems are moving from conversation to action.
          </p>
          <p className="text-sm text-[#4b5563] leading-relaxed font-mono mt-6">
            When AI agents execute code, move capital, control infrastructure, and coordinate operations —
            failures become expensive. Visibility becomes mandatory. Governance becomes existential.
          </p>
          <p className="text-xs text-[#2d3350] font-mono mt-8 tracking-wide">
            Kairos is the operational layer that makes autonomous execution trustworthy at scale.
          </p>
        </div>
      </section>

      {/* ── SDK ─────────────────────────────────────────────────── */}
      <section
        ref={sdkReveal.ref as React.RefObject<HTMLElement>}
        className="border-t border-[#0d1017] bg-[#050709]"
        style={sectionStyle(sdkReveal.visible)}
      >
        <div className="max-w-5xl mx-auto px-6 py-24">
          <div className="flex items-start gap-16">
            <div className="w-52 flex-shrink-0 pt-1">
              <p className="text-[10px] text-[#1a56ff] tracking-[0.3em] uppercase font-mono mb-4">SDK</p>
              <p className="text-xs text-[#2d3350] font-mono leading-relaxed mb-6">
                TypeScript and Python. Zero-config. Any model, any framework. Executions appear in the dashboard instantly.
              </p>
              <div className="space-y-2">
                {[
                  { cmd: 'npm install kairos-sdk', key: 'npm' },
                  { cmd: 'pip install kairos-sdk',  key: 'pip' },
                ].map(({ cmd, key }) => (
                  <button key={key} onClick={() => copy(cmd, key)}
                    className="flex items-center gap-2 w-full px-4 py-2.5 bg-[#080a0f] border border-[#13161f] rounded text-[10px] font-mono text-[#4b5563] hover:border-[#1e2232] hover:text-[#6b7280] transition-colors text-left"
                  >
                    <span className="text-[#2d3350]">$</span>
                    {cmd}
                    <span className="ml-auto text-[8px] text-[#2d3350] border border-[#13161f] px-1.5 py-0.5 rounded">
                      {copied === key ? 'copied' : 'copy'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 bg-[#080a0f] border border-[#13161f] rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-[#13161f]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28ca41]" />
                <span className="ml-2 text-[10px] text-[#4b5563] font-mono">agent.ts</span>
              </div>
              <div className="p-6 font-mono text-[13px] leading-[2]">
                <p><span className="text-[#2d3350]">import</span> <span className="text-[#6b7280]">{'{ createKairos }'}</span> <span className="text-[#2d3350]">from</span> <span className="text-[#1a56ff]">&apos;kairos-sdk&apos;</span></p>
                <br />
                <p><span className="text-[#2d3350]">const</span> <span className="text-white">exec</span> <span className="text-[#2d3350]">=</span> <span className="text-[#6b7280]">kairos.execution</span><span className="text-[#2d3350]">({'{ workflowName }'})</span></p>
                <br />
                <p className="text-[#4b5563]">exec<span className="text-[#2d3350]">.</span>setPrompt<span className="text-[#2d3350]">(prompt)</span></p>
                <p className="text-[#4b5563]">exec<span className="text-[#2d3350]">.</span>toolCall<span className="text-[#2d3350]">({'{ name, input, output }'})</span></p>
                <p className="text-[#4b5563]">exec<span className="text-[#2d3350]">.</span>decision<span className="text-[#2d3350]">(reasoning, confidence)</span></p>
                <br />
                <p><span className="text-[#2d3350]">await</span> <span className="text-white">exec</span><span className="text-[#2d3350]">.</span><span className="text-[#6b7280]">complete</span><span className="text-[#2d3350]">(output)</span></p>
                <br />
                <p className="text-[11px] text-[#1a56ff]/60">{'// 9 events · replay immediately available'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="border-t border-[#0d1017]">
        <div className="max-w-xl mx-auto px-6 py-32 text-center">
          <div className="mb-12"><Wordmark size="lg" /></div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/app" className="px-7 py-3 bg-[#1a56ff] text-white text-sm font-semibold rounded hover:bg-[#1849e0] transition-colors">
              Open Dashboard
            </Link>
            <a href="https://github.com/kylenalamvelil/kairos"
              className="px-7 py-3 border border-[#13161f] text-[#4b5563] text-sm rounded hover:border-[#1e2232] hover:text-[#6b7280] transition-colors font-mono">
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="border-t border-[#0d1017] px-8 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-mono text-[10px] text-[#1e2232] tracking-[0.3em] uppercase">Kairos</span>
          <span className="text-[10px] text-[#1e2232] font-mono">Operational infrastructure for autonomous systems.</span>
        </div>
      </footer>

    </div>
  )
}
