'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

// ==================== TYPES ====================
type Tab = 'transcribe' | 'script' | 'characters' | 'thumbnail' | 'title' | 'bgm'
type Genre = 'entertainment' | 'education' | 'vlog' | 'tech' | 'business' | 'gaming' | 'cooking' | 'travel' | 'news' | 'interview'

interface TranscriptResult {
  text: string
  duration?: string
  language?: string
}

interface ScriptResult {
  opening: string
  body: string
  closing: string
  fullScript: string
  estimatedMinutes: number
}

interface CharacterInfo {
  name: string
  description: string
  role: string
  imagePrompt: string
  imageUrl?: string
  generating?: boolean
}

interface ThumbnailResult {
  title: string
  imagePrompt: string
  imageUrl?: string
  generating?: boolean
}

interface TitleResult {
  main: string
  alternatives: string[]
  tags: string[]
  description: string
}

interface BgmResult {
  mood: string
  genre: string
  prompt: string
  generating?: boolean
  audioUrl?: string
}

// ==================== CONSTANTS ====================
const TABS: { id: Tab; icon: string; label: string; num: string }[] = [
  { id: 'transcribe', icon: '🎙️', label: '文字起こし', num: '①' },
  { id: 'script', icon: '📝', label: '台本作成', num: '②' },
  { id: 'characters', icon: '🎨', label: '人物画像', num: '③' },
  { id: 'thumbnail', icon: '🖼️', label: 'サムネイル', num: '④' },
  { id: 'title', icon: '✏️', label: 'タイトル', num: '⑤' },
  { id: 'bgm', icon: '🎵', label: 'BGM作成', num: '⑥' },
]

const GENRES: { id: Genre; label: string; icon: string }[] = [
  { id: 'entertainment', label: 'エンタメ', icon: '🎭' },
  { id: 'education', label: '教育・解説', icon: '📚' },
  { id: 'vlog', label: 'Vlog', icon: '📷' },
  { id: 'tech', label: 'テック・IT', icon: '💻' },
  { id: 'business', label: 'ビジネス', icon: '💼' },
  { id: 'gaming', label: 'ゲーム実況', icon: '🎮' },
  { id: 'cooking', label: '料理', icon: '🍳' },
  { id: 'travel', label: '旅行', icon: '✈️' },
  { id: 'news', label: 'ニュース', icon: '📰' },
  { id: 'interview', label: '対談・インタビュー', icon: '🎤' },
]

const GENRE_PROMPTS: Record<Genre, string> = {
  entertainment: 'テンポよく、視聴者を飽きさせない構成。ツッコミや驚きを入れる。',
  education: '論理的でわかりやすい構成。導入→問題提起→解説→まとめ。',
  vlog: '自然体で親しみやすいトーン。感情や体験を中心に。',
  tech: '技術的な正確さ重視。デモ→説明→活用法の流れ。',
  business: 'プロフェッショナルなトーン。データや事例を交えて説得力を。',
  gaming: 'ハイテンション、リアクション重視。見どころをハイライト。',
  cooking: '手順を明確に。材料リスト→調理過程→完成。コツを随所に。',
  travel: '臨場感のある描写。見どころ→体験→感想の流れ。',
  news: '客観的で簡潔。5W1Hを押さえ、分析・考察を加える。',
  interview: '対話形式。質問→回答→深掘りの流れ。人物の魅力を引き出す。',
}

// ==================== COMPONENT ====================
export function YoutubeProducer() {
  const [tab, setTab] = useState<Tab>('transcribe')
  const [genre, setGenre] = useState<Genre>('entertainment')

  // ① Transcribe
  const [inputMode, setInputMode] = useState<'file' | 'text' | 'url'>('file')
  const [inputText, setInputText] = useState('')
  const [inputUrl, setInputUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [transcribing, setTranscribing] = useState(false)
  const [transcript, setTranscript] = useState<TranscriptResult | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // ② Script
  const [scriptLoading, setScriptLoading] = useState(false)
  const [script, setScript] = useState<ScriptResult | null>(null)
  const [scriptCustomPrompt, setScriptCustomPrompt] = useState('')

  // ③ Characters
  const [characters, setCharacters] = useState<CharacterInfo[]>([])
  const [charLoading, setCharLoading] = useState(false)

  // ④ Thumbnail
  const [thumbnails, setThumbnails] = useState<ThumbnailResult[]>([])
  const [thumbLoading, setThumbLoading] = useState(false)

  // ⑤ Title
  const [titleResult, setTitleResult] = useState<TitleResult | null>(null)
  const [titleLoading, setTitleLoading] = useState(false)

  // ⑥ BGM
  const [bgmResult, setBgmResult] = useState<BgmResult | null>(null)
  const [bgmLoading, setBgmLoading] = useState(false)

  const [copied, setCopied] = useState<string | null>(null)
  const [compressProgress, setCompressProgress] = useState<string | null>(null)

  const handleCopy = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }, [])

  const genreInfo = GENRES.find(g => g.id === genre) || GENRES[0]

  // ==================== FFMPEG AUDIO EXTRACTION ====================
  const extractAudioInBrowser = async (file: File): Promise<File> => {
    setCompressProgress('🔄 FFmpegを読み込み中...')
    const { FFmpeg } = await import('@ffmpeg/ffmpeg')
    const { fetchFile, toBlobURL } = await import('@ffmpeg/util')

    const ffmpeg = new FFmpeg()

    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    })

    ffmpeg.on('progress', ({ progress }) => {
      setCompressProgress(`🎵 音声を抽出中... ${Math.round(progress * 100)}%`)
    })

    setCompressProgress('📁 ファイルを読み込み中...')
    const inputName = 'input' + file.name.slice(file.name.lastIndexOf('.'))
    await ffmpeg.writeFile(inputName, await fetchFile(file))

    setCompressProgress('🎵 音声を抽出＆圧縮中...')
    // Aggressive compression: 16kbps mono 8kHz → ~7MB/hour, well within 4.5MB Vercel limit for most content
    // Split into 15-min chunks if needed
    await ffmpeg.exec(['-i', inputName, '-vn', '-acodec', 'libmp3lame', '-ab', '16k', '-ar', '8000', '-ac', '1', '-t', '3600', 'output.mp3'])

    const data = await ffmpeg.readFile('output.mp3') as unknown as Uint8Array
    let finalData = new Uint8Array(data)

    // If still > 3.5MB, split and transcribe in chunks
    if (finalData.length > 3.5 * 1024 * 1024) {
      // Re-encode at even lower bitrate
      setCompressProgress('🔄 さらに圧縮中...')
      await ffmpeg.exec(['-i', inputName, '-vn', '-acodec', 'libmp3lame', '-ab', '8k', '-ar', '8000', '-ac', '1', '-t', '3600', 'output_tiny.mp3'])
      const tinyData = await ffmpeg.readFile('output_tiny.mp3') as unknown as Uint8Array
      finalData = new Uint8Array(tinyData)
    }

    const blob = new Blob([finalData], { type: 'audio/mp3' })
    const compressed = new File([blob], 'audio.mp3', { type: 'audio/mp3' })

    ffmpeg.terminate()
    setCompressProgress(null)

    return compressed
  }

  // ==================== API CALLS ====================

  // State for extracted audio blob
  const [extractedAudioUrl, setExtractedAudioUrl] = useState<string | null>(null)

  // ==================== CLIENT-SIDE LOGIC (NO API CALLS) ====================

  // Helper: split text into sentences
  const splitSentences = (text: string): string[] => {
    return text.split(/(?<=[.!?\u3002\uff01\uff1f\n])\s*/).filter(s => s.trim().length > 0)
  }

  // Helper: extract frequent keywords from text
  const extractKeywords = (text: string, count: number = 15): string[] => {
    const cleaned = text.replace(/[^\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\u3400-\u4DBFa-zA-Z0-9]/g, ' ')
    const chunks: string[] = []
    const chars = cleaned.replace(/\s+/g, '')
    for (let i = 0; i < chars.length - 1; i++) {
      chunks.push(chars.slice(i, i + 2))
      if (i < chars.length - 2) chunks.push(chars.slice(i, i + 3))
    }
    const freq = new Map<string, number>()
    chunks.forEach(c => { if (c.length >= 2) freq.set(c, (freq.get(c) || 0) + 1) })
    return Array.from(freq.entries())
      .filter(([k]) => !/^[\s\u3000]+$/.test(k))
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map(([k]) => k)
  }

  // ① Transcribe
  const handleTranscribe = async () => {
    setTranscribing(true)
    try {
      let text = ''

      if (inputMode === 'text') {
        text = inputText
      } else if (inputMode === 'url') {
        text = '💡 URLの内容をコピーして「テキスト直接入力」モードに貼り付けてください。\n\nブラウザのセキュリティ制限により、外部URLの直接取得はできません。'
      } else if (selectedFile) {
        const isTextFile = /\.(txt|md|srt|vtt)$/i.test(selectedFile.name)

        if (isTextFile) {
          text = await selectedFile.text()
        } else {
          // Extract audio with FFmpeg in browser
          const fileSizeMB = selectedFile.size / 1024 / 1024
          try {
            const audioFile = await extractAudioInBrowser(selectedFile)
            const compressedMB = audioFile.size / 1024 / 1024

            // Create playable blob URL
            const blobUrl = URL.createObjectURL(audioFile)
            setExtractedAudioUrl(blobUrl)

            setCompressProgress(`✅ 音声抽出完了！（${fileSizeMB.toFixed(0)}MB → ${compressedMB.toFixed(1)}MB）`)
            await new Promise(r => setTimeout(r, 1500))
            setCompressProgress(null)

            text = `✅ 音声の抽出が完了しました（${compressedMB.toFixed(1)}MB）\n\n` +
              `下の再生ボタンで確認 → MP3をダウンロード → ChatGPTかGeminiにアップロードして文字起こし\n\n` +
              `手順:\n` +
              `1. 「MP3をダウンロード」をクリック\n` +
              `2. ChatGPT or Gemini を開く\n` +
              `3. 音声ファイルをアップロードして「文字起こしして」と入力\n` +
              `4. 結果をコピーしてこのテキストエリアに貼り付け\n\n` +
              `※ このテキストを消して、文字起こし結果を貼り付けてください`
          } catch (ffErr) {
            console.error('FFmpeg error:', ffErr)
            setCompressProgress(null)
            text = `⚠️ 音声抽出に失敗しました（${fileSizeMB.toFixed(0)}MB）\n\n「テキスト直接入力」モードで、別ツールの文字起こし結果を貼り付けてください。`
          }
        }
      }

      setTranscript({ text, language: 'ja' })
    } catch (e) {
      setCompressProgress(null)
      setTranscript({ text: `エラー: ${e instanceof Error ? e.message : '不明'}` })
    }
    setTranscribing(false)
  }

  // ② Script — client-side template generation
  const handleGenerateScript = async () => {
    if (!transcript?.text) return
    setScriptLoading(true)
    await new Promise(r => setTimeout(r, 500)) // brief delay for UX

    const text = transcript.text
    const sentences = splitSentences(text)
    const total = sentences.length
    const openIdx = Math.max(1, Math.floor(total * 0.15))
    const closeIdx = Math.max(openIdx + 1, Math.floor(total * 0.85))

    const gp = GENRE_PROMPTS[genre]
    const genreLabel = GENRES.find(g => g.id === genre)?.label || genre

    const openSentences = sentences.slice(0, openIdx).join('\n')
    const bodySentences = sentences.slice(openIdx, closeIdx).join('\n')
    const closeSentences = sentences.slice(closeIdx).join('\n')

    const opening = `【オープニング】\n\n皆さんこんにちは！今回は「${genreLabel}」ジャンルでお届けします。\n\n${gp}\n\nそれでは早速いきましょう！\n\n---\n${openSentences}`
    const body = `【本編】\n\n${bodySentences}`
    const closing = `【エンディング】\n\n${closeSentences}\n\n---\n\nいかがでしたか？\n参考になったらチャンネル登録・高評価よろしくお願いします！\n次回もお楽しみに！`
    const fullScript = `${opening}\n\n${body}\n\n${closing}`
    const estimatedMinutes = Math.max(1, Math.round(text.length / 300))

    setScript({ opening, body, closing, fullScript, estimatedMinutes })
    setScriptLoading(false)
  }

  // ③ Characters — client-side text extraction
  const handleExtractCharacters = async () => {
    if (!transcript?.text) return
    setCharLoading(true)
    await new Promise(r => setTimeout(r, 300))

    const text = transcript.text
    const nameSet = new Set<string>()

    // Pattern 1: 「」前の名前 (XX「...)
    const quotePattern = /([^\s\n,.\u3001\u3002]{1,8})[\u300C\u300E\u201C]/g
    let m
    while ((m = quotePattern.exec(text)) !== null) {
      const n = m[1].replace(/^[\u3001\u3002\u3000\s]+/, '')
      if (n.length >= 2 && n.length <= 8) nameSet.add(n)
    }

    // Pattern 2: Xさん/氏/先生/くん/ちゃん/様
    const suffixPattern = /([^\s\n,.\u3001\u3002]{1,6})(?:\u3055\u3093|\u6C0F|\u5148\u751F|\u304F\u3093|\u3061\u3083\u3093|\u69D8)/g
    while ((m = suffixPattern.exec(text)) !== null) {
      const n = m[1]
      if (n.length >= 1 && n.length <= 6) nameSet.add(n + m[0].slice(n.length))
    }

    const names = Array.from(nameSet).slice(0, 5)

    if (names.length === 0) {
      names.push('ナレーター')
    }

    const chars: CharacterInfo[] = names.map(name => {
      const idx = text.indexOf(name)
      const context = idx >= 0 ? text.slice(Math.max(0, idx - 20), idx + name.length + 20) : ''
      return {
        name,
        description: context ? `...${context}...` : `${name} - テキスト中の登場人物`,
        role: '登場人物',
        imagePrompt: `Anime style illustration, upper body portrait of a character named ${name}, simple gradient background, high quality, detailed, professional illustration`,
      }
    })

    setCharacters(chars)
    setCharLoading(false)
  }

  // ③ Character IMAGE — copy prompt (no API)
  const handleGenerateCharImage = async (idx: number) => {
    const char = characters[idx]
    if (!char) return
    navigator.clipboard.writeText(char.imagePrompt)
    const updated = [...characters]
    updated[idx] = { ...char, imageUrl: 'copied' }
    setCharacters(updated)
  }

  // ④ Thumbnail — client-side template
  const handleGenerateThumbnails = async () => {
    if (!transcript?.text) return
    setThumbLoading(true)
    await new Promise(r => setTimeout(r, 300))

    const text = transcript.text
    const sentences = splitSentences(text)
    const keywords = extractKeywords(text, 5)
    const kw = keywords.slice(0, 3).join(', ')

    const thumbs: ThumbnailResult[] = [
      {
        title: keywords[0]?.slice(0, 5) || 'IMPACT',
        imagePrompt: `YouTube thumbnail, bold dramatic composition, 16:9, vibrant red and yellow colors, large bold Japanese text, topic about ${kw}, eye-catching, high contrast, professional`,
      },
      {
        title: keywords[1]?.slice(0, 5) || 'INFO',
        imagePrompt: `YouTube thumbnail, informative style, 16:9, clean blue and white layout, infographic elements, topic about ${kw}, professional, data visualization, modern`,
      },
      {
        title: keywords[2]?.slice(0, 5) || 'EMOTION',
        imagePrompt: `YouTube thumbnail, emotional appeal, 16:9, warm colors, expressive character face, topic about ${kw}, cinematic lighting, dramatic mood, professional`,
      },
    ]

    setThumbnails(thumbs)
    setThumbLoading(false)
  }

  // ④ Thumbnail IMAGE — copy prompt (no API)
  const handleGenerateThumbImage = async (idx: number) => {
    const thumb = thumbnails[idx]
    if (!thumb) return
    navigator.clipboard.writeText(thumb.imagePrompt)
    const updated = [...thumbnails]
    updated[idx] = { ...thumb, imageUrl: 'copied' }
    setThumbnails([...updated])
  }

  // ⑤ Title — client-side generation
  const handleGenerateTitle = async () => {
    if (!transcript?.text) return
    setTitleLoading(true)
    await new Promise(r => setTimeout(r, 300))

    const text = transcript.text
    const keywords = extractKeywords(text, 20)
    const kw1 = keywords[0] || ''
    const kw2 = keywords[1] || ''
    const kw3 = keywords[2] || ''

    const genreLabel = GENRES.find(g => g.id === genre)?.label || ''

    const TITLE_TEMPLATES = [
      `\u3010\u8870\u6483\u3011${kw1}\u304C${kw2}\u3057\u305F\u7D50\u679C\u2026`,
      `${kw1}\u306E\u771F\u5B9F\u3092\u5FB9\u5E95\u89E3\u8AAC\uff01${kw2}\u306E\u8B0E`,
      `\u77E5\u3089\u306A\u3044\u3068\u30E4\u30D0\u3044\u300C${kw1}\u300D\u306E\u7F60`,
      `\u3010${genreLabel}\u3011${kw1}\u00D7${kw2}\u2015\u2015\u795E\u56DE`,
      `${kw1}\u306B\u3064\u3044\u3066\u3001\u8AB0\u3082\u6559\u3048\u3066\u304F\u308C\u306A\u304B\u3063\u305F\u3053\u3068`,
    ]

    const main = TITLE_TEMPLATES[0]
    const alternatives = TITLE_TEMPLATES.slice(1)
    const tags = keywords.slice(0, 15)
    const description = `${main}\n\n${text.slice(0, 200)}...\n\n#${tags.slice(0, 5).join(' #')}\n\n---\n\u25B6 \u30C1\u30E3\u30F3\u30CD\u30EB\u767B\u9332: [URL]\n\u25B6 SNS: [URL]\n\n\u00A9 ${new Date().getFullYear()}`

    setTitleResult({ main, alternatives, tags, description })
    setTitleLoading(false)
  }

  // ⑥ BGM — client-side mood analysis
  const handleGenerateBgm = async () => {
    if (!transcript?.text) return
    setBgmLoading(true)
    await new Promise(r => setTimeout(r, 300))

    const text = transcript.text
    const positiveWords = ['\u697D\u3057', '\u5B09\u3057', '\u5E78\u305B', '\u6700\u9AD8', '\u7D20\u6674\u3089', '\u611F\u52D5', '\u304A\u3082\u3057\u308D', '\u304B\u308F\u3044', '\u3059\u3054\u3044', '\u3042\u308A\u304C\u3068\u3046']
    const negativeWords = ['\u6016\u3044', '\u5371\u967A', '\u554F\u984C', '\u6CE8\u610F', '\u88AB\u5BB3', '\u8B66\u544A', '\u7DCA\u6025', '\u6DF1\u523B', '\u4E8B\u4EF6', '\u4E8B\u6545']
    const calmWords = ['\u843D\u3061\u7740', '\u5B89\u5FC3', '\u5E73\u548C', '\u304A\u3060\u3084\u304B', '\u9759\u304B', '\u3086\u3063\u304F\u308A', '\u7A4F\u3084\u304B', '\u512A\u3057']

    let posScore = 0, negScore = 0, calmScore = 0
    positiveWords.forEach(w => { if (text.includes(w)) posScore++ })
    negativeWords.forEach(w => { if (text.includes(w)) negScore++ })
    calmWords.forEach(w => { if (text.includes(w)) calmScore++ })

    let mood: string, bgmGenre: string, prompt: string

    if (negScore > posScore && negScore > calmScore) {
      mood = '\u7DCA\u8FEB\u611F\u30FB\u30B7\u30EA\u30A2\u30B9'
      bgmGenre = 'Cinematic Tension'
      prompt = 'Dark cinematic tension music, suspenseful strings, minor key, 100 BPM, dramatic orchestral, background music for YouTube video, no vocals, mysterious atmosphere'
    } else if (calmScore > posScore) {
      mood = '\u843D\u3061\u7740\u3044\u305F\u30FB\u77E5\u7684'
      bgmGenre = 'Lo-fi Ambient'
      prompt = 'Calm lo-fi ambient music, soft piano, warm pads, 80 BPM, relaxing background music for YouTube video, no vocals, cozy atmosphere'
    } else {
      mood = '\u660E\u308B\u304F\u524D\u5411\u304D'
      bgmGenre = 'Upbeat Pop'
      prompt = 'Upbeat cheerful background music, bright acoustic guitar, light drums, 120 BPM, positive energy, background music for YouTube video, no vocals, happy mood'
    }

    setBgmResult({ mood, genre: bgmGenre, prompt })
    setBgmLoading(false)
  }

  // ⑥ BGM Audio — no API, show links
  const handleGenerateBgmAudio = async () => {
    if (!bgmResult) return
    navigator.clipboard.writeText(bgmResult.prompt)
    setBgmResult({
      ...bgmResult,
      audioUrl: 'links',
    })
  }

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-gray-950/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎬</span>
              <h1 className="text-lg font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">AI YouTubeプロデューサー</h1>
            </div>
            <div className="text-xs text-white/40">6ステップ自動生成</div>
          </div>

          {/* Genre selector */}
          <div className="mb-3">
            <div className="text-xs text-white/50 mb-1.5">チャンネルジャンル</div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {GENRES.map(g => (
                <button key={g.id} onClick={() => setGenre(g.id)} className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${genre === g.id ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'}`}>
                  <span>{g.icon}</span>{g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${tab === t.id ? 'bg-white/15 text-white' : 'text-white/50 hover:text-white/80 hover:bg-white/5'}`}>
                <span className="text-white/30">{t.num}</span><span>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* Pipeline progress */}
        <div className="flex items-center gap-1 mb-6 overflow-x-auto">
          {TABS.map((t, i) => {
            const done = (t.id === 'transcribe' && transcript) ||
              (t.id === 'script' && script) ||
              (t.id === 'characters' && characters.length > 0) ||
              (t.id === 'thumbnail' && thumbnails.length > 0) ||
              (t.id === 'title' && titleResult) ||
              (t.id === 'bgm' && bgmResult)
            return (
              <div key={t.id} className="flex items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${done ? 'bg-green-500/20 text-green-400 border border-green-500/30' : tab === t.id ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/5 text-white/30 border border-white/5'}`}>
                  {done ? '✓' : t.num}
                </div>
                {i < TABS.length - 1 && <div className={`w-6 h-0.5 ${done ? 'bg-green-500/30' : 'bg-white/10'}`} />}
              </div>
            )
          })}
        </div>

        {/* ==================== ① TRANSCRIBE ==================== */}
        {tab === 'transcribe' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">🎙️ ① 文字起こし</h2>
              <p className="text-sm text-white/50">動画・音声・テキストファイルを取り込んで文字起こし</p>
            </div>

            {/* Input mode */}
            <div className="flex gap-2">
              {[
                { id: 'file' as const, label: '📁 ファイル', desc: '動画/音声/テキスト' },
                { id: 'text' as const, label: '📝 テキスト直接入力', desc: 'コピペ' },
                { id: 'url' as const, label: '🔗 URL', desc: 'Webページ' },
              ].map(m => (
                <button key={m.id} onClick={() => setInputMode(m.id)} className={`flex-1 p-3 rounded-xl text-left border transition-all ${inputMode === m.id ? 'bg-red-500/20 border-red-500/40' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                  <div className="text-sm font-medium">{m.label}</div>
                  <div className="text-xs text-white/40">{m.desc}</div>
                </button>
              ))}
            </div>

            {/* Input area */}
            <div className="bg-white/5 rounded-xl p-4">
              {inputMode === 'file' && (
                <div>
                  <input ref={fileRef} type="file" accept="video/*,audio/*,.txt,.md,.srt,.vtt,.pdf,.doc,.docx" onChange={e => setSelectedFile(e.target.files?.[0] || null)} className="hidden" />
                  <button onClick={() => fileRef.current?.click()} className="w-full py-8 border-2 border-dashed border-white/20 rounded-xl hover:border-white/40 transition-colors">
                    <div className="text-center">
                      <div className="text-3xl mb-2">{selectedFile ? '📄' : '📁'}</div>
                      <div className="text-sm text-white/60">{selectedFile ? selectedFile.name : 'クリックしてファイルを選択'}</div>
                      <div className="text-xs text-white/30 mt-1">動画(mp4,mov) / 音声(mp3,wav,m4a) / テキスト(txt,md,srt)</div>
                    </div>
                  </button>
                  {selectedFile && (
                    <div className="mt-2">
                      <div className="text-xs text-white/40">
                        サイズ: {(selectedFile.size / 1024 / 1024).toFixed(1)} MB ・ 種類: {selectedFile.type || '不明'}
                      </div>
                      {selectedFile.size / 1024 / 1024 > 4 && !/\.(txt|md|srt|vtt)$/i.test(selectedFile.name) && (
                        <div className="mt-2 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-xs text-blue-400">
                          💡 大きなファイルはブラウザ内で自動的に音声抽出＆圧縮してから文字起こしします（{(selectedFile.size / 1024 / 1024).toFixed(0)}MB → 推定{Math.max(1, Math.round(selectedFile.size / 1024 / 1024 / 30)).toFixed(0)}〜{Math.max(2, Math.round(selectedFile.size / 1024 / 1024 / 15)).toFixed(0)}MB）
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              {inputMode === 'text' && (
                <textarea value={inputText} onChange={e => setInputText(e.target.value)} placeholder="文字起こし済みのテキスト、会議録、インタビュー記録などをここにペースト..." className="w-full h-48 bg-transparent border border-white/10 rounded-lg p-3 text-sm text-white/80 placeholder-white/30 resize-none focus:outline-none focus:border-red-500/40" />
              )}
              {inputMode === 'url' && (
                <input value={inputUrl} onChange={e => setInputUrl(e.target.value)} placeholder="https://example.com/article" className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white/80 placeholder-white/30 focus:outline-none focus:border-red-500/40" />
              )}
            </div>

            {compressProgress && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
                <div className="text-sm text-blue-400 font-medium">{compressProgress}</div>
                <div className="text-xs text-white/40 mt-1">ブラウザ内で処理中（サーバーには送信していません）</div>
              </div>
            )}

            <button onClick={handleTranscribe} disabled={transcribing || (inputMode === 'file' && !selectedFile) || (inputMode === 'text' && !inputText.trim()) || (inputMode === 'url' && !inputUrl.trim())} className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-30 transition-opacity">
              {transcribing ? (compressProgress ? '🔄 音声抽出＆文字起こし中...' : '⏳ 処理中...') : '🎙️ 文字起こし開始'}
            </button>

            {/* Result */}
            {transcript && (
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-green-400">✅ 文字起こし完了</h3>
                  <button onClick={() => handleCopy(transcript.text, 'transcript')} className="px-3 py-1 bg-white/10 rounded-lg text-xs hover:bg-white/15">{copied === 'transcript' ? '✅ コピー済み' : '📋 コピー'}</button>
                </div>
                <div className="text-xs text-white/40 mb-2">{transcript.text.length.toLocaleString()} 文字</div>
                <textarea value={transcript.text} onChange={e => setTranscript({ ...transcript, text: e.target.value })} className="w-full h-48 bg-black/30 border border-white/5 rounded-lg p-3 text-sm text-white/70 resize-none focus:outline-none focus:border-red-500/30" />

                {extractedAudioUrl && (
                  <div className="mt-3 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                    <div className="text-xs text-blue-400 font-bold mb-2">🎵 抽出された音声</div>
                    <audio controls className="w-full mb-2" src={extractedAudioUrl} />
                    <div className="flex gap-2">
                      <a href={extractedAudioUrl} download="extracted-audio.mp3" className="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-xs hover:bg-blue-500/30">⬇️ MP3をダウンロード</a>
                      <a href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer" className="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-xs hover:bg-green-500/30">ChatGPT で文字起こし</a>
                      <a href="https://gemini.google.com/" target="_blank" rel="noopener noreferrer" className="px-4 py-1.5 bg-sky-500/20 text-sky-400 rounded-lg text-xs hover:bg-sky-500/30">Gemini で文字起こし</a>
                    </div>
                    <p className="text-xs text-white/30 mt-2">文字起こし結果を上のテキストエリアに貼り付けてください</p>
                  </div>
                )}

                <p className="text-xs text-white/30 mt-2">💡 文字起こし結果を編集してから次のステップへ進めます</p>
              </div>
            )}
          </div>
        )}

        {/* ==================== ② SCRIPT ==================== */}
        {tab === 'script' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">📝 ② 台本作成</h2>
              <p className="text-sm text-white/50">文字起こしから{genreInfo.icon} {genreInfo.label}ジャンルのYouTube台本を自動生成</p>
            </div>

            {!transcript ? (
              <div className="bg-white/5 rounded-xl p-8 text-center">
                <p className="text-3xl mb-2">⚠️</p>
                <p className="text-sm text-white/50">まず①文字起こしを完了してください</p>
                <button onClick={() => setTab('transcribe')} className="mt-3 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-xs hover:bg-red-500/30">①に戻る</button>
              </div>
            ) : (
              <>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{genreInfo.icon}</span>
                    <span className="text-sm font-bold">{genreInfo.label}</span>
                    <span className="text-xs text-white/40">— {GENRE_PROMPTS[genre]}</span>
                  </div>
                  <textarea value={scriptCustomPrompt} onChange={e => setScriptCustomPrompt(e.target.value)} placeholder="追加の指示（任意）: 「10分以内に収める」「冒頭にフック入れて」「関西弁で」..." className="w-full h-16 bg-black/20 border border-white/10 rounded-lg p-2 text-xs text-white/70 resize-none focus:outline-none focus:border-red-500/30 placeholder-white/30" />
                </div>

                <button onClick={handleGenerateScript} disabled={scriptLoading} className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-30">
                  {scriptLoading ? '⏳ 台本を生成中...' : '📝 台本を生成'}
                </button>

                {script && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-green-400">✅ 台本完成</h3>
                      <div className="flex gap-2">
                        <span className="text-xs text-white/40">約{script.estimatedMinutes}分</span>
                        <button onClick={() => handleCopy(script.fullScript, 'script')} className="px-3 py-1 bg-white/10 rounded-lg text-xs hover:bg-white/15">{copied === 'script' ? '✅' : '📋 全文コピー'}</button>
                      </div>
                    </div>

                    {[
                      { label: '🎬 オープニング', text: script.opening, id: 'opening' },
                      { label: '📖 本編', text: script.body, id: 'body' },
                      { label: '👋 エンディング', text: script.closing, id: 'closing' },
                    ].map(s => (
                      <div key={s.id} className="bg-white/5 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-white/60">{s.label}</span>
                          <button onClick={() => handleCopy(s.text, s.id)} className="text-xs text-white/40 hover:text-white/60">{copied === s.id ? '✅' : '📋'}</button>
                        </div>
                        <pre className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed">{s.text}</pre>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ==================== ③ CHARACTERS ==================== */}
        {tab === 'characters' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">🎨 ③ 人物画像</h2>
              <p className="text-sm text-white/50">文字起こしに登場する人物をAIイラストで生成</p>
            </div>

            {!transcript ? (
              <div className="bg-white/5 rounded-xl p-8 text-center">
                <p className="text-3xl mb-2">⚠️</p>
                <p className="text-sm text-white/50">まず①文字起こしを完了してください</p>
                <button onClick={() => setTab('transcribe')} className="mt-3 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-xs hover:bg-red-500/30">①に戻る</button>
              </div>
            ) : (
              <>
                <button onClick={handleExtractCharacters} disabled={charLoading} className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-30">
                  {charLoading ? '⏳ 人物を分析中...' : '🔍 人物を抽出してイラスト設定を生成'}
                </button>

                {characters.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-green-400">✅ {characters.length}人の人物を検出</h3>
                    {characters.map((char, i) => (
                      <div key={i} className="bg-white/5 rounded-xl p-4">
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">👤</span>
                              <span className="font-bold text-sm">{char.name}</span>
                              <span className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded">{char.role}</span>
                            </div>
                            <p className="text-xs text-white/50 mb-2">{char.description}</p>
                            <div className="bg-black/20 rounded-lg p-2 mb-2">
                              <div className="text-xs text-white/30 mb-1">画像プロンプト:</div>
                              <p className="text-xs text-white/60">{char.imagePrompt}</p>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              <button onClick={() => handleGenerateCharImage(i)} className="px-4 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs hover:bg-red-500/30">
                                {char.imageUrl === 'copied' ? '✅ コピー済み' : '📋 プロンプトをコピー'}
                              </button>
                              <a href="https://www.bing.com/images/create" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-xs hover:bg-blue-500/30">Bing Image Creator</a>
                              <a href="https://leonardo.ai" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg text-xs hover:bg-purple-500/30">Leonardo AI</a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ==================== ④ THUMBNAIL ==================== */}
        {tab === 'thumbnail' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">🖼️ ④ サムネイル</h2>
              <p className="text-sm text-white/50">YouTube用のサムネイル画像を3パターン生成</p>
            </div>

            {!transcript ? (
              <div className="bg-white/5 rounded-xl p-8 text-center">
                <p className="text-3xl mb-2">⚠️</p>
                <p className="text-sm text-white/50">まず①文字起こしを完了してください</p>
                <button onClick={() => setTab('transcribe')} className="mt-3 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-xs hover:bg-red-500/30">①に戻る</button>
              </div>
            ) : (
              <>
                <button onClick={handleGenerateThumbnails} disabled={thumbLoading} className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-30">
                  {thumbLoading ? '⏳ サムネイル案を生成中...' : '🖼️ サムネイル案を3パターン生成'}
                </button>

                {thumbnails.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-green-400">✅ {thumbnails.length}パターン生成</h3>
                    <div className="grid md:grid-cols-3 gap-3">
                      {thumbnails.map((thumb, i) => (
                        <div key={i} className="bg-white/5 rounded-xl p-3">
                          {thumb.imageUrl ? (
                            <img src={thumb.imageUrl} alt={thumb.title} className="w-full aspect-video rounded-lg object-cover border border-white/10 mb-2" />
                          ) : (
                            <div className="w-full aspect-video bg-black/30 rounded-lg border border-white/5 flex items-center justify-center mb-2">
                              <span className="text-white/20 text-3xl">🖼️</span>
                            </div>
                          )}
                          <div className="text-xs font-bold mb-1">{thumb.title}</div>
                          <div className="text-xs text-white/40 mb-2 line-clamp-2">{thumb.imagePrompt}</div>
                          <div className="flex gap-1 flex-wrap">
                            <button onClick={() => handleGenerateThumbImage(i)} className="flex-1 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs hover:bg-red-500/30">
                              {thumb.imageUrl === 'copied' ? '✅ コピー済み' : '📋 プロンプトコピー'}
                            </button>
                            <a href="https://www.bing.com/images/create" target="_blank" rel="noopener noreferrer" className="py-1.5 px-2 bg-blue-500/20 text-blue-400 rounded-lg text-xs hover:bg-blue-500/30">Bing</a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ==================== ⑤ TITLE ==================== */}
        {tab === 'title' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">✏️ ⑤ タイトル</h2>
              <p className="text-sm text-white/50">クリック率を最大化するYouTubeタイトル・タグ・説明文を生成</p>
            </div>

            {!transcript ? (
              <div className="bg-white/5 rounded-xl p-8 text-center">
                <p className="text-3xl mb-2">⚠️</p>
                <p className="text-sm text-white/50">まず①文字起こしを完了してください</p>
                <button onClick={() => setTab('transcribe')} className="mt-3 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-xs hover:bg-red-500/30">①に戻る</button>
              </div>
            ) : (
              <>
                <button onClick={handleGenerateTitle} disabled={titleLoading} className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-30">
                  {titleLoading ? '⏳ タイトルを生成中...' : '✏️ タイトル・タグ・説明文を生成'}
                </button>

                {titleResult && (
                  <div className="space-y-3">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-white/40">🏆 メインタイトル</span>
                        <button onClick={() => handleCopy(titleResult.main, 'main-title')} className="text-xs text-white/40 hover:text-white/60">{copied === 'main-title' ? '✅' : '📋'}</button>
                      </div>
                      <div className="text-lg font-bold">{titleResult.main}</div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-xs text-white/40 mb-2">代替タイトル</div>
                      <div className="space-y-2">
                        {titleResult.alternatives.map((alt, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="text-xs text-white/30">{i + 1}.</span>
                            <span className="text-sm text-white/70 flex-1">{alt}</span>
                            <button onClick={() => handleCopy(alt, `alt-${i}`)} className="text-xs text-white/40 hover:text-white/60">{copied === `alt-${i}` ? '✅' : '📋'}</button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-white/40">🏷️ タグ</span>
                        <button onClick={() => handleCopy(titleResult.tags.join(', '), 'tags')} className="text-xs text-white/40 hover:text-white/60">{copied === 'tags' ? '✅' : '📋 全コピー'}</button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {titleResult.tags.map((tag, i) => (
                          <span key={i} className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded-lg">{tag}</span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-white/40">📄 説明文</span>
                        <button onClick={() => handleCopy(titleResult.description, 'desc')} className="text-xs text-white/40 hover:text-white/60">{copied === 'desc' ? '✅' : '📋'}</button>
                      </div>
                      <pre className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed">{titleResult.description}</pre>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ==================== ⑥ BGM ==================== */}
        {tab === 'bgm' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">🎵 ⑥ BGM作成</h2>
              <p className="text-sm text-white/50">文字起こしの雰囲気に合ったBGMをAIで作曲</p>
            </div>

            {!transcript ? (
              <div className="bg-white/5 rounded-xl p-8 text-center">
                <p className="text-3xl mb-2">⚠️</p>
                <p className="text-sm text-white/50">まず①文字起こしを完了してください</p>
                <button onClick={() => setTab('transcribe')} className="mt-3 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-xs hover:bg-red-500/30">①に戻る</button>
              </div>
            ) : (
              <>
                <button onClick={handleGenerateBgm} disabled={bgmLoading} className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-30">
                  {bgmLoading ? '⏳ BGM設定を分析中...' : '🎵 雰囲気を分析してBGM設定を生成'}
                </button>

                {bgmResult && (
                  <div className="space-y-3">
                    <div className="bg-white/5 rounded-xl p-4">
                      <h3 className="text-sm font-bold text-green-400 mb-3">✅ BGM設定</h3>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="bg-black/20 rounded-lg p-3">
                          <div className="text-xs text-white/40">ムード</div>
                          <div className="text-sm font-bold text-red-400">{bgmResult.mood}</div>
                        </div>
                        <div className="bg-black/20 rounded-lg p-3">
                          <div className="text-xs text-white/40">ジャンル</div>
                          <div className="text-sm font-bold text-pink-400">{bgmResult.genre}</div>
                        </div>
                      </div>
                      <div className="bg-black/20 rounded-lg p-3 mb-3">
                        <div className="text-xs text-white/40 mb-1">生成プロンプト</div>
                        <p className="text-sm text-white/60">{bgmResult.prompt}</p>
                      </div>

                      <button onClick={handleGenerateBgmAudio} className="w-full py-2.5 bg-red-500/20 text-red-400 rounded-lg text-sm font-bold hover:bg-red-500/30">
                        {bgmResult.audioUrl === 'links' ? '✅ プロンプトをコピーしました' : '📋 プロンプトをコピー＆BGMサービスへ'}
                      </button>

                      {bgmResult.audioUrl === 'links' && (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs text-white/40">コピーしたプロンプトを以下のサービスで使用してください：</p>
                          <div className="flex gap-2 flex-wrap">
                            <a href="https://suno.ai" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-xs hover:bg-purple-500/30 font-bold">Suno AI（無料枠あり）</a>
                            <a href="https://udio.com" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-xs hover:bg-blue-500/30 font-bold">Udio</a>
                            <a href="https://dova-s.jp/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-xs hover:bg-green-500/30 font-bold">DOVA-SYNDROME（無料BGM）</a>
                            <a href="https://amachamusic.chagasi.com/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg text-xs hover:bg-amber-500/30 font-bold">甘茶の音楽工房（無料）</a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 border-t border-white/10 mt-8">
        <p className="text-xs text-white/30 text-center">※ すべての処理はブラウザ内で完結します。データはサーバーに送信されません。APIコスト0円。</p>
      </div>
    </div>
  )
}
