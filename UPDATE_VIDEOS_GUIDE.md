# How to Update Videos on Jesse ON FIRE Website

## Quick Update Guide

The website now uses a **manual JSON system** that's 100% reliable and never gets blocked.

### To Update Videos:

1. **Open the file:** `data/latest-videos.json`

2. **Get real YouTube video IDs:**
   - Go to Jesse's YouTube channel: https://youtube.com/@RealJesseONFIRE
   - Copy the video ID from the URL (the part after `v=`)
   - Example: `https://youtube.com/watch?v=DiiXCi--ryI` → ID is `DiiXCi--ryI`

3. **Update the JSON file** with real video data:
```json
{
  "lastUpdated": "2025-10-22",
  "videos": [
    {
      "id": "REAL_VIDEO_ID_HERE",
      "title": "Video Title Here",
      "views": "141K",
      "duration": "28:35",
      "uploadedAgo": "18 hours ago"
    }
  ]
}
```

4. **Commit and push** the changes to GitHub
5. **Deploy** to your hosting provider (Vercel/Netlify will auto-deploy)

## Why This System?

- **Never gets blocked** - No API calls, no rate limits
- **100% reliable** - Works every time
- **Full control** - You decide what videos to show
- **Real thumbnails** - Uses YouTube's CDN directly: `https://i.ytimg.com/vi/VIDEO_ID/maxresdefault.jpg`

## Important Notes

- Always use **real YouTube video IDs** - fake IDs will show broken thumbnails
- The system automatically generates thumbnail URLs from the video IDs
- Videos are clickable and link directly to YouTube
- Update regularly to keep content fresh

## Current Video IDs (as of Oct 22, 2025)

These are real Jesse ON FIRE videos that work:
- `DiiXCi--ryI` - Tyler Robinson video
- `sFj-v4qu6xg` - Alex Jones update
- `F5LI3PKL_Rk` - World will burn
- `AloqDcz7hU4` - Charlie Kirk FBI story
- `vjZzvEh4VJY` - China assassination
- `6q2CYqUPZ5c` - New suspects

## Troubleshooting

If thumbnails aren't showing:
1. Check that video IDs are correct (no typos)
2. Verify the videos exist on YouTube
3. Clear browser cache and hard refresh (Ctrl+F5)
4. Check browser console for errors
