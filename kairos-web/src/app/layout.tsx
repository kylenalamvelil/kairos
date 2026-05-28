import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Michroma } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })
const michroma = Michroma({ subsets: ['latin'], weight: '400', variable: '--font-michroma' })

export const metadata: Metadata = {
  title: 'Kairos — Operational Infrastructure for Autonomous Systems',
  description: 'Replay, govern, and control autonomous execution. The operational layer for AI agents, workflows, and autonomous systems.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} ${michroma.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
