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
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
      <div className="text-white text-center">
        <h1 className="text-3xl font-bold">言語を選択してください。 Please select language.</h1>
      </div>

      <div className="flex flex-wrap justify-center gap-8 max-w-5xl">
        {languages.map((lang) => (
          <button
            key={lang.id}
            onClick={() => onNext(lang.id)}
            className={`
              w-60 h-60 rounded-full bg-white/5 border-2 border-white/10 text-white
              flex items-center justify-center text-4xl font-black backdrop-blur-md
              hover:scale-110 hover:border-emerald-500 hover:bg-emerald-500/10 hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] transition-all duration-500
              ${lang.label === '日本語' ? 'w-80 h-80 text-7xl border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_30px_rgba(16,185,129,0.1)]' : ''}
            `}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelect;
