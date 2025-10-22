"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaYoutube, FaCheckCircle, FaCrown } from "react-icons/fa";
import { YOUTUBE_TIERS } from "@/lib/youtube-tiers";
import { useYouTubeStats } from '@/lib/use-youtube-stats';

const YouTubeTiers = () => {
  const stats = useYouTubeStats();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-obsidian to-charcoal">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center items-center gap-3 mb-4">
            <FaYoutube className="text-5xl text-red-600" />
          </div>
          <h2 className="font-display text-5xl lg:text-6xl text-fire-orange mb-4 uppercase tracking-wider">
            YouTube Memberships
          </h2>
          <p className="text-xl text-ash-grey font-heading uppercase">
            Join the Inner Circle • Support the Movement
          </p>
        </motion.div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {YOUTUBE_TIERS.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative"
            >
              <div className={`
                card-cinematic h-full flex flex-col
                ${tier.featured ? 'ring-2 ring-fire-orange shadow-fire-glow-lg' : ''}
                hover:shadow-fire-glow-lg transition-all hover:scale-105
              `}>
                {/* Featured Badge */}
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-fire-gradient px-4 py-1 rounded-full shadow-fire-glow">
                      <span className="text-xs font-bold text-white uppercase tracking-wide">
                        Most Popular
                      </span>
                    </div>
                  </div>
                )}

                {/* Tier Header */}
                <div className={`p-6 bg-gradient-to-r ${tier.color} rounded-t-xl`}>
                  <h3 className="text-2xl font-heading text-white mb-2">
                    {tier.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-display text-white">
                      {tier.priceFormatted}
                    </span>
                    <span className="text-white/80">/ month</span>
                  </div>
                </div>

                {/* Perks List */}
                <div className="p-6 flex-grow">
                  <ul className="space-y-4">
                    {tier.perks.map((perk, perkIndex) => (
                      <li key={perkIndex} className="flex items-start gap-3">
                        <FaCheckCircle className="text-green-500 flex-shrink-0 mt-1" />
                        <span className="text-ash-grey text-sm">
                          {perk}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Discord Role Info */}
                <div className="p-6 pt-0">
                  <div className="p-3 bg-black/30 rounded-lg border border-fire-orange/20">
                    <p className="text-xs text-ash-grey mb-1">Discord Role:</p>
                    <p className="text-sm font-bold text-fire-orange flex items-center gap-2">
                      <FaCrown className="text-yellow-500" />
                      {tier.discordRole}
                    </p>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="p-6 pt-0">
                  <a
                    href="https://www.youtube.com/channel/UCy30JRSgfhYXA6i6xX1erWg/join"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <button className={`
                      w-full py-3 px-6 rounded-lg font-bold transition-all
                      ${tier.featured 
                        ? 'bg-fire-gradient text-white hover:shadow-fire-glow' 
                        : 'bg-white text-black hover:bg-ash-grey'
                      }
                    `}>
                      Join {tier.name}
                    </button>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center">
            <div className="text-ash-grey">
              Already a member? 
            </div>
            <a
              href="/youtube-members"
              className="text-fire-orange hover:text-white transition-colors font-bold flex items-center gap-2"
            >
              Get Discord Access →
            </a>
          </div>
          
          {/* Stats */}
          <div className="mt-8 flex justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-display text-fire-orange">{stats.formattedSubs}+</div>
              <div className="text-xs text-ash-grey uppercase">Subscribers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-display text-fire-orange">🔥</div>
              <div className="text-xs text-ash-grey uppercase">The GOAT</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-display text-fire-orange">2,863</div>
              <div className="text-xs text-ash-grey uppercase">Videos</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default YouTubeTiers;
