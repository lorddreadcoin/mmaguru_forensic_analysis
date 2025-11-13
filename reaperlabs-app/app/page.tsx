'use client';

import { useState, useEffect } from 'react';
import UploadSection from '../components/UploadSection';
import ChatInterface from '../components/ChatInterface';
import InsightsDisplay from '../components/InsightsDisplay';
import './globals.css';

export default function HomePage() {
  const [analysisId, setAnalysisId] = useState<number | null>(null);
  const [insights, setInsights] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(`
⚔️ REAPERLABS ANALYTICS ⚔️
========================
Elite Platform Activated
Protecting Creators Since 2024
========================
    `);
  }, []);

  const handleUploadComplete = (data: any) => {
    setAnalysisId(data.analysisId);
    setInsights(data.insights);
    setMetrics(data.metrics);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="logo">REAPERLABS</h1>
        <p className="tagline">Elite YouTube Analytics Platform</p>
        <p className="subtitle">Protecting Creators From Platform Death</p>
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
          className="new-analysis-btn"
          onClick={() => {
            setAnalysisId(null);
            setInsights(null);
            setMetrics(null);
          }}
        >
          NEW MISSION
        </button>
      )}
    </div>
  );
}
