'use client';

import React from 'react';

interface LanguageSelectProps {
  onNext: (lang: string) => void;
}

const LanguageSelect: React.FC<LanguageSelectProps> = ({ onNext }) => {
  const languages = [
    { id: 'ja', label: '日本語' },
    { id: 'en', label: 'ENGLISH' },
    { id: 'zh-cn', label: '简体中文' },
    { id: 'zh-tw', label: '繁體中文' },
    { id: 'ko', label: '한국어' },
    { id: 'th', label: 'ภาษาไทย' },
    { id: 'vi', label: 'Tiếng Việt' },
    { id: 'id', label: 'Bahasa Indonesia' },
    { id: 'fr', label: 'FRANÇAIS' },
    { id: 'es', label: 'ESPAÑOL' },
    { id: 'de', label: 'DEUTSCH' },
    { id: 'it', label: 'ITALIANO' },
    { id: 'pt', label: 'PORTUGUÊS' },
    { id: 'ru', label: 'РУССКИЙ' },
    { id: 'ar', label: 'العربية' },
    { id: 'hi', label: 'हिन्दी' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] space-y-12 animate-in fade-in duration-1000 py-10">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-thin tracking-[0.2em] text-white/90">SELECT LANGUAGE</h1>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto rounded-full" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6 max-w-7xl w-full px-10 overflow-y-auto max-h-[60vh] scrollbar-hide">
        {languages.map((lang) => (
          <button
            key={lang.id}
            onClick={() => onNext(lang.id)}
            className={`
              group relative p-8 rounded-[32px] bg-white/5 border border-white/5 text-white
              flex items-center justify-center overflow-hidden backdrop-blur-xl transition-all duration-500
              hover:scale-105 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:shadow-[0_0_40px_rgba(16,185,129,0.2)]
              ${lang.id === 'ja' ? 'border-emerald-500/20 bg-emerald-500/5' : ''}
            `}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className={`font-black tracking-tighter transition-all duration-500 ${lang.id === 'ja' ? 'text-6xl' : 'text-xl opacity-60 group-hover:opacity-100'}`}>
              {lang.label}
            </span>
          </button>
        ))}
      </div>

      <div className="opacity-20 flex items-center gap-4">
        <div className="w-8 h-px bg-white" />
        <span className="text-[10px] font-bold tracking-[0.5em] uppercase">Global Support Enabled</span>
        <div className="w-8 h-px bg-white" />
      </div>
    </div>
  );
};

export default LanguageSelect;
