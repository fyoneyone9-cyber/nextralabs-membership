'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, CheckCircle2, Info, Settings, PenTool, Layout, Rocket, 
  ExternalLink, ChevronRight, HelpCircle
} from 'lucide-react'

// ローカルガイドステップ定義
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
        subItems: [
          { id: 'acc-1', text: 'KDP公式サイト(kdp.amazon.co.jp)へアクセス', url: 'https://kdp.amazon.co.jp/ja_JP/' },
          { id: 'acc-2', text: '既存のAmazonアカウントでサインイン' },
          { id: 'acc-3', text: '利用規約に同意' },
          { id: 'acc-4', text: '「マイアカウント」をクリック' },
          { id: 'acc-5', text: '居住国「日本」を選択' },
          { id: 'acc-6', text: '氏名・住所・電話番号を入力（※振込口座名義と一致させる）' },
        ]
      },
      { 
        id: 'tax', 
        text: '米国源泉徴収 30% ➔ 0% 回避設定', 
        detail: '日本のマイナンバーを「TIN」として入力し、米国との租税条約を適用。',
        subItems: [
          { id: 'tax-1', text: 'マイアカウント ➔ 税務情報の更新 をクリック', url: 'https://kdp.amazon.co.jp/dashboard?ref_=kdp_kdp_menu_acc' },
          { id: 'tax-2', text: '税務プロフィールの作成を開始' },
          { id: 'tax-3', text: '「個人」「米国市民ではない」「仲介代行ではない」を選択' },
          { id: 'tax-4', text: 'TIN（納税者番号）欄にマイナンバー(12桁)を入力' },
          { id: 'tax-5', text: '署名欄に氏名をアルファベットで入力' },
        ]
      },
      { 
        id: 'bank', 
        text: '国内銀行口座の登録（SWIFT不要）', 
        detail: '売上を受け取る口座。日本の銀行名・店番・口座番号を入力。',
        subItems: [
          { id: 'bank-1', text: 'マイアカウント ➔ 銀行口座 をクリック', url: 'https://kdp.amazon.co.jp/dashboard?ref_=kdp_kdp_menu_acc' },
          { id: 'bank-2', text: '銀行の所在地「日本」を選択' },
          { id: 'bank-3', text: '口座名義（カタカナ）を入力' },
          { id: 'bank-4', text: '銀行名・店番号・口座番号を入力して追加' },
        ]
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
        detail: '改ページと目次設定が最優先。構造化が重要。',
        subItems: [
          { id: 'file-1', text: '各章の終わりに「Ctrl + Enter」で改ページを挿入' },
          { id: 'file-2', text: 'Wordのスタイル機能で「見出し」を設定' },
          { id: 'file-3', text: '「自動目次」を挿入（Kindle移動機能に必須）' },
          { id: 'file-4', text: 'Kindle Previewerで表示を確認する', url: 'https://www.amazon.co.jp/gp/feature.html?docId=3077699036' },
        ]
      },
      { 
        id: 'cover', 
        text: '表紙デザインの黄金比設定', 
        detail: '縦横比 1.6:1 (2560x1600px) がAmazonの推奨です。',
        subItems: [
          { id: 'cover-1', text: 'Canva等で2560x1600pxのキャンバスを作成', url: 'https://www.canva.com/' },
          { id: 'cover-2', text: 'タイトル文字を全体の50%以上のサイズで配置' },
          { id: 'cover-3', text: '背景と文字のコントラストを最大化する' },
        ]
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
        detail: 'メインタイトルは短く、サブタイトルにベネフィットを詰め込む。',
        subItems: [
          { id: 'title-1', text: 'KDP本棚から「作成」をクリック', url: 'https://kdp.amazon.co.jp/bookshelf' },
          { id: 'title-2', text: '電子書籍の作成を選択' },
          { id: 'title-3', text: 'タイトルを入力（フリガナ・カタカナ必須）' },
          { id: 'title-4', text: 'サブタイトルに「実績・ターゲット」を盛り込む' },
        ]
      },
      { 
        id: 'desc', 
        text: '内容紹介文の作成（セールスライティング）', 
        detail: '最初の2行で読者の悩み（痛み）を突く。',
        subItems: [
          { id: 'desc-1', text: '最初の3行で「読者の悩み」を提起する' },
          { id: 'desc-2', text: 'ベネフィットを箇条書きで3つ提示する' },
          { id: 'desc-3', text: '必要に応じてHTMLタグ(<b>等)で装飾する' },
        ]
      },
      { 
        id: 'kw', 
        text: 'キーワード（7つの枠）の選定', 
        detail: 'Amazon検索窓でサジェストされる単語を選定。',
        subItems: [
          { id: 'kw-1', text: 'タイトルと重複しない単語を選ぶ' },
          { id: 'kw-2', text: '1つの枠に「2語の組み合わせ」を入力する' },
          { id: 'kw-3', text: '7つの枠すべてを埋める' },
        ]
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
        subItems: [
          { id: 'select-1', text: 'KDPセレクトに登録するにチェック' },
          { id: 'select-2', text: '独占販売（他店で売らない）に同意' },
        ]
      },
      { 
        id: 'royalty', 
        text: 'ロイヤリティ 70% ➔ 価格 250円設定', 
        detail: '最も利益率の高い設定をロックする。',
        subItems: [
          { id: 'royalty-1', text: 'ロイヤリティプラン「70%」を選択' },
          { id: 'royalty-2', text: 'マーケットプレイス「Amazon.co.jp」を選択' },
          { id: 'royalty-3', text: '価格を250円以上に設定する' },
        ]
      },
      { 
        id: 'publish', 
        text: '「Kindle本を出版」ボタンを押す', 
        detail: '審査には通常24〜72時間かかります。',
        subItems: [
          { id: 'publish-1', text: '「Kindle本を出版」をクリック' },
          { id: 'publish-2', text: 'ステータスが「レビュー中」になったか確認' },
        ]
      },
    ]
  }
]

export default function KdpGuideApp() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const allSubItems = KDP_STEPS.flatMap(s => s.items.flatMap(i => i.subItems))
  const progress = Math.round(
    (allSubItems.filter(item => checkedItems[item.id]).length / allSubItems.length) * 100
  )

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-12 font-sans selection:bg-orange-500/30 text-left">
      <div className="max-w-4xl mx-auto space-y-10 border-4 border-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.3)] rounded-[3rem] p-6 md:p-12 text-white font-black relative overflow-hidden">
        {/* Security Line Accent */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
        
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
                  <Card key={item.id} className="bg-[#13141f] border-white/5 p-6 rounded-2xl space-y-4 shadow-xl">
                    <div className="space-y-1.5">
                      <h3 className="text-xl md:text-2xl font-black text-white italic tracking-tight">{item.text}</h3>
                      <p className="text-xs md:text-sm text-slate-400 font-bold leading-relaxed">{item.detail}</p>
                    </div>
                    
                      <div className="grid gap-2 border-t border-white/5 pt-4">
                      {item.subItems.map((sub) => (
                        <div 
                          key={sub.id}
                          onClick={() => toggleCheck(sub.id)}
                          className={`group cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col gap-3 ${
                            checkedItems[sub.id] 
                              ? 'bg-orange-500/10 border-orange-500/40' 
                              : 'bg-black/40 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`shrink-0 h-6 w-6 rounded border-2 flex items-center justify-center transition-all ${
                              checkedItems[sub.id] ? 'bg-orange-500 border-orange-500' : 'border-white/30'
                            }`}>
                              {checkedItems[sub.id] && <CheckCircle2 size={16} className="text-slate-950 stroke-[3px]" />}
                            </div>
                            <p className={`font-black text-sm md:text-base transition-all flex-1 ${checkedItems[sub.id] ? 'text-white' : 'text-slate-400'}`}>
                              {sub.text}
                            </p>
                          </div>
                          
                          {sub.url && (
                            <a 
                              href={sub.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              onClick={(e) => e.stopPropagation()}
                              className="w-full h-12 bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/50 rounded-xl flex items-center justify-center gap-2 text-emerald-400 hover:text-slate-950 font-black italic transition-all shadow-lg"
                            >
                              この手順の公式ページを開く <ExternalLink size={18} />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
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
            <div className="space-y-2 text-left">
              <h3 className="text-2xl font-black text-white italic">Amazon KDP攻略本をチェック ➔</h3>
              <p className="text-orange-100 text-sm font-bold italic">ベストセラー作家が教える「印税生活」への近道</p>
            </div>
            <ExternalLink size={40} className="text-white" />
          </div>
        </a>

      </div>
    </div>
  )
}
