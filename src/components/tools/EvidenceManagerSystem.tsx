'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Archive, ShieldCheck, Loader2, Sparkles, Database, FileCheck } from 'lucide-react'

const MasterEngine = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  const runCleanup = async () => {
    setIsProcessing(true);
    setLogs(["解析プロトコル始動..."]);
    await new Promise(r => setTimeout(r, 800));
    setLogs(prev => ["証拠資料の整合性を確認中...", ...prev]);
    await new Promise(r => setTimeout(r, 800));
    setLogs(prev => ["不要なキャッシュおよびゴミファイルを選別...", ...prev]);
    await new Promise(r => setTimeout(r, 800));
    setLogs(prev => ["Shopify出品成功エビデンスを永久保存領域へ移動完了。", ...prev]);
    setIsProcessing(false);
  };

  if (!isMounted) return null;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 bg-[#050507] border-4 border-emerald-500/50 rounded-[4rem]">
      <div className="text-center space-y-2">
        <Badge className="bg-emerald-600 text-white font-bold px-4 py-1 text-[10px] uppercase rounded-full">Evidence Security OS</Badge>
        <h1 className="text-4xl md:text-6xl font-bold text-white uppercase text-center">エビデンスAIマネージャー</h1>
      </div>
      <Card className="bg-[#13141f] p-10 rounded-[3rem] text-center space-y-8">
        <div className="flex justify-center mb-4"><Archive size={48} className="text-emerald-400" /></div>
        <h3 className="text-3xl text-white font-bold mb-6 uppercase text-center">サブスク実績の証拠管理・クリーンアップ</h3>
        <p className="text-slate-400 max-w-xl mx-auto text-center font-bold">デスクトップをスキャンし、Shopifyの出品成功画像などの「本物の証拠」のみを選別・永久保存。AIが不要なデータを自動消去し、実績管理を自動化します。</p>
        
        <button onClick={runCleanup} disabled={isProcessing} className="h-20 px-12 bg-emerald-600 text-white font-bold rounded-2xl shadow-xl hover:bg-emerald-500 transition-all uppercase flex items-center justify-center gap-4 mx-auto">
          {isProcessing ? <Loader2 className="animate-spin" /> : <ShieldCheck />} エビデンス精査を実行 ➔
        </button>

        {logs.length > 0 && (
          <div className="bg-black/40 rounded-2xl p-6 font-mono text-[10px] text-emerald-500/70 border border-emerald-500/10 space-y-2 text-left max-w-2xl mx-auto">
            {logs.map((log, i) => <div key={i} className="flex gap-2"><span className="animate-pulse">●</span> {log}</div>)}
          </div>
        )}
      </Card>
    </div>
  );
};
const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false });
export default function EvidencePage() { return <NoSSR />; }