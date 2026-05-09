import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Utensils, Camera, Zap, Video, Rocket, ArrowLeft, Sparkles, ChefHat } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'AIレシピ | 冷蔵庫スキャンで残り物からプロの味を - NextraLabs',
  description: '「今日、何作ろう？」をAIが解決。冷蔵庫の余り物を撮影するだけでGemini 2.5 Flashが最適レシピを提案。調理動画連動で誰でも天才シェフに。食材ロスゼロを目指す究極のキッチン・アシスト。',
  keywords: ['AIレシピ', '冷蔵庫スキャン', '残り物 料理', '時短レシピ AI', '献立作成 自動', '食材ロス削減', 'NextraLabs', 'Ninja3'],
  openGraph: {
    title: 'AIレシピ | 写真1枚でプロの献立をプロデュース',
    description: 'もう献立に迷わない。あなたの冷蔵庫が、今日から三ツ星レストランに。',
  }
};

export default function AiRecipeLandingPage() {
  const features = [
    { 
      icon: Camera, 
      title: '冷蔵庫スキャン', 
      desc: '食材の残り具合をAIが視覚的に解析し、最適な組み合わせを特定。',
      color: 'text-red-400',
      bg: 'bg-red-400/10'
    },
    { 
      icon: ChefHat, 
      title: '天才シェフの知能', 
      desc: 'Gemini 2.5 Flashが、わずかな食材から最高の一皿をプロデュース。',
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10'
    },
    { 
      icon: Video, 
      title: '調理動画連動', 
      desc: '生成されたレシピに合わせ、プロの調理法を即座に確認。',
      color: 'text-blue-400',
      bg: 'bg-blue-400/10'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-20">
      <section className="relative pt-10 md:pt-20 pb-16 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <Link
            href="/products"
            className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-emerald-400 mb-8 transition-colors uppercase tracking-widest"
          >
            <ArrowLeft className="h-3 w-3 mr-2" />
            Back to Tools
          </Link>

          <div className="max-w-4xl mx-auto text-center mb-16">
            <Badge className="mb-4 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-1 text-xs font-black uppercase tracking-tighter">
              Lifestyle DX Solution
            </Badge>
            <h1 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tighter italic uppercase leading-none">
              AI レシピ <br className="hidden md:block" />
              <span className="text-emerald-500">献立コーチ</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
              「もう、献立に迷わない。」
              <br className="hidden md:block" />
              写真1枚から、あなただけの天才シェフが最高の一皿をプロデュース。
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/products/ai-recipe/app" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-16 px-10 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xl rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all">
                  <Rocket className="mr-2 h-5 w-5" /> ツールを無料で使う
                </Button>
              </Link>
            </div>
          </div>

          {/* MASTERMODEL Quality (Emerald Border) */}
          <div className="max-w-5xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-red-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-[#0a0a0f] border-2 border-emerald-500 rounded-[2rem] p-6 md:p-12 shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <Zap className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 text-xs font-black uppercase tracking-widest">Master System Integrated</span>
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight italic uppercase leading-tight">
                      食材を無駄にしない <br />
                      究極のキッチン・アシスト
                    </h2>
                    <div className="space-y-6">
                      {features.map((f, i) => (
                        <div key={i} className="flex gap-4">
                          <div className={`shrink-0 w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center border border-white/5`}>
                            <f.icon className={`w-6 h-6 ${f.color}`} />
                          </div>
                          <div>
                            <h3 className="text-white font-bold mb-1">{f.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Preview UI */}
                  <div className="bg-[#13141f] rounded-3xl p-6 border border-white/5 shadow-inner">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <Utensils className="w-5 h-5 text-emerald-400" />
                        <span className="text-white font-black text-xs uppercase tracking-widest">Recipe Preview</span>
                      </div>
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-[10px]">AI Analyzing</Badge>
                    </div>
                    
                    <div className="space-y-4">
                      <Link href="/products/ai-recipe/app" className="block group/cam">
                        <div className="aspect-video bg-black/40 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-2 group-hover/cam:border-emerald-500/50 group-hover/cam:bg-emerald-500/5 transition-all">
                          <Camera className="w-8 h-8 text-slate-600 group-hover/cam:text-emerald-500 transition-colors" />
                          <span className="text-[10px] text-slate-600 font-black uppercase group-hover/cam:text-emerald-400">Launch Camera & Analyze</span>
                        </div>
                      </Link>
                      <div className="space-y-2">
                        <div className="h-2 bg-slate-800 rounded-full w-3/4"></div>
                        <div className="h-2 bg-slate-800 rounded-full w-1/2"></div>
                      </div>
                      <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                        <div className="text-[10px] text-emerald-500 font-black italic">PROPOSED: 豚肉と白菜の重ね蒸し</div>
                        <Zap className="w-4 h-4 text-amber-500" />
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
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 italic uppercase">「何作ろう？」を、0秒に。</h2>
          <p className="text-slate-400 mb-10 max-w-xl mx-auto font-medium">
            冷蔵庫の中身をAIに見せるだけ。余った食材が、今日のご馳走に変わります。
          </p>
          <Link href="/products/ai-recipe/app">
            <Button className="h-16 px-12 bg-white text-slate-950 font-black text-xl rounded-2xl hover:bg-slate-200 transition-all">
              無料で体験する
            </Button>
          </Link>
          <p className="mt-6 text-xs font-black text-emerald-500 uppercase tracking-widest italic">FREE ACCESS FOR ALL USERS</p>
        </div>
      </section>
    </div>
  );
}
