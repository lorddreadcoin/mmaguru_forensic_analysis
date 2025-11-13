import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ReaperLabs - YouTube Analytics AI',
  description: 'AI-powered YouTube channel growth insights',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
