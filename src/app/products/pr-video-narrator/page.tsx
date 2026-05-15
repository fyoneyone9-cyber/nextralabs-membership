import Link from 'next/link'
import { Metadata } from 'next'
import { Mic, ChevronRight, Check, ArrowRight, Upload, Wand2, Download, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'PR動画ナレーター | NextraLabs — 動画をアップするだけで自動ナレーション生成',
  description: '動画をアップロードするだけ。AIが内容を解析してVOICEVOXキャラクターによるナレーション入り動画を自動生成。立ち絵アニメーション・口パク演出付き。',
}

const STEPS = [
  { icon: Upload,  label: '動画をアップロード',   desc: 'MP4ファイルをアップするだけ。インストール不要。' },
  { icon: Wand2,   label: 'AIが自動解析',        desc: 'シーンを検出してナレーション原稿を自動生成。' },
  { icon: Mic,     label: 'キャラ音声で読み上げ', desc: 'VOICEVOXキャラが選べる。立ち絵アニメーション付き。' },
  { icon: Download, label: 'MP4でダウンロード',   desc: 'ナレーション入り動画が完成。そのままYouTubeへ。' },
]

const FEATURES = [
  'AIによる動画内容の自動解析・原稿生成',
  'VOICEVOXキャラクター音声（ずんだもん・四国めたん 他）',
  '立ち絵アニメーション（口パク演出）付き',
  'シーン同期ナレーション（タイミング自動調整）',
  '複数キャラの掛け合い対応',
  '元音声との合成・音量バランス調整',
  'MP4（H.264）でダウンロード',
  'プレミアムプランで利用可能',
]

const USE_CASES = [
  { emoji: '🎬', title: 'YouTube PR動画',   desc: '商品・サービスの紹介動画に自動でナレーションを追加。' },
  { emoji: '🏢', title: '社内研修動画',     desc: '画面録画に解説音声を自動付与。マニュアル動画を量産。' },
  { emoji: '📱', title: 'SNSリール',        desc: 'Reel・TikTok向けに短尺ナレーション動画を量産。' },
  { emoji: '🎙️', title: 'ポッドキャスト動画版', desc: 'スライドや画像にナレーションを乗せてYouTube用に変換。' },
]

export default function PrVideoNarratorLpPage() {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 font-sans">

      {/* ヒーロー */}
      <section className="relative overflow-hidden pt-20 pb-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-transparent to-emerald-950/20 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 border border-violet-500/25 bg-violet-500/5 rounded-full px-4 py-1.5 mb-6">
            <Mic className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-[11px] font-medium text-violet-400 tracking-widest uppercase">AI Video Narrator</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-5 leading-[1.15]">
            動画をアップするだけで<br />
            <span className="text-violet-400">プロのナレーション</span>入り動画に。
          </h1>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
            AIが動画の内容を自動解析 → ナレーション原稿を生成 → VOICEVOXキャラが読み上げ。<br />
            立ち絵アニメーション・口パク演出付きで、プロ品質の動画が数分で完成。
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/pr-video-narrator">
              <Button className="h-12 px-8 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl gap-2 text-base transition-all shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                今すぐ使ってみる <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" className="h-12 px-8 border-white/15 text-slate-300 hover:bg-white/5 rounded-xl text-base">
                プランを見る
              </Button>
            </Link>
          </div>
          <p className="text-xs text-slate-600 mt-4">プレミアムプラン（¥1,980/月）で利用可能</p>
        </div>
      </section>

      {/* 使い方 4ステップ */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-10">使い方は4ステップ</h2>
          <div className="flex flex-col md:flex-row items-start gap-4">
            {STEPS.map((step, i) => (
              <div key={step.label} className="flex-1 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-3">
                  <step.icon className="h-6 w-6 text-violet-400" />
                </div>
                <div className="text-[10px] font-bold text-violet-400 mb-1">STEP {i + 1}</div>
                <p className="text-sm font-semibold text-white mb-1">{step.label}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                {i < STEPS.length - 1 && (
                  <ChevronRight className="h-5 w-5 text-slate-700 mt-3 md:hidden" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* デモイメージ（パイプライン図） */}
      <section className="py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#0d1117] border border-white/8 rounded-2xl p-6 overflow-x-auto">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">自動処理パイプライン</p>
            <div className="flex items-center gap-2 flex-nowrap">
              {['動画解析 (AI)', 'ナレーション原稿生成', 'VOICEVOX TTS', 'ffmpeg合成', '完成MP4'].map((label, i, arr) => (
                <div key={label} className="flex items-center gap-2 shrink-0">
                  <div className="px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-xs text-violet-300 whitespace-nowrap">
                    {label}
                  </div>
                  {i < arr.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-slate-600 shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 機能一覧 */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">できること</h2>
              <ul className="space-y-3">
                {FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <Check className="h-4 w-4 text-violet-400 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">こんな用途に</h2>
              <div className="space-y-4">
                {USE_CASES.map((u) => (
                  <div key={u.title} className="bg-[#0d1117] border border-white/8 rounded-xl p-4">
                    <p className="text-sm font-semibold text-white mb-1">{u.emoji} {u.title}</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{u.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 法人向け訴求 */}
      <section className="py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-[#0d1117] p-8">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/30 to-transparent pointer-events-none" />
            <div className="relative flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Users className="h-6 w-6 text-emerald-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-white mb-1">法人・チームでの利用をお考えですか？</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  研修動画・社内コンテンツを量産したい企業様向けに、法人プランをご用意しています。
                  シート数・カスタム機能など、要件に応じてご提案します。
                </p>
              </div>
              <Link href="/corporate" className="shrink-0">
                <Button className="h-10 px-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-xl gap-2 whitespace-nowrap">
                  法人プランを見る <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">さっそく使ってみよう</h2>
          <p className="text-slate-400 text-sm mb-8">プレミアムプラン（¥1,980/月）で今すぐ利用開始できます。</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/pr-video-narrator">
              <Button className="h-12 px-8 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl gap-2 transition-all">
                ツールを開く <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" className="h-12 px-6 border-white/15 text-slate-300 hover:bg-white/5 rounded-xl">
                料金プランを見る
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
