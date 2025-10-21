'use client'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { SITE_CONFIG, LINKS, TAGLINES } from '@/lib/constants'
import EnhancedFireParticles from './EnhancedFireParticles'
import FloorFlames from './FloorFlames'
import OctagonGrid from './OctagonGrid'
import LiveCounter from './LiveCounter'

export default function Hero() {
  // Ultra-lightweight cursor glow with RAF
  useEffect(() => {
    let rafId: number
    let currentX = 0
    let currentY = 0
    
    const handleMouseMove = (e: MouseEvent) => {
      currentX = e.clientX
      currentY = e.clientY
      
      // Cancel previous frame if it hasn't run yet
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
      
      // Schedule update on next frame
      rafId = requestAnimationFrame(() => {
        const glow = document.getElementById('cursor-glow')
        if (glow) {
          glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`
        }
      })
    }
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* Layer 1: Animated gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-red-950/20 to-black" />
      
      {/* Layer 2: Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}
      />
      
      {/* Layer 3: Radial spotlight effect */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,69,0,0.15) 0%, transparent 70%)'
        }}
      />
      
      {/* Layer 4: Enhanced fire particles with parallax */}
      <EnhancedFireParticles />
      
      {/* Layer 5: Octagon grid */}
      <OctagonGrid />
      
      {/* Layer 6: Floor flames */}
      <FloorFlames />
      
      {/* Live counter */}
      <LiveCounter />
      
      {/* Main content */}
      <div className="relative z-10 container-custom text-center px-4">
        {/* Jesse ON FIRE Logo */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <img 
            src="/jof-logo.png" 
            alt="Jesse ON FIRE Logo"
            className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 object-contain"
            style={{
              filter: 'drop-shadow(0 0 30px rgba(255,69,0,0.6))'
            }}
          />
        </motion.div>

        {/* Main Title with fire animation */}
        <motion.h1 
          className="text-[clamp(4rem,12vw,10rem)] font-council leading-none mb-6 relative"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          style={{ fontWeight: 700 }}
        >
          <span 
            className="relative inline-block text-[clamp(4rem,15vw,12rem)]"
            style={{
              fontFamily: "'Council', 'OT Council', 'Carnivalee Freakshow', 'Old English Text MT', serif",
              fontWeight: 700,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              // Exact YouTube thumbnail style - medieval/blackletter aesthetic
              color: '#FFEB00',
              WebkitTextStroke: '10px #000000',
              paintOrder: 'stroke fill',
              textShadow: '6px 6px 0px rgba(0,0,0,0.8)',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0) scaleY(1.2)',
              willChange: 'transform'
            }}
          >
            JESSE ON FIRE
          </span>
          
          {/* Glowing outline */}
          <span 
            className="absolute inset-0 blur-xl opacity-60 pointer-events-none"
            aria-hidden="true"
            style={{
              fontFamily: "'Council', 'OT Council', 'Carnivalee Freakshow', 'Old English Text MT', serif",
              fontWeight: 700,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: '#FFEB00',
              transform: 'translateZ(0) scaleY(1.2)'
            }}
          >
            JESSE ON FIRE
          </span>
        </motion.h1>

        {/* Hero tagline - The GOAT */}
        <motion.p
          className="text-[clamp(1.2rem,4vw,2rem)] font-council font-bold mb-4 text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {TAGLINES.hero}
        </motion.p>

        {/* Tagline with pulsing effect */}
        <motion.div
          className="relative text-[clamp(1.5rem,5vw,3rem)] font-council font-bold mb-8"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            textShadow: [
              '0 0 20px rgba(255,69,0,0.3)',
              '0 0 40px rgba(255,69,0,0.6)',
              '0 0 20px rgba(255,69,0,0.3)'
            ]
          }}
          transition={{ 
            opacity: { delay: 0.3, duration: 0.5 },
            textShadow: { duration: 2, repeat: Infinity }
          }}
        >
          <span className="text-fire-orange">UNCENSORED.</span>
          {' '}
          <span className="text-lava-red">UNFILTERED.</span>
          {' '}
          <span className="text-yellow-500">UNDEFEATED.</span>
        </motion.div>

        {/* Description */}
        <motion.p
          className="text-[clamp(1rem,3vw,1.5rem)] text-gray-300 mb-12 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {SITE_CONFIG.description}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-wrap justify-center gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {/* Primary CTA - Animated glow */}
          <motion.a
            href={LINKS.patreon}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-10 py-5 text-xl font-council font-bold rounded-xl overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-fire-orange via-red-600 to-fire-orange"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ backgroundSize: '200% 100%' }}
            />
            
            {/* Glow effect */}
            <div className="absolute inset-0 blur-xl opacity-50 group-hover:opacity-100 transition-opacity bg-fire-orange" />
            
            <span className="relative z-10 flex items-center gap-3 text-white">
              🔥 JOIN THE PATREON
            </span>
          </motion.a>

          {/* YouTube button */}
          <motion.a
            href={LINKS.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-5 text-xl font-council font-bold text-gray-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            📺 WATCH ON YOUTUBE
          </motion.a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-2 text-gray-500">
          <span className="text-sm uppercase tracking-widest">Scroll to explore</span>
          <svg 
            className="w-6 h-6"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </motion.div>

      {/* Cursor glow */}
      <div 
        id="cursor-glow"
        className="fixed w-64 h-64 pointer-events-none opacity-10 blur-2xl bg-fire-orange rounded-full mix-blend-screen hidden md:block"
        style={{ 
          zIndex: 9999,
          willChange: 'transform' // GPU acceleration
        }}
      />
    </section>
  )
}
