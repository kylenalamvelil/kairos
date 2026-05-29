'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
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

const SPEEDS = [0.5, 1, 2, 5] as const
type Speed = typeof SPEEDS[number]

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

function relativeMs(events: KairosEvent[], idx: number) {
  if (events.length === 0) return 0
  const start = new Date(events[0].timestamp).getTime()
  return new Date(events[idx].timestamp).getTime() - start
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
        <p className="text-xs text-[#4b5563]">Instrument your agent and send a trace.</p>
      </div>
      <div className="bg-[#0d1017] border border-[#13161f] rounded-lg p-4 text-left w-full max-w-sm">
        <p className="text-[10px] text-[#4b5563] font-mono mb-2">Quick start</p>
        <div className="space-y-1 font-mono text-xs">
          <p><span className="text-[#4b5563]">$</span> <span className="text-[#e8eaf0]">npm install kairos-sdk</span></p>
          <p className="mt-2"><span className="text-[#4b5563]">import</span> <span className="text-[#e8eaf0]">{'{ createKairos }'}</span> <span className="text-[#4b5563]">from</span> <span className="text-[#1a56ff]">&apos;kairos-sdk&apos;</span></p>
          <p className="mt-1"><span className="text-[#4b5563]">const</span> <span className="text-[#e8eaf0]">k</span> <span className="text-[#4b5563]">=</span> <span className="text-[#e8eaf0]">createKairos()</span></p>
          <p><span className="text-[#4b5563]">await</span> <span className="text-[#e8eaf0]">k.execution().complete(</span><span className="text-[#1a56ff]">&apos;done&apos;</span><span className="text-[#e8eaf0]">)</span></p>
        </div>
      </div>
    </div>
  )
}

function EventRow({ ev, isLast, active, onClick }: {
  ev: KairosEvent
  isLast: boolean
  active: boolean
  onClick: () => void
}) {
  const color = eventColor(ev.event_type)
  const [open, setOpen] = useState(false)

  return (
    <div
      className={`flex gap-3 group cursor-pointer transition-colors rounded ${active ? 'bg-[#0d1017] -mx-2 px-2' : ''}`}
      onClick={() => { onClick(); setOpen(o => !o) }}
    >
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className="w-2 h-2 rounded-full mt-1 z-10 flex-shrink-0 transition-all"
          style={{ background: color, boxShadow: active ? `0 0 6px ${color}` : 'none' }}
        />
        {!isLast && <div className="w-px flex-1 bg-[#13161f] my-0.5 min-h-[12px]" />}
      </div>
      <div className="pb-3 flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-xs font-semibold font-mono" style={{ color }}>{ev.event_type}</span>
          <span className="text-[10px] text-[#4b5563] font-mono">{fmt(ev.timestamp)}</span>
          {ev.latency_ms !== null && (
            <span className="text-[10px] text-[#4b5563] font-mono">{ev.latency_ms}ms</span>
          )}
          {ev.error && <span className="text-[10px] text-red-400 font-mono ml-auto">error</span>}
        </div>
        <div className={`bg-[#0d1017] border rounded px-3 py-2 text-xs font-mono text-[#6b7280] transition-all ${open || active ? 'border-[#1e2232]' : 'border-[#13161f] group-hover:border-[#1e2232]'}`}>
          {open || active ? (
            <pre className="whitespace-pre-wrap break-all text-[10px] text-[#9ca3af]">
              {JSON.stringify(ev.payload, null, 2)}
            </pre>
          ) : (
            <span className="text-[#4b5563] truncate block">
              {Object.entries(ev.payload).slice(0, 3).map(([k, v]) => `${k}: ${String(v)}`).join(' · ') || '(no payload)'}
            </span>
          )}
        </div>
        {ev.error && (open || active) && (
          <div className="mt-1 px-3 py-1.5 bg-red-500/5 border border-red-500/20 rounded text-[10px] text-red-400 font-mono">
            {ev.error}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Replay UI ────────────────────────────────────────────────────────────────

function ReplayPanel({ events }: { events: KairosEvent[] }) {
  const [idx, setIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState<Speed>(1)
  const [filterType, setFilterType] = useState<string | null>(null)
  const hasAutoStarted = useRef(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const activeRowRef = useRef<HTMLDivElement>(null)

  const errorIdx = events.findIndex(e => e.error || e.event_type.includes('failed'))
  const eventTypes = Array.from(new Set(events.map(e => e.event_type)))
  const filteredEvents = filterType ? events.filter(e => e.event_type === filterType) : events

  const totalMs = filteredEvents.length > 1
    ? new Date(filteredEvents[filteredEvents.length - 1].timestamp).getTime() - new Date(filteredEvents[0].timestamp).getTime()
    : 0

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setIdx(prev => {
          if (prev >= filteredEvents.length - 1) {
            setPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, 800 / speed)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [playing, speed, filteredEvents.length])

  useEffect(() => {
    activeRowRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [idx])

  // Auto-start replay once when events first load
  useEffect(() => {
    if (events.length > 0 && !hasAutoStarted.current) {
      hasAutoStarted.current = true
      setIdx(0)
      const t = setTimeout(() => setPlaying(true), 600)
      return () => clearTimeout(t)
    }
  }, [events.length])

  if (events.length === 0) {
    return <p className="text-xs text-[#4b5563] font-mono">No events to replay.</p>
  }

  const clampedIdx = Math.min(idx, filteredEvents.length - 1)
  const current = filteredEvents[clampedIdx]
  const color = eventColor(current.event_type)
  const currentMs = relativeMs(filteredEvents, clampedIdx)
  const pct = totalMs > 0 ? (currentMs / totalMs) * 100 : (clampedIdx / Math.max(filteredEvents.length - 1, 1)) * 100

  return (
    <div className="flex gap-6 h-full">

      {/* Left — controls + scrubber + current event */}
      <div className="w-72 flex-shrink-0 flex flex-col gap-4">

        {/* Playback controls */}
        <div className="bg-[#0d1017] border border-[#13161f] rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] text-[#4b5563] uppercase tracking-wider font-mono">Replay</span>
            <div className="flex items-center gap-1">
              {SPEEDS.map(s => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded transition-colors ${speed === s ? 'bg-[#1a56ff]/20 text-[#1a56ff]' : 'text-[#4b5563] hover:text-[#6b7280]'}`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Scrubber */}
          <div className="mb-4">
            <input
              type="range"
              min={0}
              max={filteredEvents.length - 1}
              value={clampedIdx}
              onChange={e => { setPlaying(false); setIdx(Number(e.target.value)) }}
              className="w-full accent-[#1a56ff] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#4b5563] font-mono mt-1">
              <span>+0ms</span>
              <span>{clampedIdx + 1} / {filteredEvents.length}</span>
              <span>+{totalMs}ms</span>
            </div>
          </div>

          {/* Step buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setPlaying(false); setIdx(0) }}
              className="text-[#4b5563] hover:text-white transition-colors font-mono text-sm px-2"
              title="Reset"
            >⏮</button>
            <button
              onClick={() => { setPlaying(false); setIdx(i => Math.max(0, i - 1)) }}
              className="text-[#4b5563] hover:text-white transition-colors font-mono text-sm px-2"
              title="Step back"
            >⏪</button>
            <button
              onClick={() => setPlaying(p => !p)}
              className="flex-1 text-sm py-1.5 rounded font-mono transition-colors bg-[#1a56ff]/10 border border-[#1a56ff]/20 text-[#1a56ff] hover:bg-[#1a56ff]/20"
            >
              {playing ? '⏸ Pause' : clampedIdx >= filteredEvents.length - 1 ? '↺ Replay' : '▶ Play'}
            </button>
            <button
              onClick={() => { setPlaying(false); setIdx(i => Math.min(filteredEvents.length - 1, i + 1)) }}
              className="text-[#4b5563] hover:text-white transition-colors font-mono text-sm px-2"
              title="Step forward"
            >⏩</button>
          </div>

          {/* Jump to error */}
          {errorIdx >= 0 && (
            <button
              onClick={() => { setPlaying(false); setFilterType(null); setIdx(errorIdx) }}
              className="w-full mt-2 text-[10px] py-1.5 rounded font-mono transition-colors bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
            >
              ⚠ Jump to error
            </button>
          )}
        </div>

        {/* Current event — dominant card */}
        <div className="bg-[#0d1017] border rounded-lg overflow-hidden flex-1 flex flex-col"
          style={{ borderColor: color + '40' }}>
          {/* Event type header */}
          <div className="px-4 py-3 border-b" style={{ borderColor: color + '25', background: color + '08' }}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
              <span className="text-sm font-bold font-mono" style={{ color }}>{current.event_type}</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono text-[#4b5563]">
              <span>#{idx + 1} of {events.length}</span>
              <span>+{currentMs}ms</span>
              {current.latency_ms !== null && <span>{current.latency_ms}ms latency</span>}
            </div>
          </div>
          {/* Payload */}
          <div className="flex-1 overflow-y-auto p-4">
            <pre className="text-[11px] text-[#9ca3af] font-mono whitespace-pre-wrap break-all leading-relaxed">
              {JSON.stringify(current.payload, null, 2)}
            </pre>
          </div>
          {current.error && (
            <div className="mx-4 mb-4 px-3 py-2 bg-red-500/5 border border-red-500/20 rounded text-[10px] text-red-400 font-mono">
              {current.error}
            </div>
          )}
        </div>
      </div>

      {/* Right — event timeline (scrollable) */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-2 flex-shrink-0">
          <h2 className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
            Event Timeline — {filteredEvents.length}{filterType ? ` (filtered)` : ` events`}
          </h2>
          <button
            onClick={() => { navigator.clipboard.writeText(window.location.href); }}
            className="text-[10px] font-mono text-[#4b5563] hover:text-white border border-[#13161f] hover:border-[#1e2232] px-2 py-0.5 rounded transition-colors"
            title="Copy replay link"
          >
            Share replay ↗
          </button>
          <div className="flex items-center gap-2">
            <div
              className="h-1.5 rounded-full bg-[#13161f] overflow-hidden"
              style={{ width: 120 }}
            >
              <div
                className="h-full rounded-full bg-[#1a56ff] transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-[10px] text-[#4b5563] font-mono">{Math.round(pct)}%</span>
          </div>
        </div>

        {/* Event type filter chips */}
        <div className="flex flex-wrap gap-1 mb-3 flex-shrink-0">
          <button
            onClick={() => { setFilterType(null); setIdx(0) }}
            className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${!filterType ? 'bg-[#1a56ff]/20 border-[#1a56ff]/40 text-[#1a56ff]' : 'border-[#13161f] text-[#4b5563] hover:text-[#6b7280]'}`}
          >
            all
          </button>
          {eventTypes.map(t => (
            <button
              key={t}
              onClick={() => { setFilterType(t === filterType ? null : t); setIdx(0) }}
              className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${filterType === t ? 'border-current' : 'border-[#13161f] text-[#4b5563] hover:text-[#6b7280]'}`}
              style={filterType === t ? { color: eventColor(t), borderColor: eventColor(t) + '60', background: eventColor(t) + '15' } : {}}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div ref={timelineRef} className="flex-1 overflow-y-auto pr-1">
          {filteredEvents.map((ev, i) => (
            <div key={ev.id} ref={i === clampedIdx ? activeRowRef : null}>
              <EventRow
                ev={ev}
                isLast={i === filteredEvents.length - 1}
                active={i === clampedIdx}
                onClick={() => { setPlaying(false); setIdx(i) }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main Dashboard ───────────────────────────────────────────────────────────

type Tab = 'timeline' | 'replay' | 'approvals'

export default function Dashboard() {
  const [workflows, setWorkflows]           = useState<Workflow[]>([])
  const [selected, setSelected]             = useState<string | null>(null)
  const [events, setEvents]                 = useState<KairosEvent[]>([])
  const [approvals, setApprovals]           = useState<Approval[]>([])
  const [tab, setTab]                       = useState<Tab>('replay')
  const [loading, setLoading]               = useState(true)
  const [detailLoading, setDetailLoading]   = useState(false)
  const [error, setError]                   = useState<string | null>(null)
  const [apiOnline, setApiOnline]           = useState<boolean | null>(null)
  const [lastRefresh, setLastRefresh]       = useState<Date | null>(null)
  const selectedRef = useRef<string | null>(null)

  useEffect(() => {
    selectedRef.current = selected
  }, [selected])

  const checkHealth = useCallback(() => {
    api.health()
      .then(() => setApiOnline(true))
      .catch(() => setApiOnline(false))
  }, [])

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

  const fetchWorkflows = useCallback(async () => {
    setError(null)
    try {
      const data = await api.getWorkflows()
      setWorkflows(data)
      setLastRefresh(new Date())
      if (data.length > 0 && !selectedRef.current) {
        const first = data[0].id
        setSelected(first)
        fetchDetail(first)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to connect to API')
    } finally {
      setLoading(false)
    }
  }, [fetchDetail])

  useEffect(() => {
    checkHealth()
    fetchWorkflows()
    const interval = setInterval(() => {
      checkHealth()
      fetchWorkflows()
    }, 30_000)
    return () => clearInterval(interval)
  }, [checkHealth, fetchWorkflows])

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
            Kairos
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
              {lastRefresh.toLocaleTimeString('en-GB', { hour12: false })}
            </span>
          )}
          <button
            onClick={fetchWorkflows}
            disabled={loading}
            className="text-xs text-[#4b5563] hover:text-white transition-colors font-mono disabled:opacity-40"
          >
            ↺
          </button>
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span
              className={`w-1.5 h-1.5 rounded-full ${apiOnline === true ? 'bg-emerald-400 animate-pulse' : apiOnline === false ? 'bg-red-400' : 'bg-[#4b5563]'}`}
            />
            <span className={apiOnline === false ? 'text-red-400' : 'text-[#4b5563]'}>
              {apiOnline === true ? 'operational' : apiOnline === false ? 'API offline' : '...'}
            </span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className="w-64 border-r border-[#13161f] flex flex-col bg-[#0d1017] flex-shrink-0">
          <div className="px-4 py-3 border-b border-[#13161f] flex items-center justify-between flex-shrink-0">
            <span className="text-[10px] font-semibold text-[#4b5563] uppercase tracking-wider">Executions</span>
            <span className="text-[10px] text-[#4b5563] font-mono">{workflows.length}</span>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading && <div className="px-4 py-4"><Spinner /></div>}
            {error && !loading && (
              <div className="px-4 py-4">
                <ErrorBanner msg={error} onRetry={fetchWorkflows} />
              </div>
            )}
            {!loading && !error && workflows.length === 0 && (
              <div className="px-4 py-4 text-xs text-[#4b5563] font-mono">No executions yet.</div>
            )}
            {workflows.map(wf => (
              <button
                key={wf.id}
                onClick={() => setSelected(wf.id)}
                className={`w-full text-left px-4 py-3 border-b border-[#13161f] hover:bg-[#080a0f] transition-colors ${selected === wf.id ? 'bg-[#080a0f] border-l-2 border-l-[#1a56ff] pl-[14px]' : ''}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-white truncate mr-2">
                    {wf.name ?? wf.id.slice(0, 12)}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border font-mono flex-shrink-0 ${STATUS_STYLE[wf.status]}`}>
                    {wf.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-[#4b5563] font-mono">
                  <span>{wf.total_tokens.toLocaleString()} tok</span>
                  <span>${wf.total_cost_usd.toFixed(4)}</span>
                  {wf.duration_ms && <span>{fmtDuration(wf.duration_ms)}</span>}
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Main panel */}
        <main className="flex-1 overflow-hidden flex flex-col">

          {!selectedWf && !loading && !error && <EmptyState />}

          {selectedWf && (
            <div className="flex flex-col h-full">

              {/* Execution header */}
              <div className="px-6 pt-5 pb-4 border-b border-[#13161f] flex-shrink-0">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-sm font-semibold text-white mb-0.5">
                      {selectedWf.name ?? 'Unnamed execution'}
                    </h1>
                    <span className="text-[10px] font-mono text-[#4b5563]">{selectedWf.id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {pendingApprovals.length > 0 && (
                      <button
                        onClick={() => setTab('approvals')}
                        className="text-xs px-2 py-1 rounded border border-orange-400/30 text-orange-400 bg-orange-400/10 font-mono"
                      >
                        {pendingApprovals.length} pending
                      </button>
                    )}
                    <span className={`text-[10px] px-2 py-1 rounded border font-mono ${STATUS_STYLE[selectedWf.status]}`}>
                      {selectedWf.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {[
                    { label: 'Events',    value: events.length },
                    { label: 'Tokens',    value: selectedWf.total_tokens.toLocaleString() },
                    { label: 'Cost',      value: `$${selectedWf.total_cost_usd.toFixed(5)}` },
                    { label: 'Duration',  value: fmtDuration(selectedWf.duration_ms) },
                    { label: 'Started',   value: fmt(selectedWf.started_at) },
                  ].map(m => (
                    <div key={m.label} className="bg-[#080a0f] border border-[#13161f] rounded px-3 py-2">
                      <div className="text-[9px] text-[#4b5563] uppercase tracking-wider mb-0.5">{m.label}</div>
                      <div className="text-xs font-semibold text-white font-mono">{m.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tab bar */}
              <div className="flex items-center gap-0 px-6 border-b border-[#13161f] flex-shrink-0">
                {(['timeline', 'replay', 'approvals'] as Tab[]).map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`text-xs uppercase tracking-wider px-3 py-2.5 border-b-2 transition-colors ${tab === t ? 'text-white border-[#1a56ff]' : 'text-[#4b5563] border-transparent hover:text-[#6b7280]'}`}
                  >
                    {t}
                    {t === 'approvals' && approvals.length > 0 && (
                      <span className="ml-1.5 text-[10px] font-mono text-[#4b5563]">({approvals.length})</span>
                    )}
                    {t === 'replay' && events.length > 0 && (
                      <span className="ml-1.5 text-[10px] font-mono text-[#1a56ff]">{events.length}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="flex-1 overflow-y-auto p-6">

                {/* Timeline */}
                {tab === 'timeline' && (
                  <>
                    {detailLoading && <Spinner />}
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
                        {events.map((ev, i) => (
                          <EventRow
                            key={ev.id}
                            ev={ev}
                            isLast={i === events.length - 1}
                            active={false}
                            onClick={() => {}}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* Replay */}
                {tab === 'replay' && (
                  <>
                    {detailLoading && <Spinner />}
                    {!detailLoading && <ReplayPanel events={events} />}
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
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
