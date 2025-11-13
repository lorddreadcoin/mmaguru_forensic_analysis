-- ReaperLabs Database Schema
-- PostgreSQL

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tier VARCHAR(50) DEFAULT 'free',
    analyses_count INTEGER DEFAULT 0,
    last_analysis_at TIMESTAMP
);

-- Channel analyses table
CREATE TABLE IF NOT EXISTS analyses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    channel_name VARCHAR(255),
    total_views BIGINT,
    total_watch_time NUMERIC(12, 2),
    total_revenue NUMERIC(10, 2),
    total_subscribers INTEGER,
    average_ctr NUMERIC(5, 2),
    video_count INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    raw_data JSONB,
    ai_insights JSONB
);

-- Video performance table
CREATE TABLE IF NOT EXISTS videos (
    id SERIAL PRIMARY KEY,
    analysis_id INTEGER REFERENCES analyses(id) ON DELETE CASCADE,
    video_id VARCHAR(50),
    title TEXT,
    views INTEGER,
    watch_time NUMERIC(10, 2),
    revenue NUMERIC(10, 2),
    ctr NUMERIC(5, 2),
    publish_date VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Questions asked table (for improving AI)
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    analysis_id INTEGER REFERENCES analyses(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at);
CREATE INDEX IF NOT EXISTS idx_videos_analysis_id ON videos(analysis_id);
CREATE INDEX IF NOT EXISTS idx_questions_user_id ON questions(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
