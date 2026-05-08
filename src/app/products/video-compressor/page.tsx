import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/card'
import { Badge } from '@/components/ui/badge'
import { ToolLaunchButton } from '@/components/ToolLaunchButton'
import {
  ArrowLeft,
  Video,
  Zap,
  ShieldCheck,
  Lock,
  Clock,
  Layout,
  FileVideo,
  Download
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'マルチ動画AIコンバーター & コンプレッサー | 形式変換・軽量化・抽出をこれ一台で - NextraLabs',
  description: 'NextraLabsのマルチ動画AIコンバーターは、MP4, MOV, WebM, GIF, MP3への変換と極限圧縮を同時に実現。Genspark AIの強力なエンコード技術により、視覚品質を維持したままあらゆるデバイスへ最適化。',
  keywords: ['動画変換 AI', 'MP4 圧縮', 'MOV MP4 変換', '動画 GIF 変換', '音声抽出 AI', 'NextraLabs', 'Ninja3'],
}

const features = [
  {
    icon: Zap,
    title: 'マルチフォーマット対応',
    description: 'MOV, AVI, WMVからMP4への変換はもちろん、WebMやアニメーションGIF、音声抽出(MP3)まで幅広く対応。',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: ShieldCheck,
    title: 'Genspark AI圧縮',
    description: '最先端のAIアルゴリズムにより、ビットレートを自動最適化。品質とサイズの黄金比を実現します。',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Lock,
    title: 'セキュア・クリーン',
    description: '「無制限禁止」の憲法に基づき、会員ランクに応じて最適なリソースを割り当て。処理後はデータも即座に消去。',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  }
]

export default function VideoCompressorPage() {
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
                MULTI VIDEO AI CONVERTER
              </h1>
              <p className="text-xl text-emerald-500 font-bold mb-6 italic">
                万能変換 × 極限軽量化 × 音声抽出
              </p>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-xl">
                「iPhoneの動画が開けない」「容量が大きすぎて送れない」「音声だけ取り出したい」。
                そんな動画の悩みをAIが解決。あらゆる形式を<span className="text-white font-bold">Web・SNSに最適なMP4/GIF/MP3</span>へと変換・圧縮します。
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Link href="/pricing" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full h-16 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 font-black px-10 rounded-2xl uppercase italic text-xl">
                    View Plans
                  </Button>
                </Link>
                <ToolLaunchButton 
                  productId="video-compressor" 
                  className="w-full sm:w-auto h-16 px-10 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xl rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all uppercase italic"
                />
              </div>

              <div className="flex items-center gap-6 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-500" /> セキュア処理</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-emerald-500" /> 最短1分</span>
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
                        <div className="p-2 bg-blue-500/20 rounded-lg"><FileVideo className="h-6 w-6 text-blue-400" /></div>
                        <div>
                          <p className="text-sm font-bold text-white">Holiday_Vlog.mp4</p>
                          <p className="text-[10px] text-slate-500 uppercase font-black">Original</p>
                        </div>
                      </div>
                      <span className="text-xl font-black text-slate-400 italic">45.8 MB</span>
                    </div>

                    <div className="flex justify-center py-2">
                      <div className="w-px h-8 bg-gradient-to-b from-emerald-500/0 via-emerald-500 to-emerald-500/0 relative">
                        <Zap className="h-4 w-4 text-emerald-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-emerald-500/10 rounded-2xl border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/20 rounded-lg"><Download className="h-6 w-6 text-emerald-400" /></div>
                        <div>
                          <p className="text-sm font-bold text-white">Holiday_Vlog_min.mp4</p>
                          <p className="text-[10px] text-emerald-500 uppercase font-black">Compressed</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-emerald-400 italic">9.2 MB</span>
                        <p className="text-[10px] font-black text-emerald-500 uppercase">-80% REDUCED</p>
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
              <Layout className="h-6 w-6 text-emerald-500" />
              <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">憲法に基づく利用制限</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { plan: '無料', count: '登録必須', size: '-', color: 'border-slate-500/30' },
                { plan: 'ライト', count: '1回/日', size: '20MBまで', color: 'border-blue-500/30' },
                { plan: 'スタンダード', count: '2回/日', size: '50MBまで', color: 'border-emerald-500/30' },
                { plan: 'プレミアム', count: '3回/日', size: '100MBまで', color: 'border-orange-500/30' }
              ].map((p, i) => (
                <div key={i} className={`p-6 rounded-2xl bg-white/5 border ${p.color} text-center`}>
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">{p.plan} PLAN</p>
                  <p className="text-xl font-black text-white mb-1 italic">{p.count}</p>
                  <p className="text-xs font-bold text-emerald-500 italic">{p.size}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-slate-500 text-[10px] mt-8 font-bold uppercase tracking-[0.2em]">
              ⚠️ 動画処理はサーバー負荷が高いため、厳格な回数制限を設けています。
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
    </div>
  )
}
