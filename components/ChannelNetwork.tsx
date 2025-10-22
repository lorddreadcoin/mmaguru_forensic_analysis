"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaYoutube, FaTiktok, FaInstagram, FaTwitter } from "react-icons/fa";
import { LINKS } from "@/lib/constants";
import { fetchRealYouTubeStats } from "@/lib/youtube-fetcher";
import Image from "next/image";

const channels = [
  {
    name: "Jesse ON FIRE",
    description: "Main Channel - Black Belt Mic Skills 🥋",
    stats: "Loading stats...",
    url: LINKS.youtube,
    color: "from-fire-orange to-lava-red",
    icon: FaYoutube,
    logo: "/img/playwithmatches-logo.png",
    isPrimary: true
  },
  {
    name: "PLAY W MATCHES",
    description: "With Wife Gabi - Behind the Scenes",
    stats: "Growing Channel • Exclusive Content",
    url: LINKS.playWithMatches,
    color: "from-purple-600 to-pink-600",
    icon: FaYoutube,
    logo: "/img/jesse-hero.png"
  },
  {
    name: "Jesse On FIRE After Hours",
    description: "Late Night Content for the Real Ones",
    stats: "After Dark • Unfiltered",
    url: LINKS.afterHours,
    color: "from-blue-600 to-purple-600",
    icon: FaYoutube,
    logo: "/img/channel-afterhours.png"
  }
];

const socials = [
  { name: "Instagram", icon: FaInstagram, url: LINKS.instagram, color: "hover:text-pink-500" },
  { name: "Twitter/X", icon: FaTwitter, url: LINKS.twitter, color: "hover:text-blue-400" },
  { name: "TikTok", icon: FaTiktok, url: LINKS.tiktok || "", color: "hover:text-white" }
];

const ChannelNetwork = () => {
  const [stats, setStats] = useState({
    subscriberCount: 517000,
    viewCount: 111291695,
    videoCount: 2863,
    isLive: false
  });

  useEffect(() => {
    const fetchStats = async () => {
      const youtubeStats = await fetchRealYouTubeStats();
      if (youtubeStats) {
        setStats({
          subscriberCount: youtubeStats.subscriberCount,
          viewCount: youtubeStats.viewCount,
          videoCount: youtubeStats.videoCount,
          isLive: true
        });
      }
    };
    
    fetchStats();
    const interval = setInterval(fetchStats, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(0) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
  };

  const liveStatsText = stats.isLive 
    ? `${formatNumber(stats.subscriberCount)}+ Subscribers • ${formatNumber(stats.viewCount)}+ Views`
    : "Loading stats...";
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-charcoal to-obsidian">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="ot-council-title text-fire-orange mb-4">
            The Jesse Empire
          </h2>
          <p className="ot-council-text text-ash-grey">
            Multiple Channels • One Voice • Unfiltered Truth
          </p>
        </motion.div>

        {/* Channel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {channels.map((channel, index) => (
            <motion.a
              key={channel.name}
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <div 
                className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden transition-all duration-300
                  border-2 border-fire-orange/40 hover:border-fire-orange 
                  shadow-[0_0_15px_rgba(255,69,0,0.3)] hover:shadow-[0_0_30px_rgba(255,69,0,0.8)]
                  group-active:shadow-[0_0_40px_rgba(255,69,0,1),0_0_60px_rgba(255,69,0,0.6)]"
              >
                {/* Gradient Header with glow */}
                <div className={`h-3 bg-gradient-to-r ${channel.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" 
                       style={{ backgroundSize: '200% 100%', animation: 'shimmer 3s linear infinite' }} />
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-heading text-2xl text-white mb-1">
                        {channel.name}
                      </h3>
                      {channel.isPrimary && (
                        <span className="text-xs bg-fire-orange/20 text-fire-orange px-2 py-1 rounded-full font-bold uppercase">
                          Main Channel
                        </span>
                      )}
                    </div>
                  </div>
                  <div 
                    className={`bg-gradient-to-br ${channel.color} rounded-2xl p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-fire-glow-lg cursor-pointer border border-fire-orange/20`}
                    onClick={() => window.open(channel.url, '_blank')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/20">
                        <Image
                          src={channel.logo}
                          alt={channel.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </div>
                    
                    <p className="text-ash-grey mb-3">
                      {channel.description}
                    </p>
                    
                    <p className="text-sm text-ash-grey/70">
                      {channel.isPrimary ? liveStatsText : channel.stats}
                    </p>
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Social Links */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <p className="text-ash-grey mb-4 font-heading uppercase tracking-wide">
            Follow Everywhere
          </p>
          <div className="flex justify-center gap-6">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-ash-grey ${social.color} transition-all hover:scale-110`}
                aria-label={social.name}
              >
                <social.icon className="w-8 h-8" />
              </a>
            ))}
          </div>
          
          {/* Stats Summary - REAL TIME */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <motion.div 
              className="bg-black/30 rounded-lg p-4 backdrop-blur-sm border border-fire-orange/20"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-2xl font-display text-fire-orange">
                {formatNumber(stats.subscriberCount)}+
                {stats.isLive && <span className="text-xs ml-1 text-green-500">LIVE</span>}
              </div>
              <div className="text-xs text-ash-grey uppercase">Subscribers</div>
            </motion.div>
            <motion.div 
              className="bg-black/30 rounded-lg p-4 backdrop-blur-sm border border-fire-orange/20"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h3 className="ot-council-heading text-white mb-2 group-hover:text-fire-orange transition-colors">{stats.videoCount.toLocaleString()}</h3>
              <div className="text-xs text-ash-grey uppercase">Videos</div>
            </motion.div>
            <motion.div 
              className="bg-black/30 rounded-lg p-4 backdrop-blur-sm border border-fire-orange/20"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="text-2xl font-display text-fire-orange">{formatNumber(stats.viewCount)}+</div>
              <div className="text-xs text-ash-grey uppercase">Total Views</div>
            </motion.div>
            <motion.div 
              className="bg-black/30 rounded-lg p-4 backdrop-blur-sm border border-fire-orange/20"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="text-2xl font-display text-fire-orange">🔥</div>
              <div className="text-xs text-ash-grey uppercase">The GOAT</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ChannelNetwork;
