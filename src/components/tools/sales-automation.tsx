'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Zap, Mail, Building2, Send, Loader2, Search, X, ShieldCheck, HelpCircle } from "lucide-react";
import { toast } from "sonner";

export default function SalesAutomation() {
  const [domain, setDomain] = useState('');
  const [targetPerson, setTargetPerson] = useState('');
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'done'>('idle');
  const [result, setResult] = useState<any>(null);

  const presets = [
    { name: 'TOYOTA', domain: 'toyota.jp' },
    { name: 'SONY', domain: 'sony.jp' },
    { name: 'Rakuten', domain: 'rakuten.co.jp' },
    { name: 'Nintendo', domain: 'nintendo.co.jp' }
  ];

  const handleGenerate = async () => {
    if (!domain) return toast.error("企業ドメインを入力してください");
    setStatus('analyzing');
    setResult(null);
    try {
      const response = await fetch('/api/tools/sales-automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, targetPerson, prompt }),
      });
      const data = await response.json();
      const compName = domain.split('.')[0].toUpperCase();
      setResult({
        companyName: compName,
        email: data.draftEmail || "メール生成に失敗しました。",
        subject: `【ご提案】${compName}様におけるAI自動化の導入について`
      });
      setStatus('done');
      toast.success("戦略メールの作成に成功しました");
    } catch (error) {
      toast.error("解析に失敗しました");
      setStatus('idle');
    }
  };

  const handleSendEmail = () => {
    if (!result) return;
    const body = encodeURIComponent(result.email);
    const subject = encodeURIComponent(result.subject);
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen font-sans bg-slate-50/50 text-left">
      <Card className="border-none bg-white shadow-2xl rounded-[3rem] overflow-hidden antialiased">
        <div className="flex flex-col lg:flex-row min-h-[800px]">
          <div className="lg:w-1/2 p-12 bg-slate-900 text-white flex flex-col justify-between relative text-left">
            <div className="space-y-12 text-left">
              <div className="flex items-center gap-4 text-left"><div className="p-3 bg-blue-600 rounded-2xl animate-pulse text-left"><Zap className="w-8 h-8 text-white" /></div><h1 className="text-3xl font-black italic tracking-tighter uppercase text-white">Sales AI Scope</h1></div>
              <div className="space-y-8 text-left">
                <div className="space-y-4 text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1 text-left">1. Company Selection</label>
                  <div className="flex flex-wrap gap-2 text-left">{presets.map((p) => (<Button key={p.name} variant="outline" size="sm" className="bg-white/5 border-slate-700 text-slate-300 hover:bg-blue-600 hover:text-white rounded-full font-black text-[10px]" onClick={() => setDomain(p.domain)}>{p.name}</Button>))}</div>
                  <Input placeholder="example.com" className="bg-black/40 border-slate-800 text-white h-16 rounded-2xl text-xl font-black" value={domain} onChange={(e) => setDomain(e.target.value)} />
                </div>
                <div className="space-y-2 text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block text-left">2. Personal Context</label>
                  <Input placeholder="担当者名" className="bg-black/40 border-slate-800 text-white h-14 rounded-2xl text-lg font-bold" value={targetPerson} onChange={(e) => setTargetPerson(e.target.value)} />
                  <Textarea placeholder="相談内容や特記事項" className="bg-black/40 border-slate-800 text-white min-h-[100px] rounded-2xl font-bold" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
                </div>
                <Button onClick={handleGenerate} disabled={status === 'analyzing'} className="w-full bg-blue-600 hover:bg-blue-500 h-20 rounded-[2rem] text-2xl font-black shadow-xl">
                  {status === 'analyzing' ? <Loader2 className="w-8 h-8 animate-spin" /> : "戦略メールを生成"}
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 p-12 flex flex-col bg-white overflow-hidden border-l border-slate-100 text-left">
            <div className="flex-1 flex flex-col space-y-8 min-h-0 text-left">
              <div className="flex items-center justify-between text-left">
                <div className="flex items-center gap-3 text-left"><div className="p-2 bg-slate-100 rounded-xl text-left"><Mail className="text-slate-900 w-6 h-6" /></div><h2 className="text-xl font-black italic tracking-tight uppercase text-slate-900 text-left">Draft Preview</h2></div>
                {result && <Button variant="ghost" size="icon" onClick={() => setResult(null)} className="text-slate-300 hover:text-red-500 transition-colors"><X className="w-5 h-5" /></Button>}
              </div>
              <div className="flex-1 min-h-0 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] flex flex-col overflow-hidden shadow-inner text-left">
                {result ? (
                  <>
                    <div className="p-6 border-b border-slate-200 bg-white text-left"><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Subject</p><p className="text-sm font-black text-slate-900 leading-tight">{result.subject}</p></div>
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white/50 text-left"><div className="text-slate-700 font-bold leading-relaxed whitespace-pre-wrap text-[15px] text-left">{result.email}</div></div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-200 py-20 text-center"><div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6"><Mail className="w-12 h-12 opacity-20" /></div><p className="font-black uppercase tracking-[0.3em] text-slate-300">Wait for Analysis</p></div>
                )}
              </div>
              <div className="pt-6 text-left">
                <Button onClick={handleSendEmail} disabled={!result} className={`w-full h-20 rounded-[2rem] text-2xl font-black shadow-2xl transition-all active:scale-95 text-left flex items-center justify-center gap-4 ${result ? 'bg-slate-900 hover:bg-black text-white cursor-pointer' : 'bg-slate-100 text-slate-300'}`}>
                  <Send className="w-8 h-8" /> Gmailへ同期して送信
                </Button>
                <div className="mt-4 flex items-center justify-center gap-2"><div className="h-1 w-1 bg-green-500 rounded-full animate-ping"></div><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest text-center">Ready for Real-world Operation</p></div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
