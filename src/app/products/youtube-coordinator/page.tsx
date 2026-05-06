import React from 'react'
import dynamic from 'next/dynamic'
import { Icons } from '@/lib/icons'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

const YoutubeSyncLpContent = () => {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32">
      {/* 🚀 Hero Section */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center space-y-10 text-left">
        <Badge className="bg-red-500/10 text-red-400 border-red-500/20 px-6 py-1 rounded-full font-black uppercase text-xs tracking-widest">Fashion Intelligence Hub</Badge>
        <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-[1.1]">
          YouTube <span className="text-red-600">Sync</span>
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-slate-300 max-w-4xl mx-auto leading-relaxed px-4">
          動画の中のスタイルを、あなたの日常へ。<br className="hidden md:block" />
          AI動画解析 ＋ 楽天連動コーディネート。
        </h2>
        <div className="flex flex-wrap justify-center gap-6 pt-6">
          <Link href="/products/youtube-coordinator/app">
            <button className="h-20 px-12 bg-red-600 hover:bg-red-500 text-white font-black text-xl rounded-2xl shadow-[0_20px_50px_rgba(220,38,38,0.3)] transition-all active:scale-95 uppercase italic">
              動画内コーデを特定する ➔
            </button>
          </Link>
        </div>
      </section>

      {/* ⚠️ Problem Section */}
      <section className="bg-[#13141f] py-24 border-y border-white/5 text-left">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h3 className="text-3xl font-black text-white italic uppercase tracking-tight">「あの動画の服、いいな」で終わっていませんか？</h3>
            <ul className="space-y-4 text-slate-400 font-bold">
              <li className="flex items-center gap-4"><Icons.Play className="text-red-500 shrink-0" /> YouTubeで見た憧れのスタイル。ブランドが分からない</li>
              <li className="flex items-center gap-4"><Icons.Play className="text-red-500 shrink-0" /> 似たような服を自分で探すのは時間がかかりすぎる</li>
              <li className="flex items-center gap-4"><Icons.Play className="text-red-500 shrink-0" /> 自分の持っている服とどう合わせればいいか迷う</li>
            </ul>
          </div>
          <div className="bg-black/50 border-4 border-red-500/20 rounded-[3rem] p-10 shadow-inner">
             <p className="text-red-400 text-lg italic font-black text-center leading-loose">
               URLを貼るだけ。<br/>
               AIが動画内のファッションを一瞬でプロファイリング。
             </p>
          </div>
        </div>
      </section>

      {/* ✨ Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-32 space-y-20 text-left">
        <div className="text-center space-y-4">
          <h3 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter text-center">Visual Commerce Engine</h3>
          <p className="text-slate-500 font-bold uppercase italic text-center">ファッションを同期させる4つの知能</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <FeatureCard 
            icon={<Icons.Search />} 
            title="AI動画プロファイリング" 
            desc="動画全体のバイブスをAIが読み取り。出演者が着ている服の種類やスタイル（ストリート、テック等）を特定します。"
          />
          <FeatureCard 
            icon={<Icons.Zap />} 
            title="楽天市場・リアルタイム連動" 
            desc="特定されたアイテムの「類似品」を楽天から即座に抽出。今すぐ買える最新の在庫データを提案します。"
          />
          <FeatureCard 
            icon={<Icons.Shirt />} 
            title="スタイル自動分類" 
            desc="単なるアイテム検索ではなく、コーデ全体の「系統」をAIが分析。あなたのワードローブに馴染むか判定します。"
          />
          <FeatureCard 
            icon={<Icons.ShoppingCart />} 
            title="一括ショッピング動線" 
            desc="気に入ったアイテムはそのまま楽天の購入画面へ。インスピレーションから手元に届くまでの距離をゼロにします。"
          />
        </div>
      </section>

      {/* 🚀 CTA Section */}
      <section className="max-w-5xl mx-auto px-4 pt-20 text-center">
        <Card className="bg-gradient-to-br from-red-600 to-rose-900 border-0 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden text-center space-y-10">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Icons.Youtube size={300} className="text-white" /></div>
          <div className="relative z-10 space-y-6 text-center">
            <h3 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter">Sync Your Style.</h3>
            <p className="text-red-100 text-lg font-bold leading-relaxed max-w-2xl mx-auto px-4 text-center">
              動画を観る時間を、自分を磨く時間へ。NextraLabs YouTube Syncが、あなたのクローゼットをアップデートします。
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-6 text-center">
              <Link href="/signup">
                <button className="h-20 px-16 bg-white text-red-700 font-black text-2xl rounded-2xl shadow-xl hover:bg-red-50 transition-all active:scale-95 uppercase italic">
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

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-6 hover:border-red-500/30 transition-all shadow-xl group">
      <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0">
        {icon}
      </div>
      <h4 className="text-2xl font-black text-white italic uppercase">{title}</h4>
      <p className="text-slate-400 font-bold leading-relaxed text-sm">{desc}</p>
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(YoutubeSyncLpContent), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507]" />
})

export default function YoutubeSyncLp() {
  return <NoSSRWrapper />
}
