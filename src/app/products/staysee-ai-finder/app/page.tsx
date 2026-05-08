'use client';

import React, { useState } from 'react';
import ReservationSearch from './_components/ReservationSearch';
import IdentityVerification from './_components/IdentityVerification';
import RegistrationForm from './_components/RegistrationForm';
import { UserPlus, Camera, ClipboardList, CreditCard, CheckCircle2 } from 'lucide-react';

type Step = 'search' | 'identity' | 'form' | 'payment' | 'complete';

const StayseeAppPage = () => {
  const [step, setStep] = useState<Step>('search');
  const [reservation, setReservation] = useState<any>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(null);

  const steps = [
    { id: 'search', label: '予約検索', icon: <UserPlus size={20} /> },
    { id: 'identity', label: '本人確認', icon: <Camera size={20} /> },
    { id: 'form', label: '台帳記帳', icon: <ClipboardList size={20} /> },
    { id: 'payment', label: '精算', icon: <CreditCard size={20} /> },
    { id: 'complete', label: '完了', icon: <CheckCircle2 size={20} /> },
  ];

  const handleReservationFound = (data: any) => {
    setReservation(data);
    setStep('identity');
  };

  const handleIdentityCaptured = (image: string) => {
    setCapturedImage(image);
    setStep('form');
  };

  const handleFormSubmitted = (data: any) => {
    setFormData(data);
    setStep('payment');
  };

  return (
    <div className="flex min-h-screen bg-[#0f111a] text-white overflow-hidden">
      {/* 左ペイン: ステップインジケーター (タブレット向け固定) */}
      <aside className="w-80 border-r border-white/5 bg-black/20 p-8 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <span className="font-bold text-xl">S</span>
            </div>
            <h1 className="font-bold text-xl tracking-tight">Staysee AI Finder</h1>
          </div>

          <nav className="space-y-4">
            {steps.map((s, idx) => {
              const isActive = step === s.id;
              const isPast = steps.findIndex(x => x.id === step) > idx;
              
              return (
                <div key={s.id} className="flex items-center gap-4 group">
                  <div className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-300
                    ${isActive ? 'bg-emerald-500 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 
                      isPast ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-500' : 'bg-white/5 border-white/10 text-gray-600'}
                  `}>
                    {isPast ? <CheckCircle2 size={24} /> : s.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-emerald-500' : 'text-gray-600'}`}>
                      Step {idx + 1}
                    </span>
                    <span className={`font-bold text-lg ${isActive ? 'text-white' : 'text-gray-500'}`}>
                      {s.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </nav>
        </div>

        {reservation && (
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 animate-in fade-in zoom-in-95 duration-300">
            <p className="text-xs text-emerald-500 font-bold mb-1 uppercase tracking-tighter">検索中の予約</p>
            <p className="font-bold text-lg">{reservation.name}</p>
            <p className="text-sm text-gray-500">{reservation.id}</p>
          </div>
        )}
      </aside>

      {/* 右ペイン: メインコンテンツエリア */}
      <main className="flex-1 relative overflow-y-auto">
        <div className="max-w-4xl mx-auto py-20 px-12">
          {step === 'search' && (
            <ReservationSearch onNext={handleReservationFound} />
          )}

          {step === 'identity' && (
            <IdentityVerification onNext={handleIdentityCaptured} />
          )}

          {step === 'form' && (
            <RegistrationForm 
              reservation={reservation} 
              onNext={handleFormSubmitted} 
            />
          )}

          {step === 'payment' && (
            <div className="text-center space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-3xl font-bold">精算を行ってください</h2>
              <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
                {['クレジットカード', 'QR決済', 'PayPay', '現金'].map((method) => (
                  <button 
                    key={method}
                    onClick={() => setStep('complete')}
                    className="p-10 bg-white/5 border-2 border-white/10 rounded-[32px] hover:border-emerald-500 hover:bg-emerald-500/10 transition-all flex flex-col items-center gap-4"
                  >
                    <CreditCard size={48} className="text-emerald-500" />
                    <span className="text-xl font-bold">{method}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'complete' && (
            <div className="text-center space-y-8 animate-in fade-in zoom-in-95 duration-500 py-12">
              <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(16,185,129,0.4)]">
                <CheckCircle2 size={64} className="text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold mb-4">チェックイン完了</h2>
                <p className="text-xl text-gray-400">ごゆっくりお過ごしください</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] max-w-md mx-auto">
                <p className="text-gray-500 mb-2">お部屋番号 / 鍵番号</p>
                <p className="text-6xl font-black text-emerald-500 tracking-tighter">302 / 8824</p>
              </div>
              <button 
                onClick={() => {
                  setStep('search');
                  setReservation(null);
                }}
                className="px-12 py-6 bg-emerald-500 rounded-2xl text-2xl font-bold"
              >
                TOPに戻る
              </button>
            </div>
          )}
        </div>

        {/* フッター操作 (オプション) */}
        <div className="absolute bottom-12 left-12 right-12 flex justify-between items-center pointer-events-none">
          <button 
            onClick={() => setStep('search')}
            className={`pointer-events-auto px-8 py-4 rounded-xl font-bold border border-white/10 bg-white/5 hover:bg-white/10 transition-colors ${step === 'search' ? 'invisible' : ''}`}
          >
            戻る
          </button>
        </div>
      </main>
    </div>
  );
};

export default StayseeAppPage;
