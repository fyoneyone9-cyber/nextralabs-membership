import { NextRequest, NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache'
import { exec } from 'child_process';
import { promisify } from 'util';
import { checkApiLimit } from '@/lib/api-limit';

const execPromise = promisify(exec);

export async function POST(req: NextRequest) {
  noStore()
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  // 【憲法8条】API呼び出しツールは会員登録必須
  const limitCheck = await checkApiLimit('ai-sidejob', 10);
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
    const body = await req.json();
    const { style, skills, time } = body;

    // 1. gsk search で最新トレンドを取得 (擬似的にコマンド実行)
    // 実際には sandbox 環境の gsk CLI を使用
    const searchQuery = `2026年5月 副業 トレンド ${skills.join(' ')} 需要`;
    let trendInfo = "最新のAI画像生成案件がCrowdWorksで増加中。特にCanva AIを活用したバナー制作の需要が高い。";
    
    try {
      const { stdout } = await execPromise(`gsk search "${searchQuery}" --count 3`);
      trendInfo = stdout || trendInfo;
    } catch (e) {
      console.error("GSK search failed, using fallback trend info");
    }

    // 2. Gemini 2.5 Flash へのプロンプト構築
    const prompt = `
あなたはNextraLabsの副業マスターです。
以下のユーザー情報と最新トレンドに基づき、最短で収益化するためのロードアップを生成してください。

【ユーザー情報】
- スタイル: ${style} (speed=即金, expert=スキル, creator=楽しさ)
- 保有スキル: ${skills.join(', ')}
- 活動時間: ${time}

【最新市場トレンド】
${trendInfo}

【出力形式】
以下のJSONフォーマットで回答してください。
{
  "title": "称号（例：⚡️ 爆速AIライター）",
  "description": "ユーザーへの励ましと方向性の解説（100文字程度）",
  "roadmap": [
    { "title": "Step 1のタイトル", "desc": "具体的な行動（AIツール名を含む）", "urgent": true },
    { "title": "Step 2のタイトル", "desc": "具体的な行動", "urgent": false },
    { "title": "Step 3のタイトル", "desc": "具体的な行動", "urgent": false }
  ],
  "ai_hack": "この副業を10倍効率化するAI活用のコツ",
  "platforms": ["利用すべきサイト名"]
}
`;

    // 3. Gemini API 呼び出し (ここでは構成案として記述。プロジェクトのGeminiクライアントを使用)
    // 本来は src/lib/gemini.ts 等を介して呼び出す
    
    // プロトタイプ用のモックレスポンス
    const mockResult = {
      title: style === 'speed' ? "⚡️ 爆速AIコンテンツクリエイター" : "💎 次世代AIスペシャリスト",
      description: `最新のトレンド「${trendInfo.substring(0, 30)}...」を分析した結果、あなたの${skills[0]}スキルを活かすのが最短ルートです。`,
      roadmap: [
        { title: "AIツールセットアップ", desc: "NextraLabsの推奨プロンプトを使い、作業時間を80%削減する準備をします。", urgent: true },
        { title: "クラウドソーシング初応募", desc: "最新トレンドの案件に、AI生成の提案文で応募します。", urgent: false },
        { title: "収益の自動化", desc: "定型業務をAI化し、少ない稼働で月5万円を目指します。", urgent: false }
      ],
      ai_hack: "Gemini 2.5 Flashに『逆質問をさせてください』と頼むことで、クライアントの意図を正確に汲み取れます。",
      platforms: ["CrowdWorks", "Lancers"]
    };

    return NextResponse.json(mockResult);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
