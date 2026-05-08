'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, Loader2, CheckCircle2, TrendingUp, Search, Info, ShoppingCart, 
  Table, ListChecks, FileText, Database, ShieldCheck, Mail, Send, RotateCw, Trash2, ChevronDown, ChevronUp, Clock, Filter
} from 'lucide-react'

export default function InboxOrganizerApp() {
  const [googleToken, setGoogleToken] = useState<string | null>('active');
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const fetchEmails = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setEmails([
      { id: '1', subject: 'プロジェクト進捗の件', from: 'tanaka@example.com', quadrant: 'urgent_important' },
      { id: '2', subject: '懇親会のお知らせ', from: 'hr@example.com', quadrant: 'not_urgent_not_important' }
    ]);
    setResult("最新のメールを解析し、自動仕分けを完了しました。");
    setLoading(false);
  };

  const quadrants = [
    { id: 'urgent_important', label: '今すぐ対応', color: 'text-red-400', icon: Zap },
    { id: 'urgent_not_important', label: '早めに対応', color: 'text-amber-400', icon: Clock },
    { id: 'not_urgent_important', label: '計画対応', color: 'text-blue-400', icon: ListChecks },
    { id: 'not_urgent_not_important', label: '整理対象', color: 'text-slate-500', icon: Filter },
  ];

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-12 font-sans selection:bg-emerald-500/30 text-left">
      <div className="max-w-5xl mx-auto space-y-10 border-4 border-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.2)] rounded-[3rem] p-6 md:p-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-emerald-500/20 pb-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"><Mail className="h-10 w-10 text-emerald-400" /></div>
            <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">Gmail AI Accelerator</h1>
          </div>
          <Badge className="bg-emerald-500 text-slate-950 font-black italic px-6 py-2 text-sm rounded-full shadow-lg">PREMIUM PLAN</Badge>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400"><Info size={20} /> <h3 className="font-black italic uppercase text-sm">使いかた・活用マニュアル</h3></div>
          <p className="text-sm text-slate-300 font-bold leading-relaxed italic">Google連携を行い「最新メールを解析」を実行してください。AIが重要度を自動仕分けし、未読ゼロへの最短攻略ルートを提示します。</p>
        </div>

        <div className="space-y-8">
          <Button onClick={fetchEmails} disabled={loading} className="w-full h-24 bg-blue-600 hover:bg-blue-500 text-white font-black text-3xl rounded-[2rem] shadow-xl uppercase italic">
            {loading ? <Loader2 className="animate-spin h-10 w-10 mx-auto" /> : '最新メールを解析する 🚀'}
          </Button>

          <div className="grid grid-cols-4 gap-4">
            {quadrants.map(q => (
              <div key={q.id} className="bg-black/40 border border-white/5 p-4 rounded-2xl text-center">
                <q.icon className={`h-6 w-6 mx-auto mb-2 ${q.color}`} />
                <div className="text-xl font-black text-white italic">{emails.filter(e => e.quadrant === q.id).length}</div>
              </div>
            ))}
          </div>

          <div className="space-y-4 text-left">
            {emails.map((email) => (
              <Card key={email.id} className="bg-[#13141f] border border-white/5 rounded-2xl p-6 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black text-blue-400 uppercase italic">{email.from}</p>
                  <h4 className="text-lg font-black text-white italic">{email.subject}</h4>
                </div>
                <Button variant="ghost" className="text-emerald-400 font-black">解析 ➔</Button>
              </Card>
            ))}
          </div>
        </div>

        {result && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-6">
              <h3 className="text-xl font-black text-white italic uppercase tracking-widest border-l-4 border-emerald-500 pl-4">効率化ロードマップ</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[{ title: '重要度仕分け', desc: 'AIが処理順序を確定。', icon: Search }, { title: '返信案作成', desc: '下書きを自動生成。', icon: Send }, { title: '整理完了', desc: '脳の負荷を最小化。', icon: CheckCircle2 }].map((s, i) => (
                  <div key={i} className="bg-[#13141f] border border-white/10 p-10 rounded-3xl space-y-4 hover:border-emerald-500/50 transition-all">
                    <s.icon className="h-6 w-6 text-emerald-400" />
                    <h4 className="text-lg font-black text-white italic">{s.title}</h4>
                    <p className="text-xs text-slate-400 font-bold italic">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <a href="https://www.amazon.co.jp/s?k=仕事術&tag=nextralabs-22" target="_blank" className="block group">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-800 p-10 rounded-[3rem] flex items-center justify-between shadow-2xl transition-all">
                <h3 className="text-2xl font-black text-white italic">不敗の超効率：時間を資産に変える技術 ➔</h3>
                <ShoppingCart size={40} className="text-white animate-pulse" />
              </div>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
