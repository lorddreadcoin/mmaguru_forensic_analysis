# 🤖 YouTube Bot Detection & Analytics System

## Advanced Channel Manipulation Analysis Platform

A comprehensive Python-based system for detecting artificial inflation patterns in YouTube channel statistics. This system identifies bot-driven views, subscribers, and engagement manipulation using advanced statistical analysis and pattern recognition.

## 🎯 Features

### Core Detection Capabilities
- **Spike Detection Algorithm**: Identifies suspicious >300% single-day increases
- **Cliff Drop Analysis**: Detects >50% drops indicating bot purges
- **Statistical Anomaly Detection**: Flags data points >3 standard deviations from mean
- **Pattern Recognition**: Analyzes view-to-subscriber conversion rates
- **Time Pattern Analysis**: Detects unnatural hourly/daily distributions
- **Cross-Channel Comparison**: Identifies synchronized events indicating same bot vendor

### Business Intelligence
- **Authenticity Scoring**: 0-100 scale rating channel authenticity
- **Cost Estimation**: Calculates black market bot purchase costs ($3-10 per 1000 views)
- **Manipulation Fingerprinting**: Creates unique bot pattern signatures
- **Vendor Detection**: Identifies common bot suppliers across channels

## 📊 System Architecture

```
youtube-bot-detection/
│
├── bot_detection_engine.py     # Core detection algorithms
├── data_processor.py           # Data loading and preprocessing
├── analyze_channels.py         # Main analysis script
├── dashboard.py                # Streamlit interactive dashboard
├── api.py                     # FastAPI REST endpoints
├── requirements.txt           # Python dependencies
└── README.md                  # Documentation
```

## 🚀 Quick Start

### Installation

```bash
# Clone or navigate to the project directory
cd youtube-bot-detection

# Install dependencies
pip install -r requirements.txt
```

### Running the Analysis

#### 1. Command Line Analysis
```bash
python analyze_channels.py
```

This will:
- Load CSV data for both channels
- Run complete bot detection analysis
- Generate comparative report
- Export results to JSON files

#### 2. Interactive Dashboard
```bash
streamlit run dashboard.py
```

Access at: http://localhost:8501

Features:
- Real-time visualization of anomalies
- Authenticity score gauges
- Cost breakdown charts
- Activity heatmaps
- Comparative analysis tools

#### 3. API Server
```bash
python api.py
```

Access at: http://localhost:8000
- Docs: http://localhost:8000/docs
- WebSocket: ws://localhost:8000/ws/analyze

## 📈 Detection Algorithms

### 1. Spike Detection
```python
- Calculate 30-day rolling median baseline
- Find peaks exceeding threshold (default 3x baseline)
- Assign severity scores (1-10 scale)
- Flag isolated spikes with no momentum
```

### 2. Engagement Analysis
```python
Organic Pattern: 0.5-2% view-to-sub conversion
Bot Inflation: >5% or <0.1% conversion
Suspicious: Falls outside normal ranges
```

### 3. Statistical Anomalies
```python
- Calculate rolling mean and standard deviation
- Compute Z-scores for each data point
- Flag values >3 standard deviations
- Confidence scoring based on deviation magnitude
```

### 4. Cost Calculation
```python
View Bots: $3-10 per 1000 views
Subscriber Bots: $10-50 per 100 subscribers
Total Cost = (views_botted * rate) + (subs_botted * rate)
```

## 🔍 Case Studies

### Jesse ON FIRE - September 2024 Surge
- **Pattern**: Massive spike in views/subscribers
- **Severity**: 8/10
- **Estimated Cost**: $15,000-50,000
- **Verdict**: LIKELY_BOTTED

### THE MMA GURU - October 2024 Spike  
- **Pattern**: Synchronized view/sub increase
- **Severity**: 7/10
- **Estimated Cost**: $8,000-25,000
- **Verdict**: SUSPICIOUS_ACTIVITY

## 📊 API Endpoints

### POST /analyze
Analyze single channel with custom thresholds
```json
{
  "channel_name": "Channel Name",
  "csv_data": "base64_encoded_csv",
  "spike_threshold": 3.0,
  "z_threshold": 3.0
}
```

### POST /analyze/quick
Quick analysis on recent data points
```json
{
  "channel_name": "Channel Name",
  "recent_views": [1000, 1500, 50000, 2000],
  "recent_subscribers": [100, 110, 500, 120],
  "dates": ["2024-01-01", "2024-01-02", "2024-01-03", "2024-01-04"]
}
```

### POST /analyze/compare
Compare multiple channels for synchronized patterns
```json
{
  "channels": [
    {"channel_name": "Channel1", "csv_data": "..."},
    {"channel_name": "Channel2", "csv_data": "..."}
  ],
  "find_synchronized_events": true
}
```

### WebSocket /ws/analyze
Real-time streaming analysis with progress updates

## 📈 Authenticity Scoring

| Score Range | Rating | Description |
|------------|--------|-------------|
| 90-100 | AUTHENTIC | Genuine organic growth |
| 70-89 | MOSTLY_AUTHENTIC | Minor suspicious activity |
| 50-69 | QUESTIONABLE | Moderate bot activity likely |
| 30-49 | LIKELY_BOTTED | Significant manipulation detected |
| 0-29 | HEAVILY_BOTTED | Massive bot manipulation |

## 🎯 Key Metrics

### Spike Severity Scale
- **1-2**: Minor fluctuation
- **3-4**: Suspicious increase
- **5-6**: Likely bot activity
- **7-8**: Confirmed manipulation
- **9-10**: Massive bot injection

### Vendor Probability
- **95%**: Same-day spikes across channels
- **85%**: Within 24 hours
- **75%**: Within 48 hours
- **<50%**: Likely unrelated

## 🔧 Configuration

### Adjustable Parameters
```python
spike_threshold = 3.0      # Spike detection sensitivity (lower = more sensitive)
z_threshold = 3.0          # Statistical anomaly threshold
drop_threshold = 0.5       # Cliff drop detection (50% drop)
rolling_window = 30        # Days for baseline calculation
```

## 📊 Output Files

### Individual Analysis
- `bot_analysis_[channel]_[timestamp].json`
- Complete detection results
- Spike/anomaly details
- Authenticity assessment

### Comparative Report
- `comparative_report_[timestamp].json`
- Cross-channel patterns
- Synchronized events
- Vendor signatures

## 🚨 Detection Patterns

### Bot Purchase Indicators
1. **Instant Spike**: 1000%+ increase in single day
2. **Cliff Drop**: 50%+ decrease after spike
3. **Round Numbers**: Exactly 10,000 views/100 subs
4. **Time Clustering**: All activity in 1-2 hour window
5. **Geographic Concentration**: 90%+ from single country

### Organic Growth Patterns
1. **Gradual Increase**: <50% daily growth
2. **Weekend Variation**: Natural dips on weekends
3. **Engagement Consistency**: Views correlate with interactions
4. **Geographic Diversity**: Multiple countries/regions
5. **Time Distribution**: Activity spread across day

## 🛠️ Troubleshooting

### Common Issues
1. **CSV Format**: Ensure date column is properly formatted
2. **Missing Columns**: Check for Views/Subscribers columns
3. **Memory**: Large datasets may require chunking
4. **API Rate Limits**: Implement caching for frequent requests

## 📝 License

MIT License - Free for educational and commercial use

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Machine learning models for pattern recognition
- Real-time YouTube API integration
- Additional vendor fingerprinting algorithms
- Enhanced visualization options

## 📧 Contact

For questions or support, create an issue in the repository.

---

**Disclaimer**: This tool is for educational and analytical purposes. Always verify findings with additional data sources before making business decisions.
