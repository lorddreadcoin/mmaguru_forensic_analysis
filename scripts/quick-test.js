#!/usr/bin/env node

/**
 * 🔍 Quick API Test - Check if your API is working
 */

const https = require('https');

async function quickTest() {
  console.log('🔍 Testing your YouTube verify API...\n');
  
  const testData = {
    youtubeUsername: '@TestUser',
    discordUsername: 'test#1234', 
    email: 'test@example.com'
  };

  const postData = JSON.stringify(testData);
  
  const options = {
    hostname: 'jesseonfire.vercel.app',
    path: '/api/youtube-verify',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Response: ${data}`);
        resolve({ status: res.statusCode, data });
      });
    });

    req.on('error', (error) => {
      console.log(`Error: ${error.message}`);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

quickTest().catch(console.error);
