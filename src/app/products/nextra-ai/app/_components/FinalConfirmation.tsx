'use client';
import React from 'react';
import { Button } from '@/components/ui/button';

export default function FinalConfirmation({ lang, type, reservation, capturedImage, guestInfo, onComplete }: any) {
  const t = lang === 'ja' ? '手続きを完了する' : 'Confirm & Finish';
  return (
    <div className="text-center space-y-12">
      <h3 className="text-4xl font-black text-white italic uppercase">{type.toUpperCase()} FINAL CONFIRMATION</h3>
      <div className="bg-white/5 border-2 border-emerald-500/30 rounded-[3rem] p-12 max-w-4xl mx-auto grid grid-cols-2 gap-8">
        <div className="text-left space-y-4">
          <p className="text-xs font-black text-slate-500 uppercase">Guest Name</p>
          <p className="text-3xl font-black text-white">{reservation?.name_kanji}</p>
        </div>
        <div className="text-right space-y-4">
          <p className="text-xs font-black text-slate-500 uppercase">Room Number</p>
          <p className="text-7xl font-black text-emerald-400 italic leading-none">{reservation?.room_number}</p>
        </div>
      </div>
      <Button onClick={onComplete} className="h-24 px-20 bg-emerald-600 text-white font-black text-4xl rounded-[2.5rem] shadow-[0_0_50px_rgba(16,185,129,0.4)]">
        {t} ➔
      </Button>
    </div>
  );
}
