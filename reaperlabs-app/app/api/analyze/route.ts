// API Route: /api/analyze
import { NextRequest, NextResponse } from 'next/server';
import { parseYouTubeCSV, mergeMetrics } from '../../../lib/csv-parser';
import { analyzeChannel } from '../../../lib/openrouter';
import { saveAnalysis, saveVideos, getOrCreateUser, canAnalyze } from '../../../lib/db/mock';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const userEmail = formData.get('email') as string;
    const userName = formData.get('name') as string;

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files uploaded' },
        { status: 400 }
      );
    }

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Email required' },
        { status: 400 }
      );
    }

    // Get or create user
    const user = await getOrCreateUser(userEmail, userName);

    // Check if user can analyze (free tier limit)
    const allowed = await canAnalyze(user.id);
    if (!allowed) {
      return NextResponse.json(
        { 
          error: 'Monthly limit reached',
          message: 'Free tier allows 3 analyses per month. Upgrade to Pro for unlimited access.'
        },
        { status: 403 }
      );
    }

    // Parse all uploaded CSV files
    const allMetrics = await Promise.all(
      files.map(file => parseYouTubeCSV(file))
    );

    // Merge metrics if multiple files
    const metrics = allMetrics.length === 1 
      ? allMetrics[0]
      : mergeMetrics(allMetrics);

    // Analyze with AI
    const aiInsights = await analyzeChannel({ channelData: metrics });

    // Save to database
    const analysis = await saveAnalysis(user.id, metrics, aiInsights);

    // Save top videos
    if (metrics.topVideos && metrics.topVideos.length > 0) {
      await saveVideos(analysis.id, metrics.topVideos);
    }

    // Return results
    return NextResponse.json({
      success: true,
      analysisId: analysis.id,
      metrics: {
        totalViews: metrics.totalViews,
        totalRevenue: metrics.totalRevenue,
        totalSubscribers: metrics.totalSubscribers,
        averageCTR: metrics.averageCTR,
        videoCount: metrics.videoCount,
        topVideos: metrics.topVideos.slice(0, 10)
      },
      insights: aiInsights,
      user: {
        tier: user.tier,
        analysesRemaining: user.tier === 'free' ? 3 - user.analyses_count : -1
      }
    });

  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze channel', details: error.message },
      { status: 500 }
    );
  }
}
