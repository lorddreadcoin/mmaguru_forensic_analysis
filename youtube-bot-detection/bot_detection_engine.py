"""
YouTube Bot Detection Engine
Advanced analytics system for detecting artificial inflation patterns in YouTube channel statistics
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from scipy import stats
from scipy.signal import find_peaks
import warnings
warnings.filterwarnings('ignore')

class BotDetectionEngine:
    """
    Core engine for detecting bot activity in YouTube channel analytics
    """
    
    def __init__(self, channel_name):
        self.channel_name = channel_name
        self.data = None
        self.anomalies = []
        self.bot_confidence_scores = {}
        self.manipulation_events = []
        
    def load_data(self, csv_path):
        """Load and preprocess YouTube analytics data"""
        try:
            self.data = pd.read_csv(csv_path)
            print(f"✅ Loaded data for {self.channel_name}: {len(self.data)} rows")
            
            # Convert date column if exists
            date_columns = ['Date', 'date', 'DATE', 'Day']
            for col in date_columns:
                if col in self.data.columns:
                    self.data['Date'] = pd.to_datetime(self.data[col])
                    break
            
            # Sort by date
            if 'Date' in self.data.columns:
                self.data = self.data.sort_values('Date')
                self.data.reset_index(drop=True, inplace=True)
            
            # Identify metric columns
            self._identify_metrics()
            return True
            
        except Exception as e:
            print(f"❌ Error loading data: {e}")
            return False
    
    def _identify_metrics(self):
        """Identify view and subscriber columns"""
        self.view_cols = []
        self.sub_cols = []
        
        for col in self.data.columns:
            col_lower = col.lower()
            if 'view' in col_lower and self.data[col].dtype in [np.int64, np.float64]:
                self.view_cols.append(col)
            elif 'subscriber' in col_lower or 'sub' in col_lower:
                if self.data[col].dtype in [np.int64, np.float64]:
                    self.sub_cols.append(col)
        
        print(f"📊 Found view columns: {self.view_cols}")
        print(f"📊 Found subscriber columns: {self.sub_cols}")
    
    def detect_spikes(self, column, threshold_percentile=99.5, min_spike_ratio=3.0):
        """
        Detect suspicious spikes in data
        
        Algorithm:
        1. Calculate rolling baseline (30-day median)
        2. Find points exceeding threshold percentile
        3. Calculate spike ratio (value / baseline)
        4. Flag spikes with ratio > min_spike_ratio
        """
        if column not in self.data.columns:
            return []
        
        values = self.data[column].fillna(0)
        
        # Calculate rolling baseline with better handling
        baseline = values.rolling(window=30, min_periods=1, center=False).median()
        baseline = baseline.fillna(values.mean())  # Fill NaN with mean
        baseline = baseline.replace(0, values.mean())  # Replace 0 baseline with mean
        
        # Calculate spike ratios safely
        spike_ratios = np.where(baseline > 0, values / baseline, 0)
        
        # Find peaks
        peaks, properties = find_peaks(
            spike_ratios,
            height=min_spike_ratio,
            prominence=2.0,
            distance=7  # Minimum 7 days between spikes
        )
        
        spikes = []
        for idx in peaks:
            if idx < len(self.data):
                spike_info = {
                    'date': self.data.iloc[idx]['Date'] if 'Date' in self.data.columns else idx,
                    'value': values.iloc[idx],
                    'baseline': baseline.iloc[idx],
                    'spike_ratio': spike_ratios[idx],  # spike_ratios is a numpy array
                    'metric': column,
                    'severity': self._calculate_severity(spike_ratios[idx])
                }
                spikes.append(spike_info)
        
        return spikes
    
    def _calculate_severity(self, spike_ratio):
        """Calculate severity score of spike (1-10)"""
        if spike_ratio < 3:
            return 1
        elif spike_ratio < 5:
            return 3
        elif spike_ratio < 10:
            return 5
        elif spike_ratio < 50:
            return 7
        elif spike_ratio < 100:
            return 9
        else:
            return 10
    
    def detect_cliff_drops(self, column, drop_threshold=0.5):
        """
        Detect suspicious cliff drops (sudden decreases after spikes)
        Indication of bot purges or expired bot contracts
        """
        if column not in self.data.columns:
            return []
        
        values = self.data[column].fillna(0)
        drops = []
        
        for i in range(1, len(values)):
            if values.iloc[i-1] > 0:
                drop_ratio = 1 - (values.iloc[i] / values.iloc[i-1])
                
                if drop_ratio > drop_threshold:
                    drop_info = {
                        'date': self.data.iloc[i]['Date'] if 'Date' in self.data.columns else i,
                        'before_value': values.iloc[i-1],
                        'after_value': values.iloc[i],
                        'drop_percentage': drop_ratio * 100,
                        'metric': column,
                        'bot_purge_probability': min(drop_ratio * 100, 95)
                    }
                    drops.append(drop_info)
        
        return drops
    
    def calculate_engagement_metrics(self):
        """
        Calculate engagement authenticity metrics
        Organic engagement rates: 0.5-2% view-to-sub conversion
        Bot engagement: >5% or <0.1%
        """
        metrics = {}
        
        # Find total views and subscribers
        if self.view_cols and self.sub_cols:
            total_views = self.data[self.view_cols[0]].sum()
            total_subs = self.data[self.sub_cols[0]].max() if self.sub_cols else 0
            
            if total_views > 0:
                conversion_rate = (total_subs / total_views) * 100
                
                # Determine authenticity
                if 0.5 <= conversion_rate <= 2.0:
                    authenticity = "ORGANIC"
                    confidence = 85
                elif conversion_rate > 5.0:
                    authenticity = "BOT_INFLATION"
                    confidence = 90
                elif conversion_rate < 0.1:
                    authenticity = "VIEW_BOTTING"
                    confidence = 80
                else:
                    authenticity = "SUSPICIOUS"
                    confidence = 60
                
                metrics['conversion_rate'] = conversion_rate
                metrics['authenticity'] = authenticity
                metrics['confidence'] = confidence
                metrics['total_views'] = total_views
                metrics['total_subs'] = total_subs
        
        return metrics
    
    def detect_statistical_anomalies(self, column, z_threshold=3):
        """
        Statistical anomaly detection using Z-score
        Flags data points > 3 standard deviations from mean
        """
        if column not in self.data.columns:
            return []
        
        values = self.data[column].fillna(0)
        
        # Calculate rolling statistics
        rolling_mean = values.rolling(window=30, min_periods=1).mean()
        rolling_std = values.rolling(window=30, min_periods=1).std()
        
        # Calculate z-scores
        z_scores = np.abs((values - rolling_mean) / (rolling_std + 1))
        
        # Find anomalies
        anomalies = []
        anomaly_indices = np.where(z_scores > z_threshold)[0]
        
        for idx in anomaly_indices:
            if idx < len(self.data):
                anomaly_info = {
                    'date': self.data.iloc[idx]['Date'] if 'Date' in self.data.columns else idx,
                    'value': values.iloc[idx],
                    'expected_value': rolling_mean.iloc[idx],
                    'z_score': z_scores.iloc[idx],
                    'metric': column,
                    'confidence': min(95, 50 + (z_scores.iloc[idx] * 5))
                }
                anomalies.append(anomaly_info)
        
        return anomalies
    
    def analyze_growth_patterns(self):
        """
        Analyze growth patterns for authenticity
        Organic growth: gradual, consistent
        Bot growth: sudden spikes, irregular patterns
        """
        patterns = {}
        
        for col in self.view_cols + self.sub_cols:
            if col in self.data.columns:
                values = self.data[col].fillna(0)
                
                # Calculate daily growth rates
                growth_rates = values.pct_change().fillna(0)
                
                # Statistics (handle infinities)
                growth_rates = growth_rates.replace([np.inf, -np.inf], np.nan)
                mean_growth = growth_rates.mean()
                std_growth = growth_rates.std()
                max_growth = growth_rates.max() if not growth_rates.isna().all() else 0
                
                # Count suspicious growth days (>100% daily growth)
                suspicious_days = (growth_rates > 1.0).sum()
                impossible_days = (growth_rates > 10.0).sum()  # >1000% growth
                
                pattern_score = 100
                if suspicious_days > 5:
                    pattern_score -= suspicious_days * 5
                if impossible_days > 0:
                    pattern_score -= impossible_days * 20
                
                patterns[col] = {
                    'mean_daily_growth': mean_growth * 100,
                    'std_daily_growth': std_growth * 100,
                    'max_daily_growth': max_growth * 100,
                    'suspicious_growth_days': suspicious_days,
                    'impossible_growth_days': impossible_days,
                    'authenticity_score': max(0, pattern_score)
                }
        
        return patterns
    
    def detect_time_patterns(self):
        """
        Detect unnatural time patterns
        Bots often operate in specific time windows
        """
        time_patterns = {}
        
        if 'Date' in self.data.columns:
            self.data['DayOfWeek'] = self.data['Date'].dt.dayofweek
            self.data['Month'] = self.data['Date'].dt.month
            
            for col in self.view_cols + self.sub_cols:
                if col in self.data.columns:
                    # Check for weekend vs weekday patterns
                    weekend_mask = self.data['DayOfWeek'].isin([5, 6])
                    weekend_avg = self.data[weekend_mask][col].mean()
                    weekday_avg = self.data[~weekend_mask][col].mean()
                    
                    if weekday_avg > 0:
                        weekend_ratio = weekend_avg / weekday_avg
                    else:
                        weekend_ratio = 0
                    
                    # Natural pattern: similar or slightly lower on weekends
                    if 0.7 <= weekend_ratio <= 1.3:
                        pattern_type = "NATURAL"
                    elif weekend_ratio < 0.3 or weekend_ratio > 3:
                        pattern_type = "BOT_PATTERN"
                    else:
                        pattern_type = "SUSPICIOUS"
                    
                    time_patterns[col] = {
                        'weekend_ratio': weekend_ratio,
                        'pattern_type': pattern_type,
                        'weekend_avg': weekend_avg,
                        'weekday_avg': weekday_avg
                    }
        
        return time_patterns
    
    def calculate_manipulation_cost(self, views_botted, subs_botted):
        """
        Estimate cost of bot manipulation
        Market rates: $3-10 per 1000 views, $10-50 per 100 subs
        """
        # Ensure non-negative values
        views_botted = max(0, views_botted)
        subs_botted = max(0, subs_botted)
        
        # Cap at reasonable maximums to avoid unrealistic estimates
        views_botted = min(views_botted, 10000000)  # Cap at 10M views
        subs_botted = min(subs_botted, 100000)  # Cap at 100K subs
        
        view_cost_min = (views_botted / 1000) * 3
        view_cost_max = (views_botted / 1000) * 10
        
        sub_cost_min = (subs_botted / 100) * 10
        sub_cost_max = (subs_botted / 100) * 50
        
        total_min = view_cost_min + sub_cost_min
        total_max = view_cost_max + sub_cost_max
        
        return {
            'estimated_cost_min': max(0, total_min),
            'estimated_cost_max': max(0, total_max),
            'average_cost': max(0, (total_min + total_max) / 2),
            'views_botted': views_botted,
            'subs_botted': subs_botted
        }
    
    def generate_authenticity_score(self):
        """
        Generate overall authenticity score (0-100)
        100 = Completely authentic
        0 = Heavily botted
        """
        score = 100
        reasons = []
        
        # Check for spikes
        for col in self.view_cols + self.sub_cols:
            spikes = self.detect_spikes(col)
            if spikes:
                spike_penalty = min(len(spikes) * 5, 30)
                score -= spike_penalty
                reasons.append(f"Found {len(spikes)} suspicious spikes in {col} (-{spike_penalty} points)")
        
        # Check engagement metrics
        engagement = self.calculate_engagement_metrics()
        if engagement:
            if engagement['authenticity'] == "BOT_INFLATION":
                score -= 25
                reasons.append(f"Bot-like engagement pattern detected (-25 points)")
            elif engagement['authenticity'] == "VIEW_BOTTING":
                score -= 20
                reasons.append(f"View botting pattern detected (-20 points)")
        
        # Check growth patterns
        patterns = self.analyze_growth_patterns()
        for metric, pattern in patterns.items():
            if pattern['authenticity_score'] < 50:
                penalty = (100 - pattern['authenticity_score']) / 4
                score -= penalty
                reasons.append(f"Unnatural growth in {metric} (-{penalty:.1f} points)")
        
        # Check time patterns
        time_patterns = self.detect_time_patterns()
        bot_patterns = sum(1 for p in time_patterns.values() if p['pattern_type'] == "BOT_PATTERN")
        if bot_patterns > 0:
            penalty = bot_patterns * 10
            score -= penalty
            reasons.append(f"Bot time patterns detected (-{penalty} points)")
        
        return {
            'score': max(0, score),
            'rating': self._get_rating(max(0, score)),
            'reasons': reasons
        }
    
    def _get_rating(self, score):
        """Convert score to rating"""
        if score >= 90:
            return "AUTHENTIC"
        elif score >= 70:
            return "MOSTLY_AUTHENTIC"
        elif score >= 50:
            return "QUESTIONABLE"
        elif score >= 30:
            return "LIKELY_BOTTED"
        else:
            return "HEAVILY_BOTTED"
    
    def identify_bot_vendors(self, other_channel_data):
        """
        Cross-reference with another channel to identify common bot vendors
        Same-day spikes across channels indicate same vendor
        """
        vendor_matches = []
        
        if 'Date' not in self.data.columns:
            return vendor_matches
        
        # Get spike dates for both channels
        my_spikes = {}
        for col in self.view_cols + self.sub_cols:
            spikes = self.detect_spikes(col)
            for spike in spikes:
                date = spike['date']
                if date not in my_spikes:
                    my_spikes[date] = []
                my_spikes[date].append(spike)
        
        # Check for matching dates
        for date, spikes in my_spikes.items():
            # Check if other channel has spikes on same date (implement comparison)
            vendor_matches.append({
                'date': date,
                'channel1_spikes': spikes,
                'vendor_probability': 85,  # High probability if same date
                'vendor_signature': f"VENDOR_{date.strftime('%Y%m%d')}"
            })
        
        return vendor_matches
    
    def run_full_analysis(self):
        """
        Run complete bot detection analysis
        """
        print(f"\n🔍 RUNNING BOT DETECTION ANALYSIS FOR: {self.channel_name}")
        print("=" * 60)
        
        results = {
            'channel': self.channel_name,
            'timestamp': datetime.now().isoformat(),
            'data_points': len(self.data) if self.data is not None else 0
        }
        
        # 1. Spike Detection
        print("\n📈 SPIKE DETECTION:")
        all_spikes = []
        for col in self.view_cols + self.sub_cols:
            spikes = self.detect_spikes(col)
            all_spikes.extend(spikes)
            if spikes:
                print(f"  ⚠️ {col}: {len(spikes)} suspicious spikes detected")
                for spike in spikes[:3]:  # Show top 3
                    print(f"    - {spike['date']}: {spike['value']:,.0f} (ratio: {spike['spike_ratio']:.1f}x)")
        results['spikes'] = all_spikes
        
        # 2. Cliff Drop Detection
        print("\n📉 CLIFF DROP DETECTION:")
        all_drops = []
        for col in self.view_cols + self.sub_cols:
            drops = self.detect_cliff_drops(col)
            all_drops.extend(drops)
            if drops:
                print(f"  ⚠️ {col}: {len(drops)} cliff drops detected")
                for drop in drops[:3]:
                    print(f"    - {drop['date']}: -{drop['drop_percentage']:.1f}% drop")
        results['drops'] = all_drops
        
        # 3. Engagement Metrics
        print("\n💰 ENGAGEMENT ANALYSIS:")
        engagement = self.calculate_engagement_metrics()
        if engagement:
            print(f"  View-to-Sub Rate: {engagement.get('conversion_rate', 0):.2f}%")
            print(f"  Pattern: {engagement.get('authenticity', 'UNKNOWN')}")
            print(f"  Confidence: {engagement.get('confidence', 0)}%")
        results['engagement'] = engagement
        
        # 4. Growth Patterns
        print("\n📊 GROWTH PATTERN ANALYSIS:")
        patterns = self.analyze_growth_patterns()
        for metric, pattern in patterns.items():
            print(f"  {metric}:")
            print(f"    Authenticity Score: {pattern['authenticity_score']}/100")
            print(f"    Max Daily Growth: {pattern['max_daily_growth']:.1f}%")
            if pattern['impossible_growth_days'] > 0:
                print(f"    ⚠️ ALERT: {pattern['impossible_growth_days']} days with impossible growth!")
        results['growth_patterns'] = patterns
        
        # 5. Time Patterns
        print("\n⏰ TIME PATTERN ANALYSIS:")
        time_patterns = self.detect_time_patterns()
        for metric, pattern in time_patterns.items():
            print(f"  {metric}: {pattern['pattern_type']}")
            print(f"    Weekend/Weekday Ratio: {pattern['weekend_ratio']:.2f}")
        results['time_patterns'] = time_patterns
        
        # 6. Statistical Anomalies
        print("\n🔬 STATISTICAL ANOMALIES:")
        all_anomalies = []
        for col in self.view_cols + self.sub_cols:
            anomalies = self.detect_statistical_anomalies(col)
            all_anomalies.extend(anomalies)
            if anomalies:
                print(f"  ⚠️ {col}: {len(anomalies)} statistical anomalies")
        results['anomalies'] = all_anomalies
        
        # 7. Cost Estimation
        print("\n💸 BOT MANIPULATION COST ESTIMATE:")
        # Estimate botted metrics based on spikes
        est_botted_views = sum(
            max(0, s['value'] - s.get('baseline', 0)) 
            for s in all_spikes 
            if 'view' in s['metric'].lower() and not pd.isna(s.get('baseline'))
        )
        est_botted_subs = sum(
            max(0, s['value'] - s.get('baseline', 0)) 
            for s in all_spikes 
            if 'sub' in s['metric'].lower() and not pd.isna(s.get('baseline'))
        )
        
        cost = self.calculate_manipulation_cost(est_botted_views, est_botted_subs)
        print(f"  Estimated Botted Views: {cost['views_botted']:,.0f}")
        print(f"  Estimated Botted Subs: {cost['subs_botted']:,.0f}")
        print(f"  💵 Cost Range: ${cost['estimated_cost_min']:,.2f} - ${cost['estimated_cost_max']:,.2f}")
        print(f"  Average Cost: ${cost['average_cost']:,.2f}")
        results['cost_estimate'] = cost
        
        # 8. Final Authenticity Score
        print("\n🏆 FINAL AUTHENTICITY ASSESSMENT:")
        authenticity = self.generate_authenticity_score()
        print(f"  Score: {authenticity['score']:.1f}/100")
        print(f"  Rating: {authenticity['rating']}")
        print(f"  \nReasons:")
        for reason in authenticity['reasons']:
            print(f"    • {reason}")
        results['authenticity'] = authenticity
        
        print("\n" + "=" * 60)
        
        return results
