'use client'
import React, { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Upload, CheckCircle2, Copy, RotateCcw, 
  Home, ShieldCheck, MapPin, Loader2, Search, ChevronRight, Zap
} from 'lucide-react'
import { DebugPanel } from '@/components/tools/DebugPanel'

const ENTRY_MODES = [
  { id: 'area', label: 'エリア・治安調査', desc: '候補地のハザード・治安を分析', icon: MapPin, steps: ['市区町村を入力', 'AIプロンプト生成', 'リスク判定'] },
  { id: 'room', label: '内見・物件チェック', desc: '写真から不備を暴く', icon: Home, steps: ['部屋の写真をアップ', 'Visionプロンプト生成', '不備の特定'] },
  { id: 'contract', label: '契約書・重要事項', desc: '特約や費用の罠をチェック', icon: ShieldCheck, steps: ['契約書を貼付', 'リスク抽出プロンプト', '交渉点の特定'] }
];

const MasterEngine = () => {
  const [mode, setMode] = useState('selection');
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);
  if (!isMounted) return null;
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 bg-[#050507] border-4 border-emerald-500/50 rounded-[4rem]">
      <div className="text-center space-y-2">
        <Badge className="bg-indigo-600">Living Intelligence OS</Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic text-center">AI引越し安心チェッカー</h1>
      </div>
      {mode === 'selection' ? (
        <div className="grid md:grid-cols-3 gap-6">
          {ENTRY_MODES.map(item => (
            <Card key={item.id} onClick={() => setMode(item.id)} className="bg-[#13141f] border-2 border-white/5 rounded-[2.5rem] p-10 md:p-14 hover:border-indigo-500 transition-all cursor-pointer group min-h-[320px] flex flex-col justify-center">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform"><item.icon size={32} className="text-indigo-400" /></div>
              <h3 className="text-2xl md:text-3xl font-black text-white italic mb-3 uppercase group-hover:text-indigo-400 transition-colors">{item.label}</h3>
              <p className="text-slate-300 font-bold text-sm md:text-base mb-8 italic">{item.desc}</p>
              <div className="space-y-2">
                {item.steps.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-[10px] md:text-xs font-black text-slate-300 uppercase italic"><ChevronRight size={10} className="text-indigo-500" /> {s}</div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-[#13141f] p-10 rounded-[3rem] text-center">
          <h3 className="text-3xl text-white font-black italic mb-6 uppercase">調査プロトコル始動</h3>
          <button onClick={() => setMode('selection')} className="h-16 px-8 border-2 border-white/10 text-slate-500 hover:text-white rounded-xl uppercase italic">戻る</button>
        </Card>
      )}
    </div>
  );
};
const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false });
export default function MovingPage() { return <NoSSR />; }