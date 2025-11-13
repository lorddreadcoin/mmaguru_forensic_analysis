'use client';

import { useState } from 'react';
import styles from './ChatInterface.module.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  analysisId: number;
}

export default function ChatInterface({ analysisId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysisId,
          question: userMessage
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Sorry, I couldn\'t process that question. Please try again.' 
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'An error occurred. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
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
