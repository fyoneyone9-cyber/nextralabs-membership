/**
 * gemini-rotate.ts
 * Gemini APIkey rotation utility (3 keys: GEMINI_API_KEY_1/2/3)
 * Falls back to next key on 429/503. Returns error string (no throw).
 */

const GEMINI_KEYS = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
].filter(Boolean) as string[]

export async function callGeminiWithRotation(
  prompt: string,
  model = 'gemini-2.5-flash'
): Promise<string> {
  if (GEMINI_KEYS.length === 0) {
    return '(Gemini APIキー未設定: GEMINI_API_KEY_1/2/3 を環境変数に追加してください)'
  }
  const errors: string[] = []
  for (let i = 0; i < GEMINI_KEYS.length; i++) {
    const key = GEMINI_KEYS[i]
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: 'You are a helpful assistant. Always respond in Japanese.' }] },
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.3, maxOutputTokens: 4096 },
          }),
        }
      )
      if (!res.ok) {
        const status = res.status
        if (status === 429 || status === 503) { errors.push(`Key${i + 1}:${status}`); continue }
        errors.push(`Key${i + 1}:HTTP${status}`)
        return `(Gemini APIエラー: ${errors.join(', ')})`
      }
      const data = await res.json()
      return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '(回答なし)'
    } catch (e: any) {
      errors.push(`Key${i + 1}:${e.message ?? 'network error'}`)
      continue
    }
  }
  return `(Gemini 全キー失敗: ${errors.join(', ')})`
}

export async function callGeminiSDKWithRotation(
  prompt: string,
  systemInstruction?: string,
  model = 'gemini-2.5-flash'
): Promise<string> {
  if (GEMINI_KEYS.length === 0) {
    throw new Error('Gemini APIキー未設定: GEMINI_API_KEY_1/2/3 を環境変数に追加してください')
  }
  const { GoogleGenerativeAI } = await import('@google/generative-ai')
  const si = systemInstruction ?? 'Always respond in Japanese.'
  const errors: string[] = []
  for (let i = 0; i < GEMINI_KEYS.length; i++) {
    const key = GEMINI_KEYS[i]
    try {
      const genAI = new GoogleGenerativeAI(key)
      const geminiModel = genAI.getGenerativeModel({ model, systemInstruction: si })
      const result = await geminiModel.generateContent(prompt)
      return result.response.text()
    } catch (e: any) {
      const msg = e?.message ?? 'unknown'
      if (msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
        errors.push(`Key${i + 1}:quota`); continue
      }
      throw new Error(`Gemini SDK Error (Key${i + 1}): ${msg}`)
    }
  }
  throw new Error(`Gemini 全キー失敗: ${errors.join(', ')}`)
}