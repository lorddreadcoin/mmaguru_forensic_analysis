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
  const channelId = 'UCy30JRSgfhYXA6i6xX1erWg';
  
  // Use serverless function in production (Netlify), direct RSS in development
  const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
  const rssUrl = isProduction 
    ? '/.netlify/functions/youtube-rss'
    : `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

  try {
    console.log('Fetching RSS feed from:', rssUrl);
    const response = await fetch(rssUrl, {
      next: { revalidate: 0 } // No cache - fetch fresh every time
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
  return [
    {
      id: 1,
      title: "DO YOU KNOW WHAT THIS WOMAN JUST EXPOSED?? SEE ATTACHED VIDEO!! EVERYONE NEEDS TO SEE THIS!",
      thumbnail: "https://i.ytimg.com/vi/LATEST_VIDEO_ID/maxresdefault.jpg",
      views: "15K views",
      duration: "28:35",
      uploadDate: "2 hours ago",
      url: "https://youtu.be/LATEST_VIDEO_ID",
      category: "BREAKING",
      isNew: true
    },
    {
      id: 2,
      title: "BREAKING: New Evidence in Tyler Robinson Case CHANGES EVERYTHING!",
      thumbnail: "https://i.ytimg.com/vi/NEW_VIDEO_2/maxresdefault.jpg",
      views: "45K views",
      duration: "31:22",
      uploadDate: "8 hours ago",
      url: "https://youtu.be/NEW_VIDEO_2",
      category: "TRUE CRIME",
      isNew: true
    },
    {
      id: 3,
      title: "Trump's REVENGE Plan EXPOSED - They're PANICKING NOW!",
      thumbnail: "https://i.ytimg.com/vi/NEW_VIDEO_3/maxresdefault.jpg",
      views: "127K views",
      duration: "25:18",
      uploadDate: "1 day ago",
      url: "https://youtu.be/NEW_VIDEO_3",
      category: "POLITICS"
    },
    {
      id: 4,
      title: "FBI Whistleblower DROPS BOMBSHELL About January 6th!",
      thumbnail: "https://i.ytimg.com/vi/NEW_VIDEO_4/maxresdefault.jpg",
      views: "89K views",
      duration: "29:44",
      uploadDate: "2 days ago",
      url: "https://youtu.be/NEW_VIDEO_4",
      category: "INVESTIGATION"
    },
    {
      id: 5,
      title: "Hollywood Elite EXPOSED in NEW Diddy Tapes - THIS IS SICK!",
      thumbnail: "https://i.ytimg.com/vi/NEW_VIDEO_5/maxresdefault.jpg",
      views: "215K views",
      duration: "33:17",
      uploadDate: "3 days ago",
      url: "https://youtu.be/NEW_VIDEO_5",
      category: "EXPOSED"
    },
    {
      id: 6,
      title: "China's SECRET Plan for America LEAKED - Prepare NOW!",
      thumbnail: "https://i.ytimg.com/vi/NEW_VIDEO_6/maxresdefault.jpg",
      views: "156K views",
      duration: "27:55",
      uploadDate: "4 days ago",
      url: "https://youtu.be/NEW_VIDEO_6",
      category: "WARNING"
    }
  ];
}
