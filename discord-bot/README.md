# 🤖 YouTube Bridge Bot

Automatically manages YouTube member verifications and Discord invites.

## 🚀 Setup

### 1. Install Dependencies

```bash
cd discord-bot
npm install
```

### 2. Configure Environment

Create `.env` file:
```env
DISCORD_BOT_TOKEN=your_bot_token_here
```

### 3. Get Bot Token

1. Go to: https://discord.com/developers/applications
2. Create new application: "YouTube Bridge Bot"
3. Go to Bot section → Reset Token → Copy token
4. Paste token in `.env` file

### 4. Enable Bot Intents

In Discord Developer Portal → Bot section:
- ✅ Presence Intent
- ✅ Server Members Intent  
- ✅ Message Content Intent

### 5. Invite Bot to Server

1. Go to OAuth2 → URL Generator
2. Select scopes: `bot`
3. Select permissions:
   - Send Messages
   - Read Messages/View Channels
   - Manage Roles
4. Copy URL and open in browser
5. Add bot to your Discord server

### 6. Run the Bot

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

## 🎯 What It Does

1. **Monitors #youtube-members channel**
   - Watches for webhook submissions
   
2. **Automatically Posts Welcome Message**
   - Confirms submission received
   - Shows Discord invite link
   
3. **Future Features:**
   - Auto-DM users when they join
   - Auto-assign roles based on tier
   - Track membership status

## 🔧 Configuration

Edit `bot.js` to customize:
- Channel ID
- Welcome message
- Role assignments
- Auto-DM behavior

## 📊 How to Get Role IDs

1. Enable Developer Mode in Discord:
   - User Settings → Advanced → Developer Mode
2. Right-click any role → Copy ID
3. Paste in bot.js ROLES object

## 🚀 Deploy to Cloud (Optional)

Keep bot running 24/7 using:
- **Replit** (free, easy)
- **Railway** (free tier)
- **DigitalOcean** ($5/mo)
- **AWS EC2** (free tier)

## ✅ Status Check

When bot is running, you'll see:
```
✅ YouTube Bridge Bot is online!
🤖 Logged in as YouTube Bridge Bot#1234
📡 Monitoring channel: 1433481744904093869
🔗 Discord invite: https://discord.gg/9WpPC5GS
```

## 🐛 Troubleshooting

**Bot offline?**
- Check bot token is correct
- Verify intents are enabled
- Make sure bot is in the server

**Not responding to messages?**
- Verify channel ID is correct
- Check bot has "View Channel" permission
- Enable Message Content Intent

## 📝 Logs

Bot logs all activity:
- New submissions
- Welcome messages sent
- Errors

Check console output for details.
