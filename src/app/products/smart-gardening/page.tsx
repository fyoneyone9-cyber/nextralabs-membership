import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Droplets, Sprout, Camera, CloudSun, CheckCircle2, Rocket } from 'lucide-react';

export const metadata = {
  title: 'AI水やり守護神 | 植物の健康をAIが守る',
  description: '写真と天気から、AIが最適な水やりタイミングをアドバイス。大切な植物を枯らさないための守護神。',
};

export default function SmartGardeningLandingPage() {
  const features = [
    { icon: <Camera className="w-6 h-6 text-green-500" />, title: 'カメラ解析', desc: '写真を撮るだけで植物の状態をAIが読み取ります' },
    { icon: <CloudSun className="w-6 h-6 text-orange-500" />, title: '天気連動', desc: 'Google天気を参照し、雨の日は水やり不要と通知' },
    { icon: <Droplets className="w-6 h-6 text-blue-500" />, title: '最適化アドバイス', desc: '土の乾き具合に合わせた具体的な水分量を提示' }
  ];

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex p-3 bg-green-500/10 rounded-2xl mb-4">
          <Sprout className="w-12 h-12 text-green-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white">AI水やり守護神</h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          「もう、植物を枯らさない。」<br />
          写真と天気予報から、AIがあなたの代わりに最適なケアを提案します。
        </p>
        <div className="pt-8">
          <Link href="/products/smart-gardening/app">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 h-16 px-10 text-xl font-bold rounded-2xl shadow-lg">
              <Rocket className="mr-2" /> ツールを使う
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {features.map((f, i) => (
          <Card key={i} className="bg-slate-900 border-slate-800 border-2">
            <CardContent className="p-8 text-center space-y-4">
              <div className="mx-auto w-12 h-12 flex items-center justify-center bg-slate-800 rounded-xl mb-4">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-white">{f.title}</h3>
              <p className="text-slate-400">{f.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-gradient-to-br from-green-600/20 to-emerald-900/20 border-2 border-green-500/30 rounded-3xl p-10">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold text-white">NextraLabsのAI技術を統合</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-500 mt-1" />
                <p className="text-slate-300">Gemini 1.5 Proによる高度な画像解析エンジン</p>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-500 mt-1" />
                <p className="text-slate-300">リアルタイム天気RSSとのデータ連動</p>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-500 mt-1" />
                <p className="text-slate-300">AI Credit Guardianによる効率的な運用</p>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-80 aspect-square bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center p-8">
             <Droplets className="w-32 h-32 text-green-500/20 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
