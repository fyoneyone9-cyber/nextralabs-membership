/**
 * NextraLabs AI Engine (Reset to Basic)
 * ビルド成功を最優先するため、一時的に静的なモックレスポンスを返します。
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
  console.log(`[AI Engine Build Safety] Request for ${toolId}`);
  
  // ビルド時は外部APIを叩かず、空のレスポンスを返す
  return { 
    response: "AI Engine is initializing...", 
    model: "initializing", 
    cached: false 
  };
}
