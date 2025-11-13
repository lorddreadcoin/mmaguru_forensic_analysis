// API Route: /api/analyze
import { NextRequest, NextResponse } from 'next/server';
import { parseMultipleCSVs } from '../../../lib/csv-parser';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const fileCount = parseInt(formData.get('fileCount') as string) || 1;
    
    const files: File[] = [];
    
    // Collect all files
    for (let i = 0; i < fileCount; i++) {
      const file = formData.get(`file${i}`) as File;
      if (file) {
        files.push(file);
      }
    }
    
    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }
    
    // Parse all CSV files
    const metrics = await parseMultipleCSVs(files);
    
    // Generate insights based on real data
    const insights = {
      strengths: [
        `Strong channel with ${metrics.totalViews.toLocaleString()} total views`,
        `${metrics.videoCount} videos published shows consistency`,
        metrics.averageCTR > 8 ? `Excellent ${metrics.averageCTR.toFixed(1)}% CTR` : 'Growing audience engagement'
      ],
      problems: [
        metrics.averageCTR < 10 ? `CTR of ${metrics.averageCTR.toFixed(1)}% could be higher` : 'Consider content diversity',
        'Upload schedule could be more consistent',
        'Thumbnail optimization opportunities exist'
      ],
      actionItems: [
        'Upload 2 videos daily at peak times',
        'A/B test thumbnails to reach 12% CTR',
        'Create series content for binge watching',
        'Optimize descriptions with 15-20 keywords',
        'Engage with first 10 comments immediately'
      ]
    };
    
    // If OpenRouter is available, get AI insights
    try {
      const { analyzeChannel } = await import('../../../lib/openrouter');
      const aiInsights = await analyzeChannel(metrics);
      if (aiInsights) {
        Object.assign(insights, aiInsights);
      }
    } catch (aiError) {
      console.log('Using fallback insights');
    }
    
    return NextResponse.json({
      success: true,
      analysisId: Date.now().toString(),
      metrics,
      insights
    });
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      error: 'Failed to analyze',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
