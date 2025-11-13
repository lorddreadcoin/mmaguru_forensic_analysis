import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = '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';

// YouTube-specific knowledge base
const YOUTUBE_KNOWLEDGE = {
  ctr_benchmarks: { poor: 2, average: 5, good: 8, excellent: 10, elite: 12 },
  rpm_by_niche: {
    finance: '15-25',
    tech: '10-20',
    gaming: '2-5',
    education: '8-15',
    entertainment: '3-8'
  },
  upload_times: {
    best: '2PM-4PM EST weekdays',
    second: '9AM-11AM EST',
    worst: '12AM-6AM'
  }
};

export async function POST(req: NextRequest) {
  try {
    const { question, channelData, conversationHistory = [] } = await req.json();
    
    // Calculate derived metrics
    const avgViewsPerVideo = channelData?.videoCount > 0 
      ? Math.round(channelData.totalViews / channelData.videoCount) 
      : 0;
    
    const revenuePerVideo = channelData?.videoCount > 0
      ? (channelData.totalRevenue / channelData.videoCount).toFixed(2)
      : '0';
    
    const rpm = channelData?.totalViews > 0
      ? ((channelData.totalRevenue / channelData.totalViews) * 1000).toFixed(2)
      : '0';

    // Determine CTR quality
    const ctrAnalysis = getCTRAnalysis(channelData?.averageCTR);
    
    // Build video insights
    const topVideosAnalysis = channelData?.topVideos?.slice(0, 3).map((v: any, i: number) => 
      `${i+1}. "${v.title}" - ${v.views?.toLocaleString()} views, $${v.revenue?.toFixed(2)} revenue, ${v.ctr}% CTR` 
    ).join('\n');

    const systemPrompt = `You are the world's best YouTube analytics AI. You have COMPLETE ACCESS to this channel's data:

CHANNEL METRICS:
• Total Views: ${channelData?.totalViews?.toLocaleString()}
• Total Revenue: $${channelData?.totalRevenue?.toFixed(2)}
• Video Count: ${channelData?.videoCount}
• Average CTR: ${channelData?.averageCTR?.toFixed(1)}% (${ctrAnalysis})
• Avg Views/Video: ${avgViewsPerVideo.toLocaleString()}
• Revenue/Video: $${revenuePerVideo}
• RPM: $${rpm}

TOP PERFORMING CONTENT:
${topVideosAnalysis}

CONVERSATION HISTORY:
${conversationHistory.slice(-4).map((m: any) => `${m.role}: ${m.content.substring(0, 100)}...`).join('\n')}

INSTRUCTIONS:
1. ALWAYS use the exact numbers from the data above
2. Reference specific video titles when relevant
3. Compare their metrics to YouTube benchmarks
4. Provide specific, actionable advice with numbers and timeframes
5. If asked about data, show the ACTUAL data, not generic responses
6. Calculate projections based on their real performance
7. Remember the conversation context

Question: ${question}`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://reaperlabsai-analytics.netlify.app',
        'X-Title': 'ReaperLabs'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.2-3b-instruct:free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        temperature: 0.7,
        max_tokens: 700,
        top_p: 0.9
      })
    });

    if (response.ok) {
      const data = await response.json();
      const answer = data.choices?.[0]?.message?.content;
      if (answer) {
        return NextResponse.json({ answer });
      }
    }

    // Smart fallback using real data
    return NextResponse.json({ 
      answer: generateSmartFallback(question, channelData, { avgViewsPerVideo, rpm, revenuePerVideo, ctrAnalysis })
    });

  } catch (error) {
    console.error('Error:', error);
    const body = await req.json().catch(() => ({}));
    return NextResponse.json({ 
      answer: generateSmartFallback(
        body?.question || '', 
        body?.channelData || {},
        {}
      )
    });
  }
}

function getCTRAnalysis(ctr: number): string {
  if (ctr >= 12) return 'ELITE - Top 1% of YouTube';
  if (ctr >= 10) return 'EXCELLENT - Top 5%';
  if (ctr >= 8) return 'GOOD - Above average';
  if (ctr >= 5) return 'AVERAGE';
  return 'NEEDS IMPROVEMENT';
}

function generateSmartFallback(question: string, data: any, metrics: any): string {
  const q = question.toLowerCase();
  
  // Always use real data in responses
  const baseline = `Based on your ${data?.videoCount} videos with ${data?.totalViews?.toLocaleString()} views and ${data?.averageCTR?.toFixed(1)}% CTR:\n\n`;
  
  if (q.includes('top') || q.includes('best') || q.includes('perform')) {
    return baseline + `Your top videos are:\n${data?.topVideos?.slice(0, 5).map((v: any, i: number) => 
      `${i+1}. "${v.title}" - ${v.views?.toLocaleString()} views` 
    ).join('\n')}\n\nThese succeeded due to trending topics and strong CTR.`;
  }
  
  if (q.includes('revenue') || q.includes('money')) {
    return baseline + `Revenue Analysis:\n• Total: $${data?.totalRevenue?.toFixed(2)}\n• Per Video: $${metrics?.revenuePerVideo || '0'}\n• RPM: $${metrics?.rpm || '0'}\n\nTo increase: Extend videos to 8+ minutes, target high-CPM topics.`;
  }
  
  return baseline + `I can analyze views, revenue, CTR, top videos, growth strategies, and more. What specific aspect would you like to explore?`;
}
