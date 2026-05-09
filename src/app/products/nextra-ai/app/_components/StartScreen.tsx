'use client';
import React from 'react';
import { Button } from '@/components/ui/button';

export default function StartScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center space-y-10">
      <h2 className="text-5xl md:text-8xl font-bold uppercase tracking-tighter text-white">Welcome</h2>
      <Button onClick={onNext} className="h-24 px-16 bg-emerald-600 text-white font-bold text-3xl rounded-[2rem] shadow-2xl animate-pulse">
        TOUCH TO START ➔
      </Button>
    </div>
  );
}
