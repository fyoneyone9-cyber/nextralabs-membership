import { NextRequest, NextResponse } from 'next/server'
import { callGeminiWithRotation } from '@/lib/gemini-rotate'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { name, nationality, request: guestRequest } = await req.json()
    if (!name || !nationality) {
      return NextResponse.json({ error: '予約者名と国籍は必須です' }, { status: 400 })
    }

    const prompt = `あなたはホテル・旅館のフロントスタッフ向けアシスタントです。
以下の予約情報から、ゲストの宗教・食習慣・文化的配慮事項を推定してください。

予約者名: ${name}
国籍・出身地: ${nationality}
特別リクエスト: ${guestRequest || 'なし'}

以下のJSON形式のみで回答してください（余分なテキスト・コードブロック不要）:
{
  "religion": "推定宗教（不明の場合は「不明」）",
  "dietType": "食事タイプ（ハラール/ベジタリアン/ヴィーガン/コーシャ/仏教食/制限なし/不明）",
  "confidence": 確信度（0-100の整数）,
  "presets": ["対応項目1", "対応項目2"],
  "notes": "スタッフへの説明文（なぜそう判断したか根拠を含む・2〜3文）",
  "handover": "申し送り文（そのままフロントで使える形式・改行あり）"
}

presetsは以下から該当するものを選択:
ハラール食対応, アルコール不提供, 豚肉除去, 牛肉除去, ベジタリアン対応, ヴィーガン対応, グルテンフリー対応, ナッツアレルギー確認, 礼拝マット準備, 礼拝方向（キブラ）案内, コーラン・聖典配慮, 英語対応スタッフ配置, 中国語対応スタッフ配置, 韓国語対応スタッフ配置

JSONのみ返してください。`

    const raw = await callGeminiWithRotation(prompt)

    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    let result
    try {
      result = JSON.parse(cleaned)
    } catch {
      return NextResponse.json({ error: 'Gemini応答のパースに失敗しました', raw }, { status: 500 })
    }

    return NextResponse.json(result)
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? '不明なエラー' }, { status: 500 })
  }
}
