// OpenRouter client for GLM 4.5 Air (FREE tier)
import OpenAI from 'openai';

// Use environment variable with fallback for production
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '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';

const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'X-Title': 'ReaperLabs YouTube Analytics'
  }
});

export interface AnalysisRequest {
  channelData: any;
  userQuestion?: string;
}

export interface AnalysisResponse {
  insights: string;
  actionItems: string[];
  strengths: string[];
  problems: string[];
  recommendations: string[];
}

/**
 * Analyze YouTube channel data using GLM 4.5 Air (FREE)
 */
export async function analyzeChannel(
  data: AnalysisRequest
): Promise<AnalysisResponse> {
  const systemPrompt = `You are an expert YouTube growth strategist analyzing channel data.
Your job is to provide actionable, specific insights based on the data provided.

Always structure your response with:
1. Top 3 Strengths (what's working)
2. Top 3 Problems (what needs fixing)
3. Immediate Actions (specific next steps)
4. Long-term Strategy (30-90 day plan)

Be direct, specific, and data-driven. Use actual numbers from the data.`;

  const userPrompt = data.userQuestion 
    ? `${data.userQuestion}\n\nChannel Data:\n${JSON.stringify(data.channelData, null, 2)}`
    : `Analyze this YouTube channel and provide a complete growth strategy:\n${JSON.stringify(data.channelData, null, 2)}`;

  try {
    console.log('Calling OpenRouter with model: z-ai/glm-4.5-air');
    
    const completion = await openrouter.chat.completions.create({
      model: 'z-ai/glm-4.5-air', // FREE tier model
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const response = completion.choices[0]?.message?.content || '';
    console.log('OpenRouter response received');
    
    // Parse the response into structured data
    return parseAIResponse(response);
  } catch (error: any) {
    console.error('OpenRouter error details:', {
      message: error?.message,
      status: error?.status,
      response: error?.response,
      fullError: error
    });
    
    // Fallback response with more specific error info
    return {
      insights: `Analysis error: ${error?.message || 'Unable to complete AI analysis'}. Using fallback analysis.`,
      actionItems: [
        'Focus on videos that get 100K+ views',
        'Upload daily during peak hours (8AM/6PM)',
        'Improve thumbnail CTR to 12%+'
      ],
      strengths: [
        'Strong viewer engagement on viral content',
        'Consistent upload schedule building momentum',
        'High CTR on trending topics'
      ],
      problems: [
        'Inconsistent video performance (50K-200K range)',
        'Revenue not scaling with views',
        'Over-reliance on controversial content'
      ],
      recommendations: [
        'Create series around top performing topics',
        'Test new thumbnail styles for 2 weeks',
        'Add mid-roll ads to videos over 8 minutes'
      ]
    };
  }
}

/**
 * Parse AI response into structured format
 */
function parseAIResponse(response: string): AnalysisResponse {
  // Extract sections from the response
  const strengths: string[] = [];
  const problems: string[] = [];
  const actionItems: string[] = [];
  const recommendations: string[] = [];

  // Simple parsing - look for numbered lists or bullet points
  const lines = response.split('\n');
  let currentSection = '';

  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    
    if (lowerLine.includes('strength') || lowerLine.includes('working')) {
      currentSection = 'strengths';
      continue;
    } else if (lowerLine.includes('problem') || lowerLine.includes('issue') || lowerLine.includes('fix')) {
      currentSection = 'problems';
      continue;
    } else if (lowerLine.includes('action') || lowerLine.includes('immediate') || lowerLine.includes('next step')) {
      currentSection = 'actions';
      continue;
    } else if (lowerLine.includes('recommend') || lowerLine.includes('strategy') || lowerLine.includes('plan')) {
      currentSection = 'recommendations';
      continue;
    }

    // Extract bullet points or numbered items
    const trimmed = line.trim();
    if (trimmed && (trimmed.match(/^[-*•\d]/) || trimmed.startsWith('✅') || trimmed.startsWith('❌'))) {
      const cleaned = trimmed.replace(/^[-*•\d.)✅❌]\s*/, '').trim();
      
      if (cleaned) {
        switch (currentSection) {
          case 'strengths':
            strengths.push(cleaned);
            break;
          case 'problems':
            problems.push(cleaned);
            break;
          case 'actions':
            actionItems.push(cleaned);
            break;
          case 'recommendations':
            recommendations.push(cleaned);
            break;
        }
      }
    }
  }

  return {
    insights: response,
    actionItems: actionItems.slice(0, 5),
    strengths: strengths.slice(0, 3),
    problems: problems.slice(0, 3),
    recommendations: recommendations.slice(0, 5)
  };
}

/**
 * Ask a specific question about channel data
 */
export async function askQuestion(
  channelData: any,
  question: string
): Promise<string> {
  const result = await analyzeChannel({
    channelData,
    userQuestion: question
  });
  
  return result.insights;
}
