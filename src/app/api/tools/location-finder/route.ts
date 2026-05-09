import { checkApiLimit } from '@/lib/api-limit';
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: NextRequest) {
  // 🛡️ レート制限（1日10回）
  const limitCheck = await checkApiLimit('location-finder', 10);
  if (!limitCheck.allowed) {
    return NextResponse.json(
      { error: '本日の利用上限に達しました。明日またご利用ください。' },
      { status: 429 }
    );
  }

  try {
    const formData = await req.formData()
    const file = formData.get('image') as File | null
    if (!file) return NextResponse.json({ error: '画像が見つかりません' }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')
    const mimeType = file.type || 'image/jpeg'

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `この写真を分析して、撮影場所を特定してください。
建物、看板、地形、植生、道路標識、言語、建築様式、ランドマークなどあらゆる手がかりを使ってください。

以下のJSON形式のみで回答してください（他のテキストは不要）:
{
  "locationName": "場所の名称（日本語で、できるだけ具体的に）",
  "lat": 緯度（数値）,
  "lng": 経度（数値）,
  "confidence": "高" または "中" または "低",
  "reasoning": "どの手がかりから判断したか（日本語で1〜2文）"
}

場所が全く特定できない場合は lat: 35.6762, lng: 139.6503 (東京) を使い、confidence: "低" としてください。`

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64, mimeType } },
    ])

    const text = result.response.text().trim()
    // JSON部分を抽出
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('AIの応答を解析できませんでした')

    const parsed = JSON.parse(jsonMatch[0])
    return NextResponse.json({
      locationName: parsed.locationName || '不明な場所',
      lat: Number(parsed.lat) || 35.6762,
      lng: Number(parsed.lng) || 139.6503,
      confidence: parsed.confidence || '低',
      reasoning: parsed.reasoning || '',
    })
  } catch (e: any) {
    console.error('location-finder error:', e)
    // APIキー関連エラーはユーザーフレンドリーなメッセージに変換
    const msg = e.message || ''
    if (msg.includes('API key') || msg.includes('API_KEY') || msg.includes('expired') || msg.includes('invalid')) {
      return NextResponse.json({ error: 'AI解析サービスに接続できませんでした。しばらく経ってから再度お試しください。' }, { status: 503 })
    }
    return NextResponse.json({ error: '解析に失敗しました。別の写真でお試しください。' }, { status: 500 })
  }
}
