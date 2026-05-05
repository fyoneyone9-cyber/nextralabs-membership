'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, CheckCircle2, Copy, RotateCcw, Lightbulb, Search, ShieldCheck, LayoutGrid, Wand2, Sparkles, Zap, Trash2, Camera, Palette, Sun, Maximize, Ghost, Layers, Monitor
} from 'lucide-react'

// 皇帝の剣：用途ハブ（武器選択）
const WEAPONS = [
  { 
    id: 'general', 
    label: 'イメージ・アート', 
    desc: '風景、人物、幻想的な世界観', 
    icon: Sparkles, 
    color: 'text-orange-500', 
    bg: 'bg-orange-500/10',
    prompt: "あなたは世界最高峰の画像生成エンジニアです。今すぐ、以下の【主題】と【指定パーツ】を完璧に組み合わせた「高品質な芸術画像」を1枚生成してください。説明不要、画像生成のみを実行せよ。"
  },
  { 
    id: 'logo', 
    label: 'ロゴ作成', 
    desc: '清潔でミニマルな商用デザイン', 
    icon: Wand2, 
    color: 'text-indigo-500', 
    bg: 'bg-indigo-500/10',
    prompt: "あなたは一流のグラフィックデザイナーです。今すぐ、以下の【主題】に基づいた、ミニマルで洗練された「ロゴ・シンボルマーク」を1枚生成してください。白背景、文字なし、ベクター形式のようなシャープなデザインを徹底せよ。説明不要、画像生成のみを実行せよ。"
  },
  { 
    id: 'photo', 
    label: '実写・フォト', 
    desc: '一眼レフで撮影したような現実感', 
    icon: Camera, 
    color: 'text-emerald-500', 
    bg: 'bg-emerald-500/10',
    prompt: "あなたはプロのフォトグラファーです。今すぐ、以下の【主題】を「現実と見紛うほどの超高精細な実写写真」として1枚生成してください。ライティング、レンズの質感、ボケ味を極限まで追求せよ。説明不要、画像生成のみを実行せよ。"
  },
  { 
    id: 'business', 
    label: 'ビジネス図解', 
    desc: '資料を彩るプロ仕様の挿絵', 
    icon: Monitor, 
    color: 'text-blue-500', 
    bg: 'bg-blue-500/10',
    prompt: "あなたはビジネス資料作成の専門家です。今すぐ、以下の【主題】を「プレゼン資料やWebサイトで映える清潔感のあるイラスト」として1枚生成してください。アイソメトリックやフラットデザインを推奨。説明不要、画像生成のみを実行せよ。"
  }
];

const PRESET_TAGS = {
  style: [
    { label: '実写フォト', content: 'photorealistic, 8k resolution, cinematic lighting, shot on 35mm lens, f/1.8' },
    { label: 'アニメ調', content: 'anime style, vibrant colors, clean lines, high-quality cel shaded, makoto shinkai style' },
    { label: '油絵風', content: 'oil painting, thick brushstrokes, classical masterpiece, impasto style, canvas texture' },
    { label: '3Dレンダリング', content: 'unreal engine 5, octane render, ray tracing, 3D character design, blender' },
    { label: '水彩画', content: 'watercolor illustration, soft edges, hand-drawn, paper texture, pastel colors' },
    { label: 'サイバーパンク', content: 'cyberpunk aesthetic, neon lights, futuristic city, chrome, high-tech noir' },
    { label: 'ピクセルアート', content: '16-bit pixel art, retro gaming style, sharp pixels, pixelated' },
    { label: 'ジブリ風', content: 'Studio Ghibli style, lush nature, nostalgic atmosphere, hand-painted look' },
    { label: '浮世絵', content: 'Ukiyo-e style, traditional Japanese woodblock print, flat colors, katsushika hokusai' },
    { label: 'スケッチ', content: 'pencil sketch, rough lines, charcoal drawing, artistic, hand-drawn' },
    { label: 'ミニチュア', content: 'tilt-shift photography, miniature model style, bokeh, macro lens' },
    { label: 'クレイアニメ', content: 'claymation style, plasticine texture, stop motion look, handcrafted' },
    { label: 'スチームパンク', content: 'steampunk, brass gears, steam, victorian industrial, copper, clockwork' },
    { label: '万華鏡風', content: 'kaleidoscopic, symmetrical fractals, psychedelic, vibrant colors' },
    { label: '点描画', content: 'pointillism, tiny dots of color, post-impressionism, george seurat' },
    { label: 'チョークアート', content: 'chalk drawing, blackboard texture, dusty, colorful, street art' },
    { label: 'ポップアート', content: 'pop art style, Andy Warhol style, high contrast, vibrant dots, screen print' },
    { label: '切り絵', content: 'paper cut art, layered paper, shadows between layers, handcrafted, washi' },
    { label: '墨絵', content: 'sumi-e style, Japanese ink wash painting, brush strokes, zen, minimalist' },
    { label: 'ビンテージ写真', content: 'vintage 1970s photo, polaroid style, faded colors, grain, nostalgic' }
  ],
  lighting: [
    { label: '黄金の夕暮れ', content: 'golden hour, warm sunlight, long shadows, lens flare' },
    { label: 'スタジオ照明', content: 'studio lighting, softbox, professional photography, clean background' },
    { label: 'ネオン街', content: 'neon glow, volumetric fog, blue and pink lighting, night city' },
    { label: '月夜', content: 'moonlight, night scene, dark atmosphere, silver glow, starlight' },
    { label: '神々しい光', content: 'god rays, ethereal lighting, heavenly glow, cinematic, light beams' },
    { label: 'キャンドル', content: 'candlelight, flickering flame, warm intimate atmosphere, low light' },
    { label: '白黒・低照度', content: 'low key lighting, dramatic shadows, black and white noir, high contrast' },
    { label: 'SF・レーザー', content: 'laser beam lighting, glowing energy, high tech, futuristic glow' },
    { label: 'オーロラ', content: 'aurora aurora borealis lighting, green and purple sky glow, magical, night sky' },
    { label: '海底の光', content: 'underwater light rays, caustic ripples, deep blue, marine atmosphere' }
  ],
  composition: [
    { label: '超広角', content: 'ultra wide angle, fisheye lens, expansive view, landscape' },
    { label: 'ポートレート', content: 'close-up portrait, shallow depth of field, bokeh background, 85mm' },
    { label: '鳥瞰（俯瞰）', content: 'birds-eye view, from above, aerial photography, drone shot' },
    { label: 'マクロ撮影', content: 'macro photography, extreme detail, microscopic focus, tiny world' },
    { label: '対称性', content: 'symmetrical composition, balanced, centered focus, geometric' },
    { label: 'パノラマ', content: 'panoramic view, wide landscape, breathtaking scale, horizontal' },
    { label: '躍動感', content: 'dynamic action shot, motion blur, fast movement, energetic' },
    { label: '映画構図', content: 'cinematic composition, 2.35:1 aspect ratio, epic scale, widescreen' },
    { label: '虫瞰（ロー）', content: 'worms-eye view, looking up, low angle, monumental, grand' },
    { label: '二重露光', content: 'double exposure, overlapping images, artistic blend, surreal' }
  ],
  atmosphere: [
    { label: '幻想的', content: 'ethereal, dreamlike, magical atmosphere, surreal, fantasy' },
    { label: 'ノスタルジック', content: 'nostalgic, retro vibe, faded colors, old memories, sepia' },
    { label: 'ダーク・ホラー', content: 'dark, gothic, horror atmosphere, creepy, moody, terrifying' },
    { label: '爽やか・清潔', content: 'fresh, clean, minimalist, airy, bright atmosphere, sunny' },
    { label: '緊迫感', content: 'tense atmosphere, high stakes, dramatic pressure, thriller' },
    { label: '和風・禅', content: 'zen, peaceful Japanese atmosphere, traditional, calm, serene' },
    { label: '終末世界', content: 'post-apocalyptic, overgrown, ruined city, desolate, wasteland' },
    { label: 'サイケデリック', content: 'trippy, colorful, warped reality, intricate patterns, dream' }
  ],
  material: [
    { label: '液体金属', content: 'liquid metal, metallic mercury texture, reflective, shiny' },
    { label: '氷・凍結', content: 'frozen, ice crystals, transparent, cold blue, frosting' },
    { label: '溶岩・マグマ', content: 'molten lava, glowing cracks, intense heat, volcanic' },
    { label: 'クリスタル', content: 'crystalline structure, diamond facets, prismatic, light refracting' },
    { label: 'ホログラム', content: 'holographic, glitch effect, semi-transparent, light based, projection' },
    { label: '錆びた鉄', content: 'rusty metal, decayed, industrial, old iron, weathered' }
  ],
  aspect: [
    { label: 'YouTube (16:9)', content: 'aspect ratio 16:9, widescreen' },
    { label: 'X/Twitter (3:2)', content: 'aspect ratio 3:2, landscape' },
    { label: 'Instagram (1:1)', content: 'aspect ratio 1:1, square' },
    { label: 'TikTok/Reels (9:16)', content: 'aspect ratio 9:16, portrait, vertical' },
    { label: '映画 (2.39:1)', content: 'aspect ratio 2.39:1, anamorphic cinematic' }
  ]
};

export default function PromptMaster() {
  const [activeWeapon, setActiveWeapon] = useState<string>('general');
  const [subject, setSubject] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const STEPS = ["用途を選択", "主題を入力", "パーツを選択", "AI実行"];
  const activeStepIndex = subject ? (selectedTags.length > 0 ? 3 : 2) : 1;

  const toggleTag = (content: string) => {
    setSelectedTags(prev => 
      prev.includes(content) ? prev.filter(t => t !== content) : [...prev, content]
    );
  };

  const clearAll = () => {
    setSubject('');
    setSelectedTags([]);
  };

  const getCombinedPrompt = () => {
    const weapon = WEAPONS.find(w => w.id === activeWeapon);
    const tagsPart = selectedTags.join(', ');
    return `${weapon?.prompt}\n\n【主題（日本語）】: ${subject}\n【指定パーツ（英語）】: ${tagsPart}`;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-32 bg-slate-950">
      <div className="text-center space-y-3">
        <Badge className="bg-orange-600 text-white font-black italic tracking-widest px-6 py-1 text-[10px] uppercase rounded-full shadow-lg">ULTIMATE PROMPT STUDIO v5.8</Badge>
        <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">Prompt Master</h1>
      </div>

      {/* 皇帝の剣：全体工程ナビ */}
      <div className="max-w-4xl mx-auto px-4 overflow-x-auto pb-4">
        <div className="flex items-center justify-between min-w-[600px] relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
          {STEPS.map((s, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black italic text-sm transition-all duration-500 ${i <= activeStepIndex ? 'bg-orange-600 text-white shadow-[0_0_20px_rgba(234,88,12,0.6)] scale-110' : 'bg-slate-900 text-slate-600 border border-slate-800'}`}>
                {i < activeStepIndex ? <CheckCircle2 size={18} /> : i + 1}
              </div>
              <span className={`text-[11px] font-black uppercase italic tracking-tighter ${i <= activeStepIndex ? 'text-orange-400' : 'text-slate-700'}`}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 皇帝の剣：用途ハブ（武器選択） */}
      <div className="bg-slate-900 border border-slate-800 p-2 rounded-[2rem] shadow-2xl overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-[800px]">
          {WEAPONS.map((w) => (
            <button
              key={w.id}
              onClick={() => { setActiveWeapon(w.id); clearAll(); }}
              className={`flex-1 flex flex-col items-center justify-center py-5 px-2 rounded-2xl transition-all duration-300 gap-2 border-2 ${activeWeapon === w.id ? 'bg-orange-600 border-orange-400 scale-105 shadow-xl text-white' : 'bg-slate-950 border-transparent text-slate-500 hover:text-white hover:bg-slate-900'}`}
            >
              {React.createElement(w.icon, { size: 24, className: activeWeapon === w.id ? 'text-white' : w.color })}
              <div className="text-center">
                <p className="text-[10px] font-black uppercase italic leading-none mb-1">{w.label}</p>
                <p className={`text-[8px] font-bold opacity-60 ${activeWeapon === w.id ? 'text-white' : ''}`}>{w.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
        <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] p-8 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 to-amber-600" />
          
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center px-2 text-left">
                  <h3 className="text-2xl font-black text-white italic uppercase flex items-center gap-3">
                    {React.createElement(WEAPONS.find(w => w.id === activeWeapon)!.icon, { className: "text-orange-500", size: 32 })}
                    ① 主題（何を描くか）
                  </h3>
                  <Button onClick={clearAll} variant="ghost" size="sm" className="text-slate-500 hover:text-red-500 font-black"><Trash2 size={16} /> ALL CLEAR</Button>
                </div>
                <textarea 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)} 
                  placeholder={activeWeapon === 'logo' ? "例：NextraLabsの、未来を象徴するエメラルドの瞳を持つライオンのシンボル..." : "例：廃墟となった未来の渋谷、光る雨の中でたたずむ少女..."} 
                  className="w-full h-48 bg-slate-950 border-2 border-slate-800 rounded-[2rem] p-8 text-2xl text-white font-bold focus:border-orange-500 outline-none shadow-inner transition-all" 
                />
              </div>

              <div className="space-y-8 max-h-[800px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                <h3 className="text-2xl font-black text-white italic uppercase flex items-center gap-3 sticky top-0 bg-slate-900 py-4 z-10 text-left"><LayoutGrid className="text-orange-500" /> ② プロのパーツを選択</h3>
                
                {Object.entries(PRESET_TAGS).map(([category, tags]) => (
                  <div key={category} className="space-y-3 bg-slate-950/50 p-8 rounded-3xl border border-slate-800 shadow-inner">
                    <p className="text-[10px] font-black text-indigo-400 uppercase italic tracking-[0.2em] flex items-center gap-2 mb-4">
                      {category === 'style' && <Palette size={14} />}
                      {category === 'lighting' && <Sun size={14} />}
                      {category === 'composition' && <Maximize size={14} />}
                      {category === 'atmosphere' && <Ghost size={14} />}
                      {category === 'material' && <Layers size={14} />}
                      {category === 'aspect' && <Monitor size={14} />}
                      {category}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {tags.map((tag) => (
                        <Button 
                          key={tag.label} 
                          variant="outline" 
                          size="sm" 
                          onClick={() => toggleTag(tag.content)}
                          className={`h-12 px-2 rounded-xl font-black text-sm leading-tight transition-all ${selectedTags.includes(tag.content) ? 'bg-orange-600 border-orange-400 text-white scale-105 shadow-xl' : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-white'}`}
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
              <div className="bg-slate-950 p-10 rounded-[3.5rem] border border-slate-800 space-y-8 shadow-2xl text-center flex flex-col justify-center min-h-[600px]">
                <p className="text-white font-black italic uppercase tracking-tighter flex items-center justify-center gap-2 opacity-60"><Zap className="text-orange-500" /> PROMPT COMMAND HUB</p>
                <div className="space-y-6">
                  <Button 
                    onClick={() => handleCopy(getCombinedPrompt())} 
                    disabled={!subject}
                    className={`w-full h-40 text-4xl font-black rounded-[3rem] transition-all shadow-xl ${copied ? 'bg-emerald-500 text-slate-950 scale-95' : 'bg-orange-600 text-white hover:bg-orange-500'}`}
                  >
                    {copied ? '✅ 指令をコピーしました' : '錬成指令をコピー'}
                  </Button>
                  <p className="text-sm text-slate-500 font-bold italic">※コピーして以下のAIへ貼り付けると、自動的に画像生成が始まります</p>
                </div>
                <div className="grid grid-cols-1 gap-6 pt-10">
                  <Button variant="outline" className="h-32 border-4 border-slate-800 text-slate-200 font-black text-3xl uppercase italic hover:bg-orange-600/10 rounded-[2.5rem] shadow-lg flex items-center justify-center gap-4 group" onClick={() => window.open('https://chatgpt.com', '_blank')}>
                    <Sparkles size={40} className="text-orange-500 group-hover:animate-spin" /> ChatGPT 🚀
                  </Button>
                  <Button variant="outline" className="h-32 border-4 border-slate-800 text-slate-200 font-black text-3xl uppercase italic hover:bg-orange-600/10 rounded-[2.5rem] shadow-lg flex items-center justify-center gap-4 group" onClick={() => window.open('https://gemini.google.com', '_blank')}>
                    <Wand2 size={40} className="text-orange-500 group-hover:animate-bounce" /> Gemini 🚀
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="text-center opacity-20"><p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Visual Intelligence Engine • NextraLabs 2026</p></div>
    </div>
  )
}
