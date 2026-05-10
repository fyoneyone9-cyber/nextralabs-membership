import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI借金完済・おまとめ診断 | 最短完済ルートをAIが無料で計算',
  description: '複数の借金をまとめておまとめローンで一本化。AIが毎月の返済額・利息・完済期間を複数シナリオで比較。完全無料で使えるNextraLabs公開ツール。',
  keywords: ['AI借金診断', 'おまとめローン', '債務整理AI', '完済シミュレーション', '借金相談AI'],
  alternates: {
    canonical: 'https://membership-site-nextralabos.vercel.app/products/loan-advisor',
  },
  openGraph: {
    title: 'AI借金完済・おまとめ診断 | 最短完済ルートをAIが無料で計算 | NextraLabs',
    description: '複数の借金をまとめておまとめローンで一本化。AIが毎月の返済額・利息・完済期間を複数シナリオで比較。完全無料で使えるNextraLabs公開ツール。',
    url: 'https://membership-site-nextralabos.vercel.app/products/loan-advisor',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: 'https://membership-site-nextralabos.vercel.app/og-image.png', width: 1200, height: 630, alt: 'AI借金完済・おまとめ診断 | 最短完済ルートをAIが無料で計算' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI借金完済・おまとめ診断 | 最短完済ルートをAIが無料で計算',
    description: '複数の借金をまとめておまとめローンで一本化。AIが毎月の返済額・利息・完済期間を複数シナリオで比較。完全無料で使えるNextraLabs公開ツール。',
    images: ['https://membership-site-nextralabos.vercel.app/og-image.png'],
  },
}

﻿import Link from 'next/link'
import { ShieldCheck, TrendingDown, Zap, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function LoanAdvisorPromo() {
  return (
    <div className="min-h-screen bg-[#050507] text-white font-sans">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center space-y-6">
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-1 text-xs font-bold tracking-tight uppercase ">
            Debt Recovery AI
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none uppercase">
            借金を<span className="text-emerald-500">一本化</span>して<br />人生を再起動する。
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-bold max-w-2xl mx-auto">
            複数の借入れ、高い金利。AIがあなたの債務状況を分析し、完済までの最短ルートを無料診断。
          </p>
          
          <div className="pt-8">
            <Link href="/products/loan-advisor/app">
              <button className="bg-emerald-600 hover:bg-emerald-500 text-white h-20 px-12 rounded-[2rem] font-bold text-2xl uppercase tracking-tight transition-all shadow-[0_0_50px_rgba(16,185,129,0.4)] active:scale-95 flex items-center justify-center gap-4 mx-auto">
                無料診断を開始する <ArrowRight size={28} />
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
          {[
            { icon: <TrendingDown className="text-emerald-500" />, title: '金利を軽減', desc: '一本化することで月々の返済額と総支払額を大幅にカット。' },
            { icon: <Zap className="text-emerald-500" />, title: '一瞬で診断', desc: '借入状況を入力するだけで、AIが最適な完済プランを生成。' },
            { icon: <ShieldCheck className="text-emerald-500" />, title: '完全匿名', desc: '個人情報の入力は不要。誰にも知られずに現状を分析できます。' },
          ].map((feature, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] space-y-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight">{feature.title}</h3>
              <p className="text-slate-400 font-bold text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-24 p-10 bg-gradient-to-br from-emerald-600/20 to-transparent border border-emerald-500/20 rounded-[3rem] space-y-6">
          <h2 className="text-3xl font-bold uppercase tracking-tighter">AIがおまとめのメリットを可視化</h2>
          <ul className="space-y-4">
            {[
              '現在の平均金利と総返済額の算出',
              'おまとめローン適用時の利息軽減額シミュレーション',
              'Gemini 2.5 Flash によるパーソナライズされた完済アドバイス',
              '信頼できる金融機関へのスムーズな案内',
            ].map((li, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-300 font-bold">
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> {li}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
