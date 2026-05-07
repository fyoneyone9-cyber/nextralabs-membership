'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, ShoppingCart, Loader2, Database } from 'lucide-react'

const MasterEngine = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);
  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setPredictions([
        { id: 1, keyword: 'ソロキャンプ 焚き火台', item: 'チタン焚き火台', price: '¥4,980' },
        { id: 2, keyword: 'レトロ フィルムカメラ', item: 'インスタントカメラ', price: '¥12,000' }
      ]);
      setIsAnalyzing(false);
    }, 2000);
  };
  if (!isMounted) return null;
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 bg-[#050507]">
      <div className="text-center space-y-3">
        <Badge className="bg-orange-600">Trend Prediction OS</Badge>
        <h1 className="text-2xl md:text-6xl font-black text-white uppercase italic">SNSトレンド自動仕入</h1>
      </div>
      <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-10">
        <button onClick={runAnalysis} disabled={isAnalyzing} className="w-full h-24 bg-orange-600 text-white font-black rounded-2xl flex items-center justify-center gap-6 text-3xl uppercase italic">
          {isAnalyzing ? <Loader2 className="animate-spin" /> : <TrendingUp />}トレンド解析 ➔
        </button>
        <div className="mt-10 space-y-6">
          {predictions.map(p => (
            <div key={p.id} className="bg-black/40 p-8 rounded-[3rem] border border-white/5 flex justify-between items-center">
              <div><h3 className="text-2xl font-black text-white">{p.keyword}</h3><p className="text-slate-400">{p.item}</p></div>
              <p className="text-3xl font-black text-white">{p.price}</p>
            </div>
          ))}
          {predictions.length === 0 && <div className="py-20 text-center opacity-20"><Database size={64} className="mx-auto" /><p>Awaiting Analysis...</p></div>}
        </div>
      </Card>
    </div>
  )
}
const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false });
export default function TrendPage() { return <NoSSR />; }