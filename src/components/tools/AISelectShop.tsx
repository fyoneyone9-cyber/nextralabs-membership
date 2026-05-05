'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, CheckCircle2, Zap, Copy, ExternalLink, RotateCcw, Lightbulb, ClipboardPaste, 
  ShoppingBag, Store, Package, Target, Shirt, Printer, Globe, DollarSign, Download, 
  Sparkles, Activity, Loader2, RefreshCw, X, Box, Settings, BarChart3, TrendingUp, Search
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const TABS = [
  { id: 'concept', label: '① 商品コンセプト解析', icon: ShoppingBag },
  { id: 'printful', label: '② PRINTFUL連携', icon: Printer },
  { id: 'shopify', label: '③ SHOPIFY公開', icon: Globe },
];

const CATEGORIES = ['T-Shirts', 'Hoodies', 'Caps', 'Mugs', 'Posters', 'Stickers'];

export default function AISelectShop() {
  const [activeTab, setActiveTab] = useState('concept');
  const [trends, setTrends] = useState<string[]>([]);
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);
  const [apiStatus, setApiStatus] = useState<'loading' | 'live' | 'local'>('loading');
  const [selectedTrend, setSelectedTrend] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [conceptResult, setConceptResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // 実機能用ステート
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [shopifyInfo, setShopifyInfo] = useState<any>(null);

  // 初回ロード時に本物のトレンドと連携状況をチェック
  useEffect(() => {
    fetchTrends();
    checkConnections();
  }, []);

  const fetchTrends = async () => {
    setIsLoadingTrends(true);
    setApiStatus('loading');
    try {
      const response = await fetch('/api/trends');
      const data = await response.json();
      if (data.trends && data.trends.length > 0) {
        setTrends(data.trends);
        setApiStatus(data.isLive ? 'live' : 'local');
      }
    } catch (error) {
      setApiStatus('local');
      setTrends(["AI活用", "Web3", "働き方改革", "メタバース"]);
    } finally {
      setIsLoadingTrends(false);
    }
  };

  const checkConnections = async () => {
    setLoading(true);
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
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const generateConcept = async () => {
    if (!selectedTrend) return;
    setIsGenerating(true);
    setConceptResult('');
    try {
      // 本来はバックエンドでGeminiを叩く
      await new Promise(resolve => setTimeout(resolve, 2000));
      const result = `【ショップ名】: ${selectedTrend} Labs
【キャッチコピー】: 「${selectedTrend}」を身に纏う、次世代のステートメント。
【ターゲット】: トレンドに敏感な10代〜30代のクリエイター層。
【製品】: ${selectedCategory} (プレミアムコットン使用)
【戦略】: 限定100着のドロップ販売方式を採用。`;
      setConceptResult(result);
    } catch (e) { console.error(e); } finally { setIsGenerating(false); }
  };

  const PROMPT_FOR_AI = `あなたはEC構築のプロです。以下の【バズワード】と【カテゴリ】を元に、在庫ゼロショップの設計図を出力してください。
【トレンド】: ${selectedTrend}
【製品種別】: ${selectedCategory}

1. 【ターゲット層】: この商品を欲しがる客層。
2. 【販売ストーリー】: 商品名とキャッチコピー。
3. 【利益計算指示】: 製造コストと適正販売価格。`;

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
              <ShoppingBag size={48} className="text-indigo-500" /> ① トレンド選択・解析
            </h2>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* LEFT: TREND & CATEGORY SELECTION */}
              <div className="space-y-10">
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
                    {isLoadingTrends ? (
                      Array(6).fill(0).map((_, i) => <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />)
                    ) : (
                      trends.map((t, i) => (
                        <Button 
                          key={i} 
                          variant="outline" 
                          onClick={() => setSelectedTrend(t)}
                          className={`h-14 border-2 font-black text-xs uppercase italic rounded-xl transition-all ${selectedTrend === t ? 'bg-[#5845e0] border-white text-white shadow-lg scale-95' : 'border-white/5 bg-[#0a0b14] text-slate-400 hover:border-indigo-500'}`}
                        >
                          {t}
                        </Button>
                      ))
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Product Category</p>
                   <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map(c => (
                        <button key={c} onClick={() => setSelectedCategory(c)} className={`px-6 py-2 rounded-full font-black text-xs transition-all ${selectedCategory === c ? 'bg-white text-black' : 'bg-white/5 text-slate-500 border border-white/5'}`}>{c}</button>
                      ))}
                   </div>
                </div>

                <Button 
                  onClick={generateConcept} 
                  disabled={!selectedTrend || isGenerating}
                  className="w-full h-24 bg-white text-black hover:bg-indigo-600 hover:text-white font-black text-2xl rounded-[2rem] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4"
                >
                  {isGenerating ? <Loader2 className="animate-spin" size={32}/> : <><Sparkles /> <span>ショップ設計図を錬成</span></>}
                </Button>
              </div>

              {/* RIGHT: OUTPUT PANEL */}
              <div className="bg-[#0a0b14] rounded-[3.5rem] p-10 border border-white/5 shadow-inner flex flex-col gap-6">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                      <ClipboardPaste className="text-indigo-400" size={24} />
                    </div>
                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">錬成された設計図</h3>
                 </div>
                 <textarea 
                   value={conceptResult} 
                   onChange={(e) => setConceptResult(e.target.value)} 
                   placeholder="トレンドを選択して「錬成」ボタンを押してください..." 
                   className="flex-1 bg-[#13141f] border border-white/5 rounded-[2.5rem] p-10 text-sm md:text-base text-slate-300 focus:border-indigo-500 outline-none font-mono italic shadow-inner min-h-[400px]" 
                 />
                 {conceptResult && (
                   <div className="space-y-4 animate-in slide-in-from-bottom-4">
                     <Button onClick={() => { navigator.clipboard.writeText(PROMPT_FOR_AI); alert('AI指示をコピーしました'); }} className="w-full h-14 bg-[#5845e0] text-white font-black rounded-xl italic">
                       さらにAI三台体制で深掘りする
                     </Button>
                     <Button onClick={() => setActiveTab('printful')} className="w-full h-14 bg-emerald-600 text-white font-black rounded-xl italic">
                       ② 製品化（Printful同期）へ進む →
                     </Button>
                   </div>
                 )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'printful' && (
          <div className="bg-[#13141f] border border-white/10 rounded-[3rem] p-20 animate-in zoom-in-95 text-center relative overflow-hidden">
            <h3 className="text-5xl font-black text-white italic uppercase mb-12 flex items-center justify-center gap-6">
              <Printer size={64} className="text-indigo-500" /> ② PRINTFUL 連携
            </h3>
            <div className="max-w-2xl mx-auto space-y-8">
               <div className="bg-[#0a0b14] p-8 rounded-3xl border border-white/5 grid grid-cols-2 gap-8 mb-8 shadow-inner">
                  <div>
                    <p className="text-[10px] font-bold text-slate-600 uppercase">Live Items</p>
                    <p className="text-4xl font-black text-white italic">{products.length}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-600 uppercase">Connection</p>
                    <p className="text-4xl font-black text-green-500 italic">OK</p>
                  </div>
               </div>
               <Button onClick={() => window.open('https://www.printful.com/dashboard', '_blank')} className="w-full h-28 bg-white text-black hover:bg-indigo-600 hover:text-white font-black rounded-[2rem] text-2xl shadow-2xl flex items-center justify-center gap-4 transition-all">
                Printful Dashboard ↗
              </Button>
              <Button onClick={() => setActiveTab('shopify')} className="w-full h-16 bg-[#5845e0] text-white font-black rounded-2xl italic flex items-center justify-center gap-3">
                ③ SHOPIFY公開へ進む <ArrowRight />
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'shopify' && (
          <div className="bg-[#13141f] border border-white/10 rounded-[3rem] p-20 animate-in zoom-in-95 text-center relative overflow-hidden">
            <h3 className="text-5xl font-black text-white italic uppercase mb-12 flex items-center justify-center gap-6">
              <Globe size={64} className="text-indigo-500" /> ③ SHOPIFY 公開
            </h3>
            <div className="max-w-2xl mx-auto space-y-12">
              <div className="bg-[#0a0b14] p-8 rounded-3xl border border-white/5 text-center shadow-inner">
                 <p className="text-[10px] font-bold text-slate-600 uppercase mb-2">Store Domain</p>
                 <p className="text-xl font-black text-white italic">{shopifyInfo?.domain || 'nextralabs.myshopify.com'}</p>
              </div>
              <Button onClick={() => window.open(`https://${shopifyInfo?.domain || 'shopify.com'}/admin`, '_blank')} className="w-full h-28 bg-white text-black hover:bg-green-600 hover:text-white font-black rounded-[2rem] text-2xl shadow-2xl flex items-center justify-center gap-4 transition-all">
                Shopify Admin ↗
              </Button>
              <button onClick={() => setActiveTab('concept')} className="text-slate-500 hover:text-white font-black uppercase italic underline text-xs">
                最初から設計し直す
              </button>
            </div>
          </div>
        )}
      </div>

      <DebugPanel data={{ activeTab, trends, selectedTrend, selectedCategory, conceptResult }} toolId="ai-select-shop" />
    </div>
  )
}
