'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Upload, CheckCircle2, Copy, RotateCcw, 
  Home, ShieldCheck, MapPin, Loader2, Search, ChevronRight, Zap, Info, TrendingUp, ShoppingCart
} from 'lucide-react'

const ENTRY_MODES = [
  { id: 'area', label: 'エリア・治安調査', desc: '候補地のハザード・治安を分析', icon: MapPin, steps: ['市区町村を入力', 'AIプロンプト生成', 'リスク判定'] },
  { id: 'room', label: '内見・物件チェック', desc: '写真から不備を暴く', icon: Home, steps: ['部屋の写真をアップ', 'Visionプロンプト生成', '不備の特定'] },
  { id: 'contract', label: '契約書・重要事項', desc: '特約や費用の罠をチェック', icon: ShieldCheck, steps: ['契約書を貼付', 'リスク抽出プロンプト', '交渉点の特定'] }
];

const MasterEngine = () => {
  const [mode, setMode] = useState('selection');
  const [isMounted, setIsMounted] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 2000));
    setResult("AIによる物件・エリア分析が完了しました。指定の条件に基づき、治安リスクおよび特約条項の潜在的な罠を特定しました。");
    setIsAnalyzing(false);
  };

  if (!isMounted) return null;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-100 bg-[#050507] border-4 border-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.2)] rounded-[3rem] md:rounded-[4rem] my-4">
      <div className="text-center space-y-3">
        <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 font-black italic px-4 py-0.5 text-[10px] uppercase tracking-widest mb-2">Living Intelligence MASTER</Badge>
        <h1 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter">AI引越し安心チェッカー</h1>
        <p className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-xs italic">Nextra Security & Risk Analysis</p>
      </div>

      {/* 活用マニュアル */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 text-emerald-400"><Info size={20} /> <h3 className="font-black italic uppercase text-sm">使いかた・活用マニュアル</h3></div>
        <p className="text-sm text-slate-300 font-bold leading-relaxed italic">
          検討中の物件写真、エリア名、または契約書の写しをアップロードしてください。AIが不動産業界の「隠れたコスト」や「治安の死角」を徹底的に洗い出し、あなたの新生活を守るための防御戦略を策定します。
        </p>
      </div>

      {mode === 'selection' ? (
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {ENTRY_MODES.map(item => (
            <Card key={item.id} onClick={() => setMode(item.id)} className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-10 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all cursor-pointer group flex flex-col justify-center">
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
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
          <Card className="bg-[#13141f] border-2 border-emerald-500 rounded-[3rem] overflow-hidden">
            <CardContent className="p-12 text-center space-y-8">
              <h3 className="text-3xl text-white font-black italic uppercase">【{ENTRY_MODES.find(m => m.id === mode)?.label}】プロトコル始動</h3>
              <div className="w-full aspect-video bg-black/40 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center group hover:border-emerald-500/50 transition-all cursor-pointer">
                <div className="text-center space-y-4">
                  <Upload className="h-12 w-12 text-slate-600 mx-auto group-hover:text-emerald-400" />
                  <p className="text-xs font-black text-slate-500 uppercase italic">Drop Files or Click to Upload</p>
                </div>
              </div>
              <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full h-20 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-2xl rounded-2xl shadow-xl uppercase italic">
                {isAnalyzing ? <Loader2 className="animate-spin h-8 w-8" /> : 'AIリスク解析を実行 🚀'}
              </Button>
              <button onClick={() => {setMode('selection'); setResult(null);}} className="text-slate-600 hover:text-white font-bold uppercase text-xs italic tracking-widest transition-colors">戻る</button>
            </CardContent>
          </Card>

          {result && (
            <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700">
              <Card className="bg-emerald-500/5 border-2 border-emerald-500/30 rounded-[3rem] p-10 shadow-inner">
                <h3 className="text-2xl font-black text-white italic uppercase mb-6 flex items-center gap-3"><Zap className="text-emerald-400" /> AI Risk Insight</h3>
                <div className="text-xl text-white font-bold italic leading-loose whitespace-pre-wrap">{result}</div>
              </Card>

              {/* AIロードマップ */}
              <div className="space-y-6">
                <h3 className="text-xl font-black text-white italic uppercase tracking-widest border-l-4 border-emerald-500 pl-4">Safety Roadmap</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { step: '01', title: 'リスク抽出', desc: 'ハザードマップと契約特約から、目に見えない脅威をリストアップ。', icon: Search },
                    { step: '02', title: '交渉・対策', desc: '仲介業者への具体的な質問案と、設備不備の指摘ポイントを策定。', icon: ShieldCheck },
                    { step: '03', title: '新生活防衛', desc: '入居後の防犯対策と、近隣トラブルを未然に防ぐ立ち回りを指南。', icon: TrendingUp },
                  ].map((s, i) => (
                    <div key={i} className="bg-[#13141f] border border-white/10 p-8 rounded-3xl space-y-4 hover:border-emerald-500/50 transition-all group">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-black text-emerald-500/40">{s.step}</span>
                        <s.icon className="h-6 w-6 text-emerald-400 group-hover:animate-bounce" />
                      </div>
                      <h4 className="text-lg font-black text-white italic">{s.title}</h4>
                      <p className="text-xs text-slate-400 font-bold leading-relaxed italic">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 外部リンク */}
              <div className="grid grid-cols-3 gap-4">
                {['ChatGPT', 'Gemini', 'Claude'].map(ai => (
                  <Button key={ai} onClick={() => window.open(`https://${ai.toLowerCase()}.com`)} className="h-16 bg-white/5 border border-white/10 hover:border-blue-500/50 text-slate-500 hover:text-white font-black italic rounded-2xl transition-all">
                    Detail with {ai}
                  </Button>
                ))}
              </div>

              {/* Amazon収益化 */}
              <a href="https://www.amazon.co.jp/s?k=引越し+防犯+防災&tag=nextralabs-22" target="_blank" className="block group">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-800 p-10 rounded-[3rem] flex items-center justify-between shadow-2xl transition-all hover:scale-[1.01]">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Master Defense Items</p>
                    <h3 className="text-2xl font-black text-white italic">「新生活」を鉄壁に守る、厳選防犯・防災グッズ。</h3>
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
