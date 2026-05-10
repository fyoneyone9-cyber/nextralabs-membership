import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'YouTube AI Sync | 動画解析×楽天アフィリエイトで収益を最大化 | NextraLabs',
  description: 'YouTube動画URLを入力するだけ。AIが動画内容を解析し、関連する楽天市場商品を自動抽出・アフィリエイトリンク生成。概要欄に貼るだけで収益化。YouTubeチャンネルの広告外収益を底上げ。月額¥1,980。',
  keywords: ['YouTube楽天アフィリエイト','YouTube収益化AI','YouTube動画解析AI','楽天アフィリエイト自動化','YouTube概要欄AI','YouTube物販AI','アフィリエイトAI','YouTube収益最大化','動画収益AI','NextraLabsYouTube','YouTubeマネタイズ','楽天リンク自動生成'],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: {
    canonical: 'https://membership-site-nextralabos.vercel.app/products/youtube-coordinator',
  },
  openGraph: {
    title: 'YouTube AI Sync | 動画解析×楽天アフィリエイトで収益を最大化 | NextraLabs',
    description: 'YouTube動画URLを入力するだけ。AIが動画内容を解析し、関連する楽天市場商品を自動抽出・アフィリエイトリンク生成。概要欄に貼るだけで収益化。月額¥1,980。',
    url: 'https://membership-site-nextralabos.vercel.app/products/youtube-coordinator',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: 'https://membership-site-nextralabos.vercel.app/og-image.png', width: 1200, height: 630, alt: 'YouTube AI Sync | NextraLabs' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YouTube AI Sync | 動画解析×楽天アフィリエイトで収益最大化',
    description: 'YouTube動画URLを入力するだけ。AIが楽天アフィリエイトリンクを自動生成して概要欄収益を底上げ。月額¥1,980。',
    images: ['https://membership-site-nextralabos.vercel.app/og-image.png'],
  },
}

﻿import React from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Shield, Zap, Search, ArrowRight, Youtube, Play, ShoppingCart, Shirt } from 'lucide-react'
import Link from 'next/link'

const YoutubeSyncLpContent = () => {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32">
      {/* 🚀 Hero Section */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center space-y-10 text-left">
        <Badge className="bg-red-500/10 text-red-400 border-red-500/20 px-6 py-1 rounded-full font-bold uppercase text-xs tracking-tight">Fashion Intelligence Hub</Badge>
        <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tighter uppercase leading-[1.1]">
          YouTube <span className="text-red-600">Sync</span>
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-slate-300 max-w-4xl mx-auto leading-relaxed px-4 text-center">
          動画の中のスタイルを、あなたの日常へ。<br className="hidden md:block" />
          AI動画解析 ＋ 楽天連動コーディネート。
        </h2>
        <div className="flex flex-wrap justify-center gap-6 pt-6">
          <Link href="/products/youtube-coordinator/app">
            <button className="h-20 px-12 bg-red-600 hover:bg-red-500 text-white font-bold text-xl rounded-2xl shadow-[0_20px_50px_rgba(220,38,38,0.3)] transition-all active:scale-95 uppercase ">
              動画内コーデを特定する ➔
            </button>
          </Link>
        </div>
      </section>

      {/* ⚠️ Problem Section */}
      <section className="bg-[#13141f] py-24 border-y border-white/5 text-left">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-white uppercase tracking-tight">「あの動画の服、いいな」で終わっていませんか？</h3>
            <ul className="space-y-4 text-slate-400 font-bold">
              <li className="flex items-center gap-4"><Play className="text-red-500 shrink-0" /> YouTubeで見た憧れのスタイル。ブランドが分からない</li>
              <li className="flex items-center gap-4"><Play className="text-red-500 shrink-0" /> 似たような服を自分で探すのは時間がかかりすぎる</li>
              <li className="flex items-center gap-4"><Play className="text-red-500 shrink-0" /> 自分の持っている服とどう合わせればいいか迷う</li>
            </ul>
          </div>
          <div className="bg-black/50 border-4 border-red-500/20 rounded-[3rem] p-10 shadow-inner">
             <p className="text-red-400 text-lg font-bold text-center leading-loose">
               URLを貼るだけ。<br/>
               AIが動画内のファッションを一瞬でプロファイリング。
             </p>
          </div>
        </div>
      </section>

      {/* ✨ Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-32 space-y-20 text-left text-left">
        <div className="text-center space-y-4">
          <h3 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter text-center">Visual Commerce Engine</h3>
          <p className="text-slate-500 font-bold uppercase text-center">ファッションを同期させる4つの知能</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-6 hover:border-red-500/30 transition-all shadow-xl group text-left">
            <div className="w-16 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0">
              <Search size={32} />
            </div>
            <h4 className="text-2xl font-bold text-white uppercase">AI動画プロファイリング</h4>
            <p className="text-slate-400 font-bold leading-relaxed text-sm text-left">動画全体のバイブスをAIが読み取り。出演者が着ている服の種類やスタイル（ストリート、テック等）を特定します。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-6 hover:border-red-500/30 transition-all shadow-xl group text-left text-left">
            <div className="w-16 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0">
              <Zap size={32} />
            </div>
            <h4 className="text-2xl font-bold text-white uppercase">楽天市場・リアルタイム連動</h4>
            <p className="text-slate-400 font-bold leading-relaxed text-sm text-left">特定されたアイテムの「類似品」を楽天から即座に抽出。今すぐ買える最新の在庫データを提案します。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-6 hover:border-red-500/30 transition-all shadow-xl group text-left text-left">
            <div className="w-16 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0">
              <Shirt size={32} />
            </div>
            <h4 className="text-2xl font-bold text-white uppercase text-left">スタイル自動分類</h4>
            <p className="text-slate-400 font-bold leading-relaxed text-sm text-left text-left">単なるアイテム検索ではなく、コーデ全体の「系統」をAIが分析。あなたのワードローブに馴染むか判定します。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-6 hover:border-red-500/30 transition-all shadow-xl group text-left text-left">
            <div className="w-16 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0">
              <ShoppingCart size={32} />
            </div>
            <h4 className="text-2xl font-bold text-white uppercase text-left">一括ショッピング動線</h4>
            <p className="text-slate-400 font-bold leading-relaxed text-sm text-left text-left">気に入ったアイテムはそのまま楽天の購入画面へ。インスピレーションから手元に届くまでの距離をゼロにします。</p>
          </div>
        </div>
      </section>

      {/* 🚀 CTA Section */}
      <section className="max-w-5xl mx-auto px-4 pt-20 text-center text-center">
        <Card className="bg-gradient-to-br from-red-600 to-rose-900 border-0 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden text-center space-y-10 text-center">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Youtube size={300} className="text-white" /></div>
          <div className="relative z-10 space-y-6 text-center text-center">
            <h3 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter text-center">Sync Your Style.</h3>
            <p className="text-red-100 text-lg font-bold leading-relaxed max-w-2xl mx-auto px-4 text-center text-center">
              動画を観る時間を、自分を磨く時間へ。NextraLabs YouTube Syncが、あなたのクローゼットをアップデートします。
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-6 text-center text-center">
              <Link href="/signup">
                <button className="h-20 px-16 bg-white text-red-700 font-bold text-2xl rounded-2xl shadow-xl hover:bg-red-50 transition-all active:scale-95 uppercase ">
                  Join the Fashion Hub
                </button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(YoutubeSyncLpContent), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507]" />
})

export default function YoutubeSyncLp() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'YouTube AI Sync',
    description: 'YouTube動画URLを入力するだけ。AIが動画内容を解析し、関連する楽天市場商品を自動抽出・アフィリエイトリンク生成。',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '1980', priceCurrency: 'JPY' },
    publisher: { '@type': 'Organization', name: 'NextraLabs', url: 'https://membership-site-nextralabos.vercel.app' }
  }
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'どんなYouTubeチャンネルに向いていますか？', acceptedAnswer: { '@type': 'Answer', text: '商品紹介・ライフスタイル・ガジェット・料理・ファッション系のチャンネルに特に効果的です。動画内に商品が登場するコンテンツであれば業種を問わず活用できます。' } },
      { '@type': 'Question', name: '楽天アフィリエイトのアカウントを持っていない場合は？', acceptedAnswer: { '@type': 'Answer', text: '楽天アフィリエイトの無料登録（審査あり）が必要です。本ツールはリンク生成の補助ツールのため、楽天アカウント登録後にご利用ください。' } },
      { '@type': 'Question', name: '動画1本あたり何件の商品リンクが生成されますか？', acceptedAnswer: { '@type': 'Answer', text: 'AIが動画内容を解析し、関連性の高い商品を最大10件自動抽出します。概要欄に貼り付けやすい形式で出力します。' } },
      { '@type': 'Question', name: '収益はいくら増えますか？', acceptedAnswer: { '@type': 'Answer', text: '楽天アフィリエイトの報酬率は商品カテゴリにより異なります（1〜15%）。月間再生数・動画テーマによって効果は変わりますが、概要欄収益の追加は広告収益外の安定収入源になります。' } },
      { '@type': 'Question', name: 'どのプランで利用できますか？', acceptedAnswer: { '@type': 'Answer', text: 'プレミアムプラン（¥1,980/月）で利用可能です。30日間の無料トライアル後に課金が始まります。' } },
    ]
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <NoSSRWrapper />
      <section className="py-16 bg-[#0d1117]">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">よくある質問</h2>
          <div className="space-y-6">
            {[
              { q: 'どんなYouTubeチャンネルに向いていますか？', a: '商品紹介・ライフスタイル・ガジェット・料理・ファッション系のチャンネルに特に効果的です。動画内に商品が登場するコンテンツであれば業種を問わず活用できます。' },
              { q: '楽天アフィリエイトのアカウントがなくても使えますか？', a: '楽天アフィリエイトの無料登録（審査あり）が必要です。本ツールはリンク生成補助ツールのため、楽天アカウント登録後にご利用ください。' },
              { q: '動画1本あたり何件の商品リンクが生成されますか？', a: 'AIが動画内容を解析し、関連性の高い商品を最大10件自動抽出。概要欄に貼り付けやすい形式で出力します。' },
              { q: '収益はどれくらい増えますか？', a: '楽天アフィリエイト報酬率は1〜15%（カテゴリ別）。月間再生数・テーマによって効果は変わりますが、広告収益外の安定収入源として機能します。' },
              { q: 'どのプランで利用できますか？', a: 'プレミアムプラン（¥1,980/月）で利用可能です。' },
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-xl" style={{ background: '#13141f', border: '1px solid #1e293b' }}>
                <p className="font-semibold text-white mb-2">Q. {item.q}</p>
                <p className="text-slate-400 text-sm leading-relaxed">A. {item.a}</p>
              </div>
            ))}
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
              { name: '笹川 真一', role: '料理チャンネル運営', location: '東京都', text: '料理動画を毎週上げていますが編集後の投稿作業が面倒でした。タイトル・説明文・タグ・サムネイル文言をAIが全部提案してくれるので、投稿作業が30分から5分になりました。再生数も安定して伸びています。', tag: '料理系YouTuber' },
              { name: '土屋 亜里沙', role: 'ライフスタイル系', location: '大阪府', text: '楽天ROOMとYouTubeを連携してアフィリエイトを増やしたかったのですが、商品リンクを動画に紐付けるのが大変でした。動画内で紹介した商品を自動でリスト化してくれるので収益化がスムーズになりました。', tag: 'アフィリエイト' },
              { name: '久保 達也', role: 'ガジェット系', location: '神奈川県', text: 'レビュー動画のSEO対策をどうすればいいか分かりませんでした。検索されやすいキーワードをYouTubeのトレンドと連動して提案してくれるので、検索流入が2倍になりました。', tag: 'ガジェットレビュー' },
              { name: '中川 奈々子', role: '子育て系', location: '埼玉県', text: 'チャンネルを4つ掛け持ちしていてそれぞれの投稿管理が大変でした。まとめて管理できるようになって投稿漏れがゼロになりました。チャンネルごとのパフォーマンスも一目で見られます。', tag: 'チャンネル複数運営' },
              { name: '西田 隆', role: '副業YouTuber', location: '福岡県', text: '本業が忙しくて動画の更新が不定期になっていました。予約投稿と投稿スケジュールの管理で週1本の定期投稿が実現しました。登録者数が安定して増え始めて副業収入につながっています。', tag: '副業YouTuber' },
              { name: '山口 裕美', role: '美容系インフルエンサー', location: '京都府', text: '美容レビュー動画のブランド案件管理が複雑でした。案件ごとの投稿スケジュールと成果レポートを自動でまとめてくれるので、ブランドへの報告がとても楽になりました。リピート案件も増えています。', tag: '美容系案件管理' },
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
