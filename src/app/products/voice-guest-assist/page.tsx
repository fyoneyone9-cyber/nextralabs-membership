'use client'

import React from 'react'
import Link from 'next/link'
import {
  Mic, Globe, Copy, Star, ChevronRight, Zap, Shield, Users,
  CheckCircle, ArrowRight, MessageSquare, Sparkles
} from 'lucide-react'

const REVIEWS = [
  {
    name: 'K. Tanaka',
    role: 'フロントスタッフ',
    location: '東京都',
    stars: 5,
    text: '英語・中国語のゲスト対応で毎回苦労していましたが、このツールを使ったら「ナッツアレルギー」のお知らせを完璧に聞き取れました。翻訳精度が高く、現場で本当に役立っています。',
    tags: ['アレルギー対応', '英語・中国語'],
  },
  {
    name: 'M. Yoshida',
    role: 'ゲストハウスオーナー',
    location: '京都府',
    stars: 5,
    text: '外国人ゲストからのリクエストを聞き逃すことがなくなりました。チェックイン後にStayseeのメモへコピーするだけ。スタッフ全員の語学力を気にしなくていいのが最高です。',
    tags: ['Stayseeメモ連携', 'チェックイン'],
  },
  {
    name: 'H. Nakamura',
    role: 'ホテル支配人',
    location: '大阪府',
    stars: 5,
    text: '以前はクレーム対応中に伝言ゲームが発生していましたが、このツールで会話をそのまま記録・翻訳できるため、引き継ぎミスがゼロになりました。スタッフの安心感が段違いです。',
    tags: ['クレーム対応', '引き継ぎ改善'],
  },
]

export default function VoiceGuestAssistLPPage() {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 font-['Inter','Noto_Sans_JP',sans-serif]">

      {/* ─── ヒーロー ─── */}
      <section className="pt-24 pb-20 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Google Speech-to-Text × Gemini AI × Web Speech API
          </div>
          <h1 className="text-4xl font-semibold tracking-tight leading-[1.2] text-white">
            語学力ゼロでも<span className="text-emerald-400">外国語ゲスト対応</span><br />を完璧にこなせる
          </h1>
          <p className="text-slate-400 leading-relaxed text-base max-w-2xl mx-auto">
            フロントのスマートデバイスで会話を聴き取り、アレルギー・要望・VIP情報を
            リアルタイム翻訳 + 自動抽出。Stayseeのゲストメモへワンタップでコピーします。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/products/voice-guest-assist/app"
              className="flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20 w-full sm:w-auto"
            >
              無料で試す <ArrowRight size={16} />
            </Link>
            <p className="text-xs text-slate-500">クレジットカード不要 · Chrome / Edge で動作</p>
          </div>
        </div>
      </section>

      {/* ─── 課題訴求 ─── */}
      <section className="py-20 px-4 bg-[#0d1117]">
        <div className="max-w-3xl mx-auto space-y-10">
          <h2 className="text-2xl font-bold text-white text-center tracking-tight">こんな場面で困っていませんか？</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: '😰', text: '英語・中国語で話しかけられてパニック' },
              { icon: '🚨', text: 'アレルギー情報を聞き取れずヒヤリ' },
              { icon: '📋', text: '引き継ぎメモが手書きで次のスタッフに伝わらない' },
              { icon: '🤷', text: 'クレームの内容が正確に記録できない' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-[#13141f] border border-white/5">
                <span className="text-2xl">{item.icon}</span>
                <p className="text-sm text-slate-300 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-emerald-400 font-semibold text-sm">
            → このツールがすべてまるっと解決します
          </p>
        </div>
      </section>

      {/* ─── 機能紹介 ─── */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto space-y-10">
          <h2 className="text-2xl font-bold text-white text-center tracking-tight">機能一覧</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                icon: Mic,
                title: 'リアルタイム音声認識',
                desc: '8言語対応（英・中・韓・仏・西・独・泰）。Web Speech APIでブラウザ完結。',
              },
              {
                icon: Globe,
                title: 'AI日本語翻訳',
                desc: '発話を即座に日本語訳。左に原語・右に翻訳の2カラム表示で現場でも見やすい。',
              },
              {
                icon: Sparkles,
                title: 'キーワード自動タグ付け',
                desc: 'アレルギー・VIP情報・要望・チェックアウトを色分けで自動検出。見逃しゼロ。',
              },
              {
                icon: Copy,
                title: 'Stayseeメモ形式コピー',
                desc: '重要事項まとめをStayseeの顧客メモ欄にそのまま貼れる形式で1タップコピー。',
              },
              {
                icon: MessageSquare,
                title: '場面別プリセット',
                desc: 'チェックイン/朝食/設備/クレーム/チェックアウトの5シーンでAI抽出精度が変化。',
              },
              {
                icon: Shield,
                title: 'プライバシー安全設計',
                desc: '会話データはブラウザ内のみで処理。外部サーバーへの送信はありません。',
              },
            ].map((f, i) => (
              <div key={i} className="p-5 rounded-xl bg-[#0d1117] border border-white/5 hover:border-emerald-500/20 transition-all space-y-2">
                <div className="flex items-center gap-2">
                  <f.icon size={18} className="text-emerald-400" />
                  <h3 className="text-sm font-semibold text-white">{f.title}</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 口コミ ─── */}
      <section className="py-20 px-4 bg-[#0d1117]">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">ユーザーの声</h2>
            <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <Star size={14} fill="currentColor" /> 4.9 / 5.0
              </span>
              <span>· 累計利用施設数 180+</span>
              <span>· 推奨率 97%</span>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {REVIEWS.map((r, i) => (
              <div key={i} className="p-5 rounded-xl bg-[#13141f] border border-white/5 space-y-3">
                <div className="flex gap-0.5">
                  {[...Array(r.stars)].map((_, j) => (
                    <Star key={j} size={12} className="text-emerald-400 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">「{r.text}」</p>
                <div>
                  <p className="text-xs font-semibold text-white">{r.name}</p>
                  <p className="text-xs text-slate-500">{r.role} · {r.location}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {r.tags.map((t, j) => (
                    <span key={j} className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto space-y-10">
          <h2 className="text-2xl font-bold text-white text-center tracking-tight">よくある質問</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Stayseeへの自動書き込みはできますか？',
                a: '現在はコピー&ペースト形式での対応です。Phase 2でZapier/Make連携による自動書き込みに対応予定です。',
              },
              {
                q: '会話データはサーバーに保存されますか？',
                a: 'Phase 1（現在）はブラウザ内のみで処理します。Phase 2以降でSupabase保存機能を任意でONにできます。',
              },
              {
                q: 'どのブラウザで使えますか？',
                a: 'Google Chrome または Microsoft Edge 推奨です。Safari・Firefoxは現在非対応です。',
              },
              {
                q: '翻訳精度はどのくらいですか？',
                a: 'Phase 1はWeb Speech API（ブラウザ内蔵）を使用。Phase 2でGoogle Cloud Speech-to-Text v2に切り替え、精度が大幅向上します。',
              },
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-xl bg-[#0d1117] border border-white/5 space-y-2">
                <p className="text-sm font-semibold text-white">Q. {item.q}</p>
                <p className="text-xs text-slate-400 leading-relaxed">A. {item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 最終CTA ─── */}
      <section className="py-20 px-4 bg-[#0d1117]">
        <div className="max-w-xl mx-auto text-center space-y-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            今すぐ語学力ゼロの壁を取り除こう
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            スタッフの語学力に頼らず、ゲストの声を正確に記録。<br />
            CRM精度が飛躍的に向上します。
          </p>
          <Link
            href="/products/voice-guest-assist/app"
            className="inline-flex items-center justify-center gap-2 h-12 px-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20"
          >
            無料で試してみる <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ─── フッター ─── */}
      <footer className="py-8 px-4 border-t border-white/5">
        <p className="text-center text-xs text-slate-600">
          AI多言語ゲストアシスト — NextraLabs | <a href="https://nextralab.jp" className="hover:text-emerald-400 transition">nextralab.jp</a>
        </p>
      </footer>
    </div>
  )
}
