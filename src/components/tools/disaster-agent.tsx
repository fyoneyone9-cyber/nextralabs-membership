'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, MapPin, ShieldAlert, Send, Loader2, CheckCircle2, Navigation, Bell } from "lucide-react";
import { toast } from "sonner";

export default function DisasterAgent() {
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
  const [familyEmail, setFamilyEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'detecting' | 'routing' | 'done'>('idle');
  const [result, setResult] = useState<any>(null);

  // 緊急時：即座に現在地を取得
  const startEmergencySync = () => {
    if (!familyEmail) return toast.error("先に家族の連絡先を入力して保存してください");
    
    setStatus('detecting');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        
        // API呼び出し：避難ルートとメッセージ生成
        try {
          const response = await fetch('/api/tools/disaster-agent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat: latitude, lng: longitude, familyEmail }),
          });
          const data = await response.json();
          setStatus('routing');
          await new Promise(r => setTimeout(resolve, 1000));
          setResult(data);
          setStatus('done');
          toast.success("家族への緊急通知が完了しました");
        } catch (error) {
          toast.error("エラーが発生しました");
          setStatus('idle');
        }
      },
      () => {
        toast.error("位置情報の取得に失敗しました");
        setStatus('idle');
      }
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen font-sans bg-slate-50/50 text-left text-slate-900 antialiased">
      <Card className="border-none bg-white shadow-2xl rounded-[3rem] overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[800px]">
          {/* 左側：緊急コントロール */}
          <div className="lg:w-1/2 p-12 bg-red-950 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-red-600 animate-pulse"></div>
            <div className="space-y-12">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-600 rounded-2xl shadow-lg animate-bounce"><ShieldAlert className="w-8 h-8 text-white" /></div>
                <div>
                  <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">AI Disaster Agent</h1>
                  <p className="text-red-400 text-[10px] font-black tracking-[0.4em] mt-2 uppercase opacity-80">NextraLabs Emergency System</p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
                  <label className="text-[10px] font-black text-red-300 uppercase tracking-widest block ml-1">Pre-set: Family Contact</label>
                  <Input 
                    placeholder="family@example.com" 
                    className="bg-black/40 border-red-900/50 text-white h-14 rounded-xl text-lg font-bold"
                    value={familyEmail}
                    onChange={(e) => setFamilyEmail(e.target.value)}
                  />
                  <p className="text-[10px] text-red-400 font-bold italic">※ここに設定したアドレスへ緊急時に自動通知されます</p>
                </div>

                <Button 
                  onClick={startEmergencySync} 
                  disabled={status !== 'idle' && status !== 'done'}
                  className="w-full bg-red-600 hover:bg-red-500 h-28 rounded-[2.5rem] text-3xl font-black shadow-2xl shadow-red-600/30 transition-all active:scale-95 flex flex-col items-center justify-center gap-2"
                >
                  <div className="flex items-center gap-3">
                    <Bell className="w-8 h-8" />
                    <span>緊急避難・通知</span>
                  </div>
                  <span className="text-xs opacity-70 font-bold uppercase tracking-[0.2em]">One-Tap Emergency Protocol</span>
                </Button>
              </div>
            </div>

            {/* 実況型ステータス */}
            <div className="p-6 bg-black/40 rounded-[2rem] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black text-red-500 uppercase tracking-widest tracking-widest">Live Status</p>
                <div className={`h-2 w-2 rounded-full ${status !== 'idle' ? 'bg-red-500 animate-ping' : 'bg-slate-700'}`} />
              </div>
              <div className="space-y-3">
                <div className={`flex items-center gap-3 text-sm font-bold ${status !== 'idle' ? 'text-white' : 'text-slate-600'}`}>
                   <CheckCircle2 className={`w-4 h-4 ${status !== 'idle' ? 'text-red-500' : 'text-slate-800'}`} /> 現在地のGPSロック完了
                </div>
                <div className={`flex items-center gap-3 text-sm font-bold ${status === 'routing' || status === 'done' ? 'text-white' : 'text-slate-600'}`}>
                   <CheckCircle2 className={`w-4 h-4 ${status === 'routing' || status === 'done' ? 'text-red-500' : 'text-slate-800'}`} /> 避難ルート案の策定完了
                </div>
                <div className={`flex items-center gap-3 text-sm font-bold ${status === 'done' ? 'text-white' : 'text-slate-600'}`}>
                   <CheckCircle2 className={`w-4 h-4 ${status === 'done' ? 'text-red-500' : 'text-slate-800'}`} /> 家族へのGmail自動送信完了
                </div>
              </div>
            </div>
          </div>

          {/* 右側：避難情報ポータル */}
          <div className="lg:w-1/2 p-12 flex flex-col bg-white overflow-hidden border-l border-slate-100 relative">
            <div className="flex-1 flex flex-col space-y-10 min-h-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-xl"><Navigation className="text-slate-900 w-6 h-6" /></div>
                <h2 className="text-xl font-black italic tracking-tight uppercase text-slate-900">Evacuation Plan</h2>
              </div>

              <div className="flex-1 min-h-0 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] flex flex-col overflow-hidden shadow-inner p-8">
                {result ? (
                  <div className="space-y-8 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-red-600 font-black"><Zap className="w-5 h-5" /> <span>最優先避難所</span></div>
                      <p className="text-3xl font-black tracking-tighter text-slate-900">{result.shelters[0].name}</p>
                      <div className="flex gap-2">
                        <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1 rounded-full">{result.shelters[0].distance}</span>
                        <span className="bg-red-100 text-red-600 text-[10px] font-black px-3 py-1 rounded-full">{result.shelters[0].type}</span>
                      </div>
                    </div>
                    
                    <div className="h-px bg-slate-200 w-full" />
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-blue-600 font-black"><Mail className="w-5 h-5" /> <span>送信された通知</span></div>
                      <div className="bg-white p-6 rounded-2xl border border-slate-100 text-sm font-bold text-slate-600 leading-relaxed italic shadow-sm">
                        {result.emergencyMessage}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-200 py-20 text-center">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6"><MapPin className="w-12 h-12 opacity-20" /></div>
                    <p className="font-black uppercase tracking-[0.3em] text-slate-300">Evacuation Ready</p>
                    <p className="text-[10px] text-slate-400 mt-2 font-bold italic">Please set family email and tap RED BUTTON</p>
                  </div>
                )}
              </div>
              
              <div className="pt-4 flex items-center justify-between text-[10px] font-black text-slate-300 uppercase tracking-widest">
                 <span>System Health: Nominal</span>
                 <span>NextraLabs Shield Active</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
