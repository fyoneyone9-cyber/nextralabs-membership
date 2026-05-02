'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

// ─── AI選択肢 ────────────────────────────────────────────
const AI_OPTIONS = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    icon: '🤖',
    color: '#10a37f',
    hoverColor: '#0d8a6b',
    url: 'https://chat.openai.com',
    description: 'GPT-4oで返信草稿・要約',
  },
  {
    id: 'claude',
    name: 'Claude',
    icon: '✨',
    color: '#7c3aed',
    hoverColor: '#6d28d9',
    url: 'https://claude.ai',
    description: '長文解析・ニュアンス把握に強い',
  },
  {
    id: 'gemini',
    name: 'Gemini',
    icon: '♊',
    color: '#1a73e8',
    hoverColor: '#1557b0',
    url: 'https://gemini.google.com',
    description: 'Google Geminiで高速解析',
  },
  {
    id: 'genspark',
    name: 'Genspark AI',
    icon: '⚡',
    color: '#f97316',
    hoverColor: '#ea580c',
    url: 'https://www.genspark.ai',
    description: 'Genspark AIで解析',
  },
]

// ─── プロンプトテンプレート ────────────────────────────────
const PROMPT_TEMPLATES = [
  {
    id: 'reply',
    label: '📝 返信文を作成',
    prompt: (subject: string, body: string) =>
      `以下のメールに対して、丁寧でビジネスライクな返信文を日本語で作成してください。\n\n件名: ${subject || '（件名なし）'}\n\n---メール本文---\n${body}\n---ここまで---\n\n返信文のみ出力してください。`,
  },
  {
    id: 'summary',
    label: '📋 要点を箇条書きでまとめる',
    prompt: (subject: string, body: string) =>
      `以下のメールの要点を、箇条書きで簡潔にまとめてください。\n\n件名: ${subject || '（件名なし）'}\n\n---メール本文---\n${body}\n---ここまで---`,
  },
  {
    id: 'tasks',
    label: '✅ タスクを抽出する',
    prompt: (subject: string, body: string) =>
      `以下のメールから、対応が必要なタスクや確認事項を抽出し、期限と担当者を含めて一覧化してください。\n\n件名: ${subject || '（件名なし）'}\n\n---メール本文---\n${body}\n---ここまで---`,
  },
  {
    id: 'translate',
    label: '🌐 日本語に翻訳する',
    prompt: (subject: string, body: string) =>
      `以下のメールを自然な日本語に翻訳してください。\n\n件名: ${subject || '（件名なし）'}\n\n---メール本文---\n${body}\n---ここまで---`,
  },
  {
    id: 'custom',
    label: '✏️ カスタム指示',
    prompt: (_subject: string, body: string) => body,
  },
]

// ─── メインコンポーネント ──────────────────────────────────
function GatePageContent() {
  const searchParams = useSearchParams()

  const [emailBody, setEmailBody] = useState('')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailFrom, setEmailFrom] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('reply')
  const [customInstruction, setCustomInstruction] = useState('')
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [copied, setCopied] = useState(false)
  const [isTruncated, setIsTruncated] = useState(false)

  useEffect(() => {
    const text = searchParams.get('text') || ''
    const subject = searchParams.get('subject') || ''
    const from = searchParams.get('from') || ''
    const truncated = searchParams.get('truncated') === '1'

    setEmailBody(text)
    setEmailSubject(subject)
    setEmailFrom(from)
    setIsTruncated(truncated)
  }, [searchParams])

  // プロンプトを生成
  useEffect(() => {
    const template = PROMPT_TEMPLATES.find(t => t.id === selectedTemplate)
    if (!template) return

    if (selectedTemplate === 'custom') {
      const instruction = customInstruction.trim()
      setGeneratedPrompt(
        instruction
          ? `${instruction}\n\n件名: ${emailSubject || '（件名なし）'}\n\n---メール本文---\n${emailBody}\n---ここまで---`
          : emailBody
      )
    } else {
      setGeneratedPrompt(template.prompt(emailSubject, emailBody))
    }
  }, [selectedTemplate, emailBody, emailSubject, customInstruction])

  const handleCopy = async () => {
    if (!generatedPrompt) return
    await navigator.clipboard.writeText(generatedPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleOpenAI = (aiUrl: string) => {
    window.open(aiUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="min-h-screen bg-[#0a0a14] text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#0f0f1a]">
        <div className="max-w-3xl mx-auto px-4 py-5">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🤖</span>
            <div>
              <h1 className="text-xl font-bold">NextRaLabs Gmail AI</h1>
              <p className="text-xs text-gray-400">メールを解析して返信・要約・タスク抽出</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

        {/* メール情報 */}
        {(emailSubject || emailFrom) && (
          <div className="bg-[#13131e] border border-gray-800 rounded-xl p-4 space-y-1">
            {emailFrom && (
              <p className="text-xs text-gray-400">
                <span className="text-gray-500">差出人: </span>{emailFrom}
              </p>
            )}
            {emailSubject && (
              <p className="text-sm font-medium">
                <span className="text-gray-400 text-xs">件名: </span>{emailSubject}
              </p>
            )}
            {isTruncated && (
              <p className="text-xs text-amber-400 mt-1">
                ⚠️ 本文が長いため先頭2,000文字のみ取得しています
              </p>
            )}
          </div>
        )}

        {/* メール本文表示・編集 */}
        <div>
          <label className="block text-sm font-medium mb-2">
            📧 メール本文
            <span className="text-xs text-gray-500 ml-2">（編集可能）</span>
          </label>
          <textarea
            value={emailBody}
            onChange={e => setEmailBody(e.target.value)}
            placeholder="Gmailからメール本文が自動入力されます。\n手動で貼り付けることも可能です。"
            rows={8}
            className="w-full bg-[#13131e] border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-300 focus:border-orange-500 focus:outline-none resize-y"
          />
          <p className="text-xs text-gray-600 mt-1">{emailBody.length}文字</p>
        </div>

        {/* テンプレート選択 */}
        <div>
          <label className="block text-sm font-medium mb-2">🎯 解析の種類を選ぶ</label>
          <div className="grid grid-cols-2 gap-2">
            {PROMPT_TEMPLATES.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t.id)}
                className={`px-3 py-2.5 rounded-xl border text-sm text-left transition-all ${
                  selectedTemplate === t.id
                    ? 'bg-orange-500/15 border-orange-500 text-orange-300'
                    : 'bg-[#13131e] border-gray-700 hover:border-gray-500 text-gray-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* カスタム指示入力 */}
          {selectedTemplate === 'custom' && (
            <textarea
              value={customInstruction}
              onChange={e => setCustomInstruction(e.target.value)}
              placeholder="例: このメールの問題点を指摘し、改善案を3つ提案してください"
              rows={3}
              className="mt-2 w-full bg-[#13131e] border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-300 focus:border-orange-500 focus:outline-none resize-none"
            />
          )}
        </div>

        {/* 生成されたプロンプト */}
        {generatedPrompt && (
          <div>
            <label className="block text-sm font-medium mb-2">
              📋 生成されたプロンプト
              <span className="text-xs text-gray-500 ml-2">（コピーしてAIに貼り付け）</span>
            </label>
            <div className="bg-[#13131e] border border-gray-700 rounded-xl p-4 space-y-3">
              <textarea
                value={generatedPrompt}
                readOnly
                rows={10}
                className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-300 resize-none focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
              >
                {copied ? '✅ コピーしました！' : '📋 プロンプトをコピー'}
              </button>
            </div>
          </div>
        )}

        {/* AI選択 & ジャンプ */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <p className="text-sm font-medium">🚀 AIを選んで解析</p>
            <p className="text-xs text-gray-500">プロンプトをコピー後、AIに貼り付けてください</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {AI_OPTIONS.map(ai => (
              <button
                key={ai.id}
                onClick={() => handleOpenAI(ai.url)}
                className="flex items-center gap-3 px-4 py-3 bg-[#13131e] border border-gray-700 rounded-xl text-sm transition-all hover:border-gray-500 hover:bg-[#1a1a2e] text-left"
              >
                <span className="text-2xl">{ai.icon}</span>
                <div>
                  <div className="font-medium">{ai.name}</div>
                  <div className="text-xs text-gray-500">{ai.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 使い方ガイド */}
        <div className="bg-[#13131e] border border-gray-800 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-400 mb-2">📖 使い方</p>
          <ol className="text-xs text-gray-500 space-y-1 list-decimal list-inside">
            <li>解析の種類を選ぶ（返信作成・要約・タスク抽出など）</li>
            <li>「プロンプトをコピー」ボタンをクリック</li>
            <li>ChatGPT / Claude / Gemini のボタンで対象AIを開く</li>
            <li>AIの入力欄にプロンプトを貼り付けて送信</li>
          </ol>
        </div>

      </div>
    </div>
  )
}

export default function GatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a14] text-gray-100 flex items-center justify-center">
        <div className="text-gray-400">読み込み中...</div>
      </div>
    }>
      <GatePageContent />
    </Suspense>
  )
}
