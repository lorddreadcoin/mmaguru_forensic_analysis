#!/usr/bin/env node

/**
 * 🔥 Test Complete YouTube Bridge Flow
 * 
 * This tests your actual system with real credentials
 */

const https = require('https');

async function testCompleteFlow() {
  console.log('🔥 Testing Complete YouTube Bridge Flow\n');
  
  // Test data - use your real info for actual testing
  const testData = {
    youtubeUsername: '@YourActualYouTubeHandle', // Replace with your real handle
    discordUsername: 'yourdiscord#1234',         // Replace with your real Discord
    email: 'lorddreadcoin@gmail.com'             // Your actual email
  };

  console.log('📋 Test Configuration:');
  console.log(`   YouTube: ${testData.youtubeUsername}`);
  console.log(`   Discord: ${testData.discordUsername}`);
  console.log(`   Email: ${testData.email}`);
  console.log('');

  try {
    console.log('🌐 Submitting to your YouTube verify API...');
    const response = await callYouTubeVerifyAPI(testData);
    
    console.log(`📊 API Response:`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Body: ${JSON.stringify(response.data, null, 2)}`);
    
    if (response.status === 200 && response.data.success) {
      console.log('\n✅ SUCCESS! The system is now working!');
      console.log('');
      console.log('📧 Check your email: lorddreadcoin@gmail.com');
      console.log('📱 Check your Discord channel for webhook notification');
      console.log('');
      console.log('🎯 Next Steps:');
      console.log('1. Check email for Discord invite link');
      console.log('2. Join Discord server via email link');
      console.log('3. Go to Discord Settings → Connections → Add YouTube');
      console.log('4. Sign in with your $4.99 Inner Circle YouTube account');
      console.log('5. Wait 2-3 minutes for automatic role assignment');
      console.log('6. Verify you get "Inner Circle" role');
    } else {
      console.log('\n❌ API call failed or returned error');
      console.log('Check the response above for details');
    }
    
  } catch (error) {
    console.log(`\n💥 ERROR: ${error.message}`);
  }
}

async function callYouTubeVerifyAPI(data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'jesseonfire.vercel.app',
      path: '/api/youtube-verify',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Instructions
console.log('🔥 YouTube Bridge Complete Flow Test');
console.log('');
console.log('⚠️  IMPORTANT: Update the test data in this script first!');
console.log('   - Replace @YourActualYouTubeHandle with your real YouTube handle');
console.log('   - Replace yourdiscord#1234 with your real Discord username');
console.log('   - Email is already set to lorddreadcoin@gmail.com');
console.log('');
console.log('📋 Prerequisites:');
console.log('   ✅ RESEND_API_KEY added to Vercel');
console.log('   ✅ DISCORD_WEBHOOK_URL added to Vercel');
console.log('   ✅ Site redeployed with new environment variables');
console.log('');

const args = process.argv.slice(2);
if (args[0] === 'run') {
  testCompleteFlow();
} else {
  console.log('🚀 Ready to test? Run: node scripts/test-complete-flow.js run');
}
