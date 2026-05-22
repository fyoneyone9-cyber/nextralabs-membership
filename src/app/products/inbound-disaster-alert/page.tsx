import { Metadata } from 'next'
import React from 'react'
import dynamic from 'next/dynamic'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Bell, Globe, MapPin, MessageSquare, Shield, Zap, AlertTriangle, Languages } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'インバウンド向け 災害AI多言語避難誘導システム | 気象庁アラート × 10言語自動翻訳 × Googleマップ | NextraLabs',
  description: '気象庁アラートを検知し、10言語に自動翻訳してGoogleマップルート付きで全ゲストへ一斉送信。ホテル・宿泊施設向けインバウンド防災AIシステム。月額¥980。',
  keywords: ['インバウンド防災','多言語避難誘導','ホテル防災AI','気象庁アラート','10言語翻訳','外国人観光客防災','宿泊施設防災','避難誘導AI','NextraLabs防災'],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: {
    canonical: 'https://nextralab.jp/products/inbound-disaster-alert',
  },
  openGraph: {
    title: 'インバウンド向け 災害AI多言語避難誘導システム | NextraLabs',
    description: '気象庁アラートを検知し、10言語に自動翻訳してGoogleマップルート付きで全ゲストへ一斉送信。ホテル・宿泊施設向けインバウンド防災AIシステム。',
    url: 'https://nextralab.jp/products/inbound-disaster-alert',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: 'https://nextralab.jp/og-image.png', width: 1200, height: 630, alt: 'インバウンド向け 災害AI多言語避難誘導システム | NextraLabs' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'インバウンド向け 災害AI多言語避難誘導システム | NextraLabs',
    description: '気象庁アラートを検知し、10言語に自動翻訳してGoogleマップルート付きで全ゲストへ一斉送信。',
    images: ['https://nextralab.jp/og-image.png'],
  },
}

const InboundDisasterAlertContent = () => {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32">
      {/* ヒーローセクション */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center space-y-10">
        <Badge className="bg-sky-500/10 text-sky-400 border-sky-500/20 px-6 py-1 rounded-full font-bold uppercase text-xs tracking-tight">
          🏨 NEW — ホテル・宿泊施設向け
        </Badge>
        <h1 className="text-4xl md:text-7xl font-bold text-white tracking-tighter leading-[1.1]">
          インバウンド向け<br />
          <span className="text-sky-500">災害AI多言語</span><br />
          避難誘導システム
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          気象庁アラート検知 → 10言語自動翻訳 →<br className="hidden md:block" />
          Googleマップルート付きで全ゲストへ一斉送信
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link href="/signup">
            <button className="h-16 px-10 bg-sky-600 hover:bg-sky-500 text-white font-bold text-lg rounded-2xl shadow-[0_20px_50px_rgba(14,165,233,0.3)] transition-all active:scale-95">
              無料で試してみる →
            </button>
          </Link>
          <Link href="/pricing">
            <button className="h-16 px-10 bg-white/5 hover:bg-white/10 text-white font-bold text-lg rounded-2xl border border-white/10 transition-all active:scale-95">
              料金プランを見る
            </button>
          </Link>
        </div>
      </section>

      {/* 課題訴求セクション */}
      <section className="bg-[#13141f] py-24 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-white tracking-tight">
              外国人ゲストの<br />緊急対応、できていますか？
            </h3>
            <ul className="space-y-4 text-slate-400 font-bold">
              <li className="flex items-center gap-4">
                <AlertTriangle className="text-red-500 shrink-0" />
                言葉の壁で避難指示が伝わらない
              </li>
              <li className="flex items-center gap-4">
                <AlertTriangle className="text-red-500 shrink-0" />
                深夜の地震・豪雨でスタッフが対応できない
              </li>
              <li className="flex items-center gap-4">
                <AlertTriangle className="text-red-500 shrink-0" />
                避難経路を英語で説明する余裕がない
              </li>
              <li className="flex items-center gap-4">
                <AlertTriangle className="text-red-500 shrink-0" />
                気象庁の緊急アラートをリアルタイムで把握できない
              </li>
            </ul>
          </div>
          <div className="bg-black/50 border-4 border-sky-500/20 rounded-[3rem] p-10 shadow-inner text-center">
            <Bell className="w-16 h-16 text-sky-400 mx-auto mb-6" />
            <p className="text-sky-400 text-lg font-bold leading-loose">
              気象庁アラートを即検知。<br />
              AIが10言語に翻訳して<br />
              全ゲストへ自動送信。<br />
              スタッフ不要で命を守る。
            </p>
          </div>
        </div>
      </section>

      {/* 機能紹介セクション */}
      <section className="max-w-6xl mx-auto px-4 py-32 space-y-20">
        <div className="text-center space-y-4">
          <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tighter">4つの核心機能</h3>
          <p className="text-slate-500 font-bold uppercase text-sm">外国人ゲストの命を守るテクノロジー</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-sky-500/30 transition-all group">
            <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform">
              <Bell size={24} />
            </div>
            <h4 className="text-xl font-bold text-white">気象庁アラート自動検知</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              気象庁が発令する緊急地震速報・大雨特別警報・津波警報などを24時間リアルタイムで監視。発令と同時に自動処理が起動します。
            </p>
          </div>

          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-sky-500/30 transition-all group">
            <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform">
              <Languages size={24} />
            </div>
            <h4 className="text-xl font-bold text-white">10言語AI自動翻訳</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              英語・中国語（簡/繁）・韓国語・タイ語・フランス語・スペイン語・ドイツ語・アラビア語・ポルトガル語に対応。AIが緊急メッセージを自然な表現に翻訳します。
            </p>
          </div>

          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-sky-500/30 transition-all group">
            <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform">
              <MapPin size={24} />
            </div>
            <h4 className="text-xl font-bold text-white">Googleマップルート付き一斉送信</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              施設から最寄り避難所までのGoogleマップリンクを自動生成してメッセージに添付。ゲストがボタン一つで避難経路を確認できます。
            </p>
          </div>

          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-sky-500/30 transition-all group">
            <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform">
              <MessageSquare size={24} />
            </div>
            <h4 className="text-xl font-bold text-white">全ゲスト一斉通知</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              チェックイン時に登録した連絡先（SMS/メール/LINE）へ一斉送信。スタッフの手を借りずに全室・全ゲストへ即座に届きます。
            </p>
          </div>
        </div>
      </section>

      {/* 対応言語セクション */}
      <section className="bg-[#13141f] py-20 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-10">
          <h3 className="text-3xl font-bold text-white">対応10言語</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { lang: '英語', flag: '🇺🇸' },
              { lang: '中国語（簡体）', flag: '🇨🇳' },
              { lang: '中国語（繁体）', flag: '🇹🇼' },
              { lang: '韓国語', flag: '🇰🇷' },
              { lang: 'タイ語', flag: '🇹🇭' },
              { lang: 'フランス語', flag: '🇫🇷' },
              { lang: 'スペイン語', flag: '🇪🇸' },
              { lang: 'ドイツ語', flag: '🇩🇪' },
              { lang: 'アラビア語', flag: '🇸🇦' },
              { lang: 'ポルトガル語', flag: '🇧🇷' },
            ].map((item, i) => (
              <div key={i} className="bg-sky-500/10 border border-sky-500/20 rounded-2xl px-6 py-3 flex items-center gap-3">
                <span className="text-2xl">{item.flag}</span>
                <span className="text-white font-semibold text-sm">{item.lang}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="max-w-5xl mx-auto px-4 pt-20 text-center">
        <Card className="bg-gradient-to-br from-sky-600 to-blue-900 border-0 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden space-y-10">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
            <Globe size={300} className="text-white" />
          </div>
          <div className="relative z-10 space-y-6">
            <h3 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
              言語の壁を越えて、<br />命を守る。
            </h3>
            <p className="text-sky-100 text-lg font-bold leading-relaxed max-w-2xl mx-auto">
              インバウンド対応の防災インフラを、今すぐ導入しましょう。
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-6">
              <Link href="/signup">
                <button className="h-20 px-16 bg-white text-sky-700 font-bold text-2xl rounded-2xl shadow-xl hover:bg-sky-50 transition-all active:scale-95">
                  無料で始める →
                </button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(InboundDisasterAlertContent), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507]" />
})

export default function InboundDisasterAlertLp() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'インバウンド向け 災害AI多言語避難誘導システム',
    description: '気象庁アラートを検知し、10言語に自動翻訳してGoogleマップルート付きで全ゲストへ一斉送信。ホテル・宿泊施設向けインバウンド防災AIシステム。',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: 'https://nextralab.jp/products/inbound-disaster-alert',
    offers: { '@type': 'Offer', price: '980', priceCurrency: 'JPY' },
    publisher: { '@type': 'Organization', name: 'NextraLabs' },
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <NoSSRWrapper />

      {/* FAQセクション */}
      <section className="py-16 bg-[#0d1117]">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">よくある質問</h2>
          <div className="space-y-6">
            <div>
              <p className="font-semibold text-white mb-2">Q. 導入にはどのくらい時間がかかりますか？</p>
              <p className="text-slate-400 text-sm">A. 施設情報（住所・避難所・連絡先リスト）を登録するだけで最短15分で稼働します。専門的なIT知識は不要です。</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Q. 何人分のゲストまで対応できますか？</p>
              <p className="text-slate-400 text-sm">A. 基本プランで最大200名分の連絡先登録が可能です。大規模施設向けのエンタープライズプランもございます。</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Q. 気象庁のアラートはどの種類に対応していますか？</p>
              <p className="text-slate-400 text-sm">A. 緊急地震速報・大雨特別警報・津波警報・暴風警報・大雪警報など主要な気象警報・特別警報に対応しています。</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Q. ゲストへの通知方法を選べますか？</p>
              <p className="text-slate-400 text-sm">A. SMS・メール・LINEの3種類に対応しています。チェックイン時にゲストが希望する方法を選択できます。</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Q. 翻訳の精度はどの程度ですか？</p>
              <p className="text-slate-400 text-sm">A. 緊急時に必要な避難指示・安全確認などのメッセージに特化した翻訳テンプレートを使用しているため、一般的な機械翻訳より高い精度を実現しています。</p>
            </div>
          </div>
        </div>
      </section>

      {/* 口コミセクション */}
      <section className="bg-[#0d1117] py-20 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-4 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
              導入施設の<span className="text-emerald-400">リアルな声</span>
            </h2>
            <p className="text-slate-400 text-sm">実際に導入した施設の感想</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: '田中 浩一', role: 'フロントマネージャー', location: '京都府・旅館', text: '昨年の台風の際、深夜に外国人ゲストへの連絡で混乱しましたが、このシステム導入後は翌朝には全員に多言語で通知が届いており、スタッフの負担が激減しました。', tag: '旅館・和風施設' },
              { name: '鈴木 恵子', role: '総支配人', location: '大阪府・ホテル', text: '訪日外国人が全体の70%を占める当ホテルでは、緊急時対応が長年の課題でした。10言語対応で一斉送信できるのは画期的で、ゲストの安心感が明らかに向上しました。', tag: 'シティホテル' },
              { name: '渡辺 誠二', role: 'オーナー', location: '沖縄県・民宿', text: '小規模施設なのでスタッフが少なく、緊急時の多言語対応は不可能と思っていました。このシステムのおかげで台風シーズンも安心して運営できています。', tag: '民宿・ゲストハウス' },
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
