/**
 * Netlify Serverless Function to fetch YouTube RSS feed
 * This bypasses CORS issues by fetching server-side
 */

exports.handler = async (event, context) => {
  const channelId = 'UCy30JRSgfhYXA6i6xX1erWg';
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

  try {
    console.log('Fetching RSS feed from:', rssUrl);
    
    const response = await fetch(rssUrl);
    
    if (!response.ok) {
      throw new Error(`RSS fetch failed: ${response.status}`);
    }

    const xmlText = await response.text();
    
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
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Failed to fetch RSS feed',
        message: error.message
      })
    };
  }
};
