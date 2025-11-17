"""
Analyze COMPLETE channel history from CSV files
Get the REAL metrics from ALL videos, not just recent
Focus on October 2024 bot period for MMA GURU
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def parse_number(value):
    """Parse numbers with K/M suffixes"""
    if pd.isna(value):
        return 0
    if isinstance(value, (int, float)):
        return float(value)
    
    value_str = str(value).strip()
    if value_str.endswith('K'):
        return float(value_str[:-1]) * 1000
    elif value_str.endswith('M'):
        return float(value_str[:-1]) * 1000000
    else:
        try:
            return float(value_str.replace(',', ''))
        except:
            return 0

def analyze_complete_channel(csv_path, channel_name):
    """Analyze COMPLETE channel history"""
    print(f"\n{'='*70}")
    print(f"COMPLETE ANALYSIS: {channel_name}")
    print(f"{'='*70}")
    
    # Load ALL data
    df = pd.read_csv(csv_path)
    print(f"Total Videos: {len(df)}")
    
    # Parse numeric columns
    for col in ['VIEWS', 'YT LIKES', 'YT COMMENTS']:
        if col in df.columns:
            df[col] = df[col].apply(parse_number)
    
    # Parse dates
    df['DATE'] = pd.to_datetime(df['DATE PUBLISHED'], dayfirst=True, errors='coerce')
    df = df[df['DATE'].notna()]
    
    # OVERALL METRICS (ALL TIME)
    total_views = df['VIEWS'].sum()
    total_likes = df['YT LIKES'].sum() if 'YT LIKES' in df.columns else 0
    total_comments = df['YT COMMENTS'].sum() if 'YT COMMENTS' in df.columns else 0
    overall_engagement = ((total_likes + total_comments) / total_views * 100) if total_views > 0 else 0
    
    print(f"\nOVERALL METRICS (ALL TIME):")
    print(f"  Total Views: {total_views:,.0f}")
    print(f"  Total Likes: {total_likes:,.0f}")
    print(f"  Total Comments: {total_comments:,.0f}")
    print(f"  Overall Engagement: {overall_engagement:.2f}%")
    
    # Group by date for time series analysis
    daily_views = df.groupby(df['DATE'].dt.date)['VIEWS'].sum()
    daily_likes = df.groupby(df['DATE'].dt.date)['YT LIKES'].sum() if 'YT LIKES' in df.columns else pd.Series()
    daily_comments = df.groupby(df['DATE'].dt.date)['YT COMMENTS'].sum() if 'YT COMMENTS' in df.columns else pd.Series()
    
    # Calculate spike ratio (max vs median)
    if len(daily_views) > 0:
        median_views = daily_views.median()
        max_views = daily_views.max()
        max_date = daily_views.idxmax()
        spike_ratio = max_views / median_views if median_views > 0 else 1
        
        print(f"\nSPIKE ANALYSIS:")
        print(f"  Median Daily Views: {median_views:,.0f}")
        print(f"  Max Daily Views: {max_views:,.0f} on {max_date}")
        print(f"  Spike Ratio: {spike_ratio:.2f}x")
    
    # Calculate variance (coefficient of variation)
    if len(daily_views) > 1:
        mean_views = daily_views.mean()
        std_views = daily_views.std()
        variance_cov = std_views / mean_views if mean_views > 0 else 0
        print(f"\nVARIANCE ANALYSIS:")
        print(f"  Mean Daily Views: {mean_views:,.0f}")
        print(f"  Std Dev: {std_views:,.0f}")
        print(f"  Variance (CoV): {variance_cov:.3f}")
    else:
        variance_cov = 0
    
    # ANALYZE SPECIFIC PERIODS
    print(f"\nKEY PERIOD ANALYSIS:")
    
    # October 2024 for MMA GURU bot detection
    oct_2024_start = pd.Timestamp('2024-10-01')
    oct_2024_end = pd.Timestamp('2024-10-31')
    oct_2024_data = df[(df['DATE'] >= oct_2024_start) & (df['DATE'] <= oct_2024_end)]
    
    if len(oct_2024_data) > 0:
        oct_views = oct_2024_data['VIEWS'].sum()
        oct_likes = oct_2024_data['YT LIKES'].sum() if 'YT LIKES' in oct_2024_data.columns else 0
        oct_comments = oct_2024_data['YT COMMENTS'].sum() if 'YT COMMENTS' in oct_2024_data.columns else 0
        oct_engagement = ((oct_likes + oct_comments) / oct_views * 100) if oct_views > 0 else 0
        
        print(f"\n  OCTOBER 2024 (Bot Period for MMA):")
        print(f"    Videos: {len(oct_2024_data)}")
        print(f"    Total Views: {oct_views:,.0f}")
        print(f"    Engagement: {oct_engagement:.2f}%")
        
        # Check October 18-26 specifically (known bot period)
        oct_18_26_data = df[(df['DATE'] >= pd.Timestamp('2024-10-18')) & 
                            (df['DATE'] <= pd.Timestamp('2024-10-26'))]
        if len(oct_18_26_data) > 0:
            bot_period_views = oct_18_26_data['VIEWS'].sum()
            bot_period_likes = oct_18_26_data['YT LIKES'].sum() if 'YT LIKES' in oct_18_26_data.columns else 0
            bot_period_comments = oct_18_26_data['YT COMMENTS'].sum() if 'YT COMMENTS' in oct_18_26_data.columns else 0
            bot_period_engagement = ((bot_period_likes + bot_period_comments) / bot_period_views * 100) if bot_period_views > 0 else 0
            
            print(f"\n    OCTOBER 18-26 (Specific Bot Window):")
            print(f"      Videos: {len(oct_18_26_data)}")
            print(f"      Views: {bot_period_views:,.0f}")
            print(f"      Engagement: {bot_period_engagement:.2f}%")
    
    # September 2024 for Jesse's Trump spike
    sept_2024_data = df[(df['DATE'] >= pd.Timestamp('2024-09-01')) & 
                        (df['DATE'] <= pd.Timestamp('2024-09-30'))]
    
    if len(sept_2024_data) > 0:
        sept_views = sept_2024_data['VIEWS'].sum()
        sept_likes = sept_2024_data['YT LIKES'].sum() if 'YT LIKES' in sept_2024_data.columns else 0
        sept_comments = sept_2024_data['YT COMMENTS'].sum() if 'YT COMMENTS' in sept_2024_data.columns else 0
        sept_engagement = ((sept_likes + sept_comments) / sept_views * 100) if sept_views > 0 else 0
        
        print(f"\n  SEPTEMBER 2024 (Jesse's Trump Spike):")
        print(f"    Videos: {len(sept_2024_data)}")
        print(f"    Total Views: {sept_views:,.0f}")
        print(f"    Engagement: {sept_engagement:.2f}%")
    
    # Find periods with lowest engagement (bot indicators)
    if len(daily_views) > 30:
        # Calculate rolling 7-day engagement
        rolling_window = 7
        engagement_by_period = []
        
        for i in range(len(daily_views) - rolling_window):
            period_start = daily_views.index[i]
            period_end = daily_views.index[i + rolling_window]
            
            period_data = df[(df['DATE'].dt.date >= period_start) & 
                            (df['DATE'].dt.date <= period_end)]
            
            if len(period_data) > 0:
                p_views = period_data['VIEWS'].sum()
                p_likes = period_data['YT LIKES'].sum() if 'YT LIKES' in period_data.columns else 0
                p_comments = period_data['YT COMMENTS'].sum() if 'YT COMMENTS' in period_data.columns else 0
                p_engagement = ((p_likes + p_comments) / p_views * 100) if p_views > 0 else 0
                
                engagement_by_period.append({
                    'start': period_start,
                    'end': period_end,
                    'engagement': p_engagement,
                    'views': p_views
                })
        
        # Find lowest engagement periods
        if engagement_by_period:
            sorted_periods = sorted(engagement_by_period, key=lambda x: x['engagement'])
            
            print(f"\n  LOWEST ENGAGEMENT PERIODS (Bot Indicators):")
            for i, period in enumerate(sorted_periods[:3]):
                print(f"    {i+1}. {period['start']} to {period['end']}: {period['engagement']:.2f}% engagement ({period['views']:,.0f} views)")
    
    # Pattern detection - look for rectangular plateaus
    if len(daily_views) > 7:
        # Calculate day-over-day change
        daily_change = daily_views.pct_change()
        
        # Find periods with minimal change (rectangular pattern)
        consecutive_flat_days = 0
        max_flat_period = 0
        flat_periods = []
        
        for i in range(1, len(daily_change)):
            if abs(daily_change.iloc[i]) < 0.1:  # Less than 10% change
                consecutive_flat_days += 1
            else:
                if consecutive_flat_days >= 3:  # At least 3 days flat
                    flat_periods.append({
                        'start': daily_views.index[i - consecutive_flat_days],
                        'end': daily_views.index[i-1],
                        'days': consecutive_flat_days
                    })
                consecutive_flat_days = 0
                
        if flat_periods:
            print(f"\n  RECTANGULAR PATTERNS DETECTED:")
            for period in sorted(flat_periods, key=lambda x: x['days'], reverse=True)[:3]:
                print(f"    {period['start']} to {period['end']}: {period['days']} days flat")
    
    return {
        'channel': channel_name,
        'total_videos': len(df),
        'total_views': int(total_views),
        'overall_engagement': round(overall_engagement, 2),
        'spike_ratio': round(spike_ratio, 2) if 'spike_ratio' in locals() else 1.0,
        'variance': round(variance_cov, 3),
        'oct_2024_engagement': round(oct_engagement, 2) if 'oct_engagement' in locals() else None,
        'sept_2024_engagement': round(sept_engagement, 2) if 'sept_engagement' in locals() else None
    }

def main():
    """Analyze both channels completely"""
    
    jesse_csv = r"C:\Users\user\Downloads\vidIQ CSV export for Jesse ON FIRE 2025-11-16.csv"
    mma_csv = r"C:\Users\user\Downloads\vidIQ CSV export for THE MMA GURU 2025-11-16.csv"
    
    print("\n" + "="*70)
    print("FORENSIC ANALYSIS OF COMPLETE CHANNEL HISTORIES")
    print("="*70)
    
    # Analyze Jesse
    jesse_metrics = analyze_complete_channel(jesse_csv, "Jesse ON FIRE")
    
    # Analyze MMA GURU
    mma_metrics = analyze_complete_channel(mma_csv, "THE MMA GURU")
    
    # FINAL COMPARISON
    print("\n" + "="*70)
    print("FINAL FORENSIC VERDICT - COMPLETE DATA")
    print("="*70)
    
    print(f"\nJESSE ON FIRE:")
    print(f"  Overall Engagement: {jesse_metrics['overall_engagement']}%")
    print(f"  Spike Ratio: {jesse_metrics['spike_ratio']}x")
    print(f"  Variance: {jesse_metrics['variance']}")
    if jesse_metrics['sept_2024_engagement']:
        print(f"  Sept 2024 (Trump): {jesse_metrics['sept_2024_engagement']}%")
    
    print(f"\nTHE MMA GURU:")
    print(f"  Overall Engagement: {mma_metrics['overall_engagement']}%")
    print(f"  Spike Ratio: {mma_metrics['spike_ratio']}x")
    print(f"  Variance: {mma_metrics['variance']}")
    if mma_metrics['oct_2024_engagement']:
        print(f"  Oct 2024 (Bot Period): {mma_metrics['oct_2024_engagement']}%")
    
    print("\n" + "="*70)
    print("DETECTION RESULTS:")
    print("="*70)
    
    # Determine bot status based on complete data
    if mma_metrics['overall_engagement'] < 1.0:
        print("❌ MMA GURU: CONFIRMED BOT - Engagement below 1%")
    elif mma_metrics['oct_2024_engagement'] and mma_metrics['oct_2024_engagement'] < 1.0:
        print("⚠️ MMA GURU: BOT ACTIVITY IN OCTOBER 2024")
    
    if jesse_metrics['overall_engagement'] > 2.5:
        print("✅ JESSE ON FIRE: CONFIRMED ORGANIC")
    
    return jesse_metrics, mma_metrics

if __name__ == "__main__":
    jesse, mma = main()
