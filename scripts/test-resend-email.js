#!/usr/bin/env node

/**
 * 🔥 Test Resend Email - Using your actual API key
 */

async function testResendEmail() {
  console.log('📧 Testing Resend Email Service\n');
  
  try {
    // Import Resend (you'll need to install it first)
    const { Resend } = await import('resend');
    const resend = new Resend('re_FJKfpNqn_HFX6GdPSM43GHz3KaYg8Xbz6');

    console.log('📤 Sending test email...');
    
    const result = await resend.emails.send({
      from: 'Jesse ON FIRE <onboarding@resend.dev>',
      to: 'lorddreadcoin@gmail.com',
      subject: '🔥 Test Email - Jesse ON FIRE YouTube Bridge',
      html: `
        <div style="font-family: Arial, sans-serif; background: #1a1a1a; color: #ffffff; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: #2a2a2a; border-radius: 10px; padding: 30px;">
            <h1 style="color: #FF5A1F;">🔥 Test Email Success!</h1>
            <p>This is a test email from your Jesse ON FIRE YouTube bridge system.</p>
            <p><strong>✅ Resend API is working correctly!</strong></p>
            <p>Time: ${new Date().toLocaleString()}</p>
            <div style="background: #FF5A1F; color: white; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
              <strong>Your email system is ready! 🚀</strong>
            </div>
          </div>
        </div>
      `
    });

    console.log('✅ SUCCESS! Email sent successfully!');
    console.log(`   Email ID: ${result.data?.id || 'N/A'}`);
    console.log('📱 Check lorddreadcoin@gmail.com for the test email');
    
  } catch (error) {
    if (error.message.includes('Cannot resolve module')) {
      console.log('⚠️  Resend module not installed locally');
      console.log('   This is OK - it will work in Vercel after you add the environment variable');
      console.log('   To test locally: npm install resend');
    } else {
      console.log(`❌ ERROR: ${error.message}`);
    }
  }
}

testResendEmail();
