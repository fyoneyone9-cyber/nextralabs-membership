'use client'
import AffiliateBanner from '@/components/affiliate/AffiliateBanner'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Badge } from '@/components/ui/badge'
import { Camera, MapPin, ClipboardPaste, ArrowRight, ShieldCheck, X, ImagePlus } from 'lucide-react'
import { useRouter } from 'next/navigation'
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
    <div className="max-w-4xl mx-auto p-2 md:p-10 space-y-4 md:space-y-10 min-h-screen text-foreground font-sans pb-32 bg-background text-left print:my-0 print:p-0">

      {/* カメラモーダル */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-lg space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-primary font-bold uppercase tracking-widest text-sm">📷 現場撮影</p>
              <button onClick={closeCamera} className="text-muted-foreground hover:text-foreground">
                <X size={28} />
              </button>
            </div>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full rounded-2xl border border-border bg-black"
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="flex gap-3">
              <button
                onClick={flipCamera}
                className="flex-1 h-14 bg-secondary border border-border rounded-2xl text-secondary-foreground font-bold text-sm hover:bg-accent transition-all"
              >
                🔄 カメラ切替
              </button>
              <button
                onClick={takePhoto}
                className="flex-[2] h-14 bg-primary hover:bg-primary/90 rounded-2xl text-primary-foreground font-bold text-lg transition-all active:scale-95 shadow-xl"
              >
                📸 撮影
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center space-y-2">
        <Badge className="bg-primary/20 text-primary border border-primary/30 font-bold px-3 py-0.5 text-[10px] uppercase rounded-full">AI防災ツール</Badge>
        <h1 className="text-2xl md:text-5xl font-black text-foreground tracking-tight leading-tight">AI防災パーソナルガイド</h1>
        <p className="text-sm text-muted-foreground">あなたの居住環境に合わせた生存戦略をAIが生成します</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 md:gap-10 animate-in fade-in duration-700">
        {/* LEFT: 入力フォーム */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-lg space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />

            {/* GPS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-primary uppercase tracking-wider">① 現在地・天気を取得</p>
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${location ? 'bg-[hsl(var(--gsk-emerald)/0.15)] text-[hsl(var(--gsk-emerald))]' : 'bg-muted text-muted-foreground'}`}>
                  {location ? "取得済み" : "未取得"}
                </div>
              </div>
              <button
                onClick={getMyLocation}
                disabled={isLocating}
                className="w-full h-14 bg-secondary hover:bg-accent border border-border text-foreground font-bold rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 group"
              >
                <MapPin className={`w-5 h-5 text-primary ${isLocating ? 'animate-ping' : ''}`} />
                <span className="text-sm">{isLocating ? "位置情報を取得中..." : "GPSで現在地・天気を特定"}</span>
              </button>

              {location && (
                <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-top-2">
                  <div className="bg-muted border border-border p-3 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">座標</p>
                    <p className="text-xs font-mono text-primary">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>
                  </div>
                  <div className="bg-muted border border-border p-3 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">現在の天気</p>
                    <p className="text-xs font-bold text-foreground">{weather ? `${weather.temperature}℃ / ${weather.windspeed}km/h` : "取得中..."}</p>
                  </div>
                </div>
              )}
            </div>

            {/* フォーム */}
            <div className="space-y-4 bg-muted/50 p-5 rounded-xl border border-border">
              <p className="text-xs font-bold text-primary uppercase tracking-wider">② 居住環境を入力</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground px-1">都道府県</label>
                  <input value={pref} onChange={(e) => setPref(e.target.value)} placeholder="神奈川県" className="w-full h-11 bg-input border border-border rounded-lg px-3 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground px-1">市区町村</label>
                  <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="海老名市" className="w-full h-11 bg-input border border-border rounded-lg px-3 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground px-1">備蓄状況（水・食料など）</label>
                <input value={stock} onChange={(e) => setStock(e.target.value)} placeholder="例: 水10L, 非常食3日分あり" className="w-full h-11 bg-input border border-border rounded-lg px-3 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground px-1">住居形態（木造・マンション等）</label>
                <input value={housing} onChange={(e) => setHousing(e.target.value)} placeholder="例: 木造2階建て" className="w-full h-11 bg-input border border-border rounded-lg px-3 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
              </div>
            </div>

            {/* ===== カメラセクション ===== */}
            <div className="space-y-3 bg-muted/50 p-5 rounded-xl border border-border">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-primary uppercase tracking-wider">③ 現場写真（任意）</p>
                {photos.length > 0 && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-primary/20 text-primary">
                    {photos.length}枚追加済み
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={openCamera}
                  className="h-12 bg-primary/10 hover:bg-primary border border-primary/40 rounded-xl text-primary hover:text-primary-foreground font-bold text-xs uppercase transition-all flex items-center justify-center gap-2"
                >
                  <Camera size={16} /> カメラ撮影
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="h-12 bg-secondary hover:bg-accent border border-border rounded-xl text-secondary-foreground font-bold text-xs uppercase transition-all flex items-center justify-center gap-2"
                >
                  <ImagePlus size={16} /> 画像選択
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
                    <div key={i} className="relative group rounded-lg overflow-hidden border border-border aspect-video">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo} alt={`現場写真 ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removePhoto(i)}
                        className="absolute top-1 right-1 w-6 h-6 bg-destructive/80 hover:bg-destructive rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X size={12} className="text-destructive-foreground" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {photos.length === 0 && (
                <p className="text-center text-xs text-muted-foreground">
                  自宅・備蓄・周辺環境を撮影するとAI診断の精度が向上します
                </p>
              )}
            </div>

            {/* コピー・AIリンク */}
            <div className="space-y-3">
              <button
                onClick={handleCopy}
                className={`w-full h-16 text-base font-bold rounded-xl transition-all shadow-lg ${copied ? 'bg-[hsl(var(--gsk-emerald))] text-white scale-95' : 'bg-primary hover:bg-primary/90 text-primary-foreground'}`}
              >
                {copied ? '✅ コピーしました！' : '① AIへの診断指示をコピー'}
              </button>
              <p className="text-center text-xs text-muted-foreground">コピー後、下記のAIを開いて貼り付けてください</p>
              <div className="grid grid-cols-3 gap-2">
                <button className="h-14 bg-secondary hover:bg-accent border border-border rounded-xl text-xs font-bold text-foreground transition-all flex flex-col items-center justify-center gap-1" onClick={() => window.open('https://chatgpt.com', '_blank')}>
                  <span className="text-lg">💬</span> ChatGPT
                </button>
                <button className="h-14 bg-secondary hover:bg-accent border border-border rounded-xl text-xs font-bold text-foreground transition-all flex flex-col items-center justify-center gap-1" onClick={() => window.open('https://gemini.google.com', '_blank')}>
                  <span className="text-lg">✨</span> Gemini
                </button>
                <button className="h-14 bg-secondary hover:bg-accent border border-border rounded-xl text-xs font-bold text-foreground transition-all flex flex-col items-center justify-center gap-1" onClick={() => window.open('https://claude.ai', '_blank')}>
                  <span className="text-lg">❄️</span> Claude
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: 生存戦略レポート */}
        <div className="flex flex-col gap-4">
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-lg flex flex-col gap-4 relative overflow-hidden flex-1">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[hsl(var(--gsk-emerald))] to-transparent opacity-60" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/30">
                <ClipboardPaste className="text-primary w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">② 生存戦略レポート</h3>
                <p className="text-xs text-muted-foreground">AIから受け取ったレポートをここに貼り付け</p>
              </div>
            </div>

            <textarea
              value={report}
              onChange={(e) => setReport(e.target.value)}
              placeholder="AIからの戦略レポートをここにペースト..."
              className="flex-1 bg-background border border-border rounded-xl p-4 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none leading-relaxed min-h-[400px] resize-none transition-all"
            />

            {report && (
              <div className="p-4 bg-[hsl(var(--gsk-emerald)/0.15)] border border-[hsl(var(--gsk-emerald)/0.4)] rounded-xl animate-in slide-in-from-bottom-4 flex items-center gap-3">
                <ShieldCheck className="text-[hsl(var(--gsk-emerald))] w-6 h-6 shrink-0" />
                <p className="text-[hsl(var(--gsk-emerald))] font-bold text-sm">レポートが入力されました</p>
              </div>
            )}
          </div>
          <button onClick={() => window.print()} className="h-14 bg-secondary hover:bg-accent border border-border text-foreground font-bold rounded-xl shadow transition-all active:scale-95 flex items-center justify-center gap-2 text-sm">
            <ArrowRight size={18} /> レポートを印刷・保存する
          </button>
        </div>
      </div>
      <DebugPanel data={{ location, hasReport: !!report, photoCount: photos.length }} toolId="disaster-guard-master" />
    </div>
  );
};

const NoSSRWrapper = dynamic(() => Promise.resolve(MasterEngine), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-emerald-500 animate-pulse uppercase tracking-[0.5em]">Initializing Disaster Master...
      {/* Amazonアフィリエイト */}
      <AffiliateBanner toolId="disaster-guard" />
</div>
})

export default function DisasterGuard() {
  const router = useRouter()

  // ブラウザバック・マウスサイドボタン対応
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const handlePopState = () => {
      const ok = window.confirm('ツールを終了しますか？')
      if (ok) {
        router.push('/dashboard')
      } else {
        window.history.pushState(null, '', window.location.href)
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [router])

  // タブ閉じ・URL直打ち対応
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  const handleBack = useCallback(() => {
    const ok = window.confirm('ツールを終了しますか？')
    if (ok) router.push('/dashboard')
  }, [router])

  return <NoSSRWrapper />;
}
