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
import { CreditCard, CheckCircle2, ShieldCheck, Zap, Info, ClipboardPaste, MessageSquare } from 'lucide-react';
import { shrinkImageForAi } from '@/lib/ai-saver';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

type Step = 'start' | 'lang' | 'type' | 'search' | 'identity' | 'form' | 'confirm' | 'payment' | 'complete';

const TRANSLATIONS: any = {
  ja: { search: '予約検索', identity: '本人確認', form: '名簿記入', confirm: '最終確認', payment: '完了', restart: '最初からやり直す', finish: '完了しました', welcome: 'ありがとうございました', room: 'お部屋番号 / 鍵番号', back: 'TOPへ戻る', checkin_finish: 'チェックイン完了', checkout_finish: 'チェックアウト完了', welcome_in: 'ごゆっくりお過ごしください', welcome_out: 'お気をつけてお帰りください', staff: 'スタッフをお呼びください', copy_prompt: '戦略指示をコピー', guide: '使いかた・活用マニュアル' },
  en: { search: 'Search', identity: 'Verify', form: 'Register', confirm: 'Confirm', payment: 'Finish', restart: 'Restart', finish: 'Complete', welcome: 'Thank you', room: 'Room / Key Number', back: 'Back to Top', checkin_finish: 'Check-in Complete', checkout_finish: 'Check-out Complete', welcome_in: 'Have a pleasant stay', welcome_out: 'Have a safe trip!', staff: 'Please call staff', copy_prompt: 'Copy Prompt', guide: 'User Guide' },
};

const StayseeAppPage = () => {
  const router = useRouter();
  const [step, setStep] = useState<Step>('start');
  const [type, setType] = useState<'checkin' | 'checkout'>('checkin');
  const [selectedLang, setSelectedLang] = useState('ja');
  const [reservation, setReservation] = useState<any>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [guestInfo, setGuestInfo] = useState<any>(null);

  const t = TRANSLATIONS[selectedLang] || TRANSLATIONS['ja'];

  const handleReservationFound = (data: any) => {
    setReservation(data);
    setStep(type === 'checkout' ? 'confirm' : 'identity');
  };

  const handleIdentityCaptured = async (image: string) => {
    const slimImage = await shrinkImageForAi(image, 600);
    setCapturedImage(slimImage);
    setStep('form');
  };

  const handleFormSubmitted = async (data: any) => {
    if (data.signature) data.signature = await shrinkImageForAi(data.signature, 400);
    setGuestInfo(data);
    setStep('confirm');
  };

  const copyStrategicPrompt = () => {
    const prompt = `あなたはホテル経営コンサルタントです。以下の宿泊客（${reservation?.name_kanji}様）の属性に基づき、顧客満足度を最大化するパーソナライズされたおもてなしプランを策定してください。`;
    navigator.clipboard.writeText(prompt);
    alert('戦略指示（プロンプト）をコピーしました。');
  };

  const openAI = (name: string) => {
    window.open(name === 'ChatGPT' ? 'https://chatgpt.com' : name === 'Gemini' ? 'https://gemini.google.com' : 'https://claude.ai', '_blank');
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-white flex flex-col font-sans selection:bg-emerald-500/30 text-left border-4 border-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.2)]">
      <header className="p-12 flex justify-between items-center relative z-20 border-b border-white/5">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-[24px] flex items-center justify-center shadow-2xl">
            <span className="font-black text-5xl italic">N</span>
          </div>
          <div>
            <span className="font-black text-4xl tracking-tighter leading-none block">NEXTRA AI</span>
            <span className="text-xs font-bold text-emerald-500 tracking-[0.5em] mt-2 uppercase italic">Hospitality Intelligence OS</span>
          </div>
        </div>
        <Badge className="bg-emerald-600 text-slate-950 font-black px-6 py-2 rounded-full shadow-lg">MASTERMODEL v2.9.3</Badge>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-10 py-20 relative">
        <div className="w-full max-w-6xl space-y-12">
          
          {/* 活用マニュアル（巨大化） */}
          {step === 'start' && (
            <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 space-y-6 shadow-inner border-l-8 border-l-emerald-500 max-w-4xl mx-auto">
              <div className="flex items-center gap-4 text-emerald-400"><Info size={32} /> <h3 className="font-black italic uppercase text-2xl">{t.guide}</h3></div>
              <p className="text-xl text-slate-200 font-black leading-relaxed italic">
                本システムは「Staysee」と「RemoteLock」をAIで神経接続した実務エンジンです。画面の指示に従い、予約検索・本人確認を行ってください。AIが法的な宿泊名簿を自動生成し、解錠キーを即座に発行します。
              </p>
            </div>
          )}

          {step === 'start' && <StartScreen onNext={() => setStep('lang')} />}
          {step === 'lang' && <LanguageSelect onNext={(lang: string) => { setSelectedLang(lang); setStep('type'); }} />}
          {step === 'type' && <CheckInOutSelect onNext={(selectedType: string) => { setType(selectedType as any); setStep('search'); }} />}
          {step === 'search' && <ReservationSearch lang={selectedLang} onFound={handleReservationFound} />}
          {step === 'identity' && <IdentityVerification lang={selectedLang} onCaptured={handleIdentityCaptured} />}
          {step === 'form' && <RegistrationForm lang={selectedLang} onSubmit={handleFormSubmitted} />}
          {step === 'confirm' && (
            <div className="space-y-8">
              <FinalConfirmation lang={selectedLang} type={type} reservation={reservation} capturedImage={capturedImage} guestInfo={guestInfo} onComplete={() => setStep('complete')} />
              
              {/* 3大AI・プロンプトコピー (完全復旧) */}
              <div className="bg-[#13141f] border-2 border-white/10 rounded-[3rem] p-12 space-y-8 shadow-2xl text-center max-w-4xl mx-auto">
                 <h3 className="text-xl font-black text-white italic uppercase tracking-widest flex items-center justify-center gap-3">
                   <MessageSquare className="text-blue-400" /> Strategic AI Extension
                 </h3>
                 <div className="grid grid-cols-3 gap-4">
                   {['ChatGPT', 'Gemini', 'Claude'].map(ai => (
                     <Button key={ai} onClick={() => openAI(ai)} className="h-16 bg-white/5 border border-white/10 text-slate-400 font-black italic rounded-2xl hover:text-white uppercase">Consult with {ai}</Button>
                   ))}
                 </div>
                 <Button onClick={copyStrategicPrompt} className="h-20 w-full bg-white text-slate-950 font-black text-2xl rounded-2xl shadow-xl hover:scale-105 transition-all italic flex items-center justify-center gap-3">
                   <ClipboardPaste size={28} /> {t.copy_prompt}
                 </Button>
              </div>
            </div>
          )}
          
          {step === 'complete' && (
            <div className="text-center space-y-12 animate-in zoom-in duration-500">
              <div className="w-40 h-40 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_80px_rgba(16,185,129,0.5)] border-8 border-white/20">
                <CheckCircle2 className="w-24 h-24 text-slate-950" />
              </div>
              <div className="space-y-4">
                <h2 className="text-7xl font-black italic uppercase tracking-tighter text-white">{type === 'checkin' ? t.checkin_finish : t.checkout_finish}</h2>
                <p className="text-3xl text-emerald-400 font-black italic">{type === 'checkin' ? t.welcome_in : t.welcome_out}</p>
              </div>
              <div className="bg-white/5 border-4 border-emerald-500 rounded-[4rem] p-16 max-w-3xl mx-auto shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5"><Zap size={200} className="text-emerald-500" /></div>
                <p className="text-xl font-black text-slate-500 uppercase tracking-widest mb-6 italic">{t.room}</p>
                <p className="text-9xl font-black text-white tracking-widest italic drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">{reservation?.room_number || '301'}</p>
              </div>
              <button onClick={() => setStep('start')} className="px-20 py-8 bg-white/5 hover:bg-white/10 rounded-[2rem] font-black italic text-2xl text-slate-400 hover:text-white transition-all uppercase tracking-widest border-2 border-white/10 shadow-xl">
                {t.restart}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StayseeAppPage;
