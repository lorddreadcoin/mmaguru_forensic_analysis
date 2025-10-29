#!/usr/bin/env node

/**
 * 🔍 Real Issue Diagnosis - Check actual environment and email setup
 */

const https = require('https');

async function diagnoseRealIssue() {
  console.log('🔍 REAL DIAGNOSIS - Checking actual system state\n');
  
  // Test 1: Check if API returns detailed error info
  console.log('📋 Test 1: API Response Analysis');
  const response = await testAPIWithLogging();
  
  // Test 2: Check environment variables (what we can see)
  console.log('\n📋 Test 2: Environment Check');
  checkEnvironmentHints();
  
  // Test 3: Check if Resend is actually configured
  console.log('\n📋 Test 3: Email Service Check');
  await checkEmailService();
  
  console.log('\n🎯 DIAGNOSIS COMPLETE');
  console.log('Check the results above to see what\'s actually failing.');
}

async function testAPIWithLogging() {
  const testData = {
    youtubeUsername: '@DiagnosisTest',
    discordUsername: 'diagnosis#1234',
    email: 'diagnosis@example.com'
  };

  const postData = JSON.stringify(testData);
  
  return new Promise((resolve, reject) => {
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
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log(`   Status: ${res.statusCode}`);
        console.log(`   Headers: ${JSON.stringify(res.headers, null, 2)}`);
        console.log(`   Body: ${data}`);
        
        try {
          const parsed = JSON.parse(data);
          if (parsed.success === true && res.statusCode === 200) {
            console.log('   ✅ API returns success - but emails may not be sending');
          } else {
            console.log('   ❌ API is failing');
          }
        } catch (e) {
          console.log('   ❌ Invalid JSON response');
        }
        
        resolve({ status: res.statusCode, data, headers: res.headers });
      });
    });

    req.on('error', (error) => {
      console.log(`   💥 Request failed: ${error.message}`);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

function checkEnvironmentHints() {
  console.log('   🔍 Based on your code structure:');
  console.log('   - Your API tries to use RESEND_API_KEY if available');
  console.log('   - Falls back to Discord webhook if no Resend key');
  console.log('   - Returns success:true even if email fails');
  console.log('   ');
  console.log('   ❓ Questions to answer:');
  console.log('   1. Do you have RESEND_API_KEY set in Vercel environment?');
  console.log('   2. Do you have DISCORD_WEBHOOK_URL set in Vercel environment?');
  console.log('   3. Are you checking the right email address?');
}

async function checkEmailService() {
  console.log('   🔍 Email Service Analysis:');
  console.log('   ');
  console.log('   Your code does this:');
  console.log('   1. IF RESEND_API_KEY exists → Try to send email');
  console.log('   2. IF email fails → Log error but continue');
  console.log('   3. IF no RESEND_API_KEY → Try Discord webhook');
  console.log('   4. ALWAYS return success:true');
  console.log('   ');
  console.log('   🚨 PROBLEM: Your API hides email failures!');
  console.log('   ');
  console.log('   Possible issues:');
  console.log('   ❌ No RESEND_API_KEY configured');
  console.log('   ❌ Invalid RESEND_API_KEY');
  console.log('   ❌ Resend domain not verified');
  console.log('   ❌ Email going to spam');
  console.log('   ❌ Discord webhook not configured as fallback');
}

diagnoseRealIssue().catch(console.error);
