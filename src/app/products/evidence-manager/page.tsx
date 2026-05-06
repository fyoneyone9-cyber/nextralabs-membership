import React from 'react'
import dynamic from 'next/dynamic'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Archive, Zap, Trash2, FolderSearch, ShieldCheck, ArrowRight, Activity, FileCheck, Search } from 'lucide-react'
import Link from 'next/link'

const EvidenceLpContent = () => {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32">
      {/* 🚀 Hero Section */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center space-y-10 text-left">
        <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 px-6 py-1 rounded-full font-black uppercase text-xs tracking-widest">Record Archival Engine</Badge>
        <h1 className="text-4xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-[1.1]">
          エビデンス・<br className="md:hidden" /><span className="text-amber-500">マネージャー</span>
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-slate-300 max-w-4xl mx-auto leading-relaxed px-4 text-center">
          あなたの「成果」を、永久に守り抜く。<br className="hidden md:block" />
          制作実績の自動整理 ＋ アーカイブOS。
        </h2>
        <div className="flex flex-wrap justify-center gap-6 pt-6">
          <Link href="/products/evidence-manager/app">
            <button className="h-20 px-12 bg-amber-600 hover:bg-amber-500 text-white font-black text-xl rounded-2xl shadow-[0_20px_50px_rgba(245,158,11,0.3)] transition-all active:scale-95 uppercase italic">
              無料で実績を整理する ➔
            </button>
          </Link>
        </div>
      </section>

      {/* ⚠️ Problem Section */}
      <section className="bg-[#13141f] py-24 border-y border-white/5 text-left">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h3 className="text-3xl font-black text-white italic uppercase tracking-tight">制作物が「ゴミ」に埋もれていませんか？</h3>
            <ul className="space-y-4 text-slate-400 font-bold">
              <li className="flex items-center gap-4"><FileCheck className="text-amber-500 shrink-0" /> ダウンロードフォルダが、一時ファイルとゴミで溢れている</li>
              <li className="flex items-center gap-4"><FileCheck className="text-amber-500 shrink-0" /> せっかく作った台本や画像が、どこにあるか分からない</li>
              <li className="flex items-center gap-4"><FileCheck className="text-amber-500 shrink-0" /> 実績をポートフォリオにまとめる作業が後回しになる</li>
            </ul>
          </div>
          <div className="bg-black/50 border-4 border-amber-500/20 rounded-[3rem] p-10 shadow-inner">
             <p className="text-amber-400 text-lg italic font-black text-center leading-loose">
               Nextra AIが「価値ある証拠」だけを抽出。<br/>
               一瞬でプロのフォルダ構造を構築します。
             </p>
          </div>
        </div>
      </section>

      {/* ✨ Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-32 space-y-20 text-left">
        <div className="text-center space-y-4">
          <h3 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter text-center">Master Archival OS</h3>
          <p className="text-slate-500 font-bold uppercase italic text-center">実績の価値を最大化する4つの知能</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-6 hover:border-amber-500/30 transition-all shadow-xl group text-left">
            <div className="w-16 h-16 bg-amber-600/10 rounded-2xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0">
              <Search size={32} />
            </div>
            <h4 className="text-2xl font-black text-white italic uppercase">自動スキャン・選別</h4>
            <p className="text-slate-400 font-bold leading-relaxed text-sm text-left">PC内の特定のフォルダをAIが監視。意味のないゴミと、価値ある制作実績を0.1秒で見極めます。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-6 hover:border-amber-500/30 transition-all shadow-xl group text-left text-left">
            <div className="w-16 h-16 bg-amber-600/10 rounded-2xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0">
              <Zap size={32} />
            </div>
            <h4 className="text-2xl font-black text-white italic uppercase">構造化アーカイブ</h4>
            <p className="text-slate-400 font-bold leading-relaxed text-sm text-left">「YouTube」「画像素材」「台本」など、用途に合わせた最適なディレクトリを自動生成し、綺麗に再配置します。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-6 hover:border-amber-500/30 transition-all shadow-xl group text-left text-left">
            <div className="w-16 h-16 bg-amber-600/10 rounded-2xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0">
              <Trash2 size={32} />
            </div>
            <h4 className="text-2xl font-black text-white italic uppercase text-left">ゴミ掃除・最適化</h4>
            <p className="text-slate-400 font-bold leading-relaxed text-sm text-left text-left">実績とは無関係な重複ファイルや一時ファイルを自動で判別。ストレージの健康状態を常に100%に保ちます。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-6 hover:border-amber-500/30 transition-all shadow-xl group text-left text-left">
            <div className="w-16 h-16 bg-amber-600/10 rounded-2xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0">
              <ShieldCheck size={32} />
            </div>
            <h4 className="text-2xl font-black text-white italic uppercase text-left">実績の証拠化</h4>
            <p className="text-slate-400 font-bold leading-relaxed text-sm text-left text-left">単なる保存ではなく、いつ何を達成したかのログを記録。クライアントや提携先に提示可能な「本物のエビデンス」を構築します。</p>
          </div>
        </div>
      </section>

      {/* 🚀 CTA Section */}
      <section className="max-w-5xl mx-auto px-4 pt-20 text-center text-center">
        <Card className="bg-gradient-to-br from-amber-600 to-yellow-900 border-0 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden text-center space-y-10 text-center">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Archive size={300} className="text-white" /></div>
          <div className="relative z-10 space-y-6 text-center text-center">
            <h3 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter text-center leading-none">Archiving Your Success.</h3>
            <p className="text-amber-100 text-lg font-bold leading-relaxed max-w-2xl mx-auto px-4 text-center text-center">
              実績は、管理して初めて武器になる。エビデンス・マネージャーで、あなたのキャリアを資産に変えましょう。
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-6 text-center text-center">
              <Link href="/signup">
                <button className="h-20 px-16 bg-white text-amber-700 font-black text-2xl rounded-2xl shadow-xl hover:bg-amber-50 transition-all active:scale-95 uppercase italic leading-none">
                  Launch Archive Mode
                </button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(EvidenceLpContent), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507]" />
})

export default function EvidenceManagerLp() {
  return <NoSSRWrapper />
}
