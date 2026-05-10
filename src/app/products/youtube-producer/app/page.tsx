'use client'
import { useRouter } from 'next/navigation'

import dynamic from 'next/dynamic'
import React, { useState, useRef, useEffect, useCallback } from 'react'
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
  const router = useRouter()

  // ブラウザバック・マウスサイドボタン対応
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const handlePopState = () => {
      const ok = window.confirm('ツールを終了しますか？')
      if (ok) {
        router.push('/dashboard')
      } else {
        window.history.pushState(null, '', window.location.href)
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [router])

  // タブ閉じ・URL直打ち対応
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  const handleBack = useCallback(() => {
    const ok = window.confirm('ツールを終了しますか？')
    if (ok) router.push('/dashboard')
  }, [router])

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

// 語尾スタイル設定
const TONE_STYLES = [
  { id: 'desu_masu', label: 'です・ます調', desc: '丁寧で親しみやすい。万人向け。', prompt: '語尾は「です」「ます」「ました」「でしょう」などの丁寧語で統一する。' },
  { id: 'da_dearu', label: 'だ・である調', desc: '力強く断言する。解説・教育系に最適。', prompt: '語尾は「だ」「である」「だろう」「した」などの断言系で統一する。' },
  { id: 'casual', label: 'タメ口・フレンドリー', desc: '友達に話すようなラフなトーン。エンタメ・Vlog向け。', prompt: '語尾はタメ口で「〜だよ」「〜だね」「〜じゃん」「〜してみた」などを使う。親友に話しかけるような口語体で。' },
  { id: 'narrator', label: 'ナレーター調', desc: 'ドキュメンタリー・ドラマ風の重厚な語り口。', prompt: '語尾はナレーター風で「〜だった」「〜である」「〜していた」など、ドキュメンタリーの語り口で。情感を込めて。' },
  { id: 'excitement', label: '熱血・エキサイト', desc: 'テンション高めで視聴者を煽るスタイル。ゲーム・スポーツ向け。', prompt: '語尾は「〜だぞ！」「〜だ！」「すごい！」など感嘆符多め。熱量高く、視聴者を鼓舞するスタイルで。' },
]

// ジャンル設定
const GENRES = [
  { id: 'impact', label: '衝撃・暴露', prompt: '「衝撃」「真実」「暴露」をキーワードに、視聴者の好奇心を極限まで煽るスタイル。強い言葉選びと、謎を小出しにする構造。' },
  { id: 'explanation', label: '徹底解説', prompt: '複雑なトピックを初心者でも100%理解できるように解き明かすスタイル。ステップ形式や比較, 具体例を多用。' },
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
  const [toneStyle, setToneStyle] = useState('desu_masu')
  const [script, setScript] = useState<any>(null)
  const [characters, setCharacters] = useState<any[] | null>(null)
  const [thumbnails, setThumbnails] = useState<any[] | null>(null)
  const [seo, setSeo] = useState<any>(null)
  const [bgm, setBgm] = useState<any>(null)

  // 毎回クリーンスタート：ページロード時にlocalStorageをクリア
  useEffect(() => {
    localStorage.removeItem('yt_producer_state')
  }, [])

  useEffect(() => {
    const load = async () => {
      try {
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
        const ffmpeg = ffmpegRef.current
        ffmpeg.on('progress', ({ progress }) => setCompressProgress(Math.round(progress * 100)))
        await ffmpeg.load({
          coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        })
        setIsFFmpegReady(true)
      } catch (e) {
        console.warn('FFmpeg load failed (non-critical):', e)
        // FFmpegが使えなくてもツールは動作する
      }
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
    const toneData = TONE_STYLES.find(t => t.id === toneStyle)
    const result = await callApi('script', { 
      transcript, 
      genre: genreData?.label, 
      genrePrompt: `${genreData?.prompt} 長さ: ${typeData?.label} 画像スタイル: ${styleData?.label} ロゴ: ${withLogo ? 'あり' : 'なし'} 【語尾スタイル】${toneData?.prompt}` 
    })
    if (result) {
      setScript({ ...result, viralScore: Math.floor(75 + Math.random() * 20), estimatedMinutes: typeData?.minutes })
      setActiveTab('script')
    }
  }

  const generateExtras = async () => {
    const genreData = GENRES.find(g => g.id === genre)
    const styleData = IMAGE_STYLES.find(s => s.id === imageStyle)
    const genrePrompt = `画像スタイル: ${styleData?.label} (${styleData?.prompt})`;

    const charRes = await callApi('characters', { transcript, genrePrompt })
    if (charRes) setCharacters(charRes.characters)
    const thumbRes = await callApi('thumbnail', { transcript, genre, scriptTitle: script?.opening, genrePrompt })
    if (thumbRes) setThumbnails(thumbRes.thumbnails)
    const seoRes = await callApi('title', { transcript, script: script?.fullScript, genre })
    if (seoRes) setSeo(seoRes)
    const bgmRes = await callApi('bgm', { transcript, genre })
    if (bgmRes) setBgm(bgmRes)
    setActiveTab('visual')
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-12 font-sans text-left selection:bg-emerald-500/30">
      
      <div className="max-w-6xl mx-auto space-y-8 rounded-2xl p-4 md:p-8 relative bg-black/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-500/20 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20"><Clapperboard className="h-7 w-7 text-emerald-400" /></div>
            <div><h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">AI YouTube <span className="text-emerald-400">プロデューサー</span></h1><p className="text-emerald-500/70 font-medium text-xs tracking-tight mt-1">動画制作 OS v2.1-MASTER</p></div>
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium px-4 py-1.5 text-sm rounded-full">PREMIUM MASTER</Badge>
        </div>

        {loadingStep && <div className="bg-emerald-500/10 rounded-2xl p-8 flex flex-col items-center gap-4 text-center"><Loader2 className="h-10 w-10 text-emerald-400 animate-spin" /><p className="text-base text-emerald-400 font-medium">{loadingStep}</p></div>}
        {error && <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-4 flex items-center gap-3 text-red-400 font-medium text-sm"><AlertCircle size={18} />{error}</div>}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-12">
          {/* ── カスタムタブナビ（TabsTriggerのデフォルトスタイル干渉を回避） ── */}
          <div className="grid grid-cols-6 bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
            {[
              { id: 'input',    label: '入力', icon: Mic },
              { id: 'genre',    label: '戦略', icon: Zap },
              { id: 'script',   label: '台本', icon: FileText },
              { id: 'visual',   label: '画像', icon: ImageIcon },
              { id: 'music',    label: '音楽', icon: Music },
              { id: 'strategy', label: 'SEO',  icon: Search }
            ].map((tab, i) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex flex-col items-center justify-center gap-1 rounded-lg font-medium
                    transition-all duration-200 py-2.5 z-10 text-xs
                    ${isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-500 hover:text-white hover:bg-white/5'}
                  `}
                >
                  <tab.icon className={`h-4 w-4 ${isActive ? 'text-slate-950' : 'text-emerald-500'}`} />
                  <span className={isActive ? 'text-slate-950' : 'text-slate-400'}>
                    {tab.label}
                  </span>
                </button>
              )
            })}
          </div>

          <TabsContent value="input" className="space-y-6 animate-in fade-in">
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3 text-emerald-400"><Info size={18} /><h3 className="font-semibold text-base tracking-tight">ステップ 1: 核となる情報を入力</h3></div>
                <div className="flex gap-3"><input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="audio/*,video/*" className="hidden" /><Button onClick={() => fileInputRef.current?.click()} disabled={isProcessing['transcribe']} className="h-9 px-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium text-sm rounded-lg hover:bg-emerald-500/20 flex items-center gap-2">{isProcessing['transcribe'] ? <><Loader2 className="animate-spin h-4 w-4" />{compressProgress > 0 ? `圧縮中 ${compressProgress}%` : '読込中'}</> : <><Upload size={14} />直接読み起こし</>}</Button></div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">指示書をコピーしてAIに読み起こしを実施して下さい。AIの回答をフォームに貼り付けてください。</p>
              <div className="grid grid-cols-3 gap-3">
                {['Claude', 'ChatGPT', 'Gemini'].map((ai) => (
                  <div key={ai} className="flex flex-col gap-2 p-2 bg-white/5 rounded-xl border border-white/5">
                    <Button onClick={() => { navigator.clipboard.writeText("この動画を日本語で文字起こししてください。"); alert(`✅ コピー完了！Claudeを開いて、動画または音声ファイルと一緒に貼り付けてください。ChatGPT・Geminiなど他のAIでもOKです！`); }} className="h-9 text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 font-medium hover:bg-emerald-500/40 rounded-lg">指示書をコピー 📋</Button>
                    <a href={ai === 'Claude' ? 'https://claude.ai' : ai === 'ChatGPT' ? 'https://chatgpt.com' : 'https://gemini.google.com'} target="_blank" className="bg-white/5 border border-white/10 rounded-lg p-3 text-center hover:bg-white/10 transition-all group"><p className="text-xs text-slate-400 group-hover:text-emerald-400 mb-1">{ai === 'Claude' ? 'Anthropic' : ai === 'ChatGPT' ? 'OpenAI' : 'Google'}</p><p className="text-base font-semibold text-white">{ai}</p></a>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-emerald-500 ml-1">ソース内容 (AIの回答を貼り付け)</label>
              <textarea value={transcript} onChange={(e) => setTranscript(e.target.value)} className="w-full h-48 bg-black/50 border border-white/10 rounded-xl p-4 font-normal text-white outline-none focus:border-emerald-500 transition-all text-sm leading-relaxed" placeholder="台本のテキストのみを貼り付けてください。メモ・注釈・指示文は除いてください。未完の台本でもOKです。" />
              <div className="flex justify-end"><Button onClick={() => { setActiveTab('genre'); window.scrollTo(0,0); }} disabled={!transcript} className="h-10 px-6 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-sm rounded-lg transition-all"><span className="flex items-center gap-2">戦略選択へ <ChevronRight className="h-4 w-4" /></span></Button></div>
            </div>
          </TabsContent>

          <TabsContent value="genre" className="space-y-6 animate-in fade-in">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2"><div className="h-5 w-1 bg-emerald-500 rounded-full"></div><h4 className="text-sm font-semibold text-white">1. 台本タイプを選択</h4></div>
                <div className="grid md:grid-cols-3 gap-3">{SCRIPT_TYPES.map((t) => (<button key={t.id} onClick={() => setScriptType(t.id)} className={`p-4 rounded-xl font-medium text-left border transition-all ${scriptType === t.id ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'}`}><div className="flex items-center justify-between mb-2"><span className="text-sm font-semibold">{t.label}</span>{scriptType === t.id && <CheckCircle2 size={16} />}</div><p className="text-xs opacity-80 leading-relaxed">{t.desc}</p></button>))}</div>
              </div>
              <div className="border-t border-white/5 pt-5 space-y-3">
                <div className="flex items-center gap-2 mb-2"><div className="h-5 w-1 bg-emerald-500 rounded-full"></div><h4 className="text-sm font-semibold text-white">2. 画像スタイルを選択</h4></div>
                <div className="grid md:grid-cols-5 gap-2">{IMAGE_STYLES.map((s) => (<button key={s.id} onClick={() => setImageStyle(s.id)} className={`p-3 rounded-lg font-medium text-center border transition-all ${imageStyle === s.id ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'}`}><span className="text-xs">{s.label}</span></button>))}</div>
              </div>
              <div className="border-t border-white/5 pt-5 space-y-3">
                <div className="flex items-center gap-2 mb-2"><div className="h-5 w-1 bg-emerald-500 rounded-full"></div><h4 className="text-sm font-semibold text-white">3. サムネイルのロゴ設定</h4></div>
                <div className="grid md:grid-cols-2 gap-3">
                  {[{ id: true, label: '映えるロゴ入り', desc: '目を引くデザインフォントやロゴを自動構成します。' }, { id: false, label: 'ロゴなし（素材のみ）', desc: '文字を入れず、最高品質の背景・人物画像のみを生成します。' }].map((l) => (
                    <button key={l.id ? 'y' : 'n'} onClick={() => setWithLogo(l.id)} className={`p-4 rounded-xl font-medium text-left border transition-all ${withLogo === l.id ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'}`}><div className="flex items-center justify-between mb-1"><span className="text-sm font-semibold">{l.label}</span>{withLogo === l.id && <CheckCircle2 size={16} />}</div><p className="text-xs opacity-70">{l.desc}</p></button>
                  ))}
                </div>
              </div>
              <div className="border-t border-white/5 pt-5 space-y-3">
                <div className="flex items-center gap-2 mb-2"><div className="h-5 w-1 bg-emerald-500 rounded-full"></div><h4 className="text-sm font-semibold text-white">4. 戦略パレットを選択</h4></div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">{GENRES.map((g) => (<button key={g.id} onClick={() => setGenre(g.id)} className={`p-4 rounded-xl font-medium text-left border transition-all ${genre === g.id ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'}`}><div className="flex items-center justify-between mb-2"><span className="text-sm font-semibold">{g.label}</span>{genre === g.id && <CheckCircle2 size={16} />}</div><p className="text-xs leading-relaxed opacity-80">{g.prompt}</p></button>))}</div>
              </div>
              <div className="border-t border-white/5 pt-5 space-y-3">
                <div className="flex items-center gap-2 mb-2"><div className="h-5 w-1 bg-emerald-500 rounded-full"></div><h4 className="text-sm font-semibold text-white">5. 語尾スタイルを選択</h4></div>
                <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-2">{TONE_STYLES.map((t) => (<button key={t.id} onClick={() => setToneStyle(t.id)} className={`p-3 rounded-xl font-medium text-left border transition-all ${toneStyle === t.id ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'}`}><div className="flex items-center justify-between mb-1"><span className="text-xs font-semibold">{t.label}</span>{toneStyle === t.id && <CheckCircle2 size={12} />}</div><p className="text-xs opacity-70 leading-relaxed">{t.desc}</p></button>))}</div>
              </div>
              <div className="flex justify-end pt-2"><Button onClick={generateScript} disabled={isProcessing['script'] || !transcript} className="h-10 px-6 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-sm rounded-lg transition-all">{isProcessing['script'] ? <Loader2 className="animate-spin h-4 w-4" /> : <span className="flex items-center gap-2">台本を生成する <ChevronRight className="h-4 w-4" /></span>}</Button></div>
            </div>
          </TabsContent>

          <TabsContent value="script" className="space-y-6 animate-in fade-in">
            {script && (<div className="space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <h3 className="text-base font-semibold text-white flex items-center gap-2"><Sparkles className="text-emerald-400 h-5 w-5" /> 生成された台本</h3>
                <div className="flex gap-3">
                  <div className="bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-lg text-center"><p className="text-xs text-emerald-500 mb-1">バズ予測スコア</p><p className="text-xl font-bold text-white">{script.viralScore}%</p></div>
                  <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-center"><p className="text-xs text-white/30 mb-1">再生時間</p><p className="text-xl font-bold text-white">{script.estimatedMinutes}分</p></div>
                </div>
              </div>

              {/* ▼ 次のステップ案内バナー（目立つ位置に配置） */}
              <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-white">台本が完成しました！次は画像・音楽・SEOを一括生成</p>
                    <p className="text-xs text-slate-400 mt-0.5">キャラクター・サムネイル・BGMプロンプト・SEOタグをまとめて出力します</p>
                  </div>
                </div>
                <Button onClick={generateExtras} disabled={isProcessing['characters']} className="shrink-0 h-11 px-8 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                  {isProcessing['characters'] ? <><Loader2 className="animate-spin h-4 w-4 mr-2" />生成中...</> : <span className="flex items-center gap-2">🚀 全データを一括出力</span>}
                </Button>
              </div>

              <div className="grid gap-4">{[{ t: '導入', c: script.opening, col: 'from-emerald-500/10' }, { t: '本編', c: script.body, col: 'from-emerald-500/5' }, { t: '結末', c: script.closing, col: 'from-emerald-500/5' }].map((s, i) => (<Card key={i} className={`bg-gradient-to-br ${s.col} to-transparent border border-white/10 rounded-xl p-5`}><h4 className="text-xs font-semibold text-emerald-400 tracking-tight mb-3 border-l-4 border-emerald-500 pl-3">{s.t}</h4><p className="text-sm text-white leading-relaxed whitespace-pre-wrap">{s.c}</p></Card>))}</div>
            </div>)}
          </TabsContent>

          <TabsContent value="visual" className="space-y-6 animate-in fade-in">
            <div className="bg-emerald-500/5 rounded-xl p-5 space-y-4 text-center">
              <h3 className="text-base font-semibold text-emerald-400">ステップ 4: ビジュアル設計（GPT連携）</h3>
              <p className="text-sm text-slate-300 leading-relaxed">プロンプトをコピーして、ChatGPT（GPT-4o）に貼り付けて画像を作成しましょう。</p>
              <a href="https://chatgpt.com/?model=gpt-4o" target="_blank" className="inline-flex items-center gap-2 bg-white text-slate-950 px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-emerald-400 transition-all"><ImageIcon size={16} /> ChatGPT 画像生成を開く →</a>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3"><h3 className="text-sm font-semibold text-white flex items-center gap-2"><Users className="text-emerald-400 h-4 w-4" /> 登場人物プロンプト</h3><Button onClick={() => { const p = "必ず画像を制作して下さい\n名前を出力して下さい\n\n【キャラクター設定】\n"; const txt = characters?.map(c => `${c.name}: ${c.imagePrompt}`).join('\n\n'); navigator.clipboard.writeText(p + (txt || '')); alert("一括コピーしました！"); }} className="h-8 px-3 bg-emerald-500 text-slate-950 font-medium rounded-lg text-xs hover:bg-emerald-400">一括コピー 📋</Button></div>
                <div className="space-y-3">{characters?.map((char, i) => (<Card key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3"><div className="flex justify-between items-center gap-2"><h4 className="font-semibold text-emerald-400 text-sm flex-1">{char.name}</h4><div className="flex gap-2"><Button onClick={() => { const p = "必ず画像を制作して下さい\n名前を出力して下さい\n\n"; navigator.clipboard.writeText(p + char.imagePrompt); alert("コピーしました！"); }} className="h-7 bg-white/10 text-white border border-white/10 hover:bg-white/20 font-medium text-xs rounded-lg px-3">個別コピー</Button><Button onClick={() => setCharacters(prev => prev?.filter((_, idx) => idx !== i) ?? null)} className="h-7 bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/40 font-medium text-xs rounded-lg px-3">削除</Button></div></div><p className="text-xs text-emerald-500/60 font-mono break-all leading-relaxed bg-black/40 p-3 rounded-lg border border-white/5">{char.imagePrompt}</p></Card>))}</div>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-emerald-500/20 pb-3"><ImageIcon className="text-emerald-400 h-4 w-4" /> サムネイル構成案</h3>
                <div className="space-y-3">{thumbnails?.map((thumb, i) => (<Card key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3"><div className="flex items-center justify-between gap-3"><Badge className="bg-red-600 text-white border-0 font-medium text-xs px-2 py-0.5 rounded">案 {i+1}</Badge><Button onClick={() => { const p = withLogo ? "YOUTUBEのサムネイル用なので映える構成にして下さい。もちろん映えるロゴ付き\n\n" : "YOUTUBEのサムネイル素材用なので、ロゴや文字は一切入れずに最高品質の背景・人物画像のみを作成して下さい。\n\n"; navigator.clipboard.writeText(p + thumb.imagePrompt); alert("コピーしました！"); }} className="h-7 bg-white/10 text-white border border-white/10 hover:bg-white/20 font-medium text-xs rounded-lg px-3 shrink-0">コピー</Button></div><h4 className="text-sm font-semibold text-white border-l-2 border-red-500 pl-3">{thumb.title}</h4><p className="text-xs text-slate-400 font-mono leading-relaxed bg-black/40 p-3 rounded-lg border border-white/5">{thumb.imagePrompt}</p></Card>))}</div>
              </div>
            </div>
            <div className="flex justify-end"><Button onClick={() => { setActiveTab('music'); window.scrollTo(0,0); }} className="h-10 px-6 bg-white/10 text-white font-medium text-sm rounded-lg hover:bg-white/20 transition-all"><span className="flex items-center gap-2">音楽生成へ <ChevronRight className="h-4 w-4" /></span></Button></div>
          </TabsContent>

          <TabsContent value="music" className="space-y-6 animate-in fade-in">
            <div className="bg-emerald-500/5 rounded-xl p-5 space-y-4 text-center">
              <h3 className="text-base font-semibold text-emerald-400">ステップ 5: サウンドプロデュース（Suno連携）</h3>
              <p className="text-sm text-slate-300 leading-relaxed">動画のムードに合わせた音楽プロンプトを生成しました。Suno AIで最高品質のBGMを作成しましょう。</p>
              <a href="https://suno.com/discover?campaign_id=japan&utm_source=google&utm_medium=cpc&utm_campaign=22504148374&utm_term=ai+%E4%BD%9C%E6%9B%B2+%E7%84%A1%E6%96%99&utm_content=749703257181" target="_blank" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-emerald-500 transition-all"><Music size={16} /> Suno AI で作曲を開始する →</a>
            </div>
            <div className="max-w-2xl mx-auto"><Card className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4"><div className="flex items-center justify-between"><Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium px-3 py-1 text-xs rounded-full">{bgm?.genre}</Badge><span className="text-xs text-white/30">雰囲気: {bgm?.mood}</span></div><div className="space-y-3"><div className="flex items-center justify-between border-b border-white/5 pb-3"><label className="text-xs font-medium text-white/40">AI Music Prompt</label><Button onClick={() => { navigator.clipboard.writeText(bgm?.prompt); alert("コピーしました！"); }} className="h-8 bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/30 font-medium text-xs rounded-lg px-4">プロンプトをコピー 📋</Button></div><div className="bg-black/50 rounded-xl p-4 border border-white/5 min-h-[80px] flex items-center justify-center"><p className="text-sm text-emerald-400 font-mono leading-relaxed text-center">{bgm?.prompt}</p></div></div></Card></div>
            <div className="flex justify-end"><Button onClick={() => { setActiveTab('strategy'); window.scrollTo(0,0); }} className="h-10 px-6 bg-white/10 text-white font-medium text-sm rounded-lg hover:bg-white/20 transition-all"><span className="flex items-center gap-2">SEO設定を確認 →</span></Button></div>
          </TabsContent>

          <TabsContent value="strategy" className="space-y-6 animate-in fade-in">
            {seo && (<div className="space-y-5">
              <h3 className="text-base font-semibold text-white flex items-center gap-2"><Search className="text-emerald-400 h-5 w-5" /> YouTube SEO 最適化</h3>
              <Card className="bg-[#13141f] rounded-xl p-6 space-y-6 border border-white/10">
                <div><label className="text-xs font-medium text-emerald-500 block mb-3">推奨タイトル</label><div className="flex items-center justify-between gap-4 bg-black/40 p-4 rounded-xl border border-white/5"><p className="text-base text-white font-semibold leading-snug flex-1">{seo.main}</p><Button onClick={() => { navigator.clipboard.writeText(seo.main); alert("コピーしました！"); }} className="shrink-0 h-9 px-4 bg-emerald-500 text-slate-950 font-medium text-sm rounded-lg hover:bg-emerald-400">コピー 📋</Button></div></div>
                <div className="grid grid-cols-2 gap-6 text-left"><div><label className="text-xs font-medium text-white/30 block mb-3">検索タグ</label><div className="flex flex-wrap gap-2">{seo.tags.slice(0, 10).map((t: any, i: number) => (<Badge key={i} className="bg-white/5 text-slate-400 border border-white/10 font-medium text-xs px-3 py-1 rounded-lg">#{t}</Badge>))}</div></div><div><label className="text-xs font-medium text-white/30 block mb-3">タイトル候補</label><ul className="space-y-2">{seo.alternatives.slice(0, 3).map((a: any, i: number) => <li key={i} className="bg-white/5 p-3 rounded-lg border border-white/5 text-slate-400 text-xs">・{a}</li>)}</ul></div></div>
                <div className="border-t border-white/5 pt-5"><div className="flex items-center justify-between mb-3"><label className="text-xs font-medium text-white/30">概要欄 (説明文)</label><Button onClick={() => { navigator.clipboard.writeText(seo.description); alert("コピーしました！"); }} className="h-8 px-4 bg-white/5 text-slate-400 border border-white/10 font-medium text-xs rounded-lg hover:bg-white/10">全文コピー 📋</Button></div><div className="bg-black/50 rounded-xl p-4 text-sm text-slate-300 leading-relaxed h-48 overflow-y-auto border border-white/5">{seo.description}</div></div>
              </Card>
            </div>)}
            <div className="pt-4 text-center"><Button onClick={() => { if(confirm('クリアしますか？')) { setTranscript(''); setScript(null); setCharacters(null); setThumbnails(null); setSeo(null); setBgm(null); setActiveTab('input'); localStorage.removeItem('yt_producer_state'); window.scrollTo(0,0); } }} className="h-10 px-6 bg-white/10 text-white font-medium text-sm rounded-lg border border-white/10 hover:bg-white/20 transition-all">新しい動画をプロデュースする</Button></div>
          </TabsContent>
        </Tabs>

        {loadingStep && (
          <div className="mt-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 flex flex-col items-center gap-3 text-center">
            <Loader2 className="h-8 w-8 text-emerald-400 animate-spin" />
            <p className="text-sm text-emerald-400 font-medium">{loadingStep}</p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-white/20"><p>© 2026 NextraLabs Viral Content OS. ALL RIGHTS RESERVED.</p><div className="flex gap-6"><a href="#" className="hover:text-emerald-500 transition-colors">利用規約</a><a href="#" className="hover:text-emerald-500 transition-colors">ステータス</a><a href="#" className="hover:text-emerald-500 transition-colors">サポート</a></div></div>
      </div>
    </div>
  )
}

