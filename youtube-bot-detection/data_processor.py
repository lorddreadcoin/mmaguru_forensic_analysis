"""
Data Processor and Comparative Analysis Module
Handles CSV loading, preprocessing, and cross-channel comparison
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json
import os

class DataProcessor:
    """
    Process and prepare YouTube analytics data for bot detection
    """
    
    def __init__(self):
        self.channels = {}
        self.processed_data = {}
        
    def load_vidiq_export(self, filepath, channel_name):
        """
        Load VidIQ export CSV with proper column mapping
        """
        try:
            df = pd.read_csv(filepath)
            print(f"📂 Loading {channel_name} data from {os.path.basename(filepath)}")
            print(f"  Columns found: {list(df.columns)}")
            print(f"  Shape: {df.shape}")
            
            # Standardize column names
            column_mapping = {
                'Date': 'Date',
                'date': 'Date', 
                'Views': 'Views',
                'views': 'Views',
                'Daily Views': 'Views',
                'Subscribers': 'Subscribers',
                'subscribers': 'Subscribers',
                'Subs': 'Subscribers',
                'Daily Subscribers': 'Subscribers_Daily',
                'Subscribers gained': 'Subscribers_Gained',
                'Subscribers lost': 'Subscribers_Lost',
                'Watch time (hours)': 'Watch_Time_Hours',
                'Average view duration': 'Avg_View_Duration',
                'Impressions': 'Impressions',
                'Impressions click-through rate': 'CTR'
            }
            
            # Rename columns
            df_clean = df.rename(columns=column_mapping)
            
            # Ensure Date column exists and is datetime
            if 'Date' in df_clean.columns:
                df_clean['Date'] = pd.to_datetime(df_clean['Date'], errors='coerce')
                df_clean = df_clean.dropna(subset=['Date'])
                df_clean = df_clean.sort_values('Date')
            
            # Store processed data
            self.channels[channel_name] = df_clean
            
            # Calculate additional metrics
            self._calculate_derived_metrics(channel_name)
            
            return df_clean
            
        except Exception as e:
            print(f"❌ Error loading {channel_name}: {e}")
            return None
    
    def _calculate_derived_metrics(self, channel_name):
        """
        Calculate additional metrics for analysis
        """
        df = self.channels[channel_name]
        
        # Calculate daily changes
        if 'Views' in df.columns:
            df['Views_Daily_Change'] = df['Views'].diff()
            df['Views_Pct_Change'] = df['Views'].pct_change() * 100
            
        if 'Subscribers' in df.columns:
            df['Subs_Daily_Change'] = df['Subscribers'].diff()
            df['Subs_Pct_Change'] = df['Subscribers'].pct_change() * 100
        
        # Calculate rolling averages
        for window in [7, 30]:
            if 'Views' in df.columns:
                df[f'Views_MA{window}'] = df['Views'].rolling(window=window, min_periods=1).mean()
            if 'Subscribers' in df.columns:
                df[f'Subs_MA{window}'] = df['Subscribers'].rolling(window=window, min_periods=1).mean()
        
        # Calculate volatility (standard deviation of daily changes)
        if 'Views_Pct_Change' in df.columns:
            df['Views_Volatility'] = df['Views_Pct_Change'].rolling(window=30, min_periods=1).std()
        if 'Subs_Pct_Change' in df.columns:
            df['Subs_Volatility'] = df['Subs_Pct_Change'].rolling(window=30, min_periods=1).std()
        
        self.channels[channel_name] = df
    
    def get_date_range(self, channel_name):
        """
        Get date range for a channel's data
        """
        if channel_name in self.channels:
            df = self.channels[channel_name]
            if 'Date' in df.columns:
                return {
                    'start': df['Date'].min(),
                    'end': df['Date'].max(),
                    'days': (df['Date'].max() - df['Date'].min()).days
                }
        return None
    
    def get_summary_stats(self, channel_name):
        """
        Get summary statistics for a channel
        """
        if channel_name not in self.channels:
            return None
        
        df = self.channels[channel_name]
        stats = {
            'channel': channel_name,
            'total_rows': len(df),
            'date_range': self.get_date_range(channel_name)
        }
        
        # Views statistics
        if 'Views' in df.columns:
            stats['views'] = {
                'total': df['Views'].sum(),
                'mean': df['Views'].mean(),
                'median': df['Views'].median(),
                'max': df['Views'].max(),
                'min': df['Views'].min(),
                'std': df['Views'].std()
            }
            
            if 'Views_Daily_Change' in df.columns:
                stats['views']['max_daily_increase'] = df['Views_Daily_Change'].max()
                stats['views']['max_daily_decrease'] = df['Views_Daily_Change'].min()
        
        # Subscriber statistics
        if 'Subscribers' in df.columns:
            stats['subscribers'] = {
                'final_count': df['Subscribers'].iloc[-1] if len(df) > 0 else 0,
                'mean': df['Subscribers'].mean(),
                'max': df['Subscribers'].max(),
                'min': df['Subscribers'].min()
            }
            
            if 'Subscribers_Gained' in df.columns:
                stats['subscribers']['total_gained'] = df['Subscribers_Gained'].sum()
            if 'Subscribers_Lost' in df.columns:
                stats['subscribers']['total_lost'] = df['Subscribers_Lost'].sum()
        
        # Engagement statistics
        if 'Watch_Time_Hours' in df.columns:
            stats['watch_time'] = {
                'total_hours': df['Watch_Time_Hours'].sum(),
                'avg_daily_hours': df['Watch_Time_Hours'].mean()
            }
        
        if 'CTR' in df.columns:
            stats['ctr'] = {
                'mean': df['CTR'].mean(),
                'max': df['CTR'].max(),
                'min': df['CTR'].min()
            }
        
        return stats


class ComparativeAnalyzer:
    """
    Compare multiple channels to identify common bot patterns
    """
    
    def __init__(self):
        self.channels = {}
        self.comparison_results = {}
        
    def add_channel(self, name, bot_detection_results):
        """
        Add channel results for comparison
        """
        self.channels[name] = bot_detection_results
        
    def find_synchronized_spikes(self, date_tolerance_days=2):
        """
        Find spikes that occur within same time window across channels
        Indicates same bot vendor
        """
        synchronized = []
        
        # Get all spike dates from all channels
        channel_spikes = {}
        for channel, results in self.channels.items():
            if 'spikes' in results:
                spike_dates = {}
                for spike in results['spikes']:
                    date = spike.get('date')
                    if isinstance(date, str):
                        date = pd.to_datetime(date)
                    if date:
                        if date not in spike_dates:
                            spike_dates[date] = []
                        spike_dates[date].append(spike)
                channel_spikes[channel] = spike_dates
        
        # Find overlapping dates
        if len(channel_spikes) >= 2:
            channels_list = list(channel_spikes.keys())
            channel1_spikes = channel_spikes[channels_list[0]]
            channel2_spikes = channel_spikes[channels_list[1]]
            
            for date1, spikes1 in channel1_spikes.items():
                for date2, spikes2 in channel2_spikes.items():
                    if abs((date1 - date2).days) <= date_tolerance_days:
                        synchronized.append({
                            'date_channel1': date1,
                            'date_channel2': date2,
                            'channel1': channels_list[0],
                            'channel2': channels_list[1],
                            'spikes_channel1': spikes1,
                            'spikes_channel2': spikes2,
                            'days_apart': abs((date1 - date2).days),
                            'vendor_probability': 95 - (abs((date1 - date2).days) * 10)
                        })
        
        return synchronized
    
    def compare_bot_signatures(self):
        """
        Compare bot signatures between channels
        """
        signatures = {}
        
        for channel, results in self.channels.items():
            signature = {
                'channel': channel,
                'authenticity_score': results.get('authenticity', {}).get('score', 0),
                'total_spikes': len(results.get('spikes', [])),
                'total_drops': len(results.get('drops', [])),
                'total_anomalies': len(results.get('anomalies', [])),
                'engagement_pattern': results.get('engagement', {}).get('authenticity', 'UNKNOWN'),
                'estimated_bot_cost': results.get('cost_estimate', {}).get('average_cost', 0)
            }
            
            # Calculate signature hash
            signature_elements = [
                signature['total_spikes'],
                signature['total_drops'],
                signature['engagement_pattern']
            ]
            signature['signature_hash'] = hash(tuple(signature_elements))
            
            signatures[channel] = signature
        
        # Find similar signatures
        similar_signatures = []
        channels = list(signatures.keys())
        
        if len(channels) >= 2:
            for i in range(len(channels)):
                for j in range(i+1, len(channels)):
                    sig1 = signatures[channels[i]]
                    sig2 = signatures[channels[j]]
                    
                    # Calculate similarity
                    similarity = 0
                    if sig1['engagement_pattern'] == sig2['engagement_pattern']:
                        similarity += 30
                    if abs(sig1['total_spikes'] - sig2['total_spikes']) <= 3:
                        similarity += 20
                    if abs(sig1['total_drops'] - sig2['total_drops']) <= 3:
                        similarity += 20
                    if abs(sig1['authenticity_score'] - sig2['authenticity_score']) <= 15:
                        similarity += 30
                    
                    if similarity >= 50:
                        similar_signatures.append({
                            'channel1': channels[i],
                            'channel2': channels[j],
                            'similarity_score': similarity,
                            'likely_same_vendor': similarity >= 70
                        })
        
        return {
            'signatures': signatures,
            'similar_patterns': similar_signatures
        }
    
    def generate_comparative_report(self):
        """
        Generate comprehensive comparative analysis report
        """
        report = {
            'timestamp': datetime.now().isoformat(),
            'channels_analyzed': list(self.channels.keys()),
            'synchronized_spikes': self.find_synchronized_spikes(),
            'bot_signatures': self.compare_bot_signatures()
        }
        
        # Calculate aggregate statistics
        total_bot_cost = sum(
            ch.get('cost_estimate', {}).get('average_cost', 0) 
            for ch in self.channels.values()
        )
        
        avg_authenticity = np.mean([
            ch.get('authenticity', {}).get('score', 0) 
            for ch in self.channels.values()
        ])
        
        report['aggregate_stats'] = {
            'total_estimated_bot_cost': total_bot_cost,
            'average_authenticity_score': avg_authenticity,
            'channels_likely_botted': sum(
                1 for ch in self.channels.values() 
                if ch.get('authenticity', {}).get('score', 100) < 50
            )
        }
        
        # Identify key insights
        insights = []
        
        if report['synchronized_spikes']:
            insights.append(f"⚠️ Found {len(report['synchronized_spikes'])} synchronized spike events - likely same bot vendor")
        
        if total_bot_cost > 10000:
            insights.append(f"💰 Total estimated bot manipulation cost across channels: ${total_bot_cost:,.2f}")
        
        if avg_authenticity < 50:
            insights.append(f"🚨 Low average authenticity score ({avg_authenticity:.1f}/100) - significant bot activity detected")
        
        similar = report['bot_signatures'].get('similar_patterns', [])
        if similar:
            high_similarity = [s for s in similar if s['similarity_score'] >= 70]
            if high_similarity:
                insights.append(f"🔗 {len(high_similarity)} channel pairs show highly similar bot patterns")
        
        report['key_insights'] = insights
        
        return report
    
    def export_findings(self, output_dir='./'):
        """
        Export all findings to JSON
        """
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        
        # Export individual channel analyses
        for channel, results in self.channels.items():
            filename = f"{output_dir}/bot_analysis_{channel.replace(' ', '_')}_{timestamp}.json"
            with open(filename, 'w') as f:
                # Convert any datetime objects to strings
                results_clean = self._clean_for_json(results)
                json.dump(results_clean, f, indent=2)
            print(f"✅ Exported {channel} analysis to {filename}")
        
        # Export comparative report
        report = self.generate_comparative_report()
        report_file = f"{output_dir}/comparative_report_{timestamp}.json"
        with open(report_file, 'w') as f:
            report_clean = self._clean_for_json(report)
            json.dump(report_clean, f, indent=2)
        print(f"✅ Exported comparative report to {report_file}")
        
        return report_file
    
    def _clean_for_json(self, obj):
        """
        Clean object for JSON serialization
        """
        if isinstance(obj, dict):
            return {k: self._clean_for_json(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [self._clean_for_json(item) for item in obj]
        elif isinstance(obj, (pd.Timestamp, datetime)):
            return obj.isoformat()
        elif isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        else:
            return obj
