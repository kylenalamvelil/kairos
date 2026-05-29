import type { Metadata } from 'next'
import { Sora, IBM_Plex_Sans, IBM_Plex_Mono, Michroma } from 'next/font/google'
import './globals.css'

const sora       = Sora({ subsets: ['latin'], weight: ['400','500','600'], variable: '--font-sora' })
const ibmSans    = IBM_Plex_Sans({ subsets: ['latin'], weight: ['300','400','500'], variable: '--font-sans' })
const ibmMono    = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400','500'], variable: '--font-mono' })
const michroma   = Michroma({ subsets: ['latin'], weight: '400', variable: '--font-michroma' })

export const metadata: Metadata = {
  title: 'Kairos — Operational Infrastructure for Autonomous Systems',
  description: 'The operational memory layer for autonomous systems. Replay, govern, and control autonomous execution at any scale.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${ibmSans.variable} ${ibmMono.variable} ${michroma.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
