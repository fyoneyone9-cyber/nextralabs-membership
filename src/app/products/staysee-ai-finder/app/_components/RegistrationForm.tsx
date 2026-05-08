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
    <div className="space-y-20 animate-in fade-in slide-in-from-bottom-12 duration-1000 pb-40">
      <div className="text-center space-y-6">
        <h1 className="text-7xl font-black tracking-tighter italic">REGISTRATION</h1>
        <p className="text-gray-500 text-xl font-bold tracking-[0.6em] uppercase">宿泊者名簿のご記入をお願いします</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* 基本情報入力 - 画像の重厚なカード感を再現 */}
        <div className="lg:col-span-3 space-y-10 bg-black/40 backdrop-blur-3xl border border-white/5 p-16 rounded-[60px] shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-xs font-black text-emerald-500/40 uppercase tracking-[0.3em] ml-2">
                <User size={14} strokeWidth={3} /> Full Name / お名前
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#12141c] border-2 border-white/5 rounded-3xl py-8 px-10 text-4xl font-black tracking-tighter focus:border-emerald-500/30 focus:outline-none transition-all text-white overflow-hidden text-ellipsis"
              />
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-xs font-black text-emerald-500/40 uppercase tracking-[0.3em] ml-2">
                <Phone size={14} strokeWidth={3} /> Phone / 電話番号
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#12141c] border-2 border-white/5 rounded-3xl py-8 px-10 text-4xl font-black tracking-tighter focus:border-emerald-500/30 focus:outline-none transition-all text-white overflow-hidden text-ellipsis"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-2 text-xs font-black text-emerald-500/40 uppercase tracking-[0.3em] ml-2">
              <MapPin size={14} strokeWidth={3} /> Address / ご住所
            </label>
            <textarea
              placeholder="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={4}
              className="w-full bg-[#12141c] border-2 border-white/5 rounded-4xl py-8 px-10 text-4xl font-black tracking-tight focus:border-emerald-500/30 focus:outline-none transition-all text-white placeholder:text-gray-800 resize-none min-h-[250px]"
            />
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-2 text-xs font-black text-emerald-500/40 uppercase tracking-[0.3em] ml-2">
              <Briefcase size={14} strokeWidth={3} /> Occupation / 職業
            </label>
            <input
              type="text"
              value={formData.occupation}
              onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
              className="w-full bg-[#12141c] border-2 border-white/5 rounded-3xl py-8 px-10 text-3xl font-black tracking-tight focus:border-emerald-500/30 focus:outline-none transition-all text-white overflow-hidden text-ellipsis"
            />
          </div>
        </div>

        {/* 署名エリア - 白いエリアの角丸を強調 */}
        <div className="lg:col-span-2">
          <div className="bg-black/40 backdrop-blur-3xl border border-white/5 p-12 rounded-[60px] flex flex-col h-full shadow-2xl relative">
            <label className="flex items-center gap-2 text-xs font-black text-emerald-500/40 uppercase tracking-[0.3em] mb-10">
              <Edit3 size={14} strokeWidth={3} /> Signature / ご署名
            </label>
            <div className="relative flex-1 bg-white rounded-[50px] overflow-hidden min-h-[450px] shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]">
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
                className="absolute top-8 right-8 p-5 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-xl z-20"
              >
                <Trash2 size={28} strokeWidth={2.5} />
              </button>
              {formData.isSignatureEmpty && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05]">
                  <p className="text-black text-6xl font-black italic tracking-tighter">Sign Here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full pt-10">
        <button
          onClick={handleSubmit}
          disabled={formData.isSignatureEmpty || !formData.address}
          className={`
            w-full py-14 rounded-[50px] text-5xl font-black tracking-[0.4em] transition-all shadow-2xl active:scale-[0.98]
            ${formData.isSignatureEmpty || !formData.address
              ? 'bg-white/5 text-gray-800 cursor-not-allowed border border-white/5'
              : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/40 border-b-8 border-emerald-700'}
          `}
        >
          CONFIRM & NEXT
        </button>
      </div>
    </div>
  );
};

export default RegistrationForm;
