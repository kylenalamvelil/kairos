/**
 * Kairos Quickstart — TypeScript
 *
 * npm install kairos-sdk
 * npx tsx quickstart.ts
 *
 * Then open: https://withkairos.dev/app
 */

import { createKairos } from 'kairos-sdk'

const kairos = createKairos()

console.log('Sending execution to Kairos...')

const exec = kairos.execution({ workflowName: 'research-agent' })

// Simulate a real agent run
exec.setPrompt('Research the EU AI Act and summarize key obligations for 2025.')
exec.setModel('claude-sonnet-4-6')

exec.toolCall({
  name: 'web_search',
  input: { query: 'EU AI Act 2025 obligations' },
  output: { results: ['EUR-Lex article', 'Linklaters summary', 'EU official FAQ'] },
  latencyMs: 1240,
})

exec.decision('EUR-Lex source is most authoritative', 0.93)

exec.toolCall({
  name: 'fetch_page',
  input: { url: 'https://eur-lex.europa.eu/...' },
  output: { content: 'The EU AI Act establishes...' },
  latencyMs: 870,
})

exec.memoryWrite('eu_act_summary', 'High-risk AI systems require conformity assessment...')
exec.setTokens(312, 840)
exec.setCost(0.0118)

await exec.complete('Summary: The EU AI Act requires high-risk AI providers to...')

console.log('Done.')
console.log('Open your dashboard: https://withkairos.dev/app')
console.log("You should see 'research-agent' in the execution list with full replay.")
