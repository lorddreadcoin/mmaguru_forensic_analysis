// Script to capture tutorial frames and create GIF
const puppeteer = require('puppeteer');
const GIFEncoder = require('gifencoder');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

async function captureTutorialFrames() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  
  // Navigate to tutorial
  await page.goto(`file:///${__dirname}/../public/tutorial.html`);
  
  console.log('📸 Capturing tutorial frames...');
  
  // Wait and capture frames over 20 seconds
  const frames = [];
  const totalDuration = 20000; // 20 seconds
  const frameCount = 100; // 5 fps
  const interval = totalDuration / frameCount;
  
  for (let i = 0; i < frameCount; i++) {
    await new Promise(resolve => setTimeout(resolve, interval));
    const screenshot = await page.screenshot();
    frames.push(screenshot);
    
    if (i % 10 === 0) {
      console.log(`  Frame ${i}/${frameCount}`);
    }
  }
  
  await browser.close();
  
  console.log('🎬 Creating GIF...');
  
  // Create GIF
  const encoder = new GIFEncoder(1280, 720);
  const stream = fs.createWriteStream(__dirname + '/../public/youtube-discord-tutorial.gif');
  
  encoder.createReadStream().pipe(stream);
  encoder.start();
  encoder.setRepeat(0); // Loop forever
  encoder.setDelay(200); // 200ms per frame = 5 fps
  encoder.setQuality(10);
  
  const canvas = createCanvas(1280, 720);
  const ctx = canvas.getContext('2d');
  
  for (const frame of frames) {
    const img = await loadImage(frame);
    ctx.drawImage(img, 0, 0);
    encoder.addFrame(ctx);
  }
  
  encoder.finish();
  
  console.log('✅ Tutorial GIF created: public/youtube-discord-tutorial.gif');
}

// Alternative: Use ffmpeg to create video
async function createVideo() {
  console.log('🎥 Creating MP4 video...');
  const { exec } = require('child_process');
  
  exec(`ffmpeg -f image2 -framerate 5 -i public/frames/frame-%03d.png -c:v libx264 -pix_fmt yuv420p public/youtube-discord-tutorial.mp4`, 
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      console.log('✅ Tutorial MP4 created: public/youtube-discord-tutorial.mp4');
    }
  );
}

// Run
captureTutorialFrames().catch(console.error);
