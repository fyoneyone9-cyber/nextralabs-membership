import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI借金完済・おまとめ診断 | 借金の一本化と完済への最短ルートをAIが設計 | NextraLabs',
  description: '借入先・金額・金利を入力するだけ。AIが最適なおまとめローン先・返済順序・完済スケジュールを自動計算。債務整理すべきか判定付き。完全無料・匿名OK。',
  keywords: ['借金おまとめAI','ローン一本化','返済シミュレーターAI','借金完済AI','債務整理AI','おまとめローン比較','借金相談AI','返済計画AI','金利比較AI','NextraLabs借金'],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: {
    canonical: 'https://membership-site-nextralabos.vercel.app/products/loan-advisor',
  },
  openGraph: {
    title: 'AI借金完済・おまとめ診断 | 借金の一本化と完済への最短ルートをAIが設計 | NextraLabs',
    description: '借入先・金額・金利を入力するだけ。AIが最適なおまとめローン先・返済順序・完済スケジュールを自動計算。債務整理すべきか判定付き。完全無料・匿名OK。',
    url: 'https://membership-site-nextralabos.vercel.app/products/loan-advisor',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: 'https://membership-site-nextralabos.vercel.app/og-image.png', width: 1200, height: 630, alt: 'AI借金完済・おまとめ診断 | 借金の一本化と完済への最短ルートをAIが設計 | NextraLabs' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI借金完済・おまとめ診断 | 借金の一本化と完済への最短ルートをAIが設計 | NextraLabs',
    description: '借入先・金額・金利を入力するだけ。AIが最適なおまとめローン先・返済順序・完済スケジュールを自動計算。債務整理すべきか判定付き。完全無料・匿名OK。',
    images: ['https://membership-site-nextralabos.vercel.app/og-image.png'],
  },
}

﻿import Link from 'next/link'
import { ShieldCheck, TrendingDown, Zap, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function LoanAdvisorPromo() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AI借金完済・おまとめ診断',
    description: '借入先・金額・金利を入力するだけ。AIが最適なおまとめローン先・返済順序・完済スケジュールを自動計算。',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    url: 'https://membership-site-nextralabos.vercel.app/products/loan-advisor',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
    publisher: { '@type': 'Organization', name: 'NextraLabs' },
  }
  return (
    <div className="min-h-screen bg-[#050507] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center space-y-6">
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-1 text-xs font-bold tracking-tight uppercase ">
            Debt Recovery AI
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none uppercase">
            借金を<span className="text-emerald-500">一本化</span>して<br />人生を再起動する。
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-bold max-w-2xl mx-auto">
            複数の借入れ、高い金利。AIがあなたの債務状況を分析し、完済までの最短ルートを無料診断。
          </p>
          
          <div className="pt-8">
            <Link href="/products/loan-advisor/app">
              <button className="bg-emerald-600 hover:bg-emerald-500 text-white h-20 px-12 rounded-[2rem] font-bold text-2xl uppercase tracking-tight transition-all shadow-[0_0_50px_rgba(16,185,129,0.4)] active:scale-95 flex items-center justify-center gap-4 mx-auto">
                無料診断を開始する <ArrowRight size={28} />
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
          {[
            { icon: <TrendingDown className="text-emerald-500" />, title: '金利を軽減', desc: '一本化することで月々の返済額と総支払額を大幅にカット。' },
            { icon: <Zap className="text-emerald-500" />, title: '一瞬で診断', desc: '借入状況を入力するだけで、AIが最適な完済プランを生成。' },
            { icon: <ShieldCheck className="text-emerald-500" />, title: '完全匿名', desc: '個人情報の入力は不要。誰にも知られずに現状を分析できます。' },
          ].map((feature, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] space-y-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight">{feature.title}</h3>
              <p className="text-slate-400 font-bold text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-24 p-10 bg-gradient-to-br from-emerald-600/20 to-transparent border border-emerald-500/20 rounded-[3rem] space-y-6">
          <h2 className="text-3xl font-bold uppercase tracking-tighter">AIがおまとめのメリットを可視化</h2>
          <ul className="space-y-4">
            {[
              '現在の平均金利と総返済額の算出',
              'おまとめローン適用時の利息軽減額シミュレーション',
              'Gemini 2.5 Flash によるパーソナライズされた完済アドバイス',
              '信頼できる金融機関へのスムーズな案内',
            ].map((li, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-300 font-bold">
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> {li}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-[#0d1117] py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">よくある質問</h2>
          <div className="space-y-6">
            <div>
              <p className="font-semibold text-white mb-2">Q. 本当に無料で使えますか？</p>
              <p className="text-slate-400 text-sm">A. はい、AI借金完済・おまとめ診断は完全無料です。会員登録も個人情報の入力も一切不要で、匿名のままご利用いただけます。</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Q. 複数の借金がある場合でも診断できますか？</p>
              <p className="text-slate-400 text-sm">A. はい。消費者金融・クレジットカード・銀行カードローンなど複数の借入先を入力でき、AIが一括でおまとめシミュレーションと返済優先順序を提案します。</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Q. 債務整理が必要かどうかも判定してもらえますか？</p>
              <p className="text-slate-400 text-sm">A. はい。借入総額・収入・返済能力をAIが総合判断し、「おまとめローンで解決可能」か「任意整理・個人再生・自己破産を検討すべき」かの目安を提示します。ただし最終判断は専門家にご相談ください。</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Q. 入力した借金情報はどこかに保存されますか？</p>
              <p className="text-slate-400 text-sm">A. 保存されません。入力情報はブラウザ内のAI処理にのみ使用され、サーバーには送信・保存されません。完全に匿名でご利用いただけます。</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Q. 金利の低い順に返済する「アバランチ法」なども提案してもらえますか？</p>
              <p className="text-slate-400 text-sm">A. はい。利息を最小化する「アバランチ法」や、心理的達成感を優先する「スノーボール法」など、複数の返済戦略をAIが比較提案します。</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 口コミ ── */}
      <section className="bg-[#0d1117] py-20 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-4 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
              ユーザーの<span className="text-emerald-400">リアルな声</span>
            </h2>
            <p className="text-slate-400 text-sm">実際に使ったユーザーの感想</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: '今井 勇樹', role: '会社員・30代', location: '埼玉県', text: '3社から合計180万円の借入があり毎月の返済が限界でした。AIに相談したらおまとめローンで月々の返済が4万円から2.5万円に減り、精神的にかなり楽になりました。何から始めればいいか明確に教えてくれたのが良かったです。', tag: '多重債務' },
              { name: '村上 亜希子', role: 'パート主婦・40代', location: '大阪府', text: 'カードのリボ払いが膨らんでいて誰にも相談できずにいました。客観的に現状を整理してくれて、完済までの具体的なスケジュールを出してもらえました。2年計画で実行中です。', tag: 'リボ払い整理' },
              { name: '谷口 英樹', role: '自営業・40代', location: '愛知県', text: 'コロナ禍に事業資金を借りすぎて返済に苦しんでいました。事業ローンと個人ローンを分けて整理してくれて、どちらを優先すべきか戦略的に教えてくれました。返済ペースが整い、事業も持ち直してきています。', tag: '事業者の借金整理' },
              { name: '栗原 美佐', role: '看護師・30代', location: '福岡県', text: '奨学金と車のローンが重なって家計が苦しくて。繰り上げ返済シミュレーションで総支払利息をどれだけ減らせるか可視化してもらいました。毎月1万円の追加返済で5年早く完済できると分かりモチベーションが上がりました。', tag: '奨学金返済' },
              { name: '森田 浩平', role: '会社員・20代', location: '東京都', text: '就職してすぐクレカを使いすぎてしまいました。プロに相談するほどでもないと思っていましたが、AIに話したら状況の深刻さとすぐに取るべき行動を教えてくれました。今は計画的に返済できています。', tag: '若年層の借金' },
              { name: '和田 奈々', role: 'シングルマザー', location: '神奈川県', text: '離婚後に生活費がショートしてしまい消費者金融を使ってしまいました。給付金や支援制度と組み合わせた返済プランを出してくれて、一人では考えつかない解決策がありました。子どもとの未来が少し見えてきました。', tag: 'シングル親の家計' },
            ].map((r, i) => (
              <div key={i} className="bg-[#13141f] border border-white/5 hover:border-emerald-500/20 rounded-2xl p-6 space-y-4 flex flex-col transition-all">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-emerald-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed flex-1">{r.text}</p>
                <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0">
                    {r.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm whitespace-nowrap">{r.name}</p>
                    <p className="text-slate-500 text-xs whitespace-nowrap">{r.role} · {r.location}</p>
                    <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">{r.tag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
