import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { prompt, type } = await req.json()

    const GSK_API_KEY = process.env.GSK_API_KEY
    if (!GSK_API_KEY) {
      return NextResponse.json({ error: 'APIキーが設定されていません' }, { status: 500 })
    }

    const aspect_ratio = type === 'thumbnail' ? '16:9' : '1:1'

    // Use Genspark image generation API
    const res = await fetch('https://www.genspark.ai/api/cli_tools/call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': GSK_API_KEY,
      },
      body: JSON.stringify({
        tool_name: 'image_generation',
        params: {
          prompt,
          aspect_ratio,
          image_size: '1k',
        },
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: `画像生成エラー（${res.status}）: ${err.slice(0, 200)}` }, { status: 500 })
    }

    const data = await res.json()

    // Extract image URL from response
    let imageUrl = ''
    if (data.data?.image_url) {
      imageUrl = data.data.image_url
    } else if (data.data?.url) {
      imageUrl = data.data.url
    } else if (data.data?.images?.[0]?.url) {
      imageUrl = data.data.images[0].url
    } else if (data.data?.images?.[0]) {
      imageUrl = typeof data.data.images[0] === 'string' ? data.data.images[0] : data.data.images[0].url
    } else if (typeof data.data === 'string' && data.data.startsWith('http')) {
      imageUrl = data.data
    } else {
      // Log for debugging
      console.log('Image gen response:', JSON.stringify(data).slice(0, 500))
      return NextResponse.json({ error: '画像URLが取得できませんでした', raw: data }, { status: 500 })
    }

    return NextResponse.json({ imageUrl })
  } catch (e) {
    return NextResponse.json({ error: `エラー: ${e instanceof Error ? e.message : '不明'}` }, { status: 500 })
  }
}
