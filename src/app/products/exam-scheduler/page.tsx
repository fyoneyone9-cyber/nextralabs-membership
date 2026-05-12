// ============================================================
// 🔒 LOCKED — ExamScheduler product page
// 完成済みツール。NextraLabs様の明示的な指示なしに
// このファイルを編集・削除・移動することを禁止する。
// Locked: 2026-05-10
// ============================================================
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
  Zap,
  Sparkles,
} from 'lucide-react'

export const metadata: Metadata = {
  title: '資格試験AIスケジューラー | 試験日から逆算して学習計画を自動生成 | NextraLabs',
  description: '受験日と今の実力を入力するだけ。AIが合格までの最短学習ルートを自動設計。毎日の勉強量・優先科目・模試スケジュールを一括管理。月額¥980のスタンダードプラン。',
  keywords: ['資格試験AI','学習計画自動生成','試験スケジューラー','合格計画','勉強計画アプリ','逆算学習','資格取得AI','試験対策AI','学習管理ツール','NextraLabs資格'],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: 'https://nextralab.jp/products/exam-scheduler' },
  openGraph: {
    title: '資格試験AIスケジューラー | 試験日から逆算して学習計画を自動生成 | NextraLabs',
    description: '受験日と今の実力を入力するだけ。AIが合格までの最短学習ルートを自動設計。毎日の勉強量・優先科目・模試スケジュールを一括管理。月額¥980のスタンダードプラン。',
    url: 'https://nextralab.jp/products/exam-scheduler',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: 'https://nextralab.jp/og-image.png', width: 1200, height: 630, alt: '資格試験AIスケジューラー | NextraLabs' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '資格試験AIスケジューラー | 試験日から逆算して学習計画を自動生成 | NextraLabs',
    description: '受験日と今の実力を入力するだけ。AIが合格までの最短学習ルートを自動設計。毎日の勉強量・優先科目・模試スケジュールを一括管理。月額¥980。',
    images: ['https://nextralab.jp/og-image.png'],
  },
}

const features = [
  {
    icon: Rss,
    title: 'RSS試験日自動取得',
    description: 'IPAやCompTIAの最新試験日程を自動取得。手動で調べる手間をゼロに。',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
  {
    icon: BrainCircuit,
    title: 'AI学習フェーズ生成',
    description: 'Claude AIが難易度に応じた4フェーズ（基礎・応用・まとめ・直前）の計画を立案。',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
  {
    icon: Calendar,
    title: 'Googleカレンダー同期',
    description: '生成した全セッションをワンクリックでGoogleカレンダーに一括登録。',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
]

const faqItems = [
  {
    q: 'どの資格試験に対応していますか？',
    a: 'ITパスポート、基本情報技術者、応用情報技術者、CompTIA A+/Network+/Security+、TOEIC、宅建、FP技能士など主要な国家資格・IT資格に対応しています。対応試験は順次拡大中です。',
  },
  {
    q: 'AIの学習計画はどのくらい精度が高いですか？',
    a: '受験日・現在の実力レベル・1日の勉強可能時間を入力することで、AIが合格に必要な学習量を逆算し、最適な4フェーズ計画を自動生成します。実際の合格者データをもとにした設計です。',
  },
  {
    q: '無料トライアル期間はありますか？',
    a: 'はい、FREEプランでは基本的なスケジュール生成機能を無料でお試しいただけます。月額¥980のスタンダードプランにアップグレードすると、Googleカレンダー同期・複数資格管理・模試スケジュールなどフル機能が利用可能です。',
  },
  {
    q: '複数の資格を同時に管理できますか？',
    a: 'スタンダードプラン以上で複数資格の並行管理が可能です。各資格の優先度設定・学習時間配分もAIが自動最適化するため、掛け持ち受験の方にも対応しています。',
  },
  {
    q: 'スマートフォンからも利用できますか？',
    a: 'はい、スマートフォン・タブレット・PCすべてに対応したレスポンシブデザインです。Googleカレンダーのリマインダー機能と連携することで、外出先でも毎日の学習を管理できます。',
  },
]

export default function ExamSchedulerPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: '資格試験AIスケジューラー',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web',
        url: 'https://nextralab.jp/products/exam-scheduler',
        description: '受験日と今の実力を入力するだけ。AIが合格までの最短学習ルートを自動設計。毎日の勉強量・優先科目・模試スケジュールを一括管理。',
        offers: {
          '@type': 'Offer',
          price: '980',
          priceCurrency: 'JPY',
          priceSpecification: { '@type': 'UnitPriceSpecification', price: '980', priceCurrency: 'JPY', unitText: '月' },
        },
        provider: { '@type': 'Organization', name: 'NextraLabs', url: 'https://nextralab.jp' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ],
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
              Education DX / Study Sync
            </Badge>
            <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 tracking-tighter uppercase leading-none">
              資格試験 AI <br className="hidden md:block" />
              <span className="text-emerald-500">スケジューラー</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
              「いつか勉強しよう」を、確実に実行する計画へ。
              <br className="hidden md:block" />
              試験日からの逆算計画とカレンダー同期をAIが完全自動化。
            </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <ToolLaunchButton 
                productId="exam-scheduler" 
                className="w-full sm:w-auto h-12 px-10 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xl rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all"
              />
              <Link href="/products/ai-exam-generator" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto h-12 px-10 border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 font-bold text-lg rounded-2xl">
                  問題生成モードを起動
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
                      計画倒れを防ぐ <br />
                      逆算思考の自動化
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
                        <Calendar className="w-5 h-5 text-emerald-400" />
                        <span className="text-white font-bold text-xs uppercase tracking-tight">Calendar Preview</span>
                      </div>
                      <Badge className="bg-emerald-500/20 text-blue-400 border-emerald-500/30 text-[10px]">Google Sync ON</Badge>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        { date: 'MAY 12', task: '基礎：テクノロジ系用語の確認', time: '20:00 - 21:00' },
                        { date: 'MAY 14', task: '基礎：マネジメント系演習', time: '20:00 - 21:00' },
                        { date: 'MAY 16', task: '応用：過去問100本ノック', time: '10:00 - 12:00' },
                      ].map((item, i) => (
                        <div key={i} className="p-3 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between">
                          <div>
                            <div className="text-[9px] text-emerald-500 font-bold">{item.date}</div>
                            <div className="text-xs text-slate-200 font-bold">{item.task}</div>
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">{item.time}</div>
                        </div>
                      ))}
                      <div className="pt-4 mt-2 border-t border-white/5 flex justify-center">
                        <div className="bg-green-500/10 border border-green-500/30 rounded-full px-4 py-1 flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-400" />
                          <span className="text-[10px] text-green-400 font-bold uppercase">48 events registered</span>
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

      {/* Target Section */}
      <section className="py-20 border-t border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-sm font-bold text-emerald-500 uppercase tracking-[0.4em] mb-12">Recommended For</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: TrendingUp, title: '忙しい社会人', desc: '限られた時間の中でITパスポートやCompTIAを目指す方に。' },
              { icon: Target, title: '逆算が苦手な方', desc: '試験日から何をいつすべきか、AIが迷いのない計画を提示します。' },
              { icon: BookOpen, title: '習慣化したい方', desc: 'カレンダーのリマインダー機能で、学習を生活の一部に変えます。' }
            ].map((t, i) => (
              <Card key={i} className="bg-transparent border-white/5 text-center p-6 hover:bg-white/5 transition-colors">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                  <t.icon className="h-6 w-6 text-emerald-500" />
                </div>
                <h3 className="text-white font-bold mb-2">{t.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{t.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 border-t border-white/5">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-center text-sm font-bold text-emerald-500 uppercase tracking-[0.4em] mb-4">FAQ</h2>
          <h3 className="text-center text-2xl md:text-3xl font-bold text-white mb-12 uppercase">よくある質問</h3>
          <dl className="space-y-6">
            {faqItems.map((item, i) => (
              <div key={i} className="bg-[#0d1117] rounded-2xl p-6 border border-white/5">
                <dt className="text-white font-bold mb-3 text-sm leading-relaxed">Q. {item.q}</dt>
                <dd className="text-slate-400 text-sm leading-relaxed">A. {item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <Sparkles className="w-12 h-12 text-emerald-500 mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 uppercase">計画を、AIで「絶対」に変える。</h2>
          <p className="text-slate-400 mb-10 max-w-xl mx-auto font-medium leading-relaxed">
            挫折の原因は「計画不足」でした。AIが引いたレールに乗るだけで、合格への最短距離を駆け抜けられます。
          </p>
          <ToolLaunchButton productId="exam-scheduler" className="h-12 px-12 bg-white text-slate-950 font-bold text-xl rounded-2xl hover:bg-slate-200 transition-all" />
          <p className="mt-6 text-xs font-bold text-emerald-500 uppercase tracking-tight ">Standard Plan Access</p>
        </div>
      </section>
    </div>
  )
}
