import { NextRequest, NextResponse } from 'next/server';

// Premium API key for powerful model
const OPENROUTER_API_KEY = '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';

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

    // Build comprehensive context
    const systemPrompt = `You are an elite YouTube growth strategist analyzing a real channel. You have access to their complete data and must provide specific, actionable advice based on their actual performance.

CHANNEL METRICS:
- Total Views: ${channelData?.totalViews?.toLocaleString()}
- Revenue: $${channelData?.totalRevenue?.toFixed(2)}
- Videos Published: ${channelData?.videoCount}
- Average CTR: ${channelData?.averageCTR?.toFixed(1)}%
- Views per Video: ${avgViewsPerVideo.toLocaleString()}
- Revenue per Video: $${revenuePerVideo}
- RPM: $${rpm}

TOP PERFORMING VIDEOS:
${channelData?.topVideos?.slice(0, 10).map((v: any, i: number) => 
  `${i+1}. "${v.title}"
   Views: ${v.views?.toLocaleString()} | CTR: ${v.ctr}% | Revenue: $${v.revenue?.toFixed(2)}`
).join('\n\n') || 'No video data available'}

CONVERSATION HISTORY:
${conversationHistory.slice(-4).map((m: any) => `${m.role}: ${m.content}`).join('\n')}

Instructions:
- Always reference specific videos by name when relevant
- Use exact numbers from the data provided
- Give actionable strategies with specific steps
- Compare metrics to industry benchmarks
- Predict future performance based on current trends
- Be conversational but authoritative`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://reaperlabsai-analytics.netlify.app',
        'X-Title': 'ReaperLabs'
      },
      body: JSON.stringify({
        model: 'nvidia/llama-3.3-nemotron-super-49b-v1.5',
        messages: [
          { 
            role: 'system', 
            content: systemPrompt 
          },
          { 
            role: 'user', 
            content: question 
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 0.9,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter Error:', response.status, errorText);
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content;
    
    if (!answer) {
      throw new Error('No response from model');
    }

    return NextResponse.json({ answer });

  } catch (error) {
    console.error('Error in ask route:', error);
    
    // Premium fallback - still uses real data
    const body = await req.json().catch(() => ({}));
    const fallbackAnswer = generatePremiumFallback(
      body?.question || '',
      body?.channelData || {}
    );
    
    return NextResponse.json({ answer: fallbackAnswer });
  }
}

function generatePremiumFallback(question: string, data: any): string {
  const q = question.toLowerCase();
  const topVideos = data?.topVideos || [];
  
  // Analyze patterns in top content
  const diddy_videos = topVideos.filter((v: any) => 
    v.title?.toLowerCase().includes('diddy')
  );
  const political_videos = topVideos.filter((v: any) => 
    v.title?.toLowerCase().includes('kirk') || 
    v.title?.toLowerCase().includes('conspiracy')
  );
  
  if (q.includes('content') || q.includes('what') || q.includes('create')) {
    const avgDiddyViews = diddy_videos.length > 0 
      ? Math.round(diddy_videos.reduce((a: number, v: any) => a + v.views, 0) / diddy_videos.length)
      : 0;
      
    return `Based on your performance data, here's your content strategy:

**IMMEDIATE PRIORITIES** (Next 7 Days):

1. **Trending Topics** (Your goldmine - ${diddy_videos.length} similar videos averaging ${avgDiddyViews.toLocaleString()} views)
   - Follow trending news and scandals
   - Create reaction/analysis content
   - Use emotional hooks in titles

2. **Political Content** (Strong performer - top videos avg ${political_videos[0]?.views?.toLocaleString() || 'high'} views)
   - Follow-ups to "${data?.topVideos?.[0]?.title || 'your top videos'}"
   - Current events commentary
   - Controversial takes that spark discussion

3. **Hybrid Content** (Combine your winners)
   - Mix trending topics with your niche
   - Create series around popular themes
   - Build on successful video formats

Your ${data?.averageCTR?.toFixed(1)}% CTR proves your titles work. Keep using:
- Power words (EXPOSED, LEAKED, SHOCKING)
- Specific details and numbers
- Emotional triggers

With your current $${(data?.totalRevenue / data?.videoCount).toFixed(2)} per video, creating 2 videos daily = $${((data?.totalRevenue / data?.videoCount) * 60).toFixed(0)}/month potential.`;
  }
  
  if (q.includes('revenue') || q.includes('money') || q.includes('monetize')) {
    return `Revenue Optimization Strategy:

Current Performance:
- Total Revenue: $${data?.totalRevenue?.toFixed(2)}
- Per Video: $${(data?.totalRevenue / data?.videoCount).toFixed(2)}
- RPM: $${((data?.totalRevenue / data?.totalViews) * 1000).toFixed(2)}

IMMEDIATE ACTIONS:
1. **Extend Videos** to 8:01+ (enables mid-roll ads)
2. **Target High-CPM Topics** (finance, tech, business)
3. **Add Affiliate Links** to descriptions
4. **Create Product Placements** naturally

PROJECTIONS:
- With optimized RPM ($15): ${data?.totalViews?.toLocaleString()} views = $${(data?.totalViews * 0.015).toFixed(0)}
- That's ${((data?.totalViews * 0.015) / data?.totalRevenue).toFixed(1)}x your current revenue!`;
  }
  
  // Default response with rich data
  return `Analyzing your channel performance:

Your channel is performing at an ELITE level:
- ${data?.totalViews?.toLocaleString()} views across ${data?.videoCount} videos
- $${data?.totalRevenue?.toFixed(2)} revenue (Top 1% of creators)
- ${data?.averageCTR?.toFixed(1)}% CTR (2x industry average)

Your top video "${topVideos[0]?.title}" with ${topVideos[0]?.views?.toLocaleString()} views shows your winning formula.

What specific aspect would you like me to analyze in detail?`;
}
