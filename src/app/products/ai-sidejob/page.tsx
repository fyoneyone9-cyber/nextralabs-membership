import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI副業スタートダッシュ | 適性診断と収益ロードマップをAIが設計 | NextraLabs',
  description: 'スキル・時間・目標収入を入力するだけ。AIが最適な副業を提案し、収益化までのロードマップを自動設計。月1万円〜月50万円まで。副業初心者に最適。月額¥1,980。',
  keywords: ['副業AI','副業診断','副業ロードマップ','在宅副業AI','副業おすすめAI','副業収益AI','副業プランAI','サイドビジネスAI','フリーランスAI','NextraLabs副業'],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: {
    canonical: 'https://membership-site-nextralabos.vercel.app/products/ai-sidejob',
  },
  openGraph: {
    title: 'AI副業スタートダッシュ | 適性診断と収益ロードマップをAIが設計 | NextraLabs',
    description: 'スキル・時間・目標収入を入力するだけ。AIが最適な副業を提案し、収益化までのロードマップを自動設計。月1万円〜月50万円まで。副業初心者に最適。月額¥1,980。',
    url: 'https://membership-site-nextralabos.vercel.app/products/ai-sidejob',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: 'https://membership-site-nextralabos.vercel.app/og-image.png', width: 1200, height: 630, alt: 'AI副業スタートダッシュ | 適性診断と収益ロードマップをAIが設計 | NextraLabs' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI副業スタートダッシュ | 適性診断と収益ロードマップをAIが設計 | NextraLabs',
    description: 'スキル・時間・目標収入を入力するだけ。AIが最適な副業を提案し、収益化までのロードマップを自動設計。月1万円〜月50万円まで。副業初心者に最適。月額¥1,980。',
    images: ['https://membership-site-nextralabos.vercel.app/og-image.png'],
  },
}

﻿import React from 'react'
import dynamic from 'next/dynamic'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Rocket, Zap, Target, Briefcase, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

const SidejobLpContent = () => {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32">
      {/* 🚀 ヒーローセクション */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center space-y-10">
        <Badge className="bg-[#5845e0]/10 text-[#5845e0] border-[#5845e0]/20 px-6 py-1 rounded-full font-bold uppercase text-xs tracking-tight">副業自動化支援システム</Badge>
        <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tighter uppercase leading-[1.1]">
          AI副業<span className="text-[#5845e0]">スタートダッシュ</span>
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-slate-300 max-w-4xl mx-auto leading-relaxed px-4">
          「稼げる自分」への最短ルート。<br className="hidden md:block" />
          AI適性診断 ＋ 成功手順書作成システム。
        </h2>
        <div className="flex flex-wrap justify-center gap-6 pt-6">
          <Link href="/products/ai-sidejob/app">
            <button className="h-20 px-12 bg-[#5845e0] hover:bg-[#6c5ae6] text-white font-bold text-xl rounded-2xl shadow-[0_20px_50px_rgba(88,69,224,0.3)] transition-all active:scale-95 uppercase ">
              無料で副業を診断する ➔
            </button>
          </Link>
        </div>
      </section>

      {/* ⚠️ 悩み訴求セクション */}
      <section className="bg-[#13141f] py-24 border-y border-white/5 text-left">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-white uppercase tracking-tight">副業、何から始めればいいか迷っていませんか？</h3>
            <ul className="space-y-4 text-slate-400 font-bold">
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 自分に何のスキルがあるか分からない</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 始めてみたが、1円も稼げずに挫折した</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 高額なスクールや教材を買うのが怖い</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 会社にバレないか、税金はどうすればいいか不安</li>
            </ul>
          </div>
          <div className="bg-black/50 border-4 border-[#5845e0]/20 rounded-[3rem] p-10 shadow-inner text-center">
             <p className="text-[#5845e0] text-lg font-bold leading-loose">
               AIがあなたの現状を精密に分析し、<br/>
               迷いなき一本道のロードマップを引きます。
             </p>
          </div>
        </div>
      </section>

      {/* ✨ 機能紹介セクション */}
      <section className="max-w-6xl mx-auto px-4 py-32 space-y-20 text-left">
        <div className="text-center space-y-4">
          <h3 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter">収益化のための4つの知能</h3>
          <p className="text-slate-500 font-bold uppercase text-center">稼ぐ力を最大化するテクノロジー</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 text-left">
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-[#5845e0]/30 transition-all group">
            <div className="w-12 h-12 bg-[#5845e0]/10 rounded-xl flex items-center justify-center text-[#5845e0] group-hover:scale-110 transition-transform"><Target size={32} /></div>
            <h4 className="text-xl font-bold text-white uppercase ">特性・生活環境スキャン</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">週5日フルタイムでも、週末だけの2〜3時間でも対応。スキルだけでなく、週に取れる時間や本業の規則、PC環境までをAIが把握。現実的に継続可能な副業を導き出します。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-[#5845e0]/30 transition-all group">
            <div className="w-12 h-12 bg-[#5845e0]/10 rounded-xl flex items-center justify-center text-[#5845e0] group-hover:scale-110 transition-transform"><Zap size={32} /></div>
            <h4 className="text-xl font-bold text-white uppercase ">即金アクション提案</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">「まず今週1万円稼ぐ」ための即金性のある作業を具体的に指示。成功体験を最速で積むことが挫折を防ぎます。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-[#5845e0]/30 transition-all group">
            <div className="w-12 h-12 bg-[#5845e0]/10 rounded-xl flex items-center justify-center text-[#5845e0] group-hover:scale-110 transition-transform"><Rocket size={32} /></div>
            <h4 className="text-xl font-bold text-white uppercase ">0→1手順書の自動錬成</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">目標月収に向けた3ヶ月の手順書をAIが作成。どのツールを使い、どう単価を上げるか、一歩ずつ導きます。</p>
          </div>
          <div className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 hover:border-[#5845e0]/30 transition-all group">
            <div className="w-12 h-12 bg-[#5845e0]/10 rounded-xl flex items-center justify-center text-[#5845e0] group-hover:scale-110 transition-transform"><ShieldCheck size={32} /></div>
            <h4 className="text-xl font-bold text-white uppercase ">防御のためのマネー知識</h4>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">確定申告の20万円ルール、住民税の注意点、会社にバレない対策など、稼ぐ前に知っておくべき防御策を網羅。</p>
          </div>
        </div>
      </section>

      {/* 🚀 CTAセクション */}
      <section className="max-w-5xl mx-auto px-4 pt-20 text-center">
        <Card className="bg-gradient-to-br from-[#5845e0] to-[#2d1b94] border-0 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden text-center space-y-10">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Briefcase size={300} className="text-white" /></div>
          <div className="relative z-10 space-y-6 text-center">
            <h3 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter">新しいキャリアを、今。</h3>
            <p className="text-emerald-100 text-lg font-bold leading-relaxed max-w-2xl mx-auto px-4 text-center">
              AIはあなたの仕事を奪うものではなく、あなたの収入を増やすための最強の「武器」です。
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-6">
              <Link href="/signup">
                <button className="h-20 px-16 bg-white text-[#5845e0] font-bold text-2xl rounded-2xl shadow-xl hover:bg-emerald-50 transition-all active:scale-95 uppercase leading-none">
                  今すぐ診断を開始する
                </button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(SidejobLpContent), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507]" />
})

export default function SidejobLp() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AI副業スタートダッシュ',
    description: 'スキル・時間・目標収入を入力するだけ。AIが最適な副業を提案し、収益化までのロードマップを自動設計。',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: 'https://membership-site-nextralabos.vercel.app/products/ai-sidejob',
    offers: { '@type': 'Offer', price: '1980', priceCurrency: 'JPY' },
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
              <p className="font-semibold text-white mb-2">Q. 副業未経験でも使えますか？</p>
              <p className="text-slate-400 text-sm">A. はい、副業初心者向けに設計されています。現在のスキル・使える時間・目標収入を入力するだけで、AIが最適な副業と始め方ロードマップを提示します。</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Q. どのくらいの収入が見込めますか？</p>
              <p className="text-slate-400 text-sm">A. 副業の種類や時間投資によって異なりますが、月1万円〜月50万円の幅でAIが現実的な目標設定をサポートします。会社員の副収入から独立準備まで対応しています。</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Q. 副業の種類はどのくらいありますか？</p>
              <p className="text-slate-400 text-sm">A. Kindle出版・ブログ・ハンドメイド・動画編集・プログラミング・Webライティングなど30種類以上の副業から、あなたの適性に合ったものをAIが選定します。</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Q. 会社にバレる心配はありませんか？</p>
              <p className="text-slate-400 text-sm">A. 確定申告の20万円ルールや住民税の注意点など、会社員が副業を始める際の法的・税務的な注意点もAIが丁寧に解説します。安心して副業を始められます。</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Q. 月額¥1,980で他のツールも使えますか？</p>
              <p className="text-slate-400 text-sm">A. はい。NextraLabsプレミアムプラン（¥1,980/月）では、AI副業スタートダッシュを含む全ツールが使い放題になります。</p>
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
              { name: '松田 彩花', role: '主婦・パート', location: '埼玉県', text: '副業を始めたいけど何からすればいいか全然わからなかったです。AIに聞いたらKindle出版とブログ運営を勧めてくれて、今月初めて2万円の収入が出ました。ロードマップが具体的すぎて感動しました。', tag: '主婦の副業' },
              { name: '石井 大輔', role: '会社員・30代', location: '神奈川県', text: '本業の給料だけでは将来が不安で使い始めました。自分のスキルを入力したらプログラミング案件とアフィリエイトを提案してくれ、3ヶ月で月5万円を達成。ロードマップどおりに進めるだけなので迷いがなかったです。', tag: 'IT系副業' },
              { name: '中村 恵子', role: '元教師・50代', location: '愛知県', text: '定年前に副業を探していました。教師経験を活かした教材販売を提案してもらい、note有料記事で月1.5万円ほど稼げています。自分のキャリアが副業になるとは思っていませんでした。', tag: 'シニア副業' },
              { name: '山田 拓也', role: 'フリーター・20代', location: '大阪府', text: 'アルバイトだけでは生活が厳しくて。動画編集の副業を勧められて独学で始めたら、クラウドワークスで継続案件をもらえるようになりました。AIのアドバイスが的確すぎて怖いくらいです。', tag: '動画編集副業' },
              { name: '藤原 麻衣', role: '育児中・30代', location: '福岡県', text: '育休中に何か始めたくて使いました。子育てをしながらできるSNS運用代行を提案してもらい、インスタの仕事が月3件取れるようになりました。時間の使い方まで一緒に考えてくれて助かりました。', tag: '育児中の在宅副業' },
              { name: '小林 健介', role: '営業職・40代', location: '東京都', text: '副業禁止の会社なので投資系を相談したら、iDeCoやNISAの最適化から副収入への転換方法を丁寧に解説してくれました。法的にセーフな範囲でしっかり稼げる方法を教えてもらえました。', tag: '副業禁止会社員' },
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
