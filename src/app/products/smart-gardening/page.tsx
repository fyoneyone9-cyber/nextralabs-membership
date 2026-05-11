import { Metadata } from 'next'
import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Droplets, Sprout, Camera, CloudSun, CheckCircle2, Rocket } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AIスマートガーデニング | AIが植物の育て方・病気診断・栽培計画を提案 | NextraLabs',
  description: '育てたい植物・環境条件を入力するだけ。AIが最適な育て方・水やり頻度・肥料・病気診断・季節の作業カレンダーを自動提案。初心者から園芸上級者まで。月額¥980。',
  keywords: ['ガーデニングAI','植物育て方AI','家庭菜園AI','植物病気診断','水やり管理','栽培計画AI','ガーデニングアプリ','園芸AI','植物ケアAI','NextraLabsガーデニング'],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: 'https://membership-site-nextralabos.vercel.app/products/smart-gardening' },
  openGraph: {
    title: 'AIスマートガーデニング | AIが植物の育て方・病気診断・栽培計画を提案 | NextraLabs',
    description: '育てたい植物・環境条件を入力するだけ。AIが最適な育て方・水やり頻度・肥料・病気診断・季節の作業カレンダーを自動提案。初心者から園芸上級者まで。月額¥980。',
    url: 'https://membership-site-nextralabos.vercel.app/products/smart-gardening',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: 'https://membership-site-nextralabos.vercel.app/og-image.png', width: 1200, height: 630, alt: 'AIスマートガーデニング | NextraLabs' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIスマートガーデニング | AIが植物の育て方・病気診断・栽培計画を提案 | NextraLabs',
    description: '育てたい植物・環境条件を入力するだけ。AIが最適な育て方・水やり頻度・肥料・病気診断・季節の作業カレンダーを自動提案。月額¥980。',
    images: ['https://membership-site-nextralabos.vercel.app/og-image.png'],
  },
}

const faqItems = [
  {
    q: 'どんな種類の植物に対応していますか？',
    a: '野菜・果物・花・観葉植物・多肉植物・ハーブなど1,000種類以上に対応しています。植物名を入力するか、写真を撮影してAIが自動識別します。希少種や新品種も順次データベースに追加しています。',
  },
  {
    q: 'AIの病気診断はどのくらい正確ですか？',
    a: 'Gemini 1.5 Proの高度な画像解析エンジンを使用し、葉の変色・斑点・萎れなどの症状から主要な病気・害虫を85%以上の精度で診断します。診断結果には対処法と予防法も合わせて提案します。',
  },
  {
    q: 'ガーデニング初心者でも使えますか？',
    a: 'はい、初心者向けに設計しています。植物の名前がわからなくても写真から自動識別でき、専門用語を使わずわかりやすい言葉で育て方を説明します。初心者向け「はじめての植物」ガイドも搭載しています。',
  },
  {
    q: 'オフラインでも使用できますか？',
    a: '基本的な育て方ガイドはオフラインでも閲覧可能です。ただし、リアルタイム天気連動・AI病気診断・画像解析機能はインターネット接続が必要です。',
  },
  {
    q: '作業カレンダーをGoogleカレンダーと連携できますか？',
    a: 'はい、季節の作業カレンダー（水やり・施肥・剪定・植え替えなど）をGoogleカレンダーに一括登録できます。リマインダー通知で作業のし忘れを防止します。',
  },
]

export default function SmartGardeningLandingPage() {
  const features = [
    { icon: <Camera className="w-6 h-6 text-emerald-500" />, title: 'カメラ解析', desc: '写真を撮るだけで植物の状態をAIが読み取ります' },
    { icon: <CloudSun className="w-6 h-6 text-emerald-500" />, title: '天気連動', desc: 'Google天気を参照し、雨の日は水やり不要と通知' },
    { icon: <Droplets className="w-6 h-6 text-emerald-500" />, title: '最適化アドバイス', desc: '土の乾き具合に合わせた具体的な水分量を提示' }
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'AIスマートガーデニング',
        applicationCategory: 'LifestyleApplication',
        operatingSystem: 'Web',
        url: 'https://membership-site-nextralabos.vercel.app/products/smart-gardening',
        description: '育てたい植物・環境条件を入力するだけ。AIが最適な育て方・水やり頻度・肥料・病気診断・季節の作業カレンダーを自動提案。',
        offers: {
          '@type': 'Offer',
          price: '980',
          priceCurrency: 'JPY',
          priceSpecification: { '@type': 'UnitPriceSpecification', price: '980', priceCurrency: 'JPY', unitText: '月' },
        },
        provider: { '@type': 'Organization', name: 'NextraLabs', url: 'https://membership-site-nextralabos.vercel.app' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ],
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex p-3 bg-emerald-500/10 rounded-2xl mb-4">
            <Sprout className="w-12 h-12 text-emerald-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">AIスマートガーデニング</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            「もう、植物を枯らさない。」<br />
            写真と天気予報から、AIがあなたの代わりに最適なケアを提案します。
          </p>
          <div className="pt-8">
            <Link href="/products/smart-gardening/app">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 h-12 px-10 text-xl font-bold rounded-2xl shadow-lg">
                <Rocket className="mr-2" /> ツールを使う
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {features.map((f, i) => (
            <Card key={i} className="bg-[#0d1117] border-white/10 border-2">
              <CardContent className="p-8 text-center space-y-4">
                <div className="mx-auto w-12 h-12 flex items-center justify-center bg-emerald-500/10 rounded-xl mb-4">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-white">{f.title}</h3>
                <p className="text-slate-400">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-900/20 border-2 border-emerald-500/30 rounded-3xl p-10 mb-20">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold text-white">NextraLabsのAI技術を統合</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mt-1" />
                  <p className="text-slate-300">Gemini 1.5 Proによる高度な画像解析エンジン</p>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mt-1" />
                  <p className="text-slate-300">リアルタイム天気RSSとのデータ連動</p>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mt-1" />
                  <p className="text-slate-300">AI Credit Guardianによる効率的な運用</p>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-80 aspect-square bg-[#050507] rounded-2xl border border-white/10 flex items-center justify-center p-8">
               <Droplets className="w-32 h-32 text-emerald-500/20 animate-pulse" />
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="py-16 border-t border-white/5">
          <h2 className="text-center text-sm font-bold text-emerald-500 uppercase tracking-[0.4em] mb-4">FAQ</h2>
          <h3 className="text-center text-2xl md:text-3xl font-bold text-white mb-12 uppercase">よくある質問</h3>
          <dl className="space-y-6">
            {faqItems.map((item, i) => (
              <div key={i} className="bg-[#0d1117] rounded-2xl p-6 border border-white/5">
                <dt className="text-white font-bold mb-3 text-sm leading-relaxed">Q. {item.q}</dt>
                <dd className="text-slate-400 text-sm leading-relaxed">A. {item.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* CTA */}
        <div className="text-center py-12">
          <h3 className="text-2xl font-bold text-white mb-6 uppercase">植物と、もっとうまくやっていこう。</h3>
          <Link href="/products/smart-gardening/app">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 h-12 px-12 text-lg font-bold rounded-2xl shadow-xl">
              今すぐ無料で試す
            </Button>
          </Link>
          <p className="mt-4 text-xs font-bold text-emerald-500 uppercase tracking-tight">Standard Plan ¥980/月</p>
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
              { name: '牧野 佳代子', role: '主婦・50代', location: '神奈川県', text: 'ベランダでトマトを育てたいけど毎年枯らしていました。育てたい野菜と環境を入力したら土の配合から水やりのタイミングまで細かく教えてくれました。今年初めてトマトが鈴なりになって感動しています。', tag: 'ベランダ菜園' },
              { name: '杉田 龍一', role: '定年退職・60代', location: '埼玉県', text: '庭いじりを趣味にしようと思い立ち始めました。季節ごとの作業スケジュールをAIが提案してくれるので、何をすればいいか迷うことがなくなりました。近所の方に庭を褒めてもらえるようになりました。', tag: '庭園ガーデニング' },
              { name: '宮本 洋子', role: 'マンション住まい・30代', location: '大阪府', text: '観葉植物を何度も枯らして諦めかけていました。葉っぱの状態を説明したら病気か水不足かをすぐ診断してくれました。今は10種類以上の植物を元気に育てられています。', tag: '室内植物' },
              { name: '大塚 俊明', role: '小学校教師', location: '愛知県', text: '学校菜園の管理を担当していて、子どもたちと野菜を育てています。授業に合わせた栽培スケジュールを出してくれるので、収穫のタイミングが授業に合って子どもたちの喜びが倍増しました。', tag: '学校菜園' },
              { name: '矢野 真理', role: 'カフェオーナー', location: '京都府', text: '店舗のガーデニングをDIYでやっています。客層に合うハーブガーデンのレイアウトを提案してもらい、フォトスポットになってInstagramで拡散されました。集客にもつながってびっくりしました。', tag: '店舗ガーデニング' },
              { name: '福田 哲郎', role: '農業初心者・40代', location: '北海道', text: '週末農業を始めましたが知識ゼロでした。地域の気候データを踏まえた作付け計画を立ててくれるので、北海道の短い夏でも効率よく野菜を収穫できています。都市農業の入門書代わりになっています。', tag: '週末農業' },
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
  );
}
