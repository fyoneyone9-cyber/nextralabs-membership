'use client';
import React from 'react';
import { Button } from '@/components/ui/button';

export default function CheckInOutSelect({ onNext }: { onNext: (type: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
      <Button onClick={() => onNext('checkin')} className="h-40 bg-emerald-600 text-3xl font-bold rounded-3xl uppercase shadow-2xl">CHECK IN</Button>
      <Button onClick={() => onNext('checkout')} className="h-40 bg-white/5 border-2 border-white/10 text-3xl font-bold rounded-3xl uppercase ">CHECK OUT</Button>
    </div>
  );
}
