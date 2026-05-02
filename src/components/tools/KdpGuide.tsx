'use client'

import { useState } from 'react'

// ===================== Types =====================
interface CheckItem {
  id: string
  label: string
  detail?: string
  link?: { text: string; url: string }
  warning?: string
}

interface SubSection {
  title: string
  items: CheckItem[]
}

interface StepData {
  stepNumber: number
  title: string
  items: CheckItem[]
  hints: { color: 'blue' | 'yellow' | 'green' | 'purple'; text: string }[]
  subsections?: SubSection[]
}

// ===================== Step Data =====================
const steps: StepData[] = [
  {
    stepNumber: 1,
    title: 'KDPアカウントの初期設定',
    items: [
      {
        id: 's1-1',
        label: 'KDP公式サイトにAmazonアカウントでログインした',
        detail: 'kdp.amazon.co.jp にアクセスし、既存のAmazonアカウントでサインイン。Amazonアカウントをお持ちでない場合は新規作成が必要です。',
        link: { text: 'KDP公式サイトを開く', url: 'https://kdp.amazon.co.jp' },
      },
      {
        id: 's1-2',
        label: '著者情報（本名・住所）を登録した',
        detail: 'ログイン後、右上のアカウント名 →「アカウント情報」をクリック。「著者/出版社情報」欄に本名と住所（日本語可）を入力して保存。',
        warning: 'ペンネームで出版する場合も、この欄は本名を入力。ペンネームは本の登録時に「著者名」として別途設定できます。',
      },
      {
        id: 's1-3',
        label: '銀行口座（売上受取口座）を登録した',
        detail: '「アカウント情報」→「支払い情報を取得する」をクリック。銀行名・支店名・口座番号・口座名義（カタカナ）を入力。審査に1〜3営業日かかります。',
        warning: '口座名義はカタカナで登録してください。漢字だと登録エラーになる場合があります。',
      },
      {
        id: 's1-4',
        label: '税務情報インタビューに回答した',
        detail: '「アカウント情報」→「税務情報」→「インタビューを開始」をクリック。「個人」「日本居住者」を選択して進む。全質問に回答して送信します。',
        warning: '英語画面で進む場合がありますが、選択肢は「Individual（個人）」「Japan」を選べばOKです。',
      },
      {
        id: 's1-5',
        label: 'マイナンバーを入力して源泉徴収を0%にした',
        detail: '税務情報インタビューの途中、「日本の納税者番号（マイナンバー）をお持ちですか？」の質問で「はい」を選択し、12桁のマイナンバーを入力。',
        link: { text: 'マイナポータルでマイナンバー確認', url: 'https://myna.go.jp' },
        warning: 'ここをスキップすると売上の30%が米国に源泉徴収されます。必ず入力しましょう。',
      },
    ],
    hints: [
      { color: 'blue', text: '💡 マイナンバーを入力すると、米国での源泉徴収（通常30%）が0%になります。売上に直結するので必ず設定しましょう。' },
      { color: 'blue', text: '⏱ アカウント設定は初回のみ。一度登録すれば2冊目以降はすぐ出版できます。' },
    ],
  },
  {
    stepNumber: 2,
    title: '出版データの作成',
    items: [
      {
        id: 's2-1',
        label: '原稿をWord（.docx）またはEPUB形式で作成した',
        detail: 'Wordの場合：見出しスタイル（見出し1/2）を使って章立てするとKindleの目次が自動生成されます。フォントはデフォルトのままでOK。EPUBの場合：Calibreなどの無料ツールで変換できます。',
        link: { text: 'Kindle用Wordテンプレート（Amazon公式）', url: 'https://kdp.amazon.co.jp/ja_JP/help/topic/G200645680' },
        warning: '画像を多用する場合はファイルサイズに注意。1ファイルあたり650MB以内が上限です。',
      },
      {
        id: 's2-2',
        label: '表紙画像を作成した（推奨: 2,560×1,600px）',
        detail: 'サイズは縦2,560px × 横1,600px（比率1.6:1）が推奨。JPEGまたはTIFF形式で保存。Canva（無料）で「Kindle表紙」と検索するとテンプレートが豊富に揃っています。',
        link: { text: 'Canvaで表紙を作る（無料）', url: 'https://www.canva.com/ja_jp/create/book-covers/' },
        warning: 'テキストが小さすぎると縮小表示で読めなくなります。タイトルは大きめのフォントで。',
      },
      {
        id: 's2-3',
        label: 'Kindle Previewerでスマホ表示を確認した',
        detail: 'Amazon公式の無料ツール「Kindle Previewer 3」をPCにインストールし、原稿ファイルを読み込むとスマホ・タブレット・PC表示をシミュレートできます。文字崩れや画像ズレをここで確認しましょう。',
        link: { text: 'Kindle Previewer 3をダウンロード（無料）', url: 'https://www.amazon.com/gp/feature.html?ie=UTF8&docId=1000765261' },
        warning: 'Wordで作成した場合、箇条書きのインデントがズレることがあります。Previewerで必ず確認を。',
      },
    ],
    hints: [
      { color: 'yellow', text: '📖 文章メインの本はWordで十分。漫画・写真集はKindle Comic Creatorを使うときれいに仕上がります。' },
      { color: 'yellow', text: '🎨 表紙クオリティは売上に直結します。Canvaの有料テンプレート（数百円）を使うのもおすすめです。' },
    ],
  },
  {
    stepNumber: 3,
    title: '本の登録',
    items: [],
    subsections: [
      {
        title: '① Kindle本の詳細',
        items: [
          {
            id: 's3-1',
            label: 'タイトル・著者名を入力した',
            detail: 'KDPダッシュボード →「新しいタイトルを作成」→「Kindle電子書籍」をクリック。タイトルは検索されやすいキーワードを含めると効果的。著者名はペンネーム可。',
            link: { text: 'KDPダッシュボードを開く', url: 'https://kdp.amazon.co.jp/title-setup/kindle/new/details' },
          },
          {
            id: 's3-2',
            label: '内容紹介文を入力した',
            detail: '「内容紹介」欄に本の説明文を入力（4,000文字以内）。最初の2〜3文が検索結果に表示されるので、読者の興味を引く一文から始めましょう。HTMLタグ（&lt;b&gt;、&lt;br&gt;など）も使えます。',
            warning: '紹介文はAmazon商品ページに直接表示されます。誤字脱字は購買率に影響するので丁寧に書きましょう。',
          },
          {
            id: 's3-3',
            label: 'キーワードを最大7つ設定した',
            detail: '検索キーワードを最大7つ登録できます。読者が検索しそうな単語（例：「副業」「在宅ワーク」「初心者」など）を具体的に入力。タイトルや著者名と重複するキーワードは登録不要です。',
            warning: 'ブランド名・著名人名・他の商品名はキーワードに使用禁止（Amazonポリシー違反）。',
          },
        ],
      },
      {
        title: '② Kindle本のコンテンツ',
        items: [
          {
            id: 's3-4',
            label: '原稿ファイルをアップロードした',
            detail: '「Kindle本のコンテンツ」タブ →「原稿をアップロード」ボタンをクリック。.docx / .epub / .pdf など対応形式のファイルを選択してアップロード（数秒〜数分）。',
            warning: 'PDFは変換精度が低く、文字崩れが起きやすいです。できるだけWordかEPUBを使いましょう。',
          },
          {
            id: 's3-5',
            label: '表紙画像をアップロードした',
            detail: '「表紙をアップロード」ボタンから、作成したJPEGまたはTIFF画像を選択。自動的にKindle用サイズに最適化されます。',
            warning: '表紙なしでも出版できますが、ほぼ確実に売れません。必ず作成・アップロードしてください。',
          },
          {
            id: 's3-6',
            label: 'オンラインプレビューアーで表示確認をした',
            detail: 'アップロード後に「プレビューアーを起動」ボタンが表示されます。スマホ・タブレット・Kindle端末の各表示を確認。問題があれば原稿を修正して再アップロード。',
          },
        ],
      },
      {
        title: '③ 価格設定',
        items: [
          {
            id: 's3-7',
            label: 'KDPセレクトへの登録を検討した',
            detail: 'KDPセレクトに登録するとKindle Unlimited（読み放題）の対象になり、読まれたページ数に応じて報酬が発生します。ただし90日間は他のプラットフォームでの独占販売が条件です。',
            warning: 'KDPセレクト登録中は、楽天Koboやhontoなどでの同時販売ができません。',
          },
          {
            id: 's3-8',
            label: 'ロイヤリティ率を選択した（70%推奨）',
            detail: '価格が250円〜1,250円の場合は70%ロイヤリティを選択できます。それ以外の価格帯は35%になります。初心者は250〜500円で70%を狙うのがおすすめ。',
            warning: '35%ロイヤリティは価格の自由度が高い分、収益が半減します。特別な理由がなければ70%を選びましょう。',
          },
          {
            id: 's3-9',
            label: '販売価格を設定した',
            detail: '「日本」マーケットプレイスに価格を入力すると、他の国のストアに自動換算された価格が表示されます。内容に自信があれば250〜500円、専門書なら500〜1,000円が目安です。',
          },
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
      {
        id: 's4-1',
        label: '「Kindle本を出版」ボタンをクリックした',
        detail: '価格設定ページの最下部にある「Kindle本を出版」ボタンをクリック。確認画面が表示されたら「出版」を選択。これで審査に進みます。',
        warning: '出版後72時間以内は価格変更・内容修正が反映されるまで時間がかかります。誤字があればすぐ修正申請を。',
      },
      {
        id: 's4-2',
        label: '審査完了メールを確認した（通常24〜72時間）',
        detail: '登録したAmazonアカウントのメールアドレスに審査完了通知が届きます。承認されると自動的に各国のAmazonストアに掲載されます。KDPダッシュボードで「公開済み」になったことを確認しましょう。',
        link: { text: 'KDPダッシュボードで状況確認', url: 'https://kdp.amazon.co.jp/bookshelf' },
        warning: '審査が通らない場合（コンテンツポリシー違反など）は却下メールが届きます。理由を確認して修正・再申請してください。',
      },
    ],
    hints: [
      { color: 'purple', text: '🌍 審査が完了すると、日本だけでなく世界中のAmazonストアに自動で並びます。' },
      { color: 'purple', text: '📊 出版後はKDPダッシュボードで売上・ページ読了数をリアルタイムで確認できます。' },
    ],
  },
]

// ===================== Helpers =====================
function getHintStyle(color: 'blue' | 'yellow' | 'green' | 'purple') {
  switch (color) {
    case 'blue':   return 'border-blue-500 bg-blue-500/10 text-blue-300'
    case 'yellow': return 'border-yellow-500 bg-yellow-500/10 text-yellow-300'
    case 'green':  return 'border-green-500 bg-green-500/10 text-green-300'
    case 'purple': return 'border-purple-500 bg-purple-500/10 text-purple-300'
  }
}

// ===================== CheckItem Row =====================
function CheckRow({
  item,
  checked,
  onToggle,
}: {
  item: CheckItem
  checked: boolean
  onToggle: () => void
}) {
  return (
    <li className="pb-3 border-b border-gray-800 last:border-0">
      {/* Checkbox + Label */}
      <div className="flex items-start gap-3 cursor-pointer" onClick={onToggle}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="w-5 h-5 mt-0.5 flex-shrink-0 accent-blue-500 cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        />
        <span
          className={`text-sm leading-relaxed font-medium transition-colors ${
            checked ? 'line-through text-gray-500' : 'text-gray-100'
          }`}
        >
          {item.label}
        </span>
      </div>

      {/* Detail / Link / Warning */}
      {(item.detail || item.link || item.warning) && (
        <div className="ml-8 mt-2 space-y-2">
          {item.detail && (
            <p className="text-xs text-gray-400 leading-relaxed">{item.detail}</p>
          )}
          {item.link && (
            <a
              href={item.link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 underline underline-offset-2"
              onClick={(e) => e.stopPropagation()}
            >
              🔗 {item.link.text} →
            </a>
          )}
          {item.warning && (
            <p className="text-xs text-orange-400 leading-relaxed">⚠️ {item.warning}</p>
          )}
        </div>
      )}
    </li>
  )
}

// ===================== Affiliate Banner =====================
function AffiliateBanner() {
  return (
    <a
      href="https://www.amazon.co.jp/s?k=副業+在宅+ツール&tag=nextralabs-22"
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="flex items-center gap-2 w-full mt-4 px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 hover:bg-gray-750 hover:border-gray-600 transition-colors text-sm text-gray-300"
    >
      <span className="text-[10px] text-gray-500 mr-1">PR</span>
      💰 副業で稼いでいる人が使っているものを見る
      <span className="ml-auto text-gray-500 text-xs">チェックする →</span>
    </a>
  )
}

// ===================== Main Component =====================
export default function KdpGuide() {
  const [currentStep, setCurrentStep] = useState(0)
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    's3-section-0': true,
    's3-section-1': false,
    's3-section-2': false,
  })

  const isDone = currentStep >= steps.length
  const step = !isDone ? steps[currentStep] : null

  function getStepItemIds(s: StepData): string[] {
    if (s.subsections) {
      return s.subsections.flatMap((sub) => sub.items.map((i) => i.id))
    }
    return s.items.map((i) => i.id)
  }

  const allChecked = step ? getStepItemIds(step).every((id) => checked[id]) : false

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
          <h1 className="text-3xl font-bold mb-2">📗 Kindle出版手順ナビ</h1>
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
                  <div className={`w-6 h-1 mx-0.5 rounded transition-all ${idx < currentStep ? 'bg-green-600' : 'bg-gray-700'}`} />
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
          <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 md:p-8">

            {/* Step Title */}
            <div className="flex items-center gap-3 mb-6">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
                {step!.stepNumber}
              </span>
              <h2 className="text-xl font-bold">{step!.title}</h2>
            </div>

            {/* Flat checklist */}
            {step!.items.length > 0 && (
              <ul className="space-y-0 mb-6">
                {step!.items.map((item) => (
                  <CheckRow
                    key={item.id}
                    item={item}
                    checked={!!checked[item.id]}
                    onToggle={() => toggle(item.id)}
                  />
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
                        <ul className="space-y-0 px-4 py-4 bg-gray-900">
                          {sub.items.map((item) => (
                            <CheckRow
                              key={item.id}
                              item={item}
                              checked={!!checked[item.id]}
                              onToggle={() => toggle(item.id)}
                            />
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

            {/* Affiliate */}
            <AffiliateBanner />

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
                disabled={currentStep === 0}
                className="px-5 py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium transition-colors"
              >
                ← 前へ
              </button>
              <span className="text-xs text-gray-500">{currentStep + 1} / {steps.length}</span>
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
