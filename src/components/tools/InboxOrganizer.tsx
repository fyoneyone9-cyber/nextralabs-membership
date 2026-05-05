'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Mail, Zap, Clock, ListChecks, Filter, CheckCircle2, Loader2, LogIn, Trash2, Send, 
  ArrowRight, ShieldCheck, Sparkles, RefreshCw, Inbox, Archive, MessageSquareQuote, ChevronRight, Activity, Terminal
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''
const GOOGLE_SCOPES = 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.modify'

export default function InboxOrganizer() {
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1))
    const token = hash.get('access_token')
    if (token) { 
      setGoogleToken(token); 
      window.history.replaceState(null, '', window.location.pathname); 
      fetchEmails(token); 
    }
  }, []);

  const handleGoogleAuth = useCallback(() => {
    setAuthLoading(true)
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: window.location.href.split('?')[0].split('#')[0],
      response_type: 'token',
      scope: GOOGLE_SCOPES,
      prompt: 'consent',
    })
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`
  }, []);

  const fetchEmails = async (token: string) => {
    setLoading(true);
    setScanning(true);
    try {
      const res = await fetch('/api/tools/gmail-fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: token }),
      });
      const data = await res.json();
      setEmails(data.messages || []);
    } catch (e) { 
      console.error('[GMAIL_FETCH_ERROR]', e); 
    } finally { 
      setLoading(false);
      setTimeout(() => setScanning(false), 1000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-slate-950 text-left">
      <div className="text-center space-y-3">
        <Badge className="bg-blue-600 text-white font-black italic tracking-widest px-6 py-1 text-[10px] uppercase rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)]">GMAIL AI ACCELERATOR v2.0</Badge>
        <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">Inbox Zero</h1>
      </div>

      {!googleToken ? (
        <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] p-12 md:p-24 text-center space-y-10 shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative overflow-hidden animate-in zoom-in-95">
           <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600" />
           <div className="w-32 h-32 bg-blue-600/10 rounded-[2.5rem] flex items-center justify-center mx-auto border-2 border-blue-500/30 shadow-[0_0_50px_rgba(37,99,235,0.2)]">
              <Mail className="w-16 h-16 text-blue-500 animate-pulse" />
           </div>
           <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter">Accelerate Your Workflow</h2>
              <p className="text-slate-500 font-bold text-lg max-w-xl mx-auto leading-relaxed italic">GmailをAIと直結。重要度の自動分類と、返信ドラフトの自動生成を「秒速」で開始しましょう。</p>
           </div>
           <Button onClick={handleGoogleAuth} disabled={authLoading} className="h-24 bg-white text-black hover:bg-blue-600 hover:text-white font-black px-16 rounded-[2rem] text-3xl uppercase italic shadow-2xl transition-all active:scale-95 group">
              {authLoading ? <Loader2 className="animate-spin" size={40} /> : <>Connect Gmail <ExternalLink className="ml-4 group-hover:translate-x-2 transition-transform" size={32} /></>}
           </Button>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in duration-700">
          {/* ⚡ LEFT: CONTROL TERMINAL */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2 text-blue-500 font-black italic tracking-widest text-xs uppercase">
                    <Activity size={16} /> Scanning Engine
                  </div>
                  <Badge variant="outline" className="text-[10px] border-green-500/30 text-green-500 font-black italic uppercase animate-pulse">Live Link</Badge>
               </div>
               
               <Button onClick={() => fetchEmails(googleToken)} disabled={loading} className="w-full h-20 bg-blue-600 hover:bg-blue-500 text-white font-black text-xl rounded-2xl shadow-lg flex items-center justify-center gap-4 group italic">
                  {loading ? <Loader2 className="animate-spin" /> : <RefreshCw className="group-hover:rotate-180 transition-transform duration-500" />}
                  SYNC & ANALYZE
               </Button>

               <div className="mt-8 space-y-4">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Analysis Stats</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                       <p className="text-[9px] font-bold text-slate-600 uppercase">Fetched</p>
                       <p className="text-2xl font-black text-white italic">{emails.length}</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                       <p className="text-[9px] font-bold text-slate-600 uppercase">AI Sorted</p>
                       <p className="text-2xl font-black text-blue-500 italic">{emails.length > 0 ? '100%' : '0%'}</p>
                    </div>
                  </div>
               </div>

               <Button onClick={() => setGoogleToken(null)} variant="ghost" className="w-full mt-8 text-slate-700 hover:text-red-500 text-[10px] font-black uppercase italic tracking-widest underline">Terminate Session</Button>
            </Card>

            <div className="bg-blue-600/5 border-2 border-blue-500/20 rounded-[2rem] p-6 space-y-2 italic">
               <p className="text-blue-500 text-xs font-black uppercase tracking-widest flex items-center gap-2"><Sparkles size={14}/> AI Insight</p>
               <p className="text-slate-400 text-sm font-bold leading-relaxed">全てのメールを重要度×緊急度の4象限に自動配置しました。上から順に処理を推奨します。</p>
            </div>
          </div>

          {/* 🔥 RIGHT: MESSAGE FEED (THE MATRIX) */}
          <div className="lg:col-span-2 space-y-8">
             <div className="grid grid-cols-2 gap-4">
               { id: 'urgent_important', label: 'Urgent/High', color: 'border-red-600 text-red-500 bg-red-600/5', icon: Zap },
               { id: 'urgent_not_important', label: 'Urgent/Low', color: 'border-amber-500 text-amber-500 bg-amber-500/5', icon: Clock },
               { id: 'not_urgent_important', label: 'Plan/Focus', color: 'border-blue-500 text-blue-500 bg-blue-500/5', icon: ListChecks },
               { id: 'not_urgent_not_important', label: 'Backlog/Arch', color: 'border-slate-800 text-slate-500 bg-slate-900/50', icon: Filter },
             ].map(q => {
               const Icon = q.icon;
               return (
                  <div key={q.id} className={`p-4 rounded-2xl border-2 flex items-center justify-between shadow-lg ${q.color}`}>
                     <div className="flex items-center gap-3"><Icon size={18}/><span className="text-xs font-black uppercase italic">{q.label}</span></div>
                     <span className="text-lg font-black italic">{loading ? '...' : emails.filter(e => e.quadrant === q.id).length}</span>
                  </div>
               );
             })}
             </div>

             <div className="bg-slate-900/50 border-2 border-slate-800 rounded-[3rem] p-10 min-h-[600px] shadow-inner space-y-6">
                <div className="flex items-center gap-3 text-slate-500 font-black italic uppercase text-xs tracking-[0.3em]">
                   <Activity size={16} /> Live Mail Feed
                </div>

                <div className="space-y-4">
                   {loading || scanning ? (
                      Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-28 bg-slate-950 border border-slate-800 rounded-3xl animate-pulse" />
                      ))
                   ) : emails.length > 0 ? (
                      emails.map((email, i) => (
                        <div key={i} className="bg-slate-950 border border-slate-800 rounded-[2rem] p-6 hover:border-blue-500/50 transition-all group shadow-xl relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-red-500"><Trash2 size={16}/></Button>
                           </div>
                           <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center shrink-0 border border-blue-500/20">
                                 <Mail className="text-blue-500" size={24} />
                              </div>
                              <div className="flex-1 space-y-1 min-w-0 text-left">
                                 <p className="text-[10px] font-black text-blue-500 uppercase italic truncate">{email.from}</p>
                                 <h4 className="text-lg font-black text-white italic truncate">{email.subject}</h4>
                                 <p className="text-xs text-slate-500 font-bold line-clamp-1 italic">{email.snippet}</p>
                              </div>
                           </div>
                           <div className="mt-6 flex items-center gap-3">
                              <Button size="sm" className="bg-white text-black font-black italic text-[10px] rounded-lg px-4 hover:bg-blue-600 hover:text-white transition-colors">
                                 <MessageSquareQuote size={12} className="mr-2" /> GENERATE REPLY
                              </Button>
                              <Button variant="outline" size="sm" className="border-slate-800 text-slate-500 font-black italic text-[10px] rounded-lg px-4 hover:bg-slate-800">
                                 <Archive size={12} className="mr-2" /> ARCHIVE
                              </Button>
                           </div>
                        </div>
                      ))
                   ) : (
                      <div className="h-96 flex flex-col items-center justify-center space-y-6 opacity-30 italic">
                         <Inbox size={80} />
                         <p className="text-xl font-black uppercase tracking-widest">Inbox Zero Achieved</p>
                      </div>
                   )}
                </div>
             </div>
          </div>
        </div>
      )}
      
      <DebugPanel data={{ emails, googleToken, loading, scanning }} toolId="inbox-organizer" />
      <div className="text-center opacity-20 mt-20"><p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Email Acceleration Engine • NextraLabs 2026</p></div>
    </div>
  )
}
