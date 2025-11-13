// API Route: /api/ask
import { NextRequest, NextResponse } from 'next/server';
import { askQuestion } from '../../../lib/openrouter';
import { saveQuestion, getAnalysis } from '../../../lib/db/mock';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { analysisId, question, userId } = body;

    if (!analysisId || !question) {
      return NextResponse.json(
        { error: 'Missing analysisId or question' },
        { status: 400 }
      );
    }

    // Get analysis data from database
    const analysis = await getAnalysis(analysisId);

    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    const channelData = analysis.raw_data;

    // Ask AI the question
    const response = await askQuestion(channelData, question);
    const answer = response.answer;

    // Save question and answer
    if (userId) {
      await saveQuestion(userId, analysisId, question, answer);
    }

    return NextResponse.json({
      success: true,
      answer
    });

  } catch (error: any) {
    console.error('Ask error:', error);
    return NextResponse.json(
      { error: 'Failed to process question', details: error.message },
      { status: 500 }
    );
  }
}
