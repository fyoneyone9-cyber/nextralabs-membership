'use client'
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Building2, Globe, ShieldCheck, KeyRound,
  ScanFace, Smartphone, ChevronRight, CheckCircle2,
  Languages, Clock, AlertTriangle, Zap
} from 'lucide-react'
import Link from 'next/link'

const NextraAiLP = () => {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32">

      {/* ── ヒーローセクション ── */}
      <section className="max-w-5xl mx-auto px-4 pt-24 pb-20 text-center space-y-8">
        <div className="flex justify-center">
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-5 py-1.5 rounded-full font-medium text-xs tracking-wide">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-2" />
            宿泊業界特化型 AI チェックインシステム
          </Badge>
        </div>

        <h1 className="text-4xl md:text-7xl font-semibold text-white tracking-tight leading-[1.1]">
          フロントが<span className="text-emerald-400">いなくても</span><br />
          チェックインが完結する時代へ
        </h1>

        <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-normal">
          PMS連携・本人確認・鍵発行まで、Nextra AI がすべて自動化。<br className="hidden md:block" />
          フロントレス運営で人件費を削減し、24時間365日ゲストを迎えます。
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <a href="mailto:f.yoneyone9@gmail.com?subject=Nextra AI お見積もり依頼">
            <button className="h-12 px-8 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-base rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2">
              お見積もりを依頼する <ChevronRight size={18} />
            </button>
          </a>
          <a href="#features">
            <button className="h-12 px-8 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-semibold text-base rounded-lg transition-all">
              機能を見る
            </button>
          </a>
        </div>

        {/* 実績バッジ */}
        <div className="flex flex-wrap justify-center gap-6 pt-6 text-sm text-slate-500">
          <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> 4言語対応</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> PMS完全連携</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> 24時間無人運営</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> ¥9,800〜/月</span>
        </div>
      </section>

      {/* ── 課題訴求セクション ── */}
      <section className="bg-[#0d1117] py-20 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-14 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
              こんな課題を抱えていませんか？
            </h2>
            <ul className="space-y-4 text-slate-400">
              {[
                'フロントスタッフの人件費・夜間対応コストが重い',
                '外国人ゲストへの対応で言語の壁がある',
                'チェックイン待ち行列でゲスト満足度が下がっている',
                'PIが取れないのに紙台帳のみで管理している',
                '深夜の無人時間帯に鍵の受け渡しができない',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[#13141f] border border-emerald-500/20 rounded-2xl p-8 shadow-[0_0_30px_rgba(16,185,129,0.08)]">
            <p className="text-emerald-300 text-lg font-semibold leading-loose text-center">
              Nextra AI が、<br />
              これらすべてを<span className="text-emerald-400">完全自動化</span>します。<br />
              <span className="text-slate-400 text-sm font-normal">フロント不要・24時間対応・多言語対応。</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── 機能紹介 ── */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-24 space-y-16">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
            Nextra AI の <span className="text-emerald-400">5つのコア機能</span>
          </h2>
          <p className="text-slate-400 text-base">チェックインから退出まで、すべてのフローをAIがカバーします。</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <ScanFace size={28} />,
              title: 'AI 本人確認',
              desc: 'パスポート・運転免許証をスキャンし、AIが瞬時に本人確認を完了。不正チェックインをゼロに。',
            },
            {
              icon: <Smartphone size={28} />,
              title: 'キオスク＆モバイル対応',
              desc: 'タブレット型キオスクまたはゲスト自身のスマホからセルフチェックイン。待ち時間ゼロを実現。',
            },
            {
              icon: <Languages size={28} />,
              title: '4言語対応',
              desc: '日本語・英語・中国語・韓国語をシームレスに切り替え。インバウンドゲストも自力でチェックイン。',
            },
            {
              icon: <KeyRound size={28} />,
              title: 'AI 自動鍵発行',
              desc: 'チェックイン完了と同時にデジタルキーを自動発行。フロントスタッフへの連絡不要。',
            },
            {
              icon: <Building2 size={28} />,
              title: 'PMS 完全連携',
              desc: '宿泊管理システムとリアルタイム同期。予約・客室ステータス・料金を一元管理。',
            },
            {
              icon: <ShieldCheck size={28} />,
              title: 'コンプライアンス対応',
              desc: '旅館業法の宿泊者名簿をデジタル自動記録。行政提出用データをワンクリックで出力。',
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-[#0d1117] border border-white/5 hover:border-emerald-500/30 rounded-xl p-7 space-y-4 transition-all group"
            >
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold text-white">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── フロー説明 ── */}
      <section className="bg-[#0d1117] py-20 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-4 space-y-12 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
            チェックインはたった <span className="text-emerald-400">4ステップ</span>
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { step: '01', label: '予約番号入力', desc: 'QRコードまたは予約IDを入力' },
              { step: '02', label: '本人確認', desc: 'AIが証明書をスキャン・照合' },
              { step: '03', label: '自動チェックイン', desc: 'PMSに連携・書類自動記録' },
              { step: '04', label: '鍵受取', desc: 'デジタルキーを即時発行' },
            ].map((s, i) => (
              <div key={i} className="bg-[#13141f] border border-white/5 rounded-xl p-6 space-y-3 text-left relative">
                <span className="text-emerald-500/40 font-bold text-3xl">{s.step}</span>
                <p className="text-white font-semibold text-sm">{s.label}</p>
                <p className="text-slate-500 text-xs leading-relaxed">{s.desc}</p>
                {i < 3 && (
                  <ChevronRight size={16} className="text-emerald-500/50 absolute top-1/2 -right-2 -translate-y-1/2 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 効果・数字 ── */}
      <section className="max-w-5xl mx-auto px-4 py-20 grid md:grid-cols-3 gap-8 text-center">
        {[
          { value: '90%', label: 'フロント対応工数削減', sub: 'AI自動化により人件費を大幅カット' },
          { value: '4言語', label: 'インバウンド完全対応', sub: '言語の壁をAIが即時に解消' },
          { value: '24h', label: '無人チェックイン対応', sub: '深夜・早朝も自動でゲストを迎える' },
        ].map((item, i) => (
          <div key={i} className="bg-[#0d1117] border border-white/5 rounded-xl p-8 space-y-2">
            <p className="text-5xl font-bold text-emerald-400">{item.value}</p>
            <p className="text-white font-semibold">{item.label}</p>
            <p className="text-slate-500 text-sm">{item.sub}</p>
          </div>
        ))}
      </section>

      {/* ── CTA ── */}
      <section className="max-w-4xl mx-auto px-4 pt-8">
        <Card className="bg-gradient-to-br from-emerald-700 to-teal-900 border-0 rounded-2xl p-10 md:p-16 shadow-2xl relative overflow-hidden text-center space-y-8">
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 pointer-events-none">
            <Building2 size={240} className="text-white" />
          </div>
          <div className="relative z-10 space-y-5">
            <h2 className="text-3xl md:text-5xl font-semibold text-white tracking-tight leading-tight">
              あなたのホテルを<br />フロントレスへ。
            </h2>
            <p className="text-emerald-100 text-base md:text-lg leading-relaxed max-w-xl mx-auto font-normal">
              NextraLabs プレミアムプランで Nextra AI を今すぐ無料体験。<br />
              導入コンサルもご相談ください。
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <a href="mailto:f.yoneyone9@gmail.com?subject=Nextra AI お見積もり依頼">
                <button className="h-12 px-10 bg-white text-emerald-700 font-semibold text-base rounded-lg shadow-lg hover:bg-emerald-50 transition-all flex items-center gap-2">
                  お見積もりを依頼する <ChevronRight size={18} />
                </button>
              </a>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

const NexraPricingSection = () => (
  <section className="max-w-5xl mx-auto px-4 py-24 space-y-12" id="pricing">
    <div className="text-center space-y-3">
      <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
        料金プラン
      </h2>
      <p className="text-slate-400 text-base">室数に合わせて選べる3プラン。初期費用0円。</p>
    </div>
    <div className="grid md:grid-cols-3 gap-6">
      {[
        { name: 'スモールプラン', price: '¥9,800', period: '/月', rooms: '〜10室', features: ['無人チェックイン', 'AI身分証確認', '4言語対応', 'メールサポート'] },
        { name: 'スタンダードプラン', price: '¥19,800', period: '/月', rooms: '〜30室', features: ['無人チェックイン', 'AI身分証確認', '4言語対応', 'PMS連携', 'スマートロック連携', 'オンボーディングサポート'], highlight: true },
        { name: 'エンタープライズ', price: '¥29,800', period: '/月', rooms: '無制限', features: ['無人チェックイン', 'AI身分証確認', '4言語対応', 'PMS連携', 'スマートロック連携', '専任サポート', 'カスタマイズ対応'] },
      ].map((plan) => (
        <div
          key={plan.name}
          className={`rounded-2xl p-8 space-y-6 flex flex-col ${
            plan.highlight
              ? 'bg-emerald-500/10 border-2 border-emerald-500/50'
              : 'bg-[#0d1117] border border-white/5'
          }`}
        >
          {plan.highlight && (
            <span className="inline-block self-start px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              おすすめ
            </span>
          )}
          <div>
            <p className="text-sm text-slate-400 font-medium">{plan.name}</p>
            <p className="text-4xl font-bold text-white mt-1">
              {plan.price}<span className="text-base font-normal text-slate-400">{plan.period}</span>
            </p>
            <p className="text-emerald-400 text-sm font-medium mt-1">{plan.rooms}</p>
          </div>
          <ul className="space-y-2 flex-1">
            {plan.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <a href="mailto:f.yoneyone9@gmail.com?subject=Nextra AI お見積もり依頼">
            <button
              className={`w-full h-12 rounded-lg font-semibold text-sm transition-all ${
                plan.highlight
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  : 'bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300'
              }`}
            >
              お見積もりを依頼する
            </button>
          </a>
        </div>
      ))}
    </div>
  </section>
)

const NextraFaqSection = () => {
  const faqs = [
    {
      q: '初期費用はかかりますか？',
      a: '初期費用は0円です。月額料金のみで導入でき、¥9,800/月（〜10室プラン）からご利用いただけます。導入サポートも月額料金に含まれています。',
    },
    {
      q: '対応PMSを教えてください。',
      a: '主要なクラウド型PMSとのAPI連携に対応しています。スクレイピング不要のAPI連携で予約・客室ステータスをリアルタイム同期します。具体的な対応PMS一覧はお問い合わせください。',
    },
    {
      q: '対応しているスマートロックの種類は？',
      a: 'Bluetooth・NFC・PIN対応の主要スマートロックブランドに対応しています。既存設備がある場合は事前にご確認ください。新規導入の場合は推奨機器をご案内します。',
    },
    {
      q: '旅館業法に準拠していますか？',
      a: 'はい。旅館業法が定める宿泊者名簿の記録要件をデジタルで完全充足します。身分証スキャン・電子署名・宿泊記録の自動保存により、行政提出用データをワンクリックで出力可能です。',
    },
    {
      q: 'サポート体制はどうなっていますか？',
      a: 'メールサポートは平日10〜18時対応。スタンダードプラン以上ではオンボーディングサポートが付きます。エンタープライズプランでは専任担当者が継続的にサポートします。',
    },
  ]

  return (
    <section className="max-w-3xl mx-auto px-4 py-24 space-y-10">
      <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight text-center">
        よくある質問
      </h2>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <div
            key={faq.q}
            className="bg-[#0d1117] border border-white/5 rounded-xl p-6 space-y-3"
          >
            <h3 className="text-white font-semibold text-base flex items-start gap-2">
              <ChevronRight size={18} className="text-emerald-400 shrink-0 mt-0.5" />
              {faq.q}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed pl-6">{faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

const NextraAiLPFull = () => (
  <>
    <NextraAiLP />
    <NexraPricingSection />
    <NextraFaqSection />
  </>
)

export default NextraAiLPFull
