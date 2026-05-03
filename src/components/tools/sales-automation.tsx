'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, Mail, Building2, Send, Loader2, Search, X } from "lucide-react";
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
      
      setResult({
        companyName: domain.split('.')[0].toUpperCase() + "様",
        email: data.draftEmail,
        subject: `${domain.split('.')[0].toUpperCase()}様へのAI活用のご提案`
      });
      setStatus('done');
      toast.success("提案メールを作成しました");
    } catch (error) {
      toast.error("エラーが発生しました");
      setStatus('idle');
    }
  };

  // Gmail送信画面を開く
  const handleSendEmail = () => {
    if (!result) return;
    const body = encodeURIComponent(result.email);
    const subject = encodeURIComponent(result.subject);
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen font-sans bg-slate-50/50 text-left text-slate-900">
      <Card className="border-none bg-white shadow-2xl rounded-[3rem] overflow-hidden antialiased">
        <div className="flex flex-col lg:flex-row min-h-[800px]">
          {/* 左側 */}
          <div className="lg:w-1/2 p-10 bg-slate-900 text-white flex flex-col justify-between relative z-10">
            <div className="space-y-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg"><Zap className="w-8 h-8 text-white" /></div>
                <h1 className="text-3xl font-black italic tracking-tighter uppercase">Sales AI</h1>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Company Domain</label>
                  <Input placeholder="toyota.jp" className="bg-black/50 border-slate-800 text-white h-16 rounded-2xl text-xl font-bold" value={domain} onChange={(e) => setDomain(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Contact Name</label>
                  <Input placeholder="担当者名" className="bg-black/50 border-slate-800 text-white h-14 rounded-2xl" value={targetPerson} onChange={(e) => setTargetPerson(e.target.value)} />
                </div>
                <Button onClick={handleGenerate} disabled={status === 'analyzing'} className="w-full bg-blue-600 hover:bg-blue-500 h-20 rounded-2xl text-2xl font-black shadow-xl">
                  {status === 'analyzing' ? <Loader2 className="animate-spin" /> : <><Search className="mr-2" /> 戦略メールを生成</>}
                </Button>
              </div>
            </div>
          </div>

          {/* 右側：プレビュー */}
          <div className="lg:w-1/2 p-12 flex flex-col bg-white overflow-hidden border-l border-slate-100 relative z-20">
            <div className="flex-1 flex flex-col space-y-8 min-h-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-xl"><Mail className="text-slate-600" /></div>
                  <h2 className="text-xl font-black italic tracking-tight uppercase">Draft Preview</h2>
                </div>
                {result && <Button variant="ghost" size="sm" onClick={() => setResult(null)} className="text-slate-400 hover:text-red-500"><X className="w-4 h-4" /></Button>}
              </div>

              <div className="flex-1 min-h-0 bg-slate-50 border-2 border-slate-100 rounded-[2rem] flex flex-col overflow-hidden shadow-inner">
                {result ? (
                  <>
                    <div className="p-6 border-b border-slate-200 bg-white flex items-center gap-3">
                      <Building2 className="text-blue-500 w-5 h-5" />
                      <p className="font-black text-slate-900">{result.companyName}</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                      <div className="text-slate-700 font-bold leading-relaxed whitespace-pre-wrap text-sm">
                        {result.email}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-200">
                    <Mail className="w-20 h-20 opacity-20 mb-4" />
                    <p className="font-black uppercase tracking-widest text-slate-300">No Draft</p>
                  </div>
                )}
              </div>

              {/* ボタンの z-index と onClick を確実に設定 */}
              <div className="pt-4 relative z-30">
                <Button 
                  onClick={handleSendEmail}
                  disabled={!result}
                  className={`w-full h-16 rounded-2xl text-xl font-black shadow-2xl transition-all active:scale-95 ${result ? 'bg-slate-900 hover:bg-black text-white cursor-pointer' : 'bg-slate-100 text-slate-300'}`}
                >
                  <Send className="mr-3 w-6 h-6" /> Gmailで送信
                </Button>
                <p className="text-center text-[10px] text-slate-400 font-bold mt-3 uppercase tracking-widest">Powered by NextraLabs AI Engine</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
