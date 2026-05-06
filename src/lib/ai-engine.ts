import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * AI Engine v1.2.1 - Clean Build Version (Gemini Only for now)
 * Anthropic dependency removed to ensure build stability until SDK is properly added.
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
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY1;

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

  // 2. Gemini 1.5 Pro 呼び出し (メインエンジンとして統合)
  if (geminiKey) {
    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", systemInstruction });
      const result = await model.generateContent(prompt);
      responseText = result.response.text();
      finalModel = "Gemini 1.5 Pro";
    } catch (error) {
      console.error("Gemini Engine Error:", error);
      return { response: "AI Engine Error", model: "error", cached: false };
    }
  } else {
    return { response: "API Key missing", model: "none", cached: false };
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
