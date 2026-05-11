'use client'
import { useRouter } from 'next/navigation'
import React, { useState, useCallback, useEffect } from 'react';
import { Briefcase, Info, ShoppingCart, ShieldCheck, Lock, Ticket } from 'lucide-react';
import { CharacterMake } from '../components/CharacterMake';
import { ResultView } from '../components/ResultView';
import { AccessGate } from '@/components/tools/AccessGate';

export default function AiSidejobAppPage() {
  const router = useRouter()

  // ブラウザバック防止
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const handlePopState = () => {
      if (window.confirm('ツールを終了しますか？')) {
        router.push('/dashboard')
      } else {
        window.history.pushState(null, '', window.location.href)
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [router])

  return (
    <AccessGate productId="ai-sidejob">
      <AiSidejobAppContent />
    </AccessGate>
  )
}

function AiSidejobAppContent() {
  const [status, setStatus] = useState<'input' | 'analyzing' | 'result'>('input');
  const [resultData, setResultData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async (userData: any) => {
    setStatus('analyzing');
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/products/ai-sidejob', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        throw new Error('Analysis failed');
      }
      
      const data = await response.json();
      setResultData(data);
      setStatus('result');
    } catch (error) {
      console.error('Analysis failed:', error);
      // フォールバック
      setResultData({
        title: "⚡️ 爆速AIコンテンツライター",
        description: "あなたの武器と時間を掛け合わせた結果、クラウドソーシングでの記事量産が最短ルートと判定されました。",
        roadmap: [
          { title: "クラウドワークス登録", desc: "まずはアカウント作成。自己紹介文にはAI生成の『採用率UPテンプレ』を使用してください。", urgent: true },
          { title: "AI記事作成コンペ応募", desc: "AIを活用し、15分で1記事を作成。質より量で実績を積みます。", urgent: false },
          { title: "専属契約への移行", desc: "実績が貯まったら、継続案件へ交渉。月5万円の安定収益を目指します。", urgent: false }
        ],
        ai_hack: "プロンプトに『読者の悩みを3つ挙げ、それに対する解決策を網羅せよ』と加えるだけで、採用率が向上します。",
        platforms: ["CrowdWorks", "Lancers"]
      });
      setStatus('result');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-12 font-sans selection:bg-emerald-500/30 text-left">
      <div className="max-w-5xl mx-auto space-y-10 p-4 md:p-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="p-5 bg-emerald-500 rounded-3xl shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <Briefcase className="h-10 w-10 text-slate-950" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter text-white">
                AI副業スタートダッシュ
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                <p className="text-xs font-bold text-emerald-400 tracking-[0.3em] uppercase">
                  MASTERMODEL-MASTER
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3 opacity-50">
             <div className="text-[10px] font-bold text-slate-500">POWERED BY NEXTRALABS</div>
          </div>
        </div>

        {/* Info Area */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <Info size={20} /> 
            <h3 className="font-bold uppercase text-sm">使いかた・活用マニュアル</h3>
          </div>
          <p className="text-sm text-slate-300 font-bold leading-relaxed ">
            「キャラメイク診断」を通じてあなたの武器を明確にします。AIが最新の市場動向を解析し、あなた専用の最短収益化ルートを構築します。
          </p>
        </div>

        {/* Main Content Area */}
        <div className="py-4">
          {status === 'input' && (
            <CharacterMake onComplete={handleComplete} isSubmitting={isSubmitting} />
          )}

          {status === 'analyzing' && (
            <div className="max-w-2xl mx-auto py-20 text-center space-y-8 bg-white/5 rounded-[3rem] border border-white/10 animate-pulse">
              <div className="relative inline-block">
                <div className="h-24 w-24 border-t-transparent rounded-full animate-spin mx-auto" />
                <Briefcase className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-400 h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white ">市場トレンドを解析中...</h2>
                <p className="text-emerald-400 font-bold text-sm animate-bounce">
                   最新案件をスキャンしています
                </p>
              </div>
            </div>
          )}

          {status === 'result' && resultData && (
            <ResultView result={resultData} onReset={() => setStatus('input')} />
          )}
        </div>
      </div>
    </div>
  );
}
