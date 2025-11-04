// Jesse's ACTUAL YouTube Membership Tiers - REAL DATA
export interface YouTubeTier {
  id: string;
  name: string;
  price: number;
  priceFormatted: string;
  perks: string[];
  color: string;
  discordRole: string;
  featured?: boolean;
}

export const YOUTUBE_TIERS: YouTubeTier[] = [
  {
    id: 'inner-circle',
    name: "Jesse's Inner Circle",
    price: 4.99,
    priceFormatted: '$4.99',
    perks: [
      '🏆 Loyalty badges in comments & live chat',
      '😈 Custom emoji access',
      '🎥 5 additional MMA videos per week',
      '🔥 TWICE the content',
      '💬 Private Discord Community'
    ],
    color: 'from-orange-600 to-red-600',
    discordRole: 'Inner Circle',
    featured: true // Most popular tier
  },
  {
    id: 'best-friends',
    name: "Jesse's Best Friends",
    price: 9.99,
    priceFormatted: '$9.99',
    perks: [
      '✅ Everything from Inner Circle',
      '🔴 Members-only live streams (weekly)',
      '🎬 Exclusive green screen GIFs',
      '💬 Direct community access',
      '🎮 Private Discord Community'
    ],
    color: 'from-purple-600 to-pink-600',
    discordRole: 'Best Friend'
  },
  {
    id: 'you-love-me',
    name: 'You Love Me & You Know It',
    price: 24.99,
    priceFormatted: '$24.99',
    perks: [
      '✅ Everything from previous tiers',
      '📢 Monthly shout-outs on channel',
      '🌟 Your name called out publicly',
      '👑 Ultimate supporter status',
      '👑 Private Discord Community'
    ],
    color: 'from-gold-500 to-yellow-600',
    discordRole: 'Elite Supporter'
  }
];

// Tier comparison for Discord access
export const TIER_DISCORD_MAPPING = {
  'inner-circle': {
    channels: ['general', 'mma-discussion', 'members-only'],
    patreonEquivalent: 'Jesse ON FIRE Member ($7.99)'
  },
  'best-friends': {
    channels: ['general', 'mma-discussion', 'members-only', 'best-friends-lounge', 'live-stream-chat'],
    patreonEquivalent: 'Jesse ON FIRE ELITE ($14.99)'
  },
  'you-love-me': {
    channels: ['all'],
    patreonEquivalent: 'VIP Access (All channels)'
  }
};

// Helper function to get tier by price
export function getTierByPrice(price: number): YouTubeTier | undefined {
  return YOUTUBE_TIERS.find(tier => tier.price === price);
}

// Helper function to get Discord role by tier
export function getDiscordRole(tierId: string): string {
  const tier = YOUTUBE_TIERS.find(t => t.id === tierId);
  return tier?.discordRole || 'Member';
}
