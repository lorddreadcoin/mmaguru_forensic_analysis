'use client'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { fetchRealYouTubeStats } from '@/lib/youtube-fetcher'

export default function LiveCounter() {
  const [currentCount, setCurrentCount] = useState(517000);
  const [previousCount, setPreviousCount] = useState(517000);
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch real YouTube stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await fetchRealYouTubeStats();
        if (stats && stats.subscriberCount) {
          // Store previous count for daily growth calculation
          if (currentCount !== stats.subscriberCount) {
            setPreviousCount(currentCount);
          }
          setCurrentCount(stats.subscriberCount);
          setIsLive(true);
          setIsLoading(false);
          
          // Store in localStorage for daily growth tracking
          const today = new Date().toDateString();
          const stored = localStorage.getItem('jesse_daily_stats');
          if (stored) {
            const data = JSON.parse(stored);
            if (data.date !== today) {
              // New day, reset the starting count
              localStorage.setItem('jesse_daily_stats', JSON.stringify({
                date: today,
                startCount: stats.subscriberCount,
                currentCount: stats.subscriberCount
              }));
            } else {
              // Same day, update current count
              data.currentCount = stats.subscriberCount;
              localStorage.setItem('jesse_daily_stats', JSON.stringify(data));
            }
          } else {
            // First time
            localStorage.setItem('jesse_daily_stats', JSON.stringify({
              date: today,
              startCount: stats.subscriberCount,
              currentCount: stats.subscriberCount
            }));
          }
        }
      } catch (error) {
        console.error('Failed to fetch YouTube stats:', error);
        setIsLoading(false);
      }
    };
    
    // Initial fetch
    fetchStats();
    
    // Refresh every 60 seconds
    const interval = setInterval(fetchStats, 60000);
    
    return () => clearInterval(interval);
  }, [currentCount]);
  
  const formatCount = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${Math.floor(num / 1000)}K`;
    return num.toString();
  };
  
  // Calculate daily growth from localStorage
  const getDailyGrowth = () => {
    const stored = localStorage.getItem('jesse_daily_stats');
    if (stored) {
      const data = JSON.parse(stored);
      const growth = data.currentCount - data.startCount;
      return growth > 0 ? growth : 0;
    }
    return 0;
  };
  
  const dailyGrowth = getDailyGrowth();
  const progressPercent = (currentCount / 1000000) * 100;
  
  return (
    <motion.div
      className="absolute top-8 left-8 bg-black/80 backdrop-blur-md border border-fire-orange/30 rounded-lg p-4 z-20"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
    >
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 ${isLive ? 'bg-red-500' : 'bg-gray-500'} rounded-full ${isLive ? 'animate-pulse' : ''}`} />
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-wide">
            YouTube Warriors {isLive && <span className="text-green-400 text-[10px] ml-1">LIVE</span>}
          </div>
          <div className="text-2xl font-black text-fire-orange">
            {isLoading ? (
              <span className="text-gray-400">Loading...</span>
            ) : (
              <>
                {formatCount(currentCount)}+ 
                {dailyGrowth > 0 && (
                  <span className="text-xs text-green-400">+{dailyGrowth.toLocaleString()} TODAY</span>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-fire-orange to-red-600"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 2, delay: 1.5 }}
        />
      </div>
      <div className="text-xs text-gray-500 mt-1">Road to 1M Warriors • {(1000000 - currentCount).toLocaleString()} to go</div>
    </motion.div>
  )
}
