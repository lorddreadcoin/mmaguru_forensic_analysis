/**
 * Manual YouTube video fetch system - NO API KEY NEEDED
 * Just update the data/latest-videos.json file when you want fresh videos
 */

// Define VideoData type (matching what VideoCarousel expects)
export interface VideoData {
  id: number
  title: string
  thumbnail: string
  views: string
  duration: string
  uploadDate: string
  url: string
  category: string
  isNew?: boolean
}

import latestVideosData from '@/data/latest-videos.json';

/**
 * Fetch videos from local JSON file - NEVER BLOCKED!
 */
export async function fetchVideosFromJSON(): Promise<VideoData[]> {
  try {
    // Read from our local JSON file
    const videos = latestVideosData.videos.map((video, index) => ({
      id: index + 1,
      title: video.title,
      thumbnail: `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`,
      views: video.views + ' views',
      duration: video.duration,
      uploadDate: video.uploadedAgo,
      url: `https://youtu.be/${video.id}`,
      category: index < 2 ? "NEW" : "LATEST",
      isNew: index < 2
    }));

    console.log(`Loaded ${videos.length} videos from local JSON (last updated: ${latestVideosData.lastUpdated})`);
    return videos;
  } catch (error) {
    console.error('Failed to load videos from JSON:', error);
    return getFallbackVideos();
  }
}

/**
 * Alternative: Fetch using YouTube's public oEmbed API (no key needed)
 */
export async function fetchVideoDetailsPublic(videoId: string) {
  try {
    // This works without any API key!
    const response = await fetch(`https://www.youtube.com/oembed?url=https://youtube.com/watch?v=${videoId}&format=json`);
    
    if (!response.ok) throw new Error('oEmbed fetch failed');
    
    const data = await response.json();
    return {
      title: data.title,
      thumbnail: data.thumbnail_url?.replace('hqdefault', 'maxresdefault'),
      author: data.author_name
    };
  } catch (error) {
    console.error('oEmbed fetch failed:', error);
    return null;
  }
}

/**
 * Fallback videos (same as before - REAL DATA)
 */
function getFallbackVideos(): VideoData[] {
  return [
    {
      id: 1,
      title: "BOMBSHELLS in THOMAS CROOKS Case BREAKS THE INTERNET!!!",
      thumbnail: "https://i.ytimg.com/vi/xH4kV8DMEJs/maxresdefault.jpg",
      views: "112K views",
      duration: "23:10",
      uploadDate: "20 hours ago",
      url: "https://youtu.be/xH4kV8DMEJs",
      category: "BREAKING NEWS",
      isNew: true
    },
    {
      id: 2,
      title: "CANDACE OWENS ATTACKED by YOU KNOW WHO! TPUSA AUDIT IS INSANITY!",
      thumbnail: "https://i.ytimg.com/vi/rTUSA9nGx_M/maxresdefault.jpg",
      views: "53K views",
      duration: "18:23",
      uploadDate: "1 day ago",
      url: "https://youtu.be/rTUSA9nGx_M",
      category: "CONTROVERSY",
      isNew: true
    },
    {
      id: 3,
      title: "Trump SECRETLY TURNED EPSTEIN in to POLICE in 2004! ...but NOW is Believing...",
      thumbnail: "https://i.ytimg.com/vi/pQEJ7n5dH8k/maxresdefault.jpg",
      views: "45K views",
      duration: "25:21",
      uploadDate: "1 day ago",
      url: "https://youtu.be/pQEJ7n5dH8k",
      category: "INVESTIGATION"
    },
    {
      id: 4,
      title: "BOMBSHELL in Epstein/Trump Email SCANDAL! The REAL REASON Epstein...",
      thumbnail: "https://i.ytimg.com/vi/BnL4RQxUzKI/maxresdefault.jpg",
      views: "95K views",
      duration: "27:05",
      uploadDate: "2 days ago",
      url: "https://youtu.be/BnL4RQxUzKI",
      category: "SCANDAL"
    },
    {
      id: 5,
      title: "TPUSA EVENT ATTACKED ♦ Rob O'Neill SUES JAKE PAUL Request for $25,000,000!!!",
      thumbnail: "https://i.ytimg.com/vi/vN3QcJqP8zA/maxresdefault.jpg",
      views: "44K views",
      duration: "32:25",
      uploadDate: "3 days ago",
      url: "https://youtu.be/vN3QcJqP8zA",
      category: "BREAKING NEWS"
    },
    {
      id: 6,
      title: "TPUSA CHAOS & FIGHTING UNCENSORED MEMES VIDEOS!",
      thumbnail: "https://i.ytimg.com/vi/8HcZ_6JRtXw/maxresdefault.jpg",
      views: "38K views",
      duration: "6:22",
      uploadDate: "1 day ago",
      url: "https://youtu.be/8HcZ_6JRtXw",
      category: "EXCLUSIVE"
    },
    {
      id: 7,
      title: "CIA Agent says 'Charlie KIRKS KILLER did NOT act alone!' WHAT is the DEEP STATE...",
      thumbnail: "https://i.ytimg.com/vi/KjN5sRQ7mHc/maxresdefault.jpg",
      views: "52K views",
      duration: "24:27",
      uploadDate: "4 days ago",
      url: "https://youtu.be/KjN5sRQ7mHc",
      category: "CONSPIRACY"
    },
    {
      id: 8,
      title: "Candace Owens' Text Claims EXPOSED ♦ Alex Jones' TERRIFYING Update FROM...",
      thumbnail: "https://i.ytimg.com/vi/zFLxP9cN8xE/maxresdefault.jpg",
      views: "129K views",
      duration: "21:45",
      uploadDate: "4 days ago",
      url: "https://youtu.be/zFLxP9cN8xE",
      category: "EXPOSED"
    }
  ];
}
