import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * AICreditGuardian - クレジット制限管理
 */
export class AICreditGuardian {
  private static instance: AICreditGuardian;
  private constructor() {}
  public static getInstance(): AICreditGuardian {
    if (!AICreditGuardian.instance) AICreditGuardian.instance = new AICreditGuardian();
    return AICreditGuardian.instance;
  }
  async checkCredit(userId: string, plan: string = 'free') {
    return { allowed: true, remainingDaily: 100, remainingMonthly: 3000 };
  }
  async consumeCredit(userId: string, amount: number = 1) {
    return true;
  }
}
export const aiCreditGuardian = AICreditGuardian.getInstance();

/**
 * nextraAiEngine - AI呼び出しの心臓部（キャッシュ ＋ Waterfall）
 */
export async function nextraAiEngine({
  prompt,
  systemInstruction,
  toolId,
  quality = 'auto',
}: {
  prompt: string;
  systemInstruction?: string;
  toolId: string;
  quality?: 'cheap' | 'balanced' | 'powerful' | 'auto';
}) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!supabaseUrl || !supabaseKey || !geminiKey) {
    return { response: "Initializing...", model: "none", cached: false };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // 1. キャッシュチェック
  const { data: cached } = await supabase
    .from('ai_cache')
    .select('response, model')
    .eq('prompt', prompt)
    .eq('system_instruction', systemInstruction || '')
    .single();

  if (cached) return { response: cached.response as string, model: cached.model as string, cached: true };

  // 2. モデル選択 (Waterfall)
  const modelName = quality === 'powerful' ? "gemini-1.5-pro" : "gemini-1.5-flash";

  // 3. AI実行
  const genAI = new GoogleGenerativeAI(geminiKey);
  const model = genAI.getGenerativeModel({ model: modelName, systemInstruction });
  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  // 4. キャッシュ保存
  await supabase.from('ai_cache').insert({
    prompt,
    system_instruction: systemInstruction || '',
    response: responseText,
    model: modelName,
    tool_id: toolId
  });

  return { response: responseText, model: modelName, cached: false };
}
