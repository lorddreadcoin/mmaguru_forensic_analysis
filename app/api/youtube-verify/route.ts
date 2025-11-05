import { NextResponse } from 'next/server';

// Deployment: Nov 5, 2025 10:10 AM - Fixed email template
// Discord webhook for logging
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_URL || '';
const DISCORD_INVITE = process.env.DISCORD_INVITE_URL || 'https://discord.gg/9WpPC5GS';

// Email configuration - using a simple approach for now
async function sendEmail(data: { to: string; subject: string; body: string }) {
  // If you have Resend API key, use it
  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      await resend.emails.send({
        from: 'Jesse ON FIRE <noreply@jesseonfire.com>',
        to: data.to,
        subject: data.subject,
        html: data.body
      });
      return true;
    } catch (error) {
      console.error('Resend email failed:', error);
    }
  }
  
  // Fallback: Log to Discord webhook for manual processing
  if (DISCORD_WEBHOOK) {
    await fetch(DISCORD_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `**Manual Email Required**\nTo: ${data.to}\nSubject: ${data.subject}`
      })
    });
  }
  
  return true;
}

export async function POST(req: Request) {
  console.log('🔥 YouTube verification endpoint called');
  
  try {
    const { youtubeUsername, discordUsername, email } = await req.json();
    
    console.log('📝 Received data:', { youtubeUsername, discordUsername, email });
    
    // Validate input
    if (!youtubeUsername || !discordUsername || !email) {
      console.log('❌ Validation failed: Missing fields');
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // IMMEDIATE webhook notification to confirm function is running
    console.log('📡 Sending immediate webhook notification...');
    console.log('Webhook URL exists:', !!DISCORD_WEBHOOK);
    console.log('Webhook URL preview:', DISCORD_WEBHOOK ? DISCORD_WEBHOOK.substring(0, 40) + '...' : 'NOT SET');
    
    if (DISCORD_WEBHOOK) {
      // Non-blocking webhook call
      fetch(DISCORD_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `🚨 **FUNCTION CALLED** - Processing verification for ${youtubeUsername} at ${new Date().toISOString()}`
        })
      })
      .then(res => {
        console.log('✅ Immediate webhook sent, status:', res.status);
        if (!res.ok) {
          res.text().then(text => console.error('Webhook error response:', text));
        }
      })
      .catch(err => console.error('❌ Immediate webhook failed:', err));
    } else {
      console.log('⚠️ CRITICAL: No webhook URL configured in environment variables!');
    }
    
    // Create email HTML - Gmail-compatible with inline styles
    const emailBody = `
    <!DOCTYPE html>
    <html>
    <body style="margin: 0; padding: 20px; font-family: Arial, Helvetica, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
        <!-- Header -->
        <tr>
          <td style="background-color: #1a1a1a; padding: 30px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 28px;">
              🔥 Welcome to <span style="color: #FF5A1F;">Jesse ON FIRE</span> Discord!
            </h1>
            <p style="margin: 10px 0 0 0; color: #cccccc; font-size: 14px;">
              Your YouTube membership = Discord access. No double payment!
            </p>
          </td>
        </tr>
        
        <!-- Body -->
        <tr>
          <td style="padding: 30px; color: #333333;">
            <p style="margin: 0 0 15px 0; font-size: 16px; line-height: 1.6;">
              Hey <strong>${youtubeUsername}</strong>,
            </p>
            
            <p style="margin: 0 0 25px 0; font-size: 16px; line-height: 1.6;">
              Thanks for being a YouTube member! Here's how to get your Discord access in under 2 minutes:
            </p>
            
            <!-- Step 1 -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
              <tr>
                <td style="background-color: #f8f8f8; padding: 20px; border-radius: 8px;">
                  <p style="margin: 0 0 10px 0; font-size: 20px;">1️⃣ <strong>Join our Discord Server</strong></p>
                  <p style="margin: 0 0 15px 0; font-size: 14px; color: #666666;">
                    Click the button below to join the community.
                  </p>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <a href="${DISCORD_INVITE}" style="display: inline-block; background-color: #FF5A1F; color: #ffffff; padding: 15px 40px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                          Join Discord Now →
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            
            <!-- Step 2 -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
              <tr>
                <td style="background-color: #f8f8f8; padding: 20px; border-radius: 8px;">
                  <p style="margin: 0 0 10px 0; font-size: 20px;">2️⃣ <strong>Connect Your YouTube Account</strong></p>
                  <p style="margin: 0; font-size: 14px; color: #666666;">
                    In Discord, go to: <strong>User Settings → Connections → YouTube</strong>
                  </p>
                </td>
              </tr>
            </table>
            
            <!-- Step 3 -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
              <tr>
                <td style="background-color: #f8f8f8; padding: 20px; border-radius: 8px;">
                  <p style="margin: 0 0 10px 0; font-size: 20px;">3️⃣ <strong>Get Your Role Automatically</strong></p>
                  <p style="margin: 0; font-size: 14px; color: #666666;">
                    Discord will verify your membership and assign your role in 2-3 minutes!
                  </p>
                </td>
              </tr>
            </table>
            
            <!-- Important Notes -->
            <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold;">
              Important Notes:
            </p>
            <ul style="margin: 0 0 25px 0; padding-left: 20px; color: #666666; font-size: 14px; line-height: 1.8;">
              <li>Your Discord username was submitted as: <strong>${discordUsername}</strong></li>
              <li>If your role isn't assigned after 5 minutes, disconnect and reconnect YouTube in Discord settings.</li>
              <li>Your role will be removed automatically if your YouTube membership expires.</li>
            </ul>
            
            <p style="margin: 0; font-size: 14px; color: #666666;">
              Need help? Just reply to this email or message @mods in Discord!
            </p>
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="background-color: #1a1a1a; padding: 20px; text-align: center;">
            <p style="margin: 0; color: #888888; font-size: 12px;">
              Jesse ON FIRE • 517K Warriors Strong • Uncensored. Unfiltered. Undefeated.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
    
    // Send verification email
    console.log('📧 Attempting to send email to:', email);
    await sendEmail({
      to: email,
      subject: "🔥 Discord Access Ready - Jesse ON FIRE",
      body: emailBody
    });
    console.log('✅ Email send function completed');
    
    // Log to Discord webhook for tracking
    console.log('📡 Sending detailed webhook notification...');
    if (DISCORD_WEBHOOK) {
      // Non-blocking webhook call
      fetch(DISCORD_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: "🎮 New YouTube Member Verification",
            color: 0xFF5A1F, // Fire orange
            fields: [
              { 
                name: "YouTube", 
                value: youtubeUsername, 
                inline: true 
              },
              { 
                name: "Discord", 
                value: discordUsername, 
                inline: true 
              },
              { 
                name: "Email", 
                value: email, 
                inline: true 
              },
              { 
                name: "Status", 
                value: "✅ Email Sent - Awaiting YouTube Connection", 
                inline: false 
              },
              {
                name: "Instructions Sent",
                value: "User should:\n1. Join Discord via invite link\n2. Connect YouTube in Settings\n3. Get auto role",
                inline: false
              }
            ],
            footer: {
              text: "YouTube → Discord Bridge"
            },
            timestamp: new Date().toISOString()
          }]
        })
      })
      .then(res => {
        console.log('✅ Detailed webhook notification sent, status:', res.status);
        if (!res.ok) {
          res.text().then(text => console.error('Webhook error:', text));
        }
      })
      .catch(err => console.error('❌ Detailed webhook failed:', err));
    } else {
      console.log('⚠️ CRITICAL: No webhook configured for detailed notification');
    }
    
    console.log('🎉 Verification complete, returning success');
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('🚨 YouTube verification error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    
    // Send error to Discord
    if (DISCORD_WEBHOOK) {
      try {
        await fetch(DISCORD_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `🚨 **ERROR IN VERIFICATION**\n\`\`\`${error}\`\`\``
          })
        });
      } catch (webhookError) {
        console.error('Failed to send error to Discord:', webhookError);
      }
    }
    
    return NextResponse.json(
      { error: 'Verification failed. Please try again.', details: String(error) },
      { status: 500 }
    );
  }
}
