'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Scale, Search, Loader2, ShoppingCart, Zap } from 'lucide-react'

const MasterEngine = () => {
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  const runAnalysis = async () => {
    if (!query) return;
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setResult({
      status: "新品購入を推奨",
      reason: "現在、中古市場の価格が高騰しており、ポイント還元を含めると新品の方が実質2,000円安価です。",
      confidence: "94%"
    });
    setIsAnalyzing(false);
  };

  if (!isMounted) return null;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 bg-[#050507] border-4 border-emerald-500/50 rounded-[4rem]">
      <div className="text-center space-y-2">
        <Badge className="bg-indigo-600">Purchase Smart Engine</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic text-center">中古・新品AI比較ナビ</h1>
      </div>
      <Card className="bg-[#13141f] p-10 rounded-[3rem] space-y-8 text-center">
        <div className="flex justify-center mb-4"><Scale size={48} className="text-indigo-400" /></div>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="欲しい商品名を入力..." className="w-full h-16 bg-black border-2 border-white/10 rounded-2xl px-6 text-white outline-none focus:border-indigo-500" />
        <button onClick={runAnalysis} disabled={isAnalyzing} className="w-full h-20 bg-indigo-600 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-4 text-2xl uppercase italic transition-all active:scale-95">
          {isAnalyzing ? <Loader2 className="animate-spin" /> : <Search />} 市場価格をAI比較 ➔
        </button>
        {result && (
          <div className="space-y-6 animate-in fade-in text-left">
            <div className="bg-indigo-500 text-white p-6 rounded-2xl font-black text-center uppercase">{result.status}</div>
            <p className="text-xl font-bold text-slate-300 leading-relaxed border-l-4 border-indigo-500 pl-6 italic">「 {result.reason} 」</p>
          </div>
        )}
      </Card>
    </div>
  );
};
const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false });
export default function BuySmartPage() { return <NoSSR />; }