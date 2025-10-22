"use client";

import { motion } from "framer-motion";
import { FaFire, FaDiscord, FaYoutube, FaPatreon, FaUsers } from "react-icons/fa";
import { LINKS } from "@/lib/constants";
import { useYouTubeStats } from "@/lib/use-youtube-stats";

interface InlineCTAProps {
  variant?: 'patreon' | 'discord' | 'youtube' | 'member';
  className?: string;
}

export default function InlineCTA({ variant = 'youtube', className = '' }: InlineCTAProps) {
  const stats = useYouTubeStats();
  const configs = {
    patreon: {
      icon: FaFire,
      title: "Ready to Join the Inner Circle?",
      description: "Get exclusive content, early access, and support the truth.",
      buttonText: "Become a Patron",
      buttonIcon: "🔥",
      link: LINKS.patreon,
      gradient: "from-fire-orange via-red-600 to-orange-600"
    },
    discord: {
      icon: FaDiscord,
      title: "Want Discord Access?",
      description: "Join Patreon and get instant Discord access + exclusive content automatically.",
      buttonText: "Join on Patreon",
      buttonIcon: "🔥",
      link: LINKS.patreon,
      gradient: "from-fire-orange via-red-600 to-fire-orange"
    },
    youtube: {
      icon: FaYoutube,
      title: `${stats.formattedSubs}+ Warriors Can't Be Wrong`,
      description: "Subscribe for daily truth bombs and live coverage of breaking news.",
      buttonText: "Subscribe Now",
      buttonIcon: "📺",
      link: LINKS.youtube,
      gradient: "from-red-600 via-red-700 to-red-600"
    },
    member: {
      icon: FaFire,
      title: "Already a YouTube Member?",
      description: "Link your membership and get instant Discord access - no double payment!",
      buttonText: "Link Membership",
      buttonIcon: "🔗",
      link: "/youtube-members",
      gradient: "from-purple-600 via-pink-600 to-purple-600"
    }
  };

  const config = configs[variant];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={`my-12 ${className}`}
    >
      <div className="relative overflow-hidden rounded-2xl border border-fire-orange/20">
        {/* Animated background */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-10`}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{ duration: 8, repeat: Infinity }}
          style={{ backgroundSize: '200% 100%' }}
        />
        
        <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
          {/* Icon */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="flex-shrink-0"
          >
            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-fire-glow`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          
          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <h4 className="font-heading text-2xl text-white mb-2 uppercase">
              {config.title}
            </h4>
            <p className="text-ash-grey">
              {config.description}
            </p>
          </div>
          
          {/* CTA Button */}
          <motion.a
            href={config.link}
            target={config.link.startsWith('http') ? "_blank" : undefined}
            rel={config.link.startsWith('http') ? "noopener noreferrer" : undefined}
            className={`flex-shrink-0 bg-gradient-to-r ${config.gradient} text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-fire-glow hover:shadow-fire-glow-lg transition-all whitespace-nowrap`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{config.buttonIcon}</span>
            <span>{config.buttonText}</span>
            <span className="text-xl">→</span>
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}
