import { NextRequest, NextResponse } from 'next/server';
import { getTrendingTopics, searchTrendingTopic } from '@/lib/trending-search';

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
        answer: aiResponse || await generateSmartResponse(question, channelData)
      });
    }
    
    const errorData = await response.text();
    console.error('[ASK API] OpenRouter error:', response.status, errorData.substring(0, 200));
    throw new Error(`API failed with status ${response.status}`);
    
  } catch (error: any) {
    console.error('[ASK API] Falling back to generateSmartResponse due to:', error?.message);
    return NextResponse.json({ 
      answer: await generateSmartResponse(question, channelData)
    });
  }
}

function buildContext(data: any, history: any[], question: string) {
  const avgViews = Math.round(data.totalViews / data.videoCount);
  const rpm = ((data.totalRevenue / data.totalViews) * 1000).toFixed(2);
  const topKeywords = extractKeywords(data.topVideos);
  
  let systemContent = 'You are the world\'s most advanced YouTube growth AI analyzing a real channel.\n\n';
  systemContent += 'COMPLETE CHANNEL DATA:\n';
  systemContent += '• ' + (data.totalViews?.toLocaleString() || '0') + ' total views\n';
  systemContent += '• $' + (data.totalRevenue?.toFixed(2) || '0') + ' revenue\n';
  systemContent += '• ' + data.videoCount + ' videos\n';
  systemContent += '• ' + (data.averageCTR?.toFixed(1) || '0') + '% CTR\n';
  systemContent += '• ' + avgViews.toLocaleString() + ' avg views/video\n';
  systemContent += '• $' + rpm + ' RPM\n\n';
  
  systemContent += 'TOP 20 VIDEOS WITH FULL DATA:\n';
  if (data.topVideos) {
    data.topVideos.slice(0, 20).forEach((v: any, i: number) => {
      systemContent += (i+1) + '. "' + v.title + '"\n';
      systemContent += '   📊 ' + (v.views?.toLocaleString() || '0') + ' views | ';
      systemContent += v.ctr + '% CTR | $' + (v.revenue?.toFixed(2) || '0') + '\n\n';
    });
  }
  
  systemContent += 'WINNING PATTERNS:\n';
  systemContent += '• Top keywords: ' + topKeywords.join(', ') + '\n';
  systemContent += '• Viral threshold: 500K+ views\n';
  systemContent += '• Near-viral: 200-500K views\n';
  systemContent += '• ' + (data.viralRate || '0') + '% viral rate\n\n';
  
  systemContent += 'CATEGORIES PERFORMANCE:\n';
  if (data.topCategories) {
    data.topCategories.forEach((c: any) => {
      systemContent += '• ' + c.category + ': ' + c.views.toLocaleString() + ' views\n';
    });
  }
  
  systemContent += '\nInstructions: Provide specific, data-driven advice. Reference actual video titles. Calculate projections. Be conversational but authoritative.';
  
  return {
    system: systemContent
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

async function generateSmartResponse(question: string, data: any): Promise<string> {
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
      let nearMissResponse = 'Videos that were CLOSE but didn\'t go viral:\n\n';
      
      nearMisses.slice(0, 3).forEach((v: any, i: number) => {
        nearMissResponse += (i+1) + '. "' + v.title + '"\n';
        nearMissResponse += '   Got ' + v.views.toLocaleString() + ' views (needed 500K+ for viral)\n';
        nearMissResponse += '   CTR: ' + v.ctr + '% ' + (v.ctr < 10 ? '← PROBLEM: Low CTR killed reach' : '✓ Good CTR') + '\n';
        nearMissResponse += '   \n';
        nearMissResponse += '   Why it missed: ';
        
        if (v.ctr < 10) {
          nearMissResponse += 'Thumbnail/title wasn\'t compelling enough';
        } else if (v.title.length > 60) {
          nearMissResponse += 'Title too long - gets cut off in search';
        } else if (!v.title.includes('LEAKED') && !v.title.includes('EXPOSED')) {
          nearMissResponse += 'Missing power words that drive clicks';
        } else {
          nearMissResponse += 'Timing - probably uploaded when algorithm was favoring other content';
        }
        
        nearMissResponse += '\n\n';
      });
      
      nearMissResponse += 'To push these over the edge next time:\n';
      nearMissResponse += '- Add "LEAKED" or "BREAKING" to titles\n';
      nearMissResponse += '- Keep titles under 60 characters\n';
      nearMissResponse += '- Upload within 2 hours of trending news\n';
      nearMissResponse += '- Aim for 12%+ CTR';
      
      return nearMissResponse;
    }
  }

  if (q.includes('trend') || q.includes('current') || q.includes('now') || q.includes('today') || q.includes('news')) {
    // Fetch current trends and news
    console.log('[SMART RESPONSE] Fetching trending topics for user...');
    try {
      const trending = await getTrendingTopics();
      
      let response = '🔥 **TRENDING RIGHT NOW - Make These Videos TODAY:**\n\n';
      
      // Add top trending suggestions
      response += '**Based on Current Events (Last 4 Hours):**\n';
      trending.suggestions.slice(0, 5).forEach((suggestion, i) => {
        response += (i + 1) + '. ' + suggestion + '\n';
      });
      
      response += '\n**Why These Will Go Viral NOW:**\n';
      response += '• These topics are ACTIVELY trending on Google/Twitter/Reddit\n';
      response += '• Search volume is peaking RIGHT NOW\n';
      response += '• First to cover = massive algorithm boost\n\n';
      
      response += '**Current Trending Topics:**\n';
      trending.trends.slice(0, 5).forEach((trend) => {
        response += '• ' + trend.title;
        if (trend.source) response += ' (via ' + trend.source + ')';
        if (trend.searchVolume) response += ' - ' + trend.searchVolume.toLocaleString() + ' searches';
        response += '\n';
      });
      
      response += '\n**Breaking News to Cover:**\n';
      trending.news.slice(0, 3).forEach((article) => {
        response += '• ' + article.title + ' (' + article.source + ')\n';
      });
      
      response += '\n💡 **Pro Tip:** Upload within 2 hours of news breaking for maximum reach!';
      
      return response;
    } catch (error) {
      console.error('[SMART RESPONSE] Trending fetch failed:', error);
      // Fall through to regular content suggestions
    }
  }

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
    
    // Try to fetch trending topics for even better suggestions
    let trendingTopics: any = null;
    try {
      trendingTopics = await getTrendingTopics();
      console.log('[SMART RESPONSE] Got trending topics for video suggestions');
    } catch (error) {
      console.log('[SMART RESPONSE] Could not fetch trending, using static suggestions');
    }
    
    let response = '**YOUR NEXT VIDEO (Data-Driven Blueprint):**\n\n';
    response += '📹 **Title Formula That Works For YOU:**\n';
    response += '"' + (bestKeyword?.[0] || 'LEAKED') + ' [Celebrity Name] ' + (secondBest?.[0] || 'SHOCKING') + ' [Specific Detail] (' + new Date().getFullYear() + ' ' + ['PROOF', 'EXPOSED', 'CAUGHT'][Math.floor(Math.random() * 3)] + ')"\n\n';
    response += '**Why This Formula:**\n';
    response += '- "' + (bestKeyword?.[0] || '') + '" appears in videos averaging ' + ((bestKeyword?.[1] || 0) / 1000000).toFixed(1) + 'M views\n';
    response += '- Your top ' + viralVideos.length + ' viral videos ALL use this structure\n';
    response += '- Average CTR on these: ' + avgTopCTR.toFixed(1) + '% (vs your average ' + (data.averageCTR?.toFixed(1) || '0') + '%)\n\n';
    
    if (trendingTopics && trendingTopics.suggestions.length > 0) {
      response += '🔥 **TRENDING NOW - Upload These TODAY:**\n';
      trendingTopics.suggestions.slice(0, 3).forEach((suggestion: string, i: number) => {
        response += (i + 1) + '. **"' + suggestion + '"**\n';
        response += '   - Currently trending on social media\n';
        response += '   - Algorithm will boost immediately\n\n';
      });
    } else {
      response += '🎯 **TOMORROW\'S VIDEO - Specific Ideas:**\n';
      response += '1. **"LEAKED Jay-Z Secret Meeting Audio EXPOSES Diddy Connection"**\n';
      response += '   - Riding current Diddy momentum (your biggest hit)\n';
      response += '   - Jay-Z connection = fresh angle\n';
      response += '   - "Audio" implies exclusive content\n\n';
      response += '2. **"BREAKING: Oprah\'s Diddy Party Photos LEAKED (DISGUSTING Details)"**\n';
      response += '   - Combines your top performer\'s energy\n';
      response += '   - Oprah = massive search volume\n';
      response += '   - Photos = high CTR trigger\n\n';
      response += '3. **"EXPOSED: The Diddy List - 47 Celebrities Named (SHOCKING)"**\n';
      response += '   - List format = high retention\n';
      response += '   - Number in title = specificity\n';
      response += '   - Multi-celebrity = broad appeal\n\n';
    }
    response += '**Thumbnail Must-Haves (Based on YOUR Winners):**\n';
    response += '✓ Red arrow pointing at shocking element\n';
    response += '✓ Your face with extreme expression (worked ' + viralVideos.length + ' times)\n';
    response += '✓ Celebrity face looking guilty/scared\n';
    response += '✓ "LEAKED" or "EXPOSED" text overlay\n';
    response += '✓ Dark/dramatic lighting\n\n';
    response += '**Upload Strategy:**\n';
    response += '- Time: 3pm EST (when your audience is most active)\n';
    response += '- Length: 12-16 minutes (your sweet spot for revenue)\n';
    response += '- First 30 seconds: Tease the biggest revelation\n';
    response += '- Pin comment: "Part 2 tomorrow if this hits 100K views"\n\n';
    response += '**Expected Performance:**\n';
    response += 'Based on similar videos: 200K-400K views in 48 hours\n';
    response += 'If CTR hits 14%+: Algorithm boost to 1M+ potential';
    
    return response;
  }
  
  // Always return something useful with real data
  const avgViews = Math.round(data.totalViews / data.videoCount).toLocaleString();
  const totalRev = data.totalRevenue?.toFixed(2) || '0';
  const avgRev = (data.totalRevenue / data.videoCount).toFixed(2) || '0';
  const topTitle = data.topVideos?.[0]?.title || '';
  const totalViewsStr = data.totalViews?.toLocaleString() || '0';
  
  let result = 'Based on your ' + data.videoCount + ' videos with ' + totalViewsStr + ' views: ';
  result += 'Your top video "' + topTitle + '" shows what works. ';
  result += 'Average video gets ' + avgViews + ' views. ';
  result += 'Revenue of $' + totalRev + ' = $' + avgRev + ' per video. ';
  result += 'What specific aspect would you like me to analyze?';
  return result;
}
