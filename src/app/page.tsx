'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Zap, Network, Home, Share2, Hotel, ArrowRight, Smartphone, Grid, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function HomePage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
    } else {
      alert("繝悶Λ繧ｦ繧ｶ縺ｮ繝｡繝九Η繝ｼ縺九ｉ縲後・繝ｼ繝逕ｻ髱｢縺ｫ霑ｽ蜉縲阪ｒ驕ｸ謚槭＠縺ｦ縺上□縺輔＞縲・);
    }
  };

  return (
    <div className="animate-in fade-in duration-700 bg-[#050507] text-slate-200 min-h-screen flex flex-col">
      {/* 噫 繧ｯ繧､繝・け繝翫ン */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link href="/products">
          <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-full h-14 w-14 shadow-2xl p-0 flex items-center justify-center border-4 border-emerald-950/50 animate-bounce">
            <Grid className="h-6 w-6" />
          </Button>
        </Link>
      </div>

      {/* 繝偵・繝ｭ繝ｼ繧ｻ繧ｯ繧ｷ繝ｧ繝ｳ */}
      <section className="relative overflow-hidden pt-16 pb-12 md:pt-32 md:pb-24 bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10 opacity-50" />
        <div className="container mx-auto px-6 text-center relative">
          <Badge variant="outline" className="px-3 py-0.5 text-[10px] font-black text-emerald-500 border-emerald-500/20 uppercase tracking-widest mb-6">NextraLabs AI繝励Λ繝・ヨ繝輔か繝ｼ繝</Badge>
          <h1 className="text-4xl md:text-8xl font-black text-white tracking-tighter mb-6 leading-none italic uppercase">
            AI繝・・繝ｫ縺ｧ<br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">讌ｭ蜍吶ｒ閾ｪ蜍募喧</span>
          </h1>
          <p className="text-sm md:text-xl text-slate-400 max-w-xl mx-auto mb-8 font-bold italic leading-relaxed px-4">縲梧欠遉ｺ縺励◆繧峨√≠縺ｨ縺ｯ蜈ｨ驛ｨ繧・▲縺ｦ縺上ｌ繧九・br/>繝薙ず繝阪せ縺ｨ逕滓ｴｻ繧但I豁ｦ陬・☆繧九ょ・24縺ｮ謌ｦ逡･逧・お繝ｳ繧ｸ繝ｳ縲・/p>
          <div className="flex flex-col gap-4 justify-center items-center">
            <Link href="/products" className="w-full max-w-xs">
              <Button size="lg" className="w-full text-lg h-16 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl shadow-xl transition-all active:scale-95">櫨 繝・・繝ｫ荳隕ｧ繧定ｦ九ｋ</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ・ 辟｡譁吩ｽ馴ｨ・*/}
      <section className="py-12 border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3 mb-8 border-l-8 border-emerald-500 pl-4 py-1">
            <h2 className="text-xl md:text-4xl font-black text-white italic uppercase tracking-tighter">辟｡譁吩ｽ馴ｨ薙ヤ繝ｼ繝ｫ</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: 'office-politics-graph', title: '遉ｾ蜀・帆豐ｻ AI逶ｸ髢｢蝗ｳ', icon: Network, color: 'text-indigo-400' },
              { id: 'moving-checker', title: '蠑輔▲雜翫＠螳牙ｿアI', icon: Home, color: 'text-emerald-400' },
              { id: 'sns-auto-poster', title: 'SNS繧ｪ繝ｼ繝医・繧ｹ繧ｿ繝ｼ', icon: Share2, color: 'text-blue-400' }
            ].map((tool) => (
              <Link key={tool.id} href={"/products/" + tool.id + "/app"} className="block group">
                <Card className="bg-[#13141f] border-white/5 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all shadow-lg h-full">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className={"p-3 rounded-xl bg-white/5 " + tool.color}><tool.icon className="h-6 w-6" /></div>
                    <div className="text-left"><h3 className="text-sm font-black text-white uppercase">{tool.title}</h3><p className="text-[10px] text-emerald-400 font-bold">辟｡譁吶〒菴ｿ縺・筐・/p></div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 繝帙ユ繝ｫDX繧ｻ繧ｯ繧ｷ繝ｧ繝ｳ */}
      <section className="py-6 bg-[#13141f] border-t border-white/5 mt-auto">
        <div className="container mx-auto px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Smartphone className="h-6 w-6 text-emerald-500" />
            <h2 className="text-sm font-black text-white uppercase italic">繧ｹ繝槭・繧｢繝励Μ迚・/h2>
          </div>
          <Button onClick={handleInstallClick} size="sm" className="bg-emerald-500 text-slate-950 font-black px-4 h-9 rounded-xl shadow-lg uppercase text-[10px] hover:bg-emerald-400 transition-all">繧､繝ｳ繧ｹ繝医・繝ｫ</Button>
        </div>
      </section>

      {/* 繧ｹ繝槭・繧｢繝励Μ迚・- 繝輔ャ繧ｿ繝ｼ逶ｴ蜑阪∈ */}
      <section className="py-12 bg-[#050507]">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3 mb-6 text-white border-l-8 border-emerald-500 pl-4 py-1">
            <Hotel className="h-6 w-6 text-emerald-500" />
            <h2 className="text-xl md:text-4xl font-black italic uppercase">繝帙ユ繝ｫDX繧ｽ繝ｪ繝･繝ｼ繧ｷ繝ｧ繝ｳ</h2>
          </div>
          <Link href="/products/staysee-ai-finder/app">
            <Card className="hover:scale-[1.02] transition-all duration-300 border-2 border-emerald-500/30 bg-[#13141f] text-white overflow-hidden rounded-[2rem] shadow-[0_0_50px_rgba(16,185,129,0.1)]">
              <CardContent className="p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <Badge className="bg-emerald-500 text-slate-950 font-black px-3 py-0.5 text-[10px] uppercase">繝槭せ繧ｿ</Badge>
                  <span className="text-[10px] font-black text-amber-500 flex items-center gap-1 animate-pulse"><Zap className="h-3 w-3 fill-current" /> NEW</span>
                </div>
                <h3 className="text-2xl md:text-4xl font-black italic leading-none uppercase text-white">AIﾃ励・繝・ΝDX繧ｷ繧ｹ繝・Β<br/>縲侵extra縲・/h3>
                <p className="text-slate-400 text-xs md:text-sm font-bold leading-relaxed italic">螳ｿ豕贋ｺ育ｴ・・骰ｵ逋ｺ陦後ｒ螳悟・蜷梧悄縲ゅヵ繝ｭ繝ｳ繝域･ｭ蜍吶ｒ繧ｼ繝ｭ縺ｫ縺吶ｋ譛蠑ｷ縺ｮ螳ｿ豕晦I縲・/p>
                <div className="flex items-center text-emerald-400 font-black text-sm uppercase group">
                  騾｣謳ｺ繧帝幕蟋九☆繧・<ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* 譛邨・TA - 繝輔ャ繧ｿ繝ｼ縺ｮ逶ｴ蜑阪↓驟咲ｽｮ */}
      <section className="py-6 bg-[#13141f] border-t border-white/5 mt-auto">
        <div className="container mx-auto px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Smartphone className="h-6 w-6 text-emerald-500" />
            <h2 className="text-sm font-black text-white uppercase italic">繧ｹ繝槭・繧｢繝励Μ迚・/h2>
          </div>
          <Button onClick={handleInstallClick} size="sm" className="bg-emerald-500 text-slate-950 font-black px-4 h-9 rounded-xl shadow-lg uppercase text-[10px] hover:bg-emerald-400 transition-all">繧､繝ｳ繧ｹ繝医・繝ｫ</Button>
        </div>
      </section>
    </div>
  )
}
