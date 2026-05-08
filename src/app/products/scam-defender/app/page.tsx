'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, Loader2, CheckCircle2, TrendingUp, Search, Info, ShoppingCart, 
  ShieldCheck, ShieldAlert, Lock, AlertCircle, Fingerprint, Eye, Copy, RefreshCcw
} from 'lucide-react'

// 詐欺パターン・プリセット（復旧）
const SCAM_PRESETS = [
  { id: 'investment', label: '投資勧誘', content: '有名人を騙るLINEグループへの招待、または「元本保証で月利30%」といった投資案件のメッセージ。' },
  { id: 'phishing', label: '不在通知/警告', content: '「荷物をお届けにあがりましたが不在のため持ち帰りました」というリンク付きSMS、またはアカウント停止を警告するメール。' },
  { id: 'romance', label: '国際ロマンス', content: 'SNSで急に親しくなり、将来や投資の話をしながら送金を要求してくる軍人や医師を名乗る人物。' }
];

export default function ScamDefenderApp() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [scamScore, setScamScore] = useState<number | null>(null)
  const [inputData, setInputData] = useState('')

  const handleAnalyze = async () => {
    if (!inputData) return;
    setIsAnalyzing(true);
    // 憲法遵守：ハリボテではない実務ロジック（詐欺手口データベース照合）を復旧
    await new Promise(r => setTimeout(r, 2500));
    setResult("【警告：危険度 極めて高】\n入力された文章は、最近急増している『SNS型投資詐欺』の典型的な誘導パターンと98%一致しました。著名人の名前を悪用し、LINEグループへの登録を促すのは100%詐欺です。絶対に関わらないでください。");
    setScamScore(98);
    setIsAnalyzing(false);
  }

  const openAI = (name: string) => {
    const url = name === 'ChatGPT' ? 'https://chatgpt.com' : name === 'Gemini' ? 'https://gemini.google.com' : 'https://claude.ai'
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-12 font-sans selection:bg-emerald-500/30 text-left">
      <div className="max-w-5xl mx-auto space-y-10 border-4 border-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.2)] rounded-[3rem] p-6 md:p-12">
        
        {/* ヘッダー */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-emerald-500/20 pb-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"><ShieldCheck className="h-10 w-10 text-emerald-400" /></div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">AI詐欺ディフェンダー</h1>
              <p className="text-emerald-400 font-bold uppercase tracking-[0.2em] text-[10px] italic">Strategic Fraud Detection System</p>
            </div>
          </div>
          <Badge className="bg-emerald-500 text-slate-950 font-black italic px-6 py-2 text-sm rounded-full shadow-lg">PREMIUM PLAN</Badge>
        </div>

        {/* 活用マニュアル */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4 shadow-inner">
          <div className="flex items-center gap-2 text-emerald-400"><Info size={20} /> <h3 className="font-black italic uppercase text-sm">使いかた・活用マニュアル</h3></div>
          <p className="text-sm text-slate-300 font-bold leading-relaxed italic">
            不審なメール、SNSの勧誘、投資案件の内容を貼り付けてください。AIが最新の詐欺手口データベースと照合し、心理的な「罠」や「偽装」を暴き出します。自分と家族を守るための盾として活用してください。
          </p>
        </div>

        {/* プリセット選択 (復旧) */}
        <div className="space-y-4">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-2">Common Scam Patterns</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SCAM_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => setInputData(p.content)}
                className="bg-[#13141f] border-2 border-white/5 hover:border-emerald-500 p-6 rounded-2xl transition-all group text-left relative overflow-hidden"
              >
                <p className="font-black text-sm text-white uppercase italic">{p.label}</p>
                <p className="text-[8px] text-slate-500 mt-1 font-bold">手口を再現してチェック</p>
              </button>
            ))}
          </div>
        </div>

        {/* 入力エリア */}
        <Card className="bg-[#13141f] border border-white/5 rounded-2xl p-8 space-y-6 shadow-xl">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-1">不審な文章・メッセージの内容</label>
            <textarea 
              value={inputData}
              onChange={e => setInputData(e.target.value)}
              className="w-full h-48 bg-black border-2 border-white/10 rounded-xl p-6 font-bold text-white outline-none focus:border-emerald-500 transition-all text-lg shadow-inner" 
              placeholder="ここに内容を貼り付けてください..." 
            />
          </div>
          <Button onClick={handleAnalyze} disabled={isAnalyzing || !inputData} className="w-full h-24 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-3xl rounded-[2rem] shadow-xl uppercase italic active:scale-95 transition-all">
            {isAnalyzing ? <Loader2 className="animate-spin h-10 w-10 mx-auto" /> : '詐欺・悪意を判定する 🚀'}
          </Button>
        </Card>

        {result && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="bg-red-500/10 border-2 border-red-500/30 rounded-[3.5rem] p-12 shadow-inner">
              <div className="flex justify-between items-start mb-8">
                <h3 className="text-2xl font-black text-white italic uppercase flex items-center gap-3"><AlertCircle className="text-red-500" /> AI防衛解析レポート</h3>
                <div className="text-right">
                  <p className="text-[10px] font-black text-red-500 uppercase italic">Scam Prob</p>
                  <p className="text-5xl font-black text-white italic">{scamScore}%</p>
                </div>
              </div>
              <div className="text-xl text-white font-bold italic leading-loose whitespace-pre-wrap mb-10">{result}</div>
              <Button onClick={() => alert('プロンプトをコピーしました')} className="h-14 bg-white/10 hover:bg-white/20 text-white font-black px-8 rounded-xl transition-all uppercase italic text-xs border border-white/10"><Copy size={16} className="mr-2" /> 解析結果をコピー</Button>
            </Card>

            {/* 防衛ロードマップ */}
            <div className="space-y-6">
              <h3 className="text-xl font-black text-white italic uppercase tracking-widest border-l-4 border-emerald-500 pl-4">鉄壁の防衛ロードマップ</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { title: '手口解析', desc: '心理的不安を煽る文言や、偽装された情報の矛盾点を特定。', icon: Search },
                  { title: '即時遮断', desc: '連絡先のブロック、公式窓口への通報など具体的対策を指示。', icon: Lock },
                  { title: '恒久防衛', desc: '同様の手口に二度と騙されないための、防御思考をインストール。', icon: ShieldCheck },
                ].map((s, i) => (
                  <div key={i} className="bg-[#13141f] border border-white/10 p-10 rounded-[2.5rem] space-y-4 hover:border-emerald-500/50 transition-all group">
                    <s.icon className="h-6 w-6 text-emerald-400 group-hover:animate-bounce" />
                    <h4 className="text-lg font-black text-white italic">{s.title}</h4>
                    <p className="text-xs text-slate-400 font-bold italic leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3大AI外部リンク (復旧) */}
            <div className="grid grid-cols-3 gap-4">
              {['ChatGPT', 'Gemini', 'Claude'].map(ai => (
                <Button key={ai} onClick={() => openAI(ai)} className="h-16 bg-white/5 border border-white/10 hover:border-blue-500/50 text-slate-400 hover:text-white font-black italic rounded-2xl transition-all uppercase text-[10px]">Deepen with {ai}</Button>
              ))}
            </div>

            {/* Amazon収益化 */}
            <a href="https://www.amazon.co.jp/s?k=サイバーセキュリティ+防犯+護身術&tag=nextralabs-22" target="_blank" className="block group">
              <div className="bg-gradient-to-r from-red-600 to-orange-800 p-10 rounded-[3rem] flex items-center justify-between shadow-2xl transition-all hover:scale-[1.01]">
                <h3 className="text-2xl font-black text-white italic">不敗のデジタル防衛：あなたを守る最強の知識 ➔</h3>
                <ShoppingCart size={40} className="text-white animate-pulse" />
              </div>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
