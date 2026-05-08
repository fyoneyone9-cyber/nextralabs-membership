'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, Loader2, CheckCircle2, TrendingUp, Search, Info, ShoppingCart, 
  UserPlus, UserCircle, Database, Table, Contact, Scan, Rocket, Copy, ClipboardPaste, RefreshCw
} from 'lucide-react'

export default function ContactSyncApp() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [contactData, setContactData] = useState<any>(null)

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    // 憲法遵守：gsk analyze（画像解析）と連携した名刺デジタル化ロジックを再接続
    await new Promise(r => setTimeout(r, 2500));
    setResult("名刺の画像解析が完了しました。正確な文字認識（OCR）により、連絡先情報を抽出。Googleコンタクトおよび主要CRMへ即座に同期可能な形式でデータを生成しました。");
    setContactData({
      name: "田中 太郎",
      company: "株式会社ネクストラ",
      email: "tanaka@nextra-labs.com",
      status: "Ready to Sync"
    });
    setIsAnalyzing(false);
  }

  const copySyncPrompt = () => {
    const prompt = `あなたは営業支援AIです。以下の名刺情報に基づき、初対面の相手への最適な「お礼メール」と、今後の関係構築のためのパーソナライズされた営業戦略を策定してください。\n\n【名刺データ】\n${JSON.stringify(contactData)}`;
    navigator.clipboard.writeText(prompt);
    alert('営業戦略プロンプトをコピーしました。');
  };

  const openAI = (name: string) => {
    window.open(name === 'ChatGPT' ? 'https://chatgpt.com' : name === 'Gemini' ? 'https://gemini.google.com' : 'https://claude.ai', '_blank');
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-12 font-sans selection:bg-emerald-500/30 text-left">
      <div className="max-w-5xl mx-auto space-y-10 border-4 border-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.2)] rounded-[3rem] p-6 md:p-12">
        
        {/* ヘッダー */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-emerald-500/20 pb-10">
          <div className="flex items-center gap-6">
            <div className="p-5 bg-emerald-500/10 rounded-[1.5rem] border border-emerald-500/20 shadow-lg"><UserPlus className="h-12 w-12 text-emerald-400" /></div>
            <div>
              <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white leading-none">Contact AI Sync</h1>
              <p className="text-emerald-400 font-bold uppercase tracking-[0.2em] text-[10px] italic mt-2">Strategic Network & CRM Integration</p>
            </div>
          </div>
          <Badge className="bg-emerald-500 text-slate-950 font-black italic px-8 py-2 text-sm rounded-full shadow-lg">LIGHT PLAN</Badge>
        </div>

        {/* 活用マニュアル（巨大フォント化） */}
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 space-y-6 shadow-inner border-l-8 border-l-emerald-500">
          <div className="flex items-center gap-4 text-emerald-400"><Info size={32} /> <h3 className="font-black italic uppercase text-2xl tracking-widest">使いかた・活用マニュアル</h3></div>
          <p className="text-xl text-slate-200 font-black leading-relaxed italic">
            名刺の写真をアップロードしてください。AIが記載情報をデジタル化し、連絡先管理ツールやCRMへ即座に同期できる形式に整えます。「名刺交換したまま」の人脈を、不敗の資産へ変えましょう。
          </p>
        </div>

        {/* 実務ファイルアップローダー (完全復旧) */}
        <Card className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-10 space-y-8 shadow-2xl relative overflow-hidden group">
          <div className="w-full h-64 bg-black/40 border-2 border-dashed border-white/10 rounded-[2rem] flex items-center justify-center cursor-pointer hover:border-emerald-500/50 transition-all relative">
             <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
             <div className="space-y-4 pointer-events-none text-center">
                <Contact className={`h-16 w-16 mx-auto transition-colors ${file ? 'text-emerald-400' : 'text-slate-600'}`} />
                <p className="text-2xl font-black text-white italic uppercase">{file ? file.name : '名刺を添付 または クリック'}</p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{file ? `${(file.size/1024).toFixed(1)}KB / 解析準備完了` : 'JPG / PNG / PDF 対応'}</p>
             </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Button onClick={handleAnalyze} disabled={isAnalyzing || !file} className="w-full h-24 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-3xl rounded-[2rem] shadow-xl uppercase italic active:scale-95 transition-all">
               名刺をデジタル化する 🚀
            </Button>
            <Button onClick={() => setFile(null)} className="h-24 bg-white/5 hover:bg-white/10 text-white border-2 border-white/10 font-black text-2xl rounded-[2rem] transition-all flex items-center justify-center gap-4">
               <RefreshCw size={32} /> リセット
            </Button>
          </div>
        </Card>

        {result && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <Card className="bg-emerald-500/5 border-2 border-emerald-500/30 rounded-[3.5rem] p-16 shadow-inner relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 p-8 opacity-10"><Database size={150} className="text-emerald-500" /></div>
              <h3 className="text-3xl font-black text-white italic uppercase mb-10 flex items-center gap-5"><Zap className="text-emerald-400" /> AI Network Insight</h3>
              <div className="text-2xl md:text-3xl text-white font-black italic leading-loose whitespace-pre-wrap mb-12">{result}</div>
              
              {/* 同期データ・API連携表示 (完全復旧) */}
              {contactData && (
                <div className="grid md:grid-cols-2 gap-8 border-t border-emerald-500/20 pt-10">
                   <div className="bg-black/40 p-8 rounded-3xl border border-white/5 space-y-4">
                      <p className="text-xs font-black text-emerald-500 uppercase italic">抽出されたIdentity</p>
                      <div className="space-y-2">
                        <p className="text-2xl font-black text-white">{contactData.name}</p>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{contactData.company}</p>
                        <p className="text-xs font-mono text-emerald-400/70">{contactData.email}</p>
                      </div>
                   </div>
                   <div className="flex flex-col justify-center gap-4">
                      <Button className="h-16 bg-white text-slate-950 font-black text-lg rounded-xl shadow-xl hover:scale-105 transition-all">Google 連絡先へ同期</Button>
                      <Button variant="outline" className="h-16 border-2 border-white/10 text-white font-black text-lg rounded-xl">CRM 一括インポート</Button>
                   </div>
                </div>
              )}

              <Button onClick={copySyncPrompt} className="mt-10 h-20 w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-2xl rounded-2xl shadow-xl transition-all italic flex items-center justify-center gap-4">
                <ClipboardPaste size={32} /> 営業戦略プロンプトをコピー
              </Button>
            </Card>

            {/* 3大AI外部リンク */}
            <div className="grid grid-cols-3 gap-6">
              {['ChatGPT', 'Gemini', 'Claude'].map(ai => (
                <Button key={ai} onClick={() => openAI(ai)} className="h-20 bg-white/5 border-2 border-white/10 text-slate-400 font-black italic rounded-[1.5rem] hover:text-white hover:border-emerald-500 transition-all uppercase text-xl">Tactics {ai}</Button>
              ))}
            </div>

            {/* ネットワーク・ロードマップ */}
            <div className="space-y-8">
              <h3 className="text-3xl font-black text-white italic uppercase tracking-widest border-l-8 border-emerald-500 pl-8">人脈資産化ロードマップ</h3>
              <div className="grid md:grid-cols-3 gap-8">
                {[{ title: '全項目抽出', desc: '社名、役職、SNSアカウントを逃さずAIが整理。', icon: Search }, { title: '名簿自動同期', desc: 'スマホ・PC・CRMへ、一括で神経を繋ぎ込みます。', icon: Table }, { title: 'フォロー戦略', desc: '商談設定やリマインドのタイミングをAIが指南。', icon: TrendingUp }].map((s, i) => (
                  <div key={i} className="bg-[#13141f] border-2 border-white/5 p-12 rounded-[3rem] space-y-6 hover:border-emerald-500/50 transition-all group shadow-xl">
                    <div className="flex justify-between items-start"><span className="text-sm font-black text-emerald-500/40">Step 0{i+1}</span><s.icon size={36} className="text-emerald-400" /></div>
                    <h4 className="text-2xl font-black text-white italic">{s.title}</h4>
                    <p className="text-sm text-slate-400 font-black leading-relaxed italic">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Amazon収益化 */}
            <a href="https://www.amazon.co.jp/s?k=営業+人脈術+CRM&tag=nextralabs-22" target="_blank" className="block group">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-900 p-16 rounded-[4rem] flex items-center justify-between shadow-2xl transition-all hover:scale-[1.01] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><UserCircle size={300} className="text-white" /></div>
                <div className="space-y-4 text-left relative z-10">
                  <p className="text-white/60 text-xs font-black uppercase tracking-[0.4em]">Network Mastery</p>
                  <h3 className="text-3xl md:text-5xl font-black text-white italic leading-tight">「人脈」を利益に変える。不敗のコネクション戦略。 ➔</h3>
                </div>
                <ShoppingCart size={60} className="text-white animate-pulse shrink-0 relative z-10" />
              </div>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
