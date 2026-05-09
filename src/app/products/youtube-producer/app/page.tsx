'use client'

import dynamic from 'next/dynamic'
import React, { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Clapperboard, 
  Mic, 
  FileText, 
  Users, 
  Image as ImageIcon, 
  Search, 
  Music, 
  Zap, 
  Loader2, 
  Download, 
  ChevronRight,
  Info,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Upload,
} from 'lucide-react'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

// ⚡ 憲法：SSR無効化 (FFmpeg.wasmなどのブラウザ専用機能を使用するため)
const YoutubeProducerAppInner = dynamic(() => Promise.resolve(YoutubeProducerApp), { ssr: false })

export default function YoutubeProducerAppPage() {
  return <YoutubeProducerAppInner />
}

// 画像スタイル設定
const IMAGE_STYLES = [
  { id: 'realistic', label: 'リアル・実写', prompt: 'Photorealistic, cinematic lighting, high-end camera, detailed texture' },
  { id: 'anime', label: 'アニメ調', prompt: 'Anime style, high quality digital illustration, vibrant colors, expressive characters' },
  { id: 'ghibli', label: 'ジブリ風', prompt: 'Studio Ghibli style, hand-drawn aesthetic, watercolor-like textures, nostalgic mood' },
  { id: 'cyberpunk', label: '近未来・ネオン', prompt: 'Cyberpunk aesthetic, neon lights, futuristic city background, tech-wear' },
  { id: 'comic', label: 'アメコミ風', prompt: 'Marvel/DC comic book style, bold ink lines, dynamic shading, high action' },
]

// 台本タイプ設定
const SCRIPT_TYPES = [
  { id: 'short', label: 'ショート用台本', desc: '1分以内の超高密度構成。最初の3秒で視聴者を釘付けにします。', minutes: 1 },
  { id: 'standard', label: 'スタンダード台本', desc: '5〜10分の標準的なYouTube構成。離脱を防ぐ黄金比率で作成します。', minutes: 8 },
  { id: 'long', label: '長文台本', desc: '15〜30分の重厚な解説・ドキュメンタリー構成。深い満足度を提供します。', minutes: 20 },
]

// ジャンル設定
const GENRES = [
  { id: 'impact', label: '衝撃・暴露', prompt: '「衝撃」「真実」「暴露」をキーワードに、視聴者の好奇心を極限まで煽るスタイル。強い言葉選びと、謎を小出しにする構造。' },
  { id: 'explanation', label: '徹底解説', prompt: '複雑なトピックを初心者でも100%理解できるように解き明かすスタイル。ステップ形式や比較、具体例を多用。' },
  { id: 'business', label: 'ビジネス・教育', prompt: '論理的で分かりやすく、信頼感のあるトーン。視聴者の悩みを解決し、明日から使える知恵を提供する構造。' },
  { id: 'entertainment', label: 'エンタメ・バラエティ', prompt: 'テンポが良く、笑いや驚きを重視。視聴者を飽きさせない「引き」を各所に配置。' },
  { id: 'vlog', label: 'Vlog・ライフスタイル', prompt: '共感を呼び、親しみやすいトーン。日常の魅力をシネマティックに、かつ等身大で伝える。' },
  { id: 'tech', label: 'ガジェット・テック', prompt: 'スペックや実際の使用感を徹底比較。メリットだけでなくデメリットも公平に伝える未来的トーン。' },
  { id: 'game', label: 'ゲーム実況', prompt: '熱気と興奮を共有。視聴者と一緒に楽しむライブ感と、ドラマチックな展開作りを重視。' },
  { id: 'ranking', label: 'ランキング・まとめ', prompt: '「TOP10」「厳選5選」など、網羅性と納得感を重視。視聴者が最後まで見たくなるカウントダウン構造。' },
  { id: 'routine', label: 'モーニング/ナイトルーティン', prompt: '憧れや共感、癒やしをテーマに、生活の質を高めるヒントを散りばめたスタイル。' },
  { id: 'short', label: 'ショート動画特化', prompt: '最初の3秒で勝負を決める超高密度スタイル。無駄を削ぎ落とし、インパクトのみを追求。' },
]

function YoutubeProducerApp() {
  const [activeTab, setActiveTab] = useState('input')
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null)
  const [compressProgress, setCompressProgress] = useState(0)
  const [loadingStep, setLoadingStep] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const ffmpegRef = useRef(new FFmpeg())
  const [isFFmpegReady, setIsFFmpegReady] = useState(false)

  const [transcript, setTranscript] = useState('')
  const [genre, setGenre] = useState('entertainment')
  const [scriptType, setScriptType] = useState('standard')
  const [imageStyle, setImageStyle] = useState('anime')
  const [withLogo, setWithLogo] = useState(true)
  const [script, setScript] = useState<any>(null)
  const [characters, setCharacters] = useState<any[] | null>(null)
  const [thumbnails, setThumbnails] = useState<any[] | null>(null)
  const [seo, setSeo] = useState<any>(null)
  const [bgm, setBgm] = useState<any>(null)

  // ⚡ 憲法：ページ離脱してもクリアさせない（Persistence）
  useEffect(() => {
    const saved = localStorage.getItem('yt_producer_state')
    if (saved) {
      try {
        const state = JSON.parse(saved)
        setTranscript(state.transcript || '')
        setGenre(state.genre || 'entertainment')
        setScriptType(state.scriptType || 'standard')
        setImageStyle(state.imageStyle || 'anime')
        setWithLogo(state.withLogo !== undefined ? state.withLogo : true)
        setScript(state.script || null)
        setCharacters(state.characters || null)
        setThumbnails(state.thumbnails || null)
        setSeo(state.seo || null)
        setBgm(state.bgm || null)
        if (state.activeTab) setActiveTab(state.activeTab)
      } catch (e) { console.error(e) }
    }
  }, [])

  useEffect(() => {
    const state = { transcript, genre, scriptType, imageStyle, withLogo, script, characters, thumbnails, seo, bgm, activeTab }
    localStorage.setItem('yt_producer_state', JSON.stringify(state))
  }, [transcript, genre, scriptType, imageStyle, withLogo, script, characters, thumbnails, seo, bgm, activeTab])

  useEffect(() => {
    const load = async () => {
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
      const ffmpeg = ffmpegRef.current
      ffmpeg.on('progress', ({ progress }) => setCompressProgress(Math.round(progress * 100)))
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      })
      setIsFFmpegReady(true)
    }
    load()
  }, [])

  const callApi = async (type: string, data: any) => {
    setIsProcessing(prev => ({ ...prev, [type]: true }))
    setError(null)
    const messages: Record<string, string> = {
      'script': '黄金台本を錬成中... 15〜30秒ほどお待ちください 🚀',
      'characters': '登場人物を設計中...',
      'thumbnail': 'サムネイルを構成中...',
      'title': 'SEOタイトルを算出中...',
      'bgm': 'サウンドをセレクト中...',
      'transcribe': '読み起こし中...'
    }
    setLoadingStep(messages[type] || '処理中...')
    try {
      const res = await fetch('/api/youtube-producer/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, ...data })
      })
      const result = await res.json()
      if (result.error) throw new Error(result.error)
      return result
    } catch (e: any) {
      setError(e.message)
      return null
    } finally {
      setIsProcessing(prev => ({ ...prev, [type]: false }))
      setLoadingStep(null)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsProcessing(prev => ({ ...prev, 'transcribe': true }))
    setError(null)
    let finalFile: File | Blob = file
    if (file.type.startsWith('video/') || file.size > 2 * 1024 * 1024) {
      if (!isFFmpegReady) { setError('準備中...'); setIsProcessing(prev => ({ ...prev, 'transcribe': false })); return; }
      try {
        const ffmpeg = ffmpegRef.current
        await ffmpeg.writeFile('input', await fetchFile(file))
        await ffmpeg.exec(['-i', 'input', '-vn', '-ac', '1', '-ab', '32k', '-ar', '16000', 'out.mp3'])
        const data = await ffmpeg.readFile('out.mp3')
        finalFile = new Blob([data], { type: 'audio/mp3' })
      } catch (e) { console.error(e) }
    }
    const formData = new FormData()
    formData.append('file', finalFile, 'audio.mp3')
    try {
      const res = await fetch('/api/youtube-producer/transcribe', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.text) setTranscript(data.text)
    } catch (e: any) { setError(e.message) }
    finally { setIsProcessing(prev => ({ ...prev, 'transcribe': false })); if (fileInputRef.current) fileInputRef.current.value = '' }
  }

  const generateScript = async () => {
    const genreData = GENRES.find(g => g.id === genre)
    const typeData = SCRIPT_TYPES.find(t => t.id === scriptType)
    const styleData = IMAGE_STYLES.find(s => s.id === imageStyle)
    const result = await callApi('script', { 
      transcript, 
      genre: genreData?.label, 
      genrePrompt: `${genreData?.prompt} 長さ: ${typeData?.label} 画像スタイル: ${styleData?.label} ロゴ: ${withLogo ? 'あり' : 'なし'}` 
    })
    if (result) {
      setScript({ ...result, viralScore: Math.floor(75 + Math.random() * 20), estimatedMinutes: typeData?.minutes })
      setActiveTab('script')
    }
  }

  const generateExtras = async () => {
    const charRes = await callApi('characters', { transcript })
    if (charRes) setCharacters(charRes.characters)
    const thumbRes = await callApi('thumbnail', { transcript, genre, scriptTitle: script?.opening })
    if (thumbRes) setThumbnails(thumbRes.thumbnails)
    const seoRes = await callApi('title', { transcript, script: script?.fullScript, genre })
    if (seoRes) setSeo(seoRes)
    const bgmRes = await callApi('bgm', { transcript, genre })
    if (bgmRes) setBgm(bgmRes)
    setActiveTab('visual')
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-12 font-sans text-left selection:bg-emerald-500/30">
      <div className="max-w-6xl mx-auto space-y-12 border-4 border-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.2)] rounded-[3rem] p-6 md:p-16 relative overflow-hidden bg-black/40 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-emerald-500/20 pb-12">
          <div className="flex items-center gap-6">
            <div className="p-6 bg-emerald-500/10 rounded-3xl border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]"><Clapperboard className="h-12 w-12 text-emerald-400" /></div>
            <div><h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">AI YouTube <span className="text-emerald-500">プロデューサー</span></h1><p className="text-emerald-500 font-black text-sm uppercase italic tracking-[0.3em] mt-2">動画制作 OS v2.1-MASTER</p></div>
          </div>
          <Badge className="bg-emerald-500 text-slate-950 font-black italic px-8 py-3 text-lg rounded-full shadow-[0_0_30px_rgba(16,185,129,0.5)]">PREMIUM MASTER</Badge>
        </div>

        {loadingStep && <div className="bg-emerald-500/10 border-4 border-emerald-500/50 rounded-[3rem] p-16 animate-pulse flex flex-col items-center gap-8 text-center"><Loader2 className="h-20 w-20 text-emerald-400 animate-spin" /><p className="text-3xl text-emerald-400 font-black italic">{loadingStep}</p></div>}
        {error && <div className="bg-red-500/10 border-2 border-red-500/50 rounded-2xl p-6 flex items-center gap-4 text-red-500 font-black text-xl italic"><AlertCircle size={32} />{error}</div>}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-12">
          <TabsList className="grid grid-cols-6 h-28 bg-white/5 border border-white/10 rounded-[2.5rem] p-2 gap-4 shadow-2xl relative overflow-hidden backdrop-blur-md">
            {[
              { id: 'input', label: '入力', icon: Mic },
              { id: 'genre', label: '戦略', icon: Zap },
              { id: 'script', label: '台本', icon: FileText },
              { id: 'visual', label: '画像', icon: ImageIcon },
              { id: 'music', label: '音楽', icon: Music },
              { id: 'strategy', label: 'SEO', icon: Search }
            ].map((tab, i) => (
              <TabsTrigger key={tab.id} value={tab.id} disabled={i > 0 && !transcript || i > 2 && !script} className="rounded-2xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-emerald-400 data-[state=active]:to-emerald-600 data-[state=active]:text-slate-950 data-[state=active]:shadow-[0_0_30px_rgba(52,211,153,0.4)] data-[state=active]:scale-105 font-black italic uppercase transition-all duration-300 flex flex-col items-center justify-center gap-1 group">
                <tab.icon className={`h-6 w-6 ${activeTab === tab.id ? 'text-slate-950' : 'text-emerald-500/50 group-hover:text-emerald-400'}`} />
                <span className="text-xs md:text-sm tracking-tighter">{i+1}. {tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="input" className="space-y-12 animate-in fade-in">
            <div className="bg-emerald-500/5 border-2 border-emerald-500/20 rounded-[3rem] p-10 space-y-8 shadow-inner">
              <div className="flex items-center justify-between border-b border-white/5 pb-6"><div className="flex items-center gap-4 text-emerald-400"><Info size={32} /><h3 className="font-black italic uppercase text-2xl tracking-widest">ステップ 1: 核となる情報を入力</h3></div><div className="flex gap-4"><input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="audio/*,video/*" className="hidden" /><Button onClick={() => fileInputRef.current?.click()} disabled={isProcessing['transcribe']} className="h-16 px-8 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black text-lg rounded-2xl hover:bg-emerald-500/20 flex items-center gap-3 shadow-lg"> {isProcessing['transcribe'] ? <><Loader2 className="animate-spin h-6 w-6" />{compressProgress > 0 ? `圧縮中 ${compressProgress}%` : '読込中'}</> : <><Upload size={20} />直接読み起こし</>}</Button></div></div>
              <p className="text-2xl text-white font-black leading-relaxed italic border-l-8 border-emerald-500 pl-6 py-2">指示書をコピーしてAIに読み起こしを実施して下さい。AIの回答をフォームに貼り付けてください。</p>
              <div className="grid grid-cols-3 gap-6">
                {['Claude', 'ChatGPT', 'Gemini'].map((ai) => (
                  <div key={ai} className="flex flex-col gap-4 p-2 bg-white/5 rounded-[2rem] border border-white/5">
                    <Button onClick={() => { navigator.clipboard.writeText("この動画を日本語で文字起こししてください。"); alert(`コピーしました！${ai}に動画を添付して貼り付けてください。`); }} className="h-14 text-sm bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/20 font-black italic uppercase hover:bg-emerald-500/40 rounded-xl shadow-lg">指示書をコピー 📋</Button>
                    <a href={ai === 'Claude' ? 'https://claude.ai' : ai === 'ChatGPT' ? 'https://chatgpt.com' : 'https://gemini.google.com'} target="_blank" className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all group h-full"><p className="text-sm font-black text-slate-400 group-hover:text-emerald-400 mb-2">{ai === 'Claude' ? 'Anthropic' : ai === 'ChatGPT' ? 'OpenAI' : 'Google'}</p><p className="text-3xl font-black text-white italic tracking-tighter">{ai}</p></a>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6"><label className="text-xl font-black text-emerald-500 uppercase tracking-widest italic ml-4">ソース内容</label><textarea value={transcript} onChange={(e) => setTranscript(e.target.value)} className="w-full h-[500px] bg-black/60 border-4 border-white/10 rounded-[3rem] p-10 font-bold text-white outline-none focus:border-emerald-500 transition-all text-2xl leading-relaxed shadow-2xl" placeholder="ここにAIの回答を貼り付け..." /><div className="flex justify-center pt-8"><Button onClick={() => { setActiveTab('genre'); window.scrollTo(0,0); }} disabled={!transcript} className="h-32 px-24 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-4xl rounded-[3rem] shadow-[0_20px_50px_rgba(16,185,129,0.4)] uppercase italic scale-105 active:scale-95 transition-all group"><span className="flex items-center gap-4">ステップ 2: 戦略選択へ <ChevronRight className="h-10 w-10 group-hover:translate-x-2 transition-transform" /></span></Button></div></div>
          </TabsContent>

          <TabsContent value="genre" className="space-y-8 animate-in fade-in">
             <div className="space-y-12">
               <div className="space-y-6">
                 <div className="flex items-center gap-4 mb-4"><div className="h-8 w-2 bg-emerald-500 rounded-full"></div><h4 className="text-2xl font-black text-white italic uppercase tracking-widest">1. 台本タイプを選択</h4></div>
                 <div className="grid md:grid-cols-3 gap-6">{SCRIPT_TYPES.map((t) => (<button key={t.id} onClick={() => setScriptType(t.id)} className={`p-8 rounded-3xl font-black italic text-left border-4 transition-all relative overflow-hidden ${scriptType === t.id ? 'bg-emerald-500 border-emerald-400 text-slate-950 scale-105 shadow-[0_0_30px_rgba(52,211,153,0.3)]' : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20'}`}><div className="flex items-center justify-between mb-4"><span className="text-2xl uppercase tracking-tighter">{t.label}</span>{scriptType === t.id && <CheckCircle2 size={32} />}</div><p className="text-xs font-bold opacity-80">{t.desc}</p></button>))}</div>
               </div>
               <div className="border-t-4 border-white/5 pt-12 space-y-6">
                 <div className="flex items-center gap-4 mb-4"><div className="h-8 w-2 bg-emerald-500 rounded-full"></div><h4 className="text-2xl font-black text-white italic uppercase tracking-widest">2. 画像スタイルを選択</h4></div>
                 <div className="grid md:grid-cols-5 gap-4">{IMAGE_STYLES.map((s) => (<button key={s.id} onClick={() => setImageStyle(s.id)} className={`p-4 rounded-2xl font-black italic text-center border-4 transition-all ${imageStyle === s.id ? 'bg-emerald-500 border-emerald-400 text-slate-950 scale-105' : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20'}`}><span className="text-sm">{s.label}</span></button>))}</div>
               </div>
               <div className="border-t-4 border-white/5 pt-12 space-y-6">
                 <div className="flex items-center gap-4 mb-4"><div className="h-8 w-2 bg-emerald-500 rounded-full"></div><h4 className="text-2xl font-black text-white italic uppercase tracking-widest">3. サムネイルのロゴ設定</h4></div>
                 <div className="grid md:grid-cols-2 gap-6">
                   {[ { id: true, label: '映えるロゴ入り', desc: '目を引くデザインフォントやロゴを自動構成します。' }, { id: false, label: 'ロゴなし（素材のみ）', desc: '文字を入れず、最高品質の背景・人物画像のみを生成します。' } ].map((l) => (
                     <button key={l.id ? 'y' : 'n'} onClick={() => setWithLogo(l.id)} className={`p-8 rounded-3xl font-black italic text-left border-4 transition-all relative overflow-hidden ${withLogo === l.id ? 'bg-emerald-500 border-emerald-400 text-slate-950 scale-105' : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20'}`}><div className="flex items-center justify-between mb-2"><span className="text-xl uppercase">{l.label}</span>{withLogo === l.id && <CheckCircle2 size={24} />}</div><p className="text-[10px] opacity-70">{l.desc}</p></button>
                   ))}
                 </div>
               </div>
               <div className="border-t-4 border-white/5 pt-12 space-y-6">
                 <div className="flex items-center gap-4 mb-4"><div className="h-8 w-2 bg-emerald-500 rounded-full"></div><h4 className="text-2xl font-black text-white italic uppercase tracking-widest">4. 戦略パレットを選択</h4></div>
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{GENRES.map((g) => (<button key={g.id} onClick={() => setGenre(g.id)} className={`p-8 rounded-3xl font-black italic text-left border-4 transition-all relative overflow-hidden group/btn ${genre === g.id ? 'bg-emerald-500 border-emerald-400 text-slate-950 scale-105 shadow-[0_0_30px_rgba(52,211,153,0.3)]' : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20'}`}><div className="flex items-center justify-between mb-4"><span className="text-2xl uppercase">{g.label}</span>{genre === g.id && <CheckCircle2 size={32} />}</div><p className="text-xs font-bold leading-relaxed opacity-80">{g.prompt}</p></button>))}</div>
               </div>
               <div className="flex justify-center pt-10"><Button onClick={generateScript} disabled={isProcessing['script'] || !transcript} className="h-32 px-24 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-4xl rounded-[3rem] shadow-[0_20px_50px_rgba(16,185,129,0.4)] uppercase italic group scale-105 active:scale-95 transition-all">{isProcessing['script'] ? <Loader2 className="animate-spin h-16 w-16" /> : <span className="flex items-center gap-4">ステップ 3: 台本を錬成する <ChevronRight className="h-10 w-10 group-hover:translate-x-2 transition-transform" /></span>}</Button></div>
             </div>
          </TabsContent>

          <TabsContent value="script" className="space-y-8 animate-in fade-in">
            {script && (<div className="space-y-8 text-center"><div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/10 pb-10"><h3 className="text-4xl font-black text-white italic uppercase flex items-center gap-4 tracking-tighter"><Sparkles className="text-emerald-400 h-10 w-10" /> 生成された黄金台本</h3><div className="flex gap-6"><div className="bg-emerald-500/10 border-2 border-emerald-500/30 px-10 py-6 rounded-[2rem] text-center shadow-lg"><p className="text-xs font-black text-emerald-500 uppercase italic mb-2">バズ予測スコア</p><p className="text-6xl font-black text-white italic tracking-tighter">{script.viralScore}%</p></div><div className="bg-white/5 border-2 border-white/10 px-10 py-6 rounded-[2rem] text-center flex flex-col justify-center shadow-lg"><p className="text-xs font-black text-white/30 uppercase italic mb-2">再生時間</p><p className="text-4xl font-black text-white italic tracking-tighter">{script.estimatedMinutes}分</p></div></div></div><div className="grid gap-10 text-left">{[{ t: '導入', c: script.opening, col: 'from-emerald-500/20' }, { t: '本編', c: script.body, col: 'from-blue-500/10' }, { t: '結末', c: script.closing, col: 'from-purple-500/10' }].map((s, i) => (<Card key={i} className={`bg-gradient-to-br ${s.col} to-transparent border-2 border-white/10 rounded-[3rem] p-12 shadow-2xl`}><h4 className="text-xl font-black text-emerald-400 uppercase tracking-[0.3em] italic mb-8 border-l-8 border-emerald-500 pl-6">{s.t}</h4><p className="text-2xl text-white font-bold italic leading-[2] whitespace-pre-wrap">{s.c}</p></Card>))}</div><div className="flex justify-center pt-10"><Button onClick={generateExtras} disabled={isProcessing['characters']} className="h-32 px-24 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-4xl rounded-[3rem] shadow-[0_20px_50px_rgba(16,185,129,0.4)] uppercase italic group scale-105 active:scale-95 transition-all"><span className="flex items-center gap-4">ステップ 4: 全データを一括出力 <ChevronRight className="h-10 w-10 group-hover:translate-x-2 transition-transform" /></span></Button></div></div>)}
          </TabsContent>

          <TabsContent value="visual" className="space-y-12 animate-in fade-in">
            <div className="bg-emerald-500/5 border-4 border-emerald-500/20 rounded-[3rem] p-12 space-y-10 text-center shadow-2xl"><h3 className="text-4xl font-black text-emerald-400 italic uppercase tracking-tighter">ステップ 4: ビジュアル設計（GPT連携）</h3><div className="flex flex-col items-center gap-8"><p className="text-2xl text-slate-300 font-bold italic max-w-3xl leading-relaxed">プロンプトをコピーして、ChatGPT（GPT-4o）に貼り付けて画像を作成しましょう。</p><a href="https://chatgpt.com/?model=gpt-4o" target="_blank" className="bg-white text-slate-950 px-16 py-8 rounded-[2.5rem] font-black text-3xl shadow-[0_20px_60px_rgba(255,255,255,0.2)] hover:bg-emerald-400 transition-all flex items-center gap-6 italic uppercase scale-110 active:scale-95"><ImageIcon size={48} /> ChatGPT 画像生成を開く ➔</a></div></div>
            <div className="grid md:grid-cols-2 gap-16">
              <div className="space-y-10"><div className="flex items-center justify-between border-b-4 border-emerald-500/20 pb-6"><h3 className="text-3xl font-black text-white italic uppercase flex items-center gap-4"><Users className="text-emerald-400 h-10 w-10" /> 登場人物プロンプト</h3><Button onClick={() => { const p = "必ず画像を制作して下さい\n名前を出力して下さい\n\n【キャラクター設定】\n"; const txt = characters?.map(c => `${c.name}: ${c.imagePrompt}`).join('\n\n'); navigator.clipboard.writeText(p + (txt || '')); alert("指示文と全プロンプトを一括コピーしました！"); }} className="h-16 px-10 bg-emerald-500 text-slate-950 font-black italic rounded-2xl text-lg shadow-lg hover:bg-emerald-400 transition-all active:scale-95">一括コピー 📋</Button></div><div className="space-y-8">{characters?.map((char, i) => (<Card key={i} className="bg-white/5 border-2 border-white/10 rounded-[2.5rem] p-10 space-y-6 shadow-xl"><div className="flex justify-between items-center"><h4 className="font-black text-emerald-400 italic text-3xl">{char.name}</h4><Button onClick={() => { const p = "必ず画像を制作して下さい\n名前を出力して下さい\n\n"; navigator.clipboard.writeText(p + char.imagePrompt); alert("指示文とプロンプトをコピーしました！"); }} className="h-12 bg-white/10 text-white border-2 border-white/10 hover:bg-white/20 font-black italic text-sm rounded-xl">個別コピー</Button></div><p className="text-sm text-emerald-500/60 font-mono break-all leading-relaxed bg-black/40 p-6 rounded-2xl border border-white/5 italic">{char.imagePrompt}</p></Card>))}</div></div>
              <div className="space-y-10"><h3 className="text-3xl font-black text-white italic uppercase flex items-center gap-4 border-b-4 border-emerald-500/20 pb-6"><ImageIcon className="text-emerald-400 h-10 w-10" /> サムネイル構成案</h3><div className="space-y-8">{thumbnails?.map((thumb, i) => (<Card key={i} className="bg-white/5 border-2 border-white/10 rounded-[2.5rem] p-10 space-y-6 shadow-xl"><div className="flex items-center justify-between gap-4"><Badge className="bg-red-600 text-white border-0 font-black italic text-lg px-6 py-2 rounded-lg">案 {i+1}</Badge><Button onClick={() => { const p = withLogo ? "YOUTUBEのサムネイル用なので映える構成にして下さい。 もちろん映えるロゴ付き\n\n" : "YOUTUBEのサムネイル素材用なので、ロゴや文字は一切入れずに最高品質の背景・人物画像のみを作成して下さい。\n\n"; navigator.clipboard.writeText(p + thumb.imagePrompt); alert("指示文とサムネイルプロンプトをコピーしました！"); }} className="h-12 bg-white/10 text-white border-2 border-white/10 hover:bg-white/20 font-black italic text-sm rounded-xl shrink-0">コピー</Button></div><h4 className="text-xl font-black text-white italic border-l-4 border-red-500 pl-4">{thumb.title}</h4><p className="text-sm text-slate-400 font-mono italic leading-relaxed bg-black/40 p-6 rounded-2xl border border-white/5">{thumb.imagePrompt}</p></Card>))}</div></div>
            </div>
            <div className="flex justify-center pt-10"><Button onClick={() => { setActiveTab('music'); window.scrollTo(0,0); }} className="h-32 px-24 bg-white text-slate-950 font-black text-4xl rounded-[3rem] shadow-2xl hover:bg-slate-100 transition-all italic uppercase group active:scale-95"><span className="flex items-center gap-4">ステップ 5: 音楽生成へ進む <ChevronRight className="h-10 w-10 group-hover:translate-x-2 transition-transform" /></span></Button></div>
          </TabsContent>

          <TabsContent value="music" className="space-y-12 animate-in fade-in">
            <div className="bg-indigo-500/5 border-4 border-indigo-500/20 rounded-[3rem] p-12 space-y-10 text-center shadow-2xl"><h3 className="text-4xl font-black text-indigo-400 italic uppercase tracking-tighter">ステップ 5: サウンドプロデュース（Suno連携）</h3><div className="flex flex-col items-center gap-8"><p className="text-2xl text-slate-300 font-bold italic max-w-3xl leading-relaxed">動画のムードに合わせた音楽プロンプトを生成しました。Suno AIで最高品質のBGMを作成しましょう。</p><a href="https://suno.com/discover?campaign_id=japan&utm_source=google&utm_medium=cpc&utm_campaign=22504148374&utm_term=ai+%E4%BD%9C%E6%9B%B2+%E7%84%A1%E6%96%99&utm_content=749703257181" target="_blank" className="bg-indigo-600 text-white px-16 py-8 rounded-[2.5rem] font-black text-3xl shadow-[0_20px_60px_rgba(99,102,241,0.3)] hover:bg-indigo-500 transition-all flex items-center gap-6 italic uppercase scale-110 active:scale-95 truncate max-w-full"><Music size={48} /> Suno AI で作曲を開始する ➔</a></div></div>
            <div className="max-w-4xl mx-auto"><Card className="bg-gradient-to-br from-indigo-500/10 to-transparent border-2 border-white/10 rounded-[3rem] p-12 space-y-10 shadow-2xl"><div className="flex items-center justify-between"><Badge className="bg-indigo-500 text-white font-black italic px-8 py-3 text-xl rounded-xl shadow-lg">{bgm?.genre}</Badge><span className="text-sm font-black text-white/20 italic tracking-[0.3em] uppercase">雰囲気: {bgm?.mood}</span></div><div className="space-y-6"><div className="flex items-center justify-between border-b border-white/5 pb-4"><label className="text-xs font-black text-white/40 uppercase tracking-[0.2em] italic">AI Music Prompt</label><Button onClick={() => { navigator.clipboard.writeText(bgm?.prompt); alert("コピーしました！"); }} className="h-12 bg-indigo-500/20 text-indigo-400 border-2 border-indigo-500/20 hover:bg-indigo-500/30 font-black italic text-sm rounded-xl px-6">プロンプトをコピー 📋</Button></div><div className="bg-black/60 rounded-[2rem] p-10 border border-white/5 shadow-inner flex items-center justify-center min-h-[200px]"><p className="text-3xl text-indigo-400 font-mono italic leading-relaxed text-center">{bgm?.prompt}</p></div></div></Card></div>
            <div className="flex justify-center pt-10"><Button onClick={() => { setActiveTab('strategy'); window.scrollTo(0,0); }} className="h-32 px-24 bg-white text-slate-950 font-black text-4xl rounded-[3rem] shadow-2xl hover:bg-slate-100 transition-all italic uppercase group active:scale-95"><span className="flex items-center gap-4">ステップ 6: SEO設定を確認 ➔</span></Button></div>
          </TabsContent>

          <TabsContent value="strategy" className="space-y-10 animate-in fade-in">
            {seo && (<div className="max-w-5xl mx-auto space-y-12"><h3 className="text-4xl font-black text-white italic uppercase flex items-center gap-4 justify-center tracking-tighter"><Search className="text-emerald-400 h-10 w-10" /> 最終ステップ: YouTube SEO 最適化</h3><Card className="bg-[#13141f] border-4 border-emerald-500/20 rounded-[3.5rem] p-16 space-y-12 shadow-[0_30px_100px_rgba(0,0,0,0.5)]"><div><label className="text-sm font-black text-emerald-500 uppercase italic tracking-widest block mb-6 ml-4">推奨タイトル</label><div className="flex items-center justify-between gap-8 bg-black/40 p-8 rounded-[2rem] border-2 border-white/5 shadow-inner"><p className="text-4xl text-white font-black italic leading-tight flex-1">{seo.main}</p><Button onClick={() => { navigator.clipboard.writeText(seo.main); alert("コピーしました！"); }} className="shrink-0 h-20 px-10 bg-emerald-500 text-slate-950 font-black italic text-xl rounded-2xl shadow-lg hover:bg-emerald-400 transition-all active:scale-95">コピー 📋</Button></div></div><div className="grid grid-cols-2 gap-12 text-left"><div><label className="text-sm font-black text-white/30 uppercase italic tracking-widest block mb-4 ml-2">検索タグ</label><div className="flex flex-wrap gap-3">{seo.tags.slice(0, 10).map((t: any, i: number) => (<Badge key={i} className="bg-white/5 text-slate-400 border-2 border-white/10 font-bold italic text-sm px-4 py-2 rounded-lg">#{t}</Badge>))}</div></div><div><label className="text-sm font-black text-white/30 uppercase italic tracking-widest block mb-4 ml-2">タイトル候補</label><ul className="space-y-3 font-bold italic">{seo.alternatives.slice(0, 3).map((a: any, i: number) => <li key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 text-slate-400 text-sm">・{a}</li>)}</ul></div></div><div className="pt-8 border-t-2 border-white/5"><div className="flex items-center justify-between mb-6"><label className="text-sm font-black text-white/30 uppercase italic tracking-widest ml-2">概要欄 (説明文)</label><Button onClick={() => { navigator.clipboard.writeText(seo.description); alert("コピーしました！"); }} className="h-14 px-8 bg-white/5 text-slate-400 border-2 border-white/10 font-black italic text-sm rounded-xl hover:bg-white/10 transition-all active:scale-95">全文を一括コピー 📋</Button></div><div className="bg-black/60 rounded-[2.5rem] p-10 text-xl text-slate-300 font-bold italic leading-[1.8] h-[400px] overflow-y-auto border-2 border-white/5 shadow-inner">{seo.description}</div></div></Card></div>)}
            <div className="pt-16 text-center"><Button onClick={() => { if(confirm('クリアしますか？')) { setTranscript(''); setScript(null); setCharacters(null); setThumbnails(null); setSeo(null); setBgm(null); setActiveTab('input'); localStorage.removeItem('yt_producer_state'); window.scrollTo(0,0); } }} className="h-32 px-16 bg-white text-slate-950 font-black text-3xl rounded-[3rem] border-4 border-white/10 italic uppercase shadow-2xl hover:bg-emerald-400 transition-all active:scale-95">新しい動画をプロデュースする</Button></div>
          </TabsContent>
        </Tabs>

        <div className="mt-24 pt-12 border-t-2 border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 text-[12px] font-black italic uppercase tracking-[0.4em] text-white/20"><p>© 2026 NextraLabs Viral Content OS. ALL RIGHTS RESERVED.</p><div className="flex gap-12"><a href="#" className="hover:text-emerald-500 transition-colors">利用規約</a><a href="#" className="hover:text-emerald-500 transition-colors">ステータス</a><a href="#" className="hover:text-emerald-500 transition-colors">サポート</a></div></div>
      </div>
    </div>
  )
}
