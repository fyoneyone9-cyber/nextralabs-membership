'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'

// ==================== Constants ====================
const GOOGLE_CLIENT_ID = '239583936801-ev71grs66ehp0kn3kahr2bdrl0v9iidj.apps.googleusercontent.com'
const GOOGLE_SCOPES = 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.compose'

// ==================== Client Side Engine ====================
const MasterEngine = () => {
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({});
  const [isDrafting, setIsDrafting] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<Record<string, boolean>>({});

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
    setScanning(true);
    try {
      const res = await fetch('/api/tools/gmail-fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: token }),
      });
      const data = await res.json();
      if (data.messages) setEmails(data.messages);
    } catch (e) { 
      console.error('[FETCH_ERR]', e); 
    } finally { 
      setLoading(false);
      setTimeout(() => setScanning(false), 500);
    }
  };

  const generateAiReply = async (email: any) => {
    setActiveReplyId(email.id);
    setIsGenerating(prev => ({ ...prev, [email.id]: true }));
    try {
      const res = await fetch('/api/tools/gmail-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: email.subject, from: email.from, body: email.body }),
      });
      const data = await res.json();
      setReplyTexts(prev => ({ ...prev, [email.id]: data.reply }));
    } catch (e) { 
      console.error(e); 
    } finally { 
      setIsGenerating(prev => ({ ...prev, [email.id]: false }));
    }
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
    } catch (e) { 
      console.error(e); 
    } finally { 
      setIsDrafting(prev => ({ ...prev, [email.id]: false }));
    }
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

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-slate-950 text-left">
      <div className="text-center space-y-3">
        <div className="inline-block bg-blue-600 text-white font-black italic tracking-widest px-6 py-1 text-[10px] uppercase rounded-full shadow-lg border border-white/20">Nextra Intelligence v4.2-MASTER</div>
        <h1 className="text-5xl md:text-[8rem] font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">Inbox Zero</h1>
      </div>

      {!googleToken ? (
        <div className="bg-[#13141f] border-2 border-white/5 rounded-[3rem] p-12 md:p-24 text-center space-y-10 shadow-2xl relative overflow-hidden animate-in zoom-in-95">
           <div className="w-32 h-32 bg-blue-600/10 rounded-[2.5rem] flex items-center justify-center mx-auto border-2 border-blue-500/30">
              <div className="w-16 h-16 bg-blue-500 rounded-full animate-pulse" />
           </div>
           <button onClick={login} className="h-24 bg-white text-black hover:bg-blue-600 hover:text-white font-black px-16 rounded-[2rem] text-3xl uppercase italic shadow-2xl transition-all active:scale-95">
              Connect Gmail ↗
           </button>
        </div>
      ) : (
        <div className="space-y-12 animate-in fade-in duration-700 max-w-4xl mx-auto">
          <div className="flex items-center justify-between px-4">
             <div className="text-slate-500 font-black italic uppercase text-xs tracking-[0.3em]">Live Mail Feed</div>
             <button onClick={() => fetchEmails(googleToken)} className="text-[10px] font-black text-blue-500 underline uppercase tracking-widest hover:text-white">Refresh Feed</button>
          </div>

          <div className="space-y-6">
             {loading || scanning ? (
                Array(2).fill(0).map((_, i) => <div key={i} className="h-40 bg-black border border-white/5 rounded-[2.5rem] animate-pulse" />)
             ) : emails.length > 0 ? (
                emails.map((email, i) => (
                  <div key={i} className="bg-black border border-white/10 rounded-[2.5rem] p-10 hover:border-blue-500/50 transition-all group shadow-xl relative overflow-hidden">
                     <div className="flex flex-col text-left space-y-2">
                        <div className="text-[10px] font-black text-blue-500 uppercase italic tracking-wider flex items-center gap-2">
                           <span className="opacity-50">BY:</span> {email.from}
                        </div>
                        <h4 className="text-2xl md:text-3xl font-black text-white italic leading-tight mb-4 tracking-tighter">{email.subject}</h4>
                        <div className="text-sm text-slate-400 font-bold leading-relaxed italic mb-6">このメールはHTMLメールです</div>
                        <button onClick={() => setExpandedId(expandedId === email.id ? null : email.id)} className="text-blue-500 text-[10px] font-black uppercase hover:underline mb-8 self-center">
                           READ FULL
                        </button>
                     </div>

                     <div className="flex flex-col gap-6 items-start">
                        {/* 🚀 AI生成ボタン: スクショの白ボタン */}
                        <button 
                          onClick={() => generateAiReply(email)} 
                          className="h-14 bg-white text-black font-black italic text-sm rounded-xl px-10 hover:bg-blue-600 hover:text-white transition-all shadow-xl uppercase"
                        >
                           AI返信ドラフトを生成
                        </button>

                        {/* 🚀 以前の完璧だった AI OUTPUT エリアを完全再現 */}
                        <div className="w-full bg-[#0a0b14] rounded-[2.5rem] p-10 border border-blue-600/20 shadow-inner relative group/output">
                           <div className="text-blue-500 font-black italic uppercase text-[10px] tracking-[0.2em] mb-8">AI OUTPUT</div>
                           
                           <div className="min-h-[100px] mb-8">
                             {isGenerating[email.id] ? (
                               <div className="text-slate-600 italic animate-pulse">Analyzing context & drafting reply...</div>
                             ) : (
                               <pre className="text-base text-slate-200 whitespace-pre-wrap font-sans italic leading-relaxed">
                                 {replyTexts[email.id] || " "}
                               </pre>
                             )}
                           </div>

                           <div className="flex gap-4">
                              <button 
                                onClick={() => { navigator.clipboard.writeText(replyTexts[email.id]); }}
                                className="h-14 bg-blue-600 hover:bg-blue-500 text-white font-black italic rounded-xl px-10 shadow-lg transition-all active:scale-95"
                              >
                                 Copy Draft
                              </button>
                              {replyTexts[email.id] && (
                                <button 
                                  onClick={() => saveDraft(email)}
                                  disabled={isDrafting[email.id]}
                                  className="h-14 bg-white/5 hover:bg-white/10 text-slate-400 font-black italic rounded-xl px-10 border border-white/10 transition-all"
                                >
                                   {isDrafting[email.id] ? 'Saving...' : 'Gmail下書きに保存'}
                                </button>
                              )}
                           </div>
                           
                           <button className="absolute top-6 right-8 text-slate-700 hover:text-white transition-colors"><X size={20}/></button>
                        </div>
                     </div>
                  </div>
                ))
             ) : (
                <div className="h-96 flex flex-col items-center justify-center opacity-20 italic font-black uppercase tracking-widest text-xl">Inbox Zero Achieved</div>
             )}
          </div>
          <button onClick={() => { localStorage.removeItem('nextra_google_token'); setGoogleToken(null); }} className="block mx-auto text-slate-700 hover:text-red-500 text-[10px] font-black uppercase italic underline tracking-widest">Terminate Session</button>
        </div>
      )}
    </div>
  );
};

const NoSSRWrapper = dynamic(() => Promise.resolve(MasterEngine), { ssr: false });

import { DebugPanel } from '@/components/tools/DebugPanel'
import { X } from 'lucide-react'

export default function InboxOrganizer() {
  return (
    <div className="min-h-screen bg-[#050507] text-gray-100 font-sans p-4 md:p-10 pb-32 overflow-x-hidden">
      <NoSSRWrapper />
      <DebugPanel data={{ system: "master-restored" }} toolId="inbox-zero-master" />
    </div>
  );
}
