import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * NextraLabs AI Engine
 * コスト削減・キャッシュ・Waterfall呼び出しを統合した基盤
 */
export async function nextraAiEngine({
  prompt,
  systemInstruction,
  toolId,
  quality = 'auto', // 'cheap' | 'balanced' | 'powerful' | 'auto'
}: {
  prompt: string;
  systemInstruction?: string;
  toolId: string;
  quality?: 'cheap' | 'balanced' | 'powerful' | 'auto';
}) {
  // サーバーサイド・ビルド時にも安全なクライアント作成
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. キャッシュチェック
  const { data: cached } = await supabase
    .from('ai_cache')
    .select('response, model')
    .eq('prompt', prompt)
    .eq('system_instruction', systemInstruction || '')
    .single();

  if (cached) return { response: cached.response, model: cached.model, cached: true };

  // 2. モデル選択ロジック
  let modelName = "gemini-1.5-flash"; // デフォルト（激安）
  
  if (quality === 'powerful') {
    modelName = "gemini-1.5-pro"; // 品質追求
  } else if (quality === 'auto') {
    // 複雑な要求が含まれる場合のみ格上げ（Waterfall）
    const complexKeywords = ["分析", "法律", "高度", "作成", "リサーチ"];
    if (complexKeywords.some(k => prompt.includes(k))) {
      modelName = "gemini-1.5-pro"; // 品質とコストのバランス
    }
  }

  // 3. AI呼び出し (Geminiの例)
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: modelName, systemInstruction });
  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  // 4. 自動キャッシュ
  await supabase.from('ai_cache').insert({
    prompt,
    system_instruction: systemInstruction || '',
    response: responseText,
    model: modelName,
    tool_id: toolId
  });

  return { response: responseText, model: modelName, cached: false };
}
