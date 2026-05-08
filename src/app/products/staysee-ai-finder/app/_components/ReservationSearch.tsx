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
  const [error, setError] = useState<string | null>(null);

  // DMSのシミュレーションデータ（本来はAPI経由で取得）
  const MOCK_DMS_DATABASE = [
    { id: 'RSV001', phone: '08012345678', name: 'SEKIDO KENJI', plan: 'スタンダードプラン', amount: 4500, address: '東京都新宿区...', occupation: '会社員' },
    { id: 'RSV002', phone: '09012345678', name: 'NextraLabs様', plan: 'プレミアムプラン', amount: 9800, address: '神奈川県海老名市...', occupation: 'ITエンジニア' },
    { id: '8824', phone: '08032078422', name: '米山 文貴', plan: 'マスタプラン', amount: 15000, address: '神奈川県海老名市中央...', occupation: '経営者' }
  ];

  const handleSearch = async () => {
    setIsSearching(true);
    setError(null);

    // 2秒待機（ネットワーク通信のシミュレーション）
    setTimeout(() => {
      setIsSearching(false);
      
      // 入力値とDMSデータを照合
      const found = MOCK_DMS_DATABASE.find(item => 
        item.phone === inputValue.replace(/-/g, '') || 
        item.id === inputValue || 
        item.name.includes(inputValue)
      );

      if (found) {
        // 見つかったらデータを引き継いで次へ
        onNext(found);
      } else {
        // 見つからない場合はエラー
        setError('予約情報が見つかりませんでした。入力内容を確認するか、フロントスタッフをお呼びください。');
      }
    }, 1500);
  };

  const modes = [
    { id: 'phone', label: '電話番号', icon: <Phone size={24} />, placeholder: '09012345678' },
    { id: 'id', label: '予約番号', icon: <Hash size={24} />, placeholder: '12345678' },
    { id: 'name', label: 'お名前(かな)', icon: <User size={24} />, placeholder: 'やまだ たろう' },
    { id: 'qr', label: 'QRコード', icon: <QrCode size={24} />, placeholder: 'スキャナーにかざしてください' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black tracking-tighter">RESERVATION</h1>
        <p className="text-gray-500 text-lg font-bold tracking-[0.4em] uppercase">予約情報を検索します</p>
      </div>

      {/* 検索モード選択 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => {
              setSearchMode(mode.id as any);
              setInputValue('');
            }}
            className={`
              relative flex flex-col items-center justify-center p-10 rounded-[40px] border-2 transition-all duration-500
              ${searchMode === mode.id 
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.2)]' 
                : 'bg-white/5 border-white/5 text-gray-600 hover:bg-white/10 hover:border-white/20'}
            `}
          >
            <div className="mb-4">{mode.icon}</div>
            <span className="font-black text-xl tracking-tighter">{mode.label}</span>
            {searchMode === mode.id && (
              <div className="absolute -bottom-2 w-2 h-2 bg-emerald-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* 入力エリア */}
      <div className="relative group max-w-3xl mx-auto">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-[40px] blur opacity-10 group-focus-within:opacity-30 transition-opacity" />
        <div className="relative bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10">
          <div className="space-y-8">
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={modes.find(m => m.id === searchMode)?.placeholder}
                className="w-full bg-white/5 border-2 border-white/10 rounded-3xl py-10 px-12 text-5xl font-black tracking-tighter focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-800"
              />
              <div className="absolute right-8 top-1/2 -translate-y-1/2 text-emerald-500/20">
                <Search size={60} />
              </div>
            </div>

            <button
              onClick={handleSearch}
              disabled={!inputValue && searchMode !== 'qr' || isSearching}
              className={`
                w-full py-10 rounded-3xl text-3xl font-black tracking-[0.2em] transition-all
                ${isSearching || (!inputValue && searchMode !== 'qr')
                  ? 'bg-white/5 text-gray-700 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_20px_40px_rgba(16,185,129,0.3)] active:scale-[0.98]'}
              `}
            >
              {isSearching ? 'SEARCHING...' : 'SEARCH'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationSearch;
