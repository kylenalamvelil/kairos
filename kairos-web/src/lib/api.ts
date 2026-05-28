// ── API Client for kairos-core ───────────────────────────────────────────────

const BASE = process.env.NEXT_PUBLIC_KAIROS_API_URL ?? 'https://kairos-production-64c5.up.railway.app'

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}/v1${path}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}/v1${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}

// ── Types (matching Python backend snake_case) ───────────────────────────────

export interface Workflow {
  id: string
  agent_id: string | null
  name: string | null
  status: 'running' | 'completed' | 'failed' | 'paused'
  input: unknown
  output: unknown
  error: string | null
  started_at: string
  completed_at: string | null
  duration_ms: number | null
  total_tokens: number
  total_cost_usd: number
  metadata: Record<string, unknown>
}

export interface Trace {
  id: string
  workflow_id: string
  parent_trace_id: string | null
  name: string | null
  model: string | null
  prompt: string | null
  output: string | null
  prompt_tokens: number
  completion_tokens: number
  latency_ms: number | null
  cost_usd: number
  started_at: string
  completed_at: string | null
  metadata: Record<string, unknown>
}

export interface KairosEvent {
  id: string
  trace_id: string
  workflow_id: string
  event_type: string
  sequence: number
  payload: Record<string, unknown>
  error: string | null
  latency_ms: number | null
  timestamp: string
  metadata: Record<string, unknown>
}

export interface Approval {
  id: string
  workflow_id: string
  trace_id: string | null
  action: string
  reason: string | null
  status: 'pending' | 'granted' | 'denied' | 'expired'
  policy: string | null
  requested_at: string
  resolved_at: string | null
  resolved_by: string | null
  resolution_note: string | null
  expires_at: string | null
  metadata: Record<string, unknown>
}

export interface ReplaySession {
  id: string
  workflow_id: string
  name: string | null
  status: string
  current_event_index: number
  total_events: number
  created_at: string
  started_at: string | null
  completed_at: string | null
}

// ── API Methods ──────────────────────────────────────────────────────────────

export const api = {
  health: () => fetch(`${BASE}/health`).then(r => r.json()),

  getWorkflows: (limit = 50) =>
    get<Workflow[]>(`/workflows?limit=${limit}`),

  getWorkflow: (id: string) =>
    get<Workflow>(`/workflows/${id}`),

  getTraces: (workflowId: string) =>
    get<Trace[]>(`/traces?workflow_id=${workflowId}&limit=100`),

  getEvents: (workflowId: string) =>
    get<KairosEvent[]>(`/events?workflow_id=${workflowId}&limit=500`),

  getApprovals: (workflowId?: string) =>
    get<Approval[]>(`/approvals${workflowId ? `?workflow_id=${workflowId}` : '?limit=100'}`),

  createReplay: (workflowId: string) =>
    post<ReplaySession>('/replay', { workflow_id: workflowId }),

  getReplayEvents: (sessionId: string, fromIndex = 0) =>
    get<KairosEvent[]>(`/replay/${sessionId}/events?from_index=${fromIndex}&limit=200`),

  resolveApproval: (id: string, status: 'granted' | 'denied', resolvedBy?: string) =>
    post(`/approvals/${id}/resolve`, { status, resolved_by: resolvedBy ?? 'operator' }),
}
