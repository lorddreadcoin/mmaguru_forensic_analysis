"""
Video Data Adapter
Converts per-video data to daily channel statistics for bot detection
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import re

class VideoDataAdapter:
    """
    Converts vidIQ video-level exports to daily channel statistics
    """
    
    def __init__(self):
        self.video_data = None
        self.daily_stats = None
        
    def load_video_csv(self, filepath, channel_name):
        """
        Load vidIQ video export and convert to daily stats
        """
        try:
            # Load video data
            df = pd.read_csv(filepath)
            print(f"📹 Loaded {len(df)} videos for {channel_name}")
            
            # Parse date column
            if 'DATE PUBLISHED' in df.columns:
                df['DATE PUBLISHED'] = pd.to_datetime(df['DATE PUBLISHED'], format='%d/%m/%Y', errors='coerce')
            
            # Filter out invalid dates
            df = df.dropna(subset=['DATE PUBLISHED'])
            
            # Clean numeric columns
            if 'VIEWS' in df.columns:
                df['VIEWS'] = pd.to_numeric(df['VIEWS'], errors='coerce').fillna(0)
            
            if 'YT LIKES' in df.columns:
                # Handle K notation (e.g., "9.9K")
                df['YT LIKES'] = df['YT LIKES'].apply(self._parse_number)
                
            if 'YT COMMENTS' in df.columns:
                # Handle K notation
                df['YT COMMENTS'] = df['YT COMMENTS'].apply(self._parse_number)
            
            self.video_data = df
            return self.aggregate_to_daily_stats()
            
        except Exception as e:
            print(f"❌ Error loading video data: {e}")
            return None
    
    def _parse_number(self, value):
        """Parse numbers with K/M notation"""
        if pd.isna(value):
            return 0
        
        value_str = str(value)
        
        # Handle K notation
        if 'K' in value_str:
            try:
                return float(value_str.replace('K', '')) * 1000
            except:
                return 0
        
        # Handle M notation
        if 'M' in value_str:
            try:
                return float(value_str.replace('M', '')) * 1000000
            except:
                return 0
                
        # Try direct conversion
        try:
            return float(value_str.replace(',', ''))
        except:
            return 0
    
    def aggregate_to_daily_stats(self):
        """
        Aggregate video data to daily channel statistics
        """
        if self.video_data is None:
            return None
        
        # Group by date
        daily_agg = self.video_data.groupby('DATE PUBLISHED').agg({
            'VIEWS': ['sum', 'mean', 'count'],
            'YT LIKES': 'sum',
            'YT COMMENTS': 'sum',
            'ENGAGEMENT RATE': 'mean'
        }).reset_index()
        
        # Flatten column names
        daily_agg.columns = ['Date', 'Views', 'Avg_Views_Per_Video', 'Videos_Published', 
                              'Likes', 'Comments', 'Avg_Engagement_Rate']
        
        # Calculate cumulative metrics
        daily_agg = daily_agg.sort_values('Date')
        daily_agg['Cumulative_Views'] = daily_agg['Views'].cumsum()
        daily_agg['Cumulative_Videos'] = daily_agg['Videos_Published'].cumsum()
        
        # Estimate subscriber growth (rough approximation based on engagement)
        # Typical conversion: 1-2% of viewers become subscribers
        daily_agg['Est_New_Subscribers'] = daily_agg['Views'] * 0.015  # 1.5% conversion
        daily_agg['Subscribers'] = daily_agg['Est_New_Subscribers'].cumsum()
        
        # Fill missing dates
        date_range = pd.date_range(start=daily_agg['Date'].min(), 
                                    end=daily_agg['Date'].max(), 
                                    freq='D')
        
        daily_stats = pd.DataFrame({'Date': date_range})
        daily_stats = daily_stats.merge(daily_agg, on='Date', how='left')
        
        # Forward fill cumulative metrics
        daily_stats['Cumulative_Views'] = daily_stats['Cumulative_Views'].fillna(method='ffill').fillna(0)
        daily_stats['Cumulative_Videos'] = daily_stats['Cumulative_Videos'].fillna(method='ffill').fillna(0)
        daily_stats['Subscribers'] = daily_stats['Subscribers'].fillna(method='ffill').fillna(0)
        
        # Fill other metrics with 0
        daily_stats['Views'] = daily_stats['Views'].fillna(0)
        daily_stats['Videos_Published'] = daily_stats['Videos_Published'].fillna(0)
        
        self.daily_stats = daily_stats
        return daily_stats
    
    def detect_suspicious_videos(self):
        """
        Identify videos with suspicious view patterns
        """
        if self.video_data is None:
            return []
        
        suspicious = []
        
        # Calculate average views
        avg_views = self.video_data['VIEWS'].mean()
        std_views = self.video_data['VIEWS'].std()
        
        # Find videos with unusually high views
        for idx, row in self.video_data.iterrows():
            views = row['VIEWS']
            
            # Check if views are > 3 standard deviations above mean
            if views > avg_views + (3 * std_views):
                suspicious.append({
                    'title': row['TITLE'],
                    'date': row['DATE PUBLISHED'],
                    'views': views,
                    'deviation': (views - avg_views) / std_views,
                    'engagement_rate': row.get('ENGAGEMENT RATE', 0),
                    'suspicion_level': 'HIGH' if views > avg_views + (5 * std_views) else 'MEDIUM'
                })
        
        return suspicious
    
    def create_bot_detection_format(self):
        """
        Format data for bot detection engine
        """
        if self.daily_stats is None:
            return None
        
        # Prepare data in format expected by bot detection engine
        detection_data = pd.DataFrame({
            'Date': self.daily_stats['Date'],
            'Views': self.daily_stats['Views'],
            'Subscribers': self.daily_stats['Subscribers'],
            'Videos_Published': self.daily_stats['Videos_Published'],
            'Engagement': self.daily_stats.get('Avg_Engagement_Rate', 0)
        })
        
        return detection_data


def convert_video_data_for_analysis(video_csv_path, channel_name):
    """
    Main function to convert video data for bot analysis
    """
    adapter = VideoDataAdapter()
    daily_stats = adapter.load_video_csv(video_csv_path, channel_name)
    
    if daily_stats is not None:
        # Get suspicious videos
        suspicious = adapter.detect_suspicious_videos()
        
        print(f"\n📊 Channel Statistics for {channel_name}:")
        print(f"  Total Videos: {len(adapter.video_data)}")
        print(f"  Date Range: {daily_stats['Date'].min().date()} to {daily_stats['Date'].max().date()}")
        print(f"  Total Views: {daily_stats['Views'].sum():,.0f}")
        print(f"  Est. Subscribers: {daily_stats['Subscribers'].max():,.0f}")
        
        if suspicious:
            print(f"\n⚠️ Found {len(suspicious)} suspicious videos:")
            for video in suspicious[:5]:  # Show top 5
                print(f"  • {video['title'][:50]}...")
                print(f"    Views: {video['views']:,.0f} (Deviation: {video['deviation']:.1f}σ)")
        
        # Return formatted data for bot detection
        return adapter.create_bot_detection_format()
    
    return None
