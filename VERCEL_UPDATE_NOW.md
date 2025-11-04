# 🚨 URGENT: Update Vercel Environment Variables

## ⚡ DO THIS NOW (2 minutes)

### **Step 1: Go to Vercel Dashboard**
https://vercel.com/dashboard

### **Step 2: Find Your Project**
Click on **jesseonfire** project

### **Step 3: Update Environment Variables**
1. Click **Settings** → **Environment Variables**

2. **Find or Add:** `DISCORD_WEBHOOK_URL`
   - Value: `https://discord.com/api/webhooks/1433975129016111124/IvXYomsREwT_1Ck8v7R5F0U6x6LsQrLVeht0iGTntuhJifMFrlHVmaUTWwtdV52qD0CP`
   - Apply to: **Production**, **Preview**, **Development** (check all 3)

3. **Find or Add:** `DISCORD_INVITE_URL`
   - Value: `https://discord.gg/9WpPC5GS`
   - Apply to: **Production**, **Preview**, **Development** (check all 3)

4. **Verify:** `RESEND_API_KEY` 
   - Should be: `re_gJyqcykS_GyEq4mVzG9nTmuvQEa4M4vVi`
   - Apply to: **Production**, **Preview**, **Development** (check all 3)

### **Step 4: Redeploy**
1. Click **Deployments** tab
2. Click on the **latest deployment**
3. Click **"Redeploy"** button (three dots menu)
4. Wait 2-3 minutes for build

---

## ✅ After Redeploy - Test It

### **Test 1: Check Webhook Config**
Visit: https://jesseonfire.vercel.app/api/webhook-test

Should show:
```json
{
  "webhookConfigured": true,
  "inviteUrl": "https://discord.gg/9WpPC5GS"
}
```

### **Test 2: Send Test Webhook**
Send POST request to: https://jesseonfire.vercel.app/api/webhook-test

Or use this PowerShell command:
```powershell
Invoke-WebRequest -Uri "https://jesseonfire.vercel.app/api/webhook-test" -Method POST
```

**Check Discord `#youtube-members` channel** - you should see a test message!

### **Test 3: Full Form Submission**
1. Go to: https://jesseonfire.vercel.app/youtube-members
2. Fill out form with test data
3. Submit
4. **Check Discord `#youtube-members` channel** for:
   - Message 1: "FUNCTION CALLED - Processing verification..."
   - Message 2: Full embed with user details

---

## 🎯 Summary of Changes

**Discord Server:** New server at discord.gg/9WpPC5GS

**Webhook Channel:** `#youtube-members` (ID: 1433975129016111124)

**What Gets Logged:**
- Every form submission
- User's YouTube username
- User's Discord username
- User's email
- Timestamp

**Email:** Sent via Resend with Discord invite link

---

## 🔥 Current Environment Variables Needed:

```env
# YouTube API
YOUTUBE_API_KEY=AIzaSyBEzp4kCZz4W79UA5ZAMcWyJ2eJdmcBjG0
YOUTUBE_CHANNEL_ID=UCL1ULuUKdktFDpe66_A3H2A
NEXT_PUBLIC_YOUTUBE_API_KEY=AIzaSyBEzp4kCZz4W79UA5ZAMcWyJ2eJdmcBjG0

# Discord Integration
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/1433975129016111124/IvXYomsREwT_1Ck8v7R5F0U6x6LsQrLVeht0iGTntuhJifMFrlHVmaUTWwtdV52qD0CP
DISCORD_INVITE_URL=https://discord.gg/9WpPC5GS

# Email Service
RESEND_API_KEY=re_gJyqcykS_GyEq4mVzG9nTmuvQEa4M4vVi
```

---

**Status:** ✅ Code deployed to GitHub, waiting for Vercel environment update + redeploy
