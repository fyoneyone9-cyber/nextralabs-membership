'use client';
import React from 'react';

const LANGUAGES = [
  { code: 'ja', label: '日本語',           sub: 'Japanese' },
  { code: 'en', label: 'English',          sub: 'English' },
  { code: 'zh', label: '中文',             sub: 'Chinese' },
  { code: 'ko', label: '한국어',           sub: 'Korean' },
  { code: 'es', label: 'Español',          sub: 'Spanish' },
  { code: 'fr', label: 'Français',         sub: 'French' },
  { code: 'de', label: 'Deutsch',          sub: 'German' },
  { code: 'pt', label: 'Português',        sub: 'Portuguese' },
  { code: 'it', label: 'Italiano',         sub: 'Italian' },
  { code: 'ru', label: 'Русский',          sub: 'Russian' },
  { code: 'ar', label: 'العربية',          sub: 'Arabic' },
  { code: 'th', label: 'ภาษาไทย',         sub: 'Thai' },
  { code: 'vi', label: 'Tiếng Việt',       sub: 'Vietnamese' },
  { code: 'id', label: 'Bahasa Indonesia', sub: 'Indonesian' },
];

export default function LanguageSelect({ onNext }: { onNext: (lang: string) => void }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
      {LANGUAGES.map(({ code, label, sub }) => (
        <button
          key={code}
          onClick={() => onNext(code)}
          className="flex flex-col items-center justify-center gap-1.5 h-28 bg-white/5 border-2 border-white/10 rounded-2xl hover:border-emerald-500 hover:bg-emerald-500/5 transition-all active:scale-95"
        >
          <span className="text-2xl font-bold text-white leading-none">{label}</span>
          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{sub}</span>
        </button>
      ))}
    </div>
  );
}
