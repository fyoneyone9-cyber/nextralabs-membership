'use client';

import React from 'react';
import { Map, Zap, ExternalLink, ShieldCheck, CheckCircle2, Trophy, ArrowRight, Share2 } from 'lucide-react';

interface ResultViewProps {
  result: {
    title: string;
    description: string;
    roadmap: Array<{
      title: string;
      desc: string;
      urgent?: boolean;
    }>;
    ai_hack: string;
    platforms: string[];
  };
  onReset: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ result, onReset }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in zoom-in-95 duration-700">
      {/* 称号エリア */}
      <div className="text-center p-8 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Trophy size={120} />
        </div>
        <p className="text-emerald-200 text-xs font-bold tracking-[0.2em] uppercase mb-2">Special Title Acquired</p>
        <h1 className="text-4xl font-black tracking-tight mb-4">
          {result.title}
        </h1>
        <p className="text-emerald-50 text-sm leading-relaxed max-w-md mx-auto opacity-90">
          {result.description}
        </p>
      </div>

      {/* ロードマップエリア */}
      <div className="space-y-6">
        <h3 className="flex items-center gap-2 font-black text-gray-800 text-lg ml-2">
          <Map className="text-emerald-500" size={20} />
          最速収益化ロードマップ
        </h3>
        
        <div className="relative border-l-2 border-emerald-200 ml-6 pl-10 space-y-10 py-2">
          {result.roadmap.map((step, index) => (
            <div key={index} className="relative">
              {/* ステップ番号バッジ */}
              <div className={`absolute -left-[58px] top-0 w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg shadow-lg border-2 border-white ${step.urgent ? 'bg-orange-500 text-white animate-bounce' : 'bg-emerald-500 text-white'}`}>
                {index + 1}
              </div>
              
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-50 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-black text-gray-800 text-lg">{step.title}</h4>
                  {step.urgent && (
                    <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-3 py-1 rounded-full animate-pulse">
                      IMMEDIATE
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AIハック（プレミアム限定感） */}
      <div className="bg-emerald-50 border-2 border-emerald-200 p-8 rounded-[2rem] relative overflow-hidden">
        <div className="absolute -right-4 -top-4 opacity-5 text-emerald-600">
          <Zap size={100} />
        </div>
        <div className="flex items-center gap-2 text-emerald-700 font-black mb-4">
          <Zap size={20} fill="currentColor" />
          <span>MASTER&apos;S AI HACK</span>
        </div>
        <p className="text-emerald-900 text-sm font-medium leading-relaxed italic">
          「{result.ai_hack}」
        </p>
      </div>

      {/* アクションボタン */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button className="flex items-center justify-center gap-2 py-5 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-all shadow-lg hover:-translate-y-1 active:translate-y-0">
          <ExternalLink size={20} />
          推奨サイトを開く
        </button>
        <button 
          onClick={onReset}
          className="flex items-center justify-center gap-2 py-5 bg-white border-2 border-emerald-500 text-emerald-600 font-black rounded-2xl hover:bg-emerald-50 transition-all"
        >
          再診断する
        </button>
      </div>

      {/* 品質保証フッター */}
      <div className="flex flex-col items-center gap-3 pt-6 pb-12 opacity-60">
        <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs tracking-widest uppercase">
          <ShieldCheck size={16} />
          MASTERMODEL QUALITY GUARANTEED
        </div>
        <p className="text-[10px] text-gray-400">© 2026 NextraLabs AI Engine v2.0-MASTER</p>
      </div>
    </div>
  );
};