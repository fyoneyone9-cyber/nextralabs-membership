'use client'


import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Network, Search, Loader2, Info, ChevronRight, UserPlus, FileText, Zap, MessageSquare, Calendar, ArrowRight } from 'lucide-react'

type Step = 1 | 2 | 3

export default function OfficePoliticsGraph() {
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [dataInput, setDataInput] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)

  const handleStartAnalysis = () => {
    if (!dataInput.trim()) return
    setIsAnalyzing(true)
    // 蠢・炊蟄ｦ逧・↓縲梧ｷｱ縺剰・∴縺ｦ縺・ｋ縲肴ｼ泌・縺ｮ縺溘ａ縺ｮ繧ｦ繧ｧ繧､繝・    setTimeout(() => {
      setAnalysisResult({
        keyman: "菴占陸 驛ｨ髟ｷ",
        description: "蜈ｬ蠑上↑邨・ｹ泌峙莉･荳翫・蠖ｱ髻ｿ蜉帙ょｮ溯ｳｪ逧・↑諢乗晄ｱｺ螳壹ｒ陬上〒謠｡縺｣縺ｦ縺・∪縺吶・,
        relationships: [
          { from: "縺ゅ↑縺・, to: "逕ｰ荳ｭ 隱ｲ髟ｷ", type: "蜊泌鴨", score: 85 },
          { from: "逕ｰ荳ｭ 隱ｲ髟ｷ", to: "菴占陸 驛ｨ髟ｷ", type: "萓晏ｭ・, score: 92 },
        ]
      })
      setIsAnalyzing(false)
      setCurrentStep(3)
    }, 2000)
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-12 min-h-screen text-slate-200 font-sans">
      
      {/* 閥 HEADER */}
      <div className="text-center space-y-4 mb-16">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-[2rem] bg-indigo-600 shadow-2xl shadow-indigo-500/20 mb-4">
          <Network className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">遉ｾ蜀・帆豐ｻ 逶ｸ髢｢蝗ｳ</h1>
        <p className="text-xl text-slate-400 font-medium">邨・ｹ斐・縲梧悽蠖薙・莠ｺ髢馴未菫ゅ阪ｒAI縺悟庄隕門喧縲・/p>
      </div>

      {/* 泙 STEP PROGRESS */}
      <div className="flex items-center justify-center gap-12 mb-20">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`flex items-center gap-3 ${currentStep === s ? 'opacity-100 scale-125' : 'opacity-30'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${currentStep === s ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
              {s}
            </div>
            <span className="text-sm font-bold uppercase tracking-widest">{s === 1 ? 'Data' : s === 2 ? 'Analysis' : 'Graph'}</span>
          </div>
        ))}
      </div>

      {/* 鳩 STEP CONTENT */}
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* --- STEP 1: INPUT --- */}
        {currentStep === 1 && (
          <div className="space-y-8 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center">繝・・繧ｿ繧定ｲｼ繧贋ｻ倥￠縺ｦ縺上□縺輔＞</h2>
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <CardContent className="p-10 space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-slate-950 rounded-2xl border border-indigo-500/20 flex flex-col items-center gap-3">
                    <MessageSquare className="h-8 w-8 text-indigo-400" />
                    <span className="font-bold text-lg text-white text-center leading-tight">Slack<br/>繝｡繝ｳ繧ｷ繝ｧ繝ｳ螻･豁ｴ</span>
                  </div>
                  <div className="p-6 bg-slate-950 rounded-2xl border border-blue-500/20 flex flex-col items-center gap-3">
                    <Calendar className="h-8 w-8 text-blue-400" />
                    <span className="font-bold text-lg text-white text-center leading-tight">繧ｫ繝ｬ繝ｳ繝繝ｼ<br/>莨夊ｭｰ繝・・繧ｿ</span>
                  </div>
                </div>
                
                <textarea 
                  value={dataInput}
                  onChange={(e) => setDataInput(e.target.value)}
                  placeholder="縺薙％縺ｫSlack縺ｮ螻･豁ｴ繧・ｼ夊ｭｰ繝ｪ繧ｹ繝医ｒ繧ｳ繝斐・縺励※縺上□縺輔＞..."
                  className="w-full h-80 bg-slate-950 border-2 border-slate-800 rounded-3xl p-8 text-2xl font-medium focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-800 text-white leading-relaxed"
                />
                
                <Button 
                  onClick={handleStartAnalysis}
                  disabled={!dataInput.trim() || isAnalyzing}
                  className="w-full h-24 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-3xl rounded-3xl shadow-2xl shadow-indigo-600/30 gap-4"
                >
                  {isAnalyzing ? <Loader2 className="h-10 w-10 animate-spin" /> : <><Search className="h-10 w-10" /> 隗｣譫舌ｒ髢句ｧ九☆繧・/>}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* --- STEP 3: RESULT --- */}
        {currentStep === 3 && analysisResult && (
          <div className="space-y-12 max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center">隗｣譫舌′螳御ｺ・＠縺ｾ縺励◆</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Keyman Card */}
              <Card className="bg-indigo-950/30 border-2 border-indigo-500/50 rounded-[2.5rem] p-10 shadow-2xl">
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-4xl shadow-xl">荘</div>
                  <div>
                    <Badge className="bg-indigo-500 text-white text-lg px-6 py-1 mb-3">譛驥崎ｦ√く繝ｼ繝槭Φ</Badge>
                    <h3 className="text-5xl font-black text-white tracking-tight">{analysisResult.keyman}</h3>
                  </div>
                  <p className="text-xl text-slate-300 leading-relaxed font-medium">
                    {analysisResult.description}
                  </p>
                </div>
              </Card>

              {/* Relationship List */}
              <div className="space-y-6">
                <h4 className="text-2xl font-bold text-slate-400 px-4">讀懷・縺輔ｌ縺滄未菫よｧ</h4>
                {analysisResult.relationships.map((rel: any, i: number) => (
                  <div key={i} className="bg-slate-900 border-2 border-slate-800 p-8 rounded-3xl flex items-center justify-between shadow-xl">
                    <div className="flex flex-col">
                      <span className="text-2xl font-black text-white">{rel.from}</span>
                      <ArrowRight className="h-6 w-6 text-indigo-400 my-1" />
                      <span className="text-2xl font-black text-white">{rel.to}</span>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-emerald-500/20 text-emerald-400 text-xl px-4 py-1 mb-2 border-0">{rel.type}</Badge>
                      <div className="text-4xl font-black text-white font-mono">{rel.score}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              onClick={() => setCurrentStep(1)}
              variant="outline"
              className="w-full h-16 border-2 border-slate-800 text-slate-400 text-xl font-bold rounded-3xl hover:bg-white/5"
            >
              竊・繝・・繧ｿ繧呈ｶ医＠縺ｦ譛蛻昴°繧峨ｄ繧顔峩縺・            </Button>
          </div>
        )}
      </div>

      {/* 氏 PRO TIP */}
      <div className="max-w-4xl mx-auto mt-20 p-10 bg-indigo-500/5 border border-indigo-500/10 rounded-[3rem] flex gap-8 items-start">
        <div className="bg-indigo-500/20 p-6 rounded-2xl text-indigo-400 flex-shrink-0">
          <Info className="h-10 w-10" />
        </div>
        <div>
          <h4 className="text-2xl font-bold text-white mb-3">AI隗｣譫舌・繧ｳ繝・/h4>
          <p className="text-lg text-slate-400 leading-relaxed">
            Slack縺ｮ縲悟・蜩｡縺ｫ霑比ｿ｡縲阪ｈ繧翫檎音螳壹・蛟倶ｺｺ縺ｸ縺ｮ繝ｪ繧｢繧ｯ繧ｷ繝ｧ繝ｳ縲阪ｒ蜆ｪ蜈育噪縺ｫ蛻・梵縺励∪縺吶・            邨・ｹ斐・繝懊ヨ繝ｫ繝阪ャ繧ｯ縺ｨ縺ｪ縺｣縺ｦ縺・ｋ莠ｺ迚ｩ繧・∝ｮ溯ｳｪ逧・↑繧､繝ｳ繝輔Ν繧ｨ繝ｳ繧ｵ繝ｼ繧帝ｫ倥＞邊ｾ蠎ｦ縺ｧ迚ｹ螳壼庄閭ｽ縺ｧ縺吶・          </p>
        </div>
      </div>
    
      </div>
  )
}


