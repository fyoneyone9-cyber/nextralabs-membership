�ｿ�ｿ'use client'
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

  // 蛻・�ｽE�ｽ�ｽE�ｽ繝輔か繝ｼ繝�逕ｨ繧ｹ繝・�ｽE�ｽE繝・
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
      alert("お使いのブラウザは位置情報に対応していません");
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
        alert("位置情報の取得に失敗しました。手動で入力してください");
        setIsLocating(false);
      }
    );
  };

  const FINAL_PROMPT = `縺ゅ↑縺滂ｿｽE繝励Ο縺ｮ轣ｽ螳ｳ蟇ｾ遲悶さ繝ｳ繧ｵ繝ｫ繧ｿ繝ｳ繝医〒縺吶・
莉･荳具ｿｽE縲鯉ｿｽE逧・�ｽE�ｽ�ｽE�ｽ髢｢謗ｨ螂ｨ縺ｮ蜈ｱ騾夐亟轣ｽ遏･隴倥阪→縲仙ｱ・�ｽE�ｽ�ｽE�ｽ迺ｰ蠅・�ｽE�ｽ�ｽE�ｽ繝ｼ繧ｿ縲代↓蝓ｺ縺･縺阪∫函蟄倡｢ｺ邇・�ｽE�ｽ�ｽE�ｽ譛螟ｧ蛹悶☆繧九檎函蟄俶姶逡･繝ｬ繝晢ｿｽE繝医阪ｒ菴懶ｿｽE縺励※縺上□縺輔＞縲・

縲撰ｿｽE騾夐亟轣ｽ遏･隴假ｿｽE驩・�ｽE�ｽ�ｽE�ｽ縲・
1. 逕溷ｭ伜━蜈磯�・�ｽE�ｽ�ｽE�ｽ縲・繝ｻ3繝ｻ3縺ｮ豕募援縲・ 3蛻・蜻ｼ蜷ｸ)縲・譎る俣(菴捺ｸｩ)縲・譌･(豌ｴ)繧呈ｭｻ螳医○繧医・
2. 螳ｶ蠎ｭ蜀・�ｽE�ｽ�ｽE�ｽ闢・ 譛菴・譌･蛻・�ｽE�ｽ�ｽE�ｽ謗ｨ螂ｨ1騾ｱ髢難ｿｽE縺ｮ豌ｴ(1莠ｺ1譌･3L)縺ｨ鬟滓侭縲・
3. 逋ｺ轣ｽ譎り｡悟虚: 繧ｷ繧ｧ繧､繧ｯ繧｢繧ｦ繝・縺ｾ縺壻ｽ弱￥縲・�ｽE�ｽ�ｽE�ｽ繧貞ｮ医ｊ縲∝虚縺九↑縺・縺ｮ蠕ｹ蠎輔・
4. 髦ｲ蠕｡遲・ 繝悶Ξ繝ｼ繧ｫ繝ｼ驕ｮ譁ｭ縲√ワ繧ｶ繝ｼ繝会ｿｽE繝・�ｽE�ｽE遒ｺ隱阪∝ｮｶ譌城俣騾｣邨｡謇区ｮｵ(171)縺ｮ遒ｺ遶九・

縲仙ｱ・�ｽE�ｽ�ｽE�ｽ迺ｰ蠅・�ｽE�ｽ�ｽE�ｽ繝ｼ繧ｿ縲・
迴ｾ蝨ｨ菴咲ｽｮ�ｽE�ｽE�ｽE�ｽ蠎ｧ讓呻ｼ・ ${location ? `${location.lat}, ${location.lng}` : "譛ｪ迚ｹ螳・}
迴ｾ蝨ｨ縺ｮ豌苓ｱ｡: ${weather ? `豌玲ｸｩ:${weather.temperature}邃・ 鬚ｨ騾・${weather.windspeed}km/h` : "荳搾ｿｽE"}
驛ｽ驕灘ｺ懃恁: ${pref || "譛ｪ蜈･蜉・}
蟶ょ玄逕ｺ譚・ ${city || "譛ｪ蜈･蜉・}
蛯呵塘迥ｶ豕・ ${stock || "譛ｪ蜈･蜉・}
菴丞ｱ・�ｽE�ｽ�ｽE�ｽ諷・ ${housing || "譛ｪ蜈･蜉・}

1. 縲仙慍蝓溘Μ繧ｹ繧ｯ險ｺ譁ｭ縲・ 蝨ｰ髴・�ｽE�ｽ�ｽE�ｽ豢ｪ豌ｴ縲∝悄遐ら⊃螳ｳ縺ｪ縺ｩ縺ｮ繝ｪ繧ｹ繧ｯ蛻・�ｽE�ｽ�ｽE�ｽ縲ら樟蝨ｨ縺ｮ豌苓ｱ｡譚｡莉ｶ縺碁∩髮｣縺ｫ荳弱∴繧句ｽｱ髻ｿ繧り・�ｽE�ｽE縲・
2. 縲仙ｙ闢・�ｽE�ｽ�ｽE�ｽ驕ｩ蛹悶・ 迴ｾ迥ｶ縺ｮ荳崎ｶｳ迚ｩ雉・�ｽE�ｽ�ｽE�ｽ蜆ｪ蜈磯�・�ｽE�ｽ�ｽE�ｽE
3. 縲千函蟄俶姶逡･縲・ 逋ｺ轣ｽ蠕・2譎る俣縺ｮ蜈ｷ菴鍋噪縺ｪ陦悟虚險育判
4. 縲宣∩髮｣謇驕ｸ螳壹・ 霑鷹團縺ｮ螳会ｿｽE縺ｪ驕ｿ髮｣繧ｨ繝ｪ繧｢縺ｮ謠先｡・;

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
          <h1 className="text-2xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">AI髦ｲ轣ｽ繝托ｿｽE繧ｽ繝翫Ν繧ｬ繧､繝・/h1>
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
                  <span className="text-sm md:text-base uppercase italic">{isLocating ? "螳壻ｽ堺ｸｭ..." : "GPS縺ｧ迴ｾ蝨ｨ蝨ｰ繝ｻ螟ｩ豌励ｒ迚ｹ螳・}</span>
                </button>

                {location && (
                  <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-top-2">
                     <div className="bg-black/50 border border-white/5 p-4 rounded-xl text-center">
                        <p className="text-[8px] font-black text-slate-500 uppercase mb-1 italic">Coordinates</p>
                        <p className="text-xs font-mono text-emerald-400">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>
                     </div>
                     <div className="bg-black/50 border border-white/5 p-4 rounded-xl text-center">
                        <p className="text-[8px] font-black text-slate-500 uppercase mb-1 italic">Realtime Weather</p>
                        <p className="text-xs font-bold text-white uppercase italic">{weather ? `${weather.temperature}邃・/ ${weather.windspeed}km/h` : "Syncing..."}</p>
                     </div>
                  </div>
                )}
             </div>

             <div className="space-y-4 bg-black/40 p-6 rounded-[2rem] border border-white/5 shadow-inner">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-slate-500 uppercase px-3 italic">驛ｽ驕灘ｺ懃恁</label>
                     <input value={pref} onChange={(e) => setPref(e.target.value)} placeholder="逾槫･亥ｷ晉恁" className="w-full h-12 bg-[#0a0b14] border-2 border-white/5 rounded-xl px-4 text-sm text-white focus:border-emerald-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-slate-500 uppercase px-3 italic">蟶ょ玄逕ｺ譚・/label>
                     <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="豬ｷ閠∝錐蟶・ className="w-full h-12 bg-[#0a0b14] border-2 border-white/5 rounded-xl px-4 text-sm text-white focus:border-emerald-500 outline-none transition-all" />
                  </div>
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-slate-500 uppercase px-3 italic">蛯呵塘迥ｶ豕・�ｽE�ｽ�ｽE�ｽ豌ｴ繝ｻ鬟滓侭縺ｪ縺ｩ�ｽE�ｽE�ｽE�ｽE/label>
                   <input value={stock} onChange={(e) => setStock(e.target.value)} placeholder="萓・ 豌ｴ10L, 髱槫ｸｸ鬟・譌･蛻・�ｽE�ｽ�ｽE�ｽ繧・ className="w-full h-12 bg-[#0a0b14] border-2 border-white/5 rounded-xl px-4 text-sm text-white focus:border-emerald-500 outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-slate-500 uppercase px-3 italic">菴丞ｱ・�ｽE�ｽ�ｽE�ｽ諷具ｼ域惠騾�繝ｻ繝槭Φ繧ｷ繝ｧ繝ｳ遲会ｼ・/label>
                   <input value={housing} onChange={(e) => setHousing(e.target.value)} placeholder="萓・ 譛ｨ騾�2髫主ｻｺ縺ｦ" className="w-full h-12 bg-[#0a0b14] border-2 border-white/5 rounded-xl px-4 text-sm text-white focus:border-emerald-500 outline-none transition-all" />
                </div>
             </div>

             <div className="space-y-4">
               <button 
                 onClick={handleCopy} 
                 className={`w-full h-20 text-xl font-black rounded-2xl transition-all shadow-2xl border-b-4 ${copied ? 'bg-emerald-500 border-emerald-700 text-slate-950 scale-95' : 'bg-emerald-600 border-emerald-800 text-white hover:bg-emerald-500'}`}
               >
                 {copied ? '笨・COPY COMPLETE' : '竭� 險ｺ譁ｭ謖・�ｽE�ｽ�ｽE�ｽ繧偵さ繝費ｿｽE'}
               </button>
               <div className="grid grid-cols-3 gap-3">
                  <button className="h-16 bg-white/5 border-2 border-emerald-500/30 rounded-2xl text-[10px] font-black uppercase italic text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all flex flex-col items-center justify-center gap-1 shadow-lg" onClick={() => window.open('https://chatgpt.com', '_blank')}>
                    <span className="text-xl">町</span> CHATGPT
                  </button>
                  <button className="h-16 bg-white/5 border-2 border-emerald-500/30 rounded-2xl text-[10px] font-black uppercase italic text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all flex flex-col items-center justify-center gap-1 shadow-lg" onClick={() => window.open('https://gemini.google.com', '_blank')}>
                    <span className="text-xl">笨ｨ</span> GEMINI
                  </button>
                  <button className="h-16 bg-white/5 border-2 border-slate-500/30 rounded-2xl text-[10px] font-black uppercase italic text-slate-400 hover:bg-slate-600 hover:text-white transition-all flex flex-col items-center justify-center gap-1 shadow-lg" onClick={() => window.open('https://claude.ai', '_blank')}>
                    <span className="text-xl">､・/span> CLAUDE
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
                <h3 className="text-xl md:text-3xl font-black text-white italic uppercase tracking-tighter">竭｡ 逕溷ｭ俶姶逡･繝ｬ繝晢ｿｽE繝・/h3>
             </div>
             
             <textarea 
               value={report} 
               onChange={(e) => setReport(e.target.value)} 
               placeholder="AI縺九ｉ縺ｮ謌ｦ逡･繝ｬ繝晢ｿｽE繝医ｒ縺薙％縺ｫ繝夲ｿｽE繧ｹ繝・.." 
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
