'use client';

import React from 'react';
import { Calendar, Clock, CreditCard, Key, User, CheckCircle2, ChevronRight } from 'lucide-react';

interface FinalConfirmationProps {
  reservation: any;
  guestInfo: any;
  onNext: () => void;
}

const FinalConfirmation: React.FC<FinalConfirmationProps> = ({ reservation, guestInfo, onNext }) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-12 duration-1000 pb-32">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black tracking-tighter">CONFIRMATION</h1>
        <p className="text-gray-500 text-lg font-bold tracking-[0.4em] uppercase">予約詳細の確認</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* メイン情報カード */}
        <div className="lg:col-span-2 space-y-8">
          {/* 宿泊者基本情報 */}
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[50px] space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <User size={32} className="text-white" />
                </div>
                <div>
                  <p className="text-emerald-500 text-xs font-black uppercase tracking-widest">Guest Name</p>
                  <h2 className="text-4xl font-black tracking-tighter">{guestInfo?.name || reservation?.name} 様</h2>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-600 text-xs font-black uppercase tracking-widest">Reservation ID</p>
                <p className="text-xl font-bold tracking-tighter">#{reservation?.id || '894872'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                <div className="flex items-center gap-3 text-gray-500 mb-2">
                  <Calendar size={18} />
                  <span className="text-xs font-bold uppercase">Check-In</span>
                </div>
                <p className="text-2xl font-black">2026-05-08</p>
                <p className="text-sm text-emerald-500 font-bold">15:00 ~</p>
              </div>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                <div className="flex items-center gap-3 text-gray-500 mb-2">
                  <Clock size={18} />
                  <span className="text-xs font-bold uppercase">Check-Out</span>
                </div>
                <p className="text-2xl font-black">2026-05-09</p>
                <p className="text-sm text-gray-600 font-bold">~ 10:00</p>
              </div>
            </div>
          </div>

          {/* 請求情報 */}
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[50px]">
             <div className="flex items-center gap-3 mb-8">
                <CreditCard size={24} className="text-emerald-500" />
                <h3 className="text-xl font-black tracking-tighter">BILLING / 請求情報</h3>
             </div>
             <div className="space-y-4">
                <div className="flex justify-between items-end pb-4 border-b border-white/5">
                   <span className="text-gray-500 font-bold">宿泊代金（税込）</span>
                   <span className="text-4xl font-black text-white">¥4,500</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-gray-600">うち消費税(10%)</span>
                   <span className="font-bold">¥409</span>
                </div>
             </div>
          </div>
        </div>

        {/* サイドバー: PIN/部屋情報 */}
        <div className="space-y-8">
           <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-10 rounded-[50px] shadow-2xl shadow-emerald-500/20">
              <Key size={48} className="text-white mb-6" />
              <p className="text-white/60 text-xs font-black uppercase tracking-widest mb-1">Room / PIN</p>
              <h3 className="text-5xl font-black text-white tracking-tighter mb-4">Room 302</h3>
              <div className="bg-black/20 backdrop-blur-md rounded-2xl p-4">
                 <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Smart Lock PIN</p>
                 <p className="text-3xl font-black text-white tracking-[0.2em]">8824</p>
              </div>
           </div>

           <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[40px] space-y-6">
              <div className="flex items-center gap-3">
                 <CheckCircle2 size={20} className="text-emerald-500" />
                 <span className="text-sm font-black tracking-tight">本人確認完了</span>
              </div>
              <div className="flex items-center gap-3">
                 <CheckCircle2 size={20} className="text-emerald-500" />
                 <span className="text-sm font-black tracking-tight">署名受領済み</span>
              </div>
           </div>
        </div>
      </div>

      <button
        onClick={onNext}
        className="group w-full py-12 bg-white text-black rounded-[50px] text-4xl font-black tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl flex items-center justify-center gap-4"
      >
        FINISH CHECK-IN
        <ChevronRight size={40} className="group-hover:translate-x-2 transition-transform" />
      </button>
    </div>
  );
};

export default FinalConfirmation;
