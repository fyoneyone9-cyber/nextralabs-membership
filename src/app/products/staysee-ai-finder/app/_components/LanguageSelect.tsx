'use client';

import React from 'react';

interface LanguageSelectProps {
  onNext: (lang: string) => void;
}

const LanguageSelect: React.FC<LanguageSelectProps> = ({ onNext }) => {
  const languages = [
    { id: 'en', label: 'ENGLISH' },
    { id: 'ja', label: '日本語' },
    { id: 'zh-cn', label: '简体中文' },
    { id: 'zh-tw', label: '繁體中文' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-20 animate-in fade-in slide-in-from-right-12 duration-1000">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black tracking-tighter">SELECT LANGUAGE</h1>
        <p className="text-gray-500 text-lg font-bold tracking-[0.4em] uppercase">ご利用の言語を選択してください</p>
      </div>

      <div className="flex flex-wrap justify-center gap-12 max-w-6xl">
        {languages.map((lang) => (
          <button
            key={lang.id}
            onClick={() => onNext(lang.id)}
            className={`
              group relative w-64 h-64 rounded-[40px] bg-white/5 border border-white/10 text-white
              flex items-center justify-center overflow-hidden backdrop-blur-xl
              hover:scale-105 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all duration-500
              ${lang.label === '日本語' ? 'w-[400px] border-emerald-500/30' : ''}
            `}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className={`font-black tracking-tighter group-hover:scale-110 transition-transform duration-500 ${lang.label === '日本語' ? 'text-8xl' : 'text-4xl opacity-60 group-hover:opacity-100'}`}>
              {lang.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelect;
