'use client'

import { useState, useEffect } from 'react'
import { fetchRealYouTubeStats } from './youtube-fetcher'

interface YouTubeStats {
  subscriberCount: number
  viewCount: number
  videoCount: number
  formattedSubs: string
  formattedViews: string
  isLive: boolean
  isLoading: boolean
}

// Shared state across all components
let globalStats: YouTubeStats | null = null
let listeners: Set<(stats: YouTubeStats) => void> = new Set()

function notifyListeners(stats: YouTubeStats) {
  globalStats = stats
  listeners.forEach(listener => listener(stats))
}

// Format numbers for display
function formatNumber(num: number): string {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B'
  if (num >= 1000000) return (num / 1000000).toFixed(0) + 'M'
  if (num >= 1000) return Math.floor(num / 1000) + 'K'
  return num.toString()
}

// Fetch stats and update all listeners
async function fetchAndUpdateStats() {
  try {
    const stats = await fetchRealYouTubeStats()
    if (stats && stats.subscriberCount) {
      const newStats: YouTubeStats = {
        subscriberCount: stats.subscriberCount,
        viewCount: stats.viewCount,
        videoCount: stats.videoCount,
        formattedSubs: formatNumber(stats.subscriberCount),
        formattedViews: formatNumber(stats.viewCount),
        isLive: true,
        isLoading: false
      }
      notifyListeners(newStats)
    }
  } catch (error) {
    console.error('Failed to fetch YouTube stats:', error)
    // Keep existing stats but mark as not live
    if (globalStats) {
      notifyListeners({ ...globalStats, isLive: false })
    }
  }
}

// Start fetching if not already started
let fetchInterval: NodeJS.Timeout | null = null
function startFetching() {
  if (!fetchInterval) {
    fetchAndUpdateStats() // Initial fetch
    fetchInterval = setInterval(fetchAndUpdateStats, 60000) // Update every 60 seconds
  }
}

// Custom hook to use YouTube stats
export function useYouTubeStats(): YouTubeStats {
  const [stats, setStats] = useState<YouTubeStats>(
    globalStats || {
      subscriberCount: 520000, // Use latest known value
      viewCount: 112475413,
      videoCount: 2875,
      formattedSubs: '520K',
      formattedViews: '112M',
      isLive: false,
      isLoading: true
    }
  )

  useEffect(() => {
    // Start fetching when first component mounts
    startFetching()
    
    // Subscribe to updates
    listeners.add(setStats)
    
    // Set current global stats if available
    if (globalStats) {
      setStats(globalStats)
    }
    
    // Cleanup
    return () => {
      listeners.delete(setStats)
    }
  }, [])

  return stats
}
