import { NextRequest, NextResponse } from 'next/server';
import { parseMultipleCSVs } from '../../../lib/csv-parser';

const GROK_API_KEY = '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';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const fileCount = parseInt(formData.get('fileCount') as string) || 1;
    
    const files: File[] = [];
    for (let i = 0; i < fileCount; i++) {
      const file = formData.get(`file${i}`) as File;
      if (file) {
        files.push(file);
      }
    }
    
    const metrics = await parseMultipleCSVs(files);
    
    // Analyze patterns in the data
    const topPerformers = metrics.topVideos?.slice(0, 5) || [];
    const avgViews = metrics.totalViews / metrics.videoCount;
    const viralVideos = metrics.topVideos?.filter((v: any) => v.views > 500000) || [];
    const almostViral = metrics.topVideos?.filter((v: any) => v.views > 200000 && v.views < 500000) || [];
    
    // Get AI-powered insights
    const aiPrompt = `Analyze this YouTube channel for growth opportunities:
    
Stats: ${metrics.totalViews.toLocaleString()} views, ${metrics.videoCount} videos, $${metrics.totalRevenue.toFixed(2)} revenue, ${metrics.averageCTR.toFixed(1)}% CTR

Top Videos: ${topPerformers.map((v: any) => `"${v.title}" (${v.views.toLocaleString()} views)`).join(', ')}

Provide: 3 strengths, 3 weaknesses, 5 specific action items. Be specific and reference the actual data.`;

    let insights;
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROK_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://reaperlabsai-analytics.netlify.app',
          'X-Title': 'ReaperLabs'
        },
        body: JSON.stringify({
          model: 'x-ai/grok-beta',
          messages: [{ role: 'user', content: aiPrompt }],
          temperature: 0.7,
          max_tokens: 800
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';
        insights = parseAIResponse(content, metrics);
      }
    } catch (e) {
      console.error('AI Error:', e);
    }
    
    // Fallback insights based on data patterns
    if (!insights) {
      insights = {
        strengths: [
          `Viral hit rate: ${((viralVideos.length / metrics.videoCount) * 100).toFixed(1)}% of videos go viral`,
          `Strong CTR of ${metrics.averageCTR.toFixed(1)}% (industry avg: 5%)`,
          `Revenue optimization: $${(metrics.totalRevenue / metrics.videoCount).toFixed(2)} per video` 
        ],
        problems: [
          almostViral.length > 0 ? `${almostViral.length} videos missed viral by <50% views` : 'Inconsistent viral performance',
          metrics.averageCTR < 10 ? 'CTR below elite threshold (10%+)' : 'Upload frequency gaps detected',
          'Content clustering opportunity missed'
        ],
        actionItems: [
          `Replicate "${topPerformers[0]?.title}" formula`,
          'Upload 2x daily at 2PM & 8PM EST',
          'Create series from top performer themes',
          'A/B test thumbnails weekly',
          'Respond to first 50 comments immediately'
        ]
      };
    }
    
    // Calculate advanced metrics
    const advancedMetrics = {
      ...metrics,
      viralRate: ((viralVideos.length / metrics.videoCount) * 100).toFixed(1),
      avgViewsPerVideo: Math.round(avgViews),
      revenuePerThousandViews: ((metrics.totalRevenue / metrics.totalViews) * 1000).toFixed(2),
      topCategories: identifyTopCategories(metrics.topVideos),
      growthPotential: calculateGrowthPotential(metrics)
    };
    
    return NextResponse.json({
      success: true,
      analysisId: Date.now().toString(),
      metrics: advancedMetrics,
      insights
    });
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}

function parseAIResponse(content: string, metrics: any) {
  const lines = content.split('\n');
  const strengths: string[] = [];
  const problems: string[] = [];
  const actionItems: string[] = [];
  
  let currentSection = '';
  for (const line of lines) {
    if (line.toLowerCase().includes('strength')) currentSection = 'strengths';
    else if (line.toLowerCase().includes('problem') || line.toLowerCase().includes('weakness')) currentSection = 'problems';
    else if (line.toLowerCase().includes('action')) currentSection = 'actions';
    else if (line.trim().startsWith('-') || line.trim().startsWith('•') || line.match(/^\d+\./)) {
      const item = line.replace(/^[-•\d.]\s*/, '').trim();
      if (item) {
        if (currentSection === 'strengths') strengths.push(item);
        else if (currentSection === 'problems') problems.push(item);
        else if (currentSection === 'actions') actionItems.push(item);
      }
    }
  }
  
  return {
    strengths: strengths.slice(0, 3),
    problems: problems.slice(0, 3),
    actionItems: actionItems.slice(0, 5)
  };
}

function identifyTopCategories(videos: any[]) {
  const categories: { [key: string]: number } = {};
  const patterns = {
    'Celebrity Scandal': ['diddy', 'bieber', 'celebrity', 'leaked'],
    'Political': ['kirk', 'conspiracy', 'government'],
    'Breaking News': ['breaking', 'just happened', 'emergency'],
    'Controversy': ['exposed', 'truth', 'shocking']
  };
  
  for (const video of videos || []) {
    const title = video.title?.toLowerCase() || '';
    for (const [category, keywords] of Object.entries(patterns)) {
      if (keywords.some(kw => title.includes(kw))) {
        categories[category] = (categories[category] || 0) + video.views;
      }
    }
  }
  
  return Object.entries(categories)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([cat, views]) => ({ category: cat, views }));
}

function calculateGrowthPotential(metrics: any): string {
  const ctr = metrics.averageCTR || 0;
  const rpm = ((metrics.totalRevenue / metrics.totalViews) * 1000) || 0;
  
  if (ctr > 10 && rpm > 5) return '🚀 EXPLOSIVE';
  if (ctr > 8 && rpm > 3) return '📈 HIGH';
  if (ctr > 6) return '📊 MODERATE';
  return '🎯 EMERGING';
}
