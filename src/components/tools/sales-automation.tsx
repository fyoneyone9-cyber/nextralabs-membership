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

  // 有名企業のプリセット
  const presets = [
    { name: 'TOYOTA', domain: 'toyota.jp' },
    { name: 'SONY', domain: 'sony.jp' },
    { name: 'SoftBank', domain: 'softbank.jp' },
    { name: 'Rakuten', domain: 'rakuten.co.jp' },
    { name: 'Nintendo', domain: 'nintendo.co.jp' }
  ];

  const handleCopyAndGo = (url: string) => {
    if (!domain) return toast.error("企業ドメインを入力してください");
    
    // プロンプトはクライアント側で瞬時に生成（500エラーを回避）
    const magicPrompt = `
あなたは超一流のインサイドセールス担当者です。
以下の企業ドメインを持つ会社に対し、NextraLabsのAIソリューションを提案する最高の営業メールを執筆してください。

【ターゲット企業データ】
・企業ドメイン: ${domain}
・担当者名: ${targetPerson || "ご担当者"}様
・特記事項: ${prompt || "特になし"}

【実行指示】
1. あなたの持つ最新のGoogle検索機能を使い、${domain} の最新ニュースや事業内容を1分でリサーチしてください。
2. その企業が今直面しているであろう課題（効率化、コスト削減、DX推進等）を鋭く推測してください。
3. NextraLabsのAI技術（業務自動化、画像解析、顧客対応AI等）が、その企業の利益にどう直結するか具体的に提案してください。
4. 相手の価値を尊重し、思わず返信したくなるような「知性的で熱意のある文章」を日本語で作成してください。
5. 件名も「思わず開きたくなるタイトル」を3案添えてください。
`;
    
    navigator.clipboard.writeText(magicPrompt.trim());
    setIsCopied(true);
    toast.success("戦略プロンプトを自動コピーしました！");
    
    setTimeout(() => {
      window.open(url, '_blank');
    }, 100);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen font-sans bg-slate-50/50 text-left text-slate-900">
      <Card className="border-none bg-white shadow-2xl rounded-[3rem] overflow-hidden antialiased">
        <div className="flex flex-col lg:flex-row min-h-[750px]">
          {/* 左側：分析コックピット */}
          <div className="lg:w-1/2 p-12 bg-slate-900 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-600"></div>
            <div className="space-y-12">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg animate-pulse"><Zap className="w-8 h-8 text-white" /></div>
                <h1 className="text-3xl font-black italic tracking-tighter leading-none uppercase">Sales AI Scope</h1>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">1. Choose or Enter Domain</label>
                  
                  {/* 企業プリセットボタン */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {presets.map((p) => (
                      <Button key={p.name} variant="outline" size="sm" className="bg-white/5 border-slate-700 text-slate-300 hover:bg-blue-600 hover:text-white rounded-full font-black text-[10px] transition-all" onClick={() => setDomain(p.domain)}>
                        {p.name}
                      </Button>
                    ))}
                  </div>

                  <Input placeholder="example.com" className="bg-black/40 border-slate-800 text-white h-16 rounded-2xl text-xl font-black focus:border-blue-500 transition-all" value={domain} onChange={(e) => setDomain(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">2. Contact Name</label>
                  <Input placeholder="担当者名" className="bg-black/40 border-slate-800 text-white h-14 rounded-2xl text-lg font-bold" value={targetPerson} onChange={(e) => setTargetPerson(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">3. Context (Optional)</label>
                  <Textarea placeholder="相手の悩み、自社の強みなど..." className="bg-black/40 border-slate-800 text-white min-h-[100px] rounded-2xl font-bold" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5 flex items-start gap-4">
               <HelpCircle className="text-blue-400 w-6 h-6 mt-1 flex-shrink-0" />
               <p className="text-slate-400 text-xs font-bold leading-relaxed">ドメインを入力するだけで、AIがその企業の最新ニュースをリサーチ。刺さる営業メールを自動生成するための最強プロンプトを構築します。</p>
            </div>
          </div>

          {/* 右側：AIポータル */}
          <div className="lg:w-1/2 p-12 flex flex-col bg-white overflow-hidden border-l border-slate-100">
            <div className="flex-1 space-y-10">
              <div className="text-center space-y-5">
                 <p className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">Step 2: AIを選んで鑑定開始</p>
                 <div className="grid grid-cols-1 gap-5">
                    <Button onClick={() => handleCopyAndGo('https://gemini.google.com/')} className="h-28 bg-blue-600 hover:bg-blue-500 text-white rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center group active:scale-95 transition-all border-none relative overflow-hidden">
                      <div className="flex items-center gap-4 text-2xl font-black italic tracking-tighter uppercase relative z-10"><Sparkles className="w-8 h-8 text-amber-300" /> Geminiで執筆</div>
                      <span className="text-[10px] text-blue-100 font-black uppercase tracking-widest relative z-10">最新リサーチ ＋ Groundingに最強</span>
                    </Button>
                    <div className="grid grid-cols-2 gap-5">
                      <Button onClick={() => handleCopyAndGo('https://chatgpt.com/')} className="h-20 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl shadow-xl flex items-center justify-center gap-3 font-black active:scale-95 transition-all border-none text-lg italic tracking-tighter uppercase"><Bot className="w-6 h-6" /> ChatGPT</Button>
                      <Button onClick={() => handleCopyAndGo('https://claude.ai/')} className="h-20 bg-orange-600 hover:bg-orange-500 text-white rounded-3xl shadow-xl flex items-center justify-center gap-3 font-black active:scale-95 transition-all border-none text-lg italic tracking-tighter uppercase"><Heart className="w-6 h-6 fill-white" /> Claude</Button>
                    </div>
                 </div>
              </div>

              {isCopied && (
                <div className="p-10 bg-red-50 rounded-[3rem] border-4 border-red-100 animate-in fade-in slide-in-from-top-6 shadow-2xl relative overflow-hidden text-left">
                   <div className="absolute -top-6 -right-6 w-32 h-32 bg-red-100 rounded-full opacity-30 flex items-center justify-center"><AlertCircle className="w-16 h-16 text-red-500" /></div>
                   <div className="flex flex-col gap-1 mb-8">
                     <div className="flex items-center gap-3 text-red-700 font-black italic text-xl uppercase tracking-tight text-left">貼り付けるだけ！</div>
                     <p className="text-red-600 font-black text-xs">戦略プロンプトは自動でコピーされました</p>
                   </div>
                   <div className="space-y-5 text-[15px] text-red-950 font-black leading-tight text-left">
                     <p className="flex items-start gap-4 text-left font-black"><span className="bg-red-600 text-white w-7 h-7 rounded-xl flex items-center justify-center text-xs flex-shrink-0 mt-0.5 shadow-md font-sans">1</span><span>AIアプリが起動したら、入力欄を長押し</span></p>
                     <p className="flex items-start gap-4 text-left font-black"><span className="bg-red-600 text-white w-7 h-7 rounded-xl flex items-center justify-center text-xs flex-shrink-0 mt-0.5 shadow-md font-sans">2</span><span>そのまま <span className="underline decoration-red-500 decoration-[3px] underline-offset-4 font-black text-red-600">「貼り付け（ペースト）」</span></span></p>
                     <p className="flex items-start gap-4 text-left font-black"><span className="bg-red-600 text-white w-7 h-7 rounded-xl flex items-center justify-center text-xs flex-shrink-0 mt-0.5 shadow-md font-sans">3</span><span>送信ボタンを押して、戦略メールを取得！</span></p>
                   </div>
                </div>
              )}
            </div>
            <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
              <span>NextraLabs Sales Intelligence</span>
              <span>Final Release v4.0</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
