# 🔥 Quick Discord Webhook Setup (5 minutes)

## Why You Need This
Since you didn't receive an email, let's set up Discord webhook monitoring so you can see when form submissions happen.

## Steps:

### 1. Create Discord Server (if you don't have one)
- Open Discord
- Click "+" to add server
- Create "Jesse ON FIRE Members"

### 2. Create Webhook Channel
- Create channel: `#youtube-verifications`
- Right-click channel → Integrations → Webhooks
- Click "New Webhook"
- Name: "YouTube Bridge"
- Copy the webhook URL

### 3. Add to Vercel Environment Variables
- Go to vercel.com → Your project → Settings → Environment Variables
- Add new variable:
  - Name: `DISCORD_WEBHOOK_URL`
  - Value: `https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_TOKEN`
- Click "Save"
- Redeploy your site

### 4. Test Again
- Submit the form again
- Check the Discord channel for notifications
- This will show you if the form is working

## Alternative: Manual Discord Invite
If you just want to test the Discord role assignment:

1. Create a Discord server
2. Set up YouTube integration (Server Settings → Integrations → YouTube)
3. Create "Inner Circle" role
4. Invite yourself to the server
5. Connect YouTube in your Discord settings
6. See if you get the role automatically

This tests the Discord native integration without the website form.
