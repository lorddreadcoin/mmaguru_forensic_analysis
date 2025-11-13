'use client';

import { useState, useRef } from 'react';
import styles from './UploadSection.module.css';

interface UploadSectionProps {
  onUploadComplete: (data: any) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export default function UploadSection({ onUploadComplete, loading, setLoading }: UploadSectionProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [email, setEmail] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFiles = Array.from(e.dataTransfer.files).filter(
        file => file.name.endsWith('.csv')
      );
      setFiles(droppedFiles);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
    }
  };

  const handleSubmit = async () => {
    if (files.length === 0 || !email) {
      alert('Please upload CSV files and enter your email');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('email', email);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        onUploadComplete(data);
      } else {
        alert(data.error || 'Analysis failed');
      }
    } catch (error) {
      alert('Failed to analyze. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.uploadBox}>
        <h2>DEPLOY ANALYTICS</h2>
        <p>Upload YouTube CSV • Get AI Intel • Dominate Platform</p>

        <div
          className={`${styles.dropZone} ${dragActive ? styles.active : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".csv"
            onChange={handleChange}
            style={{ display: 'none' }}
          />
          
          <div className={styles.dropContent}>
            <span className={styles.icon}>⚔️</span>
            <p>Drag & drop your CSV files here</p>
            <p className={styles.or}>or</p>
            <button className={styles.browseBtn}>Browse Files</button>
          </div>

          {files.length > 0 && (
            <div className={styles.fileList}>
              {files.map((file, idx) => (
                <div key={idx} className={styles.file}>
                  ✅ {file.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.emailSection}>
          <input
            type="email"
            placeholder="Enter your email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.emailInput}
          />
        </div>

        <button
          className={styles.analyzeBtn}
          onClick={handleSubmit}
          disabled={loading || files.length === 0 || !email}
        >
          {loading ? (
            <>Analyzing<span className="loading"></span></>
          ) : (
            '⚔️ EXECUTE ANALYSIS'
          )}
        </button>

        <div className={styles.examples}>
          <h3>INTEL REQUESTS:</h3>
          <ul>
            <li>"How do I get to 1M subscribers?"</li>
            <li>"What videos should I make next?"</li>
            <li>"Why are my views dropping?"</li>
            <li>"What's my best revenue opportunity?"</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
