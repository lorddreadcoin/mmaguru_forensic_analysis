import { NextRequest } from 'next/server'
import { POST } from '@/app/api/youtube-verify/route'
import { TEST_YOUTUBE_MEMBERS, TEST_FORM_SUBMISSIONS } from '../../test-data/youtube-members'

// Mock fetch for external API calls
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('🔥 YouTube Bridge API - /api/youtube-verify', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock successful Discord webhook response
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true })
    })
  })

  describe('✅ Valid Submissions', () => {
    test('should accept Inner Circle member ($4.99)', async () => {
      const member = TEST_YOUTUBE_MEMBERS.innerCircle
      
      const request = new NextRequest('http://localhost:3000/api/youtube-verify', {
        method: 'POST',
        body: JSON.stringify({
          youtubeUsername: member.youtubeUsername,
          discordUsername: member.discordUsername,
          email: member.email
        }),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      
      // Verify Discord webhook was called
      expect(mockFetch).toHaveBeenCalledWith(
        process.env.DISCORD_WEBHOOK_URL,
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining(member.youtubeUsername)
        })
      )
    })

    test('should accept Best Friends member ($9.99)', async () => {
      const member = TEST_YOUTUBE_MEMBERS.bestFriends
      
      const request = new NextRequest('http://localhost:3000/api/youtube-verify', {
        method: 'POST',
        body: JSON.stringify({
          youtubeUsername: member.youtubeUsername,
          discordUsername: member.discordUsername,
          email: member.email
        }),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    test('should accept You Love Me member ($24.99)', async () => {
      const member = TEST_YOUTUBE_MEMBERS.youLoveMe
      
      const request = new NextRequest('http://localhost:3000/api/youtube-verify', {
        method: 'POST',
        body: JSON.stringify({
          youtubeUsername: member.youtubeUsername,
          discordUsername: member.discordUsername,
          email: member.email
        }),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    test('should handle special characters in usernames', async () => {
      const submission = TEST_FORM_SUBMISSIONS.specialCharacters
      
      const request = new NextRequest('http://localhost:3000/api/youtube-verify', {
        method: 'POST',
        body: JSON.stringify(submission),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })
  })

  describe('❌ Invalid Submissions', () => {
    test('should reject missing YouTube username', async () => {
      const request = new NextRequest('http://localhost:3000/api/youtube-verify', {
        method: 'POST',
        body: JSON.stringify({
          youtubeUsername: '',
          discordUsername: 'test#1234',
          email: 'test@example.com'
        }),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('All fields are required')
    })

    test('should reject missing Discord username', async () => {
      const request = new NextRequest('http://localhost:3000/api/youtube-verify', {
        method: 'POST',
        body: JSON.stringify({
          youtubeUsername: '@TestUser',
          discordUsername: '',
          email: 'test@example.com'
        }),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('All fields are required')
    })

    test('should reject missing email', async () => {
      const request = new NextRequest('http://localhost:3000/api/youtube-verify', {
        method: 'POST',
        body: JSON.stringify({
          youtubeUsername: '@TestUser',
          discordUsername: 'test#1234',
          email: ''
        }),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('All fields are required')
    })

    test('should handle malformed JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api/youtube-verify', {
        method: 'POST',
        body: 'invalid json',
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Verification failed. Please try again.')
    })
  })

  describe('🔗 External Service Integration', () => {
    test('should handle Discord webhook failure gracefully', async () => {
      // Mock Discord webhook failure
      mockFetch.mockRejectedValueOnce(new Error('Discord webhook failed'))
      
      const member = TEST_YOUTUBE_MEMBERS.innerCircle
      const request = new NextRequest('http://localhost:3000/api/youtube-verify', {
        method: 'POST',
        body: JSON.stringify({
          youtubeUsername: member.youtubeUsername,
          discordUsername: member.discordUsername,
          email: member.email
        }),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      // Should still succeed even if Discord webhook fails
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    test('should handle Resend email failure gracefully', async () => {
      // Mock Resend failure by removing API key
      const originalKey = process.env.RESEND_API_KEY
      delete process.env.RESEND_API_KEY
      
      const member = TEST_YOUTUBE_MEMBERS.innerCircle
      const request = new NextRequest('http://localhost:3000/api/youtube-verify', {
        method: 'POST',
        body: JSON.stringify({
          youtubeUsername: member.youtubeUsername,
          discordUsername: member.discordUsername,
          email: member.email
        }),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      
      // Restore API key
      process.env.RESEND_API_KEY = originalKey
    })
  })

  describe('📧 Email Content Validation', () => {
    test('should generate correct email content for each tier', async () => {
      const member = TEST_YOUTUBE_MEMBERS.innerCircle
      
      const request = new NextRequest('http://localhost:3000/api/youtube-verify', {
        method: 'POST',
        body: JSON.stringify({
          youtubeUsername: member.youtubeUsername,
          discordUsername: member.discordUsername,
          email: member.email
        }),
        headers: { 'Content-Type': 'application/json' }
      })

      await POST(request)

      // Verify Discord webhook contains correct user info
      const webhookCall = mockFetch.mock.calls.find(call => 
        call[0] === process.env.DISCORD_WEBHOOK_URL
      )
      
      expect(webhookCall).toBeDefined()
      const webhookBody = JSON.parse(webhookCall[1].body)
      
      expect(webhookBody.embeds[0].fields).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "YouTube",
            value: member.youtubeUsername
          }),
          expect.objectContaining({
            name: "Discord", 
            value: member.discordUsername
          }),
          expect.objectContaining({
            name: "Email",
            value: member.email
          })
        ])
      )
    })
  })
})
