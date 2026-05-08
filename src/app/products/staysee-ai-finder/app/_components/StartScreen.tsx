'use client';

import React from 'react';
import { TouchpadOff as Touch } from 'lucide-react';

interface StartScreenProps {
  onNext: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onNext }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-12 animate-in fade-in zoom-in duration-700">
      <div className="text-white space-y-4">
        <h1 className="text-4xl font-bold">ボタンを押してください。 Please press button.</h1>
      </div>

      <button
        onClick={onNext}
        className="group relative flex flex-col items-center justify-center w-80 h-80 bg-black border-4 border-white/10 rounded-full shadow-[0_0_50px_rgba(16,185,129,0.1)] hover:border-emerald-500 hover:shadow-[0_0_60px_rgba(16,185,129,0.3)] transition-all duration-500"
      >
        <div className="text-white mb-4 group-hover:text-emerald-400 transition-colors group-hover:scale-110 duration-500">
          <Touch size={120} strokeWidth={1} />
        </div>
        <div className="text-white text-center">
          <p className="text-3xl font-black mb-1 leading-tight tracking-tighter">TOUCH START</p>
          <p className="text-xs font-bold text-gray-500 group-hover:text-emerald-500 transition-colors uppercase tracking-widest">Tap to begin</p>
        </div>
      </button>

      <div className="flex items-center gap-12 pt-20">
         <div className="w-32 h-48 bg-blue-600/20 rounded-t-full border-x-2 border-t-2 border-white/10 relative overflow-hidden">
            {/* イラスト風の人間を簡易的に表現 */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-white/20 rounded-full" />
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-20 h-32 bg-white/10 rounded-xl" />
         </div>
      </div>
    </div>
  );
};

export default StartScreen;
