'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, MapPin, ShieldAlert, Mail, Bell, CheckCircle2, Navigation, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function DisasterAgent() {
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
  const [familyEmail, setFamilyEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'detecting' | 'routing' | 'done'>('idle');
  const [result, setResult] = useState<any>(null);

  const startEmergencySync = () => {
    if (!familyEmail) return toast.error("先に家族の連絡先を入力してください");
    setStatus('detecting');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        try {
          const response = await fetch('/api/tools/disaster-agent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat: latitude, lng: longitude, familyEmail }),
          });
          const data = await response.json();
          setStatus('routing');
          await new Promise(r => setTimeout(r, 1000));
          setResult(data);
          setStatus('done');
          toast.success("緊急通知が完了しました");
        } catch (error) {
          toast.error("通信エラーが発生しました");
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
    <div className="max-w-6xl mx-auto p-4 min-h-screen font-sans bg-slate-50/50 text-left">
      <Card className="border-none bg-white shadow-2xl rounded-[3rem] overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[800px]">
          <div className="lg:w-1/2 p-12 bg-red-950 text-white flex flex-col justify-between relative overflow-hidden text-left">
            <div className="absolute top-0 left-0 w-full h-2 bg-red-600 animate-pulse"></div>
            <div className="space-y-12">
              <div className="flex items-center gap-4 text-left"><div className="p-3 bg-red-600 rounded-2xl shadow-lg animate-bounce text-left"><ShieldAlert className="w-8 h-8 text-white" /></div><div><h1 className="text-3xl font-black italic tracking-tighter uppercase text-white">AI Disaster Agent</h1></div></div>
              <div className="space-y-8 text-left">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4 text-left"><label className="text-[10px] font-black text-red-300 uppercase tracking-widest block text-left">Family Contact</label><Input placeholder="family@example.com" className="bg-black/40 border-red-900/50 text-white h-14 rounded-xl text-lg font-bold" value={familyEmail} onChange={(e) => setFamilyEmail(e.target.value)} /></div>
                <Button onClick={startEmergencySync} disabled={status !== 'idle' && status !== 'done'} className="w-full bg-red-600 hover:bg-red-500 h-28 rounded-[2.5rem] text-3xl font-black shadow-2xl flex flex-col items-center justify-center gap-2"><div className="flex items-center gap-3"><Bell className="w-8 h-8" /><span>緊急避難・通知</span></div></Button>
              </div>
            </div>
            <div className="p-6 bg-black/40 rounded-[2rem] border border-white/5 space-y-3 text-left">
              <div className="flex items-center justify-between text-left"><p className="text-xs font-black text-red-500 uppercase tracking-widest text-left">Live Status</p><div className={`h-2 w-2 rounded-full ${status !== 'idle' ? 'bg-red-500 animate-ping' : 'bg-slate-700'}`} /></div>
              <div className="space-y-2 text-left">
                <div className={`flex items-center gap-3 text-sm font-bold ${status !== 'idle' ? 'text-white' : 'text-slate-600'}`}><CheckCircle2 className={`w-4 h-4 ${status !== 'idle' ? 'text-red-500' : 'text-slate-800'}`} />GPSロック完了</div>
                <div className={`flex items-center gap-3 text-sm font-bold ${status === 'done' ? 'text-white' : 'text-slate-600'}`}><CheckCircle2 className={`w-4 h-4 ${status === 'done' ? 'text-red-500' : 'text-slate-800'}`} />自動送信完了</div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 p-12 flex flex-col bg-white overflow-hidden border-l border-slate-100 text-left">
            <div className="flex-1 flex flex-col space-y-10 text-left">
              <div className="flex items-center gap-3 text-left"><div className="p-2 bg-slate-100 rounded-xl text-left"><Navigation className="text-slate-900 w-6 h-6" /></div><h2 className="text-xl font-black italic tracking-tight uppercase text-slate-900">Evacuation Info</h2></div>
              <div className="flex-1 min-h-0 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] flex flex-col overflow-hidden shadow-inner p-8 text-left">
                {result ? (
                  <div className="space-y-6 text-left">
                    <div className="space-y-2 text-left"><p className="text-red-600 font-black flex items-center gap-2 text-left"><Zap className="w-5 h-5" />最優先避難所</p><p className="text-3xl font-black text-slate-900 text-left">{result.shelters[0].name}</p></div>
                    <div className="h-px bg-slate-200" /><div className="space-y-2 text-left"><p className="text-blue-600 font-black flex items-center gap-2 text-left"><Mail className="w-5 h-5" />送信済みメッセージ</p><div className="bg-white p-6 rounded-2xl border border-slate-100 text-sm font-bold text-slate-600 italic text-left">{result.emergencyMessage}</div></div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-200 text-center py-20"><MapPin className="w-12 h-12 opacity-20 mb-4" /><p className="font-black uppercase tracking-[0.3em] text-slate-300">Ready</p></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
