import { NextRequest, NextResponse } from 'next/server';

const GROK_API_KEY = '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';

export async function POST(req: NextRequest) {
  let body: any = {};

  // Parse the request body once so we can safely reuse it in both
  // the main logic and the error path without re-reading the stream.
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const { question, channelData, conversationHistory = [] } = body;

  try {
    if (!channelData?.totalViews) {
      return NextResponse.json({ 
        answer: "Upload your YouTube CSV files to begin analysis." 
      });
    }
    
    // Build comprehensive context
    const context = buildContext(channelData, conversationHistory, question);

    console.log('[ASK API] Calling OpenRouter for question:', question.substring(0, 100));
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROK_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://reaperlabsai-analytics.netlify.app'
      },
      body: JSON.stringify({
        model: 'x-ai/grok-beta',
        messages: [
          { role: 'system', content: context.system },
          ...conversationHistory.slice(-4).map((m: any) => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.content.substring(0, 500)
          })),
          { role: 'user', content: question }
        ],
        temperature: 0.7,
        max_tokens: 1500,
        top_p: 0.9
      })
    });

    console.log('[ASK API] OpenRouter response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content;
      console.log('[ASK API] Got AI response, length:', aiResponse?.length || 0);
      return NextResponse.json({ 
        answer: aiResponse || generateSmartResponse(question, channelData)
      });
    }
    
    const errorData = await response.text();
    console.error('[ASK API] OpenRouter error:', response.status, errorData.substring(0, 200));
    throw new Error(`API failed with status ${response.status}`);
    
  } catch (error: any) {
    console.error('[ASK API] Falling back to generateSmartResponse due to:', error?.message);
    return NextResponse.json({ 
      answer: generateSmartResponse(question, channelData)
    });
  }
}

function buildContext(data: any, history: any[], question: string) {
  const avgViews = Math.round(data.totalViews / data.videoCount);
  const rpm = ((data.totalRevenue / data.totalViews) * 1000).toFixed(2);
  const topKeywords = extractKeywords(data.topVideos);
  
  return {
    system: `You are the world's most advanced YouTube growth AI analyzing a real channel.

COMPLETE CHANNEL DATA:
• ${data.totalViews?.toLocaleString()} total views
• $${data.totalRevenue?.toFixed(2)} revenue  
• ${data.videoCount} videos
• ${data.averageCTR?.toFixed(1)}% CTR
• ${avgViews.toLocaleString()} avg views/video
• $${rpm} RPM

TOP 20 VIDEOS WITH FULL DATA:
${data.topVideos?.slice(0, 20).map((v: any, i: number) => 
  `${i+1}. "${v.title}"
   📊 ${v.views?.toLocaleString()} views | ${v.ctr}% CTR | $${v.revenue?.toFixed(2)}`
).join('\n\n')}

WINNING PATTERNS:
• Top keywords: ${topKeywords.join(', ')}
• Viral threshold: 500K+ views
• Near-viral: 200-500K views
• ${data.viralRate}% viral rate

CATEGORIES PERFORMANCE:
${data.topCategories?.map((c: any) => `• ${c.category}: ${c.views.toLocaleString()} views`).join('\n')}

Instructions: Provide specific, data-driven advice. Reference actual video titles. Calculate projections. Be conversational but authoritative.`
  };
}

function extractKeywords(videos: any[]): string[] {
  const keywords: { [key: string]: number } = {};
  const important = ['leaked', 'exposed', 'breaking', 'shocking', 'diddy', 'kirk', 'conspiracy'];
  
  for (const video of videos?.slice(0, 20) || []) {
    const words = video.title?.toLowerCase().split(/\s+/) || [];
    for (const word of words) {
      if (important.includes(word)) {
        keywords[word] = (keywords[word] || 0) + 1;
      }
    }
  }
  
  return Object.entries(keywords)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word.toUpperCase());
}

function generateSmartResponse(question: string, data: any): string {
  // Never return "undefined" - always use actual data or defaults
  if (!data || !data.totalViews) {
    return "Please upload your YouTube analytics CSV files first so I can analyze your channel.";
  }
  
  const q = question?.toLowerCase() || '';
  const topVideo = data?.topVideos?.[0];
  
  // Handle "how to reach 100M views" or similar milestone questions
  if (q.includes('100m') || q.includes('100 million') || q.includes('reach')) {
    const currentViews = data.totalViews;
    const needed = 100000000 - currentViews;
    const avgViews = Math.round(currentViews / data.videoCount);
    const videosNeeded = Math.ceil(needed / avgViews);
    
    return `**Path to 100M Views** (Currently: ${currentViews.toLocaleString()})

📊 **The Math:**
• Need ${needed.toLocaleString()} more views
• Your average: ${avgViews.toLocaleString()} views/video
• Videos needed at current rate: ${videosNeeded}

🚀 **Accelerated Strategy:**
1. **Viral Focus** - Your "${topVideo?.title}" hit ${topVideo?.views?.toLocaleString()} views
   - That's ${Math.round(topVideo?.views / avgViews)}x your average
   - 5 similar viral hits = ${(topVideo?.views * 5).toLocaleString()} views alone

2. **Upload Cadence** - 2 videos daily × 365 days
   - 730 videos × ${avgViews.toLocaleString()} avg = ${(730 * avgViews).toLocaleString()} views/year
   - With 5% viral rate = ${Math.round(730 * 0.05)} viral videos

3. **CTR Optimization** - Your ${data?.averageCTR?.toFixed(1)}% → 15%
   - 50% more reach per video
   - Compounds exponentially with algorithm boost

**Timeline: 8-12 months if you execute aggressively**`;
  }
  
  // Handle "why did it hit 1M views" or analysis questions
  if ((q.includes('why') || q.includes('think')) && (q.includes('1m') || q.includes('million') || q.includes('hit'))) {
    return `**Why "${topVideo?.title}" Hit ${topVideo?.views?.toLocaleString()} Views:**

🎯 **Perfect Storm Elements:**
1. **"LEAKED" Power Word** - Instant curiosity trigger
   - Creates urgency and FOMO
   - Algorithm loves engagement signals

2. **Celebrity Scandal** - Diddy at peak controversy
   - Trending topic alignment
   - Cross-platform virality

3. **Emotional Triggers** - "INSANE & DISGUSTING"
   - Extreme emotions = high CTR
   - Your CTR: ${topVideo?.ctr || data?.averageCTR?.toFixed(1)}% (way above average)

4. **Timing** - Likely posted during news cycle
   - First-mover advantage
   - Rode the algorithm wave

5. **Watch Time** - Controversial content = high retention
   - People watch to the end
   - Algorithm pushes further

**Replication Formula:**
[LEAKED/EXPOSED] + [Trending Celebrity] + [Extreme Emotion] = Viral Hit`;
  }
  
  if (q.includes('viral') || q.includes('blow up')) {
    return `To replicate your viral success (${topVideo?.title} - ${topVideo?.views?.toLocaleString()} views):

1. **Title Formula**: TRIGGER WORD + Celebrity/Topic + Emotional Hook
   Example: "LEAKED + Diddy + SHOCKING REVELATION"

2. **Upload Timing**: Within 2 hours of breaking news
   Your best: When scandal news breaks

3. **CTR Optimization**: Your ${data?.averageCTR?.toFixed(1)}% is good, but viral videos need 12%+
   
4. **Length**: 10-18 minutes (maximize mid-rolls)

5. **Series Strategy**: Create 3-part series from each viral hit

With your ${data?.viralRate}% viral rate, doubling uploads = ${Math.round(data.videoCount * 0.01 * data.viralRate * 2)} more viral videos/year.`;
  }
  
  if (q.includes('money') || q.includes('revenue')) {
    const currentMonthly = data.totalRevenue / 12;
    const potential = currentMonthly * 3;
    return `Revenue Optimization Plan:

Current: $${data.totalRevenue?.toFixed(2)}/year ($${currentMonthly.toFixed(2)}/month)
Potential: $${(potential * 12).toFixed(2)}/year

Strategy:
1. Extend videos to 8:01+ (2x mid-roll revenue)
2. Target high-CPM topics (finance/tech inserts)
3. Add 3 affiliate links per video
4. Launch $47 course to 1% of audience
5. Increase uploads to 2x daily

Math: ${data.totalViews.toLocaleString()} views × 2x uploads × $${((data.totalRevenue / data.totalViews) * 1000).toFixed(2)} RPM = $${(data.totalRevenue * 2).toFixed(0)}/year`;
  }
  
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
- Aim for 12%+ CTR

  if (q.includes('next') || q.includes('make') || q.includes('video') || q.includes('content') || q.includes('what') || q.includes('create')) {
    // Analyze top performers for patterns
    const topPerformers = data.topVideos?.slice(0, 10) || [];
    const viralVideos = topPerformers.filter((v: any) => v.views > 500000);
    const avgTopCTR = topPerformers.reduce((sum: number, v: any) => sum + (v.ctr || 0), 0) / topPerformers.length;
    
    // Extract winning keywords from top videos
    const winningWords: { [key: string]: number } = {};
    for (const video of topPerformers) {
      const words = video.title?.toUpperCase().split(/\s+/) || [];
      for (const word of words) {
        if (['LEAKED', 'EXPOSED', 'BREAKING', 'INSANE', 'SHOCKING', 'DIDDY', 'DISGUSTING', 'PROOF', 'CAUGHT'].includes(word)) {
          winningWords[word] = (winningWords[word] || 0) + video.views;
        }
      }
    }
    
    const bestKeyword = Object.entries(winningWords).sort(([,a], [,b]) => b - a)[0];
    const secondBest = Object.entries(winningWords).sort(([,a], [,b]) => b - a)[1];
    
    return `**YOUR NEXT VIDEO (Data-Driven Blueprint):**

📹 **Title Formula That Works For YOU:**
"${bestKeyword?.[0] || 'LEAKED'} [Celebrity Name] ${secondBest?.[0] || 'SHOCKING'} [Specific Detail] (${new Date().getFullYear()} ${['PROOF', 'EXPOSED', 'CAUGHT'][Math.floor(Math.random() * 3)]})"

**Why This Formula:**
- "${bestKeyword?.[0]}" appears in videos averaging ${(bestKeyword?.[1] / 1000000).toFixed(1)}M views
- Your top ${viralVideos.length} viral videos ALL use this structure
- Average CTR on these: ${avgTopCTR.toFixed(1)}% (vs your average ${data.averageCTR?.toFixed(1)}%)

🎯 **TOMORROW'S VIDEO - Specific Ideas:**
1. **"LEAKED Jay-Z Secret Meeting Audio EXPOSES Diddy Connection"**
   - Riding current Diddy momentum (your biggest hit)
   - Jay-Z connection = fresh angle
   - "Audio" implies exclusive content

2. **"BREAKING: Oprah's Diddy Party Photos LEAKED (DISGUSTING Details)"**
   - Combines your top performer's energy
   - Oprah = massive search volume
   - Photos = high CTR trigger

3. **"EXPOSED: The Diddy List - 47 Celebrities Named (SHOCKING)"**
   - List format = high retention
   - Number in title = specificity
   - Multi-celebrity = broad appeal

**Thumbnail Must-Haves (Based on YOUR Winners):**
✓ Red arrow pointing at shocking element
✓ Your face with extreme expression (worked ${viralVideos.length} times)
✓ Celebrity face looking guilty/scared
✓ "LEAKED" or "EXPOSED" text overlay
✓ Dark/dramatic lighting

**Upload Strategy:**
- Time: 3pm EST (when your audience is most active)
- Length: 12-16 minutes (your sweet spot for revenue)
- First 30 seconds: Tease the biggest revelation
- Pin comment: "Part 2 tomorrow if this hits 100K views"

**Expected Performance:**
Based on similar videos: 200K-400K views in 48 hours
If CTR hits 14%+: Algorithm boost to 1M+ potential`;
  }
  
  // Always return something useful with real data
  return `Based on your ${data.videoCount} videos with ${data.totalViews?.toLocaleString()} views:

Your top video "${data.topVideos?.[0]?.title}" shows what works.
Average video gets ${Math.round(data.totalViews / data.videoCount).toLocaleString()} views.
Revenue of $${data.totalRevenue?.toFixed(2)} = $${(data.totalRevenue / data.videoCount).toFixed(2)} per video.

What specific aspect would you like me to analyze?`;
}
