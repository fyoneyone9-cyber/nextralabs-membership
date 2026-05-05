'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, BookOpen, CheckCircle2, Zap, ChevronRight, Copy, ExternalLink, RotateCcw, Lightbulb, ClipboardPaste, ListChecks, Landmark, Layout, Globe, FileText, Lock
} from 'lucide-react'

const TABS = [
  { id: 'account', label: '① KDP設定', icon: Landmark },
  { id: 'manuscript', label: '② 原稿・表紙', icon: FileText },
  { id: 'register', label: '③ 本の情報', icon: ListChecks },
  { id: 'publish', label: '④ 出版申請', icon: Globe },
];

export default function KdpGuide() {
  const [activeTab, setActiveTab] = useState('account');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900 border-2 border-indigo-600/50 rounded-2xl p-5 md:p-8 mb-8 flex items-start gap-4 shadow-xl">
      <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg"><Lightbulb className="text-white" /></div>
      <div className="space-y-1">
        <p className="text-sm font-black text-indigo-400 uppercase italic tracking-widest">KDP Strategy Guide</p>
        <div className="space-y-1">
          {steps.map((s, i) => (
            <p key={i} className="text-xs md:text-lg text-slate-200 font-bold flex items-center gap-2 md:gap-4 leading-tight">
              <span className="flex items-center justify-center w-5 h-5 md:w-7 md:h-7 bg-indigo-600 text-white rounded-full text-[10px] md:text-sm italic shrink-0 font-black">{i+1}</span> {s}
            </p>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20 bg-slate-950">
      <div className="text-center space-y-2">
        <Badge className="bg-indigo-600 text-white font-black italic tracking-widest px-4 py-1 text-[10px] uppercase rounded-full">KINDLE PUBLISHING HUB</Badge>
        <h1 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-tight drop-shadow-xl">Kindle 出版ナビ</h1>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900 border border-slate-800 p-1 flex min-w-[800px] md:min-w-full rounded-2xl shadow-2xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-4 px-2 rounded-xl font-black text-sm uppercase italic transition-all flex items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl scale-[1.03] z-10' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}>
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {/* ① KDP設定 */}
        {activeTab === 'account' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-10 flex items-center gap-4 text-indigo-500"><Landmark /> ① KDPアカウント設定</h3>
            {renderGuide([
              'AmazonアカウントでKDPにサインインする',
              '銀行口座と「税に関する情報（マイナンバー）」を登録',
              'これを忘れると収益の30%が源泉徴収されるので注意！'
            ])}
            <div className="grid lg:grid-cols-2 gap-12">
               <div className="space-y-6">
                  <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800">
                     <p className="text-sm font-bold text-slate-300 mb-4 italic">KDP公式サイトへ</p>
                     <Button variant="outline" className="w-full h-16 border-2 border-slate-800 text-slate-200 font-black text-lg rounded-2xl hover:bg-slate-900 transition-all flex items-center justify-center gap-2" onClick={() => window.open('https://kdp.amazon.co.jp/', '_blank')}>KDP サインイン ↗</Button>
                  </div>
               </div>
               <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 flex flex-col justify-center space-y-4 shadow-2xl">
                  <p className="text-amber-500 font-black uppercase text-xs italic tracking-widest flex items-center gap-2"><Zap className="w-4 h-4" /> Crucial Tip</p>
                  <p className="text-base text-slate-300 font-bold leading-relaxed">
                    銀行口座の登録後、「税に関する情報」セクションで「米国の源泉徴収」を防ぐために日本のマイナンバーを入力してください。
                  </p>
               </div>
            </div>
            <Button onClick={() => setActiveTab('manuscript')} className="w-full h-16 md:h-20 mt-10 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase italic text-sm md:text-lg group">
               ② 原稿・表紙作成へ進む <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>
        )}

        {/* ② 原稿・表紙 */}
        {activeTab === 'manuscript' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in zoom-in">
            <h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-10 flex items-center gap-4 text-indigo-500"><FileText /> ② 原稿・表紙の準備</h3>
            {renderGuide([
              'Wordで原稿を作成（Kindle Createで.kpfに変換が推奨）',
              '表紙画像を用意（JPEG/TIFFのみ、PNG不可）',
              'AIに「内容紹介」を書かせるための指示をコピー'
            ])}
            <div className="grid lg:grid-cols-2 gap-12">
               <div className="space-y-6 text-center">
                  <div className="bg-slate-950 p-8 rounded-[3rem] border border-slate-800 space-y-6">
                    <p className="text-white font-black italic uppercase tracking-tighter">AI 内容紹介アシスタント</p>
                    <Button onClick={() => handleCopy("あなたはベストセラー作家です。以下の本の内容をもとに、Kindleストアで『読みたくなる』魅力的な内容紹介（商品説明）を1500字程度で作成してください。")} className={`w-full h-16 font-black rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-indigo-600 text-white'}`}>紹介文作成指示をコピー</Button>
                    <div className="grid grid-cols-2 gap-4">
                       <Button variant="outline" className="h-12 border-slate-800 text-[10px] font-black uppercase italic" onClick={() => window.open('https://claude.ai', '_blank')}>CLAUDE ↗</Button>
                       <Button variant="outline" className="h-12 border-slate-800 text-[10px] font-black uppercase italic" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT ↗</Button>
                    </div>
                  </div>
               </div>
               <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 space-y-4 shadow-2xl flex flex-col justify-center">
                  <p className="text-indigo-400 font-black uppercase text-xs italic tracking-widest flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Checklist</p>
                  <ul className="text-sm text-slate-300 space-y-2 font-bold italic">
                    <li>・ページ読み方向は「左から右（横書き）」</li>
                    <li>・目次ページが正しく機能しているか確認</li>
                    <li>・表紙は1600 x 2560 px以上を推奨</li>
                  </ul>
               </div>
            </div>
            <Button onClick={() => setActiveTab('register')} className="w-full h-16 md:h-20 mt-10 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase italic text-sm md:text-lg group">
               ③ 本の情報を登録する <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>
        )}

        {/* ③ 本の情報 */}
        {activeTab === 'register' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in zoom-in">
            <h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-10 flex items-center gap-4 text-indigo-500"><ListChecks /> ③ 本の情報登録</h3>
            {renderGuide([
              'タイトル、著者名、内容紹介を入力する',
              '「売れるキーワード（7つ）」の選定指示をコピー',
              'KDP Selectへの登録を検討（Kindle Unlimited対応）'
            ])}
            <div className="space-y-10">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 text-left h-40 overflow-y-auto text-[10px] text-slate-500 font-mono italic">
                    「この本をKindleで出版します。検索にヒットしやすく、かつターゲットに刺さる『7つの検索キーワード』を提案してください。」
                  </div>
                  <Button onClick={() => handleCopy("この本をKindleで出版します。検索にヒットしやすく、かつターゲットに刺さる『7つの検索キーワード』を提案してください。")} className={`w-full h-16 font-black rounded-xl shadow-lg transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-indigo-600 text-white'}`}>キーワード指示をコピー</Button>
                </div>
                <div className="bg-slate-950 rounded-2xl p-8 border border-slate-800 flex flex-col items-center justify-center space-y-4">
                   <p className="text-white font-black italic uppercase tracking-widest text-xs opacity-70">Recommended AI</p>
                   <Button variant="outline" onClick={() => window.open('https://gemini.google.com', '_blank')} className="w-full h-16 border-2 border-slate-800 text-slate-300 font-black text-xl rounded-2xl hover:bg-slate-900 transition-all uppercase italic">GEMINI (SEOに強い) ↗</Button>
                </div>
              </div>
            </div>
            <Button onClick={() => setActiveTab('publish')} className="w-full h-16 md:h-20 mt-10 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase italic text-sm md:text-lg group">
               ④ 最終申請へ進む <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>
        )}

        {/* ④ 出版申請 */}
        {activeTab === 'publish' && (
          <div className="animate-in fade-in zoom-in space-y-8 text-center pb-20">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-10 md:p-20 shadow-2xl border-l-8 border-l-emerald-600 relative overflow-hidden text-left">
               <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 text-white"><Globe className="w-80 h-80" /></div>
               <h3 className="text-4xl font-black text-white italic uppercase mb-10 flex items-center justify-center gap-4 relative z-10"><CheckCircle2 className="text-emerald-500 animate-pulse w-12 h-12" /> 出版申請ファイナル</h3>
               <div className="bg-slate-950 rounded-[2.5rem] p-12 border border-slate-800 text-lg text-slate-200 font-bold leading-relaxed shadow-inner relative z-10">
                  <p className="mb-6">・「ロイヤリティ 70%」を選択しましたか？</p>
                  <p className="mb-6">・「主なマーケットプレイス」を Amazon.co.jp にしましたか？</p>
                  <p className="mb-6">・プレビューアーでレイアウト崩れがないか最終確認しましたか？</p>
                  <p className="text-emerald-500 uppercase italic tracking-widest text-2xl mt-10">あとは「Kindle本を出版」ボタンを押すだけです！</p>
               </div>
            </Card>
            <Button onClick={() => setActiveTab('account')} variant="outline" className="w-full h-16 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-2xl uppercase italic"><RotateCcw className="mr-2 h-5 w-5" /> 最初から確認する</Button>
          </div>
        )}
      </div>
      <div className="mt-16 text-center text-slate-500"><p className="text-[10px] font-black uppercase tracking-widest italic opacity-20">KDP Mastery Guide — Powered by NextraLabs</p></div>
    </div>
  )
}
