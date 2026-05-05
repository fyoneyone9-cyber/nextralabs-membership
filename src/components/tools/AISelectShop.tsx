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
  { id: 'tshirt', label: 'T-Shirts (B+C 3001)', kw: 't-shirt,apparel' },
  { id: 'hoodie', label: 'Hoodies', kw: 'hoodie,sweatshirt' },
  { id: 'cap', label: 'Caps', kw: 'cap,hat' },
  { id: 'mug', label: 'Mugs', kw: 'mug,coffee-cup' }
];

const STYLES = [
  { id: 'wafu', label: '和風・浮世絵', kw: 'ukiyo-e,japanese-traditional-art,sumi-e' },
  { id: 'cyber', label: 'サイバーパンク', kw: 'cyberpunk,neon-city,futuristic-glow' },
  { id: 'mini', label: 'ミニマリズム', kw: 'minimalist-graphic,clean-vector' },
  { id: 'street', label: 'ストリート', kw: 'streetwear-graffiti,urban-style' },
  { id: 'vintage', label: 'ビンテージ', kw: 'vintage-retro-print,distressed-texture' }
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
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    fetchTrends();
  }, []);

  // 🚀 【仕組みの完全同期】 画像リフレッシュエンジン
  // キーワード、スタイル、カテゴリ、そして「執行」タイミングすべてに連動
  const refreshMockup = (force = false) => {
    // 憲法：中身が空なら画像も出さない
    if (!targetKeyword && !force) return;
    
    const timestamp = new Date().getTime();
    // 以前の完璧だった仕組み：トレンド、カテゴリ、スタイルをすべてURLに埋め込み強制変化
    const imageUrl = `https://loremflickr.com/800/800/${selectedCategory.kw},${selectedStyle.kw},design?lock=${timestamp}`;
    setMockupImage(imageUrl);
    console.log(`[ENGINE] Live Image Reflowed: ${selectedCategory.id}`);
  };

  // リアルタイム検知（入力中）
  useEffect(() => {
    const timer = setTimeout(() => {
      refreshMockup();
    }, 1000);
    return () => clearTimeout(timer);
  }, [targetKeyword, selectedStyle, selectedCategory]);

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
    } catch (e) { setApiStatus('local'); } finally { setIsLoadingTrends(false); }
  };

  const generateConcept = async () => {
    if (!targetKeyword) return;
    setIsGenerating(true);
    setConceptResult('');
    try {
      // 以前の完璧だった仕組み：実際にAPIを叩く前の演出
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result = `【PRODUCT_CORE】 : \nBelLa+Canvas 3001 Premium\n【SHOP IDENTITY】 : \n${targetKeyword.toUpperCase()}\n【STYLE】 : ${selectedStyle.label}\n【CAT】 : ${selectedCategory.label}\n【SIZE】 : ${selectedSizes.join(', ')}\n\n設計を執行完了`;
      setConceptResult(result);
      // 執行ボタン押下時にも画像を再確定
      refreshMockup(true);
    } finally { setIsGenerating(false); }
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-[#050507] text-left">
      {/* 🚀 ヘッダーエリア */}
      <div className="flex gap-1 bg-[#1a1b26]/80 p-1 rounded-2xl border border-white/5 mb-12 shadow-2xl overflow-x-auto scrollbar-hide">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-5 px-6 rounded-xl font-black text-xs md:text-sm uppercase italic transition-all flex items-center justify-center gap-3 whitespace-nowrap ${activeTab === tab.id ? 'bg-[#5845e0] text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}>
            <tab.icon size={18} /> <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'concept' && (
        <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in duration-700">
          
          {/* 🔴 左：パラメータ設定 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 shadow-2xl space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-red-500 font-black italic text-xs uppercase tracking-widest"><TrendingUp size={16} /> GOOGLE TRENDS (LIVE)</div>
                  <Badge variant="outline" className="text-[9px] font-black border-emerald-500/30 text-emerald-500 uppercase">Linked</Badge>
                </div>
                <div className="grid grid-cols-1 gap-2 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                  {isLoadingTrends ? Array(4).fill(0).map((_, i) => <div key={i} className="h-10 bg-white/5 rounded-xl animate-pulse" />) : trends.map((t, i) => (
                    <Button key={i} variant="outline" onClick={() => setTargetKeyword(t)} className={`h-10 justify-start px-6 border-2 font-black text-[10px] md:text-xs uppercase italic rounded-xl transition-all ${targetKeyword === t ? 'bg-[#5845e0] border-white text-white' : 'border-white/5 bg-[#0a0b14] text-slate-400'}`}>{t}</Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2"><PencilLine size={14}/> Target Keyword</p>
                <Input value={targetKeyword} onChange={(e) => setTargetKeyword(e.target.value)} placeholder="aaa" className="h-16 bg-[#0a0b14] border-2 border-white/10 rounded-2xl px-6 font-bold text-white focus:border-[#5845e0]" />
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2"><Palette size={14}/> Design Style</p>
                <div className="grid grid-cols-2 gap-2">
                  {STYLES.map(s => (
                    <button key={s.id} onClick={() => setSelectedStyle(s)} className={`py-3 px-3 rounded-lg font-black text-[9px] transition-all border ${selectedStyle.id === s.id ? 'bg-[#5845e0] text-white border-white' : 'bg-white/5 text-slate-500 border-transparent'}`}>{s.label}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2"><Shirt size={14}/> Base Product</p>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map(c => (
                    <button key={c.id} onClick={() => setSelectedCategory(c)} className={`py-3 px-3 rounded-lg font-black text-[9px] transition-all border ${selectedCategory.id === c.id ? 'bg-[#5845e0] text-white border-white' : 'bg-white/5 text-slate-500 border-transparent'}`}>{c.label}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2"><Box size={14}/> Size Run (Default All ON)</p>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map(size => (
                    <button key={size} onClick={() => toggleSize(size)} className={`w-10 h-10 rounded-lg font-black text-[10px] transition-all border-2 ${selectedSizes.includes(size) ? 'bg-[#5845e0] border-white text-white' : 'border-white/5 bg-white/5 text-slate-600'}`}>{size}</button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* 🔴 中：ライブプレビュー */}
          <div className="lg:col-span-2">
            <Card className="bg-[#13141f] border-2 border-white/5 rounded-[3rem] p-10 md:p-12 shadow-2xl relative overflow-hidden h-full">
              <div className="grid md:grid-cols-2 gap-12 h-full">
                <div className="space-y-8 flex flex-col items-center">
                  <div className="w-full flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600/20 flex items-center justify-center border border-indigo-500/20"><Activity className="text-indigo-400" /></div>
                    <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter">Live Engine</h3>
                  </div>
                  
                  <div className="relative aspect-square w-full rounded-[2.5rem] overflow-hidden border-4 border-white/5 bg-[#0a0b14] shadow-inner mb-8">
                    {mockupImage ? <img src={mockupImage} key={mockupImage} className="w-full h-full object-cover animate-in fade-in duration-500" alt="Preview" /> : <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 opacity-20"><Eye size={64} /><p className="text-sm font-black uppercase tracking-widest">Awaiting Parameters...</p></div>}
                    {isGenerating && <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center"><Loader2 className="animate-spin text-indigo-500" size={48} /></div>}
                  </div>

                  <Button onClick={generateConcept} disabled={!targetKeyword || isGenerating} className="w-full h-24 bg-white text-black hover:bg-indigo-600 hover:text-white font-black text-4xl rounded-3xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4 group">
                    <Wand2 size={40} className="group-hover:rotate-12 transition-transform" />
                    <span>全自動設計を執行</span>
                  </Button>
                </div>

                {/* 🔴 右：設計図出力 */}
                <div className="flex-1 bg-[#0a0b14] rounded-[2.5rem] p-8 border border-white/5 shadow-inner flex flex-col relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4 text-slate-500 font-black italic uppercase text-[10px] tracking-widest">
                    {`>_ SHOPIFY ARCHITECTURE OUTPUT`}
                  </div>
                  <textarea 
                    value={conceptResult} 
                    readOnly 
                    className="flex-1 bg-transparent text-xl md:text-3xl text-emerald-400 font-mono italic outline-none resize-none leading-relaxed custom-scrollbar" 
                    placeholder="Ready for generation..." 
                  />
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
