'use client'

import { useState } from 'react'

// ===================== Types =====================
interface CheckItem {
  id: string
  label: string
}

interface StepData {
  stepNumber: number
  title: string
  items: CheckItem[]
  hints: { color: 'blue' | 'yellow' | 'green' | 'purple'; text: string }[]
  subsections?: { title: string; items: CheckItem[] }[]
}

// ===================== Step Data =====================
const steps: StepData[] = [
  {
    stepNumber: 1,
    title: 'KDPアカウントの初期設定',
    items: [
      { id: 's1-1', label: 'KDP公式サイト (kdp.amazon.co.jp) にAmazonアカウントでログインした' },
      { id: 's1-2', label: '著者情報（本名・住所）を登録した' },
      { id: 's1-3', label: '銀行口座（売上受取口座）を登録した' },
      { id: 's1-4', label: '税務情報インタビューに回答した' },
      { id: 's1-5', label: 'マイナンバーを入力して源泉徴収を0%にした' },
    ],
    hints: [
      { color: 'blue', text: '💡 マイナンバーを入力すると、米国での源泉徴収（通常30%）が0%になります。売上に直結するので必ず設定しましょう。' },
    ],
  },
  {
    stepNumber: 2,
    title: '出版データの作成',
    items: [
      { id: 's2-1', label: '原稿をWord（.docx）またはEPUB形式で作成した' },
      { id: 's2-2', label: '表紙画像を作成した（推奨: 2,560×1,600px）' },
      { id: 's2-3', label: 'Kindle Previewer（無料）でスマホ表示を確認した' },
    ],
    hints: [
      { color: 'yellow', text: '📖 文章メインの本はWordで十分。漫画・写真集はKindle Comic Creatorを使うときれいに仕上がります。' },
      { color: 'yellow', text: '🎨 表紙は読者が最初に目にする重要データ。Canvaなどの無料ツールで作るのがおすすめです。' },
    ],
  },
  {
    stepNumber: 3,
    title: '本の登録・出版申請',
    items: [],
    subsections: [
      {
        title: '① Kindle本の詳細',
        items: [
          { id: 's3-1', label: 'タイトル・著者名（ペンネーム可）を入力した' },
          { id: 's3-2', label: '内容紹介文を入力した（Amazonページに表示される説明文）' },
          { id: 's3-3', label: 'キーワードを最大7つ設定した' },
        ],
      },
      {
        title: '② Kindle本のコンテンツ',
        items: [
          { id: 's3-4', label: '原稿ファイルをアップロードした' },
          { id: 's3-5', label: '表紙画像をアップロードした' },
          { id: 's3-6', label: 'プレビューアーで表示確認をした' },
        ],
      },
      {
        title: '③ 価格設定',
        items: [
          { id: 's3-7', label: 'KDPセレクトへの登録を検討した（Kindle Unlimited対象になる）' },
          { id: 's3-8', label: 'ロイヤリティ率を選択した（70%推奨: 価格250円〜1,250円が条件）' },
          { id: 's3-9', label: '販売価格を設定した' },
        ],
      },
    ],
    hints: [
      { color: 'green', text: '💰 70%ロイヤリティを選ぶには価格を250〜1,250円に設定する必要があります。初心者はKDPセレクト登録がおすすめ（Kindle Unlimitedの読まれたページ数に応じて報酬あり）。' },
    ],
  },
  {
    stepNumber: 4,
    title: '出版申請',
    items: [
      { id: 's4-1', label: '「Kindle本を出版」ボタンをクリックした' },
      { id: 's4-2', label: '審査完了メールを待っている（通常24〜72時間）' },
    ],
    hints: [
      { color: 'purple', text: '🌍 審査が完了すると、日本だけでなく世界中のAmazonストアに自動で並びます。' },
    ],
  },
]

// ===================== Helpers =====================
function getHintStyle(color: 'blue' | 'yellow' | 'green' | 'purple') {
  switch (color) {
    case 'blue':
      return 'border-blue-500 bg-blue-500/10 text-blue-300'
    case 'yellow':
      return 'border-yellow-500 bg-yellow-500/10 text-yellow-300'
    case 'green':
      return 'border-green-500 bg-green-500/10 text-green-300'
    case 'purple':
      return 'border-purple-500 bg-purple-500/10 text-purple-300'
  }
}

// ===================== Affiliate Banner =====================
function AffiliateBanner() {
  return (
    <a
      href="https://amzn.to/4ejfQ5J"
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="flex items-center gap-2 w-full mt-4 px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 hover:bg-gray-750 hover:border-gray-600 transition-colors text-sm text-gray-300"
    >
      <span className="text-[10px] text-gray-500 mr-1">PR</span>
      📚 KDP出版と並行して読んでおきたい — Amazon Kindle ストアで探す
      <span className="ml-auto text-gray-500">→</span>
    </a>
  )
}

// ===================== Main Component =====================
export default function KdpGuide() {
  const [currentStep, setCurrentStep] = useState(0) // 0-based index; 4 = done
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    's3-section-0': true,
    's3-section-1': false,
    's3-section-2': false,
  })

  const isDone = currentStep >= steps.length
  const step = !isDone ? steps[currentStep] : null

  // Collect all item IDs for current step
  function getStepItemIds(s: StepData): string[] {
    if (s.subsections) {
      return s.subsections.flatMap((sub) => sub.items.map((i) => i.id))
    }
    return s.items.map((i) => i.id)
  }

  const allChecked = step
    ? getStepItemIds(step).every((id) => checked[id])
    : false

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function toggleSection(key: string) {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  function reset() {
    setCurrentStep(0)
    setChecked({})
    setOpenSections({ 's3-section-0': true, 's3-section-1': false, 's3-section-2': false })
  }

  // ---- Progress Bar ----
  const progressSteps = [...steps.map((s) => s.stepNumber), '✓']
  function stepStatus(idx: number) {
    if (idx < currentStep) return 'done'
    if (idx === currentStep) return 'active'
    return 'pending'
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">📗 KDP出版ナビ</h1>
          <p className="text-gray-400 text-sm">Amazon Kindle出版の手順をステップ形式でガイド</p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-center gap-1 mb-8 overflow-x-auto pb-2">
          {progressSteps.map((label, idx) => {
            const status = isDone && idx === progressSteps.length - 1 ? 'active' : stepStatus(idx)
            return (
              <div key={idx} className="flex items-center">
                <div
                  className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                    status === 'done'
                      ? 'bg-green-600 border-green-500 text-white'
                      : status === 'active'
                      ? 'bg-blue-600 border-blue-400 text-white'
                      : 'bg-gray-800 border-gray-600 text-gray-500'
                  }`}
                >
                  {status === 'done' && idx < steps.length ? '✓' : label}
                </div>
                {idx < progressSteps.length - 1 && (
                  <div
                    className={`w-6 h-1 mx-0.5 rounded transition-all ${
                      idx < currentStep ? 'bg-green-600' : 'bg-gray-700'
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Done Screen */}
        {isDone ? (
          <div className="bg-gray-900 rounded-2xl border border-gray-700 p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-4">おめでとうございます！</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              あなたの本がAmazonに並ぶまであと少し！<br />
              審査完了メールをお待ちください。
            </p>
            <button
              onClick={reset}
              className="px-6 py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-100 font-medium transition-colors"
            >
              最初からやり直す
            </button>
            <AffiliateBanner />
          </div>
        ) : (
          /* Step Card */
          <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 md:p-8">
            {/* Step Title */}
            <div className="flex items-center gap-3 mb-6">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
                {step!.stepNumber}
              </span>
              <h2 className="text-xl font-bold">{step!.title}</h2>
            </div>

            {/* Checklist — flat items */}
            {step!.items.length > 0 && (
              <ul className="space-y-3 mb-6">
                {step!.items.map((item) => (
                  <li key={item.id} className="flex items-start gap-3 cursor-pointer" onClick={() => toggle(item.id)}>
                    <input
                      type="checkbox"
                      checked={!!checked[item.id]}
                      onChange={() => toggle(item.id)}
                      className="w-5 h-5 mt-0.5 flex-shrink-0 accent-blue-500 cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span
                      className={`text-sm leading-relaxed transition-colors ${
                        checked[item.id] ? 'line-through text-gray-500' : 'text-gray-200'
                      }`}
                    >
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {/* Subsections (Step 3) */}
            {step!.subsections && (
              <div className="space-y-4 mb-6">
                {step!.subsections.map((sub, subIdx) => {
                  const key = `s3-section-${subIdx}`
                  const isOpen = openSections[key]
                  const subAllChecked = sub.items.every((i) => checked[i.id])
                  return (
                    <div key={key} className="border border-gray-700 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleSection(key)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-800 hover:bg-gray-750 transition-colors text-left"
                      >
                        <span className="font-semibold text-sm flex items-center gap-2">
                          {sub.title}
                          {subAllChecked && <span className="text-green-400 text-xs">✓ 完了</span>}
                        </span>
                        <span className="text-gray-400 text-xs">{isOpen ? '▲' : '▼'}</span>
                      </button>
                      {isOpen && (
                        <ul className="space-y-3 px-4 py-4 bg-gray-900">
                          {sub.items.map((item) => (
                            <li key={item.id} className="flex items-start gap-3 cursor-pointer" onClick={() => toggle(item.id)}>
                              <input
                                type="checkbox"
                                checked={!!checked[item.id]}
                                onChange={() => toggle(item.id)}
                                className="w-5 h-5 mt-0.5 flex-shrink-0 accent-blue-500 cursor-pointer"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <span
                                className={`text-sm leading-relaxed transition-colors ${
                                  checked[item.id] ? 'line-through text-gray-500' : 'text-gray-200'
                                }`}
                              >
                                {item.label}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Hint Boxes */}
            <div className="space-y-3 mb-6">
              {step!.hints.map((hint, i) => (
                <div
                  key={i}
                  className={`border-l-4 px-4 py-3 rounded-r-lg text-sm leading-relaxed ${getHintStyle(hint.color)}`}
                >
                  {hint.text}
                </div>
              ))}
            </div>

            {/* Affiliate Banner */}
            <AffiliateBanner />

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
                disabled={currentStep === 0}
                className="px-5 py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium transition-colors"
              >
                ← 前へ
              </button>

              <span className="text-xs text-gray-500">
                {currentStep + 1} / {steps.length}
              </span>

              <button
                onClick={() => setCurrentStep((s) => s + 1)}
                disabled={!allChecked}
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium transition-colors"
              >
                {currentStep === steps.length - 1 ? '完了 🎉' : '次へ →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
