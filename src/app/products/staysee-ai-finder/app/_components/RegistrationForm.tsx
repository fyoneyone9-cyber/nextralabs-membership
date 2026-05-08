'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Edit3, Trash2, User, Phone, MapPin, Briefcase } from 'lucide-react';
import dynamic from 'next/dynamic';

// SSRを無効化してSignatureCanvasをロード
const SignatureCanvas = dynamic(() => import('react-signature-canvas'), { ssr: false });

interface RegistrationFormProps {
  reservation: any;
  onNext: (formData: any) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ reservation, onNext }) => {
  const sigCanvas = useRef<any>(null);
  const [formData, setFormData] = useState({
    name: reservation?.name || '',
    phone: reservation?.phone || '',
    email: '',
    address: reservation?.address || '',
    occupation: reservation?.occupation || '',
    isSignatureEmpty: true
  });

  const clearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      setFormData({ ...formData, isSignatureEmpty: true });
    }
  };

  const handleSubmit = () => {
    let signatureData = null;
    if (sigCanvas.current && !formData.isSignatureEmpty) {
      try {
        // getTrimmedCanvas の存在確認をしてから実行
        if (typeof sigCanvas.current.getTrimmedCanvas === 'function') {
          signatureData = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
        }
      } catch (e) {
        console.error("Signature capture error:", e);
      }
    }
    onNext({ ...formData, signature: signatureData });
  };

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-32">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black tracking-tighter">REGISTRATION</h1>
        <p className="text-gray-500 text-lg font-bold tracking-[0.4em] uppercase">宿泊者名簿のご記入をお願いします</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* 基本情報入力 */}
        <div className="lg:col-span-3 space-y-6 bg-white/5 backdrop-blur-2xl border border-white/10 p-12 rounded-[60px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-black text-emerald-500/50 uppercase tracking-widest ml-2">
                <User size={14} /> Full Name / お名前
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/5 border-2 border-white/10 rounded-3xl py-6 px-8 text-2xl font-black focus:border-emerald-500/50 focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-black text-emerald-500/50 uppercase tracking-widest ml-2">
                <Phone size={14} /> Phone / 電話番号
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-white/5 border-2 border-white/10 rounded-3xl py-6 px-8 text-2xl font-black focus:border-emerald-500/50 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-black text-emerald-500/50 uppercase tracking-widest ml-2">
              <MapPin size={14} /> Address / ご住所
            </label>
            <input
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-white/5 border-2 border-white/10 rounded-3xl py-6 px-8 text-2xl font-black focus:border-emerald-500/50 focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-black text-emerald-500/50 uppercase tracking-widest ml-2">
              <Briefcase size={14} /> Occupation / 職業
            </label>
            <input
              type="text"
              value={formData.occupation}
              onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
              className="w-full bg-white/5 border-2 border-white/10 rounded-3xl py-6 px-8 text-2xl font-black focus:border-emerald-500/50 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* 署名エリア */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[60px] flex flex-col h-full">
            <label className="flex items-center gap-2 text-xs font-black text-emerald-500/50 uppercase tracking-widest mb-6">
              <Edit3 size={14} /> Signature / ご署名
            </label>
            <div className="relative flex-1 bg-white rounded-[40px] overflow-hidden min-h-[350px] shadow-2xl">
              <SignatureCanvas
                ref={sigCanvas}
                onBegin={() => setFormData({ ...formData, isSignatureEmpty: false })}
                penColor="black"
                canvasProps={{
                  className: "w-full h-full cursor-crosshair"
                }}
              />
              <button
                onClick={clearSignature}
                className="absolute top-6 right-6 p-4 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-lg"
              >
                <Trash2 size={24} />
              </button>
              {formData.isSignatureEmpty && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                  <p className="text-black text-4xl font-black italic">Sign Here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={formData.isSignatureEmpty || !formData.address}
        className={`
          w-full py-12 rounded-[40px] text-4xl font-black tracking-[0.3em] transition-all shadow-2xl
          ${formData.isSignatureEmpty || !formData.address
            ? 'bg-white/5 text-gray-800 cursor-not-allowed'
            : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/40 active:scale-[0.98]'}
        `}
      >
        CONFIRM & NEXT
      </button>
    </div>
  );
};

export default RegistrationForm;
