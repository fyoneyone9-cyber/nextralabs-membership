'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Upload, CheckCircle2, Zap, Copy, ExternalLink, RotateCcw, Lightbulb, ClipboardPaste, PackageSearch, Building2, UserSearch, Camera, Loader2, Download, FileImage } from 'lucide-react'

import { DebugPanel } from '@/components/tools/DebugPanel'

const TABS = [
  { id: 'scan', label: '① 拾得物スキャン', icon: Camera },
  { id: 'match', label: '② 顧客マッチング', icon: UserSearch },
];

export default function StayseeFinderEngine() {
  const [activeTab, setActiveTab] = useState('scan');
  const [copied, setCopied] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [matchResult, setMatchResult] = useState('');
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [userApiKey, setUserApiKey] = useState('');
  const [certData, setCertData] = useState<any>(null);
  const [isGeneratingCert, setIsGeneratingCert] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateCert = async () => {
    if (!image) return;
    setIsGeneratingCert(true);
    try {
      const res = await fetch('/api/tools/staysee-ai-finder/generate-cert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, matchResult }),
      });
      const data = await res.json();
      if (data.success) {
        setCertData(data.certData);
        setActiveTab('match');
      }
    } catch (e) {
      console.error(e);
      alert('証明書生成エラー');
    } finally {
      setIsGeneratingCert(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('staysee_user_api_key');
      if (savedKey) setUserApiKey(savedKey);
    }
  }, []);

  const saveApiKey = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('staysee_user_api_key', userApiKey);
      alert('Staysee APIキーをブラウザに保存しました。');
      setShowSettings(false);
    }
  };

  const searchStaysee = async (query: string) => {
    setIsApiLoading(true);
    try {
      const res = await fetch('/api/tools/staysee-ai-finder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'search-booking', 
          query,
          userApiKey: userApiKey // ユーザーが設定したキーを優先
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMatchResult(JSON.stringify(data.results, null, 2));
        alert('Staysee APIから宿泊者データを同期しました！');
      }
    } catch (e) {
      console.error(e);
      alert('Staysee API連携エラー：APIキーまたは通信設定を確認してください');
    } finally {
      setIsApiLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);

      // 🚀 【重要：AIへの添付を強制する案内】
      alert("⚠️ 重要：この画像を必ずAIに添付してください！\n\n1. この画像は自動的にあなたの端末に保存（ダウンロード）されました。\n2. 下の「照合指示をコピー」ボタンを押し、ChatGPT等のAI画面で【この画像を添付】して指示を貼り付けてください。");

      const link = document.createElement('a');
      link.href = URL.createObjectURL(file);
      link.download = `staysee-lost-item.png`;
      link.click();
    }
  };

  const useSample = () => {
    const sampleUrl = "https://membership-site-nextralabos.vercel.app/samples/lost-item.jpg";
    setImage(sampleUrl);
    const a = document.createElement("a"); a.href = sampleUrl; a.download = "staysee-lost-item.jpg"; a.click();
    alert("⚠️ サンプル画像を保存しました。AI（ChatGPT/Gemini等）にこの画像を添付して「照合指示」を送信してください。");
  };

  const FINAL_PROMPT = `【最優先：添付された画像を解析してください】
あなたはホテル管理システム（PMS）の専門家です。
今添付した【忘れ物の写真】を隅々まで分析し、宿泊管理システム（Staysee）の宿泊履歴から持ち主を特定するための情報を出力してください。

分析項目：
1. 物品の名称と特徴（ブランド、色、型番など）
2. 想定される持ち主の属性（性別、年齢層など）
3. 発見場所に基づいたStayseeでの検索キーワード提案`;

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-2xl p-5 md:p-8 mb-8 flex items-start gap-4 shadow-xl shadow-emerald-500/5">
      <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20"><Lightbulb className="text-white" /></div>
      <div className="space-y-1 text-left">
        <p className="text-sm font-black text-emerald-500 uppercase italic tracking-widest opacity-70">PMS Protocol</p>
        {steps.map((s, i) => (
          <p key={i} className="text-xs md:text-lg text-slate-300 font-bold flex items-center gap-2 leading-tight"><span className="text-emerald-500 italic">#{i+1}</span> {s}</p>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-[#050507] border-8 border-emerald-500/50 rounded-[4rem] my-4 shadow-[0_0_100px_rgba(16,185,129,0.2)]">
      <div className="text-center space-y-2">
        <Badge className="bg-blue-600 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full shadow-lg">HOTEL DX ENGINE</Badge>
        <h1 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter drop-shadow-xl leading-none">Staysee AI Finder</h1>
        <div className="inline-block bg-emerald-600 text-white font-black px-6 py-1 rounded-full uppercase italic text-[10px] tracking-widest shadow-lg">v2.0-MASTER</div>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900/50 border border-white/5 p-2 flex min-w-[500px] md:min-w-full rounded-2xl gap-2">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setShowSettings(false); }} className={`flex-1 py-5 px-2 rounded-xl font-black text-[10px] md:text-sm uppercase italic transition-all flex items-center justify-center gap-2 relative ${activeTab === tab.id && !showSettings ? 'bg-emerald-600 text-white shadow-xl scale-[1.03] z-10' : 'text-slate-500 hover:text-white'}`}>
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
          <button onClick={() => setShowSettings(!showSettings)} className={`px-8 rounded-xl font-black text-[10px] md:text-sm uppercase italic transition-all flex items-center justify-center gap-2 ${showSettings ? 'bg-amber-500 text-black' : 'bg-white/5 text-slate-500 hover:text-white'}`}>
            <Settings className={`w-5 h-5 ${showSettings ? 'animate-spin-slow' : ''}`} /> <span>設定</span>
          </button>
        </div>
      </div>

      <div className="mt-4">
        {showSettings ? (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-10 md:p-20 shadow-2xl animate-in zoom-in-95 text-center space-y-8">
            <div className="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center mx-auto border-2 border-amber-500/20">
              <Settings className="w-10 h-10 text-amber-500" />
            </div>
            <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Staysee API Configuration</h3>
            <p className="text-slate-400 text-sm font-bold italic max-w-md mx-auto">ステイシーのAPIキーを設定することで、宿泊者データとの自動照合が可能になります。キーはブラウザに安全に保存されます。</p>
            
            <div className="max-w-xl mx-auto space-y-4">
              <div className="text-left space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 italic">Your Staysee API Key</label>
                <input 
                  type="password"
                  value={userApiKey}
                  onChange={(e) => setUserApiKey(e.target.value)}
                  placeholder="sk_xxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full h-16 bg-black border-2 border-white/10 rounded-2xl px-6 text-white focus:border-amber-500 outline-none font-mono"
                />
              </div>
              <button 
                onClick={saveApiKey}
                className="w-full h-16 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-2xl shadow-xl transition-all active:scale-95 uppercase italic"
              >
                Save Configuration
              </button>
            </div>
          </Card>
        ) : activeTab === 'scan' && (
          <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in slide-in-from-bottom-4 text-center">
            <h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 text-emerald-400"><PackageSearch /> ① 拾得物スキャン</h3>
            {renderGuide(['忘れ物を撮影してアップロード（保存）', '照合指示をコピーしてAIに画像を添付して投げる', 'AIから返ってきた結果を右側に戻す'])}
            <div className="grid lg:grid-cols-2 gap-12 text-left">
              <div className="space-y-6 text-center">
                {!image ? (
                  <div className="space-y-4">
                    <div className="border-4 border-dashed border-white/10 rounded-[2.5rem] aspect-video flex flex-col items-center justify-center gap-6 cursor-pointer hover:bg-white/5 transition-all group relative overflow-hidden bg-white/5 shadow-inner" onClick={() => fileInputRef.current?.click()}>
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" capture="environment" />
                      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border-2 border-white/10 group-hover:border-emerald-500 transition-all">
                        <Camera className="h-10 w-10 text-slate-500 group-hover:text-emerald-500" />
                      </div>
                      <p className="text-2xl text-white font-black italic uppercase tracking-[0.1em] group-hover:text-emerald-500 text-center px-4">
                        TAP TO SCAN<br/>
                        <span className="text-[10px] text-slate-500 font-bold">DROP LOST ITEM</span>
                      </p>
                      <div className="absolute bottom-6 animate-bounce text-emerald-600/50">▼</div>
                    </div>
                    <button onClick={useSample} className="w-full h-16 bg-white/5 border border-white/10 text-slate-400 font-black italic rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 uppercase text-sm"><Download className="w-5 h-5" /> サンプルを保存して試す</button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative aspect-video max-w-[450px] mx-auto rounded-3xl overflow-hidden border-4 border-emerald-600/30 shadow-2xl bg-black">
                       <img src={image} alt="Found" className="object-contain w-full h-full p-4" />
                       <button onClick={() => setImage(null)} className="absolute top-4 right-4 bg-black/50 hover:bg-red-600 p-2 rounded-full h-10 w-10 text-white transition-all">✕</button>
                       <div className="absolute bottom-4 left-6 bg-emerald-500 text-slate-950 font-black text-[8px] px-3 py-1 rounded-full animate-pulse uppercase">ITEM_SAVED_FOR_AI</div>
                    </div>
                    <button onClick={() => { navigator.clipboard.writeText(FINAL_PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className={`w-full h-20 text-xl font-black rounded-2xl transition-all shadow-2xl ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-blue-600 text-white hover:bg-blue-500'}`}>
                      {copied ? '✅ COPY COMPLETE' : '照合指示をコピー'}
                    </button>
                    <div className="grid grid-cols-3 gap-3">
                       <button className="h-20 bg-white/5 border-2 border-emerald-500/30 rounded-2xl text-[10px] font-black uppercase italic text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all flex flex-col items-center justify-center gap-1 shadow-lg" onClick={() => window.open('https://chatgpt.com', '_blank')}>
                          <span className="text-xl">💬</span> CHATGPT
                       </button>
                       <button className="h-20 bg-white/5 border-2 border-blue-500/30 rounded-2xl text-[10px] font-black uppercase italic text-blue-400 hover:bg-blue-500 hover:text-white transition-all flex flex-col items-center justify-center gap-1 shadow-lg" onClick={() => window.open('https://gemini.google.com', '_blank')}>
                          <span className="text-xl">✨</span> GEMINI
                       </button>
                       <button className="h-20 bg-white/5 border-2 border-orange-500/30 rounded-2xl text-[10px] font-black uppercase italic text-orange-400 hover:bg-orange-500 hover:text-white transition-all flex flex-col items-center justify-center gap-1 shadow-lg" onClick={() => window.open('https://claude.ai', '_blank')}>
                          <span className="text-xl">❄️</span> CLAUDE
                       </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-[#0a0b14] rounded-[3rem] p-10 border border-white/5 space-y-6 shadow-inner flex flex-col justify-center relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-600 to-transparent opacity-30" />
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4"><ClipboardPaste className="h-8 w-8 text-emerald-400" /><h3 className="text-xl font-black text-white italic uppercase tracking-tighter">照合結果（Staysee同期）</h3></div>
                    <button 
                      onClick={() => searchStaysee('latest')} 
                      disabled={isApiLoading}
                      className="h-10 bg-emerald-600 hover:bg-emerald-500 text-white px-6 rounded-xl font-black italic text-[10px] uppercase shadow-lg transition-all disabled:opacity-50"
                    >
                      {isApiLoading ? 'SYNCING...' : 'LIVE SYNC STAYSEE'}
                    </button>
                 </div>
                 <textarea value={matchResult} onChange={(e) => setMatchResult(e.target.value)} placeholder="AIから届いた情報またはStaysee同期ボタンで宿泊データを取得..." className="w-full h-80 bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 text-sm text-slate-300 focus:border-emerald-500 outline-none font-mono italic shadow-inner leading-relaxed" />
              </div>
            </div>
            {matchResult && (
               <button 
                onClick={generateCert} 
                disabled={isGeneratingCert}
                className="w-full h-24 mt-12 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-3xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] flex items-center justify-center gap-4 uppercase italic text-2xl group transition-all active:scale-95 border-b-4 border-emerald-800 active:border-b-0"
               >
                  {isGeneratingCert ? 'GENERATING CERTIFICATE...' : '② AI保管証明書を発行 📜'}
               </button>
            )}
          </Card>
        )}

        {activeTab === 'match' && (
          <div className="animate-in fade-in zoom-in space-y-8 text-center pb-20 text-left">
            <Card className="bg-[#13141f] border-4 border-emerald-500/50 rounded-[4rem] p-10 md:p-20 shadow-[0_0_100px_rgba(16,185,129,0.1)] border-l-[16px] border-l-emerald-600 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 text-white"><Building2 className="w-96 h-96" /></div>
               
               <div className="relative z-10 space-y-12">
                  <div className="flex flex-col items-center gap-4">
                    <Shield className="text-emerald-500 w-24 h-24 animate-pulse" />
                    <h3 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter">AI Official Certificate</h3>
                    <div className="bg-emerald-600 text-white px-8 py-2 rounded-full font-black italic text-sm shadow-lg">NextraLabs Verification v3.0-MASTER</div>
                  </div>

                  {certData ? (
                    <div className="grid lg:grid-cols-2 gap-10">
                      {/* Left: Visual Evidence */}
                      <div className="space-y-6">
                        <div className="aspect-square bg-black rounded-[3rem] border-2 border-white/10 overflow-hidden relative shadow-2xl">
                          <img src={image || ''} className="w-full h-full object-contain p-8" />
                          <div className="absolute top-6 left-6 bg-emerald-500 text-slate-950 font-black px-4 py-1 rounded-full text-[10px] italic">ORIGINAL EVIDENCE</div>
                        </div>
                        <div className="bg-white p-4 rounded-2xl flex items-center justify-center shadow-xl">
                          {/* 簡易的なQRコード風デザイン */}
                          <div className="w-full aspect-square bg-slate-100 rounded-xl flex items-center justify-center border-4 border-slate-200">
                             <div className="text-[10px] font-black text-slate-400 text-center">CERT_ID:<br/>{certData.certId}</div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Analytical Data */}
                      <div className="space-y-6 text-left">
                        <div className="bg-slate-950/80 p-10 rounded-[3rem] border border-white/5 shadow-inner space-y-6">
                           <div>
                              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Item Classification</p>
                              <p className="text-3xl font-black text-white italic">{certData.itemName}</p>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                 <p className="text-[8px] font-black text-slate-500 uppercase">Grade Status</p>
                                 <p className="text-2xl font-black text-emerald-400 italic">{certData.status}</p>
                              </div>
                              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                 <p className="text-[8px] font-black text-slate-500 uppercase">Expiry Date</p>
                                 <p className="text-xs font-black text-white">{certData.expiry}</p>
                              </div>
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Detailed Description</p>
                              <p className="text-sm text-slate-300 leading-relaxed italic">{certData.description}</p>
                           </div>
                           <div className="pt-6 border-t border-white/5">
                              <p className="text-sm text-emerald-400 font-bold leading-relaxed italic">" {certData.message} "</p>
                           </div>
                        </div>
                        
                        <button 
                          onClick={() => { window.print(); }}
                          className="w-full h-16 bg-white text-black font-black rounded-2xl shadow-xl hover:bg-emerald-500 hover:text-white transition-all active:scale-95 uppercase italic flex items-center justify-center gap-3"
                        >
                          <Printer className="w-6 h-6" /> Print Certificate
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-950/80 rounded-[3rem] p-16 border-2 border-white/5 text-2xl text-slate-100 leading-loose italic whitespace-pre-wrap shadow-inner text-center">
                       {matchResult || "データがありません。"}
                    </div>
                  )}

                  <div className="p-8 bg-emerald-600 border-4 border-emerald-500 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.4)] animate-in zoom-in-95 duration-500 text-center space-y-4">
                      <div className="flex items-center justify-center gap-4 text-white font-black italic uppercase tracking-widest text-xl">
                        <span className="animate-ping">✅</span> OFFICIAL VERIFICATION SECURED <span className="animate-ping">✅</span>
                      </div>
                      <p className="text-white text-lg font-black italic leading-relaxed">
                        証明書が発行されました。このURLまたは印刷物を宿泊者へ提示し、<br/>
                        NextraLabsによる厳格な拾得物管理をアピールしてください。
                      </p>
                  </div>
               </div>
            </Card>
            <button onClick={() => { setImage(null); setMatchResult(''); setCertData(null); setActiveTab('scan'); }} className="w-full h-20 border-2 border-white/10 text-slate-600 hover:text-white hover:bg-white/5 font-black rounded-3xl uppercase italic transition-all flex items-center justify-center gap-4 text-xl shadow-xl active:scale-95"><RotateCcw className="w-6 h-6" /> RESET PROTOCOL</button>
          </div>
        )}
      </div>
      <DebugPanel data={{ activeTab, hasImage: !!image, hasResult: !!matchResult }} toolId="staysee-finder-master" />
    </div>
  )
}
