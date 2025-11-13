'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './ChatInterface.module.css';

interface ChatInterfaceProps {
  analysisId: string | number;
  channelData: any;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatInterface({ analysisId, channelData }: ChatInterfaceProps) {
  // Smart suggestions based on actual channel data
  const getQuickPrompts = () => {
    const prompts = [
      "What content should I make next?",
      "Why did my top video perform so well?",
      "What videos almost went viral and why did they miss?",
      "How do I reach 100M views?",
      "Analyze my revenue potential",
      "What's killing my channel growth?",
      "Compare my CTR to industry standards",
      "What patterns do you see in my top 10 videos?"
    ];
    
    // Add dynamic prompts based on their data
    if (channelData?.averageCTR < 8) {
      prompts.push("How can I improve my CTR?");
    }
    if (channelData?.topVideos?.[0]) {
      prompts.push(`Make a series based on "${channelData.topVideos[0].title.substring(0, 30)}..."`);
    }
    
    return prompts;
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `🎯 **Channel Analysis Complete!**

📊 **Your Stats:**
• ${channelData?.totalViews?.toLocaleString() || '0'} total views
• $${channelData?.totalRevenue?.toFixed(2) || '0'} revenue
• ${channelData?.videoCount || '0'} videos
• ${channelData?.averageCTR?.toFixed(1) || '0'}% CTR

🏆 **Top Video:** "${channelData?.topVideos?.[0]?.title || 'No data'}"

I have full access to your data. Ask me anything!`
    }
  ]);
  
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const [promptsExpanded, setPromptsExpanded] = useState(true);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const prompts = getQuickPrompts();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    await askQuestion(input);
  };

  const askQuestion = async (question: string) => {
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: question }]);
    setLoading(true);
    
    // Auto-collapse prompts after first question but keep them available
    if (messages.length === 1) {
      setPromptsExpanded(false);
    }

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          channelData,
          conversationHistory: messages.slice(-6)
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `I'll analyze that based on your data: With ${channelData?.videoCount} videos and ${channelData?.totalViews?.toLocaleString()} views, you're averaging ${Math.round(channelData?.totalViews / channelData?.videoCount).toLocaleString()} views per video. Let me think about "${question}" specifically...` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([{
      role: 'assistant',
      content: `🎯 **Channel Analysis Reset**
      
I still have all your data loaded. What would you like to explore?`
    }]);
    setPromptsExpanded(true);
  };

  const getFallbackResponse = (question: string, data: any): string => {
    // Intelligent fallback that still uses real data
    const q = question.toLowerCase();
    
    if (q.includes('top') || q.includes('best') || q.includes('video')) {
      const topVideos = data?.topVideos?.slice(0, 5).map((v: any, i: number) => 
        `${i+1}. "${v.title}" - ${v.views?.toLocaleString()} views`
      ).join('\n') || 'No video data available';
      return `Here are your top performing videos:\n\n${topVideos}\n\nYour best video has ${data?.topVideos?.[0]?.views?.toLocaleString()} views. What would you like to know about them?`;
    }
    
    if (q.includes('revenue') || q.includes('money') || q.includes('earnings')) {
      return `Your channel has generated $${data?.totalRevenue?.toFixed(2) || '0'} in total revenue across ${data?.videoCount || '0'} videos. That's an average of $${(data?.totalRevenue / data?.videoCount || 0).toFixed(2)} per video. Your top earner "${data?.topVideos?.[0]?.title}" made $${data?.topVideos?.[0]?.revenue?.toFixed(2) || '0'}. Want tips on increasing revenue?`;
    }
    
    if (q.includes('ctr') || q.includes('click')) {
      return `Your average CTR is ${data?.averageCTR?.toFixed(1) || '0'}%. Your best performing video "${data?.topVideos?.[0]?.title}" achieved ${data?.topVideos?.[0]?.ctr?.toFixed(1) || '0'}% CTR. To improve: use faces in thumbnails, add text overlays, and create curiosity gaps. Which videos need CTR improvement?`;
    }
    
    return `Based on your ${data?.totalViews?.toLocaleString() || '0'} total views across ${data?.videoCount || '0'} videos (averaging ${Math.round((data?.totalViews || 0) / (data?.videoCount || 1)).toLocaleString()} views per video), I can provide specific insights. Your top video "${data?.topVideos?.[0]?.title}" shows what works. What aspect would you like to explore?`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h3>🤖 YOUTUBE ANALYTICS AI</h3>
          <button 
            onClick={resetChat} 
            className={styles.resetButton}
            title="Start new conversation"
          >
            ↻ New Chat
          </button>
        </div>
        <span className={styles.subtitle}>Your Personal Growth Strategist</span>
      </div>

      {/* Persistent Quick Prompts Section */}
      {showPrompts && (
        <div className={styles.promptsSection}>
          <div 
            className={styles.promptsHeader}
            onClick={() => setPromptsExpanded(!promptsExpanded)}
          >
            <span>💡 Quick Questions</span>
            <span className={styles.expandIcon}>
              {promptsExpanded ? '▼' : '▶'}
            </span>
          </div>
          
          {promptsExpanded && (
            <div className={styles.promptsGrid}>
              {prompts.slice(0, 8).map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => askQuestion(prompt)}
                  className={styles.promptButton}
                  disabled={loading}
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      
      <div className={styles.messages}>
        {messages.map((msg, i) => (
          <div key={i} className={`${styles.message} ${styles[msg.role]}`}>
            <span className={styles.role}>
              {msg.role === 'user' ? '👤' : '🤖'}
            </span>
            <div className={styles.content}>
              {msg.content.split('\n').map((line, j) => (
                <div key={j}>{line || '\u00A0'}</div>
              ))}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className={`${styles.message} ${styles.assistant}`}>
            <span className={styles.role}>🤖</span>
            <div className={styles.content}>
              <span className={styles.typing}>Analyzing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about your YouTube channel..."
          className={styles.input}
          disabled={loading}
        />
        <button 
          type="submit" 
          className={`btn btn-primary ${styles.button}`} 
          disabled={loading || !input.trim()}
        >
          {loading ? '...' : 'ASK'}
        </button>
      </form>
    </div>
  );
}
