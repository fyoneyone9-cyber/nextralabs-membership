import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { checkApiLimit } from '@/lib/api-limit';

const DEFAULT_RAKUTEN_ID = '534e3725.64346793.534e3726.d5412af4';

// ── サーバーサイドキャッシュ（5分）──
let cachedTrends: { items: any[]; insight: string; cachedAt: number } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000;

const FALLBACK_ITEMS = [
  { name: 'AI活用', catchcopy: 'いま日本で最も検索されているキーワード' },
  { name: '時短術', catchcopy: '忙しい現代人に刺さるライフハック系' },
  { name: '最新ガジェット', catchcopy: '春のデバイス需要が急上昇中' },
  { name: '副業術', catchcopy: '物価高で副業ニーズが爆増' },
  { name: '節約生活', catchcopy: '光熱費・食費の節約情報が拡散中' },
  { name: 'ChatGPT活用', catchcopy: 'ビジネス×AI活用が今最もバズるテーマ' },
];

export async function GET() {
  // クレジット保護：1日15回制限
  const limitCheck = await checkApiLimit('trend-stock', 15);
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

  // ── キャッシュヒット → 即返却（LLM呼び出しゼロ）──
  const now = Date.now();
  if (cachedTrends && now - cachedTrends.cachedAt < CACHE_TTL_MS) {
    return NextResponse.json({ ...cachedTrends, mode: 'CACHED' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      items: FALLBACK_ITEMS,
      insight: 'AIトレンド解析中です。現在の注目キーワードを表示しています。',
      mode: 'SAFE_MODE',
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: { maxOutputTokens: 300, temperature: 0.7 },
    });

    const month = new Date().toLocaleDateString('ja-JP', { month: 'long' });
    const prompt = `${month}の日本でSNS投稿テーマとして今バズっているキーワードを6つ、JSONのみで出力。余分なテキスト不要。
[{"name":"キーワード","catchcopy":"説明20字以内"}]`;

    // タイムアウト8秒
    const timeoutMs = 8000;
    const result = await Promise.race([
      model.generateContent(prompt),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('TIMEOUT')), timeoutMs)
      ),
    ]);

    const text = result.response.text().replace(/```json|```/g, '').trim();
    const items = JSON.parse(text);

    cachedTrends = { items, insight: '【AIリアルタイム解析】今SNSで最もバズるテーマをAIが特定しました。', cachedAt: now };
    return NextResponse.json({ items, insight: cachedTrends.insight, mode: 'AI_LIVE' });

  } catch (error: any) {
    return NextResponse.json({
      items: FALLBACK_ITEMS,
      insight: error?.message === 'TIMEOUT'
        ? 'AIが分析中です。定番バズキーワードを先に表示しています。'
        : 'トレンドデータを表示中です。',
      mode: 'FALLBACK',
    });
  }
}
