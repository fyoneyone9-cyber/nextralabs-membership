import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Youtube, Utensils, Camera, Zap, Rocket } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default function AiRecipeLandingPage() {
  const features = [
    { icon: <Camera className="w-6 h-6 text-red-500" />, title: '冷蔵庫スキャン', desc: '食材の残り具合をAIが視覚的に解析します' },
    { icon: <Zap className="w-6 h-6 text-amber-500" />, title: '天才シェフの知能', desc: 'Gemini 1.5 Proが複数の食材を組み合わせた神レシピを考案' },
    { icon: <Youtube className="text-red-600 w-6 h-6" />, title: '動画連動', desc: '文字だけでなく、プロの調理動画を同じ画面で確認可能' }
  ];

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl text-left font-sans">
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex p-3 bg-red-500/10 rounded-2xl mb-4">
          <Utensils className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter">AI RECIPE SCOPE</h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto font-bold">
          「もう、献立に迷わない。」<br />
          写真1枚から、あなただけの天才シェフが最高の一皿をプロデュース。
        </p>
        <div className="pt-8">
          <Link href="/products/ai-recipe/app">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 h-16 px-10 text-xl font-black rounded-2xl shadow-lg shadow-red-600/20">
              <Rocket className="mr-2" /> ツールを使う
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {features.map((f, i) => (
          <Card key={i} className="bg-slate-900 border-slate-800 border-2 rounded-[2.5rem]">
            <CardContent className="p-8 text-left space-y-4">
              <div className="w-12 h-12 flex items-center justify-center bg-slate-800 rounded-xl mb-4">
                {f.icon}
              </div>
              <h3 className="text-xl font-black text-white italic uppercase tracking-tighter uppercase">{f.title}</h3>
              <p className="text-slate-400 font-bold text-sm leading-relaxed">{f.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
