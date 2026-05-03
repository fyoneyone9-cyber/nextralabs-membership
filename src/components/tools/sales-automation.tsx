'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, Mail, Building2, Send, Loader2, Search, X, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function SalesAutomation() {
  const [domain, setDomain] = useState('');
  const [targetPerson, setTargetPerson] = useState('');
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'done'>('idle');
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    if (!domain) return toast.error("企業ドメインを入力してください");
    setStatus('analyzing');
    setResult(null);
    
    try {
      const response = await fetch('/api/tools/sales-automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, targetPerson }),
      });
      const data = await response.json();
      
      const compName = domain.split('.')[0].toUpperCase();
      
      // メールの本文から「件名:」等のゴミを確実に除去するロジック
      const cleanEmail = data.draftEmail
        .replace(/件名:.*?\n/, "")
        .replace(/\[.*?\]/g, "")
        .trim();

      setResult({
        companyName: compName,
        email: cleanEmail,
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
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen font-sans bg-slate-50/50 text-left">
      <Card className="border-none bg-white shadow-2xl rounded-[3rem] overflow-hidden antialiased">
        <div className="flex flex-col lg:flex-row min-h-[800px]">
          {/* 左側：分析コックピット */}
          <div className="lg:w-1/2 p-12 bg-slate-900 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-600"></div>
            <div className="space-y-12">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.4)] animate-pulse">
                  <Zap className="w-8 h-8 text-white fill-white" />
                </div>
                <div>
                   <h1 className="text-3xl font-black italic tracking-tighter leading-none">SALES AI</h1>
                   <p className="text-blue-400 text-[10px] font-black tracking-[0.4em] mt-2 uppercase opacity-80">NextraLabs Intelligence</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Target Company Domain</label>
                  <Input 
                    placeholder="example.com" 
                    className="bg-black/40 border-slate-800 text-white h-16 rounded-2xl text-xl font-black focus:border-blue-500 transition-all placeholder:text-slate-700" 
                    value={domain} 
                    onChange={(e) => setDomain(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Contact Person Name</label>
                  <Input 
                    placeholder="担当者名" 
                    className="bg-black/40 border-slate-800 text-white h-14 rounded-2xl text-lg font-bold placeholder:text-slate-700" 
                    value={targetPerson} 
                    onChange={(e) => setTargetPerson(e.target.value)} 
                  />
                </div>
                <Button 
                  onClick={handleGenerate} 
                  disabled={status === 'analyzing'} 
                  className="w-full bg-blue-600 hover:bg-blue-500 h-20 rounded-[2rem] text-2xl font-black shadow-2xl shadow-blue-500/20 active:scale-95 transition-all mt-4"
                >
                  {status === 'analyzing' ? <Loader2 className="w-8 h-8 animate-spin" /> : <><Search className="mr-3 w-6 h-6" /> 戦略メールを生成</>}
                </Button>
              </div>
            </div>
            
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm">
               <div className="flex items-center gap-2 text-blue-400 font-black text-[10px] uppercase tracking-widest mb-2">
                 <ShieldCheck className="w-4 h-4" /> System Guard Active
               </div>
               <p className="text-slate-400 text-xs font-bold leading-relaxed">
                 企業データベースから最新の業種・技術スタックを特定し、AIが最適なセールスレターを執筆します。
               </p>
            </div>
          </div>

          {/* 右側：プレビューエディタ */}
          <div className="lg:w-1/2 p-12 flex flex-col bg-white overflow-hidden border-l border-slate-100">
            <div className="flex-1 flex flex-col space-y-8 min-h-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-xl"><Mail className="text-slate-900 w-6 h-6" /></div>
                  <h2 className="text-xl font-black italic tracking-tight uppercase text-slate-900">Final Draft</h2>
                </div>
                {result && <Button variant="ghost" size="icon" onClick={() => setResult(null)} className="text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"><X className="w-5 h-5" /></Button>}
              </div>

              <div className="flex-1 min-h-0 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] flex flex-col overflow-hidden shadow-inner">
                {result ? (
                  <>
                    <div className="p-6 border-b border-slate-200 bg-white space-y-3">
                      <div className="flex items-center gap-3">
                        <Building2 className="text-blue-500 w-4 h-4" />
                        <p className="font-black text-slate-900 text-sm tracking-tight uppercase">To: {result.companyName}様</p>
                      </div>
                      <div className="flex items-start gap-3 pt-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase mt-1">Subject:</span>
                        <p className="text-sm font-black text-slate-900 leading-tight">{result.subject}</p>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white/50">
                      <div className="text-slate-700 font-bold leading-relaxed whitespace-pre-wrap text-[15px]">
                        {result.email}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-200 py-20">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                      <Mail className="w-12 h-12 opacity-20" />
                    </div>
                    <p className="font-black uppercase tracking-[0.3em] text-slate-300">Analysis Standby</p>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <Button 
                  onClick={handleSendEmail}
                  disabled={!result}
                  className={`w-full h-20 rounded-[2rem] text-2xl font-black shadow-2xl transition-all active:scale-95 ${result ? 'bg-slate-900 hover:bg-black text-white shadow-slate-200' : 'bg-slate-100 text-slate-300'}`}
                >
                  <Send className="mr-3 w-8 h-8" /> Gmailで送信
                </Button>
                <div className="mt-4 flex items-center justify-center gap-2">
                   <div className="h-1 w-1 bg-green-500 rounded-full animate-ping"></div>
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">NextraLabs Inside Sales Engine v3.5</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
