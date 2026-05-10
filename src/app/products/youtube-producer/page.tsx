import { Metadata } from 'next'
﻿import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Youtube, FileVideo, FileText, Zap, Sparkles, ArrowRight, Play, Scissors, Type, Music, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AI YouTubeプロデューサー | 全自動台本・構成・サムネイル案をAIが生成 | NextraLabs',
  description: '動画テーマを入力するだけ。AIが視聴者を引き込む台本・構成・サムネイル文言・SEOタイトル・概要欄まで全自動生成。YouTubeチャンネル成長を加速。月額¥1,980。',
  keywords: ['YouTube台本AI','YouTubeプロデューサーAI','YouTube構成自動生成','サムネイルAI','YouTube SEO','動画企画AI','YouTubeチャンネル成長','YouTube自動化AI','動画台本AI','NextraLabsYouTube'],
  alternates: {
    canonical: 'https://membership-site-nextralabos.vercel.app/products/youtube-producer',
  },
  openGraph: {
    title: 'AI YouTubeプロデューサー | 全自動台本・構成・サムネイル案をAIが生成 | NextraLabs',
    description: '動画テーマを入力するだけ。AIが視聴者を引き込む台本・構成・サムネイル文言・SEOタイトル・概要欄まで全自動生成。YouTubeチャンネル成長を加速。月額¥1,980。',
    url: 'https://membership-site-nextralabos.vercel.app/products/youtube-producer',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: 'https://membership-site-nextralabos.vercel.app/og-image.png', width: 1200, height: 630, alt: 'AI YouTubeプロデューサー | 全自動台本・構成・サムネイル案をAIが生成 | NextraLabs' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI YouTubeプロデューサー | 全自動台本・構成・サムネイル案をAIが生成 | NextraLabs',
    description: '動画テーマを入力するだけ。AIが視聴者を引き込む台本・構成・サムネイル文言・SEOタイトル・概要欄まで全自動生成。YouTubeチャンネル成長を加速。月額¥1,980。',
    images: ['https://membership-site-nextralabos.vercel.app/og-image.png'],
  },
}

export default function YoutubeProducerLp() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AI YouTubeプロデューサー',
    description: '動画テーマを入力するだけ。AIが台本・構成・サムネイル文言・SEOタイトル・概要欄まで全自動生成。',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: 'https://membership-site-nextralabos.vercel.app/products/youtube-producer',
    offers: { '@type': 'Offer', price: '1980', priceCurrency: 'JPY' },
    publisher: { '@type': 'Organization', name: 'NextraLabs' },
  }
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* 🚀 Hero Section */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center space-y-10">
        <Badge className="bg-red-600/10 text-red-500 border-red-500/20 px-6 py-1 rounded-full font-bold uppercase text-xs">Viral Content OS</Badge>
        <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tighter uppercase leading-[1.1]">
          AI YouTube<br/><span className="text-red-600">Producer</span>
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-slate-300 max-w-4xl mx-auto leading-relaxed">
          「なんとなく」で動画を作る時代は終わった。<br className="hidden md:block" />
          プロの戦略をAIで完全自動化。
        </h2>
        <div className="flex flex-wrap justify-center gap-6 pt-6">
          <Link href="/products/youtube-producer/app">
            <button className="h-20 px-12 bg-red-600 hover:bg-red-500 text-white font-bold text-xl rounded-2xl shadow-[0_20px_50px_rgba(220,38,38,0.3)] transition-all active:scale-95 uppercase ">
              最強の台本を錬成する ➔
            </button>
          </Link>
        </div>
      </section>

      {/* ⚠️ Problem Section */}
      <section className="bg-[#13141f] py-24 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 text-left">
            <h3 className="text-3xl font-bold text-white uppercase tracking-tight">動画が伸びない「本当の理由」</h3>
            <ul className="space-y-4 text-slate-400 font-bold">
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 企画と台本構成が「自己満足」になっている</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 視聴者が離脱しない「勝ちパターン」を知らない</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 制作に時間がかかりすぎて継続できない</li>
            </ul>
          </div>
          <div className="bg-black/50 border-4 border-red-500/20 rounded-[3rem] p-10 shadow-inner">
             <p className="text-red-500 text-lg font-bold text-center leading-loose">
               YouTubeの「科学」をAIが代行。<br/>
               あなたはポチポチ選ぶだけです。
             </p>
          </div>
        </div>
      </section>

      {/* ✨ Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-32 space-y-20">
        <div className="text-center space-y-4">
          <h3 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter">Master Production OS</h3>
          <p className="text-slate-500 font-bold uppercase ">バズを量産するための4大機能</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 text-left">
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4">
            <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center text-red-500"><Zap /></div>
            <h4 className="text-xl font-bold text-white uppercase ">10種の動画戦略パレット</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">「衝撃・暴露」「徹底解説」「ルーティン」等、YouTubeの歴史が証明した勝てる戦略をボタン一つで適用。AIが離脱されない構成を組み上げます。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4">
            <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center text-red-500"><Scissors /></div>
            <h4 className="text-xl font-bold text-white uppercase ">視覚・サウンド一括設計</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">台本から「登場人物プロンプト」や「BGM指示文」を自動抽出。クリエイティブの指示出し工数をゼロにします。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4">
            <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center text-red-500"><Play /></div>
            <h4 className="text-xl font-bold text-white uppercase ">一本道UI（ステップ・バイ・ステップ）</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">①文字起こし ➔ ②台本作成 ➔ ③視覚設計 ➔ ④SEO。番号順に進めるだけで、プロレベルの企画書が完成します。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4">
            <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center text-red-500"><Sparkles /></div>
            <h4 className="text-xl font-bold text-white uppercase ">Viral Score 自動計測</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">完成した台本をAIが即座に採点。バズる可能性をパーセンテージで可視化し、公開前の企画をブラッシュアップします。</p>
          </div>
        </div>
      </section>

      {/* 🚀 CTA Section */}
      <section className="max-w-5xl mx-auto px-4 pt-20">
        <Card className="bg-gradient-to-br from-red-600 to-emerald-900 border-0 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden text-center space-y-10">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Youtube size={300} className="text-white" /></div>
          <div className="relative z-10 space-y-6">
            <h3 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter">Dominate the Algorithm.</h3>
            <p className="text-emerald-100 text-lg font-bold leading-relaxed max-w-2xl mx-auto">
              個人の時代だからこそ、AIプロデューサーを。あなたの才能を、最大効率で世界へ届けます。
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-6">
              <Link href="/signup">
                <button className="h-20 px-16 bg-white text-red-700 font-bold text-2xl rounded-2xl shadow-xl hover:bg-red-50 transition-all active:scale-95 uppercase ">
                  Launch Command Center
                </button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
      {/* FAQ */}
      <section className="py-16 bg-[#0d1117]">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">よくある質問</h2>
          <div className="space-y-6">
            <div>
              <p className="font-semibold text-white mb-2">Q. YouTube初心者でも使いこなせますか？</p>
              <p className="text-slate-400 text-sm">A. はい。動画のテーマを入力するだけで、構成・台本・サムネイル案・タグまで全自動生成されます。チャンネル立ち上げ期から活用できます。</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Q. SEOに最適化されたタイトルも生成されますか？</p>
              <p className="text-slate-400 text-sm">A. はい。検索上位に表示されやすいSEOタイトル・概要欄・タグをAIが自動生成します。YouTube検索とGoogleサジェストの両方を意識した最適化を行います。</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Q. サムネイルの実際のデザインも作れますか？</p>
              <p className="text-slate-400 text-sm">A. テキスト案・配色・構図の提案まで行います。実際の画像生成にはAI画像生成ツールとの組み合わせをおすすめします。NextraLabsではAI画像プロンプトマスターも提供しています。</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Q. どのジャンルの動画に対応していますか？</p>
              <p className="text-slate-400 text-sm">A. ビジネス・教育・エンタメ・料理・美容・旅行・ゲーム・結婚相談など幅広いジャンルに対応しています。ターゲット視聴者層を指定すると、より最適化された台本を生成します。</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Q. 生成した台本は自由に編集できますか？</p>
              <p className="text-slate-400 text-sm">A. はい。生成された台本・構成はすべてテキストとして出力されるため、自由に編集・加工してご利用いただけます。著作権も利用者に帰属します。</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
