'use client'
import React, { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Badge } from '@/components/ui/badge'
import { Camera, MapPin, ClipboardPaste, ArrowRight, ShieldCheck, X, ImagePlus } from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const MasterEngine = () => {
  const [isClient, setIsClient] = useState(false);
  const [location, setLocation] = useState<any>(null);
  const [report, setReport] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [weather, setWeather] = useState<any>(null);

  // フォーム
  const [pref, setPref] = useState('');
  const [city, setCity] = useState('');
  const [stock, setStock] = useState('');
  const [housing, setHousing] = useState('');

  // カメラ機能
  const [photos, setPhotos] = useState<string[]>([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // カメラ起動
  const openCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: cameraFacing, width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (e) {
      alert('カメラへのアクセスが拒否されました。設定から許可してください。');
      setIsCameraOpen(false);
    }
  };

  // カメラ停止
  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  // 撮影
  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setPhotos(prev => [...prev, dataUrl]);
    closeCamera();
  };

  // カメラ切り替え（前面/背面）
  const flipCamera = async () => {
    const next: 'environment' | 'user' = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(next);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: next }
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (e) {
      alert('カメラの切り替えに失敗しました。');
    }
  };

  // ファイルから画像選択
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setPhotos(prev => [...prev, ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  // 写真削除
  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const getWeatherData = async (lat: number, lon: number) => {
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
      const data = await res.json();
      setWeather(data.current_weather);
    } catch (e) {
      console.error('Weather fetch error:', e);
    }
  };

  const getMyLocation = () => {
    setIsLocating(true);
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      alert("お使いのブラウザは位置情報に対応していません。");
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(coords);
        getWeatherData(coords.lat, coords.lng);
        setIsLocating(false);
      },
      (err) => {
        console.error(err);
        alert("位置情報の取得に失敗しました。手動で入力してください。");
        setIsLocating(false);
      }
    );
  };

  const FINAL_PROMPT = `あなたはプロの災害対策コンサルタントです。
以下の「公的機関推奨の共通防災知識」と【居住環境データ】に基づき、生存確率を最大化する「生存戦略レポート」を作成してください。

【共通防災知識の鉄則】
1. 生存優先順位「3・3・3の法則」: 3分(呼吸)、3時間(体温)、3日(水)を死守せよ。
2. 家庭内備蓄: 最低3日分、推奨1週間分の水(1人1日3L)と食料。
3. 発災時行動: シェイクアウト(まず低く、頭を守り、動かない)の徹底。
4. 防御策: ブレーカー遮断、ハザードマップ確認、家族間連絡手段(171)の確立。

【居住環境データ】
現在位置（座標）: ${location ? `${location.lat}, ${location.lng}` : "未特定"}
現在の気象: ${weather ? `気温:${weather.temperature}℃, 風速:${weather.windspeed}km/h` : "不明"}
都道府県: ${pref || "未入力"}
市区町村: ${city || "未入力"}
備蓄状況: ${stock || "未入力"}
住居形態: ${housing || "未入力"}
現場写真: ${photos.length > 0 ? `${photos.length}枚の現場写真を撮影済み（周辺環境・建物・備蓄状況等）` : "なし"}

1. 【地域リスク診断】: 地震、洪水、土砂災害などのリスク分析。現在の気象条件が避難に与える影響も考慮。
2. 【備蓄最適化】: 現状の不足物資と優先順位
3. 【生存戦略】: 発災後72時間の具体的な行動計画
4. 【避難所選定】: 近隣の安全な避難エリアの提案`;

  const handleCopy = () => {
    navigator.clipboard.writeText(FINAL_PROMPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isClient) return null;

  return (
    <div className="max-w-4xl mx-auto p-2 md:p-10 space-y-4 md:space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-[#050507] text-left print:my-0 print:p-0">

      {/* カメラモーダル */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-lg space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sky-400 font-black uppercase italic tracking-widest text-sm">📷 現場撮影</p>
              <button onClick={closeCamera} className="text-slate-400 hover:text-white">
                <X size={28} />
              </button>
            </div>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full rounded-2xl border-2 border-sky-500/30 bg-black"
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="flex gap-3">
              <button
                onClick={flipCamera}
                className="flex-1 h-14 bg-slate-800 border border-white/10 rounded-2xl text-slate-300 font-black text-sm hover:bg-slate-700 transition-all"
              >
                🔄 カメラ切替
              </button>
              <button
                onClick={takePhoto}
                className="flex-[2] h-14 bg-sky-600 hover:bg-sky-500 rounded-2xl text-white font-black text-lg transition-all active:scale-95 shadow-xl"
              >
                📸 撮影
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center space-y-1">
        <Badge className="bg-sky-600 text-white font-black italic px-3 py-0.5 text-[8px] md:text-[10px] uppercase rounded-full">Survival Intelligence Hub</Badge>
        <h1 className="text-2xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">AI防災パーソナルガイド</h1>
        <div className="inline-block bg-emerald-600 text-white font-black px-4 py-0.5 rounded-full uppercase italic text-[8px] md:text-[10px] tracking-widest shadow-lg">MASTERMODEL</div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 md:gap-12 animate-in fade-in duration-700">
        {/* LEFT: MISSION PARAMETERS */}
        <div className="space-y-6">
          <div className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-6 md:p-10 shadow-2xl space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-500 to-transparent opacity-30" />

            {/* GPS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <p className="text-[10px] font-black text-sky-500 uppercase italic tracking-widest">#1 Environment Scan</p>
                <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${location ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-800 text-slate-500'}`}>
                  {location ? "GPS_LOCKED" : "GPS_IDLE"}
                </div>
              </div>
              <button
                onClick={getMyLocation}
                disabled={isLocating}
                className="w-full h-16 bg-white/5 hover:bg-white/10 border-2 border-white/10 text-white font-black rounded-2xl flex items-center justify-center gap-4 transition-all active:scale-95 group relative overflow-hidden"
              >
                <MapPin className={`w-6 h-6 ${isLocating ? 'animate-ping' : 'group-hover:text-sky-400'}`} />
                <span className="text-sm md:text-base uppercase italic">{isLocating ? "定位中..." : "GPSで現在地・天気を特定"}</span>
              </button>

              {location && (
                <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-top-2">
                  <div className="bg-black/50 border border-white/5 p-4 rounded-xl text-center">
                    <p className="text-[8px] font-black text-slate-500 uppercase mb-1 italic">Coordinates</p>
                    <p className="text-xs font-mono text-sky-400">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>
                  </div>
                  <div className="bg-black/50 border border-white/5 p-4 rounded-xl text-center">
                    <p className="text-[8px] font-black text-slate-500 uppercase mb-1 italic">Realtime Weather</p>
                    <p className="text-xs font-bold text-white uppercase italic">{weather ? `${weather.temperature}℃ / ${weather.windspeed}km/h` : "Syncing..."}</p>
                  </div>
                </div>
              )}
            </div>

            {/* フォーム */}
            <div className="space-y-4 bg-black/40 p-6 rounded-[2rem] border border-white/5 shadow-inner">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase px-3 italic">都道府県</label>
                  <input value={pref} onChange={(e) => setPref(e.target.value)} placeholder="神奈川県" className="w-full h-12 bg-[#0a0b14] border-2 border-white/5 rounded-xl px-4 text-sm text-white focus:border-sky-500 outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase px-3 italic">市区町村</label>
                  <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="海老名市" className="w-full h-12 bg-[#0a0b14] border-2 border-white/5 rounded-xl px-4 text-sm text-white focus:border-sky-500 outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase px-3 italic">備蓄状況（水・食料など）</label>
                <input value={stock} onChange={(e) => setStock(e.target.value)} placeholder="例: 水10L, 非常食3日分あり" className="w-full h-12 bg-[#0a0b14] border-2 border-white/5 rounded-xl px-4 text-sm text-white focus:border-sky-500 outline-none transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase px-3 italic">住居形態（木造・マンション等）</label>
                <input value={housing} onChange={(e) => setHousing(e.target.value)} placeholder="例: 木造2階建て" className="w-full h-12 bg-[#0a0b14] border-2 border-white/5 rounded-xl px-4 text-sm text-white focus:border-sky-500 outline-none transition-all" />
              </div>
            </div>

            {/* ===== カメラセクション ===== */}
            <div className="space-y-4 bg-black/40 p-6 rounded-[2rem] border border-sky-500/20 shadow-inner">
              <div className="flex items-center justify-between px-1">
                <p className="text-[10px] font-black text-sky-500 uppercase italic tracking-widest">#2 現場写真スキャン</p>
                {photos.length > 0 && (
                  <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase bg-sky-500/20 text-sky-400">
                    {photos.length}枚撮影済み
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={openCamera}
                  className="h-14 bg-sky-600/20 hover:bg-sky-600 border-2 border-sky-500/40 rounded-2xl text-sky-400 hover:text-white font-black text-xs uppercase italic transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Camera size={18} /> カメラ撮影
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="h-14 bg-slate-700/40 hover:bg-slate-700 border-2 border-white/10 rounded-2xl text-slate-400 hover:text-white font-black text-xs uppercase italic transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <ImagePlus size={18} /> 画像選択
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>

              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {photos.map((photo, i) => (
                    <div key={i} className="relative group rounded-xl overflow-hidden border border-sky-500/30 aspect-video">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo} alt={`現場写真 ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removePhoto(i)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-600/80 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X size={12} className="text-white" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[8px] font-black text-sky-400 text-center py-0.5 uppercase italic">
                        Photo {i + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {photos.length === 0 && (
                <p className="text-center text-[10px] text-slate-600 font-black italic uppercase">
                  自宅・備蓄・周辺環境を撮影するとAI診断の精度が向上します
                </p>
              )}
            </div>

            {/* コピー・AIリンク */}
            <div className="space-y-4">
              <button
                onClick={handleCopy}
                className={`w-full h-20 text-xl font-black rounded-2xl transition-all shadow-2xl border-b-8 ${copied ? 'bg-emerald-500 border-emerald-800 text-slate-950 scale-95' : 'bg-sky-600 border-sky-800 text-white hover:bg-sky-500'}`}
              >
                {copied ? '✅ COPY COMPLETE' : '① 診断指示をコピー'}
              </button>
              <div className="grid grid-cols-3 gap-3">
                <button className="h-16 bg-white/5 border-2 border-emerald-500/30 rounded-2xl text-[10px] font-black uppercase italic text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all flex flex-col items-center justify-center gap-1 shadow-lg" onClick={() => window.open('https://chatgpt.com', '_blank')}>
                  <span className="text-xl">💬</span> CHATGPT
                </button>
                <button className="h-16 bg-white/5 border-2 border-blue-500/30 rounded-2xl text-[10px] font-black uppercase italic text-blue-400 hover:bg-blue-500 hover:text-white transition-all flex flex-col items-center justify-center gap-1 shadow-lg" onClick={() => window.open('https://gemini.google.com', '_blank')}>
                  <span className="text-xl">✨</span> GEMINI
                </button>
                <button className="h-16 bg-white/5 border-2 border-orange-500/30 rounded-2xl text-[10px] font-black uppercase italic text-orange-400 hover:bg-orange-500 hover:text-white transition-all flex flex-col items-center justify-center gap-1 shadow-lg" onClick={() => window.open('https://claude.ai', '_blank')}>
                  <span className="text-xl">❄️</span> CLAUDE
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: COMMAND OUTPUT */}
        <div className="flex flex-col gap-6">
          <div className="bg-[#13141f] rounded-[3.5rem] p-10 border-2 border-white/5 shadow-2xl flex flex-col gap-6 relative overflow-hidden flex-1">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-30" />
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-xl bg-sky-600/10 flex items-center justify-center border-2 border-sky-500/30">
                <ClipboardPaste className="text-sky-400" />
              </div>
              <h3 className="text-xl md:text-3xl font-black text-white italic uppercase tracking-tighter">② 生存戦略レポート</h3>
            </div>

            <textarea
              value={report}
              onChange={(e) => setReport(e.target.value)}
              placeholder="AIからの戦略レポートをここにペースト..."
              className="flex-1 bg-black border-2 border-white/5 rounded-[2.5rem] p-8 text-sm text-slate-300 focus:border-sky-500 outline-none font-mono italic shadow-inner leading-relaxed min-h-[400px]"
            />

            {report && (
              <div className="p-6 bg-emerald-600 border-4 border-emerald-500 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.3)] animate-in slide-in-from-bottom-4 flex items-center gap-4">
                <ShieldCheck className="text-white w-8 h-8 shrink-0" />
                <p className="text-white font-black italic text-sm uppercase tracking-widest">Survive Protocol Synchronized</p>
              </div>
            )}
          </div>
          <button onClick={() => window.print()} className="h-16 bg-white text-slate-950 font-black italic rounded-2xl shadow-xl hover:bg-sky-500 hover:text-white transition-all active:scale-95 uppercase tracking-widest flex items-center justify-center gap-3">
            <ArrowRight size={20} /> Export Strategy (Print)
          </button>
        </div>
      </div>
      <DebugPanel data={{ location, hasReport: !!report, photoCount: photos.length }} toolId="disaster-guard-master" />
    </div>
  );
};

const NoSSRWrapper = dynamic(() => Promise.resolve(MasterEngine), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-emerald-500 animate-pulse uppercase tracking-[0.5em]">Initializing Disaster Master...</div>
})

export default function DisasterGuard() {
  return <NoSSRWrapper />;
}
