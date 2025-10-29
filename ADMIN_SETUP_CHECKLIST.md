# 🔥 Admin Setup Checklist - Jesse ON FIRE Discord

## 🎯 **Discord Server Setup (15 minutes)**

### **Step 1: Enable YouTube Integration**
1. **Right-click your Discord server name** → Server Settings
2. **Click "Integrations"** in left sidebar
3. **Look for "YouTube"** in available integrations
4. **Click "Add" or "Connect"** next to YouTube
5. **Sign in with Jesse's YouTube account** (the channel owner account)
6. **Select "Jesse ON FIRE" channel** from dropdown
7. **Click "Authorize"**

### **Step 2: Configure Membership Sync**
1. **In YouTube integration settings**:
   - ✅ **Enable "Sync YouTube memberships"**
   - ✅ **Set sync frequency**: Every 4 hours (recommended)
   
2. **Create roles for each tier**:
   ```
   Inner Circle ($4.99) → Role: "Jesse's Inner Circle" (Orange #FF5A1F)
   Best Friends ($9.99) → Role: "Jesse's Best Friends" (Purple #8B5CF6) 
   You Love Me ($24.99) → Role: "You Love Me" (Gold #F59E0B)
   ```

3. **Set role permissions**:
   - Access to member-only channels
   - Special chat permissions
   - Custom emoji usage

### **Step 3: Create Monitoring Webhook**
1. **Create admin channel**: `#youtube-verifications` (admin-only)
2. **Right-click channel** → Integrations → Webhooks
3. **Create New Webhook**:
   - **Name**: "YouTube Bridge Monitor"
   - **Avatar**: Jesse ON FIRE logo
4. **Copy webhook URL** → Save for environment variables

### **Step 4: Test Integration**
1. **Have a member connect YouTube** (like yourself)
2. **Check Server Settings** → Members → Search for the user
3. **Verify role appears** next to their name
4. **Check webhook channel** for notifications

---

## 🔧 **Environment Variables Setup**

Add these to your Vercel deployment:

```env
# Discord Configuration
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_TOKEN
DISCORD_INVITE_URL=https://discord.gg/YOUR_PERMANENT_INVITE

# Email Configuration (Optional but recommended)
RESEND_API_KEY=your_resend_api_key

# YouTube Configuration (for stats, not required for bridge)
YOUTUBE_API_KEY=your_youtube_api_key
YOUTUBE_CHANNEL_ID=UCL1ULuUKdktFDpe66_A3H2A
```

---

## 📊 **Admin Monitoring Dashboard**

### **What to Watch For:**
1. **Webhook notifications** in `#youtube-verifications`
2. **Role assignment success/failures**
3. **Member count growth**
4. **Support requests** from users having issues

### **Daily Admin Tasks (5 minutes):**
- ✅ Check webhook channel for new verifications
- ✅ Respond to any failed verifications
- ✅ Monitor member activity in member-only channels

### **Weekly Admin Tasks (15 minutes):**
- ✅ Review member growth metrics
- ✅ Check for inactive members
- ✅ Update role permissions if needed
- ✅ Review and respond to support emails

---

## 🚨 **Troubleshooting Common Issues**

### **"Role not assigned automatically"**
1. **Check YouTube integration** is enabled
2. **Verify user connected YouTube** in their Discord settings
3. **Check role hierarchy** (bot role must be above member roles)
4. **Manual assignment** as backup

### **"Webhook not working"**
1. **Test webhook URL** with the script: `node scripts/test-discord-webhook.js`
2. **Check webhook permissions** in Discord
3. **Verify environment variables** in Vercel

### **"Email not sending"**
1. **Check Resend API key** is valid
2. **Verify domain setup** (if using custom domain)
3. **Check spam folders**
4. **Fallback**: Manual Discord invite

---

## 🎯 **Success Metrics to Track**

### **Conversion Funnel:**
1. **Website form submissions** (webhook logs)
2. **Email opens** (if using Resend analytics)
3. **Discord joins** (server insights)
4. **YouTube connections** (role assignments)
5. **Active members** (engagement in channels)

### **Key Performance Indicators:**
- **Form → Discord conversion rate** (target: >80%)
- **Discord → Role assignment rate** (target: >95%)
- **Member retention** (30-day active rate)
- **Support ticket volume** (lower is better)

---

## 🔥 **Pro Tips for Admins**

### **Optimize User Experience:**
1. **Pin instructions** in general channel
2. **Create FAQ channel** for common questions
3. **Set up auto-responses** for common issues
4. **Regular member appreciation** posts

### **Automate Where Possible:**
1. **Welcome messages** for new members
2. **Role-based channel access**
3. **Automated moderation** rules
4. **Member milestone celebrations**

### **Scale Preparation:**
1. **Document all processes** for other admins
2. **Create mod training** materials
3. **Set up backup systems** for critical functions
4. **Plan for high-volume periods** (new video releases, etc.)
