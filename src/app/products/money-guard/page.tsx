import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI家計防衛シミュレーター | 衝動買い・無駄遣いをAIが阻止 | NextraLabs',
  description: '買う前に5秒で診断。AIが衝動買いリスクを判定し、代替案・節約アドバイスを即提示。月収・固定費から家計を自動分析。節約・家計管理アプリの決定版。月額¥980。',
  keywords: [
    '家計管理AI','節約アプリ','衝動買い防止','家計シミュレーター','貯金アドバイス',
    '固定費削減','家計分析AI','節約術','お金管理アプリ','NextraLabs家計',
    'AI家計管理','衝動買い防止','節約シミュレーション','家計防衛AI','固定費見直し'
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: 'https://membership-site-nextralabos.vercel.app/products/money-guard',
  },
  openGraph: {
    title: 'AI家計防衛シミュレーター | 衝動買い・無駄遣いをAIが阻止 | NextraLabs',
    description: '買う前に5秒で診断。AIが衝動買いリスクを判定し、代替案・節約アドバイスを即提示。月収・固定費から家計を自動分析。節約・家計管理アプリの決定版。月額¥980。',
    url: 'https://membership-site-nextralabos.vercel.app/products/money-guard',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: 'https://membership-site-nextralabos.vercel.app/og-image.png', width: 1200, height: 630, alt: 'AI家計防衛シミュレーター | 衝動買い・無駄遣いをAIが阻止' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI家計防衛シミュレーター | 衝動買い・無駄遣いをAIが阻止',
    description: '買う前に5秒で診断。AIが衝動買いリスクを判定。節約・家計管理アプリの決定版。月額¥980。',
    images: ['https://membership-site-nextralabos.vercel.app/og-image.png'],
  },
}

import React from 'react'
import dynamic from 'next/dynamic'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Shield, Zap, Wallet, Camera, AlertTriangle, ArrowRight, Brain } from 'lucide-react'
import Link from 'next/link'

const moneyFaqs = [
  {
    q: 'どのような「衝動買い」に効果がありますか？',
    a: 'セール品・SNS広告でつい購入してしまうもの・ストレス解消のオンラインショッピングなど、あらゆる衝動購買に対してAIが5秒で診断します。購入理由・代替案・節約額をその場で提示します。',
  },
  {
    q: '家計データを入力すると外部に送信されますか？',
    a: 'いいえ。月収・固定費などの家計データは全てブラウザ内で処理され、外部サーバーには送信されません。プライバシーを完全に保護した状態で家計分析が行えます。',
  },
  {
    q: '節約効果はどのくらい期待できますか？',
    a: '個人の支出パターンにより異なりますが、衝動買いの多い方では月3〜5万円の節約につながるケースがあります。まず1ヶ月お試しいただくことをおすすめします。',
  },
  {
    q: 'スマートフォンでも使えますか？',
    a: 'はい。ブラウザベースのツールですので、PC・スマートフォン・タブレットのどのデバイスからもご利用いただけます。',
  },
  {
    q: '料金プランを教えてください。',
    a: 'スタンダードプラン（¥980/月）以上でご利用いただけます。プレミアムプランではより詳細な家計分析レポートや固定費削減シミュレーションも利用可能です。',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'AI家計防衛シミュレーター',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web',
      description: '買う前に5秒で診断。AIが衝動買いリスクを判定し、代替案・節約アドバイスを即提示。月収・固定費から家計を自動分析。',
      url: 'https://membership-site-nextralabos.vercel.app/products/money-guard',
      offers: {
        '@type': 'Offer',
        price: '980',
        priceCurrency: 'JPY',
        name: 'スタンダードプラン',
      },
      publisher: {
        '@type': 'Organization',
        name: 'NextraLabs',
        url: 'https://membership-site-nextralabos.vercel.app',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: moneyFaqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      })),
    },
  ],
}

const MoneyLpContent = () => {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32">
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center space-y-10">
        <Badge className="bg-red-500/10 text-red-400 border-red-500/20 px-6 py-1 rounded-full font-bold uppercase text-xs">Psychological Defense OS</Badge>
        <h1 className="text-4xl md:text-8xl font-bold text-white tracking-tighter uppercase leading-[1.1]">
          AI家計防衛<span className="text-red-600">シミュレーター</span>
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-slate-300 max-w-4xl mx-auto leading-relaxed px-4">
          「今、本当に必要ですか？」<br className="hidden md:block" />
          AIがあなたのドーパミンを抑止する。
        </h2>
        <div className="flex flex-wrap justify-center gap-6 pt-6">
          <Link href="/products/money-guard/app">
            <button className="h-20 px-12 bg-red-600 hover:bg-red-500 text-white font-bold text-xl rounded-2xl shadow-[0_20px_50px_rgba(220,38,38,0.3)] transition-all active:scale-95 uppercase ">
              家計を防衛する
            </button>
          </Link>
        </div>
      </section>

      <section className="bg-[#13141f] py-24 border-y border-white/5 text-left">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-white uppercase tracking-tight text-left text-left">その買い物、後悔しませんか？</h3>
            <ul className="space-y-4 text-slate-400 font-bold">
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> ストレス解消のために「ポチる」のが癖になっている</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> セールの文字を見ると、必要ないものまで買ってしまう</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 月末になると何にお金を使ったか分からなくなる</li>
            </ul>
          </div>
          <div className="bg-black/50 border-4 border-red-500/20 rounded-[3rem] p-10 shadow-inner">
             <p className="text-red-500 text-lg font-bold text-center leading-loose">
               AIが「客観的な第三者」として<br/>
               あなたの財布の紐を締め直します。
             </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-32 space-y-20 text-left">
        <div className="text-center space-y-4">
          <h3 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter text-center">Defense Technology</h3>
          <p className="text-slate-500 font-bold uppercase text-center">心理学とAIが融合した3つの防衛線</p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4">
            <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center text-red-500"><Camera size={24} /></div>
            <h4 className="text-xl font-bold text-white uppercase ">ビジュアル・スキャン</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">レシートや商品画像をAIが即座に解析。何にいくら払おうとしているかを視覚的に把握します。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4">
            <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center text-red-500"><Brain size={24} /></div>
            <h4 className="text-xl font-bold text-white uppercase ">心理的弱点の特定</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">「なぜこれを欲しいと思ったのか」という心理的要因をAIが分析。衝動の裏側を言語化します。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4">
            <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center text-red-500"><Shield size={24} /></div>
            <h4 className="text-xl font-bold text-white uppercase ">強力な抑止アラート</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">無駄遣いの可能性が高い場合、画面が「警告モード」へ移行。冷静さを取り戻すまで購入を許可しません。</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-20 space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tighter">よくある質問</h2>
        </div>
        <div className="space-y-4">
          {moneyFaqs.map((faq) => (
            <div
              key={faq.q}
              className="bg-[#13141f] border-2 border-white/5 rounded-2xl p-6 space-y-3"
            >
              <h3 className="text-white font-bold text-base">Q. {faq.q}</h3>
              <p className="text-slate-400 text-sm font-bold leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pt-20">
        <Card className="bg-gradient-to-br from-red-600 to-rose-900 border-0 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden text-center space-y-10">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Wallet size={300} className="text-white" /></div>
          <div className="relative z-10 space-y-6">
            <h3 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter">Secure Your Future.</h3>
            <p className="text-red-100 text-lg font-bold leading-relaxed max-w-2xl mx-auto px-4">
              一時的な快楽よりも、将来の資産を。AI家計防衛シミュレーターがあなたの資産防衛をサポートします。
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-6">
              <Link href="/signup">
                <button className="h-20 px-16 bg-white text-red-700 font-bold text-2xl rounded-2xl shadow-xl hover:bg-red-50 transition-all active:scale-95 uppercase ">
                  Start Defense Sequence
                </button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(MoneyLpContent), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507]" />
})

export default function MoneyLp() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NoSSRWrapper />

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
              { name: '立花 由紀', role: '共働き主婦・30代', location: '東京都', text: '夫婦二人で稼いでいるのに貯金がなかなか増えず不安でした。収支を入力したら固定費の見直しポイントを具体的に教えてくれました。通信費と保険の見直しだけで月2万円浮き、半年で12万円貯まりました。', tag: '共働き家計改善' },
              { name: '峯岸 昭', role: '定年間近・50代', location: '神奈川県', text: '老後の資金が心配で定年後の家計シミュレーションを依頼しました。年金額との差分と必要な準備額を分かりやすく示してくれました。今から始めるべき積立額が明確になり、iDeCoを満額に変更しました。', tag: '老後資金対策' },
              { name: '板垣 恵子', role: 'シングルマザー・40代', location: '大阪府', text: '一人で子ども2人を育てていて家計が常にギリギリでした。使える補助金と給付金を漏れなく教えてくれて、月3万円以上のサポートを受けられるようになりました。公的支援の活用は知っているかどうかで大差ですね。', tag: 'ひとり親の家計' },
              { name: '津田 和彦', role: '自営業・40代', location: '愛知県', text: '事業費と生活費が混在して家計が把握できていませんでした。分けて管理する方法と節税シミュレーションを出してくれました。青色申告の控除も最大限活用できるようになり、手元に残るお金が増えました。', tag: '自営業の家計管理' },
              { name: '水上 香里', role: '新婚・20代', location: '福岡県', text: '結婚して初めて家計管理を真剣に考えました。住宅購入のための貯蓄計画と毎月の目標額を出してくれます。ゲーム感覚で節約できて、夫婦で楽しみながら貯金が増えています。', tag: '新婚家計の設計' },
              { name: '宗像 茂', role: '子育て世帯・40代', location: '埼玉県', text: '教育費の将来シミュレーションをしてもらいました。子ども2人の大学費用まで含めた資金計画が一覧で出て、何歳までにいくら貯めればいいか明確になりました。NISAとの組み合わせ提案も具体的でした。', tag: '教育資金計画' },
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
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm">{r.name}</p>
                    <p className="text-slate-500 text-xs">{r.role} · {r.location}</p>
                  </div>
                  <span className="ml-auto shrink-0 text-[10px] font-medium px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {r.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
