'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { BIO } from '@/lib/constants'
import Card from './ui/Card'
import ElectricalBackground from './ElectricalBackground'
import { useYouTubeStats } from '@/lib/use-youtube-stats'

export default function About() {
  const stats = useYouTubeStats()
  
  return (
    <section id="about" className="relative py-20 overflow-hidden bg-black">
      {/* NEW: Electrical background with lightning */}
      <ElectricalBackground />

      {/* Darkening overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT COLUMN: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Header */}
            <div>
              <motion.div
                className="inline-block mb-4"
                animate={{
                  textShadow: [
                    '0 0 20px rgba(255, 69, 0, 0.3)',
                    '0 0 40px rgba(255, 69, 0, 0.6)',
                    '0 0 20px rgba(255, 69, 0, 0.3)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fire-orange via-yellow-500 to-lava-red">
                  BLACK BELT
                </h2>
                <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fire-orange via-yellow-500 to-lava-red">
                  MIC SKILLS
                </h2>
              </motion.div>
              <p className="text-2xl font-bold text-lava-red">
                Undefeated on the Mic
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="text-center p-6 bg-black/60 backdrop-blur-sm border-fire-orange/30">
                <motion.div 
                  className="text-4xl font-black text-fire-orange mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", delay: 0.2 }}
                >
                  {stats.isLoading ? 'Loading...' : `${stats.formattedSubs}+`}
                </motion.div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">Warriors</div>
              </Card>

              <Card className="text-center p-6 bg-black/60 backdrop-blur-sm border-fire-orange/30">
                <motion.div 
                  className="text-4xl font-black text-fire-orange mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", delay: 0.3 }}
                >
                  {stats.isLoading ? 'Loading...' : `${stats.formattedViews}+`}
                </motion.div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">Views</div>
              </Card>
            </div>

            {/* Bio Text */}
            <div className="space-y-4 text-lg text-gray-300 leading-relaxed">
              <p>
                Jesse ON FIRE is the <span className="text-fire-orange font-bold">YOUTUBE GOAT on the mic</span>. With {stats.subscriberCount.toLocaleString()}+ subscribers and {stats.viewCount.toLocaleString()} views, this political analyst has been exposing truth with black belt precision.
              </p>
              <p>
                Unfiltered. Uncensored. Undefeated.
              </p>
              <p className="text-base text-gray-400">
                With {stats.videoCount.toLocaleString()} videos and counting, Jesse drops content daily on everything from political conspiracies to MMA breakdowns. Running multiple channels including PLAY W MATCHES with wife Gabi and Jesse On FIRE After Hours for the real ones.
              </p>
              <p className="text-base text-gray-400">
                Whether he's exposing government corruption, breaking down UFC politics, or going OFF THE RAILS on his latest investigation, Jesse delivers what his army demands: pure, unfiltered truth that makes the establishment panic.
              </p>
            </div>

            {/* Pull Quote */}
            <motion.div
              className="relative pl-6 border-l-4 border-fire-orange py-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <p className="text-2xl font-bold italic text-fire-orange">
                "517,000 Warriors Strong. The Voice They Can't Silence."
              </p>
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN: Fire Mic Visual */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Main mic image with enhanced effects */}
            <div className="relative">
              {/* Enhanced glow layers for blending */}
              <div className="absolute -inset-8 bg-gradient-to-br from-blue-500/20 via-purple-600/10 to-fire-orange/20 blur-3xl animate-pulse" />
              
              <div className="absolute -inset-4 bg-gradient-to-t from-fire-orange/40 via-transparent to-blue-500/20 blur-2xl" />
              
              {/* Edge fade effect to blend with background */}
              <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/80 pointer-events-none" />
              
              {/* The mic image */}
              <div className="relative rounded-2xl overflow-hidden border border-fire-orange/30">
                <Image
                  src="/images/fire-mic.jpg"
                  alt="Jesse ON FIRE Microphone"
                  width={800}
                  height={1200}
                  className="w-full h-auto"
                  style={{ 
                    mixBlendMode: 'lighten'
                  }}
                  priority
                />
                
                {/* Gradient overlay for edge blending */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                
                {/* Animated scanlines */}
                <motion.div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,69,0,0.3) 2px, rgba(255,69,0,0.3) 4px)'
                  }}
                  animate={{ y: [0, 20, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Electrical connection lines from mic to background */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <motion.path
                    d="M 50 20 Q 80 40, 95 30"
                    stroke="rgba(59, 130, 246, 0.4)"
                    strokeWidth="2"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ 
                      pathLength: [0, 1, 0],
                      opacity: [0, 0.6, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  />
                </svg>
              </div>

              {/* Electric arcs effect */}
              <div className="absolute top-1/4 right-0 w-32 h-32 pointer-events-none">
                <motion.div
                  className="w-full h-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)',
                    filter: 'blur(10px)'
                  }}
                  animate={{
                    opacity: [0.2, 0.6, 0.2],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>

              {/* Fire embers floating */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-fire-orange rounded-full"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: '50%'
                  }}
                  animate={{
                    y: [-20, -100],
                    opacity: [1, 0],
                    scale: [1, 0]
                  }}
                  transition={{
                    duration: 2 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                />
              ))}
            </div>

            {/* Bottom text */}
            <motion.p
              className="text-center mt-6 text-fire-orange font-bold text-xl"
              animate={{
                textShadow: [
                  '0 0 10px rgba(255, 69, 0, 0.5)',
                  '0 0 20px rgba(255, 69, 0, 0.8)',
                  '0 0 10px rgba(255, 69, 0, 0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              SPITTING FIRE DAILY 🔥
            </motion.p>
          </motion.div>

        </div>
      </div>

      {/* Add keyframe animation to globals.css */}
      <style jsx global>{`
        @keyframes gridPulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </section>
  )
}
