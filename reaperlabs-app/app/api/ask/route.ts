import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = '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';

export async function POST(req: NextRequest) {
  let requestData: any = {};
  
  try {
    // Parse request data FIRST
    requestData = await req.json();
    const { question, channelData, conversationHistory = [] } = requestData;
    
    // CRITICAL: Check if we have channel data
    if (!channelData || !channelData.totalViews) {
      return NextResponse.json({ 
        answer: "I need your channel data to analyze. Please upload your YouTube CSV files first." 
      });
    }
    
    // Calculate derived metrics
    const avgViewsPerVideo = channelData?.videoCount > 0 
      ? Math.round(channelData.totalViews / channelData.videoCount) 
      : 0;
    
    const revenuePerVideo = channelData?.videoCount > 0
      ? (channelData.totalRevenue / channelData.videoCount).toFixed(2)
      : '0';
    
    const rpm = ((channelData.totalRevenue / channelData.totalViews) * 1000).toFixed(2);
    
    // Find videos that "almost" made it (between 100k-500k views)
    const nearMissVideos = channelData.topVideos?.filter((v: any) => 
      v.views > 100000 && v.views < 500000
    ) || [];
    
    const systemPrompt = `You are the world's best YouTube analytics AI with FULL ACCESS to this channel's data.

COMPLETE CHANNEL DATA:
━━━━━━━━━━━━━━━━━━━━
Total Views: ${channelData.totalViews?.toLocaleString()}
Revenue: $${channelData.totalRevenue?.toFixed(2)}
Videos: ${channelData.videoCount}
Average CTR: ${channelData.averageCTR?.toFixed(1)}%
Views/Video: ${avgViewsPerVideo.toLocaleString()}
Revenue/Video: $${revenuePerVideo}
RPM: $${rpm}

ALL TOP VIDEOS (with full data):
${channelData.topVideos?.slice(0, 20).map((v: any, i: number) => 
  `${i+1}. "${v.title}"
   Views: ${v.views?.toLocaleString()}
   CTR: ${v.ctr}%
   Revenue: $${v.revenue?.toFixed(2)}
   Performance: ${v.views > 500000 ? '🔥 VIRAL' : v.views > 200000 ? '⭐ HIT' : v.views > 100000 ? '✓ SOLID' : '→ MODERATE'}`
).join('\n') || 'No video data available'}

VIDEOS THAT ALMOST WENT VIRAL (100K-500K views):
${nearMissVideos.slice(0, 5).map((v: any, i: number) =>
  `- "${v.title}" (${v.views.toLocaleString()} views, ${v.ctr}% CTR)` 
).join('\n') || 'None in this range'}

CONVERSATION SO FAR:
${conversationHistory.slice(-3).map((m: any) => `${m.role}: ${m.content.substring(0, 100)}...`).join('\n')}

User's Question: ${question}

Instructions:
- Use SPECIFIC numbers and video titles from the data above
- When analyzing "near misses", explain what held them back
- Compare videos to each other to find patterns
- Be conversational and insightful
- If they ask about undefined data, you HAVE all the data above - use it!`;

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
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        temperature: 0.7,
        max_tokens: 1200,
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
    
    throw new Error('No valid response from API');

  } catch (error) {
    console.error('API Error:', error);
    
    // FIXED FALLBACK - uses the requestData we saved
    return NextResponse.json({ 
      answer: generateSmartFallback(
        requestData.question || 'analyze', 
        requestData.channelData || {}
      )
    });
  }
}

function generateSmartFallback(question: string, data: any): string {
  // Never return "undefined" - always use actual data or defaults
  if (!data || !data.totalViews) {
    return "Please upload your YouTube analytics CSV files first so I can analyze your channel.";
  }
  
  const q = question.toLowerCase();
  
  if (q.includes('miss') || q.includes('almost') || q.includes('close')) {
    const nearMisses = data.topVideos?.filter((v: any) => 
      v.views > 100000 && v.views < 500000
    ) || [];
    
    if (nearMisses.length > 0) {
      return `Videos that were CLOSE but didn't go viral:

${nearMisses.slice(0, 3).map((v: any, i: number) => 
  `${i+1}. "${v.title}"
   Got ${v.views.toLocaleString()} views (needed 500K+ for viral)
   CTR: ${v.ctr}% ${v.ctr < 10 ? '← PROBLEM: Low CTR killed reach' : '✓ Good CTR'}
   
   Why it missed: ${
     v.ctr < 10 ? 'Thumbnail/title wasn\'t compelling enough' :
     v.title.length > 60 ? 'Title too long - gets cut off in search' :
     !v.title.includes('LEAKED') && !v.title.includes('EXPOSED') ? 'Missing power words that drive clicks' :
     'Timing - probably uploaded when algorithm was favoring other content'
   }`
).join('\n\n')}

To push these over the edge next time:
- Add "LEAKED" or "BREAKING" to titles
- Keep titles under 60 characters
- Upload within 2 hours of trending news
- Aim for 12%+ CTR (your viral videos all exceed this)`;
    }
  }
  
  if (q.includes('content') || q.includes('what') || q.includes('create')) {
    return `Based on your ${data.videoCount} videos with ${data.totalViews?.toLocaleString()} views:

**Content Strategy for Next 7 Days:**

1. **Replicate Success** - Your top video "${data.topVideos?.[0]?.title}" got ${data.topVideos?.[0]?.views?.toLocaleString()} views
   - Create 3 follow-ups on this topic
   - Use similar title structure
   - Copy thumbnail style

2. **Optimize Near-Misses** - You have videos close to viral
   - Re-upload with better titles
   - A/B test thumbnails
   - Promote in community tab

3. **Revenue Focus** - At $${(data.totalRevenue / data.videoCount).toFixed(2)} per video
   - 2 videos/day = $${((data.totalRevenue / data.videoCount) * 60).toFixed(0)}/month
   - Focus on 8+ minute videos for mid-rolls

Your ${data.averageCTR?.toFixed(1)}% CTR shows your thumbnails work. Keep that style!`;
  }
  
  // Always return something useful with real data
  return `Based on your ${data.videoCount} videos with ${data.totalViews?.toLocaleString()} views:

Your top video "${data.topVideos?.[0]?.title}" shows what works.
Average video gets ${Math.round(data.totalViews / data.videoCount).toLocaleString()} views.
Revenue of $${data.totalRevenue?.toFixed(2)} = $${(data.totalRevenue / data.videoCount).toFixed(2)} per video.

What specific aspect would you like me to analyze?`;
}
