'use client'
import { useState } from 'react'

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  async function checkout(plan: string) {
    setLoading(plan)
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    })
    const { url } = await res.json()
    window.location.href = url
  }

  return (
    <main style={{ background: '#050606', minHeight: '100vh', color: '#f6f7f4', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
      <h1 style={{ fontSize: 48, fontWeight: 760, letterSpacing: '-0.05em', marginBottom: 12 }}>Simple pricing</h1>
      <p style={{ color: '#929995', marginBottom: 64, fontSize: 18 }}>Start free. Pay when you need more.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, maxWidth: 900, width: '100%' }}>
        {/* Free */}
        <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32 }}>
          <div style={{ fontSize: 13, color: '#929995', marginBottom: 8 }}>FREE</div>
          <div style={{ fontSize: 40, fontWeight: 700, marginBottom: 4 }}>£0</div>
          <div style={{ color: '#929995', marginBottom: 24, fontSize: 14 }}>Forever</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', color: '#c6cbc7', fontSize: 14, lineHeight: 2 }}>
            <li>✓ 500 events/month</li>
            <li>✓ 7-day replay history</li>
            <li>✓ 1 workflow</li>
            <li>✓ Python + TypeScript SDK</li>
          </ul>
          <a href="/app" style={{ display: 'block', textAlign: 'center', padding: '12px 24px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#f6f7f4', textDecoration: 'none', fontSize: 14 }}>
            Get started free
          </a>
        </div>

        {/* Pro */}
        <div style={{ border: '1px solid #9cffc7', borderRadius: 16, padding: 32, background: 'rgba(156,255,199,0.05)' }}>
          <div style={{ fontSize: 13, color: '#9cffc7', marginBottom: 8 }}>PRO</div>
          <div style={{ fontSize: 40, fontWeight: 700, marginBottom: 4 }}>£19</div>
          <div style={{ color: '#929995', marginBottom: 24, fontSize: 14 }}>/month</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', color: '#c6cbc7', fontSize: 14, lineHeight: 2 }}>
            <li>✓ Unlimited events</li>
            <li>✓ 30-day replay history</li>
            <li>✓ Unlimited workflows</li>
            <li>✓ Share replay links</li>
            <li>✓ Priority support</li>
          </ul>
          <button
            onClick={() => checkout('pro')}
            disabled={loading === 'pro'}
            style={{ width: '100%', padding: '12px 24px', background: '#9cffc7', color: '#050606', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            {loading === 'pro' ? 'Loading...' : 'Get Pro'}
          </button>
        </div>

        {/* Team */}
        <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32 }}>
          <div style={{ fontSize: 13, color: '#929995', marginBottom: 8 }}>TEAM</div>
          <div style={{ fontSize: 40, fontWeight: 700, marginBottom: 4 }}>£49</div>
          <div style={{ color: '#929995', marginBottom: 24, fontSize: 14 }}>/month</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', color: '#c6cbc7', fontSize: 14, lineHeight: 2 }}>
            <li>✓ Everything in Pro</li>
            <li>✓ 5 team members</li>
            <li>✓ 90-day replay history</li>
            <li>✓ Custom integrations</li>
            <li>✓ Dedicated support</li>
          </ul>
          <button
            onClick={() => checkout('team')}
            disabled={loading === 'team'}
            style={{ width: '100%', padding: '12px 24px', background: 'rgba(255,255,255,0.08)', color: '#f6f7f4', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            {loading === 'team' ? 'Loading...' : 'Get Team'}
          </button>
        </div>
      </div>
    </main>
  )
}
