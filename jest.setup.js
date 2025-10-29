// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Import Jest types globally
import '@testing-library/jest-dom'

// Mock environment variables for testing
process.env.DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/test/webhook'
process.env.DISCORD_INVITE_URL = 'https://discord.gg/test-invite'
process.env.RESEND_API_KEY = 'test-resend-key'
process.env.YOUTUBE_API_KEY = 'test-youtube-key'
process.env.YOUTUBE_CHANNEL_ID = 'UCL1ULuUKdktFDpe66_A3H2A'

// Mock fetch globally for tests
global.fetch = jest.fn()

// Reset mocks after each test
afterEach(() => {
  jest.clearAllMocks()
})
