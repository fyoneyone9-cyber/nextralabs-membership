'use client'
import React, { useState, useEffect } from 'react'

/**
 * 🛠️ AI Sidejob Engine v1.1-STABLE
 * SSR完全排除・依存関係をネイティブ要素に純化。
 */

export default function AiSidejob() {
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState('audit');
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [roadmapInput, setRoadmapInput] = useState('');
  const [roadmapResult, setRoadmapResult] = useState('');
  const [price, setPrice] = useState(5000);
  const [count, setCount] = useState(10);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const QUESTIONS = [
    "コツコツと文章を書くのが苦ではない",
    "デザインや美しいものを作るのが好きだ",
    "SNSで発信することに抵抗がない",
    "プログラミングやITツールを触るのが好きだ",
    "人の悩みを聞いて解決策を考えるのが得意だ"
  ];

  const getAuditPrompt = () => {
    const selected = QUESTIONS.filter((_, i) => answers[i]).join('\n・');
    return `あなたはプロの副業コンサルタントです。以下の私の特性に基づき、私に最適な「AIを活用した副業」を3つ提案してください。

【私の特性】
・${selected || "特になし（初心者）"}

各提案には以下の項目を含めてください：
1. 副業名
2. なぜ私に向いているか
3. 推定月収の目安
4. 最初にやるべき一歩`;
  };

  if (!isClient) return <div className="min-h-screen bg-[#050507]" />;

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans p-4 md:p-10 text-left">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h1 className="text-6xl md:text-[8rem] font-black text-white uppercase italic tracking-tighter leading-none">AI SIDEJOB</h1>
          <div className="inline-block bg-[#5845e0] text-white font-black px-10 py-2 rounded-full uppercase italic text-sm tracking-widest shadow-2xl">MASTER v2.0</div>
        </div>

        {/* 🛡️ 完璧なガイド UI */}
        <div className="bg-[#13141f] border border-white/5 rounded-3xl p-8 max-w-4xl mx-auto flex items-start gap-6 shadow-inner">
          <div className="w-10 h-10 rounded-full border border-[#5845e0]/30 flex items-center justify-center shrink-0 text-[#5845e0] font-bold">!</div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-[#5845e0]/70 uppercase tracking-[0.2em] italic mb-2">How to Use</p>
            <div className="space-y-1 text-xs md:text-sm font-bold text-slate-400">
              <p className="flex items-center gap-3"><span className="text-[#5845e0] italic">#1</span> 適性診断で自分に合う項目にチェックを入れる</p>
              <p className="flex items-center gap-3"><span className="text-[#5845e0] italic">#2</span> 「指示をコピー」して、下のAIボタンからChatGPT等に聞く</p>
              <p className="flex items-center gap-3"><span className="text-[#5845e0] italic">#3</span> 提案された副業が決まったら、②ロードマップへ進む</p>
            </div>
          </div>
        </div>

        {/* 🛠️ TAB NAVIGATION (RAW HTML) */}
        <div className="flex gap-1 bg-[#1a1b26]/50 p-1 rounded-2xl border border-white/5 max-w-4xl mx-auto">
          {[
            { id: 'audit', label: '① 適性診断' },
            { id: 'roadmap', label: '② ロードマップ' },
            { id: 'calc', label: '③ 収益計算' },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-4 px-2 rounded-xl font-black text-xs md:text-sm uppercase italic transition-all ${activeTab === tab.id ? 'bg-[#5845e0] text-white shadow-xl' : 'text-slate-500'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-4 max-w-5xl mx-auto">
          {activeTab === 'audit' && (
            <div className="bg-[#13141f] border border-white/10 rounded-[3rem] p-10 md:p-16 shadow-2xl relative animate-in fade-in">
              <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase text-center mb-12">🎯 副業適性診断</h2>
              <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-4">
                  {QUESTIONS.map((q, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-[#0a0b14] border border-white/5 rounded-2xl cursor-pointer hover:border-[#5845e0]/50 transition-all" onClick={() => setAnswers(prev => ({...prev, [i]: !prev[i]}))}>
                      <span className="font-bold text-slate-300">{q}</span>
                      <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center ${answers[i] ? 'bg-[#5845e0] border-white' : 'border-white/10'}`}>
                        {answers[i] && <span className="text-white font-bold">✓</span>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-[#0a0b14] rounded-[2.5rem] p-10 border border-white/5 flex flex-col items-center justify-center space-y-8 shadow-inner">
                   <div className="text-center space-y-2">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Ready to Analyze</p>
                      <p className="text-slate-400 text-xs font-bold italic">チェックを入れたら、下のボタンでプロンプトを取得してください</p>
                   </div>
                   <button onClick={() => handleCopy(getAuditPrompt())} className={`w-full h-24 text-2xl font-black rounded-3xl transition-all shadow-2xl border-b-4 ${copied ? 'bg-emerald-500 border-emerald-700 scale-95' : 'bg-[#5845e0] border-[#3e2fb1] hover:bg-[#6c5ae6]'}`}>
                      {copied ? '✅ COPY COMPLETE' : '診断指示をコピー'}
                   </button>
                   <div className="grid grid-cols-3 gap-3 w-full">
                      {['CHATGPT', 'GEMINI', 'CLAUDE'].map(ai => (
                        <button 
                          key={ai} 
                          onClick={() => window.open(ai === 'CHATGPT' ? 'https://chatgpt.com' : ai === 'GEMINI' ? 'https://gemini.google.com' : 'https://claude.ai', '_blank')} 
                          className="h-14 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-500 hover:text-white hover:border-white/20 transition-all uppercase italic"
                        >
                          {ai}
                        </button>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="bg-[#13141f] border border-white/10 rounded-[3rem] p-10 md:p-16 animate-in fade-in space-y-10">
              <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase text-center mb-12">🚀 0→1ロードマップ</h2>
              
              <div className="bg-[#0a0b14] border border-white/5 rounded-3xl p-8 flex items-center gap-6 shadow-inner">
                 <div className="text-3xl">📝</div>
                 <div>
                    <p className="text-[10px] font-black text-[#5845e0] uppercase italic">Step Guide</p>
                    <p className="text-sm font-bold text-slate-400 italic">選んだ副業名を下に入力して、実行手順（ロードマップ）を作成しましょう</p>
                 </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-12 text-left">
                 <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase px-4 italic">① 希望する副業またはAIからの提案</p>
                    <textarea value={roadmapInput} onChange={(e) => setRoadmapInput(e.target.value)} placeholder="例: AI美女画像生成によるSNS運用代行" className="w-full h-64 bg-[#0a0b14] border border-white/10 rounded-[2.5rem] p-8 text-white outline-none focus:border-[#5845e0] shadow-inner leading-relaxed" />
                    <button 
                      onClick={() => handleCopy(`「${roadmapInput}」という副業で月10万円稼ぐための、初心者向け「0→1ロードマップ」を作成してください。いつ、何を、どのツールを使ってやればいいか具体的にステップバイステップで教えて。`)}
                      className={`w-full h-20 text-xl font-black rounded-2xl transition-all shadow-xl ${copied ? 'bg-emerald-500' : 'bg-[#5845e0]'} text-white`}
                    >
                      {copied ? '✅ COPY COMPLETE' : 'ロードマップ作成指示をコピー'}
                    </button>
                 </div>
                 <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase px-4 italic">② AIからのロードマップを保存</p>
                    <textarea value={roadmapResult} onChange={(e) => setRoadmapResult(e.target.value)} placeholder="AIが教えてくれた具体的な手順をここに貼り付けて、いつでも確認できるようにしましょう..." className="w-full h-[344px] bg-[#0a0b14] border border-white/10 rounded-[2.5rem] p-8 text-slate-400 outline-none shadow-inner leading-relaxed italic" />
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'calc' && (
            <div className="bg-[#13141f] border border-white/10 rounded-[3rem] p-10 md:p-16 animate-in fade-in">
              <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase text-center mb-12">💰 収益シミュレーター</h2>
              <div className="max-w-md mx-auto space-y-10">
                 <div className="space-y-4">
                    <div className="flex justify-between text-xs font-black text-slate-500"><span>単価: ¥{price.toLocaleString()}</span></div>
                    <input type="range" min="1000" max="50000" step="500" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full h-2 bg-white/10 rounded-full appearance-none accent-[#5845e0]" />
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between text-xs font-black text-slate-500"><span>件数: {count} 件</span></div>
                    <input type="range" min="1" max="100" step="1" value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full h-2 bg-white/10 rounded-full appearance-none accent-[#5845e0]" />
                 </div>
                 <div className="bg-[#0a0b14] p-10 rounded-[2.5rem] border border-white/5 text-center">
                    <p className="text-[10px] font-black text-slate-600 mb-2 uppercase">Monthly Income</p>
                    <p className="text-6xl font-black text-white italic">¥{(price * count).toLocaleString()}</p>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
