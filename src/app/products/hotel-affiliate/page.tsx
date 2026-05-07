import React from 'react'
import dynamic from 'next/dynamic'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Share2, Zap, Hotel, Instagram, Twitter, ArrowRight, ShieldCheck, AlertTriangle, Coins } from 'lucide-react'
import Link from 'next/link'

const AffiliateLpContent = () => {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32">
      {/* 🚀 Hero Section */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center space-y-10 text-left">
        <Badge className="bg-pink-500/10 text-pink-400 border-pink-500/20 px-6 py-1 rounded-full font-black uppercase text-xs tracking-widest">Viral Commerce OS</Badge>
        <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-[1.1]">
          アフィリエイト<br/><span className="text-pink-500">連携</span>
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-slate-300 max-w-4xl mx-auto leading-relaxed px-4 text-center">
          宿体験を、資産に変える。<br className="hidden md:block" />
          バズる紹介文 ＋ 楽天アフィリエイト自動生成。
        </h2>
        <div className="flex flex-wrap justify-center gap-6 pt-6 text-center">
          <Link href="/products/hotel-affiliate">
            <button className="h-20 px-12 bg-pink-600 hover:bg-pink-500 text-white font-black text-xl rounded-2xl shadow-[0_20px_50px_rgba(225,29,72,0.3)] transition-all active:scale-95 uppercase italic leading-none">
              紹介文を錬成する ➔
            </button>
          </Link>
        </div>
      </section>

      {/* ⚠️ Problem Section */}
      <section className="bg-[#13141f] py-24 border-y border-white/5 text-left text-left">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h3 className="text-3xl font-black text-white italic uppercase tracking-tight">「最高な宿だった」を、どう伝えていいか迷いませんか？</h3>
            <ul className="space-y-4 text-slate-400 font-bold">
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 感動を言葉にするのが難しく、結局「良かった」で終わる</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> アフィリエイトリンクの発行手順が面倒で、収益機会を逃している</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> SNSでどんなハッシュタグをつければいいか分からない</li>
            </ul>
          </div>
          <div className="bg-black/50 border-4 border-pink-500/20 rounded-[3rem] p-10 shadow-inner text-center">
             <p className="text-pink-400 text-lg italic font-black leading-loose text-left">
               AIがあなたの「感動」をマーケティングへ。<br/>
               宿泊者の紹介が、宿の新たな予約窓口になります。
             </p>
          </div>
        </div>
      </section>

      {/* ✨ Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-32 space-y-20">
        <div className="text-center space-y-4">
          <h3 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter text-center">Viral Marketing OS</h3>
          <p className="text-slate-500 font-bold uppercase italic text-center">宿のファンを増やす4つの機能</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 text-left">
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-pink-500/30 transition-all group">
            <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform"><Zap size={24} /></div>
            <h4 className="text-xl font-black text-white uppercase italic">バズる紹介文の錬成</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">「エモい」「有益」など、投稿したい雰囲気に合わせ、AIが思わず予約したくなる紹介文を自動生成します。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-pink-500/30 transition-all group">
            <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform"><Coins size={24} /></div>
            <h4 className="text-xl font-black text-white uppercase italic">楽天アフィリエイト連動</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">あなたのアフィリエイトIDを組み込んだ楽天トラベルのリンクを瞬時に作成。手間なく収益化をスタートできます。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-pink-500/30 transition-all group">
            <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform"><Share2 size={24} /></div>
            <h4 className="text-xl font-black text-white uppercase italic">SNS投稿一元化</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed pl-0">X、Instagram、Threadsへ1クリックで移行。制作から投稿までのタイムラグをゼロにします。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-pink-500/30 transition-all group">
            <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform"><Hotel size={24} /></div>
            <h4 className="text-xl font-black text-white uppercase italic">宿の認知拡大サポート</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed pl-0">宿泊者の投稿の質を底上げすることで、宿にとっては広告費をかけずに「本物」の口コミを増やすことが可能に。</p>
          </div>
        </div>
      </section>

      {/* 🚀 CTA Section */}
      <section className="max-w-5xl mx-auto px-4 pt-20 text-center">
        <Card className="bg-gradient-to-br from-pink-600 to-rose-900 border-0 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden text-center space-y-10">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Share2 size={300} className="text-white" /></div>
          <div className="relative z-10 space-y-6">
            <h3 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none">宿泊体験を、資産に。</h3>
            <p className="text-pink-100 text-lg font-bold leading-relaxed max-w-2xl mx-auto px-4">
              あなたの感動が、誰かの新しい旅になり、あなたの収益に。NextraLabsで、新しい宿紹介の形を始めましょう。
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-6">
              <Link href="/signup">
                <button className="h-20 px-16 bg-white text-pink-700 font-black text-2xl rounded-2xl shadow-xl hover:bg-pink-50 transition-all active:scale-95 uppercase italic leading-none">
                  無料で使ってみる
                </button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(AffiliateLpContent), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507]" />
})

export default function HotelAffiliateLp() {
  return <NoSSRWrapper />
}
