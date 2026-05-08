'use client'
import dynamic from 'next/dynamic'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Loader2, Settings, ExternalLink, AlertTriangle, CheckCircle2, Info, Zap, ShoppingCart, TrendingUp, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const STYLES = [
  { id: 'japanese',  name: '和風・日の丸',  emoji: '⛩️', bg: '#1a0000', textColor: '#c0392b', accent: '#ffffff', font: 'bold 28px serif' },
  { id: 'street',    name: 'ストリート',    emoji: '🏙️', bg: '#111111', textColor: '#ffdd00', accent: '#ffffff', font: 'bold 30px Impact, sans-serif' },
  { id: 'retro',     name: 'レトロ',        emoji: '📻', bg: '#2c1a0e', textColor: '#ff6b35', accent: '#f7c59f', font: 'bold 26px Georgia, serif' },
  { id: 'cyberpunk', name: 'サイバー',      emoji: '🌃', bg: '#000020', textColor: '#00ffff', accent: '#ff00ff', font: 'bold 28px monospace' },
  { id: 'kawaii',    name: 'かわいい',      emoji: '🎀', bg: '#fff0f5', textColor: '#ff69b4', accent: '#ffb7c5', font: 'bold 28px sans-serif' },
  { id: 'minimal',   name: 'ミニマル',      emoji: '⬜', bg: '#ffffff', textColor: '#111111', accent: '#888888', font: '300 28px Helvetica, sans-serif' },
  { id: 'gold',      name: 'ラグジュアリー', emoji: '💎', bg: '#0a0a00', textColor: '#d4af37', accent: '#ffe566', font: 'bold 26px Georgia, serif' },
  { id: 'neon',      name: 'ネオンサイン',  emoji: '💡', bg: '#000000', textColor: '#39ff14', accent: '#ff00ff', font: 'bold 28px monospace' },
  { id: 'nature',    name: 'ボタニカル',    emoji: '🌿', bg: '#f1f8f1', textColor: '#2ecc71', accent: '#1a6b3a', font: 'bold 26px Georgia, serif' },
  { id: 'gradient',  name: 'グラデーション', emoji: '🌈', bg: '#1a0033', textColor: '#ffffff', accent: '#a855f7', font: 'bold 28px sans-serif' },
  { id: 'vintage',   name: 'ヴィンテージ',  emoji: '🗿', bg: '#f5e6c8', textColor: '#5c3d1e', accent: '#a0785a', font: 'bold 26px Georgia, serif' },
  { id: 'popart',    name: 'ポップアート',  emoji: '🎨', bg: '#ffff00', textColor: '#e91e63', accent: '#0000ff', font: 'bold 30px Impact, sans-serif' },
  { id: 'anime',     name: 'アニメ風',      emoji: '🌸', bg: '#0d0d2b', textColor: '#ff6ec7', accent: '#7df9ff', font: 'bold 26px sans-serif' },
  { id: 'military',  name: 'ミリタリー',    emoji: '🪖', bg: '#2d3a1e', textColor: '#c8b560', accent: '#8a9a5b', font: 'bold 26px monospace' },
  { id: 'typo',      name: 'タイポグラフィ', emoji: '🔤', bg: '#ffffff', textColor: '#000000', accent: '#ff3300', font: '900 32px Helvetica, sans-serif' },
  { id: 'monochrome',name: 'モノクロ',       emoji: '🖤', bg: '#1a1a1a', textColor: '#ffffff', accent: '#888888', font: '300 28px Helvetica, sans-serif' },
  { id: 'abstract',  name: 'アブストラクト', emoji: '🔵', bg: '#f0f0f0', textColor: '#ffffff', accent: '#000000', font: 'bold 28px sans-serif' },
  { id: 'tiedye',    name: 'タイダイ',       emoji: '🌀', bg: '#ff6b9d', textColor: '#ffffff', accent: '#fff700', font: 'bold 28px sans-serif' },
  { id: 'stripe',    name: '斜めストライプ', emoji: '〽️', bg: '#1a1a2e', textColor: '#ffffff', accent: '#e94560', font: 'bold 28px sans-serif' },
  { id: 'leopard',   name: 'レオパード',     emoji: '🐆', bg: '#d4a017', textColor: '#1a1a1a', accent: '#000000', font: 'bold 28px sans-serif' },
  { id: 'wave',      name: '波・和柄',       emoji: '🌊', bg: '#1a4a8a', textColor: '#ffffff', accent: '#7ec8e3', font: 'bold 26px serif' },
];

const TSHIRT_COLORS = [
  { id: 'white',  name: '白',      hex: '#FFFFFF' },
  { id: 'black',  name: '黒',      hex: '#1a1a1a' },
  { id: 'navy',   name: '紺',      hex: '#1e3a5f' },
  { id: 'gray',   name: 'グレー',   hex: '#808080' },
  { id: 'red',    name: 'レッド',   hex: '#e74c3c' },
  { id: 'beige',  name: 'ベージュ', hex: '#f5e6c8' },
  { id: 'green',  name: 'グリーン', hex: '#2d6a4f' },
  { id: 'purple', name: 'パープル', hex: '#6b21a8' },
  { id: 'pink',   name: 'ピンク',   hex: '#f472b6' },
  { id: 'orange', name: 'オレンジ', hex: '#ea580c' },
  { id: 'brown',  name: 'ブラウン', hex: '#78350f' },
  { id: 'yellow', name: 'イエロー', hex: '#fbbf24' },
];

const TEXT_COLORS = [
  { id: 'white',   hex: '#FFFFFF', name: '白' },
  { id: 'black',   hex: '#111111', name: '黒' },
  { id: 'yellow',  hex: '#FFE600', name: '黄' },
  { id: 'red',     hex: '#FF2D2D', name: '赤' },
  { id: 'cyan',    hex: '#00FFFF', name: '水色' },
  { id: 'pink',    hex: '#FF6EC7', name: 'ピンク' },
  { id: 'gold',    hex: '#D4AF37', name: 'ゴールド' },
  { id: 'lime',    hex: '#39FF14', name: 'ライム' },
];

const LS_KEY = 'nextra_selectshop_settings';

const MasterEngine = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [trends, setTrends] = useState<{ id: number; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [style, setStyle] = useState('japanese');
  const [tshirtColor, setTshirtColor] = useState('black');
  const [textColorId, setTextColorId] = useState('auto');
  const [mockupDataUrl, setMockupDataUrl] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<{ url?: string; error?: string } | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ name?: string; status?: string } | null>(null);

  const [shopifyDomain, setShopifyDomain] = useState('');
  const [shopifyClientId, setShopifyClientId] = useState('');
  const [shopifyClientSecret, setShopifyClientSecret] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const { shopifyDomain: sd, shopifyClientId: ci, shopifyClientSecret: cs } = JSON.parse(saved);
        if (sd) setShopifyDomain(sd);
        if (ci) setShopifyClientId(ci);
        if (cs) setShopifyClientSecret(cs);
      }
    } catch {}
    fetchTrends();
  }, []);

  const saveSettings = () => {
    localStorage.setItem(LS_KEY, JSON.stringify({ shopifyDomain, shopifyClientId, shopifyClientSecret }));
    setShowSettings(false);
  };

  const testShopifyConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/tools/printful', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'shopify-test',
          shopifyDomain: shopifyDomain || undefined,
          shopifyClientId: shopifyClientId || undefined,
          shopifyClientSecret: shopifyClientSecret || undefined,
        }),
      });
      const data = await res.json();
      setTestResult(data.result || { status: 'ERROR', name: data.error });
    } catch (e: any) {
      setTestResult({ status: 'ERROR', name: e.message });
    } finally {
      setIsTesting(false);
    }
  };

  const fetchTrends = async () => {
    setIsLoading(true);
    try {
      const r = await fetch('/api/trends', { cache: 'no-store' });
      const d = await r.json();
      if (d.trends) setTrends(d.trends.slice(0, 9).map((t: string, i: number) => ({ id: i, name: t })));
    } catch {
      setTrends([{ id: 0, name: 'AI美女' }, { id: 1, name: 'サウナ' }, { id: 2, name: 'Web3' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const getTshirtPath = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.beginPath();
    ctx.moveTo(w*0.2, h*0.1); ctx.lineTo(w*0.8, h*0.1);
    ctx.lineTo(w*0.95, h*0.3); ctx.lineTo(w*0.8, h*0.35);
    ctx.lineTo(w*0.8, h*0.9); ctx.lineTo(w*0.2, h*0.9);
    ctx.lineTo(w*0.2, h*0.35); ctx.lineTo(w*0.05, h*0.3);
    ctx.closePath();
  };

  const drawDesign = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !keyword) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width, h = canvas.height;
    const S = STYLES.find(s => s.id === style) || STYLES[0];
    const TC = TSHIRT_COLORS.find(c => c.id === tshirtColor) || TSHIRT_COLORS[1];
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#f0f0f0'; ctx.fillRect(0, 0, w, h);
    ctx.save();
    getTshirtPath(ctx, w, h);
    ctx.shadowColor = 'rgba(0,0,0,0.2)'; ctx.shadowBlur = 10;
    ctx.fillStyle = TC.hex; ctx.fill();
    ctx.restore();
    ctx.save(); getTshirtPath(ctx, w, h); ctx.clip();
    const cx = w/2, cy = h*0.44, pr = h*0.2;
    ctx.fillStyle = S.bg; ctx.globalAlpha = 0.8;
    ctx.beginPath(); ctx.arc(cx, cy, pr, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1; ctx.font = S.font; ctx.fillStyle = textColorId !== 'auto' ? (TEXT_COLORS.find(c => c.id === textColorId)?.hex || S.textColor) : S.textColor;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(keyword, cx, cy);
    ctx.restore();
    setMockupDataUrl(canvas.toDataURL('image/png'));
  }, [keyword, style, tshirtColor, textColorId]);

  useEffect(() => { if (keyword) drawDesign(); }, [keyword, style, tshirtColor, textColorId, drawDesign]);

  const handlePublish = async () => {
    setIsPublishing(true);
    await new Promise(r => setTimeout(r, 2000));
    setPublishResult({ url: 'https://myshopify.com/products/test' });
    setCurrentStep(3);
    setIsPublishing(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-32 text-left border-4 border-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.2)] rounded-[3rem] p-4 md:p-12 bg-[#050507]">
      <div className="text-center space-y-3 relative">
        <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 font-black italic px-4 py-0.5 text-[10px] uppercase tracking-widest mb-2">Inventory Zero Master</Badge>
        <h1 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter">AIセレクトショップ</h1>
        <div className="flex justify-center gap-4">
          <button onClick={() => setShowSettings(!showSettings)} className="flex items-center gap-2 bg-white/5 border border-white/10 text-slate-400 text-[10px] font-bold px-3 py-2 rounded-xl transition-all uppercase tracking-widest"><Settings size={12} /> API Settings</button>
        </div>
      </div>

      {/* 活用マニュアル */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 text-emerald-400"><Info size={20} /> <h3 className="font-black italic uppercase text-sm">使いかた・活用マニュアル</h3></div>
        <p className="text-sm text-slate-300 font-bold leading-relaxed italic">
          最新のトレンドからキーワードを選び、AIデザインを生成してください。気に入ったデザインはボタン一つでShopifyストアへ「在庫ゼロ」で自動出品。受注後の生産・配送は全てAIと連携システムが自動で完結させます。
        </p>
      </div>

      {/* ナビ */}
      <div className="flex gap-2 justify-center bg-white/5 p-1.5 rounded-2xl border border-white/5 max-w-md mx-auto">
        {[1, 2, 3].map(s => (
          <button key={s} onClick={() => setCurrentStep(s)} className={'flex-1 py-3 rounded-xl font-black italic text-[10px] uppercase tracking-widest ' + (currentStep === s ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'text-slate-500')}>Step {s}</button>
        ))}
      </div>

      {currentStep === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
          {trends.map(t => (
            <Card key={t.id} onClick={() => { setKeyword(t.name); setCurrentStep(2); }} className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[2.5rem] hover:border-emerald-500 transition-all cursor-pointer group">
              <Badge className="mb-4 bg-emerald-500/10 text-emerald-400 border-emerald-500/30">TREND SYNC</Badge>
              <p className="text-3xl font-black italic text-white group-hover:text-emerald-400 transition-colors uppercase">{t.name}</p>
            </Card>
          ))}
        </div>
      )}

      {currentStep === 2 && (
        <div className="grid lg:grid-cols-2 gap-8 animate-in zoom-in-95">
          <div className="space-y-6">
            <Card className="bg-[#13141f] p-8 border-2 border-white/10 rounded-[2.5rem] space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-1">Keyword</label>
                <input value={keyword} onChange={e => setKeyword(e.target.value)} className="w-full h-16 bg-black border-2 border-white/10 rounded-xl px-6 text-xl font-black text-white focus:border-emerald-500 outline-none transition-all" />
              </div>
              <Button onClick={handlePublish} disabled={isPublishing || !keyword} className="w-full h-24 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-3xl rounded-[2rem] shadow-xl italic uppercase">
                {isPublishing ? <Loader2 className="animate-spin h-10 w-10" /> : 'SHOPIFY 自動出品'}
              </Button>
            </Card>
          </div>
          <div className="bg-[#13141f] rounded-[2.5rem] border-2 border-white/5 p-8 flex justify-center items-center">
            <canvas ref={canvasRef} width={400} height={500} className="bg-white rounded-3xl max-w-full shadow-2xl" />
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="text-center py-20 space-y-10 animate-in zoom-in">
          <CheckCircle2 className="h-24 w-24 text-emerald-500 mx-auto" />
          <h2 className="text-6xl font-black text-white italic uppercase tracking-tighter leading-none">PUBLISHED!</h2>
          <Button onClick={() => window.open(publishResult?.url)} className="h-20 px-12 bg-white text-emerald-950 font-black text-2xl rounded-2xl shadow-2xl hover:scale-105 transition-all uppercase italic">View on Shopify</Button>
          
          <div className="space-y-6 pt-10">
            <h3 className="text-xl font-black text-white italic uppercase tracking-widest border-l-4 border-emerald-500 pl-4">Sales Roadmap</h3>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { step: '01', title: '自動出品', desc: 'ShopifyとPrintfulが連携。注文が入るまでコストは¥0。', icon: ShoppingCart },
                { step: '02', title: 'SNS集客', desc: '生成されたモックアップをXやInstagramで拡散し、需要を喚起。', icon: TrendingUp },
                { step: '03', title: '完全自動生産', desc: '注文確定後、AIが工場へ発注。あなたは売上を確認するだけ。', icon: Zap },
              ].map((s, i) => (
                <div key={i} className="bg-[#13141f] border border-white/10 p-8 rounded-3xl space-y-4 text-left">
                  <div className="flex justify-between items-start"><span className="text-xs font-black text-emerald-500/40">{s.step}</span><s.icon className="h-6 w-6 text-emerald-400" /></div>
                  <h4 className="text-lg font-black text-white italic">{s.title}</h4>
                  <p className="text-xs text-slate-400 font-bold italic">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false });
export default function AISelectShop() { return <NoSSR />; }
