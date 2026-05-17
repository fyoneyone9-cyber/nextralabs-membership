import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { checkApiLimit } from "@/lib/api-limit";
import { unstable_noStore as noStore } from 'next/cache'

export async function POST(req: NextRequest) {
  noStore()
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  try {
    // 認証 + 1日10回制限
    const limitCheck = await checkApiLimit('prompt-master', 10)
    if (!limitCheck.allowed) {
      if (limitCheck.reason === 'unauthenticated') {
        return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
      }
      return NextResponse.json({ error: '本日の利用上限（10回）に達しました。明日またお試しください。' }, { status: 429 })
    }

    const { text } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY1;
    if (!apiKey || !text) return NextResponse.json({ error: "No Data" }, { status: 400 });

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [{
        parts: [{ text: `以下の日本語のアイデアを、MidjourneyやDALL-E 3に最適な高画質な英語プロンプトに変換してください。回答は英語プロンプトのみを返してください。:${text}` }]
      }]
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    const prompt = data.candidates[0].content.parts[0].text;
    
    return NextResponse.json({ prompt });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
