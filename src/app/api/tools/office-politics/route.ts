import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { members, relations } = await req.json()
    const prompt = `あなたは組織心理学と社内政治のプロです。以下のメンバーと関係性データに基づき、(1)現在のパワーバランス (2)主要な派閥構造 (3)ユーザーがとるべき最短攻略ルート を、具体的かつ冷徹に分析してください。
    
    【メンバー】
    ${JSON.stringify(members)}
    
    【関係性】
    ${JSON.stringify(relations)}`

    const res = await fetch('https://api.google.com/v1/gemini-2.5-flash:generateContent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.GEMINI_API_KEY! },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    })
    
    const data = await res.json()
    return NextResponse.json({ analysis: data.candidates[0].content.parts[0].text })
  } catch (e) {
    return NextResponse.json({ error: 'AI解析に失敗しました' }, { status: 500 })
  }
}
