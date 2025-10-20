import React, { Suspense } from 'react'
import Hero from '@/components/Hero'
import About from '@/components/About'
import VideoCarousel from '@/components/VideoCarousel'
import LiveStreams from '@/components/LiveStreams'
import MostViral from '@/components/MostViral'
import ChannelNetwork from '@/components/ChannelNetwork'
import Sponsors from '@/components/Sponsors'
import PatreonMembership from '@/components/PatreonMembership'
import Footer from '@/components/Footer'
import FloatingCTA from '@/components/FloatingCTA'
import SubscribeCTA from '@/components/SubscribeCTA'
import InlineCTA from '@/components/InlineCTA'
import UrgentCTA from '@/components/UrgentCTA'
import WarriorPoll from '@/components/WarriorPoll'
import { fetchLatestVideosFromRSS } from '@/lib/youtube-public-fetch'

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold text-red-500 mb-4">Something went wrong</h2>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// Loading Component
function VideoLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-800 rounded-lg h-48 mb-4"></div>
          <div className="h-4 bg-gray-800 rounded mb-2"></div>
          <div className="h-3 bg-gray-800 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  )
}

// Import getFallbackVideos directly
async function getFallbackVideos() {
  const module = await import('@/lib/youtube-public-fetch')
  return (module as any).getFallbackVideos()
}

// Fetch latest videos with error handling
async function getLatestVideos() {
  try {
    const videos = await fetchLatestVideosFromRSS(6)
    return videos
  } catch (error) {
    console.error('Failed to fetch videos:', error)
    // Return fallback videos instead of throwing
    return await getFallbackVideos()
  }
}

export default async function Home() {
  // Fetch videos server-side to avoid client-side async issues
  const videos = await getLatestVideos()

  return (
    <main className="relative overflow-x-hidden">
      {/* Hero Section - Full Viewport */}
      <Hero />

      {/* Warriors Sound Off Poll - Prime Engagement Zone */}
      <section id="warrior-poll" className="relative py-16 bg-gradient-to-b from-black to-charcoal">
        <div className="container-custom max-w-4xl">
          <ErrorBoundary>
            <WarriorPoll />
          </ErrorBoundary>
        </div>
      </section>

      {/* Video Carousel Section - Latest Fire Content */}
      <ErrorBoundary fallback={<VideoLoadingSkeleton />}>
        <VideoCarousel videos={videos} />
      </ErrorBoundary>

      {/* Subscribe CTA - After Videos */}
      <section className="bg-dark-surface">
        <SubscribeCTA />
      </section>

      {/* About Section - Dark Surface Background */}
      <section id="about" className="bg-dark-surface">
        <About />
      </section>

      {/* Urgent CTA - After About */}
      <section className="bg-dark-surface">
        <UrgentCTA />
      </section>

      {/* Live Streams Section */}
      <section id="live" className="bg-dark-surface">
        <ErrorBoundary>
          <LiveStreams />
        </ErrorBoundary>
      </section>

      {/* Most Viral Videos Section */}
      <section id="viral" className="bg-dark-surface">
        <ErrorBoundary>
          <MostViral />
        </ErrorBoundary>
      </section>

      {/* Sponsors Section - Dark Surface Background */}
      <section id="sponsors" className="bg-dark-surface">
        <Sponsors />
      </section>

      {/* Channel Network Section */}
      <section id="channels" className="bg-dark-surface">
        <ChannelNetwork />
      </section>

      {/* YouTube Member Bridge CTA */}
      <section className="bg-dark-surface">
        <div className="max-w-7xl mx-auto px-4">
          <InlineCTA variant="member" />
        </div>
      </section>

      {/* Patreon Membership Section */}
      <section id="patreon" className="bg-dark-surface">
        <PatreonMembership />
      </section>

      {/* Footer */}
      <Footer />

      {/* Floating CTA Button */}
      <FloatingCTA />

      {/* Background Gradient Orbs for Visual Interest */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-fire-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-fire-secondary/10 rounded-full blur-3xl" />
      </div>
    </main>
  )
}
