import Link from 'next/link'

const NAV_LINKS = [
  { href: '/product', label: 'Product' },
  { href: '/docs', label: 'Docs' },
  { href: '/company', label: 'Company' },
]

const FEATURES = [
  {
    label: 'Observe Execution',
    desc: 'See every decision, prompt, tool call, and failure across autonomous systems — in real time.',
    icon: '◎',
  },
  {
    label: 'Replay Operations',
    desc: 'Reconstruct any workflow step by step. Inspect execution paths. Debug operational failures.',
    icon: '↺',
  },
  {
    label: 'Govern Autonomy',
    desc: 'Set runtime policies, require human approvals, enforce escalation paths before execution continues.',
    icon: '⊡',
  },
  {
    label: 'Coordinate Systems',
    desc: 'Orchestrate agents, tools, and autonomous workflows at scale with operational guarantees.',
    icon: '⌘',
  },
]

const STATS = [
  { value: '< 1ms', label: 'Ingestion latency' },
  { value: '100%', label: 'Execution captured' },
  { value: 'Full', label: 'Replay fidelity' },
  { value: 'Any', label: 'Agent framework' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-[#080a0f] text-[#e8eaf0]">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-[#13161f] bg-[#080a0f]/90 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-semibold text-white tracking-widest">KAIROS</span>
        </div>
        <div className="flex items-center gap-8">
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} className="text-xs text-[#6b7280] hover:text-white transition-colors tracking-wide uppercase">
              {l.label}
            </Link>
          ))}
        </div>
        <Link
          href="/app"
          className="px-4 py-1.5 text-xs font-semibold tracking-wider uppercase bg-[#1a56ff] text-white rounded hover:bg-[#1a56ff]/80 transition-colors"
        >
          Request Access
        </Link>
      </nav>

      {/* HERO */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center overflow-hidden pt-20">
        {/* Grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(26,86,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(26,86,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(26,86,255,0.04)_0%,transparent_70%)]" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-8 px-3 py-1 border border-[#13161f] rounded-full bg-[#0d1017]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1a56ff] animate-pulse" />
            <span className="text-xs text-[#6b7280] tracking-widest uppercase font-mono">Kairos Trace — Early Access</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-white leading-[1.05] mb-6">
            The control layer for<br />
            <span className="text-[#1a56ff]">autonomous operations.</span>
          </h1>

          <p className="text-lg text-[#6b7280] max-w-xl mx-auto leading-relaxed mb-10">
            Operational infrastructure for autonomous systems.
            Telemetry, replay, governance, and runtime visibility — for AI agents and beyond.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/app"
              className="px-6 py-3 bg-[#1a56ff] text-white font-semibold text-sm rounded hover:bg-[#1a56ff]/80 transition-all tracking-wide"
            >
              Request Access
            </Link>
            <Link
              href="/docs"
              className="px-6 py-3 border border-[#1e2232] text-[#6b7280] font-semibold text-sm rounded hover:text-white hover:border-[#2d3350] transition-all tracking-wide font-mono"
            >
              View Docs →
            </Link>
          </div>
        </div>

        {/* Terminal preview */}
        <div className="relative z-10 mt-20 w-full max-w-2xl mx-auto">
          <div className="bg-[#0d1017] border border-[#13161f] rounded-lg overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#13161f]">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28ca41]" />
              <span className="ml-3 text-xs text-[#4b5563] font-mono">kairos — execution trace</span>
            </div>
            <div className="p-6 font-mono text-xs leading-6">
              <p><span className="text-[#4b5563]">import</span> <span className="text-[#e8eaf0]">{'{ createKairos }'}</span> <span className="text-[#4b5563]">from</span> <span className="text-[#1a56ff]">&apos;@kairos/sdk&apos;</span></p>
              <p className="mt-2"><span className="text-[#4b5563]">const</span> <span className="text-[#e8eaf0]">kairos</span> <span className="text-[#4b5563]">=</span> <span className="text-[#e8eaf0]">createKairos</span><span className="text-[#4b5563]">()</span></p>
              <p className="mt-4"><span className="text-[#4b5563]">const</span> <span className="text-[#e8eaf0]">exec</span> <span className="text-[#4b5563]">= kairos</span><span className="text-[#e8eaf0]">.execution</span><span className="text-[#4b5563]">({'{ '}workflowName: <span className="text-[#1a56ff]">&apos;research-agent&apos;</span>{'} })'}</span></p>
              <p className="mt-2 pl-4"><span className="text-[#e8eaf0]">.setPrompt</span><span className="text-[#4b5563]">(prompt)</span></p>
              <p className="pl-4"><span className="text-[#e8eaf0]">.toolCall</span><span className="text-[#4b5563]">({'{ '}name: <span className="text-[#1a56ff]">&apos;web_search&apos;</span>, input, output{'} })'}</span></p>
              <p className="pl-4"><span className="text-[#e8eaf0]">.decision</span><span className="text-[#4b5563]">(<span className="text-[#1a56ff]">&apos;Selected most credible source&apos;</span>, <span className="text-[#e8eaf0]">0.94</span>)</span></p>
              <p className="mt-2"><span className="text-[#4b5563]">await</span> <span className="text-[#e8eaf0]">exec.complete</span><span className="text-[#4b5563]">(output)</span></p>
              <p className="mt-4 text-[#1a56ff]">✓ Execution captured · 4 events · 1 tool call · 2.1s</p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-[#13161f] bg-[#0d1017]">
        <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-semibold text-white mb-1">{s.value}</div>
              <div className="text-xs text-[#4b5563] uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="mb-16 text-center">
          <p className="text-xs text-[#1a56ff] tracking-widest uppercase font-mono mb-4">Kairos Trace</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
            Autonomous systems require<br />operational infrastructure.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map(f => (
            <div
              key={f.label}
              className="p-6 border border-[#13161f] rounded-lg bg-[#0d1017] hover:border-[#1e2232] transition-colors group"
            >
              <div className="text-2xl text-[#1a56ff] mb-4 font-mono">{f.icon}</div>
              <h3 className="text-base font-semibold text-white mb-2">{f.label}</h3>
              <p className="text-sm text-[#6b7280] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ARCHITECTURE */}
      <section className="border-t border-[#13161f] bg-[#0d1017]">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <p className="text-xs text-[#1a56ff] tracking-widest uppercase font-mono mb-4 text-center">Architecture</p>
          <h2 className="text-3xl font-semibold text-white text-center mb-16 tracking-tight">
            Built for the full autonomy stack.
          </h2>
          <div className="flex flex-col gap-0 border border-[#13161f] rounded-lg overflow-hidden">
            {[
              { phase: 'Kairos Trace', desc: 'Observability, replay, governance, operational memory', status: 'Building now', active: true },
              { phase: 'Kairos Control', desc: 'Runtime policy enforcement, approvals, escalation routing', status: 'Phase 2', active: false },
              { phase: 'Kairos Grid', desc: 'Multi-agent coordination, distributed orchestration', status: 'Phase 3', active: false },
              { phase: 'Kairos Sim', desc: 'Simulation, adversarial testing, execution forecasting', status: 'Phase 4', active: false },
              { phase: 'Kairos Runtime', desc: 'Autonomous execution environments, operational runtimes', status: 'Phase 5', active: false },
            ].map((row, i) => (
              <div
                key={row.phase}
                className={`flex items-center justify-between px-6 py-5 ${i > 0 ? 'border-t border-[#13161f]' : ''} ${row.active ? 'bg-[#080a0f]' : ''}`}
              >
                <div className="flex items-center gap-4">
                  {row.active && <span className="w-1.5 h-1.5 rounded-full bg-[#1a56ff] animate-pulse flex-shrink-0" />}
                  {!row.active && <span className="w-1.5 h-1.5 rounded-full bg-[#1e2232] flex-shrink-0" />}
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
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <h2 className="text-3xl font-semibold text-white mb-4 tracking-tight">
            Deploy operational infrastructure<br />before you need it.
          </h2>
          <p className="text-[#6b7280] mb-10 text-sm leading-relaxed">
            Autonomous systems are already failing silently. Kairos gives you the visibility,
            replay, and governance layer to operate them with confidence.
          </p>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1a56ff] text-white font-semibold text-sm rounded hover:bg-[#1a56ff]/80 transition-all tracking-wide"
          >
            Request Access →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#13161f] px-8 py-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-mono text-xs text-[#4b5563] tracking-widest">KAIROS</span>
          <span className="text-xs text-[#4b5563]">The control layer for autonomous operations.</span>
        </div>
      </footer>
    </div>
  )
}
