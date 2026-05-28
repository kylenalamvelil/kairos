import type {
  KairosConfig,
  IngestPayload,
  IngestResponse,
  ToolCallPayload,
  EventPayload,
  EventType,
  WorkflowStatus,
} from '../../packages/types/src/index'

const DEFAULT_BASE_URL = 'http://localhost:8000'

// ── Execution Builder ────────────────────────────────────────────────────────

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
  }

  setPrompt(prompt: string): this {
    this.payload.prompt = prompt
    this.event('prompt_sent', { prompt })
    return this
  }

  setOutput(output: string): this {
    this.payload.output = output
    this.event('output_received', { output })
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
      this.event('tool_failed', { name: tc.name, error: tc.error })
    } else {
      this.event('tool_completed', { name: tc.name, output: tc.output, latencyMs: tc.latencyMs })
    }
    return this
  }

  memoryWrite(key: string, value: unknown): this {
    this.event('memory_written', { key, value })
    return this
  }

  memoryRead(key: string, value: unknown): this {
    this.event('memory_read', { key, value })
    return this
  }

  decision(reasoning: string, confidence?: number): this {
    this.event('decision_made', { reasoning, confidence })
    return this
  }

  policyCheck(policy: string, result: 'pass' | 'fail', reason?: string): this {
    this.event('policy_checked', { policy, result, reason })
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
    if (output) this.payload.output = output
    this.payload.status = 'completed'
    this.payload.latencyMs = Date.now() - this.startedAt
    this.event('execution_completed', { latencyMs: this.payload.latencyMs })
    return this.client.flush(this.payload)
  }

  async fail(error: string): Promise<IngestResponse> {
    this.payload.status = 'failed'
    this.payload.error = error
    this.payload.latencyMs = Date.now() - this.startedAt
    this.event('execution_failed', { error, latencyMs: this.payload.latencyMs })
    return this.client.flush(this.payload)
  }
}

// ── Kairos Client ────────────────────────────────────────────────────────────

export class KairosClient {
  private config: Required<KairosConfig>

  constructor(config: KairosConfig = {}) {
    this.config = {
      apiKey: config.apiKey ?? process.env.KAIROS_API_KEY ?? '',
      baseUrl: config.baseUrl ?? process.env.KAIROS_BASE_URL ?? DEFAULT_BASE_URL,
      projectId: config.projectId ?? '',
      agentId: config.agentId ?? '',
      debug: config.debug ?? false,
    }
  }

  /** Start a new execution and return a builder */
  execution(init: Partial<IngestPayload> = {}): KairosExecution {
    return new KairosExecution(this, {
      agentId: this.config.agentId || undefined,
      ...init,
    })
  }

  /** One-shot trace for simple LLM calls */
  async trace(payload: IngestPayload): Promise<IngestResponse> {
    return this.flush(payload)
  }

  /** Internal: send to /v1/ingest */
  async flush(payload: IngestPayload): Promise<IngestResponse> {
    const url = `${this.config.baseUrl}/v1/ingest`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (this.config.apiKey) {
      headers['X-Kairos-Key'] = this.config.apiKey
    }

    if (this.config.debug) {
      console.log('[kairos] flush', JSON.stringify(payload, null, 2))
    }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Kairos ingest failed: ${res.status} ${text}`)
      }
      return res.json() as Promise<IngestResponse>
    } catch (err) {
      if (this.config.debug) console.error('[kairos] error', err)
      // Never block the calling application
      return { workflowId: '', traceId: '', eventsIngested: 0, toolCallsIngested: 0 }
    }
  }
}

// ── Default Export ───────────────────────────────────────────────────────────

export function createKairos(config: KairosConfig = {}): KairosClient {
  return new KairosClient(config)
}

export type { KairosConfig, IngestPayload, IngestResponse, ToolCallPayload, EventPayload, EventType, WorkflowStatus }
