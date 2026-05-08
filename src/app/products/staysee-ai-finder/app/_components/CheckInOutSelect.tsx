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
          className="group bg-gradient-to-br from-emerald-500 to-teal-600 p-10 rounded-[40px] shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col items-center gap-6"
        >
          <div className="bg-white/20 p-8 rounded-full">
            <LogIn size={80} className="text-white" />
          </div>
          <div className="text-white">
            <h2 className="text-5xl font-black mb-2">チェックイン</h2>
            <p className="text-xl opacity-80 uppercase tracking-widest">Check-In</p>
          </div>
        </button>

        <button
          onClick={() => onNext('checkout')}
          className="group bg-gradient-to-br from-slate-700 to-slate-900 p-10 rounded-[40px] shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col items-center gap-6"
        >
          <div className="bg-white/10 p-8 rounded-full">
            <LogOut size={80} className="text-white" />
          </div>
          <div className="text-white">
            <h2 className="text-5xl font-black mb-2 text-gray-400 group-hover:text-white transition-colors">チェックアウト</h2>
            <p className="text-xl opacity-60 uppercase tracking-widest group-hover:opacity-100 transition-opacity">Check-Out</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default CheckInOutSelect;
