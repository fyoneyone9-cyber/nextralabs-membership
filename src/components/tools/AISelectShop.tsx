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
  { id: 'printful', label: '② Printful連携', icon: Printer },
  { id: 'shopify', label: '③ Shopify公開', icon: Globe },
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
    const a = document.createElement("a"); 
    a.href = sampleUrl; 
    a.download = "shop_design_sample.jpg"; 
    a.click();
    alert("サンプルデザインを保存しました。AIへ投げてショップ構築を開始しましょう！");
  };

  const PROMPTS = {
    concept: `あなたはEC構築のプロです。添付された【デザイン案】を元に、在庫ゼロショップの設計図を出力してください。\n\n1. 【ターゲット層】: この商品を欲しがる客層。\n2. 【販売ストーリー】: 商品名とキャッチコピー。\n3. 【利益計算指示】: 製造コストと適正販売価格。`,
    printful: `Printfulでオンデマンド生産を行うための製品設定情報を生成してください。`,
    shopify: `Shopifyに登録するためのSEOタイトル、商品説明、タグを生成してください。`
  };

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900/80 border-2 border-indigo-600/30 rounded-2xl p-6 mb-8 flex items-start gap-4 shadow-xl">
      <div className="w-12 h-12 bg-indigo-600/10 rounded-xl flex items-center justify-center shrink-0 border border-indigo-500/20"><Lightbulb className="text-indigo-500 w-6 h-6" /></div>
      <div className="space-y-1">
        <p className="text-xs font-black text-indigo-500 uppercase tracking-widest italic opacity-70">Ecommerce Protocol</p>
        <div className="space-y-1">
          {steps.map((s, i) => (
            <p key={i} className="text-sm md:text-base text-slate-300 font-bold flex items-center gap-2 leading-tight">
              <span className="text-indigo-500 italic">#{i+1}</span> {s}
            </p>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-slate-950 text-left">
      <div className="text-center space-y-3">
        <Badge className="bg-indigo-600 text-white font-black italic tracking-widest px-6 py-1 text-[10px] uppercase rounded-full shadow-[0_0_20px_rgba(79,70,229,0.4)]">Dropshipping Engine v5.0</Badge>
        <h1 className="text-5xl md:text-[7rem] font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">AI Select Shop</h1>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900 border border-slate-800 p-1 flex min-w-[700px] md:min-w-full rounded-2xl shadow-2xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-5 px-2 rounded-xl font-black text-sm uppercase italic transition-all flex items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl scale-[1.02] z-10' : 'text-slate-500 hover:text-white'}`}>
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'concept' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] p-8 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-bottom-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600" />
            <h3 className="text-2xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-10 flex items-center gap-4 text-indigo-400">
              <ShoppingBag size={48} /> ① 商品コンセプト解析
            </h3>
            
            {renderGuide([
              'デザイン案やロゴをアップロード',
              '設計指示をコピーしてAI三台体制へ投げ、画像をドロップ',
              'AIが作ったショップ設計図を右に戻す'
            ])}

            <div className="grid lg:grid-cols-2 gap-12 text-left">
              {/* LEFT: DROP & PROMPT */}
              <div className="space-y-8">
                {!image ? (
                  <div className="space-y-4">
                    <div className="border-4 border-dashed border-slate-800 rounded-[2.5rem] p-20 hover:bg-slate-950 transition-all cursor-pointer bg-slate-950/50 shadow-inner group text-center" onClick={() => fileInputRef.current?.click()}>
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                      <Upload className="h-16 w-16 text-slate-800 group-hover:text-indigo-500 mx-auto mb-4 transition-colors" />
                      <p className="text-2xl text-slate-700 font-black italic uppercase tracking-widest group-hover:text-slate-500">Drop Design</p>
                    </div>
                    <Button onClick={useSample} variant="outline" className="w-full border-slate-800 text-slate-500 font-black italic h-16 rounded-2xl hover:bg-slate-800 flex items-center justify-center gap-3 uppercase shadow-lg">
                      <Download size={20} /> サンプルを保存して試す
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-8 animate-in zoom-in-95">
                    <div className="relative aspect-square rounded-[3rem] overflow-hidden border-4 border-indigo-600/20 shadow-2xl bg-black group">
                      <img src={image} alt="Target" className="object-contain w-full h-full" />
                      <Button onClick={() => setImage(null)} className="absolute top-6 right-6 bg-black/50 hover:bg-red-600 p-2 rounded-full h-12 w-12 text-white border-2 border-white/20 transition-all">✕</Button>
                      <div className="absolute bottom-6 left-6 flex items-center gap-2">
                        <Badge className="bg-indigo-600 text-white font-black italic animate-pulse">DESIGN_LOADED</Badge>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Button onClick={() => { navigator.clipboard.writeText(PROMPTS.concept); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className={`w-full h-20 text-xl font-black rounded-2xl transition-all shadow-xl ${copied ? 'bg-emerald-500 text-slate-950 scale-95' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}>
                        {copied ? '✅ 指示をコピー完了' : '設計指示をコピーする'}
                      </Button>
                      <div className="grid grid-cols-3 gap-3">
                         <Button variant="outline" className="h-14 border-2 border-slate-800 text-xs font-black uppercase italic hover:bg-slate-900 rounded-xl" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT</Button>
                         <Button variant="outline" className="h-14 border-2 border-slate-800 text-xs font-black uppercase italic hover:bg-slate-900 rounded-xl" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI</Button>
                         <Button variant="outline" className="h-14 border-2 border-slate-800 text-xs font-black uppercase italic hover:bg-slate-900 rounded-xl" onClick={() => window.open('https://claude.ai', '_blank')}>CLAUDE</Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT: RESULT FEED */}
              <div className="bg-slate-950 rounded-[3.5rem] p-10 border border-slate-800 shadow-inner flex flex-col gap-6 relative overflow-hidden">
                 <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                      <ClipboardPaste className="text-indigo-400" />
                    </div>
                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">設計図を戻す</h3>
                 </div>
                 <textarea 
                   value={conceptResult} 
                   onChange={(e) => setConceptResult(e.target.value)} 
                   placeholder="AIから届いた設計図をここにペースト..." 
                   className="flex-1 bg-slate-900 border-2 border-slate-800 rounded-[2rem] p-8 text-sm text-slate-300 focus:border-indigo-500 outline-none font-mono italic shadow-inner min-h-[400px]" 
                 />
                 
                 {conceptResult && (
                    <Button onClick={() => setActiveTab('printful')} className="w-full h-20 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-4 uppercase italic text-xl group transition-all animate-in slide-in-from-bottom-4">
                      ② 製品化ステップへ進む <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                    </Button>
                 )}

                 {/* 装飾 */}
                 <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <Activity size={100} className="text-indigo-500" />
                 </div>
              </div>
            </div>
          </Card>
        )}
        
        {/* ② Printful */}
        {activeTab === 'printful' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] p-16 animate-in zoom-in-95 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600" />
            <h3 className="text-4xl md:text-6xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-6">
              <Printer size={64} className="text-indigo-500" /> ② Printful 連携
            </h3>
            {renderGuide(['製造コストを計算する', 'AIが生成したメタデータをPrintfulへ入力'])}
            <div className="max-w-2xl mx-auto space-y-8">
              <Button onClick={() => window.open('https://www.printful.com', '_blank')} className="w-full h-24 bg-white text-black hover:bg-indigo-600 hover:text-white font-black rounded-2xl text-2xl shadow-2xl flex items-center justify-center gap-4 transition-all">
                Printful Dashboardを開く <ExternalLink size={32} />
              </Button>
              <Button onClick={() => setActiveTab('shopify')} className="w-full h-16 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl italic shadow-lg flex items-center justify-center gap-3">
                ③ Shopify公開へ進む <ArrowRight />
              </Button>
            </div>
          </Card>
        )}

        {/* ③ Shopify */}
        {activeTab === 'shopify' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] p-16 animate-in zoom-in-95 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600" />
            <h3 className="text-4xl md:text-6xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-6">
              <Globe size={64} className="text-indigo-500" /> ③ Shopify 公開
            </h3>
            {renderGuide(['メタデータを同期してショップ完成！', '世界中へ販売を開始'])}
            <div className="max-w-2xl mx-auto space-y-8">
              <Button onClick={() => window.open('https://www.shopify.com', '_blank')} className="w-full h-24 bg-white text-black hover:bg-indigo-600 hover:text-white font-black rounded-2xl text-2xl shadow-2xl flex items-center justify-center gap-4 transition-all">
                Shopify Adminを開く <ExternalLink size={32} />
              </Button>
              <Button onClick={() => setActiveTab('concept')} variant="outline" className="w-full h-16 border-2 border-slate-800 text-slate-500 hover:text-white font-black rounded-xl italic flex items-center justify-center gap-3">
                <RotateCcw /> 最初から設計し直す
              </Button>
            </div>
          </Card>
        )}
      </div>

      <DebugPanel data={{ activeTab, image, conceptResult }} toolId="ai-select-shop" />
      <div className="text-center opacity-20 mt-20"><p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Global Dropshipping OS • NextraLabs 2026</p></div>
    </div>
  )
}
