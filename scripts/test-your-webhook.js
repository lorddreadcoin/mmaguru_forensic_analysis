#!/usr/bin/env node

/**
 * 🔥 Test Your Actual Webhook - Using your real Discord webhook
 */

const https = require('https');
const { URL } = require('url');

const YOUR_WEBHOOK_URL = 'https://discord.com/api/webhooks/1432886190415282366/yVLVaur3KWGv0DdKjOzAxST8mbCrIRaKzXId_opQFtIbPZaSLmNkwwfml1kqLhR6sXBI';

async function testYourWebhook() {
  console.log('🔥 Testing Your Actual Discord Webhook\n');
  
  const testEmbed = {
    embeds: [{
      title: "🧪 Webhook Test - Jesse ON FIRE",
      color: 0xFF5A1F, // Fire orange
      fields: [
        { name: "Test Type", value: "Discord Webhook Verification", inline: true },
        { name: "Status", value: "✅ Testing Connection", inline: true },
        { name: "Time", value: new Date().toLocaleString(), inline: true }
      ],
      footer: { text: "YouTube Bridge Test" },
      timestamp: new Date().toISOString()
    }]
  };

  try {
    console.log('📤 Sending test message to Discord...');
    const response = await sendWebhook(YOUR_WEBHOOK_URL, testEmbed);
    
    if (response.status >= 200 && response.status < 300) {
      console.log('✅ SUCCESS! Webhook is working!');
      console.log('📱 Check your Discord channel for the test message');
      console.log(`   Status: ${response.status}`);
    } else {
      console.log(`❌ FAILED! Status: ${response.status}`);
      console.log(`   Response: ${response.data}`);
    }
  } catch (error) {
    console.log(`💥 ERROR: ${error.message}`);
  }
}

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

testYourWebhook();
