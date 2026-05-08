'use client';

import React, { useEffect } from 'react';

interface StartScreenProps {
  onNext: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onNext }) => {
  const [isLocked, setIsLocked] = React.useState(true);

  const handleAdminLogout = () => {
    const pw = window.prompt('管理者パスワードを入力してください');
    if (pw === '2026') {
      setIsLocked(false);
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/';
    } else if (pw !== null) {
      alert('認証エラー');
    }
  };

  // 強力な外部サイト封鎖
  useEffect(() => {
    if (!isLocked) return;
    const handleExternalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.href) {
        try {
          const url = new URL(anchor.href);
          if (url.origin !== window.location.origin) {
            e.preventDefault();
            e.stopPropagation();
            alert('【SECURITY LOCK】');
            return false;
          }
        } catch (err) {}
      }
    };
    const preventDeparture = (e: BeforeUnloadEvent) => {
      if (isLocked) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('click', handleExternalClick, true);
    window.addEventListener('beforeunload', preventDeparture);
    return () => {
      window.removeEventListener('click', handleExternalClick, true);
      window.removeEventListener('beforeunload', preventDeparture);
    };
  }, [isLocked]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center space-y-24 animate-in fade-in duration-1000 relative">
      
      {/* 隠し管理者エリア (バージョン表示) */}
      <div className="fixed bottom-4 left-4 z-[200]">
        <button 
          onClick={handleAdminLogout}
          className="text-[8px] font-black text-white/5 hover:text-emerald-500/20 tracking-[0.5em] transition-colors uppercase cursor-default"
        >
          v3.50.2.build.final
        </button>
      </div>

      <div className="space-y-4">
        <p className="text-emerald-500/40 text-sm font-black tracking-[1.2em] uppercase animate-in slide-in-from-top-4 duration-1000">
          Experience the Future
        </p>
        <h1 className="text-6xl md:text-8xl font-thin tracking-tighter leading-tight text-white/90 py-10">
          Welcome to<br/>
          <span className="font-black italic text-transparent bg-clip-text bg-gradient-to-tr from-emerald-400 via-emerald-500 to-teal-200 drop-shadow-[0_0_20px_rgba(16,185,129,0.4)] px-4">
            Premium Stay
          </span>
        </h1>
      </div>

      <button
        onClick={onNext}
        className="group relative flex items-center justify-center w-80 h-80 transition-all duration-1000 active:scale-95"
      >
        <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-[100px] group-hover:bg-emerald-500/20 transition-all duration-1000" />
        <div className="absolute inset-0 border border-white/5 rounded-full scale-[1.6] opacity-10 group-hover:scale-125 group-hover:opacity-40 transition-all duration-1000" />
        
        <div className="relative w-full h-full bg-black/40 backdrop-blur-3xl border border-white/10 rounded-full flex flex-col items-center justify-center shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden group-hover:border-emerald-500/40 transition-all duration-700">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-transparent animate-[pulse_4s_infinite]" />
          <div className="relative z-10 space-y-6 flex flex-col items-center">
            <div className="w-16 h-1 bg-emerald-500 rounded-full group-hover:w-32 transition-all duration-700 shadow-[0_0_20px_rgba(16,185,129,1)]" />
            <p className="text-4xl font-thin tracking-[0.4em] text-white/90 group-hover:text-white transition-all duration-700 group-hover:tracking-[0.6em]">START</p>
            <div className="w-8 h-0.5 bg-white/20 rounded-full group-hover:bg-emerald-500/50 transition-all" />
          </div>
        </div>

        <div className="absolute -inset-10 border border-emerald-500/5 rounded-full animate-[spin_30s_linear_infinite]" />
        <div className="absolute -inset-10 border-t-2 border-emerald-500/20 rounded-full animate-[spin_10s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>

      <div className="flex flex-col items-center gap-4 opacity-60 group hover:opacity-100 transition-opacity duration-1000 cursor-default">
         <span className="text-[10px] md:text-xs font-black tracking-[1em] uppercase text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">Intelligent Check-in System</span>
         <div className="w-px h-16 bg-gradient-to-b from-emerald-400 to-transparent shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
      </div>
    </div>
  );
};

export default StartScreen;
