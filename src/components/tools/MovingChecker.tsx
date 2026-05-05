'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Upload, CheckCircle2, Copy, RotateCcw, Lightbulb, ClipboardPaste, Home, ShieldCheck, MapPin, Download, Loader2, Sparkles, Building2, Search, AlertTriangle, Info, ChevronRight, Zap
} from 'lucide-react'

// 砂時計型フロー：最初の「入口」の選択肢
const ENTRY_MODES = [
  { 
    id: 'area', 
    label: 'エリア・治安調査', 
    desc: '候補地のハザード・治安を分析', 
    icon: MapPin, 
    color: 'text-blue-500', 
    bg: 'bg-blue-500/10',
    steps: ['市区町村を入力', 'AI治安プロンプトを生成', '3台のAIでリスク判定']
  },
  { 
    id: 'room', 
    label: '内見・物件チェック', 
    desc: '写真から隠れた不備を暴く', 
    icon: Home, 
    color: 'text-indigo-500', 
    bg: 'bg-indigo-500/10',
    steps: ['お部屋の写真をアップ', 'AI Visionプロンプト生成', '不備・カビ・劣化を特定']
  },
  { 
    id: 'contract', 
    label: '契約書・重要事項', 
    desc: '特約や費用の罠をチェック', 
    icon: ShieldCheck, 
    color: 'text-emerald-500', 
    bg: 'bg-emerald-500/10',
    steps: ['契約書や重説を撮影/貼付', '法的リスク抽出プロンプト', '交渉ポイントの特定']
  },
];

export default function MovingChecker() {
  const [mode, setMode] = useState<'selection' | 'area' | 'room' | 'contract'>('selection');
  const [inputData, setInputData] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [report, setReport] = useState('');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 選択したモードに応じたプロンプト生成
  const getPrompt = () => {
    if (mode === 'area') {
      return `あなたはプロの防犯・地域分析コンサルタントです。以下のエリアについて、公的データに基づき治安・地盤・利便性の観点からリスク分析を行い、「S〜D」のランク判定と具体的な注意点を出力してください。\n【調査エリア】：${inputData}`;
    }
    if (mode === 'room') {
      return `あなたは不動産管理のスペシャリストです。添付された内見写真から、壁のひび割れ、カビの予兆、設備の劣化、清掃状態、建付けの歪みなど、素人が見落としがちな不備を徹底的に洗い出し、入居前に確認・交渉すべきポイントをリストアップしてください。`;
    }
    if (mode === 'contract') {
      return `あなたは賃貸トラブルを専門とする法務アドバイザーです。以下の契約書・重要事項説明書のドラフト（または撮影内容）から、退去時の高額請求リスク、不当な特約、更新料の罠、設備修繕の負担区分など、借主に不利な条項を特定し、修正交渉のための文言を提案してください。\n【契約内容】：${inputData}`;
    }
    return '';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setTimeout(() => setIsProcessing(false), 500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderGuide = (steps: string[]) => (
    <div className="bg-slate-900 border-2 border-indigo-600/50 rounded-3xl p-6 mb-10 flex items-start gap-5 shadow-2xl">
      <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg animate-pulse"><Lightbulb className="text-white" /></div>
      <div className="space-y-1">
        <p className="text-xs font-black text-indigo-400 uppercase italic tracking-[0.2em] opacity-70">Operation Guide</p>
        <div className="space-y-1">
          {steps.map((s, i) => (
            <p key={i} className="text-sm md:text-base text-slate-300 font-bold flex items-center gap-3 leading-tight"><span className="text-indigo-600 italic">#{i+1}</span> {s}</p>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-slate-950">
      <div className="text-center space-y-3">
        <Badge className="bg-indigo-600 text-white font-black italic tracking-widest px-6 py-1 text-[10px] uppercase rounded-full shadow-[0_0_20px_rgba(79,70,229,0.3)]">Resident Intelligence Terminal</Badge>
        <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">Moving Checker</h1>
      </div>

      {/* 砂時計：入口（Entry）- 状況選択 */}
      {mode === 'selection' && (
        <div className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8">
          {ENTRY_MODES.map((item) => (
            <Card key={item.id} onClick={() => setMode(item.id as any)} className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-8 hover:border-indigo-500 transition-all cursor-pointer group hover:scale-[1.02] shadow-2xl relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 ${item.bg} blur-3xl -mr-16 -mt-16 group-hover:opacity-100 opacity-50 transition-opacity`} />
              <div className={`w-16 h-16 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}><item.icon size={32} /></div>
              <h3 className="text-2xl font-black text-white italic uppercase mb-2">{item.label}</h3>
              <p className="text-slate-500 font-bold text-sm mb-6">{item.desc}</p>
              <div className="space-y-2">
                {item.steps.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase italic opacity-60"><ChevronRight size={10} className={item.color} /> {s}</div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 砂時計：一本道（Process）- 各モードの実行 */}
      {mode !== 'selection' && (
        <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] p-8 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.6)] animate-in zoom-in-95 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600" />
          
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase flex items-center gap-4">
              {ENTRY_MODES.find(m => m.id === mode)?.icon && React.createElement(ENTRY_MODES.find(m => m.id === mode)!.icon, { className: "text-indigo-500", size: 40 })}
              {ENTRY_MODES.find(m => m.id === mode)?.label}
            </h3>
            <Button onClick={() => { setMode('selection'); setInputData(''); setImage(null); setReport(''); }} variant="ghost" className="text-slate-500 font-black italic uppercase hover:text-white"><RotateCcw className="mr-2" size={16} /> Mode Change</Button>
          </div>

          {renderGuide(ENTRY_MODES.find(m => m.id === mode)?.steps || [])}

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              {/* モード別入力欄 */}
              {mode === 'area' && <textarea value={inputData} onChange={(e) => setInputData(e.target.value)} placeholder="例：神奈川県海老名市、駅から徒歩10分圏内の治安とハザード情報を知りたい..." className="w-full h-48 bg-slate-950 border-2 border-slate-800 rounded-3xl p-8 text-xl text-white font-black focus:border-indigo-500 outline-none shadow-inner" />}
              {mode === 'room' && (
                <div className="space-y-6">
                  {!image ? (
                    <div className="border-4 border-dashed border-slate-800 rounded-[2.5rem] p-20 text-center hover:bg-slate-950 transition-all cursor-pointer bg-slate-900/50 shadow-inner group" onClick={() => fileInputRef.current?.click()}>
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                      <Upload className="h-16 w-16 text-slate-700 mx-auto mb-6 group-hover:text-indigo-500 transition-colors" />
                      <p className="text-xl text-slate-500 font-black italic uppercase">Drop Room Photo</p>
                    </div>
                  ) : (
                    <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border-4 border-indigo-600/30 shadow-2xl bg-black flex items-center justify-center">
                       <img src={image} alt="Room" className="max-h-full max-w-full object-contain" />
                       <Button onClick={() => setImage(null)} className="absolute top-6 right-6 bg-black/50 hover:bg-red-600 p-2 rounded-full h-12 w-12 text-white shadow-xl">✕</Button>
                    </div>
                  )}
                </div>
              )}
              {mode === 'contract' && <textarea value={inputData} onChange={(e) => setInputData(e.target.value)} placeholder="契約書や重要事項説明書のテキストを貼り付けてください（特約事項など）..." className="w-full h-48 bg-slate-950 border-2 border-slate-800 rounded-3xl p-8 text-lg text-white font-bold focus:border-emerald-500 outline-none shadow-inner" />}

              {/* 3-AI Hub: 指示コピーボタン */}
              <div className="space-y-4">
                <Button onClick={() => handleCopy(getPrompt())} className={`w-full h-20 text-xl font-black rounded-2xl transition-all shadow-xl ${copied ? 'bg-emerald-500 text-slate-950 scale-95' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}>
                  {copied ? <CheckCircle2 className="mr-3" /> : <ClipboardPaste className="mr-3" />} 解析指示をコピーする
                </Button>
                <div className="grid grid-cols-3 gap-3">
                   <Button variant="outline" className="h-14 border-2 border-slate-800 text-[10px] font-black uppercase italic hover:bg-indigo-600/10" onClick={() => window.open('https://claude.ai', '_blank')}>Claude <Sparkles className="ml-1 w-3 h-3 text-indigo-400" /></Button>
                   <Button variant="outline" className="h-14 border-2 border-slate-800 text-[10px] font-black uppercase italic hover:bg-indigo-600/10" onClick={() => window.open('https://gemini.google.com', '_blank')}>Gemini <Zap className="ml-1 w-3 h-3 text-indigo-400" /></Button>
                   <Button variant="outline" className="h-14 border-2 border-slate-800 text-[10px] font-black uppercase italic hover:bg-indigo-600/10" onClick={() => window.open('https://chatgpt.com', '_blank')}>ChatGPT <Search className="ml-1 w-3 h-3 text-indigo-400" /></Button>
                </div>
              </div>
            </div>

            {/* 解析結果レポート */}
            <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 flex flex-col gap-6 shadow-inner min-h-[500px]">
              <div className="flex items-center gap-3 text-indigo-400">
                <ShieldCheck size={24} />
                <h4 className="text-sm font-black uppercase italic tracking-widest">Intelligence Report</h4>
              </div>
              <textarea value={report} onChange={(e) => setReport(e.target.value)} placeholder="外部AIからの解析結果（レポート）をここに貼り付けてください..." className="flex-1 bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 text-sm text-slate-300 focus:border-indigo-500 outline-none font-medium leading-relaxed italic" />
              {report && (
                <div className="p-5 bg-emerald-600/10 border-2 border-emerald-500 rounded-2xl flex items-center gap-4 text-emerald-500 animate-in slide-in-from-right-4">
                  <CheckCircle2 size={24} />
                  <p className="text-sm font-black uppercase italic">Safe Living Protocol: Analysis Verified</p>
                </div>
              )}
            </div>
          </div>

          {/* 砂時計：出口（Exit）- 次のアクション選択 */}
          {report && (
            <div className="mt-16 pt-16 border-t border-slate-800 space-y-8 animate-in fade-in slide-in-from-bottom-8">
              <h4 className="text-2xl font-black text-white italic uppercase text-center">Next Action Recommend</h4>
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                 <Button onClick={() => { handleCopy(`${report}\n\nこの解析結果を踏まえて、管理会社への具体的な質問状や、交渉用のメール文面を作成してください。`); }} className="h-20 bg-slate-800 border-2 border-slate-700 hover:border-emerald-500 rounded-2xl font-black italic uppercase flex items-center justify-center gap-4 transition-all group">
                   <div className="p-2 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/40"><ShieldCheck className="text-emerald-500" /></div>
                   <div className="text-left"><p className="text-[10px] opacity-50">Solution A</p><p className="text-sm">交渉用メールを作成</p></div>
                 </Button>
                 <Button onClick={() => setMode('selection')} className="h-20 bg-slate-800 border-2 border-slate-700 hover:border-indigo-500 rounded-2xl font-black italic uppercase flex items-center justify-center gap-4 transition-all group">
                   <div className="p-2 bg-indigo-500/20 rounded-lg group-hover:bg-indigo-500/40"><Search className="text-indigo-500" /></div>
                   <div className="text-left"><p className="text-[10px] opacity-50">Solution B</p><p className="text-sm">別の物件を調べる</p></div>
                 </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      <div className="text-center opacity-20"><p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Safe Living Engine • NextraLabs 2026</p></div>
    </div>
  )
}
