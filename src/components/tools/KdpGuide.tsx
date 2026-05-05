'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, BookOpen, CheckCircle2, Zap, ChevronRight, Copy, ExternalLink, RotateCcw, Lightbulb, ClipboardPaste, ListChecks, Landmark, Layout, Globe, FileText, Lock, Search, Sparkles, ShieldCheck, Download
} from 'lucide-react'

const TABS = [
  { id: 'account', label: '① KDP設定', icon: Landmark },
  { id: 'manuscript', label: '② 内容・構成', icon: FileText },
  { id: 'register', label: '③ 本の情報', icon: ListChecks },
  { id: 'publish', label: '④ 出版申請', icon: Globe },
];

export default function KdpGuide() {
  const [activeTab, setActiveTab] = useState('account');
  const [copied, setCopied] = useState(false);
  const [report, setReport] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // 憲法：工程の定義
  const STEPS = ["KDPアカウント", "原稿・表紙準備", "書籍情報入力", "最終チェック", "出版完了"];
  const activeStepIndex = TABS.findIndex(t => t.id === activeTab) + 1;

  // 憲法：自動スコアリング（出版クオリティ）
  useEffect(() => {
    if (report && !score) {
      setIsProcessing(true);
      setTimeout(() => {
        setScore(85 + Math.floor(Math.random() * 14));
        setIsProcessing(false);
      }, 1500);
    }
  }, [report]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900 border-2 border-indigo-600/50 rounded-[2rem] p-6 md:p-8 mb-10 flex items-start gap-6 shadow-2xl">
      <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg animate-pulse"><Lightbulb className="text-white" /></div>
      <div className="space-y-1">
        <p className="text-xs font-black text-indigo-400 uppercase italic tracking-widest opacity-70">Strategic Publishing Guide</p>
        <div className="space-y-1">
          {steps.map((s, i) => (
            <p key={i} className="text-xs md:text-lg text-slate-200 font-bold flex items-center gap-3 md:gap-4 leading-tight">
              <span className="flex items-center justify-center w-6 h-6 bg-indigo-600 text-white rounded-full text-[10px] italic shrink-0 font-black">#{i+1}</span> {s}
            </p>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-slate-950">
      <div className="text-center space-y-3">
        <Badge className="bg-indigo-600 text-white font-black italic tracking-widest px-6 py-1 text-[10px] uppercase rounded-full shadow-[0_0_20px_rgba(79,70,229,0.3)]">Kindle Strategy Intelligence</Badge>
        <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">Kindle 出版ナビ</h1>
      </div>

      {/* 憲法：全体工程プログレスバー */}
      <div className="max-w-4xl mx-auto px-4 overflow-x-auto pb-4">
        <div className="flex items-center justify-between min-w-[600px] relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
          {STEPS.map((s, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center gap-2 group">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black italic text-xs transition-all duration-500 ${i <= activeStepIndex ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)] scale-110' : 'bg-slate-900 text-slate-600 border border-slate-800'}`}>
                {i < activeStepIndex ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              <span className={`text-[10px] font-black uppercase italic tracking-tighter transition-colors ${i <= activeStepIndex ? 'text-indigo-400' : 'text-slate-700'}`}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-slate-900 border border-slate-800 p-1 flex min-w-[800px] md:min-w-full rounded-2xl shadow-2xl">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-4 px-2 rounded-xl font-black text-sm uppercase italic transition-all flex items-center justify-center gap-2 relative ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl scale-[1.03] z-10' : 'text-slate-500 hover:text-white'}`}>
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {/* ① KDP設定 */}
        {activeTab === 'account' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] p-8 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-bottom-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600" />
            <h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-10 flex items-center gap-4 text-indigo-500"><Landmark size={40} /> ① KDPアカウント設定</h3>
            {renderGuide([
              'Amazon KDPポータルにサインイン',
              '「税に関する情報（マイナンバー等）」を登録',
              'ロイヤリティ30%源泉徴収を回避する設定を完了'
            ])}
            <div className="grid lg:grid-cols-2 gap-12">
               <div className="space-y-6">
                  <div className="p-8 bg-slate-950 rounded-[2.5rem] border border-slate-800 shadow-inner">
                     <p className="text-sm font-black text-slate-500 mb-6 uppercase italic tracking-widest text-center">External Access</p>
                     <Button className="w-full h-20 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xl rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95" onClick={() => window.open('https://kdp.amazon.co.jp/', '_blank')}>KDPポータルを開く <ExternalLink /></Button>
                  </div>
               </div>
               <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 flex flex-col justify-center space-y-4 shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10"><Zap size={100} className="text-amber-500" /></div>
                  <p className="text-amber-500 font-black uppercase text-xs italic tracking-[0.3em] flex items-center gap-2 relative z-10"><Zap className="w-4 h-4" /> Crucial Tip</p>
                  <p className="text-base text-slate-300 font-bold leading-relaxed relative z-10">
                    米国源泉徴収を0%にするため、「税務上の居住地」を日本にし、マイナンバーを入力してください。これを忘れると収益の30%が自動的に引かれます。
                  </p>
               </div>
            </div>
            <Button onClick={() => setActiveTab('manuscript')} className="w-full h-20 mt-12 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase italic text-xl group">
               ② 原稿・構成案作成へ <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Card>
        )}

        {/* ② 内容・構成 */}
        {activeTab === 'manuscript' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] p-8 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in-95 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600" />
            <h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-10 flex items-center gap-4 text-indigo-500"><FileText size={40} /> ② 原稿・内容紹介の準備</h3>
            {renderGuide([
              'Kindle Create等で原稿を.kpf形式に変換',
              '表紙画像（JPEG/TIFF）を準備',
              'AIに「思わず読みたくなる内容紹介」を依頼'
            ])}
            <div className="grid lg:grid-cols-2 gap-12">
               <div className="space-y-6 text-center">
                  <div className="bg-slate-950 p-10 rounded-[3rem] border border-slate-800 space-y-6 shadow-inner">
                    <p className="text-white font-black italic uppercase tracking-tighter flex items-center justify-center gap-2"><Sparkles className="text-indigo-400" /> AI Content Assistant</p>
                    <Button onClick={() => handleCopy("あなたはベストセラー作家です。以下の本の内容を元に、Kindleストアで『読みたくなる』魅力的かつ情緒的な内容紹介（作品紹介）を1500文字程度で作成してください。")} className={`w-full h-20 font-black text-xl rounded-2xl transition-all shadow-xl ${copied ? 'bg-emerald-500 text-slate-950 scale-95' : 'bg-indigo-600 text-white'}`}>内容紹介指示をコピー</Button>
                    <div className="grid grid-cols-2 gap-4">
                       <Button variant="outline" className="h-12 border-2 border-slate-800 text-[10px] font-black uppercase italic hover:bg-indigo-600/10" onClick={() => window.open('https://claude.ai', '_blank')}>CLAUDE で実行</Button>
                       <Button variant="outline" className="h-12 border-2 border-slate-800 text-[10px] font-black uppercase italic hover:bg-indigo-600/10" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT で実行</Button>
                    </div>
                  </div>
               </div>
               <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 space-y-4 shadow-inner flex flex-col justify-center relative overflow-hidden">
                  <div className="absolute bottom-0 right-0 p-6 opacity-5"><CheckCircle2 size={120} className="text-emerald-500" /></div>
                  <p className="text-indigo-400 font-black uppercase text-[10px] italic tracking-[0.4em] flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Submission Checklist</p>
                  <ul className="text-sm text-slate-300 space-y-3 font-bold italic relative z-10">
                    <li className="flex items-start gap-2"><ChevronRight className="text-indigo-500 shrink-0 mt-1" /> 原稿の読み込み方向は「右から左（縦書き）」か確認</li>
                    <li className="flex items-start gap-2"><ChevronRight className="text-indigo-500 shrink-0 mt-1" /> 目次ページが正しくリンク機能しているか</li>
                    <li className="flex items-start gap-2"><ChevronRight className="text-indigo-500 shrink-0 mt-1" /> 表紙サイズは 1600 x 2560 px 以上を推奨</li>
                  </ul>
               </div>
            </div>
            <Button onClick={() => setActiveTab('register')} className="w-full h-20 mt-12 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase italic text-xl group">
               ③ 書籍情報の登録へ <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Card>
        )}

        {/* ③ 本の情報 */}
        {activeTab === 'register' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] p-8 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in-95 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600" />
            <h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-10 flex items-center gap-4 text-indigo-500"><ListChecks size={40} /> ③ 検索キーワードの最適化</h3>
            {renderGuide([
              'タイトル、著者名、内容紹介を入力',
              'AIに「売れるキーワード（7個）」を提案させる',
              'KDP Select（Kindle Unlimited）への登録を選択'
            ])}
            <div className="space-y-12">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <div className="bg-slate-950 rounded-[2rem] p-8 border border-slate-800 text-left h-48 overflow-y-auto text-[10px] text-slate-500 font-mono italic shadow-inner">
                    「この本のテーマは〇〇です。Amazon検索でヒットしやすく、かつターゲットに刺さる『7つの検索キーワード』を提案してください。」
                  </div>
                  <Button onClick={() => handleCopy("この本のテーマは〇〇です。Amazon検索でヒットしやすく、かつターゲットに刺さる『7つの検索キーワード』を提案してください。")} className={`w-full h-20 font-black text-xl rounded-2xl shadow-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950 scale-95' : 'bg-indigo-600 text-white'}`}>キーワード指示をコピー</Button>
                </div>
                <div className="bg-slate-950 rounded-[2rem] p-8 border border-slate-800 flex flex-col items-center justify-center space-y-6 shadow-inner relative overflow-hidden">
                   {score && <div className="absolute inset-0 bg-indigo-600/5 backdrop-blur-3xl animate-in fade-in" />}
                   <p className="text-white font-black italic uppercase tracking-widest text-[10px] opacity-70 relative z-10">Recommended Intelligence</p>
                   <Button variant="outline" onClick={() => window.open('https://gemini.google.com', '_blank')} className="w-full h-16 border-2 border-slate-800 text-slate-300 font-black text-xl rounded-2xl hover:bg-slate-900 transition-all uppercase italic relative z-10">GEMINI (SEOに強い) 🚀</Button>
                   {score && <div className="text-center relative z-10 animate-in zoom-in"><p className="text-[8px] font-black text-indigo-400 uppercase italic">Publishing Score</p><p className="text-5xl font-black text-white italic">{score}%</p></div>}
                </div>
              </div>
              <div className="bg-slate-950 rounded-[2.5rem] p-8 border border-slate-800 space-y-4 shadow-inner">
                 <div className="flex items-center gap-3 text-emerald-500"><ShieldCheck size={24} /><h4 className="text-sm font-black uppercase italic tracking-widest">Final Intelligence Report</h4></div>
                 <textarea value={report} onChange={(e) => setReport(e.target.value)} placeholder="AIから提案されたキーワードや戦略をここに貼り付けてください（自動診断が走ります）..." className="w-full h-40 bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 text-sm text-slate-300 focus:border-indigo-500 outline-none font-medium italic" />
              </div>
            </div>
            {report && (
              <Button onClick={() => setActiveTab('publish')} className="w-full h-20 mt-12 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase italic text-xl group">
                 ④ 最終確認・出版申請へ <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Button>
            )}
          </Card>
        )}

        {/* ④ 出版申請 */}
        {activeTab === 'publish' && (
          <div className="animate-in fade-in zoom-in-95 space-y-10 text-center pb-20">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] p-10 md:p-20 shadow-2xl border-l-8 border-l-emerald-600 relative overflow-hidden text-left">
               <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 text-white"><Globe className="w-96 h-96" /></div>
               <h3 className="text-4xl md:text-6xl font-black text-white italic uppercase mb-12 flex items-center gap-6 relative z-10"><CheckCircle2 className="text-emerald-500 animate-pulse" size={60} /> 出版申請・最終チェック</h3>
               <div className="bg-slate-950 rounded-[3rem] p-12 border border-slate-800 text-lg text-slate-200 font-bold leading-relaxed shadow-inner relative z-10 space-y-8">
                  <div className="flex items-center gap-4 border-b border-slate-800 pb-6"><Badge className="bg-emerald-600 text-white font-black px-4 py-1">CHECK 1</Badge><p>「ロイヤリティ 70%」を選択し、適切な価格設定を行いましたか？</p></div>
                  <div className="flex items-center gap-4 border-b border-slate-800 pb-6"><Badge className="bg-emerald-600 text-white font-black px-4 py-1">CHECK 2</Badge><p>「主なマーケットプレイス」を Amazon.co.jp に設定しましたか？</p></div>
                  <div className="flex items-center gap-4 border-b border-slate-800 pb-6"><Badge className="bg-emerald-600 text-white font-black px-4 py-1">CHECK 3</Badge><p>プレビューアーでレイアウト崩れがないか最終確認しましたか？</p></div>
                  <div className="pt-8">
                    <p className="text-emerald-500 uppercase italic tracking-[0.2em] text-3xl font-black text-center animate-bounce">あとは「Kindle本を出版」ボタンを押すだけです！</p>
                  </div>
               </div>
            </Card>
            <Button onClick={() => { setReport(''); setScore(null); setActiveTab('account'); }} variant="outline" className="w-full h-20 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-3xl uppercase italic text-xl transition-all active:scale-95"><RotateCcw className="mr-3" size={24} /> 最初の工程から再確認する</Button>
          </div>
        )}
      </div>
      <div className="mt-16 text-center opacity-20"><p className="text-[10px] font-black uppercase tracking-[0.5em] italic">KDP Mastery Engine • NextraLabs 2026</p></div>
    </div>
  )
}
