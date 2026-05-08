'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Mail, Zap, Clock, ListChecks, Filter, Trash2, 
  ChevronDown, ChevronUp, Copy, Check, Send, 
  RotateCw, ExternalLink, Loader2, ShieldCheck, Info, ShoppingCart, TrendingUp, CheckCircle2
} from 'lucide-react'

// Google連携定数
const GOOGLE_CLIENT_ID = '239583936801-ev71grs66ehp0kn3kahr2bdrl0v9iidj.apps.googleusercontent.com'
const GOOGLE_SCOPES = 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.compose'

const MasterEngine = () => {
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({});
  const [isDrafting, setIsDrafting] = useState<Record<string, boolean>>({});
  const [resultSummary, setResultSummary] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = new URLSearchParams(window.location.hash.slice(1))
    const token = hash.get('access_token')
    if (token) { 
      setGoogleToken(token); 
      localStorage.setItem('nextra_google_token', token);
      window.history.replaceState(null, '', window.location.pathname); 
      fetchEmails(token); 
    } else {
      const saved = localStorage.getItem('nextra_google_token');
      if (saved) setGoogleToken(saved);
    }
  }, []);

  const fetchEmails = async (token: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/tools/gmail-fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: token }),
      });
      const data = await res.json();
      
      if (res.status === 401 || data.error) {
        localStorage.removeItem('nextra_google_token');
        setGoogleToken(null);
        return;
      }

      if (data.messages) {
        setEmails(data.messages);
        setResultSummary(`最新の${data.messages.length}件をスキャンし、優先順位に基づいた自動仕分けを完了しました。`);
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const generateAiReply = async (email: any) => {
    setIsGenerating(prev => ({ ...prev, [email.id]: true }));
    try {
      const res = await fetch('/api/tools/gmail-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: email.subject, from: email.from, body: email.body }),
      });
      const data = await res.json();
      setReplyTexts(prev => ({ ...prev, [email.id]: data.reply }));
    } catch (e) { console.error(e); } finally { setIsGenerating(prev => ({ ...prev, [email.id]: false })); }
  };

  const saveDraft = async (email: any) => {
    const text = replyTexts[email.id];
    if (!text) return;
    setIsDrafting(prev => ({ ...prev, [email.id]: true }));
    try {
      await fetch('/api/tools/gmail-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: googleToken, threadId: email.id, replyBody: text }),
      });
      alert('Gmailの下書きに保存しました');
    } catch (e) { console.error(e); } finally { setIsDrafting(prev => ({ ...prev, [email.id]: false })); }
  };

  const login = () => {
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: window.location.origin + window.location.pathname,
      response_type: 'token',
      scope: GOOGLE_SCOPES,
      prompt: 'consent',
    });
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  };

  const quadrants = [
    { id: 'urgent_important', label: '今すぐ対応', color: 'text-red-400', icon: Zap },
    { id: 'urgent_not_important', label: '早めに対応', color: 'text-amber-400', icon: Clock },
    { id: 'not_urgent_important', label: '計画対応', color: 'text-blue-400', icon: ListChecks },
    { id: 'not_urgent_not_important', label: '整理対象', color: 'text-slate-500', icon: Filter },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 border-4 border-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.2)] rounded-[3rem] p-6 md:p-12 bg-[#050507]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-emerald-500/20 pb-10">
        <div className="flex items-center gap-4 text-left">
          <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"><Mail className="h-10 w-10 text-emerald-400" /></div>
          <div>
            <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white leading-none">Gmail AI Accelerator</h1>
            <p className="text-emerald-400 font-bold uppercase tracking-[0.2em] text-[10px] italic mt-2">Strategic Inbox Intelligence</p>
          </div>
        </div>
        <Badge className="bg-emerald-500 text-slate-950 font-black italic px-6 py-2 text-sm rounded-full shadow-lg">PREMIUM PLAN</Badge>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4 text-left">
        <div className="flex items-center gap-2 text-emerald-400"><Info size={20} /> <h3 className="font-black italic uppercase text-sm">使いかた・活用マニュアル</h3></div>
        <p className="text-sm text-slate-300 font-bold leading-relaxed italic">
          Google連携を行い「最新メールを解析」を実行してください。AIがメールの重要度を4象限に自動仕分けし、返信が必要な案件にはドラフト案を自動生成。未読ゼロへの最短攻略ルートを提示します。
        </p>
      </div>

      {!googleToken ? (
        <Card className="bg-[#13141f] border-2 border-white/10 rounded-[2rem] p-12 text-center shadow-xl">
          <Mail className="h-16 w-16 text-blue-500 mx-auto mb-6" />
          <Button onClick={login} className="h-20 w-full bg-white text-black font-black text-2xl rounded-2xl shadow-xl hover:scale-105 transition-all">Google 連携を開始 ↗</Button>
        </Card>
      ) : (
        <div className="space-y-8">
          <Button onClick={() => fetchEmails(googleToken!)} disabled={loading} className="w-full h-24 bg-blue-600 hover:bg-blue-500 text-white font-black text-3xl rounded-[2rem] shadow-[0_0_50px_rgba(37,99,235,0.4)] uppercase italic transition-all">
            {loading ? <Loader2 className="animate-spin h-10 w-10" /> : '最新メールを解析する 🚀'}
          </Button>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quadrants.map(q => (
              <div key={q.id} className="bg-black/40 border border-white/5 p-6 rounded-2xl text-center shadow-inner">
                <q.icon className={`h-6 w-6 mx-auto mb-2 ${q.color}`} />
                <p className="text-[10px] font-black text-slate-500 uppercase mb-1">{q.label}</p>
                <div className="text-2xl font-black text-white italic">{loading ? '...' : emails.filter(e => e.quadrant === q.id).length}</div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {emails.length === 0 && !loading ? (
              <div className="py-20 text-center opacity-20 italic font-black uppercase text-xl">Inbox Zero Achieved</div>
            ) : (
              emails.map((email) => (
                <Card key={email.id} className="bg-[#13141f] border border-white/5 rounded-2xl overflow-hidden shadow-xl hover:border-blue-500/30 transition-all text-left">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[8px] font-black text-blue-400 border-blue-400/30 uppercase tracking-tighter">New Message</Badge>
                          <span className="text-[10px] font-black text-slate-500 truncate italic">{email.from}</span>
                        </div>
                        <h4 className="text-xl font-black text-white italic leading-tight truncate">{email.subject}</h4>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setExpandedId(expandedId === email.id ? null : email.id)} className="h-10 w-10 p-0 text-slate-500 hover:text-white">
                        {expandedId === email.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                      </Button>
                    </div>

                    {expandedId === email.id && (
                      <div className="animate-in slide-in-from-top-2 duration-300">
                        <div className="bg-black/40 rounded-xl p-6 text-sm text-slate-300 leading-relaxed italic whitespace-pre-wrap border border-white/5 mb-4 max-h-60 overflow-y-auto shadow-inner">
                          {email.body}
                        </div>
                      </div>
                    )}

                    <div className="space-y-3 pt-4 border-t border-white/5">
                      {!replyTexts[email.id] ? (
                        <Button 
                          onClick={() => generateAiReply(email)} 
                          disabled={isGenerating[email.id]}
                          className="w-full h-14 bg-white/5 hover:bg-white/10 text-emerald-400 border border-emerald-500/30 font-black text-sm rounded-xl transition-all uppercase italic"
                        >
                          {isGenerating[email.id] ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <Zap size={16} className="mr-2" />}
                          AI返信案を生成する
                        </Button>
                      ) : (
                        <div className="space-y-4 animate-in fade-in duration-500">
                          <div className="bg-emerald-500/5 border-2 border-emerald-500/20 rounded-2xl p-6 shadow-inner">
                            <p className="text-xs text-emerald-400 font-black mb-3 uppercase italic flex items-center gap-2">
                              <ShieldCheck size={14} /> AI Strategic Draft
                            </p>
                            <p className="text-base text-white italic leading-relaxed">{replyTexts[email.id]}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <Button onClick={() => { navigator.clipboard.writeText(replyTexts[email.id]); alert('コピーしました'); }} className="h-12 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs rounded-xl shadow-lg">
                              コピーする
                            </Button>
                            <Button onClick={() => saveDraft(email)} disabled={isDrafting[email.id]} className="h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg">
                              {isDrafting[email.id] ? <Loader2 className="animate-spin h-4 w-4" /> : <Send size={14} className="mr-2" />} 下書き保存
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <Button onClick={() => { localStorage.removeItem('nextra_google_token'); setGoogleToken(null); }} variant="ghost" className="w-full text-slate-600 hover:text-red-400 text-[10px] font-black uppercase italic py-10">
            <Trash2 size={12} className="mr-2" /> セッションを終了してログアウト
          </Button>
        </div>
      )}

      {resultSummary && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="space-y-6 text-left">
            <h3 className="text-xl font-black text-white italic uppercase tracking-widest border-l-4 border-emerald-500 pl-4">効率化ロードマップ</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: '重要度仕分け', desc: 'AIが緊急度と重要度をマッピングし、処理順序を確定。', icon: Search },
                { title: '返信案作成', desc: '文脈を読み取り、相手のトーンに合わせた下書きを自動生成。', icon: Send },
                { title: '整理完了', desc: '不要なメールの一括処理を行い、脳の負荷を最小化します。', icon: CheckCircle2 },
              ].map((s, i) => (
                <div key={i} className="bg-[#13141f] border border-white/10 p-8 rounded-3xl space-y-4 hover:border-emerald-500/50 transition-all">
                  <s.icon className="h-6 w-6 text-emerald-400" />
                  <h4 className="text-lg font-black text-white italic">{s.title}</h4>
                  <p className="text-xs text-slate-400 font-bold italic leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <a href="https://www.amazon.co.jp/s?k=仕事術+効率化&tag=nextralabs-22" target="_blank" className="block group">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-800 p-10 rounded-[3rem] flex items-center justify-between shadow-2xl transition-all hover:scale-[1.01]">
              <h3 className="text-2xl font-black text-white italic">不敗の超効率：時間を資産に変える技術 ➔</h3>
              <ShoppingCart size={40} className="text-white animate-pulse" />
            </div>
          </a>
        </div>
      )}
    </div>
  );
};

const NoSSRWrapper = dynamic(() => Promise.resolve(MasterEngine), { ssr: false });

export default function InboxOrganizer() {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 font-sans p-4 pb-20 selection:bg-emerald-500/30 text-center">
      <NoSSRWrapper />
    </div>
  );
}
