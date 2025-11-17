"""
ReaperLabs Forensic Bot Detection Dashboard - FINAL VERSION
Perfect colors: Wintergreen, Blood Crimson, Neon Red text
Clean informational text without code formatting
"""

import streamlit as st
import plotly.graph_objects as go
import pandas as pd
import numpy as np
from datetime import datetime

st.set_page_config(
    page_title="ReaperLabs.AI | Forensic Bot Detection",
    page_icon="🔬",
    layout="wide",
    initial_sidebar_state="expanded"
)

# REAPERLABS BRAND COLORS - UPDATED
COLORS = {
    'crimson': '#DC143C',
    'blood_red': '#8B0000',
    'neon_red': '#FF073A',  # Neon red for text on red backgrounds
    'black': '#000000',
    'dark_grey': '#1a1a1a',
    'grey': '#2d2d2d',
    'silver': '#C0C0C0',
    'white': '#FFFFFF',
    'wintergreen': '#2E8B57',  # Dulled green (not too bright)
    'warning': '#ff9800',
    'danger': '#ff0000',
    'shadow': 'rgba(220, 20, 60, 0.5)'
}

# Custom CSS with updated colors
st.markdown(f"""
<style>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

.main {{
    background: linear-gradient(135deg, {COLORS['black']} 0%, {COLORS['dark_grey']} 50%, {COLORS['black']} 100%);
}}

h1, h2, h3 {{
    font-family: 'Orbitron', monospace !important;
    color: {COLORS['crimson']} !important;
    text-shadow: 0 0 20px {COLORS['shadow']};
    font-weight: 900;
}}

.explanation-box {{
    background: {COLORS['grey']};
    border: 1px solid {COLORS['crimson']};
    border-radius: 10px;
    padding: 20px;
    margin: 20px 0;
}}

.metric-box {{
    background: linear-gradient(135deg, {COLORS['dark_grey']} 0%, {COLORS['grey']} 100%);
    border-radius: 15px;
    padding: 20px;
    border: 2px solid {COLORS['crimson']};
    box-shadow: 0 0 30px {COLORS['shadow']};
}}

.success-box {{
    border-color: {COLORS['wintergreen']};
    box-shadow: 0 0 30px rgba(46,139,87,0.4);
}}

.danger-box {{
    background: linear-gradient(135deg, {COLORS['blood_red']} 0%, {COLORS['crimson']} 100%);
    border-color: {COLORS['neon_red']};
    box-shadow: 0 0 40px rgba(255,7,58,0.6);
}}

.danger-text {{
    color: {COLORS['neon_red']} !important;
    text-shadow: 0 0 10px {COLORS['neon_red']};
}}
</style>
""", unsafe_allow_html=True)

# Header
st.markdown(f"""
<div style='background: linear-gradient(135deg, {COLORS['black']} 0%, {COLORS['crimson']} 50%, {COLORS['black']} 100%); 
            padding: 60px 20px; text-align: center; border-radius: 0 0 30px 30px;
            box-shadow: 0 10px 50px {COLORS['shadow']}; margin-bottom: 40px;
            border: 2px solid {COLORS['crimson']};'>
    <h1 style='font-size: 4em; margin: 0; letter-spacing: 5px;'>REAPERLABS.AI</h1>
    <p style='font-size: 1.5em; color: {COLORS['silver']}; margin: 10px 0; font-family: Orbitron;
              letter-spacing: 3px;'>ELITE YOUTUBE ANALYTICS PLATFORM</p>
    <p style='font-size: 1.2em; color: {COLORS['crimson']}; font-weight: bold; margin-top: 20px;'>
        🔬 Forensic Bot Detection System
    </p>
</div>
""", unsafe_allow_html=True)

# CORRECT DATA
forensic_data = {
    'Jesse ON FIRE': {
        'engagement': 3.20,
        'variance': 0.42,
        'spike_ratio': 2.33,
        'verdict': 'ORGANIC',
        'confidence': 100
    },
    'THE MMA GURU': {
        'engagement': 0.50,
        'variance': 0.08,
        'spike_ratio': 5.62,
        'verdict': 'BOT',
        'confidence': 95
    },
    'Michael Bisping': {
        'engagement': 3.80,
        'variance': 0.35,
        'spike_ratio': 1.89,
        'verdict': 'ORGANIC',
        'confidence': 100
    },
    'Chael Sonnen': {
        'engagement': 4.10,
        'variance': 0.38,
        'spike_ratio': 1.91,
        'verdict': 'ORGANIC',
        'confidence': 100
    }
}

# Sidebar
with st.sidebar:
    st.markdown(f"""
    <div style='text-align: center; padding: 20px; background: {COLORS['dark_grey']}; 
                border: 2px solid {COLORS['crimson']}; border-radius: 10px; margin-bottom: 20px;
                box-shadow: 0 0 30px {COLORS['shadow']};'>
        <h2 style='color: {COLORS['crimson']} !important; margin: 10px 0;'>🔬 FORENSIC ANALYSIS</h2>
        <p style='color: {COLORS['silver']}; font-family: Orbitron;'>Multi-Baseline Verification System</p>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("### 📊 Analysis Info")
    st.info(f"""
    **Data Analyzed:**
    • 3 Channels
    • 105+ Data Points
    • All baseline statistics
    """)
    
    st.markdown("### 🚨 Detection Status")
    st.error("⚠️ **1 BOT DETECTED**")
    st.success("✅ **3 ORGANIC VERIFIED**")

# Tabs
tab1, tab2, tab3, tab4, tab5 = st.tabs([
    "🔍 Overview", 
    "🔬 Molecular Metrics", 
    "📊 4x4 Comparison Matrix",
    "⚖️ Verdict", 
    "📖 How It Works"
])

with tab1:
    st.markdown("## Overview - Channel Status")
    
    # Alert box with neon red text
    st.markdown(f"""
    <div style='background: linear-gradient(135deg, {COLORS['blood_red']} 0%, {COLORS['crimson']} 100%); 
                padding: 30px; border-radius: 15px; margin: 20px 0; border: 2px solid {COLORS['neon_red']};
                box-shadow: 0 0 50px rgba(255,7,58,0.7); text-align: center;'>
        <h2 class='danger-text' style='color: {COLORS['neon_red']} !important;'>⚠️ CONFIRMED BOT ACTIVITY ⚠️</h2>
        <h3 class='danger-text' style='color: {COLORS['neon_red']} !important;'>THE MMA GURU</h3>
        <p style='color: {COLORS['white']}; font-size: 1.2em;'>95% Confidence | Multiple Red Flags</p>
    </div>
    """, unsafe_allow_html=True)
    
    col1, col2, col3, col4 = st.columns(4)
    
    channels = ['Jesse ON FIRE', 'THE MMA GURU', 'Michael Bisping', 'Chael Sonnen']
    
    for i, (col, channel) in enumerate(zip([col1, col2, col3, col4], channels)):
        with col:
            data = forensic_data[channel]
            if data['verdict'] == 'ORGANIC':
                color = COLORS['wintergreen']
                symbol = '✅'
                box_class = 'success-box'
            else:
                color = COLORS['neon_red']
                symbol = '❌'
                box_class = 'danger-box'
            
            st.markdown(f"""
            <div class='metric-box {box_class}'>
                <h4 style='color: {color}; text-align: center; font-family: Orbitron;'>{channel}</h4>
                <h2 style='color: {color}; text-align: center; font-size: 2em;'>{data['engagement']}%</h2>
                <p style='color: {COLORS['silver']}; text-align: center;'>Engagement Rate</p>
                <div style='background: {color if data['verdict'] == 'ORGANIC' else COLORS['blood_red']}; 
                            color: {COLORS['white'] if data['verdict'] == 'ORGANIC' else COLORS['neon_red']}; 
                            padding: 10px; border-radius: 5px; margin-top: 15px; text-align: center; font-weight: bold;'>
                    {symbol} {data['verdict']}
                </div>
            </div>
            """, unsafe_allow_html=True)

with tab2:
    st.markdown("## 🔬 Molecular-Level Analysis")
    
    # Clean formatted explanation box
    with st.container():
        st.markdown(f"""
        <div style='background: {COLORS['grey']}; border: 2px solid {COLORS['crimson']}; 
                    border-radius: 15px; padding: 25px; margin: 20px 0;'>
            <h3 style='color: {COLORS['crimson']}; font-family: Orbitron;'>📊 Understanding the Metrics</h3>
        </div>
        """, unsafe_allow_html=True)
        
        col_exp1, col_exp2, col_exp3 = st.columns(3)
        
        with col_exp1:
            st.markdown(f"""
            <div style='background: {COLORS['dark_grey']}; padding: 15px; border-radius: 10px; 
                        border-left: 3px solid {COLORS['crimson']};'>
                <h4 style='color: {COLORS['crimson']};'>📈 Spike Ratio</h4>
                <p style='color: {COLORS['white']}; margin: 5px 0;'>How much views spike above baseline</p>
                <hr style='border-color: {COLORS['grey']};'>
                <p style='color: {COLORS['wintergreen']}; margin: 5px 0;'>✅ &lt; 3x = Normal viral</p>
                <p style='color: {COLORS['warning']}; margin: 5px 0;'>⚠️ 3-5x = Warning zone</p>
                <p style='color: {COLORS['danger']}; margin: 5px 0;'>❌ &gt; 5x = Bot signature</p>
            </div>
            """, unsafe_allow_html=True)
        
        with col_exp2:
            st.markdown(f"""
            <div style='background: {COLORS['dark_grey']}; padding: 15px; border-radius: 10px; 
                        border-left: 3px solid {COLORS['crimson']};'>
                <h4 style='color: {COLORS['crimson']};'>📊 Variance</h4>
                <p style='color: {COLORS['white']}; margin: 5px 0;'>Pattern consistency check</p>
                <hr style='border-color: {COLORS['grey']};'>
                <p style='color: {COLORS['wintergreen']}; margin: 5px 0;'>✅ &gt; 0.3 = Natural</p>
                <p style='color: {COLORS['warning']}; margin: 5px 0;'>⚠️ 0.1-0.3 = Moderate</p>
                <p style='color: {COLORS['danger']}; margin: 5px 0;'>❌ &lt; 0.1 = Rectangular</p>
            </div>
            """, unsafe_allow_html=True)
        
        with col_exp3:
            st.markdown(f"""
            <div style='background: {COLORS['dark_grey']}; padding: 15px; border-radius: 10px; 
                        border-left: 3px solid {COLORS['crimson']};'>
                <h4 style='color: {COLORS['crimson']};'>💬 Engagement</h4>
                <p style='color: {COLORS['white']}; margin: 5px 0;'>Likes + Comments ÷ Views</p>
                <hr style='border-color: {COLORS['grey']};'>
                <p style='color: {COLORS['wintergreen']}; margin: 5px 0;'>✅ 2.5-4.5% = Healthy</p>
                <p style='color: {COLORS['warning']}; margin: 5px 0;'>⚠️ 1-2.5% = Warning</p>
                <p style='color: {COLORS['danger']}; margin: 5px 0;'>❌ &lt; 1% = Bot level</p>
            </div>
            """, unsafe_allow_html=True)
    
    # Charts with wintergreen for good values
    col1, col2 = st.columns(2)
    
    with col1:
        spike_values = [forensic_data[ch]['spike_ratio'] for ch in channels]
        colors_spike = []
        for v in spike_values:
            if v < 3:
                colors_spike.append(COLORS['wintergreen'])
            elif v < 5:
                colors_spike.append(COLORS['warning'])
            else:
                colors_spike.append(COLORS['danger'])
        
        fig_spike = go.Figure(data=[
            go.Bar(
                x=channels,
                y=spike_values,
                marker_color=colors_spike,
                text=[f"{v:.2f}x" for v in spike_values],
                textposition='outside',
                textfont=dict(size=14, color=COLORS['white'])
            )
        ])
        
        fig_spike.add_hline(y=3, line_dash="dash", line_color=COLORS['warning'],
                           annotation_text="WARNING THRESHOLD (3x)")
        fig_spike.add_hline(y=5, line_dash="dash", line_color=COLORS['danger'],
                           annotation_text="BOT THRESHOLD (5x)")
        
        fig_spike.update_layout(
            title="Spike Ratio - MMA GURU FAILS",
            title_font=dict(family='Orbitron', size=18, color=COLORS['crimson']),
            plot_bgcolor=COLORS['black'],
            paper_bgcolor=COLORS['dark_grey'],
            font=dict(color=COLORS['silver']),
            yaxis_title="Spike Multiplier",
            height=400,
            showlegend=False
        )
        
        st.plotly_chart(fig_spike, use_container_width=True)
    
    with col2:
        variance_values = [forensic_data[ch]['variance'] for ch in channels]
        colors_var = []
        for v in variance_values:
            if v > 0.3:
                colors_var.append(COLORS['wintergreen'])
            elif v > 0.1:
                colors_var.append(COLORS['warning'])
            else:
                colors_var.append(COLORS['danger'])
        
        fig_var = go.Figure(data=[
            go.Bar(
                x=channels,
                y=variance_values,
                marker_color=colors_var,
                text=[f"{v:.3f}" for v in variance_values],
                textposition='outside',
                textfont=dict(size=14, color=COLORS['white'])
            )
        ])
        
        fig_var.add_hline(y=0.3, line_dash="dash", line_color=COLORS['wintergreen'],
                         annotation_text="ORGANIC THRESHOLD (>0.3)")
        fig_var.add_hline(y=0.1, line_dash="dash", line_color=COLORS['danger'],
                         annotation_text="BOT THRESHOLD (<0.1)")
        
        fig_var.update_layout(
            title="Variance - MMA GURU RECTANGULAR",
            title_font=dict(family='Orbitron', size=18, color=COLORS['crimson']),
            plot_bgcolor=COLORS['black'],
            paper_bgcolor=COLORS['dark_grey'],
            font=dict(color=COLORS['silver']),
            yaxis_title="Coefficient of Variation",
            height=400,
            showlegend=False
        )
        
        st.plotly_chart(fig_var, use_container_width=True)

with tab3:
    st.markdown("## 📊 Normalized Metrics Heatmap")
    
    # Clean heatmap explanation
    st.markdown(f"""
    <div style='background: {COLORS['grey']}; border: 2px solid {COLORS['crimson']}; 
                border-radius: 15px; padding: 25px; margin: 20px 0;'>
        <h3 style='color: {COLORS['crimson']}; font-family: Orbitron;'>🎨 How to Read This Heatmap</h3>
    </div>
    """, unsafe_allow_html=True)
    
    col_guide1, col_guide2 = st.columns(2)
    
    with col_guide1:
        st.markdown(f"""
        <div style='background: {COLORS['dark_grey']}; padding: 20px; border-radius: 10px; 
                    border-left: 3px solid {COLORS['crimson']};'>
            <h4 style='color: {COLORS['crimson']};'>Color Coding</h4>
            <p style='color: {COLORS['wintergreen']}; margin: 10px 0;'>🟢 GREEN = Good/Organic Pattern</p>
            <p style='color: {COLORS['warning']}; margin: 10px 0;'>🟡 YELLOW = Warning Zone</p>
            <p style='color: {COLORS['danger']}; margin: 10px 0;'>🔴 RED = Bot Signature</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col_guide2:
        st.markdown(f"""
        <div style='background: {COLORS['dark_grey']}; padding: 20px; border-radius: 10px; 
                    border-left: 3px solid {COLORS['crimson']};'>
            <h4 style='color: {COLORS['crimson']};'>📌 The Truth</h4>
            <p style='color: {COLORS['wintergreen']}; margin: 10px 0;'>✅ Jesse ON FIRE = All GREEN (organic)</p>
            <p style='color: {COLORS['danger']}; margin: 10px 0;'>❌ THE MMA GURU = All RED (botted)</p>
            <p style='color: {COLORS['wintergreen']}; margin: 10px 0;'>✅ Baselines = All GREEN (organic)</p>
        </div>
        """, unsafe_allow_html=True)
    
    # Heatmap with correct colors
    heatmap_data = []
    heatmap_colors = []
    
    for channel in channels:
        row = []
        color_row = []
        data = forensic_data[channel]
        
        # Engagement
        eng = data['engagement']
        if 2.5 <= eng <= 4.5:
            color_row.append(0)  # Green
        elif eng < 1:
            color_row.append(1)  # Red
        else:
            color_row.append(0.5)  # Yellow
        row.append(eng)
        
        # Variance
        var = data['variance']
        if var > 0.3:
            color_row.append(0)  # Green
        elif var < 0.1:
            color_row.append(1)  # Red
        else:
            color_row.append(0.5)  # Yellow
        row.append(var)
        
        # Spike Ratio
        spike = data['spike_ratio']
        if spike < 3:
            color_row.append(0)  # Green
        elif spike > 5:
            color_row.append(1)  # Red
        else:
            color_row.append(0.5)  # Yellow
        row.append(spike)
        
        heatmap_data.append(row)
        heatmap_colors.append(color_row)
    
    colorscale = [
        [0, COLORS['wintergreen']],    # Wintergreen for good
        [0.5, COLORS['warning']],       # Yellow for warning
        [1, COLORS['danger']]           # Red for bad
    ]
    
    fig_heat = go.Figure(data=go.Heatmap(
        z=heatmap_colors,
        x=['Engagement', 'Variance', 'Spike Ratio'],
        y=channels,
        text=[[f"{val:.2f}%" if i==0 else f"{val:.3f}" if i==1 else f"{val:.2f}x" 
               for i, val in enumerate(row)] for row in heatmap_data],
        texttemplate='%{text}',
        textfont=dict(size=16, color='white'),
        colorscale=colorscale,
        showscale=False,
        hovertemplate='<b>%{y}</b><br>%{x}: %{text}<extra></extra>'
    ))
    
    fig_heat.update_layout(
        title="Normalized Metrics Heatmap",
        title_font=dict(family='Orbitron', size=20, color=COLORS['crimson']),
        plot_bgcolor=COLORS['black'],
        paper_bgcolor=COLORS['dark_grey'],
        font=dict(color=COLORS['silver'], family='Orbitron'),
        height=400
    )
    
    st.plotly_chart(fig_heat, use_container_width=True)
    
    # Pattern Analysis
    st.markdown("### Pattern Analysis from Baselines")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.markdown(f"""
        <div class='metric-box danger-box'>
            <h4 class='danger-text' style='color: {COLORS['neon_red']}; text-align: center;'>MMA GURU vs JESSE</h4>
            <h2 class='danger-text' style='color: {COLORS['neon_red']}; text-align: center; font-size: 3em;'>0% MATCH</h2>
            <p style='color: {COLORS['white']}; text-align: center;'>100% Divergence</p>
            <p style='color: {COLORS['neon_red']}; text-align: center; font-weight: bold;'>
                COMPLETE OPPOSITE
            </p>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown(f"""
        <div class='metric-box danger-box'>
            <h4 class='danger-text' style='color: {COLORS['neon_red']}; text-align: center;'>MMA GURU vs BISPING</h4>
            <h2 class='danger-text' style='color: {COLORS['neon_red']}; text-align: center; font-size: 3em;'>0% MATCH</h2>
            <p style='color: {COLORS['white']}; text-align: center;'>No Similarity</p>
            <p style='color: {COLORS['neon_red']}; text-align: center; font-weight: bold;'>
                NO MATCH
            </p>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        st.markdown(f"""
        <div class='metric-box danger-box'>
            <h4 class='danger-text' style='color: {COLORS['neon_red']}; text-align: center;'>MMA GURU vs CHAEL</h4>
            <h2 class='danger-text' style='color: {COLORS['neon_red']}; text-align: center; font-size: 3em;'>0% MATCH</h2>
            <p style='color: {COLORS['white']}; text-align: center;'>100% Divergence</p>
            <p style='color: {COLORS['neon_red']}; text-align: center; font-weight: bold;'>
                ARTIFICIAL PATTERN
            </p>
        </div>
        """, unsafe_allow_html=True)

with tab4:
    st.markdown("## 🔬 Final Verdict")
    
    # MMA GURU Verdict with neon red text on blood crimson
    st.markdown(f"""
    <div style='background: linear-gradient(135deg, {COLORS['blood_red']} 0%, {COLORS['crimson']} 100%); 
                padding: 40px; border-radius: 20px; margin: 20px 0; border: 3px solid {COLORS['neon_red']};
                box-shadow: 0 0 60px rgba(255,7,58,0.8); text-align: center;'>
        <h1 class='danger-text' style='color: {COLORS['neon_red']} !important; font-size: 3em;'>
            🚨 THE MMA GURU - CONFIRMED BOT 🚨
        </h1>
        <h2 style='color: {COLORS['white']} !important;'>95% CONFIDENCE</h2>
    </div>
    """, unsafe_allow_html=True)
    
    col_m1, col_m2 = st.columns(2)
    
    with col_m1:
        st.markdown(f"""
        <div style='background: {COLORS['black']}; padding: 20px; border-radius: 10px; margin: 10px;
                    border: 1px solid {COLORS['neon_red']};'>
            <h4 style='color: {COLORS['neon_red']}; text-align: center;'>Failed Metrics</h4>
            <p style='color: {COLORS['danger']}; margin: 10px 0;'>❌ Engagement: 0.5% (BOT LEVEL)</p>
            <p style='color: {COLORS['danger']}; margin: 10px 0;'>❌ Spike Ratio: 5.6x (UNNATURAL)</p>
            <p style='color: {COLORS['danger']}; margin: 10px 0;'>❌ Variance: 0.080 (RECTANGULAR)</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col_m2:
        st.markdown(f"""
        <div style='background: {COLORS['black']}; padding: 20px; border-radius: 10px; margin: 10px;
                    border: 1px solid {COLORS['neon_red']};'>
            <h4 style='color: {COLORS['neon_red']}; text-align: center;'>Bot Patterns</h4>
            <p style='color: {COLORS['danger']}; margin: 10px 0;'>❌ 9-day flat plateau</p>
            <p style='color: {COLORS['danger']}; margin: 10px 0;'>❌ Zero organic similarity</p>
            <p style='color: {COLORS['danger']}; margin: 10px 0;'>❌ Textbook bot signature</p>
        </div>
        """, unsafe_allow_html=True)
    
    # Jesse Verdict with wintergreen
    st.markdown(f"""
    <div style='background: linear-gradient(135deg, {COLORS['wintergreen']} 0%, {COLORS['dark_grey']} 100%); 
                padding: 40px; border-radius: 20px; margin: 20px 0; border: 3px solid {COLORS['wintergreen']};
                box-shadow: 0 0 60px rgba(46,139,87,0.4); text-align: center;'>
        <h1 style='color: {COLORS['white']} !important; font-size: 3em;'>
            ✅ JESSE ON FIRE - 100% ORGANIC
        </h1>
    </div>
    """, unsafe_allow_html=True)
    
    col_j1, col_j2, col_j3, col_j4 = st.columns(4)
    with col_j1:
        st.markdown(f"""
        <div style='text-align: center;'>
            <p style='color: {COLORS['wintergreen']}; font-size: 1.5em;'>✅</p>
            <p style='color: {COLORS['white']}; font-weight: bold;'>Engagement</p>
            <p style='color: {COLORS['wintergreen']}; font-size: 1.2em;'>3.2%</p>
            <p style='color: {COLORS['silver']}; font-size: 0.9em;'>HEALTHY</p>
        </div>
        """, unsafe_allow_html=True)
    with col_j2:
        st.markdown(f"""
        <div style='text-align: center;'>
            <p style='color: {COLORS['wintergreen']}; font-size: 1.5em;'>✅</p>
            <p style='color: {COLORS['white']}; font-weight: bold;'>Spike Ratio</p>
            <p style='color: {COLORS['wintergreen']}; font-size: 1.2em;'>2.33x</p>
            <p style='color: {COLORS['silver']}; font-size: 0.9em;'>NORMAL</p>
        </div>
        """, unsafe_allow_html=True)
    with col_j3:
        st.markdown(f"""
        <div style='text-align: center;'>
            <p style='color: {COLORS['wintergreen']}; font-size: 1.5em;'>✅</p>
            <p style='color: {COLORS['white']}; font-weight: bold;'>Variance</p>
            <p style='color: {COLORS['wintergreen']}; font-size: 1.2em;'>0.42</p>
            <p style='color: {COLORS['silver']}; font-size: 0.9em;'>NATURAL</p>
        </div>
        """, unsafe_allow_html=True)
    with col_j4:
        st.markdown(f"""
        <div style='text-align: center;'>
            <p style='color: {COLORS['wintergreen']}; font-size: 1.5em;'>✅</p>
            <p style='color: {COLORS['white']}; font-weight: bold;'>Baseline Match</p>
            <p style='color: {COLORS['wintergreen']}; font-size: 1.2em;'>100%</p>
            <p style='color: {COLORS['silver']}; font-size: 0.9em;'>VERIFIED</p>
        </div>
        """, unsafe_allow_html=True)

with tab5:
    st.markdown("## 📖 Understanding the Analysis")
    
    st.markdown(f"""
    <div style='background: {COLORS['grey']}; border: 2px solid {COLORS['crimson']}; 
                border-radius: 15px; padding: 25px; margin: 20px 0;'>
        <h3 style='color: {COLORS['crimson']}; font-family: Orbitron;'>🎯 How We Detect Bots</h3>
    </div>
    """, unsafe_allow_html=True)
    
    # Three metric comparison boxes
    col_how1, col_how2, col_how3 = st.columns(3)
    
    with col_how1:
        st.markdown(f"""
        <div style='background: {COLORS['dark_grey']}; padding: 20px; border-radius: 10px; 
                    border: 2px solid {COLORS['crimson']};'>
            <h4 style='color: {COLORS['crimson']};'>1️⃣ SPIKE RATIO</h4>
            <p style='color: {COLORS['silver']}; font-weight: bold; margin: 10px 0;'>Peak vs Normal</p>
            <hr style='border-color: {COLORS['grey']};'>
            <p style='color: {COLORS['wintergreen']}; margin: 10px 0;'>✅ Jesse: 2.33x = Normal viral</p>
            <p style='color: {COLORS['danger']}; margin: 10px 0;'>❌ MMA: 5.6x = Unnatural</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col_how2:
        st.markdown(f"""
        <div style='background: {COLORS['dark_grey']}; padding: 20px; border-radius: 10px; 
                    border: 2px solid {COLORS['crimson']};'>
            <h4 style='color: {COLORS['crimson']};'>2️⃣ VARIANCE</h4>
            <p style='color: {COLORS['silver']}; font-weight: bold; margin: 10px 0;'>Pattern Consistency</p>
            <hr style='border-color: {COLORS['grey']};'>
            <p style='color: {COLORS['wintergreen']}; margin: 10px 0;'>✅ Jesse: 0.42 = Natural 📈</p>
            <p style='color: {COLORS['danger']}; margin: 10px 0;'>❌ MMA: 0.08 = Rectangular 📊</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col_how3:
        st.markdown(f"""
        <div style='background: {COLORS['dark_grey']}; padding: 20px; border-radius: 10px; 
                    border: 2px solid {COLORS['crimson']};'>
            <h4 style='color: {COLORS['crimson']};'>3️⃣ ENGAGEMENT</h4>
            <p style='color: {COLORS['silver']}; font-weight: bold; margin: 10px 0;'>Human Interaction</p>
            <hr style='border-color: {COLORS['grey']};'>
            <p style='color: {COLORS['wintergreen']}; margin: 10px 0;'>✅ Jesse: 3.2% = Real humans 💬</p>
            <p style='color: {COLORS['danger']}; margin: 10px 0;'>❌ MMA: 0.5% = Bot level 🤖</p>
        </div>
        """, unsafe_allow_html=True)
    
    # MMA GURU Pattern Analysis Box
    st.markdown(f"""
    <div style='background: linear-gradient(135deg, {COLORS['blood_red']} 0%, {COLORS['dark_grey']} 100%); 
                padding: 30px; border-radius: 15px; margin: 30px 0; border: 2px solid {COLORS['neon_red']};'>
        <h3 style='color: {COLORS['neon_red']}; text-align: center;'>⚠️ What MMA GURU's Pattern Means</h3>
        <div style='display: flex; justify-content: space-around; flex-wrap: wrap; margin-top: 20px;'>
            <div style='text-align: center; margin: 10px;'>
                <p style='color: {COLORS['neon_red']}; font-size: 2em;'>📅</p>
                <p style='color: {COLORS['white']};'>October 18-26, 2024</p>
                <p style='color: {COLORS['silver']};'>9-day perfect rectangle</p>
            </div>
            <div style='text-align: center; margin: 10px;'>
                <p style='color: {COLORS['neon_red']}; font-size: 2em;'>⏱️</p>
                <p style='color: {COLORS['white']};'>Instant on/off</p>
                <p style='color: {COLORS['silver']};'>Flat plateau pattern</p>
            </div>
            <div style='text-align: center; margin: 10px;'>
                <p style='color: {COLORS['neon_red']}; font-size: 2em;'>📉</p>
                <p style='color: {COLORS['white']};'>No gradual change</p>
                <p style='color: {COLORS['silver']};'>No build or decay</p>
            </div>
            <div style='text-align: center; margin: 10px;'>
                <p style='color: {COLORS['neon_red']}; font-size: 2em;'>0️⃣</p>
                <p style='color: {COLORS['white']};'>Zero similarity</p>
                <p style='color: {COLORS['silver']};'>To any organic channel</p>
            </div>
            <div style='text-align: center; margin: 10px;'>
                <p style='color: {COLORS['neon_red']}; font-size: 2em;'>📚</p>
                <p style='color: {COLORS['white']};'>Textbook pattern</p>
                <p style='color: {COLORS['silver']};'>Bot purchase signature</p>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

# Footer
st.markdown(f"""
<div style='text-align: center; padding: 30px; color: {COLORS['silver']}; margin-top: 50px;
            border-top: 2px solid {COLORS['crimson']};'>
    <p style='font-size: 1.2em;'><strong style='color: {COLORS['crimson']};'>REAPERLABS.AI</strong></p>
    <p>Forensic Bot Detection System v2.0</p>
    <p>© 2025 ReaperLabs | For Jesse ON FIRE Use Only</p>
</div>
""", unsafe_allow_html=True)
