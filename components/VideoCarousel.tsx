"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaPlay, FaFire, FaClock } from 'react-icons/fa';

export interface VideoData {
  id: number;
  title: string;
  thumbnail: string;
  views: string;
  duration: string;
  uploadDate: string;
  url: string;
  category: string;
  isNew?: boolean;
}

interface VideoCarouselProps {
  videos: VideoData[];
}

export default function VideoCarousel({ videos }: VideoCarouselProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const handleVideoClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const topVideo = videos[0];
  const gridVideos = videos.slice(1);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-charcoal to-obsidian">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="ot-council-title text-fire-orange mb-4">
            🔥 Latest Drops 🔥
          </h2>
          <p className="ot-council-text text-ash-grey">
            Most Recent Uploads
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* #1 Latest Video - Featured Large */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              {/* #1 Badge */}
              <div className="absolute -top-4 left-4 z-20 bg-fire-gradient px-6 py-2 rounded-full shadow-fire-glow">
                <span className="text-white font-bold uppercase text-sm">🔥 #1 Latest</span>
              </div>

              {/* View Count Badge */}
              <div className="absolute -top-4 right-4 z-20 bg-black/90 px-6 py-2 rounded-full border-2 border-fire-orange">
                <span className="text-fire-orange font-bold flex items-center gap-2">
                  <FaFire /> {topVideo.views}
                </span>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={() => handleVideoClick(topVideo.url)}
                className="cursor-pointer group"
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-fire-orange/50 group-hover:border-fire-orange transition-all duration-300">
                  <Image
                    src={topVideo.thumbnail}
                    alt={topVideo.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    unoptimized
                    priority
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 90 }}
                      transition={{ type: "spring", stiffness: 400 }}
                      className="bg-fire-orange rounded-full p-8 shadow-fire-glow-lg"
                    >
                      <FaPlay className="text-white text-5xl ml-2" />
                    </motion.div>
                  </div>
                  
                  {/* Duration Badge */}
                  <div className="absolute top-6 right-6 bg-black/90 px-4 py-2 rounded-lg flex items-center gap-2 border border-fire-orange/30">
                    <FaClock className="text-fire-orange" />
                    <span className="text-white font-bold text-lg">{topVideo.duration}</span>
                  </div>
                  
                  {/* New Badge */}
                  {topVideo.isNew && (
                    <div className="absolute top-6 left-6 bg-fire-gradient px-5 py-2 rounded-full animate-pulse">
                      <span className="text-white font-bold uppercase">🔥 NEW</span>
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute bottom-32 left-6 bg-fire-orange px-5 py-2 rounded-lg">
                    <span className="text-white font-bold uppercase font-council">{topVideo.category}</span>
                  </div>
                  
                  {/* Video Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black to-transparent">
                    <h3 className="ot-council-heading text-white line-clamp-2 group-hover:text-fire-orange transition-colors">
                      {topVideo.title}
                    </h3>
                    <div className="flex items-center gap-4 text-ash-grey text-lg">
                      <span>{topVideo.uploadDate}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Grid of Other Videos - 5 Videos Centered */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {gridVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  z: 50,
                  transition: { type: "spring", stiffness: 300 }
                }}
                style={{ perspective: 1000 }}
                onMouseEnter={() => setHoveredId(video.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleVideoClick(video.url)}
                className="cursor-pointer group"
              >
                <div className="relative">
                  {/* Rank Badge */}
                  <div className="absolute -top-2 -left-2 z-10 bg-fire-gradient w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                    <span className="text-white font-bold text-sm">#{index + 2}</span>
                  </div>

                  <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg border-2 border-fire-orange/20 group-hover:border-fire-orange transition-all duration-300">
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      unoptimized
                    />
                    
                    {/* Overlay */}
                    <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity ${hoveredId === video.id ? 'opacity-100' : 'opacity-0'}`}>
                      <div className="bg-fire-orange rounded-full p-3">
                        <FaPlay className="text-white text-xl ml-1" />
                      </div>
                    </div>
                    
                    {/* Duration */}
                    <div className="absolute bottom-2 right-2 bg-black/90 px-2 py-1 rounded text-xs text-white font-bold">
                      {video.duration}
                    </div>

                    {/* New Badge */}
                    {video.isNew && (
                      <div className="absolute top-2 left-2 bg-fire-gradient px-2 py-1 rounded-full">
                        <span className="text-white font-bold text-xs">NEW</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Title */}
                  <h4 className="mt-2 ot-council-text text-white line-clamp-2 group-hover:text-fire-orange transition-colors">
                    {video.title}
                  </h4>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-2 mt-1 text-xs text-ash-grey">
                    <span className="flex items-center gap-1">
                      <FaFire className="text-fire-orange" />
                      {video.views}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
