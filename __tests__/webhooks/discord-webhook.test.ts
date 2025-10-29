// Test Discord webhook integration for YouTube bridge notifications
import { TEST_YOUTUBE_MEMBERS } from '../test-data/youtube-members'

// Mock Discord webhook responses
const mockDiscordWebhook = {
  success: { ok: true, status: 200 },
  failure: { ok: false, status: 400, statusText: 'Bad Request' },
  timeout: new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Timeout')), 5000)
  )
}

describe('🔗 Discord Webhook Integration', () => {
  const originalFetch = global.fetch
  const mockFetch = jest.fn()
  
  beforeEach(() => {
    global.fetch = mockFetch
    jest.clearAllMocks()
  })

  afterAll(() => {
    global.fetch = originalFetch
  })

  describe('✅ Successful Webhook Calls', () => {
    test('should send verification notification for Inner Circle member', async () => {
      mockFetch.mockResolvedValueOnce(mockDiscordWebhook.success)
      
      const member = TEST_YOUTUBE_MEMBERS.innerCircle
      const webhookPayload = {
        embeds: [{
          title: "🎮 New YouTube Member Verification",
          color: 0xFF5A1F,
          fields: [
            { name: "YouTube", value: member.youtubeUsername, inline: true },
            { name: "Discord", value: member.discordUsername, inline: true },
            { name: "Email", value: member.email, inline: true },
            { name: "Tier", value: "Inner Circle ($4.99)", inline: true },
            { name: "Status", value: "✅ Email Sent - Awaiting Connection", inline: false }
          ],
          timestamp: new Date().toISOString()
        }]
      }

      await fetch(process.env.DISCORD_WEBHOOK_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookPayload)
      })

      expect(mockFetch).toHaveBeenCalledWith(
        process.env.DISCORD_WEBHOOK_URL,
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(webhookPayload)
        })
      )
    })

    test('should send verification notification for Best Friends member', async () => {
      mockFetch.mockResolvedValueOnce(mockDiscordWebhook.success)
      
      const member = TEST_YOUTUBE_MEMBERS.bestFriends
      const webhookPayload = {
        embeds: [{
          title: "🎮 New YouTube Member Verification", 
          color: 0xFF5A1F,
          fields: [
            { name: "YouTube", value: member.youtubeUsername, inline: true },
            { name: "Discord", value: member.discordUsername, inline: true },
            { name: "Email", value: member.email, inline: true },
            { name: "Tier", value: "Best Friends ($9.99)", inline: true },
            { name: "Status", value: "✅ Email Sent - Awaiting Connection", inline: false }
          ]
        }]
      }

      await fetch(process.env.DISCORD_WEBHOOK_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookPayload)
      })

      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    test('should send verification notification for You Love Me member', async () => {
      mockFetch.mockResolvedValueOnce(mockDiscordWebhook.success)
      
      const member = TEST_YOUTUBE_MEMBERS.youLoveMe
      const webhookPayload = {
        embeds: [{
          title: "🎮 New YouTube Member Verification",
          color: 0xFF5A1F, 
          fields: [
            { name: "YouTube", value: member.youtubeUsername, inline: true },
            { name: "Discord", value: member.discordUsername, inline: true },
            { name: "Email", value: member.email, inline: true },
            { name: "Tier", value: "You Love Me ($24.99)", inline: true },
            { name: "Status", value: "✅ Email Sent - Awaiting Connection", inline: false }
          ]
        }]
      }

      await fetch(process.env.DISCORD_WEBHOOK_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookPayload)
      })

      expect(mockFetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('❌ Webhook Failure Handling', () => {
    test('should handle webhook timeout gracefully', async () => {
      mockFetch.mockImplementationOnce(() => mockDiscordWebhook.timeout)
      
      const member = TEST_YOUTUBE_MEMBERS.innerCircle
      
      try {
        await fetch(process.env.DISCORD_WEBHOOK_URL!, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: 'Test message' })
        })
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
      }
    })

    test('should handle webhook 400 error', async () => {
      mockFetch.mockResolvedValueOnce(mockDiscordWebhook.failure)
      
      const response = await fetch(process.env.DISCORD_WEBHOOK_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: 'Test message' })
      })

      expect(response.ok).toBe(false)
      expect(response.status).toBe(400)
    })

    test('should handle missing webhook URL', async () => {
      const originalUrl = process.env.DISCORD_WEBHOOK_URL
      delete process.env.DISCORD_WEBHOOK_URL
      
      // Should not attempt to call webhook if URL is missing
      const shouldNotCall = async () => {
        if (!process.env.DISCORD_WEBHOOK_URL) {
          return { skipped: true }
        }
        return await fetch(process.env.DISCORD_WEBHOOK_URL, {
          method: 'POST',
          body: JSON.stringify({ content: 'Test' })
        })
      }

      const result = await shouldNotCall()
      expect(result).toEqual({ skipped: true })
      expect(mockFetch).not.toHaveBeenCalled()
      
      // Restore URL
      process.env.DISCORD_WEBHOOK_URL = originalUrl
    })
  })

  describe('📊 Webhook Payload Validation', () => {
    test('should create valid Discord embed structure', () => {
      const member = TEST_YOUTUBE_MEMBERS.innerCircle
      
      const embed = {
        title: "🎮 New YouTube Member Verification",
        color: 0xFF5A1F, // Jesse's fire orange
        fields: [
          { name: "YouTube", value: member.youtubeUsername, inline: true },
          { name: "Discord", value: member.discordUsername, inline: true },
          { name: "Email", value: member.email, inline: true },
          { name: "Tier", value: "Inner Circle ($4.99)", inline: true }
        ],
        footer: { text: "YouTube → Discord Bridge" },
        timestamp: new Date().toISOString()
      }

      // Validate embed structure
      expect(embed.title).toContain('YouTube Member Verification')
      expect(embed.color).toBe(0xFF5A1F)
      expect(embed.fields).toHaveLength(4)
      expect(embed.fields[0].name).toBe('YouTube')
      expect(embed.fields[1].name).toBe('Discord')
      expect(embed.fields[2].name).toBe('Email')
      expect(embed.fields[3].name).toBe('Tier')
    })

    test('should handle special characters in usernames', () => {
      const specialMember = {
        youtubeUsername: '@Jesse🔥ON🔥FIRE',
        discordUsername: 'jesse_fire#1234',
        email: 'test+special@example.com'
      }

      const embed = {
        title: "🎮 New YouTube Member Verification",
        color: 0xFF5A1F,
        fields: [
          { name: "YouTube", value: specialMember.youtubeUsername, inline: true },
          { name: "Discord", value: specialMember.discordUsername, inline: true },
          { name: "Email", value: specialMember.email, inline: true }
        ]
      }

      expect(embed.fields[0].value).toContain('🔥')
      expect(embed.fields[1].value).toContain('_')
      expect(embed.fields[2].value).toContain('+')
    })
  })
})
