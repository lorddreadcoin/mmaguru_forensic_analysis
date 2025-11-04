# ✅ Vercel Environment Variables Checklist

## Required Variables for Production

Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables

### Add These 3 Variables:

1. **RESEND_API_KEY**
   - Value: `re_gJyqcykS_GyEq4mVzG9nTmuvQEa4M4vVi`
   - Environment: Production, Preview, Development (all 3)

2. **DISCORD_WEBHOOK_URL**
   - Value: `https://discord.com/api/webhooks/1433975129016111124/IvXYomsREwT_1Ck8v7R5F0U6x6LsQrLVeht0iGTntuhJifMFrlHVmaUTWwtdV52qD0CP`
   - Environment: Production, Preview, Development (all 3)

3. **DISCORD_INVITE_URL**
   - Value: `https://discord.gg/KpUF6GjH8V`
   - Environment: Production, Preview, Development (all 3)

### After Adding:
- Click "Save" on each
- Go to Deployments tab
- Click "Redeploy" on latest deployment
- OR push a small change to trigger auto-redeploy

---

## How to Verify They're Set:

In Vercel dashboard, you should see:
```
✅ RESEND_API_KEY        (Sensitive - hidden)
✅ DISCORD_WEBHOOK_URL   (Sensitive - hidden)
✅ DISCORD_INVITE_URL    https://discord.gg/KpUF6GjH8V
✅ YOUTUBE_API_KEY       (Should already be there)
✅ YOUTUBE_CHANNEL_ID    (Should already be there)
```

Without these, the production site can't send emails or Discord notifications!
