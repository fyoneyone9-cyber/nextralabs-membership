"use client";

import React, { useState } from 'react';
import { Heart, ShoppingBag, Sparkles, Send, User, Target, CheckCircle2 } from 'lucide-react';

const NEXTRA_EMERALD = '#10b981';
const SUPABASE_URL = 'https://ugohrqhcnadrpwcnutzl.supabase.co/functions/v1/super-action';

export default function AIKonkatsuApp() {
  const [profile, setProfile] = useState('');
  const [goals, setGoals] = useState('');
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  // ビルドエラーの原因だった定義をここに配置
  const traitsList = ['真面目', '聞き上手', '楽観的', '慎重派', 'アクティブ', '穏やか'];
  const prioritiesList = ['価値観の一致', '経済力・安定', '趣味の共有', '家事育児協力', '外見・清潔感'];

  const toggleTrait = (trait: string) => {
    setSelectedTraits(prev => prev.includes(trait) ? prev.filter(t => t !== trait) : [...prev, trait]);
  };

  const togglePriority = (p: string) => {
    setSelectedPriorities(prev => prev.includes(p) ? prev.filter(i => i !== p) : [...prev, p]);
  };

  const handleDiagnose = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch(SUPABASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: profile, goals: goals,
          traits: selectedTraits.join(', '),
          priorities: selectedPriorities.join(', ')
        }),
      });
      const data = await response.json();
      
      if (data.error) {
        alert("AIエラー: " + data.error);
        return;
      }

      const aiText = data.text;
      const match = aiText.match(/\[CATEGORY_START\]([\s\S]*?)\[CATEGORY_END\]/);
      if (match) {
        const parts = match[1].split('\n').filter((l: string) => l.trim() !== '');
        setRecommendations([{
          keyword: parts.find((l: string) => l.includes('Keyword'))?.split(': ')[1] || '婚活 清潔感',
          reason: parts.find((l: string) => l.includes('Reason'))?.split(': ')[1] || '成婚率アップのために。'
        }]);
      }
      setResult(aiText.split('[CATEGORY_START]')[0]);
    } catch (e: any) { 
      alert("通信エラー: " + e.message); 
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#020617] p-4 md:p-8 text-slate-200">
      <div className="max-w-2xl mx-auto bg-[#0f172a] rounded-[2.5rem] shadow-[0_0_50px_rgba(16,185,129,0.1)] border-[4px]" style={{borderColor: NEXTRA_EMERALD}}>
        <div className="p-8 text-center border-b border-slate-800 bg-gradient-to-b from-[#111827] to-[#0f172a] rounded-t-[2.2rem]">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-700">
            <Heart className="w-8 h-8 text-emerald-500 fill-emerald-500/10" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">AI婚活戦略コンサル</h1>
          <p className="text-emerald-500 font-bold mt-1 tracking-widest text-xs uppercase">Master Model v1.1</p>
        </div>

        <div className="p-8 space-y-10">
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider">
              <User className="w-4 h-4 text-emerald-500" /> あなたの性格
            </label>
            <div className="grid grid-cols-3 gap-2">
              {traitsList.map(t => (
                <button key={t} onClick={() => toggleTrait(t)} className={`py-3 rounded-xl text-xs font-bold border-2 transition-all ${selectedTraits.includes(t) ? 'bg-emerald-500 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'}`}>{t}</button>
              ))}
            </div>
            <textarea className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 outline-none text-sm h-24 focus:border-emerald-500 transition-colors text-slate-300" placeholder="具体的な性格や職業などを入力..." value={profile} onChange={(e) => setProfile(e.target.value)} />
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider">
              <Target className="w-4 h-4 text-emerald-500" /> お相手に求めるもの
            </label>
            <div className="grid grid-cols-2 gap-2">
              {prioritiesList.map(p => (
                <button key={p} onClick={() => togglePriority(p)} className={`py-3 px-4 rounded-xl text-xs font-bold border-2 flex justify-between items-center transition-all ${selectedPriorities.includes(p) ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>{p} {selectedPriorities.includes(p) && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}</button>
              ))}
            </div>
          </div>

          <button onClick={handleDiagnose} disabled={loading} className="w-full py-6 bg-emerald-500 text-white rounded-[1.5rem] font-black text-xl hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50">
            {loading ? <Sparkles className="animate-spin" /> : <Send />} {loading ? '分析中...' : '診断を開始する'}
          </button>

          {result && (
            <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-8 bg-slate-900/50 rounded-[2rem] border border-slate-800">
                <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap font-medium leading-relaxed">
                  {result}
                </div>
              </div>
              
              {recommendations.length > 0 && (
                <div className="bg-slate-900 p-6 rounded-2xl border-2 border-orange-500/20 shadow-xl">
                  <div className="flex items-center gap-2 mb-4 text-orange-500 font-black text-sm uppercase tracking-tighter"><ShoppingBag className="w-5 h-5" /> AI Recommended Item</div>
                  <p className="font-black text-white text-lg mb-1">{recommendations[0].keyword}</p>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">{recommendations[0].reason}</p>
                  <a href={`https://www.amazon.co.jp/s?k=${encodeURIComponent(recommendations[0].keyword)}&tag=your-tag-22`} target="_blank" className="block w-full py-4 bg-[#FF9900] text-white rounded-xl font-bold text-center hover:bg-orange-600 shadow-lg transition-all">Amazonでチェック</a>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="p-6 bg-slate-900/50 text-center text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em] rounded-b-[2.2rem]">© 2026 NEXTRALABS | MASTER MODEL CERTIFIED</div>
      </div>
    </div>
  );
}
