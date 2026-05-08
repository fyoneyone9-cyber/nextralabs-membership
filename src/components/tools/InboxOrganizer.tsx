'use client'
import React, { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Mail, Zap, Clock, ListChecks, Filter, Trash2, 
  ChevronDown, ChevronUp, Copy, Check, Send, 
  RotateCw, ExternalLink, Loader2, ShieldCheck, AlertCircle
} from 'lucide-react'

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
      if (data.messages) setEmails(data.messages);
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
      alert('下書きを保存しました');
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
    <div className="max-w-4xl mx-auto space-y-4">
      {!googleToken ? (
        <Card className="bg-[#13141f] border-2 border-emerald-500/20 rounded-[2rem] p-12 text-center shadow-2xl">
          <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Mail className="h-10 w-10 text-blue-500" />
          </div>
          <h2 className="text-3xl font-black text-white italic uppercase mb-4">Connect Gmail</h2>
          <p className="text-slate-400 font-bold mb-10 italic text-sm">AIが未読メールを瞬時に整理・解析します</p>
          <Button onClick={login} className="h-20 w-full bg-white text-black font-black text-2xl rounded-2xl shadow-xl hover:scale-105 transition-all uppercase italic">連携を開始する</Button>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="sticky top-0 z-[50] pt-4 pb-2 bg-[#050507]/80 backdrop-blur-md space-y-2">
            <Button onClick={() => fetchEmails(googleToken)} disabled={loading} className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white font-black text-xl rounded-2xl shadow-[0_10px_30px_rgba(37,99,235,0.4)] transition-all active:scale-95 italic relative z-[51]">
              {loading ? <Loader2 className="animate-spin h-6 w-6 mr-2" /> : <RotateCw className="h-6 w-6 mr-2" />}
              最新メールを解析
            </Button>
            <div className="grid grid-cols-4 gap-2">
              {quadrants.map(q => (
                <div key={q.id} className="bg-black/60 backdrop-blur-md border border-white/5 p-2 rounded-xl text-center">
                  <q.icon className={`h-4 w-4 mx-auto mb-1 ${q.color}`} />
                  <div className="text-[10px] font-black text-white italic">{emails.filter(e => e.quadrant === q.id).length}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {emails.length === 0 && !loading ? (
              <div className="py-20 text-center opacity-20 italic font-black uppercase text-xl">Inbox Zero Achieved</div>
            ) : (
              emails.map((email) => (
                <Card key={email.id} className="bg-[#13141f] border-2 border-white/5 rounded-2xl overflow-hidden shadow-xl transition-all hover:border-blue-500/30">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[8px] font-black text-blue-400 border-blue-400/30 uppercase tracking-tighter">New</Badge>
                          <span className="text-[9px] font-black text-slate-500 truncate italic">{email.from}</span>
                        </div>
                        <h4 className="text-base font-black text-white leading-tight truncate italic">{email.subject}</h4>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setExpandedId(expandedId === email.id ? null : email.id)} className="h-8 w-8 p-0 text-slate-500">
                        {expandedId === email.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </Button>
                    </div>

                    {expandedId === email.id && (
                      <div className="animate-in slide-in-from-top-2 duration-300">
                        <div className="bg-black/40 rounded-xl p-4 text-sm text-slate-300 leading-relaxed italic whitespace-pre-wrap border border-white/5 mb-4 max-h-60 overflow-y-auto">
                          {email.body}
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      {!replyTexts[email.id] ? (
                        <Button 
                          onClick={() => generateAiReply(email)} 
                          disabled={isGenerating[email.id]}
                          className="w-full h-12 bg-white/5 hover:bg-white/10 text-emerald-400 border border-emerald-500/30 font-black text-xs rounded-xl transition-all uppercase italic"
                        >
                          {isGenerating[email.id] ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Zap size={14} className="mr-2" />}
                          AI返信案を生成
                        </Button>
                      ) : (
                        <div className="space-y-3 animate-in fade-in duration-500">
                          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                            <p className="text-xs text-emerald-400 font-black mb-2 uppercase italic flex items-center gap-2">
                              <ShieldCheck size={12} /> AI Draft Output
                            </p>
                            <p className="text-sm text-white italic leading-relaxed">{replyTexts[email.id]}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Button onClick={() => { navigator.clipboard.writeText(replyTexts[email.id]); alert('コピーしました'); }} className="bg-slate-800 hover:bg-slate-700 text-white font-black text-[10px] rounded-lg h-10">
                              <Copy size={12} className="mr-2" /> COPY
                            </Button>
                            <Button onClick={() => saveDraft(email)} disabled={isDrafting[email.id]} className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] rounded-lg h-10">
                              {isDrafting[email.id] ? <Loader2 className="animate-spin h-3 w-3" /> : <Send size={12} className="mr-2" />} DRAFT
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

          <Button onClick={() => { localStorage.removeItem('nextra_google_token'); setGoogleToken(null); }} variant="ghost" className="w-full text-slate-600 hover:text-red-400 text-[10px] font-black uppercase italic py-8">
            <Trash2 size={12} className="mr-2" /> Terminate Session
          </Button>
        </div>
      )}
    </div>
  );
};

const NoSSRWrapper = dynamic(() => Promise.resolve(MasterEngine), { ssr: false });

export default function InboxOrganizer() {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 font-sans p-4 pb-20 selection:bg-emerald-500/30">
      <div className="text-center mb-6">
        <Badge variant="outline" className="border-blue-500/30 text-blue-400 font-black italic px-4 py-0.5 text-[8px] uppercase tracking-widest mb-2 shadow-lg">Nextra Intelligence MASTER</Badge>
        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Gmail AI Accelerator</h1>
      </div>
      <NoSSRWrapper />
    </div>
  );
}
