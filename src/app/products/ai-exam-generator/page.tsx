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
  BookOpen,
  History,
  LineChart,
  ChevronRight,
  BrainCircuit,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'AI試験問題ジェネレーター | 資格試験の模擬問題を無制限自動生成',
  description: 'CompTIA・FP・宅建・情報処理など各種資格試験の模擬問題をAIが自動生成。解説付きで理解が深まる。過去問だけでは足りない演習量を補う。',
  keywords: ["AI試験問題","資格試験AI","模擬試験自動生成","CompTIA AI","FP試験AI"],
  alternates: {
    canonical: 'https://membership-site-nextralabos.vercel.app/products/ai-exam-generator',
  },
  openGraph: {
    title: 'AI試験問題ジェネレーター | 資格試験の模擬問題を無制限自動生成 | NextraLabs',
    description: 'CompTIA・FP・宅建・情報処理など各種資格試験の模擬問題をAIが自動生成。解説付きで理解が深まる。過去問だけでは足りない演習量を補う。',
    url: 'https://membership-site-nextralabos.vercel.app/products/ai-exam-generator',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: 'https://membership-site-nextralabos.vercel.app/og-image.png', width: 1200, height: 630, alt: 'AI試験問題ジェネレーター | 資格試験の模擬問題を無制限自動生成' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI試験問題ジェネレーター | 資格試験の模擬問題を無制限自動生成',
    description: 'CompTIA・FP・宅建・情報処理など各種資格試験の模擬問題をAIが自動生成。解説付きで理解が深まる。過去問だけでは足りない演習量を補う。',
    images: ['https://membership-site-nextralabos.vercel.app/og-image.png'],
  },
},
    ],
    locale: 'ja_JP',
    type: 'article',
  },,
  alternates: { 
    canonical: 'https://membership-site-nextralabos.vercel.app/products/ai-exam-generator' 
  },
}

const examFeatures = [
  {
    icon: BrainCircuit,
    title: '過去問ベースの無限生成',
    description: 'ITパスポートやCompTIAなどのシラバスに基づき、AIが類似の過去問や予想問題を無限に生成。',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
  {
    icon: Target,
    title: 'リアルタイム苦手分析',
    description: 'あなたの解答傾向から、計算問題、マネジメント系、セキュリティ系などの弱点を1%単位で数値化。',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
  {
    icon: History,
    title: '復習リマインド機能',
    description: 'エビングハウスの忘却曲線に基づき、間違えた問題を最適なタイミングで再出題。',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
]

export default function ExamGeneratorPage() {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-20">
      {/* Hero Section */}
      <section className="relative pt-10 md:pt-20 pb-16 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <Link
            href="/products"
            className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-emerald-400 mb-8 transition-colors uppercase tracking-tight"
          >
            <ArrowLeft className="h-3 w-3 mr-2" />
            Back to Tools
          </Link>

          <div className="max-w-4xl mx-auto text-center mb-16">
            <Badge className="mb-4 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-1 text-xs font-bold uppercase tracking-tighter">
              Knowledge Output Engine
            </Badge>
            <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 tracking-tighter uppercase leading-none">
              AI問題生成 <br className="hidden md:block" />
              <span className="text-emerald-500">& 過去問分析</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
              テキストを読むだけは終わり。AIが生成する問題でアウトプットを加速。
              <br className="hidden md:block" />
              ITパスポート・基本情報の合格に必要な「解答力」をAIが鍛え上げます。
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <ToolLaunchButton 
                productId="ai-exam-generator" 
                className="w-full sm:w-auto h-12 px-10 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xl rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all uppercase "
              />
              <Link href="/products/exam-scheduler" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto h-12 px-10 border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 font-bold text-lg rounded-2xl uppercase ">
                  Build Schedule
                </Button>
              </Link>
            </div>
          </div>

          {/* MASTERMODEL Quality (Emerald Border) */}
          <div className="max-w-5xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-[#0a0a0f] border-2 border-emerald-500 rounded-[2rem] p-6 md:p-12 shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <Zap className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 text-xs font-bold uppercase tracking-tight">Master System Integrated</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight uppercase">
                      脳に知識を焼き付ける <br />
                      究極のアウトプット
                    </h2>
                    <div className="space-y-6">
                      {examFeatures.map((f, i) => (
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

                  {/* Mock Exam Preview UI */}
                  <div className="bg-[#13141f] rounded-3xl p-6 border border-white/5 shadow-inner">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-emerald-400" />
                        <span className="text-white font-bold text-xs uppercase tracking-tight">Analysis Engine</span>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">Mock Exam #12</Badge>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                        <div className="text-[10px] text-slate-500 font-bold mb-2 uppercase">Your Weak Point</div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-white font-bold">ストラテジ系 / 法務</span>
                          <span className="text-xs text-red-500 font-bold tracking-tight">ACCURACY: 42%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="w-[42%] h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                        </div>
                        <div className="mt-3 text-[10px] text-slate-400 font-medium ">
                          AI Advice: 著作権法とライセンス契約の問題で失点が多い傾向にあります。重点的な復習が必要です。
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-center">
                          <div className="text-[9px] text-slate-500 font-bold uppercase">Correct</div>
                          <div className="text-xl font-bold text-emerald-500 ">84<span className="text-xs">/100</span></div>
                        </div>
                        <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-center">
                          <div className="text-[9px] text-slate-500 font-bold uppercase">Study Time</div>
                          <div className="text-xl font-bold text-blue-400 ">12.5<span className="text-xs">h</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-20 bg-emerald-500/5">
        <div className="container mx-auto px-4 text-center">
          <Sparkles className="w-12 h-12 text-emerald-500 mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 uppercase">「解けない」を、AIが解決する。</h2>
          <p className="text-slate-400 mb-10 max-w-xl mx-auto font-medium">
            過去問をただ解く時代は終わりました。AIによる分析と無限生成で、最短ルートの「合格力」を手に入れましょう。
          </p>
          <ToolLaunchButton productId="ai-exam-generator" className="h-12 px-12 bg-white text-slate-950 font-bold text-xl rounded-2xl hover:bg-slate-200 transition-all" />
          <p className="mt-6 text-xs font-bold text-emerald-500 uppercase tracking-tight ">Premium Plan Master Model</p>
        </div>
      </section>
    </div>
  )
}
