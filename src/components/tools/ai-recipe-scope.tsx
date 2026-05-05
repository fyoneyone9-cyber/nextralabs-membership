'use client'
;

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Droplets, Camera, CheckCircle2, MapPin, Upload, X, Copy, 
  ExternalLink, Sparkles, Heart, Bot, RefreshCw, AlertCircle, 
  Search, Zap, Loader2, Download, HelpCircle, Utensils, Play, Video
} from "lucide-react";
import { toast } from "sonner";

export default function AiRecipeScope() {
  const [plantName, setPlantName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [dishName, setDishName] = useState('');
  const [locationName, setLocationName] = useState<string>('豬ｷ閠∝錐蟶・);
  const [weatherInfo, setWeatherInfo] = useState<string>('譎ｴ繧・/ 24ﾂｰC');
  const [isCopied, setIsCopied] = useState(false);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'done'>('idle');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (image && status === 'idle') {
      autoScanRecipe();
    }
  }, [image]);

  const autoScanRecipe = async () => {
    setStatus('scanning');
    setDishName('');
    try {
      const response = await fetch('/api/tools/ai-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
      });
      const data = await response.json();
      if (data.dishName && data.dishName !== "邨ｶ蜩∵侭逅・ && data.dishName !== "隗｣譫舌お繝ｩ繝ｼ") {
        setDishName(data.dishName);
        setStatus('done');
        toast.success(`鬟滓攝繧堤音螳夲ｼ・{data.dishName}`);
      } else {
        setDishName("邨ｶ蜩∵侭逅・);
        setStatus('done');
      }
    } catch (err) {
      setDishName("邨ｶ蜩∵侭逅・);
      setStatus('done');
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Camera failed, fallback to file upload.");
      toast.error("繧ｫ繝｡繝ｩ繧定ｵｷ蜍輔〒縺阪∪縺帙ｓ縺ｧ縺励◆縲ょ・逵溘ｒ驕ｸ謚槭＠縺ｦ縺上□縺輔＞縲・);
      fileInputRef.current?.click();
    }
  };

  const [isCameraActive, setIsCameraActive] = useState(false);

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
    if (!image) return;
    const link = document.createElement('a');
    link.href = image;
    link.download = `nextralabs-capture-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("蜀咏悄繧堤ｫｯ譛ｫ縺ｫ菫晏ｭ倥＠縺ｾ縺励◆");
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
        const temp = weatherData.current_weather.temperature;
        setLocationName(city);
        setWeatherInfo(`譎ｴ繧・/ ${temp}ﾂｰC`);
        toast.success("迺ｰ蠅・ュ蝣ｱ繧貞酔譛溘＠縺ｾ縺励◆");
      } catch (err) { console.error(err); }
    });
  };

  const openYouTube = () => {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(dishName || plantName || "譁咏炊")}+菴懊ｊ譁ｹ`;
    window.open(url, '_blank');
  };

  const handleAutoCopyAndGo = (url: string) => {
    if (!image) return toast.error("蟇ｾ雎｡繧呈聴蠖ｱ縺励※縺上□縺輔＞");
    const target = plantName || dishName || "蜀咏悄縺ｮ鬟滓攝";
    const magicPrompt = `驥崎ｦ・ｼ壹％縺ｮ繝・く繧ｹ繝医→荳邱偵↓縲∫ｧ√′莉頑聴蠖ｱ縺励◆蜀咏悄繧・譫夐∽ｿ｡縺励※縺・∪縺吶ゅ∪縺壹◎縺ｮ逕ｻ蜒上ｒ隧ｳ邏ｰ縺ｫ遒ｺ隱阪＠縺ｦ縺上□縺輔＞縲・n縺ゅ↑縺溘・螟ｩ謇阪す繧ｧ繝輔〒縺吶・n縲千樟蝣ｴ繝・・繧ｿ縲曾n繝ｻ蟇ｾ雎｡縺ｮ鬟滓攝: ${target}\n繝ｻ迺ｰ蠅・ュ蝣ｱ: ${weatherInfo}\n繝ｻ繝ｦ繝ｼ繧ｶ繝ｼ逶ｸ隲・ ${prompt || "縺薙・鬟滓攝縺ｧ菴懊ｌ繧区怙鬮倥↓鄒主袖縺励＞譁咏炊縺ｮ繝ｬ繧ｷ繝斐ｒ謨吶∴縺ｦ縺上□縺輔＞縲・}\n\n縲仙ｮ溯｡梧欠遉ｺ縲曾n1. 蜀咏悄繧堤ｲｾ譟ｻ縺励∽ｽ輔・鬟滓攝縺後←繧後￥繧峨＞縺ゅｋ縺狗音螳壹＠縺ｦ縺上□縺輔＞縲・n2. 蝨ｰ蝓溽腸蠅・ｼ・{locationName}縺ｮ${weatherInfo}・峨↓蜷医ｏ縺帙◆縲∽ｻ頑怙繧らｾ主袖縺励＞繝ｬ繧ｷ繝斐ｒ閠・｡医＠縺ｦ縺上□縺輔＞縲・n3. 謇矩・√さ繝・∫屁繧贋ｻ倥￠縺ｾ縺ｧ蜈ｷ菴鍋噪縺ｫ繧｢繝峨ヰ繧､繧ｹ縺励※縺上□縺輔＞縲Ａ;
    navigator.clipboard.writeText(magicPrompt.trim());
    setIsCopied(true);
    toast.success("髑大ｮ壽枚繧定・蜍輔さ繝斐・縺励∪縺励◆・∬ｲｼ繧贋ｻ倥￠繧九□縺代〒縺吶・);
    setTimeout(() => { window.open(url, '_blank'); }, 100);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen font-sans bg-slate-50/50 text-left">
      <Card className="border-none bg-white shadow-2xl rounded-[3rem] overflow-hidden antialiased">
        <div className="flex flex-col lg:flex-row min-h-[800px]">
          <div className="lg:w-3/5 bg-slate-950 relative flex items-center justify-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full p-10 z-10 bg-gradient-to-b from-black/80 via-black/40 to-transparent text-white text-left">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg animate-pulse"><Zap className="w-8 h-8" /></div>
                <div>
                   <h1 className="text-3xl font-black italic tracking-tighter leading-none">AI 繝ｪ繧｢繝ｫ繧ｿ繧､繝繝ｻ繧ｹ繧ｳ繝ｼ繝・/h1>
                   <p className="text-blue-400 text-[10px] font-black tracking-[0.4em] mt-1">NEXTRALABS INTELLIGENCE</p>
                </div>
              </div>
            </div>

            {isCameraActive ? (
              <div className="w-full h-full relative">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-10 z-20">
                  <Button onClick={takePhoto} className="h-24 w-24 rounded-full bg-white border-8 border-blue-500/30 flex items-center justify-center shadow-2xl active:scale-90 transition-all"><div className="h-14 w-14 bg-red-500 rounded-full" /></Button>
                  <Button onClick={stopCamera} variant="ghost" className="text-white hover:bg-white/10 h-16 w-16 rounded-full"><X className="w-8 h-8" /></Button>
                </div>
              </div>
            ) : image ? (
              <div className="w-full h-full relative animate-in fade-in duration-700">
                <img src={image} className="w-full h-full object-cover" />
                <div className="absolute top-10 right-10 flex gap-3 z-30">
                  <Button onClick={downloadImage} className="h-16 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black shadow-xl border-2 border-white/20 animate-bounce text-lg">1. 蜀咏悄繧剃ｿ晏ｭ假ｼ亥ｿ・茨ｼ・/Button>
                  <Button onClick={() => {setImage(null); setDishName(''); setStatus('idle'); setIsCopied(false);}} className="h-16 w-16 bg-black/60 text-white rounded-full hover:bg-red-500 border-2 border-white/20 transition-colors"><X className="w-8 h-8" /></Button>
                </div>
                {status === 'scanning' && (
                  <div className="absolute inset-0 bg-blue-600/30 backdrop-blur-md flex flex-col items-center justify-center animate-pulse text-white font-black text-2xl uppercase italic">Scanning...</div>
                )}
                {status === 'done' && dishName && (
                  <div className="absolute top-32 left-10 right-10 p-8 bg-black/70 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 animate-in slide-in-from-top-4 shadow-2xl text-left text-white">
                    <p className="text-3xl font-black tracking-tighter mb-6 uppercase italic leading-none">{dishName}</p>
                    <p className="text-lg font-black leading-tight animate-pulse text-white">髑大ｮ壽枚縺ｯ繧ｳ繝斐・貂医∩縺ｧ縺吶ょ承荳九・AI繝懊ち繝ｳ繧偵け繝ｪ繝・け・・/p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-10 space-y-10 animate-in fade-in duration-1000">
                <div className="h-48 w-48 bg-blue-500/5 rounded-full flex items-center justify-center mx-auto border border-blue-500/10 relative"><Search className="w-24 h-24 text-blue-500/20" /><div className="absolute inset-0 border-2 border-blue-500/20 rounded-full animate-ping" /></div>
                <div className="flex flex-col gap-5 max-w-sm mx-auto">
                  <Button onClick={startCamera} className="bg-blue-600 hover:bg-blue-500 text-white h-24 px-12 rounded-[2rem] font-black text-3xl shadow-2xl transition-all active:scale-95 italic tracking-tighter uppercase">繧ｹ繧ｳ繝ｼ繝励ｒ襍ｷ蜍・/Button>
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="border-white/10 text-slate-400 hover:bg-white/5 h-16 px-10 rounded-2xl font-black text-lg transition-all tracking-widest uppercase">菫晏ｭ倥＠縺溷・逵溘ｒ驕ｸ謚・/Button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) { const r = new FileReader(); r.onload = (ev) => setImage(ev.target?.result as string); r.readAsDataURL(file); }
                  }} />
                </div>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* 蜿ｳ蜊雁・ */}
          <div className="lg:w-2/5 p-12 flex flex-col bg-white overflow-y-auto border-l border-slate-100 text-left">
            <div className="flex-1 space-y-10">
              <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[2rem] border-2 border-blue-200 shadow-sm transition-all hover:shadow-md">
                <div className="h-10 w-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"><HelpCircle className="w-6 h-6 text-white" /></div>
                <div className="space-y-1"><p className="text-sm text-blue-900 font-black">蜀咏悄繧剃ｿ晏ｭ倥＠縺ｦAI繝懊ち繝ｳ繧呈款縺吶□縺托ｼ・/p><p className="text-[12px] text-blue-700 font-bold opacity-70 leading-relaxed tracking-tight">髑大ｮ壽枚縺ｯ閾ｪ蜍輔〒繧ｳ繝斐・縺輔ｌ縺ｾ縺吶ゅ≠縺ｨ縺ｯAI縺ｫ縲悟・逵溘阪ｒ貂｡縺励※縲瑚ｲｼ繧贋ｻ倥￠縲阪ｋ縺縺代・/p></div>
              </div>

              <section className="space-y-6">
                <div className="p-6 bg-blue-50/50 border-2 border-blue-100 rounded-[2.5rem] flex items-center justify-between">
                  <div className="flex items-center gap-4 text-blue-900 font-black"><MapPin className="text-blue-500 w-6 h-6" /><div><input className="bg-transparent border-none p-0 font-black text-2xl w-full focus:ring-0 tracking-tighter" value={locationName} onChange={(e) => setLocationName(e.target.value)} /><p className="text-[11px] font-black text-blue-500 uppercase italic tracking-widest mt-1">{weatherInfo}</p></div></div>
                  <Button size="icon" variant="ghost" className="text-blue-500 hover:bg-blue-100 rounded-2xl h-14 w-14 shadow-sm" onClick={syncRealtimeData}><RefreshCw className="w-6 h-6" /></Button>
                </div>
                <div className="p-6 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] shadow-inner space-y-4">
                  <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">1. 蟇ｾ雎｡縺ｮ蜷榊燕</label><input className="bg-transparent border-none p-0 font-black text-xl text-slate-900 w-full focus:ring-0" placeholder="萓具ｼ壹ヰ繝翫リ" value={plantName} onChange={(e) => setPlantName(e.target.value)} /></div>
                  <div className="h-px bg-slate-200 w-full" /><div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">2. 逶ｸ隲・・螳ｹ</label><Textarea className="bg-transparent border-none p-0 font-black text-xl text-slate-900 w-full min-h-[80px] resize-none focus:ring-0 leading-relaxed placeholder:text-slate-300" placeholder="莉翫・蝗ｰ繧翫＃縺ｨ繧貞・蜉・.." value={prompt} onChange={(e) => setPrompt(e.target.value)} /></div>
                </div>
              </section>

              <section className="space-y-6 pt-8 border-t border-slate-100 text-center">
                <div className="space-y-5">
                  <p className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">2. AI繧帝∈繧薙〒髑大ｮ夐幕蟋・/p>
                  <div className="grid grid-cols-1 gap-5">
                    <Button onClick={() => handleAutoCopyAndGo('https://gemini.google.com/')} disabled={!image || status === 'scanning'} className="h-28 bg-blue-600 hover:bg-blue-500 text-white rounded-[2.5rem] shadow-xl flex flex-col items-center justify-center group active:scale-95 transition-all border-none relative overflow-hidden">
                      <div className="flex items-center gap-3 text-2xl font-black italic tracking-tighter uppercase relative z-10 text-white"><Sparkles className="w-8 h-8 text-amber-300" /> Gemini縺ｧ髑大ｮ・/div>
                      <span className="text-[11px] text-blue-100 font-black uppercase relative z-10 opacity-80">逕ｻ蜒剰ｧ｣譫舌↓譛繧ょｼｷ縺・耳螂ｨAI</span>
                    </Button>
                    <div className="grid grid-cols-2 gap-5">
                      <Button onClick={() => handleAutoCopyAndGo('https://chatgpt.com/')} disabled={!image || status === 'scanning'} className="h-20 bg-emerald-600 hover:bg-emerald-500 text-white rounded-3xl shadow-xl flex items-center justify-center gap-3 font-black active:scale-95 transition-all border-none text-lg tracking-tighter uppercase italic"><Bot className="w-6 h-6 text-white" /> ChatGPT</Button>
                      <Button onClick={() => handleAutoCopyAndGo('https://claude.ai/')} disabled={!image || status === 'scanning'} className="h-20 bg-orange-600 hover:bg-orange-500 text-white rounded-3xl shadow-xl flex items-center justify-center gap-3 font-black active:scale-95 transition-all border-none text-lg tracking-tighter uppercase italic"><Heart className="w-6 h-6 fill-white" /> Claude</Button>
                    </div>
                  </div>
                </div>

                {status === 'done' && (dishName || plantName) && (
                  <div className="pt-8 border-t border-slate-100 space-y-4 text-left animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3"><div className="p-2 bg-red-100 rounded-xl shadow-sm"><Video className="text-red-600 w-5 h-5" /></div><h3 className="text-lg font-black text-slate-900 italic tracking-tighter uppercase">Cook Videos</h3></div>
                      <Button variant="ghost" className="text-blue-600 font-black text-xs h-auto p-0" onClick={openYouTube}>YouTube縺ｧ隧ｳ縺励￥</Button>
                    </div>
                    <Card className="bg-slate-950 border-none rounded-3xl overflow-hidden shadow-xl cursor-pointer group shadow-red-600/10" onClick={openYouTube}>
                      <div className="aspect-video relative bg-slate-900 flex items-center justify-center">
                        <Play className="w-10 h-10 text-white/30 group-hover:scale-125 transition-all" />
                        <div className="absolute bottom-6 left-6 right-6 font-black text-white text-lg tracking-tight line-clamp-1">{(dishName && dishName !== "邨ｶ蜩∵侭逅・) ? dishName : plantName || "譁咏炊"} 縺ｮ繝励Ο繝ｬ繧ｷ繝泌虚逕ｻ</div>
                      </div>
                    </Card>
                  </div>
                )}
              </section>

              {isCopied && (
                <div className="p-10 bg-red-50 rounded-[3rem] border-4 border-red-100 animate-in fade-in slide-in-from-top-6 shadow-2xl relative overflow-hidden text-left">
                   <div className="absolute -top-6 -right-6 w-32 h-32 bg-red-100 rounded-full opacity-30 flex items-center justify-center"><AlertCircle className="w-12 h-12 text-red-500" /></div>
                   <div className="flex flex-col gap-1 mb-8 text-left"><div className="flex items-center gap-3 text-red-700 font-black italic text-xl uppercase tracking-tight text-left">髑大ｮ壹い繝励Μ縺ｧ縺ｮ謫堺ｽ・/div><p className="text-red-600 font-black text-xs">窶ｻ髑大ｮ壽枚縺ｯ縺吶〒縺ｫ繧ｳ繝斐・貂医∩縺ｧ縺呻ｼ・/p></div>
                   <div className="space-y-5 text-[15px] text-red-950 font-black leading-tight text-left">
                     <p className="flex items-start gap-4 text-left font-black"><span className="bg-red-600 text-white w-7 h-7 rounded-xl flex items-center justify-center text-xs flex-shrink-0 mt-0.5 shadow-md">1</span><span>蜈･蜉帶ｬ・・ <span className="bg-red-200 px-2 py-0.5 rounded-lg text-red-600">縲鯉ｼ九・/span> 繧偵ち繝・・</span></p>
                     <p className="flex items-start gap-4 text-left font-black"><span className="bg-red-600 text-white w-7 h-7 rounded-xl flex items-center justify-center text-xs flex-shrink-0 mt-0.5 shadow-md">2</span><span>菫晏ｭ倥＠縺・<span className="underline decoration-red-500 decoration-[3px] underline-offset-4 font-black text-red-600">迴ｾ蝣ｴ蜀咏悄</span> 繧帝∈謚・/span></p>
                     <p className="flex items-start gap-4 text-left font-black"><span className="bg-red-600 text-white w-7 h-7 rounded-xl flex items-center justify-center text-xs flex-shrink-0 mt-0.5 shadow-md">3</span><span>縺昴・縺ｾ縺ｾ <span className="underline decoration-red-500 decoration-[3px] underline-offset-4 font-black text-red-600">縲瑚ｲｼ繧贋ｻ倥￠縲・/span> 縺励※騾∽ｿ｡・・/span></p>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    
      </div>
  );
}


