'use client'
import React, { useState, useEffect, useRef } from 'react'
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
  { id: 'tshirt', label: 'T-Shirts (B+C 3001)', kw: 't-shirt,apparel,design' },
  { id: 'hoodie', label: 'Hoodies', kw: 'hoodie,sweatshirt,design' },
  { id: 'cap', label: 'Caps', kw: 'cap,hat,design' },
  { id: 'mug', label: 'Mugs', kw: 'ceramic,mug,coffee' }
];

const STYLES = [
  { id: 'wafu', label: '和風・浮世絵', kw: 'ukiyo-e,japanese-art' },
  { id: 'cyber', label: 'サイバーパンク', kw: 'cyberpunk,neon' },
  { id: 'mini', label: 'ミニマリズム', kw: 'minimalist,vector' },
  { id: 'street', label: 'ストリート', kw: 'streetwear,urban' },
  { id: 'vintage', label: 'ビンテージ', kw: 'vintage,retro' }
];

const SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL'];

export default function AISelectShop() {
  const [activeTab, setActiveTab] = useState('concept');
  const [trends, setTrends] = useState<string[]>([]);
  const [apiStatus, setApiStatus] = useState<'loading' | 'live' | 'local'>('loading');
  const [targetKeyword, setTargetKeyword] = useState('あくぁああ'); 
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(SIZES);
  const [conceptResult, setConceptResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [mockupImage, setMockupImage] = useState<string | null>(null);
  const [shopifyUrl, setShopifyUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    fetchTrends();
  }, []);

  useEffect(() => {
    if (!targetKeyword) return;
    const timer = setTimeout(() => {
      refreshMockup();
    }, 500);
    return () => clearTimeout(timer);
  }, [targetKeyword, selectedStyle, selectedCategory]);

  const refreshMockup = () => {
    const ts = new Date().getTime();
    const dynamicUrl = `https://loremflickr.com/g/802/802/${selectedCategory.id},${selectedStyle.id}/all?lock=${ts}`;
    setMockupImage(dynamicUrl);
  };

  const fetchTrends = async () => {
    try {
      const response = await fetch('/api/trends');
      const data = await response.json();
      if (data.trends) {
        setTrends(data.trends);
        setApiStatus(data.isLive ? 'live' : 'local');
      }
    } catch (e) { setApiStatus('local'); }
  };

  const generateAndPublish = async () => {
    if (!targetKeyword) return;
    setIsGenerating(true);
    setShopifyUrl(null);
    try {
      // 1. 本物のAPI執行 (Printful -> Shopify)
      // 憲法：画像URLを確定させ、APIにパラメータを正確に渡す
      const res = await fetch('/api/tools/printful', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'create-product', 
          keyword: targetKeyword, 
          style: selectedStyle.label, 
          sizes: selectedSizes,
          mockupUrl: mockupImage // プレビュー画像をそのまま製品画像として同期
        }),
      });
      const data = await res.json();
      if (data.success) {
        // 🚀 出品完了時のUI更新
        setConceptResult(`【PRODUCT_CORE】 : \nBeLLa+Canvas 3001 Premium\n【SHOP IDENTITY】 : \n${targetKeyword.toUpperCase()}\n【STYLE】 : ${selectedStyle.label}\n【CAT】 : ${selectedCategory.label}\n【SIZE】 : ${selectedSizes.join(', ')}\n\n設計を執行完了 ✅\nSHOPIFYへの出品が完了しました！\nストアを確認してください。`);
        setShopifyUrl(`https://z5ju1n-vs.myshopify.com/admin/products`);
      } else {
        throw new Error(data.error || '出品エラー');
      }
    } catch (e: any) {
      alert(`エラー: ${e.message}`);
    } finally { 
      setIsGenerating(false); 
    }
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-[#050507] text-left">
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
                <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-red-500 font-black italic text-xs uppercase tracking-widest"><TrendingUp size={16} /> GOOGLE TRENDS (LIVE)</div><Badge variant="outline" className="text-[9px] font-black border-emerald-500/30 text-emerald-500 uppercase">LINKED</Badge></div>
                <div className="grid grid-cols-1 gap-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                  {trends.map((t, i) => (<Button key={i} variant="outline" onClick={() => setTargetKeyword(t)} className={`h-10 justify-start px-6 border-2 font-black text-[10px] md:text-xs uppercase italic rounded-xl transition-all ${targetKeyword === t ? 'bg-[#5845e0] border-white text-white shadow-lg' : 'border-white/5 bg-[#0a0b14] text-slate-400'}`}>{t}</Button>))}
                </div>
              </div>
              <div className="space-y-4 pt-4 border-t border-white/5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2"><PencilLine size={14}/> TARGET KEYWORD</p>
                <Input value={targetKeyword} onChange={(e) => setTargetKeyword(e.target.value)} className="h-16 bg-[#0a0b14] border-2 border-white/10 rounded-2xl px-6 font-bold text-white focus:border-[#5845e0]" />
              </div>
              <div className="space-y-4 pt-4 border-t border-white/5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2"><Palette size={14}/> DESIGN STYLE</p>
                <div className="grid grid-cols-2 gap-2">
                  {STYLES.map(s => (<button key={s.id} onClick={() => setSelectedStyle(s)} className={`py-3 px-3 rounded-lg font-black text-[9px] transition-all border ${selectedStyle.id === s.id ? 'bg-[#5845e0] text-white border-white shadow-[0_0_15px_rgba(88,69,224,0.3)]' : 'bg-white/5 text-slate-500 border-transparent'}`}>{s.label}</button>))}
                </div>
              </div>
              <div className="space-y-4 pt-4 border-t border-white/5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2"><Shirt size={14}/> BASE PRODUCT</p>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map(c => (<button key={c.id} onClick={() => setSelectedCategory(c)} className={`py-3 px-3 rounded-lg font-black text-[9px] transition-all border ${selectedCategory.id === c.id ? 'bg-[#5845e0] text-white border-white' : 'bg-white/5 text-slate-500 border-transparent'}`}>{c.label}</button>))}
                </div>
              </div>
              <div className="space-y-4 pt-4 border-t border-white/5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2"><Box size={14}/> SIZE RUN</p>
                <div className="flex flex-wrap gap-2">{SIZES.map(size => (<button key={size} onClick={() => toggleSize(size)} className={`w-10 h-10 rounded-lg font-black text-[10px] transition-all border-2 ${selectedSizes.includes(size) ? 'bg-[#5845e0] border-white text-white shadow-md' : 'border-white/5 bg-white/5 text-slate-600'}`}>{size}</button>))}</div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="bg-[#13141f] border-2 border-white/5 rounded-[3rem] p-10 md:p-12 shadow-2xl relative overflow-hidden h-full">
              <div className="grid md:grid-cols-2 gap-12 h-full">
                <div className="space-y-8 flex flex-col items-center">
                  <div className="w-full flex items-center gap-4 mb-4"><div className="w-12 h-12 rounded-xl bg-indigo-600/20 flex items-center justify-center border border-indigo-500/20"><Activity className="text-indigo-400" /></div><h3 className="text-4xl font-black text-white italic uppercase tracking-tighter">LIVE ENGINE</h3></div>
                  <div className="relative aspect-square w-full rounded-[2.5rem] overflow-hidden border-4 border-white/5 bg-black shadow-inner mb-8">
                    {mockupImage ? <img src={mockupImage} key={mockupImage} className="w-full h-full object-cover animate-in fade-in" alt="Preview" /> : <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 opacity-20"><Eye size={64} /><p className="text-sm font-black uppercase tracking-widest">Awaiting Parameters...</p></div>}
                    {isGenerating && <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center"><Loader2 className="animate-spin text-indigo-500" size={48} /></div>}
                  </div>
                  <Button onClick={generateAndPublish} disabled={!targetKeyword || isGenerating} className="w-full h-24 bg-white text-black hover:bg-indigo-600 hover:text-white font-black text-3xl rounded-3xl shadow-2xl mt-auto transition-all flex items-center justify-center gap-4">
                    {isGenerating ? <Loader2 className="animate-spin" /> : <Wand2 size={40} />}
                    <span>全自動設計を執行</span>
                  </Button>
                </div>

                <div className="flex-1 bg-[#0a0b14] rounded-[2.5rem] p-8 border border-white/5 shadow-inner flex flex-col relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4 text-slate-500 font-black italic uppercase text-[10px] tracking-widest">{`>_ SHOPIFY ARCHITECTURE OUTPUT`}</div>
                  <textarea value={conceptResult} readOnly className="flex-1 bg-transparent text-xl md:text-3xl text-emerald-400 font-mono italic outline-none resize-none leading-relaxed" placeholder="Ready for generation..." />
                  {shopifyUrl && (
                    <div className="mt-6 space-y-4 animate-in slide-in-from-bottom-2">
                       <Button onClick={() => window.open(shopifyUrl, '_blank')} className="w-full h-20 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl italic flex items-center justify-center gap-4 shadow-xl animate-bounce">
                          <Globe size={24}/> SHOPIFY管理画面
                       </Button>
                       <Button onClick={() => window.open('https://z5ju1n-vs.myshopify.com/', '_blank')} variant="outline" className="w-full h-12 border-emerald-500/30 text-emerald-500 font-black italic rounded-xl">
                          ストアのフロントを確認
                       </Button>
                    </div>
                  )}
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
