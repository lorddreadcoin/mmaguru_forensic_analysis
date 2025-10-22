"use client";

import { motion } from "framer-motion";
import { FaYoutube, FaBell } from "react-icons/fa";
import { LINKS } from "@/lib/constants";
import { useYouTubeStats } from "@/lib/use-youtube-stats";

export default function SubscribeCTA() {
  const stats = useYouTubeStats();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="my-16 mx-4"
    >
      <div className="max-w-4xl mx-auto">
        <div className="card-cinematic relative overflow-hidden">
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-fire-orange/20 to-red-600/20"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 5, repeat: Infinity }}
            style={{ backgroundSize: '200% 100%' }}
          />
          
          <div className="relative z-10 p-8 md:p-12 text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block mb-4"
            >
              <FaYoutube className="w-16 h-16 text-red-600" />
            </motion.div>
            
            <h3 className="ot-council-title mb-4">
              Don't Miss a Single Drop
            </h3>
            
            <p className="text-xl text-ash-grey mb-8 max-w-2xl mx-auto">
              {stats.formattedSubs}+ warriors get unfiltered truth daily. Join the movement breaking through mainstream lies.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.a
                href={LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-fire px-8 py-4 ot-council-text uppercase tracking-wider inline-flex items-center gap-3 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaYoutube className="w-6 h-6" />
                <span>SUBSCRIBE NOW</span>
                <span className="text-2xl">→</span>
              </motion.a>
              
              <motion.a
                href={`${LINKS.youtube}?sub_confirmation=1`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-xl border-2 border-fire-orange text-white hover:bg-fire-orange/10 transition-all flex items-center gap-3 font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaBell className="w-5 h-5" />
                <span>TURN ON NOTIFICATIONS</span>
              </motion.a>
            </div>
            
            <p className="text-sm text-ash-grey/60 mt-6">
              New videos drop daily • Live streams weekly • Truth 24/7
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
