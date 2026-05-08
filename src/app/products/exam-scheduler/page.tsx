import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ToolLaunchButton } from '@/components/ToolLaunchButton'
import {
  BookOpen,
  Calendar,
  Rss,
  BrainCircuit,
  ArrowLeft,
  ChevronRight,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Target,
  TrendingUp,
  Brain,
  Zap,
  GraduationCap,
  Sparkles,
  Trophy,
} from 'lucide-react'

export const metadata: Metadata = {
  title: '資格試験 AIスケジューラー & 問題生成',
  description: 'ITパスポート・基本情報など試験日を入力するだけ。AIが学習計画を自動生成し、さらに予想問題を生成して苦手分析。',
  alternates: { canonical: 'https://membership-site-nextralabos.vercel.app/products/exam-scheduler' },
}

const features = [
  {
    icon: Calendar,
    title: 'AI学習スケジューラー',
    description: '試験日から逆算して、基礎固め・演習・直前対策の4フェーズ計画を自動生成。Googleカレンダーと完全同期。',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    icon: BrainCircuit,
    title: 'AI予想問題生成',
    description: 'ITパスポートやCompTIAなど、試験範囲に合わせた予想問題をAIが無限生成。本番形式でアウトプット学習が可能。',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
  },
  {
    icon: Target,
    title: '苦手・弱点自動分析',
    description: '解いた問題の正答率から、あなたの「苦手分野」をAIが特定。重点的に学習すべきポイントをアドバイス。',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
]

export default function ExamSchedulerPage() {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-20">
      {/* Hero Section */}
      <section className="relative pt-10 md:pt-20 pb-16 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <Link
            href="/products"
            className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-emerald-400 mb-8 transition-colors uppercase tracking-widest"
          >
            <ArrowLeft className="h-3 w-3 mr-2" />
            Back to Tools
          </Link>

          <div className="max-w-4xl mx-auto text-center mb-16">
            <Badge className="mb-4 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-1 text-xs font-black uppercase tracking-tighter">
              Education DX Solution
            </Badge>
            <h1 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tighter italic uppercase leading-none">
              資格試験 AI <br className="hidden md:block" />
              <span className="text-emerald-500">スケジューラー & 問題生成</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
              ITパスポート・基本情報・CompTIA対応。
              <br className="hidden md:block" />
              試験日からの逆算計画と、AIによる弱点分析付き問題演習をこれ一つで。
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <ToolLaunchButton 
                productId="exam-scheduler" 
                className="w-full sm:w-auto h-16 px-10 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xl rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all"
              />
              <Link href="/pricing" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto h-16 px-10 border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-white font-bold text-lg rounded-2xl">
                  プランを確認
                </Button>
              </Link>
            </div>
          </div>

          {/* Master Model Card (Emerald Border) */}
          <div className="max-w-5xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-[#0a0a0f] border-2 border-emerald-500 rounded-[2rem] p-6 md:p-12 shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <Zap className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 text-xs font-black uppercase tracking-widest">Master System Integrated</span>
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight italic uppercase">
                      最短合格を可能にする <br />
                      3つのコア・エンジン
                    </h2>
                    <div className="space-y-6">
                      {features.map((f, i) => (
                        <div key={i} className="flex gap-4">
                          <div className={`shrink-0 w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center border border-white/5`}>
                            <f.icon className={`w-6 h-6 ${f.color}`} />
                          </div>
                          <div>
                            <h3 className="text-white font-bold mb-1">{f.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Preview UI */}
                  <div className="bg-[#13141f] rounded-3xl p-6 border border-white/5 shadow-inner">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-emerald-400" />
                        <span className="text-white font-black text-xs uppercase tracking-widest">Mock Exam Mode</span>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">ITパスポート 2026</Badge>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-3">
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Question #42</div>
                        <p className="text-sm text-slate-200 font-medium">ストラテジ系：BPM（Business Process Management）の説明として適切なものはどれか？</p>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2">
                        {['業務プロセスを継続的に改善する手法', '基幹業務を統合管理するシステム', '顧客との関係を最適化する手法', '社内の知識を共有する仕組み'].map((opt, i) => (
                          <div key={i} className={`p-3 rounded-xl border text-xs font-bold transition-all ${i === 0 ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                            {['ア', 'イ', 'ウ', 'エ'][i]}. {opt}
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 flex items-center justify-between border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="w-3/4 h-full bg-emerald-500"></div>
                          </div>
                          <span className="text-[10px] font-black text-emerald-500">75% 完成</span>
                        </div>
                        <Trophy className="w-4 h-4 text-amber-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Details */}
      <section className="py-20 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { label: '対応試験', val: 'ITパスポート・基本情報・CompTIA・AWS・その他RSS' },
              { label: 'AIエンジン', val: 'Gemini 2.5 Flash / Claude 3.5' },
              { label: '連携先', val: 'Google Calendar / Notion API' },
              { label: '分析精度', val: '苦手分野を1%単位で数値化' }
            ].map((s, i) => (
              <div key={i} className="text-center md:text-left space-y-1">
                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">{s.label}</div>
                <div className="text-sm font-bold text-white">{s.val}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-20 bg-emerald-500/5">
        <div className="container mx-auto px-4 text-center">
          <Sparkles className="w-12 h-12 text-emerald-500 mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 italic uppercase">学習を、AIで「自動化」する。</h2>
          <p className="text-slate-400 mb-10 max-w-xl mx-auto font-medium">
            計画倒れはもう終わり。AIが引いたレールに乗るだけで、最短合格への扉が開きます。
          </p>
          <ToolLaunchButton productId="exam-scheduler" className="h-16 px-12 bg-white text-slate-950 font-black text-xl rounded-2xl hover:bg-slate-200 transition-all" />
          <p className="mt-6 text-xs font-black text-emerald-500 uppercase tracking-widest italic">Standard Plan Limited Access</p>
        </div>
      </section>
    </div>
  )
}
