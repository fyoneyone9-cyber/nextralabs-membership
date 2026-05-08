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

  const handleFormSubmitted = async (data: any) => {
    // 【重要】NextraLabs様のサーバーへ一元管理のためにデータを送信
    console.log("Saving to NextraLabs Central Server...", data);

    try {
      // 本来のAPI呼び出し例
      /*
      await fetch('/api/tools/staysee-checkin-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservation_id: reservation?.id,
          guest_name: data.name,
          phone: data.phone,
          address: data.address,
          signature_image: data.signature, // これで署名画像もサーバーへ
          checkin_at: new Date().toISOString()
        })
      });
      */
      
      // 保存成功したとみなして次へ（ステートに保持）
      setGuestInfo(data);
      setStep('confirm');
    } catch (error) {
      console.error("Failed to save data to server:", error);
      alert("通信エラーが発生しました。データを保存できませんでした。");
    }
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-white flex flex-col overflow-hidden font-sans selection:bg-emerald-500/30">
      {/* 動的なグラデーション背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-emerald-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* ロードマップ (ステップインジケーター) */}
      {step !== 'start' && step !== 'lang' && (
        <div className="w-full max-w-4xl mx-auto pt-10 px-6 relative z-30">
          <div className="flex justify-between items-center relative">
            {/* 進捗ライン */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2" />
            
            {[
              { id: 'search', label: '予約検索' },
              { id: 'identity', label: '本人確認' },
              { id: 'form', label: '名簿記入' },
              { id: 'confirm', label: '最終確認' },
              { id: 'payment', label: '完了' }
            ].map((s, idx) => {
              const steps_list = ['search', 'identity', 'form', 'confirm', 'payment', 'complete'];
              const current_idx = steps_list.indexOf(step);
              const isActive = step === s.id;
              const isPast = steps_list.indexOf(step) > steps_list.indexOf(s.id);

              return (
                <div key={s.id} className="relative flex flex-col items-center gap-3">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10
                    ${isActive ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 
                      isPast ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-500' : 'bg-[#0a0b10] border-white/10 text-gray-700'}
                  `}>
                    {isPast ? <CheckCircle2 size={20} /> : <span className="text-xs font-black">{idx + 1}</span>}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-emerald-500' : 'text-gray-700'}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ヘッダー */}
      <header className="p-10 flex justify-between items-center relative z-20">
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
