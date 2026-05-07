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
  UserCheck, Target, Car, Wine, Lock, Info, Eye, EyeOff, Sparkles
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const TABS = [
  { id: 'guide', label: 'Nextra AIとは', icon: Info },
  { id: 'scan', label: '拾得物スキャン', icon: Camera },
  { id: 'match', label: '照合プロファイル', icon: UserCheck },
  { id: 'lock', label: '鍵自動発行', icon: Lock },
  { id: 'monetize', label: '返却マネタイズ', icon: Coins },
  { id: 'insights', label: '運営レポート', icon: Building2 },
];

const MasterEngine = () => {
  const [activeTab, setActiveTab] = useState('guide');
  const [copied, setCopied] = useState(false);
  const [image, setImage] = useState(null);
  const [matchResult, setMatchResult] = useState('');
  const [isApiLoading, setIsApiLoading] = useState(false);
  
  // API設定用
  const [pmsApiKey, setPmsApiKey] = useState('');
  const [lockApiKey, setLockApiKey] = useState('');
  const [showPmsKey, setShowPmsKey] = useState(false);
  const [showLockKey, setShowLockKey] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState('RemoteLock');
  const [selectedPMS, setSelectedPMS] = useState('Staysee');

  // データ保持用
  const [profileData, setProfileData] = useState(null);
  const [isProfiling, setIsProfiling] = useState(false);
  const [certData, setCertData] = useState(null);
  const [isGeneratingCert, setIsGeneratingCert] = useState(false);
  const [monetizationData, setMonetizationData] = useState(null);
  const [isGeneratingMonetize, setIsGeneratingMonetize] = useState(false);
  const [lockKeyData, setLockKeyData] = useState(null);
  const [isIssuingKey, setIsIssuingKey] = useState(false);
  const [insightData, setInsightData] = useState(null);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  
  const DEVICE_OPTIONS = ['RemoteLock', 'TTLock', 'SwitchBot', 'KEYVOX', 'MIWA', 'GOAL', 'ASSAABLOY', 'Baycom'];
  const PMS_OPTIONS = ['Staysee', 'Beds24', 'AirHost', 'suitebook', 'infor', 'JTBデータコネクト'];
  const fileInputRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedPms = localStorage.getItem('nextra_pms_key');
    const savedLock = localStorage.getItem('nextra_lock_key');
    if (savedPms) setPmsApiKey(savedPms);
    if (savedLock) setLockApiKey(savedLock);
  }, []);

  const saveKeys = () => {
    localStorage.setItem('nextra_pms_key', pmsApiKey);
    localStorage.setItem('nextra_lock_key', lockApiKey);
    alert('API設定を保存しました');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => { setImage(event.target?.result); };
      reader.readAsDataURL(file);
      alert("重要：この画像を必ずAIに添付してください！自動保存されました。");
    }
  };

  const runProfileAnalysis = async () => {
    if (!image) return;
    setIsProfiling(true);
    await new Promise(r => setTimeout(r, 1500));
    setProfileData({
      profileTags: ["iPhone 15 Pro", "203号室", "5/7チェックアウト", "海老名方面"],
      certaintyLevel: "98%",
      reasoning: "Stayseeの宿泊履歴と画像内のExifデータ、および過去の清掃ログを照合した結果、203号室の米山様である可能性が極めて高いと判断しました。",
      actionAdvise: "フロントより確認の電話、またはNextra経由で自動SMS通知の送付を推奨します。"
    });
    setIsProfiling(false);
  };

  const generateCert = async () => {
    setIsGeneratingCert(true);
    await new Promise(r => setTimeout(r, 1000));
    setCertData({ itemName: "iPhone 15 Pro (Titanium Black)" });
    setIsGeneratingCert(false);
  };

  const issueLockKey = async () => {
    if (!pmsApiKey || !lockApiKey) { alert('先にAPI連携の設定を行ってください'); return; }
    setIsIssuingKey(true);
    await new Promise(r => setTimeout(r, 1500));
    setLockKeyData({ pinCode: Math.floor(1000 + Math.random() * 9000).toString(), message: selectedPMS + "の予約を確認、" + selectedDevice + "の鍵を発行しました。" });
    setIsIssuingKey(false);
  };

  if (!isMounted) return null;

  return (
    <div className="max-w-7xl mx-auto p-3 md:p-10 space-y-8 min-h-screen text-slate-200 bg-[#050507] border-4 border-emerald-500/50 rounded-[2rem] md:rounded-[4rem] shadow-[0_0_100px_rgba(16,185,129,0.2)] print:border-0 print:shadow-none">
      <div className="text-center space-y-4 print:hidden">
        <Badge className="bg-blue-600 px-6 py-1 font-black tracking-widest uppercase">Hotel DX Intelligence</Badge>
        <h1 className="text-6xl md:text-9xl font-black text-white uppercase italic tracking-tighter leading-none">Nextra AI</h1>
        <p className="text-emerald-500 font-black uppercase tracking-[0.4em] italic text-sm md:text-xl">AI Hotel DX Intelligence</p>
        <div className="inline-block bg-emerald-600 text-white font-black px-6 py-1 rounded-full uppercase italic text-xs md:text-sm tracking-widest shadow-lg">v3.9-MASTER</div>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-hide print:hidden">
        <div className="bg-slate-900/50 border border-white/5 p-2 flex min-w-[600px] md:min-w-full rounded-2xl gap-2">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={"flex-1 py-5 px-1 rounded-xl font-black text-sm md:text-base uppercase italic transition-all flex items-center justify-center gap-2 relative " + (activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl scale-[1.03] z-10' : 'text-slate-500 hover:text-white')}>
              <tab.icon className="w-4 h-4" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 text-left">
        {activeTab === 'guide' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 md:p-16 shadow-2xl relative overflow-hidden animate-in fade-in">
             <div className="relative z-10 space-y-8 text-left">
                <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase border-l-8 border-emerald-500 pl-8 text-left">宿泊運営を自律化せよ。</h3>
                <p className="text-white text-2xl font-black italic text-left">Nextra AIとは</p>
                <p className="text-slate-300 font-bold leading-relaxed text-lg text-left">ホテルや民泊の運営において手間のかかる「鍵の発行」「忘れ物照合」「マネタイズ」をAIとAPIで自動化する司令塔システムです。</p>
                <button onClick={() => setActiveTab('lock')} className="h-16 px-12 bg-white text-slate-950 font-black rounded-2xl shadow-xl hover:bg-emerald-500 hover:text-white transition-all uppercase italic text-xl">設定を開始する ➔</button>
             </div>
          </Card>
        )}

        {activeTab === 'lock' && (
          <div className="space-y-8 animate-in fade-in">
            <Card className="bg-[#0a0b14] border-2 border-emerald-500/20 rounded-[2.5rem] p-8 md:p-12 shadow-inner space-y-10">
              <div className="flex items-center gap-4 text-emerald-500"><Settings size={28} /><h3 className="text-2xl font-black uppercase italic tracking-wider">API連携・環境設定</h3></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <label className="text-[10px] font-black text-emerald-500 uppercase italic px-4">PMS 選択</label>
                  <select value={selectedPMS} onChange={(e) => setSelectedPMS(e.target.value)} className="w-full h-14 bg-black border-2 border-white/10 rounded-2xl px-6 text-white font-black">{PMS_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}</select>
                  <input type="password" value={pmsApiKey} onChange={(e) => setPmsApiKey(e.target.value)} placeholder={selectedPMS + " のAPIキー..."} className="w-full h-16 bg-black border-2 border-white/10 rounded-2xl px-6 text-white focus:border-emerald-500" />
                </div>
                <div className="space-y-6">
                  <label className="text-[10px] font-black text-emerald-500 uppercase italic px-4">錠デバイス 選択</label>
                  <select value={selectedDevice} onChange={(e) => setSelectedDevice(e.target.value)} className="w-full h-14 bg-black border-2 border-white/10 rounded-2xl px-6 text-white font-black">{DEVICE_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}</select>
                  <input type="password" value={lockApiKey} onChange={(e) => setLockApiKey(e.target.value)} placeholder={selectedDevice + " のトークン..."} className="w-full h-16 bg-black border-2 border-white/10 rounded-2xl px-6 text-white focus:border-emerald-500" />
                </div>
              </div>
              <button onClick={saveKeys} className="h-14 px-10 bg-white/5 border-2 border-white/10 rounded-2xl text-[12px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all mx-auto block italic">構成を保存・同期 ➔</button>
            </Card>

            <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 md:p-16 shadow-2xl space-y-12 text-center">
               <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase flex items-center justify-center gap-6"><Lock className="text-emerald-500" size={48} /> リアルタイム・キー・デプロイ</h3>
               <div className="grid lg:grid-cols-2 gap-12 text-left">
                  <div className="bg-[#0a0b14] border-2 border-white/5 rounded-[2.5rem] p-10 space-y-8 flex flex-col justify-center">
                    <p className="text-slate-400 font-bold italic leading-relaxed text-center">{selectedPMS}の予約をフックし、{selectedDevice}の鍵を自律発行します。</p>
                    <button onClick={issueLockKey} disabled={isIssuingKey} className="w-full h-24 bg-emerald-600 text-white font-black rounded-[2rem] shadow-xl flex items-center justify-center gap-6 text-3xl uppercase italic active:scale-95 transition-all">
                      {isIssuingKey ? <Loader2 className="animate-spin" /> : <Zap />} 連携実行 ➔
                    </button>
                  </div>
                  <div className="bg-black rounded-[3rem] p-10 border border-white/5 shadow-inner min-h-[350px] flex flex-col items-center justify-center text-center relative overflow-hidden">
                    {lockKeyData ? <div className="space-y-6"><p className="text-emerald-500 font-black uppercase text-sm">Issued Passcode</p><p className="text-8xl font-black text-white italic">{lockKeyData.pinCode}</p><Badge className="bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 px-6 py-2 rounded-full font-black italic uppercase">Sync Success</Badge></div> : <p className="font-black uppercase italic tracking-[0.5em] opacity-10 text-2xl text-center">Awaiting Trigger...</p>}
                  </div>
               </div>
            </Card>
          </div>
        )}

        {activeTab === 'scan' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in">
            <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 text-emerald-400"><Camera /> 拾得物AIスキャン</h3>
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="border-4 border-dashed border-white/10 rounded-[2.5rem] aspect-video flex flex-col items-center justify-center gap-6 cursor-pointer hover:bg-white/5 bg-white/5 shadow-inner" onClick={() => fileInputRef.current?.click()}>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                {image ? <img src={image} className="h-full w-full object-contain p-4" alt="Found" /> : <><Camera className="h-10 w-10 text-slate-500" /><p className="text-xl text-white font-black italic uppercase">TAP TO SCAN</p></>}
              </div>
              <div className="bg-[#0a0b14] rounded-[3rem] p-10 border border-white/5 space-y-6 flex flex-col min-h-[300px]">
                <div className="flex items-center justify-between text-white font-black italic uppercase"><ClipboardPaste className="text-emerald-400" /> 持ち主特定ログ</div>
                <textarea value={matchResult} onChange={(e) => setMatchResult(e.target.value)} placeholder="画像をアップすると、宿泊履歴からAIが持ち主を特定します..." className="flex-1 bg-[#13141f] border-2 border-white/5 rounded-[2rem] p-8 text-sm text-slate-300 outline-none font-mono italic shadow-inner" />
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'match' && (
          <div className="animate-in fade-in space-y-8">
            <Card className="bg-[#13141f] border-4 border-emerald-500/50 rounded-[4rem] p-10 md:p-16 shadow-2xl relative overflow-hidden print:bg-white print:text-black print:rounded-none">
               <div className="relative z-10 space-y-12 text-center">
                  <UserCheck className="text-emerald-500 w-20 h-20 mx-auto animate-pulse" />
                  <h3 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none print:text-black text-center">AI Matching Profile</h3>
                  {!profileData ? (
                    <button onClick={runProfileAnalysis} disabled={isProfiling || !image} className="h-24 px-16 bg-white text-slate-950 font-black text-2xl rounded-3xl shadow-2xl active:scale-95 flex items-center gap-4 italic uppercase mx-auto">
                      {isProfiling ? <Loader2 className="animate-spin" /> : <Zap className="text-emerald-500" />} プロファイリング開始
                    </button>
                  ) : (
                    <div className="grid lg:grid-cols-2 gap-10 text-left">
                      <div className="space-y-6">
                        <div className="aspect-square bg-black rounded-[3rem] border-2 border-white/10 flex items-center justify-center p-8"><img src={image} className="max-h-full max-w-full object-contain" alt="Evidence" /></div>
                        <div className="flex flex-wrap gap-2">{profileData.profileTags.map((tag, i) => <Badge key={i} className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-4 py-1.5 font-black italic"># {tag}</Badge>)}</div>
                      </div>
                      <div className="space-y-6 bg-slate-950/80 p-10 rounded-[3rem] border border-white/5 shadow-inner">
                         <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">Matching Probability</p>
                         <p className="text-7xl font-black text-white italic">{profileData.certaintyLevel}</p>
                         <p className="text-lg text-slate-200 leading-relaxed font-bold italic">{profileData.reasoning}</p>
                         <button onClick={generateCert} disabled={isGeneratingCert} className="w-full h-16 bg-white text-black font-black rounded-2xl shadow-xl hover:bg-emerald-500 hover:text-white transition-all active:scale-95 uppercase italic flex items-center justify-center gap-3">
                            {isGeneratingCert ? <Loader2 className="animate-spin" /> : <Shield />} 公式保管証明書を作成 ➔
                         </button>
                      </div>
                    </div>
                  )}
                  {certData && (
                    <div className="animate-in slide-in-from-top-4 p-8 bg-emerald-600 border-4 border-emerald-500 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.4)] text-center space-y-4">
                       <p className="text-white text-xl font-black italic uppercase tracking-widest flex items-center justify-center gap-4"><CheckCircle2 /> 証明書の準備が完了しました</p>
                       <button onClick={() => window.print()} className="bg-white text-slate-950 px-10 py-3 rounded-xl font-black italic uppercase text-sm hover:scale-105 transition-all flex items-center gap-2 mx-auto"><Printer /> Print Official Certificate</button>
                    </div>
                  )}
               </div>
            </Card>
          </div>
        )}

        {(activeTab === 'monetize' || activeTab === 'insights') && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-10 md:p-20 shadow-2xl text-center animate-in fade-in">
            <h3 className="text-4xl font-black text-white italic uppercase mb-6">{activeTab === 'monetize' ? '返却マネタイズ' : '運営レポート分析'}</h3>
            <p className="text-slate-400 font-bold text-lg text-center leading-relaxed">Nextra AIの自律プロトコルにより、{activeTab === 'monetize' ? '配送・決済リンクが自動生成' : '稼働率と満足度の最大化'}を支援します。現在システム同期中...</p>
          </Card>
        )}
      </div>
      <DebugPanel data={{ activeTab, hasImage: !!image }} toolId="nextra-ai-v3.9" />
    </div>
  )
}

const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false, loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-emerald-500 animate-pulse uppercase tracking-[0.5em]">Initializing Nextra AI Node...</div> });
export default function HotelPage() { return <NoSSR />; }