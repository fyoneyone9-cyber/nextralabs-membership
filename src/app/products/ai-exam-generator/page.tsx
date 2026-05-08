import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ToolLaunchButton } from '@/components/ToolLaunchButton'
import {
  ArrowLeft,
  Brain,
  Zap,
  Target,
  Sparkles,
  Trophy,
  Calendar,
  ChevronRight,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'AI問題生成 & 苦手分析',
  description: 'ITパスポート・基本情報などの予想問題をAIが無限生成。解いた結果からあなたの苦手分野を特定。',
  alternates: { canonical: 'https://membership-site-nextralabos.vercel.app/products/ai-exam-generator' },
}

export default function ExamGeneratorPage() {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-20">
      <section className="relative pt-10 md:pt-20 pb-16 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <Link href="/products" className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-emerald-400 mb-8 transition-colors uppercase tracking-widest">
            <ArrowLeft className="h-3 w-3 mr-2" /> Back to Tools
          </Link>

          <div className="max-w-4xl mx-auto text-center mb-16">
            <Badge className="mb-4 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-1 text-xs font-black uppercase tracking-tighter">Knowledge Output Engine</Badge>
            <h1 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tighter italic uppercase leading-none">
              AI問題生成 <br className="hidden md:block" />
              <span className="text-emerald-500">& 苦手分析</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
              テキストや試験範囲から予想問題を無限に生成。
              <br className="hidden md:block" />
              アウトプット中心の学習で、脳に知識を定着させる。
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <ToolLaunchButton productId="ai-exam-generator" className="w-full sm:w-auto h-16 px-10 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xl rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all" />
              <Link href="/products/exam-scheduler" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto h-16 px-10 border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 font-bold text-lg rounded-2xl">
                   学習スケジュールを組む
                </Button>
              </Link>
            </div>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-[2.5rem] blur opacity-25"></div>
              <div className="relative bg-[#0a0a0f] border-2 border-emerald-500 rounded-[2rem] p-6 md:p-12 shadow-2xl text-center space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 text-xs font-black uppercase tracking-widest">Master System Integrated</span>
                </div>
                <h2 className="text-3xl font-black text-white italic uppercase">合格のためのアウトプット特化システム</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { icon: Brain, title: '無限問題生成', desc: 'AIが最新の試験傾向に合わせて問題を自動作成。' },
                    { icon: Target, title: '苦手分野の可視化', desc: '正答率から「何を復習すべきか」を一瞬で特定。' },
                    { icon: Trophy, title: '本番シミュレーション', desc: '制限時間付きの模擬試験モードで実戦力を養う。' }
                  ].map((f, i) => (
                    <Card key={i} className="bg-white/5 border-white/10 p-4">
                      <f.icon className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                      <h3 className="text-white font-bold text-sm mb-2">{f.title}</h3>
                      <p className="text-slate-400 text-[10px] leading-relaxed">{f.desc}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
