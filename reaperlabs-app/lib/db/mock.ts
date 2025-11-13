// Mock database for MVP (no PostgreSQL needed)
// This allows the app to work without setting up a database

interface User {
  id: number;
  email: string;
  name?: string;
  tier: 'free' | 'creator' | 'pro' | 'agency';
  analyses_count: number;
}

interface Analysis {
  id: number;
  user_id: number;
  raw_data: any;
  ai_insights: any;
  created_at: Date;
}

// In-memory storage
const users: Map<string, User> = new Map();
const analyses: Map<number, Analysis> = new Map();
let userIdCounter = 1;
let analysisIdCounter = 1;

export async function getOrCreateUser(email: string, name?: string): Promise<User> {
  const existing = users.get(email);
  
  if (existing) {
    return existing;
  }

  const newUser: User = {
    id: userIdCounter++,
    email,
    name,
    tier: 'free',
    analyses_count: 0
  };

  users.set(email, newUser);
  return newUser;
}

export async function saveAnalysis(
  userId: number,
  metrics: any,
  insights: any
): Promise<Analysis> {
  const analysis: Analysis = {
    id: analysisIdCounter++,
    user_id: userId,
    raw_data: metrics,
    ai_insights: insights,
    created_at: new Date()
  };

  analyses.set(analysis.id, analysis);
  
  // Update user count
  for (const user of users.values()) {
    if (user.id === userId) {
      user.analyses_count++;
      break;
    }
  }

  return analysis;
}

export async function saveVideos(analysisId: number, videos: any[]): Promise<void> {
  // Videos are already stored in the analysis raw_data
  return Promise.resolve();
}

export async function getUserAnalyses(userId: number): Promise<Analysis[]> {
  const userAnalyses: Analysis[] = [];
  
  for (const analysis of analyses.values()) {
    if (analysis.user_id === userId) {
      userAnalyses.push(analysis);
    }
  }
  
  return userAnalyses;
}

export async function saveQuestion(
  userId: number,
  analysisId: number,
  question: string,
  answer: string
): Promise<void> {
  // For MVP, we don't need to store questions
  return Promise.resolve();
}

export async function canAnalyze(userId: number): Promise<boolean> {
  // For MVP, allow unlimited analyses
  return true;
}

export async function getAnalysis(analysisId: number): Promise<Analysis | null> {
  return analyses.get(analysisId) || null;
}
