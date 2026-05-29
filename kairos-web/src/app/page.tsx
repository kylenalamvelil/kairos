'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

// LOCKED — do not reorder
const PLATFORM = [
  { tag: 'TRACE',   name: 'Kairos Trace',   desc: 'Replayable execution telemetry for autonomous agents.',    status: 'Live',    on: true  },
  { tag: 'CONTROL', name: 'Kairos Control', desc: 'Human checkpoints, policy enforcement, and governance.',   status: 'Next',    on: false },
  { tag: 'RUNTIME', name: 'Kairos Runtime', desc: 'Execution environments and orchestration at scale.',       status: 'Q3 2026', on: false },
  { tag: 'GRID',    name: 'Kairos Grid',    desc: 'Multi-agent coordination and network execution.',          status: 'Q4 2026', on: false },
  { tag: 'SIM',     name: 'Kairos Sim',     desc: 'Adversarial testing and execution forecasting.',           status: 'Future',  on: false },
]

const EVENTS = [
  { type: 'workflow.started',  detail: 'agent: research-agent · run_id: a3f9b1',       t: '+0ms'    },
  { type: 'prompt.sent',       detail: 'claude-sonnet-4-6 · 312 tokens',               t: '+12ms'   },
  { type: 'tool.called',       detail: 'web_search · "EU AI Act obligations 2025"',    t: '+84ms'   },
  { type: 'tool.completed',    detail: '8 results · latency 1640ms',                   t: '+1724ms' },
  { type: 'decision.scored',   detail: 'EUR-Lex most authoritative · confidence 0.93', t: '+1731ms' },
  { type: 'memory.written',    detail: 'key: eu_act_summary · 4.2KB stored',           t: '+1734ms' },
  { type: 'policy.checked',    detail: 'require_human_approval · result: pass',        t: '+1736ms' },
  { type: 'output.received',   detail: '1840 tokens · 3480ms · $0.0118',               t: '+5210ms' },
  { type: 'run.completed',     detail: 'total: 8.42s · 2152 tokens · $0.0118',         t: '+8420ms' },
]

const MARKETS = [
  'AI agents', 'Enterprise automation', 'Robotics', 'Logistics',
  'Manufacturing', 'Healthcare', 'Financial systems', 'Energy infrastructure',
  'Transportation', 'Defense', 'Autonomous vehicles', 'Industrial control',
]

const REPLAY_PRIMITIVES = [
  { label: 'Operational Memory',   desc: 'Every run is retained and queryable.' },
  { label: 'Failure Forensics',    desc: 'Reconstruct the exact path to failure.' },
  { label: 'Decision Audit',       desc: 'Inspect every choice and its confidence.' },
  { label: 'Policy Replay',        desc: 'Validate governance against past runs.' },
  { label: 'Rollback Surface',     desc: 'Identify the exact point to rewind from.' },
  { label: 'Runtime Intelligence', desc: 'Past executions inform future control.' },
]

// Official logo — do not modify this component
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
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.08 }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

const revealStyle = (v: boolean): React.CSSProperties => ({
  opacity: v ? 1 : 0,
  transform: v ? 'translateY(0)' : 'translateY(16px)',
  transition: 'opacity 0.8s ease, transform 0.8s ease',
})

export default function Home() {
  const heroWrapperRef = useRef<HTMLDivElement>(null)
  const [scrollIdx, setScrollIdx]   = useState(-1)
  const [copied, setCopied]         = useState<string | null>(null)
  const problemReveal  = useReveal()
  const replayReveal   = useReveal()
  const archReveal     = useReveal()
  const marketsReveal  = useReveal()
  const sdkReveal      = useReveal()

  // Scroll position → event index
  useEffect(() => {
    const onScroll = () => {
      const el = heroWrapperRef.current
      if (!el) return
      const scrolled = -el.getBoundingClientRect().top
      const total    = el.offsetHeight - window.innerHeight
      const progress = Math.max(0, Math.min(1, scrolled / total))
      setScrollIdx(scrolled <= 0 ? -1 : Math.round(progress * (EVENTS.length - 1)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const isPending  = scrollIdx < 0
  const isComplete = scrollIdx === EVENTS.length - 1
  const pct        = scrollIdx < 0 ? 0 : (scrollIdx / (EVENTS.length - 1)) * 100

  return (
    <div className="bg-[#080a0f] text-[#e8eaf0] overflow-x-hidden">

      {/* ── NAV ─────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-white/[0.04] bg-[#080a0f]/95 backdrop-blur-md">
        <Wordmark size="sm" />
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'API',    href: 'https://kairos-production-64c5.up.railway.app/docs' },
            { label: 'SDK',    href: 'https://www.npmjs.com/package/kairos-sdk' },
            { label: 'GitHub', href: 'https://github.com/kylenalamvelil/kairos' },
          ].map(({ label, href }) => (
            <a key={label} href={href}
              className="text-xs text-white/25 hover:text-white/50 transition-colors tracking-widest uppercase font-mono">
              {label}
            </a>
          ))}
        </div>
        <Link href="/app"
          className="px-4 py-1.5 text-xs font-mono tracking-widest uppercase border border-white/10 text-white/30 rounded hover:text-white/60 hover:border-white/20 transition-colors">
          Dashboard →
        </Link>
      </nav>

      {/* ── HERO — scroll-driven replay ──────────────────────────── */}
      <div ref={heroWrapperRef} style={{ height: '420vh' }} className="relative">
        <section className="sticky top-0 h-screen flex flex-col items-center justify-center px-6 overflow-hidden">

          {/* Barely-visible grid — operational, not decorative */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

          <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">

            {/* Wordmark */}
            <div className="mb-10 text-center" style={{ animation: 'fade-up 1s ease both' }}>
              <Wordmark size="lg" />
            </div>

            {/* Headline */}
            <div className="text-center mb-12" style={{ animation: 'fade-up 1s ease 0.15s both' }}>
              <p className="font-heading text-lg font-semibold text-white tracking-tight mb-3">
                Operational infrastructure for autonomous systems.
              </p>
              <p className="text-xs text-white/25 font-mono tracking-widest uppercase">
                Observe · Replay · Govern · Control
              </p>
            </div>

            {/* Console — scroll-driven */}
            <div className="w-full" style={{ animation: 'fade-up 1s ease 0.3s both' }}>
              <div className="bg-[#06080d] border border-white/[0.06] rounded-xl overflow-hidden"
                style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.02), 0 40px 100px rgba(0,0,0,0.8)' }}>

                {/* Title bar */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.04] bg-[#040608]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#28ca41]" />
                    <span className="ml-3 text-[11px] text-white/20 font-mono">research-agent · execution replay</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-white/20 font-mono">
                      {isPending ? '0 / 9' : `${scrollIdx + 1} / ${EVENTS.length}`}
                    </span>
                    <span className={`text-[10px] font-mono border px-2 py-0.5 rounded transition-all duration-500 ${
                      isComplete ? 'text-white/60 border-white/15 bg-white/5'
                      : isPending ? 'text-white/15 border-white/5'
                      : 'text-white/40 border-white/10 bg-white/[0.03]'
                    }`}>
                      {isComplete ? 'completed' : isPending ? 'pending' : 'executing'}
                    </span>
                  </div>
                </div>

                {/* Scrubber */}
                <div className="px-5 py-2.5 border-b border-white/[0.04] bg-[#040608]/60">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono w-32 flex-shrink-0 transition-colors duration-300"
                      style={{ color: isPending ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.45)' }}>
                      {isPending ? '○ scroll to replay' : isComplete ? '◉ replay complete' : '▶ replaying'}
                    </span>
                    <div className="flex-1 h-[1px] bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-150"
                        style={{ width: `${pct}%`, background: 'rgba(255,255,255,0.5)' }} />
                    </div>
                    <span className="text-[10px] text-white/15 font-mono flex-shrink-0">8.42s</span>
                  </div>
                </div>

                {/* Events — monochrome, operational */}
                <div className="px-5 py-4 space-y-0.5">
                  {EVENTS.map((ev, i) => {
                    const past    = scrollIdx >= 0 && i < scrollIdx
                    const current = i === scrollIdx
                    const future  = scrollIdx < 0 || i > scrollIdx
                    return (
                      <div key={i}
                        className="relative flex items-center gap-4 py-1.5 px-2 rounded-sm"
                        style={{
                          marginLeft:  current ? '-8px' : '0',
                          paddingLeft: current ? '24px' : '8px',
                          background:  current ? 'rgba(255,255,255,0.025)' : 'transparent',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {current && (
                          <div className="absolute left-0 top-1 bottom-1 w-px rounded-full bg-white/60" />
                        )}
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-300"
                          style={{
                            background: future ? 'rgba(255,255,255,0.05)' : past ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.8)',
                            boxShadow: current ? '0 0 8px rgba(255,255,255,0.4)' : 'none',
                          }} />
                        <span className="text-[11px] font-mono font-medium w-36 flex-shrink-0 transition-colors duration-200"
                          style={{ color: future ? 'rgba(255,255,255,0.06)' : past ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.75)' }}>
                          {ev.type}
                        </span>
                        <span className="text-[10px] font-mono w-16 flex-shrink-0 transition-colors duration-200"
                          style={{ color: future ? 'rgba(255,255,255,0.04)' : past ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.35)' }}>
                          {ev.t}
                        </span>
                        <span className="text-[10px] font-mono truncate transition-colors duration-200"
                          style={{ color: future ? 'rgba(255,255,255,0.04)' : past ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)' }}>
                          {ev.detail}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-white/[0.04] bg-[#040608]/60 flex items-center justify-between">
                  <Link href="/app" className="text-[10px] font-mono text-white/30 hover:text-white/60 transition-colors tracking-widest uppercase">
                    Open Dashboard →
                  </Link>
                  <button onClick={() => copy('npm install kairos-sdk', 'npm')}
                    className="flex items-center gap-2 text-[10px] font-mono text-white/20 hover:text-white/40 transition-colors">
                    <span className="text-white/10">$</span> npm install kairos-sdk
                    <span className="text-[8px] border border-white/10 px-1.5 py-0.5 rounded ml-1">
                      {copied === 'npm' ? 'copied' : 'copy'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Scroll cue */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-700 pointer-events-none"
              style={{ opacity: isPending ? 0.6 : 0 }}>
              <span className="text-[9px] font-mono text-white/25 tracking-[0.3em] uppercase">scroll</span>
              <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
            </div>
          </div>
        </section>
      </div>

      {/* ── PROBLEM ─────────────────────────────────────────────── */}
      <section ref={problemReveal.ref as React.RefObject<HTMLElement>}
        className="border-t border-white/[0.04]"
        style={revealStyle(problemReveal.visible)}>
        <div className="max-w-3xl mx-auto px-6 py-28 text-center">
          <p className="font-heading text-2xl font-semibold text-white leading-[1.5] tracking-tight mb-8">
            Autonomy is moving faster than accountability.
          </p>
          <p className="text-sm text-white/35 leading-relaxed font-mono">
            When AI agents execute code, move capital, control infrastructure, and coordinate operations —
            failures become expensive. Visibility becomes mandatory. Governance becomes existential.
            The world needs to know what happened, why it happened, and who approved it.
          </p>
          <div className="mt-10 pt-10 border-t border-white/[0.04]">
            <p className="text-xs text-white/15 font-mono tracking-wide leading-relaxed">
              Kairos is the operational memory layer that makes autonomous execution accountable at scale.
            </p>
          </div>
        </div>
      </section>

      {/* ── REPLAY ──────────────────────────────────────────────── */}
      <section ref={replayReveal.ref as React.RefObject<HTMLElement>}
        className="border-t border-white/[0.04] bg-[#050709]"
        style={revealStyle(replayReveal.visible)}>
        <div className="max-w-5xl mx-auto px-6 py-24">
          <div className="flex items-start gap-16">
            <div className="w-52 flex-shrink-0 pt-1">
              <p className="text-[10px] text-white/20 tracking-[0.3em] uppercase font-mono mb-4">Replay</p>
            </div>
            <div className="flex-1">
              <p className="font-heading text-2xl font-semibold text-white leading-[1.4] tracking-tight mb-8">
                Replay is not a debugger.<br />It is operational memory.
              </p>
              <p className="text-sm text-white/35 leading-relaxed font-mono mb-10">
                Every execution is recorded at the event level — every prompt, tool call, decision,
                policy check, and failure. Replay reconstructs that execution exactly as it ran,
                at any timestamp, for any agent. This is the primitive everything else is built on.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {REPLAY_PRIMITIVES.map(item => (
                  <div key={item.label} className="border border-white/[0.05] rounded-lg p-4 bg-[#080a0f]">
                    <div className="text-[10px] font-mono text-white/40 mb-1.5 tracking-wide">{item.label}</div>
                    <div className="text-[11px] text-white/18 font-mono leading-relaxed">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ARCHITECTURE ────────────────────────────────────────── */}
      <section ref={archReveal.ref as React.RefObject<HTMLElement>}
        className="border-t border-white/[0.04]"
        style={revealStyle(archReveal.visible)}>
        <div className="max-w-5xl mx-auto px-6 py-24">
          <div className="flex items-start gap-16">
            <div className="w-52 flex-shrink-0 pt-1">
              <p className="text-[10px] text-white/20 tracking-[0.3em] uppercase font-mono mb-4">Platform</p>
              <p className="text-xs text-white/20 font-mono leading-relaxed">
                Five layers. Each builds on the one below. Trace is the foundation.
              </p>
              <div className="mt-8 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-white/50"
                  style={{ animation: 'glow-pulse 2.5s ease-in-out infinite' }} />
                <span className="text-[9px] font-mono text-white/30 tracking-widest uppercase">Live</span>
              </div>
            </div>
            <div className="flex-1 flex gap-5">
              <div className="relative w-px flex-shrink-0 self-stretch bg-white/[0.04]">
                <div className="absolute w-full rounded-full"
                  style={{
                    height: '35%',
                    background: 'linear-gradient(to top, transparent, rgba(255,255,255,0.15), transparent)',
                    animation: archReveal.visible ? 'data-flow 5s ease-in-out infinite' : 'none',
                  }} />
              </div>
              <div className="flex-1 border border-white/[0.06] rounded-xl overflow-hidden">
                {[...PLATFORM].reverse().map((layer, i) => (
                  <div key={layer.name}
                    className={`relative flex items-center justify-between px-8 py-5 ${i > 0 ? 'border-t border-white/[0.04]' : ''}`}
                    style={{ opacity: layer.on ? 1 : 0.3, background: layer.on ? 'rgba(255,255,255,0.015)' : 'transparent' }}>
                    {layer.on && (
                      <div className="absolute left-0 top-0 bottom-0 w-px bg-white/30" />
                    )}
                    <div className="flex items-center gap-6">
                      <span className="text-[9px] font-mono text-white/15 w-14 tracking-widest">{layer.tag}</span>
                      <div>
                        <div className={`text-sm font-mono font-medium ${layer.on ? 'text-white/80' : 'text-white/20'}`}>{layer.name}</div>
                        <div className={`text-xs mt-0.5 font-mono ${layer.on ? 'text-white/30' : 'text-white/12'}`}>{layer.desc}</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border flex-shrink-0 ${layer.on ? 'text-white/50 border-white/15 bg-white/[0.03]' : 'text-white/10 border-white/5'}`}>
                      {layer.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARKETS ─────────────────────────────────────────────── */}
      <section ref={marketsReveal.ref as React.RefObject<HTMLElement>}
        className="border-t border-white/[0.04] bg-[#050709]"
        style={revealStyle(marketsReveal.visible)}>
        <div className="max-w-5xl mx-auto px-6 py-24">
          <div className="flex items-start gap-16">
            <div className="w-52 flex-shrink-0 pt-1">
              <p className="text-[10px] text-white/20 tracking-[0.3em] uppercase font-mono mb-4">Scale</p>
            </div>
            <div className="flex-1">
              <p className="font-heading text-2xl font-semibold text-white leading-[1.4] tracking-tight mb-8">
                One operational layer across every autonomous environment.
              </p>
              <p className="text-sm text-white/35 leading-relaxed font-mono mb-12">
                Kairos does not belong to any single industry. Anywhere autonomous systems act on behalf of people,
                Kairos provides the memory, governance, and control layer.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
                {MARKETS.map((m) => (
                  <div key={m} className="flex items-center gap-3">
                    <div className="w-px h-3 bg-white/15 flex-shrink-0" />
                    <span className="text-xs font-mono text-white/30 tracking-wide">{m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SDK ─────────────────────────────────────────────────── */}
      <section ref={sdkReveal.ref as React.RefObject<HTMLElement>}
        className="border-t border-white/[0.04]"
        style={revealStyle(sdkReveal.visible)}>
        <div className="max-w-5xl mx-auto px-6 py-24">
          <div className="flex items-start gap-16">
            <div className="w-52 flex-shrink-0 pt-1">
              <p className="text-[10px] text-white/20 tracking-[0.3em] uppercase font-mono mb-4">SDK</p>
              <p className="text-xs text-white/20 font-mono leading-relaxed mb-6">
                TypeScript and Python. Zero-config. Any model, any framework.
              </p>
              <div className="space-y-2">
                {[
                  { cmd: 'npm install kairos-sdk', key: 'npm' },
                  { cmd: 'pip install kairos-sdk',  key: 'pip' },
                ].map(({ cmd, key }) => (
                  <button key={key} onClick={() => copy(cmd, key)}
                    className="flex items-center gap-2 w-full px-4 py-2.5 bg-[#080a0f] border border-white/[0.06] rounded text-[10px] font-mono text-white/25 hover:text-white/45 hover:border-white/10 transition-colors text-left">
                    <span className="text-white/10">$</span>
                    {cmd}
                    <span className="ml-auto text-[8px] text-white/15 border border-white/8 px-1.5 py-0.5 rounded">
                      {copied === key ? 'copied' : 'copy'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 bg-[#050709] border border-white/[0.06] rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.04]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28ca41]" />
                <span className="ml-2 text-[10px] text-white/20 font-mono">agent.ts</span>
              </div>
              <div className="p-6 font-mono text-[13px] leading-[2.1]">
                <p><span className="text-white/20">import</span> <span className="text-white/40">{'{ createKairos }'}</span> <span className="text-white/20">from</span> <span className="text-white/55">&apos;kairos-sdk&apos;</span></p>
                <br />
                <p><span className="text-white/20">const</span> <span className="text-white/70">exec</span> <span className="text-white/20">=</span> <span className="text-white/40">kairos.execution</span><span className="text-white/20">({'{ workflowName }'})</span></p>
                <br />
                <p className="text-white/30">exec<span className="text-white/20">.</span>setPrompt<span className="text-white/20">(prompt)</span></p>
                <p className="text-white/30">exec<span className="text-white/20">.</span>toolCall<span className="text-white/20">({'{ name, input, output }'})</span></p>
                <p className="text-white/30">exec<span className="text-white/20">.</span>decision<span className="text-white/20">(reasoning, confidence)</span></p>
                <br />
                <p><span className="text-white/20">await</span> <span className="text-white/70">exec</span><span className="text-white/20">.</span><span className="text-white/40">complete</span><span className="text-white/20">(output)</span></p>
                <br />
                <p className="text-[11px] text-white/18">{'// 9 events · replay immediately available'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.04]">
        <div className="max-w-xl mx-auto px-6 py-32 text-center">
          <div className="mb-12"><Wordmark size="lg" /></div>
          <p className="font-heading text-sm font-medium text-white/40 tracking-wide mb-10">
            Autonomous systems need operational memory.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/app"
              className="px-7 py-3 bg-white text-[#080a0f] text-sm font-semibold rounded hover:bg-white/90 transition-colors">
              Open Dashboard
            </Link>
            <a href="https://github.com/kylenalamvelil/kairos"
              className="px-7 py-3 border border-white/10 text-white/35 text-sm rounded hover:border-white/20 hover:text-white/55 transition-colors font-mono">
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.04] px-8 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-mono text-[10px] text-white/12 tracking-[0.3em] uppercase">Kairos</span>
          <span className="text-[10px] text-white/12 font-mono">Operational infrastructure for autonomous systems.</span>
        </div>
      </footer>

    </div>
  )
}
