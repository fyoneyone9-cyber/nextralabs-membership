'use client'
import React, { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Upload, CheckCircle2, Copy, RotateCcw, Lightbulb, 
  ClipboardPaste, Home, ShieldCheck, MapPin, Download, Loader2, 
  Sparkles, Building2, Search, AlertTriangle, Info, ChevronRight, Zap
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const ENTRY_MODES = [
  { 
    id: 'area', 
    label: '繧ｨ繝ｪ繧｢繝ｻ豐ｻ螳芽ｪｿ譟ｻ', 
    desc: '蛟呵｣懷慍縺ｮ繝上じ繝ｼ繝峨・豐ｻ螳峨ｒ蛻・梵', 
    icon: MapPin, 
    color: 'text-blue-500', 
    bg: 'bg-blue-500/10',
    steps: ['蟶ょ玄逕ｺ譚代ｒ蜈･蜉・, 'AI繝励Ο繝ｳ繝励ヨ逕滓・', '繝ｪ繧ｹ繧ｯ蛻､螳・]
  },
  { 
    id: 'room', 
    label: '蜀・ｦ九・迚ｩ莉ｶ繝√ぉ繝・け', 
    desc: '蜀咏悄縺九ｉ荳榊ｙ繧呈垓縺・, 
    icon: Home, 
    color: 'text-indigo-500', 
    bg: 'bg-indigo-500/10',
    steps: ['驛ｨ螻九・蜀咏悄繧偵い繝・・', 'Vision繝励Ο繝ｳ繝励ヨ逕滓・', '荳榊ｙ縺ｮ迚ｹ螳・]
  },
  { 
    id: 'contract', 
    label: '螂醍ｴ・嶌繝ｻ驥崎ｦ∽ｺ矩・, 
    desc: '迚ｹ邏・ｄ雋ｻ逕ｨ縺ｮ鄂繧偵メ繧ｧ繝・け', 
    icon: ShieldCheck, 
    color: 'text-emerald-500', 
    bg: 'bg-emerald-500/10',
    steps: ['螂醍ｴ・嶌繧定ｲｼ莉・, '繝ｪ繧ｹ繧ｯ謚ｽ蜃ｺ繝励Ο繝ｳ繝励ヨ', '莠､貂臥せ縺ｮ迚ｹ螳・]
  },
];

const MasterEngine = () => {
  const [mode, setMode] = useState('selection');
  const [report, setReport] = useState('');
  const [score, setScore] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  // 繧ｨ繝ｪ繧｢隱ｿ譟ｻ逕ｨ繝輔か繝ｼ繝
  const [pref, setPref] = useState('');
  const [city, setCity] = useState('');
  const [station, setCityStation] = useState('');
  const [memo, setMemo] = useState('');

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    if (report && !score) {
      setIsProcessing(true);
      setTimeout(() => {
        const baseScore = 70 + Math.floor(Math.random() * 25);
        setScore(baseScore);
        setIsProcessing(false);
      }, 1500);
    }
  }, [report, score]);

  if (!isMounted) return null;

  const currentSteps = mode === 'selection' ? ["迥ｶ豕√ｒ驕ｸ謚・] : [...(ENTRY_MODES.find(m => m.id === mode)?.steps || []), "譛邨ょ愛螳・];
  const activeStepIndex = mode === 'selection' ? 0 : (report ? currentSteps.length - 1 : 1);

  const getPrompt = () => {
    if (mode === 'area') {
      return `縺ゅ↑縺溘・繝励Ο縺ｮ髦ｲ迥ｯ繝ｻ蝨ｰ蝓溷・譫舌さ繝ｳ繧ｵ繝ｫ繧ｿ繝ｳ繝医〒縺吶ゆｻ･荳九・繧ｨ繝ｪ繧｢縺ｫ縺､縺・※縲∝・逧・ョ繝ｼ繧ｿ縺ｫ蝓ｺ縺･縺肴ｲｻ螳峨・蝨ｰ逶､繝ｻ蛻ｩ萓ｿ諤ｧ縺ｮ隕ｳ轤ｹ縺九ｉ繝ｪ繧ｹ繧ｯ蛻・梵繧定｡後＞縲√郡縲廛縲阪・繝ｩ繝ｳ繧ｯ蛻､螳壹→蜈ｷ菴鍋噪縺ｪ豕ｨ諢冗せ繧貞・蜉帙＠縺ｦ縺上□縺輔＞縲・n縲占ｪｿ譟ｻ繧ｨ繝ｪ繧｢縲托ｼ・{pref} ${city}・域怙蟇・ｊ・・{station}鬧・ｼ噂n縲占｣懆ｶｳ繝｡繝｢縲托ｼ・{memo || "迚ｹ縺ｫ縺ｪ縺・}`;
    }
    if (mode === 'room') {
      return `縺ゅ↑縺溘・荳榊虚逕｣邂｡逅・・繧ｹ繝壹す繝｣繝ｪ繧ｹ繝医〒縺吶よｷｻ莉倥＆繧後◆蜀・ｦ句・逵溘°繧峨∝｣√・縺ｲ縺ｳ蜑ｲ繧後√き繝薙・莠亥・縲∬ｨｭ蛯吶・蜉｣蛹悶∵ｸ・祉迥ｶ諷九∝ｻｺ莉倥￠縺ｮ豁ｪ縺ｿ縺ｪ縺ｩ縲∫ｴ莠ｺ縺瑚ｦ玖誠縺ｨ縺励′縺｡縺ｪ荳榊ｙ繧貞ｾｹ蠎慕噪縺ｫ豢励＞蜃ｺ縺励∝・螻・燕縺ｫ遒ｺ隱阪・莠､貂峨☆縺ｹ縺阪・繧､繝ｳ繝医ｒ繝ｪ繧ｹ繝医い繝・・縺励※縺上□縺輔＞縲Ａ;
    }
    if (mode === 'contract') {
      return `縺ゅ↑縺溘・雉・ｲｸ繝医Λ繝悶Ν繧貞ｰる摩縺ｨ縺吶ｋ豕募漁繧｢繝峨ヰ繧､繧ｶ繝ｼ縺ｧ縺吶ゆｻ･荳九・螂醍ｴ・嶌繝ｻ驥崎ｦ∽ｺ矩・ｪｬ譏取嶌縺ｮ繝峨Λ繝輔ヨ縺九ｉ縲・蜴ｻ譎ゅ・鬮倬｡崎ｫ区ｱゅΜ繧ｹ繧ｯ縲∽ｸ榊ｽ薙↑迚ｹ邏・∵峩譁ｰ譁吶・鄂縲∬ｨｭ蛯吩ｿｮ郢輔・雋諡・玄蛻・↑縺ｩ縲∝滉ｸｻ縺ｫ荳榊茜縺ｪ譚｡鬆・ｒ迚ｹ螳壹＠縲∽ｿｮ豁｣莠､貂峨・縺溘ａ縺ｮ譁・ｨ繧呈署譯医＠縺ｦ縺上□縺輔＞縲・n縲仙･醍ｴ・・螳ｹ縲托ｼ・{memo}`;
    }
    return '';
  };

  const handleCopy = (text) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result);
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-3 md:p-10 space-y-6 md:space-y-10 min-h-screen text-slate-200 font-sans pb-10 bg-[#050507] text-left border-4 md:border-8 border-emerald-500/50 rounded-[2rem] md:rounded-[4rem] my-2 md:my-4 shadow-[0_0_100px_rgba(16,185,129,0.2)]">
      <div className="text-center space-y-1 md:space-y-3">
        <Badge className="bg-indigo-600 text-white font-black italic px-3 py-0.5 text-[8px] md:text-[10px] uppercase rounded-full">螻・ｽ丞ｮ牙・繧､繝ｳ繝・Μ繧ｸ繧ｧ繝ｳ繧ｹ</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">AI蠑戊ｶ翫＠螳牙ｿ・メ繧ｧ繝・き繝ｼ</h1>
        <div className="inline-block bg-emerald-600 text-white font-black px-4 py-0.5 rounded-full uppercase italic text-[8px] md:text-[10px] tracking-widest shadow-lg">v2.0-MASTER</div>
      </div>

      <div className="max-w-4xl mx-auto px-4 overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex items-center justify-between min-w-[500px] relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
          {currentSteps.map((s, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center gap-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black italic text-[10px] transition-all ${i <= activeStepIndex ? 'bg-indigo-600 text-white shadow-lg scale-110' : 'bg-slate-900 text-slate-600 border border-slate-800'}`}>
                {i < activeStepIndex ? <CheckCircle2 size={12} /> : i + 1}
              </div>
              <span className={`text-[8px] font-black uppercase italic ${i <= activeStepIndex ? 'text-indigo-400' : 'text-slate-700'}`}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {mode === 'selection' && (
        <div className="grid md:grid-cols-3 gap-6 animate-in fade-in">
          {ENTRY_MODES.map((item) => (
            <Card key={item.id} onClick={() => setMode(item.id)} className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-10 md:p-14 hover:border-indigo-500 min-h-[320px] flex flex-col justify-center transition-all cursor-pointer group shadow-xl relative overflow-hidden">
              <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}><item.icon size={28} /></div>
              <h3 className="text-2xl md:text-3xl font-black text-white italic mb-3 uppercase leading-tight group-hover:text-indigo-400 transition-colors">{item.label}</h3>
              <p className="text-slate-300 font-bold text-sm md:text-base mb-8 leading-relaxed italic">{item.desc}</p>
              <div className="space-y-1">
                {item.steps.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-[10px] md:text-xs font-black text-slate-300 uppercase italic"><ChevronRight size={8} className={item.color} /> {s}</div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {mode !== 'selection' && (
        <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-6 md:p-12 shadow-2xl animate-in zoom-in-95 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-600 to-transparent opacity-30" />
          
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl md:text-3xl font-black text-white italic uppercase flex items-center gap-4">
              {ENTRY_MODES.find(m => m.id === mode)?.icon && React.createElement(ENTRY_MODES.find(m => m.id === mode).icon, { className: "text-indigo-500", size: 32 })}
              {ENTRY_MODES.find(m => m.id === mode)?.label}
            </h3>
            <button onClick={() => { setMode('selection'); setReport(''); setScore(null); setImage(null); }} className="text-slate-500 font-black italic uppercase text-[10px] hover:text-white flex items-center gap-2 transition-all"><RotateCcw size={14} /> 驕ｸ謚槭↓謌ｻ繧・/button>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 text-left">
            <div className="space-y-6">
              {mode === 'area' && (
                <div className="space-y-4 bg-black/40 p-6 rounded-[2rem] border border-white/5 shadow-inner">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase px-4 italic">驛ｽ驕灘ｺ懃恁</label>
                       <input value={pref} onChange={(e) => setPref(e.target.value)} placeholder="逾槫･亥ｷ晉恁" className="w-full h-14 bg-[#0a0b14] border-2 border-white/5 rounded-xl px-6 text-sm text-white focus:border-indigo-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase px-4 italic">蟶ょ玄逕ｺ譚・/label>
                       <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="豬ｷ閠∝錐蟶・ className="w-full h-14 bg-[#0a0b14] border-2 border-white/5 rounded-xl px-6 text-sm text-white focus:border-indigo-500 outline-none transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase px-4 italic">譛蟇・ｊ鬧・/label>
                     <input value={station} onChange={(e) => setCityStation(e.target.value)} placeholder="豬ｷ閠∝錐" className="w-full h-14 bg-[#0a0b14] border-2 border-white/5 rounded-xl px-6 text-sm text-white focus:border-indigo-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase px-4 italic">陬懆ｶｳ繝｡繝｢・亥ｾ呈ｭｩ蛻・焚縺ｪ縺ｩ・・/label>
                     <textarea value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="鬧・°繧牙ｾ呈ｭｩ10蛻・恟蜀・・撕縺九↑迺ｰ蠅・ｒ蟶梧悍..." className="w-full h-24 bg-[#0a0b14] border-2 border-white/5 rounded-xl p-4 text-sm text-white focus:border-indigo-500 outline-none transition-all resize-none" />
                  </div>
                </div>
              )}
              {mode === 'room' && (
                <div className="space-y-6">
                  {!image ? (
                    <div className="border-4 border-dashed border-white/10 rounded-[2.5rem] aspect-video flex flex-col items-center justify-center gap-6 cursor-pointer hover:bg-white/5 bg-white/5 shadow-inner group relative overflow-hidden" onClick={() => fileInputRef.current?.click()}>
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                      <Upload className="h-16 w-16 text-slate-700" />
                      <p className="text-xl text-white font-black italic uppercase">蜀・ｦ句・逵溘ｒ繝峨Ο繝・・</p>
                    </div>
                  ) : (
                    <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border-4 border-indigo-600/30 shadow-2xl bg-black flex items-center justify-center">
                       <img src={image} alt="Room" className="max-h-full max-w-full object-contain" />
                       <button onClick={() => setImage(null)} className="absolute top-6 right-6 bg-black/50 hover:bg-red-600 p-2 rounded-full h-12 w-12 text-white">笨・/button>
                    </div>
                  )}
                </div>
              )}
              {mode === 'contract' && (
                <textarea value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="螂醍ｴ・嶌繧・㍾隕∽ｺ矩・ｪｬ譏取嶌縺ｮ繝・く繧ｹ繝医ｒ雋ｼ繧贋ｻ倥￠縺ｦ縺上□縺輔＞..." className="w-full h-48 bg-black/40 border-2 border-white/5 rounded-[2rem] p-6 text-sm text-white focus:border-indigo-500 outline-none shadow-inner italic" />
              )}

              <div className="space-y-4">
                <button onClick={() => handleCopy(getPrompt())} className={`w-full h-20 text-xl font-black rounded-2xl transition-all shadow-xl flex items-center justify-center gap-4 ${copied ? 'bg-emerald-500 text-slate-950 scale-95' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}>
                  {copied ? '笨・COPY COMPLETE' : '竭 隗｣譫先欠遉ｺ繧偵さ繝斐・'}
                </button>
                <div className="grid grid-cols-3 gap-3">
                   <button className="h-14 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-500 hover:text-white uppercase italic transition-all" onClick={() => window.open('https://chatgpt.com', '_blank')}>ChatGPT 噫</button>
                   <button className="h-14 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-500 hover:text-white uppercase italic transition-all" onClick={() => window.open('https://gemini.google.com', '_blank')}>Gemini 噫</button>
                   <button className="h-14 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-500 hover:text-white uppercase italic transition-all" onClick={() => window.open('https://claude.ai', '_blank')}>Claude 噫</button>
                </div>
              </div>
            </div>

            <div className="bg-black/40 rounded-[3rem] p-10 border border-white/5 flex flex-col gap-6 shadow-inner min-h-[500px] relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-indigo-400 font-black italic uppercase text-lg"><ClipboardPaste size={28} /> 竭｡ 隗｣譫舌Ξ繝昴・繝・/div>
                {score && <div className="text-right leading-none bg-indigo-600/10 p-4 rounded-2xl border border-indigo-500/20"><p className="text-[10px] font-black text-indigo-500 italic uppercase">Safe Score</p><p className="text-4xl font-black text-white italic">{score}%</p></div>}
              </div>
              <textarea value={report} onChange={(e) => setReport(e.target.value)} placeholder="AI縺ｮ隗｣譫千ｵ先棡繧偵・繝ｼ繧ｹ繝・.." className="flex-1 bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 text-sm text-slate-200 focus:border-indigo-500 outline-none font-sans leading-relaxed shadow-inner italic" />
              {isProcessing && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4 z-20"><Loader2 className="w-12 h-12 text-indigo-500 animate-spin" /><p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest animate-pulse">Analyzing Performance...</p></div>
              )}
            </div>
          </div>
        </Card>
      )}

      <DebugPanel data={{ mode, reportLen: report.length }} toolId="moving-checker-master" />
      <div className="text-center opacity-10 mt-10 font-black uppercase tracking-[0.5em] italic text-[10px]">Living Intelligence OS 窶｢ NextraLabs 2026</div>
    </div>
  )
}

const MovingCheckerWithNoSSR = dynamic(() => Promise.resolve(MasterEngine), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-emerald-500 animate-pulse uppercase tracking-[0.5em]">Initializing Area Master...</div>
})

export default function NoSSRWrapper() {
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => { setIsMounted(true); }, []);
  if (!isMounted) return <div className="min-h-screen bg-[#050507]" />;
  return <MovingCheckerWithNoSSR />;
}
