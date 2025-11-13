'use client';

import styles from './InsightsDisplay.module.css';

interface InsightsDisplayProps {
  insights: any;
  metrics: any;
}

export default function InsightsDisplay({ insights, metrics }: InsightsDisplayProps) {
  return (
    <div className={styles.container}>
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.label}>Total Views</div>
          <div className={styles.value}>
            {(metrics?.totalViews / 1000000).toFixed(1)}M
          </div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.label}>Revenue</div>
          <div className={styles.value}>
            ${(metrics?.totalRevenue || 0).toLocaleString()}
          </div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.label}>Avg CTR</div>
          <div className={styles.value}>
            {(metrics?.averageCTR || 0).toFixed(1)}%
          </div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.label}>Videos</div>
          <div className={styles.value}>
            {metrics?.videoCount || 0}
          </div>
        </div>
      </div>

      {insights?.strengths && insights.strengths.length > 0 && (
        <div className={styles.section}>
          <h3>⚔️ TACTICAL ADVANTAGES</h3>
          <ul>
            {insights.strengths.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {insights?.problems && insights.problems.length > 0 && (
        <div className={styles.section}>
          <h3>⚠️ THREAT ANALYSIS</h3>
          <ul>
            {insights.problems.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {insights?.actionItems && insights.actionItems.length > 0 && (
        <div className={styles.section}>
          <h3>🎯 MISSION OBJECTIVES</h3>
          <ul>
            {insights.actionItems.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {metrics?.topVideos && metrics.topVideos.length > 0 && (
        <div className={styles.section}>
          <h3>🔥 HIGH-VALUE TARGETS</h3>
          <div className={styles.videoList}>
            {metrics.topVideos.slice(0, 5).map((video: any, idx: number) => (
              <div key={idx} className={styles.video}>
                <span className={styles.rank}>#{idx + 1}</span>
                <div className={styles.videoInfo}>
                  <div className={styles.videoTitle}>{video.title}</div>
                  <div className={styles.videoStats}>
                    {(video.views / 1000).toFixed(0)}K views • 
                    ${video.revenue.toFixed(0)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
