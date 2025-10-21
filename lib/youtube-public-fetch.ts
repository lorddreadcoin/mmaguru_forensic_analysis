/**
 * YouTube Public Data Fetcher - NO API KEY REQUIRED
 * Uses public RSS feeds and oEmbed API
 */

export interface VideoData {
  id: number;
  title: string;
  thumbnail: string;
  views: string;
  duration: string;
  uploadDate: string;
  url: string;
  category: string;
  isNew?: boolean;
}

/**
 * Extract video ID from YouTube URL
 */
export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
}

/**
 * Fetch latest videos from Jesse's public RSS feed
 * Channel ID: UCy30JRSgfhYXA6i6xX1erWg
 */
export async function fetchLatestVideosFromRSS(limit = 6): Promise<VideoData[]> {
  // Jesse ON FIRE's actual channel ID from youtube.com/@RealJesseONFIRE
  const channelId = 'UCL1ULuUKdktFDpe66_A3H2A';

  // Prefer absolute Netlify Function URL if available (works at runtime)
  const baseUrl = process.env.URL || process.env.DEPLOY_URL || process.env.NEXT_PUBLIC_SITE_URL;
  const functionUrl = baseUrl ? `${baseUrl}/.netlify/functions/youtube-rss` : '';

  // If we have a function URL use it, else hit YouTube RSS directly with headers
  const rssUrl = functionUrl || `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

  try {
    console.log('Fetching RSS feed from:', rssUrl);
    const response = await fetch(rssUrl, {
      // When calling YouTube directly, set a browser-like UA to avoid 404/blocks
      headers: functionUrl
        ? undefined
        : {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Accept: 'application/xml, text/xml, */*',
            'Accept-Language': 'en-US,en;q=0.9'
          },
      next: { revalidate: 0 }
    });

    console.log('RSS Response status:', response.status);

    if (!response.ok) {
      throw new Error(`RSS fetch failed: ${response.status} ${response.statusText}`);
    }

    const xmlText = await response.text();
    console.log('RSS XML length:', xmlText.length);

    // Parse RSS feed (XML)
    const videos: VideoData[] = [];
    const entryRegex = /<entry>[\s\S]*?<\/entry>/g;
    const entries = xmlText.match(entryRegex) || [];

    console.log('Found RSS entries:', entries.length);

    for (let i = 0; i < Math.min(entries.length, limit); i++) {
      const entry = entries[i];

      // Extract video data from XML
      const videoId = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1];
      const title = entry.match(/<title>(.*?)<\/title>/)?.[1];
      const publishedAt = entry.match(/<published>(.*?)<\/published>/)?.[1];

      console.log(`Video ${i + 1}:`, { videoId, title: title?.substring(0, 50) });

      if (!videoId || !title) continue;

      videos.push({
        id: i + 1,
        title: decodeHTMLEntities(title),
        thumbnail: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
        views: "Loading...", // RSS doesn't have views
        duration: "▶", // RSS doesn't have duration
        uploadDate: formatUploadDate(publishedAt || ''),
        url: `https://youtu.be/${videoId}`,
        category: i < 2 ? "NEW" : "LATEST",
        isNew: i < 2
      });
    }

    console.log('Successfully parsed videos:', videos.length);
    
    // If we got valid videos, return them
    if (videos.length > 0) {
      return videos;
    }
    
    // Otherwise fall back
    throw new Error('No videos found in RSS feed');

  } catch (error) {
    console.error('RSS feed fetch failed:', error);
    console.error('Falling back to hardcoded videos');
    return getFallbackVideos(); // Return fallback if RSS fails
  }
}

/**
 * Fetch video details using oEmbed (public, no API key)
 */
export async function enrichVideoData(videoUrl: string): Promise<Partial<VideoData>> {
  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`
    );

    if (!response.ok) return {};

    const data = await response.json();
    return {
      title: data.title,
      thumbnail: data.thumbnail_url.replace('hqdefault', 'maxresdefault')
    };

  } catch (error) {
    return {};
  }
}

/**
 * Format upload date
 */
function formatUploadDate(dateString: string): string {
  if (!dateString) return "Recently";

  const now = new Date();
  const published = new Date(dateString);
  const diffMs = now.getTime() - published.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 24) {
    return `${diffHours} hours ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
}

/**
 * Decode HTML entities
 */
function decodeHTMLEntities(text: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'"
  };

  return text.replace(/&[^;]+;/g, match => entities[match] || match);
}

/**
 * Fallback videos if RSS fails - UPDATED WITH FRESH DATA
 */
export function getFallbackVideos(): VideoData[] {
  // REAL videos with actual YouTube IDs - NO FAKE DATA
  return [
    {
      id: 1,
      title: "Was Tyler Robinson SET UP by HIS BOYFRIEND??? NEW VIDEO of SUSPECT Matches his DESCRIPTION!",
      thumbnail: "https://i.ytimg.com/vi/DiiXCi--ryI/maxresdefault.jpg",
      views: "141K views",
      duration: "28:35",
      uploadDate: "18 hours ago",
      url: "https://youtu.be/DiiXCi--ryI",
      category: "TRUE CRIME",
      isNew: true
    },
    {
      id: 2,
      title: "Alex Jones Gives TERRIFYING Update!! SHOCKING Epstein News has Elites SCRAMBLING to EXPLAIN!!",
      thumbnail: "https://i.ytimg.com/vi/sFj-v4qu6xg/maxresdefault.jpg",
      views: "104K views",
      duration: "26:47",
      uploadDate: "1 day ago",
      url: "https://youtu.be/sFj-v4qu6xg",
      category: "CONSPIRACY",
      isNew: true
    },
    {
      id: 3,
      title: "The WORLD will BURN after WHAT JUST HAPPENED! Watch this Video IMMEDIATELY! ...NOT Clickbait",
      thumbnail: "https://i.ytimg.com/vi/F5LI3PKL_Rk/maxresdefault.jpg",
      views: "379K views",
      duration: "26:44",
      uploadDate: "6 days ago",
      url: "https://youtu.be/F5LI3PKL_Rk",
      category: "BREAKING NEWS"
    },
    {
      id: 4,
      title: "BOMBSHELL Change to FBI's Official Story on Charlie Kirk! Robinson CHARGED w WITNESS TAMPERING!",
      thumbnail: "https://i.ytimg.com/vi/AloqDcz7hU4/maxresdefault.jpg",
      views: "91K views",
      duration: "17:45",
      uploadDate: "7 days ago",
      url: "https://youtu.be/AloqDcz7hU4",
      category: "INVESTIGATION"
    },
    {
      id: 5,
      title: "China is BEHIND Charlie Kirk's ASSASSINATION!! -US Congresswoman Anna Paulina Luna!!",
      thumbnail: "https://i.ytimg.com/vi/vjZzvEh4VJY/maxresdefault.jpg",
      views: "72K views",
      duration: "30:57",
      uploadDate: "4 days ago",
      url: "https://youtu.be/vjZzvEh4VJY",
      category: "POLITICS"
    },
    {
      id: 6,
      title: "NEW SUSPECTS in Charlie Kirk Assassination Attempt! This is INSANE!",
      thumbnail: "https://i.ytimg.com/vi/6q2CYqUPZ5c/maxresdefault.jpg",
      views: "214K views",
      duration: "24:15",
      uploadDate: "5 days ago",
      url: "https://youtu.be/6q2CYqUPZ5c",
      category: "BREAKING"
    }
  ];
}
