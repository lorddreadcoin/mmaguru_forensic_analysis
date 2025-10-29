# 🔥 YouTube Bridge Testing Guide

## 🎯 **Answer: Do You Need Additional Webhooks?**

**NO** - Your current system is optimal! Here's why:

### **Current Setup (Recommended)**
✅ **Discord Native YouTube Integration** - Discord handles role management automatically  
✅ **Notification Webhook** - Logs verification requests to `#youtube-verifications`  
✅ **Email System** - Sends instructions via Resend API  
✅ **Automatic Role Assignment** - Discord syncs with YouTube memberships  

### **What You DON'T Need**
❌ Custom Discord bot webhooks for role management  
❌ YouTube API webhooks (Discord handles this)  
❌ Complex authentication systems  

---

## 🚀 **Quick Start Testing**

### **1. Install Dependencies**
```bash
npm install
```

### **2. Set Environment Variables**
Create `.env.local`:
```env
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN
DISCORD_INVITE_URL=https://discord.gg/YOUR_INVITE_CODE
RESEND_API_KEY=your_resend_api_key
```

### **3. Test Discord Webhook (Immediate)**
```bash
# Test all webhook scenarios
node scripts/test-discord-webhook.js

# Test single webhook
node scripts/test-discord-webhook.js single @TestUser testuser#1234 test@example.com

# Show help
node scripts/test-discord-webhook.js help
```

### **4. Test API Endpoints (After npm install)**
```bash
# Test YouTube verification API
npm run test:youtube-bridge

# Test all components
npm test

# Watch mode for development
npm run test:watch
```

---

## 📋 **Testing Checklist**

### **Phase 1: Webhook Testing** ✅
- [ ] Discord webhook receives notifications
- [ ] All 3 membership tiers work ($4.99, $9.99, $24.99)
- [ ] Error handling works (failed webhooks)
- [ ] Special characters in usernames handled

### **Phase 2: API Testing**
- [ ] `/api/youtube-verify` accepts valid submissions
- [ ] Rejects invalid/missing data
- [ ] Email sending works (Resend API)
- [ ] Discord logging works

### **Phase 3: Integration Testing**
- [ ] Full flow: Form → Email → Discord → Role Assignment
- [ ] YouTube connection in Discord works
- [ ] Role removal on membership cancellation

### **Phase 4: Production Testing**
- [ ] Real Discord server setup
- [ ] Real YouTube channel connection
- [ ] Live member testing

---

## 🔧 **Your 3 YouTube Tiers**

Based on your screenshots, here are your exact tiers:

### **1. Jesse's Inner Circle - $4.99/month**
- Loyalty badges in comments & live chat
- Custom emoji access
- 5 additional MMA videos per week
- **Discord Role**: `Inner Circle`

### **2. Jesse's Best Friends - $9.99/month**
- Everything from Inner Circle
- Members-only live streams (weekly)
- Exclusive green screen GIFs
- **Discord Role**: `Best Friend`

### **3. You Love Me & You Know It - $24.99/month**
- Everything from previous tiers
- Monthly shout-outs on channel
- Your name called out publicly
- **Discord Role**: `Elite Supporter`

---

## 🎮 **Discord Setup Steps**

### **Step 1: Enable YouTube Integration**
1. Discord Server Settings → Integrations
2. Add YouTube Integration
3. Connect Jesse's YouTube account
4. Enable "Sync YouTube memberships"
5. Create roles for each tier

### **Step 2: Create Webhook**
1. Create `#youtube-verifications` channel (admin only)
2. Right-click channel → Integrations → Webhooks
3. New Webhook → Name: "YouTube Bridge"
4. Copy webhook URL to environment variables

### **Step 3: Test Everything**
```bash
node scripts/test-discord-webhook.js
```

---

## 🚨 **Troubleshooting**

### **Webhook Not Working?**
- Check webhook URL format: `https://discord.com/api/webhooks/ID/TOKEN`
- Verify channel permissions
- Test with the script: `node scripts/test-discord-webhook.js`

### **Roles Not Assigning?**
- Ensure YouTube integration is enabled in Discord
- Check that users connect YouTube in Discord Settings → Connections
- Verify role hierarchy (bot role above member roles)

### **Email Not Sending?**
- Check Resend API key
- Verify domain setup (if using custom domain)
- Check spam folder

### **TypeScript Errors in Tests?**
```bash
# Install dependencies to fix Jest types
npm install
```

---

## 📊 **Monitoring & Analytics**

### **Daily Checks**
- Monitor `#youtube-verifications` for new members
- Check for failed verifications
- Respond to support emails

### **Weekly Reviews**
- Member growth metrics
- Conversion rates (form submissions → active members)
- Failed verification analysis

### **Monthly Audits**
- Role accuracy check
- Inactive member cleanup
- System performance review

---

## 🎯 **Next Steps**

1. **Run webhook test**: `node scripts/test-discord-webhook.js`
2. **Set up Discord server** (follow DISCORD_SETUP_GUIDE.md)
3. **Install dependencies**: `npm install`
4. **Run full test suite**: `npm test`
5. **Deploy to production** with real environment variables

Your current system is **production-ready** and follows Discord's best practices! 🔥
