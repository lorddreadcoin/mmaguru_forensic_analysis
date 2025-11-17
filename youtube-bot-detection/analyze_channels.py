"""
Main Analysis Script - YouTube Bot Detection System
Analyzes Jesse ON FIRE and THE MMA GURU for bot activity
"""

import os
import sys
from datetime import datetime
import pandas as pd
import numpy as np
from bot_detection_engine import BotDetectionEngine
from data_processor import DataProcessor, ComparativeAnalyzer

def analyze_channel(csv_path, channel_name):
    """
    Run complete bot detection analysis on a channel
    """
    print(f"\n{'='*80}")
    print(f"🎯 ANALYZING CHANNEL: {channel_name}")
    print(f"{'='*80}")
    
    # Initialize bot detection engine
    detector = BotDetectionEngine(channel_name)
    
    # Load data
    if not detector.load_data(csv_path):
        print(f"❌ Failed to load data for {channel_name}")
        return None
    
    # Run full analysis
    results = detector.run_full_analysis()
    
    return results

def main():
    """
    Main execution function
    """
    print("""
    ╔══════════════════════════════════════════════════════════════╗
    ║     YOUTUBE BOT DETECTION & MANIPULATION ANALYSIS SYSTEM     ║
    ║                    Advanced Analytics v1.0                   ║
    ╚══════════════════════════════════════════════════════════════╝
    """)
    
    # Define file paths
    jesse_csv = r"C:\Users\user\Downloads\vidIQ CSV export for Jesse ON FIRE 2025-11-16.csv"
    mma_csv = r"C:\Users\user\Downloads\vidIQ CSV export for THE MMA GURU 2025-11-16.csv"
    
    # Initialize data processor
    processor = DataProcessor()
    
    # Check if files exist
    if not os.path.exists(jesse_csv):
        print(f"❌ Jesse ON FIRE CSV not found at: {jesse_csv}")
        return
    if not os.path.exists(mma_csv):
        print(f"❌ THE MMA GURU CSV not found at: {mma_csv}")
        return
    
    print(f"✅ Found both CSV files")
    
    # Load and process data
    print("\n📊 LOADING DATA...")
    jesse_data = processor.load_vidiq_export(jesse_csv, "Jesse_ON_FIRE")
    mma_data = processor.load_vidiq_export(mma_csv, "THE_MMA_GURU")
    
    # Get summary statistics
    print("\n📈 SUMMARY STATISTICS:")
    print("-" * 40)
    
    jesse_stats = processor.get_summary_stats("Jesse_ON_FIRE")
    if jesse_stats:
        print(f"\n🔥 Jesse ON FIRE:")
        print(f"  Total Views: {jesse_stats.get('views', {}).get('total', 0):,.0f}")
        print(f"  Final Subscribers: {jesse_stats.get('subscribers', {}).get('final_count', 0):,.0f}")
        if jesse_stats.get('date_range'):
            print(f"  Date Range: {jesse_stats['date_range']['start'].strftime('%Y-%m-%d')} to {jesse_stats['date_range']['end'].strftime('%Y-%m-%d')}")
    
    mma_stats = processor.get_summary_stats("THE_MMA_GURU")
    if mma_stats:
        print(f"\n🥊 THE MMA GURU:")
        print(f"  Total Views: {mma_stats.get('views', {}).get('total', 0):,.0f}")
        print(f"  Final Subscribers: {mma_stats.get('subscribers', {}).get('final_count', 0):,.0f}")
        if mma_stats.get('date_range'):
            print(f"  Date Range: {mma_stats['date_range']['start'].strftime('%Y-%m-%d')} to {mma_stats['date_range']['end'].strftime('%Y-%m-%d')}")
    
    # Run bot detection analysis
    print("\n🤖 RUNNING BOT DETECTION ANALYSIS...")
    print("-" * 40)
    
    jesse_results = analyze_channel(jesse_csv, "Jesse ON FIRE")
    mma_results = analyze_channel(mma_csv, "THE MMA GURU")
    
    # Comparative analysis
    print("\n🔄 COMPARATIVE ANALYSIS")
    print("=" * 80)
    
    comparator = ComparativeAnalyzer()
    comparator.add_channel("Jesse_ON_FIRE", jesse_results)
    comparator.add_channel("THE_MMA_GURU", mma_results)
    
    # Find synchronized events
    synchronized = comparator.find_synchronized_spikes()
    print(f"\n🔗 SYNCHRONIZED SPIKE EVENTS:")
    if synchronized:
        print(f"  Found {len(synchronized)} synchronized spikes (potential same vendor):")
        for sync in synchronized[:5]:  # Show first 5
            print(f"    • {sync['date_channel1'].strftime('%Y-%m-%d')} ({sync['channel1']}) ↔️ {sync['date_channel2'].strftime('%Y-%m-%d')} ({sync['channel2']})")
            print(f"      Vendor Probability: {sync['vendor_probability']}%")
    else:
        print("  No synchronized spikes found")
    
    # Compare bot signatures
    signatures = comparator.compare_bot_signatures()
    print(f"\n🔍 BOT SIGNATURE COMPARISON:")
    for channel, sig in signatures['signatures'].items():
        print(f"  {channel}:")
        print(f"    • Authenticity Score: {sig['authenticity_score']:.1f}/100")
        print(f"    • Total Spikes: {sig['total_spikes']}")
        print(f"    • Estimated Bot Cost: ${sig['estimated_bot_cost']:,.2f}")
    
    if signatures['similar_patterns']:
        print(f"\n  ⚠️ Similar Bot Patterns Detected:")
        for pattern in signatures['similar_patterns']:
            print(f"    • {pattern['channel1']} ↔️ {pattern['channel2']}: {pattern['similarity_score']}% similarity")
            if pattern['likely_same_vendor']:
                print(f"      🚨 LIKELY SAME BOT VENDOR")
    
    # Generate final report
    report = comparator.generate_comparative_report()
    
    print("\n" + "="*80)
    print("📋 FINAL REPORT SUMMARY")
    print("="*80)
    
    print("\n🎯 KEY FINDINGS:")
    for insight in report['key_insights']:
        print(f"  {insight}")
    
    print(f"\n💰 FINANCIAL IMPACT:")
    print(f"  Total Estimated Bot Cost: ${report['aggregate_stats']['total_estimated_bot_cost']:,.2f}")
    print(f"  Average Authenticity Score: {report['aggregate_stats']['average_authenticity_score']:.1f}/100")
    
    # Export results
    print("\n📁 EXPORTING RESULTS...")
    output_dir = os.path.dirname(os.path.abspath(__file__))
    report_file = comparator.export_findings(output_dir)
    
    print(f"\n✅ Analysis complete! Results saved to: {output_dir}")
    
    # FOCUS ON SPECIFIC CASE STUDIES
    print("\n" + "="*80)
    print("🔍 CASE STUDY: SUSPICIOUS EVENTS")
    print("="*80)
    
    # September 2024 - Jesse ON FIRE
    print("\n📅 SEPTEMBER 2024 - Jesse ON FIRE Surge:")
    if jesse_results and 'spikes' in jesse_results:
        sept_spikes = [s for s in jesse_results['spikes'] 
                      if hasattr(s['date'], 'month') and s['date'].month == 9 and s['date'].year == 2024]
        if sept_spikes:
            print(f"  Found {len(sept_spikes)} spikes in September 2024:")
            for spike in sept_spikes:
                print(f"    • {spike['date'].strftime('%Y-%m-%d')}: {spike['metric']} = {spike['value']:,.0f} (Severity: {spike['severity']}/10)")
        else:
            print("  No specific spikes found for September 2024")
    
    # October 2024 - THE MMA GURU
    print("\n📅 OCTOBER 2024 - THE MMA GURU Spike:")
    if mma_results and 'spikes' in mma_results:
        oct_spikes = [s for s in mma_results['spikes'] 
                     if hasattr(s['date'], 'month') and s['date'].month == 10 and s['date'].year == 2024]
        if oct_spikes:
            print(f"  Found {len(oct_spikes)} spikes in October 2024:")
            for spike in oct_spikes:
                print(f"    • {spike['date'].strftime('%Y-%m-%d')}: {spike['metric']} = {spike['value']:,.0f} (Severity: {spike['severity']}/10)")
        else:
            print("  No specific spikes found for October 2024")
    
    print("\n" + "="*80)
    print("🏁 ANALYSIS COMPLETE")
    print("="*80)

if __name__ == "__main__":
    main()
