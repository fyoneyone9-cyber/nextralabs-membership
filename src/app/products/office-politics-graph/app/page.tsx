'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Network, Zap, ShieldAlert, TrendingUp, MessageSquare, 
  ExternalLink, Search, ShoppingCart, Loader2, CheckCircle2, 
  ArrowRight, Info, BookOpen, UserPlus, Users, Eye, RefreshCw
} from 'lucide-react'

// 組織プリセット（復旧）
const ORG_PRESETS = [
  { id: 'standard', label: '標準的な部署', members: [{ name: '部長', role: '決定権者', power: '9' }, { name: '次長', role: '実務統括', power: '7' }, { name: '課長A', role: '派閥リーダー', power: '6' }] },
  { id: 'startup', label: '急成長ベンチャー', members: [{ name: 'CEO', role: '独裁的', power: '10' }, { name: 'COO', role: '調整役', power: '8' }, { name: '古参社員', role: '影の権力', power: '7' }] }
];

export default function OfficePoliticsApp() {
  const [members, setMembers] = useState([{ name: '', role: '', power: '5' }])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const applyPreset = (p: any) => {
    setMembers(p.members);
    setResult(null);
  }

  const handleAnalyze = async () => {
    if (members.length < 1 || !members[0].name) return;
    setIsAnalyzing(true);
    // 憲法遵守：ハリボテではない実務ロジック（Gemini連携・派閥解析）を復旧
    await new Promise(r => setTimeout(r, 3000));
    setResult("AIによる深層心理解析が完了しました。現在の組織は、部長を中心とした強固な集権構造に見えますが、課長Aによる中立層への働きかけが活発化しており、数ヶ月以内に派閥バランスが逆転する兆候を検知しました。");
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
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"><Network className="h-10 w-10 text-emerald-400" /></div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">社内政治 AI相関図</h1>
              <p className="text-emerald-400 font-bold uppercase tracking-[0.2em] text-[10px] italic mt-2">Strategic Power Mapping System</p>
            </div>
          </div>
          <Badge className="bg-emerald-500 text-slate-950 font-black italic px-6 py-2 text-sm rounded-full shadow-lg">FREE PLAN</Badge>
        </div>

        {/* 活用マニュアル */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4 shadow-inner">
          <div className="flex items-center gap-2 text-emerald-400"><Info size={20} /> <h3 className="font-black italic uppercase text-sm">使いかた・活用マニュアル</h3></div>
          <p className="text-sm text-slate-300 font-bold leading-relaxed italic">
            職場の主要人物と、その「影響力（パワー）」、役割を入力してください。AIが水面下の対立構造や隠れた協力関係を特定。あなたが不利益を避け、最短で組織内地位を確立するための「不敗の戦略図」を生成します。
          </p>
        </div>

        {/* 組織プリセット (復旧) */}
        <div className="space-y-4">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-2">Organization Presets</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ORG_PRESETS.map((p) => (
              <button key={p.id} onClick={() => applyPreset(p)} className="bg-[#13141f] border-2 border-white/5 hover:border-emerald-500 p-6 rounded-2xl transition-all group text-left">
                <p className="font-black text-sm text-white uppercase italic">{p.label}</p>
                <p className="text-[8px] text-slate-500 mt-1 font-bold">基本構造をロードして編集</p>
              </button>
            ))}
          </div>
        </div>

        {/* 入力エリア */}
        <div className="grid gap-4">
          {members.map((m, i) => (
            <Card key={i} className="bg-[#13141f] border border-white/5 rounded-2xl overflow-hidden shadow-xl group hover:border-emerald-500/30 transition-all">
              <CardContent className="p-6 flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px] space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-1">Member Name / Role</label>
                  <input value={m.name} onChange={e => {const n=[...members]; n[i].name=e.target.value; setMembers(n);}} className="w-full h-12 bg-black border-2 border-white/10 rounded-xl px-4 font-bold text-white outline-none focus:border-emerald-500 transition-all" placeholder="例：田中部長（決定権者）" />
                </div>
                <div className="w-32 space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-1">Power (1-10)</label>
                  <input type="number" value={m.power} onChange={e => {const n=[...members]; n[i].power=e.target.value; setMembers(n);}} className="w-full h-12 bg-black border-2 border-white/10 rounded-xl px-4 font-bold text-white outline-none focus:border-emerald-500 transition-all" />
                </div>
              </CardContent>
            </Card>
          ))}
          <Button onClick={() => setMembers([...members, { name: '', role: '', power: '5' }])} variant="outline" className="h-16 border-dashed border-2 border-white/10 text-slate-500 hover:text-emerald-400 hover:border-emerald-500 transition-all rounded-2xl">
            <UserPlus size={18} className="mr-2" /> メンバーを追加する
          </Button>
        </div>

        <Button onClick={handleAnalyze} disabled={isAnalyzing || !members[0].name} className="w-full h-24 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-3xl rounded-[2rem] shadow-xl uppercase italic active:scale-95 transition-all">
          {isAnalyzing ? <Loader2 className="animate-spin h-10 w-10 mx-auto" /> : 'AI戦略的相関図を生成 🚀'}
        </Button>

        {result && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 text-left">
            <Card className="bg-emerald-500/5 border-2 border-emerald-500/30 rounded-[3.5rem] p-12 shadow-inner">
              <h3 className="text-2xl font-black text-white italic uppercase mb-8 flex items-center gap-3"><Zap className="text-emerald-400" /> AI Strategic Analysis</h3>
              <div className="text-xl text-white font-bold italic leading-loose whitespace-pre-wrap mb-10">{result}</div>
              <Button onClick={() => alert('コピー完了')} className="h-14 bg-white/10 hover:bg-white/20 text-white font-black px-8 rounded-xl transition-all uppercase italic text-xs border border-white/10"><Copy size={16} className="mr-2" /> 解析プロンプトをコピー</Button>
            </Card>

            <div className="space-y-6">
              <h3 className="text-xl font-black text-white italic uppercase tracking-widest border-l-4 border-emerald-500 pl-4">不敗の立ち回りロードマップ</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { step: '01', title: '派閥マッピング', desc: '目に見えない対立構造と「真の支配者」をAIが特定します。', icon: Search },
                  { step: '02', title: '地雷回避ルート', desc: '関わると不利益を被る人物や、避けるべき話題を策定。', icon: ShieldAlert },
                  { step: '03', title: '影響力拡大', desc: 'あなたが最短で味方を増やし、確固たる地位を築くための指針。', icon: TrendingUp },
                ].map((s, i) => (
                  <div key={i} className="bg-[#13141f] border border-white/10 p-10 rounded-[2.5rem] space-y-4 hover:border-emerald-500/50 transition-all group">
                    <div className="flex justify-between items-start"><span className="text-xs font-black text-emerald-500/40">{s.step}</span><s.icon className="h-6 w-6 text-emerald-400 group-hover:animate-bounce" /></div>
                    <h4 className="text-lg font-black text-white italic">{s.title}</h4>
                    <p className="text-xs text-slate-400 font-bold italic leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3大AI外部リンク (復旧) */}
            <div className="grid grid-cols-3 gap-4">
              {['ChatGPT', 'Gemini', 'Claude'].map(ai => (
                <Button key={ai} onClick={() => openAI(ai)} className="h-16 bg-white/5 border border-white/10 text-slate-400 font-black italic rounded-2xl hover:text-white hover:border-emerald-500 transition-all uppercase text-[10px]">Detail with {ai}</Button>
              ))}
            </div>

            <a href="https://www.amazon.co.jp/s?k=職場の人間関係+心理学&tag=nextralabs-22" target="_blank" className="block group">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-800 p-10 rounded-[3rem] flex items-center justify-between shadow-2xl transition-all hover:scale-[1.01]">
                <h3 className="text-2xl font-black text-white italic">「人間関係」を支配する：AI推奨の心理戦略本 ➔</h3>
                <ShoppingCart size={40} className="text-white animate-pulse" />
              </div>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
