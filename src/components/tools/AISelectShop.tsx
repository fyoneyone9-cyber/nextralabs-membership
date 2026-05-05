'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  ShoppingBag, Store, Printer, Globe, Settings, TrendingUp, Sparkles, Activity, Loader2, Palette, Box, Terminal, Eye, ExternalLink, RefreshCw, ClipboardPaste, ArrowRight, X, ChevronDown, ChevronUp
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const TABS = [
  { id: 'concept', label: '① 究極設計', icon: ShoppingBag },
  { id: 'printful', label: '② 製造同期', icon: Printer },
  { id: 'shopify', label: '③ 世界公開', icon: Globe },
  { id: 'settings', label: '④ システム設定', icon: Settings },
];

const CATEGORIES = ['T-Shirts', 'Hoodies', 'Sweatshirts', 'Caps', 'Mugs', 'Posters', 'Canvas', 'Stickers'];
const STYLES = [
  { id: 'wafu', label: '和風・浮世絵', kw: 'ukiyo-e,japanese' },
  { id: 'cyber', label: 'サイバーパンク', kw: 'cyberpunk,neon' },
  { id: 'mini', label: 'ミニマリズム', kw: 'minimalist,clean' },
  { id: 'street', label: 'ストリート', kw: 'streetwear,graffiti' },
  { id: 'vintage', label: 'ビンテージ', kw: 'vintage,retro' },
  { id: 'water', label: '水彩画風', kw: 'watercolor' },
  { id: '3d', label: '3Dレンダリング', kw: '3d-render,octane' },
  { id: 'oil', label: '油絵風', kw: 'oil-painting' },
  { id: 'pixel', label: 'ピクセルアート', kw: 'pixel-art' }
];
const SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL'];

const GOOGLE_CLIENT_ID = '239583936801-ev71grs66ehp0kn3kahr2bdrl0v9iidj.apps.googleusercontent.com'
const GOOGLE_SCOPES = 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.modify'

export default function AISelectShop() {
  const [activeTab, setActiveTab] = useState('concept');
  const [trends, setTrends] = useState<string[]>([]);
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);
  const [apiStatus, setApiStatus] = useState<'loading' | 'live' | 'local'>('loading');
  const [selectedTrend, setSelectedTrend] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(SIZES);
  const [conceptResult, setConceptResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [mockupImage, setMockupImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [googleToken, setGoogleToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // 自画面（AI Select Shop）のリダイレクトURIを優先。
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const token = hashParams.get('access_token');
    
    if (token) { 
      setGoogleToken(token); 
      localStorage.setItem('nextra_google_token', token);
      window.history.replaceState(null, '', window.location.pathname); 
    } else {
      const savedToken = localStorage.getItem('nextra_google_token');
      if (savedToken) setGoogleToken(savedToken);
    }
    fetchTrends();
  }, []);

  useEffect(() => {
    if (googleToken) fetchTrends();
  }, [googleToken]);

  const handleGoogleAuth = useCallback(() => {
    // 憲法：迷走を断ち、この画面（AI Select Shop）で完結させる
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: 'https://membership-site-nextralabos.vercel.app/products/ai-select-shop/app',
      response_type: 'token',
      scope: GOOGLE_SCOPES,
      prompt: 'consent',
    })
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`
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
    } catch (e) {
      setApiStatus('local');
      setTrends(["トレンド取得失敗"]);
    } finally {
      setIsLoadingTrends(false);
    }
  };

  const generateConcept = async () => {
    if (!selectedTrend) return;
    setIsGenerating(true);
    setConceptResult('');
    setMockupImage(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const uniqueSeed = `${selectedTrend}-${selectedStyle.id}-${new Date().getTime()}`;
      setConceptResult(`【SHOP IDENTITY】: ${selectedTrend.toUpperCase()}\n【STYLE】: ${selectedStyle.label}\n【CAT】: ${selectedCategory}\n【SIZE】: ${selectedSizes.join(', ')}\n\n【ENGINE】: NEXTRA_MASTER_V8\n\n「${selectedTrend}」を${selectedStyle.label}スタイルで具現化しました。`);
      setMockupImage(`https://loremflickr.com/800/800/${selectedCategory.toLowerCase()},${selectedStyle.kw}?lock=${encodeURIComponent(uniqueSeed)}`);
    } finally { setIsGenerating(false); }
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-slate-950 text-left">
      <div className="text-center space-y-3 mb-16">
        <h1 className="text-6xl md:text-[8rem] font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">AI SELECT SHOP</h1>
        <Badge className="bg-[#5845e0] text-white font-black italic tracking-[0.3em] px-8 py-2 text-[10px] uppercase rounded-full shadow-2xl">Master Command OS v8.0</Badge>
      </div>

      <div className="flex gap-1 bg-[#1a1b26]/80 p-1 rounded-2xl border border-white/5 mb-12 shadow-2xl overflow-x-auto scrollbar-hide">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-5 px-6 rounded-xl font-black text-xs md:text-sm uppercase italic transition-all flex items-center justify-center gap-3 whitespace-nowrap ${activeTab === tab.id ? 'bg-[#5845e0] text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}>
            <tab.icon size={18} /> <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {!googleToken ? (
        <Card className="bg-[#13141f] border-2 border-white/5 rounded-[3rem] p-12 md:p-24 text-center space-y-10 shadow-2xl relative overflow-hidden animate-in zoom-in-95">
           <div className="absolute top-0 left-0 w-full h-1 bg-[#5845e0]" />
           <div className="w-32 h-32 bg-[#5845e0]/10 rounded-[2.5rem] flex items-center justify-center mx-auto border-2 border-[#5845e0]/30 shadow-[0_0_50px_rgba(88,69,224,0.2)]">
              <TrendingUp className="w-16 h-16 text-[#5845e0] animate-pulse" />
           </div>
           <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter">Initialize Connection</h2>
              <p className="text-slate-500 font-bold text-lg max-w-xl mx-auto leading-relaxed italic">Google Trends APIと直接連携します。セキュアな接続を確立してください。</p>
           </div>
           <Button onClick={handleGoogleAuth} className="h-24 bg-white text-black hover:bg-[#5845e0] hover:text-white font-black px-16 rounded-[2rem] text-3xl uppercase italic shadow-2xl transition-all">
              Login to Google Trends ↗
           </Button>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in duration-700">
          {/* LEFT: TREND & STYLE */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-8 shadow-2xl space-y-8 h-full">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-red-500 font-black italic text-xs uppercase tracking-widest"><TrendingUp size={16} /> Google Trends</div>
                  <Badge variant="outline" className={`text-[9px] font-black border-white/10 text-white`}>API: {apiStatus.toUpperCase()}</Badge>
                </div>
                <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {isLoadingTrends ? Array(4).fill(0).map((_, i) => <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />) : trends.map((t, i) => (
                    <Button key={i} variant="outline" onClick={() => setSelectedTrend(t)} className={`h-12 justify-start px-6 border-2 font-black text-[10px] md:text-xs uppercase italic rounded-xl transition-all ${selectedTrend === t ? 'bg-[#5845e0] border-white text-white shadow-lg scale-95' : 'border-white/5 bg-[#0a0b14] text-slate-400'}`}>{t}</Button>
                  ))}
                </div>
              </div>
              <div className="space-y-4 pt-4 border-t border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 flex items-center gap-2"><Palette size={14}/> Design Style</p>
                <div className="grid grid-cols-2 gap-2">
                  {STYLES.map(s => (
                    <button key={s.id} onClick={() => setSelectedStyle(s)} className={`py-3 px-3 rounded-lg font-black text-[9px] transition-all border ${selectedStyle.id === s.id ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-white/5 text-slate-500 border-transparent'}`}>{s.label}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-4 pt-4 border-t border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 flex items-center gap-2"><Box size={14}/> Size Run</p>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map(size => (
                    <button key={size} onClick={() => toggleSize(size)} className={`w-10 h-10 rounded-lg font-black text-[10px] transition-all border-2 ${selectedSizes.includes(size) ? 'bg-[#5845e0] border-white text-white' : 'border-white/5 bg-white/5 text-slate-600'}`}>{size}</button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* CENTER & RIGHT: PREVIEW & OUTPUT */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-[#13141f] border-2 border-white/5 rounded-[3rem] p-10 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-8 flex flex-col">
                  <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-indigo-600/20 flex items-center justify-center border border-indigo-500/20"><Activity className="text-indigo-400" /></div><h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Live Engine</h3></div>
                  <div className="relative aspect-square rounded-[2rem] overflow-hidden border-4 border-white/5 bg-[#0a0b14] shadow-inner">
                    {mockupImage ? <img src={mockupImage} className="w-full h-full object-cover animate-in fade-in duration-1000" alt="Preview" /> : <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 opacity-20"><Eye size={64} /><p className="text-sm font-black uppercase tracking-widest">Awaiting Parameters...</p></div>}
                    {isGenerating && <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center"><Loader2 className="animate-spin text-indigo-500" size={48} /></div>}
                  </div>
                  <Button onClick={generateConcept} disabled={!selectedTrend || isGenerating} className="w-full h-24 bg-white text-black hover:bg-indigo-600 hover:text-white font-black text-3xl rounded-3xl shadow-2xl mt-auto transition-all active:scale-95 flex items-center justify-center gap-4">
                    {isGenerating ? 'ANALYZING...' : <><Sparkles /> <span>全自動設計を執行</span></>}
                  </Button>
                </div>
                <div className="flex-1 bg-[#0a0b14] rounded-[2.5rem] p-8 border border-white/5 shadow-inner flex flex-col">
                  <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4 text-slate-500 font-black italic uppercase text-xs tracking-widest"><Terminal size={16} /> Architecture Output</div>
                  <textarea value={conceptResult} readOnly className="flex-1 bg-transparent text-lg md:text-2xl text-emerald-400 font-mono italic outline-none resize-none leading-relaxed min-h-[300px]" placeholder="Ready for generation..." />
                  {conceptResult && <Button onClick={() => { navigator.clipboard.writeText(conceptResult); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="mt-4 h-12 bg-white/5 text-[10px] font-black italic border border-white/10 rounded-xl">{copied ? 'COPIED!' : 'COPY LOG'}</Button>}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
      <DebugPanel data={{ selectedTrend, trends }} toolId="ai-select-shop" />
    </div>
  )
}
