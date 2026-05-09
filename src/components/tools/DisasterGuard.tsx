'use client'
import React, { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Badge } from '@/components/ui/badge'
import { Lightbulb, RotateCcw, MapPin, Search, Zap, ClipboardPaste, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const MasterEngine = () => {
  const [isClient, setIsClient] = useState(false);
  const [location, setLocation] = useState<any>(null);
  const [report, setReport] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [weather, setWeather] = useState<any>(null);

  // 刁E�E��E�フォーム用スチE�E�EチE
  const [pref, setPref] = useState('');
  const [city, setCity] = useState('');
  const [stock, setStock] = useState('');
  const [housing, setHousing] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

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
      alert("お使ぁE�E�Eブラウザは位置惁E�E��E�に対応してぁE�E��E�せん、E);
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
        alert("位置惁E�E��E�の取得に失敗しました。手動で入力してください、E);
        setIsLocating(false);
      }
    );
  };

  const FINAL_PROMPT = `あなた�Eプロの災害対策コンサルタントです、E
以下�E「�E皁E�E��E�関推奨の共通防災知識」と【屁E�E��E�環墁E�E��E�ータ】に基づき、生存確玁E�E��E�最大化する「生存戦略レポ�Eト」を作�Eしてください、E

【�E通防災知識�E鉁E�E��E�、E
1. 生存優先頁E�E��E�、E・3・3の法則、E 3刁E呼吸)、E時間(体温)、E日(水)を死守せよ、E
2. 家庭冁E�E��E�蓁E 最佁E日刁E�E��E�推奨1週間�Eの水(1人1日3L)と食料、E
3. 発災時行動: シェイクアウチEまず低く、E�E��E�を守り、動かなぁEの徹底、E
4. 防御筁E ブレーカー遮断、ハザード�EチE�E�E確認、家族間連絡手段(171)の確立、E

【屁E�E��E�環墁E�E��E�ータ、E
現在位置�E�E�E�座標！E ${location ? `${location.lat}, ${location.lng}` : "未特宁E}
現在の気象: ${weather ? `気温:${weather.temperature}℁E 風送E${weather.windspeed}km/h` : "不�E"}
都道府県: ${pref || "未入劁E}
市区町杁E ${city || "未入劁E}
備蓄状況E ${stock || "未入劁E}
住屁E�E��E�慁E ${housing || "未入劁E}

1. 【地域リスク診断、E 地霁E�E��E�洪水、土砂災害などのリスク刁E�E��E�。現在の気象条件が避難に与える影響も老E�E�E、E
2. 【備蓁E�E��E�適化、E 現状の不足物賁E�E��E�優先頁E�E��E�E
3. 【生存戦略、E 発災征E2時間の具体的な行動計画
4. 【避難所選定、E 近隣の安�Eな避難エリアの提桁E;

  const handleCopy = () => {
    navigator.clipboard.writeText(FINAL_PROMPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isClient) return null;

  return (
    <div className="max-w-4xl mx-auto p-2 md:p-10 space-y-4 md:space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-[#050507] text-left border-4 md:border-8 border-emerald-500/50 rounded-[2rem] md:rounded-[4rem] my-1 md:my-4 shadow-[0_0_100px_rgba(16,185,129,0.2)] print:border-0 print:shadow-none print:my-0 print:p-0">
        <div className="text-center space-y-1">
          <Badge className="bg-emerald-600 text-white font-semibold px-3 py-0.5 text-[8px] md:text-[10px] uppercase rounded-full">Survival Intelligence Hub</Badge>
          <h1 className="text-2xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">AI防災パ�EソナルガイチE/h1>
          <div className="inline-block bg-emerald-600 text-white font-black px-4 py-0.5 rounded-full uppercase italic text-[8px] md:text-[10px] tracking-widest shadow-lg">MASTERMODEL</div>
        </div>

      <div className="grid lg:grid-cols-2 gap-8 md:gap-12 animate-in fade-in duration-700">
        {/* LEFT: MISSION PARAMETERS */}
        <div className="space-y-6">
          <div className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-6 md:p-10 shadow-2xl space-y-8 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-30" />
             
             <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                   <p className="text-[10px] font-black text-emerald-500 uppercase italic tracking-widest">#1 Environment Scan</p>
                   <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${location ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-800 text-slate-500'}`}>
                     {location ? "GPS_LOCKED" : "GPS_IDLE"}
                   </div>
                </div>
                <button 
                  onClick={getMyLocation} 
                  disabled={isLocating}
                  className="w-full h-16 bg-white/5 hover:bg-white/10 border-2 border-white/10 text-white font-black rounded-2xl flex items-center justify-center gap-4 transition-all active:scale-95 group relative overflow-hidden"
                >
                  <MapPin className={`w-6 h-6 ${isLocating ? 'animate-ping' : 'group-hover:text-emerald-400'}`} />
                  <span className="text-sm md:text-base uppercase italic">{isLocating ? "定位中..." : "GPSで現在地・天気を特宁E}</span>
                </button>

                {location && (
                  <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-top-2">
                     <div className="bg-black/50 border border-white/5 p-4 rounded-xl text-center">
                        <p className="text-[8px] font-black text-slate-500 uppercase mb-1 italic">Coordinates</p>
                        <p className="text-xs font-mono text-emerald-400">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>
                     </div>
                     <div className="bg-black/50 border border-white/5 p-4 rounded-xl text-center">
                        <p className="text-[8px] font-black text-slate-500 uppercase mb-1 italic">Realtime Weather</p>
                        <p className="text-xs font-bold text-white uppercase italic">{weather ? `${weather.temperature}℁E/ ${weather.windspeed}km/h` : "Syncing..."}</p>
                     </div>
                  </div>
                )}
             </div>

             <div className="space-y-4 bg-black/40 p-6 rounded-[2rem] border border-white/5 shadow-inner">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-slate-500 uppercase px-3 italic">都道府県</label>
                     <input value={pref} onChange={(e) => setPref(e.target.value)} placeholder="神奈川県" className="w-full h-12 bg-[#0a0b14] border-2 border-white/5 rounded-xl px-4 text-sm text-white focus:border-emerald-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-slate-500 uppercase px-3 italic">市区町杁E/label>
                     <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="海老名币E className="w-full h-12 bg-[#0a0b14] border-2 border-white/5 rounded-xl px-4 text-sm text-white focus:border-emerald-500 outline-none transition-all" />
                  </div>
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-slate-500 uppercase px-3 italic">備蓄状況E�E��E�水・食料など�E�E�E�E/label>
                   <input value={stock} onChange={(e) => setStock(e.target.value)} placeholder="侁E 水10L, 非常飁E日刁E�E��E�めE className="w-full h-12 bg-[#0a0b14] border-2 border-white/5 rounded-xl px-4 text-sm text-white focus:border-emerald-500 outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-slate-500 uppercase px-3 italic">住屁E�E��E�態（木造・マンション等！E/label>
                   <input value={housing} onChange={(e) => setHousing(e.target.value)} placeholder="侁E 木造2階建て" className="w-full h-12 bg-[#0a0b14] border-2 border-white/5 rounded-xl px-4 text-sm text-white focus:border-emerald-500 outline-none transition-all" />
                </div>
             </div>

             <div className="space-y-4">
               <button 
                 onClick={handleCopy} 
                 className={`w-full h-20 text-xl font-black rounded-2xl transition-all shadow-2xl border-b-4 ${copied ? 'bg-emerald-500 border-emerald-700 text-slate-950 scale-95' : 'bg-emerald-600 border-emerald-800 text-white hover:bg-emerald-500'}`}
               >
                 {copied ? '✁ECOPY COMPLETE' : '① 診断持E�E��E�をコピ�E'}
               </button>
               <div className="grid grid-cols-3 gap-3">
                  <button className="h-16 bg-white/5 border-2 border-emerald-500/30 rounded-2xl text-[10px] font-black uppercase italic text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all flex flex-col items-center justify-center gap-1 shadow-lg" onClick={() => window.open('https://chatgpt.com', '_blank')}>
                    <span className="text-xl">💬</span> CHATGPT
                  </button>
                  <button className="h-16 bg-white/5 border-2 border-emerald-500/30 rounded-2xl text-[10px] font-black uppercase italic text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all flex flex-col items-center justify-center gap-1 shadow-lg" onClick={() => window.open('https://gemini.google.com', '_blank')}>
                    <span className="text-xl">✨</span> GEMINI
                  </button>
                  <button className="h-16 bg-white/5 border-2 border-slate-500/30 rounded-2xl text-[10px] font-black uppercase italic text-slate-400 hover:bg-slate-600 hover:text-white transition-all flex flex-col items-center justify-center gap-1 shadow-lg" onClick={() => window.open('https://claude.ai', '_blank')}>
                    <span className="text-xl">🤁E/span> CLAUDE
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
                <div className="w-12 h-12 rounded-xl bg-emerald-600/10 flex items-center justify-center border-2 border-emerald-500/30">
                  <ClipboardPaste className="text-emerald-400" />
                </div>
                <h3 className="text-xl md:text-3xl font-black text-white italic uppercase tracking-tighter">② 生存戦略レポ�EチE/h3>
             </div>
             
             <textarea 
               value={report} 
               onChange={(e) => setReport(e.target.value)} 
               placeholder="AIからの戦略レポ�Eトをここにペ�EスチE.." 
               className="flex-1 bg-[#0d0f1a] border-2 border-white/10 rounded-[2rem] p-6 text-sm text-slate-300 focus:border-emerald-500 outline-none font-mono leading-relaxed min-h-[400px] resize-none" 
             />
             
             {report && (
                <div className="p-6 bg-emerald-600 border-4 border-emerald-500 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.3)] animate-in slide-in-from-bottom-4 flex items-center gap-4">
                   <ShieldCheck className="text-white w-8 h-8 shrink-0" />
                   <p className="text-white font-black italic text-sm uppercase tracking-widest">Survive Protocol Synchronized</p>
                </div>
             )}
          </div>
          <button onClick={() => window.print()} className="h-16 bg-white text-slate-950 font-semibold rounded-2xl shadow-xl hover:bg-emerald-500 hover:text-white transition-all active:scale-95 uppercase tracking-widest flex items-center justify-center gap-3">
             <ArrowRight size={20} /> Export Strategy (Print)
          </button>
        </div>
      </div>
      <DebugPanel data={{ location, hasReport: !!report }} toolId="disaster-guard-master" />
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
