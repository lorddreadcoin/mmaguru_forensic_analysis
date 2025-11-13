// YouTube CSV Parser
import Papa from 'papaparse';

export interface YouTubeMetrics {
  totalViews: number;
  totalWatchTime: number;
  totalRevenue: number;
  totalSubscribers: number;
  averageCTR: number;
  videoCount: number;
  topVideos: VideoPerformance[];
  dailyStats?: DailyStat[];
}

export interface VideoPerformance {
  title: string;
  videoId: string;
  views: number;
  watchTime: number;
  revenue: number;
  ctr: number;
  publishDate: string;
}

export interface DailyStat {
  date: string;
  views: number;
}

/**
 * Parse YouTube Studio CSV export
 */
export async function parseYouTubeCSV(file: File): Promise<YouTubeMetrics> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const metrics = processCSVData(results.data);
          resolve(metrics);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}

/**
 * Process parsed CSV data into structured metrics
 */
function processCSVData(data: any[]): YouTubeMetrics {
  // Check if this is a video performance table or daily stats
  const firstRow = data[0];
  
  if (firstRow['Video title'] || firstRow['Content']) {
    return parseVideoPerformanceData(data);
  } else if (firstRow['Date'] && firstRow['Views']) {
    return parseDailyStatsData(data);
  } else {
    throw new Error('Unknown CSV format. Please upload YouTube Studio export.');
  }
}

/**
 * Parse video performance data (Table data.csv)
 */
function parseVideoPerformanceData(data: any[]): YouTubeMetrics {
  const videos: VideoPerformance[] = [];
  let totalViews = 0;
  let totalWatchTime = 0;
  let totalRevenue = 0;
  let totalSubscribers = 0;
  let totalCTR = 0;
  let ctrCount = 0;

  for (const row of data) {
    // Skip the "Total" row
    if (row['Video title'] === '' && row['Content'] === 'Total') {
      totalViews = parseNumber(row['Views']);
      totalWatchTime = parseNumber(row['Watch time (hours)']);
      totalRevenue = parseNumber(row['Estimated revenue (USD)']);
      totalSubscribers = parseNumber(row['Subscribers']);
      continue;
    }

    const title = row['Video title'];
    const videoId = row['Content'];
    
    if (!title || !videoId) continue;

    const views = parseNumber(row['Views']);
    const watchTime = parseNumber(row['Watch time (hours)']);
    const revenue = parseNumber(row['Estimated revenue (USD)']);
    const ctr = parseNumber(row['Impressions click-through rate (%)']);

    videos.push({
      title,
      videoId,
      views,
      watchTime,
      revenue,
      ctr,
      publishDate: row['Video publish time'] || ''
    });

    if (ctr > 0) {
      totalCTR += ctr;
      ctrCount++;
    }
  }

  return {
    totalViews,
    totalWatchTime,
    totalRevenue,
    totalSubscribers,
    averageCTR: ctrCount > 0 ? totalCTR / ctrCount : 0,
    videoCount: videos.length,
    topVideos: videos.sort((a, b) => b.views - a.views).slice(0, 20)
  };
}

/**
 * Parse daily statistics data (Totals.csv)
 */
function parseDailyStatsData(data: any[]): YouTubeMetrics {
  const dailyStats: DailyStat[] = [];
  let totalViews = 0;

  for (const row of data) {
    const date = row['Date'];
    const views = parseNumber(row['Views']);
    
    if (date && views > 0) {
      dailyStats.push({ date, views });
      totalViews += views;
    }
  }

  return {
    totalViews,
    totalWatchTime: 0,
    totalRevenue: 0,
    totalSubscribers: 0,
    averageCTR: 0,
    videoCount: 0,
    topVideos: [],
    dailyStats
  };
}

/**
 * Helper to parse numbers from CSV strings
 */
function parseNumber(value: any): number {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  
  // Remove commas and convert to number
  const cleaned = String(value).replace(/,/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * Merge multiple CSV files (e.g., video data + daily stats)
 */
export function mergeMetrics(metrics: YouTubeMetrics[]): YouTubeMetrics {
  const merged: YouTubeMetrics = {
    totalViews: 0,
    totalWatchTime: 0,
    totalRevenue: 0,
    totalSubscribers: 0,
    averageCTR: 0,
    videoCount: 0,
    topVideos: [],
    dailyStats: []
  };

  let ctrSum = 0;
  let ctrCount = 0;

  for (const metric of metrics) {
    merged.totalViews += metric.totalViews;
    merged.totalWatchTime += metric.totalWatchTime;
    merged.totalRevenue += metric.totalRevenue;
    merged.totalSubscribers = Math.max(merged.totalSubscribers, metric.totalSubscribers);
    
    if (metric.averageCTR > 0) {
      ctrSum += metric.averageCTR;
      ctrCount++;
    }
    
    if (metric.topVideos.length > 0) {
      merged.topVideos.push(...metric.topVideos);
    }
    
    if (metric.dailyStats) {
      merged.dailyStats!.push(...metric.dailyStats);
    }
  }

  merged.averageCTR = ctrCount > 0 ? ctrSum / ctrCount : 0;
  merged.videoCount = merged.topVideos.length;
  merged.topVideos = merged.topVideos
    .sort((a, b) => b.views - a.views)
    .slice(0, 20);

  return merged;
}
