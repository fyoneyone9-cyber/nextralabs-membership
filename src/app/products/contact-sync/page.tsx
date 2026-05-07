import React from 'react'
import dynamic from 'next/dynamic'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CheckCircle2, UserPlus, Zap, Database, Phone, Mail, ArrowRight, ShieldCheck, AlertTriangle, Building2, Search } from 'lucide-react'
import Link from 'next/link'

const ContactSyncLpContent = () => {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32">
      {/* 🚀 Hero Section */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center space-y-10 text-left">
        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-6 py-1 rounded-full font-black uppercase text-xs tracking-widest">CRM Automation Engine</Badge>
        <h1 className="text-4xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-[1.1]">
          Contact <span className="text-blue-500">Sync</span>
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-slate-300 max-w-4xl mx-auto leading-relaxed px-4 text-center">
          名刺の山を「資産」に変える。<br className="hidden md:block" />
          画像スキャン ＋ Google連絡先自動登録システム。
        </h2>
        <div className="flex flex-wrap justify-center gap-6 pt-6 text-center">
          <Link href="/products/contact-sync">
            <button className="h-20 px-12 bg-blue-600 hover:bg-blue-500 text-white font-black text-xl rounded-2xl shadow-[0_20px_50px_rgba(37,99,235,0.3)] transition-all active:scale-95 uppercase italic leading-none">
              名刺を同期する ➔
            </button>
          </Link>
        </div>
      </section>

      {/* ⚠️ Problem Section */}
      <section className="bg-[#13141f] py-24 border-y border-white/5 text-left text-left">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h3 className="text-3xl font-black text-white italic uppercase tracking-tight">もらった名刺、そのままになっていませんか？</h3>
            <ul className="space-y-4 text-slate-400 font-bold">
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 名刺を見返しても誰だったか思い出せない</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 電話番号やメールを手で打つのが面倒</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 連絡先が整理されておらず、営業チャンスを逃している</li>
            </ul>
          </div>
          <div className="bg-black/50 border-4 border-blue-500/20 rounded-[3rem] p-10 shadow-inner text-center">
             <p className="text-blue-400 text-lg italic font-black leading-loose">
               AIがあなたの「専属秘書」になります。<br/>
               カメラを向けるだけで、一瞬で名簿化。
             </p>
          </div>
        </div>
      </section>

      {/* ✨ Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-32 space-y-20 text-left">
        <div className="text-center space-y-4 text-center">
          <h3 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter">Business Connection OS</h3>
          <p className="text-slate-500 font-bold uppercase italic text-center">人脈を加速させる4つのコア技術</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-blue-500/30 transition-all group text-left">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0"><Search size={24} /></div>
            <h4 className="text-xl font-black text-white uppercase italic">OCR精密スキャン</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed text-left">複雑なデザインの名刺でもAIが正確に解読。氏名、会社名、役職、連絡先を瞬時に抽出します。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-blue-500/30 transition-all group text-left text-left">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0"><Database size={24} /></div>
            <h4 className="text-xl font-black text-white uppercase italic">Google連絡先・即時同期</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed text-left">抽出したデータをご自身のGoogleアカウントへ直接保存。PCからもスマホからもすぐに連絡が可能に。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-blue-500/30 transition-all group text-left text-left">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0"><Building2 size={24} /></div>
            <h4 className="text-xl font-black text-white uppercase italic text-left">法人・組織プロファイリング</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed text-left text-left pl-0">会社名から業界や規模をAIが自動判別。ラベル付けを自動化し、後から検索しやすい構造を作ります。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-blue-500/30 transition-all group text-left text-left">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0"><Phone size={24} /></div>
            <h4 className="text-xl font-black text-white uppercase italic text-left text-left pl-0">一括インポート対応</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed text-left text-left pl-0">溜まった名刺をまとめてスキャン。1人ずつ入力する苦行から、あなたを解放します。</p>
          </div>
        </div>
      </section>

      {/* 🚀 CTA Section */}
      <section className="max-w-5xl mx-auto px-4 pt-20 text-center text-center">
        <Card className="bg-gradient-to-br from-blue-600 to-indigo-900 border-0 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden text-center space-y-10 text-center">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><UserPlus size={300} className="text-white" /></div>
          <div className="relative z-10 space-y-6 text-center text-center">
            <h3 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter text-center leading-none">Network Your Knowledge.</h3>
            <p className="text-blue-100 text-lg font-bold leading-relaxed max-w-2xl mx-auto px-4 text-center text-center">
              名刺はただの紙ではありません。AIで「即座に繋がる資産」へ。Contact Syncで、あなたのビジネスネットワークを加速させましょう。
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-6 text-center text-center">
              <Link href="/signup">
                <button className="h-20 px-16 bg-white text-blue-700 font-black text-2xl rounded-2xl shadow-xl hover:bg-blue-50 transition-all active:scale-95 uppercase italic leading-none">
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

const NoSSRWrapper = dynamic(() => Promise.resolve(ContactSyncLpContent), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507]" />
})

export default function ContactSyncLp() {
  return <NoSSRWrapper />
}
