'use client'
import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Clock, Music, Film, Tv, Gamepad2, BookOpen, Sparkles, ArrowRight, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const PRESETS = [
  { emoji: '🎌', label: 'バブル時代', sub: '約35年前・音楽・映画' },
  { emoji: '📱', label: 'ガラケー全盛期', sub: '約20年前・音楽・アニメ' },
  { emoji: '🎮', label: 'ゲーム黄金期', sub: '約25年前・ゲーム・マンガ' },
  { emoji: '🌸', label: 'ゆとり世代の青春', sub: '約15年前・ドラマ・音楽' },
]

const FEATURES = [
  {
    icon: Clock,
    title: '年代を選ぶ',
    desc: '5年前〜40年前まで、スライダーで直感的に「あの頃」を指定。世代ラベルで時代感を確認できます。',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
  {
    icon: Sparkles,
    title: 'ジャンルを選ぶ',
    desc: '音楽・映画・ドラマ・アニメ・ゲーム・マンガ・本。複数選択で幅広くレコメンド。',
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
  },
  {
    icon: ArrowRight,
    title: 'AIが発掘する',
    desc: 'AIが当時のトレンドと文化背景を分析し、あなたの青春にぴったりの名作を厳選して提案します。',
    color: 'text-rose-400',
    bg: 'bg-rose-400/10',
  },
]

const STEPS = [
  { step: '01', title: '年代を指定', desc: 'スライダーで「何年前に戻るか」を選ぶ。5年〜40年前まで対応。' },
  { step: '02', title: 'ジャンルを選択', desc: '好きなジャンルを複数選択。音楽・映画・アニメ・ゲームなど7ジャンル。' },
  { step: '03', title: 'AIが解析', desc: 'AIがその年代・ジャンルの名作を一気に発掘。当時の文化背景も解説。' },
  { step: '04', title: '名作に再会', desc: '最大10作品のレコメンドが登場。楽天・Amazonで即購入も可能。' },
]

export default function NostalgicRecomLP() {
  return (
    <div className="bg-[#050507] text-slate-200 min-h-screen">

      {/* ===== ヒーロー ===== */}
      <section className="relative overflow-hidden px-4 pt-20 pb-16 text-center">
        {/* 背景グロー */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[120px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm text-amber-400">
            <Clock size={14} />
            タイムトラベルレコメンド
          </div>

          <h1 className="mb-4 text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">
            あの頃の僕へ
            <span className="block text-amber-400">✨</span>
          </h1>

          <p className="mx-auto mb-3 max-w-xl text-lg text-slate-400">
            ○年前の青春を、AIが今に蘇らせる。
          </p>
          <p className="mx-auto mb-8 max-w-2xl text-sm text-slate-500">
            年代とジャンルを選ぶだけで、あの頃あなたが夢中になっていたはずの名作を
            AIが発掘・厳選します。懐かしさと再発見の旅へ。
          </p>

          <Link href="/products/nostalgic-recom/app">
            <Button className="h-14 px-8 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-base shadow-[0_4px_24px_rgba(245,158,11,0.4)]">
              あの頃に戻る
              <ChevronRight className="ml-2" size={18} />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* ===== プリセット紹介 ===== */}
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-4xl">
          <p className="mb-6 text-center text-sm text-slate-500">人気のタイムトラベル先</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {PRESETS.map((p) => (
              <Link key={p.label} href="/products/nostalgic-recom/app">
                <div className="cursor-pointer rounded-xl border border-white/10 bg-white/5 p-4 text-center transition-all hover:border-amber-500/40 hover:bg-amber-500/5">
                  <div className="mb-2 text-2xl">{p.emoji}</div>
                  <div className="text-sm font-bold text-slate-200">{p.label}</div>
                  <div className="mt-1 text-xs text-slate-500">{p.sub}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 機能説明 ===== */}
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-2xl font-bold text-white">
            3ステップで青春に会いに行く
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {FEATURES.map((f) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className={`mb-4 inline-flex rounded-xl p-3 ${f.bg}`}>
                  <f.icon className={f.color} size={24} />
                </div>
                <h3 className="mb-2 font-bold text-white">{f.title}</h3>
                <p className="text-sm text-slate-400">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 使い方ステップ ===== */}
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center text-2xl font-bold text-white">使い方</h2>
          <div className="space-y-4">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex-shrink-0 rounded-lg bg-amber-500/20 px-3 py-1.5 text-sm font-black text-amber-400">
                  {s.step}
                </div>
                <div>
                  <div className="font-bold text-white">{s.title}</div>
                  <div className="mt-1 text-sm text-slate-400">{s.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 対応ジャンル ===== */}
      <section className="px-4 pb-16 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-6 text-xl font-bold text-white">対応ジャンル</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: '🎵', label: '音楽' },
              { icon: '🎬', label: '映画' },
              { icon: '📺', label: 'ドラマ' },
              { icon: '🌸', label: 'アニメ' },
              { icon: '🎮', label: 'ゲーム' },
              { icon: '📚', label: 'マンガ' },
              { icon: '📖', label: '本' },
            ].map((g) => (
              <div key={g.label} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                <span>{g.icon}</span>
                <span>{g.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ボトムCTA ===== */}
      <section className="px-4 pb-20 text-center">
        <div className="mx-auto max-w-xl rounded-2xl border border-amber-500/20 bg-amber-500/5 p-10">
          <div className="mb-3 text-3xl">⏰</div>
          <h2 className="mb-3 text-xl font-bold text-white">タイムトラベルを始めよう</h2>
          <p className="mb-6 text-sm text-slate-400">
            何年前に戻りたいですか？<br />
            AIがあなたの「あの頃」の名作を今すぐ発掘します。
          </p>
          <Link href="/products/nostalgic-recom/app">
            <Button className="h-12 px-8 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl">
              あの頃に戻る ✨
            </Button>
          </Link>
        </div>
      </section>

    </div>
  )
}
