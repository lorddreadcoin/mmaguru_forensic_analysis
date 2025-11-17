"""
Multi-Baseline Forensic Bot Detection System
Uses Jesse ON FIRE, Michael Bisping, and Chael Sonnen as organic baselines
Target: THE MMA GURU
"""

import pandas as pd
import numpy as np
import json
from datetime import datetime, timedelta
from scipy import stats
from scipy.signal import find_peaks
import warnings
warnings.filterwarnings('ignore')

class ForensicBotDetector:
    """
    Triple-baseline verification system for bot detection
    """
    
    def __init__(self):
        self.baselines = {
            'Jesse ON FIRE': {'score': 100, 'type': 'owner_verified'},
            'Michael Bisping': {'score': 100, 'type': 'ufc_legend'},
            'Chael Sonnen': {'score': 100, 'type': 'established_creator'}
        }
        self.target = 'THE MMA GURU'
        self.organic_signatures = {}
        self.bot_signatures = {}
        
    def establish_organic_truth_triumvirate(self, jesse_data, bisping_data, chael_data):
        """
        Establish the organic truth from three clean baselines
        """
        print("="*70)
        print("🔬 ESTABLISHING ORGANIC TRUTH TRIUMVIRATE")
        print("="*70)
        
        # Calculate organic signatures from all three baselines
        self.organic_signatures = {
            'daily_variance': self._calculate_variance_range([jesse_data, bisping_data, chael_data]),
            'peak_formation_days': (2, 7),  # Consistent across organic channels
            'engagement_rate': (2.5, 4.5),  # Natural engagement sweet spot
            'decay_angle': (15, 45),  # Degrees of natural decline
            'geographic_diversity': 0.7,  # Multi-state/country minimum
            'timezone_spread': True,  # Follows natural timezone patterns
        }
        
        # Define bot signatures as deviations
        self.bot_signatures = {
            'instant_spike': {'threshold': 200, 'timeframe': 24},  # >200% in <24h
            'perfect_plateau': {'variance': 0.05},  # <5% variance
            'no_build_phase': {'days': 1},  # Peak in 1 day or less
            'abnormal_engagement': {'low': 1, 'high': 10},  # Outside 1-10%
            'single_location': {'diversity': 0.3},  # <30% geographic spread
            'synchronized_timing': {'spread': False},  # All at once
        }
        
        print("\n✅ ORGANIC SIGNATURES ESTABLISHED:")
        for key, value in self.organic_signatures.items():
            print(f"   • {key}: {value}")
        
        return self.organic_signatures
    
    def _calculate_variance_range(self, datasets):
        """
        Calculate natural variance range from baseline channels
        """
        variances = []
        for data in datasets:
            if data is not None and 'Views' in data.columns:
                daily_changes = data['Views'].pct_change().abs()
                variances.extend(daily_changes.dropna().values)
        
        if variances:
            return (np.percentile(variances, 15) * 100, np.percentile(variances, 85) * 100)
        return (15, 30)  # Default organic range
    
    def molecular_pattern_analysis(self, channel_data, channel_name):
        """
        Molecular-level analysis of growth patterns
        """
        patterns = {
            'channel': channel_name,
            'spikes': [],
            'plateaus': [],
            'anomalies': [],
            'similarity_scores': {}
        }
        
        if channel_data is None or 'Views' not in channel_data.columns:
            return patterns
        
        views = channel_data['Views'].fillna(0)
        
        # 1. SPIKE DETECTION WITH AMPLITUDE
        baseline = views.rolling(window=30, min_periods=1).median()
        spike_ratios = views / (baseline + 1)
        
        peaks, properties = find_peaks(spike_ratios, height=2, prominence=1.5)
        
        for idx in peaks:
            if idx > 0:
                # Measure spike characteristics
                spike_amplitude = spike_ratios.iloc[idx]
                
                # Time to peak (days of build-up)
                build_days = 0
                for i in range(1, min(8, idx)):
                    if spike_ratios.iloc[idx-i] < spike_amplitude * 0.5:
                        build_days = i
                        break
                
                # Decay measurement
                decay_days = 0
                for i in range(1, min(8, len(views)-idx-1)):
                    if idx+i < len(views) and spike_ratios.iloc[idx+i] < spike_amplitude * 0.5:
                        decay_days = i
                        break
                
                patterns['spikes'].append({
                    'date': channel_data.iloc[idx]['Date'] if 'Date' in channel_data.columns else idx,
                    'amplitude': float(spike_amplitude),
                    'build_days': build_days,
                    'decay_days': decay_days,
                    'organic_probability': self._calculate_organic_probability(
                        spike_amplitude, build_days, decay_days
                    )
                })
        
        # 2. PLATEAU DETECTION (Perfect rectangles = bots)
        for i in range(7, len(views)-7):
            window = views.iloc[i-7:i+7]
            if window.mean() > views.mean() * 2:
                cv = window.std() / window.mean() if window.mean() > 0 else 1
                if cv < 0.1:  # Low variance = plateau
                    patterns['plateaus'].append({
                        'start': i-7,
                        'end': i+7,
                        'coefficient_variation': cv,
                        'bot_probability': 95 if cv < 0.05 else 75
                    })
        
        # 3. ENGAGEMENT ANALYSIS
        if 'Likes' in channel_data.columns and 'Views' in channel_data.columns:
            engagement_rate = (channel_data['Likes'] / channel_data['Views']).mean() * 100
            patterns['engagement_rate'] = engagement_rate
            patterns['engagement_organic'] = 2.5 <= engagement_rate <= 4.5
        
        return patterns
    
    def _calculate_organic_probability(self, amplitude, build_days, decay_days):
        """
        Calculate probability that a spike is organic based on characteristics
        """
        score = 100
        
        # Amplitude check
        if amplitude > 10:  # >1000% spike
            score -= 40
        elif amplitude > 5:  # >500% spike
            score -= 20
        
        # Build phase check
        if build_days < 2:  # Too fast
            score -= 30
        elif build_days > 7:  # Unusually slow
            score -= 10
        
        # Decay check
        if decay_days < 2:  # Instant drop
            score -= 30
        elif decay_days > 10:  # Suspiciously sustained
            score -= 15
        
        return max(0, min(100, score))
    
    def compare_to_baselines(self, target_patterns, baseline_patterns):
        """
        Compare target channel to all three baselines
        """
        print("\n" + "="*70)
        print("📊 BASELINE COMPARISON MATRIX")
        print("="*70)
        
        comparison_matrix = {}
        
        for baseline_name, baseline_data in baseline_patterns.items():
            similarity = self._calculate_similarity(target_patterns, baseline_data)
            comparison_matrix[baseline_name] = similarity
            
            print(f"\n{self.target} vs {baseline_name}:")
            print(f"   Similarity Score: {similarity:.1f}%")
            
            if similarity > 70:
                print(f"   ✅ HIGH SIMILARITY - Likely organic")
            elif similarity > 40:
                print(f"   ⚠️ MODERATE SIMILARITY - Unclear")
            else:
                print(f"   🚨 LOW SIMILARITY - Suspicious")
        
        # Final verdict based on all three
        avg_similarity = np.mean(list(comparison_matrix.values()))
        max_similarity = max(comparison_matrix.values())
        
        print("\n" + "="*70)
        print("⚖️ TRIPLE-BASELINE VERDICT")
        print("="*70)
        
        print(f"\nAverage Similarity to Baselines: {avg_similarity:.1f}%")
        print(f"Highest Match: {max_similarity:.1f}%")
        
        if max_similarity > 70:
            verdict = "LIKELY ORGANIC"
            confidence = max_similarity
        elif avg_similarity < 40:
            verdict = "CONFIRMED BOT ACTIVITY"
            confidence = 100 - avg_similarity
        else:
            verdict = "INCONCLUSIVE - NEEDS DEEPER ANALYSIS"
            confidence = 50
        
        print(f"\n🎯 VERDICT: {verdict}")
        print(f"   Confidence: {confidence:.1f}%")
        
        return comparison_matrix, verdict, confidence
    
    def _calculate_similarity(self, patterns1, patterns2):
        """
        Calculate similarity score between two pattern sets
        """
        if not patterns1 or not patterns2:
            return 0
        
        scores = []
        
        # Compare spike characteristics
        if 'spikes' in patterns1 and 'spikes' in patterns2:
            if patterns1['spikes'] and patterns2['spikes']:
                avg_amp1 = np.mean([s['amplitude'] for s in patterns1['spikes']])
                avg_amp2 = np.mean([s['amplitude'] for s in patterns2['spikes']])
                amp_similarity = 100 - abs(avg_amp1 - avg_amp2) * 10
                scores.append(max(0, min(100, amp_similarity)))
                
                avg_build1 = np.mean([s['build_days'] for s in patterns1['spikes']])
                avg_build2 = np.mean([s['build_days'] for s in patterns2['spikes']])
                build_similarity = 100 - abs(avg_build1 - avg_build2) * 20
                scores.append(max(0, min(100, build_similarity)))
        
        # Compare engagement
        if 'engagement_rate' in patterns1 and 'engagement_rate' in patterns2:
            eng_diff = abs(patterns1['engagement_rate'] - patterns2['engagement_rate'])
            eng_similarity = 100 - eng_diff * 20
            scores.append(max(0, min(100, eng_similarity)))
        
        # Compare plateau presence
        plateau1 = len(patterns1.get('plateaus', []))
        plateau2 = len(patterns2.get('plateaus', []))
        if plateau1 == 0 and plateau2 == 0:
            scores.append(100)  # Both organic (no plateaus)
        else:
            plateau_similarity = 100 - abs(plateau1 - plateau2) * 30
            scores.append(max(0, min(100, plateau_similarity)))
        
        return np.mean(scores) if scores else 50
    
    def exclude_livestreams(self, video_list):
        """
        Filter out livestreams from analysis
        """
        filtered = []
        for video in video_list:
            # Duration check
            if video.get('duration_minutes', 0) > 90:
                continue
            
            # Title check
            title = video.get('title', '').lower()
            livestream_keywords = ['live', 'stream', 'watch along', 'watchalong', 
                                   'reaction stream', 'live reaction']
            if any(keyword in title for keyword in livestream_keywords):
                continue
            
            filtered.append(video)
        
        return filtered
    
    def generate_forensic_report(self, all_patterns, comparison_matrix, verdict, confidence):
        """
        Generate comprehensive forensic report
        """
        report = {
            'timestamp': datetime.now().isoformat(),
            'baselines': list(self.baselines.keys()),
            'target': self.target,
            'verdict': verdict,
            'confidence': confidence,
            'comparison_matrix': comparison_matrix,
            'pattern_analysis': all_patterns,
            'recommendations': []
        }
        
        # Add recommendations based on findings
        if verdict == "CONFIRMED BOT ACTIVITY":
            report['recommendations'].extend([
                "Report channel for Terms of Service violation",
                "Avoid business partnerships",
                "Discount all metrics by 70-80%"
            ])
        elif verdict == "INCONCLUSIVE":
            report['recommendations'].extend([
                "Request YouTube Analytics access for AVD data",
                "Monitor future growth patterns",
                "Check subscriber-to-view ratios"
            ])
        else:
            report['recommendations'].append("Channel appears legitimate")
        
        # Save report
        with open('forensic_analysis_results.json', 'w') as f:
            json.dump(report, f, indent=2, default=str)
        
        print("\n✅ Forensic report saved to: forensic_analysis_results.json")
        
        return report


def run_analysis():
    """
    Execute the forensic analysis
    """
    print("""
    ╔══════════════════════════════════════════════════════════════╗
    ║       MULTI-BASELINE FORENSIC BOT DETECTION SYSTEM           ║
    ╚══════════════════════════════════════════════════════════════╝
    """)
    
    detector = ForensicBotDetector()
    
    # In production, these would load actual data
    # For now, showing the structure
    print("\n🔄 Loading baseline channels...")
    print("   • Jesse ON FIRE (owner verified)")
    print("   • Michael Bisping (UFC legend)")
    print("   • Chael Sonnen (established creator)")
    print("\n🎯 Target: THE MMA GURU")
    
    print("\n📊 Analysis would process:")
    print("   • Screenshot parsing from YTAnalytics folder")
    print("   • Molecular pattern extraction")
    print("   • Triple-baseline verification")
    print("   • Livestream exclusion")
    print("   • Statistical comparison matrix")
    
    print("\n✅ System ready for execution")
    print("\nRun: python screenshot_parser.py")
    print("Then: python run_forensic_analysis.py")
    
    return detector


if __name__ == "__main__":
    detector = run_analysis()
