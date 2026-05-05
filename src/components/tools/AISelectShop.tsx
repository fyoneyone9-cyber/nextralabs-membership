'use client'
import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Upload, CheckCircle2, Zap, Copy, ExternalLink, RotateCcw, Lightbulb, ClipboardPaste, ShoppingBag, Store, Package, Target, Shirt, Printer, Globe, DollarSign, Download, FileImage, Sparkles, Activity
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const TABS = [
  { id: 'concept', label: '① 商品コンセプト解析', icon: ShoppingBag },
  { id: 'printful', label: '② PRINTFUL連携', icon: Printer },
  { id: 'shopify', label: '③ SHOPIFY公開', icon: Globe },
];

export default function AISelectShop() {
  const [activeTab, setActiveTab] = useState('concept');
  const [copied, setCopied] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [conceptResult, setConceptResult] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const useSample = () => {
    const sampleUrl = "https://membership-site-nextralabos.vercel.app/samples/design-sample.jpg";
    setImage(sampleUrl);
  };

  const PROMPT = `あなたはEC構築のプロです。添付された【デザイン案】を元に、在庫ゼロショップの設計図を出力してください。

1. 【ターゲット層】: この商品を欲しがる客層。
2. 【販売ストーリー】: 商品名とキャッチコピー。
3. 【利益計算指示】: 製造コストと適正販売価格。`;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-slate-950 text-left">
      {/* 🚀 HEADER: 完璧なバランス */}
      <div className="text-center space-y-3 mb-16">
        <h1 className="text-6xl md:text-[9rem] font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">AI SELECT SHOP</h1>
      </div>

      {/* 🛠️ NAVIGATION: スクショ通りのタブ */}
      <div className="flex gap-1 bg-[#1a1b26]/50 p-1 rounded-2xl border border-white/5 mb-12">
        {TABS.map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)} 
            className={`flex-1 py-4 px-2 rounded-xl font-black text-[10px] md:text-sm uppercase italic transition-all flex items-center justify-center gap-3 ${
              activeTab === tab.id 
              ? 'bg-[#5845e0] text-white shadow-2xl shadow-indigo-500/20' 
              : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <tab.icon size={18} /> <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 🔮 MAIN CONTENT: 完全再現 */}
      <div className="mt-4">
        {activeTab === 'concept' && (
          <div className="bg-[#13141f] border border-white/10 rounded-[3rem] p-10 md:p-20 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#7c3aed] to-transparent opacity-50" />
            
            <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-12 flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl border-2 border-white/10 flex items-center justify-center bg-white/5 shadow-inner">
                <ShoppingBag size={40} />
              </div>
              ① 商品コンセプト解析
            </h2>
            
            {/* ECOMMERCE PROTOCOL GUIDE */}
            <div className="bg-[#0a0b14] border border-white/5 rounded-3xl p-8 mb-12 flex items-start gap-6 shadow-inner relative group">
              <div className="w-10 h-10 rounded-full border border-indigo-500/30 flex items-center justify-center shrink-0">
                <Lightbulb size={20} className="text-indigo-500" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-indigo-400/70 uppercase tracking-[0.2em] italic mb-2">Ecommerce Protocol</p>
                <div className="space-y-1 text-xs md:text-sm font-bold text-slate-400">
                  <p className="flex items-center gap-3"><span className="text-indigo-500 italic">#1</span> デザイン案やロゴをアップロード</p>
                  <p className="flex items-center gap-3"><span className="text-indigo-500 italic">#2</span> 設計指示をコピーしてAI三台体制へ投げ、画像をドロップ</p>
                  <p className="flex items-center gap-3"><span className="text-indigo-500 italic">#3</span> AIが作ったショップ設計図を右に戻す</p>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* LEFT: DROP DESIGN ZONE */}
              <div className="space-y-6">
                {!image ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/10 rounded-[2.5rem] aspect-square flex flex-col items-center justify-center gap-8 cursor-pointer hover:bg-white/5 transition-all group relative overflow-hidden"
                  >
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    <Upload size={64} className="text-slate-800 group-hover:text-indigo-500 transition-colors" />
                    <p className="text-3xl text-slate-700 font-black italic uppercase tracking-[0.2em] group-hover:text-slate-500">Drop Design</p>
                  </div>
                ) : (
                  <div className="relative aspect-square rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-black group animate-in zoom-in-95">
                    <img src={image} alt="Design" className="object-contain w-full h-full p-8" />
                    <Button onClick={() => setImage(null)} className="absolute top-6 right-6 bg-black/50 hover:bg-red-600 p-2 rounded-full h-12 w-12 text-white transition-all">✕</Button>
                  </div>
                )}
                
                <button 
                  onClick={useSample}
                  className="w-full h-14 bg-[#0a0b14] border border-white/5 rounded-2xl text-[10px] font-black text-slate-500 uppercase italic flex items-center justify-center gap-2 hover:bg-white/5 transition-all"
                >
                  <Download size={14} /> サンプルを保存して試す
                </button>

                {image && (
                  <div className="space-y-4 animate-in slide-in-from-bottom-4">
                    <Button 
                      onClick={() => { navigator.clipboard.writeText(PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2000); }} 
                      className={`w-full h-20 text-xl font-black rounded-2xl transition-all shadow-2xl ${copied ? 'bg-emerald-500 text-slate-950 scale-95' : 'bg-[#5845e0] text-white hover:bg-indigo-500'}`}
                    >
                      {copied ? '✅ 指示をコピー完了' : '設計指示をコピーする'}
                    </Button>
                    <div className="grid grid-cols-3 gap-3">
                       <Button variant="outline" className="h-14 border-white/5 bg-[#0a0b14] text-[9px] font-black uppercase italic hover:bg-white/5 rounded-xl text-slate-400" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT</Button>
                       <Button variant="outline" className="h-14 border-white/5 bg-[#0a0b14] text-[9px] font-black uppercase italic hover:bg-white/5 rounded-xl text-slate-400" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI</Button>
                       <Button variant="outline" className="h-14 border-white/5 bg-[#0a0b14] text-[9px] font-black uppercase italic hover:bg-white/5 rounded-xl text-slate-400" onClick={() => window.open('https://claude.ai', '_blank')}>CLAUDE</Button>
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT: RESULT PANEL */}
              <div className="bg-[#0a0b14] rounded-[3.5rem] p-8 md:p-12 border border-white/5 shadow-inner flex flex-col gap-6 relative">
                 <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                        <ClipboardPaste className="text-indigo-400" size={24} />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tighter">設計図を戻す</h3>
                    </div>
                    <Activity size={32} className="text-indigo-500/20 animate-pulse" />
                 </div>
                 
                 <textarea 
                   value={conceptResult} 
                   onChange={(e) => setConceptResult(e.target.value)} 
                   placeholder="AIから届いた設計図をここにペースト..." 
                   className="flex-1 bg-[#13141f] border border-white/5 rounded-[2.5rem] p-10 text-sm md:text-base text-slate-300 focus:border-indigo-500 outline-none font-mono italic shadow-inner min-h-[400px] leading-relaxed" 
                 />
                 
                 {conceptResult && (
                    <Button onClick={() => setActiveTab('printful')} className="w-full h-20 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-4 uppercase italic text-xl group transition-all animate-in slide-in-from-bottom-4">
                      ② 製品化ステップへ進む <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                    </Button>
                 )}
              </div>
            </div>
          </div>
        )}

        {/* ② PRINTFUL連携 */}
        {activeTab === 'printful' && (
          <div className="bg-[#13141f] border border-white/10 rounded-[3rem] p-20 animate-in zoom-in-95 text-center relative overflow-hidden">
            <h3 className="text-5xl font-black text-white italic uppercase mb-12 flex items-center justify-center gap-6">
              <Printer size={64} className="text-indigo-500" /> ② PRINTFUL 連携
            </h3>
            <div className="max-w-2xl mx-auto space-y-12">
              <Button onClick={() => window.open('https://www.printful.com', '_blank')} className="w-full h-28 bg-white text-black hover:bg-indigo-500 hover:text-white font-black rounded-[2rem] text-3xl shadow-2xl transition-all">
                Printful Dashboard ↗
              </Button>
              <Button onClick={() => setActiveTab('shopify')} className="w-full h-16 bg-emerald-600 text-white font-black rounded-2xl italic flex items-center justify-center gap-3">
                ③ SHOPIFY公開へ進む <ArrowRight />
              </Button>
            </div>
          </div>
        )}

        {/* ③ SHOPIFY公開 */}
        {activeTab === 'shopify' && (
          <div className="bg-[#13141f] border border-white/10 rounded-[3rem] p-20 animate-in zoom-in-95 text-center relative overflow-hidden">
            <h3 className="text-5xl font-black text-white italic uppercase mb-12 flex items-center justify-center gap-6">
              <Globe size={64} className="text-indigo-500" /> ③ SHOPIFY 公開
            </h3>
            <div className="max-w-2xl mx-auto space-y-12">
              <Button onClick={() => window.open('https://www.shopify.com', '_blank')} className="w-full h-28 bg-white text-black hover:bg-indigo-500 hover:text-white font-black rounded-[2rem] text-3xl shadow-2xl transition-all">
                Shopify Admin ↗
              </Button>
              <button onClick={() => setActiveTab('concept')} className="text-slate-500 hover:text-white font-black uppercase italic underline text-xs">
                最初から設計し直す
              </button>
            </div>
          </div>
        )}
      </div>

      <DebugPanel data={{ activeTab, image, conceptResult }} toolId="ai-select-shop" />
      <div className="text-center opacity-20 mt-20 font-black uppercase tracking-[0.5em] italic text-[10px]">Global Dropshipping OS • NextraLabs 2026</div>
    </div>
  )
}
