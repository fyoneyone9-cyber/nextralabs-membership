import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ToolLaunchButton } from '@/components/ToolLaunchButton'
import {
  ArrowLeft,
  FileDown,
  Zap,
  ShieldCheck,
  Lock,
  ArrowRight,
  Info,
  ChevronRight,
  Code2,
  HelpCircle,
  Clock,
  Layout,
  FileText
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'PDF AIコンプレッサー | NextraLabs',
  description: '憲法に基づいた安全なPDF圧縮ツール。高品質を維持したままファイルサイズを最小化。',
}

const features = [
  {
    icon: Zap,
    title: '高速AI圧縮',
    description: '独自の圧縮アルゴリズムにより、テキストや画像の品質を極限まで維持したままファイルサイズを削減。',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: ShieldCheck,
    title: '憲法遵守の制限',
    description: '「無制限禁止」の憲法に基づき、プランごとに最適な利用回数を設定。過剰なAPIコストからシステムを守ります。',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Lock,
    title: '完全プライバシー',
    description: 'アップロードされたファイルは圧縮処理後に即座に消去。サーバーにデータが残ることはありません。',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  }
]

export default function PdfCompressorPage() {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 pb-20 font-sans">
      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24 border-b border-emerald-500/20">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5" />
        <div className="container mx-auto px-4 relative">
          <Link
            href="/products"
            className="inline-flex items-center text-sm text-slate-400 hover:text-emerald-400 mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            ツール一覧に戻る
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1 font-black tracking-widest uppercase">
                💎 MASTERMODEL
              </Badge>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 italic uppercase">
                PDF AI COMPRESSOR
              </h1>
              <p className="text-xl text-emerald-500 font-bold mb-6 italic">
                品質維持 × 極限圧縮 × 憲法遵守
              </p>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-xl">
                重すぎるPDFは、送信エラーやストレージ圧迫の原因に。
                NextraLabsのPDF AIコンプレッサーは、
                <span className="text-white font-bold">視覚的な品質を落とさず</span>
                、サイズだけをスマートに削減します。
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 font-bold px-8 rounded-xl">
                    プランを確認
                  </Button>
                </Link>
                <ToolLaunchButton productId="pdf-compressor" />
              </div>

              <div className="flex items-center gap-6 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-500" /> セキュア処理</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-emerald-500" /> 即時完了</span>
                <span className="flex items-center gap-1.5"><Layout className="h-4 w-4 text-emerald-500" /> 憲法遵守</span>
              </div>
            </div>

            {/* Visual Demo Area */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-3xl blur opacity-20" />
              <Card className="relative bg-[#13141f] border-2 border-emerald-500 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/20">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-500/20 rounded-lg"><FileText className="h-6 w-6 text-red-400" /></div>
                        <div>
                          <p className="text-sm font-bold text-white">Project_Report.pdf</p>
                          <p className="text-[10px] text-slate-500 uppercase font-black">Original Size</p>
                        </div>
                      </div>
                      <span className="text-xl font-black text-slate-400 italic">15.4 MB</span>
                    </div>

                    <div className="flex justify-center py-2">
                      <div className="w-px h-8 bg-gradient-to-b from-emerald-500/0 via-emerald-500 to-emerald-500/0 relative">
                        <Zap className="h-4 w-4 text-emerald-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-emerald-500/10 rounded-2xl border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/20 rounded-lg"><FileDown className="h-6 w-6 text-emerald-400" /></div>
                        <div>
                          <p className="text-sm font-bold text-white">Project_Report_min.pdf</p>
                          <p className="text-[10px] text-emerald-500 uppercase font-black">Compressed Size</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-emerald-400 italic">2.1 MB</span>
                        <p className="text-[10px] font-black text-emerald-500 uppercase">-86% REDUCED</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Constraints Info */}
      <section className="py-16 bg-black/40 border-b border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8 border-l-4 border-emerald-500 pl-4">
              <Info className="h-6 w-6 text-emerald-500" />
              <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">憲法に基づく利用制限</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { plan: 'ライト', count: '1回/日', size: '3MBまで', color: 'border-blue-500/30' },
                { plan: 'スタンダード', count: '3回/日', size: '5MBまで', color: 'border-emerald-500/30' },
                { plan: 'プレミアム', count: '10回/日', size: '10MBまで', color: 'border-orange-500/30' }
              ].map((p, i) => (
                <div key={i} className={`p-6 rounded-2xl bg-white/5 border ${p.color} text-center`}>
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">{p.plan} PLAN</p>
                  <p className="text-2xl font-black text-white mb-1 italic">{p.count}</p>
                  <p className="text-xs font-bold text-emerald-500 italic">{p.size}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-slate-500 text-[10px] mt-8 font-bold uppercase tracking-[0.2em]">
              ⚠️ 憲法第4条により、全プランにおいて「無制限提供」は禁止されています。
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <div key={i} className="group p-8 rounded-[2rem] bg-[#13141f] border border-white/10 hover:border-emerald-500/50 transition-all duration-300">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${f.bg} mb-6 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`h-7 w-7 ${f.color}`} />
                </div>
                <h3 className="text-xl font-black text-white mb-3 italic uppercase tracking-tighter">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed italic">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-10">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-[2.5rem] p-10 md:p-16 text-center shadow-2xl shadow-emerald-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <h2 className="text-3xl md:text-5xl font-black text-slate-950 mb-6 italic uppercase tracking-tighter">
            今すぐPDFをスマートに
          </h2>
          <p className="text-slate-900 font-bold mb-10 max-w-xl mx-auto">
            重いファイルを軽量化して、業務を加速。
            NextraLabsの品質を、あなたのブラウザで。
          </p>
          <div className="flex justify-center gap-4">
            <ToolLaunchButton productId="pdf-compressor" />
          </div>
        </div>
      </section>
    </div>
  )
}
