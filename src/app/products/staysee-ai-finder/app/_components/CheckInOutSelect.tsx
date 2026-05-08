'use client';

import React from 'react';
import { LogIn, LogOut } from 'lucide-react';

interface CheckInOutSelectProps {
  onNext: (type: 'checkin' | 'checkout') => void;
}

const CheckInOutSelect: React.FC<CheckInOutSelectProps> = ({ onNext }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-white text-center">
        <h1 className="text-4xl font-bold mb-4">どちらを承りますか？</h1>
        <p className="text-gray-400">ご希望のボタンをタッチしてください</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl">
        <button
          onClick={() => onNext('checkin')}
          className="group relative overflow-hidden bg-white/5 border-2 border-white/10 p-12 rounded-[48px] shadow-2xl hover:border-emerald-500 hover:bg-emerald-500/10 hover:shadow-[0_0_60px_rgba(16,185,129,0.2)] transition-all duration-500 flex flex-col items-center gap-8"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="bg-emerald-500/20 p-10 rounded-full group-hover:scale-110 transition-transform duration-500">
            <LogIn size={100} className="text-emerald-400" />
          </div>
          <div className="text-center">
            <h2 className="text-6xl font-black mb-2 text-white tracking-tighter">チェックイン</h2>
            <p className="text-xl text-emerald-500/60 font-bold uppercase tracking-[0.3em]">Check-In</p>
          </div>
        </button>

        <button
          onClick={() => onNext('checkout')}
          className="group relative overflow-hidden bg-white/5 border-2 border-white/10 p-12 rounded-[48px] shadow-2xl hover:border-blue-500 hover:bg-blue-500/10 hover:shadow-[0_0_60px_rgba(59,130,246,0.2)] transition-all duration-500 flex flex-col items-center gap-8"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="bg-white/5 p-10 rounded-full group-hover:scale-110 transition-transform duration-500">
            <LogOut size={100} className="text-gray-600 group-hover:text-blue-400 transition-colors" />
          </div>
          <div className="text-center">
            <h2 className="text-6xl font-black mb-2 text-gray-700 group-hover:text-white transition-all tracking-tighter">チェックアウト</h2>
            <p className="text-xl text-gray-700 font-bold uppercase tracking-[0.3em] group-hover:text-blue-500/60">Check-Out</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default CheckInOutSelect;
