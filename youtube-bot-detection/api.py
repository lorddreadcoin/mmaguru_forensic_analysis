"""
FastAPI Endpoint for Real-time YouTube Bot Detection
RESTful API for analyzing YouTube channels on-demand
"""

from fastapi import FastAPI, HTTPException, File, UploadFile, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import pandas as pd
import numpy as np
from datetime import datetime
import io
import json
import asyncio
from bot_detection_engine import BotDetectionEngine
from data_processor import DataProcessor, ComparativeAnalyzer

# Initialize FastAPI app
app = FastAPI(
    title="YouTube Bot Detection API",
    description="Advanced analytics API for detecting bot manipulation in YouTube channels",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response models
class ChannelAnalysisRequest(BaseModel):
    channel_name: str
    csv_data: Optional[str] = None  # Base64 encoded CSV
    spike_threshold: float = 3.0
    z_threshold: float = 3.0

class QuickAnalysisRequest(BaseModel):
    channel_name: str
    recent_views: List[int]
    recent_subscribers: List[int]
    dates: List[str]

class AnalysisResponse(BaseModel):
    channel: str
    authenticity_score: float
    rating: str
    total_spikes: int
    total_anomalies: int
    estimated_bot_cost: Dict[str, float]
    key_findings: List[str]
    timestamp: str

class ComparativeAnalysisRequest(BaseModel):
    channels: List[ChannelAnalysisRequest]
    find_synchronized_events: bool = True

# In-memory cache for results
analysis_cache = {}

@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "name": "YouTube Bot Detection API",
        "version": "1.0.0",
        "endpoints": [
            "/analyze",
            "/analyze/quick",
            "/analyze/compare",
            "/analyze/upload",
            "/health",
            "/docs"
        ]
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_channel(request: ChannelAnalysisRequest):
    """
    Analyze a single YouTube channel for bot activity
    """
    try:
        # Check cache
        cache_key = f"{request.channel_name}_{request.spike_threshold}_{request.z_threshold}"
        if cache_key in analysis_cache:
            cached = analysis_cache[cache_key]
            if (datetime.now() - cached['timestamp']).seconds < 3600:  # 1 hour cache
                return cached['response']
        
        # Initialize detector
        detector = BotDetectionEngine(request.channel_name)
        
        # Load CSV data if provided
        if request.csv_data:
            import base64
            csv_bytes = base64.b64decode(request.csv_data)
            csv_str = csv_bytes.decode('utf-8')
            df = pd.read_csv(io.StringIO(csv_str))
            detector.data = df
            detector._identify_metrics()
        else:
            return JSONResponse(
                status_code=400,
                content={"error": "CSV data required for analysis"}
            )
        
        # Run analysis with custom thresholds
        detector.spike_threshold = request.spike_threshold
        detector.z_threshold = request.z_threshold
        results = detector.run_full_analysis()
        
        # Prepare response
        response = AnalysisResponse(
            channel=request.channel_name,
            authenticity_score=results['authenticity']['score'],
            rating=results['authenticity']['rating'],
            total_spikes=len(results.get('spikes', [])),
            total_anomalies=len(results.get('anomalies', [])),
            estimated_bot_cost={
                'min': results['cost_estimate']['estimated_cost_min'],
                'max': results['cost_estimate']['estimated_cost_max'],
                'average': results['cost_estimate']['average_cost']
            },
            key_findings=results['authenticity']['reasons'][:5],
            timestamp=datetime.now().isoformat()
        )
        
        # Cache result
        analysis_cache[cache_key] = {
            'response': response,
            'timestamp': datetime.now()
        }
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/quick")
async def quick_analysis(request: QuickAnalysisRequest):
    """
    Perform quick bot detection on recent data points
    """
    try:
        # Create DataFrame from provided data
        df = pd.DataFrame({
            'Date': pd.to_datetime(request.dates),
            'Views': request.recent_views,
            'Subscribers': request.recent_subscribers
        })
        
        # Initialize detector
        detector = BotDetectionEngine(request.channel_name)
        detector.data = df
        detector._identify_metrics()
        
        # Quick analysis
        spikes = []
        for col in ['Views', 'Subscribers']:
            spikes.extend(detector.detect_spikes(col))
        
        anomalies = []
        for col in ['Views', 'Subscribers']:
            anomalies.extend(detector.detect_statistical_anomalies(col))
        
        # Calculate quick authenticity score
        score = 100
        if len(spikes) > 0:
            score -= min(len(spikes) * 10, 50)
        if len(anomalies) > 0:
            score -= min(len(anomalies) * 5, 30)
        
        rating = "AUTHENTIC" if score >= 70 else "SUSPICIOUS" if score >= 40 else "LIKELY_BOTTED"
        
        return {
            "channel": request.channel_name,
            "quick_score": score,
            "rating": rating,
            "spikes_detected": len(spikes),
            "anomalies_detected": len(anomalies),
            "analysis_type": "quick",
            "data_points": len(df),
            "recommendation": "Full analysis recommended" if score < 70 else "Channel appears authentic"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/upload")
async def analyze_uploaded_file(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    channel_name: str = "Unknown Channel",
    spike_threshold: float = 3.0
):
    """
    Analyze an uploaded CSV file
    """
    try:
        # Read uploaded file
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        
        # Initialize detector
        detector = BotDetectionEngine(channel_name)
        detector.data = df
        detector._identify_metrics()
        
        # Run analysis
        results = detector.run_full_analysis()
        
        # Prepare detailed response
        return {
            "channel": channel_name,
            "filename": file.filename,
            "rows_analyzed": len(df),
            "authenticity_score": results['authenticity']['score'],
            "rating": results['authenticity']['rating'],
            "total_spikes": len(results.get('spikes', [])),
            "total_drops": len(results.get('drops', [])),
            "total_anomalies": len(results.get('anomalies', [])),
            "estimated_bot_cost": results['cost_estimate'],
            "engagement_metrics": results.get('engagement', {}),
            "key_findings": results['authenticity']['reasons'],
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.post("/analyze/compare")
async def compare_channels(request: ComparativeAnalysisRequest):
    """
    Compare multiple channels for synchronized bot patterns
    """
    try:
        comparator = ComparativeAnalyzer()
        channel_results = {}
        
        # Analyze each channel
        for channel_req in request.channels:
            detector = BotDetectionEngine(channel_req.channel_name)
            
            if channel_req.csv_data:
                import base64
                csv_bytes = base64.b64decode(channel_req.csv_data)
                csv_str = csv_bytes.decode('utf-8')
                df = pd.read_csv(io.StringIO(csv_str))
                detector.data = df
                detector._identify_metrics()
                
                results = detector.run_full_analysis()
                channel_results[channel_req.channel_name] = results
                comparator.add_channel(channel_req.channel_name, results)
        
        # Comparative analysis
        comparison = comparator.generate_comparative_report()
        
        return {
            "channels_analyzed": list(channel_results.keys()),
            "individual_scores": {
                name: res['authenticity']['score'] 
                for name, res in channel_results.items()
            },
            "synchronized_events": len(comparison['synchronized_spikes']),
            "aggregate_stats": comparison['aggregate_stats'],
            "key_insights": comparison['key_insights'],
            "similar_bot_patterns": len(comparison['bot_signatures']['similar_patterns']),
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/analyze/cache/clear")
async def clear_cache():
    """
    Clear the analysis cache
    """
    global analysis_cache
    cache_size = len(analysis_cache)
    analysis_cache = {}
    
    return {
        "message": "Cache cleared successfully",
        "items_cleared": cache_size,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/analyze/thresholds")
async def get_threshold_recommendations():
    """
    Get recommended threshold values for different analysis types
    """
    return {
        "spike_detection": {
            "conservative": 5.0,
            "moderate": 3.0,
            "aggressive": 2.0,
            "description": "Lower values detect more spikes"
        },
        "statistical_anomaly": {
            "conservative": 4.0,
            "moderate": 3.0,
            "aggressive": 2.0,
            "description": "Z-score threshold for anomaly detection"
        },
        "cliff_drop": {
            "conservative": 0.7,
            "moderate": 0.5,
            "aggressive": 0.3,
            "description": "Percentage drop to flag as suspicious"
        }
    }

# WebSocket endpoint for real-time analysis
from fastapi import WebSocket
import json

@app.websocket("/ws/analyze")
async def websocket_analyze(websocket: WebSocket):
    """
    WebSocket endpoint for real-time streaming analysis
    """
    await websocket.accept()
    
    try:
        while True:
            # Receive data
            data = await websocket.receive_text()
            request = json.loads(data)
            
            # Process analysis
            channel_name = request.get('channel_name', 'Unknown')
            csv_data = request.get('csv_data')
            
            if csv_data:
                # Initialize detector
                detector = BotDetectionEngine(channel_name)
                
                # Decode CSV
                import base64
                csv_bytes = base64.b64decode(csv_data)
                csv_str = csv_bytes.decode('utf-8')
                df = pd.read_csv(io.StringIO(csv_str))
                detector.data = df
                detector._identify_metrics()
                
                # Stream analysis updates
                await websocket.send_json({
                    "status": "analyzing",
                    "progress": 10,
                    "message": "Loading data..."
                })
                
                # Detect spikes
                spikes = []
                for col in detector.view_cols + detector.sub_cols:
                    spikes.extend(detector.detect_spikes(col))
                
                await websocket.send_json({
                    "status": "analyzing",
                    "progress": 40,
                    "message": f"Found {len(spikes)} suspicious spikes"
                })
                
                # Detect anomalies
                anomalies = []
                for col in detector.view_cols + detector.sub_cols:
                    anomalies.extend(detector.detect_statistical_anomalies(col))
                
                await websocket.send_json({
                    "status": "analyzing",
                    "progress": 70,
                    "message": f"Detected {len(anomalies)} statistical anomalies"
                })
                
                # Final analysis
                results = detector.generate_authenticity_score()
                
                await websocket.send_json({
                    "status": "complete",
                    "progress": 100,
                    "results": {
                        "channel": channel_name,
                        "authenticity_score": results['score'],
                        "rating": results['rating'],
                        "total_spikes": len(spikes),
                        "total_anomalies": len(anomalies),
                        "key_findings": results['reasons'][:5]
                    }
                })
            else:
                await websocket.send_json({
                    "status": "error",
                    "message": "No CSV data provided"
                })
                
    except Exception as e:
        await websocket.send_json({
            "status": "error",
            "message": str(e)
        })
    finally:
        await websocket.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
