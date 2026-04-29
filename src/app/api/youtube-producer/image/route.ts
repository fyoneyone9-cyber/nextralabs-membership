import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { prompt, type } = await req.json()

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY
    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OPENAI_API_KEYが設定されていません' }, { status: 500 })
    }

    const size = type === 'thumbnail' ? '1792x1024' : '1024x1024'

    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size,
        quality: 'standard',
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: `画像生成エラー: ${err}` }, { status: 500 })
    }

    const data = await res.json()
    const imageUrl = data.data?.[0]?.url

    return NextResponse.json({ imageUrl })
  } catch (e) {
    return NextResponse.json({ error: `エラー: ${e instanceof Error ? e.message : '不明'}` }, { status: 500 })
  }
}
