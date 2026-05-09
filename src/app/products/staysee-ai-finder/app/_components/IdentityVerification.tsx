'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

export default function IdentityVerification({ lang, onCaptured }: { lang: string, onCaptured: (img: string) => void }) {
  const t = lang === 'ja' ? 'カメラを起動して本人確認を行う' : 'Verify Identity via Camera';
  return (
    <div className="text-center space-y-12">
      <div className="w-64 h-64 mx-auto bg-white/5 border-4 border-dashed border-emerald-500/30 rounded-full flex items-center justify-center">
        <Camera className="w-24 h-24 text-emerald-500" />
      </div>
      <Button onClick={() => onCaptured('data:image/png;base64,...')} className="h-20 px-12 bg-emerald-600 text-white font-bold text-2xl rounded-2xl uppercase ">
        {t}
      </Button>
    </div>
  );
}
