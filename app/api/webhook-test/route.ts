import { NextResponse } from 'next/server';

// Diagnostic endpoint to check webhook configuration
export async function GET() {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  const inviteUrl = process.env.DISCORD_INVITE_URL;
  
  // Don't expose the full webhook URL (security)
  const webhookConfigured = !!webhookUrl;
  const webhookPreview = webhookUrl ? webhookUrl.substring(0, 40) + '...' : 'NOT SET';
  
  return NextResponse.json({
    webhookConfigured,
    webhookPreview,
    inviteUrl,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    message: webhookConfigured 
      ? '✅ Webhook URL is configured' 
      : '❌ Webhook URL is NOT configured - Add DISCORD_WEBHOOK_URL to Vercel environment variables'
  });
}

// Test the webhook by sending a message
export async function POST() {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  
  if (!webhookUrl) {
    return NextResponse.json({
      success: false,
      error: 'DISCORD_WEBHOOK_URL not configured in environment variables'
    }, { status: 500 });
  }
  
  try {
    console.log('🧪 Testing webhook:', webhookUrl.substring(0, 40) + '...');
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: '🔥 **PRODUCTION WEBHOOK TEST**',
        embeds: [{
          title: '✅ Webhook Working!',
          description: 'This message confirms your webhook is properly configured in production.',
          color: 0xFF5A1F,
          fields: [
            {
              name: 'Environment',
              value: process.env.NODE_ENV || 'unknown',
              inline: true
            },
            {
              name: 'Timestamp',
              value: new Date().toISOString(),
              inline: true
            }
          ]
        }]
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Webhook failed:', response.status, errorText);
      return NextResponse.json({
        success: false,
        error: `Webhook returned ${response.status}`,
        details: errorText
      }, { status: 500 });
    }
    
    console.log('✅ Webhook test successful');
    return NextResponse.json({
      success: true,
      message: 'Webhook message sent successfully! Check your Discord channel.',
      status: response.status
    });
    
  } catch (error) {
    console.error('🚨 Webhook test error:', error);
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 });
  }
}
