'use client';

import React from 'react';
import { TouchpadOff as Touch } from 'lucide-react';

interface StartScreenProps {
  onNext: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onNext }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-16 animate-in fade-in zoom-in duration-1000">
      <div className="space-y-6">
        <h1 className="text-6xl font-black tracking-tighter leading-tight italic">
          Welcome to<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
            Premium Stay
          </span>
        </h1>
        <p className="text-gray-500 text-xl font-medium tracking-widest uppercase">
          ボタンを押して開始してください
        </p>
      </div>

      <button
        onClick={onNext}
        className="group relative flex items-center justify-center w-96 h-96 transition-all duration-700 active:scale-95"
      >
        {/* 外側の光輪 */}
        <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-3xl group-hover:bg-emerald-500/40 transition-all duration-700 animate-pulse" />
        
        {/* メインボタン本体 */}
        <div className="relative w-full h-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full flex flex-col items-center justify-center shadow-2xl overflow-hidden group-hover:border-emerald-500/50 transition-all duration-700">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative z-10 text-white mb-6 group-hover:text-emerald-400 transition-all duration-700 group-hover:scale-110">
            <Touch size={140} strokeWidth={0.5} />
          </div>
          
          <div className="relative z-10 text-center">
            <p className="text-4xl font-black mb-2 tracking-[0.2em] group-hover:tracking-[0.3em] transition-all duration-700">START</p>
            <div className="h-1 w-12 bg-emerald-500 mx-auto rounded-full group-hover:w-24 transition-all duration-700" />
          </div>
        </div>

        {/* 装飾用の回転リング */}
        <div className="absolute -inset-4 border-2 border-dashed border-emerald-500/20 rounded-full animate-[spin_20s_linear_infinite] group-hover:border-emerald-500/40 transition-colors" />
      </button>

      <div className="pt-10 opacity-20 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
         <div className="flex flex-col items-center gap-4">
            <div className="w-1 h-20 bg-gradient-to-b from-emerald-500 to-transparent rounded-full animate-bounce" />
            <span className="text-xs font-bold tracking-[0.5em] uppercase">Smart Check-in System</span>
         </div>
      </div>
    </div>
  );
};

export default StartScreen;
