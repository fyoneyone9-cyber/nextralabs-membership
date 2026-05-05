'use client'
;

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Zap, Mail, Building2, Send, Search, X, ShieldCheck, Copy, Sparkles, Bot, Heart, AlertCircle, HelpCircle } from "lucide-react";
import { toast } from "sonner";

export default function SalesAutomation() {
  const [domain, setDomain] = useState('');
  const [targetPerson, setTargetPerson] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // 莨∵･ｭ繝励Μ繧ｻ繝・ヨ
  const presets = [
    { name: 'TOYOTA', domain: 'toyota.jp' },
    { name: 'SONY', domain: 'sony.jp' },
    { name: 'SoftBank', domain: 'softbank.jp' },
    { name: 'Nintendo', domain: 'nintendo.co.jp' },
    { name: 'Rakuten', domain: 'rakuten.co.jp' }
  ];

  const handleCopyAndGo = (url: string) => {
    if (!domain) return toast.error("莨∵･ｭ繝峨Γ繧､繝ｳ繧貞・蜉帙＠縺ｦ縺上□縺輔＞");
    
    // 繝励Ο繝ｳ繝励ヨ繧偵け繝ｩ繧､繧｢繝ｳ繝亥・縺ｧ荳迸ｬ縺ｧ逕滓・・・00繧ｨ繝ｩ繝ｼ縺ｮ蠢・・縺ｪ縺暦ｼ・
    const magicPrompt = `
縺ゅ↑縺溘・雜・ｸ豬√・繧､繝ｳ繧ｵ繧､繝峨そ繝ｼ繝ｫ繧ｹ諡・ｽ楢・〒縺吶・
莉･荳九・莨∵･ｭ縺ｫ蟇ｾ縺励¨extraLabs縺ｮAI閾ｪ蜍募喧繧ｽ繝ｪ繝･繝ｼ繧ｷ繝ｧ繝ｳ繧呈署譯医☆繧区怙鬮倥・蝟ｶ讌ｭ繝｡繝ｼ繝ｫ繧貞濤遲・＠縺ｦ縺上□縺輔＞縲・

縲舌ち繝ｼ繧ｲ繝・ヨ莨∵･ｭ繝・・繧ｿ縲・
繝ｻ莨∵･ｭ繝峨Γ繧､繝ｳ: ${domain}
繝ｻ諡・ｽ楢・錐: ${targetPerson || "縺疲球蠖楢・}讒・
繝ｻ迚ｹ險倅ｺ矩・ ${prompt || "迚ｹ縺ｫ縺ｪ縺・}

縲仙ｮ溯｡梧欠遉ｺ縲・
1. 縺ゅ↑縺溘・謖√▽譛譁ｰ縺ｮGoogle讀懃ｴ｢讖溯・繧剃ｽｿ縺・・{domain} 縺ｮ莠区･ｭ蜀・ｮｹ繧・怙譁ｰ繝九Η繝ｼ繧ｹ繧堤音螳壹＠縺滉ｸ翫〒縲√◎縺ｮ莨∵･ｭ迚ｹ譛峨・隱ｲ鬘後ｒ驪ｭ縺乗耳貂ｬ縺励※縺上□縺輔＞縲・
2. NextraLabs縺梧署萓帙☆繧帰I謚陦難ｼ育判蜒剰ｧ｣譫舌∵･ｭ蜍呵・蜍募喧縲・｡ｧ螳｢蟇ｾ蠢廣I遲会ｼ峨′縲√◎縺ｮ莨∵･ｭ縺ｮ蛻ｩ逶翫↓縺ｩ縺・峩邨舌☆繧九°蜈ｷ菴鍋噪縺ｫ謠先｡医＠縺ｦ縺上□縺輔＞縲・
3. 逶ｸ謇九・萓｡蛟､繧貞ｰ企㍾縺励∬ｿ比ｿ｡邇・ｒ譛螟ｧ蛹悶☆繧九檎衍諤ｧ逧・〒辭ｱ諢上・縺ゅｋ譁・ｫ縲阪ｒ譌･譛ｬ隱槭〒菴懈・縺励※縺上□縺輔＞縲・
4. 莉ｶ蜷肴｡医ｂ縲梧昴ｏ縺夐幕縺阪◆縺上↑繧九ち繧､繝医Ν縲阪ｒ3縺､豺ｻ縺医※縺上□縺輔＞縲・
`;
    
    navigator.clipboard.writeText(magicPrompt.trim());
    setIsCopied(true);
    toast.success("謌ｦ逡･髑大ｮ壽枚繧偵さ繝斐・縺励∪縺励◆・∬ｲｼ繧贋ｻ倥￠繧九□縺代〒縺吶・);
    
    setTimeout(() => {
      window.open(url, '_blank');
    }, 100);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen font-sans bg-slate-50/50 text-left text-slate-900 antialiased">
      <Card className="border-none bg-white shadow-2xl rounded-[3.5rem] overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[750px]">
          {/* 蟾ｦ蛛ｴ・壼・譫舌そ繧ｯ繧ｷ繝ｧ繝ｳ */}
          <div className="lg:w-1/2 p-12 bg-slate-900 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-emerald-400 to-indigo-600"></div>
            <div className="space-y-12">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.3)] animate-pulse">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div>
                   <h1 className="text-3xl font-black italic tracking-tighter leading-none">SALES AI SCOPE</h1>
                   <p className="text-blue-400 text-[10px] font-black tracking-[0.4em] mt-2 uppercase opacity-80">NextraLabs Context Engine</p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">1. Choose or Enter Target</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {presets.map((p) => (
                      <Button key={p.name} variant="outline" size="sm" className="bg-white/5 border-slate-700 text-slate-300 hover:bg-blue-600 hover:text-white rounded-full font-black text-[10px] transition-all" onClick={() => setDomain(p.domain)}>
                        {p.name}
                      </Button>
                    ))}
                  </div>
                  <Input placeholder="example.com" className="bg-black/40 border-slate-800 text-white h-16 rounded-[1.5rem] text-xl font-black focus:border-blue-500 transition-all shadow-inner" value={domain} onChange={(e) => setDomain(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">2. Target Identity</label>
                  <Input placeholder="諡・ｽ楢・錐" className="bg-black/40 border-slate-800 text-white h-14 rounded-[1.2rem] text-lg font-bold" value={targetPerson} onChange={(e) => setTargetPerson(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">3. Custom Request</label>
                  <Textarea placeholder="逶ｸ謇九・隱ｲ鬘後∬・遉ｾ縺ｮ蠑ｷ縺ｿ縺ｪ縺ｩ..." className="bg-black/40 border-slate-800 text-white min-h-[120px] rounded-[1.5rem] font-bold text-lg p-5" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 flex items-start gap-4 backdrop-blur-sm shadow-inner">
               <HelpCircle className="text-blue-400 w-6 h-6 mt-1 flex-shrink-0" />
               <p className="text-slate-400 text-xs font-bold leading-relaxed">繝峨Γ繧､繝ｳ繧貞・蜉帙☆繧九□縺代〒縲、I縺後◎縺ｮ莨∵･ｭ縺ｮ譛譁ｰ迥ｶ豕√ｒ繝ｪ繧ｵ繝ｼ繝√ゆｸ也阜譛鬮伜ｳｰ縺ｮAI遏･閭ｽ・・emini Pro遲会ｼ峨・閭ｽ蜉帙ｒ譛螟ｧ蛹悶☆繧九・繝ｭ繝ｳ繝励ヨ繧呈ｧ狗ｯ峨＠縺ｾ縺吶・/p>
            </div>
          </div>

          {/* 蜿ｳ蛛ｴ・壹・繝ｼ繧ｿ繝ｫ繧ｻ繧ｯ繧ｷ繝ｧ繝ｳ */}
          <div className="lg:w-1/2 p-12 flex flex-col bg-white overflow-hidden border-l border-slate-100">
            <div className="flex-1 space-y-12">
              <div className="text-center space-y-6">
                 <div className="space-y-2">
                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">Step 2: Launch Analysis</p>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">繝懊ち繝ｳ繧呈款縺吶→髑大ｮ壽枚縺瑚・蜍輔さ繝斐・縺輔ｌ縺ｾ縺・/p>
                 </div>
                 
                 <div className="grid grid-cols-1 gap-5">
                    <Button onClick={() => handleCopyAndGo('https://gemini.google.com/')} className="h-28 bg-blue-600 hover:bg-blue-500 text-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(37,99,235,0.3)] flex flex-col items-center justify-center group active:scale-95 transition-all border-none relative overflow-hidden">
                      <div className="flex items-center gap-4 text-3xl font-black italic tracking-tighter uppercase relative z-10 text-white"><Sparkles className="w-8 h-8 text-amber-300" /> Gemini縺ｧ髑大ｮ・/div>
                      <span className="text-[10px] text-blue-100 font-black uppercase tracking-widest relative z-10 opacity-90">譛譁ｰ繝ｪ繧ｵ繝ｼ繝・・・Grounding縺ｫ譛蠑ｷ</span>
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </Button>
                    <div className="grid grid-cols-2 gap-5">
                      <Button onClick={() => handleCopyAndGo('https://chatgpt.com/')} className="h-20 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2rem] shadow-xl flex items-center justify-center gap-3 font-black active:scale-95 transition-all border-none text-xl italic tracking-tighter uppercase"><Bot className="w-7 h-7" /> ChatGPT</Button>
                      <Button onClick={() => handleCopyAndGo('https://claude.ai/')} className="h-20 bg-orange-600 hover:bg-orange-500 text-white rounded-[2rem] shadow-xl flex items-center justify-center gap-3 font-black active:scale-95 transition-all border-none text-xl italic tracking-tighter uppercase"><Heart className="w-7 h-7 fill-white" /> Claude</Button>
                    </div>
                 </div>
              </div>

              {isCopied && (
                <div className="p-10 bg-red-50 rounded-[3rem] border-4 border-red-100 animate-in fade-in slide-in-from-top-6 shadow-2xl relative overflow-hidden text-left">
                   <div className="absolute -top-6 -right-6 w-32 h-32 bg-red-100 rounded-full opacity-30 flex items-center justify-center"><AlertCircle className="w-16 h-16 text-red-500" /></div>
                   <div className="flex flex-col gap-1 mb-8">
                     <div className="flex items-center gap-3 text-red-700 font-black italic text-2xl uppercase tracking-tight text-left">雋ｼ繧贋ｻ倥￠繧九□縺托ｼ・/div>
                     <p className="text-red-600 font-black text-xs tracking-widest uppercase opacity-80">髑大ｮ壽枚縺ｯ縺吶〒縺ｫ繧ｳ繝斐・縺輔ｌ縺ｦ縺・∪縺・/p>
                   </div>
                   <div className="space-y-6 text-lg text-red-950 font-black leading-tight text-left">
                     <p className="flex items-start gap-4 transition-all hover:translate-x-1"><span className="bg-red-600 text-white w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 mt-0.5 shadow-md font-sans font-black">1</span><span>AI繧｢繝励Μ縺瑚ｵｷ蜍輔＠縺溘ｉ縲∝・蜉帶ｬ・ｒ髟ｷ謚ｼ縺・/span></p>
                     <p className="flex items-start gap-4 transition-all hover:translate-x-1"><span className="bg-red-600 text-white w-8 h-8 rounded-xl flex items-center justify-center text-xs flex-shrink-0 mt-0.5 shadow-md font-sans font-black">2</span><span>縺昴・縺ｾ縺ｾ <span className="underline decoration-red-500 decoration-[3px] underline-offset-4 font-black text-red-600">縲瑚ｲｼ繧贋ｻ倥￠縲・/span> 縺励※騾∽ｿ｡・・/span></p>
                     <p className="flex items-start gap-4 transition-all hover:translate-x-1"><span className="bg-red-600 text-white w-8 h-8 rounded-xl flex items-center justify-center text-xs flex-shrink-0 mt-0.5 shadow-md font-sans font-black">3</span><span>譛蠑ｷ縺ｮ謠先｡医Γ繝ｼ繝ｫ縺檎函謌舌＆繧後∪縺・/span></p>
                   </div>
                </div>
              )}
            </div>
            <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] font-sans">
              <span>NextraLabs Context System</span>
              <span>Final Release v4.0</span>
            </div>
          </div>
        </div>
      </Card>
    
      </div>
  );
}


