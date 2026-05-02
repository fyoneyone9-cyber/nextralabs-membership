import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// 1日あたりの生成上限
const DAILY_LIMIT_USER = 1
const DAILY_LIMIT_ADMIN = 5

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'ログインが必要です。' }, { status: 401 })
    }

    // 管理者判定
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle()
    const isAdmin = profile?.role === 'admin'
    const dailyLimit = isAdmin ? DAILY_LIMIT_ADMIN : DAILY_LIMIT_USER

    // 今日の生成数を確認
    const todayJST = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10) // YYYY-MM-DD JST
    const { data: usageRow } = await supabase
      .from('image_generation_limits')
      .select('count')
      .eq('user_id', user.id)
      .eq('date', todayJST)
      .maybeSingle()

    const currentCount = usageRow?.count ?? 0

    if (currentCount >= dailyLimit) {
      return NextResponse.json({
        error: `1日の生成上限（${dailyLimit}枚）に達しました。明日またお試しください。`,
        limit: dailyLimit,
        used: currentCount,
        isAdmin,
      }, { status: 429 })
    }

    // プロンプトを受け取る
    const { prompt } = await request.json()
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'promptが必要です。' }, { status: 400 })
    }

    // gsk img を実行（サーバーサイドではCLIを直接呼べないのでGenspark Image API経由）
    // ここでは画像生成APIを呼び出す
    const gskApiUrl = process.env.GENSPARK_API_URL || 'https://api.genspark.ai'
    const gskApiKey = process.env.GENSPARK_API_KEY || ''

    if (!gskApiKey) {
      return NextResponse.json({ error: 'Genspark APIキーが設定されていません。' }, { status: 500 })
    }

    const imgRes = await fetch(`${gskApiUrl}/v1/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${gskApiKey}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        aspect_ratio: '2:3', // Kindle表紙推奨比率
        size: '2k',
      }),
    })

    if (!imgRes.ok) {
      const errText = await imgRes.text()
      return NextResponse.json({ error: `画像生成に失敗しました: ${errText}` }, { status: 500 })
    }

    const imgData = await imgRes.json()
    const imageUrl = imgData?.data?.[0]?.url || imgData?.url || null

    if (!imageUrl) {
      return NextResponse.json({ error: '画像URLの取得に失敗しました。' }, { status: 500 })
    }

    // 成功したら使用カウントをupsert
    if (usageRow) {
      await supabase
        .from('image_generation_limits')
        .update({ count: currentCount + 1, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('date', todayJST)
    } else {
      await supabase
        .from('image_generation_limits')
        .insert({ user_id: user.id, date: todayJST, count: 1 })
    }

    return NextResponse.json({
      imageUrl,
      used: currentCount + 1,
      limit: dailyLimit,
      remaining: dailyLimit - (currentCount + 1),
      isAdmin,
    })

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// 残り枚数確認用 GET
export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'ログインが必要です。' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle()
    const isAdmin = profile?.role === 'admin'
    const dailyLimit = isAdmin ? DAILY_LIMIT_ADMIN : DAILY_LIMIT_USER

    const todayJST = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10)
    const { data: usageRow } = await supabase
      .from('image_generation_limits')
      .select('count')
      .eq('user_id', user.id)
      .eq('date', todayJST)
      .maybeSingle()

    const used = usageRow?.count ?? 0

    return NextResponse.json({
      used,
      limit: dailyLimit,
      remaining: Math.max(dailyLimit - used, 0),
      isAdmin,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
