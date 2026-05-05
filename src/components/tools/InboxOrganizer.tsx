'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Mail, Zap, Clock, ListChecks, Filter, CheckCircle2, Loader2, LogIn, Trash2, Send, 
  ArrowRight, ShieldCheck, Sparkles, RefreshCw, Inbox, Archive, MessageSquareQuote, ChevronRight, Activity, Terminal, ExternalLink, X
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''
const GOOGLE_SCOPES = 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.modify'

export default function InboxOrganizer() {
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = new URLSearchParams(window.location.hash.slice(1))
    const token = hash.get('access_token')
    if (token) { 
      setGoogleToken(token); 
      window.history.replaceState(null, '', window.location.pathname); 
      fetchEmails(token); 
    }
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
      setTimeout(() => setScanning(false), 500);
    }
  };

  const handleAction = async (messageId: string, action: 'archive' | 'trash') => {
    try {
      const res = await fetch('/api/tools/gmail-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: googleToken, messageId, action }),
      });
      if (res.ok) {
        setEmails(prev => prev.filter(e => e.id !== messageId));
      }
    } catch (e) { console.error(e); }
  };

  const generateAiReply = async (email: any) => {
    setActiveReplyId(email.id);
    setIsGenerating(true);
    setReplyText('');
    try {
      const res = await fetch('/api/tools/gmail-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: email.subject, from: email.from, snippet: email.snippet }),
      });
      const data = await res.json();
      setReplyText(data.reply);
    } catch (e) { console.error(e); } finally {
      setIsGenerating(false);
    }
  };

  const handleGoogleAuth = useCallback(() => {
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: window.location.href.split('?')[0].split('#')[0],
      response_type: 'token',
      scope: GOOGLE_SCOPES,
      prompt: 'consent',
    })
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`
  }, []);

  const quadrants = [
    { id: 'urgent_important', label: '🔥 今すぐ対応', color: 'border-red-600 text-red-500 bg-red-600/5', icon: Zap },
    { id: 'urgent_not_important', label: '⚡ 早めに対応', color: 'border-amber-500 text-amber-500 bg-amber-500/5', icon: Clock },
    { id: 'not_urgent_important', label: '📌 計画して対応', color: 'border-blue-500 text-blue-500 bg-blue-500/5', icon: ListChecks },
    { id: 'not_urgent_not_important', label: '📂 後回し/ゴミ箱', color: 'border-slate-800 text-slate-500 bg-slate-900/50', icon: Filter },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-slate-950 text-left">
      <div className="text-center space-y-3">
        <Badge className="bg-blue-600 text-white font-black italic tracking-widest px-6 py-1 text-[10px] uppercase rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)]">GMAIL AI ACCELERATOR v3.0</Badge>
        <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl leading-none">Inbox Zero</h1>
      </div>

      {!googleToken ? (
        <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] p-12 md:p-24 text-center space-y-10 shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600" />
           <div className="w-32 h-32 bg-blue-600/10 rounded-[2.5rem] flex items-center justify-center mx-auto border-2 border-blue-500/30 shadow-[0_0_50px_rgba(37,99,235,0.2)]">
              <Mail className="w-16 h-16 text-blue-500 animate-pulse" />
           </div>
           <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter">Accelerate Your Workflow</h2>
              <p className="text-slate-500 font-bold text-lg max-w-xl mx-auto leading-relaxed italic">GmailをAIと直結。重要度の自動分類と、返信ドラフトの自動生成を「秒速」で開始しましょう。</p>
           </div>
           <Button onClick={handleGoogleAuth} className="h-24 bg-white text-black hover:bg-blue-600 hover:text-white font-black px-16 rounded-[2rem] text-3xl uppercase italic shadow-2xl transition-all">
              Connect Gmail <ExternalLink className="ml-4" size={32} />
           </Button>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in duration-700">
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
                  最新メールを解析
               </Button>
               <div className="mt-8 space-y-4">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">解析ステータス</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                       <p className="text-[9px] font-bold text-slate-600 uppercase">取得済み</p>
                       <p className="text-2xl font-black text-white italic">{emails.length}</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                       <p className="text-[9px] font-bold text-slate-600 uppercase">AI分類</p>
                       <p className="text-2xl font-black text-blue-500 italic">{emails.length > 0 ? '100%' : '0%'}</p>
                    </div>
                  </div>
               </div>
               <Button onClick={() => setGoogleToken(null)} variant="ghost" className="w-full mt-8 text-slate-700 hover:text-red-500 text-[10px] font-black uppercase italic tracking-widest underline">セッション終了</Button>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-8">
             <div className="grid grid-cols-2 gap-4">
                {quadrants.map(q => {
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
                <div className="flex items-center gap-3 text-slate-500 font-black italic uppercase text-xs tracking-[0.3em]"><Activity size={16} /> ライブ・メールフィード</div>
                <div className="space-y-4">
                   {loading || scanning ? (
                      Array(3).fill(0).map((_, i) => (<div key={i} className="h-28 bg-slate-950 border border-slate-800 rounded-3xl animate-pulse" />))
                   ) : emails.length > 0 ? (
                      emails.map((email, i) => (
                        <div key={i} className="bg-slate-950 border border-slate-800 rounded-[2rem] p-6 hover:border-blue-500/50 transition-all group shadow-xl relative overflow-hidden">
                           <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                              <Button onClick={() => handleAction(email.id, 'archive')} variant="ghost" size="sm" className="text-slate-500 hover:text-blue-500 bg-slate-900"><Archive size={16}/></Button>
                              <Button onClick={() => handleAction(email.id, 'trash')} variant="ghost" size="sm" className="text-slate-500 hover:text-red-500 bg-slate-900"><Trash2 size={16}/></Button>
                           </div>
                           <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center shrink-0 border border-blue-500/20"><Mail className="text-blue-500" size={24} /></div>
                              <div className="flex-1 space-y-1 min-w-0 text-left">
                                 <p className="text-[10px] font-black text-blue-500 uppercase italic truncate">{email.from}</p>
                                 <h4 className="text-lg font-black text-white italic truncate">{email.subject}</h4>
                                 <p className="text-xs text-slate-500 font-bold line-clamp-1 italic">{email.snippet}</p>
                              </div>
                           </div>
                           <div className="mt-6 flex flex-col gap-4">
                              <Button onClick={() => generateAiReply(email)} size="sm" className="w-fit bg-white text-black font-black italic text-[10px] rounded-lg px-6 h-10 hover:bg-blue-600 hover:text-white transition-all shadow-lg">
                                 <Sparkles size={14} className="mr-2" /> AI返信ドラフトを生成
                              </Button>
                              {activeReplyId === email.id && (
                                 <div className="bg-slate-900 rounded-2xl p-6 border border-blue-600/30 animate-in slide-in-from-top-2 relative">
                                    <button onClick={() => setActiveReplyId(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={16}/></button>
                                    <p className="text-[10px] font-black text-blue-500 uppercase italic mb-3 flex items-center gap-2"><Sparkles size={12}/> AI Generated Draft</p>
                                    {isGenerating ? (
                                       <div className="flex items-center gap-3 text-slate-500 italic text-xs"><Loader2 className="animate-spin" size={14}/> 思考中...</div>
                                    ) : (
                                       <div className="space-y-4">
                                          <pre className="text-xs text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">{replyText}</pre>
                                          <Button onClick={() => { navigator.clipboard.writeText(replyText); alert('コピーしました'); }} className="h-8 bg-blue-600 text-[10px] font-black italic rounded-lg px-4">結果をコピー</Button>
                                       </div>
                                    )}
                                 </div>
                              )}
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
      <DebugPanel data={{ emails, googleToken, loading }} toolId="inbox-organizer" />
    </div>
  )
}
