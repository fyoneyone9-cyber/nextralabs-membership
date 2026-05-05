import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Camera, Search, Mail, Database, Building2, BellRing, ArrowRight, ShieldCheck, CheckCircle2, PlayCircle, Lock } from 'lucide-react'

export default function StayseeAiFinderPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0f]" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="bg-amber-500 text-black border-0 px-6 py-1.5 text-sm font-black uppercase tracking-widest shadow-xl flex items-center justify-center w-fit mx-auto gap-2">
              <Lock className="h-3 w-3" /> プレミアムプラン限定
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight italic uppercase">
              Staysee AI Finder<br/>
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                忘れ物管理を、AIで自動化。
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
              拾得物をスマホで撮るだけ。AIが宿泊データと照合し、持ち主の特定から写真付き連絡メールの作成まで、わずか数秒で完了。
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-4">
              <Link href="/products/staysee-ai-finder/app">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white font-black text-2xl px-12 h-20 rounded-[1.5rem] shadow-2xl shadow-blue-600/30 gap-3 transition-transform hover:scale-105">
                  ツールを起動する <ArrowRight className="h-7 w-7" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-white border-white/40 hover:bg-white hover:text-black font-black text-2xl px-12 h-20 rounded-[1.5rem] gap-3 transition-all">
                <PlayCircle className="h-7 w-7" /> デモ動画
              </Button>
            </div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">※ ご利用には有料メンバーシップへの登録が必要です</p>
          </div>
        </div>
      </section>

      {/* Problem & Solution (Same content, updated visuals) */}
      <section className="py-24 bg-[#0a0a0f]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-black text-white leading-tight underline decoration-blue-500 decoration-8 underline-offset-8">プロフェッショナルの<br/>ための忘れ物管理。</h2>
              <ul className="space-y-6">
                {[
                  '手書きノートやExcelへの転記作業',
                  '「傘」「充電器」など、特徴のない大量の在庫管理',
                  'ゲストからの問い合わせ電話への照合作業',
                  '持ち主不明による長期保管コストの増大',
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 items-start text-slate-400">
                    <CheckCircle2 className="h-6 w-6 text-blue-500 mt-1 shrink-0" />
                    <span className="text-xl font-bold">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-900/20 to-slate-900 p-12 rounded-[3rem] border border-blue-500/20 shadow-2xl space-y-6">
              <div className="flex items-center gap-3 text-blue-400 mb-2">
                <ShieldCheck className="h-8 w-8" />
                <h3 className="text-2xl font-black uppercase">Enterprise Security</h3>
              </div>
              <p className="text-slate-300 text-lg leading-relaxed font-medium">
                本ツールは宿泊施設の現場スタッフ専用に設計されています。個人情報保護と業務効率化を両立する、法人品質のAIソリューションです。
              </p>
              <div className="pt-6 border-t border-white/5">
                 <Badge className="bg-slate-800 text-slate-400">商用利用可</Badge>
                 <Badge className="ml-2 bg-slate-800 text-slate-400">API保守込</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow (Stay as is) */}
      <section className="py-32 bg-slate-900/30 border-y border-white/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-black text-white mb-20 italic uppercase tracking-tighter">Workflow Visualization</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {[
              { icon: Camera, title: "1. 撮影", desc: "スマホで拾得物を撮影" },
              { icon: Search, title: "2. 解析", desc: "AIが特徴を自動抽出" },
              { icon: Database, title: "3. 照合", desc: "Stayseeデータと突合" },
              { icon: Mail, title: "4. 通知", desc: "ゲストへ自動連絡" },
            ].map((step, i) => (
              <div key={i} className="relative p-10 bg-[#1a1b23] rounded-[2.5rem] border border-white/5 shadow-xl group hover:border-blue-500/50 transition-all">
                <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-600/10 text-blue-500 group-hover:scale-110 transition-transform">
                  <step.icon className="h-10 w-10" />
                </div>
                <h4 className="text-2xl font-black text-white mb-2">{step.title}</h4>
                <p className="text-slate-500 font-bold">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / CTA - Hard Lock Emphasis */}
      <section className="py-32 bg-blue-600 text-white rounded-t-[4rem]">
        <div className="container mx-auto px-4 text-center space-y-10">
          <div className="inline-flex h-20 w-20 bg-white/20 rounded-full items-center justify-center mb-4 border-2 border-white/30 animate-pulse">
            <Lock className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic uppercase leading-none">Subscription Required</h2>
          <p className="text-2xl opacity-90 max-w-2xl mx-auto font-medium leading-relaxed">
            Staysee AI Finder は、NextraLabs プレミアム会員限定のサービスです。<br/>
            導入をご希望のオーナー様は、まずはメンバーシップにご参加ください。
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
            <Link href="/pricing">
              <Button size="lg" className="bg-white text-blue-600 font-black text-2xl px-14 h-24 rounded-[2rem] shadow-2xl transition-all hover:scale-105 active:scale-95">
                プレミアムプランに登録
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg" variant="outline" className="text-white border-white/40 hover:bg-white/10 font-black text-2xl px-14 h-24 rounded-[2rem]">
                他のツールを見る
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
