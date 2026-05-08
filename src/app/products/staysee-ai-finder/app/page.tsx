'use client';

import React, { useState } from 'react';
import ReservationSearch from './_components/ReservationSearch';
import IdentityVerification from './_components/IdentityVerification';
import RegistrationForm from './_components/RegistrationForm';
import StartScreen from './_components/StartScreen';
import LanguageSelect from './_components/LanguageSelect';
import CheckInOutSelect from './_components/CheckInOutSelect';
import { CreditCard, CheckCircle2 } from 'lucide-react';

type Step = 'start' | 'lang' | 'type' | 'search' | 'identity' | 'form' | 'payment' | 'complete';

const StayseeAppPage = () => {
  const [step, setStep] = useState<Step>('start');
  const [selectedLang, setSelectedLang] = useState('ja');
  const [reservation, setReservation] = useState<any>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(null);

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
    <div className="min-h-screen bg-[#02040a] text-white flex flex-col overflow-hidden font-sans selection:bg-emerald-500/30">
      {/* 動的なグラデーション背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-emerald-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-purple-600/5 blur-[100px] rounded-full" />
      </div>

      {/* ヘッダー */}
      <header className="p-10 flex justify-between items-center relative z-20 backdrop-blur-md bg-black/5 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="font-black text-2xl italic">N</span>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tighter leading-none">NEXTRA AI</span>
            <span className="text-[10px] font-bold text-emerald-500 tracking-[0.4em] mt-1">CHECK-IN SYSTEM</span>
          </div>
        </div>
        {step !== 'start' && (
          <button 
            onClick={() => setStep('start')}
            className="group flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-bold transition-all"
          >
            <div className="w-2 h-2 bg-red-500 rounded-full group-hover:animate-ping" />
            RESET
          </button>
        )}
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-6xl">
          {step === 'start' && (
            <StartScreen onNext={() => setStep('lang')} />
          )}

          {step === 'lang' && (
            <LanguageSelect onNext={(lang) => { setSelectedLang(lang); setStep('type'); }} />
          )}

          {step === 'type' && (
            <CheckInOutSelect onNext={(type) => type === 'checkin' ? setStep('search') : alert('チェックアウトは準備中です')} />
          )}

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

          {step === 'confirm' && (
            <FinalConfirmation
              reservation={reservation}
              guestInfo={guestInfo}
              onNext={() => setStep('payment')}
            />
          )}

          {step === 'payment' && (
            <div className="text-center space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-4xl font-bold">精算を行ってください</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {['クレジットカード', 'QR決済', 'PayPay', '現金'].map((method) => (
                  <button 
                    key={method}
                    onClick={() => setStep('complete')}
                    className="p-8 bg-white text-slate-800 rounded-[32px] hover:bg-emerald-50 transition-all flex flex-col items-center gap-4 shadow-xl"
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
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto shadow-2xl">
                <CheckCircle2 size={64} className="text-emerald-500" />
              </div>
              <div>
                <h2 className="text-5xl font-black mb-4 tracking-tight">チェックイン完了</h2>
                <p className="text-xl opacity-80 uppercase tracking-widest">Registration Complete</p>
              </div>
              <div className="bg-white rounded-[40px] p-10 max-w-md mx-auto shadow-2xl text-slate-800">
                <p className="text-slate-400 font-bold mb-2 uppercase tracking-widest text-sm">Room / Key Number</p>
                <p className="text-7xl font-black text-emerald-500 tracking-tighter">302 / 8824</p>
              </div>
              <p className="text-xl">お部屋の準備が整いました。<br/>キーをお受け取りいただき、ごゆっくりお過ごしください。</p>
              <button 
                onClick={() => setStep('start')}
                className="px-16 py-6 bg-white text-slate-900 rounded-full text-2xl font-black shadow-xl hover:scale-105 transition-transform"
              >
                TOPへ戻る
              </button>
            </div>
          )}
        </div>
      </main>

      {/* フッター */}
      <footer className="p-8 text-center opacity-30 text-xs">
        <p>© 2026 NextraLabs x Staysee. All rights reserved. v3.22.9</p>
      </footer>
    </div>
  );
};

export default StayseeAppPage;
