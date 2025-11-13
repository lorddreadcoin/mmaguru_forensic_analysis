'use client';

import { useState, useEffect } from 'react';
import UploadSection from '../components/UploadSection';
import InsightsDisplay from '../components/InsightsDisplay';
import ChatInterface from '../components/ChatInterface';
import FloatingReaper from '../components/FloatingReaper';
import Image from 'next/image';
import { initMatrix, initReaperCursor } from './matrix.js';
import './globals.css';

export default function HomePage() {
  const [analysisId, setAnalysisId] = useState<number | null>(null);
  const [insights, setInsights] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    console.log(`⚔️ REAPERLABS.AI - INITIALIZED ⚔️
========================
Platform: ACTIVE
Reaper: WATCHING
Analytics: READY
========================`);
    
    const cleanupMatrix = initMatrix();
    const cleanupCursor = initReaperCursor();
    
    // Add layered backgrounds dynamically
    const layers = document.createElement('div');
    layers.className = 'background-layers';
    layers.innerHTML = `
      <div class="layer-1"></div>
      <div class="layer-2"></div>
      <div class="layer-3"></div>
    `;
    document.body.appendChild(layers);
    
    // Check if images exist
    if (typeof window !== 'undefined') {
      const checkImages = async () => {
        try {
          // Preload critical images
          const img = new window.Image();
          img.src = '/logo.png';
          img.onerror = () => setLogoError(true);
        } catch (e) {
          console.warn('Logo preload failed, using fallback');
          setLogoError(true);
        }
      };
      checkImages();
    }
    
    return () => {
      cleanupMatrix?.();
      cleanupCursor?.();
      document.querySelector('#matrix-canvas')?.remove();
      layers?.remove();
    };
  }, []);

  const handleUploadComplete = (data: any) => {
    setAnalysisId(data.analysisId);
    setInsights(data.insights);
    setMetrics(data.metrics);
  };

  return (
    <>
      <FloatingReaper />
      
      {/* Floating Logo - Left Side */}
      <div className="floating-logo" style={{
        position: 'fixed',
        left: '3%',
        top: '10%',
        width: '120px',
        height: '120px',
        zIndex: 100,
        filter: 'drop-shadow(0 20px 40px rgba(255, 0, 0, 0.6))'
      }}>
        {!logoError ? (
          <Image 
            src="/logo.png"
            alt="ReaperLabs"
            width={120}
            height={120}
            onError={() => setLogoError(true)}
            style={{ width: '100%', height: 'auto' }}
            priority
          />
        ) : (
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <rect x="10" y="10" width="100" height="100" stroke="#ff0000" strokeWidth="2" fill="rgba(139,0,0,0.2)"/>
            <text x="60" y="65" textAnchor="middle" fill="#ff0000" fontSize="16" fontFamily="Orbitron">REAPER</text>
            <text x="60" y="85" textAnchor="middle" fill="#c0c0c0" fontSize="12" fontFamily="Orbitron">LABS.AI</text>
          </svg>
        )}
      </div>
      
      <div className="container">
        <header className="header" style={{ marginBottom: '3rem', paddingTop: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 className="logo-text" style={{
            fontSize: '4rem',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #ff0000, #dc143c, #c0c0c0)',
            backgroundSize: '200% 200%',
            animation: 'shimmer 3s ease-in-out infinite',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 40px rgba(255, 0, 0, 0.5)',
            letterSpacing: '5px'
          }}>
            REAPERLABS.AI
          </h1>
          <p className="tagline" style={{
            color: '#dc143c',
            textTransform: 'uppercase',
            letterSpacing: '4px',
            fontSize: '0.9rem',
            marginTop: '0.5rem'
          }}>
            Elite YouTube Analytics Platform
          </p>
        </div>
      </header>

      <main className="main">
        {!analysisId ? (
          <UploadSection 
            onUploadComplete={handleUploadComplete}
            loading={loading}
            setLoading={setLoading}
          />
        ) : (
          <div className="analysis-view">
            <InsightsDisplay 
              insights={insights || {}} 
              metrics={metrics || {}}
            />
            <ChatInterface 
              analysisId={String(analysisId)}
              channelData={metrics}
            />
          </div>
        )}
      </main>

      {analysisId && (
        <button 
          className="btn"
          onClick={() => {
            setAnalysisId(null);
            setInsights(null);
            setMetrics(null);
          }}
          style={{ 
            marginTop: '2rem',
            background: 'linear-gradient(135deg, #dc143c, #8b0000)',
            border: '1px solid #ff0000',
            padding: '1rem 2rem',
            fontSize: '1rem',
            letterSpacing: '2px'
          }}
        >
          NEW ANALYSIS ⚔️
        </button>
      )}
      </div>
    </>
  );
}
