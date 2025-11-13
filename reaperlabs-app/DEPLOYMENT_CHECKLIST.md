# ✅ ReaperLabs Deployment Checklist

## Pre-Deployment Checklist

- [x] **netlify.toml** created with build configuration
- [x] **package.json** has all required scripts
- [x] **.env.example** updated with production URL
- [x] **lib/openrouter.ts** uses environment variables properly
- [x] **.gitignore** prevents committing sensitive files
- [x] **DEPLOY.md** has deployment instructions
- [ ] **Local testing** - App runs without errors
- [ ] **Git repository** - Code is in GitHub

---

## Git Commands to Push

```bash
# Navigate to project directory
cd C:\Users\user\Desktop\fire-hq\reaperlabs-app

# Check git status
git status

# Add all files
git add .

# Commit with message
git commit -m "Add Netlify deployment configuration - ReaperLabs ready for production"

# Push to GitHub
git push origin main
```

---

## Netlify Manual Setup (5 minutes)

### 1. Login to Netlify
Go to: https://app.netlify.com

### 2. Import Project
- Click **"Import an existing project"**
- Choose **"Deploy with GitHub"**
- Select repo: **reaperlabsai-analytics**

### 3. Build Settings (Auto-detected)
```
Build command: npm run build
Publish directory: .next
```

### 4. Environment Variables
Add in **Site settings → Environment variables**:

```
OPENROUTER_API_KEY=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
NEXT_PUBLIC_APP_URL=https://reaperlabsai.netlify.app
```

### 5. Deploy!
Click **"Deploy site"**

---

## Post-Deployment Testing

### Test Checklist
- [ ] Site loads at Netlify URL
- [ ] Upload CSV file works
- [ ] AI analysis completes successfully
- [ ] Chat interface responds
- [ ] All styling appears correct (black/crimson theme)
- [ ] Mobile responsive design works

### If Issues Occur

**API 500 Error**
- Check environment variables in Netlify
- View deploy logs for errors
- Verify API key is correct

**Build Fails**
- Check Netlify deploy logs
- Verify all dependencies in package.json
- Check netlify.toml syntax

**404 Errors**
- Verify redirects in netlify.toml
- Check publish directory is `.next`

---

## Your Live URLs

**Netlify URL**: https://[your-site-name].netlify.app  
**Custom Domain**: Add reaperlabs.io in domain settings (future)

---

## Next Steps After Deployment

1. ✅ Test all features on live site
2. 📱 Test on mobile devices
3. 🔗 Set up custom domain (reaperlabs.io)
4. 📊 Enable Netlify Analytics
5. 💳 Add Stripe for payments
6. 🚀 Launch marketing campaign
7. 💰 Scale to $500M valuation!

---

## Important Notes

⚠️ **Never commit** `.env` file to GitHub  
⚠️ **Always test locally** before pushing  
⚠️ **Check deploy logs** if build fails  
⚠️ **Update NEXT_PUBLIC_APP_URL** after getting Netlify URL  

---

**Status**: Ready for deployment! ⚔️

Deploy command:
```bash
git add . && git commit -m "Deploy ReaperLabs to Netlify" && git push origin main
```
