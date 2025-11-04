// Site configuration and constants with strict TypeScript types

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
  creator: string;
}

export const SITE_CONFIG: SiteConfig = {
  name: "Jesse ON FIRE",
  tagline: "Uncensored. Unfiltered. Undefeated.",
  description: "517K+ Warriors Strong. Black Belt Mic Skills.",
  url: "https://jesseonfire.com",
  creator: "@realjesseonfire"
};

export interface Links {
  patreon: string;
  discord: string;
  youtube: string;
  twitter: string;
  instagram: string;
  tiktok?: string;
  playWithMatches?: string;
  afterHours?: string;
}

export const LINKS: Links = {
  patreon: "https://www.patreon.com/c/jesseonfire",
  discord: "https://discord.gg/KpUF6GjH8V",
  youtube: "https://www.youtube.com/@RealJesseONFIRE",
  twitter: "https://twitter.com/realjesseonfire",
  instagram: "https://instagram.com/realjesseonfire",
  tiktok: "https://tiktok.com/@jesseonfire",
  playWithMatches: "https://www.youtube.com/@PlaywithMatcheswGabiJesse",
  afterHours: "https://www.youtube.com/@JesseOnFIREAfterHours"
};

export interface Sponsor {
  name: string;
  url: string;
  code: string;
  description: string;
}

export interface Sponsors {
  prizepicks: Sponsor;
  yokratom: Sponsor;
}

export const SPONSORS: Sponsors = {
  prizepicks: {
    name: "PrizePicks",
    url: "https://prizepicks.onelink.me/ivHR/JESSEONFIRE",
    code: "JESSEONFIRE",
    description: "Daily fantasy sports made simple. Play $5 and get $50 in bonus lineups instantly"
  },
  yokratom: {
    name: "Better Help",
    url: "https://betterhelp.com/jesseonfire",
    code: "JESSEONFIRE",
    description: "Professional online therapy. Get 10% off your first month"
  }
};

export interface Tier {
  id: string;
  name: string;
  price: number;
  image?: string;
  benefits: string[];
  featured?: boolean;
  description?: string;
}

export const TIERS: Tier[] = [
  {
    id: "free",
    name: "Free Member",
    price: 0,
    image: "/img/patreon-free.png",
    benefits: [
      "Access to public content",
      "Community chat access",
      "Email updates"
    ],
    description: "Join for free and get updates on public and exclusive posts."
  },
  {
    id: "inner-circle",
    name: "Jesse's Inner Circle",
    price: 4.99,
    image: "/img/patreon-inner.png",
    benefits: [
      "Basic Discord access",
      "Members-only content",
      "Early video access",
      "Monthly updates"
    ],
    description: "Get started with exclusive content and basic community access."
  },
  {
    id: "member",
    name: "Jesse ON FIRE Member",
    price: 7.99,
    image: "/img/patreon-premium.png",
    benefits: [
      "ALL VIDEO ACCESS",
      "At least 2 PATREON ONLY videos PER WEEK",
      "Celebrity CRUSHES (like Josh Fabia)",
      "Full Discord access"
    ],
    featured: true,
    description: "When you join my Patreon, you get access to all my videos here, which will include at least 2 PATREON ONLY videos PER WEEK where I CRUSH celebrities who deserve it."
  },
  {
    id: "elite",
    name: "Jesse ON FIRE ELITE",
    price: 14.99,
    image: "/img/patreon-elite.png",
    benefits: [
      "ALL VIDEO ACCESS",
      "EXCLUSIVE Elite Only Live Chat",
      "Direct access to JOF",
      "All Member tier benefits",
      "Your name in video credits"
    ],
    description: "This tier will access exclusive live chats that no one else has access to. If you really want direct access to JOF, this is the way there."
  },
  {
    id: "coaching",
    name: "Private Coaching",
    price: 150,
    image: "/img/patreon-elite.png",
    benefits: [
      "🔥 ALL membership benefits included",
      "📞 1-on-1 monthly coaching session (1 hour)",
      "💬 Direct text access to Jesse",
      "🎯 Personalized content strategy",
      "📈 Channel growth consultation",
      "🏆 Priority response to all questions",
      "🎬 Custom video shoutouts"
    ],
    description: "Get personal coaching from Jesse himself. One monthly session plus ALL other membership benefits."
  }
];

export interface BioStats {
  label: string;
  value: string;
}

export interface Bio {
  headline: string;
  paragraphs: string[];
  pullQuote: string;
  stats: BioStats[];
}

// Tagline system for legendary messaging
export const TAGLINES = {
  // Main hero tagline (under brand name)
  hero: "The YouTube GOAT on the Mic",
  
  // Alternative taglines (can rotate or use in different sections)
  alternatives: [
    "517K Warriors. One Unfiltered Voice.",
    "Black Belt Mic Skills. Zero Bullshit.",
    "The Voice They Can't Silence.",
    "Combat Commentary. No Filter.",
    "Truth Bombs. Daily.",
    "Mic Assassin.",
    "Where Real Talk Lives.",
  ],
  
  // About section tagline
  about: "Undefeated on the Mic",
  
  // Stats tagline (replaces timeline stat)
  stats: "The GOAT on the Mic"
};

export const BIO: Bio = {
  headline: "Black Belt Mic Skills",
  paragraphs: [
    "Jesse ON FIRE is the YOUTUBE GOAT on the mic. With 517,000+ subscribers and 111 million views, this political analyst has been exposing truth with black belt precision. Unfiltered. Uncensored. Undefeated.",
    "With 2,863 videos and counting, Jesse drops content daily on everything from political conspiracies to MMA breakdowns. Running multiple channels including PLAY W MATCHES with wife Gabi and Jesse On FIRE After Hours for the real ones.",
    "Whether he's exposing government corruption, breaking down UFC politics, or going OFF THE RAILS on his latest investigation, Jesse delivers what his army demands: pure, unfiltered truth that makes the establishment panic."
  ],
  pullQuote: "517,000 warriors strong. The voice they can't silence.",
  stats: [
    { label: "Warriors", value: "517K+" },
    { label: "Total Views", value: "111M+" },
    { label: "The GOAT", value: "🔥" }
  ]
};
