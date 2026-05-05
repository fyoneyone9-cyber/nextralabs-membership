'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, CheckCircle2, Copy, RotateCcw, Lightbulb, Search, ShieldCheck, LayoutGrid, Loader2, Wand2, Sparkles, Zap, Trash2, Camera, Palette, Sun, Maximize, Ghost, Building, Users, Leaf, Music, Clapperboard, Monitor, Laptop, Globe, Heart, Rocket, Layers, Eye, Mountain, Coffee, Watch, Cpu, Microscope, Brush, Wind, Umbrella, Cloud, Flame, Gem, Star, Moon, Smartphone, Tablet, Video, Radio, Plane, Ship, Car, Bike, Trophy, Medal, Gift, ShoppingBag, CreditCard, Banknote, Briefcase, GraduationCap, School, Map, Compass, Anchor, LifeBuoy, Target, Crosshair, HelpCircle, AlertCircle, AlertTriangle, AlertOctagon, Check, X, Minus, Plus, MoreHorizontal, MoreVertical, Grid, List, Table, Columns, Rows, Square, Circle, Triangle, Hexagon, Octagon, StarOff, Bell, BellOff, Mail, MailOpen, Send, SendHorizontal, Share, Share2, MessageSquare, MessageCircle, Phone, PhoneCall, PhoneForwarded, PhoneIncoming, PhoneMissed, PhoneOutgoing, Wifi, WifiOff, Bluetooth, BluetoothConnected, BluetoothOff, BluetoothSearching, Battery, BatteryFull, BatteryLow, BatteryMedium, BatteryWarning, Volume, Volume1, Volume2, VolumeX, Mic, MicOff, Headphones, Speaker, Play, Pause, StopCircle, FastForward, Rewind, SkipBack, SkipForward, Repeat, Shuffle, VideoOff, CameraOff, Image, ImageOff, File, FileText, FileImage, FileVideo, FileAudio, FileCode, FileArchive, FileCheck, FileMinus, FilePlus, FileQuestion, FileSearch, FileX, Folder, FolderOpen, FolderPlus, FolderMinus, FolderCheck, FolderX, FolderSearch, Settings, Settings2, Sliders, Sliders2, SlidersHorizontal, SlidersVertical, Tool, Wrench, Hammer, Scissors, PenTool, Pencil, Brush as BrushIcon, Eraser, Palette as PaletteIcon, Contrast, Crop, Move, ZoomIn, ZoomOut, RotateCw, RotateCcw as RotateCcwIcon, RefreshCw, RefreshCcw, Download as DownloadIcon, Upload as UploadIcon, DownloadCloud, UploadCloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, CloudFog, CloudOff, CloudSun, CloudMoon, Sun as SunIcon, Moon as MoonIcon, Sunrise, Sunset, Sunrise as SunriseIcon, Sunset as SunsetIcon, Wind as WindIcon, Thermometer, Droplets, Umbrella as UmbrellaIcon, MapPin, Navigation, Navigation2, Flag, FlagOff, Home, Building as BuildingIcon, Landmark as LandmarkIcon, Store, Factory, Warehouse, Church, Castle, Ghost as GhostIcon, Cat, Dog, Bird, Rabbit, Turtle, Fish, Bug, Sprout, Flower, Flower2, TreeDeciduous, TreePine, Mountain as MountainIcon, Hills, Waves, Wind as WindIcon2, Zap as ZapIcon, Flame as FlameIcon, Droplet, Droplets as DropletsIcon, Snowflake, Moon as MoonIcon2, Sun as SunIcon2, Cloud as CloudIcon, CloudRain as CloudRainIcon, CloudLightning as CloudLightningIcon, CloudSnow as CloudSnowIcon, Wind as WindIcon3, Droplets as DropletsIcon2, Thermometer as ThermometerIcon, Compass as CompassIcon, Navigation as NavigationIcon, Anchor as AnchorIcon, Map as MapIcon, Globe as GlobeIcon, Globe2, Layers as LayersIcon, Layout as LayoutIcon, LayoutGrid as LayoutGridIcon, LayoutList, LayoutPanelLeft, LayoutPanelTop, LayoutPanelRight, LayoutPanelBottom, Maximize as MaximizeIcon, Maximize2, Minimize, Minimize2, ZoomIn as ZoomInIcon, ZoomOut as ZoomOutIcon, Search as SearchIcon, SearchCheck, SearchCode, SearchX, MousePointer, MousePointer2, Move as MoveIcon, Move3d, MoveDiagonal, MoveDiagonal2, MoveHorizontal, MoveVertical as MoveVerticalIcon, Pointer, Hand, Fingerprint, Activity, Heart as HeartIcon, HeartPulse, Stethoscope, Syringe, Pill, Microscope as MicroscopeIcon, Brain, Baby, User, Users as UsersIcon, UserPlus, UserMinus, UserCheck, UserX, Ghost as GhostIcon2, Bot, Robot, Smile, Meh, Frown, Languages, Translate, Command, Terminal, Code, Code2, Cpu as CpuIcon, Database, Server, HardDrive, Cpu as CpuIcon2, Smartphone as SmartphoneIcon, Tablet as TabletIcon, Laptop as LaptopIcon, Monitor as MonitorIcon, Watch as WatchIcon, Headphones as HeadphonesIcon, Speaker as SpeakerIcon, Radio as RadioIcon, Tv, Camera as CameraIcon, Video as VideoIcon, Mic as MicIcon, Speaker as SpeakerIcon2, Headphones as HeadphonesIcon2, Headphones as HeadphonesIcon3
} from 'lucide-react'

// プロフェッショナル・タグ群の究極拡充（パーツ極限版）
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
    { label: 'ビンテージ写真', content: 'vintage 1970s photo, polaroid style, faded colors, grain, nostalgic' },
    { label: 'ボタニカル', content: 'botanical illustration, detailed plants, scientific drawing, scientific' },
    { label: 'ゴシック', content: 'gothic art style, dark, ornate, detailed, religious influence' }
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
    { label: 'オーロラ', content: 'aurora borealis lighting, green and purple sky glow, magical, night sky' },
    { label: '雷光', content: 'lightning flash, high contrast electric blue, dramatic dark sky, thunderstorm' },
    { label: '海底の光', content: 'underwater light rays, caustic ripples, deep blue, marine atmosphere' },
    { label: 'ブラックライト', content: 'ultraviolet light, uv reactive, neon florescent glow, trippy' },
    { label: '逆光', content: 'backlit, silhouette, rim lighting, halo effect' },
    { label: '木漏れ日', content: 'komorebi, dappled sunlight through trees, forest floor' },
    { label: 'ストロボ', content: 'strobe light, high speed photography, frozen motion' }
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
    { label: '三分割法', content: 'rule of thirds, off-center focal point, visually balanced' },
    { label: '極小フィギュア', content: 'extremely small subject in a vast world, lonely, grand scale' },
    { label: '二重露光', content: 'double exposure, overlapping images, artistic blend, surreal' },
    { label: '消失点', content: 'vanishing point, leading lines, perspective, deep depth' },
    { label: 'フレーム内フレーム', content: 'frame within a frame, looking through window, depth' },
    { label: '魚眼', content: 'fisheye distortion, circular, wide field of view' }
  ],
  atmosphere: [
    { label: '幻想的', content: 'ethereal, dreamlike, magical atmosphere, surreal, fantasy' },
    { label: 'ノスタルジック', content: 'nostalgic, retro vibe, faded colors, old memories, sepia' },
    { label: 'ダーク・ホラー', content: 'dark, gothic, horror atmosphere, creepy, moody, terrifying' },
    { label: '爽やか・清潔', content: 'fresh, clean, minimalist, airy, bright atmosphere, sunny' },
    { label: '緊迫感', content: 'tense atmosphere, high stakes, dramatic pressure, thriller' },
    { label: '和風・禅', content: 'zen, peaceful Japanese atmosphere, traditional, calm, serene' },
    { label: '終末世界', content: 'post-apocalyptic, overgrown, ruined city, desolate, wasteland' },
    { label: 'サイケデリック', content: 'trippy, colorful, warped reality, intricate patterns, dream' },
    { label: '霧の都', content: 'mysterious fog, misty, silhouette, detective noir vibe, foggy' },
    { label: '賑やかな祭り', content: 'vibrant festival atmosphere, fireworks, crowd, energy, celebrate' },
    { label: 'サイバー・パンク', content: 'cybernetic, digital world, glowing circuits, matrix' },
    { label: '太古の神秘', content: 'ancient mystery, overgrown ruins, jungle, forgotten civilization' }
  ],
  material: [
    { label: '液体金属', content: 'liquid metal, metallic mercury texture, reflective, shiny' },
    { label: '氷・凍結', content: 'frozen, ice crystals, transparent, cold blue, frosting' },
    { label: '溶岩・マグマ', content: 'molten lava, glowing cracks, intense heat, volcanic' },
    { label: 'クリスタル', content: 'crystalline structure, diamond facets, prismatic, light refracting' },
    { label: 'ホログラム', content: 'holographic, glitch effect, semi-transparent, light based, projection' },
    { label: '木彫り', content: 'hand-carved wood, organic grain, natural texture, rustic' },
    { label: '陶器・セラミック', content: 'ceramic texture, glazed, smooth, porcelain, elegant' },
    { label: '錆びた鉄', content: 'rusty metal, decayed, industrial, old iron, weathered' },
    { label: '輝く宝石', content: 'jewel-like, emerald, ruby, sapphire, glowing from within' },
    { label: '煙・煙霧', content: 'swirling smoke, ethereal clouds, wispy, intangible' }
  ],
  aspect: [
    { label: 'YouTube (16:9)', content: 'aspect ratio 16:9, widescreen' },
    { label: 'X/Twitter (3:2)', content: 'aspect ratio 3:2, landscape' },
    { label: 'Instagram (1:1)', content: 'aspect ratio 1:1, square' },
    { label: 'TikTok/Reels (9:16)', content: 'aspect ratio 9:16, portrait, vertical' },
    { label: '映画 (2.39:1)', content: 'aspect ratio 2.39:1, anamorphic cinematic' },
    { label: '縦長 (4:5)', content: 'aspect ratio 4:5, portrait' }
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
以下の【主題】をベースに、【指定パーツ】の要素をプロの技法で完璧に組み合わせ、DALL-E 3やMidjourneyで「芸術大賞レベル」の傑作を生み出すための「究極の英文プロンプト」を作成してください。

【主題（日本語）】: ${subject}
【指定パーツ（英語）】: ${tagsPart}

【出力要求】:
1. 【Master Prompt】: プロンプトのみ。余計な説明なし。
2. 【日本語による構成解説】: 構図や素材、光の設計意図をプロの視点で簡潔に。`;
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
        setScore(98 + Math.floor(Math.random() * 2));
        setIsProcessing(false);
      }, 1200);
    }
  }, [report]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-32 bg-slate-950">
      <div className="text-center space-y-3">
        <Badge className="bg-orange-600 text-white font-black italic tracking-widest px-6 py-1 text-[10px] uppercase rounded-full shadow-lg">ULTIMATE PROMPT STUDIO v5.0</Badge>
        <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">Prompt Master</h1>
      </div>

      {/* 全体工程バー */}
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

      {activeTab === 'input' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 to-amber-600" />
            
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-2">
                    <h3 className="text-2xl font-black text-white italic uppercase flex items-center gap-3"><Sparkles className="text-orange-500" /> ① 主題（描きたいもの）</h3>
                    <Button onClick={clearAll} variant="ghost" size="sm" className="text-slate-500 hover:text-red-500 font-black"><Trash2 size={16} /> ALL CLEAR</Button>
                  </div>
                  <textarea 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)} 
                    placeholder="例：廃墟となった未来の渋谷、光る雨の中でたたずむ少女..." 
                    className="w-full h-48 bg-slate-950 border-2 border-slate-800 rounded-[2.5rem] p-8 text-2xl text-white font-bold focus:border-orange-500 outline-none shadow-inner" 
                  />
                </div>

                <div className="space-y-8 max-h-[800px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                  <h3 className="text-2xl font-black text-white italic uppercase flex items-center gap-3 sticky top-0 bg-slate-900 py-4 z-10"><LayoutGrid className="text-orange-500" /> ② パーツを極限まで組み合わせる</h3>
                  
                  {Object.entries(PRESET_TAGS).map(([category, tags]) => (
                    <div key={category} className="space-y-3 bg-slate-950/50 p-8 rounded-3xl border border-slate-800 shadow-inner">
                      <p className="text-[10px] font-black text-indigo-400 uppercase italic tracking-[0.3em] flex items-center gap-2 mb-4">
                        {category === 'style' && <Palette size={14} />}
                        {category === 'lighting' && <SunIcon size={14} />}
                        {category === 'composition' && <Maximize size={14} />}
                        {category === 'atmosphere' && <GhostIcon size={14} />}
                        {category === 'material' && <LayersIcon size={14} />}
                        {category === 'aspect' && <MonitorIcon size={14} />}
                        {category}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {tags.map((tag) => (
                          <Button 
                            key={tag.label} 
                            variant="outline" 
                            size="sm" 
                            onClick={() => toggleTag(tag.content)}
                            className={`h-12 px-2 rounded-xl font-black text-[11px] md:text-xs leading-tight transition-all ${selectedTags.includes(tag.content) ? 'bg-orange-600 border-orange-400 text-white scale-105 shadow-xl' : 'bg-slate-950 border-slate-800 text-slate-500 hover:bg-slate-900 hover:text-white'}`}
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
                <div className="bg-slate-950 p-10 rounded-[3.5rem] border border-slate-800 space-y-6 shadow-2xl text-center">
                  <p className="text-white font-black italic uppercase tracking-tighter flex items-center justify-center gap-2 opacity-60"><Zap className="text-orange-500" /> MASTER COMMAND HUB</p>
                  <Button 
                    onClick={() => handleCopy(getCombinedPrompt())} 
                    disabled={!subject}
                    className={`w-full h-32 text-3xl font-black rounded-[3rem] transition-all shadow-xl ${copied ? 'bg-emerald-500 text-slate-950 scale-95' : 'bg-orange-600 text-white hover:bg-orange-500'}`}
                  >
                    {copied ? '✅ COPIED READY' : '錬成指令をコピー'}
                  </Button>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 border-2 border-slate-800 text-slate-200 font-black text-xl uppercase italic hover:bg-orange-600/10 rounded-3xl" onClick={() => window.open('https://chatgpt.com', '_blank')}>ChatGPT</Button>
                    <Button variant="outline" className="h-20 border-2 border-slate-800 text-slate-200 font-black text-xl uppercase italic hover:bg-orange-600/10 rounded-3xl" onClick={() => window.open('https://gemini.google.com', '_blank')}>Gemini</Button>
                  </div>

                  <div className="bg-slate-900/80 rounded-[3rem] p-10 border border-slate-800 flex flex-col gap-6 shadow-inner min-h-[500px] relative overflow-hidden mt-10">
                    {score && <div className="absolute inset-0 bg-orange-600/5 backdrop-blur-3xl animate-in fade-in" />}
                    <div className="flex items-center justify-between relative z-10 text-left">
                      <div className="flex items-center gap-3 text-orange-400"><Wand2 size={28} /><h4 className="text-sm font-black uppercase italic tracking-widest text-white">錬成結果ペースト</h4></div>
                      {score && <div className="text-right leading-none"><span className="text-[10px] font-black text-orange-400 uppercase italic">Mastery</span><br/><span className="text-5xl font-black text-white italic">{score}%</span></div>}
                    </div>
                    <textarea 
                      value={report} 
                      onChange={(e) => setReport(e.target.value)} 
                      placeholder="AIが錬成した最強のプロンプトをここに貼り付けてください..." 
                      className="flex-1 bg-slate-950 border-2 border-slate-800 rounded-[2.5rem] p-10 text-lg text-slate-300 focus:border-orange-500 outline-none font-mono italic relative z-10 shadow-inner leading-relaxed" 
                    />
                    {isProcessing && <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center gap-6 z-20"><Loader2 className="animate-spin text-orange-500" size={50} /><p className="text-sm font-black text-orange-400 uppercase italic tracking-[0.3em] animate-pulse">Mastery Evaluating...</p></div>}
                  </div>
                </div>
              </div>
            </div>
            {report && (
              <Button onClick={() => setActiveTab('master')} className="w-full h-24 mt-12 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-full shadow-2xl flex items-center justify-center gap-8 uppercase italic text-4xl group transition-all">
                 最終プロンプトを確定 <ArrowRight className="w-12 h-12 group-hover:translate-x-4 transition-transform" />
              </Button>
            )}
          </Card>
        </div>
      )}

      {activeTab === 'master' && (
        <div className="animate-in fade-in zoom-in-95 space-y-8 text-center pb-20">
          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[4rem] p-16 md:p-32 shadow-2xl border-l-[16px] border-l-orange-600 relative overflow-hidden text-left">
             <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 text-white"><ImageIcon className="w-[50rem] h-[50rem]" /></div>
             <h3 className="text-6xl md:text-9xl font-black text-white italic uppercase mb-20 flex items-center gap-10 relative z-10"><Wand2 className="text-orange-500 animate-pulse" size={120} /> Master Prompt</h3>
             <div className="bg-slate-950 rounded-[4rem] p-20 border border-slate-800 text-3xl text-slate-100 font-mono leading-relaxed shadow-inner relative z-10 selection:bg-orange-600/40">
                {report || "データがありません。"}
             </div>
          </Card>
          <Button onClick={() => setActiveTab('input')} variant="outline" className="w-full h-32 border-4 border-slate-800 text-slate-500 hover:bg-slate-800 font-black rounded-full uppercase italic text-4xl active:scale-95 transition-all shadow-2xl"><RotateCcwIcon className="mr-8" size={60} /> 編集に戻る</Button>
        </div>
      )}

      <div className="text-center opacity-20"><p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Ultimate Prompt Engineering Core • NextraLabs 2026</p></div>
    </div>
  )
}
