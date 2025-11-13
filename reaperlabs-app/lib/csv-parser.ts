// YouTube CSV Parser
import Papa from 'papaparse';

export interface YouTubeMetrics {
  totalViews: number;
  totalWatchTime: number;
  totalRevenue: number;
  averageCTR: number;
  videoCount: number;
  topVideos: VideoPerformance[];
  dailyViews?: any[];
}

export interface VideoPerformance {
  title: string;
  views: number;
  revenue: number;
  ctr: number;
  watchTime?: number;
}

export async function parseMultipleCSVs(files: File[]): Promise<YouTubeMetrics> {
  let metrics: YouTubeMetrics = {
    totalViews: 0,
    totalWatchTime: 0,
    totalRevenue: 0,
    averageCTR: 0,
    videoCount: 0,
    topVideos: []
  };
  
  // Parse each file and merge results
  for (const file of files) {
    const fileName = file.name.toLowerCase();
    const content = await file.text();
    
    if (fileName.includes('table')) {
      // Parse video-level data from Table_data.csv
      const videoData = await parseTableData(content);
      metrics = { ...metrics, ...videoData };
    } else if (fileName.includes('total')) {
      // Parse summary totals from Totals.csv
      const totals = await parseTotals(content);
      if (totals.views > 0) {
        metrics.totalViews = totals.views;
      }
    } else if (fileName.includes('chart')) {
      // Parse daily chart data from Chart_data.csv
      const chartData = await parseChartData(content);
      metrics.dailyViews = chartData;
    } else {
      // Try to parse as generic YouTube CSV
      const genericData = await parseGenericCSV(content);
      if (genericData.videoCount > 0) {
        metrics = { ...metrics, ...genericData };
      }
    }
  }
  
  return metrics;
}

// For backward compatibility - parse single file
export async function parseYouTubeCSV(file: File): Promise<YouTubeMetrics> {
  return parseMultipleCSVs([file]);
}

async function parseTableData(content: string): Promise<Partial<YouTubeMetrics>> {
  return new Promise((resolve) => {
    Papa.parse(content, {
      header: true,
      complete: (results) => {
        let totalViews = 0;
        let totalRevenue = 0;
        let totalWatchTime = 0;
        let totalCTR = 0;
        let ctrCount = 0;
        const videos: VideoPerformance[] = [];
        
        for (const row of results.data as any[]) {
          if (row['Content'] === 'Total') {
            // This is the totals row
            totalViews = parseNumber(row['Views']);
            totalRevenue = parseNumber(row['Estimated revenue (USD)']);
            totalWatchTime = parseNumber(row['Watch time (hours)']);
          } else if (row['Video title'] || row['Content']) {
            // Regular video row
            const title = row['Video title'] || row['Content'] || '';
            const views = parseNumber(row['Views']);
            const revenue = parseNumber(row['Estimated revenue (USD)']);
            const ctr = parseNumber(row['Impressions click-through rate (%)']);
            const watchTime = parseNumber(row['Watch time (hours)']);
            
            if (views > 0) {
              if (ctr > 0) {
                totalCTR += ctr;
                ctrCount++;
              }
              
              videos.push({
                title,
                views,
                revenue,
                ctr,
                watchTime
              });
            }
          }
        }
        
        resolve({
          totalViews: totalViews || videos.reduce((sum, v) => sum + v.views, 0),
          totalRevenue: totalRevenue || videos.reduce((sum, v) => sum + v.revenue, 0),
          totalWatchTime,
          averageCTR: ctrCount > 0 ? totalCTR / ctrCount : 0,
          videoCount: videos.length,
          topVideos: videos.sort((a, b) => b.views - a.views).slice(0, 10)
        });
      }
    });
  });
}

async function parseTotals(content: string): Promise<any> {
  return new Promise((resolve) => {
    Papa.parse(content, {
      header: true,
      complete: (results) => {
        let totalViews = 0;
        for (const row of results.data as any[]) {
          const views = parseNumber(row['Views']);
          totalViews += views;
        }
        resolve({ views: totalViews });
      }
    });
  });
}

async function parseChartData(content: string): Promise<any[]> {
  return new Promise((resolve) => {
    Papa.parse(content, {
      header: true,
      complete: (results) => {
        resolve(results.data);
      }
    });
  });
}

async function parseGenericCSV(content: string): Promise<Partial<YouTubeMetrics>> {
  return new Promise((resolve) => {
    Papa.parse(content, {
      header: true,
      complete: (results) => {
        const metrics = processCSVData(results.data);
        resolve(metrics);
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
  let totalCTR = 0;
  let ctrCount = 0;

  for (const row of data) {
    // Skip the "Total" row
    if (row['Video title'] === '' && row['Content'] === 'Total') {
      totalViews = parseNumber(row['Views']);
      totalWatchTime = parseNumber(row['Watch time (hours)']);
      totalRevenue = parseNumber(row['Estimated revenue (USD)']);
      continue;
    }

    const title = row['Video title'] || row['Content'] || '';
    
    if (!title) continue;

    const views = parseNumber(row['Views']);
    const watchTime = parseNumber(row['Watch time (hours)']);
    const revenue = parseNumber(row['Estimated revenue (USD)']);
    const ctr = parseNumber(row['Impressions click-through rate (%)']);

    videos.push({
      title,
      views,
      watchTime,
      revenue,
      ctr
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
    averageCTR: ctrCount > 0 ? totalCTR / ctrCount : 0,
    videoCount: videos.length,
    topVideos: videos.sort((a, b) => b.views - a.views).slice(0, 20)
  };
}

/**
 * Parse daily statistics data (Totals.csv)
 */
function parseDailyStatsData(data: any[]): YouTubeMetrics {
  const dailyViews: any[] = [];
  let totalViews = 0;

  for (const row of data) {
    const date = row['Date'];
    const views = parseNumber(row['Views']);
    
    if (date && views > 0) {
      dailyViews.push({ date, views });
      totalViews += views;
    }
  }

  return {
    totalViews,
    totalWatchTime: 0,
    totalRevenue: 0,
    averageCTR: 0,
    videoCount: 0,
    topVideos: [],
    dailyViews
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
    averageCTR: 0,
    videoCount: 0,
    topVideos: [],
    dailyViews: []
  };

  let ctrSum = 0;
  let ctrCount = 0;

  for (const metric of metrics) {
    merged.totalViews += metric.totalViews;
    merged.totalWatchTime += metric.totalWatchTime;
    merged.totalRevenue += metric.totalRevenue;
    
    if (metric.averageCTR > 0) {
      ctrSum += metric.averageCTR;
      ctrCount++;
    }
    
    if (metric.topVideos.length > 0) {
      merged.topVideos.push(...metric.topVideos);
    }
    
    if (metric.dailyViews) {
      merged.dailyViews!.push(...metric.dailyViews);
    }
  }

  merged.averageCTR = ctrCount > 0 ? ctrSum / ctrCount : 0;
  merged.videoCount = merged.topVideos.length;
  merged.topVideos = merged.topVideos
    .sort((a, b) => b.views - a.views)
    .slice(0, 20);

  return merged;
}
