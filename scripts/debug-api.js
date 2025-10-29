#!/usr/bin/env node

/**
 * 🔍 Debug API Endpoint - Test YouTube Verify API Directly
 * 
 * This script tests your /api/youtube-verify endpoint to see what's happening
 * Run with: node scripts/debug-api.js
 */

const https = require('https');
const { URL } = require('url');

// Test data - replace with what you actually submitted
const TEST_SUBMISSION = {
  youtubeUsername: '@YourActualHandle',  // Replace with what you entered
  discordUsername: 'yourdiscord#1234',   // Replace with what you entered  
  email: 'your.actual@email.com'         // Replace with what you entered
};

const API_URL = 'https://jesseonfire.vercel.app/api/youtube-verify';

/**
 * Test the API endpoint directly
 */
async function testAPIEndpoint() {
  console.log('🔍 Debugging YouTube Verify API\n');
  
  console.log('📤 Testing with data:');
  console.log(`   YouTube: ${TEST_SUBMISSION.youtubeUsername}`);
  console.log(`   Discord: ${TEST_SUBMISSION.discordUsername}`);
  console.log(`   Email: ${TEST_SUBMISSION.email}\n`);

  try {
    console.log('🌐 Sending POST request to API...');
    const response = await sendAPIRequest(API_URL, TEST_SUBMISSION);
    
    console.log(`📊 Response Status: ${response.status} ${response.statusText}`);
    console.log('📄 Response Body:');
    console.log(response.data);
    
    if (response.status === 200) {
      console.log('\n✅ API call succeeded!');
      console.log('📧 Email should have been sent');
      console.log('🔍 Check your email inbox and spam folder');
    } else {
      console.log('\n❌ API call failed!');
      console.log('🚨 This explains why you didn\'t receive an email');
    }
    
  } catch (error) {
    console.log('\n💥 API Error:');
    console.log(error.message);
    console.log('\n🚨 This explains why you didn\'t receive an email');
  }
}

/**
 * Send API request
 */
async function sendAPIRequest(apiUrl, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(apiUrl);
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({
            status: res.statusCode,
            statusText: res.statusMessage,
            data: parsedData
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            statusText: res.statusMessage,
            data: responseData
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Test with different scenarios
 */
async function runDiagnostics() {
  console.log('🔧 Running Diagnostics\n');
  
  // Test 1: Valid submission
  console.log('🧪 Test 1: Valid submission');
  await testAPIEndpoint();
  
  // Test 2: Missing fields
  console.log('\n🧪 Test 2: Missing fields (should fail)');
  try {
    const response = await sendAPIRequest(API_URL, {
      youtubeUsername: '',
      discordUsername: TEST_SUBMISSION.discordUsername,
      email: TEST_SUBMISSION.email
    });
    console.log(`   Status: ${response.status} - ${JSON.stringify(response.data)}`);
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }
  
  // Test 3: Invalid email
  console.log('\n🧪 Test 3: Invalid email (should still work)');
  try {
    const response = await sendAPIRequest(API_URL, {
      youtubeUsername: TEST_SUBMISSION.youtubeUsername,
      discordUsername: TEST_SUBMISSION.discordUsername,
      email: 'invalid-email'
    });
    console.log(`   Status: ${response.status} - ${JSON.stringify(response.data)}`);
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }
  
  console.log('\n📋 Diagnostic Summary:');
  console.log('1. If Test 1 returns status 200 → API works, check email settings');
  console.log('2. If Test 1 returns status 500 → Server error, check logs');
  console.log('3. If Test 1 returns status 400 → Invalid data format');
  console.log('4. If Test 1 fails completely → Network/deployment issue');
}

// Command line interface
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('🔍 Choose a test:');
  console.log('');
  console.log('  Test API with your data:');
  console.log('    node scripts/debug-api.js test');
  console.log('');
  console.log('  Run full diagnostics:');
  console.log('    node scripts/debug-api.js diagnostics');
  console.log('');
  console.log('  Update test data first in the script!');
} else if (args[0] === 'test') {
  testAPIEndpoint();
} else if (args[0] === 'diagnostics') {
  runDiagnostics();
} else {
  console.log('❌ Unknown command. Use "test" or "diagnostics"');
}
