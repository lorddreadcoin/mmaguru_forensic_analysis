// Direct test of Resend email sending
const { Resend } = require('resend');

const resend = new Resend('re_gJyqcykS_GyEq4mVzG9nTmuvQEa4M4vVi');

async function sendTestEmail() {
  console.log('📧 Sending test email to danksonloc@gmail.com...\n');
  
  try {
    const data = await resend.emails.send({
      from: 'Jesse ON FIRE <onboarding@resend.dev>',
      to: ['danksonloc@gmail.com'],
      subject: '🔥 TEST - Discord Access Ready',
      html: `
        <h1>🔥 Test Email from Jesse ON FIRE</h1>
        <p>If you receive this, Resend is working correctly!</p>
        <p><strong>Discord Invite:</strong> <a href="https://discord.gg/9WpPC5GS">https://discord.gg/9WpPC5GS</a></p>
        <p>Check your spam folder if this went there.</p>
      `
    });

    console.log('✅ SUCCESS!');
    console.log('Response:', JSON.stringify(data, null, 2));
    console.log('\n📬 Email sent to: danksonloc@gmail.com');
    console.log('\n✅ Check these places in Gmail:');
    console.log('1. ✉️  Inbox');
    console.log('2. 🗑️  Spam folder (MOST LIKELY)');
    console.log('3. 📂 Promotions tab');
    console.log('4. 🔍 Search: from:onboarding@resend.dev');
    console.log('\n📊 Also check Resend dashboard:');
    console.log('https://resend.com/emails');
    console.log('\nIf still not there, check Resend dashboard for delivery status!');
    
  } catch (error) {
    console.error('❌ FAILED!');
    console.error('Error:', error.message);
    console.error('Details:', error);
  }
}

sendTestEmail();
