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
  title: 'AI問題生成 & 苦手分析 | 予想問題を無限生成・弱点ポイントを可視化 | NextraLabs',
  description: 'テキストや単元を入力するだけ。AIが予想問題・過去問スタイルの問題を自動生成し、苦手箇所をスコアで可視化。資格試験・入試・定期テスト対策に。月額¥1,980。',
  keywords: ['AI問題生成','予想問題AI','苦手分析AI','試験問題自動生成','テスト問題AI','資格試験問題AI','問題集AI','弱点克服AI','学習AI','NextraLabs問題生成'],
  alternates: {
    canonical: 'https://membership-site-nextralabos.vercel.app/products/ai-exam-generator',
  },
  openGraph: {
    title: 'AI問題生成 & 苦手分析 | 予想問題を無限生成・弱点ポイントを可視化 | NextraLabs',
    description: 'テキストや単元を入力するだけ。AIが予想問題・過去問スタイルの問題を自動生成し、苦手箇所をスコアで可視化。資格試験・入試・定期テスト対策に。月額¥1,980。',
    url: 'https://membership-site-nextralabos.vercel.app/products/ai-exam-generator',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: 'https://membership-site-nextralabos.vercel.app/og-image.png', width: 1200, height: 630, alt: 'AI問題生成 & 苦手分析 | 予想問題を無限生成・弱点ポイントを可視化 | NextraLabs' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI問題生成 & 苦手分析 | 予想問題を無限生成・弱点ポイントを可視化 | NextraLabs',
    description: 'テキストや単元を入力するだけ。AIが予想問題・過去問スタイルの問題を自動生成し、苦手箇所をスコアで可視化。資格試験・入試・定期テスト対策に。月額¥1,980。',
    images: ['https://membership-site-nextralabos.vercel.app/og-image.png'],
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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AI問題生成 & 苦手分析',
    description: 'テキストや単元を入力するだけ。AIが予想問題・過去問スタイルの問題を自動生成し、苦手箇所をスコアで可視化。',
    applicationCategory: 'EducationApplication',
    operatingSystem: 'Web',
    url: 'https://membership-site-nextralabos.vercel.app/products/ai-exam-generator',
    offers: { '@type': 'Offer', price: '1980', priceCurrency: 'JPY' },
    publisher: { '@type': 'Organization', name: 'NextraLabs' },
  }
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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

      {/* FAQ */}
      <section className="py-16 bg-[#0d1117]">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">よくある質問</h2>
          <div className="space-y-6">
            <div>
              <p className="font-semibold text-white mb-2">Q. どんな試験・資格に対応していますか？</p>
              <p className="text-slate-400 text-sm">A. CompTIA・FP・宅建・情報処理技術者試験・TOEIC・英検・大学入試・定期テストなど幅広い分野に対応しています。独自のテキストや単元を貼り付けるだけでも問題生成できます。</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Q. 苦手分析はどのように行われますか？</p>
              <p className="text-slate-400 text-sm">A. 回答した問題の正答率・回答時間・間違えたパターンをAIがリアルタイム分析し、「計算問題が弱い」「選択肢の引っかけ問題に弱い」など具体的な弱点をスコア化して可視化します。</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Q. 問題の難易度は調整できますか？</p>
              <p className="text-slate-400 text-sm">A. はい。初級・中級・上級・本番レベルの4段階で難易度を設定できます。苦手な分野は簡単な問題から始め、徐々に難しくしていくアダプティブ学習にも対応しています。</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Q. 月額¥1,980以外のプランはありますか？</p>
              <p className="text-slate-400 text-sm">A. NextraLabsではライト（¥480）・スタンダード（¥980）・プレミアム（¥1,980）の3プランをご用意しています。AI問題生成はプレミアムプランでご利用いただけます。</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Q. 解説付きの問題も生成されますか？</p>
              <p className="text-slate-400 text-sm">A. はい。生成される問題にはAIによる詳細解説が付属します。なぜその答えが正解なのか、どこが引っかけポイントなのかを丁寧に説明するため、理解が深まります。</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
