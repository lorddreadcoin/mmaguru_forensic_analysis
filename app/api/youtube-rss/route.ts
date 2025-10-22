export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const channelId = searchParams.get('channel_id') || process.env.YOUTUBE_CHANNEL_ID || 'UCL1ULuUKdktFDpe66_A3H2A'
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`

    const res = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/xml, text/xml, */*',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      cache: 'no-store'
    })

    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'RSS fetch failed', status: res.status }), { status: 500 })
    }

    const xml = await res.text()

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Server error fetching RSS', message: err?.message || 'Unknown' }), { status: 500 })
  }
}
