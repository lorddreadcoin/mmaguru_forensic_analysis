# 🔥 HOW TO UPDATE JESSE'S LATEST VIDEOS

## **The Easy Way (No More Manual Data Entry!)**

### **Step 1: Open the Config File**
File: `config/latest-videos.ts`

### **Step 2: Replace YouTube URLs**
Just paste the new YouTube video URLs in order (most recent first):

```typescript
export const LATEST_VIDEO_URLS = [
  "https://youtu.be/NEW_VIDEO_1",  // Most recent video
  "https://youtu.be/NEW_VIDEO_2",  // Second most recent
  "https://youtu.be/NEW_VIDEO_3",  // Third...
  "https://youtu.be/NEW_VIDEO_4",
  "https://youtu.be/NEW_VIDEO_5",
  "https://youtu.be/NEW_VIDEO_6",
];
```

### **Step 3: Save & Deploy**
That's it! The system automatically fetches:
- ✅ Correct thumbnails
- ✅ Correct titles
- ✅ Correct view counts
- ✅ Correct upload dates
- ✅ Correct video duration

No more manual typing = No more mismatched thumbnails!

---

## **What URL Formats Work?**

All of these work:
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtube.com/watch?v=VIDEO_ID`
- `VIDEO_ID` (just the ID by itself)

---

## **Optional: Customize Categories**

If you want custom categories for each video, edit this array:

```typescript
export const VIDEO_CATEGORIES = [
  "TRUE CRIME",      // Category for video 1
  "CONSPIRACY",      // Category for video 2
  "BREAKING NEWS",   // Category for video 3
  "INVESTIGATION",
  "POLITICS",
  "EXCLUSIVE"
];
```

If you don't care about categories, leave it as is.

---

## **Example Update**

Let's say Jesse just uploaded 3 new videos. Here's what you do:

1. **Open:** `config/latest-videos.ts`
2. **Replace the first 3 URLs** with the new video URLs
3. **Save the file**
4. **Deploy** (git push or `vercel --prod`)

Done! 🔥

---

## **Why This Is Better**

**OLD WAY:**
- Manually copy title (risk of typos)
- Manually find thumbnail URL (often wrong size)
- Manually count views and format (always out of date)
- Manually calculate "X days ago" (approximate)
- Risk of mismatching data between videos

**NEW WAY:**
- Paste URL
- Everything else is automatic
- Always accurate
- Always up-to-date
- Zero human error

---

## **Troubleshooting**

**Video not showing?**
- Check that the URL is correct
- Make sure the video is public (not private/unlisted)

**Data looks wrong?**
- YouTube API might be cached (wait 5 minutes)
- Redeploy the site to fetch fresh data

**Still having issues?**
- Check that your YouTube API key is still valid in `.env.local`
