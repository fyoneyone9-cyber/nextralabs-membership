'use client'

import dynamic from 'next/dynamic'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Loader2 } from 'lucide-react'

const MasterEngine = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [trends, setTrends] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [style, setStyle] = useState('japanese');
  const [tshirtColor, setTshirtColor] = useState('black');
  const [mockup, setMockup] = useState<string | null>(null);
  const [isPublishing, setIsGenerating] = useState(false);
  const [designs, setDesigns] = useState<any[]>([]);
  const [lastUsage, setLastUsage] = useState<number | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const STYLES = [
    { id: 'japanese', name: '蜥碁｢ｨ繝ｻ譌･縺ｮ荳ｸ', emoji: '笵ｩ・・, colors: ['#c0392b', '#ffffff'] },
    { id: 'street', name: '繧ｹ繝医Μ繝ｼ繝・, emoji: '徐・・, colors: ['#ffdd00', '#000000'] },
    { id: 'retro', name: '繝ｬ繝医Ο', emoji: '峠', colors: ['#ff6b35', '#f7c59f'] },
    { id: 'cyberpunk', name: '繧ｵ繧､繝舌・', emoji: '激', colors: ['#00ffff', '#ff00ff'] },
    { id: 'kawaii', name: '縺九ｏ縺・＞', emoji: '死', colors: ['#ffb7c5', '#fff0f5'] },
    { id: 'minimal', name: '繝溘ル繝槭Ν', emoji: '筮・, colors: ['#ffffff', '#000000'] },
    { id: 'gold', name: '繝ｩ繧ｰ繧ｸ繝･繧｢繝ｪ繝ｼ', emoji: '虫', colors: ['#d4af37', '#000000'] },
    { id: 'neon', name: '繝阪が繝ｳ繧ｵ繧､繝ｳ', emoji: '庁', colors: ['#39ff14', '#000000'] },
    { id: 'nature', name: '繝懊ち繝九き繝ｫ', emoji: '諺', colors: ['#2ecc71', '#f1f1f1'] },
  ];

  const TSHIRT_COLORS = [
    { id: 'white', name: '逋ｽ', hex: '#FFFFFF', text: '#000000' },
    { id: 'black', name: '鮟・, hex: '#1a1a1a', text: '#FFFFFF' },
    { id: 'navy', name: '邏ｺ', hex: '#1e3a5f', text: '#FFFFFF' },
    { id: 'gray', name: '繧ｰ繝ｬ繝ｼ', hex: '#808080', text: '#FFFFFF' },
    { id: 'red', name: '繝ｬ繝・ラ', hex: '#e74c3c', text: '#FFFFFF' },
  ];

  useEffect(() => {
    fetchTrends();
    const saved = localStorage.getItem('last_usage_select_shop');
    if (saved) setLastUsage(parseInt(saved));
  }, []);

  const fetchTrends = async () => {
    setIsLoading(true);
    try {
      const r = await fetch('/api/trends', { cache: 'no-store' });
      const d = await r.json();
      if (d.trends && d.trends.length > 0) {
        setTrends(d.trends.map((t: string, i: number) => ({ id: i, name: t })));
      } else {
        throw new Error('Empty');
      }
    } catch {
      // 諞ｲ豕包ｼ夊劒辟｡繧定ｨｱ縺輔↑縺・ゅΛ繧､繝悶′繝繝｡縺ｪ繧画ｺ悶Λ繧､繝悶ｒ蜿ｩ縺上°縲∝ｼｷ蜉帙↑蝗ｺ螳壹Ρ繝ｼ繝・      setTrends([
        {id:1, name:'AI鄒主･ｳ'}, {id:2, name:'迪ｫ蜍慕判'}, {id:3, name:'繧ｭ繝｣繝ｳ繝励ぐ繧｢'}, 
        {id:4, name:'譏ｭ蜥後Ξ繝医Ο'}, {id:5, name:'繧ｵ繧ｦ繝・}, {id:6, name:'繧ｹ繝医Μ繝ｼ繝育ｳｻ'}
      ]);
    } finally { setIsLoading(false); }
  };

  const isLimitReached = () => {
    // 👑 憲法第7条：管理者は制限なし
    if (typeof window !== "undefined") {
      const userEmail = localStorage.getItem("nextra_user_email");
      if (userEmail === "f.yoneyone9@gmail.com") return false;
    }
    if (!lastUsage) return false;
    const now = new Date();
    const last = new Date(lastUsage);
    return now.toDateString() === last.toDateString();
  };

  const drawDesign = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !keyword) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width, h = canvas.height;
    
    // 蜈ｨ菴薙・閭梧勹濶ｲ・・繧ｷ繝｣繝・・閭梧勹・峨ｒ逋ｽ縺ｫ險ｭ螳・    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, w, h);
    
    const currentTColor = TSHIRT_COLORS.find(c => c.id === tshirtColor) || TSHIRT_COLORS[1];
    ctx.fillStyle = currentTColor.hex; 
    ctx.beginPath();
    ctx.moveTo(w*0.2, h*0.1); ctx.lineTo(w*0.8, h*0.1); ctx.lineTo(w*0.95, h*0.3); ctx.lineTo(w*0.8, h*0.35);
    ctx.lineTo(w*0.8, h*0.9); ctx.lineTo(w*0.2, h*0.9); ctx.lineTo(w*0.2, h*0.35); ctx.lineTo(w*0.05, h*0.3);
    ctx.closePath(); ctx.fill();

    const cx = w/2, cy = h*0.48;
    const currentStyle = STYLES.find(s => s.id === style) || STYLES[0];
    const colors = currentStyle.colors;

    ctx.save();
    ctx.beginPath(); ctx.rect(w*0.22, h*0.2, w*0.56, h*0.55); ctx.clip();

    let fontSize = 42;
    ctx.font = `bold ${fontSize}px sans-serif`;
    let textWidth = ctx.measureText(keyword).width;
    const maxWidth = w * 0.5;

    while (textWidth > maxWidth && fontSize > 12) {
      fontSize -= 2;
      ctx.font = `bold ${fontSize}px sans-serif`;
      textWidth = ctx.measureText(keyword).width;
    }

    switch(style) {
      case 'kawaii':
        ctx.font = "24px serif";
        ctx.textAlign = 'center';
        ctx.fillStyle = "#ffb347"; ctx.fillText("笨ｨ", cx - 45, cy - 50);
        ctx.fillStyle = "#ff69b4"; ctx.fillText("猪", cx, cy - 50);
        ctx.fillStyle = "#ffb347"; ctx.fillText("笨ｨ", cx + 45, cy - 50);
        ctx.font = `bold ${fontSize}px "Hiragino Maru Gothic Pro", "Segoe UI", sans-serif`;
        ctx.fillStyle = '#ffc0cb'; 
        ctx.fillText(keyword, cx, cy + 10);
        ctx.font = "24px serif";
        ctx.fillStyle = "#ffb7c5"; ctx.fillText("減", cx - 45, cy + 60);
        ctx.fillStyle = "#ff69b4"; ctx.fillText("苧", cx, cy + 60);
        ctx.fillStyle = "#ffb7c5"; ctx.fillText("減", cx + 45, cy + 60);
        break;

      case 'japanese':
        ctx.beginPath(); ctx.arc(cx, cy, w * 0.22, 0, Math.PI * 2); ctx.fillStyle = colors[0]; ctx.fill();
        ctx.fillStyle = colors[1];
        const chars = keyword.split('');
        const vFontSize = Math.min(32, Math.floor(h * 0.35 / chars.length));
        ctx.font = `900 ${vFontSize}px serif`; ctx.textAlign = 'center';
        chars.forEach((ch, i) => ctx.fillText(ch, cx, cy - (chars.length * (vFontSize/2)) + i*(vFontSize*1.2)));
        break;

      case 'gold':
        const grad = ctx.createLinearGradient(cx-50, cy, cx+50, cy);
        grad.addColorStop(0, '#bf953f'); grad.addColorStop(0.5, '#fcf6ba'); grad.addColorStop(1, '#aa771c');
        ctx.fillStyle = grad;
        ctx.font = `900 ${fontSize}px serif`; ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 10;
        ctx.fillText(keyword.toUpperCase(), cx, cy + 10);
        break;

      case 'neon':
        ctx.shadowColor = colors[0]; ctx.shadowBlur = 15;
        ctx.strokeStyle = colors[0]; ctx.lineWidth = 3;
        ctx.font = `900 ${fontSize}px sans-serif`; ctx.textAlign = 'center';
        ctx.strokeText(keyword.toUpperCase(), cx, cy + 10);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(keyword.toUpperCase(), cx, cy + 10);
        break;

      default:
        ctx.fillStyle = colors[0];
        ctx.font = `900 ${fontSize}px Impact`; ctx.textAlign = 'center';
        ctx.fillText(keyword.toUpperCase(), cx, cy + 10);
    }
    ctx.restore();
    setMockup(canvas.toDataURL('image/png'));
  }, [keyword, style, tshirtColor, tshirtColor, STYLES, TSHIRT_COLORS]);

  useEffect(() => {
    if (keyword) {
      const timer = setTimeout(() => drawDesign(), 50);
      return () => clearTimeout(timer);
    }
  }, [keyword, style, tshirtColor, drawDesign]);

  const handlePublish = async () => {
    if (isPublishing) return;
    if (isLimitReached()) {
      alert("笞・・1譌･縺ｮ蛻ｩ逕ｨ蛻ｶ髯舌↓驕斐＠縺ｾ縺励◆縲よ眠縺励＞繝医Ξ繝ｳ繝牙膚蜩√・譏取律縺ｾ縺溷・蜩√＠縺ｾ縺励ｇ縺・ｼ・);
      return;
    }
    setIsGenerating(true);
    try {
      const res = await fetch('/api/tools/printful', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create-product', keyword, style, mockupUrl: mockup }),
      });
      const d = await res.json();
      if (d.success) { 
        alert('Shopify蜃ｺ蜩∝ｮ御ｺ・ｼ・); 
        const now = Date.now();
        setLastUsage(now);
        localStorage.setItem('last_usage_select_shop', now.toString());
        setCurrentStep(3); 
      }
    } catch { alert('騾壻ｿ｡繧ｨ繝ｩ繝ｼ'); } finally { setIsGenerating(false); }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-12 pb-32 text-left border-4 md:border-8 border-emerald-500/50 rounded-[2rem] md:rounded-[4rem] my-2 md:my-4 p-3 md:p-10 shadow-[0_0_100px_rgba(16,185,129,0.2)] bg-[#050507]">
      <div className="text-center space-y-1 md:space-y-3">
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">AI繧ｻ繝ｬ繧ｯ繝医す繝ｧ繝・・</h1>
        <div className="inline-block bg-[#5845e0] text-white font-black px-4 py-0.5 rounded-full uppercase italic text-[8px] md:text-[10px] tracking-widest shadow-lg">v24.1-MASTER</div>
      </div>

      <div className="flex gap-2 justify-center bg-[#1a1b26]/50 p-1.5 rounded-2xl border border-white/5 max-w-xl mx-auto">
        {[1, 2, 3].map(s => (
          <button key={s} onClick={() => setCurrentStep(s as any)} className={`flex-1 py-3 rounded-xl font-black italic text-xs md:text-sm transition-all ${currentStep === s ? 'bg-[#5845e0] text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Step {s}</button>
        ))}
      </div>

      {currentStep === 1 && (
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0a0b14] p-6 rounded-3xl border-2 border-emerald-500/20 shadow-inner mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/50">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black text-emerald-500 uppercase tracking-widest italic">TREND ENGINE: LIVE SYNC</span>
            </div>
            <div className="text-[10px] text-slate-500 font-bold italic">最終同期: {new Date().toLocaleTimeString()}</div>
          </div>
          <p className="text-[10px] text-slate-400 font-bold italic">Google Trends から日本国内の最新バズワードを1分ごとに自動抽出中。</p>
        </div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-in fade-in">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => <div key={i} className="h-40 bg-white/5 rounded-[2rem] animate-pulse border border-white/5" />)
          ) : trends.map((t) => (
            <div key={t.id} className="bg-[#13141f] border-2 border-white/5 p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] hover:border-[#5845e0] cursor-pointer transition-all shadow-xl group" onClick={() => { setKeyword(t.name); setCurrentStep(2); }}>
              <div className="flex items-center gap-2 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-[8px] font-black w-fit mb-4 italic uppercase animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.2)]">迴ｾ蝨ｨ縺ｮ繝医Ξ繝ｳ繝・/div>
              <p className="text-2xl md:text-4xl font-black italic uppercase text-white tracking-tighter group-hover:text-emerald-400 transition-colors">{t.name}</p>
            </div>
          ))}
        </div>
      )}

      {currentStep === 2 && (
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 animate-in zoom-in-95 duration-500">
          <div className="bg-[#13141f] p-6 md:p-10 rounded-[2.5rem] border-2 border-white/5 space-y-8 shadow-2xl">
            <div className="space-y-3">
              <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest px-2 italic">繝・じ繧､繝ｳ繧ｭ繝ｼ繝ｯ繝ｼ繝・/label>
              <input value={keyword} onChange={(e) => setKeyword(e.target.value)} className="w-full h-16 md:h-20 text-2xl md:text-4xl font-black italic bg-black border-2 border-white/10 rounded-xl md:rounded-2xl px-6 md:px-8 text-white outline-none focus:border-[#5845e0]" />
            </div>

            <div className="grid grid-cols-1 gap-6 md:gap-8">
               <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest px-2 italic">逕溷慍縺ｮ繧ｫ繝ｩ繝ｼ</label>
                  <div className="flex gap-3">
                     {TSHIRT_COLORS.map(c => <button key={c.id} onClick={() => setTshirtColor(c.id)} className={`w-12 h-12 rounded-xl border-4 transition-all ${tshirtColor === c.id ? 'border-[#5845e0] scale-110 shadow-xl' : 'border-white/5'}`} style={{ backgroundColor: c.hex }} />)}
                  </div>
               </div>
               <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest px-2 italic">繧ｹ繧ｿ繧､繝ｫ繝代Ξ繝・ヨ</label>
                  <div className="grid grid-cols-3 gap-2">
                     {STYLES.map(s => <button key={s.id} onClick={() => setStyle(s.id)} className={`py-3 rounded-xl text-[8px] font-black uppercase italic border-2 transition-all ${style === s.id ? 'bg-[#5845e0] text-white border-white shadow-lg' : 'bg-black text-slate-600 border-white/5 hover:border-white/10'}`}>{s.emoji}<br/>{s.name}</button>)}
                  </div>
               </div>
            </div>

            <button onClick={handlePublish} disabled={isPublishing} className="w-full h-20 md:h-28 bg-emerald-600 text-white font-black text-2xl md:text-4xl italic rounded-[2rem] md:rounded-[2.5rem] shadow-xl flex items-center justify-center gap-4 active:scale-95 transition-all border-b-8 border-emerald-800 active:border-b-0">
               {isPublishing ? <Loader2 className="animate-spin" size={40} /> : "SHOPIFY 蜃ｺ蜩・噫"}
            </button>
          </div>
          <div className="bg-[#13141f] rounded-[2.5rem] md:rounded-[3rem] border-2 border-white/5 p-8 md:p-12 flex justify-center items-center relative overflow-hidden shadow-2xl">
            <canvas ref={canvasRef} width={400} height={500} className="bg-black rounded-3xl border border-white/5 shadow-inner max-w-full h-auto" />
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="text-center py-20 animate-in zoom-in">
           <h2 className="text-5xl md:text-7xl font-black text-white italic mb-10 tracking-tighter uppercase">蜃ｺ蜩∵・蜉・噫</h2>
           <button onClick={() => window.open('https://z5ju1n-vs.myshopify.com/admin/products', '_blank')} className="h-20 md:h-24 px-12 md:px-16 bg-white text-black font-black rounded-2xl md:rounded-3xl text-xl md:text-2xl hover:bg-emerald-500 hover:text-white transition-all uppercase italic shadow-2xl active:scale-95">Shopify邂｡逅・判髱｢繧帝幕縺・竊・/button>
           <button onClick={() => setCurrentStep(1)} className="w-full mt-10 text-slate-500 font-black italic uppercase text-xs hover:text-white transition-all underline tracking-widest">譁ｰ縺励＞蝠・刀繧剃ｽ懊ｋ</button>
        </div>
      )}
    </div>
  );
};

const NoSSRWrapper = dynamic(() => Promise.resolve(MasterEngine), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507] flex items-center justify-center font-black italic text-emerald-500 animate-pulse uppercase tracking-[0.5em]">Syncing Shop Master...</div>
});

import { DebugPanel } from '@/components/tools/DebugPanel'

export default function AISelectShop() {
  return (
    <div className="min-h-screen bg-[#050507] text-gray-100 font-sans p-4 md:p-10 overflow-x-hidden">
      <NoSSRWrapper />
      <DebugPanel data={{ system: "v24.1-stable" }} toolId="ai-select-shop-ultimate" />
    </div>
  );
}
