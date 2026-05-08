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
  ja: { search: '予約検索', identity: '本人確認', form: '名簿記入', confirm: '最終確認', payment: '完了', restart: '最初からやり直す', finish: 'チェックイン完了', welcome: 'ごゆっくりお過ごしください', room: 'お部屋番号 / 鍵番号', back: 'TOPへ戻る' },
  en: { search: 'Search', identity: 'Verify', form: 'Register', confirm: 'Confirm', payment: 'Finish', restart: 'Restart', finish: 'Check-in Complete', welcome: 'Have a pleasant stay', room: 'Room / Key Number', back: 'Back to Top' },
  'zh-cn': { search: '搜索预约', identity: '身份验证', form: '填写登记', confirm: '最终确认', payment: '完成', restart: '重新开始', finish: '入住完成', welcome: '祝您入住愉快', room: '房号 / 钥匙号码', back: '返回首页' },
  'zh-tw': { search: '搜尋預約', identity: '身份驗證', form: '填寫登記', confirm: '最終確認', payment: '完成', restart: '重新開始', finish: '入住完成', welcome: '祝您入住愉快', room: '房號 / 鑰匙號碼', back: '返回首頁' },
  ko: { search: '예약 검색', identity: '본인 확인', form: '명부 작성', confirm: '최종 확인', payment: '완료', restart: '처음부터', finish: '체크イン 완료', welcome: '편안한 시간 되세요', room: '객실 번호 / 키 번호', back: 'TOP으로' },
  th: { search: 'ค้นหา', identity: 'ยืนยันตัวตน', form: 'ลงทะเบียน', confirm: 'ยืนยัน', payment: 'เสร็จสิ้น', restart: 'เริ่มใหม่', finish: 'เช็คอินเสร็จสมบูรณ์', welcome: 'ขอให้มีความสุขกับการพักผ่อน', room: 'หมายเลขห้อง / รหัสผ่าน', back: 'กลับสู่หน้าแรก' },
  vi: { search: 'Tìm kiếm', identity: 'Xác minh', form: 'Đăng ký', confirm: 'Xác nhận', payment: 'Hoàn tất', restart: 'Bắt đầu lại', finish: 'Nhận phòng hoàn tất', welcome: 'Chúc quý khách một kỳ nghỉ vui vẻ', room: 'Số phòng / Mã khóa', back: 'Quay lại' },
  id: { search: 'Cari Reservasi', identity: 'Verifikasi', form: 'Registrasi', confirm: 'Konfirmasi', payment: 'Selesai', restart: 'Mulai Ulang', finish: 'Check-in Selesai', welcome: 'Semoga istirahat Anda menyenangkan', room: 'Nomor Kamar / PIN', back: 'Kembali' },
  fr: { search: 'Rechercher', identity: 'Vérifier', form: "S'enregistrer", confirm: 'Confirmer', payment: 'Terminer', restart: 'Redémarrer', finish: 'Enregistrement terminé', welcome: 'Passez un bon séjour', room: 'Numéro de chambre / Code', back: 'Retour' },
  es: { search: 'Buscar', identity: 'Verificar', form: 'Registrarse', confirm: 'Confirmar', payment: 'Finalizar', restart: 'Reiniciar', finish: 'Check-in completado', welcome: 'Que tenga una buena estancia', room: 'Número de habitación / Clave', back: 'Volver' },
  de: { search: 'Suchen', identity: 'Verifizieren', form: 'Registrieren', confirm: 'Bestätigen', payment: 'Fertig', restart: 'Neustart', finish: 'Check-in abgeschlossen', welcome: 'Genießen Sie Ihren Aufenthalt', room: 'Zimmernummer / Code', back: 'Zurück' },
  it: { search: 'Cerca', identity: 'Verifica', form: 'Registrati', confirm: 'Conferma', payment: 'Fine', restart: 'Riavvia', finish: 'Check-in completato', welcome: 'Goditi il soggiorno', room: 'Numero camera / Chiave', back: 'Torna su' },
  pt: { search: 'Buscar', identity: 'Verificar', form: 'Registrar', confirm: 'Confirmar', payment: 'Concluir', restart: 'Reiniciar', finish: 'Check-in concluído', welcome: 'Tenha uma boa estadia', room: 'Número do quarto / Chave', back: 'Voltar' },
  ru: { search: 'Поиск', identity: 'Проверка', form: 'Регистрация', confirm: 'Подтвердить', payment: 'Готово', restart: 'Начать сначала', finish: 'Регистрация завершена', welcome: 'Приятного отдыха', room: 'Номер комнаты / Код', back: 'На главную' },
  ar: { search: 'بحث', identity: 'تحقق', form: 'تسجيل', confirm: 'تأكيد', payment: 'إنهاء', restart: 'إعادة تشغيل', finish: 'اكتمل تسجيل الدخول', welcome: 'إقامة سعيدة', room: 'رقم الغرفة / رمز القفل', back: 'العودة' },
  hi: { search: 'खोजें', identity: 'सत्यापन', form: 'पंजीकरण', confirm: 'पुष्टि करें', payment: 'समाप्त', restart: 'पुनः आरंभ करें', finish: 'चेクイン पूरा हुआ', welcome: 'आपका प्रवास सुखद हो', room: 'कमरा नंबर / कोड', back: 'वापस जाएं' },
};

const StayseeAppPage = () => {
  const router = useRouter();
  const [isKioskMode, setIsKioskMode] = useState(false);
  const [step, setStep] = useState<Step>('start');
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
    setStep('identity');
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
          <div className="flex flex-col">
            <span className="font-black text-3xl tracking-tighter leading-none">NEXTRA AI</span>
            <span className="text-xs font-bold text-emerald-500 tracking-[0.5em] mt-2">CHECK-IN SYSTEM</span>
            {step !== 'start' && (
              <button
                onClick={() => setStep('start')}
                className="mt-6 group flex items-center gap-3 px-8 py-3 bg-white/5 hover:bg-white/10 border-2 border-white/10 rounded-full text-lg font-black transition-all w-fit"
              >
                <div className="w-3 h-3 bg-red-500 rounded-full group-hover:animate-ping" />
                {t.restart}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-10 pb-40 relative">
        <div className="w-full max-w-6xl">
          {step === 'start' && <StartScreen onNext={() => setStep('lang')} />}
          {step === 'lang' && <LanguageSelect onNext={(lang: string) => { setSelectedLang(lang); setStep('type'); }} />}
          {step === 'type' && <CheckInOutSelect onNext={(type: string) => type === 'checkin' ? setStep('search') : alert('Coming Soon')} />}
          {step === 'search' && <ReservationSearch onNext={handleReservationFound} />}
          {step === 'identity' && <IdentityVerification onNext={handleIdentityCaptured} />}
          {step === 'form' && <RegistrationForm reservation={reservation} onNext={handleFormSubmitted} />}
          {step === 'confirm' && (
            <FinalConfirmation 
              reservation={reservation} 
              guestInfo={guestInfo} 
              onNext={() => {
                if (reservation?.isPaid || reservation?.amount === 0) {
                  setStep('complete');
                } else {
                  setStep('payment');
                }
              }} 
            />
          )}
          {step === 'payment' && (
            <div className="text-center space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-4xl font-bold">Please Payment</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {['Credit Card', 'QR', 'PayPay', 'Cash'].map((method) => (
                  <button key={method} onClick={() => setStep('complete')} className="p-8 bg-white text-slate-800 rounded-[32px] hover:bg-emerald-50 transition-all flex flex-col items-center gap-4 shadow-xl">
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
                <h2 className="text-5xl font-black mb-4 tracking-tight">{t.finish}</h2>
                <p className="text-xl opacity-80 uppercase tracking-widest">Registration Complete</p>
              </div>
              <div className="bg-white rounded-[40px] p-10 max-w-md mx-auto shadow-2xl text-slate-800">
                <p className="text-slate-400 font-bold mb-2 uppercase tracking-widest text-sm">{t.room}</p>
                <p className="text-7xl font-black text-emerald-500 tracking-tighter">302 / 8824</p>
              </div>
              <p className="text-xl">{t.welcome}</p>
              <button onClick={() => setStep('start')} className="px-16 py-6 bg-white text-slate-900 rounded-full text-2xl font-black shadow-xl hover:scale-105 transition-transform">{t.back}</button>
            </div>
          )}
        </div>

        {step !== 'start' && step !== 'lang' && step !== 'type' && step !== 'complete' && (
          <div className="absolute bottom-10 left-0 right-0 w-full max-w-7xl mx-auto px-10 z-30">
            <div className="flex justify-between items-center relative">
              <div className="absolute top-10 left-0 w-full h-2 bg-white/5 rounded-full" />
              <div
                className="absolute top-10 left-0 h-2 bg-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                style={{ width: `${(['search', 'identity', 'form', 'confirm', 'payment'].indexOf(step) / 4) * 100}%` }}
              />
              {[
                { id: 'search', label: t.search },
                { id: 'identity', label: t.identity },
                { id: 'form', label: t.form },
                { id: 'confirm', label: t.confirm },
                { id: 'payment', label: t.payment },
              ].map((s, idx) => {
                const steps_list = ['search', 'identity', 'form', 'confirm', 'payment', 'complete'];
                const isActive = step === s.id;
                const isPast = steps_list.indexOf(step) > steps_list.indexOf(s.id);
                const displayLabel = (s.id === 'payment' && (reservation?.isPaid || reservation?.amount === 0)) ? t.payment : s.label;
                
                return (
                  <div key={s.id} className="relative flex flex-col items-center gap-6 group">
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center border-4 transition-all duration-700 z-10 ${
                      isActive ? 'bg-emerald-500 border-emerald-300 text-white scale-110 shadow-[0_0_40px_rgba(16,185,129,0.7)]' :
                      isPast ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-500' : 'bg-[#050508] border-white/10 text-gray-800'
                    }`}>
                      {isPast ? <CheckCircle2 size={40} strokeWidth={3} /> : <span className="text-3xl font-black">{idx + 1}</span>}
                    </div>
                    <div className="flex flex-col items-center">
                      <span className={`text-[12px] font-black uppercase tracking-[0.3em] transition-colors duration-500 ${isActive ? 'text-emerald-400' : isPast ? 'text-emerald-500/60' : 'text-gray-800'}`}>
                        STEP {idx + 1}
                      </span>
                      <span className={`text-xl font-black mt-1 transition-all duration-500 ${isActive ? 'text-white text-2xl' : 'text-gray-700'}`}>
                        {displayLabel}
                      </span>
                    </div>
                    {isActive && <div className="absolute -top-4 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <footer className="p-8 text-center opacity-30 text-xs">
        <p>© 2026 NextraLabs x Staysee. v3.22.9</p>
      </footer>
    </div>
  );
};

export default StayseeAppPage;
