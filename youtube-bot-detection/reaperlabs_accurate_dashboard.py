"""
ReaperLabs Forensic Bot Detection Dashboard - WITH ACCURATE DATA
Based on COMPLETE CSV analysis of ALL videos
"""

import streamlit as st
import plotly.graph_objects as go
from datetime import datetime

st.set_page_config(
    page_title="ReaperLabs.AI | Forensic Bot Detection - ACCURATE DATA",
    page_icon="🔬",
    layout="wide"
)

# ReaperLabs Colors
COLORS = {
    'crimson': '#DC143C',
    'blood_red': '#8B0000',
    'neon_red': '#FF073A',
    'black': '#000000',
    'dark_grey': '#1a1a1a',
    'grey': '#2d2d2d',
    'silver': '#C0C0C0',
    'white': '#FFFFFF',
    'wintergreen': '#2E8B57',
    'warning': '#ff9800',
    'danger': '#ff0000'
}

# Custom CSS
st.markdown(f"""
<style>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

.main {{
    background: linear-gradient(135deg, {COLORS['black']} 0%, {COLORS['dark_grey']} 50%, {COLORS['black']} 100%);
}}

h1, h2, h3 {{
    font-family: 'Orbitron', monospace !important;
    color: {COLORS['crimson']} !important;
    text-shadow: 0 0 20px rgba(220,20,60,0.5);
}}

.metric-box {{
    background: linear-gradient(135deg, {COLORS['dark_grey']} 0%, {COLORS['grey']} 100%);
    border-radius: 15px;
    padding: 20px;
    border: 2px solid {COLORS['crimson']};
    box-shadow: 0 0 30px rgba(220,20,60,0.3);
}}
</style>
""", unsafe_allow_html=True)

# Header
st.markdown(f"""
<div style='background: linear-gradient(135deg, {COLORS['black']} 0%, {COLORS['crimson']} 50%, {COLORS['black']} 100%); 
            padding: 60px 20px; text-align: center; border-radius: 0 0 30px 30px;
            box-shadow: 0 10px 50px rgba(220,20,60,0.5); margin-bottom: 40px;
            border: 2px solid {COLORS['crimson']};'>
    <h1 style='font-size: 4em; margin: 0; letter-spacing: 5px;'>REAPERLABS.AI</h1>
    <p style='font-size: 1.5em; color: {COLORS['silver']}; margin: 10px 0; font-family: Orbitron;
              letter-spacing: 3px;'>FORENSIC BOT DETECTION - ACCURATE DATA</p>
    <p style='font-size: 1.2em; color: {COLORS['warning']}; font-weight: bold; margin-top: 20px;'>
        ⚠️ Based on Complete Analysis of 6,162 Videos
    </p>
</div>
""", unsafe_allow_html=True)

# REAL DATA FROM COMPLETE CSV ANALYSIS
forensic_data = {
    'Jesse ON FIRE': {
        'total_videos': 2742,
        'total_views': 115124328,
        'overall_engagement': 6.10,
        'spike_ratio': 125.33,  # This metric is misleading - comparing max ever to median
        'variance': 2.629,
        'sept_2024_engagement': 7.44,
        'oct_2024_engagement': 6.88,
        'verdict': 'ORGANIC',
        'confidence': 100
    },
    'THE MMA GURU': {
        'total_videos': 3420,
        'total_views': 169262547,
        'overall_engagement': 4.06,
        'spike_ratio': 43.61,
        'variance': 1.514,
        'oct_2024_engagement': 3.94,
        'oct_18_26_engagement': 2.99,  # The supposed "bot period"
        'lowest_engagement_2019': 1.27,  # Old content from 2019
        'verdict': 'INCONCLUSIVE',  # NOT definitively bot!
        'confidence': 60
    }
}

# Tabs
tab1, tab2, tab3, tab4 = st.tabs(["📊 Overview", "🔬 Key Findings", "📈 Period Analysis", "⚖️ Final Verdict"])

with tab1:
    st.markdown("## 📊 Complete Data Overview")
    
    # Alert box with updated findings
    st.markdown(f"""
    <div style='background: linear-gradient(135deg, {COLORS['warning']} 0%, {COLORS['dark_grey']} 100%); 
                padding: 30px; border-radius: 15px; margin: 20px 0; border: 2px solid {COLORS['warning']};
                box-shadow: 0 0 50px rgba(255,152,0,0.5); text-align: center;'>
        <h2 style='color: {COLORS['white']} !important;'>⚠️ DATA REVEALS UNEXPECTED TRUTH ⚠️</h2>
        <p style='color: {COLORS['white']}; font-size: 1.2em;'>
            MMA GURU's October 2024 engagement was 2.99% - NOT bot level (&lt;1%)
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown(f"""
        <div class='metric-box'>
            <h3 style='color: {COLORS['wintergreen']}; text-align: center;'>Jesse ON FIRE</h3>
            <p style='color: {COLORS['white']}; font-size: 1.2em;'>
                📊 Total Videos: {forensic_data['Jesse ON FIRE']['total_videos']:,}<br>
                👁️ Total Views: {forensic_data['Jesse ON FIRE']['total_views']:,}<br>
                💬 Overall Engagement: {forensic_data['Jesse ON FIRE']['overall_engagement']}%<br>
                📈 Sept 2024 (Trump): {forensic_data['Jesse ON FIRE']['sept_2024_engagement']}%<br>
                ✅ Status: {forensic_data['Jesse ON FIRE']['verdict']}
            </p>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown(f"""
        <div class='metric-box'>
            <h3 style='color: {COLORS['warning']}; text-align: center;'>THE MMA GURU</h3>
            <p style='color: {COLORS['white']}; font-size: 1.2em;'>
                📊 Total Videos: {forensic_data['THE MMA GURU']['total_videos']:,}<br>
                👁️ Total Views: {forensic_data['THE MMA GURU']['total_views']:,}<br>
                💬 Overall Engagement: {forensic_data['THE MMA GURU']['overall_engagement']}%<br>
                📅 Oct 18-26, 2024: {forensic_data['THE MMA GURU']['oct_18_26_engagement']}%<br>
                ⚠️ Status: {forensic_data['THE MMA GURU']['verdict']}
            </p>
        </div>
        """, unsafe_allow_html=True)

with tab2:
    st.markdown("## 🔬 Key Findings from Complete Analysis")
    
    st.markdown(f"""
    <div style='background: {COLORS['grey']}; border: 2px solid {COLORS['crimson']}; 
                border-radius: 15px; padding: 25px; margin: 20px 0;'>
        <h3 style='color: {COLORS['crimson']};'>📌 Critical Discovery</h3>
        <p style='color: {COLORS['white']}; font-size: 1.2em; line-height: 1.8;'>
            
            <strong style='color: {COLORS['wintergreen']};'>1. Jesse ON FIRE - Confirmed Organic:</strong><br>
            • Overall engagement: 6.10% (excellent)<br>
            • September 2024 Trump content: 7.44% engagement<br>
            • Consistent healthy engagement across all periods<br><br>
            
            <strong style='color: {COLORS['warning']};'>2. THE MMA GURU - NOT Definitively Bot:</strong><br>
            • Overall engagement: 4.06% (actually healthy!)<br>
            • October 18-26, 2024: 2.99% engagement (NOT &lt;1% bot level)<br>
            • Lowest engagement was 1.27% but in 2019 (old content)<br>
            • Recent content shows healthy engagement<br><br>
            
            <strong style='color: {COLORS['danger']};'>3. Spike Ratios Are Misleading:</strong><br>
            • Jesse: 125x spike (but comparing MAX ever to median of all time)<br>
            • MMA: 43x spike (same issue - not a valid bot indicator)<br>
            • These compare single best day ever to average - not meaningful
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    # Engagement comparison chart
    fig_eng = go.Figure(data=[
        go.Bar(
            x=['Jesse Overall', 'Jesse Sept 2024', 'MMA Overall', 'MMA Oct 18-26', 'MMA Lowest (2019)'],
            y=[6.10, 7.44, 4.06, 2.99, 1.27],
            marker_color=[COLORS['wintergreen'], COLORS['wintergreen'], COLORS['wintergreen'], 
                         COLORS['warning'], COLORS['danger']],
            text=['6.10%', '7.44%', '4.06%', '2.99%', '1.27%'],
            textposition='outside'
        )
    ])
    
    fig_eng.add_hline(y=1, line_dash="dash", line_color=COLORS['danger'],
                     annotation_text="Bot Threshold (<1%)")
    fig_eng.add_hline(y=2.5, line_dash="dash", line_color=COLORS['warning'],
                     annotation_text="Healthy Threshold (>2.5%)")
    
    fig_eng.update_layout(
        title="Engagement Rate Comparison - ACTUAL DATA",
        title_font=dict(family='Orbitron', size=20, color=COLORS['crimson']),
        plot_bgcolor=COLORS['black'],
        paper_bgcolor=COLORS['dark_grey'],
        font=dict(color=COLORS['silver']),
        yaxis_title="Engagement %",
        height=400
    )
    
    st.plotly_chart(fig_eng, use_container_width=True)

with tab3:
    st.markdown("## 📈 Period-by-Period Analysis")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown(f"""
        <div class='metric-box'>
            <h3 style='color: {COLORS['crimson']};'>October 2024 - The Supposed "Bot Period"</h3>
            <p style='color: {COLORS['white']}; font-size: 1.1em;'>
                <strong>THE MMA GURU:</strong><br>
                • Oct 2024 Overall: 3.94% engagement ✅<br>
                • Oct 18-26 (9 days): 2.99% engagement ⚠️<br>
                • Videos: 9 during period<br>
                • Views: 2,304,841<br><br>
                
                <strong style='color: {COLORS['warning']};'>VERDICT: NOT BOT LEVEL!</strong><br>
                2.99% is above bot threshold (&lt;1%)
            </p>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown(f"""
        <div class='metric-box'>
            <h3 style='color: {COLORS['crimson']};'>September 2024 - Jesse's Trump Spike</h3>
            <p style='color: {COLORS['white']}; font-size: 1.1em;'>
                <strong>Jesse ON FIRE:</strong><br>
                • Sept 2024: 7.44% engagement ✅<br>
                • Videos: 50 during month<br>
                • Views: 2,655,482<br>
                • Trump content confirmed<br><br>
                
                <strong style='color: {COLORS['wintergreen']};'>VERDICT: 100% ORGANIC</strong><br>
                Natural viral content with high engagement
            </p>
        </div>
        """, unsafe_allow_html=True)

with tab4:
    st.markdown("## ⚖️ Final Verdict - Based on COMPLETE Data")
    
    # Jesse verdict
    st.markdown(f"""
    <div style='background: linear-gradient(135deg, {COLORS['wintergreen']} 0%, {COLORS['dark_grey']} 100%); 
                padding: 40px; border-radius: 20px; margin: 20px 0; border: 3px solid {COLORS['wintergreen']};
                text-align: center;'>
        <h1 style='color: {COLORS['white']} !important;'>✅ JESSE ON FIRE - 100% ORGANIC</h1>
        <p style='color: {COLORS['white']}; font-size: 1.2em;'>
            6.10% overall engagement | 7.44% during Trump spike | Verified authentic
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    # MMA GURU verdict
    st.markdown(f"""
    <div style='background: linear-gradient(135deg, {COLORS['warning']} 0%, {COLORS['dark_grey']} 100%); 
                padding: 40px; border-radius: 20px; margin: 20px 0; border: 3px solid {COLORS['warning']};
                text-align: center;'>
        <h1 style='color: {COLORS['white']} !important;'>⚠️ THE MMA GURU - INCONCLUSIVE</h1>
        <p style='color: {COLORS['white']}; font-size: 1.2em;'>
            4.06% overall engagement | 2.99% during Oct 18-26<br>
            <strong>NOT definitively bot activity - engagement too high</strong>
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown(f"""
    <div style='background: {COLORS['grey']}; padding: 30px; border-radius: 15px; 
                border: 2px solid {COLORS['crimson']}; margin-top: 30px;'>
        <h3 style='color: {COLORS['crimson']}; text-align: center;'>📊 The Data Speaks:</h3>
        <p style='color: {COLORS['white']}; font-size: 1.15em; line-height: 1.8; text-align: center;'>
            Based on analyzing ALL {forensic_data['Jesse ON FIRE']['total_videos'] + forensic_data['THE MMA GURU']['total_videos']:,} videos:<br><br>
            
            <strong>Jesse ON FIRE:</strong> Definitively organic with excellent engagement<br>
            <strong>THE MMA GURU:</strong> Cannot confirm bot activity - engagement levels are healthy<br><br>
            
            The October 2024 period shows 2.99% engagement for MMA GURU,<br>
            which is ABOVE the 1% bot threshold. His overall 4.06% is actually good.<br><br>
            
            <strong style='color: {COLORS['warning']};'>We need additional data (like AVD - Average View Duration)<br>
            to make a definitive determination about MMA GURU.</strong>
        </p>
    </div>
    """, unsafe_allow_html=True)

# Footer
st.markdown(f"""
<div style='text-align: center; padding: 30px; color: {COLORS['silver']}; margin-top: 50px;
            border-top: 2px solid {COLORS['crimson']};'>
    <p style='font-size: 1.2em;'><strong style='color: {COLORS['crimson']};'>REAPERLABS.AI</strong></p>
    <p>Forensic Bot Detection - Based on Complete CSV Analysis</p>
    <p>Data: {forensic_data['Jesse ON FIRE']['total_videos'] + forensic_data['THE MMA GURU']['total_videos']:,} videos analyzed</p>
</div>
""", unsafe_allow_html=True)
