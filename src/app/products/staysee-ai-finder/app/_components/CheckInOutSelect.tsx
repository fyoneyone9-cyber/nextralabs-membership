'use client';

import React from 'react';
import { LogIn, LogOut } from 'lucide-react';

interface CheckInOutSelectProps {
  onNext: (type: 'checkin' | 'checkout') => void;
}

const CheckInOutSelect: React.FC<CheckInOutSelectProps> = ({ onNext }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-20 animate-in fade-in slide-in-from-bottom-12 duration-1000">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black tracking-tighter">GUEST SERVICE</h1>
        <p className="text-gray-500 text-lg font-bold tracking-[0.4em] uppercase">ご希望の項目を選択してください</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 w-full max-w-5xl">
        <button
          onClick={() => onNext('checkin')}
          className="group relative overflow-hidden bg-white/5 border border-white/10 p-16 rounded-[60px] shadow-2xl backdrop-blur-2xl hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all duration-700 flex flex-col items-center gap-10"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative bg-white/5 p-12 rounded-full border border-white/10 group-hover:scale-110 transition-transform duration-700">
              <LogIn size={120} className="text-emerald-400" strokeWidth={1} />
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-7xl font-black mb-2 tracking-tighter">CHECK-IN</h2>
            <p className="text-lg text-emerald-500 font-bold uppercase tracking-[0.5em] opacity-40 group-hover:opacity-100 transition-opacity">チェックイン</p>
          </div>
        </button>

        <button
          onClick={() => onNext('checkout')}
          className="group relative overflow-hidden bg-white/5 border border-white/10 p-16 rounded-[60px] shadow-2xl backdrop-blur-2xl hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-700 flex flex-col items-center gap-10 grayscale hover:grayscale-0"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative bg-white/5 p-12 rounded-full border border-white/10 group-hover:scale-110 transition-transform duration-700">
              <LogOut size={120} className="text-gray-500 group-hover:text-blue-400 transition-colors" strokeWidth={1} />
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-7xl font-black mb-2 tracking-tighter text-gray-700 group-hover:text-white transition-colors">CHECK-OUT</h2>
            <p className="text-lg text-gray-700 font-bold uppercase tracking-[0.5em] group-hover:text-blue-500/60 transition-colors">チェックアウト</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default CheckInOutSelect;
