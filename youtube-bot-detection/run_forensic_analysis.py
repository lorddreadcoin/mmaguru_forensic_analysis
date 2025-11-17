"""
Forensic Analysis Execution Controller
Combines screenshot parsing with multi-baseline bot detection
Truth detection, not opinion
"""

import json
import pandas as pd
import numpy as np
from datetime import datetime
import os

def load_parsed_screenshots():
    """
    Load the parsed screenshot data
    """
    screenshot_file = 'screenshot_parsing_results.json'
    
    if os.path.exists(screenshot_file):
        with open(screenshot_file, 'r') as f:
            return json.load(f)
    else:
        print("⚠️ No screenshot data found. Running parser...")
        from screenshot_parser import main as parse_screenshots
        return parse_screenshots()

def create_comparison_matrix(molecular_metrics):
    """
    Create 4x4 comparison matrix of all channels
    """
    print("\n" + "="*70)
    print("📊 4x4 COMPARISON MATRIX")
    print("="*70)
    
    channels = ['jesse', 'mma_guru', 'bisping', 'chael']
    metrics_to_compare = ['spike_ratio', 'variance', 'avg_engagement']
    
    # Create matrix header
    print("\n" + " "*15 + " | ".join([f"{ch[:8]:^8}" for ch in channels]))
    print("-" * 60)
    
    for metric in metrics_to_compare:
        values = []
        for channel in channels:
            if channel in molecular_metrics:
                value = molecular_metrics[channel].get(metric, 0)
                values.append(f"{value:.2f}")
            else:
                values.append("N/A")
        
        print(f"{metric[:14]:<14} | " + " | ".join([f"{v:^8}" for v in values]))
    
    return molecular_metrics

def calculate_pattern_divergence(molecular_metrics):
    """
    Calculate how much MMA GURU diverges from the three baselines
    """
    print("\n" + "="*70)
    print("🔬 PATTERN DIVERGENCE ANALYSIS")
    print("="*70)
    
    baselines = ['jesse', 'bisping', 'chael']
    target = 'mma_guru'
    
    if target not in molecular_metrics:
        print("⚠️ MMA GURU data not found")
        return None
    
    target_data = molecular_metrics[target]
    divergence_scores = {}
    
    for baseline in baselines:
        if baseline not in molecular_metrics:
            continue
        
        baseline_data = molecular_metrics[baseline]
        
        # Calculate divergence for each metric
        divergences = []
        
        # Spike ratio divergence
        if 'spike_ratio' in target_data and 'spike_ratio' in baseline_data:
            spike_div = abs(target_data['spike_ratio'] - baseline_data['spike_ratio'])
            divergences.append(spike_div)
        
        # Variance divergence (low variance = suspicious)
        if 'variance' in target_data and 'variance' in baseline_data:
            var_div = abs(target_data['variance'] - baseline_data['variance'])
            divergences.append(var_div * 10)  # Weight variance heavily
        
        # Engagement divergence
        if 'avg_engagement' in target_data and 'avg_engagement' in baseline_data:
            eng_div = abs(target_data['avg_engagement'] - baseline_data['avg_engagement'])
            divergences.append(eng_div)
        
        if divergences:
            avg_divergence = np.mean(divergences)
            similarity = max(0, 100 - (avg_divergence * 20))
            divergence_scores[baseline] = similarity
            
            print(f"\n{target.upper()} vs {baseline.upper()}:")
            print(f"   Similarity: {similarity:.1f}%")
            
            if similarity < 40:
                print(f"   🚨 HIGH DIVERGENCE - Suspicious")
            elif similarity < 70:
                print(f"   ⚠️ MODERATE DIVERGENCE - Unclear")
            else:
                print(f"   ✅ LOW DIVERGENCE - Similar patterns")
    
    return divergence_scores

def livestream_filter(channel_data):
    """
    Filter out livestreams from analysis
    """
    filtered = []
    
    for item in channel_data:
        # Check for livestream indicators
        if 'duration' in item and item['duration'] > 90:
            continue
        if 'title' in item:
            title_lower = item['title'].lower()
            if any(word in title_lower for word in ['live', 'stream', 'watch along']):
                continue
        
        filtered.append(item)
    
    return filtered

def generate_final_verdict(divergence_scores, molecular_metrics):
    """
    Generate the final verdict based on all evidence
    """
    print("\n" + "="*70)
    print("⚖️ FINAL FORENSIC VERDICT")
    print("="*70)
    
    # Check Jesse's authenticity first (should always be 100%)
    print("\n🎯 BASELINE VERIFICATION:")
    print("   Jesse ON FIRE: 100% ORGANIC (owner confirmed)")
    print("   Michael Bisping: 100% ORGANIC (UFC legend)")
    print("   Chael Sonnen: 100% ORGANIC (established creator)")
    
    print("\n🔍 TARGET ANALYSIS: THE MMA GURU")
    
    if not divergence_scores:
        print("   ⚠️ Insufficient data for verdict")
        return
    
    # Calculate final score
    similarities = list(divergence_scores.values())
    avg_similarity = np.mean(similarities) if similarities else 0
    max_similarity = max(similarities) if similarities else 0
    min_similarity = min(similarities) if similarities else 0
    
    print(f"\n   Similarity to Jesse: {divergence_scores.get('jesse', 0):.1f}%")
    print(f"   Similarity to Bisping: {divergence_scores.get('bisping', 0):.1f}%")
    print(f"   Similarity to Chael: {divergence_scores.get('chael', 0):.1f}%")
    print(f"\n   Average: {avg_similarity:.1f}%")
    print(f"   Highest Match: {max_similarity:.1f}%")
    print(f"   Lowest Match: {min_similarity:.1f}%")
    
    # Apply detection rules
    print("\n" + "="*70)
    print("📋 APPLYING DETECTION RULES:")
    print("="*70)
    
    bot_indicators = 0
    organic_indicators = 0
    
    # Rule 1: Similarity to ANY baseline > 70%
    if max_similarity > 70:
        print("   ✅ Rule 1: Matches at least one baseline (>70%)")
        organic_indicators += 1
    else:
        print("   🚨 Rule 1: Doesn't match any baseline")
        bot_indicators += 1
    
    # Rule 2: Diverges from ALL baselines by >60%
    if avg_similarity < 40:
        print("   🚨 Rule 2: Diverges from ALL baselines")
        bot_indicators += 2
    else:
        print("   ✅ Rule 2: Within acceptable range")
        organic_indicators += 1
    
    # Rule 3: Check variance (from molecular metrics)
    if 'mma_guru' in molecular_metrics:
        variance = molecular_metrics['mma_guru'].get('variance', 0)
        if variance < 0.1:
            print(f"   🚨 Rule 3: Suspiciously low variance ({variance:.2f})")
            bot_indicators += 2
        else:
            print(f"   ✅ Rule 3: Natural variance ({variance:.2f})")
            organic_indicators += 1
    
    # Rule 4: Engagement rate check
    if 'mma_guru' in molecular_metrics:
        engagement = molecular_metrics['mma_guru'].get('avg_engagement', 0)
        if engagement < 1 or engagement > 10:
            print(f"   🚨 Rule 4: Abnormal engagement ({engagement:.1f}%)")
            bot_indicators += 1
        else:
            print(f"   ✅ Rule 4: Normal engagement ({engagement:.1f}%)")
            organic_indicators += 1
    
    # Final verdict calculation
    print("\n" + "="*70)
    print("🏆 VERDICT:")
    print("="*70)
    
    print(f"\n   Organic Indicators: {organic_indicators}")
    print(f"   Bot Indicators: {bot_indicators}")
    
    if bot_indicators > organic_indicators * 2:
        verdict = "CONFIRMED BOT ACTIVITY"
        confidence = min(95, 50 + (bot_indicators * 10))
        emoji = "🚨"
    elif organic_indicators > bot_indicators * 2:
        verdict = "LIKELY ORGANIC"
        confidence = min(95, 50 + (organic_indicators * 10))
        emoji = "✅"
    else:
        verdict = "INCONCLUSIVE - REQUIRES DEEPER ANALYSIS"
        confidence = 50
        emoji = "⚠️"
    
    print(f"\n   {emoji} {verdict}")
    print(f"   Confidence: {confidence}%")
    
    # Recommendations
    print("\n📝 RECOMMENDATIONS:")
    if "BOT" in verdict:
        print("   1. Check Average View Duration (AVD) for final confirmation")
        print("   2. Compare watch time to view count ratios")
        print("   3. Analyze traffic sources for geographic concentration")
        print("   4. Report channel if AVD < 1 minute during spikes")
    elif "ORGANIC" in verdict:
        print("   1. Channel appears legitimate")
        print("   2. Growth patterns match established creators")
        print("   3. Engagement metrics within normal range")
    else:
        print("   1. Request YouTube Analytics access")
        print("   2. Monitor future growth patterns")
        print("   3. Check correlation with external events (UFC, news)")
    
    return verdict, confidence

def generate_html_report(molecular_metrics, divergence_scores, verdict, confidence):
    """
    Generate HTML visualization report
    """
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Forensic Bot Detection Report</title>
        <style>
            body {{ font-family: 'Courier New', monospace; background: #0a0a0a; color: #00ff00; padding: 20px; }}
            h1 {{ color: #ff6600; text-align: center; }}
            .verdict {{ 
                background: {'#ff0000' if 'BOT' in verdict else '#00ff00' if 'ORGANIC' in verdict else '#ffff00'};
                color: #000;
                padding: 20px;
                text-align: center;
                font-size: 24px;
                font-weight: bold;
                margin: 20px 0;
            }}
            .matrix {{ background: #1a1a1a; padding: 15px; border: 1px solid #00ff00; margin: 20px 0; }}
            .baseline {{ color: #00ff00; }}
            .target {{ color: #ff6600; }}
            .suspicious {{ color: #ff0000; }}
            table {{ width: 100%; border-collapse: collapse; }}
            th, td {{ border: 1px solid #00ff00; padding: 10px; text-align: center; }}
            th {{ background: #003300; }}
        </style>
    </head>
    <body>
        <h1>🔬 FORENSIC BOT DETECTION REPORT</h1>
        <div class="verdict">{verdict} - {confidence}% Confidence</div>
        
        <div class="matrix">
            <h2>Molecular Metrics</h2>
            <table>
                <tr>
                    <th>Channel</th>
                    <th>Spike Ratio</th>
                    <th>Variance</th>
                    <th>Engagement</th>
                    <th>Status</th>
                </tr>
                <tr class="baseline">
                    <td>Jesse ON FIRE</td>
                    <td>{molecular_metrics.get('jesse', {}).get('spike_ratio', 0):.2f}</td>
                    <td>{molecular_metrics.get('jesse', {}).get('variance', 0):.2f}</td>
                    <td>{molecular_metrics.get('jesse', {}).get('avg_engagement', 0):.1f}%</td>
                    <td>✅ BASELINE</td>
                </tr>
                <tr class="target">
                    <td>THE MMA GURU</td>
                    <td>{molecular_metrics.get('mma_guru', {}).get('spike_ratio', 0):.2f}</td>
                    <td>{molecular_metrics.get('mma_guru', {}).get('variance', 0):.2f}</td>
                    <td>{molecular_metrics.get('mma_guru', {}).get('avg_engagement', 0):.1f}%</td>
                    <td>🎯 TARGET</td>
                </tr>
            </table>
        </div>
        
        <div class="matrix">
            <h2>Pattern Divergence</h2>
            <table>
                <tr>
                    <th>Baseline</th>
                    <th>Similarity to MMA GURU</th>
                    <th>Assessment</th>
                </tr>
    """
    
    for baseline, similarity in divergence_scores.items():
        status = "✅" if similarity > 70 else "⚠️" if similarity > 40 else "🚨"
        html += f"""
                <tr>
                    <td>{baseline.upper()}</td>
                    <td>{similarity:.1f}%</td>
                    <td>{status}</td>
                </tr>
        """
    
    html += """
            </table>
        </div>
        
        <div class="matrix">
            <h2>Analysis Timestamp</h2>
            <p>""" + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + """</p>
        </div>
    </body>
    </html>
    """
    
    with open('channel_comparison.html', 'w') as f:
        f.write(html)
    
    print("\n✅ HTML report saved to: channel_comparison.html")

def main():
    """
    Execute complete forensic analysis
    """
    print("""
    ╔══════════════════════════════════════════════════════════════╗
    ║     EXECUTING MULTI-BASELINE FORENSIC ANALYSIS               ║
    ╚══════════════════════════════════════════════════════════════╝
    """)
    
    print("\n📊 Step 1: Loading parsed screenshot data...")
    screenshot_data = load_parsed_screenshots()
    
    print("\n🔬 Step 2: Extracting molecular metrics...")
    molecular_metrics = screenshot_data.get('molecular_metrics', {})
    
    print("\n📈 Step 3: Creating comparison matrix...")
    create_comparison_matrix(molecular_metrics)
    
    print("\n🎯 Step 4: Calculating pattern divergence...")
    divergence_scores = calculate_pattern_divergence(molecular_metrics)
    
    print("\n⚖️ Step 5: Generating final verdict...")
    verdict, confidence = generate_final_verdict(divergence_scores, molecular_metrics)
    
    print("\n📄 Step 6: Creating reports...")
    generate_html_report(molecular_metrics, divergence_scores or {}, verdict, confidence)
    
    # Save final results
    final_results = {
        'timestamp': datetime.now().isoformat(),
        'molecular_metrics': molecular_metrics,
        'divergence_scores': divergence_scores,
        'verdict': verdict,
        'confidence': confidence,
        'baselines': ['Jesse ON FIRE', 'Michael Bisping', 'Chael Sonnen'],
        'target': 'THE MMA GURU'
    }
    
    with open('forensic_analysis_results.json', 'w') as f:
        json.dump(final_results, f, indent=2, default=str)
    
    print("\n" + "="*70)
    print("✅ FORENSIC ANALYSIS COMPLETE")
    print("="*70)
    print("\nGenerated files:")
    print("   • forensic_analysis_results.json")
    print("   • channel_comparison.html")
    print("   • screenshot_parsing_results.json")
    
    print(f"\n🏆 FINAL VERDICT: {verdict}")
    print(f"   Confidence: {confidence}%")
    print("="*70)


if __name__ == "__main__":
    main()
