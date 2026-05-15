'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check, ArrowRight, Building2, Users, Zap, Shield, HeadphonesIcon, FileText } from 'lucide-react'

const plans = [
  {
    id: 'starter',
    name: 'スターター',
    price: '¥9,800',
    period: '/月〜',
    seats: '〜5名',
    color: 'cyan',
    badge: null,
    tagline: '小規模チーム・スタートアップ向け',
    features: [
      'スタンダードプラン機能 全員利用可',
      'シート数：5名まで',
      'チーム管理ダッシュボード',
      'メールサポート',
      '請求書払い対応',
    ],
  },
  {
    id: 'standard',
    name: 'スタンダード',
    price: '¥19,800',
    period: '/月〜',
    seats: '〜20名',
    color: 'emerald',
    badge: 'おすすめ',
    recommended: true,
    tagline: '中規模チーム・成長企業向け',
    features: [
      'プレミアムプラン機能 全員利用可',
      'シート数：20名まで',
      'チーム管理ダッシュボード',
      'チャット・電話サポート',
      '請求書払い・銀行振込対応',
      '月次レポート提供',
      '専任担当者アサイン',
    ],
  },
  {
    id: 'enterprise',
    name: 'エンタープライズ',
    price: '要お見積もり',
    period: '',
    seats: '無制限',
    color: 'violet',
    badge: 'カスタム',
    tagline: '大企業・フルカスタム対応',
    features: [
      'プレミアムプラン機能 全員利用可',
      'シート数：無制限',
      '業務特化型AIツール開発',
      '社内システムAPI連携',
      '専任エンジニア・PM対応',
      'SLA保証・24時間サポート',
      '請求書払い・発注書対応',
      'カスタムSSOシングルサインオン',
    ],
  },
]

const benefits = [
  {
    icon: Users,
    title: 'チーム全員で使える',
    desc: '個人契約不要。1契約でシート数分のメンバー全員がプレミアム機能を利用できます。',
    color: 'emerald',
  },
  {
    icon: Zap,
    title: '業務効率を組織全体に',
    desc: 'AI副業・SNS自動化・Gmail効率化など、個人の生産性改善をチーム単位で展開できます。',
    color: 'cyan',
  },
  {
    icon: Shield,
    title: '法人請求・インボイス対応',
    desc: '請求書払い・銀行振込・適格請求書（インボイス）に対応。経費処理をスムーズに。',
    color: 'violet',
  },
  {
    icon: HeadphonesIcon,
    title: '専任サポート',
    desc: '導入支援・運用サポートを専任担当者が対応。個人プランでは受けられない手厚いサポート。',
    color: 'amber',
  },
  {
    icon: FileText,
    title: 'カスタム開発も対応',
    desc: 'エンタープライズプランでは、御社業務に特化したAIツール開発・API連携も承ります。',
    color: 'rose',
  },
  {
    icon: Building2,
    title: '実績・信頼',
    desc: 'ホテルDX・不動産・婚活業界など、多様な業種への導入実績があります。',
    color: 'sky',
  },
]

const colorMap: Record<string, { card: string; badge: string; btn: string; check: string; accent: string }> = {
  cyan:    { card: 'border-cyan-500/30',    badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',    btn: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950',           check: 'text-cyan-400',    accent: 'text-cyan-400' },
  emerald: { card: 'border-emerald-500/50', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', btn: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950', check: 'text-emerald-400', accent: 'text-emerald-400' },
  violet:  { card: 'border-violet-500/30',  badge: 'bg-violet-500/10 text-violet-400 border-violet-500/30',  btn: 'bg-violet-600 hover:bg-violet-500 text-white',          check: 'text-violet-400',  accent: 'text-violet-400' },
}

export default function CorporatePage() {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 font-sans">

      {/* ヒーロー */}
      <section className="relative overflow-hidden pt-24 pb-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/30 via-transparent to-violet-950/20 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 border border-emerald-500/25 bg-emerald-500/5 rounded-full px-4 py-1.5 mb-6">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-medium text-emerald-400 tracking-widest uppercase">For Business</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-5 leading-[1.1]">
            AIツールを、<span className="text-emerald-400">チームに。</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
            個人の生産性革命を、組織全体へ。<br />
            NextraLabsの法人プランで、チーム全員がAIの恩恵を受けられます。
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact">
              <Button className="h-12 px-8 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-xl gap-2 text-base transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                導入を相談する <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" className="h-12 px-8 border-white/15 text-slate-300 hover:bg-white/5 rounded-xl text-base">
                個人プランを見る
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 法人導入メリット */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">なぜ法人プランか</h2>
            <p className="text-slate-400 text-sm">個人契約を束ねるより、圧倒的にコスパが良い</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((b) => (
              <div key={b.title} className="bg-[#0d1117] border border-white/8 rounded-2xl p-6 hover:border-white/15 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <b.icon className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{b.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* コスト比較バナー */}
      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-[#0d1117] p-8">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/40 via-transparent to-cyan-950/20 pointer-events-none" />
            <div className="relative text-center">
              <p className="text-sm text-slate-500 uppercase tracking-widest mb-3">コスト比較（20名チームの場合）</p>
              <div className="grid grid-cols-2 gap-6 md:gap-12 max-w-lg mx-auto">
                <div>
                  <p className="text-slate-500 text-xs mb-1">個人プラン × 20名</p>
                  <p className="text-3xl font-bold text-slate-400 line-through">¥39,600</p>
                  <p className="text-xs text-slate-500 mt-1">（¥1,980 × 20名）</p>
                </div>
                <div>
                  <p className="text-emerald-400 text-xs mb-1">法人スタンダード</p>
                  <p className="text-3xl font-bold text-emerald-400">¥19,800</p>
                  <p className="text-xs text-emerald-400/70 mt-1">🎉 約50%オフ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 料金プラン */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">参考価格プラン</h2>
            <p className="text-slate-400 text-sm">実際の料金は御社の規模・要件に応じて個別にご提案します</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const c = colorMap[plan.color]
              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col bg-[#0d1117] border ${c.card} rounded-2xl ${plan.recommended ? 'shadow-[0_0_60px_rgba(16,185,129,0.12)] ring-1 ring-emerald-500/20' : ''}`}
                >
                  {plan.recommended && (
                    <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                  )}
                  {plan.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className={`inline-flex items-center text-[11px] font-semibold px-3 py-1 rounded-full border ${c.badge}`}>
                        {plan.badge}
                      </span>
                    </div>
                  )}
                  <div className="p-7 flex flex-col flex-1">
                    <div className="mb-5">
                      <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                      <p className="text-xs text-slate-500">{plan.tagline}</p>
                    </div>
                    <div className="mb-2">
                      <div className="flex items-baseline gap-1">
                        <span className={`text-3xl font-bold ${c.accent}`}>{plan.price}</span>
                        <span className="text-sm text-slate-500">{plan.period}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">👥 {plan.seats}</p>
                    </div>
                    <p className="text-[11px] text-slate-600 mb-6 leading-relaxed">
                      ※ 表示は参考価格です。実際の料金は要件・規模に応じてお見積もりします。
                    </p>
                    <ul className="space-y-2.5 flex-1 mb-7">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                          <Check className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${c.check}`} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link href="/contact">
                      <Button className={`w-full h-11 font-semibold rounded-xl transition-all ${c.btn}`}>
                        このプランを相談する <ArrowRight className="ml-1.5 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-10">よくある質問</h2>
          <div className="space-y-4">
            {[
              { q: '試用期間はありますか？', a: 'はい。まず個人プランでお試しいただき、チーム導入をご検討いただけます。法人プランも無料デモセッションをご用意しています。' },
              { q: '請求書払いに対応していますか？', a: '法人スタンダード・エンタープライズプランでは、請求書払い・銀行振込・適格請求書（インボイス）に対応しています。' },
              { q: 'シート数を途中で変更できますか？', a: 'はい。月単位でシート数の追加・削減が可能です。詳しくはお問い合わせください。' },
              { q: '既存の社内システムと連携できますか？', a: 'エンタープライズプランでは、API連携・SSOシングルサインオン・カスタム開発に対応しています。要件をお聞かせください。' },
              { q: '導入支援・トレーニングはありますか？', a: '専任担当者が導入から運用定着まで伴走します。オンライン研修・マニュアル提供も対応しています。' },
            ].map((item) => (
              <div key={item.q} className="bg-[#0d1117] border border-white/8 rounded-xl p-5">
                <p className="text-sm font-semibold text-white mb-2">Q. {item.q}</p>
                <p className="text-sm text-slate-400 leading-relaxed">A. {item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-[#0d1117] p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/40 via-transparent to-violet-950/20 pointer-events-none" />
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                まずは無料相談から
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-lg mx-auto">
                御社の規模・業種・目標に合わせた最適なプランをご提案します。<br />
                見積もりは無料です。お気軽にご相談ください。
              </p>
              <Link href="/contact">
                <Button className="h-13 px-10 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl gap-2 text-base transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)]">
                  無料で導入相談する <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <p className="text-xs text-slate-600 mt-4">返信は通常1営業日以内 · 費用一切不要</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
