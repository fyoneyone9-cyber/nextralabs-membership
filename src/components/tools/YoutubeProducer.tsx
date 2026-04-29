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

  // ② Script — guide mode
  const handleGenerateScript = async () => {
    setScriptLoading(false)
    setScript(null)
  }

  // ③ Characters — guide user to use ChatGPT/Gemini
  const handleExtractCharacters = async () => {
    // No longer doing regex extraction — just set a guide message
    setCharLoading(true)
    await new Promise(r => setTimeout(r, 200))
    setCharacters([]) // clear any old results
    setCharLoading(false)
  }

  // ③ Character IMAGE — not used (no API)
  const handleGenerateCharImage = async (_idx: number) => {
    // no-op
  }

  // ④ Thumbnail — guide mode (no client-side generation)
  const handleGenerateThumbnails = async () => {
    setThumbLoading(false)
    setThumbnails([])
  }

  // ④ Thumbnail IMAGE — no-op
  const handleGenerateThumbImage = async (_idx: number) => { /* no-op */ }

  // ⑤ Title — guide mode
  const handleGenerateTitle = async () => {
    setTitleLoading(false)
    setTitleResult(null)
  }

  // ⑥ BGM — guide mode
  const handleGenerateBgm = async () => {
    setBgmLoading(false)
    setBgmResult(null)
  }

  // ⑥ BGM Audio — no-op
  const handleGenerateBgmAudio = async () => { /* no-op */ }

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

        {/* ==================== ②〜⑥ SHARED GUIDE TABS ==================== */}
        {tab !== 'transcribe' && (
          <div className="space-y-4">
            {!transcript ? (
              <div className="bg-white/5 rounded-xl p-8 text-center">
                <p className="text-3xl mb-2">⚠️</p>
                <p className="text-sm text-white/50">まず①文字起こしを完了してください</p>
                <button onClick={() => setTab('transcribe')} className="mt-3 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-xs hover:bg-red-500/30">①に戻る</button>
              </div>
            ) : (
              <>
                {/* Tab-specific options */}
                {tab === 'script' && (
                  <textarea value={scriptCustomPrompt} onChange={e => setScriptCustomPrompt(e.target.value)} placeholder="追加の指示（任意）: 「10分以内に収める」「関西弁で」..." className="w-full h-14 bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white/70 resize-none focus:outline-none focus:border-red-500/30 placeholder-white/30" />
                )}

                {/* Copy prompt button */}
                <button onClick={() => {
                  const genreLabel = GENRES.find(g => g.id === genre)?.label || genre
                  const prompts: Record<string, string> = {
                    script: `以下の文字起こしをもとにYouTube台本を作成してください。\n\n条件：\n・ジャンル: ${genreLabel}\n・構成: オープニング→本編→エンディング\n・冒頭にフック\n・読み上げ時間の目安を記載\n${scriptCustomPrompt ? `・${scriptCustomPrompt}\n` : ''}\n文字起こし:\n${transcript.text}`,
                    characters: `以下の文章の登場人物をリストアップし、それぞれアニメ風イラスト（上半身）を生成してください。\n\n${transcript.text}`,
                    thumbnail: `以下のYouTube動画のサムネイル画像を3パターン作ってください。\n条件：1280x720、大きな日本語テキスト入り、目を引くデザイン\n\n${transcript.text}`,
                    title: `以下のYouTube動画について作成してください：\n1. タイトル（30文字以内）\n2. 代替タイトル4つ\n3. ハッシュタグ15個\n4. 説明文（200文字）\n\nジャンル: ${genreLabel}\n\n${transcript.text}`,
                    bgm: `以下のYouTube動画のBGMを作りたい。雰囲気に合った音楽の英語プロンプトを作成してください。\n条件：ボーカルなし、Suno AI形式、BPM・楽器・ジャンル明記\n\nジャンル: ${genreLabel}\n\n${transcript.text}`,
                  }
                  navigator.clipboard.writeText(prompts[tab] || '')
                  setCopied(tab)
                }} className="w-full py-3.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl font-bold hover:opacity-90 transition-opacity">
                  {copied === tab ? '✅ コピー済み！AIに貼り付けてください' : `📋 ${
                    tab === 'script' ? '台本作成' :
                    tab === 'characters' ? '人物画像' :
                    tab === 'thumbnail' ? 'サムネイル' :
                    tab === 'title' ? 'タイトル・タグ' :
                    'BGM'
                  }プロンプトをコピー`}
                </button>

                <p className="text-xs text-white/30 text-center">文字起こし全文（{transcript.text.length.toLocaleString()}文字）がプロンプトに含まれます</p>

                {/* AI service links */}
                <div className="space-y-1.5">
                  <div className="text-xs text-white/40 px-1">貼り付け先：</div>

                  {/* Text AI (② script, ⑤ title, ⑥ bgm) */}
                  {(tab === 'script' || tab === 'title' || tab === 'bgm') && (
                    <>
                      {tab === 'script' && (
                        <a href="https://claude.ai/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl hover:bg-amber-500/15">
                          <span className="text-lg">🟠</span>
                          <span className="text-sm font-bold text-amber-400 flex-1">Claude</span>
                          <span className="text-xs text-white/40">自然な日本語台本</span>
                          <span className="text-xs bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">おすすめ</span>
                        </a>
                      )}
                      <a href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl hover:bg-white/10">
                        <span className="text-lg">🟢</span>
                        <span className="text-sm font-bold text-green-400 flex-1">ChatGPT</span>
                        <span className="text-xs text-white/40">{tab === 'title' ? 'SEO最適化が得意' : tab === 'bgm' ? 'Suno形式プロンプト' : '構造化が得意'}</span>
                      </a>
                      <a href="https://gemini.google.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl hover:bg-white/10">
                        <span className="text-lg">🔵</span>
                        <span className="text-sm font-bold text-sky-400 flex-1">Gemini</span>
                        <span className="text-xs text-white/40">{tab === 'title' ? 'YouTube SEO（Google製）' : tab === 'bgm' ? 'ジャンル知識が豊富' : '超長文OK（100万トークン）'}</span>
                      </a>
                    </>
                  )}

                  {/* Image AI (③ characters, ④ thumbnail) */}
                  {(tab === 'characters' || tab === 'thumbnail') && (
                    <>
                      <a href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-xl hover:bg-green-500/15">
                        <span className="text-lg">🟢</span>
                        <span className="text-sm font-bold text-green-400 flex-1">ChatGPT（DALL-E 3）</span>
                        <span className="text-xs text-white/40">{tab === 'characters' ? '抽出+生成を一発で' : 'テキスト入り画像OK'}</span>
                        <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">おすすめ</span>
                      </a>
                      <a href="https://gemini.google.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl hover:bg-white/10">
                        <span className="text-lg">🔵</span>
                        <span className="text-sm font-bold text-sky-400 flex-1">Gemini（Imagen 3）</span>
                        <span className="text-xs text-white/40">リアル寄り・無料</span>
                      </a>
                      <a href="https://www.bing.com/images/create" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl hover:bg-white/10">
                        <span className="text-lg">🟣</span>
                        <span className="text-sm font-bold text-blue-400 flex-1">Bing Image Creator</span>
                        <span className="text-xs text-white/40">DALL-E 3・完全無料</span>
                      </a>
                      {tab === 'thumbnail' && (
                        <a href="https://www.canva.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl hover:bg-white/10">
                          <span className="text-lg">🎨</span>
                          <span className="text-sm font-bold text-purple-400 flex-1">Canva</span>
                          <span className="text-xs text-white/40">テンプレ+テキスト調整</span>
                        </a>
                      )}
                      {tab === 'characters' && (
                        <a href="https://leonardo.ai/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl hover:bg-white/10">
                          <span className="text-lg">🟤</span>
                          <span className="text-sm font-bold text-purple-400 flex-1">Leonardo AI</span>
                          <span className="text-xs text-white/40">アニメ特化・150枚/日</span>
                        </a>
                      )}
                    </>
                  )}

                  {/* BGM generation services (⑥ only) */}
                  {tab === 'bgm' && (
                    <>
                      <div className="text-xs text-white/40 px-1 mt-3">AI作曲：</div>
                      <a href="https://suno.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 bg-purple-500/10 border border-purple-500/20 rounded-xl hover:bg-purple-500/15">
                        <span className="text-lg">🎵</span>
                        <span className="text-sm font-bold text-purple-400 flex-1">Suno AI</span>
                        <span className="text-xs text-white/40">無料10曲/日</span>
                        <span className="text-xs bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded">おすすめ</span>
                      </a>
                      <a href="https://www.udio.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl hover:bg-white/10">
                        <span className="text-lg">🎶</span>
                        <span className="text-sm font-bold text-blue-400 flex-1">Udio</span>
                        <span className="text-xs text-white/40">高品質・無料枠あり</span>
                      </a>
                      <div className="text-xs text-white/40 px-1 mt-2">無料BGM素材：</div>
                      <a href="https://dova-s.jp/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl hover:bg-white/10">
                        <span className="text-lg">🎹</span>
                        <span className="text-sm font-bold text-green-400 flex-1">DOVA-SYNDROME</span>
                        <span className="text-xs text-white/40">商用OK・ジャンル検索</span>
                      </a>
                      <a href="https://amachamusic.chagasi.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl hover:bg-white/10">
                        <span className="text-lg">🍵</span>
                        <span className="text-sm font-bold text-amber-400 flex-1">甘茶の音楽工房</span>
                        <span className="text-xs text-white/40">和風・癒し系充実</span>
                      </a>
                    </>
                  )}
                </div>
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
