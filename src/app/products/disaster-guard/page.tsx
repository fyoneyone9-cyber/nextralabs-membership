import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI防災パーソナルガイド | 家族の避難ルート×備蓄を自動最適化',
  description: 'あなたの住所・家族構成に合わせた避難ルート・備蓄リストをAIが自動作成。ハザードマップ解析で最短避難経路を提示。NextraLabsスタンダードプラン。',
  keywords: ['AI防災', '避難ルートAI', '備蓄リスト', 'ハザードマップAI', '防災対策'],
  alternates: {
    canonical: 'https://membership-site-nextralabos.vercel.app/products/disaster-guard',
  },
  openGraph: {
    title: 'AI防災パーソナルガイド | 家族の避難ルート×備蓄を自動最適化 | NextraLabs',
    description: 'あなたの住所・家族構成に合わせた避難ルート・備蓄リストをAIが自動作成。ハザードマップ解析で最短避難経路を提示。NextraLabsスタンダードプラン。',
    url: 'https://membership-site-nextralabos.vercel.app/products/disaster-guard',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: 'https://membership-site-nextralabos.vercel.app/og-image.png', width: 1200, height: 630, alt: 'AI防災パーソナルガイド | 家族の避難ルート×備蓄を自動最適化' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI防災パーソナルガイド | 家族の避難ルート×備蓄を自動最適化',
    description: 'あなたの住所・家族構成に合わせた避難ルート・備蓄リストをAIが自動作成。ハザードマップ解析で最短避難経路を提示。NextraLabsスタンダードプラン。',
    images: ['https://membership-site-nextralabos.vercel.app/og-image.png'],
  },
}

﻿import React from 'react'
import dynamic from 'next/dynamic'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Shield, Zap, MapPin, Navigation, ArrowRight, AlertTriangle, CloudRain, Wind } from 'lucide-react'
import Link from 'next/link'

const DisasterLpContent = () => {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32">
      {/* 🚀 ヒーローセクション */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center space-y-10 text-left">
        <Badge className="bg-sky-500/10 text-sky-400 border-sky-500/20 px-6 py-1 rounded-full font-bold uppercase text-xs tracking-tight">次世代型 防災インテリジェンス</Badge>
        <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tighter uppercase leading-[1.1]">
          AI防災<span className="text-sky-500">パーソナルガイド</span>
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-slate-300 max-w-4xl mx-auto leading-relaxed px-4 text-center">
          「今、ここで」生き残るために。<br className="hidden md:block" />
          リアルタイムGPS ＋ 3・3・3の法則。
        </h2>
        <div className="flex flex-wrap justify-center gap-6 pt-6 text-center">
          <Link href="/products/disaster-guard/app">
            <button className="h-20 px-12 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xl rounded-2xl shadow-[0_20px_50px_rgba(14,165,233,0.3)] transition-all active:scale-95 uppercase leading-none">
              生存戦略を立案する ➔
            </button>
          </Link>
        </div>
      </section>

      {/* ⚠️ 悩み訴求セクション */}
      <section className="bg-[#13141f] py-24 border-y border-white/5 text-left text-left">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-white uppercase tracking-tight">災害への備え、不安はありませんか？</h3>
            <ul className="space-y-4 text-slate-400 font-bold">
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 防災本を読んでも、自分の家での動きが分からない</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 避難所まで本当に行けるのか判断がつかない</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 今の天気（気温・風速）が避難に与える影響</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 備蓄品が本当に今の自分に足りているか不明</li>
            </ul>
          </div>
          <div className="bg-black/50 border-4 border-sky-500/20 rounded-[3rem] p-10 shadow-inner text-center">
             <p className="text-sky-400 text-lg font-bold leading-loose text-center">
               AIが公的基準とリアルタイムデータを融合。<br/>
               あなた専用の「命の指示書」を作成します。
             </p>
          </div>
        </div>
      </section>

      {/* ✨ 機能紹介セクション */}
      <section className="max-w-6xl mx-auto px-4 py-32 space-y-20 text-left">
        <div className="text-center space-y-4">
          <h3 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter text-center">生死を分ける4つの技術</h3>
          <p className="text-slate-500 font-bold uppercase text-center">命を守るためのテクノロジー</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 text-left">
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-sky-500/30 transition-all group">
            <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0"><MapPin size={24} /></div>
            <h4 className="text-xl font-bold text-white uppercase ">GPS・気象リアルタイム連動</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">現在地の座標と天気を自動取得。気温が低ければ防寒、風が強ければ飛散物注意など、状況に応じた指示を出します。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-sky-500/30 transition-all group">
            <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0"><Zap size={24} /></div>
            <h4 className="text-xl font-bold text-white uppercase ">3・3・3の法則ロジック</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">「3分(呼吸)・3時間(体温)・3日(水)」の法則に基づき、AIが優先順位を判定。命を守るために真っ先にすべきことを提示します。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-sky-500/30 transition-all group">
            <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0"><Navigation size={24} /></div>
            <h4 className="text-xl font-bold text-white uppercase ">詳細環境プロファイリング</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">都道府県、市区町村、住居形態を分離入力。あなたの住まいのリスクをピンポイントで分析します。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-sky-500/30 transition-all group">
            <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0"><Shield size={24} /></div>
            <h4 className="text-xl font-bold text-white uppercase ">公的機関推奨メソッド</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">内閣府や首相官邸が推奨する防災基準をAIが学習。自治体発行のガイドブックに準拠した、信頼性の高い戦略を立案します。</p>
          </div>
        </div>
      </section>

      {/* 🚀 CTAセクション */}
      <section className="max-w-5xl mx-auto px-4 pt-20 text-center">
        <Card className="bg-gradient-to-br from-sky-600 to-blue-900 border-0 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden text-center space-y-10">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Shield size={300} className="text-white" /></div>
          <div className="relative z-10 space-y-6 text-center">
            <h3 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter">大切な人を、守り抜く盾を。</h3>
            <p className="text-sky-100 text-lg font-bold leading-relaxed max-w-2xl mx-auto px-4 text-center">
              最悪の事態を想定し、最高の準備を。Nextra AIがあなたの家族を守るための盾になります。
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-6">
              <Link href="/signup">
                <button className="h-20 px-16 bg-white text-sky-700 font-bold text-2xl rounded-2xl shadow-xl hover:bg-sky-50 transition-all active:scale-95 uppercase leading-none">
                  今すぐ立案を開始する
                </button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(DisasterLpContent), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507]" />
})

export default function DisasterGuardLp() {
  return <NoSSRWrapper />
}
