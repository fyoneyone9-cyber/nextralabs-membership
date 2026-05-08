'use client';

import React, { useState } from 'react';
import { Search, Phone, Hash, QrCode, User } from 'lucide-react';

interface ReservationSearchProps {
  onNext: (reservationData: any) => void;
}

const ReservationSearch: React.FC<ReservationSearchProps> = ({ onNext }) => {
  const [searchMode, setSearchMode] = useState<'phone' | 'id' | 'name' | 'qr'>('phone');
  const [inputValue, setInputValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    // TODO: Staysee API連携の実装
    // デモ用に2秒待機してダミーデータを返す
    setTimeout(() => {
      setIsSearching(false);
      onNext({ id: 'RSV12345', name: 'NextraLabs様', plan: 'スタンダードプラン' });
    }, 2000);
  };

  const modes = [
    { id: 'phone', label: '電話番号', icon: <Phone size={24} />, placeholder: '09012345678' },
    { id: 'id', label: '予約番号', icon: <Hash size={24} />, placeholder: '12345678' },
    { id: 'name', label: 'お名前(かな)', icon: <User size={24} />, placeholder: 'やまだ たろう' },
    { id: 'qr', label: 'QRコード', icon: <QrCode size={24} />, placeholder: 'スキャナーにかざしてください' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">予約を検索します</h2>
        <p className="text-gray-400">検索方法を選択して、情報を入力してください</p>
      </div>

      {/* 検索モード選択 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => {
              setSearchMode(mode.id as any);
              setInputValue('');
            }}
            className={`
              flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all
              ${searchMode === mode.id 
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}
            `}
          >
            <div className="mb-3">{mode.icon}</div>
            <span className="font-bold">{mode.label}</span>
          </button>
        ))}
      </div>

      {/* 入力エリア */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mt-8">
        <div className="max-w-md mx-auto space-y-6">
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={modes.find(m => m.id === searchMode)?.placeholder}
              className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-6 px-8 text-2xl font-bold focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {searchMode === 'qr' && (
              <div className="mt-4 p-8 border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center text-gray-500">
                <QrCode size={64} className="mb-4 opacity-20" />
                <p>カメラ/スキャナーを起動します</p>
              </div>
            )}
          </div>

          <button
            onClick={handleSearch}
            disabled={!inputValue && searchMode !== 'qr' || isSearching}
            className={`
              w-full py-6 rounded-2xl text-2xl font-bold transition-all
              ${isSearching || (!inputValue && searchMode !== 'qr')
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20 active:scale-[0.98]'}
            `}
          >
            {isSearching ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                <span>検索中...</span>
              </div>
            ) : (
              '検索する'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationSearch;
