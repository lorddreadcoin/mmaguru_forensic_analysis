# 🔒 Secret Forensic Dashboard

## What This Is
A private, static HTML dashboard showing forensic bot detection analysis for Jesse ON FIRE vs THE MMA GURU.

## Key Features
- **100% Static**: No server required (perfect for Netlify)
- **Self-Contained**: All data embedded (no API calls)
- **Secret**: Not indexed by search engines
- **Separate**: Completely independent from your main site

## 🚀 Quick Deploy (30 seconds)

### Option 1: PowerShell Script (Windows)
```powershell
cd C:\Users\user\Desktop\fire-hq\youtube-bot-detection\static-dashboard
.\deploy.ps1
```

### Option 2: Manual via Netlify CLI
```bash
cd C:\Users\user\Desktop\fire-hq\youtube-bot-detection\static-dashboard
netlify deploy --prod --dir=.
```
Choose "Create & configure a new site" when prompted.

### Option 3: Drag & Drop
1. ZIP these files
2. Go to https://app.netlify.com
3. Drag ZIP to "Deploy manually" area

## 📁 Files
- `index.html` - Main dashboard
- `dashboard.js` - Chart functionality
- `netlify.toml` - Deploy configuration
- `robots-deny.txt` - Prevents indexing
- `404.html` - Error page

## 🔐 Security
- No connection to main site
- Obscure URL only you know
- Robots blocked from indexing
- No public links to it

## ⚠️ Important
This deploys to a **NEW** Netlify site, NOT your existing reaperlabs-analytics.netlify.app.
Your main site remains completely unchanged and unaffected.

## 🎯 Your Sites After Deployment
1. **Main Site**: `reaperlabs-analytics.netlify.app` (unchanged)
2. **Secret Dashboard**: `[your-chosen-name].netlify.app` (new, private)

These are two completely separate websites with no connection.
