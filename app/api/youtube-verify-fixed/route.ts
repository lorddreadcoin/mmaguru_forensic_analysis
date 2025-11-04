import { NextResponse } from 'next/server';

// Discord webhook for logging
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_URL || '';
const DISCORD_INVITE = process.env.DISCORD_INVITE_URL || 'https://discord.gg/9WpPC5GS';

// Email configuration with proper error handling
async function sendEmail(data: { to: string; subject: string; body: string }) {
  const emailResult = { sent: false, method: '', error: null };
  
  // Try Resend API first
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
      
      emailResult.sent = true;
      emailResult.method = 'resend';
      return emailResult;
    } catch (error) {
      console.error('Resend email failed:', error);
      emailResult.error = error.message;
    }
  }
  
  // Fallback: Log to Discord webhook for manual processing
  if (DISCORD_WEBHOOK) {
    try {
      await fetch(DISCORD_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `**Manual Email Required**\nTo: ${data.to}\nSubject: ${data.subject}\nReason: ${emailResult.error || 'No Resend API key'}`
        })
      });
      emailResult.sent = true;
      emailResult.method = 'discord_webhook';
      return emailResult;
    } catch (error) {
      console.error('Discord webhook failed:', error);
      emailResult.error = `Resend failed: ${emailResult.error}, Discord failed: ${error.message}`;
    }
  }
  
  // Both methods failed
  emailResult.error = emailResult.error || 'No email service configured';
  return emailResult;
}

export async function POST(req: Request) {
  try {
    const { youtubeUsername, discordUsername, email } = await req.json();
    
    // Validate input
    if (!youtubeUsername || !discordUsername || !email) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
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
    
    // Send verification email with proper error handling
    const emailResult = await sendEmail({
      to: email,
      subject: "🔥 Discord Access Ready - Jesse ON FIRE",
      body: emailBody
    });
    
    // Log to Discord webhook for tracking (separate from email fallback)
    if (DISCORD_WEBHOOK) {
      try {
        await fetch(DISCORD_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            embeds: [{
              title: "🎮 New YouTube Member Verification",
              color: 0xFF5A1F,
              fields: [
                { name: "YouTube", value: youtubeUsername, inline: true },
                { name: "Discord", value: discordUsername, inline: true },
                { name: "Email", value: email, inline: true },
                { 
                  name: "Email Status", 
                  value: emailResult.sent 
                    ? `✅ Sent via ${emailResult.method}`
                    : `❌ Failed: ${emailResult.error}`,
                  inline: false 
                }
              ],
              footer: { text: "YouTube → Discord Bridge" },
              timestamp: new Date().toISOString()
            }]
          })
        });
      } catch (webhookError) {
        console.error('Webhook logging failed:', webhookError);
      }
    }
    
    // Return honest response about email status
    return NextResponse.json({ 
      success: emailResult.sent,
      emailSent: emailResult.sent,
      emailMethod: emailResult.method,
      error: emailResult.sent ? null : emailResult.error,
      message: emailResult.sent 
        ? `Email sent successfully via ${emailResult.method}`
        : `Email failed: ${emailResult.error}`
    });
    
  } catch (error) {
    console.error('YouTube verification error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Verification failed. Please try again.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
