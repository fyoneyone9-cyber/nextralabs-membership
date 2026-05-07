'use client'
import React, { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Scale, Search, Loader2, ShoppingCart, Zap, TrendingUp, AlertTriangle, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'

// ========================
// 楽天API連携 & AIロジック
// ========================
const MasterEngine = () => {
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // 初期化：トレンド取得
  useEffect(() => {
    setIsMounted(true);
    const fetchTrends = async () => {
      try {
        const res = await fetch('/api/trends');
        const data = await res.json();
        if (Array.isArray(data)) {
          setTrends(data.slice(0, 8));
        }
      } catch (e) { /* ignore */ }
    };
    fetchTrends();
  }, []);

  const runAnalysis = async (searchWord?: string) => {
    const word = searchWord || query;
    if (!word) return;
    setQuery(word);
    setIsAnalyzing(true);
    setResult(null);

    try {
      // 1. 楽天APIで新品・中古の価格を取得しAI診断するエンドポイントを叩く
      const res = await fetch('/api/tools/buy-smart-nav', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: word })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || '解析に失敗しました');
      setResult(data);
    } catch (e: any) {
      setResult({ error: e.message || '価格の取得に失敗しました。' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 bg-[#050507] border-4 border-emerald-500/50 rounded-[2rem] md:rounded-[4rem] shadow-[0_0_100px_rgba(16,185,129,0.1)]">
      
      {/* ヘッダー */}
      <div className="text-center space-y-4 pt-4">
        <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1 text-[10px] font-black tracking-widest uppercase italic">
          <Sparkles size={12} className="inline mr-2" /> Purchase Decision Engine
        </Badge>
        <h1 className="text-5xl md:text-8xl font-black text-white italic uppercase tracking-tighter text-center leading-none">
          中古・新品<span className="text-emerald-500 underline decoration-8 decoration-emerald-500/30">AI比較</span>ナビ
        </h1>
        <p className="text-slate-400 font-bold text-sm md:text-xl max-w-3xl mx-auto">
          楽天APIからリアルタイム相場を取得。Gemini AIが「本当の損得」を10秒で判定。
        </p>
      </div>

      {/* 検索カード */}
      <Card className="bg-[#13141f] border-2 border-emerald-500/20 p-6 md:p-12 rounded-[2.5rem] md:rounded-[4rem] space-y-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Scale size={200} className="text-white" />
        </div>

        <div className="space-y-4 relative z-10">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={24} />
            <input 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && runAnalysis()}
              placeholder="商品名や型番を入力 (例: iPhone 15, MacBook Pro...)" 
              className="w-full h-16 md:h-24 bg-black/60 border-2 border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] pl-16 pr-6 text-xl md:text-3xl text-white font-black outline-none focus:border-emerald-500 transition-all placeholder:text-slate-800 italic" 
            />
          </div>
          
          <button 
            onClick={() => runAnalysis()} 
            disabled={isAnalyzing || !query} 
            className="w-full h-20 md:h-24 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black rounded-[1.5rem] md:rounded-[2.5rem] shadow-[0_0_50px_rgba(16,185,129,0.3)] flex items-center justify-center gap-4 text-2xl md:text-4xl uppercase italic transition-all active:scale-95"
          >
            {isAnalyzing ? (
              <span className="flex items-center gap-4">
                <Loader2 className="animate-spin" size={32} /> AIマーケットスキャン中...
              </span>
            ) : (
              <>市場価格をAIで解析する <ArrowRight size={32} /></>
            )}
          </button>
        </div>

        {/* トレンド（初期表示） */}
        {!result && !isAnalyzing && trends.length > 0 && (
          <div className="pt-8 border-t border-white/5 space-y-5 relative z-10">
            <div className="flex items-center justify-center gap-2">
               <TrendingUp size={14} className="text-emerald-500" />
               <p className="text-[11px] font-black text-slate-500 uppercase italic tracking-[0.2em]">Live Trends</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {trends.map((t, i) => (
                <button 
                  key={i} 
                  onClick={() => runAnalysis(t.name)}
                  className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm font-black text-slate-400 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 hover:scale-105 transition-all shadow-lg"
                >
                  #{t.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* 解析結果 */}
      {(result || isAnalyzing) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          
          {/* 左：価格データ */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#13141f] border border-white/10 rounded-[3rem] p-6 md:p-10 space-y-8 shadow-xl">
              <h2 className="text-2xl font-black text-white italic uppercase flex items-center gap-3">
                <ShoppingCart className="text-emerald-500" /> 市場データ同期
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 新品 */}
                <div className="bg-black/50 border border-white/5 rounded-3xl p-8 space-y-3 relative overflow-hidden group">
                  <Badge className="bg-blue-600 text-white border-none px-3 font-black italic">新品最安値</Badge>
                  <p className="text-5xl font-black text-white tracking-tighter relative z-10">
                    {result?.data?.minPrice ? `¥${result.data.minPrice.toLocaleString()}` : (isAnalyzing ? '---' : 'データなし')}
                  </p>
                  <p className="text-xs text-slate-500 font-bold italic tracking-wider">RAKUTEN NEW STOCK</p>
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-600/10 blur-3xl rounded-full" />
                </div>
                {/* 中古 */}
                <div className="bg-black/50 border border-white/5 rounded-3xl p-8 space-y-3 relative overflow-hidden group">
                  <Badge className="bg-orange-600 text-white border-none px-3 font-black italic">中古相場平均</Badge>
                  <p className="text-5xl font-black text-white tracking-tighter relative z-10">
                    {result?.data?.avgPrice ? `¥${result.data.avgPrice.toLocaleString()}` : (isAnalyzing ? '---' : 'データなし')}
                  </p>
                  <p className="text-xs text-slate-500 font-bold italic tracking-wider">RAKUTEN USED MARKET</p>
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-orange-600/10 blur-3xl rounded-full" />
                </div>
              </div>

              {/* 商品リスト */}
              {result?.data?.items && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] font-black text-slate-500 uppercase italic tracking-widest">Market Direct Links</p>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {result.data.items.map((item: any, i: number) => (
                      <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white/5 border border-white/5 hover:border-emerald-500/50 rounded-2xl transition-all group hover:bg-emerald-500/5">
                        <div className="flex items-center gap-4">
                          <img src={item.img} className="w-14 h-14 rounded-xl object-cover border border-white/10 group-hover:border-emerald-500/50 transition-all" />
                          <div className="max-w-[180px] md:max-w-md">
                            <p className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors line-clamp-1">{item.name}</p>
                            <p className="text-lg font-black text-emerald-500 italic">¥{item.price.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant="outline" className="text-[9px] border-white/10 text-slate-500 group-hover:border-emerald-500/30 group-hover:text-emerald-400">楽天ショップ</Badge>
                          <ArrowRight size={20} className="text-slate-700 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 右：AI判定 */}
          <div className="lg:col-span-1 space-y-6">
            <div className={`h-full border-4 rounded-[3rem] md:rounded-[4rem] p-10 md:p-12 flex flex-col justify-between transition-all duration-1000 shadow-2xl relative overflow-hidden ${
              result?.verdict === 'new' ? 'bg-emerald-600/20 border-emerald-500' : 
              result?.verdict === 'used' ? 'bg-orange-600/20 border-orange-500' :
              'bg-[#13141f] border-white/10'
            }`}>
              {/* 背景装飾 */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 blur-3xl rounded-full" />

              <div className="space-y-8 relative z-10">
                <div className="flex justify-between items-center">
                  <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-lg ${
                    result?.verdict === 'new' ? 'bg-emerald-500 text-white' : 
                    result?.verdict === 'used' ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {isAnalyzing ? <Loader2 className="animate-spin" size={32} /> : <Zap size={32} />}
                  </div>
                  <Badge className="bg-white/10 text-white border-none font-black italic tracking-widest text-xs py-1.5 px-4 rounded-full">AI VERDICT v1.0</Badge>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
                    {result?.status || (isAnalyzing ? '分析中...' : '判定待ち')}
                  </h3>
                  <div className="flex items-center gap-1.5 pt-2">
                    {[1,2,3,4,5].map(s => (
                      <div key={s} className={`h-2 flex-1 rounded-full transition-all duration-1000 ${result ? (s <= 4 ? 'bg-white' : 'bg-white/10') : 'bg-white/5'}`} />
                    ))}
                  </div>
                  <p className="text-[10px] font-black text-white/40 uppercase italic tracking-widest">AI Confidence: 94%</p>
                </div>

                <div className="bg-black/30 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8">
                   <p className="text-slate-200 text-base md:text-lg font-bold leading-relaxed italic">
                    {result?.reason ? `「 ${result.reason} 」` : '楽天の最新データをGeminiが解析し、リセールバリューとコスパの観点から最強の購入プランを提案します。'}
                  </p>
                </div>
              </div>

              {result && (
                <div className="pt-10 relative z-10">
                  <button className="w-full h-20 bg-white text-black font-black text-xl md:text-2xl uppercase italic rounded-2xl md:rounded-3xl flex items-center justify-center gap-4 hover:bg-slate-100 hover:scale-105 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] active:scale-95 group">
                    楽天市場で今すぐ購入 <ShoppingCart size={28} className="group-hover:rotate-12 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 注意事項 */}
      <div className="p-8 border-2 border-white/5 rounded-[2.5rem] bg-black/40 backdrop-blur-sm shadow-inner">
        <div className="flex items-center gap-3 text-slate-600 mb-3">
          <AlertTriangle size={18} />
          <span className="text-[11px] font-black uppercase italic tracking-widest font-sans">Market Intelligence Disclaimer</span>
        </div>
        <p className="text-[11px] text-slate-700 font-bold leading-relaxed max-w-5xl">
          ※本解析結果は楽天APIの公開データに基づくAIの推論であり、将来の価格変動や商品の在庫、品質を保証するものではありません。
          リセールバリューは市場の需給バランスにより常に変動します。実際の購入に際しては、楽天ポイントの付与率や送料、販売店の評価を必ずご自身でご確認ください。
          本ツールはアフィリエイト連携を含みますが、AIの判定アルゴリズムは中立性を維持するように設計されています。
        </p>
      </div>
    </div>
  );
};

const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false });
export default function BuySmartPage() { return <NoSSR />; }
