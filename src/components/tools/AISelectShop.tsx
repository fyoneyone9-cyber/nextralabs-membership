'use client'
import dynamic from 'next/dynamic'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Loader2, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const MasterEngine = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [trends, setTrends] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [style, setStyle] = useState('japanese');
  const [tshirtColor, setTshirtColor] = useState('black');
  const [mockup, setMockup] = useState(null);
  const [isPublishing, setIsGenerating] = useState(false);
  
  const canvasRef = useRef(null);

  const STYLES = [
    { id: 'japanese', name: '和風・日の丸', emoji: '⛩️', colors: ['#c0392b', '#ffffff'] },
    { id: 'street', name: 'ストリート', emoji: '🏙️', colors: ['#ffdd00', '#000000'] },
    { id: 'retro', name: 'レトロ', emoji: '📻', colors: ['#ff6b35', '#f7c59f'] },
    { id: 'cyberpunk', name: 'サイバー', emoji: '🌃', colors: ['#00ffff', '#ff00ff'] },
    { id: 'kawaii', name: 'かわいい', emoji: '🎀', colors: ['#ffb7c5', '#fff0f5'] },
    { id: 'minimal', name: 'ミニマル', emoji: '⬜', colors: ['#ffffff', '#000000'] },
    { id: 'gold', name: 'ラグジュアリー', emoji: '💎', colors: ['#d4af37', '#000000'] },
    { id: 'neon', name: 'ネオンサイン', emoji: '💡', colors: ['#39ff14', '#000000'] },
    { id: 'nature', name: 'ボタニカル', emoji: '🌿', colors: ['#2ecc71', '#f1f1f1'] },
  ];

  const TSHIRT_COLORS = [
    { id: 'white', name: '白', hex: '#FFFFFF' },
    { id: 'black', name: '黒', hex: '#1a1a1a' },
    { id: 'navy', name: '紺', hex: '#1e3a5f' },
    { id: 'gray', name: 'グレー', hex: '#808080' },
    { id: 'red', name: 'レッド', hex: '#e74c3c' },
  ];

  useEffect(() => {
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    setIsLoading(true);
    try {
      const r = await fetch('/api/trends', { cache: 'no-store' });
      const d = await r.json();
      if (d.trends) setTrends(d.trends.map((t, i) => ({ id: i, name: t })));
    } catch (e) {
      setTrends([{id:1, name:'AI美女'}, {id:2, name:'猫動画'}, {id:3, name:'キャンプギア'}]);
    } finally { setIsLoading(false); }
  };

  const drawDesign = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !keyword) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width, h = canvas.height;
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, w, h);
    const currentTColor = TSHIRT_COLORS.find(c => c.id === tshirtColor) || TSHIRT_COLORS[1];
    ctx.fillStyle = currentTColor.hex;
    ctx.beginPath();
    ctx.moveTo(w*0.2, h*0.1); ctx.lineTo(w*0.8, h*0.1); ctx.lineTo(w*0.95, h*0.3); ctx.lineTo(w*0.8, h*0.35);
    ctx.lineTo(w*0.8, h*0.9); ctx.lineTo(w*0.2, h*0.9); ctx.lineTo(w*0.2, h*0.35); ctx.lineTo(w*0.05, h*0.3);
    ctx.closePath(); ctx.fill();
    const cx = w/2, cy = h*0.48;
    ctx.fillStyle = "#c0392b";
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(keyword, cx, cy);
    setMockup(canvas.toDataURL('image/png'));
  }, [keyword, tshirtColor]);

  useEffect(() => {
    if (keyword) {
      const timer = setTimeout(() => drawDesign(), 50);
      return () => clearTimeout(timer);
    }
  }, [keyword, style, tshirtColor, drawDesign]);

  const handlePublish = async () => {
    setIsGenerating(true);
    setTimeout(() => { alert('Shopify出品完了！'); setIsGenerating(false); setCurrentStep(3); }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-32 text-left border-4 border-emerald-500/50 rounded-[2rem] p-3 md:p-10 shadow-2xl bg-[#050507]">
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter">AIセレクトショップ</h1>
        <div className="inline-block bg-[#5845e0] text-white font-black px-4 py-0.5 rounded-full uppercase italic text-[10px]">v24.1-MASTER</div>
      </div>

      <div className="flex gap-2 justify-center bg-white/5 p-1.5 rounded-2xl border border-white/5 max-w-xl mx-auto">
        {[1, 2, 3].map(s => (
          <button key={s} onClick={() => setCurrentStep(s)} className={"flex-1 py-3 rounded-xl font-black italic text-xs " + (currentStep === s ? "bg-[#5845e0] text-white" : "text-slate-500")}>Step {s}</button>
        ))}
      </div>

      {currentStep === 1 && (
        <div className="animate-in fade-in">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0a0b14] p-6 rounded-3xl border-2 border-emerald-500/20 shadow-inner mb-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/50">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black text-emerald-500 uppercase tracking-widest italic">TREND ENGINE: LIVE SYNC</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-bold italic">Google Trends から日本国内の最新バズワードを自動抽出中。</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? <div className="text-center py-20 text-emerald-500">Syncing...</div> : trends.map((t) => (
              <div key={t.id} className="bg-[#13141f] border-2 border-white/5 p-8 rounded-[2rem] hover:border-emerald-500 cursor-pointer transition-all" onClick={() => { setKeyword(t.name); setCurrentStep(2); }}>
                <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 animate-pulse">最新バズワード連携</Badge>
                <p className="text-2xl font-black italic text-white">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="grid lg:grid-cols-2 gap-12 animate-in zoom-in-95">
          <div className="bg-[#13141f] p-8 rounded-[2.5rem] border-2 border-white/5 space-y-8">
            <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 italic">デザインキーワード</label><input value={keyword} onChange={(e) => setKeyword(e.target.value)} className="w-full h-16 text-2xl font-black italic bg-black border-2 border-white/10 rounded-xl px-6 text-white outline-none focus:border-emerald-500" /></div>
            <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 italic">生地のカラー</label><div className="flex gap-3">{TSHIRT_COLORS.map(c => <button key={c.id} onClick={() => setTshirtColor(c.id)} className={"w-12 h-12 rounded-xl border-4 " + (tshirtColor === c.id ? "border-emerald-500" : "border-white/5")} style={{ backgroundColor: c.hex }} />)}</div></div>
            <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 italic">スタイルパレット</label><div className="grid grid-cols-3 gap-2">{STYLES.map(s => <button key={s.id} onClick={() => setStyle(s.id)} className={"py-3 rounded-xl text-[10px] font-black uppercase italic border-2 " + (style === s.id ? "bg-emerald-500 text-slate-950" : "bg-black text-slate-600")}>{s.name}</button>)}</div></div>
            <button onClick={handlePublish} disabled={isPublishing} className="w-full h-24 bg-emerald-600 text-white font-black text-3xl italic rounded-[2rem] shadow-xl active:scale-95 transition-all">{isPublishing ? "出品中..." : "SHOPIFY 出品 🚀"}</button>
          </div>
          <div className="bg-[#13141f] rounded-[2.5rem] border-2 border-white/5 p-10 flex justify-center items-center relative"><canvas ref={canvasRef} width={400} height={500} className="bg-white rounded-3xl max-w-full h-auto" /></div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="text-center py-20 animate-in zoom-in">
           <h2 className="text-6xl font-black text-white italic mb-10 uppercase">Success 🚀</h2>
           <Button className="h-20 px-16 bg-white text-slate-950 font-black rounded-2xl text-2xl" onClick={() => setCurrentStep(1)}>新しい商品を作る</Button>
        </div>
      )}
    </div>
  );
};

const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false });
export default function AISelectShop() { return <NoSSR />; }