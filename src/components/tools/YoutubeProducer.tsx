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
    await ffmpeg.exec(['-i', inputName, '-vn', '-acodec', 'libmp3lame', '-ab', '64k', '-ar', '16000', '-ac', '1', 'output.mp3'])

    const data = await ffmpeg.readFile('output.mp3')
    const blob = new Blob([(data as Uint8Array).buffer], { type: 'audio/mp3' })
    const compressed = new File([blob], 'audio.mp3', { type: 'audio/mp3' })

    ffmpeg.terminate()
    setCompressProgress(null)

    return compressed
  }

  // ==================== API CALLS ====================

  // ① Transcribe
  const handleTranscribe = async () => {
    setTranscribing(true)
    try {
      let text = ''

      if (inputMode === 'text') {
        text = inputText
      } else if (inputMode === 'url') {
        const res = await fetch('/api/youtube-producer/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: inputUrl }),
        })
        const data = await res.json()
        text = data.text || data.error || 'URLからの取得に失敗しました'
      } else if (selectedFile) {
        const isTextFile = /\.(txt|md|srt|vtt)$/i.test(selectedFile.name)

        if (isTextFile) {
          text = await selectedFile.text()
        } else {
          // Auto-compress: extract audio in browser if file > 4MB
          let fileToUpload = selectedFile
          const fileSizeMB = selectedFile.size / 1024 / 1024

          if (fileSizeMB > 4) {
            try {
              fileToUpload = await extractAudioInBrowser(selectedFile)
              const compressedMB = fileToUpload.size / 1024 / 1024
              setCompressProgress(`✅ ${fileSizeMB.toFixed(0)}MB → ${compressedMB.toFixed(1)}MB に圧縮完了！`)
              await new Promise(r => setTimeout(r, 1500))
              setCompressProgress(null)
            } catch (ffErr) {
              console.error('FFmpeg error:', ffErr)
              setCompressProgress(null)
              // Fallback: if ffmpeg fails and file is too large, show error
              if (fileSizeMB > 24) {
                text = `⚠️ ブラウザ内圧縮に失敗しました（${fileSizeMB.toFixed(0)}MB）\n\n「テキスト直接入力」モードで、別ツールの文字起こし結果を貼り付けてください。\n\n対応ツール: CLOVA Note / Google音声認識 / Whisper Desktop`
                setTranscript({ text, language: 'ja' })
                setTranscribing(false)
                return
              }
              // If small enough, try uploading as-is
            }
          }

          // Upload (possibly compressed) file
          const formData = new FormData()
          formData.append('file', fileToUpload)
          setCompressProgress('📤 サーバーに送信中...')
          const res = await fetch('/api/youtube-producer/transcribe', {
            method: 'POST',
            body: formData,
          })
          setCompressProgress(null)

          if (!res.ok) {
            text = `文字起こしエラー（${res.status}）: サーバーの処理に失敗しました。\n\n「テキスト直接入力」モードで、別ツールの文字起こし結果を貼り付けてください。`
          } else {
            const data = await res.json()
            text = data.text || data.error || 'ファイルの処理に失敗しました'
          }
        }
      }

      setTranscript({ text, language: 'ja' })
    } catch (e) {
      setCompressProgress(null)
      setTranscript({ text: `エラー: ${e instanceof Error ? e.message : '不明なエラー'}` })
    }
    setTranscribing(false)
  }

  // ② Script
  const handleGenerateScript = async () => {
    if (!transcript?.text) return
    setScriptLoading(true)
    try {
      const res = await fetch('/api/youtube-producer/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'script',
          transcript: transcript.text,
          genre,
          genrePrompt: GENRE_PROMPTS[genre],
          customPrompt: scriptCustomPrompt,
        }),
      })
      const data = await res.json()
      setScript(data)
    } catch (e) {
      console.error(e)
    }
    setScriptLoading(false)
  }

  // ③ Characters
  const handleExtractCharacters = async () => {
    if (!transcript?.text) return
    setCharLoading(true)
    try {
      const res = await fetch('/api/youtube-producer/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'characters',
          transcript: transcript.text,
          genre,
        }),
      })
      const data = await res.json()
      setCharacters(data.characters || [])
    } catch (e) {
      console.error(e)
    }
    setCharLoading(false)
  }

  const handleGenerateCharImage = async (idx: number) => {
    const char = characters[idx]
    if (!char) return
    const updated = [...characters]
    updated[idx] = { ...char, generating: true }
    setCharacters(updated)

    try {
      const res = await fetch('/api/youtube-producer/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: char.imagePrompt,
          type: 'character',
        }),
      })
      const data = await res.json()
      updated[idx] = { ...char, generating: false, imageUrl: data.imageUrl }
      setCharacters([...updated])
    } catch {
      updated[idx] = { ...char, generating: false }
      setCharacters([...updated])
    }
  }

  // ④ Thumbnail
  const handleGenerateThumbnails = async () => {
    if (!transcript?.text) return
    setThumbLoading(true)
    try {
      const res = await fetch('/api/youtube-producer/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'thumbnail',
          transcript: transcript.text,
          genre,
          scriptTitle: script?.opening?.slice(0, 100) || '',
        }),
      })
      const data = await res.json()
      setThumbnails(data.thumbnails || [])
    } catch (e) {
      console.error(e)
    }
    setThumbLoading(false)
  }

  const handleGenerateThumbImage = async (idx: number) => {
    const thumb = thumbnails[idx]
    if (!thumb) return
    const updated = [...thumbnails]
    updated[idx] = { ...thumb, generating: true }
    setThumbnails(updated)

    try {
      const res = await fetch('/api/youtube-producer/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: thumb.imagePrompt,
          type: 'thumbnail',
        }),
      })
      const data = await res.json()
      updated[idx] = { ...thumb, generating: false, imageUrl: data.imageUrl }
      setThumbnails([...updated])
    } catch {
      updated[idx] = { ...thumb, generating: false }
      setThumbnails([...updated])
    }
  }

  // ⑤ Title
  const handleGenerateTitle = async () => {
    if (!transcript?.text) return
    setTitleLoading(true)
    try {
      const res = await fetch('/api/youtube-producer/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'title',
          transcript: transcript.text,
          genre,
          script: script?.fullScript?.slice(0, 500) || '',
        }),
      })
      const data = await res.json()
      setTitleResult(data)
    } catch (e) {
      console.error(e)
    }
    setTitleLoading(false)
  }

  // ⑥ BGM
  const handleGenerateBgm = async () => {
    if (!transcript?.text) return
    setBgmLoading(true)
    try {
      const res = await fetch('/api/youtube-producer/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'bgm',
          transcript: transcript.text,
          genre,
        }),
      })
      const data = await res.json()
      setBgmResult(data)
    } catch (e) {
      console.error(e)
    }
    setBgmLoading(false)
  }

  const handleGenerateBgmAudio = async () => {
    if (!bgmResult) return
    const updated = { ...bgmResult, generating: true }
    setBgmResult(updated)

    try {
      const res = await fetch('/api/youtube-producer/audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: bgmResult.prompt,
          mood: bgmResult.mood,
          genre: bgmResult.genre,
        }),
      })
      const data = await res.json()
      setBgmResult({ ...bgmResult, generating: false, audioUrl: data.audioUrl })
    } catch {
      setBgmResult({ ...bgmResult, generating: false })
    }
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
                            <button onClick={() => handleGenerateCharImage(i)} disabled={char.generating} className="px-4 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs hover:bg-red-500/30 disabled:opacity-30">
                              {char.generating ? '⏳ 生成中...' : '🎨 イラスト生成'}
                            </button>
                          </div>
                          {char.imageUrl && (
                            <div className="shrink-0">
                              <img src={char.imageUrl} alt={char.name} className="w-32 h-32 rounded-xl object-cover border border-white/10" />
                            </div>
                          )}
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
                          <button onClick={() => handleGenerateThumbImage(i)} disabled={thumb.generating} className="w-full py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs hover:bg-red-500/30 disabled:opacity-30">
                            {thumb.generating ? '⏳ 生成中...' : thumb.imageUrl ? '🔄 再生成' : '🎨 画像生成'}
                          </button>
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

                      <button onClick={handleGenerateBgmAudio} disabled={bgmResult.generating} className="w-full py-2.5 bg-red-500/20 text-red-400 rounded-lg text-sm font-bold hover:bg-red-500/30 disabled:opacity-30">
                        {bgmResult.generating ? '⏳ BGMを生成中（30〜60秒）...' : bgmResult.audioUrl ? '🔄 再生成' : '🎵 BGM音源を生成'}
                      </button>

                      {bgmResult.audioUrl && (
                        <div className="mt-3">
                          <audio controls className="w-full" src={bgmResult.audioUrl} />
                          <a href={bgmResult.audioUrl} download className="block text-center mt-2 text-xs text-red-400 hover:text-red-300">⬇️ ダウンロード</a>
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
        <p className="text-xs text-white/30 text-center">※ ファイルはブラウザ内で処理されます。アップロードされたデータはAPI処理後に破棄されます。</p>
      </div>
    </div>
  )
}
