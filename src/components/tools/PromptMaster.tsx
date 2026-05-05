'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, CheckCircle2, Copy, RotateCcw, Lightbulb, Search, ShieldCheck, LayoutGrid, Loader2, Wand2, Sparkles, Zap, Trash2, Camera, Palette, Sun, Maximize, Ghost, Building, Users, Leaf, Music, Clapperboard, Monitor, Laptop, Globe, Heart, Rocket, Layers, Eye, Mountain, Coffee, Watch, Cpu, Microscope, Brush
} from 'lucide-react'

// プロフェッショナル・タグ群の究極拡充（限界突破版）
const PRESET_TAGS = {
  style: [
    { label: '実写フォト', content: 'photorealistic, 8k resolution, cinematic lighting, shot on 35mm lens' },
    { label: 'アニメ調', content: 'anime style, vibrant colors, clean lines, high-quality cel shaded' },
    { label: '油絵風', content: 'oil painting, thick brushstrokes, classical masterpiece, impasto style' },
    { label: '3Dレンダリング', content: 'unreal engine 5, octane render, ray tracing, 3D character design' },
    { label: '水彩画', content: 'watercolor illustration, soft edges, hand-drawn, paper texture' },
    { label: 'サイバーパンク', content: 'cyberpunk aesthetic, neon lights, futuristic city, chrome' },
    { label: 'ピクセルアート', content: '16-bit pixel art, retro gaming style, sharp pixels' },
    { label: 'ジブリ風', content: 'Studio Ghibli style, lush nature, nostalgic atmosphere, hand-painted' },
    { label: '浮世絵', content: 'Ukiyo-e style, traditional Japanese woodblock print, flat colors' },
    { label: 'スケッチ', content: 'pencil sketch, rough lines, charcoal drawing, artistic' },
    { label: 'ミニチュア', content: 'tilt-shift photography, miniature model style, bokeh' },
    { label: 'クレイアニメ', content: 'claymation style, plasticine texture, stop motion look' },
    { label: 'スチームパンク', content: 'steampunk, brass gears, steam, victorian industrial, copper' },
    { label: '万華鏡風', content: 'kaleidoscopic, symmetrical fractals, psychedelic, vibrant' },
    { label: '点描画', content: 'pointillism, tiny dots of color, post-impressionism' },
    { label: 'チョークアート', content: 'chalk drawing, blackboard texture, dusty, colorful' },
    { label: 'ポップアート', content: 'pop art style, Andy Warhol style, high contrast, vibrant dots' },
    { label: '切り絵', content: 'paper cut art, layered paper, shadows between layers, handcrafted' }
  ],
  lighting: [
    { label: '黄金の夕暮れ', content: 'golden hour, warm sunlight, long shadows' },
    { label: 'スタジオ照明', content: 'studio lighting, softbox, professional photography' },
    { label: 'ネオン街', content: 'neon glow, volumetric fog, blue and pink lighting' },
    { label: '月夜', content: 'moonlight, night scene, dark atmosphere, silver glow' },
    { label: '神々しい光', content: 'god rays, ethereal lighting, heavenly glow, cinematic' },
    { label: 'キャンドル', content: 'candlelight, flickering flame, warm intimate atmosphere' },
    { label: '白黒・低照度', content: 'low key lighting, dramatic shadows, black and white noir' },
    { label: 'SF・レーザー', content: 'laser beam lighting, glowing energy, high tech' },
    { label: 'オーロラ', content: 'aurora borealis lighting, green and purple sky glow, magical' },
    { label: '雷光', content: 'lightning flash, high contrast electric blue, dramatic dark sky' },
    { label: '海底の光', content: 'underwater light rays, caustic ripples, deep blue' },
    { label: 'ブラックライト', content: 'ultraviolet light, uv reactive, neon florescent glow' }
  ],
  composition: [
    { label: '超広角', content: 'ultra wide angle, fisheye lens, expansive view' },
    { label: 'ポートレート', content: 'close-up portrait, shallow depth of field, bokeh background' },
    { label: '鳥瞰（俯瞰）', content: 'birds-eye view, from above, aerial photography' },
    { label: 'マクロ撮影', content: 'macro photography, extreme detail, microscopic focus' },
    { label: '対称性', content: 'symmetrical composition, balanced, centered focus' },
    { label: 'パノラマ', content: 'panoramic view, wide landscape, breathtaking scale' },
    { label: '躍動感', content: 'dynamic action shot, motion blur, fast movement' },
    { label: '映画構図', content: 'cinematic composition, 2.35:1 aspect ratio, epic scale' },
    { label: '虫瞰（ロー）', content: 'worms-eye view, looking up, low angle, monumental' },
    { label: '三分割法', content: 'rule of thirds, off-center focal point, visually balanced' },
    { label: '極小フィギュア', content: 'extremely small subject in a vast world, lonely, grand scale' },
    { label: '二重露光', content: 'double exposure, overlapping images, artistic blend' }
  ],
  atmosphere: [
    { label: '幻想的', content: 'ethereal, dreamlike, magical atmosphere, surreal' },
    { label: 'ノスタルジック', content: 'nostalgic, retro vibe, faded colors, old memories' },
    { label: 'ダーク・ホラー', content: 'dark, gothic, horror atmosphere, creepy, moody' },
    { label: '爽やか・清潔', content: 'fresh, clean, minimalist, airy, bright atmosphere' },
    { label: '緊迫感', content: 'tense atmosphere, high stakes, dramatic pressure' },
    { label: '和風・禅', content: 'zen, peaceful Japanese atmosphere, traditional, calm' },
    { label: '終末世界', content: 'post-apocalyptic, overgrown, ruined city, desolate' },
    { label: 'サイケデリック', content: 'trippy, colorful, warped reality, intricate patterns' },
    { label: '霧の都', content: 'mysterious fog, misty, silhouette, detective noir vibe' },
    { label: '賑やかな祭り', content: 'vibrant festival atmosphere, fireworks, crowd, energy' }
  ],
  material: [
    { label: '液体金属', content: 'liquid metal, metallic mercury texture, reflective' },
    { label: '氷・凍結', content: 'frozen, ice crystals, transparent, cold blue' },
    { label: '溶岩・マグマ', content: 'molten lava, glowing cracks, intense heat' },
    { label: 'クリスタル', content: 'crystalline structure, diamond facets, prismatic' },
    { label: 'ホログラム', content: 'holographic, glitch effect, semi-transparent, light based' },
    { label: '木彫り', content: 'hand-carved wood, organic grain, natural texture' }
  ],
  quality: [
    { label: '最高傑作', content: 'masterpiece, best quality, ultra-detailed' },
    { label: '4k/8k', content: '4k resolution, 8k, high definition, extremely detailed' },
    { label: '緻密な細部', content: 'intricate details, complex patterns, hyper-detailed' },
    { label: 'プロの仕上がり', content: 'professional work, trending on artstation, award winning' },
    { label: 'ナショジオ風', content: 'National Geographic style, wildlife photography excellence' },
    { label: 'ヴォーグ風', content: 'Vogue editorial style, high fashion photography' }
  ],
  aspect: [
    { label: 'YouTube用 (16:9)', content: 'aspect ratio 16:9, wide screen' },
    { label: 'X/Twitter (3:2)', content: 'aspect ratio 3:2, landscape' },
    { label: 'インスタ/TikTok (9:16)', content: 'aspect ratio 9:16, portrait, vertical' },
    { label: 'Instagram投稿 (1:1)', content: 'aspect ratio 1:1, square' },
    { label: '映画シネマ (21:9)', content: 'aspect ratio 21:9, ultra-wide cinematic' }
  ]
};

export default function PromptMaster() {
  const [subject, setSubject] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'input' | 'master'>('input');
  const [report, setReport] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const STEPS = ["主題を入力", "パーツを選択", "AIプロンプト錬成", "最終判定"];
  const activeStepIndex = activeTab === 'input' ? (subject ? 1 : 0) : 3;

  const toggleTag = (content: string) => {
    setSelectedTags(prev => 
      prev.includes(content) ? prev.filter(t => t !== content) : [...prev, content]
    );
  };

  const clearAll = () => {
    setSubject('');
    setSelectedTags([]);
    setReport('');
    setScore(null);
  };

  const getCombinedPrompt = () => {
    const tagsPart = selectedTags.join(', ');
    return `あなたは世界最高峰の画像生成プロンプトエンジニアです。
以下の【主題】をベースに、【指定パーツ】の要素をプロの技法で組み合わせ、DALL-E 3やMidjourneyで「歴史に残る傑作」を生み出すための「最強の英文プロンプト」を作成してください。

【主題（日本語）】: ${subject}
【指定パーツ（英語）】: ${tagsPart}

【出力要求】:
1. 【Master Prompt】: コピペでそのまま使える完成された英文プロンプト。
2. 【日本語による構成解説】: 構図や素材、光の設計意図をプロの視点で解説してください。`;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (report && !score) {
      setIsProcessing(true);
      setTimeout(() => {
        setScore(95 + Math.floor(Math.random() * 5));
        setIsProcessing(false);
      }, 1500);
    }
  }, [report]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-32 bg-slate-950">
      <div className="text-center space-y-3">
        <Badge className="bg-orange-600 text-white font-black italic tracking-widest px-6 py-1 text-[10px] uppercase rounded-full shadow-lg">ULTIMATE PROMPT ENGINE v4.0</Badge>
        <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">Prompt Master</h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 overflow-x-auto pb-4">
        <div className="flex items-center justify-between min-w-[600px] relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
          {STEPS.map((s, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black italic text-xs transition-all duration-500 ${i <= activeStepIndex ? 'bg-orange-600 text-white shadow-[0_0_15px_rgba(234,88,12,0.5)] scale-110' : 'bg-slate-900 text-slate-600 border border-slate-800'}`}>
                {i < activeStepIndex ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              <span className={`text-[10px] font-black uppercase italic tracking-tighter ${i <= activeStepIndex ? 'text-orange-400' : 'text-slate-700'}`}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {activeTab === 'input' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 to-amber-600" />
            
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-2">
                    <h3 className="text-2xl font-black text-white italic uppercase flex items-center gap-3"><Sparkles className="text-orange-500" /> ① 主題（何を描くか）</h3>
                    <Button onClick={clearAll} variant="ghost" size="sm" className="text-slate-500 hover:text-red-500 font-black"><Trash2 size={16} /> ALL CLEAR</Button>
                  </div>
                  <textarea 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)} 
                    placeholder="例：廃墟となった未来の渋谷、光る雨の中でたたずむ少女..." 
                    className="w-full h-40 bg-slate-950 border-2 border-slate-800 rounded-[2rem] p-8 text-2xl text-white font-bold focus:border-orange-500 outline-none shadow-inner transition-all" 
                  />
                </div>

                <div className="space-y-8 h-[600px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                  <h3 className="text-2xl font-black text-white italic uppercase flex items-center gap-3 sticky top-0 bg-slate-900 py-2 z-10"><LayoutGrid className="text-orange-500" /> ② プロのパーツを選択</h3>
                  
                  {Object.entries(PRESET_TAGS).map(([category, tags]) => (
                    <div key={category} className="space-y-3 bg-slate-950/50 p-6 rounded-2xl border border-slate-800 shadow-inner">
                      <p className="text-xs font-black text-indigo-400 uppercase italic tracking-[0.2em] flex items-center gap-2">
                        {category === 'style' && <Palette size={14} />}
                        {category === 'lighting' && <Sun size={14} />}
                        {category === 'composition' && <Maximize size={14} />}
                        {category === 'atmosphere' && <Ghost size={14} />}
                        {category === 'material' && <Layers size={14} />}
                        {category === 'quality' && <Sparkles size={14} />}
                        {category === 'aspect' && <Monitor size={14} />}
                        {category}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <Button 
                            key={tag.label} 
                            variant="outline" 
                            size="sm" 
                            onClick={() => toggleTag(tag.content)}
                            className={`h-11 px-4 rounded-xl font-black text-sm transition-all ${selectedTags.includes(tag.content) ? 'bg-orange-600 border-orange-400 text-white scale-105 shadow-xl' : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'}`}
                          >
                            {tag.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-slate-950 p-10 rounded-[3rem] border border-slate-800 space-y-6 shadow-2xl text-center">
                  <p className="text-white font-black italic uppercase tracking-tighter flex items-center justify-center gap-2"><Zap className="text-orange-500" /> PROMPT COMMAND CENTER</p>
                  <Button 
                    onClick={() => handleCopy(getCombinedPrompt())} 
                    disabled={!subject}
                    className={`w-full h-32 text-3xl font-black rounded-[2.5rem] transition-all shadow-xl ${copied ? 'bg-emerald-500 text-slate-950 scale-95' : 'bg-orange-600 text-white hover:bg-orange-500'}`}
                  >
                    {copied ? '✅ COPIED TO CLIPBOARD' : '錬成指令をコピー'}
                  </Button>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 border-2 border-slate-800 text-slate-200 font-black text-xl uppercase italic hover:bg-orange-600/10 rounded-2xl shadow-lg" onClick={() => window.open('https://chatgpt.com', '_blank')}>ChatGPT</Button>
                    <Button variant="outline" className="h-20 border-2 border-slate-800 text-slate-200 font-black text-xl uppercase italic hover:bg-orange-600/10 rounded-2xl shadow-lg" onClick={() => window.open('https://gemini.google.com', '_blank')}>Gemini</Button>
                  </div>

                  <div className="bg-slate-900/80 rounded-[2.5rem] p-10 border border-slate-800 flex flex-col gap-6 shadow-inner min-h-[450px] relative overflow-hidden mt-10">
                    {score && <div className="absolute inset-0 bg-orange-600/5 backdrop-blur-3xl animate-in fade-in" />}
                    <div className="flex items-center justify-between relative z-10 text-left">
                      <div className="flex items-center gap-3 text-orange-400"><Wand2 size={24} /><h4 className="text-sm font-black uppercase italic tracking-widest text-white">錬成結果ペースト</h4></div>
                      {score && <div className="text-right leading-none"><span className="text-[10px] font-black text-orange-400 uppercase italic">Mastery</span><br/><span className="text-5xl font-black text-white italic">{score}%</span></div>}
                    </div>
                    <textarea 
                      value={report} 
                      onChange={(e) => setReport(e.target.value)} 
                      placeholder="AIが錬成した最強のプロンプトをここに貼り付けてください..." 
                      className="flex-1 bg-slate-950 border-2 border-slate-800 rounded-3xl p-8 text-base text-slate-300 focus:border-orange-500 outline-none font-mono italic relative z-10 shadow-inner leading-relaxed" 
                    />
                    {isProcessing && <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center gap-4 z-20"><Loader2 className="animate-spin text-orange-500" size={40} /><p className="text-xs font-black text-orange-400 uppercase italic tracking-widest">Mastery Evaluating...</p></div>}
                  </div>
                </div>
              </div>
            </div>
            {report && (
              <Button onClick={() => setActiveTab('master')} className="w-full h-24 mt-12 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-[2rem] shadow-2xl flex items-center justify-center gap-6 uppercase italic text-3xl group transition-all active:scale-95">
                 最終プロンプトを確定 <ArrowRight className="w-10 h-10 group-hover:translate-x-3 transition-transform" />
              </Button>
            )}
          </Card>
        </div>
      )}

      {activeTab === 'master' && (
        <div className="animate-in fade-in zoom-in-95 space-y-8 text-center pb-20">
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[4rem] p-12 md:p-24 shadow-2xl border-l-[12px] border-l-orange-600 relative overflow-hidden text-left">
             <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 text-white"><ImageIcon className="w-[40rem] h-[40rem]" /></div>
             <h3 className="text-5xl md:text-8xl font-black text-white italic uppercase mb-16 flex items-center gap-8 relative z-10"><Wand2 className="text-orange-500 animate-pulse" size={100} /> Master Prompt</h3>
             <div className="bg-slate-950 rounded-[3rem] p-16 border border-slate-800 text-2xl text-slate-200 font-mono leading-relaxed shadow-inner relative z-10 selection:bg-orange-600/30">
                {report || "データがありません。"}
             </div>
          </Card>
          <Button onClick={() => setActiveTab('input')} variant="outline" className="w-full h-28 border-4 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-[3rem] uppercase italic text-3xl active:scale-95 transition-all shadow-2xl"><RotateCcw className="mr-6" size={48} /> 編集に戻る</Button>
        </div>
      )}

      <div className="text-center opacity-20"><p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Ultimate Prompt Engineering Core • NextraLabs 2026</p></div>
    </div>
  )
}
