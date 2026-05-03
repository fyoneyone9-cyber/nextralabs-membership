import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * AI Engine v1.1 - Type Safe & Build Stable
 */
export async function nextraAiEngine({
  prompt,
  systemInstruction,
  toolId,
  quality = 'auto'
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
    console.warn(`[AI-Engine] Missing env vars for ${toolId}`);
    return { response: "Service is currently initializing...", model: "none", cached: false };
  }

  const supabase = createClient(supabaseUrl as string, supabaseKey as string);

  // Cache Check
  const { data: cached } = await supabase
    .from('ai_cache')
    .select('response, model')
    .eq('prompt', prompt)
    .eq('system_instruction', systemInstruction || '')
    .single();

  if (cached) return { response: cached.response as string, model: cached.model as string, cached: true };

  // Model Selection
  const modelName = quality === 'powerful' ? "gemini-1.5-pro" : "gemini-1.5-flash";

  // AI Call
  const genAI = new GoogleGenerativeAI(geminiKey);
  const model = genAI.getGenerativeModel({ model: modelName, systemInstruction });
  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  // Save Cache
  await supabase.from('ai_cache').insert({
    prompt,
    system_instruction: systemInstruction || '',
    response: responseText,
    model: modelName,
    tool_id: toolId
  });

  return { response: responseText, model: modelName, cached: false };
}
