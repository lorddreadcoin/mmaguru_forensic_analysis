#!/usr/bin/env node

/**
 * 🔥 Discord Webhook Tester for Jesse ON FIRE YouTube Bridge
 * 
 * This script tests your Discord webhook integration without needing Jest setup.
 * Run with: node scripts/test-discord-webhook.js
 */

const https = require('https');
const { URL } = require('url');

// Test configuration
const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || 'https://discord.com/api/webhooks/YOUR_WEBHOOK_URL';
const TEST_DATA = {
  innerCircle: {
    youtubeUsername: '@TestInnerCircle',
    discordUsername: 'testinner#1234',
    email: 'test.inner@example.com',
    tier: 'Inner Circle',
    price: '$4.99'
  },
  bestFriends: {
    youtubeUsername: '@TestBestFriend', 
    discordUsername: 'testbest#5678',
    email: 'test.best@example.com',
    tier: 'Best Friends',
    price: '$9.99'
  },
  youLoveMe: {
    youtubeUsername: '@TestYouLoveMe',
    discordUsername: 'testlove#9999', 
    email: 'test.love@example.com',
    tier: 'You Love Me & You Know It',
    price: '$24.99'
  }
};

/**
 * Send a test webhook to Discord
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
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          statusText: res.statusMessage,
          data: responseData
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

/**
 * Create Discord embed for YouTube member verification
 */
function createMemberEmbed(member, testType = 'verification') {
  const embedColor = 0xFF5A1F; // Jesse's fire orange
  
  const baseEmbed = {
    title: "🎮 New YouTube Member Verification",
    color: embedColor,
    fields: [
      { name: "YouTube", value: member.youtubeUsername, inline: true },
      { name: "Discord", value: member.discordUsername, inline: true },
      { name: "Email", value: member.email, inline: true },
      { name: "Tier", value: `${member.tier} (${member.price})`, inline: true },
      { name: "Status", value: "✅ Email Sent - Awaiting YouTube Connection", inline: false }
    ],
    footer: { text: "YouTube → Discord Bridge" },
    timestamp: new Date().toISOString()
  };

  if (testType === 'success') {
    baseEmbed.title = "🎉 YouTube Member Connected Successfully";
    baseEmbed.fields[4].value = "✅ Connected - Role Assigned";
    baseEmbed.color = 0x00FF00; // Green for success
  } else if (testType === 'error') {
    baseEmbed.title = "❌ YouTube Member Verification Failed";
    baseEmbed.fields[4].value = "❌ Connection Failed - Manual Review Required";
    baseEmbed.color = 0xFF0000; // Red for error
  }

  return baseEmbed;
}

/**
 * Run all webhook tests
 */
async function runTests() {
  console.log('🔥 Starting Discord Webhook Tests for Jesse ON FIRE YouTube Bridge\n');
  
  if (WEBHOOK_URL.includes('YOUR_WEBHOOK_URL')) {
    console.log('❌ Please set DISCORD_WEBHOOK_URL environment variable or update the script');
    console.log('   Example: DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxx/yyy node scripts/test-discord-webhook.js');
    return;
  }

  const tests = [
    {
      name: 'Inner Circle Member Verification',
      member: TEST_DATA.innerCircle,
      type: 'verification'
    },
    {
      name: 'Best Friends Member Verification', 
      member: TEST_DATA.bestFriends,
      type: 'verification'
    },
    {
      name: 'You Love Me Member Verification',
      member: TEST_DATA.youLoveMe,
      type: 'verification'
    },
    {
      name: 'Successful Connection',
      member: TEST_DATA.innerCircle,
      type: 'success'
    },
    {
      name: 'Failed Connection',
      member: TEST_DATA.bestFriends,
      type: 'error'
    }
  ];

  let passedTests = 0;
  let failedTests = 0;

  for (const test of tests) {
    try {
      console.log(`🧪 Testing: ${test.name}`);
      
      const embed = createMemberEmbed(test.member, test.type);
      const payload = { embeds: [embed] };
      
      const response = await sendWebhook(WEBHOOK_URL, payload);
      
      if (response.status >= 200 && response.status < 300) {
        console.log(`   ✅ SUCCESS (${response.status})`);
        passedTests++;
      } else {
        console.log(`   ❌ FAILED (${response.status}): ${response.statusText}`);
        failedTests++;
      }
      
      // Wait 1 second between tests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}`);
      failedTests++;
    }
  }

  console.log('\n📊 Test Results:');
  console.log(`   ✅ Passed: ${passedTests}`);
  console.log(`   ❌ Failed: ${failedTests}`);
  console.log(`   📈 Success Rate: ${Math.round((passedTests / (passedTests + failedTests)) * 100)}%`);

  if (passedTests === tests.length) {
    console.log('\n🎉 All tests passed! Your Discord webhook is working perfectly.');
    console.log('   Check your Discord #youtube-verifications channel for the test messages.');
  } else {
    console.log('\n⚠️  Some tests failed. Check your webhook URL and Discord server settings.');
  }
}

/**
 * Test a single webhook with custom data
 */
async function testSingleWebhook(youtubeUsername, discordUsername, email) {
  console.log('🔥 Testing Single Webhook\n');
  
  const member = {
    youtubeUsername: youtubeUsername || '@TestUser',
    discordUsername: discordUsername || 'testuser#1234',
    email: email || 'test@example.com',
    tier: 'Inner Circle',
    price: '$4.99'
  };

  try {
    const embed = createMemberEmbed(member, 'verification');
    const payload = { embeds: [embed] };
    
    console.log('📤 Sending webhook...');
    const response = await sendWebhook(WEBHOOK_URL, payload);
    
    if (response.status >= 200 && response.status < 300) {
      console.log(`✅ Webhook sent successfully! (${response.status})`);
      console.log('   Check your Discord channel for the message.');
    } else {
      console.log(`❌ Webhook failed (${response.status}): ${response.statusText}`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

// Command line interface
const args = process.argv.slice(2);

if (args.length === 0) {
  runTests();
} else if (args[0] === 'single') {
  testSingleWebhook(args[1], args[2], args[3]);
} else if (args[0] === 'help') {
  console.log('🔥 Discord Webhook Tester Usage:');
  console.log('');
  console.log('  Run all tests:');
  console.log('    node scripts/test-discord-webhook.js');
  console.log('');
  console.log('  Test single webhook:');
  console.log('    node scripts/test-discord-webhook.js single [@youtube] [discord#1234] [email@example.com]');
  console.log('');
  console.log('  Show help:');
  console.log('    node scripts/test-discord-webhook.js help');
  console.log('');
  console.log('  Environment Variables:');
  console.log('    DISCORD_WEBHOOK_URL - Your Discord webhook URL');
} else {
  console.log('❌ Unknown command. Use "help" for usage information.');
}
