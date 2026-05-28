'use client'

import { useState, useEffect, useCallback } from 'react'
import { api, type Workflow, type KairosEvent, type Approval } from '@/lib/api'

// ── Constants ────────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<string, string> = {
  completed: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  failed:    'text-red-400 bg-red-400/10 border-red-400/20',
  running:   'text-blue-400 bg-blue-400/10 border-blue-400/20 animate-pulse',
  paused:    'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  pending:   'text-orange-400 bg-orange-400/10 border-orange-400/20',
  granted:   'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  denied:    'text-red-400 bg-red-400/10 border-red-400/20',
}

const EVENT_COLORS: Record<string, string> = {
  workflow_started:    '#1a56ff',
  workflow_completed:  '#10b981',
  execution_completed: '#10b981',
  execution_failed:    '#ef4444',
  workflow_failed:     '#ef4444',
  prompt_sent:         '#8b5cf6',
  output_received:     '#8b5cf6',
  tool_called:         '#f59e0b',
  tool_completed:      '#10b981',
  tool_failed:         '#ef4444',
  memory_written:      '#06b6d4',
  memory_read:         '#06b6d4',
  decision_made:       '#ec4899',
  policy_checked:      '#f97316',
  approval_requested:  '#f97316',
  approval_granted:    '#10b981',
  approval_denied:     '#ef4444',
  retry_triggered:     '#eab308',
  agent_started:       '#1a56ff',
  agent_stopped:       '#6b7280',
}

function eventColor(type: string) {
  return EVENT_COLORS[type] ?? '#4b5563'
}

function fmt(iso: string) {
  return new Date(iso).toLocaleTimeString('en-GB', { hour12: false })
}

function fmtDuration(ms: number | null) {
  if (!ms) return '—'
  return ms >= 1000 ? `${(ms / 1000).toFixed(2)}s` : `${ms}ms`
}

// ── Sub-components ──────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div className="flex items-center gap-2 text-xs text-[#4b5563] font-mono">
      <span className="w-1.5 h-1.5 rounded-full bg-[#1a56ff] animate-pulse" />
      Loading...
    </div>
  )
}

function ErrorBanner({ msg, onRetry }: { msg: string; onRetry: () => void }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-red-500/5 border border-red-500/20 rounded text-xs text-red-400 font-mono">
      <span>✗ {msg}</span>
      <button onClick={onRetry} className="ml-auto text-[#6b7280] hover:text-white transition-colors">Retry</button>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 text-center px-8 py-16">
      <div className="text-4xl opacity-20">◎</div>
      <div>
        <p className="text-sm text-[#6b7280] mb-1">No executions yet.</p>
        <p className="text-xs text-[#4b5563]">Start the API and send a trace from the SDK.</p>
      </div>
      <div className="bg-[#0d1017] border border-[#13161f] rounded-lg p-4 text-left w-full max-w-sm">
        <p className="text-[10px] text-[#4b5563] font-mono mb-2">Quick start</p>
        <div className="space-y-1 font-mono text-xs">
          <p><span className="text-[#4b5563]">import</span> <span className="text-[#e8eaf0]">{'{ createKairos }'}</span> <span className="text-[#4b5563]">from</span> <span className="text-[#1a56ff]">&apos;@kairos/sdk&apos;</span></p>
          <p className="mt-2"><span className="text-[#4b5563]">const</span> <span className="text-[#e8eaf0]">k</span> <span className="text-[#4b5563]">=</span> <span className="text-[#e8eaf0]">createKairos()</span></p>
          <p><span className="text-[#4b5563]">await</span> <span className="text-[#e8eaf0]">k.execution().complete(</span><span className="text-[#1a56ff]">&apos;done&apos;</span><span className="text-[#e8eaf0]">)</span></p>
        </div>
      </div>
      <p className="text-[10px] text-[#4b5563] font-mono">
        Or run: <span className="text-[#6b7280]">python seed.py</span> in kairos-core
      </p>
    </div>
  )
}

function EventRow({ ev, isLast }: { ev: KairosEvent; isLast: boolean }) {
  const [open, setOpen] = useState(false)
  const color = eventColor(ev.event_type)

  return (
    <div className="flex gap-3 group">
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-2 h-2 rounded-full mt-1 z-10 flex-shrink-0" style={{ background: color }} />
        {!isLast && <div className="w-px flex-1 bg-[#13161f] my-0.5 min-h-[12px]" />}
      </div>
      <div className="pb-3 flex-1 min-w-0">
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full text-left"
        >
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs font-semibold font-mono" style={{ color }}>{ev.event_type}</span>
            <span className="text-[10px] text-[#4b5563] font-mono">{fmt(ev.timestamp)}</span>
            {ev.latency_ms !== null && (
              <span className="text-[10px] text-[#4b5563] font-mono">{ev.latency_ms}ms</span>
            )}
            {ev.error && <span className="text-[10px] text-red-400 font-mono ml-auto">error</span>}
          </div>
        </button>
        <div
          className={`bg-[#0d1017] border rounded px-3 py-2 text-xs font-mono text-[#6b7280] transition-colors cursor-pointer ${open ? 'border-[#1e2232]' : 'border-[#13161f] group-hover:border-[#1e2232]'}`}
          onClick={() => setOpen(o => !o)}
        >
          {open ? (
            <pre className="whitespace-pre-wrap break-all text-[10px] text-[#9ca3af]">
              {JSON.stringify(ev.payload, null, 2)}
            </pre>
          ) : (
            <span className="text-[#4b5563] truncate block">
              {Object.entries(ev.payload).slice(0, 3).map(([k, v]) => `${k}: ${String(v)}`).join(' · ') || '(no payload)'}
            </span>
          )}
        </div>
        {ev.error && open && (
          <div className="mt-1 px-3 py-1.5 bg-red-500/5 border border-red-500/20 rounded text-[10px] text-red-400 font-mono">
            {ev.error}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main Dashboard ───────────────────────────────────────────────────────────

type Tab = 'timeline' | 'approvals'

export default function Dashboard() {
  const [workflows, setWorkflows]       = useState<Workflow[]>([])
  const [selected, setSelected]         = useState<string | null>(null)
  const [events, setEvents]             = useState<KairosEvent[]>([])
  const [approvals, setApprovals]       = useState<Approval[]>([])
  const [tab, setTab]                   = useState<Tab>('timeline')
  const [loading, setLoading]           = useState(true)
  const [detailLoading, setDetailLoading] = useState(false)
  const [error, setError]               = useState<string | null>(null)
  const [apiOnline, setApiOnline]       = useState<boolean | null>(null)
  const [lastRefresh, setLastRefresh]   = useState<Date | null>(null)

  // Check API health
  useEffect(() => {
    api.health()
      .then(() => setApiOnline(true))
      .catch(() => setApiOnline(false))
  }, [])

  const fetchWorkflows = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getWorkflows()
      setWorkflows(data)
      setLastRefresh(new Date())
      if (data.length > 0 && !selected) {
        setSelected(data[0].id)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to connect to API')
    } finally {
      setLoading(false)
    }
  }, [selected])

  const fetchDetail = useCallback(async (id: string) => {
    setDetailLoading(true)
    try {
      const [evs, apps] = await Promise.all([
        api.getEvents(id),
        api.getApprovals(id),
      ])
      setEvents(evs)
      setApprovals(apps)
    } catch {
      setEvents([])
      setApprovals([])
    } finally {
      setDetailLoading(false)
    }
  }, [])

  useEffect(() => { fetchWorkflows() }, [])

  useEffect(() => {
    if (selected) fetchDetail(selected)
  }, [selected, fetchDetail])

  const selectedWf = workflows.find(w => w.id === selected)

  const pendingApprovals = approvals.filter(a => a.status === 'pending')

  return (
    <div className="h-screen bg-[#080a0f] text-[#e8eaf0] flex flex-col overflow-hidden">

      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-[#13161f] bg-[#0d1017] flex-shrink-0">
        <div className="flex items-center gap-6">
          <a href="/" className="font-mono text-xs font-semibold text-white tracking-widest hover:text-[#6b7280] transition-colors">
            KAIROS
          </a>
          <nav className="flex items-center gap-4">
            {['Executions', 'Agents', 'Policies'].map(n => (
              <span key={n} className={`text-xs uppercase tracking-wider ${n === 'Executions' ? 'text-white' : 'text-[#4b5563]'}`}>
                {n}
              </span>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {lastRefresh && (
            <span className="text-[10px] text-[#4b5563] font-mono">
              refreshed {lastRefresh.toLocaleTimeString('en-GB', { hour12: false })}
            </span>
          )}
          <button
            onClick={fetchWorkflows}
            disabled={loading}
            className="text-xs text-[#4b5563] hover:text-white transition-colors font-mono disabled:opacity-40"
          >
            ↺ Refresh
          </button>
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span
              className={`w-1.5 h-1.5 rounded-full ${apiOnline === true ? 'bg-emerald-400 animate-pulse' : apiOnline === false ? 'bg-red-400' : 'bg-[#4b5563]'}`}
            />
            <span className={apiOnline === false ? 'text-red-400' : 'text-[#4b5563]'}>
              {apiOnline === true ? 'API operational' : apiOnline === false ? 'API offline' : 'Checking...'}
            </span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className="w-72 border-r border-[#13161f] flex flex-col bg-[#0d1017] flex-shrink-0">
          <div className="px-4 py-3 border-b border-[#13161f] flex items-center justify-between flex-shrink-0">
            <span className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider">Executions</span>
            <span className="text-xs text-[#4b5563] font-mono">{workflows.length}</span>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading && (
              <div className="px-4 py-4"><Spinner /></div>
            )}
            {error && !loading && (
              <div className="px-4 py-4">
                <ErrorBanner msg={error} onRetry={fetchWorkflows} />
                {apiOnline === false && (
                  <p className="mt-3 text-[10px] text-[#4b5563] font-mono leading-relaxed">
                    Start the backend:<br />
                    <span className="text-[#6b7280]">cd kairos-core && docker-compose up</span>
                  </p>
                )}
              </div>
            )}
            {!loading && !error && workflows.length === 0 && (
              <div className="px-4 py-4 text-xs text-[#4b5563] font-mono">
                No executions found.<br />
                <span className="text-[#6b7280]">Run: python seed.py</span>
              </div>
            )}
            {workflows.map(wf => (
              <button
                key={wf.id}
                onClick={() => setSelected(wf.id)}
                className={`w-full text-left px-4 py-3.5 border-b border-[#13161f] hover:bg-[#080a0f] transition-colors ${selected === wf.id ? 'bg-[#080a0f] border-l-2 border-l-[#1a56ff] pl-[14px]' : ''}`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-white truncate mr-2">
                    {wf.name ?? wf.id.slice(0, 12)}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border font-mono flex-shrink-0 ${STATUS_STYLE[wf.status]}`}>
                    {wf.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-[#4b5563] font-mono">
                  <span>{wf.total_tokens.toLocaleString()} tok</span>
                  <span>${wf.total_cost_usd.toFixed(4)}</span>
                  {wf.duration_ms && <span>{fmtDuration(wf.duration_ms)}</span>}
                </div>
                <div className="text-[10px] text-[#4b5563] font-mono mt-0.5 truncate">{wf.id}</div>
              </button>
            ))}
          </div>
        </aside>

        {/* Main panel */}
        <main className="flex-1 overflow-y-auto">

          {!selectedWf && !loading && !error && <EmptyState />}

          {selectedWf && (
            <div className="p-6">

              {/* Execution header */}
              <div className="mb-6 pb-5 border-b border-[#13161f]">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-base font-semibold text-white mb-1">
                      {selectedWf.name ?? 'Unnamed execution'}
                    </h1>
                    <span className="text-xs font-mono text-[#4b5563]">{selectedWf.id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {pendingApprovals.length > 0 && (
                      <button
                        onClick={() => setTab('approvals')}
                        className="text-xs px-2 py-1 rounded border border-orange-400/30 text-orange-400 bg-orange-400/10 font-mono"
                      >
                        {pendingApprovals.length} pending approval{pendingApprovals.length > 1 ? 's' : ''}
                      </button>
                    )}
                    <span className={`text-xs px-2 py-1 rounded border font-mono ${STATUS_STYLE[selectedWf.status]}`}>
                      {selectedWf.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-3">
                  {[
                    { label: 'Events', value: events.length },
                    { label: 'Tokens', value: selectedWf.total_tokens.toLocaleString() },
                    { label: 'Cost', value: `$${selectedWf.total_cost_usd.toFixed(5)}` },
                    { label: 'Duration', value: fmtDuration(selectedWf.duration_ms) },
                    { label: 'Started', value: fmt(selectedWf.started_at) },
                  ].map(m => (
                    <div key={m.label} className="bg-[#0d1017] border border-[#13161f] rounded px-3 py-2.5">
                      <div className="text-[10px] text-[#4b5563] uppercase tracking-wider mb-1">{m.label}</div>
                      <div className="text-sm font-semibold text-white font-mono">{m.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tab bar */}
              <div className="flex items-center gap-1 mb-5 border-b border-[#13161f] pb-0">
                {(['timeline', 'approvals'] as Tab[]).map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`text-xs uppercase tracking-wider px-3 py-2 border-b-2 transition-colors ${tab === t ? 'text-white border-[#1a56ff]' : 'text-[#4b5563] border-transparent hover:text-[#6b7280]'}`}
                  >
                    {t}
                    {t === 'approvals' && approvals.length > 0 && (
                      <span className="ml-1.5 text-[10px] font-mono text-[#4b5563]">({approvals.length})</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Timeline */}
              {tab === 'timeline' && (
                <>
                  {detailLoading && <div className="py-4"><Spinner /></div>}
                  {!detailLoading && events.length === 0 && (
                    <p className="text-xs text-[#4b5563] font-mono">No events recorded for this execution.</p>
                  )}
                  {!detailLoading && events.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
                          Execution Timeline — {events.length} events
                        </h2>
                      </div>
                      <div>
                        {events.map((ev, i) => (
                          <EventRow key={ev.id} ev={ev} isLast={i === events.length - 1} />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Approvals */}
              {tab === 'approvals' && (
                <div>
                  {approvals.length === 0 && (
                    <p className="text-xs text-[#4b5563] font-mono">No approvals for this execution.</p>
                  )}
                  {approvals.map(app => (
                    <div key={app.id} className="mb-3 p-4 bg-[#0d1017] border border-[#13161f] rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="text-sm font-semibold text-white mb-0.5">{app.action}</div>
                          {app.reason && <div className="text-xs text-[#6b7280]">{app.reason}</div>}
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-mono ${STATUS_STYLE[app.status]}`}>
                          {app.status}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#4b5563] font-mono">
                        {app.policy && <span className="mr-3">policy: {app.policy}</span>}
                        <span>requested: {fmt(app.requested_at)}</span>
                        {app.resolved_at && <span className="ml-3">resolved: {fmt(app.resolved_at)}</span>}
                      </div>
                      {app.status === 'pending' && (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={async () => {
                              await api.resolveApproval(app.id, 'granted')
                              fetchDetail(selectedWf.id)
                            }}
                            className="text-xs px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/20 transition-colors font-mono"
                          >
                            Grant
                          </button>
                          <button
                            onClick={async () => {
                              await api.resolveApproval(app.id, 'denied')
                              fetchDetail(selectedWf.id)
                            }}
                            className="text-xs px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded hover:bg-red-500/20 transition-colors font-mono"
                          >
                            Deny
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}
        </main>
      </div>
    </div>
  )
}
