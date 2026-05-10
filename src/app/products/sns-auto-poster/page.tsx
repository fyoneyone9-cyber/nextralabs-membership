import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI SNSオートポスター | バズる投稿をAIが量産・全SNS一括生成 | NextraLabs',
  description: 'テーマを入力するだけでAIがX(Twitter)・Instagram・Facebook・TikTok向けに最適化されたバズる投稿文を一括生成。ハッシュタグ・投稿時間帯も自動提案。月額¥480。',
  keywords: ['SNS投稿AI','Twitter自動投稿','Instagram投稿AI','バズる投稿','SNSマーケティングAI','ハッシュタグAI','SNS運用AI','コンテンツ自動生成','投稿文AI','NextraLabsSNS'],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: {
    canonical: 'https://membership-site-nextralabos.vercel.app/products/sns-auto-poster',
  },
  openGraph: {
    title: 'AI SNSオートポスター | バズる投稿をAIが量産・全SNS一括生成 | NextraLabs',
    description: 'テーマを入力するだけでAIがX(Twitter)・Instagram・Facebook・TikTok向けに最適化されたバズる投稿文を一括生成。ハッシュタグ・投稿時間帯も自動提案。月額¥480。',
    url: 'https://membership-site-nextralabos.vercel.app/products/sns-auto-poster',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: 'https://membership-site-nextralabos.vercel.app/og-image.png', width: 1200, height: 630, alt: 'AI SNSオートポスター | バズる投稿をAIが量産・全SNS一括生成 | NextraLabs' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI SNSオートポスター | バズる投稿をAIが量産・全SNS一括生成 | NextraLabs',
    description: 'テーマを入力するだけでAIがX(Twitter)・Instagram・Facebook・TikTok向けに最適化されたバズる投稿文を一括生成。ハッシュタグ・投稿時間帯も自動提案。月額¥480。',
    images: ['https://membership-site-nextralabos.vercel.app/og-image.png'],
  },
}

﻿import React from 'react'
import dynamic from 'next/dynamic'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Share2, Zap, Send, TrendingUp, Search, ArrowRight, MessageSquareText, ShieldCheck, AlertTriangle, HeartHandshake } from 'lucide-react'
import Link from 'next/link'

const SnsPosterLpContent = () => {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32">
      {/* 🚀 ヒーローセクション */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center space-y-10">
        <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20 px-6 py-1 rounded-full font-bold uppercase text-xs tracking-tight">SNSバズ量産エンジン</Badge>
        <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tighter uppercase leading-[1.1]">
          SNS <span className="text-rose-500">Auto</span> Poster
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-slate-300 max-w-4xl mx-auto leading-relaxed px-4 text-center">
          バズは「偶然」ではなく「科学」だ。<br className="hidden md:block" />
          最新トレンド ＋ 10種のバズ戦略エンジン。
        </h2>
        <div className="flex flex-wrap justify-center gap-6 pt-6">
          <Link href="/products/sns-auto-poster/app">
            <button className="h-20 px-12 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xl rounded-2xl shadow-[0_20px_50px_rgba(225,29,72,0.3)] transition-all active:scale-95 uppercase leading-none">
              最強の投稿を錬成する ➔
            </button>
          </Link>
        </div>
      </section>

      {/* ⚠️ 悩み訴求セクション */}
      <section className="bg-[#13141f] py-24 border-y border-white/5 text-left">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-white uppercase tracking-tight">SNS運用、疲弊していませんか？</h3>
            <ul className="space-y-4 text-slate-400 font-bold">
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 毎日投稿するネタが見つからない</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 投稿しても「いいね」や「リポスト」が増えない</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 各媒体の特性に合わせたリライトが重労働</li>
            </ul>
          </div>
          <div className="bg-black/50 border-4 border-rose-500/20 rounded-[3rem] p-10 shadow-inner text-center">
             <p className="text-rose-400 text-lg font-bold leading-loose text-center">
               AIが「今の流行」と「深層心理」を分析。<br/>
               あなたが寝ている間もバズを設計します。
             </p>
          </div>
        </div>
      </section>

      {/* ✨ 機能紹介セクション */}
      <section className="max-w-6xl mx-auto px-4 py-32 space-y-20 text-left">
        <div className="text-center space-y-4">
          <h3 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter text-center">インプレッションを支配する技術</h3>
          <p className="text-slate-500 font-bold uppercase text-center">SNSの影響力を最大化する4つの武器</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-rose-500/30 transition-all group text-left">
            <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0"><TrendingUp size={24} /></div>
            <h4 className="text-xl font-bold text-white uppercase ">リアルタイム・トピックス</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed text-left">今まさに日本で盛り上がっているトピックスをAIが常時監視。鮮度の高い「今すぐ投稿すべきネタ」を提供します。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-rose-500/30 transition-all group text-left text-left">
            <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0"><Zap size={24} /></div>
            <h4 className="text-xl font-bold text-white uppercase ">10種のバズ戦略パレット</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed text-left">「暴露」「有益Tips」「エモ」「対立」など、SNS心理学に基づく10種類の戦略パーツを自在に組み合わせて投稿を錬成。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-rose-500/30 transition-all group text-left text-left">
            <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0"><Share2 size={24} /></div>
            <h4 className="text-xl font-bold text-white uppercase text-left">マルチ媒体一括生成</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed text-left text-left">X、Instagram、TikTok、Threads。各SNSのアルゴリズムに最適化された文章・構成案を一括で作成します。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-rose-500/30 transition-all group text-left text-left">
            <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0"><HeartHandshake size={24} /></div>
            <h4 className="text-xl font-bold text-white uppercase text-left text-left">結婚相談所特化モード</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed text-left text-left">マリッジロードジャパンの知見を完全同期。心理学に基づいた成婚戦略・婚活Tips投稿を瞬時に生成します。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-rose-500/30 transition-all group text-left text-left">
            <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0"><CheckCircle2 size={24} /></div>
            <h4 className="text-xl font-bold text-white uppercase text-left text-left">AIバズ期待度計測</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed text-left text-left">完成した投稿案をAIが事前審査。バズる確率（Buzz Score）を算出し、公開前の最終チェックを行います。</p>
          </div>
        </div>
      </section>

      {/* 🚀 CTAセクション */}
      <section className="max-w-5xl mx-auto px-4 pt-20 text-center">
        <Card className="bg-gradient-to-br from-rose-600 to-red-900 border-0 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden text-center space-y-10">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Share2 size={300} className="text-white" /></div>
          <div className="relative z-10 space-y-6 text-center">
            <h3 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter leading-none">影響力の、新次元へ。</h3>
            <p className="text-rose-100 text-lg font-bold leading-relaxed max-w-2xl mx-auto px-4 text-center">
              あなたの発信力に、AIという名のブースターを。SNSオートポスターで、あなたの声を世界へ届けましょう。
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-6 text-center">
              <Link href="/signup">
                <button className="h-20 px-16 bg-white text-rose-700 font-bold text-2xl rounded-2xl shadow-xl hover:bg-rose-50 transition-all active:scale-95 uppercase leading-none">
                  無料で始めてみる
                </button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(SnsPosterLpContent), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507]" />
})

export default function SnsAutoPosterLp() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AI SNSオートポスター',
    description: 'テーマを入力するだけでAIがX(Twitter)・Instagram・Facebook・TikTok向けに最適化されたバズる投稿文を一括生成。',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: 'https://membership-site-nextralabos.vercel.app/products/sns-auto-poster',
    offers: { '@type': 'Offer', price: '480', priceCurrency: 'JPY' },
    publisher: { '@type': 'Organization', name: 'NextraLabs' },
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <NoSSRWrapper />
      <section className="py-16 bg-[#0d1117]">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">よくある質問</h2>
          <div className="space-y-6">
            <div>
              <p className="font-semibold text-white mb-2">Q. 月額¥480で何件の投稿を生成できますか？</p>
              <p className="text-slate-400 text-sm">A. ライトプラン（¥480/月）では月間50件の投稿生成が可能です。スタンダードプラン以上にアップグレードすると使い放題になります。</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Q. X(Twitter)・Instagram・TikTokすべてに対応していますか？</p>
              <p className="text-slate-400 text-sm">A. はい。X・Instagram・Facebook・TikTokの4媒体に最適化された投稿文を1つのテーマから一括生成します。各プラットフォームの文字数制限・ハッシュタグ文化にも対応しています。</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Q. ハッシュタグはAIが自動で提案してくれますか？</p>
              <p className="text-slate-400 text-sm">A. はい。投稿内容に最適なハッシュタグをAIが自動提案します。トレンドハッシュタグと固定ハッシュタグを組み合わせて、最大のリーチを実現します。</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Q. 投稿時間帯の最適化とはどういう意味ですか？</p>
              <p className="text-slate-400 text-sm">A. ターゲットとするフォロワー層が最もアクティブな時間帯をAIが分析し、投稿スケジュールを提案します。エンゲージメント率の向上に直結します。</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Q. 結婚相談所やサービス業にも使えますか？</p>
              <p className="text-slate-400 text-sm">A. はい。業種・ターゲット層・トーンを指定することで、あらゆる業種に最適化された投稿を生成します。結婚相談所・飲食店・美容院・EC事業者など多くの業種で活用されています。</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 口コミ ── */}
      <section className="bg-[#0d1117] py-20 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-4 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
              ユーザーの<span className="text-emerald-400">リアルな声</span>
            </h2>
            <p className="text-slate-400 text-sm">実際に使ったユーザーの感想</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: '田村 美咲', role: 'ハンドメイド作家', location: '東京都', text: 'Instagramの投稿をコツコツ作るのが時間的に無理でした。商品写真のキャプションと投稿時間まで自動提案してくれるので、フォロワーが3ヶ月で1000人から4000人に増えました。販売数も連動して伸びています。', tag: 'ハンドメイド販売' },
              { name: '篠原 和也', role: '飲食店オーナー', location: '大阪府', text: 'お店のSNSを更新する時間がなく、ずっと放置していました。今日の日替わりメニューを入力するだけで3媒体に同時投稿してくれます。フォロワーが増えてランチの予約が入るようになりました。', tag: '飲食店経営' },
              { name: '松本 陽子', role: 'ECサイト運営', location: '神奈川県', text: 'セール告知をTwitterとInstagramとFacebookに個別で投稿するのが苦痛でした。一元管理できるようになって投稿頻度が上がり、サイトへの流入が1.8倍になりました。効果が数字で見えるのが気持ちいいです。', tag: 'EC運営' },
              { name: '青木 拓実', role: 'フリーランスコンサル', location: '福岡県', text: '個人ブランディングのためにLinkedInとTwitterを育てたかったけど続きませんでした。業界ニュースに絡めた投稿文を自動生成してくれるので毎日投稿できています。問い合わせが月3件増えました。', tag: '個人ブランディング' },
              { name: '伊藤 萌', role: 'インフルエンサー志望・20代', location: '東京都', text: 'フォロワーが伸び悩んでいました。最適な投稿時間の分析と人気ハッシュタグの提案がドンピシャで、1ヶ月でいいね数が3倍になりました。数値で改善できるのがゲームみたいで楽しいです。', tag: 'SNSインフルエンサー' },
              { name: '黒田 一郎', role: '不動産業者', location: '愛知県', text: '物件情報をSNSで発信したいけど毎回文章を考えるのが大変でした。物件データを入力するだけで魅力的な紹介文を作ってくれます。問い合わせフォームへの流入が月30%増えました。', tag: '不動産SNS集客' },
            ].map((r, i) => (
              <div key={i} className="bg-[#13141f] border border-white/5 hover:border-emerald-500/20 rounded-2xl p-6 space-y-4 flex flex-col transition-all">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-emerald-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed flex-1">{r.text}</p>
                <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0">
                    {r.name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm">{r.name}</p>
                    <p className="text-slate-500 text-xs">{r.role} · {r.location}</p>
                  </div>
                  <span className="ml-auto shrink-0 text-[10px] font-medium px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {r.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
