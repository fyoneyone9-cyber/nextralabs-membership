'use client';

import React, { useEffect } from 'react';

interface StartScreenProps {
  onNext: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onNext }) => {
  const [pressTimer, setPressTimer] = React.useState<any>(null);
  const [isLocked, setIsLocked] = React.useState(true);

  const handlePressStart = (e: React.MouseEvent | React.TouchEvent) => {
    const timer = setTimeout(() => {
      if (window.confirm('管理モードを終了してログアウト（ロック解除）しますか？')) {
        setIsLocked(false);
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/';
      }
    }, 15000);
    setPressTimer(timer);
  };

  const handleReleaseStart = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  // 強力なキオスク・ロック・エンジン
  useEffect(() => {
    if (!isLocked) return;

    // 1. 外部へのリンククリックを物理的に遮断
    const handleExternalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.href) {
        try {
          const url = new URL(anchor.href);
          if (url.origin !== window.location.origin) {
            e.preventDefault();
            e.stopPropagation();
            alert('【SECURITY LOCK】外部サイトへの移動は制限されています。');
            return false;
          }
        } catch (err) {}
      }
    };

    // 2. ブラウザを閉じたりURLを変えようとした時の最終防衛
    const preventDeparture = (e: BeforeUnloadEvent) => {
      if (isLocked) {
        // 標準の警告ダイアログを表示
        e.preventDefault();
        e.returnValue = ''; // 最近のブラウザではカスタム文言は無視され、標準警告が出る
        
        // 【物理的ブロックハック】
        // ユーザーが「離れる」を選ぼうとする隙を与えず、履歴を書き換え続けてページを保持
        setTimeout(() => {
          if (isLocked) {
            window.history.pushState(null, '', window.location.href);
          }
        }, 100);
      }
    };

    // 3. ブラウザの「戻る」ボタンによる外部（履歴）への離脱を阻止
    // 常に自分自身のURLを履歴の先頭に積み続けることで「戻る」を無効化
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      if (isLocked) {
        window.history.pushState(null, '', window.location.href);
        alert('【LOCKED】戻る操作は制限されています。');
      }
    };

    window.addEventListener('click', handleExternalClick, true);
    window.addEventListener('beforeunload', preventDeparture);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('click', handleExternalClick, true);
      window.removeEventListener('beforeunload', preventDeparture);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isLocked]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center space-y-24 animate-in fade-in duration-1000">
      
      {/* 繊細で美しいタイポグラフィ */}
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

      {/* スマートで宝石のようなSTARTボタン */}
      <button
        onClick={onNext}
        onMouseDown={handlePressStart}
        onMouseUp={handleReleaseStart}
        onMouseLeave={handleReleaseStart}
        onTouchStart={handlePressStart}
        onTouchEnd={handleReleaseStart}
        className="group relative flex items-center justify-center w-80 h-80 transition-all duration-1000 active:scale-95"
      >
        {/* 深い奥行きを作る光 of 宝石 */}
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

      {/* フッター */}
      <div className="flex flex-col items-center gap-4 opacity-60 group hover:opacity-100 transition-opacity duration-1000 cursor-default">
         <span className="text-[10px] md:text-xs font-black tracking-[1em] uppercase text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">Intelligent Check-in System</span>
         <div className="w-px h-16 bg-gradient-to-b from-emerald-400 to-transparent shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
      </div>
    </div>
  );
};

export default StartScreen;
