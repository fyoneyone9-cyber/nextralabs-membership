import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI防災パーソナルガイド | 避難ルート・備蓄最適化・家族の安全をAIが守る | NextraLabs',
  description: '住所と家族構成を入力するだけ。AIがハザードマップ解析・最適避難ルート・家族構成に合わせた備蓄リスト・緊急連絡プランを自動生成。防災準備の決定版。月額¥980。',
  keywords: ['防災AIアプリ','避難ルートAI','備蓄リストAI','防災準備AI','ハザードマップ','家族防災AI','地震対策AI','防災計画AI','緊急連絡AI','NextraLabs防災'],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: {
    canonical: 'https://membership-site-nextralabos.vercel.app/products/disaster-guard',
  },
  openGraph: {
    title: 'AI防災パーソナルガイド | 避難ルート・備蓄最適化・家族の安全をAIが守る | NextraLabs',
    description: '住所と家族構成を入力するだけ。AIがハザードマップ解析・最適避難ルート・家族構成に合わせた備蓄リスト・緊急連絡プランを自動生成。防災準備の決定版。月額¥980。',
    url: 'https://membership-site-nextralabos.vercel.app/products/disaster-guard',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: 'https://membership-site-nextralabos.vercel.app/og-image.png', width: 1200, height: 630, alt: 'AI防災パーソナルガイド | 避難ルート・備蓄最適化・家族の安全をAIが守る | NextraLabs' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI防災パーソナルガイド | 避難ルート・備蓄最適化・家族の安全をAIが守る | NextraLabs',
    description: '住所と家族構成を入力するだけ。AIがハザードマップ解析・最適避難ルート・家族構成に合わせた備蓄リスト・緊急連絡プランを自動生成。防災準備の決定版。月額¥980。',
    images: ['https://membership-site-nextralabos.vercel.app/og-image.png'],
  },
}

﻿import React from 'react'
import dynamic from 'next/dynamic'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Shield, Zap, MapPin, Navigation, ArrowRight, AlertTriangle, CloudRain, Wind } from 'lucide-react'
import Link from 'next/link'

const DisasterLpContent = () => {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32">
      {/* 🚀 ヒーローセクション */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center space-y-10 text-left">
        <Badge className="bg-sky-500/10 text-sky-400 border-sky-500/20 px-6 py-1 rounded-full font-bold uppercase text-xs tracking-tight">次世代型 防災インテリジェンス</Badge>
        <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tighter uppercase leading-[1.1]">
          AI防災<span className="text-sky-500">パーソナルガイド</span>
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-slate-300 max-w-4xl mx-auto leading-relaxed px-4 text-center">
          「今、ここで」生き残るために。<br className="hidden md:block" />
          リアルタイムGPS ＋ 3・3・3の法則。
        </h2>
        <div className="flex flex-wrap justify-center gap-6 pt-6 text-center">
          <Link href="/products/disaster-guard/app">
            <button className="h-20 px-12 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xl rounded-2xl shadow-[0_20px_50px_rgba(14,165,233,0.3)] transition-all active:scale-95 uppercase leading-none">
              生存戦略を立案する ➔
            </button>
          </Link>
        </div>
      </section>

      {/* ⚠️ 悩み訴求セクション */}
      <section className="bg-[#13141f] py-24 border-y border-white/5 text-left text-left">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-white uppercase tracking-tight">災害への備え、不安はありませんか？</h3>
            <ul className="space-y-4 text-slate-400 font-bold">
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 防災本を読んでも、自分の家での動きが分からない</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 避難所まで本当に行けるのか判断がつかない</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 今の天気（気温・風速）が避難に与える影響</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 備蓄品が本当に今の自分に足りているか不明</li>
            </ul>
          </div>
          <div className="bg-black/50 border-4 border-sky-500/20 rounded-[3rem] p-10 shadow-inner text-center">
             <p className="text-sky-400 text-lg font-bold leading-loose text-center">
               AIが公的基準とリアルタイムデータを融合。<br/>
               あなた専用の「命の指示書」を作成します。
             </p>
          </div>
        </div>
      </section>

      {/* ✨ 機能紹介セクション */}
      <section className="max-w-6xl mx-auto px-4 py-32 space-y-20 text-left">
        <div className="text-center space-y-4">
          <h3 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter text-center">生死を分ける4つの技術</h3>
          <p className="text-slate-500 font-bold uppercase text-center">命を守るためのテクノロジー</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 text-left">
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-sky-500/30 transition-all group">
            <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0"><MapPin size={24} /></div>
            <h4 className="text-xl font-bold text-white uppercase ">GPS・気象リアルタイム連動</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">現在地の座標と天気を自動取得。気温が低ければ防寒、風が強ければ飛散物注意など、状況に応じた指示を出します。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-sky-500/30 transition-all group">
            <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0"><Zap size={24} /></div>
            <h4 className="text-xl font-bold text-white uppercase ">3・3・3の法則ロジック</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">「3分(呼吸)・3時間(体温)・3日(水)」の法則に基づき、AIが優先順位を判定。命を守るために真っ先にすべきことを提示します。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-sky-500/30 transition-all group">
            <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0"><Navigation size={24} /></div>
            <h4 className="text-xl font-bold text-white uppercase ">詳細環境プロファイリング</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">都道府県、市区町村、住居形態を分離入力。あなたの住まいのリスクをピンポイントで分析します。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-sky-500/30 transition-all group">
            <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform text-center mx-auto md:mx-0"><Shield size={24} /></div>
            <h4 className="text-xl font-bold text-white uppercase ">公的機関推奨メソッド</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">内閣府や首相官邸が推奨する防災基準をAIが学習。自治体発行のガイドブックに準拠した、信頼性の高い戦略を立案します。</p>
          </div>
        </div>
      </section>

      {/* 🚀 CTAセクション */}
      <section className="max-w-5xl mx-auto px-4 pt-20 text-center">
        <Card className="bg-gradient-to-br from-sky-600 to-blue-900 border-0 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden text-center space-y-10">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Shield size={300} className="text-white" /></div>
          <div className="relative z-10 space-y-6 text-center">
            <h3 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter">大切な人を、守り抜く盾を。</h3>
            <p className="text-sky-100 text-lg font-bold leading-relaxed max-w-2xl mx-auto px-4 text-center">
              最悪の事態を想定し、最高の準備を。Nextra AIがあなたの家族を守るための盾になります。
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-6">
              <Link href="/signup">
                <button className="h-20 px-16 bg-white text-sky-700 font-bold text-2xl rounded-2xl shadow-xl hover:bg-sky-50 transition-all active:scale-95 uppercase leading-none">
                  今すぐ立案を開始する
                </button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(DisasterLpContent), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507]" />
})

export default function DisasterGuardLp() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AI防災パーソナルガイド',
    description: '住所と家族構成を入力するだけ。AIがハザードマップ解析・最適避難ルート・備蓄リスト・緊急連絡プランを自動生成。',
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Web',
    url: 'https://membership-site-nextralabos.vercel.app/products/disaster-guard',
    offers: { '@type': 'Offer', price: '980', priceCurrency: 'JPY' },
    publisher: { '@type': 'Organization', name: 'NextraLabs' },
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <NoSSRWrapper />
      <section className="py-16 bg-[#0d1117]">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">よくある質問</h2>
          <div className="space-y-6">
            <div>
              <p className="font-semibold text-white mb-2">Q. 住所を入力することに不安があります。個人情報は安全ですか？</p>
              <p className="text-slate-400 text-sm">A. 入力した住所情報は防災診断にのみ使用され、サーバーに保存されることはありません。ブラウザ内で処理が完結するため、プライバシーは完全に保護されます。</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Q. 子どもやお年寄りがいる家族向けの備蓄リストも作れますか？</p>
              <p className="text-slate-400 text-sm">A. はい。家族構成（乳幼児・高齢者・ペットなど）を入力すると、それぞれに必要な備蓄品・医薬品・特別な対応が含まれた専用リストをAIが自動生成します。</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Q. ハザードマップの解析とはどういうものですか？</p>
              <p className="text-slate-400 text-sm">A. 国土交通省が公開するハザードマップデータをもとに、お住まいの地域の洪水・土砂災害・地震・津波リスクをAIが解析し、5段階の危険度スコアで表示します。</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Q. 避難ルートはどうやって提示されますか？</p>
              <p className="text-slate-400 text-sm">A. 最寄りの避難所までの複数ルートと、危険エリアを回避した最適経路をAIが提案します。徒歩・自転車・車など移動手段別の所要時間も確認できます。</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Q. 緊急連絡プランとは何ですか？</p>
              <p className="text-slate-400 text-sm">A. 災害発生時に家族が離れた場所にいても連絡を取り合えるよう、集合場所・連絡方法・緊急連絡先をまとめた家族専用の緊急連絡カードをAIが作成します。</p>
            </div>
          </div>
        </div>
      </section>

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
              { name: '鈴木 修二', role: '会社員・50代', location: '静岡県', text: '東海地震が心配で備蓄を始めたいと思いつつ何から手をつければいいか分からなかったです。家族構成を入力したら優先順位つきのリストが出てきて、半年で必要なものが全部揃いました。', tag: '防災備蓄' },
              { name: '橋本 由美', role: '一人暮らし・30代', location: '東京都', text: '一人暮らしで被災したら誰も助けてくれないと不安でした。避難ルートのシミュレーションと近隣の避難所情報を整理してくれて、いざという時の行動イメージが持てるようになりました。', tag: '単身女性の防災' },
              { name: '渡辺 孝之', role: '自治会長', location: '神奈川県', text: '地区の防災訓練の内容を考えるのに活用しています。AIが地域特性に合わせた訓練シナリオを提案してくれるので、毎年マンネリ化していた訓練が刷新できました。参加者からも好評です。', tag: '地域防災' },
              { name: '吉田 里奈', role: '子育て中・30代', location: '大阪府', text: '子どもがいると避難も大変。乳幼児連れの避難グッズリストと行動手順を出してくれて、普段からシミュレーションできるようになりました。子どもにも分かりやすく説明する言葉まで教えてくれました。', tag: 'ファミリー防災' },
              { name: '阿部 義雄', role: '定年退職・60代', location: '宮城県', text: '東日本大震災を経験したので防災意識は高いつもりでしたが、最新の情報やツールはよく知りませんでした。最新の防災グッズと備蓄の目安を教えてもらい、アップデートできました。', tag: '震災経験者' },
              { name: '長谷川 智子', role: '介護士・40代', location: '福岡県', text: '高齢者施設での避難計画に活用しています。要介護者の移送ルートや必要な医療物資のリストを細かく提案してくれて、施設の防災マニュアル更新にとても役立ちました。', tag: '介護施設防災' },
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
    </>
  )
}
