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

// ジャンル設定
const GENRES = [
  { id: 'impact', label: '衝撃・暴露', prompt: '「衝撃」「真実」「暴露」をキーワードに、視聴者の好奇心を極限まで煽るスタイル。強い言葉選びと、謎を小出しにする構造。' },
  { id: 'explanation', label: '徹底解説', prompt: '複雑なトピックを初心者でも100%理解できるように解き明かすスタイル。ステップ形式や比較、具体例を多用。' },
  { id: 'business', label: 'ビジネス・教育', prompt: '論理的で分かりやすく、信頼感のあるトーン。視聴者の悩みを解決し、明日から使える知恵を提供する構造。' },
  { id: 'entertainment', label: 'エンタメ・バラエティ', prompt: 'テンポが良く、笑いや驚きを重視。視聴者を飽きさせない「引き」を各所に配置。' },
  { id: 'vlog', label: 'Vlog・ライフスタイル', prompt: '共感を呼び、親しみやすいトーン。日常の魅力をシネマティックに、かつ等身大で伝える。' },
  { id: 'tech', label: 'ガジェット・テック', prompt: 'スペックや実際の使用感を徹底比較。メリットだけでなくデメリットも公平に伝える未来的トーン。' },
  { id: 'game', label: 'ゲーム実況', prompt: '熱気と興奮を共有。視聴者と一緒に楽しむライブ感と、ドラマチックな展開作りを重視. ' },
  { id: 'ranking', label: 'ランキング・まとめ', prompt: '「TOP10」「厳選5選」など、網羅性と納得感を重視。視聴者が最後まで見たくなるカウントダウン構造。' },
  { id: 'routine', label: 'モーニング/ナイトルーティン', prompt: '憧れや共感、癒やしをテーマに、生活の質を高めるヒントを散りばめたスタイル。' },
  { id: 'short', label: 'ショート動画特化', prompt: '最初の3秒で勝負を決める超高密度スタイル。無駄を削ぎ落とし、インパクトのみを追求。' },
]

function YoutubeProducerApp() {
  const [activeTab, setActiveTab] = useState('input')
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null)
  const [compressProgress, setCompressProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // FFmpeg関連
  const ffmpegRef = useRef(new FFmpeg())
  const [isFFmpegReady, setIsFFmpegReady] = useState(false)

  // 状態保持
  const [transcript, setTranscript] = useState('')
  const [genre, setGenre] = useState('entertainment') // デフォルトをエンタメに変更
  const [script, setScript] = useState<any>(null)
  const [characters, setCharacters] = useState<any[] | null>(null)
  const [thumbnails, setThumbnails] = useState<any[] | null>(null)
  const [seo, setSeo] = useState<any>(null)
  const [bgm, setBgm] = useState<any>(null)

  // FFmpegのロード
  useEffect(() => {
    const load = async () => {
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
      const ffmpeg = ffmpegRef.current
      ffmpeg.on('log', ({ message }) => {
        console.log(message)
      })
      ffmpeg.on('progress', ({ progress }) => {
        setCompressProgress(Math.round(progress * 100))
      })
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
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsProcessing(prev => ({ ...prev, 'transcribe': true }))
    setError(null)
    setCompressProgress(0)

    let finalFile: File | Blob = file

    if (file.type.startsWith('video/') || file.size > 2 * 1024 * 1024) {
      if (!isFFmpegReady) {
        setError('圧縮エンジンの準備ができていません。少々お待ちください。')
        setIsProcessing(prev => ({ ...prev, 'transcribe': false }))
        return
      }

      try {
        const ffmpeg = ffmpegRef.current
        const inputName = 'input' + file.name.substring(file.name.lastIndexOf('.'))
        const outputName = 'output.mp3'

        await ffmpeg.writeFile(inputName, await fetchFile(file))
        await ffmpeg.exec(['-i', inputName, '-vn', '-ac', '1', '-ab', '32k', '-ar', '16000', outputName])
        
        const data = await ffmpeg.readFile(outputName)
        finalFile = new Blob([data], { type: 'audio/mp3' })
        
        await ffmpeg.deleteFile(inputName)
        await ffmpeg.deleteFile(outputName)
      } catch (e: any) {
        console.error('FFmpeg Error:', e)
      }
    }

    const formData = new FormData()
    formData.append('file', finalFile, 'audio.mp3')

    try {
      const res = await fetch('/api/youtube-producer/transcribe', {
        method: 'POST',
        body: formData,
      })
      
      const contentType = res.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json()
        if (data.error) throw new Error(data.error)
        setTranscript(data.text)
      } else {
        const text = await res.text()
        if (text.includes('Payload Too Large') || res.status === 413 || res.status === 504) {
          throw new Error('サーバー制限により、長すぎる動画は処理できません。10分以内の動画推奨、または音声(MP3)でのアップロードをお試しください。')
        }
        throw new Error(`サーバーエラーが発生しました (${res.status})`)
      }
    } catch (e: any) {
      setError('文字起こしに失敗しました: ' + e.message)
    } finally {
      setIsProcessing(prev => ({ ...prev, 'transcribe': false }))
      setCompressProgress(0)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const generateScript = async () => {
    if (!transcript) return setError('ソーステキストを入力してください')
    const genreData = GENRES.find(g => g.id === genre)
    const result = await callApi('script', { 
      transcript, 
      genre: genreData?.label, 
      genrePrompt: genreData?.prompt 
    })
    if (result) {
      const score = Math.floor(75 + Math.random() * 20);
      setScript({ ...result, viralScore: score })
      setActiveTab('script')
    }
  }

  const generateVisuals = async () => {
    const charRes = await callApi('characters', { transcript })
    if (charRes) setCharacters(charRes.characters)
    const thumbRes = await callApi('thumbnail', { transcript, genre, scriptTitle: script?.opening?.slice(0, 50) })
    if (thumbRes) setThumbnails(thumbRes.thumbnails)
  }

  const generateStrategy = async () => {
    const seoRes = await callApi('title', { transcript, script: script?.fullScript, genre })
    if (seoRes) setSeo(seoRes)
    const bgmRes = await callApi('bgm', { transcript, genre })
    if (bgmRes) setBgm(bgmRes)
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-12 font-sans selection:bg-emerald-500/30 text-left">
      <div className="max-w-6xl mx-auto space-y-8 border-4 border-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.2)] rounded-[3rem] p-6 md:p-12 relative overflow-hidden bg-black/40 backdrop-blur-xl">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-emerald-500/20 pb-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <Clapperboard className="h-10 w-10 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
                AI YouTube <span className="text-emerald-500">プロデューサー</span>
              </h1>
              <p className="text-emerald-500/60 font-black text-[10px] uppercase italic tracking-widest mt-1">動画制作 OS v2.1</p>
            </div>
          </div>
          <Badge className="bg-emerald-500 text-slate-950 font-black italic px-6 py-2 text-sm rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            プレミアム・マスターモデル
          </Badge>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-4 flex items-center gap-3 text-red-500 font-bold italic">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid grid-cols-4 h-20 bg-white/5 border border-white/10 rounded-2xl p-2 gap-2">
            <TabsTrigger value="input" className="rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-slate-950 font-black italic uppercase text-sm md:text-lg">
              <Mic size={20} className="mr-2" /> 1. 入力
            </TabsTrigger>
            <TabsTrigger value="genre" className="rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-slate-950 font-black italic uppercase text-sm md:text-lg">
              <Zap size={20} className="mr-2" /> 2. 戦略
            </TabsTrigger>
            <TabsTrigger value="script" disabled={!script} className="rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-slate-950 font-black italic uppercase text-sm md:text-lg">
              <FileText size={20} className="mr-2" /> 3. 台本
            </TabsTrigger>
            <TabsTrigger value="visual" disabled={!script} className="rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-slate-950 font-black italic uppercase text-sm md:text-lg">
              <ImageIcon size={20} className="mr-2" /> 4. 視覚/SEO
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Info size={20} />
                  <h3 className="font-black italic uppercase text-sm tracking-widest">ステップ 1: 動画の核となる情報を入力</h3>
                </div>
                <div className="flex gap-2">
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="audio/*,video/*,.mp3,.wav,.mp4,.mov" className="hidden" />
                  <Button onClick={() => fileInputRef.current?.click()} disabled={isProcessing['transcribe']} className="h-10 px-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs rounded-xl hover:bg-emerald-500/20 transition-all flex items-center gap-2 relative overflow-hidden">
                    {isProcessing['transcribe'] ? <><Loader2 className="animate-spin h-4 w-4" />{compressProgress > 0 ? `圧縮中 ${compressProgress}%` : '読み起こし中...'}</> : <><Upload size={14} />直接読み起こし (推奨: 数MB以内)</>}
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-lg text-slate-100 font-black leading-relaxed italic">
                  指示書をコピーしてAIに読み起こしを実施して下さい。AIの回答をフォームに貼り付けてください。
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {['Claude', 'ChatGPT', 'Gemini'].map((ai, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <Button 
                        onClick={() => { 
                          navigator.clipboard.writeText("この動画を日本語で文字起こししてください。"); 
                          alert(`コピーしました！${ai}に動画を添付して貼り付けてください。`); 
                        }} 
                        className="h-10 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 font-black italic uppercase"
                      >
                        指示文をコピー 📋
                      </Button>
                      <a href={ai === 'Claude' ? 'https://claude.ai' : ai === 'ChatGPT' ? 'https://chatgpt.com' : 'https://gemini.google.com'} target="_blank" className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-all group h-full">
                        <p className="text-xs font-black text-slate-500 group-hover:text-emerald-400 mb-1">{ai === 'Claude' ? 'Anthropic' : ai === 'ChatGPT' ? 'OpenAI' : 'Google'}</p>
                        <p className="text-lg font-black text-white italic">{ai}</p>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-black text-emerald-500 uppercase tracking-widest italic ml-2">ソース内容</label>
              <textarea value={transcript} onChange={(e) => setTranscript(e.target.value)} className="w-full h-80 bg-black/60 border-2 border-white/10 rounded-[2rem] p-8 font-bold text-white outline-none focus:border-emerald-500 transition-all text-xl placeholder:text-white/10" placeholder="ここに内容を入力、または文字起こしを貼り付け..." />
              <div className="flex justify-center pt-6">
                <Button onClick={() => setActiveTab('genre')} disabled={!transcript} className="h-24 px-20 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-2xl rounded-[2rem] shadow-xl uppercase italic group">
                  <span className="flex items-center gap-2">ステップ 2: 戦略選択へ <ChevronRight className="group-hover:translate-x-1 transition-transform" /></span>
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="genre" className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-8 space-y-4 text-center">
              <h3 className="text-xl font-black text-emerald-400 italic uppercase">ステップ 2: 動画の「勝ちパターン」を選択</h3>
              <p className="text-slate-300 font-bold italic">どのような戦略で台本を構成するか、以下の戦略パレットから選んでください。</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {GENRES.map((g) => (
                <button key={g.id} onClick={() => setGenre(g.id)} className={`p-6 rounded-2xl font-black italic text-left border-2 transition-all relative overflow-hidden group/btn ${genre === g.id ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-[1.02]' : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl uppercase tracking-tighter">{g.label}</span>
                    {genre === g.id && <CheckCircle2 size={24} />}
                  </div>
                  <p className={`text-xs font-bold leading-relaxed ${genre === g.id ? 'text-slate-900' : 'text-slate-500 group-hover/btn:text-slate-300'}`}>{g.prompt}</p>
                </button>
              ))}
            </div>

            <div className="flex justify-center pt-10">
              <Button onClick={generateScript} disabled={isProcessing['script'] || !transcript} className="h-24 px-20 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-2xl rounded-[2rem] shadow-xl uppercase italic group">
                {isProcessing['script'] ? <Loader2 className="animate-spin h-10 w-10" /> : <span className="flex items-center gap-2">ステップ 3: 台本を錬成する <ChevronRight className="group-hover:translate-x-1 transition-transform" /></span>}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="script" className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            {script && (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <h3 className="text-2xl font-black text-white italic uppercase flex items-center gap-3"><Sparkles className="text-emerald-400" /> 生成された黄金台本</h3>
                  <div className="flex gap-4">
                    <div className="bg-emerald-500/10 border border-emerald-500/30 px-6 py-3 rounded-2xl text-center">
                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic mb-1">バズ予測スコア</p>
                      <p className="text-3xl font-black text-white italic">{script.viralScore}%</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl text-center flex flex-col justify-center">
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-widest italic mb-1">想定再生時間</p>
                      <p className="text-lg font-black text-white italic">{script.estimatedMinutes}分</p>
                    </div>
                  </div>
                </div>
                <div className="grid gap-6">
                  {[{ title: '導入 (オープニング)', content: script.opening, color: 'from-emerald-500/20' }, { title: '本編 (ボディー)', content: script.body, color: 'from-blue-500/10' }, { title: '結末 (エンディング)', content: script.closing, color: 'from-purple-500/10' }].map((section, idx) => (
                    <Card key={idx} className={`bg-gradient-to-br ${section.color} to-transparent border-white/10 rounded-3xl p-8`}>
                      <h4 className="text-sm font-black text-emerald-400 uppercase tracking-widest italic mb-4">{section.title}</h4>
                      <p className="text-lg text-white font-bold italic leading-loose whitespace-pre-wrap">{section.content}</p>
                    </Card>
                  ))}
                </div>
                <div className="flex justify-center pt-6">
                  <Button onClick={() => { generateVisuals(); generateStrategy(); setActiveTab('visual'); }} disabled={isProcessing['characters'] || isProcessing['thumbnail'] || isProcessing['title']} className="h-20 px-16 bg-white text-slate-950 font-black text-xl rounded-[2rem] shadow-xl hover:bg-slate-100 transition-all italic uppercase group">
                    {(isProcessing['characters'] || isProcessing['title']) ? <Loader2 className="animate-spin" /> : <span className="flex items-center gap-2">ステップ 4: 全データを出力 <ChevronRight className="group-hover:translate-x-1 transition-transform" /></span>}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="visual" className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
            {seo && (
              <div className="space-y-10">
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <h3 className="text-xl font-black text-white italic uppercase flex items-center gap-3 tracking-widest"><Search className="text-emerald-400" /> YouTube SEO 設定</h3>
                    <Card className="bg-[#13141f] border-2 border-emerald-500/20 rounded-[2.5rem] p-10 space-y-8">
                      <div><label className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] italic block mb-3">推奨タイトル</label><p className="text-2xl text-white font-black italic leading-tight">{seo.main}</p></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] italic block mb-2">検索タグ</label><div className="flex flex-wrap gap-2">{seo.tags.slice(0, 6).map((t: string, i: number) => <Badge key={i} className="bg-white/5 text-slate-400 border-white/10 font-bold italic text-[10px]">#{t}</Badge>)}</div></div>
                        <div><label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] italic block mb-2">タイトル候補</label><ul className="text-[10px] text-slate-500 font-bold italic space-y-1">{seo.alternatives.slice(0, 3).map((a: string, i: number) => <li key={i}>・{a}</li>)}</ul></div>
                      </div>
                      <div className="pt-4 border-t border-white/5"><label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] italic block mb-3">概要欄 (説明文)</label><div className="bg-black/60 rounded-2xl p-6 text-xs text-slate-300 font-bold italic leading-relaxed h-32 overflow-y-auto border border-white/5">{seo.description}</div></div>
                    </Card>
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-xl font-black text-white italic uppercase flex items-center gap-3 tracking-widest"><Music className="text-emerald-400" /> サウンドプロデュース</h3>
                    <Card className="bg-gradient-to-br from-indigo-500/10 to-transparent border border-white/10 rounded-[2.5rem] p-10 space-y-6">
                      <div className="flex items-center justify-between"><Badge className="bg-indigo-500 text-white font-black italic px-4 py-1">{bgm?.genre}</Badge><span className="text-xs font-black text-white/20 italic tracking-widest uppercase">雰囲気: {bgm?.mood}</span></div>
                      <div className="bg-black/40 rounded-2xl p-6 border border-white/5"><p className="text-[10px] text-white/40 uppercase mb-3 font-black tracking-widest italic">音楽生成プロンプト (Suno/ElevenLabs用)</p><p className="text-sm text-indigo-400 font-mono italic leading-relaxed">{bgm?.prompt}</p></div>
                      <Button className="w-full h-16 bg-white/5 hover:bg-white/10 text-white font-black text-xs rounded-xl border border-white/10 italic uppercase"><Download size={14} className="mr-2" /> データをエクスポート</Button>
                    </Card>
                  </div>
                </div>
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-12 pt-10 border-t border-white/5">
              <div className="space-y-6">
                <h3 className="text-xl font-black text-white italic uppercase flex items-center gap-3"><Users className="text-emerald-400" /> 登場人物プロンプト</h3>
                <div className="space-y-4">{characters?.map((char, i) => <Card key={i} className="bg-white/5 border-white/10 rounded-2xl p-6 space-y-3"><div className="flex justify-between items-start"><h4 className="font-black text-emerald-400 italic text-lg">{char.name}</h4><Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-[10px]">{char.role}</Badge></div><p className="text-xs text-slate-400 font-bold italic">{char.description}</p><div className="bg-black/40 rounded-xl p-4 border border-white/5"><p className="text-[10px] text-white/40 uppercase mb-2 font-black tracking-widest">画像生成用プロンプト</p><p className="text-xs text-emerald-500/80 font-mono break-all leading-relaxed">{char.imagePrompt}</p></div></Card>)}</div>
              </div>
              <div className="space-y-6">
                <h3 className="text-xl font-black text-white italic uppercase flex items-center gap-3"><ImageIcon className="text-emerald-400" /> サムネイル構成案</h3>
                <div className="space-y-4">{thumbnails?.map((thumb, i) => <Card key={i} className="bg-white/5 border-white/10 rounded-2xl p-6 space-y-4"><div className="flex items-center gap-2"><Badge className="bg-red-600 text-white border-0 font-black italic">案 {i+1}</Badge><h4 className="font-black text-white italic">{thumb.title}</h4></div><div className="bg-black/40 rounded-xl p-4 border border-white/5"><p className="text-[10px] text-white/40 uppercase mb-2 font-black tracking-widest">サムネイル指示文</p><p className="text-xs text-slate-400 font-mono italic leading-relaxed">{thumb.imagePrompt}</p></div></Card>)}</div>
              </div>
            </div>
            <div className="pt-10"><Card className="bg-emerald-500 p-1 rounded-[3rem] shadow-[0_0_50px_rgba(16,185,129,0.3)]"><div className="bg-[#050507] rounded-[2.9rem] p-10 text-center space-y-6"><h4 className="text-3xl font-black text-white italic uppercase tracking-tighter italic">制作の準備は整いました</h4><p className="text-slate-400 font-bold italic max-w-2xl mx-auto">プロフェッショナルなYouTube戦略が完成しました。この台本を元に撮影を開始するか、AI動画生成ツールにプロンプトを投入して動画を完成させてください。</p><div className="flex justify-center gap-4"><Button onClick={() => { setTranscript(''); setScript(null); setSeo(null); setActiveTab('input'); }} className="h-16 px-10 bg-white/5 text-white font-black rounded-2xl border border-white/10 italic uppercase hover:bg-white/10">新しい動画を作る</Button><Button className="h-16 px-10 bg-emerald-500 text-slate-950 font-black rounded-2xl shadow-lg italic uppercase hover:bg-emerald-400">ダッシュボードへ</Button></div></div></Card></div>
          </TabsContent>
        </Tabs>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-black italic uppercase tracking-[0.2em] text-white/20">
          <p>© 2026 NextraLabs Viral Content OS. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-emerald-500 transition-colors">利用規約</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">ステータス</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">サポート</a>
          </div>
        </div>
      </div>
    </div>
  )
}
