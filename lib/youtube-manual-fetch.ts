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
