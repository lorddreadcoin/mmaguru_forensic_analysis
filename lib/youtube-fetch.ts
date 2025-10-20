/**
 * YouTube Data Fetcher - Automatically gets video data from URLs
 */

export interface YouTubeVideoData {
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
 * Extract video ID from any YouTube URL format
 */
export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Format view count (e.g., 141234 → "141K views")
 */
function formatViews(viewCount: string): string {
  const num = parseInt(viewCount);
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M views`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K views`;
  }
  return `${num} views`;
}

/**
 * Format upload date (e.g., "2024-10-18T10:00:00Z" → "18 hours ago")
 */
function formatUploadDate(publishedAt: string): string {
  const now = new Date();
  const published = new Date(publishedAt);
  const diffMs = now.getTime() - published.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffHours < 24) {
    return `${diffHours} hours ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffWeeks < 4) {
    return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
  } else {
    return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  }
}

/**
 * Format duration (ISO 8601 → "28:35")
 */
function formatDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";

  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Fetch video data from YouTube API
 */
export async function fetchVideoData(
  videoUrls: string[],
  categories?: string[]
): Promise<YouTubeVideoData[]> {
  const apiKey = process.env.YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  
  if (!apiKey) {
    console.error('YouTube API key not found');
    return [];
  }

  // Extract video IDs
  const videoIds = videoUrls
    .map(url => extractVideoId(url))
    .filter((id): id is string => id !== null);

  if (videoIds.length === 0) {
    return [];
  }

  try {
    // Fetch video details from YouTube API
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoIds.join(',')}&part=snippet,contentDetails,statistics&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform API response to our format
    return data.items.map((item: any, index: number) => ({
      id: index + 1,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.maxres?.url || 
                 item.snippet.thumbnails.high?.url || 
                 `https://i.ytimg.com/vi/${item.id}/maxresdefault.jpg`,
      views: formatViews(item.statistics.viewCount),
      duration: formatDuration(item.contentDetails.duration),
      uploadDate: formatUploadDate(item.snippet.publishedAt),
      url: `https://youtu.be/${item.id}`,
      category: categories?.[index] || "LATEST",
      isNew: index < 2 // First 2 videos marked as "NEW"
    }));

  } catch (error) {
    console.error('Error fetching YouTube data:', error);
    return [];
  }
}
