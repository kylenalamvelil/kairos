'use client'

export function FounderButton() {
  return (
    <a
      href="mailto:kylenalamvelil@icloud.com?subject=Kairos%20Trace%20feedback&body=Hi%20Kyle%2C%0A%0AI%27m%20building%20with%20AI%20agents%20and%20wanted%20to%20talk%20about%20Kairos%20Trace.%0A%0A"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        background: '#18181b',
        border: '1px solid #3f3f46',
        color: '#e4e4e7',
        borderRadius: '8px',
        padding: '10px 16px',
        fontSize: '13px',
        fontFamily: 'inherit',
        fontWeight: 500,
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        transition: 'border-color 0.15s',
        letterSpacing: '0.01em',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = '#71717a')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = '#3f3f46')}
    >
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', flexShrink: 0, boxShadow: '0 0 6px #22c55e' }} />
      Talk to the founder
    </a>
  )
}
