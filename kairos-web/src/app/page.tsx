'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

const PLATFORM = [
  { tag: 'TRACE',   name: 'Kairos Trace',   desc: 'Record and replay every autonomous action.',              status: 'Live',    on: true  },
  { tag: 'CONTROL', name: 'Kairos Control', desc: 'Govern autonomous operations with policy and approval.',   status: 'Next',    on: false },
  { tag: 'RUNTIME', name: 'Kairos Runtime', desc: 'Operate execution environments at scale.',                 status: 'Q3 2026', on: false },
  { tag: 'GRID',    name: 'Kairos Grid',    desc: 'Coordinate across thousands of systems and agents.',       status: 'Q4 2026', on: false },
  { tag: 'SIM',     name: 'Kairos Sim',     desc: 'Predict outcomes before they happen.',                     status: 'Future',  on: false },
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
  'Manufacturing', 'Finance', 'Healthcare', 'Energy',
  'Transportation', 'Defense', 'Industrial systems',
]

function Wordmark({ size = 'lg' }: { size?: 'sm' | 'lg' }) {
  const isLg = size === 'lg'
  return (
    <span
      className="select-none uppercase"
      style={{
        fontFamily: 'var(--font-michroma), system-ui, sans-serif',
        fontSize: isLg ? 'clamp(40px, 6vw, 80px)' : '11px',
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

const reveal = (v: boolean): React.CSSProperties => ({
  opacity: v ? 1 : 0,
  transform: v ? 'translateY(0)' : 'translateY(16px)',
  transition: 'opacity 0.8s ease, transform 0.8s ease',
})

export default function Home() {
  const heroWrapperRef   = useRef<HTMLDivElement>(null)
  const [scrollIdx, setScrollIdx] = useState(-1)
  const [copied, setCopied]       = useState<string | null>(null)

  const problemReveal = useReveal()
  const traceReveal   = useReveal()
  const diffReveal    = useReveal()
  const platformReveal = useReveal()
  const marketsReveal = useReveal()
  const sdkReveal     = useReveal()

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

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-white/[0.04] bg-[#080a0f]/95 backdrop-blur-md">
        <Wordmark size="sm" />
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'Docs',   href: '/docs' },
            { label: 'SDK',    href: 'https://www.npmjs.com/package/kairos-sdk' },
            { label: 'GitHub', href: 'https://github.com/withkairos/kairos' },
          ].map(({ label, href }) => (
            <a key={label} href={href}
              className="text-xs text-white/25 hover:text-white/55 transition-colors tracking-widest uppercase font-mono">
              {label}
            </a>
          ))}
        </div>
        <Link href="/app"
          className="px-4 py-1.5 text-xs font-mono tracking-widest uppercase border border-white/10 text-white/30 rounded hover:text-white/60 hover:border-white/20 transition-colors">
          Dashboard →
        </Link>
      </nav>

      {/* ── SECTION 1: HERO ─────────────────────────────────────── */}
      {/* Tall wrapper — sticky inner stays on screen while scrolling advances replay */}
      <div ref={heroWrapperRef} style={{ height: '420vh' }} className="relative">
        <section className="sticky top-0 h-screen overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

          <div className="relative z-10 h-full max-w-6xl mx-auto px-8 flex items-center gap-16">

            {/* Left: wordmark + headline + CTAs */}
            <div className="flex-1 min-w-0" style={{ animation: 'fade-up 1s ease both' }}>
              <div className="mb-10">
                <Wordmark size="lg" />
              </div>
              <h1 className="font-heading text-3xl md:text-4xl font-semibold text-white leading-[1.25] tracking-tight mb-6">
                Operational memory<br />for autonomous systems.
              </h1>
              <p className="text-sm text-white/40 leading-relaxed mb-10 max-w-md" style={{ fontFamily: 'var(--font-sans)' }}>
                Record, replay, govern, and understand every autonomous action
                before trust breaks.
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <Link href="/app"
                  className="px-5 py-2.5 bg-white text-[#080a0f] text-sm font-semibold rounded hover:bg-white/90 transition-colors">
                  Start tracing
                </Link>
                <a href="#replay"
                  className="px-5 py-2.5 border border-white/10 text-white/40 text-sm rounded hover:border-white/20 hover:text-white/60 transition-colors font-mono">
                  View replay
                </a>
              </div>
            </div>

            {/* Right: replay console */}
            <div className="flex-1 min-w-0" style={{ animation: 'fade-up 1s ease 0.2s both' }}>
              <div className="bg-[#06080d] border border-white/[0.06] rounded-xl overflow-hidden"
                style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.02), 0 32px 80px rgba(0,0,0,0.8)' }}>

                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04] bg-[#040608]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#28ca41]" />
                    <span className="ml-2 text-[10px] text-white/20 font-mono">research-agent · execution replay</span>
                  </div>
                  <span className={`text-[10px] font-mono border px-2 py-0.5 rounded transition-all duration-500 ${
                    isComplete ? 'text-white/60 border-white/15 bg-white/5'
                    : isPending ? 'text-white/15 border-white/5'
                    : 'text-white/40 border-white/10 bg-white/[0.03]'
                  }`}>
                    {isComplete ? 'completed' : isPending ? 'pending' : 'executing'}
                  </span>
                </div>

                <div className="px-4 py-2 border-b border-white/[0.04] bg-[#040608]/60">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono w-28 flex-shrink-0 transition-colors duration-300"
                      style={{ color: isPending ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.4)' }}>
                      {isPending ? '○ scroll to replay' : isComplete ? '◉ complete' : '▶ replaying'}
                    </span>
                    <div className="flex-1 h-[1px] bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-150"
                        style={{ width: `${pct}%`, background: 'rgba(255,255,255,0.45)' }} />
                    </div>
                    <span className="text-[10px] text-white/12 font-mono flex-shrink-0">8.42s</span>
                  </div>
                </div>

                <div className="px-4 py-3 space-y-0.5">
                  {EVENTS.map((ev, i) => {
                    const past    = scrollIdx >= 0 && i < scrollIdx
                    const current = i === scrollIdx
                    const future  = scrollIdx < 0 || i > scrollIdx
                    return (
                      <div key={i} className="relative flex items-center gap-3 py-1 px-2 rounded-sm"
                        style={{
                          marginLeft:  current ? '-6px' : '0',
                          paddingLeft: current ? '20px' : '8px',
                          background:  current ? 'rgba(255,255,255,0.02)' : 'transparent',
                          transition:  'all 0.15s ease',
                        }}>
                        {current && <div className="absolute left-0 top-1 bottom-1 w-px bg-white/50 rounded-full" />}
                        <div className="w-1 h-1 rounded-full flex-shrink-0"
                          style={{
                            background: future ? 'rgba(255,255,255,0.05)' : past ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.75)',
                            boxShadow:  current ? '0 0 6px rgba(255,255,255,0.35)' : 'none',
                            transition: 'all 0.2s ease',
                          }} />
                        <span className="text-[10px] font-mono w-32 flex-shrink-0"
                          style={{ color: future ? 'rgba(255,255,255,0.05)' : past ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.7)', transition: 'color 0.2s ease' }}>
                          {ev.type}
                        </span>
                        <span className="text-[10px] font-mono w-14 flex-shrink-0"
                          style={{ color: future ? 'rgba(255,255,255,0.03)' : past ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)', transition: 'color 0.2s ease' }}>
                          {ev.t}
                        </span>
                        <span className="text-[10px] font-mono truncate"
                          style={{ color: future ? 'rgba(255,255,255,0.03)' : past ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.25)', transition: 'color 0.2s ease' }}>
                          {ev.detail}
                        </span>
                      </div>
                    )
                  })}
                </div>

                <div className="px-4 py-2.5 border-t border-white/[0.04] bg-[#040608]/60 flex items-center justify-between">
                  <button onClick={() => copy('npm install kairos-sdk', 'npm')}
                    className="flex items-center gap-2 text-[10px] font-mono text-white/18 hover:text-white/35 transition-colors">
                    <span className="text-white/10">$</span> npm install kairos-sdk
                    <span className="text-[8px] border border-white/8 px-1.5 py-0.5 rounded ml-1">
                      {copied === 'npm' ? 'copied' : 'copy'}
                    </span>
                  </button>
                  <Link href="/app" className="text-[10px] font-mono text-white/25 hover:text-white/50 transition-colors tracking-widest uppercase">
                    Open Dashboard →
                  </Link>
                </div>
              </div>

              {/* Scroll cue */}
              <div className="flex items-center gap-3 mt-5 transition-opacity duration-700"
                style={{ opacity: isPending ? 0.5 : 0 }}>
                <div className="w-px h-6 bg-gradient-to-b from-white/20 to-transparent" />
                <span className="text-[9px] font-mono text-white/20 tracking-[0.3em] uppercase">scroll to replay</span>
              </div>
            </div>

          </div>
        </section>
      </div>

      {/* ── SECTION 2: PROBLEM ──────────────────────────────────── */}
      <section ref={problemReveal.ref as React.RefObject<HTMLElement>}
        className="border-t border-white/[0.04]"
        style={reveal(problemReveal.visible)}>
        <div className="max-w-4xl mx-auto px-8 py-28">
          <p className="text-[10px] text-white/20 tracking-[0.3em] uppercase font-mono mb-10">Problem</p>
          <h2 className="font-heading text-3xl font-semibold text-white leading-[1.3] tracking-tight mb-10">
            Autonomy is moving faster<br />than accountability.
          </h2>
          <p className="text-sm text-white/35 leading-relaxed max-w-2xl mb-10" style={{ fontFamily: 'var(--font-sans)' }}>
            Autonomous systems increasingly act across tools, teams, code, infrastructure, and operations.
            Most organizations cannot reliably answer:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
            {[
              'What happened',
              'Why it happened',
              'What policy applied',
              'Who approved it',
              'How to replay it',
            ].map(q => (
              <div key={q} className="flex items-center gap-3">
                <div className="w-px h-4 bg-white/15 flex-shrink-0" />
                <span className="text-sm text-white/30 font-mono">{q}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: KAIROS TRACE ─────────────────────────────── */}
      <section id="replay" ref={traceReveal.ref as React.RefObject<HTMLElement>}
        className="border-t border-white/[0.04] bg-[#050709]"
        style={reveal(traceReveal.visible)}>
        <div className="max-w-4xl mx-auto px-8 py-28">
          <p className="text-[10px] text-white/20 tracking-[0.3em] uppercase font-mono mb-10">Kairos Trace</p>
          <h2 className="font-heading text-3xl font-semibold text-white leading-[1.3] tracking-tight mb-10">
            Replay is not a debugger.<br />It is operational memory.
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-5 mb-14">
            {[
              'Every prompt.',
              'Every tool call.',
              'Every decision.',
              'Every approval.',
              'Every policy check.',
              'Every outcome.',
            ].map(item => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-px h-4 bg-white/15 flex-shrink-0" />
                <span className="text-sm text-white/40" style={{ fontFamily: 'var(--font-sans)' }}>{item}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-8 border-t border-white/[0.04] pt-10">
            {['Recorded.', 'Replayable.', 'Queryable.'].map(word => (
              <p key={word} className="font-heading text-lg font-semibold text-white/70 tracking-tight">{word}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: DIFFERENTIATION ──────────────────────────── */}
      <section ref={diffReveal.ref as React.RefObject<HTMLElement>}
        className="border-t border-white/[0.04]"
        style={reveal(diffReveal.visible)}>
        <div className="max-w-4xl mx-auto px-8 py-28">
          <p className="text-[10px] text-white/20 tracking-[0.3em] uppercase font-mono mb-10">Why Kairos</p>
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <p className="text-xs text-white/20 font-mono tracking-widest uppercase mb-5">Traditional observability</p>
              <p className="text-sm text-white/30 leading-relaxed mb-4" style={{ fontFamily: 'var(--font-sans)' }}>
                Explains system health. Tells you something happened.
              </p>
              <p className="text-sm text-white/20 leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
                Designed for infrastructure — not for autonomous decision-making.
              </p>
            </div>
            <div>
              <p className="text-xs text-white/50 font-mono tracking-widest uppercase mb-5">Kairos</p>
              <p className="text-sm text-white/55 leading-relaxed mb-5" style={{ fontFamily: 'var(--font-sans)' }}>
                Explains autonomous execution.
              </p>
              <div className="space-y-3">
                {[
                  'What happened',
                  'Why it happened',
                  'What changed',
                  'What decision was made',
                ].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-px h-3.5 bg-white/30 flex-shrink-0" />
                    <span className="text-sm text-white/45" style={{ fontFamily: 'var(--font-sans)' }}>{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-white/20 font-mono mt-6 tracking-wide">
                Kairos becomes the system of record for autonomous actions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: PLATFORM ─────────────────────────────────── */}
      <section ref={platformReveal.ref as React.RefObject<HTMLElement>}
        className="border-t border-white/[0.04] bg-[#050709]"
        style={reveal(platformReveal.visible)}>
        <div className="max-w-4xl mx-auto px-8 py-28">
          <p className="text-[10px] text-white/20 tracking-[0.3em] uppercase font-mono mb-10">Platform</p>
          <div className="border border-white/[0.06] rounded-xl overflow-hidden">
            {[...PLATFORM].reverse().map((layer, i) => (
              <div key={layer.name}
                className={`relative flex items-center justify-between px-8 py-5 ${i > 0 ? 'border-t border-white/[0.04]' : ''}`}
                style={{ opacity: layer.on ? 1 : 0.28, background: layer.on ? 'rgba(255,255,255,0.012)' : 'transparent' }}>
                {layer.on && <div className="absolute left-0 top-0 bottom-0 w-px bg-white/25" />}
                <div className="flex items-center gap-6">
                  <span className="text-[9px] font-mono text-white/15 w-14 tracking-widest">{layer.tag}</span>
                  <div>
                    <div className={`text-sm font-mono ${layer.on ? 'text-white/80' : 'text-white/20'}`}>{layer.name}</div>
                    <div className={`text-xs mt-0.5 ${layer.on ? 'text-white/30' : 'text-white/12'}`} style={{ fontFamily: 'var(--font-sans)' }}>{layer.desc}</div>
                  </div>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border flex-shrink-0 ${layer.on ? 'text-white/50 border-white/15 bg-white/[0.03]' : 'text-white/10 border-white/5'}`}>
                  {layer.status}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-white/15 font-mono mt-5 tracking-wide">
            Trace is live. Control, Runtime, Grid, and Sim are future expansion.
          </p>
        </div>
      </section>

      {/* ── SECTION 6: MARKETS ──────────────────────────────────── */}
      <section ref={marketsReveal.ref as React.RefObject<HTMLElement>}
        className="border-t border-white/[0.04]"
        style={reveal(marketsReveal.visible)}>
        <div className="max-w-4xl mx-auto px-8 py-28">
          <p className="text-[10px] text-white/20 tracking-[0.3em] uppercase font-mono mb-10">Scale</p>
          <p className="font-heading text-2xl font-semibold text-white leading-[1.3] tracking-tight mb-6">
            Different systems.<br />Same requirement.
          </p>
          <div className="flex items-center gap-6 mb-14">
            {['Memory.', 'Replay.', 'Governance.', 'Control.'].map(w => (
              <span key={w} className="text-sm text-white/35 font-mono">{w}</span>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-4">
            {MARKETS.map(m => (
              <div key={m} className="flex items-center gap-3">
                <div className="w-px h-3.5 bg-white/12 flex-shrink-0" />
                <span className="text-xs text-white/28 font-mono">{m}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 7: SDK ──────────────────────────────────────── */}
      <section ref={sdkReveal.ref as React.RefObject<HTMLElement>}
        className="border-t border-white/[0.04] bg-[#050709]"
        style={reveal(sdkReveal.visible)}>
        <div className="max-w-4xl mx-auto px-8 py-28">
          <p className="text-[10px] text-white/20 tracking-[0.3em] uppercase font-mono mb-10">SDK</p>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="font-heading text-xl font-semibold text-white mb-4 tracking-tight">
                Instrument any agent<br />in minutes.
              </p>
              <p className="text-sm text-white/30 leading-relaxed mb-8" style={{ fontFamily: 'var(--font-sans)' }}>
                TypeScript and Python. Zero-config. Any model, any framework.
                Executions appear in the dashboard immediately.
              </p>
              <div className="space-y-2">
                {[
                  { cmd: 'npm install kairos-sdk', key: 'npm' },
                  { cmd: 'pip install kairos-trace',  key: 'pip' },
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

            <div className="bg-[#080a0f] border border-white/[0.06] rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.04]">
                <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
                <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
                <div className="w-2 h-2 rounded-full bg-[#28ca41]" />
                <span className="ml-2 text-[10px] text-white/20 font-mono">agent.ts</span>
              </div>
              <div className="p-5 font-mono text-[12px] leading-[2]">
                <p><span className="text-white/20">import</span> <span className="text-white/35">{'{ createKairos }'}</span> <span className="text-white/20">from</span> <span className="text-white/50">&apos;kairos-sdk&apos;</span></p>
                <br />
                <p><span className="text-white/20">const</span> <span className="text-white/65">exec</span> <span className="text-white/20">=</span> <span className="text-white/35">kairos.execution</span><span className="text-white/20">({'{ workflowName }'})</span></p>
                <br />
                <p className="text-white/28">exec.setPrompt<span className="text-white/18">(prompt)</span></p>
                <p className="text-white/28">exec.toolCall<span className="text-white/18">({'{ name, input, output }'})</span></p>
                <p className="text-white/28">exec.decision<span className="text-white/18">(reasoning, confidence)</span></p>
                <br />
                <p><span className="text-white/20">await</span> <span className="text-white/65">exec</span><span className="text-white/20">.</span><span className="text-white/35">complete</span><span className="text-white/20">(output)</span></p>
                <br />
                <p className="text-[10px] text-white/15">{'// replay available immediately'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 8: CLOSING ──────────────────────────────────── */}
      <section className="border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto px-8 py-32">
          <div className="mb-14">
            <Wordmark size="lg" />
          </div>
          <p className="font-heading text-3xl font-semibold text-white leading-[1.3] tracking-tight mb-5">
            Autonomous systems need<br />operational memory.
          </p>
          <p className="text-sm text-white/30 mb-12" style={{ fontFamily: 'var(--font-sans)' }}>
            Kairos is building it.
          </p>
          <div className="flex items-center gap-3">
            <Link href="/app"
              className="px-6 py-3 bg-white text-[#080a0f] text-sm font-semibold rounded hover:bg-white/90 transition-colors">
              Start tracing
            </Link>
            <a href="https://github.com/withkairos/kairos"
              className="px-6 py-3 border border-white/10 text-white/35 text-sm rounded hover:border-white/20 hover:text-white/55 transition-colors font-mono">
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.04] px-8 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-mono text-[10px] text-white/12 tracking-[0.3em] uppercase">Kairos</span>
          <span className="text-[10px] text-white/12 font-mono">Operational memory for autonomous systems.</span>
        </div>
      </footer>

    </div>
  )
}
