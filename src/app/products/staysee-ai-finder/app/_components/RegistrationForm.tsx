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
    address: '',
    occupation: '',
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
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">宿泊者名簿の記入</h2>
        <p className="text-gray-400">必要事項を入力し、最後にサインをお願いします</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-8 rounded-[40px] border border-white/10">
        {/* 基本情報入力 */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-500 ml-2">
              <User size={16} /> お名前
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-black/20 border-2 border-white/10 rounded-2xl py-4 px-6 text-xl focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-500 ml-2">
              <Phone size={16} /> 電話番号
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-black/20 border-2 border-white/10 rounded-2xl py-4 px-6 text-xl focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-500 ml-2">
              <MapPin size={16} /> ご住所
            </label>
            <input
              type="text"
              placeholder="例：神奈川県海老名市..."
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-black/20 border-2 border-white/10 rounded-2xl py-4 px-6 text-xl focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-500 ml-2">
              <Briefcase size={16} /> 職業
            </label>
            <input
              type="text"
              value={formData.occupation}
              onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
              className="w-full bg-black/20 border-2 border-white/10 rounded-2xl py-4 px-6 text-xl focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* 署名エリア */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-500 ml-2">
            <Edit3 size={16} /> ご署名
          </label>
          <div className="relative bg-white rounded-3xl overflow-hidden h-[300px] border-4 border-white shadow-inner">
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
              className="absolute top-4 right-4 p-3 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
            >
              <Trash2 size={20} />
            </button>
            {formData.isSignatureEmpty && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <p className="text-black text-2xl font-bold border-2 border-dashed border-black/30 p-8 rounded-2xl">
                  ここにサインしてください
                </p>
              </div>
            )}
          </div>
          <p className="text-center text-sm text-gray-500">
            ※枠内に指またはペンで署名してください
          </p>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={formData.isSignatureEmpty || !formData.address}
        className={`
          w-full py-6 rounded-2xl text-2xl font-bold transition-all shadow-lg
          ${formData.isSignatureEmpty || !formData.address
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
            : 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-emerald-500/20'}
        `}
      >
        記入内容を確認して次へ進む
      </button>
    </div>
  );
};

export default RegistrationForm;
