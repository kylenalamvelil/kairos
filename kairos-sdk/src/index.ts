// ── Types ─────────────────────────────────────────────────────────────────────

export type WorkflowStatus = 'running' | 'completed' | 'failed' | 'paused'

export type EventType =
  | 'workflow_started' | 'workflow_completed' | 'workflow_failed'
  | 'prompt_sent' | 'output_received'
  | 'tool_called' | 'tool_completed' | 'tool_failed'
  | 'approval_requested' | 'approval_granted' | 'approval_denied'
  | 'memory_read' | 'memory_written'
  | 'retry_triggered'
  | 'execution_failed' | 'execution_completed'
  | 'agent_started' | 'agent_stopped'
  | 'decision_made' | 'policy_checked'
  | 'custom'
  | (string & {}) // allow arbitrary strings without losing autocomplete

export interface KairosConfig {
  apiKey?: string
  baseUrl?: string
  agentId?: string
  debug?: boolean
}

export interface ToolCallPayload {
  name: string
  input?: unknown
  output?: unknown
  error?: string
  latencyMs?: number
  retryCount?: number
  status?: string
}

export interface EventPayload {
  type: EventType
  payload?: Record<string, unknown>
  latencyMs?: number
}

export interface IngestPayload {
  workflowId?: string
  workflowName?: string
  traceName?: string
  agentId?: string
  model?: string
  prompt?: string
  output?: string
  error?: string
  promptTokens?: number
  completionTokens?: number
  latencyMs?: number
  costUsd?: number
  status?: WorkflowStatus
  toolCalls?: ToolCallPayload[]
  events?: EventPayload[]
  metadata?: Record<string, unknown>
}

export interface IngestResponse {
  workflowId: string
  traceId: string
  eventsIngested: number
  toolCallsIngested: number
}

// ── Execution Builder ─────────────────────────────────────────────────────────

export class KairosExecution {
  private payload: IngestPayload
  private startedAt: number
  private client: KairosClient

  constructor(client: KairosClient, init: Partial<IngestPayload> = {}) {
    this.client = client
    this.startedAt = Date.now()
    this.payload = {
      promptTokens: 0,
      completionTokens: 0,
      costUsd: 0,
      toolCalls: [],
      events: [],
      status: 'running',
      metadata: {},
      ...init,
    }
    this.event('workflow_started', { workflowName: init.workflowName })
  }

  setPrompt(prompt: string): this {
    this.payload.prompt = prompt
    this.event('prompt_sent', { prompt: prompt.slice(0, 200) })
    return this
  }

  setModel(model: string): this {
    this.payload.model = model
    return this
  }

  setTokens(prompt: number, completion: number): this {
    this.payload.promptTokens = prompt
    this.payload.completionTokens = completion
    return this
  }

  setCost(usd: number): this {
    this.payload.costUsd = usd
    return this
  }

  toolCall(tc: ToolCallPayload): this {
    this.payload.toolCalls!.push(tc)
    this.event('tool_called', { name: tc.name, input: tc.input })
    if (tc.error) {
      this.event('tool_failed', { name: tc.name, error: tc.error, latencyMs: tc.latencyMs })
    } else {
      this.event('tool_completed', { name: tc.name, output: tc.output, latencyMs: tc.latencyMs })
    }
    return this
  }

  decision(reasoning: string, confidence?: number): this {
    this.event('decision_made', { reasoning, confidence })
    return this
  }

  policyCheck(policy: string, result: 'pass' | 'fail' | 'requires_approval', reason?: string): this {
    this.event('policy_checked', { policy, result, reason })
    return this
  }

  memoryWrite(key: string, value?: unknown): this {
    this.event('memory_written', { key, value })
    return this
  }

  memoryRead(key: string, value?: unknown): this {
    this.event('memory_read', { key, value })
    return this
  }

  retry(attempt: number, reason?: string): this {
    this.event('retry_triggered', { attempt, reason })
    return this
  }

  event(type: EventType, payload: Record<string, unknown> = {}): this {
    this.payload.events!.push({ type, payload })
    return this
  }

  async complete(output?: string): Promise<IngestResponse> {
    if (output !== undefined) this.payload.output = output
    this.payload.status = 'completed'
    this.payload.latencyMs = Date.now() - this.startedAt
    this.event('execution_completed', { durationMs: this.payload.latencyMs })
    return this.client._flush(this.payload)
  }

  async fail(error: string): Promise<IngestResponse> {
    this.payload.status = 'failed'
    this.payload.error = error
    this.payload.latencyMs = Date.now() - this.startedAt
    this.event('execution_failed', { error, durationMs: this.payload.latencyMs })
    return this.client._flush(this.payload)
  }
}

// ── Kairos Client ─────────────────────────────────────────────────────────────

export class KairosClient {
  private config: Required<KairosConfig>

  constructor(config: KairosConfig = {}) {
    this.config = {
      apiKey:   config.apiKey   ?? (typeof process !== 'undefined' ? process.env.KAIROS_API_KEY  ?? '' : ''),
      baseUrl:  config.baseUrl  ?? (typeof process !== 'undefined' ? process.env.KAIROS_BASE_URL ?? 'https://kairos-production-64c5.up.railway.app' : 'https://kairos-production-64c5.up.railway.app'),
      agentId:  config.agentId  ?? '',
      debug:    config.debug    ?? false,
    }
  }

  /** Start a traced execution */
  execution(init: Partial<IngestPayload> = {}): KairosExecution {
    return new KairosExecution(this, {
      agentId: this.config.agentId || undefined,
      ...init,
    })
  }

  /** Internal: POST to /v1/ingest */
  async _flush(payload: IngestPayload): Promise<IngestResponse> {
    const url = `${this.config.baseUrl}/v1/ingest`
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (this.config.apiKey) headers['X-Kairos-Key'] = this.config.apiKey

    if (this.config.debug) console.log('[kairos]', JSON.stringify(payload, null, 2))

    try {
      const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(payload) })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Kairos ingest failed ${res.status}: ${text}`)
      }
      return res.json()
    } catch (err) {
      if (this.config.debug) console.error('[kairos] error', err)
      return { workflowId: '', traceId: '', eventsIngested: 0, toolCallsIngested: 0 }
    }
  }
}

// ── Factory ───────────────────────────────────────────────────────────────────

export function createKairos(config: KairosConfig = {}): KairosClient {
  return new KairosClient(config)
}
