'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Zap, Mail, Building2, Send, Search, X, ShieldCheck, Copy, Sparkles, Bot, Heart, AlertCircle, HelpCircle } from "lucide-react";
import { toast } from "sonner";

export default function SalesAutomation() {
  const [domain, setDomain] = useState('');
  const [targetPerson, setTargetPerson] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // 企業プリセット
  const presets = [
    { name: 'TOYOTA', domain: 'toyota.jp' },
    { name: 'SONY', domain: 'sony.jp' },
    { name: 'SoftBank', domain: 'softbank.jp' },
    { name: 'Nintendo', domain: 'nintendo.co.jp' },
    { name: 'Rakuten', domain: 'rakuten.co.jp' }
  ];

  const handleCopyAndGo = (url: string) => {
    if (!domain) return toast.error("企業ドメインを入力してください");
    
    // プロンプトをクライアント側で一瞬で生成（500エラーの心配なし）
    const magicPrompt = `
あなたは超一流のインサイドセールス担当者です。
以下の企業に対し、NextraLabsのAI自動化ソリューションを提案する最高の営業メールを執筆してください。

【ターゲット企業データ】
・企業ドメイン: ${domain}
・担当者名: ${targetPerson || "ご担当者"}様
・特記事項: ${prompt || "特になし"}

【実行指示】
1. あなたの持つ最新のGoogle検索機能を使い、${domain} の事業内容や最新ニュースを特定した上で、その企業特有の課題を鋭く推測してください。
2. NextraLabsが提供するAI技術（画像解析、業務自動化、顧客対応AI等）が、その企業の利益にどう直結するか具体的に提案してください。
3. 相手の価値を尊重し、返信率を最大化する「知性的で熱意のある文章」を日本語で作成してください。
4. 件名案も「思わず開きたくなるタイトル」を3つ添えてください。
`;
    
    navigator.clipboard.writeText(magicPrompt.trim());
    setIsCopied(true);
    toast.success("戦略鑑定文をコピーしました！貼り付けるだけです。");
    
    setTimeout(() => {
      window.open(url, '_blank');
    }, 100);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen font-sans bg-slate-50/50 text-left text-slate-900 antialiased">
      <Card className="border-none bg-white shadow-2xl rounded-[3.5rem] overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[750px]">
          {/* 左側：分析セクション */}
          <div className="lg:w-1/2 p-12 bg-slate-900 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-emerald-400 to-indigo-600"></div>
            <div className="space-y-12">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.3)] animate-pulse">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div>
                   <h1 className="text-3xl font-black italic tracking-tighter leading-none">SALES AI SCOPE</h1>
                   <p className="text-blue-400 text-[10px] font-black tracking-[0.4em] mt-2 uppercase opacity-80">NextraLabs Context Engine</p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">1. Choose or Enter Target</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {presets.map((p) => (
                      <Button key={p.name} variant="outline" size="sm" className="bg-white/5 border-slate-700 text-slate-300 hover:bg-blue-600 hover:text-white rounded-full font-black text-[10px] transition-all" onClick={() => setDomain(p.domain)}>
                        {p.name}
                      </Button>
                    ))}
                  </div>
                  <Input placeholder="example.com" className="bg-black/40 border-slate-800 text-white h-16 rounded-[1.5rem] text-xl font-black focus:border-blue-500 transition-all shadow-inner" value={domain} onChange={(e) => setDomain(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">2. Target Identity</label>
                  <Input placeholder="担当者名" className="bg-black/40 border-slate-800 text-white h-14 rounded-[1.2rem] text-lg font-bold" value={targetPerson} onChange={(e) => setTargetPerson(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">3. Custom Request</label>
                  <Textarea placeholder="相手の課題、自社の強みなど..." className="bg-black/40 border-slate-800 text-white min-h-[120px] rounded-[1.5rem] font-bold text-lg p-5" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 flex items-start gap-4 backdrop-blur-sm shadow-inner">
               <HelpCircle className="text-blue-400 w-6 h-6 mt-1 flex-shrink-0" />
               <p className="text-slate-400 text-xs font-bold leading-relaxed">ドメインを入力するだけで、AIがその企業の最新状況をリサーチ。世界最高峰のAI知能（Gemini Pro等）の能力を最大化するプロンプトを構築します。</p>
            </div>
          </div>

          {/* 右側：ポータルセクション */}
          <div className="lg:w-1/2 p-12 flex flex-col bg-white overflow-hidden border-l border-slate-100">
            <div className="flex-1 space-y-12">
              <div className="text-center space-y-6">
                 <div className="space-y-2">
                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">Step 2: Launch Analysis</p>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">ボタンを押すと鑑定文が自動コピーされます</p>
                 </div>
                 
                 <div className="grid grid-cols-1 gap-5">
                    <Button onClick={() => handleCopyAndGo('https://gemini.google.com/')} className="h-28 bg-blue-600 hover:bg-blue-500 text-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(37,99,235,0.3)] flex flex-col items-center justify-center group active:scale-95 transition-all border-none relative overflow-hidden">
                      <div className="flex items-center gap-4 text-3xl font-black italic tracking-tighter uppercase relative z-10 text-white"><Sparkles className="w-8 h-8 text-amber-300" /> Geminiで鑑定</div>
                      <span className="text-[10px] text-blue-100 font-black uppercase tracking-widest relative z-10 opacity-90">最新リサーチ ＋ Groundingに最強</span>
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </Button>
                    <div className="grid grid-cols-2 gap-5">
                      <Button onClick={() => handleCopyAndGo('https://chatgpt.com/')} className="h-20 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2rem] shadow-xl flex items-center justify-center gap-3 font-black active:scale-95 transition-all border-none text-xl italic tracking-tighter uppercase"><Bot className="w-7 h-7" /> ChatGPT</Button>
                      <Button onClick={() => handleCopyAndGo('https://claude.ai/')} className="h-20 bg-orange-600 hover:bg-orange-500 text-white rounded-[2rem] shadow-xl flex items-center justify-center gap-3 font-black active:scale-95 transition-all border-none text-xl italic tracking-tighter uppercase"><Heart className="w-7 h-7 fill-white" /> Claude</Button>
                    </div>
                 </div>
              </div>

              {isCopied && (
                <div className="p-10 bg-red-50 rounded-[3rem] border-4 border-red-100 animate-in fade-in slide-in-from-top-6 shadow-2xl relative overflow-hidden text-left">
                   <div className="absolute -top-6 -right-6 w-32 h-32 bg-red-100 rounded-full opacity-30 flex items-center justify-center"><AlertCircle className="w-16 h-16 text-red-500" /></div>
                   <div className="flex flex-col gap-1 mb-8">
                     <div className="flex items-center gap-3 text-red-700 font-black italic text-2xl uppercase tracking-tight text-left">貼り付けるだけ！</div>
                     <p className="text-red-600 font-black text-xs tracking-widest uppercase opacity-80">鑑定文はすでにコピーされています</p>
                   </div>
                   <div className="space-y-6 text-lg text-red-950 font-black leading-tight text-left">
                     <p className="flex items-start gap-4 transition-all hover:translate-x-1"><span className="bg-red-600 text-white w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 mt-0.5 shadow-md font-sans font-black">1</span><span>AIアプリが起動したら、入力欄を長押し</span></p>
                     <p className="flex items-start gap-4 transition-all hover:translate-x-1"><span className="bg-red-600 text-white w-8 h-8 rounded-xl flex items-center justify-center text-xs flex-shrink-0 mt-0.5 shadow-md font-sans font-black">2</span><span>そのまま <span className="underline decoration-red-500 decoration-[3px] underline-offset-4 font-black text-red-600">「貼り付け」</span> して送信！</span></p>
                     <p className="flex items-start gap-4 transition-all hover:translate-x-1"><span className="bg-red-600 text-white w-8 h-8 rounded-xl flex items-center justify-center text-xs flex-shrink-0 mt-0.5 shadow-md font-sans font-black">3</span><span>最強の提案メールが生成されます</span></p>
                   </div>
                </div>
              )}
            </div>
            <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] font-sans">
              <span>NextraLabs Context System</span>
              <span>Final Release v4.0</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
