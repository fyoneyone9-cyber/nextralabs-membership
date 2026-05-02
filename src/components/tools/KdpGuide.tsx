'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
  BookOpen,
  FileText,
  Image,
  DollarSign,
  Upload,
  Star,
  AlertCircle,
  ExternalLink,
  Lightbulb,
} from 'lucide-react'

// ===================== Types =====================
interface CheckItem {
  id: string
  label: string
  detail?: string
  warning?: string
  link?: { text: string; url: string }
}

interface StepData {
  stepNumber: number
  title: string
  icon: React.ElementType
  color: string
  bg: string
  items: CheckItem[]
  hints: { color: 'blue' | 'yellow' | 'green' | 'orange'; text: string }[]
}

// ===================== Step Data =====================
const steps: StepData[] = [
  {
    stepNumber: 1,
    title: 'KDPアカウントの初期設定',
    icon: BookOpen,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    items: [
      {
        id: 's1-1',
        label: 'KDP公式サイトにAmazonアカウントでログインする',
        detail: 'kdp.amazon.co.jp にアクセスし、既存のAmazonアカウントでサインイン。アカウントがない場合は新規作成が必要です。',
        link: { text: 'KDP公式サイトを開く', url: 'https://kdp.amazon.co.jp' },
      },
      {
        id: 's1-2',
        label: '著者情報（本名またはペンネーム）を登録する',
        detail: 'ログイン後、アカウント情報から「著者/出版社情報」を入力。ペンネームで出版する場合は、ここではなく本の登録時に「著者名」として別途設定できます。',
        warning: 'ペンネームで出版する場合も、この欄は本名で登録します。ペンネームは本の登録時に「著者名」として設定できます。',
      },
      {
        id: 's1-3',
        label: '振込先（銀行口座）を登録する',
        detail: 'アカウント情報から「支払い情報の取得」をクリック。銀行名・支店・口座番号・口座名義（カタカナ）を入力。確認まで1〜3営業日かかります。',
        warning: '口座名義はカタカナで登録してください。漢字で登録するとエラーになる場合があります。',
      },
      {
        id: 's1-4',
        label: '税務インタビューに回答する',
        detail: 'アカウント情報から「税務情報」→「インタビューを開始」をクリック。「個人」「日本在住者」を選んで進む。全項目に回答して送信します。',
        warning: '英語で進む場合がありますが、選択肢は「Individual（個人）」「Japan」を選べばOKです。',
      },
      {
        id: 's1-5',
        label: 'マイナンバーを入力して源泉税率を0%にする',
        detail: '税務インタビューの途中、「日本の納税者番号（マイナンバー）をお持ちですか？」の質問で「はい」を選択し、12桁のマイナンバーを入力する。',
        link: { text: 'マイナポータルでマイナンバー確認', url: 'https://myna.go.jp' },
        warning: 'スキップすると販売収益の30%が源泉徴収されます。必ず入力しましょう。',
      },
    ],
    hints: [
      { color: 'blue', text: 'マイナンバーを入力すると、米国向け販売でかかる源泉税（通常30%）が0%になります。これは非常に重要な設定です。' },
      { color: 'blue', text: 'アカウント設定は初回のみ。一度登録すれば2冊目以降はすぐ出版できます。' },
    ],
  },
  {
    stepNumber: 2,
    title: '原稿・表紙の作成',
    icon: FileText,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    items: [
      {
        id: 's2-1',
        label: '原稿をWord（.docx）形式で作成する',
        detail: 'Wordの「見出し1」「見出し2」スタイルを使って章タイトルを設定しておくと、Kindle Createで自動的に目次が生成されます。フォントはデフォルトのままでOK。',
        link: { text: 'Kindle用Wordテンプレート（Amazon公式）', url: 'https://kdp.amazon.co.jp/ja_JP/help/topic/G200645680' },
        warning: '画像を多用する場合はファイルサイズに注意。1ファイル650MB以内に収める必要があります。',
      },
      {
        id: 's2-2',
        label: 'Kindle Createに.docxを読み込む',
        detail: 'Kindle Createを起動し、「その他の本のタイプ」→「Reflowable」を選択して.docxファイルを開きます。読み込み後、左サイドバーに章の一覧が自動表示されます。',
        link: { text: 'Kindle Createをダウンロード', url: 'https://www.amazon.co.jp/b?node=24423771051' },
      },
      {
        id: 's2-3',
        label: '左サイドバーの章リストを確認・修正する',
        detail: '左側に章タイトルの一覧が表示されます。これがそのままKindleのインタラクティブ目次になります。\n\n【章が足りない場合】本文画面で章タイトルにしたい文字を選択 → 右側の「Elements」タブから「Chapter Title」ボタンをクリック → 自動でリストに追加されます。\n\n【余計なものが入っている場合】左側リストで対象を右クリック → 除外（リストから削除）できます。',
        warning: '章リストが正しく設定されていないと、目次からジャンプできない電子書籍になります。必ず確認しましょう。',
      },
      {
        id: 's2-4',
        label: '目次ページ（HTML目次）を本文中に挿入する',
        detail: '上部メニューの「Edit」または左上の「＋ Insert」ボタンをクリック → 「Table of Contents（目次）」を選択。すると現在の章リストをまとめた目次ページが自動生成され、本の最初の方に挿入されます。',
      },
      {
        id: 's2-5',
        label: 'Previewで目次と各章ジャンプを確認する',
        detail: '右上の「Preview」ボタンを押す → スマホ・Kindle端末を模したウィンドウが開く → メニューボタンから「目次（Contents）」を選択 → 各章タイトルをタップして正しくジャンプできるか確認します。',
        warning: 'ここで確認せずに出版すると、目次が機能しない本になる可能性があります。必ずプレビューで動作確認しましょう。',
      },
      {
        id: 's2-6',
        label: 'Exportで.kpfファイルを書き出す',
        detail: '右上の「Save」で作業データを保存 → 「Export」ボタンをクリック → .kpfファイルが保存されます。KDPの原稿アップロードにはこの.kpfファイルを使います。',
        warning: '.kpfファイルが最も品質が安定します。.docxでも出版可能ですが、表示崩れのリスクがあります。',
      },
      {
        id: 's2-3',
        label: '表紙画像をJPEGまたはTIFF形式で用意する',
        detail: '推奨サイズは1,600×2,560px（縦長2:3比率）。最低でも1,000×625px以上が必要です。PNGは使用不可なので注意。',
        warning: '表紙はKindleの売上に直結します。タイトル・サブタイトル・著者名が読みやすく入っているか確認しましょう。',
      },
      {
        id: 's2-4',
        label: '内容紹介（商品説明）を4,000字以内で準備する',
        detail: '①読者の共感フック → ②著者紹介 → ③各章の内容紹介 → ④こんな人に読んでほしい → ⑤著者メッセージ、という構成が効果的です。Amazonの商品ページに表示されるので、購買を左右します。',
      },
    ],
    hints: [
      { color: 'blue', text: 'WordのヘッダースタイルをKindle Createが読み取って章リストを自動生成します。Wordで「見出し1」「見出し2」を正しく設定しておくと作業が楽になります。' },
      { color: 'yellow', text: '表紙はKindleの検索結果に小さいサムネイルで表示されます。縮小されても読めるか確認しましょう。' },
      { color: 'green', text: '内容紹介にHTMLタグ（<b>太字</b>、改行など）を使うとAmazonページが読みやすくなります。' },
    ],
  },
  {
    stepNumber: 3,
    title: '本の情報を登録する',
    icon: FileText,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    items: [
      {
        id: 's3-1',
        label: 'KDPダッシュボードから「新しいタイトルを作成」→「Kindle電子書籍」を選択',
        detail: 'KDPにログイン後、「本棚」タブから「＋新しいタイトルを作成」→「Kindle電子書籍」をクリックします。',
      },
      {
        id: 's3-2',
        label: '言語・タイトル・サブタイトル・著者名を入力する',
        detail: '言語：日本語 / タイトル：本のタイトル / 著者名：本名またはペンネーム（ここにペンネームを設定できます） / フリガナも必須入力です（全角カタカナで入力）。',
        warning: 'タイトルは出版後に変更が難しいため、誤字がないかよく確認してください。',
      },
      {
        id: 's3-3',
        label: '内容紹介を入力する',
        detail: '準備した商品説明文をコピー&ペーストします。KDPの入力欄にはHTMLが使えるので、<b>太字</b>や<br>改行を活用すると読みやすくなります。',
      },
      {
        id: 's3-4',
        label: 'キーワードを7枠すべて入力する',
        detail: '1枠にスペース区切りで複数単語を入れられます（例：「副業 AI」）。タイトルに含まれる単語の繰り返しは避け、関連するが別の検索ワードを選びましょう。',
      },
      {
        id: 's3-5',
        label: 'カテゴリを2つ選択する',
        detail: '本の内容に最も近いカテゴリを2つ選択します。カテゴリは販売後でも変更可能です。',
      },
      {
        id: 's3-6',
        label: 'KDP Selectに登録する（Kindle Unlimited対応）',
        detail: 'KDP Selectに登録すると、Kindle Unlimited（月額読み放題）の対象になります。90日間はAmazon独占販売が条件ですが、読者に発見されやすくなるメリットがあります。90日後は解除してnoteなど他のプラットフォームでも販売できます。',
      },
      {
        id: 's3-7',
        label: 'ページの読み方向を選択する（横書き→左から右）',
        detail: '日本語の横書きの場合は「左から右」を選択します。縦書きの場合は「右から左」を選択してください。',
      },
    ],
    hints: [
      { color: 'orange', text: 'キーワードは7枠すべて埋めましょう。空欄があると検索に表示されにくくなります。' },
      { color: 'blue', text: 'KDP Selectは90日ごとに更新されます。不要になったら90日後に解除できます。' },
    ],
  },
  {
    stepNumber: 4,
    title: '原稿・表紙をアップロードして出版',
    icon: Upload,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    items: [
      {
        id: 's4-1',
        label: '原稿ファイル（.kpfまたは.docx）をアップロードする',
        detail: '「電子書籍の原稿」欄から.kpfまたは.docxをアップロードします。Kindle Createで出力した.kpfが最も安定します。アップロード後、自動で変換処理が行われます。',
      },
      {
        id: 's4-2',
        label: '表紙画像（JPEG/TIFF）をアップロードする',
        detail: '「Kindle本の表紙」欄からJPEGまたはTIFF形式の画像をアップロードします。推奨サイズ：1,600×2,560px（2:3比率）。PNGは使用不可です。',
        warning: 'PNGはアップロードできません。事前にJPEGまたはTIFFに変換しておきましょう。',
      },
      {
        id: 's4-3',
        label: 'Kindle Previewerで表示を確認する',
        detail: '「オンラインプレビュアーを起動」でスマホ・タブレット・Kindle端末それぞれの表示を確認します。目次が正しく機能するか、文字が崩れていないかチェックしましょう。',
      },
      {
        id: 's4-4',
        label: 'ロイヤリティを70%に設定する',
        detail: '70%ロイヤリティは¥250〜¥1,250の価格範囲で設定できます。この範囲外だと35%になります。',
        warning: '¥250未満または¥1,251以上に設定すると自動的に35%ロイヤリティになります。',
      },
      {
        id: 's4-5',
        label: '希望小売価格を設定する',
        detail: '70%ロイヤリティを得るなら¥250〜¥1,250の範囲で設定します。¥499は手に取りやすい価格帯で、1冊売れるたびに約¥349の収益になります。',
      },
      {
        id: 's4-6',
        label: '「Kindle本を出版」ボタンを押して申請する',
        detail: 'すべての設定を確認後、「Kindle本を出版」ボタンをクリックして申請します。審査完了まで通常24〜72時間かかります。審査通過後、Amazonのストアに自動的に掲載されます。',
      },
    ],
    hints: [
      { color: 'green', text: '審査は通常24〜72時間以内に完了します。完了するとメールで通知が届きます。' },
      { color: 'yellow', text: '価格は出版後でも変更可能です。まず¥499で出してみて、反応を見ながら調整しましょう。' },
    ],
  },
]

// ===================== Component =====================
export default function KdpGuide() {
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [currentStep, setCurrentStep] = useState(1)

  const toggleCheck = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const getStepProgress = (step: StepData) => {
    const total = step.items.length
    const done = step.items.filter(i => checked.has(i.id)).length
    return { done, total, percent: Math.round((done / total) * 100) }
  }

  const totalItems = steps.flatMap(s => s.items).length
  const totalChecked = steps.flatMap(s => s.items).filter(i => checked.has(i.id)).length
  const totalPercent = Math.round((totalChecked / totalItems) * 100)

  const hintColors = {
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300',
    yellow: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-300',
    green: 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-300',
    orange: 'bg-orange-500/10 border-orange-500/20 text-orange-700 dark:text-orange-300',
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* ヘッダー */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">📚 Kindle出版 手順ナビ</h1>
        <p className="text-muted-foreground text-sm">
          Amazon KDPでの電子書籍出版を4ステップでガイドします
        </p>
      </div>

      {/* 全体進捗 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">全体の進捗</span>
            <span className="text-sm font-bold text-orange-500">{totalChecked}/{totalItems} 完了</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className="bg-orange-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${totalPercent}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-right">{totalPercent}%</p>
        </CardContent>
      </Card>

      {/* ステップナビ */}
      <div className="grid grid-cols-4 gap-2">
        {steps.map(step => {
          const { done, total } = getStepProgress(step)
          const isComplete = done === total
          return (
            <button
              key={step.stepNumber}
              onClick={() => setCurrentStep(step.stepNumber)}
              className={`p-3 rounded-xl border text-center transition-all ${
                currentStep === step.stepNumber
                  ? 'border-orange-500 bg-orange-500/10'
                  : 'border-border hover:border-orange-500/50'
              }`}
            >
              <div className="text-lg font-bold">
                {isComplete ? '✅' : `${step.stepNumber}`}
              </div>
              <div className="text-xs text-muted-foreground mt-1 leading-tight">
                {done}/{total}
              </div>
            </button>
          )
        })}
      </div>

      {/* 現在のステップ */}
      {steps
        .filter(step => step.stepNumber === currentStep)
        .map(step => {
          const { done, total, percent } = getStepProgress(step)
          return (
            <div key={step.stepNumber} className="space-y-4">
              {/* ステップヘッダー */}
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl ${step.bg} flex items-center justify-center flex-shrink-0`}>
                  <step.icon className={`h-6 w-6 ${step.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-lg">STEP {step.stepNumber}：{step.title}</h2>
                    {done === total && <Badge className="bg-green-500/10 text-green-600 border-green-500/20">完了 ✅</Badge>}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{done}/{total}</span>
                  </div>
                </div>
              </div>

              {/* チェックリスト */}
              <div className="space-y-3">
                {step.items.map(item => {
                  const isChecked = checked.has(item.id)
                  const isExpanded = expandedItems.has(item.id)
                  const hasDetail = !!(item.detail || item.warning || item.link)

                  return (
                    <Card
                      key={item.id}
                      className={`transition-all ${isChecked ? 'opacity-60' : ''}`}
                    >
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleCheck(item.id)}
                            className="mt-0.5 flex-shrink-0"
                          >
                            {isChecked
                              ? <CheckSquare className="h-5 w-5 text-green-500" />
                              : <Square className="h-5 w-5 text-muted-foreground" />
                            }
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium leading-relaxed ${isChecked ? 'line-through text-muted-foreground' : ''}`}>
                              {item.label}
                            </p>

                            {hasDetail && (
                              <button
                                onClick={() => toggleExpand(item.id)}
                                className="flex items-center gap-1 text-xs text-orange-500 hover:text-orange-600 mt-1"
                              >
                                {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                {isExpanded ? '閉じる' : '詳細を見る'}
                              </button>
                            )}

                            {isExpanded && hasDetail && (
                              <div className="mt-3 space-y-2">
                                {item.detail && (
                                  <p className="text-xs text-muted-foreground leading-relaxed bg-muted/50 rounded-lg p-3">
                                    {item.detail}
                                  </p>
                                )}
                                {item.warning && (
                                  <div className="flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                                    <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-yellow-700 dark:text-yellow-300 leading-relaxed">{item.warning}</p>
                                  </div>
                                )}
                                {item.link && (
                                  <a
                                    href={item.link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 underline"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                    {item.link.text}
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* ヒント */}
              {step.hints.length > 0 && (
                <div className="space-y-2">
                  {step.hints.map((hint, i) => (
                    <div key={i} className={`flex items-start gap-2 border rounded-lg p-3 ${hintColors[hint.color]}`}>
                      <Lightbulb className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <p className="text-xs leading-relaxed">{hint.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* ナビボタン */}
              <div className="flex justify-between pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentStep(s => Math.max(1, s - 1))}
                  disabled={currentStep === 1}
                >
                  ← 前のステップ
                </Button>
                <Button
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                  onClick={() => setCurrentStep(s => Math.min(steps.length, s + 1))}
                  disabled={currentStep === steps.length}
                >
                  次のステップ →
                </Button>
              </div>
            </div>
          )
        })}

      {/* 完了メッセージ */}
      {totalChecked === totalItems && (
        <Card className="border-green-500/30 bg-green-500/5">
          <CardContent className="pt-6 text-center space-y-3">
            <div className="text-4xl">🎉</div>
            <h3 className="font-bold text-lg text-green-600 dark:text-green-400">全ステップ完了！</h3>
            <p className="text-sm text-muted-foreground">
              出版申請が完了しました。審査通過後、24〜72時間以内にAmazonで販売開始されます。
            </p>
            <div className="flex justify-center gap-2 flex-wrap pt-2">
              <Badge className="bg-green-500/10 text-green-600 border-green-500/20">✅ 全4ステップ完了</Badge>
              <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20">⏳ 審査待ち（24〜72時間）</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KDPリンク */}
      <Card className="border-dashed">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Amazon KDP ダッシュボード</span>
            </div>
            <a
              href="https://kdp.amazon.co.jp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" variant="outline" className="text-xs">
                <ExternalLink className="h-3 w-3 mr-1" />
                KDPを開く
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
