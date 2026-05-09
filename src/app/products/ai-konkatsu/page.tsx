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

  const traits = ['真面目', '聞き上手', '楽観的', '慎重派', 'アクティブ', '穏やか'];
  const priorities = ['価値観の一致', '経済力・安定', '趣味の共有', '家事育児協力', '外見・清潔感'];

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
          profile: profile,
          goals: goals,
          traits: selectedTraits.join(', '),
          priorities: selectedPriorities.join(', ')
        }),
      });

      const data = await response.json();
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
    } catch (e) {
      alert("エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-[2.5rem] shadow-2xl border-[6px]" style={{borderColor: NEXTRA_EMERALD}}>
        <div className="p-8 text-center border-b border-gray-50 bg-gradient-to-b from-emerald-50 to-white rounded-t-[2.1rem]">
          <Heart className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <h1 className="text-3xl font-black text-gray-900">AI婚活戦略コンサル</h1>
          <p className="text-emerald-600 font-bold mt-1 tracking-widest text-xs uppercase">Master Model v1.1</p>
        </div>

        <div className="p-8 space-y-10">
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-black text-gray-700 uppercase">
              <User className="w-4 h-4 text-emerald-500" /> あなたの性格
            </label>
            <div className="grid grid-cols-3 gap-2">
              {traits.map(t => (
                <button key={t} onClick={() => toggleTrait(t)} className={`py-3 rounded-xl text-xs font-bold border-2 transition-all ${selectedTraits.includes(t) ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg scale-[1.05]' : 'bg-white border-gray-100 text-gray-400'}`}>{t}</button>
              ))}
            </div>
            <textarea className="w-full p-4 rounded-xl bg-gray-50 border-none outline-none text-sm h-24" placeholder="具体的な性格や職業などを入力..." value={profile} onChange={(e) => setProfile(e.target.value)} />
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-black text-gray-700 uppercase">
              <Target className="w-4 h-4 text-emerald-500" /> お相手に求めるもの
            </label>
            <div className="grid grid-cols-2 gap-2">
              {priorities.map(p => (
                <button key={p} onClick={() => togglePriority(p)} className={`py-3 px-4 rounded-xl text-xs font-bold border-2 flex justify-between items-center transition-all ${selectedPriorities.includes(p) ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-gray-100 text-gray-400'}`}>{p} {selectedPriorities.includes(p) && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}</button>
              ))}
            </div>
          </div>

          <button onClick={handleDiagnose} disabled={loading} className="w-full py-6 bg-emerald-500 text-white rounded-[1.5rem] font-black text-xl hover:shadow-2xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50">
            {loading ? <Sparkles className="animate-spin" /> : <Send />} {loading ? '分析中...' : '診断を開始する'}
          </button>

          {result && (
            <div className="mt-8 p-8 bg-emerald-50 rounded-[2rem] border border-emerald-100 animate-in fade-in zoom-in duration-500">
              <div className="prose prose-emerald text-gray-700 whitespace-pre-wrap font-medium leading-relaxed mb-8">
                {result}
              </div>
              
              {recommendations.length > 0 && (
                <div className="bg-white p-6 rounded-2xl border-2 border-orange-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-4 text-orange-500 font-black text-sm uppercase"><ShoppingBag className="w-5 h-5" /> AI推奨アイテム</div>
                  <p className="font-black text-gray-900 text-lg mb-1">{recommendations[0].keyword}</p>
                  <p className="text-xs text-gray-500 mb-4 leading-relaxed">{recommendations[0].reason}</p>
                  <a href={`https://www.amazon.co.jp/s?k=${encodeURIComponent(recommendations[0].keyword)}&tag=your-tag-22`} target="_blank" className="block w-full py-4 bg-[#FF9900] text-white rounded-xl font-bold text-center hover:bg-orange-600 shadow-md transition-all">Amazonでチェック</a>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="p-6 bg-gray-50 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">© 2026 NextraLabs | Master Model Certified</div>
      </div>
    </div>
  );
}
