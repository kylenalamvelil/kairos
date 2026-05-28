import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Michroma } from 'next/font/google'
import './globals.css'

const michroma = Michroma({ subsets: ['latin'], weight: '400', variable: '--font-michroma' })

export const metadata: Metadata = {
  title: 'Kairos — Operational Infrastructure for Autonomous Systems',
  description: 'Replay, govern, and control autonomous execution. The operational layer for AI agents, workflows, and autonomous systems.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${michroma.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
