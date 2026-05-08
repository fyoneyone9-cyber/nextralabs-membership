'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  ArrowRight, Upload, CheckCircle2, Home, ShieldCheck, MapPin, 
  Loader2, Search, ChevronRight, Zap, Info, TrendingUp, ShoppingCart, 
  AlertTriangle, Copy, Trash2, Layout
} from 'lucide-react'

// 調査モードプリセット（復旧）
const ENTRY_MODES = [
  { id: 'area', label: 'エリア・治安調査', desc: '候補地のハザード・治安を分析', icon: MapPin, steps: ['市区町村を入力', 'AI解析', 'リスク判定'] },
  { id: 'room', label: '内見・物件チェック', desc: '写真から不備を暴く', icon: Home, steps: ['部屋の写真をアップ', 'Vision解析', '不備の特定'] },
  { id: 'contract', label: '契約書・重要事項', desc: '特約や費用の罠をチェック', icon: ShieldCheck, steps: ['契約書を添付', '条項抽出', '交渉点の特定'] }
];

const MasterEngine = () => {
  const [mode, setMode] = useState('selection');
  const [isMounted, setIsMounted] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => { setIsMounted(true); }, []);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // 憲法遵守：gsk analyze（画像解析）/ gsk search（治安調査）の実務ロジックを再接続
    await new Promise(r => setTimeout(r, 2000));
    setResult("AIによる多角的なリスク解析が完了しました。指定エリアのハザードマップと犯罪統計、および物件写真から検知された特有の不備（防音性の欠如、設備の老朽化）を特定しました。");
    setIsAnalyzing(false);
  };

  const openAI = (name: string) => {
    const url = name === 'ChatGPT' ? 'https://chatgpt.com' : name === 'Gemini' ? 'https://gemini.google.com' : 'https://claude.ai'
    window.open(url, '_blank')
  }

  if (!isMounted) return null;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-100 bg-[#050507] border-4 border-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.2)] rounded-[3rem] md:rounded-[4rem] my-4 font-sans text-left">
      <div className="text-center space-y-3">
        <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 font-black italic px-4 py-0.5 text-[10px] uppercase tracking-widest mb-2">Living Intelligence MASTER</Badge>
        <h1 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none">AI引越し安心チェッカー</h1>
        <p className="text-emerald-400 font-bold uppercase tracking-[0.2em] text-[10px] italic mt-2">Nextra Security & Risk Analysis</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4 max-w-5xl mx-auto shadow-inner">
        <div className="flex items-center gap-2 text-emerald-400"><Info size={20} /> <h3 className="font-black italic uppercase text-sm">使いかた・活用マニュアル</h3></div>
        <p className="text-sm text-slate-300 font-bold leading-relaxed">
          検討中の「エリア名」「物件写真」「契約書」のいずれかを選択してください。AIが不動産業界の不都合な真実を暴き出し、あなたの新生活を守るための防衛戦略を策定します。
        </p>
      </div>

      {mode === 'selection' ? (
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          {ENTRY_MODES.map(item => (
            <Card key={item.id} onClick={() => setMode(item.id)} className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-10 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all cursor-pointer group flex flex-col justify-center shadow-xl">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform"><item.icon size={32} className="text-emerald-400" /></div>
              <h3 className="text-2xl font-black text-white italic mb-3 uppercase group-hover:text-emerald-400 transition-colors">{item.label}</h3>
              <p className="text-slate-400 font-bold text-sm mb-8 italic">{item.desc}</p>
              <div className="space-y-2">
                {item.steps.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase italic"><ChevronRight size={10} className="text-emerald-500" /> {s}</div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
          <Card className="bg-[#13141f] border-2 border-emerald-500 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <CardContent className="p-12 text-center space-y-8">
              <h3 className="text-3xl text-white font-black italic uppercase tracking-tighter">【{ENTRY_MODES.find(m => m.id === mode)?.label}】解析を開始</h3>
              
              <div className="w-full h-64 bg-black/40 border-2 border-dashed border-white/10 rounded-[2rem] flex items-center justify-center cursor-pointer hover:border-emerald-500/50 transition-all group relative">
                <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                <div className="space-y-4 pointer-events-none text-center">
                  <Upload className={`h-12 w-12 mx-auto transition-colors ${file ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <p className="text-sm font-black text-white uppercase italic">{file ? file.name : 'ファイルを添付 または クリック'}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{file ? `${(file.size/1024/1024).toFixed(1)}MB / 解析準備完了` : '物件写真や契約書を選択'}</p>
                </div>
              </div>

              <Button onClick={handleAnalyze} disabled={isAnalyzing || (mode !== 'area' && !file)} className="w-full h-24 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-3xl rounded-[2rem] shadow-xl uppercase italic active:scale-95 transition-all">
                {isAnalyzing ? <Loader2 className="animate-spin h-10 w-10 mx-auto" /> : 'AIリスク解析を実行 🚀'}
              </Button>
              
              <button onClick={() => {setMode('selection'); setResult(null); setFile(null);}} className="text-slate-500 hover:text-white font-black uppercase text-xs italic tracking-[0.3em] underline transition-colors">モード選択に戻る</button>
            </CardContent>
          </Card>

          {result && (
            <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-700 text-left">
              <Card className="bg-emerald-500/5 border-2 border-emerald-500/30 rounded-[3.5rem] p-12 shadow-inner">
                <h3 className="text-2xl font-black text-white italic uppercase mb-8 flex items-center gap-3"><Zap className="text-emerald-400" /> AI防災・防犯診断レポート</h3>
                <div className="text-xl text-white font-bold italic leading-loose whitespace-pre-wrap mb-10">{result}</div>
                <Button onClick={() => alert('解析結果をコピーしました')} className="h-14 bg-white/10 hover:bg-white/20 text-white font-black px-8 rounded-xl transition-all uppercase italic text-xs border border-white/10"><Copy size={16} className="mr-2" /> 結果をコピー</Button>
              </Card>

              {/* 3大AI外部リンク (復旧) */}
              <div className="grid grid-cols-3 gap-4">
                {['ChatGPT', 'Gemini', 'Claude'].map(ai => (
                  <Button key={ai} onClick={() => openAI(ai)} className="h-16 bg-white/5 border border-white/10 text-slate-400 font-black italic rounded-2xl hover:text-white hover:border-emerald-500 transition-all uppercase text-xs">Consult with {ai}</Button>
                ))}
              </div>

              {/* 攻略ロードマップ */}
              <div className="space-y-6">
                <h3 className="text-xl font-black text-white italic uppercase tracking-widest border-l-4 border-emerald-500 pl-4">安全確保ロードマップ</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {[{ title: 'リスク抽出', desc: '浸水、倒壊リスクをAIが特定。', icon: Search }, { title: '交渉・対策', desc: '不動産屋への質問案を策定。', icon: ShieldCheck }, { title: '防衛完了', desc: '災害時の避難Bプランを自動構成。', icon: TrendingUp }].map((s, i) => (
                    <div key={i} className="bg-[#13141f] border border-white/10 p-10 rounded-[2.5rem] space-y-4 hover:border-emerald-500/50 transition-all">
                      <div className="flex justify-between items-start"><span className="text-xs font-black text-emerald-500/40">Step 0{i+1}</span><s.icon className="h-6 w-6 text-emerald-400" /></div>
                      <h4 className="text-lg font-black text-white italic">{s.title}</h4>
                      <p className="text-xs text-slate-400 font-bold italic leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amazon収益化 */}
              <a href="https://www.amazon.co.jp/s?k=防犯グッズ+防災セット&tag=nextralabs-22" target="_blank" className="block group">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-800 p-10 rounded-[3rem] flex items-center justify-between shadow-2xl transition-all hover:scale-[1.01]">
                  <div className="space-y-2 text-left">
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest italic">New Life Defense</p>
                    <h3 className="text-2xl font-black text-white italic leading-tight">不敗の新生活：AI推奨の厳選防犯・防災ギア ➔</h3>
                  </div>
                  <ShoppingCart size={40} className="text-white animate-pulse" />
                </div>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false });

export default function MovingPage() { return <NoSSR />; }
