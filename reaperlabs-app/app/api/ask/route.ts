import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = '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';

export async function POST(req: NextRequest) {
  try {
    const { question, channelData, conversationHistory } = await req.json();
    
    // Build context about the channel
    const context = channelData ? `
      Channel Stats:
      - Total Views: ${channelData.totalViews || 'Unknown'}
      - Videos: ${channelData.videoCount || 'Unknown'}
      - Revenue: $${channelData.totalRevenue || 0}
      - CTR: ${channelData.averageCTR || 'Unknown'}%
    ` : 'No channel data available.';
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://reaperlabsai-analytics.netlify.app',
        'X-Title': 'ReaperLabs Analytics'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.2-1b-instruct:free',
        messages: [
          {
            role: 'system',
            content: `You are an expert YouTube growth strategist. You have access to this channel's data: ${context}. 
            Provide specific, actionable advice. Be conversational and helpful. 
            If you can't answer something, explain what information you'd need.`
          },
          {
            role: 'user',
            content: question
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenRouter error:', error);
      throw new Error('API request failed');
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || "I'm having trouble connecting to my analysis systems. Please try again.";
    
    return NextResponse.json({ answer });
    
  } catch (error) {
    console.error('Ask API error:', error);
    
    // Return a helpful response even if API fails
    return NextResponse.json({ 
      answer: "I'm currently having technical difficulties reaching my full analysis capabilities. However, based on YouTube best practices: focus on consistent uploads (2x daily), optimize your thumbnails for 10%+ CTR, and engage with comments in the first hour. What specific aspect of growth would you like to explore?"
    });
  }
}
