'use client'
import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, 
  Upload, 
  CheckCircle2, 
  Youtube, 
  FileVideo, 
  FileText,
  Zap,
  ChevronRight,
  Loader2,
  Copy,
  ExternalLink,
  Sparkles,
  Download,
  Volume2,
  Image as ImageIcon,
  Type,
  Music,
  Clapperboard,
  Scissors
} from 'lucide-react'

const TABS = [
  { id: 'transcribe', label: '① 文字起こし', icon: Volume2 },
  { id: 'script', label: '② 台本作成', icon: FileText },
  { id: 'character', label: '③ 人物画像', icon: Scissors },
  { id: 'thumbnail', label: '④ サムネイル', icon: ImageIcon },
  { id: 'seo', label: '⑤ タイトル/SEO', icon: Type },
  { id: 'bgm', label: '⑥ BGM', icon: Music },
];

const GENRES = [
  '🎭 エンタメ', '📚 教育・解説', '📷 Vlog', '💻 テック・IT', '💼 ビジネス',
  '🎮 ゲーム実況', '🍳 料理', '✈️ 旅行', '📰 ニュース', '🎤 対談'
];

export default function YoutubeProducer() {
  const [activeTab, setActiveTab] = useState('transcribe');
  const [selectedGenre, setSelectedGenre] = useState(GENRES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8 min-h-screen text-slate-200 font-sans pb-20">
      <div className="text-center space-y-2">
        <Badge className="bg-red-500/10 text-red-500 border-red-500/20 mb-2">
          <Clapperboard className="w-3 h-3 mr-1" /> NEXTRALABS ORIGINAL
        </Badge>
        <h1 className="text-5xl md:text-6xl font-black text-white uppercase italic tracking-tighter">AI YouTube Producer</h1>
        <p className="text-slate-400 font-bold tracking-widest text-xs uppercase">Post-Production Automation Hub</p>
      </div>

      {/* 🟢 NATIVE TAILWIND TABS (NO EXTERNAL DEPENDENCY) */}
      <div className="w-full">
        <div className="overflow-x-auto pb-4">
          <div className="bg-slate-900 border border-slate-800 p-1 flex min-w-[800px] rounded-2xl">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 px-2 rounded-xl font-bold text-xs uppercase italic transition-all flex items-center justify-center ${
                  activeTab === tab.id 
                    ? 'bg-red-600 text-white shadow-lg' 
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          {/* ① 文字起こし */}
          {activeTab === 'transcribe' && (
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center"><Volume2 className="h-8 w-8 text-red-500" /></div>
                  <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">音声を抽出・圧縮</h3>
                  <p className="text-slate-400 font-medium leading-relaxed">
                    ブラウザ内で動画から音声を抜き出し、AIに渡しやすいMP3に変換します。<br />
                    <span className="text-red-500 font-bold">※サーバーには一切送信されません（プライバシー安全）</span>
                  </p>
                  <div className="border-2 border-dashed border-slate-800 rounded-3xl p-10 text-center hover:bg-slate-950 transition-all group cursor-pointer relative">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="video/*,audio/*" />
                    <Upload className="h-10 w-10 text-slate-700 group-hover:text-red-500 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold">動画ファイルをドロップ</p>
                  </div>
                </div>
                <div className="bg-slate-950 rounded-[2.5rem] p-8 border border-slate-800 flex flex-col justify-center space-y-6">
                  <div className="space-y-2">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Recommended AI for Transcription</p>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 border-slate-800 text-slate-300 font-bold italic" onClick={() => window.open('https://chatgpt.com', '_blank')}>ChatGPT</Button>
                      <Button variant="outline" className="flex-1 border-slate-800 text-slate-300 font-bold italic" onClick={() => window.open('https://gemini.google.com', '_blank')}>Gemini</Button>
                    </div>
                  </div>
                  <div className="p-6 bg-slate-900 rounded-2xl border border-white/5">
                    <p className="text-sm font-bold text-white mb-2 italic">最強の指示書（コピーしてAIへ）</p>
                    <p className="text-xs text-slate-500 mb-4 font-mono leading-relaxed">「以下の音声ファイルから、重要な発言を逃さず一言一句文字起こししてください。誤字脱字は文脈から補正してください。」</p>
                    <Button onClick={() => handleCopy("以下の音声ファイルから、重要な発言を逃さず一言一句文字起こししてください。誤字脱字は文脈から補正してください。")} className="w-full bg-red-600 hover:bg-red-500 text-white font-black rounded-xl h-12 uppercase italic">{copied ? '✅ COPIED' : '指示をコピー'}</Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* ② 台本作成 */}
          {activeTab === 'script' && (
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-8 text-center max-w-2xl mx-auto">
                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">台本プロンプトを生成</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {GENRES.map(g => (
                    <Button key={g} variant={selectedGenre === g ? 'default' : 'outline'} onClick={() => setSelectedGenre(g)} className={`rounded-xl font-bold h-10 ${selectedGenre === g ? 'bg-red-600 border-red-400' : 'border-slate-800 text-slate-400'}`}>{g}</Button>
                  ))}
                </div>
                <div className="p-8 bg-slate-950 rounded-[2rem] border-2 border-slate-800 text-left relative group">
                  <div className="absolute top-4 right-4"><Zap className="text-yellow-500 fill-yellow-500" /></div>
                  <p className="text-sm font-bold text-slate-300 mb-4 italic">ジャンル：{selectedGenre}</p>
                  <p className="text-xs text-slate-500 leading-relaxed font-mono">
                    「あなたはプロのYouTube作家です。先程の文字起こしをもとに、視聴者を飽きさせない【{selectedGenre}】向けの台本を作成してください。構成はオープニング、本編、エンディングの3部構成とし、各セクションの尺の目安も入れてください。」
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-4 pt-4">
                  <Button onClick={() => handleCopy(`あなたはプロのYouTube作家です。先程の文字起こしをもとに、視聴者を飽きさせない【${selectedGenre}】向けの台本を作成してください。構成はオープニング、本編、エンディングの3部構成とし、各セクションの尺の目安も入れてください。`)} className="h-16 bg-red-600 hover:bg-red-500 text-white font-black text-xl rounded-2xl shadow-xl italic uppercase">{copied ? '✅ COPIED' : '指示をコピー'}</Button>
                  <Button variant="outline" onClick={() => window.open('https://claude.ai', '_blank')} className="h-16 border-slate-800 text-slate-300 font-black text-xl rounded-2xl italic uppercase">CLAUDEを開く <ExternalLink className="ml-2 w-5 h-5" /></Button>
                </div>
              </div>
            </Card>
          )}

          {/* ③ 人物画像 */}
          {activeTab === 'character' && (
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-12 shadow-2xl text-center animate-in fade-in slide-in-from-bottom-4">
              <div className="max-w-xl mx-auto space-y-8">
                <div className="w-20 h-20 bg-yellow-500/10 rounded-3xl flex items-center justify-center mx-auto"><Scissors className="h-10 w-10 text-yellow-500" /></div>
                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">登場人物のイラスト生成</h3>
                <p className="text-slate-400 font-medium italic leading-relaxed">台本から登場人物を自動でリストアップし、一貫性のあるアニメ風イラストを生成する指示をコピーします。</p>
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-left font-mono text-xs text-slate-500">
                  「この台本に登場する主要人物をリストアップしてください。その後、各キャラクターの特徴を捉えた、YouTube解説動画で使いやすい高品質なアニメ風立ち絵を生成してください。」
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button onClick={() => handleCopy("この台本に登場する主要人物をリストアップしてください。その後、各キャラクターの特徴を捉えた、YouTube解説動画で使いやすい高品質なアニメ風立ち絵を生成してください。")} className="h-14 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl italic uppercase">{copied ? '✅ COPIED' : '指示をコピー'}</Button>
                  <Button variant="outline" onClick={() => window.open('https://chatgpt.com', '_blank')} className="h-14 border-slate-800 text-slate-300 font-black rounded-xl italic uppercase">DALL-E 3 (GPT) <ExternalLink className="ml-2 w-4 h-4" /></Button>
                </div>
              </div>
            </Card>
          )}

          {/* ④ サムネイル */}
          {activeTab === 'thumbnail' && (
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-12 shadow-2xl text-center animate-in fade-in slide-in-from-bottom-4">
              <div className="max-w-xl mx-auto space-y-8">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto"><ImageIcon className="h-10 w-10 text-emerald-500" /></div>
                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">最強サムネイル案</h3>
                <p className="text-slate-400 font-medium italic leading-relaxed">クリック率を最大化する3パターンのデザイン構成と、具体的な画像生成プロンプトを作成します。</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button onClick={() => handleCopy("この動画の内容に最適な、YouTubeサムネイル案を3パターン（インパクト重視、情報量重視、感情重視）提案してください。サイズは16:9とし、入れるべきキャッチコピーと画像構成、背景、色の指定を含めてください。")} className="h-14 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl italic uppercase">{copied ? '✅ COPIED' : '指示をコピー'}</Button>
                  <Button variant="outline" onClick={() => window.open('https://www.canva.com', '_blank')} className="h-14 border-slate-800 text-slate-300 font-black rounded-xl italic uppercase">CANVAを開く <ExternalLink className="ml-2 w-4 h-4" /></Button>
                </div>
              </div>
            </Card>
          )}

          {/* ⑤ タイトル/SEO */}
          {activeTab === 'seo' && (
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-12 shadow-2xl text-center animate-in fade-in slide-in-from-bottom-4">
              <div className="max-w-xl mx-auto space-y-8">
                <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto"><Type className="h-10 w-10 text-blue-500" /></div>
                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">SEO最適化セット</h3>
                <p className="text-slate-400 font-medium italic leading-relaxed">Google検索とYouTube検索の両方で有利になる、タイトル・タグ・説明文のセットです。</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button onClick={() => handleCopy("この動画をYouTubeに投稿します。SEOに最適化された、クリックされやすいタイトルを5案出してください。また、関連ハッシュタグを15個、動画のチャプターを含む魅力的な説明文を作成してください。")} className="h-14 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl italic uppercase">{copied ? '✅ COPIED' : '指示をコピー'}</Button>
                  <Button variant="outline" onClick={() => window.open('https://gemini.google.com', '_blank')} className="h-14 border-slate-800 text-slate-300 font-black rounded-xl italic uppercase">GEMINI (SEO推奨) <ExternalLink className="ml-2 w-4 h-4" /></Button>
                </div>
              </div>
            </Card>
          )}

          {/* ⑥ BGM */}
          {activeTab === 'bgm' && (
            <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-12 shadow-2xl text-center animate-in fade-in slide-in-from-bottom-4">
              <div className="max-w-xl mx-auto space-y-8">
                <div className="w-20 h-20 bg-purple-500/10 rounded-3xl flex items-center justify-center mx-auto"><Music className="h-10 w-10 text-purple-500" /></div>
                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">BGM & サウンド生成</h3>
                <p className="text-slate-400 font-medium italic leading-relaxed">動画の雰囲気に合わせたBGM生成プロンプトや、おすすめのフリー音源サイトへ誘導します。</p>
                <div className="grid md:grid-cols-1">
                  <Button onClick={() => handleCopy("この動画の台本の雰囲気に合わせた、YouTubeのバックグラウンドで流すのに最適なBGMの構成案と、音楽生成AI用のプロンプトを作成してください。")} className="h-14 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl italic uppercase">{copied ? '✅ COPIED' : '指示をコピー'}</Button>
                </div>
                <div className="flex justify-center gap-4 pt-4">
                   <a href="https://suno.com" target="_blank" className="text-xs font-bold text-slate-500 hover:text-red-500 transition-colors">Suno AI ↗</a>
                   <a href="https://dova-s.jp" target="_blank" className="text-xs font-bold text-slate-500 hover:text-red-500 transition-colors">DOVA-SYNDROME ↗</a>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      <div className="mt-16 text-center text-slate-500">
         <p className="text-[10px] font-black uppercase tracking-widest italic">Powered by NextraLabs — AIの力を、あなたの日常に。</p>
      </div>
    </div>
  )
}
