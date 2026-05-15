'use client'
import { useState } from 'react'
import { Video, Copy, CheckCheck, ChevronRight } from 'lucide-react'

const STEPS = [
  {
    num: '①',
    title: '動画ファイルを用意する',
    desc: 'デスクトップなどに MP4 ファイルを置く。',
    code: null,
  },
  {
    num: '②',
    title: 'OpenClaw チャットに送る',
    desc: '以下のメッセージをコピーしてOpenClawのチャットに貼り付ける。',
    code: 'この動画にナレーションを入れて\nC:\\Users\\fyone\\Desktop\\<ファイル名>.mp4',
  },
  {
    num: '③',
    title: '自動処理（触らなくてOK）',
    desc: 'AIが動画を解析してナレーション原稿を生成 → Minimax TTSで音声合成 → ffmpegで動画に合成。',
    code: null,
  },
  {
    num: '④',
    title: '完成MP4をデスクトップで受け取る',
    desc: 'ナレーション入り MP4 がデスクトップに出力される。フルパスがチャットに表示される。',
    code: null,
  },
]

export default function PrVideoNarratorPage() {
  const [copied, setCopied] = useState(false)

  const sampleMessage = 'この動画にナレーションを入れて\nC:\\Users\\fyone\\Desktop\\<ファイル名>.mp4'

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleMessage)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 px-4 py-10">
      <div className="max-w-2xl mx-auto">

        {/* ヘッダー */}
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <Video className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">PR動画ナレーター</h1>
            <p className="text-xs text-emerald-400 font-medium">AI自動ナレーション合成ツール</p>
          </div>
        </div>
        <p className="text-sm text-slate-400 mb-4 ml-1">
          動画ファイルのパスをOpenClawに送るだけ。ナレーション生成〜音声合成〜動画合成まで全自動。
        </p>

        {/* 紹介文 */}
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 mb-8">
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">🎙️ できること</p>
          <p className="text-sm text-slate-300 leading-relaxed">
            AIが動画を自動解析してシーンを把握し、内容にぴったり合ったナレーション原稿を生成。
            <span className="text-emerald-400 font-semibold">VOICEVOXのずんだもん・四国めたん</span>など好きなキャラクターの声で音声を合成し、
            立ち絵アニメーション（口パク演出）付きの動画として仕上げます。
            日本語のキャラクターナレーションが、チャットに一言送るだけで完成。
            スクリプト不要・編集ソフト不要。
          </p>
        </div>

        {/* パイプライン図 */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {['動画解析', 'ナレーション原稿', 'TTS音声生成', 'ffmpeg合成', 'MP4完成'].map((label, i, arr) => (
            <div key={label} className="flex items-center gap-2 shrink-0">
              <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 whitespace-nowrap">
                {label}
              </div>
              {i < arr.length - 1 && <ChevronRight className="h-3 w-3 text-slate-600 shrink-0" />}
            </div>
          ))}
        </div>

        {/* ステップ */}
        <div className="space-y-4 mb-8">
          {STEPS.map((step) => (
            <div key={step.num} className="rounded-xl border border-white/8 bg-[#0d1117] p-4">
              <div className="flex items-start gap-3">
                <span className="text-emerald-400 font-bold text-sm mt-0.5 shrink-0">{step.num}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white mb-1">{step.title}</p>
                  <p className="text-xs text-slate-400">{step.desc}</p>
                  {step.code && (
                    <div className="mt-3 relative">
                      <pre className="bg-[#050507] border border-white/10 rounded-lg px-4 py-3 text-xs font-mono text-emerald-300 whitespace-pre-wrap break-all">
                        {step.code}
                      </pre>
                      <button
                        onClick={handleCopy}
                        className="absolute top-2 right-2 p-1.5 rounded-md bg-white/5 hover:bg-emerald-500/20 transition-colors"
                      >
                        {copied
                          ? <CheckCheck className="h-3.5 w-3.5 text-emerald-400" />
                          : <Copy className="h-3.5 w-3.5 text-slate-400" />}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 技術仕様 */}
        <div className="rounded-xl border border-white/8 bg-[#0d1117] p-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">技術仕様</p>
          <div className="space-y-2 text-xs text-slate-400">
            <div className="flex justify-between"><span>動画解析</span><span className="text-slate-300">Genspark media-analyze</span></div>
            <div className="flex justify-between"><span>TTS エンジン</span><span className="text-slate-300">VOICEVOX / Minimax Speech-2.8 HD</span></div>
            <div className="flex justify-between"><span>対応キャラ</span><span className="text-slate-300">ずんだもん・四国めたん 他</span></div>
            <div className="flex justify-between"><span>動画合成</span><span className="text-slate-300">ffmpeg 8.1.1</span></div>
            <div className="flex justify-between"><span>出力形式</span><span className="text-slate-300">MP4（H.264）</span></div>
            <div className="flex justify-between"><span>出力先</span><span className="text-slate-300">デスクトップ</span></div>
          </div>
        </div>

      </div>
    </div>
  )
}
