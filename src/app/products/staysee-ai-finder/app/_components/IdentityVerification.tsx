'use client';

import React, { useRef, useState } from 'react';
import { Camera, RefreshCw, Check, AlertCircle } from 'lucide-react';
import Webcam from 'react-webcam';

interface IdentityVerificationProps {
  onNext: (imageData: string) => void;
}

const IdentityVerification: React.FC<IdentityVerificationProps> = ({ onNext }) => {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [mode, setMode] = useState<'face' | 'document'>('face');

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
    }
  }, [webcamRef]);

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleConfirm = () => {
    if (capturedImage) {
      if (mode === 'face') {
        setMode('document');
        setCapturedImage(null);
      } else {
        onNext(capturedImage);
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">
          {mode === 'face' ? '顔写真を撮影します' : '本人確認書類を撮影してください'}
        </h2>
        <p className="text-gray-400">
          {mode === 'face' 
            ? '枠内に顔が収まるようにしてください' 
            : '運転免許証やパスポートをカメラにかざしてください'}
        </p>
      </div>

      <div className="max-w-2xl mx-auto relative">
        {!capturedImage ? (
          <div className="relative aspect-video bg-black/40 rounded-[40px] border-4 border-white/10 overflow-hidden group">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-cover"
              videoConstraints={{
                facingMode: "user",
                width: 1280,
                height: 720
              }}
            />
            {/* ガイド枠 */}
            <div className={`
              absolute inset-0 border-2 border-dashed pointer-events-none flex items-center justify-center
              ${mode === 'face' ? 'border-emerald-500/50 m-20 rounded-full' : 'border-emerald-500/50 m-12 rounded-3xl'}
            `}>
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold animate-pulse">
                SCANNING...
              </div>
            </div>
            
            <button
              onClick={capture}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-full border-8 border-emerald-500/30 flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
            >
              <div className="w-12 h-12 bg-emerald-500 rounded-full shadow-lg" />
            </button>
          </div>
        ) : (
          <div className="relative aspect-video rounded-[40px] border-4 border-emerald-500 overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.2)]">
            <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center">
              <div className="bg-emerald-500 text-white p-4 rounded-full">
                <Check size={48} />
              </div>
            </div>
          </div>
        )}
      </div>

      {capturedImage && (
        <div className="flex gap-4 max-w-2xl mx-auto">
          <button
            onClick={handleRetake}
            className="flex-1 py-6 bg-white/5 border border-white/10 rounded-2xl text-xl font-bold flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
          >
            <RefreshCw size={24} />
            撮り直す
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-6 bg-emerald-500 rounded-2xl text-xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all"
          >
            {mode === 'face' ? '次に進む' : '確認完了'}
            <Check size={24} />
          </button>
        </div>
      )}

      <div className="max-w-xl mx-auto flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-500">
        <AlertCircle size={20} className="shrink-0 mt-1" />
        <p className="text-sm">
          光の反射に注意し、文字がはっきりと読み取れる状態で撮影してください。
        </p>
      </div>
    </div>
  );
};

export default IdentityVerification;
