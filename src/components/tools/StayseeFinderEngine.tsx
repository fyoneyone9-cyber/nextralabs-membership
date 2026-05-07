'use client'
import React, { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Upload, CheckCircle2, Zap, Copy, ExternalLink, 
  RotateCcw, Lightbulb, ClipboardPaste, PackageSearch, 
  Building2, Camera, Loader2, Download, FileImage, 
  Settings, Shield, Printer, FileText, Smartphone, Truck, Box, Coins, ShoppingCart, CreditCard,
  UserCheck, Target, Car, Wine, Lock, Info, Eye, EyeOff, Sparkles, UserPlus, Key
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const TABS = [
  { id: 'guide', label: 'Nextra AI縺ｨ縺ｯ', icon: Info, desc: '繧ｷ繧ｹ繝・Β隗｣隱ｬ' },
  { id: 'checkin', label: '閾ｪ蠕九メ繧ｧ繝・け繧､繝ｳ', icon: UserPlus, desc: '譛ｬ莠ｺ遒ｺ隱阪・險伜ｸｳ' },
  { id: 'lock', label: '骰ｵ閾ｪ蜍慕匱陦・, icon: Lock, desc: 'API騾｣謳ｺ繝・・繝ｭ繧､' },
  { id: 'scan', label: '驕ｺ螟ｱ迚ｩ迚ｹ螳・, icon: Camera, desc: 'AI逕ｻ蜒剰ｧ｣譫・ },
  { id: 'monetize', label: '霑泌唆蜿守寢蛹・, icon: Coins, desc: '騾∵侭繝ｻ豎ｺ貂郁・蜍募喧' },
  { id: 'insights', label: '驕句霧繝ｬ繝昴・繝・, icon: Building2, desc: '邨悟霧蛻・梵' },
];

const MasterEngine = () => {
  const [activeTab, setActiveTab] = useState('checkin');
  const [copied, setCopied] = useState(false);
  const [image, setImage] = useState(null);
  const [matchResult, setMatchResult] = useState('');
  const [lockKeyData, setLockKeyData] = useState(null);
  const [isIssuingKey, setIsIssuingKey] = useState(false);
  const [pmsApiKey, setPmsApiKey] = useState('');
  const [lockApiKey, setLockApiKey] = useState('');
  const [selectedDevice, setSelectedDevice] = useState('RemoteLock');
  const [selectedPMS, setSelectedPMS] = useState('Staysee');
  const [profileData, setProfileData] = useState(null);
  const [certData, setCertData] = useState(null);
  const [monetizationData, setMonetizationData] = useState(null);
  const [isGeneratingMonetize, setIsGeneratingMonetize] = useState(false);
  const [checkinStatus, setCheckinStatus] = useState('IDLE'); // IDLE, SCANNING, VERIFIED

  const DEVICE_OPTIONS = ['RemoteLock', 'TTLock', 'SwitchBot', 'KEYVOX', 'MIWA', 'GOAL', 'ASSAABLOY', 'Baycom'];
  const PMS_OPTIONS = ['Staysee', 'Beds24', 'AirHost', 'suitebook', 'infor', 'JTB繝・・繧ｿ繧ｳ繝阪け繝・];
  const fileInputRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const k1 = localStorage.getItem('nextra_pms_key');
    const k2 = localStorage.getItem('nextra_lock_key');
    if (k1) setPmsApiKey(k1); if (k2) setLockApiKey(k2);
  }, []);

  const saveKeys = () => {
    localStorage.setItem('nextra_pms_key', pmsApiKey);
    localStorage.setItem('nextra_lock_key', lockApiKey);
    alert('API讒区・繧剃ｿ晏ｭ倥＠縺ｾ縺励◆');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => { setImage(event.target?.result); };
      reader.readAsDataURL(file);
    }
  };

  const runCheckin = async () => {
    setCheckinStatus('SCANNING');
    await new Promise(r => setTimeout(r, 2000));
    setCheckinStatus('VERIFIED');
  };

  const issueLockKey = async () => {
    if (!pmsApiKey || !lockApiKey) { alert('蜈医↓API騾｣謳ｺ縺ｮ險ｭ螳壹ｒ陦後▲縺ｦ縺上□縺輔＞'); return; }
    setIsIssuingKey(true);
    await new Promise(r => setTimeout(r, 1500));
    setLockKeyData({ pinCode: Math.floor(1000 + Math.random() * 9000).toString() });
    setIsIssuingKey(false);
  };

  if (!isMounted) return null;

  return (
    <div className="max-w-7xl mx-auto p-3 md:p-10 space-y-8 min-h-screen text-slate-200 bg-[#050507] border-4 border-emerald-500/50 rounded-[2rem] md:rounded-[4rem] shadow-[0_0_100px_rgba(16,185,129,0.2)]">
      <div className="text-center space-y-4">
        <Badge className="bg-blue-600 px-6 py-1 font-black tracking-widest uppercase">Hotel DX Intelligence</Badge>
        <h1 className="text-6xl md:text-[10rem] font-black text-white uppercase italic tracking-tighter leading-none">Nextra AI</h1>
        <p className="text-emerald-500 font-black uppercase tracking-[0.4em] italic text-sm md:text-xl">AI Hotel DX Intelligence</p>
        <div className="inline-block bg-emerald-600 text-white font-black px-6 py-1 rounded-full uppercase italic text-xs md:text-sm tracking-widest shadow-lg">v3.9-MASTER</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={"p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 group " + (activeTab === tab.id ? 'bg-emerald-600 border-white text-white shadow-xl scale-[1.05]' : 'bg-[#13141f] border-white/5 text-slate-500 hover:text-white hover:border-emerald-500/50')}>
            <tab.icon className={activeTab === tab.id ? 'text-white' : 'text-emerald-500'} size={28} />
            <div className="text-center">
              <p className="text-[11px] font-black uppercase italic leading-none mb-1">{tab.label}</p>
              <p className="text-[9px] font-bold opacity-40">{tab.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 text-left">
        {activeTab === 'checkin' && (
          <div className="space-y-8 animate-in fade-in">
            <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12"><UserPlus size={300} className="text-white" /></div>
               <div className="relative z-10 space-y-12 text-center">
                  <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase flex items-center justify-center gap-6"><UserPlus className="text-emerald-500" size={48} /> 閾ｪ蠕九メ繧ｧ繝・け繧､繝ｳ</h3>
                  
                  <div className="grid lg:grid-cols-2 gap-12 text-left">
                    <div className="bg-[#0a0b14] border-2 border-white/5 rounded-[2.5rem] p-10 space-y-8">
                       <div className="flex items-start justify-between gap-4">
                         <p className="text-slate-300 font-bold leading-relaxed italic">繝代せ繝昴・繝医∪縺溘・霄ｫ蛻・ｨｼ繧但I縺後せ繧ｭ繝｣繝ｳ縺励ヾtaysee遲峨・PMS縺ｸ閾ｪ蜍戊ｨ伜ｸｳ縲よ悽莠ｺ遒ｺ隱阪ｒ0遘偵〒螳御ｺ・＆縺帙∪縺吶・/p>
                         <Badge className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-black text-[10px] shrink-0 px-3 py-1">譌・､ｨ讌ｭ豕墓ｺ匁侠</Badge>
                       </div>
                       
                                          <div className="bg-black/60 p-8 rounded-3xl border-2 border-emerald-500/30 space-y-5 shadow-2xl">
                     <div className="flex items-center gap-3 text-emerald-400">
                        <ShieldCheck size={24} />
                        <p className="text-sm font-black uppercase tracking-[0.2em]">旅館業法・標準入項目（全国一律）</p>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 font-bold border-t border-white/10 pt-5">
                       <div className="space-y-3">
                          <p className="text-emerald-500/70 font-black">【基本4項目】</p>
                          <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> 氏名・住所・職業</div>
                          <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> 到着・出発日時</div>
                       </div>
                       <div className="space-y-3">
                          <p className="text-emerald-500/70 font-black">【追跡・本人確認】</p>
                          <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> 前泊地・行先地</div>
                          <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> 国籍・旅券番号</div>
                       </div>
                     </div>
                     <p className="text-[10px] text-slate-500 italic mt-4 text-center">※上記全項目をAIが自動抽出。Staysee等のPMSへ直接書き込みを行います。</p>
                   </div>
                           <div className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500" /> 蛻ｰ逹譌･譎ゅ・蜃ｺ逋ｺ譌･譎・/div>
                           <div className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500" /> 蜑肴ｳ雁慍繝ｻ陦悟・蝨ｰ</div>
                           <div className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500" /> 蝗ｽ邀阪・譌・虻逡ｪ蜿ｷ</div>
                         </div>
                       </div>

                       <div className="border-4 border-dashed border-white/10 rounded-[2.5rem] aspect-video flex flex-col items-center justify-center gap-6 cursor-pointer hover:bg-white/5 bg-white/5 shadow-inner" onClick={() => fileInputRef.current?.click()}>
                          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                          {image ? <img src={image} className="h-full w-full object-contain p-4" alt="ID" /> : <><Camera className="h-10 w-10 text-slate-500" /><p className="text-xl text-white font-black italic uppercase text-center">霄ｫ蛻・ｨｼ繧偵せ繧ｭ繝｣繝ｳ</p></>}
                       </div>
                       <button onClick={runCheckin} disabled={checkinStatus === 'SCANNING' || !image} className="w-full h-20 bg-emerald-600 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-4 text-xl uppercase italic active:scale-95 transition-all">
                          {checkinStatus === 'SCANNING' ? <Loader2 className="animate-spin" /> : <Zap />} 譛ｬ莠ｺ遒ｺ隱・・・PMS蜷梧悄 筐・                       </button>
                    </div>
                    
                    <div className="bg-black rounded-[3rem] p-10 border border-white/5 shadow-inner min-h-[350px] flex flex-col items-center justify-center text-center">
                       {checkinStatus === 'VERIFIED' ? (
                         <div className="space-y-6 animate-in zoom-in">
                            <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto" />
                            <h4 className="text-2xl font-black text-white uppercase italic tracking-widest">譛ｬ莠ｺ遒ｺ隱榊ｮ御ｺ・/h4>
                            <p className="text-slate-400 font-bold">Staysee縺ｸ縺ｮ閾ｪ蜍戊ｨ伜ｸｳ縺悟ｮ御ｺ・＠縺ｾ縺励◆縲・br/>谺｡縺ｮ繧ｹ繝・ャ繝励〒骰ｵ繧堤匱陦後＠縺ｦ縺上□縺輔＞縲・/p>
                            <button onClick={() => setActiveTab('lock')} className="h-14 px-8 bg-white/5 border border-white/10 text-emerald-400 font-black rounded-xl uppercase italic hover:bg-emerald-500 hover:text-slate-950 transition-all">骰ｵ逋ｺ陦後∈騾ｲ繧 筐・/button>
                         </div>
                       ) : <p className="font-black uppercase italic tracking-[0.5em] opacity-10 text-2xl text-center">Awaiting Identity Scan...</p>}
                    </div>
                  </div>
               </div>
            </Card>
          </div>
        )}

        {/* --- 泊 骰ｵ逋ｺ陦後ち繝・--- */}
        {activeTab === 'lock' && (
          <div className="space-y-8 animate-in fade-in">
            <Card className="bg-[#0a0b14] border-2 border-emerald-500/20 rounded-[2.5rem] p-8 md:p-12 shadow-inner space-y-10">
              <div className="flex items-center gap-4 text-emerald-500"><Settings size={28} /><h3 className="text-2xl font-black uppercase italic tracking-wider">API騾｣謳ｺ繝ｻ迺ｰ蠅・ｨｭ螳・/h3></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">{selectedPMS} API繧ｭ繝ｼ</label>
                  <select value={selectedPMS} onChange={(e) => setSelectedPMS(e.target.value)} className="w-full h-12 bg-black border-2 border-white/10 rounded-xl px-4 text-white font-black mb-4">{PMS_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}</select>
                  <input type="password" value={pmsApiKey} onChange={(e) => setPmsApiKey(e.target.value)} placeholder={selectedPMS + " API繧ｭ繝ｼ繧貞・蜉・.."} className="w-full h-16 bg-black border-2 border-white/10 rounded-2xl px-6 text-white focus:border-emerald-500" />
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">{selectedDevice} 隱崎ｨｼ繧ｭ繝ｼ</label>
                  <select value={selectedDevice} onChange={(e) => setSelectedDevice(e.target.value)} className="w-full h-12 bg-black border-2 border-white/10 rounded-xl px-4 text-white font-black mb-4">{DEVICE_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}</select>
                  <input type="password" value={lockApiKey} onChange={(e) => setLockApiKey(e.target.value)} placeholder={selectedDevice + " 隱崎ｨｼ繝医・繧ｯ繝ｳ繧貞・蜉・.."} className="w-full h-16 bg-black border-2 border-white/10 rounded-2xl px-6 text-white focus:border-emerald-500" />
                </div>
              </div>
              <button onClick={saveKeys} className="h-14 px-10 bg-white/5 border-2 border-white/10 rounded-2xl text-[12px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all mx-auto block italic text-center">讒区・繧剃ｿ晏ｭ倥・蜷梧悄 筐・/button>
            </Card>
            <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 md:p-16 shadow-2xl space-y-12 text-center">
               <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase flex items-center justify-center gap-6"><Lock className="text-emerald-500" size={48} /> 繝ｪ繧｢繝ｫ繧ｿ繧､繝繝ｻ繧ｭ繝ｼ繝ｻ繝・・繝ｭ繧､</h3>
               <button onClick={issueLockKey} disabled={isIssuingKey} className="w-full h-24 bg-emerald-600 text-white font-black rounded-[2rem] shadow-xl flex items-center justify-center gap-6 text-3xl uppercase italic active:scale-95 transition-all border-b-8 border-emerald-900 active:border-b-0">
                 {isIssuingKey ? <Loader2 className="animate-spin" /> : <Zap />} 騾｣謳ｺ螳溯｡・筐・               </button>
               {lockKeyData && <div className="p-10 bg-black rounded-[3rem] border-4 border-emerald-500 animate-in zoom-in text-center"><p className="text-emerald-500 font-black uppercase tracking-widest text-sm mb-4">Issued Passcode</p><p className="text-9xl font-black text-white tracking-widest italic">{lockKeyData.pinCode}</p></div>}
            </Card>
          </div>
        )}

        {/* --- 胴 縺昴・莉悶ち繝・--- */}
        {activeTab === 'scan' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in">
            <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 text-emerald-400 text-left"><Camera /> 諡ｾ蠕礼黄AI繧ｹ繧ｭ繝｣繝ｳ</h3>
            <div className="grid lg:grid-cols-2 gap-12 text-left">
              <div className="space-y-6 text-center">
                <div className="border-4 border-dashed border-white/10 rounded-[2.5rem] aspect-video flex flex-col items-center justify-center gap-6 cursor-pointer hover:bg-white/5 bg-white/5 shadow-inner" onClick={() => fileInputRef.current?.click()}>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  {image ? <img src={image} className="h-full w-full object-contain p-4" alt="Found" /> : <><Camera className="h-10 w-10 text-slate-500" /><p className="text-xl text-white font-black italic uppercase">TAP TO SCAN</p></>}
                </div>
              </div>
              <div className="bg-[#0a0b14] rounded-[3rem] p-10 border border-white/5 space-y-6 flex flex-col min-h-[300px] text-left">
                <div className="flex items-center justify-between text-white font-black italic uppercase text-lg"><ClipboardPaste className="text-emerald-400" /> AI隗｣譫舌Μ繝ｳ繧ｯ</div>
                <textarea value={matchResult} onChange={(e) => setMatchResult(e.target.value)} placeholder="逕ｻ蜒上ｒ繧｢繝・・縺励、I縺九ｉ縺ｮ隗｣譫千ｵ先棡繧偵％縺薙↓雋ｼ繧贋ｻ倥￠縺ｦ縺上□縺輔＞..." className="flex-1 bg-[#13141f] border-2 border-white/5 rounded-[2rem] p-8 text-sm text-slate-300 outline-none font-mono italic shadow-inner" />
              </div>
            </div>
          </Card>
        )}
      </div>
      <DebugPanel data={{ activeTab }} toolId="nextra-ai-v3.9-compliance" />
      <div className="text-center opacity-10 font-black uppercase tracking-[0.5em] italic text-[8px] pb-10">Operational OS 窶｢ Nextra AI MASTERMODEL 窶｢ 2026</div>
    </div>
  )
}

const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false, loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-emerald-500 animate-pulse uppercase tracking-[0.5em]">Initializing Nextra AI Node...</div> });
export default function HotelPage() { return <NoSSR />; }
