import dynamic from 'next/dynamic'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Phone, FileText, TrendingUp, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const AiTeleapoLpContent = () => {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32">
      {/* 🚀 ヒーローセクション */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center space-y-10">
        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-6 py-1 rounded-full font-bold text-xs tracking-tight">
          法人営業AIアシスタント
        </Badge>
        <h1 className="text-4xl md:text-7xl font-bold text-white tracking-tighter leading-[1.1]">
          AIテレアポくん<br />
          <span className="text-blue-400">AI架電台本</span>＆<span className="text-cyan-400">法人見積もり</span><br />
          自動生成
        </h1>
        <h2 className="text-xl md:text-3xl font-bold text-slate-300 max-w-4xl mx-auto leading-relaxed px-4 text-center">
          営業電話の台本と見積もりをAIが瞬時に生成。<br className="hidden md:block" />
          法人アポ率を3倍に。
        </h2>
        <div className="flex flex-wrap justify-center gap-6 pt-6">
          <Link href="/products/ai-teleapo/app">
            <button className="h-16 px-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xl rounded-2xl shadow-[0_20px_50px_rgba(59,130,246,0.3)] transition-all active:scale-95 leading-none">
              今すぐ使う ➔
            </button>
          </Link>
        </div>
      </section>

      {/* ✨ 機能紹介セクション */}
      <section className="max-w-6xl mx-auto px-4 py-24 space-y-16">
        <div className="text-center space-y-4">
          <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tighter">
            営業成果を最大化する3つの機能
          </h3>
          <p className="text-slate-500 font-bold">AIが架電から見積もりまで一気通貫でサポート</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-800/50 border border-slate-700/50 p-8 rounded-3xl space-y-4 hover:border-blue-500/30 transition-all group">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <Phone size={24} />
            </div>
            <h4 className="text-xl font-bold text-white">AI架電台本生成</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              業種・商材・担当者情報を入力するだけでAIが最適な架電台本を生成。受付突破からアポ取得まで完全スクリプト化。
            </p>
            <div className="flex items-center gap-2 text-blue-400 text-sm font-bold">
              <CheckCircle2 size={16} />
              <span>業種別カスタマイズ対応</span>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 p-8 rounded-3xl space-y-4 hover:border-cyan-500/30 transition-all group">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <FileText size={24} />
            </div>
            <h4 className="text-xl font-bold text-white">法人見積もり自動作成</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              トーク結果に応じて法人向け見積書をAIが自動作成。提案の要旨・ROI説明・契約条件まで一括生成。
            </p>
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold">
              <CheckCircle2 size={16} />
              <span>プロ品質の見積書を瞬時に</span>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 p-8 rounded-3xl space-y-4 hover:border-emerald-500/30 transition-all group">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <TrendingUp size={24} />
            </div>
            <h4 className="text-xl font-bold text-white">AIアドバイス＆改善提案</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              次回架電のベストタイミングと改善アドバイスをAIが提案。架電記録を蓄積してアポ率を継続的に向上。
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
              <CheckCircle2 size={16} />
              <span>データドリブンな営業改善</span>
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 CTAセクション */}
      <section className="max-w-5xl mx-auto px-4 pt-10 text-center">
        <Card className="bg-gradient-to-br from-blue-700 to-cyan-800 border-0 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden text-center space-y-10">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
            <Phone size={300} className="text-white" />
          </div>
          <div className="relative z-10 space-y-6 text-center">
            <h3 className="text-4xl md:text-6xl font-bold text-white tracking-tighter leading-none">
              アポ率3倍へ。
            </h3>
            <p className="text-blue-100 text-lg font-bold leading-relaxed max-w-2xl mx-auto px-4 text-center">
              AIが最適な架電台本と見積もりを生成。<br />
              あなたの法人営業を次のステージへ。
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-6 text-center">
              <Link href="/products/ai-teleapo/app">
                <button className="h-16 px-12 bg-white text-blue-700 font-bold text-xl rounded-2xl shadow-xl hover:bg-blue-50 transition-all active:scale-95 leading-none flex items-center gap-2">
                  今すぐ使う <ArrowRight size={20} />
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
    name: 'AIテレアポくん',
    description: '法人営業の架電台本と見積もりをAIが自動生成。アポ率3倍を目指す営業支援ツール。',
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
