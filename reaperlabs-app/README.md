# 🔥 ReaperLabs YouTube Analytics AI

A ChatGPT-like interface for YouTube channel analytics. Upload your CSV exports from YouTube Studio and get AI-powered growth insights instantly.

## ✨ Features

- **Simple Upload**: Drag & drop YouTube CSV files
- **AI Analysis**: Powered by GLM 4.5 Air (FREE model)
- **Chat Interface**: Ask questions about your channel
- **Instant Insights**: Get strengths, problems, and action items
- **Beautiful UI**: Clean, modern ChatGPT-like experience

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. API Key Setup

The `.env` file already contains your OpenRouter API key for GLM 4.5 Air (FREE tier).

### 3. Run the Development Server

```bash
npm run dev
```

### 4. Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 How to Use

1. **Upload CSV Files**: Drag your YouTube Studio CSV exports (Table data.csv, Totals.csv)
2. **Enter Email**: For tracking your analyses
3. **Click Analyze**: Get instant AI insights
4. **Ask Questions**: Use the chat interface to dive deeper

## 📁 Project Structure

```
reaperlabs-app/
├── app/
│   ├── api/
│   │   ├── analyze/      # CSV upload & analysis endpoint
│   │   └── ask/          # Chat Q&A endpoint
│   ├── page.tsx          # Main app page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── UploadSection.tsx     # File upload UI
│   ├── ChatInterface.tsx     # Chat component
│   └── InsightsDisplay.tsx   # Results display
├── lib/
│   ├── openrouter.ts     # GLM 4.5 Air integration
│   ├── csv-parser.ts     # YouTube CSV parser
│   └── db/
│       └── mock.ts       # Mock database (no PostgreSQL needed)
└── package.json
```

## 🤖 AI Model

Using **Z.AI GLM 4.5 Air** via OpenRouter:
- **Cost**: FREE (no charges!)
- **Context**: 131K tokens (handles large CSVs)
- **Features**: Agent-centric, reasoning mode

## 📝 Example Questions

- "How do I get to 1M subscribers?"
- "What videos should I make next?"
- "Why are my views dropping?"
- "What's my best revenue opportunity?"
- "How can I improve my CTR?"

## 🛠️ Tech Stack

- **Next.js 14**: React framework
- **TypeScript**: Type safety
- **OpenRouter API**: LLM integration
- **PapaParse**: CSV parsing
- **CSS Modules**: Component styling

## 📦 Deployment

### Deploy to Netlify (Recommended)

**Quick Deploy:**
1. Push code to GitHub
2. Go to https://app.netlify.com
3. Import project from GitHub
4. Add environment variable: `OPENROUTER_API_KEY`
5. Deploy!

**Detailed Instructions**: See [DEPLOY.md](./DEPLOY.md)

### Deploy to Vercel (Alternative)

1. Push to GitHub
2. Import to Vercel
3. Add environment variable: `OPENROUTER_API_KEY`
4. Deploy!

### Manual Deployment

```bash
npm run build
npm start
```

---

## 🚀 Live Demo

**Coming Soon**: https://reaperlabsai.netlify.app

## 🔐 Environment Variables

```env
OPENROUTER_API_KEY=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
```

## 💡 Tips

- Upload multiple CSV files for comprehensive analysis
- Ask specific questions for better insights
- Use the example questions as starting points
- Export your insights for future reference

## 🚨 Troubleshooting

### "Module not found" errors
Run `npm install` to install all dependencies

### API errors
Check that your OpenRouter API key is valid in `.env`

### Upload fails
Ensure you're uploading valid YouTube Studio CSV exports

## 📄 License

MIT

## 🤝 Partnership

Built for Jesse ON FIRE YouTube channel growth.
Powered by ReaperLabs.io

---

**Ready to grow your YouTube channel? Start analyzing!** 🚀
