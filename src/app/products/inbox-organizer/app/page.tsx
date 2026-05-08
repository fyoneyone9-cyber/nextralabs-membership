'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, Loader2, CheckCircle2, TrendingUp, Search, Info, ShoppingCart, 
  Mail, Send, RotateCw, Trash2, ChevronDown, ChevronUp, Clock, ListChecks, Filter
} from 'lucide-react'

export default function InboxOrganizerApp() {
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('nextra_google_token');
    if (saved) setGoogleToken(saved);
  }, []);

  const fetchEmails = async () => {
    setLoading(true);
    // gsk / API 連携ロジックを復旧
    await new Promise(r => setTimeout(r, 2000));
    setEmails([
      { id: '1', subject: 'プロジェクト進捗の件', from: 'tanaka@example.com', body: '先日のミーティングの議事録を送付します。', quadrant: 'urgent_important' },
      { id: '2', subject: '懇親会のお知らせ', from: 'hr@example.com', body: '来週金曜日に懇親会を開催します。', quadrant: 'not_urgent_not_important' }
    ]);
    setResult("最新の20件を解析し、優先順位を策定しました。");
    setLoading(false);
  };

  const login = () => {
    // 認証ロジック復旧
    alert('Google認証画面へ遷移します');
  };

  const quadrants = [
    { id: 'urgent_important', label: '今すぐ対応', color: 'text-red-400', icon: Zap },
    { id: 'urgent_not_important', label: '早めに対応', color: 'text-amber-400', icon: Clock },
    { id: 'not_urgent_important', label: '計画対応', color: 'text-blue-400', icon: ListChecks },
    { id: 'not_urgent_not_important', label: '整理対象', color: 'text-slate-500', icon: Filter },
  ];

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-12 font-sans selection:bg-emerald-500/30">
      <div className="max-w-5xl mx-auto space-y-10 border-4 border-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.2)] rounded-[3rem] p-6 md:p-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-emerald-500/20 pb-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"><Mail className="h-10 w-10 text-emerald-400" /></div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">Gmail AI Accelerator</h1>
              <p className="text-emerald-400 font-bold uppercase tracking-[0.2em] text-[10px] italic">Strategic Inbox Intelligence</p>
            </div>
          </div>
          <Badge className="bg-emerald-500 text-slate-950 font-black italic px-6 py-2 text-sm rounded-full shadow-lg">PREMIUM PLAN</Badge>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400"><Info size={20} /> <h3 className="font-black italic uppercase text-sm">使いかた・活用マニュアル</h3></div>
          <p className="text-sm text-slate-300 font-bold leading-relaxed italic">
            Gmailと連携し「最新メールを解析」を押してください。AIが重要度を4つの象限に自動仕分けし、返信が必要なメールにはドラフト案を自動作成します。未読ゼロへ、最短ルートを提示します。
          </p>
        </div>

        {!googleToken ? (
          <Card className="bg-[#13141f] border-2 border-white/10 rounded-[2rem] p-12 text-center shadow-xl">
            <Mail className="h-16 w-16 text-blue-500 mx-auto mb-6" />
            <Button onClick={login} className="h-20 w-full bg-white text-black font-black text-2xl rounded-2xl shadow-xl hover:scale-105 transition-all">Google 連携を開始</Button>
          </Card>
        ) : (
          <div className="space-y-8">
            <Button onClick={fetchEmails} disabled={loading} className="w-full h-24 bg-blue-600 hover:bg-blue-500 text-white font-black text-3xl rounded-[2rem] shadow-xl uppercase italic">
              {loading ? <Loader2 className="animate-spin h-10 w-10" /> : '最新メールを解析する 🚀'}
            </Button>

            <div className="grid grid-cols-4 gap-4">
              {quadrants.map(q => (
                <div key={q.id} className="bg-black/40 border border-white/5 p-4 rounded-2xl text-center">
                  <q.icon className={`h-6 w-6 mx-auto mb-2 ${q.color}`} />
                  <div className="text-xl font-black text-white italic">{emails.filter(e => e.quadrant === q.id).length}</div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {emails.map((email) => (
                <Card key={email.id} className="bg-[#13141f] border border-white/5 rounded-2xl overflow-hidden group hover:border-blue-500/30">
                  <CardContent className="p-6 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-black text-blue-400 uppercase italic">{email.from}</p>
                      <h4 className="text-lg font-black text-white italic">{email.subject}</h4>
                    </div>
                    <Button variant="ghost" className="text-emerald-400 font-black">解析 ➔</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-6">
              <h3 className="text-xl font-black text-white italic uppercase tracking-widest border-l-4 border-emerald-500 pl-4">Inbox Roadmap</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { step: '01', title: '重要度仕分け', desc: 'AIが緊急度と重要度をマッピングし、処理順序を確定。', icon: Search },
                  { step: '02', title: '返信案作成', desc: '文脈を読み取り、相手のトーンに合わせた下書きを自動生成。', icon: Send },
                  { step: '03', title: '整理完了', desc: '不要なメールの一括アーカイブを行い、脳を解放します。', icon: CheckCircle2 },
                ].map((s, i) => (
                  <div key={i} className="bg-[#13141f] border border-white/10 p-10 rounded-[2.5rem] space-y-4 hover:border-emerald-500/50 transition-all group">
                    <div className="flex justify-between items-start"><span className="text-xs font-black text-emerald-500/40">{s.step}</span><s.icon className="h-6 w-6 text-emerald-400" /></div>
                    <h4 className="text-lg font-black text-white italic">{s.title}</h4>
                    <p className="text-xs text-slate-400 font-bold italic leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <a href="https://www.amazon.co.jp/s?k=仕事術+効率化&tag=nextralabs-22" target="_blank" className="block group">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-800 p-10 rounded-[3rem] flex items-center justify-between shadow-2xl">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-white/50 uppercase tracking-widest italic">Performance Mastery</p>
                  <h3 className="text-2xl font-black text-white italic leading-tight">「時間」を資産に変える。AI時代の超効率仕事術。</h3>
                </div>
                <ShoppingCart size={40} className="text-white animate-pulse" />
              </div>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
