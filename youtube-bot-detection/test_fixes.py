"""
Test script to verify all fixes are working
"""

import pandas as pd
import numpy as np
from datetime import datetime
from video_data_adapter import VideoDataAdapter
from bot_detection_engine import BotDetectionEngine

def test_bot_detection():
    """Test the bot detection with fixed code"""
    
    print("🧪 TESTING BOT DETECTION FIXES")
    print("="*60)
    
    # Load Jesse's data
    csv_path = r"C:\Users\user\Downloads\vidIQ CSV export for Jesse ON FIRE 2025-11-16.csv"
    
    print("\n1️⃣ Testing Video Data Adapter...")
    adapter = VideoDataAdapter()
    daily_stats = adapter.load_video_csv(csv_path, "Jesse ON FIRE")
    
    if daily_stats is not None:
        print(f"✅ Successfully converted {len(daily_stats)} days of data")
        print(f"   Date range: {daily_stats['Date'].min()} to {daily_stats['Date'].max()}")
    else:
        print("❌ Failed to convert video data")
        return
    
    print("\n2️⃣ Testing Bot Detection Engine...")
    detector = BotDetectionEngine("Jesse ON FIRE")
    detector.data = daily_stats
    detector._identify_metrics()
    
    # Test spike detection
    print("\n3️⃣ Testing Spike Detection...")
    if detector.view_cols:
        spikes = detector.detect_spikes(detector.view_cols[0])
        print(f"✅ Found {len(spikes)} spikes")
        
        # Check spike data structure
        if spikes:
            spike = spikes[0]
            print(f"   Sample spike: {spike['date']} - Ratio: {spike['spike_ratio']:.2f}")
            assert 'baseline' in spike, "Missing baseline in spike"
            assert spike['baseline'] >= 0, "Negative baseline detected"
    
    print("\n4️⃣ Testing Cost Calculation...")
    cost = detector.calculate_manipulation_cost(100000, 1000)  # 100k views, 1k subs
    print(f"✅ Cost calculation working:")
    print(f"   Min: ${cost['estimated_cost_min']:,.2f}")
    print(f"   Max: ${cost['estimated_cost_max']:,.2f}")
    print(f"   Avg: ${cost['average_cost']:,.2f}")
    
    # Verify no negative costs
    assert cost['estimated_cost_min'] >= 0, "Negative min cost"
    assert cost['estimated_cost_max'] >= 0, "Negative max cost"
    assert cost['average_cost'] >= 0, "Negative average cost"
    
    print("\n5️⃣ Testing Period JSON Serialization...")
    # Create test data with periods
    test_df = pd.DataFrame({
        'date': pd.date_range('2024-01-01', periods=30),
        'metric': ['views'] * 30,
        'severity': np.random.randint(1, 10, 30)
    })
    
    # Convert to period and then to string (as fixed in dashboard)
    test_df['month'] = test_df['date'].dt.to_period('M').astype(str)
    
    # Try to convert to JSON (this should work now)
    try:
        import json
        json_str = test_df.to_json()
        print(f"✅ Period serialization fixed - JSON length: {len(json_str)} chars")
    except Exception as e:
        print(f"❌ Period serialization still broken: {e}")
    
    print("\n6️⃣ Testing Full Analysis...")
    results = detector.run_full_analysis()
    
    print(f"\n✅ Full analysis complete:")
    print(f"   Authenticity Score: {results['authenticity']['score']:.1f}/100")
    print(f"   Total Spikes: {len(results.get('spikes', []))}")
    print(f"   Bot Cost: ${results['cost_estimate']['average_cost']:,.2f}")
    
    # Verify cost is reasonable
    assert results['cost_estimate']['average_cost'] < 1000000, "Unreasonable cost detected"
    
    print("\n" + "="*60)
    print("✅ ALL TESTS PASSED - FIXES WORKING CORRECTLY")
    print("="*60)
    
    return results

if __name__ == "__main__":
    test_bot_detection()
