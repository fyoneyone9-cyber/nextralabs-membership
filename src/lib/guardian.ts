import { createClient } from '@/lib/supabase/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

// モデルの定義
const MODELS = {
  CHEAP: "gemini-1.5-flash",    // 激安・高速（デフォルト）
  POWERFUL: "claude-3-5-sonnet-20240620", // 高品質・高コスト（ここぞという時）
};

// 判定ロジック用のキーワード（これらが含まれる場合は最初からPOWERFULを検討）
const POWERFUL_KEYWORDS = ["複雑", "分析", "法的", "コード作成", "高度な診断"];

export async function aiGuardian({
  prompt,
  systemInstruction,
  userId,
  toolId,
  forcePowerful = false
}: {
  prompt: string;
  systemInstruction?: string;
  userId?: string;
  toolId: string;
  forcePowerful?: boolean;
}) {
  const supabase = createClient();
  
  // 1. キャッシュチェック (API消費 0 を狙う)
  // プロンプトを正規化してハッシュ化（簡易的に文字列比較）
  const { data: cachedData } = await (await supabase)
    .from('ai_cache')
    .select('response, model')
    .eq('prompt', prompt)
    .eq('system_instruction', systemInstruction || '')
    .single();

  if (cachedData) {
    console.log(`[Guardian] Cache Hit! Saved cost for tool: ${toolId}`);
    return { response: cachedData.response, model: cachedData.model, cached: true };
  }

  // 2. モデル選択 (Waterfall戦略)
  let selectedModel = MODELS.CHEAP;
  
  // キーワードチェックまたは強制フラグでモデルを格上げ
  const needsPower = forcePowerful || POWERFUL_KEYWORDS.some(k => prompt.includes(k));
  if (needsPower) {
    selectedModel = MODELS.POWERFUL;
  }

  console.log(`[Guardian] Model Selected: ${selectedModel} for tool: ${toolId}`);

  // 3. AI実行（ここではGeminiの例。Claudeの場合は条件分岐）
  let responseText = "";
  
  // ※ ここに実際のAI呼び出しロジックを実装
  // 現状は骨組みとしてGemini 1.5 Flashの呼び出しを想定
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ 
      model: selectedModel.includes("gemini") ? selectedModel : MODELS.CHEAP, // Claude連携は別途
      systemInstruction 
    });
    const result = await model.generateContent(prompt);
    responseText = result.response.text();
  } catch (error) {
    console.error("[Guardian] AI Call Error:", error);
    throw error;
  }

  // 4. キャッシュに保存（次回以降のコストを 0 にする）
  await (await supabase).from('ai_cache').insert({
    prompt,
    system_instruction: systemInstruction || '',
    response: responseText,
    model: selectedModel,
    tool_id: toolId,
    user_id: userId
  });

  return { response: responseText, model: selectedModel, cached: false };
}
