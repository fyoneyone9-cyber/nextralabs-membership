'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Zap, Network, Home, Share2, Hotel, ArrowRight, Smartphone, Grid } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div className="animate-in fade-in duration-700 bg-[#050507] text-slate-200 min-h-screen flex flex-col">
      <section className="relative overflow-hidden pt-16 pb-12 md:pt-32 md:pb-24 bg-[#050507] text-center">
        <div className="container mx-auto px-6 relative">
          <div className="inline-flex items-center gap-2 border border-emerald-500/30 rounded-full px-4 py-1.5 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-medium text-emerald-400 tracking-tight uppercase">Nextra Labs — AI Platform</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold text-white tracking-tight mb-6 leading-[1.1]">
            AIツールで、<br />
            <span className="text-emerald-400">業務を自動化。</span>
          </h1>
          <p className="text-base md:text-lg text-slate-400 max-w-lg mx-auto mb-10 leading-relaxed font-normal">
            指示したら、あとは全部やってくれる。<br />24のAIツールが、あなたの時間を取り戻す。
          </p>
          <Link href="/products" className="inline-block">
            <Button size="lg" className="px-8 h-12 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg text-sm tracking-wide shadow-[0_0_24px_rgba(16,185,129,0.2)] transition-all hover:shadow-[0_0_32px_rgba(16,185,129,0.35)] hover:scale-[1.02] active:scale-95">
              ツール一覧を見る <ArrowRight className="inline ml-1.5 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-12 border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3 mb-8 border-l-8 border-emerald-500 pl-4 py-1"><h2 className="text-xl md:text-4xl font-bold text-white uppercase">無料体験ツール</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[{ id: 'office-politics-graph', title: '社内政治 AI相関図', icon: Network }, { id: 'moving-checker', title: '引っ越し安心AI', icon: Home }, { id: 'sns-auto-poster', title: 'SNSオートポスター', icon: Share2 }].map((tool) => (
              <Link key={tool.id} href={"/products/" + tool.id + "/app"} className="block group">
                <Card className="bg-[#13141f] border-2 border-emerald-500 rounded-3xl overflow-hidden shadow-lg h-full">
                  <CardContent className="p-8 flex items-center gap-6">
                    <div className="p-4 rounded-xl bg-white/5 text-emerald-400"><tool.icon className="h-8 w-8" /></div>
                    <div className="text-left"><h3 className="text-lg font-bold text-white uppercase">{tool.title}</h3><p className="text-xs text-emerald-400 font-bold">無料で使う ➔</p></div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#050507]">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3 mb-6 text-white border-l-8 border-emerald-500 pl-4 py-1"><Hotel className="h-6 w-6 text-emerald-500" /><h2 className="text-xl md:text-4xl font-bold">ホテルDX</h2></div>
          <Link href="/products/nextra-ai">
            <Card className="border-2 border-emerald-500/30 bg-[#13141f] text-white rounded-[2rem] shadow-2xl">
              <CardContent className="p-8 space-y-6">
                <div className="flex justify-between items-center"><Badge className="bg-emerald-500 text-slate-950 font-bold">マスタ</Badge><span className="text-[10px] font-bold text-emerald-500 animate-pulse">NEW</span></div>
                <h3 className="text-2xl md:text-4xl font-bold leading-none">Nextra AI <span className="text-emerald-400">ホテルDX</span></h3>
                <p className="text-slate-400 text-xs md:text-sm font-bold leading-relaxed ">チェックイン・予約管理・多言語対応をAIが自動化。ホテル業務をまるごとDXします。</p>
                <div className="flex items-center text-emerald-400 font-bold text-sm font-semibold">ツールを使う →</div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      <section className="py-12 bg-[#050507] mt-auto border-b border-white/5">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-5xl font-bold text-white mb-8">あなたのAIを、今すぐ。</h2>
          <Link href="/products"><Button size="lg" className="text-2xl md:text-3xl h-12 md:h-24 bg-emerald-500 text-slate-950 font-bold rounded-2xl">全ツールを見る ➔</Button></Link>
        </div>
      </section>

      <div className="text-center opacity-30 text-[9px] font-bold uppercase tracking-[0.3em] py-6 text-slate-400">Nextra Labs • 2026</div>

      <section className="py-4 bg-[#13141f] border-t border-white/5">
        <div className="container mx-auto px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3"><Smartphone className="h-5 w-5 text-emerald-500" /><h2 className="text-xs font-bold text-white uppercase ">スマホアプリ版</h2></div>
          <Button size="sm" className="bg-emerald-500 text-slate-950 font-bold px-4 h-8 rounded-lg text-[9px]">インストール</Button>
        </div>
      </section>
    </div>
  )
}