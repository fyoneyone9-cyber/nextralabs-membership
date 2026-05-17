import { NextRequest, NextResponse } from 'next/server'
import { checkApiLimit } from '@/lib/api-limit';

const GSK_BASE = 'https://www.genspark.ai'

export async function POST(req: NextRequest) {
  noStore()
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  try {
  // 【憲法8条】API呼び出しツールは会員登録必須
  const limitCheck = await checkApiLimit('youtube-producer-image', 5);
  if (!limitCheck.allowed) {
    if (limitCheck.reason === 'unauthenticated') {
      return NextResponse.json(
        { error: 'このツールの利用には会員登録が必要です。', reason: 'unauthenticated' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: '本日の利用制限に達しました。明日またご利用ください。' },
      { status: 429 }
    );
  }
    const { prompt, type } = await req.json()

    const GSK_API_KEY = process.env.GSK_API_KEY
    if (!GSK_API_KEY) {
      return NextResponse.json({ error: 'APIキーが設定されていません' }, { status: 500 })
    }

    const aspect_ratio = type === 'thumbnail' ? '16:9' : '1:1'

    // Use Genspark image generation API (correct endpoint)
    const res = await fetch(`${GSK_BASE}/api/tool_cli/image_generation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': GSK_API_KEY,
      },
      body: JSON.stringify({
        prompt,
        aspect_ratio,
        image_size: '1k',
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: `画像生成エラー（${res.status}）: ${err.slice(0, 200)}` }, { status: 500 })
    }

    const data = await res.json()

    // Extract image URL from response
    let imageUrl = ''
    const d = data.data
    if (d?.image_url) {
      imageUrl = d.image_url
    } else if (d?.url) {
      imageUrl = d.url
    } else if (d?.images?.[0]?.url) {
      imageUrl = d.images[0].url
    } else if (d?.images?.[0] && typeof d.images[0] === 'string') {
      imageUrl = d.images[0]
    } else if (typeof d === 'string' && d.startsWith('http')) {
      imageUrl = d
    } else {
      console.log('Image gen response:', JSON.stringify(data).slice(0, 500))
      return NextResponse.json({ error: '画像URLが取得できませんでした' }, { status: 500 })
    }

    return NextResponse.json({ imageUrl })
  } catch (e) {
    return NextResponse.json({ error: `エラー: ${e instanceof Error ? e.message : '不明'}` }, { status: 500 })
  }
}
