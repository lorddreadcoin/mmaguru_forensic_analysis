# 🚀 GoDaddy DNS Setup for Email (jesseonfire.com)

## ✅ Quick Checklist

- [ ] Log into GoDaddy
- [ ] Navigate to jesseonfire.com DNS settings
- [ ] Add all 5 DNS records (see below)
- [ ] Wait 10-30 minutes
- [ ] Verify in Resend
- [ ] Test email sending

---

## 📋 DNS Records to Add in GoDaddy

### Record 1: DKIM (Domain Verification)
```
Type: TXT
Name: resend._domainkey
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC4UqbW4FUqCaYBtXOZrlmouCLYgRzEuTrAmdJM1m1FR9Anj85THGcoUPaZSPcpRZDI49SDstcALlrxqBShC0L8ycWKqjUcq0eVXBh3GvgQI/4mHqPrqJzch3vNDr91FjS1P87/+knH0CpH1dgmrIQ2mDUH75BbRJm/rXkfgZd8uQIDAQAB
TTL: Auto (or 1 Hour)
```

### Record 2: MX for Sending
```
Type: MX
Name: send
Points to: feedback-smtp.us-east-1.amazonses.com
Priority: 10
TTL: Auto (or 1 Hour)
```

### Record 3: SPF
```
Type: TXT
Name: send
Value: v=spf1 include:amazonses.com ~all
TTL: Auto (or 1 Hour)
```

### Record 4: DMARC (Optional but Recommended)
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none;
TTL: Auto (or 1 Hour)
```

### Record 5: MX for Receiving
```
Type: MX
Name: @
Points to: inbound-smtp.us-east-1.amazonaws.com
Priority: 10
TTL: Auto (or 1 Hour)
```

---

## 🔧 GoDaddy Step-by-Step

### 1. Access DNS Settings
1. Go to: https://godaddy.com
2. Sign in
3. Click **"My Products"**
4. Find **jesseonfire.com**
5. Click **"DNS"** button

### 2. Add Each Record
For each record above:
1. Click **"Add"** button
2. Select the **Type** (TXT or MX)
3. Enter the **Name** exactly as shown
4. Enter the **Value/Points to** exactly as shown
5. Set **Priority** if MX record
6. Set **TTL** to Auto or 1 Hour
7. Click **"Save"**

### 3. Common GoDaddy Notes
- **Name field:** GoDaddy might auto-append `.jesseonfire.com`, that's normal
- **@ symbol:** Means root domain (jesseonfire.com)
- **Priority:** Only for MX records (set to 10)
- **TTL:** "Auto" or "1 Hour" both work fine

---

## ⏰ Verification Process

### After Adding All 5 Records:

**1. Wait for DNS Propagation**
- Typical time: 10-30 minutes
- Maximum time: Up to 48 hours
- Usually propagates within 15 minutes

**2. Check DNS Propagation**
Use online tools:
- https://dnschecker.org/
- Enter: `resend._domainkey.jesseonfire.com`
- Type: TXT
- Click "Search"
- Wait until you see the DKIM value appear globally

**3. Verify in Resend**
1. Go to Resend: https://resend.com/domains
2. Click on **jesseonfire.com**
3. Click **"Verify Records"** button
4. Watch for green checkmarks ✅
5. All 5 should turn green when DNS is propagated

---

## 🎯 What Happens After Verification

### Immediate Benefits:
✅ Emails can be sent from `noreply@jesseonfire.com`
✅ No more "onboarding@resend.dev" limitation
✅ Can send to ANY email address (not just yours)
✅ Professional sender address
✅ Better email deliverability
✅ Automated welcome emails work!

### User Flow Will Be:
1. User submits form on jesseonfire.vercel.app/youtube-members
2. **Email automatically sent** with Discord invite link
3. Discord webhook notification posted
4. Bot monitors for verification
5. User joins Discord
6. User connects YouTube
7. Role auto-assigned
8. Bot sends welcome DM

---

## 🧪 Testing Email After Verification

### Test Email Sending:

**Option 1: Use Resend Dashboard**
1. Go to Resend → Domains → jesseonfire.com
2. Click "Send Test Email"
3. Enter a test email address
4. Check if it arrives

**Option 2: Submit Real Form**
1. Go to: https://jesseonfire.vercel.app/youtube-members
2. Fill out form with a test email
3. Submit
4. Check email inbox
5. Should receive Discord invite + instructions

**Option 3: Run Test Script**
Create a test file:
```javascript
// test-email.js
const { Resend } = require('resend');
const resend = new Resend('your_resend_api_key');

resend.emails.send({
  from: 'Jesse ON FIRE <noreply@jesseonfire.com>',
  to: 'your_test_email@gmail.com',
  subject: '🔥 Test Email from jesseonfire.com',
  html: '<h1>Success! Email is working!</h1>'
});
```

---

## 🚨 Troubleshooting

### If Verification Fails:

**Check 1: DNS Records Exactly Match**
- Copy/paste values carefully
- No extra spaces
- No missing characters

**Check 2: Wait Longer**
- DNS can take up to 48 hours
- Usually 10-30 minutes
- Check back later

**Check 3: Use Correct Name Field**
GoDaddy auto-appends domain, so:
- Resend says: `resend._domainkey`
- GoDaddy might show: `resend._domainkey.jesseonfire.com`
- **This is correct!**

**Check 4: Priority for MX Records**
- Must be set to **10**
- Don't leave blank
- Required for MX records only

**Check 5: TXT Record Quotes**
- Some systems need quotes around TXT values
- Some don't
- GoDaddy usually doesn't need them

---

## 📊 Current Setup Status

### Email Configuration:
- **Domain:** jesseonfire.com
- **Sender Address:** noreply@jesseonfire.com
- **Service:** Resend (AWS SES backend)
- **Code Updated:** ✅ Yes (committed and pushed)
- **Vercel Deployment:** Will auto-deploy in 2-3 minutes

### What's Ready:
- ✅ Code updated to use jesseonfire.com
- ✅ Resend account configured
- ✅ DNS records identified
- ⏳ Waiting for you to add DNS records in GoDaddy
- ⏳ Waiting for DNS verification
- ⏳ Waiting for email testing

---

## 🎉 Final Steps After Verification

1. **Verify domain shows green in Resend** ✅
2. **Test email sending** 📧
3. **Test full user flow** 🧪
4. **Announce to your YouTube members** 📢
5. **Monitor Discord bot for verifications** 🤖

---

## 💡 Pro Tips

1. **Add all 5 records at once** - faster than one by one
2. **Use copy/paste** - avoid typos in long DKIM key
3. **Screenshot Resend page** - for reference
4. **Check spam folder** when testing emails
5. **Keep GoDaddy and Resend tabs open** - easier to switch between

---

## 🆘 Need Help?

If you get stuck:
1. Check DNS propagation: https://dnschecker.org/
2. Review Resend docs: https://resend.com/docs/dashboard/domains/introduction
3. Ask in Resend Discord: https://discord.gg/resend
4. Or ask me for help!

---

**Ready to start? Go to GoDaddy and add those 5 DNS records!**
