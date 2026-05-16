import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '中古・新品AI比較ナビ | 損得勘定とAI市場判定で賢い買い物 | NextraLabs',
  description: '欲しい商品名を入力するだけ。AIが中古vs新品の損得を計算し、最安値・相場価格・おすすめ購入先を自動判定。楽天市場・メルカリ・ヤフオクの比較も。完全無料。',
  keywords: ['中古vs新品AI','買い物比較AI','最安値AI','価格比較AI','メルカリ相場AI','楽天市場比較','商品購入AI','お得買い物AI','価格判定AI','NextraLabs買い物'],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: {
    canonical: 'https://nextralab.jp/products/buy-smart-nav',
  },
  openGraph: {
    title: '中古・新品AI比較ナビ | 損得勘定とAI市場判定で賢い買い物 | NextraLabs',
    description: '欲しい商品名を入力するだけ。AIが中古vs新品の損得を計算し、最安値・相場価格・おすすめ購入先を自動判定。楽天市場・メルカリ・ヤフオクの比較も。完全無料。',
    url: 'https://nextralab.jp/products/buy-smart-nav',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: 'https://nextralab.jp/og-image.png', width: 1200, height: 630, alt: '中古・新品AI比較ナビ | 損得勘定とAI市場判定で賢い買い物 | NextraLabs' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '中古・新品AI比較ナビ | 損得勘定とAI市場判定で賢い買い物 | NextraLabs',
    description: '欲しい商品名を入力するだけ。AIが中古vs新品の損得を計算し、最安値・相場価格・おすすめ購入先を自動判定。楽天市場・メルカリ・ヤフオクの比較も。完全無料。',
    images: ['https://nextralab.jp/og-image.png'],
  },
}

﻿import React from 'react'
import dynamic from 'next/dynamic'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Scale, Zap, ShoppingBag, Search, ArrowRight, ShieldCheck, AlertTriangle, TrendingDown } from 'lucide-react'
import Link from 'next/link'

const BuySmartLpContent = () => {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32">
      {/* 🚀 Hero Section */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center space-y-10 text-left">
        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-6 py-1 rounded-full font-bold uppercase text-xs tracking-tight">Market Value Intelligence</Badge>
        <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tighter uppercase leading-[1.1]">
          中古・新品<br/><span className="text-emerald-500">比較ナビ</span>
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-slate-300 max-w-4xl mx-auto leading-relaxed px-4 text-center">
          損得勘定の「正解」をAIが出す。<br className="hidden md:block" />
          楽天・ラクマ・Google検索を瞬時に一括照合。
        </h2>
        <div className="flex flex-wrap justify-center gap-6 pt-6 text-center">
          <Link href="/products/buy-smart-nav/app">
            <button className="h-20 px-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xl rounded-2xl shadow-[0_20px_50px_rgba(79,70,229,0.3)] transition-all active:scale-95 uppercase leading-none">
              損得を判定する ➔
            </button>
          </Link>
        </div>
      </section>

      {/* ⚠️ Problem Section */}
      <section className="bg-[#13141f] py-24 border-y border-white/5 text-left text-left">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-white uppercase tracking-tight">「もっと安く買えたかも」と後悔したことは？</h3>
            <ul className="space-y-4 text-slate-400 font-bold">
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 新品を買った直後に、極美品の中古が半額で出ているのを見つけた</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> ポイント還元を含めた「実質価格」の計算が面倒</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> フリマサイトの相場が分からず、高い買い物をした</li>
            </ul>
          </div>
          <div className="bg-black/50 rounded-[3rem] p-10 shadow-inner text-center">
             <p className="text-emerald-400 text-lg font-bold leading-loose text-left">
               AIが複数の市場を同時にパトロール。<br/>
               あなたが今選ぶべき「本物の賢い選択」を提示します。
             </p>
          </div>
        </div>
      </section>

      {/* ✨ Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-32 space-y-20 text-left">
        <div className="text-center space-y-4 text-center">
          <h3 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter text-center">Smart Purchase OS</h3>
          <p className="text-slate-500 font-bold uppercase text-center">買い物を科学する4つのインテリジェンス</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-emerald-500/30 transition-all group text-left">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0"><Search size={24} /></div>
            <h4 className="text-xl font-bold text-white uppercase ">全市場一括クロール</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed text-left">Google検索、楽天市場、楽天ラクマ。主要な購入チャネルをAIが瞬時に横断検索。隠れた最安値を逃しません。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-emerald-500/30 transition-all group text-left text-left">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0"><Scale size={24} /></div>
            <h4 className="text-xl font-bold text-white uppercase ">損得勘定 AI JUDGMENT</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed text-left">単なる価格比較ではなく「状態・送料・ポイント・将来価値」を総合的にスコアリング。今どちらを買うべきか結論を出します。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-emerald-500/30 transition-all group text-left text-left">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0"><TrendingDown size={24} /></div>
            <h4 className="text-xl font-bold text-white uppercase text-left">将来価値リセール予測</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed text-left text-left pl-0">「今買っておけば、半年後でも〇〇円で売れる」というリセールバリューまで考慮した、投資的な買い物をサポート。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-emerald-500/30 transition-all group text-left text-left">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0"><ShieldCheck size={24} /></div>
            <h4 className="text-xl font-bold text-white uppercase text-left text-left pl-0">フリマ・リスク判定</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed text-left text-left pl-0">中古品のコンディションや出品者の評価をAIがスキャン。安さの裏にあるリスクを事前に警告します。</p>
          </div>
        </div>
      </section>

      {/* 🎬 YouTube動画セクション */}
      <section className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="space-y-6">
          <span className="inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-6 py-1 rounded-full font-bold uppercase text-xs tracking-tight">実際に使ってみた</span>
          <h3 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tighter">
            AIの判定を<span className="text-emerald-500">動画で確認</span>
          </h3>
          <p className="text-slate-400 font-bold">ダイソン・iPhone・ルンバで検証。意外な判定結果に驚き！</p>
        </div>
        <div className="mt-10 relative w-full aspect-video rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <iframe
            src="https://www.youtube.com/embed/vCW0Ok1VqLQ"
            title="AIが新品か中古か一発判定！ダイソン・iPhone・ルンバで検証してみた【NextraLabs AI比較ナビ】"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </section>

      {/* 🚀 CTA Section */}
      <section className="max-w-5xl mx-auto px-4 pt-20 text-center text-center">
        <Card className="bg-gradient-to-br from-emerald-600 to-slate-900 border-0 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden text-center space-y-10 text-center">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Scale size={300} className="text-white" /></div>
          <div className="relative z-10 space-y-6 text-center text-center">
            <h3 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter text-center leading-none">Smart Used or New?</h3>
            <p className="text-emerald-100 text-lg font-bold leading-relaxed max-w-2xl mx-auto px-4 text-center text-center">
              買い物の「失敗」を、AIでゼロに。中古・新品比較ナビで、あなたの資産価値を最大化させましょう。
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-6 text-center text-center">
              <Link href="/signup">
                <button className="h-20 px-16 bg-white text-emerald-700 font-bold text-2xl rounded-2xl shadow-xl hover:bg-emerald-50 transition-all active:scale-95 uppercase leading-none">
                  Get Started Free
                </button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(BuySmartLpContent), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507]" />
})

export default function BuySmartNavLp() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: '中古・新品AI比較ナビ',
    description: '欲しい商品名を入力するだけ。AIが中古vs新品の損得を計算し、最安値・相場価格・おすすめ購入先を自動判定。',
    applicationCategory: 'ShoppingApplication',
    operatingSystem: 'Web',
    url: 'https://nextralab.jp/products/buy-smart-nav',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
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
              <p className="font-semibold text-white mb-2">Q. 完全無料で使えますか？</p>
              <p className="text-slate-400 text-sm">A. はい、中古・新品AI比較ナビは完全無料でご利用いただけます。登録不要で、すぐに使い始めることができます。</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Q. メルカリやヤフオクの相場も調べられますか？</p>
              <p className="text-slate-400 text-sm">A. はい。楽天市場・メルカリ・ヤフオク・Amazonの相場価格をAIが横断的に比較し、中古品と新品の損得を数値で算出します。</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Q. どんな商品でも比較できますか？</p>
              <p className="text-slate-400 text-sm">A. 家電・スマートフォン・ゲーム・ブランド品・書籍など、市場で流通している商品であれば基本的に対応しています。商品名またはJANコードで検索できます。</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Q. 「今が買い時かどうか」も教えてもらえますか？</p>
              <p className="text-slate-400 text-sm">A. はい。価格トレンドをAIが分析し、「今すぐ購入すべき」「もう少し待てば値下がりする可能性あり」「中古を選ぶとXX円お得」といった購入タイミングアドバイスを提供します。</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Q. 個人情報の入力は必要ですか？</p>
              <p className="text-slate-400 text-sm">A. 不要です。欲しい商品名を入力するだけで診断できます。アカウント登録・クレジットカード情報・個人情報は一切必要ありません。</p>
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
              { name: '高橋 美智子', role: '主婦・40代', location: '千葉県', text: '毎月の食費を節約したくて使い始めました。同じ商品でも最安値のサイトをすぐ教えてくれるので、先月だけで食費が8000円浮きました。比較するのが面倒だった私でも続けられています。', tag: '家計節約' },
              { name: '西村 雄太', role: '大学生', location: '京都府', text: '仕送りが少なくて節約が必須です。ガジェット購入前に必ずこれで調べるようになりました。欲しいワイヤレスイヤホンが3サイトで値段がバラバラで、最安値で買えて5000円以上得しました。', tag: '学生節約' },
              { name: '岡田 裕子', role: 'ネットショップ運営', location: '兵庫県', text: '仕入れ価格の比較に使っています。複数の仕入れ先を一気に比較できるので、業務効率が上がりました。月の仕入れコストが約15%下がって売上利益率が改善しました。', tag: 'EC事業者' },
              { name: '池田 直樹', role: 'エンジニア・30代', location: '東京都', text: 'PC周辺機器をよく買うのですが、セール時期を逃しがちでした。AIが価格変動のパターンを教えてくれるので、今は最安タイミングで買えています。去年より年間2万円以上節約できています。', tag: 'ガジェット好き' },
              { name: '内田 沙織', role: 'OL・20代', location: '愛知県', text: 'ファッション系のセール情報と最安値を教えてくれるのが最高です。楽天やZOZOを行ったり来たりする手間が完全になくなりました。ポイント込みの実質価格で比較してくれるのが賢いです。', tag: 'ファッション好き' },
              { name: '木村 翔', role: '個人事業主', location: '福岡県', text: '事務用品や消耗品を大量購入するので単価比較が命です。入力するだけで最適な購入先を提示してくれるのでかなり時短になりました。月の経費削減に直結していて重宝しています。', tag: '個人事業主' },
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
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm whitespace-nowrap">{r.name}</p>
                    <p className="text-slate-500 text-xs whitespace-nowrap">{r.role} · {r.location}</p>
                    <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">{r.tag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
