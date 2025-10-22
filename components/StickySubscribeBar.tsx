"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaYoutube, FaTimes, FaBell } from 'react-icons/fa';
import { LINKS } from '@/lib/constants';
import { useYouTubeStats } from '@/lib/use-youtube-stats';

export default function StickySubscribeBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const stats = useYouTubeStats();

  useEffect(() => {
    // Show after 10 seconds of being on site
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10000);

    // Check if user has dismissed before
    const dismissed = localStorage.getItem('subscribe-bar-dismissed');
    if (dismissed) {
      setIsDismissed(true);
    }

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('subscribe-bar-dismissed', 'true');
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none"
        >
          <div className="container-custom pointer-events-auto">
            <div className="mb-4 mx-4">
              <div className="relative bg-gradient-to-r from-red-600 via-fire-orange to-red-600 rounded-xl shadow-fire-glow-lg overflow-hidden">
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{
                    x: ['-100%', '100%']
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                <div className="relative z-10 p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <FaYoutube className="w-8 h-8 text-white flex-shrink-0" />
                    </motion.div>
                    
                    <div className="flex-1">
                      <p className="text-white font-bold text-sm md:text-base">
                        🔥 Join {stats.formattedSubs}+ Warriors Getting Daily Truth Bombs
                      </p>
                      <p className="text-white/80 text-xs hidden sm:block">
                        Subscribe & turn on notifications • Never miss breaking news
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <motion.a
                      href={`${LINKS.youtube}?sub_confirmation=1`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white text-red-600 px-4 md:px-6 py-2 rounded-lg font-bold text-sm md:text-base whitespace-nowrap hover:bg-gray-100 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      SUBSCRIBE FREE
                    </motion.a>
                    
                    <button
                      onClick={handleDismiss}
                      className="text-white/60 hover:text-white transition-colors p-2"
                      aria-label="Dismiss"
                    >
                      <FaTimes className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
