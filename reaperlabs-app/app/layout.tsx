import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ReaperLabs.AI - Elite YouTube Analytics Platform',
  description: 'AI-powered YouTube channel analytics with Grok 4 Fast. Get viral insights, content strategy, and revenue optimization powered by advanced AI.',
  keywords: ['YouTube Analytics', 'AI Analytics', 'YouTube Growth', 'Video Analytics', 'Creator Tools', 'ReaperLabs'],
  authors: [{ name: 'ReaperLabs' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://reaperlabsai-analytics.netlify.app',
    siteName: 'ReaperLabs.AI',
    title: 'ReaperLabs.AI - Elite YouTube Analytics Platform',
    description: 'AI-powered YouTube channel analytics with Grok 4 Fast. Get viral insights, content strategy, and revenue optimization.',
    images: [
      {
        url: '/logo-large.png',
        width: 1200,
        height: 630,
        alt: 'ReaperLabs.AI Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ReaperLabs.AI - Elite YouTube Analytics',
    description: 'AI-powered YouTube analytics with Grok 4 Fast',
    images: ['/logo-large.png'],
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
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
