import { checkApiLimit } from '@/lib/api-limit';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const dynamic = 'force-dynamic';

/**
 * BuySmartNav API v3
 * Gemini 2.5 Flash が市場価格を推定し、損得判定まで一気に行う。
 * 外部APIに依存しないため常時安定動作。
 */

export async function POST(req: Request) {
  // 🛡️ レート制限（1日10回）
  const limitCheck = await checkApiLimit('buy-smart-nav', 10);
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

  try {
    const { keyword } = await req.json();
    if (!keyword || keyword.trim() === '') {
      return NextResponse.json({ success: false, error: '商品名を入力してください' }, { status: 400 });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not configured');

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
あなたは日本の中古市場・新品市場に詳しいAIバイヤーです。
「${keyword}」について、2025〜2026年の日本市場での価格と損得判定を行ってください。

以下のJSON形式のみで回答してください（コードブロック・マークダウン不要、JSONのみ）:

{
  "newPrice": 新品の最安値相場（円・整数）,
  "usedPrice": 中古の平均相場（円・整数）,
  "verdict": "new" または "used" （どちらがお得か）,
  "status": "新品購入を推奨" または "中古購入を推奨",
  "reason": "判定理由（150文字以内、プレーンな日本語、Markdown記号なし）",
  "items": [
    {
      "name": "具体的な商品名・グレード（50文字以内）",
      "price": 価格（整数）,
      "condition": "新品" または "中古",
      "url": "https://search.rakuten.co.jp/search/mall/${encodeURIComponent(keyword)}"
    }
  ]
}

ルール:
- itemsは3〜5件（新品2件・中古2〜3件の混合）
- 価格は現実の日本市場に近い具体的な数値
- reasonは「新品推奨」「中古推奨」のどちらかを最初に明示し、理由を続ける
- 価格差・保証・リセールバリュー・状態リスクを考慮すること
- JSONのみ出力（説明文・前置き・コードブロック一切不要）
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // JSONを抽出（```json ブロックや前後のテキストを除去）
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Gemini raw response:', text);
      throw new Error('AI応答の解析に失敗しました。もう一度お試しください。');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    const newPrice: number = Number(parsed.newPrice) || 0;
    const avgUsedPrice: number = Number(parsed.usedPrice) || 0;
    const verdict: string = parsed.verdict === 'used' ? 'used' : 'new';
    const status: string = parsed.status || (verdict === 'used' ? '中古購入を推奨' : '新品購入を推奨');
    const reason: string = parsed.reason || '判定理由がありません';

    const items = (parsed.items || []).slice(0, 5).map((i: any) => ({
      name: String(i.name || keyword).substring(0, 60),
      price: Number(i.price) || 0,
      url: i.url || `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(keyword)}`,
      img: '',
    }));

    return NextResponse.json({
      success: true,
      verdict,
      status,
      reason,
      dataSource: 'GEMINI_AI_MARKET',
      data: {
        minPrice: newPrice,
        avgPrice: avgUsedPrice,
        items,
      },
    });

  } catch (error: any) {
    console.error('BuySmartNav API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
