'use client'
import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Upload, CheckCircle2, Zap, Copy, ExternalLink, RotateCcw, Lightbulb, ClipboardPaste, ShoppingBag, Store, Package, Target, Shirt, Printer, Share2, Globe, DollarSign
} from 'lucide-react'

const TABS = [
  { id: 'concept', label: '① コンセプト解析', icon: ShoppingBag },
  { id: 'printful', label: '② Printful連携', icon: Printer },
  { id: 'shopify', label: '③ Shopify公開', icon: Globe },
];

export default function AISelectShop() {
  const [activeTab, setActiveTab] = useState('concept');
  const [copied, setCopied] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conceptResult, setConceptResult] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onload = (event) => setImage(event.target?.result as string);
      reader.readAsDataURL(file);
      setTimeout(() => setIsProcessing(false), 1000);
    }
  };

  const PROMPTS = {
    concept: `あなたはECサイト構築とブランディングのプロフェッショナルです。
添付された【商品のイメージ写真】を元に、在庫ゼロで運営可能な「AIセレクトショップ」の設計図を出力してください。

1. 【ターゲット層の選定】: この商品を欲しがる客層、ライフスタイル、刺さる悩み。
2. 【商品コンセプト】: キャッチコピー、商品名案、販売ストーリー。
3. 【デザイン指示】: Tシャツやトートバッグにする際の配置やカラーの最適解。`,
    printful: `PrintfulのAPIドキュメントとオンデマンド印刷の知識に基づき、このコンセプトを製品化するための「製造コスト計算」と「利益率を確保できる適正価格」を算出してください。`,
    shopify: `Shopify Admin APIを使用して、この商品を自動登録するためのメタデータ（商品名、説明文、SEOタグ）を作成してください。`
  };

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900 border-2 border-indigo-600/50 rounded-2xl p-5 md:p-8 mb-8 flex items-start gap-4 shadow-xl">
      <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg"><Lightbulb className="text-white" /></div>
      <div className="space-y-1">
        <p className="text-sm font-black text-indigo-400 uppercase italic tracking-widest">ECOMMERCE PROTOCOL</p>
        <div className="space-y-1">
          {steps.map((s, i) => (
            <p key={i} className="text-xs md:text-lg text-slate-200 font-bold flex items-center gap-2 md:gap-4 leading-tight">
              <span className="flex items-center justify-center w-5 h-5 md:w-7 md:h-7 bg-indigo-600 text-white rounded-full text-[10px] md:text-sm italic shrink-0 font-black">{i+1}</span> {s}
            </p>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center space-y-2">
        <Badge className="bg-indigo-600 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full shadow-lg">DROPSHIPPING ENGINE</Badge>
        <h1 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-tight drop-shadow-xl">AI Select Shop</h1>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900 border border-slate-800 p-1 flex min-w-[800px] md:min-w-full rounded-2xl shadow-2xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-4 px-2 rounded-xl font-black text-sm uppercase italic transition-all flex items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl scale-[1.03] z-10' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}>
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {/* ① コンセプト解析 */}
        {activeTab === 'concept' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-10 flex items-center gap-4 text-indigo-500"><ShoppingBag /> ① トレンド・コンセプト解析</h3>
            {renderGuide(['売りたい商品のイメージ写真やロゴ案をアップロード', '指示をコピーしてAIへ投げ、詳細なショップ設計図を作る', 'AIが返した設計図を右のエリアへ戻す'])}
            <div className="grid lg:grid-cols-2 gap-12 text-left">
              <div className="space-y-6 text-center">
                {!image ? (
                  <div className="border-4 border-dashed border-slate-800 rounded-[2rem] p-16 hover:bg-slate-950 transition-all cursor-pointer bg-slate-900/50 shadow-inner" onClick={() => fileInputRef.current?.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" /><Upload className="h-14 w-14 text-slate-700 group-hover:text-indigo-500 mx-auto mb-6" /><p className="text-xl text-slate-500 font-black italic uppercase">Drop Concept Image</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative aspect-square max-w-[400px] mx-auto rounded-3xl overflow-hidden border-4 border-indigo-600/30 shadow-2xl bg-black">
                       <img src={image} alt="Target" className="object-contain w-full h-full" />
                       <Button onClick={() => setImage(null)} className="absolute top-4 right-4 bg-black/50 hover:bg-red-600 p-2 rounded-full h-10 w-10">✕</Button>
                    </div>
                    <Button onClick={() => { navigator.clipboard.writeText(PROMPTS.concept); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className={`w-full h-16 font-black rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}>設計指示をコピー</Button>
                    <div className="grid grid-cols-2 gap-4"><Button variant="outline" className="h-12 border-slate-800 font-black uppercase italic" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT ↗</Button><Button variant="outline" className="h-12 border-slate-800 font-black uppercase italic" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI ↗</Button></div>
                  </div>
                )}
              </div>
              <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 space-y-6 shadow-2xl flex flex-col justify-center">
                 <div className="flex items-center gap-4"><ClipboardPaste className="h-8 w-8 text-indigo-400" /><h3 className="text-xl font-black text-white italic uppercase tracking-tighter">設計図を戻す</h3></div>
                 <textarea value={conceptResult} onChange={(e) => setConceptResult(e.target.value)} placeholder="AIから届いたショップ設計図（ペルソナ、価格、コンセプト等）をここにペースト..." className="w-full h-80 bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 text-sm text-slate-300 focus:border-indigo-500 outline-none font-medium leading-relaxed font-mono" />
              </div>
            </div>
            {conceptResult && <Button onClick={() => setActiveTab('printful')} className="w-full h-16 md:h-20 mt-10 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase italic text-sm md:text-lg group">② Printful製品化へ進む <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></Button>}
          </Card>
        )}

        {/* ② Printful連携 */}
        {activeTab === 'printful' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in zoom-in">
            <h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-10 flex items-center gap-4 text-indigo-500"><Printer /> ② Printful 連携 ＆ 製造設定</h3>
            {renderGuide([
              'Printful管理画面を開き、モックアップを生成する',
              'AIに利益率を計算させる指示をコピー',
              '算出された販売価格を決定する'
            ])}
            <div className="grid lg:grid-cols-2 gap-12">
               <div className="bg-slate-950 p-10 rounded-[3rem] border border-slate-800 flex flex-col justify-center space-y-6">
                  <p className="text-white font-black italic uppercase tracking-tighter">Printful Automation</p>
                  <Button variant="outline" className="w-full h-16 border-2 border-slate-800 text-slate-200 font-black text-lg rounded-2xl hover:bg-slate-900 transition-all flex items-center justify-center gap-2" onClick={() => window.open('https://www.printful.com/dashboard', '_blank')}>Printful Dashboard ↗</Button>
                  <Button onClick={() => handleCopy(PROMPTS.printful)} className={`w-full h-16 font-black rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-red-600 text-white'}`}>利益計算指示をコピー</Button>
               </div>
               <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 flex flex-col justify-center space-y-4 shadow-2xl text-left">
                  <p className="text-emerald-500 font-black uppercase text-xs italic tracking-widest flex items-center gap-2"><DollarSign className="w-4 h-4" /> Profit Strategy</p>
                  <ul className="text-sm text-slate-300 space-y-2 font-bold italic">
                    <li>・製造原価: $15.00 〜</li>
                    <li>・推奨利益率: 30% 〜 50%</li>
                    <li>・送料設定（定額または無料）の決定</li>
                  </ul>
               </div>
            </div>
            <Button onClick={() => setActiveTab('shopify')} className="w-full h-16 md:h-20 mt-10 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase italic text-sm md:text-lg group">
               ③ Shopifyでショップ公開 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>
        )}

        {/* ③ Shopify公開 */}
        {activeTab === 'shopify' && (
          <div className="animate-in fade-in zoom-in space-y-8 text-center pb-20 text-left">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-10 md:p-20 shadow-2xl border-l-8 border-l-emerald-600 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 text-white"><Store className="w-80 h-80" /></div>
               <h3 className="text-4xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 relative z-10"><Globe className="text-emerald-500 animate-pulse w-12 h-12" /> Shopify Store Release</h3>
               <div className="grid lg:grid-cols-2 gap-10 relative z-10">
                  <div className="space-y-6">
                    <p className="text-slate-300 font-bold leading-relaxed">
                      ShopifyとPrintfulの連携が完了していれば、同期ボタンひとつでショップに商品が並びます。<br />
                      AIが生成したメタデータを使用してSEOを強化しましょう。
                    </p>
                    <Button variant="outline" className="w-full h-16 border-2 border-slate-800 text-slate-200 font-black text-lg rounded-2xl hover:bg-slate-900 transition-all flex items-center justify-center gap-2" onClick={() => window.open('https://www.shopify.com/jp/login', '_blank')}>Shopify Admin ↗</Button>
                  </div>
                  <div className="p-8 bg-slate-950 rounded-3xl border border-slate-800 space-y-4">
                     <p className="text-white font-black italic uppercase text-xs">SEO Metadata Assist</p>
                     <Button onClick={() => handleCopy(PROMPTS.shopify)} className={`w-full h-14 font-black rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-indigo-600 text-white'}`}>SEO指示をコピー</Button>
                  </div>
               </div>
            </Card>
            <Button onClick={() => setActiveTab('concept')} variant="outline" className="w-full h-16 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl uppercase italic"><RotateCcw className="mr-2 h-5 w-5" /> 最初から設計し直す</Button>
          </div>
        )}
      </div>
      <div className="mt-16 text-center text-slate-500"><p className="text-[10px] font-black uppercase tracking-widest italic opacity-20">E-Commerce Automation Engine — NextraLabs 2026</p></div>
    </div>
  )
}
