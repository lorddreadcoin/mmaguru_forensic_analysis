#!/usr/bin/env node

/**
 * 🔥 Inner Circle Member Testing Script
 * 
 * This script simulates your $4.99 Inner Circle membership testing
 * Run with: node scripts/test-inner-circle-member.js
 */

const https = require('https');
const { URL } = require('url');

// Your Inner Circle member data
const INNER_CIRCLE_MEMBER = {
  youtubeUsername: '@YourActualYouTubeHandle', // Replace with your real handle
  discordUsername: 'yourdiscord#1234',         // Replace with your real Discord
  email: 'your.email@example.com',             // Replace with your real email
  tier: "Jesse's Inner Circle",
  price: '$4.99',
  expectedRole: 'Inner Circle',
  perks: [
    '🏆 Loyalty badges in comments & live chat',
    '😈 Custom emoji access',
    '🎥 5 additional MMA videos per week',
    '🔥 TWICE the content'
  ]
};

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || 'REPLACE_WITH_YOUR_WEBHOOK_URL';

/**
 * Test the complete Inner Circle member flow
 */
async function testInnerCircleFlow() {
  console.log('🔥 Testing Inner Circle Member Flow\n');
  console.log('👤 Member Details:');
  console.log(`   YouTube: ${INNER_CIRCLE_MEMBER.youtubeUsername}`);
  console.log(`   Discord: ${INNER_CIRCLE_MEMBER.discordUsername}`);
  console.log(`   Email: ${INNER_CIRCLE_MEMBER.email}`);
  console.log(`   Tier: ${INNER_CIRCLE_MEMBER.tier} (${INNER_CIRCLE_MEMBER.price})`);
  console.log(`   Expected Role: ${INNER_CIRCLE_MEMBER.expectedRole}\n`);

  // Test 1: Website Form Submission
  console.log('🧪 Test 1: Website Form Submission');
  await testWebsiteForm();

  // Test 2: Discord Webhook Notification
  console.log('\n🧪 Test 2: Discord Webhook Notification');
  await testDiscordWebhook();

  // Test 3: Email Content Verification
  console.log('\n🧪 Test 3: Email Content Verification');
  testEmailContent();

  // Test 4: Discord Role Assignment Simulation
  console.log('\n🧪 Test 4: Discord Role Assignment Simulation');
  testRoleAssignment();

  console.log('\n🎯 Next Steps for Live Testing:');
  console.log('1. Update your real details in this script');
  console.log('2. Set DISCORD_WEBHOOK_URL environment variable');
  console.log('3. Go to https://jesseonfire.vercel.app/youtube-members');
  console.log('4. Submit the form with your real info');
  console.log('5. Check your email and follow the Discord steps');
  console.log('6. Verify you get the Inner Circle role automatically');
}

/**
 * Test website form submission
 */
async function testWebsiteForm() {
  console.log('   📝 Simulating form submission...');
  
  const formData = {
    youtubeUsername: INNER_CIRCLE_MEMBER.youtubeUsername,
    discordUsername: INNER_CIRCLE_MEMBER.discordUsername,
    email: INNER_CIRCLE_MEMBER.email
  };

  console.log('   ✅ Form data prepared:');
  console.log(`      YouTube: ${formData.youtubeUsername}`);
  console.log(`      Discord: ${formData.discordUsername}`);
  console.log(`      Email: ${formData.email}`);
  console.log('   📤 Ready to submit to /api/youtube-verify');
}

/**
 * Test Discord webhook notification
 */
async function testDiscordWebhook() {
  if (WEBHOOK_URL.includes('REPLACE_WITH')) {
    console.log('   ⚠️  Set DISCORD_WEBHOOK_URL to test webhook');
    return;
  }

  try {
    const embed = {
      title: "🎮 New YouTube Member Verification",
      color: 0xFF5A1F, // Jesse's fire orange
      fields: [
        { name: "YouTube", value: INNER_CIRCLE_MEMBER.youtubeUsername, inline: true },
        { name: "Discord", value: INNER_CIRCLE_MEMBER.discordUsername, inline: true },
        { name: "Email", value: INNER_CIRCLE_MEMBER.email, inline: true },
        { name: "Tier", value: `${INNER_CIRCLE_MEMBER.tier} (${INNER_CIRCLE_MEMBER.price})`, inline: true },
        { name: "Expected Role", value: INNER_CIRCLE_MEMBER.expectedRole, inline: true },
        { name: "Status", value: "✅ Email Sent - Awaiting YouTube Connection", inline: false }
      ],
      footer: { text: "YouTube → Discord Bridge • Inner Circle Test" },
      timestamp: new Date().toISOString()
    };

    const response = await sendWebhook(WEBHOOK_URL, { embeds: [embed] });
    
    if (response.status >= 200 && response.status < 300) {
      console.log('   ✅ Webhook sent successfully!');
      console.log('   📱 Check your Discord #youtube-verifications channel');
    } else {
      console.log(`   ❌ Webhook failed (${response.status})`);
    }
  } catch (error) {
    console.log(`   ❌ Webhook error: ${error.message}`);
  }
}

/**
 * Test email content
 */
function testEmailContent() {
  console.log('   📧 Email should contain:');
  console.log('      ✅ Subject: "🔥 Discord Access Ready - Jesse ON FIRE"');
  console.log('      ✅ Personalized greeting with your YouTube username');
  console.log('      ✅ Discord invite button');
  console.log('      ✅ Step-by-step instructions');
  console.log('      ✅ Your Discord username confirmation');
  console.log('      ✅ Jesse ON FIRE branding');
  console.log('   📱 Check your email inbox (and spam folder)');
}

/**
 * Test role assignment logic
 */
function testRoleAssignment() {
  console.log('   🎭 Role Assignment for Inner Circle:');
  console.log(`      Expected Role: "${INNER_CIRCLE_MEMBER.expectedRole}"`);
  console.log('      Role Color: Orange (#FF5A1F)');
  console.log('      Permissions: Access to member-only channels');
  console.log('   🎯 Perks you should get:');
  
  INNER_CIRCLE_MEMBER.perks.forEach((perk, index) => {
    console.log(`      ${index + 1}. ${perk}`);
  });

  console.log('\n   📋 Discord Connection Steps:');
  console.log('      1. Join Discord via email invite');
  console.log('      2. Go to User Settings (gear icon)');
  console.log('      3. Click "Connections" in sidebar');
  console.log('      4. Click "Add" next to YouTube');
  console.log('      5. Sign in with your YouTube account');
  console.log('      6. Wait 2-3 minutes for role assignment');
}

/**
 * Send webhook helper
 */
async function sendWebhook(webhookUrl, payload) {
  return new Promise((resolve, reject) => {
    const url = new URL(webhookUrl);
    const data = JSON.stringify(payload);
    
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => resolve({
        status: res.statusCode,
        statusText: res.statusMessage,
        data: responseData
      }));
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Run the test
testInnerCircleFlow().catch(console.error);
