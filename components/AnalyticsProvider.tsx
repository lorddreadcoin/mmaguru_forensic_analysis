'use client'

import { useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { GoogleAnalytics } from '@next/third-parties/google'
import LogRocket from 'logrocket'
import posthog from 'posthog-js'
import mixpanel from 'mixpanel-browser'

// Initialize all analytics services
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize LogRocket (Session Recording)
    if (process.env.NEXT_PUBLIC_LOGROCKET_APP_ID) {
      LogRocket.init(process.env.NEXT_PUBLIC_LOGROCKET_APP_ID)
    }

    // Initialize PostHog (Product Analytics)
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_HOST) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        capture_pageview: true,
        capture_pageleave: true,
        autocapture: true,
      })
    }

    // Initialize Mixpanel (User Analytics)
    if (process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
      mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN, {
        debug: process.env.NODE_ENV === 'development',
        track_pageview: true,
        persistence: 'localStorage',
      })
    }

    // Track page views
    if (typeof window !== 'undefined') {
      // Track initial page view
      trackPageView()

      // Track route changes
      const handleRouteChange = () => trackPageView()
      window.addEventListener('popstate', handleRouteChange)
      
      return () => {
        window.removeEventListener('popstate', handleRouteChange)
      }
    }
  }, [])

  const trackPageView = () => {
    // PostHog page view (auto-captured)
    
    // Mixpanel page view
    if (process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
      mixpanel.track('Page View', {
        page: window.location.pathname,
        referrer: document.referrer,
        url: window.location.href,
      })
    }

    // LogRocket page view
    if (process.env.NEXT_PUBLIC_LOGROCKET_APP_ID) {
      LogRocket.track('Page View')
    }
  }

  return (
    <>
      {children}
      {/* Vercel Analytics */}
      <Analytics />
      
      {/* Google Analytics 4 */}
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      )}
    </>
  )
}

// Export tracking functions for custom events
export const trackEvent = (eventName: string, properties?: any) => {
  // Google Analytics event (via gtag)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, properties)
  }

  // PostHog event
  if (typeof posthog !== 'undefined') {
    posthog.capture(eventName, properties)
  }

  // Mixpanel event
  if (typeof mixpanel !== 'undefined' && process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
    mixpanel.track(eventName, properties)
  }

  // LogRocket event
  if (typeof LogRocket !== 'undefined' && process.env.NEXT_PUBLIC_LOGROCKET_APP_ID) {
    LogRocket.track(eventName, properties)
  }
}

// Track user identification
export const identifyUser = (userId: string, traits?: any) => {
  // LogRocket
  if (typeof LogRocket !== 'undefined' && process.env.NEXT_PUBLIC_LOGROCKET_APP_ID) {
    LogRocket.identify(userId, traits)
  }

  // PostHog
  if (typeof posthog !== 'undefined') {
    posthog.identify(userId, traits)
  }

  // Mixpanel
  if (typeof mixpanel !== 'undefined' && process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
    mixpanel.identify(userId)
    if (traits) {
      mixpanel.people.set(traits)
    }
  }
}
