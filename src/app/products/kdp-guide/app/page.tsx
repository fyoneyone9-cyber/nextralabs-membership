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

// ローカルガイドステップ定義
const KDP_STEPS = [
  {
    id: 'setup',
    title: 'KDPアカウント設定',
    icon: Settings,
    items: [
      { id: 'acc', text: 'Amazon KDPアカウントの作成', detail: '既存のAmazonアカウントでもOK' },
      { id: 'tax', text: '税務情報の登録（マイナンバー）', detail: '米国源泉徴収を30%→0%にするために必須' },
      { id: 'bank', text: '銀行口座の登録', detail: '売上の受け取り用。日本の銀行でOK' },
    ]
  },
  {
    id: 'manuscript',
    title: '原稿・表紙の準備',
    icon: PenTool,
    items: [
      { id: 'file', text: '原稿ファイルをEPUBまたはWordで作成', detail: '推奨はEPUB。リフロー型が一般的' },
      { id: 'cover', text: '表紙画像の作成 (JPG/TIFF)', detail: '推奨サイズ：2560 x 1600 ピクセル' },
    ]
  },
  {
    id: 'registration',
    title: '本の詳細登録',
    icon: Layout,
    items: [
      { id: 'title', text: 'タイトル・サブタイトルの決定', detail: '検索キーワードを意識する' },
      { id: 'desc', text: '内容紹介文の作成', detail: '読者の興味を引くセールス文' },
      { id: 'kw', text: '検索キーワード（最大7つ）の設定', detail: 'ターゲットが検索する単語を選ぶ' },
    ]
  },
  {
    id: 'price',
    title: '価格・ロイヤリティ設定',
    icon: Rocket,
    items: [
      { id: 'select', text: 'KDPセレクトへの登録判断', detail: 'Kindle Unlimited対象にするならチェック' },
      { id: 'royalty', text: 'ロイヤリティ 70% を選択', detail: '価格を250円〜1250円に設定する必要あり' },
      { id: 'publish', text: '「Kindle本を出版」をクリック', detail: '審査には通常24〜72時間かかります' },
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
              <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">Kindle出版手順ナビ</h1>
              <p className="text-orange-500 text-xs font-bold tracking-[0.2em] mt-2">COMPLETE LOCAL GUIDANCE</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className="bg-orange-600 text-white font-black italic px-6 py-2 text-sm rounded-full">FREE TOOL</Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-sm font-black italic uppercase text-slate-400">Total Progress</span>
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
                    className={`group cursor-pointer p-6 rounded-2xl border-2 transition-all flex items-start gap-4 ${
                      checkedItems[item.id] 
                        ? 'bg-orange-500/10 border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.1)]' 
                        : 'bg-white/5 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className={`mt-1 h-6 w-6 rounded-md border-2 flex items-center justify-center transition-all ${
                      checkedItems[item.id] ? 'bg-orange-500 border-orange-500' : 'border-white/20'
                    }`}>
                      {checkedItems[item.id] && <CheckCircle2 size={16} className="text-slate-950" />}
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className={`font-black text-lg transition-all ${checkedItems[item.id] ? 'text-white' : 'text-slate-400'}`}>
                        {item.text}
                      </p>
                      <p className="text-xs text-slate-500 font-bold italic">{item.detail}</p>
                      {item.expanded && (
                        <div className="mt-4 p-4 bg-black/40 rounded-xl border border-white/5 text-[11px] text-slate-300 font-bold leading-relaxed animate-in fade-in duration-500">
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

        {/* Local Tips & Resources */}
        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 space-y-8">
          <div className="flex items-center gap-3 text-orange-400">
            <HelpCircle size={24} />
            <h3 className="text-xl font-black italic uppercase">初心者向けローカルTips</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-8 text-sm font-bold italic text-slate-400 leading-relaxed">
            <div className="space-y-2">
              <p className="text-white">Q: スマホだけで出版できますか？</p>
              <p>A: 登録作業は可能ですが、原稿の最終チェックやアップロードはPC環境を強く推奨します。</p>
            </div>
            <div className="space-y-2">
              <p className="text-white">Q: ペンネームは使えますか？</p>
              <p>A: はい。KDP登録時に「著者名」をペンネームにするだけです。振込口座の名義は本名である必要があります。</p>
            </div>
          </div>
        </div>

        {/* Affiliate Link (Local) */}
        <a 
          href="https://www.amazon.co.jp/s?k=Kindle出版+攻略&tag=nextralabs-22" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block group"
        >
          <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-10 rounded-[3rem] flex items-center justify-between shadow-2xl transition-all group-hover:scale-[1.02]">
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white italic">さらなる攻略情報をAmazonで入手 ➔</h3>
              <p className="text-orange-100 text-sm font-bold italic">ベストセラー作家のノウハウを本で学ぶ</p>
            </div>
            <ExternalLink size={40} className="text-white" />
          </div>
        </a>

      </div>
    </div>
  )
}
