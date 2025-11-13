# 🚀 ReaperLabs Netlify Deployment Guide

## Quick Deploy to Netlify

### Prerequisites
- GitHub account
- Netlify account (free tier)
- Code pushed to: https://github.com/lorddreadcoin/reaperlabsai-analytics.git

### Step-by-Step Deployment

#### 1. Push Your Code to GitHub
```bash
git add .
git commit -m "Add Netlify deployment configuration"
git push origin main
```

#### 2. Import Project to Netlify
1. Go to https://app.netlify.com
2. Click **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. Select your repository: **reaperlabsai-analytics**

#### 3. Configure Build Settings
Netlify will auto-detect settings from `netlify.toml`:
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Functions directory**: `.netlify/functions`

#### 4. Add Environment Variables
In Netlify dashboard, go to **Site settings → Environment variables**:

Add the following:
```
Key: OPENROUTER_API_KEY
Value: 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

Key: NEXT_PUBLIC_APP_URL
Value: https://[your-site-name].netlify.app
```

#### 5. Deploy Site
Click **"Deploy site"**

Your site will be live in 2-3 minutes! 🎉

---

## 🌐 Your Live Site URLs

### Temporary URL
`https://[random-name].netlify.app`

### Custom Domain (Optional)
You can add **reaperlabs.io** later in Netlify's Domain settings.

---

## ⚡ Why Netlify?

✅ **No Server Needed** - Netlify handles everything  
✅ **Auto-Deploys** - Push to GitHub = site updates automatically  
✅ **Free Tier** - Perfect for MVP testing  
✅ **Global CDN** - Fast loading worldwide  
✅ **SSL Included** - Secure HTTPS by default  
✅ **Serverless Functions** - API routes work out of the box  

---

## 🛠️ Post-Deployment

### Update Your Site
```bash
git add .
git commit -m "Update features"
git push origin main
```
Netlify will automatically rebuild and deploy!

### Check Build Logs
If something goes wrong:
1. Go to Netlify dashboard
2. Click on your site
3. Go to **Deploys** tab
4. Click on the failed deploy to see logs

### Common Issues

**Issue**: API not working  
**Fix**: Check environment variables are set in Netlify dashboard

**Issue**: 404 errors  
**Fix**: Check `netlify.toml` redirects are configured correctly

**Issue**: Build fails  
**Fix**: Check build logs for missing dependencies

---

## 📱 Testing Your Live Site

Once deployed:
1. Visit your Netlify URL
2. Upload a YouTube CSV file
3. Test the AI analysis
4. Try the chat interface

---

## 🎯 Next Steps

1. ✅ Deploy to Netlify
2. 🔗 Add custom domain (reaperlabs.io)
3. 📊 Set up analytics (Netlify Analytics)
4. 💳 Add Stripe payments (future)
5. 📈 Scale to $500M valuation!

---

## 🔐 Security Notes

- API key is stored securely in Netlify environment variables
- Never commit `.env` files to GitHub
- Use `.env.example` as template only
- All traffic is HTTPS by default

---

## 📞 Support

**Repository**: https://github.com/lorddreadcoin/reaperlabsai-analytics  
**Issues**: Create a GitHub issue  
**Netlify Docs**: https://docs.netlify.com

---

**Ready to protect creators from platform death! ⚔️**
