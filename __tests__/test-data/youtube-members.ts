// Test data matching Jesse's ACTUAL YouTube membership tiers
export const TEST_YOUTUBE_MEMBERS = {
  // Jesse's Inner Circle - $4.99/month
  innerCircle: {
    youtubeUsername: '@TestInnerCircle',
    discordUsername: 'testinner#1234',
    email: 'test.inner@example.com',
    tier: 'inner-circle',
    price: 4.99,
    expectedDiscordRole: 'Inner Circle',
    membershipActive: true,
    perks: [
      'Loyalty badges in comments & live chat',
      'Custom emoji access', 
      '5 additional MMA videos per week',
      'TWICE the content'
    ]
  },

  // Jesse's Best Friends - $9.99/month  
  bestFriends: {
    youtubeUsername: '@TestBestFriend',
    discordUsername: 'testbest#5678',
    email: 'test.best@example.com',
    tier: 'best-friends',
    price: 9.99,
    expectedDiscordRole: 'Best Friend',
    membershipActive: true,
    perks: [
      'Everything from Inner Circle',
      'Members-only live streams (weekly)',
      'Exclusive green screen GIFs',
      'Direct community access'
    ]
  },

  // You Love Me & You Know It - $24.99/month
  youLoveMe: {
    youtubeUsername: '@TestYouLoveMe',
    discordUsername: 'testlove#9999',
    email: 'test.love@example.com',
    tier: 'you-love-me',
    price: 24.99,
    expectedDiscordRole: 'Elite Supporter',
    membershipActive: true,
    perks: [
      'Everything from previous tiers',
      'Monthly shout-outs on channel',
      'Your name called out publicly',
      'Ultimate supporter status'
    ]
  },

  // Expired membership (for testing cancellation)
  expiredMember: {
    youtubeUsername: '@TestExpired',
    discordUsername: 'testexpired#0000',
    email: 'test.expired@example.com',
    tier: 'inner-circle',
    price: 4.99,
    expectedDiscordRole: 'Inner Circle',
    membershipActive: false,
    expiredDate: new Date(Date.now() - 86400000) // 1 day ago
  },

  // Invalid user (for error testing)
  invalidUser: {
    youtubeUsername: '',
    discordUsername: '',
    email: 'invalid-email',
    tier: 'unknown',
    price: 0,
    expectedDiscordRole: null,
    membershipActive: false
  }
}

// Mock YouTube API responses for each tier
export const MOCK_YOUTUBE_API_RESPONSES = {
  innerCircle: {
    kind: 'youtube#membershipLevel',
    etag: 'test-etag-inner',
    id: 'inner-circle-level-id',
    snippet: {
      creatorChannelId: 'UCL1ULuUKdktFDpe66_A3H2A',
      levelDetails: {
        displayName: "Jesse's Inner Circle",
        amount: 4990000, // $4.99 in micros
        currency: 'USD'
      }
    }
  },

  bestFriends: {
    kind: 'youtube#membershipLevel', 
    etag: 'test-etag-best',
    id: 'best-friends-level-id',
    snippet: {
      creatorChannelId: 'UCL1ULuUKdktFDpe66_A3H2A',
      levelDetails: {
        displayName: "Jesse's Best Friends",
        amount: 9990000, // $9.99 in micros
        currency: 'USD'
      }
    }
  },

  youLoveMe: {
    kind: 'youtube#membershipLevel',
    etag: 'test-etag-love',
    id: 'you-love-me-level-id', 
    snippet: {
      creatorChannelId: 'UCL1ULuUKdktFDpe66_A3H2A',
      levelDetails: {
        displayName: 'You Love Me & You Know It',
        amount: 24990000, // $24.99 in micros
        currency: 'USD'
      }
    }
  }
}

// Mock Discord webhook payloads
export const MOCK_DISCORD_WEBHOOKS = {
  success: {
    embeds: [{
      title: "🎮 New YouTube Member Verification",
      color: 0xFF5A1F,
      fields: [
        { name: "YouTube", value: "@TestUser", inline: true },
        { name: "Discord", value: "testuser#1234", inline: true },
        { name: "Email", value: "test@example.com", inline: true },
        { name: "Status", value: "✅ Email Sent - Awaiting YouTube Connection", inline: false }
      ]
    }]
  },

  error: {
    content: "❌ YouTube Bridge Error: Verification failed for @TestUser"
  }
}

// Test form submissions
export const TEST_FORM_SUBMISSIONS = {
  valid: {
    youtubeUsername: '@TestUser',
    discordUsername: 'testuser#1234', 
    email: 'test@example.com'
  },

  invalidEmail: {
    youtubeUsername: '@TestUser',
    discordUsername: 'testuser#1234',
    email: 'invalid-email'
  },

  missingFields: {
    youtubeUsername: '',
    discordUsername: 'testuser#1234',
    email: 'test@example.com'
  },

  specialCharacters: {
    youtubeUsername: '@Test🔥User',
    discordUsername: 'test user with spaces',
    email: 'test+special@example.com'
  }
}
