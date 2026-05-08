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

      <div className="flex flex-wrap justify-center gap-6 max-w-5xl">
        {languages.map((lang) => (
          <button
            key={lang.id}
            onClick={() => onNext(lang.id)}
            className={`
              w-56 h-56 rounded-full bg-white text-slate-700 shadow-xl
              flex items-center justify-center text-4xl font-black
              hover:scale-110 hover:bg-emerald-50 transition-all duration-300
              ${lang.label === '日本語' ? 'w-72 h-72 text-6xl' : ''}
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
