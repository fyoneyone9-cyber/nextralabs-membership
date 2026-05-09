'use client';

import React, { useState } from 'react';
import { Briefcase, Info, ShoppingCart, ShieldCheck } from 'lucide-react';
import { CharacterMake } from '../components/CharacterMake';
import { ResultView } from '../components/ResultView';

export default function AiSidejobApp() {
  const [status, setStatus] = useState<'input' | 'analyzing' | 'result'>('input');
  const [resultData, setResultData] = useState<any>(null);

  const handleComplete = async (userData: any) => {
    setStatus('analyzing');
    
    try {
      // 実際の実装ではここで /api/products/ai-sidejob/generate を呼ぶ
      // 今回はプロトタイプとして、gsk searchの擬似的な結果を含むレスポンスを想定
      const response = await fetch('/api/products/ai-sidejob/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      setResultData(data);
      setStatus('result');
    } catch (error) {
      console.error('Analysis failed:', error);
      // フォールバック（デモ用）
      setTimeout(() => {
        setResultData({
          title: "⚡️ 爆速AIコンテンツライター",
          description: "あなたの『文字入力』スキルと最新のAI需要を掛け合わせた結果、クラウドソーシングでの記事量産が最短ルートと判定されました。",
          roadmap: [
            { title: "クラウドワークス登録", desc: "まずはアカウント作成。自己紹介文にはAI生成の『採用率UPテンプレ』を使用してください。", urgent: true },
            { title: "AI記事作成コンペ応募", desc: "Gemini 2.5 Flashを活用し、15分で1記事を作成。質より量で実績を積みます。", urgent: false },
            { title: "専属契約への移行", desc: "実績が5件貯まったら、継続案件へ交渉。月5万円の安定収益を目指します。", urgent: false }
          ],
          ai_hack: "プロンプトに『読者の悩みを3つ挙げ、それに対する解決策を網羅せよ』と加えるだけで、採用率が40%向上します。",
          platforms: ["CrowdWorks", "Lancers"]
        });
        setStatus('result');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-12 font-sans selection:bg-emerald-500/30 text-left">
      <div className="max-w-5xl mx-auto space-y-10 border-4 border-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.2)] rounded-[3rem] p-6 md:p-12 bg-[#0a0a0c]">
        
        {/* Header: Nextra Standard 'Upper Green' & Lock Status */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-4 border-emerald-500 pb-10 mb-10">
          <div className="flex items-center gap-6">
            <div className="p-5 bg-emerald-500 rounded-3xl shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <Briefcase className="h-10 w-10 text-slate-950" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
                AI副業スタートダッシュ
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                <p className="text-xs font-bold text-emerald-400 tracking-[0.3em] uppercase">
                  MASTERMODEL v2.0-MASTER
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-2 bg-emerald-500 text-slate-950 font-black italic px-8 py-3 text-lg rounded-full shadow-[0_10px_30px_rgba(16,185,129,0.3)]">
              <Lock size={20} />
              PREMIUM UNLOCKED
            </div>
            <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-widest">
              <Ticket size={14} />
              Remaining: 3 Credits Today
            </div>
          </div>
        </div>

        {/* Info Area */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <Info size={20} /> 
            <h3 className="font-black italic uppercase text-sm">使いかた・活用マニュアル</h3>
          </div>
          <p className="text-sm text-slate-300 font-bold leading-relaxed italic">
            「キャラメイク診断」を通じてあなたの武器を明確にします。AIが最新の市場動向（gsk search）を解析し、あなた専用の最短収益化ルートを構築します。
          </p>
        </div>

        {/* Main Content Area */}
        <div className="py-4">
          {status === 'input' && (
            <CharacterMake onComplete={handleComplete} isSubmitting={false} />
          )}

          {status === 'analyzing' && (
            <div className="max-w-2xl mx-auto py-20 text-center space-y-8 bg-white/5 rounded-[3rem] border border-white/10 animate-pulse">
              <div className="relative inline-block">
                <div className="h-24 w-24 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <Briefcase className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-400 h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white italic">市場トレンドを解析中...</h2>
                <p className="text-emerald-400 font-bold text-sm animate-bounce">
                  gsk search 連携：2026年5月の最新案件をスキャンしています
                </p>
              </div>
            </div>
          )}

          {status === 'result' && resultData && (
            <ResultView result={resultData} onReset={() => setStatus('input')} />
          )}
        </div>

        {/* Affiliate / Conversion Area */}
        <a href="https://www.amazon.co.jp/s?k=副業+稼ぎ方&tag=nextralabs-22" target="_blank" className="block group">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-800 p-10 rounded-[3rem] flex items-center justify-between shadow-2xl transition-all hover:scale-[1.02] active:scale-95">
            <div>
              <p className="text-emerald-200 text-xs font-bold mb-1">RECOMMENDED RESOURCE</p>
              <h3 className="text-2xl font-black text-white italic">不敗の稼ぐ力：副業・独立のバイブル ➔</h3>
            </div>
            <ShoppingCart size={40} className="text-white group-hover:rotate-12 transition-transform" />
          </div>
        </a>
      </div>
    </div>
  );
}
