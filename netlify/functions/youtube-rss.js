/**
 * Netlify Serverless Function to fetch YouTube RSS feed
 * This bypasses CORS issues by fetching server-side
 */

exports.handler = async (event, context) => {
  // Jesse ON FIRE's actual channel ID from youtube.com/@RealJesseONFIRE
  const channelId = 'UCL1ULuUKdktFDpe66_A3H2A';
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

  try {
    console.log('Serverless function: Fetching RSS feed from:', rssUrl);
    
    const response = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/xml, text/xml, */*',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });
    
    console.log('RSS Response Status:', response.status);
    
    if (!response.ok) {
      // If RSS fails, we could fetch from YouTube directly here
      throw new Error(`RSS fetch failed: ${response.status}`);
    }

    const xmlText = await response.text();
    console.log('RSS XML Length:', xmlText.length);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        'Access-Control-Allow-Origin': '*'
      },
      body: xmlText
    };

  } catch (error) {
    console.error('RSS fetch error:', error);
    
    // Return error but let the frontend handle fallback
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Failed to fetch RSS feed',
        message: error.message,
        note: 'Frontend will use fallback videos'
      })
    };
  }
};
