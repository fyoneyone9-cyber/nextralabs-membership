import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AIセレクトショップ | トレンド解析×Shopify連携で売上を最大化',
  description: 'AIがトレンドを先読みしてECサイトの商品選定・仕入れを最適化。Shopify連携でリアルタイム在庫管理も。NextraLabsプレミアムプラン専用ツール。',
  keywords: ['AIセレクトショップ', 'Shopify AI', 'トレンド解析', 'EC自動化', 'AIマーチャンダイジング'],
  alternates: {
    canonical: 'https://nextralab.jp/products/ai-select-shop',
  },
  openGraph: {
    title: 'AIセレクトショップ | トレンド解析×Shopify連携で売上を最大化 | NextraLabs',
    description: 'AIがトレンドを先読みしてECサイトの商品選定・仕入れを最適化。Shopify連携でリアルタイム在庫管理も。NextraLabsプレミアムプラン専用ツール。',
    url: 'https://nextralab.jp/products/ai-select-shop',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: 'https://nextralab.jp/og-image.png', width: 1200, height: 630, alt: 'AIセレクトショップ | トレンド解析×Shopify連携で売上を最大化' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIセレクトショップ | トレンド解析×Shopify連携で売上を最大化',
    description: 'AIがトレンドを先読みしてECサイトの商品選定・仕入れを最適化。Shopify連携でリアルタイム在庫管理も。NextraLabsプレミアムプラン専用ツール。',
    images: ['https://nextralab.jp/og-image.png'],
  },
}

﻿import React from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { TrendingUp, Palette, Rocket, Package, ArrowRight, AlertTriangle } from 'lucide-react'

const LPContent = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200" style={{ fontFamily: "'Inter','Noto Sans JP',sans-serif" }}>
      {/* エメラルドトップバー */}
      <div className="h-1 bg-emerald-500 w-full" />

      {/* ヒーロー */}
      <section className="max-w-5xl mx-auto px-4 pt-24 pb-20 space-y-8">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-emerald-400 tracking-wide">在庫ゼロEC・無在庫OS</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-semibold text-white tracking-tight leading-[1.15] max-w-3xl">
          トレンドを選んで、<br />
          <span className="text-emerald-400">AIが商品を作る。</span>
        </h1>

        <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
          在庫リスクゼロ。デザインスキル不要。<br />
          キーワードを入力するだけで、Shopifyへ自動出品できます。
        </p>

        <div className="flex flex-wrap gap-4 pt-2">
          <Link href="/products/ai-select-shop/app">
            <button className="h-12 px-8 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-base rounded-xl transition-all flex items-center gap-2 shadow-[0_0_24px_rgba(16,185,129,0.25)]">
              ショップを立ち上げる <ArrowRight size={18} />
            </button>
          </Link>
        </div>
      </section>

      {/* 課題提起 */}
      <section className="bg-[#1e293b] border-y border-slate-700/50 py-20">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-14 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white tracking-tight">こんな悩み、ありませんか？</h2>
            <ul className="space-y-4 text-slate-400">
              {[
                '在庫を抱えるのが怖い（資金リスク）',
                'デザインのスキルがなく、外注も面倒',
                '仕入れや発送作業で時間がとられる',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <AlertTriangle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[#0f172a] border border-emerald-500/20 rounded-2xl p-8">
            <p className="text-emerald-400 text-base font-medium leading-loose text-center">
              AIセレクトショップなら、<br />
              <span className="text-white font-semibold">1クリックで世界に販売</span>できます。
            </p>
          </div>
        </div>
      </section>

      {/* 機能紹介 */}
      <section className="max-w-5xl mx-auto px-4 py-24 space-y-12">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold text-white tracking-tight">4つのコア技術</h2>
          <p className="text-slate-500 text-sm">在庫ゼロを実現するテクノロジー</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {[
            {
              icon: TrendingUp,
              title: 'リアルタイム・トレンド取得',
              desc: '今日本で話題になっているキーワードをAIが自動抽出。旬のタイミングを逃しません。',
            },
            {
              icon: Palette,
              title: 'AIスタイル・ジェネレーター',
              desc: '和風・サイバー・ネオンなど12種のスタイルから選択。キーワードに合わせたグラフィックを即生成。',
            },
            {
              icon: Rocket,
              title: 'Shopify 1クリック出品',
              desc: 'デザインから出品まで NextraLabs 内で完結。ボタン一つでShopifyストアへ掲載開始。',
            },
            {
              icon: Package,
              title: '完全自動の生産・フルフィルメント',
              desc: '受注後はPrintfulが自動で生産・梱包・発送。あなたは在庫も倉庫も持たなくていい。',
            },
          ].map((f, i) => (
            <div key={i} className="bg-[#1e293b] border border-slate-700/50 hover:border-emerald-500/40 rounded-xl p-6 space-y-3 transition-colors group">
              <div className="w-9 h-9 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <f.icon size={18} className="text-emerald-400" />
              </div>
              <h3 className="text-base font-semibold text-white">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 口コミ */}
      <section className="bg-[#0d1117] py-20 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-4 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
              ユーザーの<span className="text-emerald-400">リアルな声</span>
            </h2>
            <p className="text-slate-400 text-sm">AIセレクトショップを使ったユーザーの評価</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: '中村 葵',
                role: 'ハンドメイド作家 / EC副業',
                location: '福岡県',
                rating: 5,
                text: 'Instagramで「売れそう」と思ったデザインをそのままShopifyに出品できて感動しました。在庫を持たずに月3万円の副収入が生まれています。アイデアがあれば誰でも始められる時代だと実感しました。',
                tag: 'EC副業・ハンドメイド',
              },
              {
                name: '石田 颯太',
                role: 'フリーランスデザイナー',
                location: '東京都',
                rating: 5,
                text: 'トレンド解析機能が特にすごい。今日バズっているキーワードを自動で拾って商品化できるので、流行に乗り遅れることがなくなりました。Shopifyとの連携もワンクリックで完結するので手間ゼロです。',
                tag: 'フリーランス・デザイン',
              },
              {
                name: '吉田 里奈',
                role: 'ネットショップ運営者',
                location: '大阪府',
                rating: 5,
                text: '12種類のスタイルから選べるAIデザイン生成が最高です。センスがなくても「和風×サイバー」などの組み合わせでプロ品質のデザインが出来上がります。副業で月5万円を超えました。',
                tag: 'ネットショップ運営',
              },
            ].map((review, i) => (
              <div key={i} className="bg-[#13141f] border border-white/5 hover:border-emerald-500/20 rounded-2xl p-7 space-y-5 transition-all flex flex-col">
                <div className="flex gap-1">
                  {[...Array(review.rating)].map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-emerald-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed flex-1">「{review.text}」</p>
                <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0">
                    {review.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm whitespace-nowrap">{review.name}</p>
                    <p className="text-slate-500 text-xs whitespace-nowrap">{review.role} · {review.location}</p>
                    <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">{review.tag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-8 pt-4 text-center">
            {[
              { label: '総合満足度', value: '4.8', sub: '/ 5.0' },
              { label: '利用ユーザー', value: '2,400+', sub: '名' },
              { label: '推奨率', value: '96%', sub: 'が推奨' },
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <p className="text-3xl font-bold text-emerald-400">{stat.value}<span className="text-slate-500 text-base font-normal ml-1">{stat.sub}</span></p>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YouTube動画 */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
            <span className="text-red-500">▶</span> 紹介動画を見る
          </h2>
          <div className="relative w-full rounded-2xl overflow-hidden border border-white/10" style={{ paddingTop: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/frDeVaGoqZ4"
              title="NextraLabs AIセレクトショップ 紹介動画"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 pt-16 pb-24">
        <div className="bg-[#1e293b] border border-emerald-500/20 rounded-2xl p-10 md:p-14 text-center space-y-6">
          <h2 className="text-3xl font-semibold text-white tracking-tight">
            あなたのブランドを、<br />
            <span className="text-emerald-400">今日はじめよう。</span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto">
            アイデアを、売れる商品に変える時間。
            AIセレクトショップで、新しいものづくりの形を始めましょう。
          </p>
          <Link href="/products/ai-select-shop/app">
            <button className="h-12 px-8 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-base rounded-xl transition-all inline-flex items-center gap-2">
              無料で試してみる <ArrowRight size={18} />
            </button>
          </Link>
        </div>
      </section>

      {/* フッター */}
      <div className="border-t border-slate-800 py-6 text-center text-xs text-slate-600">
        © 2026 NextraLabs. All rights reserved.
      </div>
    </div>
  )
}

const NoSSR = dynamic(() => Promise.resolve(LPContent), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#0f172a]" />,
})

export default function AISelectShopLP() {
  return <NoSSR />
}
