import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Shield, Zap, Building2, Search, ArrowRight, Smartphone, Printer, Globe, AlertTriangle, Camera } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Staysee AI Finder | ホテル・民泊の忘れ物管理をAIで自動化 | NextraLabs',
  description: 'ステイシー（Staysee）とリアルタイム連携し、AI画像解析で忘れ物の持ち主を特定。公式なAI保管証明書を発行し、ホテルのホスピタリティと収益を最大化します。',
  keywords: ['Staysee', 'ステイシー', 'ホテル DX', '忘れ物管理', '遺失物 処理', 'AI 鑑定', '民泊 効率化'],
}

export default function StayseeLp() {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32">
      {/* 🚀 Hero Section (SEO: H1) */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center space-y-10">
        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-6 py-1 rounded-full font-black uppercase text-xs">Hotel DX Solution</Badge>
        <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-[1.1]">
          Staysee <span className="text-emerald-500">AI</span> Finder
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-slate-300 max-w-4xl mx-auto leading-relaxed">
          忘れ物対応を「コスト」から「利益と信頼」へ。<br className="hidden md:block" />
          Staysee API連携 ＋ AIプロ鑑定システム。
        </h2>
        <div className="flex flex-wrap justify-center gap-6 pt-6">
          <Link href="/products/staysee-ai-finder/app">
            <button className="h-20 px-12 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xl rounded-2xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] transition-all active:scale-95 uppercase italic">
              今すぐ無料で試す ➔
            </button>
          </Link>
        </div>
      </section>

      {/* ⚠️ Problem Section */}
      <section className="bg-[#13141f] py-24 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 text-left">
            <h3 className="text-3xl font-black text-white italic uppercase tracking-tight">こんな課題、ありませんか？</h3>
            <ul className="space-y-4 text-slate-400 font-bold">
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 客室の忘れ物、持ち主の特定に時間がかかる</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 電話での特徴説明が曖昧でミスが起きやすい</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 着払い発送の事務作業が煩雑で工数がかかる</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 宿泊者との「言った言わない」のトラブル</li>
            </ul>
          </div>
          <div className="bg-black/50 border-4 border-red-500/20 rounded-[3rem] p-10 shadow-inner">
             <p className="text-red-400 text-lg italic font-black text-center leading-loose">
               その「隠れた赤字業務」、<br/>
               Nextra AIが完全自動化します。
             </p>
          </div>
        </div>
      </section>

      {/* ✨ Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-32 space-y-20">
        <div className="text-center space-y-4">
          <h3 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter">Core Technologies</h3>
          <p className="text-slate-500 font-bold uppercase italic">次世代のホテル運営を支える4つの知能</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <FeatureCard 
            icon={<Camera />} 
            title="AIプロ鑑定" 
            desc="カメラで映すだけ。AIが物品の種類、ブランド、状態ランクを詳細に言語化。誰でもプロの鑑定が可能に。"
          />
          <FeatureCard 
            icon={<Globe />} 
            title="Staysee 本物連携" 
            desc="ステイシーAPIと完全同期。宿泊者名簿を読み込み、昨日その部屋にいたお客様を瞬時にリストアップします。"
          />
          <FeatureCard 
            icon={<Shield />} 
            title="AI保管証明書" 
            desc="公式な管理番号付きの鑑定書を自動発行。宿泊者へ送付することで、圧倒的な信頼と安心感を提供します。"
          />
          <FeatureCard 
            icon={<Zap />} 
            title="収益化エンジン" 
            desc="AIが送料や手数料を自動算出。さらに返送荷物へのお土産同梱（アップセル）までAIが提案します。"
          />
        </div>
      </section>

      {/* 🚀 CTA Section */}
      <section className="max-w-5xl mx-auto px-4 pt-20">
        <Card className="bg-gradient-to-br from-emerald-600 to-teal-800 border-0 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden text-center space-y-10">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Building2 size={300} className="text-white" /></div>
          <div className="relative z-10 space-y-6">
            <h3 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter">Ready for Master Model?</h3>
            <p className="text-emerald-100 text-lg font-bold leading-relaxed max-w-2xl mx-auto">
              今すぐNextraLabsに参加して、あなたのホテルのホスピタリティをAIでマスタ化しましょう。
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-6">
              <Link href="/signup">
                <button className="h-20 px-16 bg-white text-emerald-700 font-black text-2xl rounded-2xl shadow-xl hover:bg-emerald-50 transition-all active:scale-95 uppercase italic">
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

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-6 hover:border-emerald-500/30 transition-all shadow-xl group">
      <div className="w-16 h-16 bg-emerald-600/10 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
        {React.cloneElement(icon as React.ReactElement, { size: 32 })}
      </div>
      <h4 className="text-2xl font-black text-white italic uppercase">{title}</h4>
      <p className="text-slate-400 font-bold leading-relaxed text-sm">{desc}</p>
    </div>
  )
}
