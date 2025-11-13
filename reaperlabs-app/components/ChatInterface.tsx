'use client';

import { useState } from 'react';
import styles from './ChatInterface.module.css';

interface ChatInterfaceProps {
  analysisId: string | number;
  channelData?: any;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatInterface({ analysisId, channelData }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `I've analyzed your channel data. Ask me anything about growing your YouTube channel - I can help with strategy, content ideas, optimization tips, or any specific challenges you're facing.` 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMessage,
          channelData: channelData || {},
          conversationHistory: messages
        })
      });

      let answer = "I'm having connection issues. Please try again.";
      
      if (response.ok) {
        const data = await response.json();
        answer = data.answer;
      } else {
        // Fallback to intelligent responses if API fails
        answer = getFallbackResponse(userMessage, channelData);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
    } catch (error) {
      console.error('Chat error:', error);
      const fallback = getFallbackResponse(userMessage, channelData);
      setMessages(prev => [...prev, { role: 'assistant', content: fallback }]);
    } finally {
      setLoading(false);
    }
  };

  const getFallbackResponse = (question: string, data: any): string => {
    // Intelligent fallback when API is down
    const q = question.toLowerCase();
    
    if (q.includes('help') || q.includes('what') || q.includes('how')) {
      return `I can help you with YouTube growth strategies, even though I'm currently operating with limited capabilities. Based on your ${data?.videoCount || 'channel'} videos and ${data?.totalViews || 'current'} views, try focusing on: consistent uploads, thumbnail optimization, and engaging with your audience. What specific area would you like to explore?`;
    }
    
    return `I'm currently having trouble accessing my full analytical capabilities, but I can still offer YouTube growth advice based on best practices. Your question "${question}" is important - generally, successful channels focus on consistency, optimization, and audience engagement. Can you tell me more about your specific situation so I can provide better guidance even with my current limitations?`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>🎯 REQUEST INTEL</h3>
      </div>

      <div className={styles.messages}>
        {messages.length === 0 && (
          <div className={styles.welcome}>
            <p>Request tactical analysis of your channel operations</p>
            <div className={styles.suggestions}>
              <button onClick={() => setInput("How can I increase my views?")}>
                How can I increase my views?
              </button>
              <button onClick={() => setInput("What content should I make next?")}>
                What content should I make next?
              </button>
              <button onClick={() => setInput("Why is my CTR low?")}>
                Why is my CTR low?
              </button>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`${styles.message} ${styles[msg.role]}`}>
            <div className={styles.avatar}>
              {msg.role === 'user' ? '👤' : '🤖'}
            </div>
            <div className={styles.content}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className={`${styles.message} ${styles.assistant}`}>
            <div className={styles.avatar}>🤖</div>
            <div className={styles.content}>
              <div className={styles.typing}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Request intel on your channel..."
          className={styles.input}
        />
        <button type="submit" className={styles.sendBtn} disabled={loading}>
          {loading ? '...' : 'EXECUTE'}
        </button>
      </form>
    </div>
  );
}
