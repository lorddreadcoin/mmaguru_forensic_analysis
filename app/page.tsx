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
import { fetchLatestVideosFromRSS, getFallbackVideos } from '@/lib/youtube-public-fetch'

// Fetch latest videos with error handling
async function getLatestVideos() {
  try {
    const videos = await fetchLatestVideosFromRSS(6)
    return videos
  } catch (error) {
    console.error('Failed to fetch videos:', error)
    // Return fallback videos instead of throwing
    return getFallbackVideos()
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
          <WarriorPoll />
        </div>
      </section>

      {/* Video Carousel Section - Latest Fire Content */}
      <VideoCarousel videos={videos} />

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
        <LiveStreams />
      </section>

      {/* Most Viral Videos Section */}
      <section id="viral" className="bg-dark-surface">
        <MostViral />
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
