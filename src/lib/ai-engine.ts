import { createClient } from '@supabase/supabase-js';
import { callGeminiSDKWithRotation } from './gemini-rotate';

/**
 * AI Engine v1.3.0 - Gemini 3-key rotation
 * GEMINI_API_KEY_1/2/3 をローテーションして呼び出す
 */
export async function nextraAiEngine({
  prompt,
  systemInstruction,
  toolId,
  quality = 'auto',
  preferredModel = 'gemini'
}: {
  prompt: string;
  systemInstruction?: string;
  toolId: string;
  quality?: 'cheap' | 'balanced' | 'powerful' | 'auto';
  preferredModel?: 'gemini' | 'claude';
}) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) return { response: "Supabase Error", model: "none", cached: false };

  const supabase = createClient(supabaseUrl, supabaseKey);

  // 1. キャッシュチェック
  const { data: cached } = await supabase
    .from('ai_cache')
    .select('response, model')
    .eq('prompt', prompt)
    .eq('system_instruction', systemInstruction || '')
    .single();
  if (cached) return { response: cached.response as string, model: cached.model as string, cached: true };

  let responseText = "";
  let finalModel = "";

  // 2. Gemini呼び出し（3キーローテーション）
  try {
    responseText = await callGeminiSDKWithRotation(prompt, systemInstruction, 'gemini-2.5-flash');
    finalModel = "Gemini 2.5 Flash";
  } catch (error) {
    console.error("Gemini Engine Error:", error);
    return { response: "AI Engine Error", model: "error", cached: false };
  }

  // 3. キャッシュ保存
  await supabase.from('ai_cache').insert({
    prompt,
    system_instruction: systemInstruction || '',
    response: responseText,
    model: finalModel,
    tool_id: toolId
  });

  return { response: responseText, model: finalModel, cached: false };
}
