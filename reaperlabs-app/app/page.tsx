'use client';

import { useState, useEffect } from 'react';
import UploadSection from '../components/UploadSection';
import InsightsDisplay from '../components/InsightsDisplay';
import ChatInterface from '../components/ChatInterface';
import FloatingReaper from '../components/FloatingReaper';
import { initMatrix, initReaperCursor } from './matrix.js';
import './globals.css';

export default function HomePage() {
  const [analysisId, setAnalysisId] = useState<number | null>(null);
  const [insights, setInsights] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize Matrix rain
    const cleanupMatrix = initMatrix();
    
    // Initialize custom cursor
    const cleanupCursor = initReaperCursor();
    
    // Add background layers
    const layers = document.createElement('div');
    layers.className = 'background-layers';
    layers.innerHTML = `
      <div class="layer-1"></div>
      <div class="layer-2"></div>
      <div class="layer-3"></div>
    `;
    document.body.appendChild(layers);
    
    // Add floating logo (large version)
    const floatingLogo = document.createElement('div');
    floatingLogo.className = 'floating-logo';
    floatingLogo.innerHTML = '<img src="/logo-large.png" alt="ReaperLabs" />';
    document.body.appendChild(floatingLogo);
    
    console.log(`
⚔️ REAPERLABS.AI - CYBERPUNK MODE ⚔️
========================
Matrix: ACTIVE
Cursor: SWORD MODE
Logo: FLOATING
========================
    `);
    
    return () => {
      cleanupMatrix?.();
      cleanupCursor?.();
      document.querySelector('#matrix-canvas')?.remove();
      layers?.remove();
      floatingLogo?.remove();
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
      <div className="container">
      <header className="header" style={{ marginBottom: '3rem' }}>
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
