import React from 'react'
import dynamic from 'next/dynamic'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Table, Zap, Receipt, Search, ArrowRight, ShieldCheck, AlertTriangle, FileSpreadsheet } from 'lucide-react'
import Link from 'next/link'

const ExpenseSyncLpContent = () => {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32">
      {/* 🚀 Hero Section */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center space-y-10 text-left">
        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-6 py-1 rounded-full font-black uppercase text-xs tracking-widest">Financial Automation OS</Badge>
        <h1 className="text-4xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-[1.1]">
          Expense <span className="text-emerald-500">Sync</span>
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-slate-300 max-w-4xl mx-auto leading-relaxed px-4 text-center">
          経理作業を「ゼロ」にする。<br className="hidden md:block" />
          レシートスキャン ＋ スプレッドシート自動記帳システム。
        </h2>
        <div className="flex flex-wrap justify-center gap-6 pt-6">
          <Link href="/products/expense-sync">
            <button className="h-20 px-12 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xl rounded-2xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] transition-all active:scale-95 uppercase italic">
              自動記帳を開始する ➔
            </button>
          </Link>
        </div>
      </section>

      {/* ⚠️ Problem Section */}
      <section className="bg-[#13141f] py-24 border-y border-white/5 text-left">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h3 className="text-3xl font-black text-white italic uppercase tracking-tight">領収書の山に、毎月悩んでいませんか？</h3>
            <ul className="space-y-4 text-slate-400 font-bold">
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> レシートを1枚ずつ見て手入力するのが苦痛</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 日付や金額の打ち間違いが頻発する</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 確定申告の時期にまとめてやるのが重労働</li>
            </ul>
          </div>
          <div className="bg-black/50 border-4 border-emerald-500/20 rounded-[3rem] p-10 shadow-inner text-center">
             <p className="text-emerald-400 text-lg italic font-black leading-loose">
               AIが「目」となり「手」となります。<br/>
               画像からデータを抜き出し、自動で整理します。
             </p>
          </div>
        </div>
      </section>

      {/* ✨ Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-32 space-y-20 text-left">
        <div className="text-center space-y-4">
          <h3 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter text-center">Ledger Intelligence</h3>
          <p className="text-slate-500 font-bold uppercase italic text-center">自動化を支える4つのマスタ機能</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-emerald-500/30 transition-all group">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform"><Receipt size={24} /></div>
            <h4 className="text-xl font-black text-white uppercase italic">AIレシート鑑定</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">日付、店舗名、合計金額、さらには軽減税率まで。AIが画像の隅々までスキャンし、情報をデジタル化します。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-emerald-500/30 transition-all group">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform"><Table size={24} /></div>
            <h4 className="text-xl font-black text-white uppercase italic">スプレッドシート完全同期</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">抽出したデータをGoogleスプレッドシートへ自動で一行ずつ追加。リアルタイムに帳簿が更新されます。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-emerald-500/30 transition-all group">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform"><Search size={24} /></div>
            <h4 className="text-xl font-black text-white uppercase italic">Expenses フォルダ監視</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">PC内の特定のフォルダに画像を置くだけ。Nextra AIが新規ファイルを検知し、処理プロトコルを起動します。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-emerald-500/30 transition-all group">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform"><Zap size={24} /></div>
            <h4 className="text-xl font-black text-white uppercase italic">爆速処理エンジン</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">Gemini 2.5 Flashエンジンを搭載。10枚のレシートも数秒で解析・記帳を完了させる驚異的なスピードを実現。</p>
          </div>
        </div>
      </section>

      {/* 🚀 CTA Section */}
      <section className="max-w-5xl mx-auto px-4 pt-20 text-center">
        <Card className="bg-gradient-to-br from-emerald-600 to-teal-900 border-0 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden text-center space-y-10">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Table size={300} className="text-white" /></div>
          <div className="relative z-10 space-y-6 text-center">
            <h3 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter">Automate Your Ledger.</h3>
            <p className="text-emerald-100 text-lg font-bold leading-relaxed max-w-2xl mx-auto px-4 text-center">
              入力の時間はもう必要ありません。Expense Syncで、経理業務を完全に「透明化」させましょう。
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-6 text-center">
              <Link href="/signup">
                <button className="h-20 px-16 bg-white text-emerald-700 font-black text-2xl rounded-2xl shadow-xl hover:bg-emerald-50 transition-all active:scale-95 uppercase italic leading-none">
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

const NoSSRWrapper = dynamic(() => Promise.resolve(ExpenseSyncLpContent), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507]" />
})

export default function ExpenseSyncLp() {
  return <NoSSRWrapper />
}
