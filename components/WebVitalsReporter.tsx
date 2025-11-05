'use client'

import { useEffect } from 'react'
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals'
import { trackEvent } from './AnalyticsProvider'

export function WebVitalsReporter() {
  useEffect(() => {
    // Report Core Web Vitals to all analytics services
    const reportWebVital = ({ name, value, rating }: any) => {
      // Send to analytics
      trackEvent('Web Vital', {
        metric: name,
        value: Math.round(name === 'CLS' ? value * 1000 : value),
        rating,
      })

      // Log in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Web Vital] ${name}: ${value} (${rating})`)
      }

      // Send to Vercel Analytics (automatic with Speed Insights)
      // Send to custom endpoint if needed
      if (process.env.NEXT_PUBLIC_VITALS_ENDPOINT) {
        fetch(process.env.NEXT_PUBLIC_VITALS_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, value, rating }),
        }).catch(() => {}) // Fail silently
      }
    }

    // Register all Web Vitals
    onCLS(reportWebVital)
    onFCP(reportWebVital)
    onINP(reportWebVital)
    onLCP(reportWebVital)
    onTTFB(reportWebVital)
  }, [])

  return null
}
