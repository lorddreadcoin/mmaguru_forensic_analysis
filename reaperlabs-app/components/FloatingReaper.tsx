'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import styles from './FloatingReaper.module.css';

export default function FloatingReaper() {
  const [lookAt, setLookAt] = useState({ x: 0, y: 0, intensity: 0 });
  const [isTyping, setIsTyping] = useState(false);
  const [keyPress, setKeyPress] = useState(0);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    let activeInput: HTMLElement | null = null;
    
    // Track focus on input fields
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        activeInput = target;
        const rect = target.getBoundingClientRect();
        
        // Calculate angle to look at input
        const reaperX = window.innerWidth - 200; // Reaper position
        const reaperY = window.innerHeight / 2;
        
        const deltaX = rect.left + rect.width / 2 - reaperX;
        const deltaY = rect.top + rect.height / 2 - reaperY;
        
        // Convert to look angles
        const lookX = Math.max(-30, Math.min(30, deltaX * 0.05));
        const lookY = Math.max(-20, Math.min(20, deltaY * 0.05));
        
        setLookAt({ 
          x: lookX, 
          y: lookY,
          intensity: 1 
        });
        setIsTyping(true);
      }
    };
    
    // Reset when focus lost
    const handleBlur = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        activeInput = null;
        setIsTyping(false);
        
        // Slowly return to neutral
        setTimeout(() => {
          setLookAt({ x: 0, y: 0, intensity: 0 });
        }, 500);
      }
    };
    
    // Track individual keystrokes
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeInput) return;
      
      // Create typing effect - head bobs with each key
      setKeyPress(prev => prev + 1);
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Get caret position for more precise tracking
      const input = activeInput as HTMLInputElement;
      if (input.selectionStart !== null) {
        const charWidth = 10; // Approximate
        const rect = input.getBoundingClientRect();
        const caretX = rect.left + (input.selectionStart * charWidth);
        
        const reaperX = window.innerWidth - 200;
        const reaperY = window.innerHeight / 2;
        
        const deltaX = caretX - reaperX;
        const deltaY = rect.top + rect.height / 2 - reaperY;
        
        // More dramatic look for typing
        const lookX = Math.max(-40, Math.min(40, deltaX * 0.08));
        const lookY = Math.max(-25, Math.min(25, deltaY * 0.08));
        
        setLookAt({ 
          x: lookX + (Math.random() * 4 - 2), // Add slight jitter
          y: lookY + (Math.random() * 2 - 1),
          intensity: 1.2 
        });
      }
      
      // Reset after pause in typing
      typingTimeoutRef.current = setTimeout(() => {
        setLookAt(prev => ({ ...prev, intensity: 0.8 }));
      }, 200);
    };
    
    // Mouse tracking when not typing
    const handleMouseMove = (e: MouseEvent) => {
      if (isTyping) return; // Don't track mouse while typing
      
      const x = (e.clientX / window.innerWidth) * 20 - 10;
      const y = (e.clientY / window.innerHeight) * 20 - 10;
      
      setLookAt({ x, y, intensity: 0.5 });
    };
    
    // Add all event listeners
    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleBlur);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [isTyping]);
  
  return (
    <div className={styles.reaperContainer}>
      <div 
        className={`${styles.reaperWrapper} ${isTyping ? styles.watching : ''}`}
        style={{
          transform: `
            translate(${lookAt.x * 0.5}px, ${lookAt.y * 0.5}px) 
            rotateY(${-lookAt.x * 1.5}deg) 
            rotateX(${lookAt.y}deg)
            scale(${1 + lookAt.intensity * 0.05})
          `
        }}
      >
        {/* Head section with independent movement */}
        <div 
          className={styles.reaperHead}
          style={{
            transform: `
              rotateY(${-lookAt.x * 2}deg) 
              rotateX(${lookAt.y * 1.5}deg)
              translateZ(20px)
            `
          }}
        >
          <Image 
            src="/reaper-ghost.png"
            alt="Reaper Guardian"
            width={400}
            height={600}
            className={styles.reaperImage}
            priority
          />
        </div>
        
        {/* Eye glow that intensifies when typing */}
        <div 
          className={styles.eyeGlow}
          style={{
            opacity: isTyping ? 1 : 0.3,
            transform: `translate(${-lookAt.x * 2}px, ${lookAt.y * 2}px)` 
          }}
        />
        
        {/* Typing indicator */}
        {isTyping && (
          <div className={styles.typingPulse} style={{
            animationDuration: `${0.5 + Math.random() * 0.5}s` 
          }} />
        )}
      </div>
    </div>
  );
}
