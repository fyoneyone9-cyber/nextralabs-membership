import React from 'react'
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
                  <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />
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

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 pb-24">
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
