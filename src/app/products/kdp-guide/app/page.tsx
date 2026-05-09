'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, CheckCircle2, Clipboard, Copy, Info, 
  Settings, PenTool, Layout, Rocket, ExternalLink,
  AlertCircle, ChevronRight, HelpCircle
} from 'lucide-react'

// ローカルガイドステップ定義：さらに具体的に
const KDP_STEPS = [
  {
    id: 'setup',
    title: 'KDPアカウント・税務・銀行の完全設定',
    icon: Settings,
    items: [
      { 
        id: 'acc', 
        text: 'KDPアカウント作成と居住地設定', 
        detail: 'Amazon.co.jp（日本）のアカウントでログインし、居住国を「日本」に設定。',
        expanded: '【手順】KDP(kdp.amazon.co.jp)へアクセス ➔ サインイン ➔ 利用規約に同意 ➔ 「マイアカウント」をクリック ➔ 居住国「日本」を選択 ➔ 氏名・住所・電話番号を入力（※重要：氏名は振込口座の名義と一致させること。住所は日本語でOK）。'
      },
      { 
        id: 'tax', 
        text: '米国源泉徴収 30% ➔ 0% 回避設定', 
        detail: '日本のマイナンバーを「TIN」として入力し、米国との租税条約を適用。',
        expanded: '【最重要：手順】マイアカウント ➔ 税務情報 ➔ 「税務プロフィールの更新」 ➔ ①個人か？：はい ②米国市民か？：いいえ ③仲介代行か？：いいえ ➔ TIN（納税者番号）に「マイナンバー(12桁)」を半角で入力 ➔ 署名（氏名をアルファベット入力） ➔ これにより、米国の税金30%が免除され、日本の所得税のみ（確定申告）になります。'
      },
      { 
        id: 'bank', 
        text: '国内銀行口座の登録（SWIFT不要）', 
        detail: '売上を受け取る口座。ネット銀行や地方銀行でも、ほぼ全て対応済み。',
        expanded: '【手順】マイアカウント ➔ 銀行口座 ➔ 銀行の所在地「日本」 ➔ 口座名義（カタカナ）、銀行名、店番号、口座番号を入力 ➔ 「追加」をクリック。※重要：名義人は必ずKDP登録名と一致させてください。'
      },
    ]
  },
  {
    id: 'manuscript',
    title: '売れる原稿と表紙の物理的準備',
    icon: PenTool,
    items: [
      { 
        id: 'file', 
        text: '原稿作成（Word / Googleドキュメント）', 
        detail: '改ページと目次設定が最優先。フォントサイズよりも「構造」が大事。',
        expanded: '【物理的設定】①用紙サイズはA4のままでOK（Kindle側で調整される） ②各章の終わりで必ず「Ctrl + Enter」で改ページを挿入 ③Wordのスタイル機能で「見出し1」を設定し、自動目次を作成 ➔ これをしないとKindle端末で「移動」機能が使えず低評価に繋がります。'
      },
      { 
        id: 'cover', 
        text: '表紙デザインの黄金比設定', 
        detail: '縦横比 1.6:1 (2560x1600px) がAmazonの推奨です。',
        expanded: '【具体的コツ】①Canva等で「Kindle表紙」テンプレートを使用 ②文字サイズは全体の50%以上を占めるほど巨大に（スマホ画面では切手サイズで表示されるため） ③背景と文字のコントラストを最大化 ➔ 白背景に薄い色の文字は絶対に読まれません。'
      },
    ]
  },
  {
    id: 'registration',
    title: 'KDP管理画面での「本の登録」実況ガイド',
    icon: Layout,
    items: [
      { 
        id: 'title', 
        text: 'タイトル・サブタイトルの戦略入力', 
        detail: 'メインタイトルは短く、サブタイトルに「実績・ターゲット」を詰め込む。',
        expanded: '【具体例】タイトル：AI活用術 ➔ サブタイトル：【2026年最新】未経験者がAIで月5万稼ぐための最短ロードマップ。※「フリガナ」も必須入力ですが、ここはカタカナで入力してください。'
      },
      { 
        id: 'desc', 
        text: '内容紹介文の作成（セールスライティング）', 
        detail: '最初の2行で読者の悩み（痛み）を突く。',
        expanded: '【構成案】①「まだ〇〇で消耗していませんか？」と問いかけ ➔ ②この本で得られる解決策（箇条書き3点） ➔ ③期間限定の低価格設定である旨を記載 ➔ ④最後に「今すぐ購入」を促す。※HTMLタグ <b>太字</b> や <ul>リスト </ul> が使用可能。'
      },
      { 
        id: 'kw', 
        text: 'キーワード（7つの枠）の選定', 
        detail: 'Amazon検索窓で「サジェスト」される単語を入力。',
        expanded: '【選定の掟】タイトルに含まれる単語は入力しない（重複は無駄）。「副業 おすすめ」「ChatGPT 使い方」「時短 術」など、読者が実際に検索する「2語」を1枠に詰め込むのが裏技です。'
      },
    ]
  },
  {
    id: 'price',
    title: '価格戦略と出版ボタン（最終関門）',
    icon: Rocket,
    items: [
      { 
        id: 'select', 
        text: 'KDPセレクト（Kindle Unlimited）登録', 
        detail: '初心者は必ず「チェックを入れる」一択です。',
        expanded: '【収益の仕組み】これにチェックを入れると、Amazonプライム会員が「タダ」で読みますが、著者は「読まれたページ数（1枚約0.5円）」だけ収益が発生します。購入されるより読まれる方が圧倒的にハードルが低いため、初期収益の9割はここから発生します。'
      },
      { 
        id: 'royalty', 
        text: 'ロイヤリティ 70% ➔ 価格 250円設定', 
        detail: '最も利益率の高い設定をロックする。',
        expanded: '【重要】ロイヤリティは「70%」を選択 ➔ 主なマーケットプレイス「Amazon.co.jp」を選択 ➔ 価格「250」と入力 ➔ これにより、1冊売れるごとに約170円の利益が出ます（99円にすると利益はたった30円になります）。'
      },
      { 
        id: 'publish', 
        text: '「Kindle本を出版」ボタンを押す', 
        detail: 'これで完了！48時間以内にAmazonに並びます。',
        expanded: '【最後の手順】画面最下部の「Kindle本を出版」をクリック。ステータスが「レビュー中」に変わります。不備がある場合はメールが届きますが、住所・氏名・税務設定さえ正しければ100%通過します。'
      },
    ]
  }
]

export default function KdpGuideApp() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const progress = Math.round(
    (Object.values(checkedItems).filter(Boolean).length / 
    KDP_STEPS.flatMap(s => s.items).length) * 100
  )

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-12 font-sans selection:bg-orange-500/30 text-left">
      <div className="max-w-4xl mx-auto space-y-10 rounded-[3rem] p-6 md:p-12 text-white font-black">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-10">
          <div className="flex items-center gap-4 text-left">
            <div className="p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20">
              <BookOpen className="h-10 w-10 text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">Kindle出版実況ナビ</h1>
              <p className="text-orange-500 text-xs font-bold tracking-[0.2em] mt-2">KDP OPERATION GUIDE</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className="bg-orange-600 text-white font-black italic px-6 py-2 text-sm rounded-full">FREE TOOL</Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-sm font-black italic uppercase text-slate-400">Step Progress</span>
            <span className="text-4xl font-black italic text-orange-500">{progress}%</span>
          </div>
          <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
            <div 
              className="h-full bg-gradient-to-r from-orange-600 to-amber-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Local Guide Steps */}
        <div className="grid gap-10">
          {KDP_STEPS.map((step) => (
            <div key={step.id} className="space-y-6">
              <div className="flex items-center gap-3">
                <step.icon className="text-orange-500" size={28} />
                <h2 className="text-2xl font-black italic uppercase tracking-tight">{step.title}</h2>
              </div>
              
              <div className="grid gap-4">
                {step.items.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`group cursor-pointer p-5 md:p-7 rounded-2xl border-2 transition-all flex items-start gap-4 md:gap-6 ${
                      checkedItems[item.id] 
                        ? 'bg-orange-500/5 border-orange-500/40 shadow-[0_0_30px_rgba(249,115,22,0.1)]' 
                        : 'bg-white/5 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className={`mt-1 h-6 w-6 md:h-7 md:w-7 shrink-0 rounded-lg border-2 flex items-center justify-center transition-all ${
                      checkedItems[item.id] ? 'bg-orange-500 border-orange-500' : 'border-white/30'
                    }`}>
                      {checkedItems[item.id] && <CheckCircle2 size={16} className="text-slate-950 stroke-[3px]" />}
                    </div>
                    <div className="flex-1 space-y-2 min-w-0">
                      <p className={`font-black text-lg md:text-xl transition-all ${checkedItems[item.id] ? 'text-white' : 'text-slate-400'}`}>
                        {item.text}
                      </p>
                      {item.expanded && (
                        <div className="mt-3 p-4 md:p-6 bg-black/40 rounded-xl border border-white/5 text-sm md:text-base text-slate-300 font-medium leading-relaxed">
                          {item.expanded}
                        </div>
                      )}
                    </div>
                    <ChevronRight className={`text-slate-700 transition-transform ${checkedItems[item.id] ? 'rotate-90' : ''}`} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Amazon Resources */}
        <a 
          href="https://www.amazon.co.jp/s?k=Kindle出版+攻略&tag=nextralabs-22" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block group"
        >
          <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-10 rounded-[3rem] flex items-center justify-between shadow-2xl transition-all group-hover:scale-[1.02]">
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white italic">Amazon KDP攻略本をチェック ➔</h3>
              <p className="text-orange-100 text-sm font-bold italic italic">ベストセラー作家が教える「印税生活」への近道</p>
            </div>
            <ExternalLink size={40} className="text-white" />
          </div>
        </a>

      </div>
    </div>
  )
}
