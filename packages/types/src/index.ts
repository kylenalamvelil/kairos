// ── Core Kairos Types ────────────────────────────────────────────────────────

export type WorkflowStatus = 'running' | 'completed' | 'failed' | 'paused'
export type ApprovalStatus = 'pending' | 'granted' | 'denied' | 'expired'

export type EventType =
  | 'workflow_started'
  | 'workflow_completed'
  | 'workflow_failed'
  | 'prompt_sent'
  | 'output_received'
  | 'tool_called'
  | 'tool_completed'
  | 'tool_failed'
  | 'approval_requested'
  | 'approval_granted'
  | 'approval_denied'
  | 'memory_read'
  | 'memory_written'
  | 'retry_triggered'
  | 'execution_failed'
  | 'execution_completed'
  | 'agent_started'
  | 'agent_stopped'
  | 'decision_made'
  | 'policy_checked'
  | 'custom'

export interface Agent {
  id: string
  name: string
  description?: string
  agentType?: string
  metadata: Record<string, unknown>
  createdAt: string
}

export interface Workflow {
  id: string
  agentId?: string
  name?: string
  status: WorkflowStatus
  input?: unknown
  output?: unknown
  error?: string
  startedAt: string
  completedAt?: string
  durationMs?: number
  totalTokens: number
  totalCostUsd: number
  metadata: Record<string, unknown>
}

export interface Trace {
  id: string
  workflowId: string
  parentTraceId?: string
  name?: string
  model?: string
  prompt?: string
  output?: string
  promptTokens: number
  completionTokens: number
  latencyMs?: number
  costUsd: number
  startedAt: string
  completedAt?: string
  metadata: Record<string, unknown>
}

export interface Event {
  id: string
  traceId: string
  workflowId: string
  eventType: EventType
  sequence: number
  payload: Record<string, unknown>
  error?: string
  latencyMs?: number
  timestamp: string
  metadata: Record<string, unknown>
}

export interface ToolCall {
  id: string
  traceId: string
  toolName: string
  input?: unknown
  output?: unknown
  error?: string
  status: string
  latencyMs?: number
  retryCount: number
  calledAt: string
  completedAt?: string
  metadata: Record<string, unknown>
}

export interface Approval {
  id: string
  workflowId: string
  traceId?: string
  action: string
  reason?: string
  status: ApprovalStatus
  policy?: string
  requestedAt: string
  resolvedAt?: string
  resolvedBy?: string
  resolutionNote?: string
  expiresAt?: string
  metadata: Record<string, unknown>
}

// ── SDK Config ───────────────────────────────────────────────────────────────

export interface KairosConfig {
  apiKey?: string
  baseUrl?: string
  projectId?: string
  agentId?: string
  debug?: boolean
}

// ── Ingest ───────────────────────────────────────────────────────────────────

export interface IngestPayload {
  workflowId?: string
  agentId?: string
  workflowName?: string
  traceName?: string
  model?: string
  prompt?: string
  output?: string
  promptTokens?: number
  completionTokens?: number
  latencyMs?: number
  costUsd?: number
  toolCalls?: ToolCallPayload[]
  events?: EventPayload[]
  status?: WorkflowStatus
  error?: string
  metadata?: Record<string, unknown>
}

export interface ToolCallPayload {
  name: string
  input?: unknown
  output?: unknown
  error?: string
  status?: string
  latencyMs?: number
  retryCount?: number
  metadata?: Record<string, unknown>
}

export interface EventPayload {
  type: EventType
  payload?: Record<string, unknown>
  latencyMs?: number
  metadata?: Record<string, unknown>
}

export interface IngestResponse {
  workflowId: string
  traceId: string
  eventsIngested: number
  toolCallsIngested: number
}
