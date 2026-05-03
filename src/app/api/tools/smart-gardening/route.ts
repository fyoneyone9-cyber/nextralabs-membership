import { NextResponse } from 'next/server'
import { aiCreditGuardian } from '@/lib/ai-engine'

export async function POST(req: Request) {
  try {
    const { plantName, condition, location } = await req.json()

    // クレジットチェック (仮のユーザーIDを使用)
    const credit = await aiCreditGuardian.checkCredit('user_123', 'standard')
    if (!credit.allowed) {
      return NextResponse.json({ error: 'クレジット不足です' }, { status: 403 })
    }

    // クレジット消費
    await aiCreditGuardian.consumeCredit('user_123', 1)

    // 本来はここでAI（OpenAI/Gemini等）を呼び出すが、
    // 今回は再実装の基盤構築のため、モック回答を返す
    const advice = `【${plantName}の診断結果】
現在の状態：${condition}
場所：${location}

アドバイス：
1. 水やりは土の表面が乾いてからたっぷりと与えてください。
2. ${location}とのことですので、日当たりと風通しに注意してください。
3. 肥料は成長期に合わせて月1回程度与えるのが理想的です。`

    return NextResponse.json({ advice })
  } catch (error) {
    console.error('Gardening API Error:', error)
    return NextResponse.json({ error: '診断に失敗しました' }, { status: 500 })
  }
}
