import { NextResponse } from 'next/server';

// Discord webhook for logging
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_URL || '';
const DISCORD_INVITE = process.env.DISCORD_INVITE_URL || 'https://discord.gg/KpUF6GjH8V';

// Email configuration - using a simple approach for now
async function sendEmail(data: { to: string; subject: string; body: string }) {
  // If you have Resend API key, use it
  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      await resend.emails.send({
        from: 'Jesse ON FIRE <onboarding@resend.dev>',
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
    
    // Create email HTML
    const emailBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #1a1a1a; color: #ffffff; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #2a2a2a; border-radius: 10px; padding: 30px; }
        .header { text-align: center; margin-bottom: 30px; }
        .fire { color: #FF5A1F; font-weight: bold; }
        .steps { background: #1a1a1a; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .step { margin: 15px 0; padding-left: 30px; position: relative; }
        .step-number { position: absolute; left: 0; font-size: 20px; }
        .button { display: inline-block; background: #FF5A1F; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; color: #888; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔥 Welcome to the <span class="fire">Jesse ON FIRE</span> Discord!</h1>
          <p>Your YouTube membership = Discord access. No double payment!</p>
        </div>
        
        <p>Hey ${youtubeUsername}!</p>
        
        <p>Thanks for being a YouTube member! Here's how to get your Discord access in under 2 minutes:</p>
        
        <div class="steps">
          <div class="step">
            <span class="step-number">1️⃣</span>
            <strong>Join our Discord server:</strong><br>
            Click the button below to join
          </div>
          
          <center>
            <a href="${DISCORD_INVITE}" class="button">Join Discord Now →</a>
          </center>
          
          <div class="step">
            <span class="step-number">2️⃣</span>
            <strong>Connect your YouTube account:</strong><br>
            In Discord, go to User Settings → Connections → Add YouTube
          </div>
          
          <div class="step">
            <span class="step-number">3️⃣</span>
            <strong>Automatic role assignment:</strong><br>
            Discord will verify your membership and assign your role in 2-3 minutes!
          </div>
        </div>
        
        <p><strong>Important:</strong></p>
        <ul>
          <li>Your Discord username should be: <strong>${discordUsername}</strong></li>
          <li>If Discord doesn't auto-assign your role, DM a mod with this email</li>
          <li>Your role will be removed automatically if YouTube membership expires</li>
        </ul>
        
        <p>Need help? Just reply to this email or message @mods in Discord!</p>
        
        <div class="footer">
          <p>Jesse ON FIRE • 517K Warriors Strong • Uncensored. Unfiltered. Undefeated.</p>
        </div>
      </div>
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
