/**
 * gemini-rotate.ts
 * Gemini APIキーを3つローテーションして呼び出す共通ユーティリティ
 * GEMINI_API_KEY_1, GEMINI_API_KEY_2, GEMINI_API_KEY_3 の順に試す
 * 全て失敗した場合はエラーメッセージ文字列を返す（throwしない）
 */

const GEMINI_KEYS = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
].filter(Boolean) as string[]

/**
 * 有効なGemini APIキーを1つ返す（ローテーション済み）
 * fetch直接呼び出し用
 */
export function getGeminiKey(): string | null {
  return GEMINI_KEYS[0] ?? null
}

/**
 * Gemini REST APIをキーローテーションで呼び出す
 * 429(quota)/503等はfallbackして次のキーを試す
 * 全キー失敗時はエラーメッセージ文字列を返す（throwしない）
 */
export async function callGeminiWithRotation(
  prompt: string,
  model = 'gemini-1.5-flash'
): Promise<string> {
  if (GEMINI_KEYS.length === 0) {
    return '（Gemini APIキー未設定: GEMINI_API_KEY_1/2/3 を環境変数に追加してください）'
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
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.3, maxOutputTokens: 1024 },
          }),
        }
      )

      if (!res.ok) {
        const status = res.status
        if (status === 429 || status === 503) {
          // クォータ超過 or サービス停止 → 次のキーへ
          errors.push(`Key${i + 1}: ${status}`)
          continue
        }
        // その他のエラーは即時終了
        errors.push(`Key${i + 1}: HTTP ${status}`)
        return `（Gemini APIエラー: ${errors.join(', ')}）`
      }

      const data = await res.json()
      return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '(回答なし)'
    } catch (e: any) {
      errors.push(`Key${i + 1}: ${e.message ?? 'network error'}`)
      continue
    }
  }

  return `（Gemini API全キー失敗: ${errors.join(', ')}）`
}

/**
 * GoogleGenerativeAI SDK用: ローテーションしながら generateContent を実行
 * sdk (@google/generative-ai) が使えるサーバーサイド環境向け
 */
export async function callGeminiSDKWithRotation(
  prompt: string,
  systemInstruction?: string,
  model = 'gemini-2.5-flash'
): Promise<string> {
  if (GEMINI_KEYS.length === 0) {
    throw new Error('Gemini APIキー未設定: GEMINI_API_KEY_1/2/3 を環境変数に追加してください')
  }

  // dynamic import for edge compatibility
  const { GoogleGenerativeAI } = await import('@google/generative-ai')

  const errors: string[] = []

  for (let i = 0; i < GEMINI_KEYS.length; i++) {
    const key = GEMINI_KEYS[i]
    try {
      const genAI = new GoogleGenerativeAI(key)
      const geminiModel = genAI.getGenerativeModel({ model, systemInstruction })
      const result = await geminiModel.generateContent(prompt)
      return result.response.text()
    } catch (e: any) {
      const msg = e?.message ?? 'unknown'
      // 429 / quota_exceeded は次のキーへ
      if (msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
        errors.push(`Key${i + 1}: quota`)
        continue
      }
      // その他は即時throw
      throw new Error(`Gemini SDK Error (Key${i + 1}): ${msg}`)
    }
  }

  throw new Error(`Gemini API全キー失敗: ${errors.join(', ')}`)
}
