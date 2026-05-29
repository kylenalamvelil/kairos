'use client'

import { useState } from 'react'

type Stage = 'idle' | 'open' | 'sent'

export function FeedbackWidget({ page }: { page: string }) {
  const [stage, setStage] = useState<Stage>('idle')
  const [text, setText] = useState('')
  const [rating, setRating] = useState<'helpful' | 'not_helpful' | null>(null)

  async function submit() {
    if (!text.trim() && !rating) return
    try {
      await fetch('https://kairos-production-64c5.up.railway.app/v1/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, rating, text, ts: new Date().toISOString() }),
      })
    } catch {
      // best effort — don't block the user
    }
    setStage('sent')
  }

  if (stage === 'sent') {
    return (
      <div className="mt-12 py-4 text-center text-xs text-[#4b5563] font-mono">
        Thanks — that helps a lot.
      </div>
    )
  }

  if (stage === 'idle') {
    return (
      <div className="mt-12 pt-8 border-t border-[#13161f] flex items-center gap-4">
        <span className="text-xs text-[#4b5563] font-mono">Was this helpful?</span>
        <button
          onClick={() => { setRating('helpful'); setStage('open') }}
          className="text-xs font-mono px-3 py-1 rounded border border-[#13161f] text-[#6b7280] hover:border-emerald-400/40 hover:text-emerald-400 transition-colors"
        >
          Yes
        </button>
        <button
          onClick={() => { setRating('not_helpful'); setStage('open') }}
          className="text-xs font-mono px-3 py-1 rounded border border-[#13161f] text-[#6b7280] hover:border-red-400/40 hover:text-red-400 transition-colors"
        >
          No
        </button>
        <button
          onClick={() => setStage('open')}
          className="text-xs font-mono text-[#4b5563] hover:text-[#6b7280] transition-colors ml-2"
        >
          Leave feedback →
        </button>
      </div>
    )
  }

  return (
    <div className="mt-12 pt-8 border-t border-[#13161f]">
      <p className="text-xs text-[#6b7280] font-mono mb-3">
        {rating === 'not_helpful'
          ? "What was confusing or missing?"
          : "Anything we should improve?"}
      </p>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type anything — even one sentence helps..."
        className="w-full bg-[#0d1017] border border-[#1e2232] rounded px-3 py-2 text-xs text-[#e8eaf0] font-mono placeholder-[#4b5563] focus:outline-none focus:border-[#1a56ff]/40 resize-none"
        rows={3}
        autoFocus
      />
      <div className="flex gap-2 mt-2">
        <button
          onClick={submit}
          className="text-xs font-mono px-4 py-1.5 rounded bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
        >
          Send
        </button>
        <button
          onClick={() => setStage('idle')}
          className="text-xs font-mono px-3 py-1.5 text-[#4b5563] hover:text-[#6b7280] transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
