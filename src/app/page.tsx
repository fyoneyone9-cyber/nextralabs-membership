'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Zap, Network, Home, Share2, Hotel, ArrowRight, Smartphone, Grid } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function HomePage() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
    } else {
      alert("ブラウザのメニューからホーム画面に追加を選択してください。");
    }
  };

  return (
    <div className="animate-in fade-in duration-700 bg-[#050507] text-slate-200 min-h-screen flex flex-col">
      {/* 🚀 クイックナビ */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link href="/products">
          <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-full h-14 w-14 shadow-2xl p-0 flex items-center justify-center border-4 border-emerald-950/50 animate-bounce">
            <Grid className="h-6 w-6" />
          </Button>
        </Link>
      </div>

      {/* ヒーローセクション */}
      <section className="relative overflow-hidden pt-16 pb-12 md:pt-32 md:pb-24 bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10 opacity-50" />
        <div className="container mx-auto px-6 text-center relative">
          <Badge variant="outline" className="px-3 py-0.5 text-[10px] font-black text-emerald-500 border-emerald-500/20 uppercase tracking-widest mb-6">NextraLabs AIプラットフォーム</Badge>
          <h1 className="text-4xl md:text-8xl font-black text-white tracking-tighter mb-6 leading-none italic uppercase">
            AIツールで<br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">業務を自動化</span>
          </h1>
          <p className="text-sm md:text-xl text-slate-400 max-w-xl mx-auto mb-8 font-bold italic leading-relaxed px-4">「指示したら、あとは全部やってくれる」<br/>ビジネスと生活をAI武装する。全24の戦略的エンジン。</p>
          <div className="flex flex-col gap-4 justify-center items-center">
            <Link href="/products" className="w-full max-w-xs">
              <Button size="lg" className="w-full text-lg h-16 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl shadow-xl transition-all active:scale-95">🔥 ツール一覧を見る</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 🆓 無料体験 */}
      <section className="py-12 border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3 mb-8 border-l-8 border-emerald-500 pl-4 py-1">
            <h2 className="text-xl md:text-4xl font-black text-white italic uppercase tracking-tighter">無料体験ツール</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: 'office-politics-graph', title: '社内政治 AI相関図', icon: Network, color: 'text-indigo-400' },
              { id: 'moving-checker', title: '引っ越し安心AI', icon: Home, color: 'text-emerald-400' },
              { id: 'sns-auto-poster', title: 'SNSオートポスター', icon: Share2, color: 'text-blue-400' }
            ].map((tool) => (
              <Link key={tool.id} href={"/products/" + tool.id + "/app"} className="block group">
                <Card className="bg-[#13141f] border-white/5 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all shadow-lg h-full">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className={"p-3 rounded-xl bg-white/5 " + tool.color}><tool.icon className="h-6 w-6" /></div>
                    <div className="text-left"><h3 className="text-sm font-black text-white uppercase">{tool.title}</h3><p className="text-[10px] text-emerald-400 font-bold">無料で使う ➔</p></div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ホテルDXセクション */}
      <section className="py-12 bg-[#050507]">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3 mb-6 text-white border-l-8 border-emerald-500 pl-4 py-1">
            <Hotel className="h-6 w-6 text-emerald-500" />
            <h2 className="text-xl md:text-4xl font-black italic uppercase">ホテルDXソリューション</h2>
          </div>
          <Link href="/products/staysee-ai-finder/app">
            <Card className="hover:scale-[1.02] transition-all duration-300 border-2 border-emerald-500/30 bg-[#13141f] text-white overflow-hidden rounded-[2rem] shadow-[0_0_50px_rgba(16,185,129,0.1)]">
              <CardContent className="p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <Badge className="bg-emerald-500 text-slate-950 font-black px-3 py-0.5 text-[10px] uppercase">マスタ</Badge>
                  <span className="text-[10px] font-black text-amber-500 flex items-center gap-1 animate-pulse"><Zap className="h-3 w-3 fill-current" /> NEW</span>
                </div>
                <h3 className="text-2xl md:text-4xl font-black italic leading-none uppercase text-white">AI×ホテルDXシステム<br/>【Nextra】</h3>
                <p className="text-slate-400 text-xs md:text-sm font-bold leading-relaxed italic">宿泊予約・鍵発行を完全同期。フロント業務をゼロにする最強の宿泊AI。</p>
                <div className="flex items-center text-emerald-400 font-black text-sm uppercase group">
                  連携を開始する <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* 最終CTA */}
      <section className="py-12 bg-[#050507] mt-auto">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-5xl font-black text-white tracking-tighter italic uppercase mb-8">全ての知能を解放せよ</h2>
          <Link href="/products" className="inline-block w-full max-w-xs">
            <Button size="lg" className="w-full text-lg h-16 bg-emerald-500 text-slate-950 font-black rounded-2xl shadow-xl active:scale-95 uppercase">
              全ツールを見る ➔
            </Button>
          </Link>
        </div>
      </section>

      {/* スマホアプリ版 - フッター直前 */}
      <section className="py-6 bg-[#13141f] border-t border-white/5">
        <div className="container mx-auto px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Smartphone className="h-6 w-6 text-emerald-500" />
            <h2 className="text-sm font-black text-white uppercase italic">スマホアプリ版</h2>
          </div>
          <Button onClick={handleInstallClick} size="sm" className="bg-emerald-500 text-slate-950 font-black px-4 h-9 rounded-xl shadow-lg uppercase text-[10px] hover:bg-emerald-400 transition-all">インストール</Button>
        </div>
      </section>

      <div className="bg-[#050507] text-center opacity-10 text-[8px] font-black uppercase tracking-[0.5em] py-8">NextraLabs マスタモデル • 2026</div>
    </div>
  )
}