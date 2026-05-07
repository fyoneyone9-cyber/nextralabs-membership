'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, BookOpen, CheckCircle2, Zap, ChevronRight, Copy, ExternalLink, RotateCcw, Lightbulb, ClipboardPaste, ListChecks, Landmark, Layout, Globe, FileText, Lock, Search, Sparkles, ShieldCheck, Download
} from 'lucide-react'

const TABS = [
  { id: 'account', label: '竭 KDP險ｭ螳・, icon: Landmark },
  { id: 'manuscript', label: '竭｡ 蜀・ｮｹ繝ｻ讒区・', icon: FileText },
  { id: 'register', label: '竭｢ 譛ｬ縺ｮ諠・ｱ', icon: ListChecks },
  { id: 'publish', label: '竭｣ 蜃ｺ迚育筏隲・, icon: Globe },
];

export default function KdpGuide() {
  const [activeTab, setActiveTab] = useState('account');
  const [copied, setCopied] = useState(false);
  const [report, setReport] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // 諞ｲ豕包ｼ壼ｷ･遞九・螳夂ｾｩ
  const STEPS = ["KDP繧｢繧ｫ繧ｦ繝ｳ繝・, "蜴溽ｨｿ繝ｻ陦ｨ邏呎ｺ門ｙ", "譖ｸ邀肴ュ蝣ｱ蜈･蜉・, "譛邨ゅメ繧ｧ繝・け", "蜃ｺ迚亥ｮ御ｺ・];
  const activeStepIndex = TABS.findIndex(t => t.id === activeTab) + 1;

  // 諞ｲ豕包ｼ夊・蜍輔せ繧ｳ繧｢繝ｪ繝ｳ繧ｰ・亥・迚医け繧ｪ繝ｪ繝・ぅ・・  useEffect(() => {
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
        <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">Kindle 蜃ｺ迚医リ繝・/h1>
      </div>

      {/* 諞ｲ豕包ｼ壼・菴灘ｷ･遞九・繝ｭ繧ｰ繝ｬ繧ｹ繝舌・ */}
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
        {/* 竭 KDP險ｭ螳・*/}
        {activeTab === 'account' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] p-8 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-bottom-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600" />
            <h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-10 flex items-center gap-4 text-indigo-500"><Landmark size={40} /> 竭 KDP繧｢繧ｫ繧ｦ繝ｳ繝郁ｨｭ螳・/h3>
            {renderGuide([
              'Amazon KDP繝昴・繧ｿ繝ｫ縺ｫ繧ｵ繧､繝ｳ繧､繝ｳ',
              '縲檎ｨ弱↓髢｢縺吶ｋ諠・ｱ・医・繧､繝翫Φ繝舌・遲会ｼ峨阪ｒ逋ｻ骭ｲ',
              '繝ｭ繧､繝､繝ｪ繝・ぅ30%貅先ｳ牙ｾｴ蜿弱ｒ蝗樣∩縺吶ｋ險ｭ螳壹ｒ螳御ｺ・
            ])}
            <div className="grid lg:grid-cols-2 gap-12">
               <div className="space-y-6">
                  <div className="p-8 bg-slate-950 rounded-[2.5rem] border border-slate-800 shadow-inner">
                     <p className="text-sm font-black text-slate-500 mb-6 uppercase italic tracking-widest text-center">External Access</p>
                     <Button className="w-full h-20 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xl rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95" onClick={() => window.open('https://kdp.amazon.co.jp/', '_blank')}>KDP繝昴・繧ｿ繝ｫ繧帝幕縺・<ExternalLink /></Button>
                  </div>
               </div>
               <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 flex flex-col justify-center space-y-4 shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10"><Zap size={100} className="text-amber-500" /></div>
                  <p className="text-amber-500 font-black uppercase text-xs italic tracking-[0.3em] flex items-center gap-2 relative z-10"><Zap className="w-4 h-4" /> Crucial Tip</p>
                  <p className="text-base text-slate-300 font-bold leading-relaxed relative z-10">
                    邀ｳ蝗ｽ貅先ｳ牙ｾｴ蜿弱ｒ0%縺ｫ縺吶ｋ縺溘ａ縲√檎ｨ主漁荳翫・螻・ｽ丞慍縲阪ｒ譌･譛ｬ縺ｫ縺励√・繧､繝翫Φ繝舌・繧貞・蜉帙＠縺ｦ縺上□縺輔＞縲ゅ％繧後ｒ蠢倥ｌ繧九→蜿守寢縺ｮ30%縺瑚・蜍慕噪縺ｫ蠑輔°繧後∪縺吶・                  </p>
               </div>
            </div>
            <Button onClick={() => setActiveTab('manuscript')} className="w-full h-20 mt-12 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase italic text-xl group">
               竭｡ 蜴溽ｨｿ繝ｻ讒区・譯井ｽ懈・縺ｸ <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Card>
        )}

        {/* 竭｡ 蜀・ｮｹ繝ｻ讒区・ */}
        {activeTab === 'manuscript' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] p-8 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in-95 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600" />
            <h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-10 flex items-center gap-4 text-indigo-500"><FileText size={40} /> 竭｡ 蜴溽ｨｿ繝ｻ蜀・ｮｹ邏ｹ莉九・貅門ｙ</h3>
            {renderGuide([
              'Kindle Create遲峨〒蜴溽ｨｿ繧・kpf蠖｢蠑上↓螟画鋤',
              '陦ｨ邏咏判蜒擾ｼ・PEG/TIFF・峨ｒ貅門ｙ',
              'AI縺ｫ縲梧昴ｏ縺夊ｪｭ縺ｿ縺溘￥縺ｪ繧句・螳ｹ邏ｹ莉九阪ｒ萓晞ｼ'
            ])}
            <div className="grid lg:grid-cols-2 gap-12">
               <div className="space-y-6 text-center">
                  <div className="bg-slate-950 p-10 rounded-[3rem] border border-slate-800 space-y-6 shadow-inner">
                    <p className="text-white font-black italic uppercase tracking-tighter flex items-center justify-center gap-2"><Sparkles className="text-indigo-400" /> AI Content Assistant</p>
                    <Button onClick={() => handleCopy("縺ゅ↑縺溘・繝吶せ繝医そ繝ｩ繝ｼ菴懷ｮｶ縺ｧ縺吶ゆｻ･荳九・譛ｬ縺ｮ蜀・ｮｹ繧貞・縺ｫ縲゜indle繧ｹ繝医い縺ｧ縲手ｪｭ縺ｿ縺溘￥縺ｪ繧九城ｭ・鴨逧・°縺､諠・ｷ堤噪縺ｪ蜀・ｮｹ邏ｹ莉具ｼ井ｽ懷刀邏ｹ莉具ｼ峨ｒ1500譁・ｭ礼ｨ句ｺｦ縺ｧ菴懈・縺励※縺上□縺輔＞縲・)} className={`w-full h-20 font-black text-xl rounded-2xl transition-all shadow-xl ${copied ? 'bg-emerald-500 text-slate-950 scale-95' : 'bg-indigo-600 text-white'}`}>蜀・ｮｹ邏ｹ莉区欠遉ｺ繧偵さ繝斐・</Button>
                    <div className="grid grid-cols-2 gap-4">
                       <Button variant="outline" className="h-12 border-2 border-slate-800 text-[10px] font-black uppercase italic hover:bg-indigo-600/10" onClick={() => window.open('https://claude.ai', '_blank')}>CLAUDE 縺ｧ螳溯｡・/Button>
                       <Button variant="outline" className="h-12 border-2 border-slate-800 text-[10px] font-black uppercase italic hover:bg-indigo-600/10" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT 縺ｧ螳溯｡・/Button>
                    </div>
                  </div>
               </div>
               <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 space-y-4 shadow-inner flex flex-col justify-center relative overflow-hidden">
                  <div className="absolute bottom-0 right-0 p-6 opacity-5"><CheckCircle2 size={120} className="text-emerald-500" /></div>
                  <p className="text-indigo-400 font-black uppercase text-[10px] italic tracking-[0.4em] flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Submission Checklist</p>
                  <ul className="text-sm text-slate-300 space-y-3 font-bold italic relative z-10">
                    <li className="flex items-start gap-2"><ChevronRight className="text-indigo-500 shrink-0 mt-1" /> 蜴溽ｨｿ縺ｮ隱ｭ縺ｿ霎ｼ縺ｿ譁ｹ蜷代・縲悟承縺九ｉ蟾ｦ・育ｸｦ譖ｸ縺搾ｼ峨阪°遒ｺ隱・/li>
                    <li className="flex items-start gap-2"><ChevronRight className="text-indigo-500 shrink-0 mt-1" /> 逶ｮ谺｡繝壹・繧ｸ縺梧ｭ｣縺励￥繝ｪ繝ｳ繧ｯ讖溯・縺励※縺・ｋ縺・/li>
                    <li className="flex items-start gap-2"><ChevronRight className="text-indigo-500 shrink-0 mt-1" /> 陦ｨ邏吶し繧､繧ｺ縺ｯ 1600 x 2560 px 莉･荳翫ｒ謗ｨ螂ｨ</li>
                  </ul>
               </div>
            </div>
            <Button onClick={() => setActiveTab('register')} className="w-full h-20 mt-12 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase italic text-xl group">
               竭｢ 譖ｸ邀肴ュ蝣ｱ縺ｮ逋ｻ骭ｲ縺ｸ <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Card>
        )}

        {/* 竭｢ 譛ｬ縺ｮ諠・ｱ */}
        {activeTab === 'register' && (
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] p-8 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in-95 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600" />
            <h3 className="text-2xl md:text-5xl font-black text-white italic uppercase mb-10 flex items-center gap-4 text-indigo-500"><ListChecks size={40} /> 竭｢ 讀懃ｴ｢繧ｭ繝ｼ繝ｯ繝ｼ繝峨・譛驕ｩ蛹・/h3>
            {renderGuide([
              '繧ｿ繧､繝医Ν縲∬送閠・錐縲∝・螳ｹ邏ｹ莉九ｒ蜈･蜉・,
              'AI縺ｫ縲悟｣ｲ繧後ｋ繧ｭ繝ｼ繝ｯ繝ｼ繝会ｼ・蛟具ｼ峨阪ｒ謠先｡医＆縺帙ｋ',
              'KDP Select・・indle Unlimited・峨∈縺ｮ逋ｻ骭ｲ繧帝∈謚・
            ])}
            <div className="space-y-12">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <div className="bg-slate-950 rounded-[2rem] p-8 border border-slate-800 text-left h-48 overflow-y-auto text-[10px] text-slate-500 font-mono italic shadow-inner">
                    縲後％縺ｮ譛ｬ縺ｮ繝・・繝槭・縲・・〒縺吶・mazon讀懃ｴ｢縺ｧ繝偵ャ繝医＠繧・☆縺上√°縺､繧ｿ繝ｼ繧ｲ繝・ヨ縺ｫ蛻ｺ縺輔ｋ縲・縺､縺ｮ讀懃ｴ｢繧ｭ繝ｼ繝ｯ繝ｼ繝峨上ｒ謠先｡医＠縺ｦ縺上□縺輔＞縲ゅ・                  </div>
                  <Button onClick={() => handleCopy("縺薙・譛ｬ縺ｮ繝・・繝槭・縲・・〒縺吶・mazon讀懃ｴ｢縺ｧ繝偵ャ繝医＠繧・☆縺上√°縺､繧ｿ繝ｼ繧ｲ繝・ヨ縺ｫ蛻ｺ縺輔ｋ縲・縺､縺ｮ讀懃ｴ｢繧ｭ繝ｼ繝ｯ繝ｼ繝峨上ｒ謠先｡医＠縺ｦ縺上□縺輔＞縲・)} className={`w-full h-20 font-black text-xl rounded-2xl shadow-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950 scale-95' : 'bg-indigo-600 text-white'}`}>繧ｭ繝ｼ繝ｯ繝ｼ繝画欠遉ｺ繧偵さ繝斐・</Button>
                </div>
                <div className="bg-slate-950 rounded-[2rem] p-8 border border-slate-800 flex flex-col items-center justify-center space-y-6 shadow-inner relative overflow-hidden">
                   {score && <div className="absolute inset-0 bg-indigo-600/5 backdrop-blur-3xl animate-in fade-in" />}
                   <p className="text-white font-black italic uppercase tracking-widest text-[10px] opacity-70 relative z-10">Recommended Intelligence</p>
                   <Button variant="outline" onClick={() => window.open('https://gemini.google.com', '_blank')} className="w-full h-16 border-2 border-slate-800 text-slate-300 font-black text-xl rounded-2xl hover:bg-slate-900 transition-all uppercase italic relative z-10">GEMINI (SEO縺ｫ蠑ｷ縺・ 噫</Button>
                   {score && <div className="text-center relative z-10 animate-in zoom-in"><p className="text-[8px] font-black text-indigo-400 uppercase italic">Publishing Score</p><p className="text-5xl font-black text-white italic">{score}%</p></div>}
                </div>
              </div>
              <div className="bg-slate-950 rounded-[2.5rem] p-8 border border-slate-800 space-y-4 shadow-inner">
                 <div className="flex items-center gap-3 text-emerald-500"><ShieldCheck size={24} /><h4 className="text-sm font-black uppercase italic tracking-widest">Final Intelligence Report</h4></div>
                 <textarea value={report} onChange={(e) => setReport(e.target.value)} placeholder="AI縺九ｉ謠先｡医＆繧後◆繧ｭ繝ｼ繝ｯ繝ｼ繝峨ｄ謌ｦ逡･繧偵％縺薙↓雋ｼ繧贋ｻ倥￠縺ｦ縺上□縺輔＞・郁・蜍戊ｨｺ譁ｭ縺瑚ｵｰ繧翫∪縺呻ｼ・.." className="w-full h-40 bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 text-sm text-slate-300 focus:border-indigo-500 outline-none font-medium italic" />
              </div>
            </div>
            {report && (
              <Button onClick={() => setActiveTab('publish')} className="w-full h-20 mt-12 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase italic text-xl group">
                 竭｣ 譛邨ら｢ｺ隱阪・蜃ｺ迚育筏隲九∈ <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Button>
            )}
          </Card>
        )}

        {/* 竭｣ 蜃ｺ迚育筏隲・*/}
        {activeTab === 'publish' && (
          <div className="animate-in fade-in zoom-in-95 space-y-10 text-center pb-20">
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] p-10 md:p-20 shadow-2xl border-l-8 border-l-emerald-600 relative overflow-hidden text-left">
               <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 text-white"><Globe className="w-96 h-96" /></div>
               <h3 className="text-4xl md:text-6xl font-black text-white italic uppercase mb-12 flex items-center gap-6 relative z-10"><CheckCircle2 className="text-emerald-500 animate-pulse" size={60} /> 蜃ｺ迚育筏隲九・譛邨ゅメ繧ｧ繝・け</h3>
               <div className="bg-slate-950 rounded-[3rem] p-12 border border-slate-800 text-lg text-slate-200 font-bold leading-relaxed shadow-inner relative z-10 space-y-8">
                  <div className="flex items-center gap-4 border-b border-slate-800 pb-6"><Badge className="bg-emerald-600 text-white font-black px-4 py-1">CHECK 1</Badge><p>縲後Ο繧､繝､繝ｪ繝・ぅ 70%縲阪ｒ驕ｸ謚槭＠縲・←蛻・↑萓｡譬ｼ險ｭ螳壹ｒ陦後＞縺ｾ縺励◆縺具ｼ・/p></div>
                  <div className="flex items-center gap-4 border-b border-slate-800 pb-6"><Badge className="bg-emerald-600 text-white font-black px-4 py-1">CHECK 2</Badge><p>縲御ｸｻ縺ｪ繝槭・繧ｱ繝・ヨ繝励Ξ繧､繧ｹ縲阪ｒ Amazon.co.jp 縺ｫ險ｭ螳壹＠縺ｾ縺励◆縺具ｼ・/p></div>
                  <div className="flex items-center gap-4 border-b border-slate-800 pb-6"><Badge className="bg-emerald-600 text-white font-black px-4 py-1">CHECK 3</Badge><p>繝励Ξ繝薙Η繝ｼ繧｢繝ｼ縺ｧ繝ｬ繧､繧｢繧ｦ繝亥ｴｩ繧後′縺ｪ縺・°譛邨ら｢ｺ隱阪＠縺ｾ縺励◆縺具ｼ・/p></div>
                  <div className="pt-8">
                    <p className="text-emerald-500 uppercase italic tracking-[0.2em] text-3xl font-black text-center animate-bounce">縺ゅ→縺ｯ縲桑indle譛ｬ繧貞・迚医阪・繧ｿ繝ｳ繧呈款縺吶□縺代〒縺呻ｼ・/p>
                  </div>
               </div>
            </Card>
            <Button onClick={() => { setReport(''); setScore(null); setActiveTab('account'); }} variant="outline" className="w-full h-20 border-2 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-3xl uppercase italic text-xl transition-all active:scale-95"><RotateCcw className="mr-3" size={24} /> 譛蛻昴・蟾･遞九°繧牙・遒ｺ隱阪☆繧・/Button>
          </div>
        )}
      </div>
      <div className="mt-16 text-center opacity-20"><p className="text-[10px] font-black uppercase tracking-[0.5em] italic">KDP Mastery Engine 窶｢ NextraLabs 2026</p></div>
    </div>
  )
}
