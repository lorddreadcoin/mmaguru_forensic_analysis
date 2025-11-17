"""
YouTube Bot Detection Dashboard
Interactive Streamlit application for visualizing bot detection results
"""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
from datetime import datetime, timedelta
import json
import os
from bot_detection_engine import BotDetectionEngine
from data_processor import DataProcessor, ComparativeAnalyzer

# Page config
st.set_page_config(
    page_title="YouTube Bot Detection System",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .main {
        padding: 0rem 1rem;
    }
    .stAlert {
        margin-top: 1rem;
    }
    .metric-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 1.5rem;
        border-radius: 10px;
        color: white;
        margin-bottom: 1rem;
    }
    .severity-high {
        color: #ff4444;
        font-weight: bold;
    }
    .severity-medium {
        color: #ffaa00;
        font-weight: bold;
    }
    .severity-low {
        color: #00ff00;
    }
</style>
""", unsafe_allow_html=True)

def load_channel_data(csv_path, channel_name):
    """Load and analyze channel data"""
    from video_data_adapter import VideoDataAdapter
    
    # Use video data adapter for vidIQ exports
    adapter = VideoDataAdapter()
    data = adapter.load_video_csv(csv_path, channel_name)
    
    if data is None:
        # Fallback to raw data loading
        data = pd.read_csv(csv_path)
        data['DATE PUBLISHED'] = pd.to_datetime(data['DATE PUBLISHED'], format='%d/%m/%Y', errors='coerce')
        data = data.rename(columns={'DATE PUBLISHED': 'Date', 'VIEWS': 'Views'})
    
    detector = BotDetectionEngine(channel_name)
    detector.data = data
    detector._identify_metrics()
    
    # Run analysis
    results = detector.run_full_analysis()
    
    return data, results, detector

def plot_timeline_with_anomalies(data, spikes, drops, title):
    """Create timeline plot with anomalies marked"""
    fig = make_subplots(
        rows=2, cols=1,
        subplot_titles=('Views Over Time', 'Subscribers Over Time'),
        vertical_spacing=0.1,
        row_heights=[0.5, 0.5]
    )
    
    # Views plot
    if 'Views' in data.columns and 'Date' in data.columns:
        # Sort by date and fill missing values
        data_sorted = data.sort_values('Date')
        views_data = data_sorted[['Date', 'Views']].dropna()
        
        if len(views_data) > 0:
            fig.add_trace(
                go.Scatter(
                    x=views_data['Date'],
                    y=views_data['Views'],
                    mode='lines',
                    name='Views',
                    line=dict(color='#00cc96', width=2),
                    fill='tozeroy',
                    fillcolor='rgba(0, 204, 150, 0.2)'
                ),
                row=1, col=1
            )
        
        # Mark spikes on views
        view_spikes = [s for s in spikes if 'view' in s['metric'].lower()]
        if view_spikes:
            spike_dates = [s['date'] for s in view_spikes]
            spike_values = [s['value'] for s in view_spikes]
            fig.add_trace(
                go.Scatter(
                    x=spike_dates,
                    y=spike_values,
                    mode='markers',
                    name='Suspicious Spikes',
                    marker=dict(
                        color='red',
                        size=12,
                        symbol='triangle-up'
                    ),
                    text=[f"Spike: {s['spike_ratio']:.1f}x baseline" for s in view_spikes],
                    hovertemplate='%{text}<br>Value: %{y:,.0f}<br>Date: %{x}'
                ),
                row=1, col=1
            )
    
    # Subscribers plot
    if 'Subscribers' in data.columns and 'Date' in data.columns:
        # Sort by date and fill missing values
        data_sorted = data.sort_values('Date')
        subs_data = data_sorted[['Date', 'Subscribers']].dropna()
        
        if len(subs_data) > 0:
            fig.add_trace(
                go.Scatter(
                    x=subs_data['Date'],
                    y=subs_data['Subscribers'],
                    mode='lines',
                    name='Subscribers',
                    line=dict(color='#ab63fa', width=2),
                    fill='tozeroy',
                    fillcolor='rgba(171, 99, 250, 0.2)'
                ),
                row=2, col=1
            )
        
        # Mark spikes on subscribers
        sub_spikes = [s for s in spikes if 'sub' in s['metric'].lower()]
        if sub_spikes:
            spike_dates = [s['date'] for s in sub_spikes]
            spike_values = [s['value'] for s in sub_spikes]
            fig.add_trace(
                go.Scatter(
                    x=spike_dates,
                    y=spike_values,
                    mode='markers',
                    name='Suspicious Spikes',
                    marker=dict(
                        color='red',
                        size=12,
                        symbol='triangle-up'
                    ),
                    text=[f"Spike: {s['spike_ratio']:.1f}x baseline" for s in sub_spikes],
                    hovertemplate='%{text}<br>Value: %{y:,.0f}<br>Date: %{x}',
                    showlegend=False
                ),
                row=2, col=1
            )
    
    fig.update_layout(
        title=title,
        height=700,
        showlegend=True,
        hovermode='x unified',
        template='plotly_dark'
    )
    
    fig.update_xaxes(title_text="Date", row=2, col=1)
    fig.update_yaxes(title_text="Views", row=1, col=1)
    fig.update_yaxes(title_text="Subscribers", row=2, col=1)
    
    return fig

def plot_authenticity_gauge(score, channel_name):
    """Create authenticity score gauge chart"""
    fig = go.Figure(go.Indicator(
        mode="gauge+number+delta",
        value=score,
        title={'text': f"{channel_name}<br>Authenticity Score"},
        domain={'x': [0, 1], 'y': [0, 1]},
        gauge={
            'axis': {'range': [None, 100], 'tickwidth': 1},
            'bar': {'color': "darkblue"},
            'steps': [
                {'range': [0, 30], 'color': "#ff4444"},
                {'range': [30, 50], 'color': "#ff9999"},
                {'range': [50, 70], 'color': "#ffcc00"},
                {'range': [70, 90], 'color': "#99ff99"},
                {'range': [90, 100], 'color': "#00ff00"}
            ],
            'threshold': {
                'line': {'color': "red", 'width': 4},
                'thickness': 0.75,
                'value': 50
            }
        }
    ))
    
    fig.update_layout(
        height=300,
        template='plotly_dark'
    )
    
    return fig

def plot_cost_breakdown(cost_estimate):
    """Create cost breakdown chart"""
    categories = ['View Bots', 'Subscriber Bots']
    values_min = [
        (cost_estimate['views_botted'] / 1000) * 3,  # Min cost for views
        (cost_estimate['subs_botted'] / 100) * 10     # Min cost for subs
    ]
    values_max = [
        (cost_estimate['views_botted'] / 1000) * 10,  # Max cost for views
        (cost_estimate['subs_botted'] / 100) * 50      # Max cost for subs
    ]
    
    fig = go.Figure()
    
    fig.add_trace(go.Bar(
        name='Minimum Cost',
        x=categories,
        y=values_min,
        marker_color='#00cc96'
    ))
    
    fig.add_trace(go.Bar(
        name='Maximum Cost',
        x=categories,
        y=values_max,
        marker_color='#ff6692'
    ))
    
    fig.update_layout(
        title="Estimated Bot Manipulation Costs",
        yaxis_title="Cost (USD)",
        barmode='group',
        height=400,
        template='plotly_dark'
    )
    
    return fig

def plot_spike_severity_heatmap(spikes):
    """Create heatmap of spike severity over time"""
    if not spikes:
        return None
    
    # Prepare data for heatmap
    spike_df = pd.DataFrame(spikes)
    if 'date' in spike_df.columns:
        spike_df['date'] = pd.to_datetime(spike_df['date'])
        spike_df['month'] = spike_df['date'].dt.to_period('M').astype(str)  # Convert Period to string
        
        # Pivot table for heatmap
        pivot = spike_df.pivot_table(
            values='severity',
            index='metric',
            columns='month',
            aggfunc='max',
            fill_value=0
        )
        
        fig = px.imshow(
            pivot,
            labels=dict(x="Month", y="Metric", color="Severity"),
            title="Bot Activity Heatmap (Severity by Month)",
            color_continuous_scale="RdYlBu_r",
            aspect="auto"
        )
        
        fig.update_layout(
            height=400,
            template='plotly_dark'
        )
        
        return fig
    
    return None

def main():
    """Main dashboard application"""
    
    # Header
    st.title("🤖 YouTube Bot Detection & Analytics System")
    st.markdown("### Advanced Channel Manipulation Analysis")
    
    # Sidebar
    with st.sidebar:
        st.header("📁 Data Input")
        
        # File paths
        jesse_csv = r"C:\Users\user\Downloads\vidIQ CSV export for Jesse ON FIRE 2025-11-16.csv"
        mma_csv = r"C:\Users\user\Downloads\vidIQ CSV export for THE MMA GURU 2025-11-16.csv"
        
        # Channel selection
        channel = st.selectbox(
            "Select Channel",
            ["Jesse ON FIRE", "THE MMA GURU", "Compare Both"]
        )
        
        # Analysis options
        st.header("⚙️ Analysis Options")
        
        spike_threshold = st.slider(
            "Spike Detection Sensitivity",
            min_value=2.0,
            max_value=10.0,
            value=3.0,
            step=0.5,
            help="Lower values detect more spikes"
        )
        
        z_threshold = st.slider(
            "Statistical Anomaly Threshold (Z-score)",
            min_value=2.0,
            max_value=5.0,
            value=3.0,
            step=0.5
        )
        
        show_raw_data = st.checkbox("Show Raw Data Tables", value=False)
        
        if st.button("🔄 Run Analysis", type="primary"):
            st.session_state['run_analysis'] = True
    
    # Main content
    if 'run_analysis' in st.session_state:
        
        if channel == "Compare Both":
            # Comparative analysis
            st.header("🔄 Comparative Analysis")
            
            col1, col2 = st.columns(2)
            
            with st.spinner("Loading Jesse ON FIRE data..."):
                jesse_data, jesse_results, jesse_detector = load_channel_data(jesse_csv, "Jesse ON FIRE")
                
            with st.spinner("Loading THE MMA GURU data..."):
                mma_data, mma_results, mma_detector = load_channel_data(mma_csv, "THE MMA GURU")
            
            # Authenticity scores
            with col1:
                fig = plot_authenticity_gauge(
                    jesse_results['authenticity']['score'],
                    "Jesse ON FIRE"
                )
                st.plotly_chart(fig, use_container_width=True)
                
            with col2:
                fig = plot_authenticity_gauge(
                    mma_results['authenticity']['score'],
                    "THE MMA GURU"
                )
                st.plotly_chart(fig, use_container_width=True)
            
            # Key metrics comparison
            st.header("📊 Key Metrics Comparison")
            
            metrics_col1, metrics_col2, metrics_col3, metrics_col4 = st.columns(4)
            
            with metrics_col1:
                st.metric(
                    "Jesse Total Spikes",
                    len(jesse_results.get('spikes', [])),
                    delta=None
                )
            
            with metrics_col2:
                st.metric(
                    "Jesse Bot Cost",
                    f"${jesse_results['cost_estimate']['average_cost']:,.0f}",
                    delta=None
                )
            
            with metrics_col3:
                st.metric(
                    "MMA Total Spikes",
                    len(mma_results.get('spikes', [])),
                    delta=None
                )
            
            with metrics_col4:
                st.metric(
                    "MMA Bot Cost",
                    f"${mma_results['cost_estimate']['average_cost']:,.0f}",
                    delta=None
                )
            
            # Synchronized events
            st.header("🔗 Synchronized Bot Events")
            comparator = ComparativeAnalyzer()
            comparator.add_channel("Jesse_ON_FIRE", jesse_results)
            comparator.add_channel("THE_MMA_GURU", mma_results)
            
            synchronized = comparator.find_synchronized_spikes()
            
            if synchronized:
                st.warning(f"⚠️ Found {len(synchronized)} synchronized spike events - potential same bot vendor!")
                
                sync_df = pd.DataFrame(synchronized)
                sync_df = sync_df[['date_channel1', 'date_channel2', 'days_apart', 'vendor_probability']]
                st.dataframe(sync_df, use_container_width=True)
            else:
                st.info("No synchronized spikes detected between channels")
            
        else:
            # Single channel analysis
            csv_path = jesse_csv if channel == "Jesse ON FIRE" else mma_csv
            
            with st.spinner(f"Analyzing {channel}..."):
                data, results, detector = load_channel_data(csv_path, channel)
            
            # Dashboard layout
            col1, col2, col3 = st.columns(3)
            
            with col1:
                st.markdown('<div class="metric-card">', unsafe_allow_html=True)
                st.metric("Authenticity Score", f"{results['authenticity']['score']:.1f}/100")
                st.caption(f"Rating: {results['authenticity']['rating']}")
                st.markdown('</div>', unsafe_allow_html=True)
            
            with col2:
                st.markdown('<div class="metric-card">', unsafe_allow_html=True)
                avg_cost = results['cost_estimate'].get('average_cost', 0)
                min_cost = results['cost_estimate'].get('estimated_cost_min', 0)
                max_cost = results['cost_estimate'].get('estimated_cost_max', 0)
                
                # Format costs properly
                if avg_cost > 0:
                    st.metric("Estimated Bot Cost", f"${avg_cost:,.2f}")
                    st.caption(f"Range: ${min_cost:,.0f} - ${max_cost:,.0f}")
                else:
                    st.metric("Estimated Bot Cost", "$0.00")
                    st.caption("No significant bot activity detected")
                st.markdown('</div>', unsafe_allow_html=True)
            
            with col3:
                st.markdown('<div class="metric-card">', unsafe_allow_html=True)
                st.metric("Total Anomalies", len(results.get('spikes', [])) + len(results.get('drops', [])))
                st.caption(f"Spikes: {len(results.get('spikes', []))}, Drops: {len(results.get('drops', []))}")
                st.markdown('</div>', unsafe_allow_html=True)
            
            # Timeline visualization
            st.header("📈 Timeline Analysis")
            
            fig = plot_timeline_with_anomalies(
                data,
                results.get('spikes', []),
                results.get('drops', []),
                f"{channel} - Views & Subscribers with Anomalies"
            )
            st.plotly_chart(fig, use_container_width=True)
            
            # Cost breakdown
            col1, col2 = st.columns(2)
            
            with col1:
                st.subheader("💰 Manipulation Cost Breakdown")
                cost_fig = plot_cost_breakdown(results['cost_estimate'])
                st.plotly_chart(cost_fig, use_container_width=True)
            
            with col2:
                st.subheader("🔥 Activity Heatmap")
                heatmap = plot_spike_severity_heatmap(results.get('spikes', []))
                if heatmap:
                    st.plotly_chart(heatmap, use_container_width=True)
                else:
                    st.info("No spike data available for heatmap")
            
            # Detailed findings
            with st.expander("📋 Detailed Analysis Report"):
                st.subheader("Authenticity Assessment")
                for reason in results['authenticity']['reasons']:
                    st.write(f"• {reason}")
                
                st.subheader("Top Suspicious Events")
                if results.get('spikes'):
                    spike_df = pd.DataFrame(results['spikes'][:10])
                    st.dataframe(spike_df, use_container_width=True)
                
                st.subheader("Engagement Metrics")
                st.json(results.get('engagement', {}))
            
            # Raw data
            if show_raw_data:
                with st.expander("📊 Raw Data"):
                    st.dataframe(data.head(100), use_container_width=True)
    
    else:
        # Welcome screen
        st.info("👈 Select a channel and click 'Run Analysis' to begin")
        
        st.markdown("""
        ### 🎯 What This System Detects:
        
        - **Artificial Spike Patterns**: Sudden, unnatural increases in views/subscribers
        - **Bot Purge Events**: Cliff drops indicating YouTube removing fake engagement
        - **Statistical Anomalies**: Data points that deviate significantly from normal patterns
        - **Time-based Patterns**: Unnatural hourly/daily distribution of activity
        - **Cross-channel Synchronization**: Same-day spikes indicating shared bot vendors
        
        ### 💡 Key Metrics:
        
        - **Authenticity Score**: 0-100 scale (100 = completely authentic)
        - **Bot Cost Estimate**: Black market pricing ($3-10 per 1000 views)
        - **Severity Scores**: 1-10 scale for each detected anomaly
        - **Vendor Signatures**: Unique patterns identifying bot suppliers
        """)

if __name__ == "__main__":
    main()
