import { NextRequest, NextResponse } from 'next/server'
import ogs from 'open-graph-scraper'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get('url')
  if (!url) {
    return NextResponse.json({ error: 'No url provided' }, { status: 400 })
  }
  try {
    // YouTube обработка
    const youtubeMatch = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([\w-]{11})/
    )
    let youtubesrcurl
    let ytTitle = ''
    let ytDescription = ''
    if (youtubeMatch) {
      const videoId = youtubeMatch[1]
      youtubesrcurl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
      const apiKey = process.env.YOUTUBE_API_KEY
      if (apiKey) {
        const ytApiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
        const ytRes = await fetch(ytApiUrl)
        if (ytRes.ok) {
          const ytData = await ytRes.json()
          console.log(ytData)
          if (ytData.items && ytData.items.length > 0) {
            ytTitle = ytData.items[0].snippet.title
            ytDescription = ytData.items[0].snippet.description
            youtubesrcurl =
              ytData.items[0].snippet.thumbnails?.maxres?.url ||
              ytData.items[0].snippet.thumbnails?.high?.url ||
              youtubesrcurl
          }
        }
      }
    }
    const { result } = await ogs({ url, timeout: 7000 })
    if (!result.success) {
      return NextResponse.json(
        { error: 'No OpenGraph data found' },
        { status: 404 }
      )
    }
    console.log(result)
    return NextResponse.json({
      title: youtubeMatch
        ? ytTitle || result.ogTitle || ''
        : result.ogTitle || '',
      description: youtubeMatch
        ? ytDescription || result.ogDescription || ''
        : result.ogDescription || '',
      image: youtubeMatch ? youtubesrcurl : result.ogImage?.[0].url || '',
      url: result.ogUrl || url,
    })
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || 'Failed to fetch OpenGraph' },
      { status: 500 }
    )
  }
}
