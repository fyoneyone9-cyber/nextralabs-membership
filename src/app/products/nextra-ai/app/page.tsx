'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReservationSearch from './_components/ReservationSearch';
import IdentityVerification from './_components/IdentityVerification';
import RegistrationForm from './_components/RegistrationForm';
import StartScreen from './_components/StartScreen';
import LanguageSelect from './_components/LanguageSelect';
import CheckInOutSelect from './_components/CheckInOutSelect';
import FinalConfirmation from './_components/FinalConfirmation';
import { CreditCard, CheckCircle2 } from 'lucide-react';
import { shrinkImageForAi } from '@/lib/ai-saver';

type Step = 'start' | 'lang' | 'type' | 'search' | 'identity' | 'form' | 'confirm' | 'payment' | 'complete';

const TRANSLATIONS: any = {
  ja: { search: '予約検索', identity: '本人確認', form: '名簿記入', confirm: '最終確認', payment: '完了', restart: '最初からやり直す', finish: '完了しました', welcome: 'ありがとうございました', room: 'お部屋番号 / 鍵番号', back: 'TOPへ戻る', checkin_finish: 'チェックイン完了', checkout_finish: 'チェックアウト完了', welcome_in: 'ごゆっくりお過ごしください', welcome_out: 'お気をつけてお帰りください', staff: 'スタッフをお呼びください' },
  en: { search: 'Search', identity: 'Verify', form: 'Register', confirm: 'Confirm', payment: 'Finish', restart: 'Restart', finish: 'Complete', welcome: 'Thank you', room: 'Room / Key Number', back: 'Back to Top', checkin_finish: 'Check-in Complete', checkout_finish: 'Check-out Complete', welcome_in: 'Have a pleasant stay', welcome_out: 'Have a safe trip!', staff: 'Please call staff' },
};

const NextraAiAppPage = () => {
  const router = useRouter();
  const [isKioskMode, setIsKioskMode] = useState(false);
  const [step, setStep] = useState<Step>('start');
  const [type, setType] = useState<'checkin' | 'checkout'>('checkin');
  const [selectedLang, setSelectedLang] = useState('ja');
  const [reservation, setReservation] = useState<any>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [guestInfo, setGuestInfo] = useState<any>(null);

  useEffect(() => {
    const checkKiosk = async () => {
      setIsKioskMode(true);
      const style = document.createElement('style');
      style.id = 'kiosk-mode-style';
      style.innerHTML = `
        header, footer, nav { display: none !important; }
        #debug-panel-trigger { display: none !important; }
      `;
      document.head.appendChild(style);
    };
    checkKiosk();
    return () => {
      const style = document.getElementById('kiosk-mode-style');
      if (style) style.remove();
    };
  }, []);

  const t = TRANSLATIONS[selectedLang] || TRANSLATIONS['ja'];

  const handleReservationFound = (data: any) => {
    setReservation(data);
    if (type === 'checkout') {
      setStep('confirm');
    } else {
      setStep('identity');
    }
  };

  const handleIdentityCaptured = async (image: string) => {
    const slimImage = await shrinkImageForAi(image, 600);
    setCapturedImage(slimImage);
    setStep('form');
  };

  const handleFormSubmitted = async (data: any) => {
    if (data.signature) {
      data.signature = await shrinkImageForAi(data.signature, 400);
    }
    setGuestInfo(data);
    setStep('confirm');
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-white flex flex-col overflow-hidden font-sans selection:bg-emerald-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-emerald-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <header className="p-12 flex justify-between items-start relative z-20">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-[24px] flex items-center justify-center shadow-2xl shadow-emerald-500/30">
            <span className="font-black text-4xl italic">N</span>
          </div>
          <div className="flex flex-col text-left">
            <span className="font-black text-3xl tracking-tighter leading-none">NEXTRA AI</span>
            <span className="text-xs font-bold text-emerald-500 tracking-[0.5em] mt-2 text-left">CHECK-IN SYSTEM</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-10 pb-40 relative">
        <div className="w-full max-w-7xl">
          {step === 'start' && <StartScreen onNext={() => setStep('lang')} />}
          {step === 'lang' && <LanguageSelect onNext={(lang: string) => { setSelectedLang(lang); setStep('type'); }} />}
          {step === 'type' && <CheckInOutSelect onNext={(selectedType: string) => { 
            setType(selectedType as 'checkin' | 'checkout');
            setStep('search');
          }} />}
          {step === 'search' && <ReservationSearch lang={selectedLang} onFound={handleReservationFound} />}
          {step === 'identity' && <IdentityVerification lang={selectedLang} onCaptured={handleIdentityCaptured} />}
          {step === 'form' && <RegistrationForm lang={selectedLang} onSubmit={handleFormSubmitted} />}
          {step === 'confirm' && <FinalConfirmation lang={selectedLang} type={type} reservation={reservation} capturedImage={capturedImage} guestInfo={guestInfo} onComplete={() => setStep('complete')} />}
          
          {step === 'complete' && (
            <div className="text-center space-y-12 animate-in zoom-in duration-500">
              <div className="flex justify-center">
                <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.5)]">
                  <CheckCircle2 className="w-20 h-20 text-slate-950" />
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-6xl font-black italic uppercase tracking-tighter">{type === 'checkin' ? t.checkin_finish : t.checkout_finish}</h2>
                <p className="text-2xl text-emerald-400 font-bold italic">{type === 'checkin' ? t.welcome_in : t.welcome_out}</p>
              </div>
              <div className="bg-white/5 border-2 border-emerald-500/30 rounded-[3rem] p-10 max-w-2xl mx-auto">
                <p className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">{t.room}</p>
                <p className="text-7xl font-black text-white tracking-widest italic">{reservation?.room_number || '301'}</p>
              </div>
              <button onClick={() => setStep('start')} className="px-12 py-6 bg-white/10 hover:bg-white/20 rounded-2xl font-black italic text-slate-400 hover:text-white transition-all uppercase tracking-widest border border-white/10">
                {t.restart}
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Progress Stepper */}
      {step !== 'start' && step !== 'lang' && step !== 'complete' && (
        <footer className="fixed bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-black to-transparent z-20">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            {['search', 'identity', 'form', 'confirm', 'payment'].map((s, i) => {
              const steps = ['search', 'identity', 'form', 'confirm', 'payment'];
              const currentIndex = steps.indexOf(step);
              const isActive = i <= currentIndex;
              return (
                <React.Fragment key={s}>
                  <div className="flex flex-col items-center gap-3">
                    <div className={`w-4 h-4 rounded-full transition-all duration-500 ${isActive ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] scale-125' : 'bg-slate-800'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-500 ${isActive ? 'text-emerald-500' : 'text-slate-600'}`}>{t[s] || s}</span>
                  </div>
                  {i < 4 && <div className={`flex-1 h-[2px] mx-4 transition-colors duration-500 ${i < currentIndex ? 'bg-emerald-500' : 'bg-slate-800'}`} />}
                </React.Fragment>
              );
            })}
          </div>
        </footer>
      )}
    </div>
  );
};

export default NextraAiAppPage;
