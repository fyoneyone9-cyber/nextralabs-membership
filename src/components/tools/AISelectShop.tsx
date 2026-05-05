'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, CheckCircle2, Zap, Copy, ExternalLink, RotateCcw, Lightbulb, ClipboardPaste, 
  ShoppingBag, Store, Package, Target, Shirt, Printer, Globe, DollarSign, Download, 
  Sparkles, Activity, Loader2, RefreshCw, X, Box, Settings, BarChart3, TrendingUp, Search, Palette
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const TABS = [
  { id: 'concept', label: '① 商品コンセプト解析', icon: ShoppingBag },
  { id: 'printful', label: '② PRINTFUL連携', icon: Printer },
  { id: 'shopify', label: '③ SHOPIFY公開', icon: Globe },
];

const CATEGORIES = ['T-Shirts', 'Hoodies', 'Caps', 'Mugs', 'Posters'];
const STYLES = ['和風・浮世絵', 'サイバーパンク', 'ミニマリズム', 'ストリート', 'ビンテージ', '水彩画風'];
const SIZES = ['S', 'M', 'L', 'XL', '2XL'];

export default function AISelectShop() {
  const [activeTab, setActiveTab] = useState('concept');
  const [trends, setTrends] = useState<string[]>([]);
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);
  const [apiStatus, setApiStatus] = useState<'loading' | 'live' | 'local'>('loading');
  const [selectedTrend, setSelectedTrend] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['M', 'L']);
  const [conceptResult, setConceptResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [products, setProducts] = useState<any[]>([]);
  const [shopifyInfo, setShopifyInfo] = useState<any>(null);

  useEffect(() => {
    fetchTrends();
    checkConnections();
  }, []);

  const fetchTrends = async () => {
    setIsLoadingTrends(true);
    try {
      const response = await fetch('/api/trends');
      const data = await response.json();
      if (data.trends && data.trends.length > 0) {
        setTrends(data.trends);
        setApiStatus(data.isLive ? 'live' : 'local');
      }
    } catch (error) {
      setApiStatus('local');
      setTrends(["最新AIニュース", "日本文化の再発見", "次世代の都市設計"]);
    } finally {
      setIsLoadingTrends(false);
    }
  };

  const checkConnections = async () => {
    try {
      const pRes = await fetch('/api/tools/printful', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'list-sync-products' }),
      });
      const pData = await pRes.json();
      if (pData.result) setProducts(pData.result);

      const sRes = await fetch('/api/tools/printful', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'shopify-test' }),
      });
      const sData = await sRes.json();
      if (sData.result) setShopifyInfo(sData.result);
    } catch (e) { console.error(e); }
  };

  const generateConcept = async () => {
    if (!selectedTrend) return;
    setIsGenerating(true);
    setConceptResult('');
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const result = `【ショップ名】: ${selectedTrend} × ${selectedStyle.split('・')[0]} Gear
【コンセプト】: リアルタイムトレンド「${selectedTrend}」を、${selectedStyle}の美学で再定義。
【対象カテゴリ】: ${selectedCategory}
【展開サイズ】: ${selectedSizes.join(', ')}
【戦略】: ${selectedStyle}の静寂とトレンドの躍動を融合させた唯一無二のデザイン。`;
      setConceptResult(result);
    } catch (e) { console.error(e); } finally { setIsGenerating(false); }
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  const PROMPT_FOR_AI = `あなたは世界最高峰のECデザイナーです。以下の情報を元に、Printful/Shopifyですぐに販売可能な究極の「在庫ゼロショップ」の設計図を出力してください。

【トレンド】: ${selectedTrend}
【デザインスタイル】: ${selectedStyle}
【製品種別】: ${selectedCategory}
【展開サイズ】: ${selectedSizes.join(', ')}

1. 【デザイン詳細】: 具体的な配色、モチーフ、フォントの指定。
2. 【販売ストーリー】: 顧客の心を揺さぶる商品名とキャッチコピー。
3. 【ビジネスモデル】: 製造コストを考慮した利益最大化価格設定。`;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-slate-950 text-left">
      <div className="text-center space-y-3 mb-16">
        <h1 className="text-6xl md:text-[9rem] font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">AI SELECT SHOP</h1>
      </div>

      <div className="flex gap-1 bg-[#1a1b26]/50 p-1 rounded-2xl border border-white/5 mb-12">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-4 px-2 rounded-xl font-black text-[10px] md:text-sm uppercase italic transition-all flex items-center justify-center gap-3 ${activeTab === tab.id ? 'bg-[#5845e0] text-white' : 'text-slate-500'}`}>
            <tab.icon size={18} /> <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-4">
        {activeTab === 'concept' && (
          <div className="bg-[#13141f] border border-white/10 rounded-[3rem] p-10 md:p-20 shadow-2xl relative animate-in fade-in zoom-in-95">
            <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-12 flex items-center gap-6">
              <ShoppingBag size={48} className="text-indigo-500" /> ① 究極のショップ錬成
            </h2>

            <div className="grid lg:grid-cols-2 gap-16">
              <div className="space-y-12">
                {/* 1. トレンド選択 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-4">
                    <div className="flex items-center gap-2 text-red-500 font-black italic text-xs uppercase tracking-widest">
                      <TrendingUp size={16} /> Real-time Buzz Words
                    </div>
                    <Badge variant="outline" className={`text-[9px] font-black ${apiStatus === 'live' ? 'text-green-500 border-green-500/30 animate-pulse' : 'text-amber-500 border-amber-500/30'}`}>
                      {apiStatus === 'live' ? 'API: LIVE' : 'API: LOCAL'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {isLoadingTrends ? Array(4).fill(0).map((_, i) => <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />) : trends.map((t, i) => (
                      <Button key={i} variant="outline" onClick={() => setSelectedTrend(t)} className={`h-14 border-2 font-black text-xs uppercase italic rounded-xl transition-all ${selectedTrend === t ? 'bg-[#5845e0] border-white text-white shadow-lg scale-95' : 'border-white/5 bg-[#0a0b14] text-slate-400'}`}>{t}</Button>
                    ))}
                  </div>
                </div>

                {/* 2. デザインスタイル & カテゴリ */}
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 flex items-center gap-2"><Palette size={12}/> Design Style</p>
                    <div className="flex flex-wrap gap-2">
                       {STYLES.map(s => (
                         <button key={s} onClick={() => setSelectedStyle(s)} className={`px-4 py-2 rounded-xl font-black text-[10px] transition-all ${selectedStyle === s ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-500'}`}>{s}</button>
                       ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 flex items-center gap-2"><Shirt size={12}/> Category</p>
                    <div className="flex flex-wrap gap-2">
                       {CATEGORIES.map(c => (
                         <button key={c} onClick={() => setSelectedCategory(c)} className={`px-4 py-2 rounded-xl font-black text-[10px] transition-all ${selectedCategory === c ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-500'}`}>{c}</button>
                       ))}
                    </div>
                  </div>
                </div>

                {/* 3. サイズ選択 */}
                <div className="space-y-4">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 flex items-center gap-2"><Box size={12}/> Select Sizes</p>
                   <div className="flex gap-3">
                      {SIZES.map(size => (
                        <button key={size} onClick={() => toggleSize(size)} className={`w-12 h-12 rounded-xl font-black text-sm transition-all border-2 ${selectedSizes.includes(size) ? 'bg-[#5845e0] border-white text-white' : 'border-white/5 bg-white/5 text-slate-600'}`}>{size}</button>
                      ))}
                   </div>
                </div>

                <Button onClick={generateConcept} disabled={!selectedTrend || isGenerating} className="w-full h-24 bg-white text-black hover:bg-indigo-600 hover:text-white font-black text-3xl rounded-[2.5rem] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4">
                  {isGenerating ? <Loader2 className="animate-spin" size={32}/> : <><Sparkles size={32} /> <span>全自動設計を開始</span></>}
                </Button>
              </div>

              <div className="bg-[#0a0b14] rounded-[3.5rem] p-10 border border-white/5 shadow-inner flex flex-col gap-6">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20"><ClipboardPaste className="text-indigo-400" size={24} /></div>
                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">錬成結果：究極の設計図</h3>
                 </div>
                 <textarea value={conceptResult} onChange={(e) => setConceptResult(e.target.value)} placeholder="トレンド、スタイル、カテゴリを選んで「全自動設計」を実行してください..." className="flex-1 bg-[#13141f] border border-white/5 rounded-[2.5rem] p-10 text-base text-slate-300 focus:border-indigo-500 outline-none font-mono italic shadow-inner min-h-[450px]" />
                 {conceptResult && (
                   <div className="space-y-4 animate-in slide-in-from-bottom-4">
                     <Button onClick={() => { navigator.clipboard.writeText(PROMPT_FOR_AI); alert('マスター指示をコピーしました'); }} className="w-full h-14 bg-[#5845e0] text-white font-black rounded-xl italic">AI三台体制に渡して製品画像を生成する</Button>
                     <Button onClick={() => setActiveTab('printful')} className="w-full h-14 bg-emerald-600 text-white font-black rounded-xl italic">② 製品化（Printful同期）へ進む →</Button>
                   </div>
                 )}
              </div>
            </div>
          </div>
        )}

        {/* ② & ③ TABS (Kept from v5.5 but refined style) */}
        {activeTab === 'printful' && (
          <div className="bg-[#13141f] border border-white/10 rounded-[3rem] p-20 animate-in zoom-in-95 text-center relative overflow-hidden">
            <h3 className="text-5xl font-black text-white italic uppercase mb-12 flex items-center justify-center gap-6"><Printer size={64} className="text-indigo-500" /> ② PRINTFUL 連携</h3>
            <div className="max-w-2xl mx-auto space-y-12">
               <div className="bg-[#0a0b14] p-10 rounded-3xl border border-white/5 grid grid-cols-2 gap-8 shadow-inner"><div className="space-y-2"><p className="text-[10px] font-bold text-slate-600 uppercase">Live Products</p><p className="text-6xl font-black text-white italic">{products.length}</p></div><div className="space-y-2"><p className="text-[10px] font-bold text-slate-600 uppercase">Engine Status</p><p className="text-6xl font-black text-green-500 italic">READY</p></div></div>
               <Button onClick={() => window.open('https://www.printful.com/dashboard', '_blank')} className="w-full h-28 bg-white text-black hover:bg-indigo-600 hover:text-white font-black rounded-[2rem] text-3xl shadow-2xl flex items-center justify-center gap-4 transition-all">Printful Dashboard ↗</Button>
               <Button onClick={() => setActiveTab('shopify')} className="w-full h-16 bg-[#5845e0] text-white font-black rounded-2xl italic flex items-center justify-center gap-3">③ SHOPIFY公開へ進む <ArrowRight /></Button>
            </div>
          </div>
        )}

        {activeTab === 'shopify' && (
          <div className="bg-[#13141f] border border-white/10 rounded-[3rem] p-20 animate-in zoom-in-95 text-center relative overflow-hidden">
            <h3 className="text-5xl font-black text-white italic uppercase mb-12 flex items-center justify-center gap-6"><Globe size={64} className="text-indigo-500" /> ③ SHOPIFY 公開</h3>
            <div className="max-w-2xl mx-auto space-y-12">
              <div className="bg-[#0a0b14] p-8 rounded-3xl border border-white/5 text-center shadow-inner"><p className="text-[10px] font-bold text-slate-600 uppercase mb-2">Connected Domain</p><p className="text-2xl font-black text-white italic">{shopifyInfo?.domain || 'nextralabs.myshopify.com'}</p></div>
              <Button onClick={() => window.open(`https://${shopifyInfo?.domain || 'shopify.com'}/admin`, '_blank')} className="w-full h-28 bg-white text-black hover:bg-green-600 hover:text-white font-black rounded-[2rem] text-3xl shadow-2xl flex items-center justify-center gap-4 transition-all">Shopify Admin ↗</Button>
              <button onClick={() => setActiveTab('concept')} className="text-slate-500 hover:text-white font-black uppercase italic underline text-xs">最初から設計し直す</button>
            </div>
          </div>
        )}
      </div>

      <DebugPanel data={{ selectedTrend, selectedStyle, selectedCategory, selectedSizes }} toolId="ai-select-shop" />
      <div className="text-center opacity-20 mt-20 font-black uppercase tracking-[0.5em] italic text-[10px]">Global Dropshipping OS • NextraLabs 2026</div>
    </div>
  )
}
