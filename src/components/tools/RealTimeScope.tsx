'use client'
;

import React, { useState, useRef, useEffect } from 'react';
import { Zap, HelpCircle, Video, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Zap, HelpCircle, Video, Button } from "@/components/ui/button";
import { Zap, HelpCircle, Video, Textarea } from "@/components/ui/textarea";
import { Zap, HelpCircle, Video, 
  Droplets, Camera, CheckCircle2, MapPin, Upload, X, Copy, 
  ExternalLink, Sparkles, Heart, Bot, RefreshCw, AlertCircle, 
  Search, Zap, Loader2, Download, HelpCircle
} from "lucide-react";
import { Zap, HelpCircle, Video, toast } from "sonner";

export default function RealTimeScope() {
  const [plantName, setPlantName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [locationName, setLocationName] = useState<string>('豬ｷ閠∝錐蟶・);
  const [weatherInfo, setWeatherInfo] = useState<string>('譎ｴ繧・/ 24ﾂｰC');
  const [isCopied, setIsCopied] = useState(false);
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{name:string, status:string} | null>(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (image && !isScanning && !scanResult) {
      const runScan = async () => {
        setIsScanning(true);
        try {
          const response = await fetch('/api/tools/smart-gardening', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image, location: locationName }),
          });
          const data = await response.json();
          const finalName = (data.name && data.name !== "隗｣譫仙ｮ御ｺ・) ? data.name : "迴ｾ蝣ｴ蜀咏悄";
          setScanResult({ name: finalName, status: data.status || "隗｣譫仙ｮ御ｺ・ });
        } catch (err) {
          setScanResult({ name: "迴ｾ蝣ｴ蜀咏悄", status: "隗｣譫先ｺ門ｙ螳御ｺ・ });
        } finally {
          setIsScanning(false);
        }
      };
      runScan();
    }
  }, [image]);

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      setScanResult(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      toast.error("繧ｫ繝｡繝ｩ縺ｮ襍ｷ蜍輔↓螟ｱ謨励＠縺ｾ縺励◆");
      setIsCameraActive(false);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0);
      setImage(canvas.toDataURL('image/jpeg', 0.8));
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    setIsCameraActive(false);
  };

  const downloadImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!image) return;
    const link = document.createElement('a');
    link.href = image;
    link.download = `nextralabs-capture-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("蜀咏悄繧剃ｿ晏ｭ倥＠縺ｾ縺励◆");
  };

  const syncRealtimeData = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const [geoRes, weatherRes] = await Promise.all([
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`),
          fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`)
        ]);
        const geoData = await geoRes.json();
        const weatherData = await weatherRes.json();
        const city = geoData.address.city || geoData.address.town || geoData.address.province || "迴ｾ蝨ｨ蝨ｰ";
        setLocationName(city);
        setWeatherInfo(`譎ｴ繧・/ ${weatherData.current_weather.temperature}ﾂｰC`);
        toast.success("迺ｰ蠅・ュ蝣ｱ繧貞酔譛溘＠縺ｾ縺励◆");
      } catch (err) { console.error(err); }
    });
  };

  const handleAutoCopyAndGo = (url: string) => {
    if (!image) return toast.error("蟇ｾ雎｡繧呈聴蠖ｱ縺励※縺上□縺輔＞");
    const target = scanResult?.name || "迴ｾ蝣ｴ蜀咏悄";
    const magicPrompt = [
      `驥崎ｦ・ｼ壹％縺ｮ繝・く繧ｹ繝医→荳邱偵↓縲∫ｧ√′莉頑聴蠖ｱ縺励◆縲・{target}縲代・蜀咏悄繧・譫夐∽ｿ｡縺励※縺・∪縺吶ゅ∪縺壹◎縺ｮ逕ｻ蜒上ｒ繝斐け繧ｻ繝ｫ蜊倅ｽ阪〒隧ｳ邏ｰ縺ｫ遒ｺ隱阪＠縲∽ｻ･荳九・繝励Ο繝輔ぉ繝・す繝ｧ繝翫Ν蛻・梵繧帝幕蟋九＠縺ｦ縺上□縺輔＞縲Ａ,
      ``,
      `縺ゅ↑縺溘・荳也阜荳ｭ縺ｮ縺ゅｉ繧・ｋ莠玖ｱ｡縺ｫ邊ｾ騾壹＠縺溘∵・諢帙↓貅縺｡縺溘瑚ｶ・ｸ豬∫樟蝣ｴ髑大ｮ壼｣ｫ縲阪〒縺吶Ａ,
      ``,
      `縲千樟蝣ｴ繧ｳ繝ｳ繝・け繧ｹ繝医疏,
      `繝ｻ蟇ｾ雎｡縺ｮ隴伜挨: ${target}`,
      `繝ｻ隕ｳ貂ｬ蝨ｰ轤ｹ: ${locationName}`,
      `繝ｻ迺ｰ蠅・ョ繝ｼ繧ｿ: ${weatherInfo}`,
      `繝ｻ繝ｦ繝ｼ繧ｶ繝ｼ縺九ｉ縺ｮ逶ｸ隲・ ${prompt || "縺薙・迥ｶ豕√↓縺翫＞縺ｦ縲∽ｻ顔ｧ√′遏･繧九∋縺阪％縺ｨ縺ｨ縲√☆縺ｹ縺阪％縺ｨ繧呈蕗縺医※縺上□縺輔＞縲・}`,
      ``,
      `縲宣荘螳壹・螳溯｡梧欠遉ｺ縲疏,
      `1. 蜀咏悄繧堤ｲｾ譟ｻ縺励∝ｯｾ雎｡迚ｩ縺ｮ蠕ｮ邏ｰ縺ｪ螟牙喧・郁牡縲∝ｽ｢縲√ユ繧ｯ繧ｹ繝√Ε縲∽ｸ崎・辟ｶ縺ｪ邂・園・峨ｒ繝励Ο縺ｮ隕也せ縺ｧ迚ｹ螳壹・隗｣隱ｬ縺励※縺上□縺輔＞縲Ａ,
      `2. 蜻ｨ霎ｺ迺ｰ蠅・ｼ・{locationName}縺ｮ${weatherInfo}・峨→縺ｮ逶ｸ髢｢髢｢菫ゅｒ蛻・梵縺励∫樟蝨ｨ襍ｷ縺阪※縺・ｋ莠玖ｱ｡縺ｮ蜴溷屏繧定ｫ也炊逧・↓蟆弱″蜃ｺ縺励※縺上□縺輔＞縲Ａ,
      `3. 莉翫√％縺ｮ迸ｬ髢薙↓螳溯｡後☆縺ｹ縺阪悟・菴鍋噪縺九▽蜊ｳ蜉ｹ諤ｧ縺ｮ縺ゅｋ繧｢繧ｯ繧ｷ繝ｧ繝ｳ縲阪ｒ縲∵焚蛟､繧・焔鬆・ｒ莠､縺医※謖・､ｺ縺励※縺上□縺輔＞縲Ａ,
      `4. 謖√■荳ｻ縺ｮ荳榊ｮ峨ｒ隗｣豸医＠縲∝燕蜷代″縺ｪ蟶梧悍繧呈戟縺ｦ繧九ｈ縺・↑縲梧ｸｩ縺九￥縲∵ｼ隱ｿ鬮倥＞險闡峨阪〒蝗樒ｭ斐ｒ邱繧√￥縺上▲縺ｦ縺上□縺輔＞縲Ａ
    ].join('\n');

    navigator.clipboard.writeText(magicPrompt.trim());
    setIsCopied(true);
    toast.success("髑大ｮ壽枚繧定・蜍輔さ繝斐・縺励∪縺励◆・・);
    
    setTimeout(() => {
      window.open(url, '_blank');
    }, 100);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen font-sans bg-slate-50/50">
      <Card className="border-none bg-white shadow-2xl rounded-[3rem] overflow-hidden antialiased">
        <div className="flex flex-col lg:flex-row min-h-[800px]">
          {/* 蟾ｦ蜊雁・ */}
          <div className="lg:w-3/5 bg-slate-950 relative flex items-center justify-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full p-10 z-10 bg-gradient-to-b from-black/80 via-black/40 to-transparent text-white text-left">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg animate-pulse"><Zap className="w-8 h-8" /></div>
                <div>
                   <h1 className="text-4xl font-black italic tracking-tighter leading-none tracking-tight">AI REAL-TIME SCOPE</h1>
                   <p className="text-blue-400 text-[10px] font-black tracking-[0.5em] mt-2 uppercase opacity-80">NextraLabs Intelligence System</p>
                </div>
              </div>
            </div>

            {isCameraActive ? (
              <div className="w-full h-full relative">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-10 z-20">
                  <Button onClick={takePhoto} className="h-24 w-24 rounded-full bg-white border-8 border-blue-500/30 flex items-center justify-center shadow-2xl active:scale-90 transition-all">
                    <div className="h-14 w-14 bg-white rounded-full" />
                  </Button>
                  <Button onClick={stopCamera} variant="ghost" className="text-white bg-red-500/20 hover:bg-red-500/40 h-16 w-16 rounded-full border border-red-500/50"><X className="w-8 h-8" /></Button>
                </div>
              </div>
            ) : image ? (
              <div className="w-full h-full relative animate-in fade-in duration-700">
                <img src={image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay" />
                
                <div className="absolute top-10 right-10 flex gap-3 z-30">
                  <Button onClick={downloadImage} className="h-16 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black shadow-xl border-2 border-white/20 animate-bounce text-lg tracking-tight">
                    1. 蜀咏悄繧剃ｿ晏ｭ假ｼ亥ｿ・茨ｼ・                  </Button>
                  <Button onClick={() => {setImage(null); setScanResult(null); setIsCopied(false);}} className="h-16 w-16 bg-black/60 text-white rounded-full hover:bg-red-500 border-2 border-white/20 transition-colors"><X className="w-8 h-8" /></Button>
                </div>

                {isScanning && (
                  <div className="absolute inset-0 bg-blue-600/30 backdrop-blur-md flex flex-col items-center justify-center"><RefreshCw className="w-20 h-20 text-white animate-spin mb-6" /><p className="text-white font-black tracking-[0.5em] text-2xl italic uppercase tracking-tighter">AI繧ｹ繧ｭ繝｣繝ｳ荳ｭ...</p></div>
                )}
                {scanResult && (
                  <div className="absolute top-32 left-10 right-10 p-8 bg-black/70 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 animate-in slide-in-from-top-4 shadow-2xl">
                    <div className="flex items-center gap-3 text-blue-400 font-black text-[11px] uppercase mb-5 tracking-[0.3em]"><Zap className="w-4 h-4" /> Real-time Context Scan</div>
                    <div className="grid grid-cols-1 gap-8 text-white">
                      <div className="space-y-1">
                        <p className="text-[10px] opacity-40 font-black uppercase tracking-widest">Target Identity</p>
                        <p className="text-3xl font-black tracking-tighter">{scanResult.name}</p>
                      </div>
                      <div className="p-6 bg-green-500/20 border-2 border-green-500/40 rounded-3xl animate-pulse shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                        <p className="text-[10px] text-green-400 font-black uppercase mb-3 tracking-widest">Recommended Next Action</p>
                        <p className="text-xl font-black text-white leading-tight tracking-tight">
                          髑大ｮ壽枚縺ｯ繧ｳ繝斐・貂医∩縺ｧ縺吶・br/>
                          蜿ｳ荳九・<span className="text-green-400 underline underline-offset-4 decoration-2">AI螟夜Κ繝ｪ繝ｳ繧ｯ繧偵け繝ｪ繝・け</span>縺励∝・逵溘ｒ豺ｻ莉倥＠縺ｦ雋ｼ繧贋ｻ倥￠繧九□縺代〒縲∵怙鬮倥・髑大ｮ夂ｵ先棡縺悟・蜉帙＆繧後∪縺呻ｼ・                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-10 space-y-10 animate-in fade-in duration-1000">
                <div className="h-48 w-48 bg-blue-500/5 rounded-full flex items-center justify-center mx-auto border border-blue-500/10 relative"><Search className="w-24 h-24 text-blue-500/20" /><div className="absolute inset-0 border-2 border-blue-500/20 rounded-full animate-ping" /></div>
                <div className="flex flex-col gap-5 max-w-sm mx-auto">
                  <Button onClick={startCamera} className="bg-blue-600 hover:bg-blue-500 text-white h-24 px-12 rounded-[2rem] font-black text-3xl shadow-[0_20px_60px_rgba(37,99,235,0.3)] transition-all active:scale-95 italic tracking-tighter uppercase">Start Scope</Button>
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="border-white/10 text-slate-400 hover:bg-white/5 hover:text-white h-16 px-10 rounded-2xl font-black text-lg transition-all tracking-[0.2em]">IMPORT IMAGE</Button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const r = new FileReader();
                      r.onload = (ev) => setImage(ev.target?.result as string);
                      r.readAsDataURL(file);
                    }
                  }} />
                </div>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* 蜿ｳ蜊雁・ */}
          <div className="lg:w-2/5 p-12 flex flex-col bg-white overflow-y-auto border-l border-slate-100 text-left">
            <div className="flex-1 space-y-12">
              <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[2rem] border-2 border-blue-100 shadow-sm transition-all hover:shadow-md">
                <div className="h-10 w-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"><HelpCircle className="w-6 h-6 text-white" /></div>
                <div className="space-y-1">
                  <p className="text-sm text-blue-900 font-black tracking-tight leading-snug">蜀咏悄繧剃ｿ晏ｭ倥＠縺ｦAI繝懊ち繝ｳ繧呈款縺吶□縺托ｼ・/p>
                  <p className="text-[12px] text-blue-700 font-bold opacity-70 leading-relaxed tracking-tight">髑大ｮ壽枚縺ｯ閾ｪ蜍輔〒繧ｳ繝斐・縺輔ｌ縺ｾ縺吶ゅ≠縺ｨ縺ｯAI縺ｫ縲悟・逵溘阪ｒ貂｡縺励※縲瑚ｲｼ繧贋ｻ倥￠縲阪ｋ縺縺代・/p>
                </div>
              </div>

              <section className="space-y-8">
                <div className="p-6 bg-blue-50/50 border-2 border-blue-100 rounded-[2.5rem] flex items-center justify-between">
                  <div className="flex items-center gap-5 text-blue-900 font-black"><div className="h-14 w-14 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg"><MapPin className="text-white w-7 h-7" /></div><div><input className="bg-transparent border-none p-0 font-black text-3xl w-full focus:ring-0 tracking-tighter" value={locationName} onChange={(e) => setLocationName(e.target.value)} /><p className="text-[11px] font-black text-blue-500 uppercase italic tracking-[0.3em] mt-1">{weatherInfo}</p></div></div>
                  <Button size="icon" variant="ghost" className="text-blue-500 hover:bg-blue-100 rounded-2xl h-14 w-14 shadow-sm" onClick={syncRealtimeData}><RefreshCw className="w-6 h-6" /></Button>
                </div>
                
                <div className="p-8 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] shadow-inner">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-3">User Consultation</label>
                  <Textarea className="bg-transparent border-none p-0 font-black text-xl text-slate-900 w-full min-h-[120px] resize-none focus:ring-0 leading-relaxed placeholder:text-slate-300" placeholder="莉翫・蝗ｰ繧翫＃縺ｨ繧貞・蜉・.." value={prompt} onChange={(e) => setPrompt(e.target.value)} />
                </div>
              </section>

              <section className="space-y-6 pt-8 border-t border-slate-100 text-center">
                <div className="space-y-5">
                  <p className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">Launch Analysis</p>
                  <div className="grid grid-cols-1 gap-5">
                    <Button onClick={() => handleAutoCopyAndGo('https://gemini.google.com/')} disabled={!image || isScanning} className="h-28 bg-blue-600 hover:bg-blue-500 text-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(37,99,235,0.3)] flex flex-col items-center justify-center group active:scale-95 transition-all border-none relative overflow-hidden">
                      <div className="flex items-center gap-4 text-3xl font-black italic tracking-tighter uppercase relative z-10"><Sparkles className="w-8 h-8 text-amber-300" /> Gemini縺ｧ髑大ｮ・/div>
                      <span className="text-[11px] text-blue-100 font-black uppercase tracking-[0.2em] relative z-10 opacity-80">Vision Optimization Ready</span>
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </Button>
                    <div className="grid grid-cols-2 gap-5">
                      <Button onClick={() => handleAutoCopyAndGo('https://chatgpt.com/')} disabled={!image || isScanning} className="h-20 bg-emerald-600 hover:bg-emerald-500 text-white rounded-3xl shadow-xl flex items-center justify-center gap-3 font-black active:scale-95 transition-all border-none text-lg tracking-tighter uppercase italic"><Bot className="w-6 h-6" /> ChatGPT</Button>
                      <Button onClick={() => handleAutoCopyAndGo('https://claude.ai/')} disabled={!image || isScanning} className="h-20 bg-orange-600 hover:bg-orange-500 text-white rounded-3xl shadow-xl flex items-center justify-center gap-3 font-black active:scale-95 transition-all border-none text-lg tracking-tighter uppercase italic"><Heart className="w-6 h-6 fill-white" /> Claude</Button>
                    </div>
                  </div>
                </div>
              </section>

              {isCopied && (
                <div className="p-10 bg-red-50 rounded-[3rem] border-4 border-red-100 animate-in fade-in slide-in-from-top-6 shadow-2xl relative overflow-hidden text-left">
                   <div className="absolute -top-6 -right-6 w-32 h-32 bg-red-100 rounded-full opacity-30 flex items-center justify-center"><AlertCircle className="w-16 h-16 text-red-500" /></div>
                   <div className="flex flex-col gap-1 mb-8">
                     <div className="flex items-center gap-3 text-red-700 font-black italic text-2xl uppercase tracking-tighter">AI Instructions</div>
                     <p className="text-red-600 font-black text-xs tracking-widest uppercase opacity-70">Automatic Copy Completed</p>
                   </div>
                   <div className="space-y-6 text-lg text-red-950 font-black leading-tight">
                     <p className="flex items-start gap-4 transition-all hover:translate-x-1"><span className="bg-red-600 text-white w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 shadow-lg font-sans">1</span><span>蜈･蜉帶ｬ・・ <span className="bg-red-200 px-2 py-0.5 rounded-lg text-red-600">縲鯉ｼ九・/span> 繧偵ち繝・・</span></p>
                     <p className="flex items-start gap-4 transition-all hover:translate-x-1"><span className="bg-red-600 text-white w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 shadow-lg font-sans">2</span><span>菫晏ｭ倥＠縺・<span className="underline decoration-red-500 decoration-[3px] underline-offset-4">迴ｾ蝣ｴ蜀咏悄</span> 繧帝∈謚・/span></p>
                     <p className="flex items-start gap-4 transition-all hover:translate-x-1"><span className="bg-red-600 text-white w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 shadow-lg font-sans">3</span><span>縺昴・縺ｾ縺ｾ <span className="underline decoration-red-500 decoration-[3px] underline-offset-4">縲瑚ｲｼ繧贋ｻ倥￠縲・/span> 縺励※騾∽ｿ｡・・/span></p>
                   </div>
                </div>
              )}
            </div>
            <div className="mt-16 pt-8 border-t border-slate-100 flex items-center justify-between text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] font-sans">
              <span>NextraLabs Context Mastery</span>
              <span>Final Confirmed v3.5</span>
            </div>
          </div>
        </div>
      </Card>
    
      </div>
  );
}




