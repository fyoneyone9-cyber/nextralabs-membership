'use client'
import { useState, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { ArrowRight, Video, FileText, Users, ImageIcon, Music, Type, Download, Copy, ExternalLink, Info, FileAudio, Clapperboard, CheckCircle2, Sparkles, MessageSquareText, HelpCircle, Globe, Zap } from 'lucide-react'
import { DebugPanel } from './DebugPanel'

const STEPS = [
  { id: 1, label: '素材取り込み', icon: Video, what: '動画・音声の解析準備', how: '素材をアップロードしてください。音声を自動で抜き出します。', result: '文字起こし用の音声データ' },
  { id: 2, label: '台本作成', icon: FileText, what: 'ストーリー構築', how: 'プロンプトをコピーしてClaude等に渡してください。', result: 'プロ級の神台本' },
  { id: 3, label: 'キャラ設定', icon: Users, what: 'キャラ定義', how: 'AIに魅力的なキャラ像を提案させます。', result: '詳細なキャラ設定' },
  { id: 4, label: 'サムネイル', icon: ImageIcon, what: 'デザイン案', how: 'クリック率の高いサムネイルを生成します。', result: 'サムネイル構図' },
  { id: 5, label: 'タイトル', icon: Type, what: 'SEO最適化', how: '検索に強いタイトルを生成します。', result: '最強のタイトル' },
  { id: 6, label: 'BGM作成', icon: Music, what: '音の魔法', how: '動画に合うBGMプロンプトを作成します。', result: 'オリジナルBGM' }
]

const MAJOR_AI = [
  { id: 'gemini', name: 'GEMINI', url: 'https://gemini.google.com', icon: '💎', desc: '大容量・検索連動', billing: '完全無料' },
  { id: 'chatgpt', name: 'CHATGPT', url: 'https://chatgpt.com', icon: '🟢', desc: '万能・画像生成', billing: '基本無料' },
  { id: 'claude', name: 'CLAUDE', url: 'https://claude.ai', icon: '🟠', desc: '日本語・台本最強', billing: '基本無料', isBestForScript: true },
]

export default function YoutubeProducer() {
  const [currentStep, setCurrentStep] = useState(1);
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedAudioUrl, setExtractedAudioUrl] = useState(null);
  const [compressProgress, setCompressProgress] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const fileRef = useRef(null);

  const extractAudio = async (file) => {
    setCompressProgress('🔄 抽出中...');
    const { FFmpeg } = await import('@ffmpeg/ffmpeg');
    const { fetchFile, toBlobURL } = await import('@ffmpeg/util');
    const ffmpeg = new FFmpeg();
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    await ffmpeg.load({ coreURL: await toBlobURL(baseURL + '/ffmpeg-core.js', 'text/javascript'), wasmURL: await toBlobURL(baseURL + '/ffmpeg-core.wasm', 'application/wasm') });
    ffmpeg.on('progress', ({ progress }) => setCompressProgress('🎵 ' + Math.round(progress * 100) + '%'));
    const inputName = 'input' + file.name.slice(file.name.lastIndexOf('.'));
    await ffmpeg.writeFile(inputName, await fetchFile(file));
    await ffmpeg.exec(['-i', inputName, '-vn', '-acodec', 'libmp3lame', '-ab', '16k', '-ar', '8000', '-ac', '1', 'output.mp3']);
    const data = await ffmpeg.readFile('output.mp3');
    setExtractedAudioUrl(URL.createObjectURL(new Blob([data.buffer], { type: 'audio/mp3' })));
    setCompressProgress(null);
  };

  const currentInfo = STEPS[currentStep - 1];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-12 min-h-screen text-slate-200 font-sans pb-20">
      <div className="text-center space-y-4">
        <div className="w-24 h-24 rounded-[2rem] bg-red-600 flex items-center justify-center mx-auto shadow-2xl"><Clapperboard className="h-12 w-12 text-white" /></div>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">YouTube Producer</h1>
      </div>

      {/* 🟢 STEP PROGRESS BAR */}
      <div className="flex items-center justify-center max-w-6xl mx-auto overflow-x-auto pb-10 px-10 scrollbar-hide">
        <div className="flex items-center justify-between w-full min-w-[800px]">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className={lex flex-col items-center gap-3 transition-all \}>
                <div className={w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all \}>
                  {currentStep > s.id ? <CheckCircle2 className="h-7 w-7" /> : <s.icon className="h-7 w-7" />}
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest mt-4 whitespace-nowrap">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={h-1 flex-1 mx-4 rounded-full transition-all mb-8 \} />}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-indigo-600 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 p-8 opacity-10"><HelpCircle className="h-40 w-40" /></div>
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4">
            <Badge className="bg-white text-indigo-600 font-black px-6 py-2 text-xl rounded-2xl shadow-xl">STEP 0{currentStep}</Badge>
            <h3 className="text-4xl font-black italic uppercase tracking-tighter">{currentInfo.what}</h3>
          </div>
          <p className="text-2xl font-bold leading-relaxed opacity-95">{currentInfo.how}</p>
          <div className="bg-black/20 p-6 rounded-3xl border border-white/10 flex items-center gap-4">
             <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg"><Zap className="h-8 w-8 text-slate-950 fill-current" /></div>
             <div>
               <p className="text-emerald-300 font-black text-xl italic uppercase tracking-widest leading-none mb-1">Expected Success:</p>
               <p className="text-white font-bold text-lg">{currentInfo.result}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
        <Card className="bg-slate-900 border-2 border-slate-800 rounded-[4rem] p-12 shadow-2xl overflow-hidden max-w-5xl mx-auto">
          {currentStep === 1 && (
             <div className="space-y-12">
                <input ref={fileRef} type="file" accept="video/*,audio/*" onChange={(e) => { const f = e.target.files[0]; if(f){setSelectedFile(f); extractAudio(f)}} } className="hidden" />
                {!extractedAudioUrl ? (
                  <div onClick={() => fileRef.current.click()} className="border-4 border-dashed border-slate-800 rounded-[3rem] p-24 text-center hover:bg-slate-800/30 cursor-pointer group transition-all">
                    <FileAudio className="h-24 w-24 mx-auto mb-6 text-red-500 group-hover:scale-110 transition-transform flex items-center justify-center" />
                    <p className="text-3xl font-black text-white">{selectedFile ? selectedFile.name : '動画または音声を追加'}</p>
                  </div>
                ) : (
                  <div className="bg-slate-950 p-12 rounded-[3.5rem] border-2 border-blue-500/30 space-y-10 animate-in zoom-in duration-500">
                    <h3 className="text-3xl font-black text-blue-400 italic text-center">Audio Extracted Successfully</h3>
                    <audio src={extractedAudioUrl} controls className="w-full h-20" />
                    <div className="grid grid-cols-2 gap-6">
                        <a href={extractedAudioUrl} download="audio.mp3" className="h-24 bg-blue-600 text-white font-black text-2xl rounded-[2rem] shadow-xl flex items-center justify-center gap-4">保存</a>
                        <Button className="h-24 bg-white text-black font-black text-2xl rounded-[2rem] shadow-xl" onClick={() => { navigator.clipboard.writeText("詳細に漏れのないように文字起こしして。"); setCopiedId('tr') }}>
                          {copiedId === 'tr' ? '✅ COPIED' : '指示をコピー'}
                        </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/5">
                      {MAJOR_AI.map(ai => (
                        <a key={ai.id} href={ai.url} target="_blank" className="h-24 bg-slate-900 border-2 border-white/5 rounded-3xl flex flex-col items-center justify-center gap-2 hover:scale-105 transition-all">
                          <span className="text-3xl">{ai.icon}</span><span className="font-black text-white text-xs uppercase">{ai.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                <div className="space-y-6 pt-12 border-t border-slate-800">
                  <Label className="text-2xl font-black text-white flex items-center gap-4"><MessageSquareText className="h-10 w-10 text-red-500" /> Result Paste</Label>
                  <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="AIから返ってきたテキストを貼り付け..." className="w-full h-80 bg-slate-950 border-2 border-slate-800 rounded-[3rem] p-10 text-2xl font-medium focus:border-red-600 text-white shadow-inner" />
                  <Button onClick={() => setCurrentStep(2)} disabled={!inputText} className="w-full h-32 bg-red-600 text-white font-black text-4xl rounded-[3rem] shadow-2xl mt-10 uppercase italic">Next: Scripting <ArrowRight className="h-12 w-12" /></Button>
                </div>
             </div>
          )}
          {currentStep > 1 && (
            <div className="space-y-12">
              <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Step 0{currentStep}: {currentInfo.what}</h2>
              <div className="bg-slate-950 p-12 rounded-[3rem] border-2 border-white/5 font-mono text-2xl text-slate-300 leading-relaxed mb-10 max-h-[600px] overflow-y-auto shadow-inner text-left">
                 以下を元にYouTube台本を書いて：\n\n{inputText}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
                 {MAJOR_AI.map(ai => (
                   <a key={ai.id} href={ai.url} target="_blank" className={p-10 rounded-[3rem] border-2 bg-slate-950 flex flex-col items-center justify-center gap-4 hover:scale-105 transition-all shadow-xl \}>
                      {currentStep === 2 && ai.isBestForScript && <Badge className="bg-orange-600 text-white font-black px-4 py-1 text-sm uppercase mb-2">Recommended</Badge>}
                      <span className="text-6xl">{ai.icon}</span>
                      <span className="font-black text-white text-3xl uppercase tracking-tighter">{ai.name}</span>
                   </a>
                 ))}
              </div>
              <Button onClick={() => setCurrentStep(currentStep < 6 ? currentStep + 1 : 6)} className="w-full h-24 bg-slate-800 text-white font-black text-2xl rounded-3xl mt-10">NEXT STAGE</Button>
            </div>
          )}
        </Card>
      </div>
      <DebugPanel data={null} toolId="youtube-producer" />
    </div>
  )
}