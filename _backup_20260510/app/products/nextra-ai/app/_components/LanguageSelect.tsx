'use client';
import React from 'react';
import { Button } from '@/components/ui/button';

export default function LanguageSelect({ onNext }: { onNext: (lang: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
      <Button onClick={() => onNext('ja')} className="h-40 bg-white/5 border-2 border-white/10 text-4xl font-black rounded-3xl hover:border-emerald-500">日本語</Button>
      <Button onClick={() => onNext('en')} className="h-40 bg-white/5 border-2 border-white/10 text-4xl font-black rounded-3xl hover:border-emerald-500 italic">ENGLISH</Button>
    </div>
  );
}
