import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import crypto from 'crypto';

// Poll data structure
interface PollData {
  question: string;
  options: string[];
  votes: number[];
  voters: Set<string>; // Hashed voter IDs
}

// In-memory poll data (would be better in a database)
// For now using a simple server-side storage
let pollData: PollData = {
  question: "Do you regret voting for Trump?",
  options: [
    "Hell No - Would Do It Again Tomorrow",
    "Yes - I Got Played",
    "Didn't Vote - The System is Rigged Anyway"
  ],
  votes: [0, 0, 0], // Start at 0
  voters: new Set()
};

// Generate a unique voter ID based on IP + User Agent
function generateVoterId(ip: string, userAgent: string): string {
  const combined = `${ip}-${userAgent}`;
  return crypto.createHash('sha256').update(combined).digest('hex');
}

// GET - Retrieve current poll data
export async function GET() {
  return NextResponse.json({
    question: pollData.question,
    options: pollData.options,
    votes: pollData.votes,
    totalVotes: pollData.votes.reduce((sum, v) => sum + v, 0)
  });
}

// POST - Submit a vote
export async function POST(req: Request) {
  try {
    const { optionIndex } = await req.json();
    
    // Validate option index
    if (typeof optionIndex !== 'number' || optionIndex < 0 || optionIndex >= pollData.options.length) {
      return NextResponse.json(
        { error: 'Invalid option' },
        { status: 400 }
      );
    }
    
    // Get voter information
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';
    
    // Generate unique voter ID
    const voterId = generateVoterId(ip, userAgent);
    
    // Check if already voted
    if (pollData.voters.has(voterId)) {
      return NextResponse.json(
        { 
          error: 'Already voted',
          alreadyVoted: true,
          votes: pollData.votes,
          totalVotes: pollData.votes.reduce((sum, v) => sum + v, 0)
        },
        { status: 403 }
      );
    }
    
    // Record the vote
    pollData.votes[optionIndex]++;
    pollData.voters.add(voterId);
    
    console.log(`🗳️ New vote recorded! Option ${optionIndex} | Total voters: ${pollData.voters.size}`);
    
    return NextResponse.json({
      success: true,
      votes: pollData.votes,
      totalVotes: pollData.votes.reduce((sum, v) => sum + v, 0),
      votedFor: optionIndex
    });
    
  } catch (error) {
    console.error('Poll voting error:', error);
    return NextResponse.json(
      { error: 'Failed to record vote' },
      { status: 500 }
    );
  }
}
