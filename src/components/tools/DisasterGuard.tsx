'use client'
import React, { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'

const MasterEngine = () => {
  const [isClient, setIsClient] = useState(false);
  const [location, setLocation] = useState<any>(null);
  const [stockStatus, setStockStatus] = useState('');
  const [report, setReport] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [weather, setWeather] = useState<any>(null);

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
    if (!navigator.geolocation) {
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
以下の【居住環境データ】に基づき、生存確率を最大化する「生存戦略レポート」を作成してください。

【現在位置（座標）】: ${location ? `${location.lat}, ${location.lng}` : "未特定（日本国内）"}
【現在の気象】: ${weather ? `気温:${weather.temperature}℃, 風速:${weather.windspeed}km/h` : "不明"}
【備蓄・周辺状況】: ${stockStatus || "未入力"}

1. 【地域リスク診断】: 地震、洪水、土砂災害などのリスク分析。現在の気象条件（気温など）が避難に与える影響も考慮。
2. 【備蓄最適化】: 現状の不足物資と優先順位
3. 【生存戦略】: 発災後72時間の具体的な行動計画
4. 【避難所選定】: 近隣の安全な避難エリアの提案`;

  if (!isClient) return null;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-[#050507] text-left">
      <div className="text-center space-y-3">
        <div className="inline-block bg-sky-600 text-white font-black italic tracking-widest px-6 py-1 text-[10px] uppercase rounded-full shadow-lg">Survival Command v5.0-MASTER</div>
        <h1 className="text-5xl md:text-[8rem] font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">Disaster Guard</h1>
      </div>

      <div className="bg-[#13141f] border-2 border-white/5 rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-500 to-transparent opacity-50" />
        
        {/* 🗺️ 以前の完璧だったガイド UI */}
        <div className="bg-[#0a0b14] border border-white/5 rounded-3xl p-8 mb-12 flex items-start gap-6 shadow-inner">
          <div className="w-10 h-10 rounded-full border border-sky-500/30 flex items-center justify-center shrink-0 text-sky-500 font-bold">!</div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-sky-500/70 uppercase tracking-[0.2em] italic mb-2">Defense Protocol</p>
            <div className="space-y-1 text-xs md:text-sm font-bold text-slate-400">
              <p className="flex items-center gap-3"><span className="text-sky-600 italic">#1</span> 居住地域と備蓄状況を入力（GPS特定推奨）</p>
              <p className="flex items-center gap-3"><span className="text-sky-600 italic">#2</span> 診断指示をコピーしてAI三台体制へ投げる</p>
              <p className="flex items-center gap-3"><span className="text-sky-600 italic">#3</span> AIが作成した生存戦略を右のエリアに戻す</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* LEFT: MISSION PARAMETERS */}
          <div className="space-y-8">
            <div className="bg-[#0a0b14] border border-white/5 rounded-[2.5rem] p-8 space-y-6 shadow-inner">
               <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-sky-500 uppercase italic tracking-widest">#1 Environment Scanner</p>
                  <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${location ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-800 text-slate-500'}`}>
                    {location ? "GPS_LOCKED" : "GPS_IDLE"}
                  </div>
               </div>

               <button 
                 onClick={getMyLocation} 
                 disabled={isLocating}
                 className="w-full h-16 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black rounded-2xl flex items-center justify-center gap-4 transition-all active:scale-95 group relative overflow-hidden"
               >
                 <div className="absolute inset-0 bg-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <span className="text-xl group-hover:animate-ping">📍</span>
                 <span>{isLocating ? "定位中..." : (location ? "現在地を更新" : "GPSで現在地・天気を特定")}</span>
               </button>

               {location && (
                 <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                    <div className="bg-black/50 border border-white/5 p-4 rounded-2xl text-center">
                       <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Coordinates</p>
                       <p className="text-xs font-mono text-sky-400">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>
                    </div>
                    <div className="bg-black/50 border border-white/5 p-4 rounded-2xl text-center">
                       <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Weather</p>
                       <p className="text-xs font-bold text-white">{weather ? `${weather.temperature}℃ / ${weather.windspeed}km/h` : "Loading..."}</p>
                    </div>
                 </div>
               )}

               <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-500 uppercase px-4 italic">Supply Status / Area Info</p>
                  <textarea 
                    value={stockStatus}
                    onChange={(e) => setStockStatus(e.target.value)}
                    placeholder="例: 神奈川県海老名市。水10L、非常食3日分あり。木造住宅。"
                    className="w-full h-40 bg-black border-2 border-white/5 rounded-3xl p-6 text-sm text-white focus:border-sky-500 outline-none shadow-inner leading-relaxed"
                  />
               </div>

               <button 
                 onClick={() => { navigator.clipboard.writeText(FINAL_PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2000); }} 
                 className={`w-full h-20 text-xl font-black rounded-2xl transition-all shadow-2xl ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-sky-600 text-white hover:bg-sky-500'}`}
               >
                 {copied ? '✅ COPY COMPLETE' : '診断指示をコピー'}
               </button>
               
               <div className="grid grid-cols-3 gap-3">
                  <button className="h-12 bg-black border border-white/5 rounded-xl text-[9px] font-black uppercase italic text-slate-500 hover:text-white" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT</button>
                  <button className="h-12 bg-black border border-white/5 rounded-xl text-[9px] font-black uppercase italic text-slate-500 hover:text-white" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI</button>
                  <button className="h-12 bg-black border border-white/5 rounded-xl text-[9px] font-black uppercase italic text-slate-500 hover:text-white" onClick={() => window.open('https://claude.ai', '_blank')}>CLAUDE</button>
               </div>
            </div>
          </div>

          {/* RIGHT: COMMAND OUTPUT */}
          <div className="bg-[#0a0b14] rounded-[3.5rem] p-10 border border-white/5 shadow-inner flex flex-col gap-6 relative">
             <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-xl bg-sky-600/10 flex items-center justify-center border border-sky-500/20">
                  <div className="w-6 h-6 border-2 border-sky-500 rounded-full animate-pulse" />
                </div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">生存戦略レポート</h3>
             </div>
             
             <textarea 
               value={report} 
               onChange={(e) => setReport(e.target.value)} 
               placeholder="AIからの戦略レポートをここにペースト..." 
               className="flex-1 bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-10 text-base text-slate-300 focus:border-sky-500 outline-none font-mono italic shadow-inner min-h-[500px] leading-relaxed" 
             />
             
             {report && (
                <div className="p-6 bg-sky-600/10 border-2 border-sky-600/30 rounded-3xl animate-in slide-in-from-bottom-4 flex items-center gap-4">
                   <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
                   <p className="text-sky-400 font-bold italic text-sm uppercase tracking-widest">Survive Protocol Synchronized</p>
                </div>
             )}
          </div>
        </div>
      </div>
      <DebugPanel data={{ location, hasReport: !!report }} toolId="disaster-guard-master" />
    </div>
  );
};

const NoSSRWrapper = dynamic(() => Promise.resolve(MasterEngine), { ssr: false });

export default function DisasterGuard() {
  return (
    <div className="min-h-screen bg-[#050507] text-gray-100 font-sans p-4 md:p-10 overflow-x-hidden text-left">
      <NoSSRWrapper />
    </div>
  );
}
