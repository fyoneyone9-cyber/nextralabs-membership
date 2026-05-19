import dynamic from 'next/dynamic'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Phone, FileText, TrendingUp, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const AiTeleapoLpContent = () => {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32">
      {/* ヒーローセクション */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center space-y-10">
        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-6 py-1 rounded-full font-bold text-xs tracking-tight">
          法人営業AI自動化ツール
        </Badge>
        <h1 className="text-4xl md:text-7xl font-bold text-white tracking-tighter leading-[1.1]">
          AIテレアポくん（架電・自動化支援）<br />
          <span className="text-blue-400">アポ率3倍</span>を目指す<br />
          法人営業AIサポートツール
        </h1>
        <h2 className="text-xl md:text-3xl font-bold text-slate-300 max-w-4xl mx-auto leading-relaxed px-4 text-center">
          架電台本を自動生成、法人向け見積書も瞬時に作成。<br className="hidden md:block" />
          営業電話の成功率を飛躍的に向上させます。
        </h2>
        <div className="flex flex-wrap justify-center gap-6 pt-6">
          <Link href="/contact">
            <button className="h-16 px-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xl rounded-2xl shadow-[0_20px_50px_rgba(59,130,246,0.3)] transition-all active:scale-95 leading-none">
              無料で試してみる →
            </button>
          </Link>
        </div>
      </section>

      {/* 特徴・メリットセクション */}
      <section className="max-w-6xl mx-auto px-4 py-24 space-y-16">
        <div className="text-center space-y-4">
          <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tighter">
            営業現場の課題を解決する3つの機能
          </h3>
          <p className="text-slate-500 font-bold">AIが架電から見積もりまで一貫サポート</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-800/50 border border-slate-700/50 p-8 rounded-3xl space-y-4 hover:border-blue-500/30 transition-all group">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <Phone size={24} />
            </div>
            <h4 className="text-xl font-bold text-white">AI架電台本生成</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              業種・商材・担当者情報を入力するだけでAIが最適な架電台本を生成。初回アポからクロージングまで対応。
            </p>
            <div className="flex items-center gap-2 text-blue-400 text-sm font-bold">
              <CheckCircle2 size={16} />
              <span>業種別にカスタマイズ対応</span>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 p-8 rounded-3xl space-y-4 hover:border-cyan-500/30 transition-all group">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <FileText size={24} />
            </div>
            <h4 className="text-xl font-bold text-white">法人見積もり自動作成</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              トーク結果に応じた法人向け見積書を即座に生成。説得力のある提案内容とROI計算も自動で作成。
            </p>
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold">
              <CheckCircle2 size={16} />
              <span>見積書コメントをAI生成</span>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 p-8 rounded-3xl space-y-4 hover:border-emerald-500/30 transition-all group">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <TrendingUp size={24} />
            </div>
            <h4 className="text-xl font-bold text-white">AIアドバイス＆改善提案</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              架電結果を記録するとAIが傾向を分析してアドバイスを提供。架電率を継続的に改善します。
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
              <CheckCircle2 size={16} />
              <span>データ蓄積で精度が向上</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="max-w-5xl mx-auto px-4 pt-10 text-center">
        <Card className="bg-gradient-to-br from-blue-700 to-cyan-800 border-0 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden text-center space-y-10">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
            <Phone size={300} className="text-white" />
          </div>
          <div className="relative z-10 space-y-6 text-center">
            <h3 className="text-4xl md:text-6xl font-bold text-white tracking-tighter leading-none">
              アポ率3倍を実現
            </h3>
            <p className="text-blue-100 text-lg font-bold leading-relaxed max-w-2xl mx-auto px-4 text-center">
              AIが最適な架電台本を瞬時に作成。<br />
              営業電話の成功率を飛躍的に向上させます。
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-6 text-center">
              <Link href="/contact">
                <button className="h-16 px-12 bg-white text-blue-700 font-bold text-xl rounded-2xl shadow-xl hover:bg-blue-50 transition-all active:scale-95 leading-none flex items-center gap-2">
                  無料で試してみる <ArrowRight size={20} />
                </button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(AiTeleapoLpContent), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507]" />,
})

export default function AiTeleapoLp() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AIテレアポくん（架電・自動化支援）',
    description: '法人営業の架電台本と見積もりをAIが瞬時に生成。アポ率3倍を目指す営業支援ツール。',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: 'https://nextralab.jp/products/ai-teleapo',
    offers: { '@type': 'Offer', price: '480', priceCurrency: 'JPY' },
    publisher: { '@type': 'Organization', name: 'NextraLabs' },
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <NoSSRWrapper />
    </>
  )
}
