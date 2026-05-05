'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  ShoppingBag, Store, Printer, Globe, Settings, TrendingUp, Sparkles, Activity, Loader2, Palette, Box, Terminal, Eye, ExternalLink, RefreshCw, ClipboardPaste, ArrowRight, PencilLine, Wand2, Shirt
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const TABS = [
  { id: 'concept', label: '① 究極設計', icon: ShoppingBag },
  { id: 'printful', label: '② 製造同期', icon: Printer },
  { id: 'shopify', label: '③ 世界公開', icon: Globe },
  { id: 'settings', label: '④ システム設定', icon: Settings },
];

const CATEGORIES = [
  { id: 'tshirt', label: 'T-Shirts (B+C 3001)', kw: 't-shirt,premium-apparel' },
  { id: 'hoodie', label: 'Hoodies', kw: 'hoodie,premium-cotton' },
  { id: 'cap', label: 'Caps', kw: 'hat,headwear' },
  { id: 'mug', label: 'Mugs', kw: 'ceramic-mug' }
];

const STYLES = [
  { id: 'wafu', label: '和風・浮世絵', kw: 'ukiyo-e,japanese-style' },
  { id: 'cyber', label: 'サイバーパンク', kw: 'cyberpunk,neon' },
  { id: 'mini', label: 'ミニマリズム', kw: 'minimalist,vector' },
  { id: 'street', label: 'ストリート', kw: 'streetwear,urban' },
  { id: 'vintage', label: 'ビンテージ', kw: 'vintage,retro' }
];

const SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL'];

export default function AISelectShop() {
  const [activeTab, setActiveTab] = useState('concept');
  const [trends, setTrends] = useState<string[]>([]);
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);
  const [apiStatus, setApiStatus] = useState<'loading' | 'live' | 'local'>('loading');
  
  const [targetKeyword, setTargetKeyword] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(SIZES);
  
  const [conceptResult, setConceptResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [mockupImage, setMockupImage] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [shopifyUrl, setShopifyUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    fetchTrends();
  }, []);

  // 🚀 【真の連動】トレンドをクリックするとキーワードが入力され、画像が自動更新される
  useEffect(() => {
    if (!targetKeyword) return;
    const timer = setTimeout(() => {
      const ts = new Date().getTime();
      const imageUrl = `https://loremflickr.com/800/800/${selectedCategory.id},${selectedStyle.kw},${encodeURIComponent(targetKeyword)}?lock=${ts}`;
      setMockupImage(imageUrl);
    }, 600);
    return () => clearTimeout(timer);
  }, [targetKeyword, selectedStyle, selectedCategory]);

  const fetchTrends = async () => {
    setIsLoadingTrends(true);
    try {
      const response = await fetch('/api/trends');
      const data = await response.json();
      if (data.trends) {
        setTrends(data.trends);
        setApiStatus(data.isLive ? 'live' : 'local');
      }
    } catch (e) { setApiStatus('local'); } finally { setIsLoadingTrends(false); }
  };

  const handleTrendClick = (trend: string) => {
    setTargetKeyword(trend); // トレンドクリックでキーワードに連動
    console.log(`[SYNC] Trend locked to Keyword: ${trend}`);
  };

  const publishToShopify = async () => {
    if (!targetKeyword) return;
    setIsGenerating(true);
    setActiveAction('publishing');
    try {
      // 🚀 執行：実際にPrintful APIを叩き、ShopifyへPushする本物の導線
      const res = await fetch('/api/tools/printful', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'create-product', 
          keyword: targetKeyword, 
          style: selectedStyle.label, 
          sizes: selectedSizes,
          mockupUrl: mockupImage 
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShopifyUrl(`https://z5ju1n-vs.myshopify.com/admin/products`);
        setConceptResult(`【PRODUCT_CORE】: Bella+Canvas 3001\n【STATUS】: PUBLISHED_TO_SHOPIFY ✅\n\n「${targetKeyword}」の製品がストアに登録されました。`);
        alert('SHOPIFYへの出品が完了しました！');
      } else {
        throw new Error(data.error || '出品失敗');
      }
    } catch (e: any) {
      alert(`エラー: ${e.message}`);
    } finally { 
      setIsGenerating(false); 
      setActiveAction(null);
    }
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-[#050507] text-left">
      <div className="text-center space-y-3 mb-16">
        <h1 className="text-6xl md:text-[8rem] font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">AI SELECT SHOP</h1>
        <Badge className="bg-[#5845e0] text-white font-black italic tracking-[0.3em] px-8 py-2 text-[10px] uppercase rounded-full shadow-2xl">Master Command OS v12.5</Badge>
      </div>

      <div className="flex gap-1 bg-[#1a1b26]/80 p-1 rounded-2xl border border-white/5 mb-12 shadow-2xl overflow-x-auto scrollbar-hide">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-5 px-6 rounded-xl font-black text-xs md:text-sm uppercase italic transition-all flex items-center justify-center gap-3 whitespace-nowrap ${activeTab === tab.id ? 'bg-[#5845e0] text-white shadow-xl' : 'text-slate-500'}`}>
            <tab.icon size={18} /> <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'concept' && (
        <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in duration-700">
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 shadow-2xl space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-red-500 font-black italic text-xs uppercase tracking-widest"><TrendingUp size={16} /> GOOGLE TRENDS (LIVE)</div><Badge variant="outline" className="text-[9px] font-black border-emerald-500/30 text-emerald-500 uppercase">Linked</Badge></div>
                <div className="grid grid-cols-1 gap-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                  {trends.map((t, i) => (<Button key={i} variant="outline" onClick={() => handleTrendClick(t)} className={`h-10 justify-start px-6 border-2 font-black text-[10px] md:text-xs uppercase italic rounded-xl transition-all ${targetKeyword === t ? 'bg-[#5845e0] border-white text-white shadow-lg scale-95' : 'border-white/5 bg-[#0a0b14] text-slate-400'}`}>{t}</Button>))}
                </div>
              </div>
              <div className="space-y-4 pt-4 border-t border-white/5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2"><PencilLine size={14}/> TARGET KEYWORD</p>
                <Input value={targetKeyword} onChange={(e) => setTargetKeyword(e.target.value)} className="h-16 bg-[#0a0b14] border-2 border-white/10 rounded-2xl px-6 font-bold text-white focus:border-[#5845e0]" />
              </div>
              <div className="space-y-4 pt-4 border-t border-white/5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2"><Palette size={14}/> DESIGN STYLE</p>
                <div className="grid grid-cols-2 gap-2">
                  {STYLES.map(s => (<button key={s.id} onClick={() => setSelectedStyle(s)} className={`py-3 px-3 rounded-lg font-black text-[9px] transition-all border ${selectedStyle.id === s.id ? 'bg-[#5845e0] text-white border-white shadow-md' : 'bg-white/5 text-slate-500 border-transparent'}`}>{s.label}</button>))}
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="bg-[#13141f] border-2 border-white/5 rounded-[3rem] p-10 md:p-12 shadow-2xl relative overflow-hidden h-full">
              <div className="grid md:grid-cols-2 gap-12 h-full">
                <div className="space-y-8 flex flex-col items-center">
                  <div className="w-full flex items-center gap-4 mb-4"><div className="w-12 h-12 rounded-xl bg-indigo-600/20 flex items-center justify-center border border-indigo-500/20"><Activity className="text-indigo-400" /></div><h3 className="text-4xl font-black text-white italic uppercase tracking-tighter">LIVE ENGINE</h3></div>
                  <div className="relative aspect-square w-full rounded-[2.5rem] overflow-hidden border-4 border-white/5 bg-black shadow-inner mb-8">
                    {mockupImage ? <img src={mockupImage} key={mockupImage} className="w-full h-full object-cover animate-in fade-in duration-500" alt="Preview" /> : <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 opacity-20"><Eye size={64} /><p className="text-sm font-black uppercase tracking-widest">Awaiting Command...</p></div>}
                    {isGenerating && <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center"><Loader2 className="animate-spin text-indigo-500" size={48} /></div>}
                  </div>
                  <Button onClick={publishToShopify} disabled={!targetKeyword || isGenerating} className="w-full h-24 bg-white text-black hover:bg-emerald-600 hover:text-white font-black text-3xl rounded-3xl shadow-2xl mt-auto transition-all active:scale-95 flex items-center justify-center gap-4 group">
                    {isGenerating ? <Loader2 className="animate-spin" /> : <Store size={40} />}
                    <span>SHOPIFYへ即時出品</span>
                  </Button>
                </div>

                <div className="flex-1 bg-[#0a0b14] rounded-[2.5rem] p-8 border border-white/5 shadow-inner flex flex-col relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4 text-slate-500 font-black italic uppercase text-[10px] tracking-widest">{`>_ SHOPIFY ARCHITECTURE OUTPUT`}</div>
                  <textarea value={conceptResult} readOnly className="flex-1 bg-transparent text-xl md:text-3xl text-emerald-400 font-mono italic outline-none resize-none leading-relaxed" placeholder="Ready for generation..." />
                  {shopifyUrl && <Button onClick={() => window.open(shopifyUrl, '_blank')} className="mt-6 w-full h-20 bg-[#5845e0] hover:bg-indigo-500 text-white font-black rounded-2xl italic flex items-center justify-center gap-4 shadow-xl animate-bounce"><Globe size={24}/> 管理画面を確認</Button>}
                  <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none"><Sparkles size={120} className="text-emerald-500" /></div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
      <DebugPanel data={{ targetKeyword, mockupImage }} toolId="ai-select-shop" />
    </div>
  )
}
