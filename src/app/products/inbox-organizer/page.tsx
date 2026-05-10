import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gmail AI Accelerator | 未読ゼロを最速で実現するGmailAI整理術 | NextraLabs',
  description: 'GmailにAIを直接接続。重要メールの自動判定・優先順位付け・返信ドラフト生成・ラベル自動整理。メール処理を最大80%削減。ビジネスパーソン必携のメールAI。月額¥1,980。',
  keywords: [
    'Gmail AI','メール整理AI','受信箱管理','未読メール整理','メール自動分類',
    '返信自動生成','ビジネスメールAI','メール効率化','Gmail自動化','NextraLabs Gmail',
    'AIメール整理','Gmail自動分類','受信トレイゼロ','AIメール返信'
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: 'https://membership-site-nextralabos.vercel.app/products/inbox-organizer',
  },
  openGraph: {
    title: 'Gmail AI Accelerator | 未読ゼロを最速で実現するGmailAI整理術 | NextraLabs',
    description: 'GmailにAIを直接接続。重要メールの自動判定・優先順位付け・返信ドラフト生成・ラベル自動整理。メール処理を最大80%削減。月額¥1,980。',
    url: 'https://membership-site-nextralabos.vercel.app/products/inbox-organizer',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: 'https://membership-site-nextralabos.vercel.app/og-image.png', width: 1200, height: 630, alt: 'Gmail AI Accelerator | 未読ゼロを最速で実現するGmailAI整理術' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gmail AI Accelerator | 未読ゼロを最速で実現するGmailAI整理術',
    description: 'GmailにAIを直接接続。返信ドラフト自動生成・ラベル整理。メール処理を最大80%削減。月額¥1,980。',
    images: ['https://membership-site-nextralabos.vercel.app/og-image.png'],
  },
}

import React from 'react'
import dynamic from 'next/dynamic'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Mail, Zap, Clock, ShieldCheck, ArrowRight, MessageSquareText, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

const inboxFaqs = [
  {
    q: 'GmailのOAuth認証は安全ですか？',
    a: 'Google公式のOAuth 2.0認証を使用しています。パスワードを直接取得することはなく、必要最小限の権限（メール読み取り・下書き作成）のみで動作します。いつでもGoogleアカウントから連携解除できます。',
  },
  {
    q: '何件のメールを一度に処理できますか？',
    a: '最新10件のメールを一括スキャンし、重要度判定・返信案生成・優先順位付けを行います。プレミアムプランでは最大50件まで対応予定です。',
  },
  {
    q: '返信ドラフトの精度はどのくらいですか？',
    a: 'Gemini 2.5 Flashがメールの文脈・相手の意図・トーンを読み取り、状況に合わせた敬語で返信案を生成します。最終確認・送信はご自身で行っていただくため、誤送信のリスクはありません。',
  },
  {
    q: '日本語以外のメールにも対応していますか？',
    a: 'はい。英語・中国語など多言語のメールにも対応しています。Gemini AIが言語を自動判別し、適切な言語で返信案を生成します。',
  },
  {
    q: '料金プランと解約方法を教えてください。',
    a: 'プレミアムプラン（¥1,980/月）でご利用いただけます。月次更新のため、いつでも解約が可能です。解約後は次の更新日まで利用できます。',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Gmail AI Accelerator',
      applicationCategory: 'ProductivityApplication',
      operatingSystem: 'Web',
      description: 'GmailにAIを直接接続。重要メールの自動判定・優先順位付け・返信ドラフト生成・ラベル自動整理。メール処理を最大80%削減。',
      url: 'https://membership-site-nextralabos.vercel.app/products/inbox-organizer',
      offers: {
        '@type': 'Offer',
        price: '1980',
        priceCurrency: 'JPY',
        name: 'プレミアムプラン',
      },
      publisher: {
        '@type': 'Organization',
        name: 'NextraLabs',
        url: 'https://membership-site-nextralabos.vercel.app',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: inboxFaqs.map((faq) => ({
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

const InboxLpContent = () => {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32">
      {/* ヒーローセクション */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center space-y-10">
        <Badge className="bg-emerald-500/10 text-blue-400 border-emerald-500/20 px-6 py-1 rounded-full font-bold uppercase text-xs tracking-tight">次世代メール効率化OS</Badge>
        <h1 className="text-4xl md:text-8xl font-bold text-white tracking-tighter uppercase leading-[1.1]">
          Gmail <span className="text-emerald-500">AI</span> Accelerator
        </h1>
        <h2 className="text-xl md:text-4xl font-bold text-slate-300 max-w-4xl mx-auto leading-relaxed px-4 text-center">
          未読メールの山を「10分」で処理。<br className="hidden md:block" />
          AIが書く、あなたのための返信案。
        </h2>
        <div className="flex flex-wrap justify-center gap-6 pt-6">
          <Link href="/products/inbox-organizer/app">
            <button className="h-20 px-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xl rounded-2xl shadow-[0_20px_50px_rgba(37,99,235,0.3)] transition-all active:scale-95 uppercase leading-none">
              Gmailを爆速化する
            </button>
          </Link>
        </div>
      </section>

      {/* 悩み訴求セクション */}
      <section className="bg-[#13141f] py-24 border-y border-white/5 text-left">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-white uppercase tracking-tight">メール対応で1日が終わっていませんか？</h3>
            <ul className="space-y-4 text-slate-400 font-bold">
              <li className="flex items-center gap-4"><Clock className="text-red-500 shrink-0" /> 返信内容を考えるだけで数十分が経過する</li>
              <li className="flex items-center gap-4"><Clock className="text-red-500 shrink-0" /> 重要なメールがメルマガに埋もれて見つからない</li>
              <li className="flex items-center gap-4"><Clock className="text-red-500 shrink-0" /> 定型文のコピペ作業に疲弊している</li>
            </ul>
          </div>
          <div className="bg-black/50 rounded-[3rem] p-10 shadow-inner text-center">
             <p className="text-blue-400 text-lg font-bold leading-loose">
               その時間、AIに任せてください。<br/>
               あなたは「送信ボタン」を押すだけです。
             </p>
          </div>
        </div>
      </section>

      {/* 機能紹介セクション */}
      <section className="max-w-6xl mx-auto px-4 py-32 space-y-20 text-left">
        <div className="text-center space-y-4">
          <h3 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter text-center">生産性を高める4つのコア機能</h3>
          <p className="text-slate-500 font-bold uppercase text-center">ビジネスを加速させる知能</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-emerald-500/30 transition-all group">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0"><MessageSquareText size={24} /></div>
            <h4 className="text-xl font-bold text-white uppercase ">文脈を汲み取った返信案</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">相手の意図をAIが正確に理解。状況に合わせた最適な敬語・トーンで返信案を秒速生成します。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-emerald-500/30 transition-all group">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0"><Zap size={24} /></div>
            <h4 className="text-xl font-bold text-white uppercase ">最新10件の超高速スキャン</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">Gmailから直近の重要メールを抽出。一括で内容を把握し、優先順位をつけます。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-emerald-500/30 transition-all group">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0"><CheckCircle2 size={24} /></div>
            <h4 className="text-xl font-bold text-white uppercase text-left">Gmail下書き直接保存</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed text-left">作成した文章をワンクリックでGmailの「下書き」へ。スマホのGmailアプリからそのまま送信可能です。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-emerald-500/30 transition-all group">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0"><ShieldCheck size={24} /></div>
            <h4 className="text-xl font-bold text-white uppercase text-left">セキュアな本物連携</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed text-left">Google公式OAuth認証を使用。データの解析はGemini 2.5 Flashで安全かつ高速に行われます。</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-20 space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tighter">よくある質問</h2>
        </div>
        <div className="space-y-4">
          {inboxFaqs.map((faq) => (
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

      {/* CTAセクション */}
      <section className="max-w-5xl mx-auto px-4 pt-20">
        <Card className="bg-gradient-to-br from-emerald-600 to-emerald-900 border-0 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden text-center space-y-10">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Mail size={300} className="text-white" /></div>
          <div className="relative z-10 space-y-6 text-center">
            <h3 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter leading-none">メールに縛られない自由を。</h3>
            <p className="text-blue-100 text-lg font-bold leading-relaxed max-w-2xl mx-auto px-4 text-center">
              メールに奪われていた時間を、本来のクリエイティブな仕事に取り戻しましょう。
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-6">
              <Link href="/signup">
                <button className="h-20 px-16 bg-white text-emerald-700 font-bold text-2xl rounded-2xl shadow-xl hover:bg-blue-50 transition-all active:scale-95 uppercase leading-none">
                  無料で始めてみる
                </button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(InboxLpContent), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507]" />
})

export default function InboxLp() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NoSSRWrapper />
    </>
  )
}
