import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { hotelUrl, affiliateId } = await req.json()
    const finalId = affiliateId || 'nextralabs-22'
    
    // 環境変数の存在確認 (500エラー防止)
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'システム設定エラー: APIキーが未設定です' }, { status: 500 })
    }

    const prompt = `あなたはプロの宿泊紹介ライターです。
以下のホテルURLの内容を解析し、読者が「今すぐ予約したくなる」魅力的な紹介文を日本語で作成してください。
文末には必ず、楽天アフィリエイトID(${finalId})を組み込んだ正しい楽天トラベルのURLを配置してください。

【対象URL】
${hotelUrl}`

    // Google Gemini APIへの直接リクエスト (堅牢な記述)
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    })

    if (!res.ok) {
      const errorData = await res.json()
      return NextResponse.json({ error: 'AI通信エラー', detail: errorData }, { status: res.status })
    }

    const data = await res.json()
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "解析結果の生成に失敗しました。"
    
    return NextResponse.json({
      success: true,
      result: aiText,
      affiliateData: {
        rakuten_url: `https://hb.afl.rakuten.co.jp/hgc/${finalId}/?pc=${encodeURIComponent(hotelUrl)}`,
        estimated_cvr: "4.8%"
      }
    })
  } catch (e: any) {
    console.error('[SERVER_FATAL_ERROR]', e)
    return NextResponse.json({ error: 'サーバー内部エラー', msg: e.message }, { status: 500 })
  }
}
