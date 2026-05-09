'use client';
import React from 'react';
import { Button } from '@/components/ui/button';

export default function RegistrationForm({ lang, onSubmit }: { lang: string, onSubmit: (data: any) => void }) {
  const t = lang === 'ja' ? '内容を確認して登録' : 'Complete Registration';
  return (
    <div className="max-w-2xl mx-auto space-y-8 bg-white/5 p-12 rounded-[3rem] border border-white/10 text-center">
      <h3 className="text-3xl font-bold text-white uppercase tracking-tighter">宿泊名簿の自動生成完了</h3>
      <p className="text-slate-400 font-bold ">AIが身分証から情報を抽出しました。間違いがなければ進んでください。</p>
      <Button onClick={() => onSubmit({})} className="w-full h-20 bg-emerald-600 text-white font-bold text-2xl rounded-2xl">
        {t}
      </Button>
    </div>
  );
}
