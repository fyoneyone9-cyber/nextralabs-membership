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

  const trashEmail = async (id: string) => {
    if (!confirm('このメールをゴミ箱に移動しますか？')) return;
    setLoading(true);
    try {
      const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}/trash`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${googleToken}` },
      });
      if (res.ok) {
        setEmails(prev => prev.filter(e => e.id !== id));
      } else {
        const err = await res.json();
        alert('エラー: ' + (err.error?.message || '削除に失敗しました'));
      }
    } catch (e) {
      console.error(e);
      alert('通信エラーが発生しました');
    } finally {
      setLoading(false);
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

  const quadrants = [
    { id: 'urgent_important', label: '🔥 今すぐ対応', color: 'border-red-600 text-red-500 bg-red-600/5', icon: 'Zap' },
    { id: 'urgent_not_important', label: '⚡ 早めに対応', color: 'border-amber-500 text-amber-500 bg-amber-500/5', icon: 'Clock' },
    { id: 'not_urgent_important', label: '📌 計画して対応', color: 'border-blue-500 text-blue-500 bg-blue-500/5', icon: 'ListChecks' },
    { id: 'not_urgent_not_important', label: '📂 後回し/ゴミ箱', color: 'border-slate-800 text-slate-500 bg-slate-900/50', icon: 'Filter' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-slate-950 text-left">
      <div className="text-center space-y-3">
        <div className="inline-block bg-blue-600 text-white font-black italic tracking-widest px-6 py-1 text-[10px] uppercase rounded-full shadow-lg border border-white/20">Nextra Intelligence v5.0-MASTER</div>
        <h1 className="text-5xl md:text-[8rem] font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">Inbox Zero</h1>
      </div>

      {!googleToken ? (
        <div className="bg-[#13141f] border-2 border-white/5 rounded-[3rem] p-12 md:p-24 text-center space-y-10 shadow-2xl relative overflow-hidden animate-in zoom-in-95">
           <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600" />
           <div className="w-32 h-32 bg-blue-600/10 rounded-[2.5rem] flex items-center justify-center mx-auto border-2 border-blue-500/30 shadow-[0_0_50px_rgba(37,99,235,0.2)]">
              <div className="w-16 h-16 bg-blue-500 rounded-full animate-pulse" />
           </div>
           <button onClick={login} className="h-24 bg-white text-black hover:bg-blue-600 hover:text-white font-black px-16 rounded-[2rem] text-3xl uppercase italic shadow-2xl transition-all active:scale-95">
              Connect Gmail ↗
           </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in duration-700">
          {/* 🛡️ LEFT: CONTROL TERMINAL */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden h-fit">
               <div className="flex items-center justify-between mb-8">
                  <div className="text-blue-500 font-black italic tracking-widest text-xs uppercase flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping" /> Scanning Engine
                  </div>
                  <div className="text-[10px] border border-green-500/30 text-green-500 px-2 py-0.5 rounded font-black italic uppercase animate-pulse">Live Link</div>
               </div>
               
               <button onClick={() => fetchEmails(googleToken)} disabled={loading} className="w-full h-20 bg-blue-600 hover:bg-blue-500 text-white font-black text-xl rounded-2xl shadow-lg flex items-center justify-center gap-4 transition-all active:scale-95 italic">
                  最新メールを解析
               </button>

               <div className="mt-8 space-y-4">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2 italic">Analysis Stats</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black p-4 rounded-2xl border border-white/5 text-center shadow-inner">
                       <p className="text-[9px] font-bold text-slate-600 uppercase">Fetched</p>
                       <p className="text-2xl font-black text-white italic">{emails.length}</p>
                    </div>
                    <div className="bg-black p-4 rounded-2xl border border-white/5 text-center shadow-inner">
                       <p className="text-[9px] font-bold text-slate-600 uppercase">AI Sorted</p>
                       <p className="text-2xl font-black text-blue-500 italic">{emails.length > 0 ? '100%' : '0%'}</p>
                    </div>
                  </div>
               </div>

               <button onClick={() => { localStorage.removeItem('nextra_google_token'); setGoogleToken(null); }} className="w-full mt-8 text-slate-700 hover:text-red-500 text-[10px] font-black uppercase italic underline tracking-widest">Terminate Session</button>
            </div>
          </div>

          {/* 🔥 RIGHT: MESSAGE FEED (THE MATRIX) */}
          <div className="lg:col-span-2 space-y-8">
             <div className="grid grid-cols-2 gap-4">
                {quadrants.map(q => (
                  <div key={q.id} className={`p-4 rounded-2xl border-2 flex items-center justify-between shadow-lg transition-all hover:scale-[1.02] ${q.color}`}>
                     <span className="text-[10px] font-black uppercase italic tracking-wider">{q.label}</span>
                     <span className="text-xl font-black italic">{loading ? '...' : emails.filter(e => e.quadrant === q.id).length}</span>
                  </div>
                ))}
             </div>

             <div className="bg-[#13141f] border-2 border-white/5 rounded-[3rem] p-10 min-h-[600px] shadow-2xl space-y-6">
                <div className="flex items-center justify-between">
                   <div className="text-slate-500 font-black italic uppercase text-xs tracking-[0.3em]">Live Mail Feed</div>
                   <button onClick={() => fetchEmails(googleToken)} className="text-[10px] font-black text-blue-500 underline uppercase tracking-widest hover:text-white">Refresh Feed</button>
                </div>

                <div className="space-y-4">
                   {loading || scanning ? (
                      Array(2).fill(0).map((_, i) => <div key={i} className="h-40 bg-black border border-white/5 rounded-[2.5rem] animate-pulse" />)
                   ) : emails.length > 0 ? (
                      emails.map((email, i) => (
                        <div key={i} className="bg-black border border-white/10 rounded-[2.5rem] p-10 hover:border-blue-500/50 transition-all group shadow-xl relative overflow-hidden text-left">
                           <div className="flex flex-col space-y-2 mb-8">
                              <div className="text-[10px] font-black text-blue-500 uppercase italic tracking-wider">
                                 <span className="opacity-50">BY:</span> {email.from}
                              </div>
                              <h4 className="text-3xl font-black text-white italic leading-tight tracking-tighter">{email.subject}</h4>
                              <div className="text-sm text-slate-400 font-bold leading-relaxed italic opacity-70">このメールはHTMLメールです</div>
                              <div className="flex items-center gap-6 mt-6">
                                <button 
                                  onClick={() => setExpandedId(expandedId === email.id ? null : email.id)} 
                                  className="h-12 bg-white/10 border border-white/20 px-8 rounded-xl text-white text-sm font-black uppercase hover:bg-white/20 transition-all flex items-center gap-2"
                                >
                                   📄 {expandedId === email.id ? 'CLOSE CONTENT' : 'READ FULL CONTENT'}
                                </button>
                                <button 
                                  onClick={() => trashEmail(email.id)} 
                                  className="h-12 bg-red-600/20 border border-red-500/30 px-8 rounded-xl text-red-500 text-sm font-black uppercase hover:bg-red-600 hover:text-white transition-all flex items-center gap-2"
                                >
                                   🗑️ TRASH
                                </button>
                              </div>
                              {expandedId === email.id && (
                                <div className="mt-6 p-10 bg-slate-900 border-2 border-white/10 rounded-[2.5rem] text-slate-200 text-lg italic border border-white/5 animate-in slide-in-from-top-4 shadow-inner leading-relaxed overflow-x-auto whitespace-pre-wrap">
                                   <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Full Message Source</div>
                                   {email.body}
                                </div>
                              )}
                           </div>

                           <div className="flex flex-col gap-8 items-start">
                              <button 
                                onClick={() => generateAiReply(email)} 
                                className="h-20 w-full md:w-auto bg-white text-black hover:bg-blue-600 hover:text-white font-black italic text-xl rounded-2xl px-16 shadow-2xl transition-all uppercase active:scale-95 border-b-4 border-slate-300 active:border-b-0"
                              >
                                 AI返信ドラフトを自動生成 🚀
                              </button>

                              <div className="w-full bg-[#0a0b14] rounded-[3rem] p-12 border-2 border-blue-600/30 shadow-[0_0_50px_rgba(37,99,235,0.1)] relative">
                                 <div className="text-blue-500 font-black italic uppercase text-xs tracking-[0.4em] mb-10 flex items-center gap-4">
                                    <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" /> AI INTELLIGENCE OUTPUT
                                 </div>
                                 
                                 <div className="min-h-[200px] mb-10">
                                   {isGenerating[email.id] ? (
                                     <div className="text-blue-400 text-xl italic animate-pulse font-black uppercase">Analyzing context & deep drafting...</div>
                                   ) : (
                                     <div className="text-2xl text-white whitespace-pre-wrap font-sans italic leading-loose tracking-tight bg-white/5 p-10 rounded-[2rem] border border-white/5 shadow-inner">
                                       {replyTexts[email.id] || "生成ボタンを押すと、ここにNextra Intelligenceによる最適な返信案が表示されます。"}
                                     </div>
                                   )}
                                 </div>

                                 <div className="flex flex-wrap gap-4">
                                    {replyTexts[email.id] ? (
                                      <>
                                        <button 
                                          onClick={() => { navigator.clipboard.writeText(replyTexts[email.id]); alert('クリップボードにコピーしました'); }}
                                          className="h-14 bg-blue-600 hover:bg-blue-500 text-white font-black italic rounded-xl px-10 shadow-lg transition-all active:scale-95"
                                        >
                                           Copy Draft
                                        </button>
                                        
                                        <button 
                                          onClick={() => saveDraft(email)}
                                          disabled={isDrafting[email.id]}
                                          className="h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-black italic rounded-xl px-10 shadow-lg transition-all flex items-center gap-2 active:scale-95"
                                        >
                                           {isDrafting[email.id] ? 'Saving...' : 'Gmail下書きに保存'}
                                        </button>
                                      </>
                                    ) : (
                                      <div className="flex flex-wrap gap-4 w-full">
                                        <button 
                                          onClick={() => {
                                            const prompt = `以下のメールへの返信案を作成してください。\n\n件名: ${email.subject}\n差出人: ${email.from}\n内容: ${email.body}`;
                                            navigator.clipboard.writeText(prompt);
                                            alert('外部AI用のプロンプトをコピーしました。下のボタンからお好きなAIを開いて貼り付けてください。');
                                          }}
                                          className="h-14 bg-amber-600 hover:bg-amber-500 text-white font-black italic rounded-xl px-10 shadow-lg transition-all active:scale-95"
                                        >
                                           外部AI用プロンプトをコピー
                                        </button>
                                        <div className="grid grid-cols-3 gap-2 flex-1">
                                          {['ChatGPT', 'Gemini', 'Claude'].map(ai => (
                                            <button 
                                              key={ai}
                                              onClick={() => window.open(ai === 'ChatGPT' ? 'https://chatgpt.com' : ai === 'Gemini' ? 'https://gemini.google.com' : 'https://claude.ai', '_blank')}
                                              className="h-14 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-500 hover:text-white uppercase transition-all"
                                            >
                                              {ai}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    <a 
                                      href={`https://mail.google.com/mail/u/0/#search/${encodeURIComponent(email.from)}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="h-14 bg-white/5 hover:bg-white/10 text-slate-400 font-black italic rounded-xl px-10 border border-white/10 transition-all flex items-center justify-center uppercase"
                                    >
                                       Open Gmail ↗
                                    </a>
                                 </div>
                              </div>
                           </div>
                        </div>
                      ))
                   ) : (
                      <div className="h-96 flex flex-col items-center justify-center opacity-20 italic font-black uppercase tracking-widest text-xl">Inbox Zero Achieved</div>
                   )}
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const NoSSRWrapper = dynamic(() => Promise.resolve(MasterEngine), { ssr: false });

import { DebugPanel } from '@/components/tools/DebugPanel'

export default function InboxOrganizer() {
  return (
    <div className="min-h-screen bg-[#050507] text-gray-100 font-sans p-4 md:p-10 pb-32 overflow-x-hidden">
      <NoSSRWrapper />
      <DebugPanel data={{ status: "v4.3-stable" }} toolId="inbox-zero-master" />
    </div>
  );
}
