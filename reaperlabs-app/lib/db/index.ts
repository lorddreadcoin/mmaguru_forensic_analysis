// Database client
import { sql } from '@vercel/postgres';

export interface User {
  id: number;
  email: string;
  name?: string;
  tier: 'free' | 'creator' | 'pro' | 'agency';
  analyses_count: number;
  last_analysis_at?: Date;
}

export interface Analysis {
  id: number;
  user_id: number;
  channel_name?: string;
  total_views: number;
  total_watch_time: number;
  total_revenue: number;
  total_subscribers: number;
  average_ctr: number;
  video_count: number;
  raw_data: any;
  ai_insights: any;
  created_at: Date;
}

/**
 * Get or create user by email
 */
export async function getOrCreateUser(email: string, name?: string): Promise<User> {
  try {
    // Try to get existing user
    const existing = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (existing.rows.length > 0) {
      return existing.rows[0] as User;
    }

    // Create new user
    const newUser = await sql`
      INSERT INTO users (email, name)
      VALUES (${email}, ${name || null})
      RETURNING *
    `;

    return newUser.rows[0] as User;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

/**
 * Save analysis to database
 */
export async function saveAnalysis(
  userId: number,
  metrics: any,
  insights: any
): Promise<Analysis> {
  try {
    const result = await sql`
      INSERT INTO analyses (
        user_id,
        total_views,
        total_watch_time,
        total_revenue,
        total_subscribers,
        average_ctr,
        video_count,
        raw_data,
        ai_insights
      ) VALUES (
        ${userId},
        ${metrics.totalViews},
        ${metrics.totalWatchTime},
        ${metrics.totalRevenue},
        ${metrics.totalSubscribers},
        ${metrics.averageCTR},
        ${metrics.videoCount},
        ${JSON.stringify(metrics)},
        ${JSON.stringify(insights)}
      )
      RETURNING *
    `;

    // Update user's analysis count
    await sql`
      UPDATE users 
      SET analyses_count = analyses_count + 1,
          last_analysis_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
    `;

    return result.rows[0] as Analysis;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

/**
 * Save videos for an analysis
 */
export async function saveVideos(analysisId: number, videos: any[]): Promise<void> {
  try {
    for (const video of videos) {
      await sql`
        INSERT INTO videos (
          analysis_id,
          video_id,
          title,
          views,
          watch_time,
          revenue,
          ctr,
          publish_date
        ) VALUES (
          ${analysisId},
          ${video.videoId},
          ${video.title},
          ${video.views},
          ${video.watchTime},
          ${video.revenue},
          ${video.ctr},
          ${video.publishDate}
        )
      `;
    }
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

/**
 * Get user's analyses
 */
export async function getUserAnalyses(userId: number): Promise<Analysis[]> {
  try {
    const result = await sql`
      SELECT * FROM analyses 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 10
    `;

    return result.rows as Analysis[];
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

/**
 * Save a question and answer
 */
export async function saveQuestion(
  userId: number,
  analysisId: number,
  question: string,
  answer: string
): Promise<void> {
  try {
    await sql`
      INSERT INTO questions (user_id, analysis_id, question, answer)
      VALUES (${userId}, ${analysisId}, ${question}, ${answer})
    `;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

/**
 * Check if user has reached their tier limit
 */
export async function canAnalyze(userId: number): Promise<boolean> {
  try {
    const user = await sql`
      SELECT tier, analyses_count, last_analysis_at FROM users WHERE id = ${userId}
    `;

    if (user.rows.length === 0) return false;

    const userData = user.rows[0];
    const tier = userData.tier;

    // Free tier: 3 analyses per month
    if (tier === 'free') {
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const monthlyCount = await sql`
        SELECT COUNT(*) as count FROM analyses
        WHERE user_id = ${userId}
        AND created_at >= ${monthStart.toISOString()}
      `;

      return (monthlyCount.rows[0].count || 0) < 3;
    }

    // Paid tiers: unlimited
    return true;
  } catch (error) {
    console.error('Database error:', error);
    return false;
  }
}
