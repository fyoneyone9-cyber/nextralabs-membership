import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from '@anthropic-ai/sdk';

/**
 * AI Engine v1.2 - Multi-Model Support (Gemini & Claude)
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
  const geminiKey = process.env.GEMINI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

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

  // 2. Claude 3.5 Sonnet 呼び出し
  if (preferredModel === 'claude' && anthropicKey) {
    const anthropic = new Anthropic({ apiKey: anthropicKey });
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 2000,
      system: systemInstruction,
      messages: [{ role: "user", content: prompt }],
    });
    // @ts-ignore
    responseText = message.content[0].text;
    finalModel = "Claude 3.5 Sonnet";
  } 
  // 3. Gemini 1.5 Pro 呼び出し
  else if (geminiKey) {
    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro", systemInstruction });
    const result = await model.generateContent(prompt);
    responseText = result.response.text();
    finalModel = "Gemini 1.5 Pro";
  }

  // 4. キャッシュ保存
  await supabase.from('ai_cache').insert({
    prompt,
    system_instruction: systemInstruction || '',
    response: responseText,
    model: finalModel,
    tool_id: toolId
  });

  return { response: responseText, model: finalModel, cached: false };
}
