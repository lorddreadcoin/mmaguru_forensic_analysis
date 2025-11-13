'use client';

import { useState, useEffect } from 'react';
import UploadSection from '../components/UploadSection';
import ChatInterface from '../components/ChatInterface';
import InsightsDisplay from '../components/InsightsDisplay';
import Image from 'next/image';
import './globals.css';

export default function HomePage() {
  const [analysisId, setAnalysisId] = useState<number | null>(null);
  const [insights, setInsights] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Add scanner line
    const scanner = document.createElement('div');
    scanner.className = 'scanner-line';
    document.body.appendChild(scanner);
    
    console.log(`
⚔️ REAPERLABS.AI ⚔️
========================
Elite Platform Activated
Protecting Creators Since 2024
========================
    `);
    
    return () => scanner.remove();
  }, []);

  const handleUploadComplete = (data: any) => {
    setAnalysisId(data.analysisId);
    setInsights(data.insights);
    setMetrics(data.metrics);
  };

  return (
    <div className="container">
      <header className="header">
        <div className="logo-container">
          <Image 
            src="/logo.png" 
            alt="ReaperLabs" 
            width={80} 
            height={80} 
            className="logo-image"
          />
          <div>
            <h1 className="logo-text">REAPERLABS.AI</h1>
            <p className="tagline">Elite YouTube Analytics Platform</p>
          </div>
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
              analysisId={analysisId}
              channelData={metrics || {}}
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
          style={{ marginTop: '2rem' }}
        >
          NEW ANALYSIS
        </button>
      )}
    </div>
  );
}
