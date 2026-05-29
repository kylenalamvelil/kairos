'use client'

import Link from 'next/link'
import { useState } from 'react'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="text-[10px] font-mono text-white/25 hover:text-white/50 transition-colors border border-white/10 px-2 py-0.5 rounded"
    >
      {copied ? 'copied' : 'copy'}
    </button>
  )
}

function Code({ children, language = 'bash', copy }: { children: string; language?: string; copy?: boolean }) {
  return (
    <div className="relative bg-[#050709] border border-white/[0.06] rounded-lg overflow-hidden my-4">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.04]">
        <span className="text-[10px] font-mono text-white/20">{language}</span>
        {copy !== false && <CopyButton text={children.trim()} />}
      </div>
      <pre className="p-4 text-[13px] font-mono text-white/70 overflow-x-auto leading-[1.8]">
        <code>{children.trim()}</code>
      </pre>
    </div>
  )
}

function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return <section id={id} className="mb-16 scroll-mt-24">{children}</section>
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="font-heading text-xl font-semibold text-white mb-4 tracking-tight">{children}</h2>
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-semibold text-white/70 mb-3 mt-6 font-mono tracking-wide uppercase text-[11px]">{children}</h3>
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-white/40 leading-relaxed mb-4">{children}</p>
}

const NAV = [
  { id: 'install',    label: 'Install' },
  { id: 'quickstart', label: 'Quick Start' },
  { id: 'events',     label: 'Event Types' },
  { id: 'replay',     label: 'Replay' },
  { id: 'api',        label: 'API Reference' },
  { id: 'python',     label: 'Python SDK' },
]

export default function Docs() {
  return (
    <div className="min-h-screen bg-[#080a0f] text-[#e8eaf0]">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-white/[0.04] bg-[#080a0f]/95 backdrop-blur-md">
        <Link href="/" className="text-[11px] font-mono text-white/30 hover:text-white/60 transition-colors tracking-[0.3em] uppercase">
          Kairos
        </Link>
        <div className="flex items-center gap-6">
          <span className="text-[10px] font-mono text-white/20 tracking-widest uppercase">Docs</span>
          <Link href="/app" className="text-[10px] font-mono text-white/25 hover:text-white/50 transition-colors tracking-widest uppercase border border-white/10 px-3 py-1.5 rounded">
            Dashboard →
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 pt-24 pb-32 flex gap-16">

        {/* Sidebar */}
        <aside className="w-44 flex-shrink-0 sticky top-24 h-fit hidden md:block">
          <p className="text-[9px] font-mono text-white/15 tracking-[0.3em] uppercase mb-4">Contents</p>
          <nav className="space-y-1">
            {NAV.map(n => (
              <a key={n.id} href={`#${n.id}`}
                className="block text-xs font-mono text-white/25 hover:text-white/55 transition-colors py-1">
                {n.label}
              </a>
            ))}
          </nav>
          <div className="mt-8 pt-8 border-t border-white/[0.04]">
            <a href="https://kairos-production-64c5.up.railway.app/docs"
              target="_blank" rel="noreferrer"
              className="block text-[10px] font-mono text-white/20 hover:text-white/40 transition-colors">
              API Reference ↗
            </a>
            <a href="https://github.com/withkairos/kairos"
              target="_blank" rel="noreferrer"
              className="block text-[10px] font-mono text-white/20 hover:text-white/40 transition-colors mt-2">
              GitHub ↗
            </a>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">

          <div className="mb-14">
            <p className="text-[10px] font-mono text-white/20 tracking-[0.3em] uppercase mb-4">Documentation</p>
            <h1 className="font-heading text-3xl font-semibold text-white tracking-tight mb-4">
              Kairos Trace
            </h1>
            <p className="text-sm text-white/40 leading-relaxed max-w-xl">
              Record and replay every autonomous action. Install the SDK, instrument your agent, and replay execution in the dashboard within minutes.
            </p>
          </div>

          {/* INSTALL */}
          <Section id="install">
            <H2>Install</H2>
            <H3>TypeScript / JavaScript</H3>
            <Code language="bash">npm install kairos-sdk</Code>
            <H3>Python</H3>
            <Code language="bash">pip install kairos-sdk</Code>
          </Section>

          {/* QUICKSTART */}
          <Section id="quickstart">
            <H2>Quick Start</H2>
            <P>Three steps: create an execution, record events, complete it. Every execution is immediately replayable in the dashboard.</P>

            <H3>TypeScript</H3>
            <Code language="typescript">{`
import { createKairos } from 'kairos-sdk'

const kairos = createKairos()
// Optional: createKairos({ baseUrl: 'http://localhost:8000' })

const exec = kairos.execution({ workflowName: 'my-agent' })

// Record what your agent does
exec.setPrompt('Summarise the Q3 earnings report', 'gpt-4o')
exec.toolCall({ name: 'read_file', input: { path: 'q3.pdf' }, output: { text: '...' }, latencyMs: 240 })
exec.decision('Revenue increased 18% YoY', 0.97)

await exec.complete('Q3 summary: Revenue up 18%...')

// Open /app to replay this execution
            `}</Code>

            <H3>Python</H3>
            <Code language="python">{`
from kairos import create_kairos

kairos = create_kairos()

exec = kairos.execution(workflow_name='my-agent')

exec.set_prompt('Summarise the Q3 earnings report', model='gpt-4o')
exec.tool_call('read_file', input={'path': 'q3.pdf'}, output={'text': '...'}, latency_ms=240)
exec.decision('Revenue increased 18% YoY', confidence=0.97)

exec.complete('Q3 summary: Revenue up 18%...')
            `}</Code>

            <P>Open the <Link href="/app" className="text-white/60 hover:text-white underline">dashboard</Link> to see the execution and replay it.</P>
          </Section>

          {/* EVENT TYPES */}
          <Section id="events">
            <H2>Event Types</H2>
            <P>Record any of these events during execution. Each appears as a step in the replay timeline.</P>

            <div className="space-y-3">
              {[
                { method: 'setPrompt(prompt, model?)',              desc: 'The prompt sent to the model' },
                { method: 'setModel(model)',                         desc: 'The model used for this execution' },
                { method: 'toolCall({ name, input, output, latencyMs })', desc: 'Any tool or function called by the agent' },
                { method: 'decision(reasoning, confidence)',         desc: 'A decision made by the agent (0–1 confidence)' },
                { method: 'policyCheck(policy, result)',             desc: 'A governance policy that was evaluated' },
                { method: 'memoryWrite(key, value)',                 desc: 'Something written to agent memory' },
                { method: 'memoryRead(key)',                         desc: 'Something read from agent memory' },
                { method: 'setTokens(prompt, completion)',           desc: 'Token usage for cost tracking' },
                { method: 'setCost(usd)',                            desc: 'Cost of this execution in USD' },
                { method: 'retry(reason)',                           desc: 'A retry was triggered' },
                { method: 'event(type, payload)',                    desc: 'Any custom event' },
                { method: 'complete(output)',                        desc: 'Execution completed successfully' },
                { method: 'fail(error)',                             desc: 'Execution failed with an error' },
              ].map(e => (
                <div key={e.method} className="flex gap-6 py-3 border-b border-white/[0.04]">
                  <code className="text-[11px] font-mono text-white/60 w-80 flex-shrink-0">{e.method}</code>
                  <span className="text-sm text-white/30">{e.desc}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* REPLAY */}
          <Section id="replay">
            <H2>Replay</H2>
            <P>Every execution is automatically replayable. No extra configuration needed.</P>
            <P>Open the <Link href="/app" className="text-white/60 hover:text-white underline">dashboard</Link>, select an execution, and use the replay controls to step through each event — forward, backward, or at any speed.</P>
            <P>What replay shows you:</P>
            <div className="space-y-2 my-4">
              {[
                'Every prompt sent to every model',
                'Every tool called and its output',
                'Every decision and its confidence score',
                'Every policy that was evaluated',
                'Every memory read and write',
                'Total tokens, cost, and duration',
                'Failures and retry attempts',
              ].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-px h-3.5 bg-white/15 flex-shrink-0" />
                  <span className="text-sm text-white/40">{item}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* API */}
          <Section id="api">
            <H2>API Reference</H2>
            <P>The Kairos API is available at:</P>
            <Code language="bash">https://kairos-production-64c5.up.railway.app</Code>
            <P>Interactive docs (Swagger UI):</P>
            <Code language="bash">https://kairos-production-64c5.up.railway.app/docs</Code>
            <H3>Self-hosting</H3>
            <Code language="bash">{`
git clone https://github.com/withkairos/kairos
cd kairos/kairos-core
pip install -r requirements.txt
# Set DATABASE_URL env var
uvicorn main:app --reload --port 8000
            `}</Code>
            <P>Then point your SDK at the local server:</P>
            <Code language="typescript">{`
const kairos = createKairos({ baseUrl: 'http://localhost:8000' })
            `}</Code>
          </Section>

          {/* PYTHON */}
          <Section id="python">
            <H2>Python SDK</H2>
            <Code language="bash">pip install kairos-sdk</Code>
            <P>The Python SDK has zero required dependencies. It uses the standard library by default and switches to <code className="text-white/50">httpx</code> automatically if installed.</P>
            <Code language="python">{`
from kairos import create_kairos

kairos = create_kairos(
    base_url='https://kairos-production-64c5.up.railway.app',  # default
    debug=False,
)

exec = kairos.execution(workflow_name='my-agent', agent_id='agent-1')

exec.set_prompt('Research EU AI Act', model='claude-sonnet-4-6')
exec.tool_call('web_search', input={'query': 'EU AI Act 2025'}, output={'results': [...]}, latency_ms=1200)
exec.decision('EUR-Lex most authoritative', confidence=0.93)
exec.memory_write('eu_act_summary', 'High-risk AI systems require...')
exec.set_tokens(prompt_tokens=312, completion_tokens=840)
exec.set_cost(0.0118)
exec.complete('Summary: ...')
            `}</Code>
          </Section>

        </main>
      </div>
    </div>
  )
}
