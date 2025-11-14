'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './ChatInterface.module.css';

interface ChatInterfaceProps {
  analysisId: string;
  channelData: any;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Parse markdown-style formatting
const formatMessage = (text: string) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/•/g, '▸')
    .replace(/\n/g, '<br />');
};

export default function ChatInterface({ analysisId, channelData }: ChatInterfaceProps) {
  const getSmartPrompts = () => {
    const prompts = [];
    
    if (channelData?.averageCTR < 8) {
      prompts.push("Why is my CTR below industry standard?");
    }
    if (channelData?.topVideos?.[0]) {
      prompts.push(`Analyze "${channelData.topVideos[0].title.substring(0, 40)}..."`);
    }
    prompts.push("What's trending RIGHT NOW?");
    prompts.push("How do I reach 100M views?");
    prompts.push("What's my viral formula?");
    prompts.push("Show me revenue projections");
    prompts.push("What content should I make tomorrow?");
    prompts.push("What news should I cover today?");
    
    return prompts.slice(0, 6);
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Channel Analysis Complete

Total Views: ${channelData?.totalViews?.toLocaleString() || '0'}
Revenue: $${channelData?.totalRevenue?.toFixed(2) || '0'}
Videos: ${channelData?.videoCount || '0'}
Average CTR: ${channelData?.averageCTR?.toFixed(1) || '0'}%

Top Performer: "${channelData?.topVideos?.[0]?.title || 'No data'}"
→ ${channelData?.topVideos?.[0]?.views?.toLocaleString() || '0'} views

I have full access to your data. Ask me anything.`
    }
  ]);
  
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [promptsVisible, setPromptsVisible] = useState(true);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const prompts = getSmartPrompts();

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
    setPromptsVisible(false);

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
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.answer 
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Analysis based on your data: ${channelData?.videoCount} videos, ${channelData?.totalViews?.toLocaleString()} views. Processing...` 
      }]);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className={styles.chatWrapper}>
      <div className={styles.chatContainer}>
        {/* Header */}
        <div className={styles.chatHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.aiStatus}>
              <span className={styles.statusDot}></span>
              <span className={styles.statusText}>REAPER AI</span>
            </div>
            <span className={styles.headerSubtext}>YouTube Growth Intelligence</span>
          </div>
          <button 
            className={styles.resetBtn}
            onClick={() => {
              setMessages([messages[0]]);
              setPromptsVisible(true);
            }}
          >
            ↻
          </button>
        </div>

        {/* Messages Area */}
        <div className={styles.messagesContainer}>
          <div className={styles.messagesScroll}>
            {messages.map((msg, i) => (
              <div key={i} className={`${styles.messageWrapper} ${styles[msg.role]}`}>
                <div className={styles.messageInner}>
                  {msg.role === 'assistant' && (
                    <div className={styles.avatarWrapper}>
                      <div className={styles.avatar}>
                        <span className={styles.avatarIcon}>☠</span>
                      </div>
                    </div>
                  )}
                  <div className={styles.messageContent}>
                    <div 
                      className={styles.messageText}
                      dangerouslySetInnerHTML={{ 
                        __html: formatMessage(msg.content) 
                      }}
                    />
                  </div>
                  {msg.role === 'user' && (
                    <div className={styles.userAvatar}>
                      <span>You</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className={`${styles.messageWrapper} ${styles.assistant}`}>
                <div className={styles.messageInner}>
                  <div className={styles.avatarWrapper}>
                    <div className={styles.avatar}>
                      <span className={styles.avatarIcon}>☠</span>
                    </div>
                  </div>
                  <div className={styles.messageContent}>
                    <div className={styles.typingIndicator}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Smart Prompts */}
        {promptsVisible && messages.length === 1 && (
          <div className={styles.promptsContainer}>
            <div className={styles.promptsGrid}>
              {prompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => askQuestion(prompt)}
                  className={styles.promptBtn}
                  disabled={loading}
                >
                  <span className={styles.promptText}>{prompt}</span>
                  <span className={styles.promptArrow}>→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <form onSubmit={handleSubmit} className={styles.inputForm}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your YouTube analytics..."
              className={styles.input}
              disabled={loading}
            />
            <button 
              type="submit" 
              className={styles.sendBtn}
              disabled={loading || !input.trim()}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
