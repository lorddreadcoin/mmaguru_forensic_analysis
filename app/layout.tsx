import type { Metadata } from 'next'
import { Inter, Bebas_Neue, Anton, Playfair_Display, Oswald } from 'next/font/google'
import './globals.css'
import FlameCursor from '@/components/FlameCursor'
import FireScroll from '@/components/FireScroll'
import StickySubscribeBar from '@/components/StickySubscribeBar'

// Jesse ON FIRE - Cinematic Typography
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const bebasNeue = Bebas_Neue({ 
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bebas',
})

const anton = Anton({ 
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-anton',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  style: ['normal', 'italic'],
})

const oswald = Oswald({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-oswald',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Jesse ON FIRE | Uncensored Truth & Commentary',
  description: 'Political analyst. MMA lifer. Truth speaker. Black Belt on the mat & the mic. Join 516K+ subscribers for uncensored commentary on politics, conspiracies, and culture.',
  keywords: ['Jesse ON FIRE', 'political commentary', 'MMA analysis', 'conspiracy theories', 'independent media', 'uncensored content'],
  authors: [{ name: 'Jesse ON FIRE' }],
  creator: 'Jesse ON FIRE',
  publisher: 'Jesse ON FIRE',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://jesseonfire.com',
    title: 'Jesse ON FIRE | Uncensored Truth & Commentary',
    description: 'Political analyst. MMA lifer. Black Belt on the mat & the mic.',
    siteName: 'Jesse ON FIRE',
    images: [
      {
        url: 'https://jesseonfire.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Jesse ON FIRE',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jesse ON FIRE | Uncensored Truth & Commentary',
    description: 'Political analyst. MMA lifer. Black Belt on the mat & the mic.',
    creator: '@realjesseonfire',
    images: ['https://jesseonfire.com/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  metadataBase: new URL('https://jesseonfire.com'),
  alternates: {
    canonical: '/',
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${bebasNeue.variable} ${anton.variable} ${playfair.variable} ${oswald.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://db.onlinewebfonts.com/c/7bb6bf59a33b5be38c685d9c895cb4f0?family=Council" rel="stylesheet" type="text/css"/>
        <meta name="theme-color" content="#FF5A1F" />
      </head>
      <body className="min-h-screen font-sans bg-obsidian text-ash-grey">
        <FireScroll />
        <FlameCursor />
        <StickySubscribeBar />
        {children}
      </body>
    </html>
  )
}
