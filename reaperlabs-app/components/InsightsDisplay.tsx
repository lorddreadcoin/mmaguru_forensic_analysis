'use client';

import styles from './InsightsDisplay.module.css';

interface InsightsDisplayProps {
  insights: {
    strengths: string[];
    problems: string[];
    actionItems: string[];
  };
  metrics?: {
    totalViews?: number | string;
    totalRevenue?: number | string;
    averageCTR?: number | string;
    videoCount?: number | string;
  };
}

export default function InsightsDisplay({ insights, metrics }: InsightsDisplayProps) {
  // Safely convert values to numbers
  const safeNumber = (val: any): number => {
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  };

  // Format numbers safely
  const formatNumber = (val: any): string => {
    const num = safeNumber(val);
    return num.toLocaleString();
  };

  const formatCurrency = (val: any): string => {
    const num = safeNumber(val);
    return `$${num.toFixed(2)}`;
  };

  const formatPercent = (val: any): string => {
    const num = safeNumber(val);
    return `${num.toFixed(1)}%`;
  };

  return (
    <div className={styles.container}>
      {metrics && (
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>TOTAL VIEWS</span>
            <span className={styles.metricValue}>{formatNumber(metrics.totalViews)}</span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>REVENUE</span>
            <span className={styles.metricValue}>{formatCurrency(metrics.totalRevenue)}</span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>AVG CTR</span>
            <span className={styles.metricValue}>{formatPercent(metrics.averageCTR)}</span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>VIDEOS</span>
            <span className={styles.metricValue}>{formatNumber(metrics.videoCount)}</span>
          </div>
        </div>
      )}

      <div className={styles.insightsGrid}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>⚔️ TACTICAL ADVANTAGES</h3>
          <ul className={styles.list}>
            {insights.strengths?.map((strength, i) => (
              <li key={i} className={styles.listItem}>{strength}</li>
            )) || <li>Loading strengths...</li>}
          </ul>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>⚠️ THREAT ANALYSIS</h3>
          <ul className={styles.list}>
            {insights.problems?.map((problem, i) => (
              <li key={i} className={styles.listItem}>{problem}</li>
            )) || <li>Loading problems...</li>}
          </ul>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>🎯 MISSION OBJECTIVES</h3>
          <ul className={styles.list}>
            {insights.actionItems?.map((item, i) => (
              <li key={i} className={styles.listItem}>{item}</li>
            )) || <li>Loading action items...</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
