import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Zap, Building2, CheckCircle2, Rocket } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default function SalesAutomationLandingPage() {
  const features = [
    { icon: <Building2 className="w-6 h-6 text-blue-500" />, title: '企業特定', desc: 'ドメインから相手企業の業種、規模、使用技術を瞬時に特定。' },
    { icon: <Zap className="w-6 h-6 text-amber-500" />, title: '戦略執筆', desc: 'Gemini 1.5 Proが企業の課題を予測し、刺さる営業メールを作成。' },
    { icon: <Mail className="w-6 h-6 text-emerald-500" />, title: 'Gmail連携', desc: '作成した下書きをそのまま公式Gmailから送信可能。' }
  ];

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl text-left font-sans">
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex p-3 bg-blue-500/10 rounded-2xl mb-4">
          <Building2 className="w-12 h-12 text-blue-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter">AI Sales Automation</h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto font-bold">
          「営業の『準備』を、ゼロにする。」<br />
          企業分析からパーソナライズメールの執筆まで、AIが全自動で完遂。
        </p>
        <div className="pt-8">
          <Link href="/products/sales-automation/app">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 h-16 px-10 text-xl font-black rounded-2xl shadow-lg shadow-blue-600/20">
              <Rocket className="mr-2" /> ツールを使う
            </Button>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {features.map((f, i) => (
          <Card key={i} className="bg-slate-900 border-slate-800 border-2 rounded-[2.5rem]">
            <CardContent className="p-8 text-left space-y-4">
              <div className="w-12 h-12 flex items-center justify-center bg-slate-800 rounded-xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">{f.title}</h3>
              <p className="text-slate-400 font-bold text-sm leading-relaxed">{f.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
