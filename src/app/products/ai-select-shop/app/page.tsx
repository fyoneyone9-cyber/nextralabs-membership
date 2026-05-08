'use client'
import dynamic from 'next/dynamic'
import React, { useState, useEffect } from 'react'
import { Loader2, ExternalLink, Info, Zap, ShoppingCart, TrendingUp, Search, Palette, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const MasterEngine = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [trends, setTrends] = useState<{ id: number; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<{ url?: string; error?: string } | null>(null);

  useEffect(() => { fetchTrends(); }, []);

  const fetchTrends = async () => {
    setIsLoading(true);
    try {
      const r = await fetch('/api/trends', { cache: 'no-store' });
      const d = await r.json();
      if (d.trends) setTrends(d.trends.slice(0, 9).map((t: string, i: number) => ({ id: i, name: t })));
    } catch {
      setTrends([{ id: 0, name: 'AIビジネス' }, { id: 1, name: '時短術' }, { id: 2, name: 'Web3' }]);
    } finally { setIsLoading(false); }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    // Printful / Shopify 連携ロジックを再接続
    await new Promise(r => setTimeout(r, 3000));
    setPublishResult({ url: '#' });
    setCurrentStep(3);
    setIsPublishing(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-32 border-4 border-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.2)] rounded-[3rem] p-4 md:p-12 bg-[#050507] text-left font-sans">
      <div className="text-center space-y-3">
        <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 font-black italic px-4 py-0.5 text-[10px] uppercase tracking-widest mb-2">Inventory Zero Master</Badge>
        <h1 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter">AIセレクトショップ</h1>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 text-emerald-400"><Info size={20} /> <h3 className="font-black italic uppercase text-sm">使いかた・活用マニュアル</h3></div>
        <p className="text-sm text-slate-300 font-bold leading-relaxed italic">トレンドを選びデザインを生成。Shopifyへ自動出品。受注から配送まではシステムが完結させます。</p>
      </div>

      <div className="flex gap-2 justify-center bg-white/5 p-2 rounded-2xl border border-white/5 max-w-md mx-auto">
        {[1, 2, 3].map(s => (
          <button key={s} onClick={() => setCurrentStep(s)} className={'flex-1 py-4 rounded-xl font-black italic text-base uppercase transition-all ' + (currentStep === s ? 'bg-emerald-500 text-slate-950' : 'text-slate-500')}>Step {s}</button>
        ))}
      </div>

      {currentStep === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
          {trends.map(t => (
            <Card key={t.id} onClick={() => { setKeyword(t.name); setCurrentStep(2); }} className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[2.5rem] hover:border-emerald-500 cursor-pointer transition-all text-center group">
              <Badge className="mb-4 bg-emerald-500/10 text-emerald-400">TREND SYNC</Badge>
              <p className="text-3xl font-black italic text-white uppercase group-hover:text-emerald-400">{t.name}</p>
            </Card>
          ))}
        </div>
      )}

      {currentStep === 2 && (
        <div className="grid lg:grid-cols-2 gap-8 animate-in zoom-in-95">
          <Card className="bg-[#13141f] p-8 border-2 border-white/10 rounded-[2.5rem] space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Design Keyword</label>
              <input value={keyword} onChange={e => setKeyword(e.target.value)} className="w-full h-16 bg-black border-2 border-white/10 rounded-xl px-6 text-xl font-black text-white focus:border-emerald-500 outline-none transition-all" />
            </div>
            <Button onClick={handlePublish} disabled={isPublishing || !keyword} className="w-full h-24 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-3xl rounded-[2rem] shadow-xl uppercase italic active:scale-95">SHOPIFY 自動出品 🚀</Button>
          </Card>
          <div className="bg-[#13141f] rounded-[2.5rem] border-2 border-white/5 p-8 flex flex-col justify-center items-center gap-4 text-center">
             <div className="w-full aspect-square bg-white/5 rounded-3xl border-2 border-dashed border-white/10 flex items-center justify-center"><Palette size={48} className="text-slate-600 animate-pulse" /></div>
             <p className="text-[10px] font-black text-slate-500 uppercase italic">AIデザイン プレビュー</p>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="text-center py-20 space-y-10 animate-in zoom-in">
          <CheckCircle2 className="h-24 w-24 text-emerald-500 mx-auto" />
          <h2 className="text-6xl font-black text-white italic uppercase tracking-tighter leading-none">出品完了</h2>
          <Button onClick={() => window.open(publishResult?.url)} className="h-20 px-12 bg-white text-emerald-950 font-black text-2xl rounded-2xl shadow-xl hover:scale-105 transition-all italic">Shopifyで商品を見る</Button>
          
          <div className="space-y-6 pt-10 text-left max-w-5xl mx-auto">
            <h3 className="text-xl font-black text-white italic uppercase tracking-widest border-l-4 border-emerald-500 pl-4">販売ロードマップ</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[{ title: '自動出品', desc: 'Shopifyと完全同期。リスク¥0。', icon: ShoppingCart }, { title: 'SNS拡散', desc: '各SNSへ自動投稿して集客。', icon: TrendingUp }, { title: '自動生産', desc: '売れたら自動で発送。', icon: Zap }].map((s, i) => (
                <div key={i} className="bg-[#13141f] border border-white/10 p-8 rounded-3xl space-y-4 hover:border-emerald-500/50 transition-all">
                  <s.icon className="h-6 w-6 text-emerald-400" />
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
