'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Zap, Mail, Building2, Send, Loader2, CheckCircle2, Search, Briefcase } from "lucide-react";
import { toast } from "sonner";

export default function SalesAutomation() {
  const [domain, setDomain] = useState('');
  const [targetPerson, setTargetPerson] = useState('');
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'drafting' | 'done'>('idle');
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    if (!domain) return toast.error("企業ドメインを入力してください");
    
    setStatus('analyzing');
    setResult(null);
    
    try {
      // Step 1: 企業分析
      const response = await fetch('/api/tools/sales-automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, targetPerson }),
      });
      
      const data = await response.json();
      setStatus('drafting');
      
      // 擬似的な待ち時間で実況感を演出
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setResult(data);
      setStatus('done');
      toast.success("提案メールの作成が完了しました");
    } catch (error) {
      toast.error("エラーが発生しました");
      setStatus('idle');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen font-sans bg-slate-50/50 text-left text-slate-900">
      <Card className="border-none bg-white shadow-2xl rounded-[3rem] overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[700px]">
          {/* 左：入力・ステータス */}
          <div className="lg:w-1/2 p-10 bg-slate-900 text-white flex flex-col justify-between">
            <div className="space-y-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg"><Zap className="w-8 h-8 text-white" /></div>
                <div>
                  <h1 className="text-2xl font-black italic tracking-tighter uppercase">Sales Automation</h1>
                  <p className="text-blue-400 text-[10px] font-black tracking-widest uppercase">NextraLabs AI Inside Sales</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">1. Target Company Domain</label>
                  <Input 
                    placeholder="example.com" 
                    className="bg-black/50 border-slate-800 text-xl font-black h-16 rounded-2xl focus:border-blue-500"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">2. Contact Person</label>
                  <Input 
                    placeholder="担当者名（任意）" 
                    className="bg-black/50 border-slate-800 text-lg h-14 rounded-2xl"
                    value={targetPerson}
                    onChange={(e) => setTargetPerson(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleGenerate} 
                  disabled={status !== 'idle' && status !== 'done'}
                  className="w-full bg-blue-600 hover:bg-blue-500 h-20 rounded-2xl text-2xl font-black shadow-xl transition-all active:scale-95"
                >
                  {status === 'idle' || status === 'done' ? (
                    <><Search className="mr-3" /> 戦略メールを生成</>
                  ) : (
                    <><Loader2 className="mr-3 animate-spin" /> {status === 'analyzing' ? '企業を分析中...' : 'メールを執筆中...'}</>
                  )}
                </Button>
              </div>
            </div>

            {/* 実況型ステータス表示 */}
            <div className="mt-10 p-6 bg-black/40 rounded-[2rem] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Real-time Progress</p>
                <div className={`h-2 w-2 rounded-full ${status !== 'idle' ? 'bg-blue-500 animate-ping' : 'bg-slate-700'}`} />
              </div>
              <div className="space-y-3">
                <div className={`flex items-center gap-3 text-sm font-bold ${status === 'analyzing' || status === 'drafting' || status === 'done' ? 'text-white' : 'text-slate-600'}`}>
                  <CheckCircle2 className={`w-4 h-4 ${status === 'analyzing' || status === 'drafting' || status === 'done' ? 'text-blue-500' : 'text-slate-800'}`} /> Clearbit企業データベース照会
                </div>
                <div className={`flex items-center gap-3 text-sm font-bold ${status === 'drafting' || status === 'done' ? 'text-white' : 'text-slate-600'}`}>
                  <CheckCircle2 className={`w-4 h-4 ${status === 'drafting' || status === 'done' ? 'text-blue-500' : 'text-slate-800'}`} /> Gemini 1.5 Pro 戦略執筆
                </div>
              </div>
            </div>
          </div>

          {/* 右：プレビュー・アクション */}
          <div className="lg:w-1/2 p-12 flex flex-col bg-white overflow-y-auto">
            <div className="flex-1 space-y-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-slate-100 rounded-xl"><Mail className="text-slate-600" /></div>
                <h2 className="text-xl font-black italic tracking-tight uppercase">Draft Preview</h2>
              </div>

              {result ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <div className="p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] space-y-4">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                      <Building2 className="text-blue-500" />
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Company Identified</p>
                        <p className="text-lg font-black">{result.companyInfo.name}</p>
                      </div>
                    </div>
                    <Textarea 
                      readOnly
                      className="bg-transparent border-none p-0 font-bold text-slate-700 min-h-[350px] resize-none focus:ring-0 leading-relaxed text-sm"
                      value={result.draftEmail}
                    />
                  </div>
                  <Button className="w-full bg-slate-900 hover:bg-black h-16 rounded-2xl text-xl font-black shadow-lg">
                    <Send className="mr-2" /> Gmailで送信
                  </Button>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-200 py-20">
                  <Mail className="w-20 h-20 mb-4 opacity-20" />
                  <p className="font-black italic uppercase tracking-widest text-slate-300">No Draft Generated</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
