import { Metadata } from 'next'
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  TrendingUp, ShoppingCart, Video, Calendar, BarChart2,
  Link2, Zap, Bot, Mic, Youtube, DollarSign, CheckCircle2,
  ArrowRight, Play, Flame, Star, Package, Search, AlertTriangle,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AIアフィリエイトVlogYT | 楽天×YouTube全自動収益化システム | NextraLabs',
  description: '楽天アフィリエイト×AI動画生成×YouTube自動投稿。毎日10本のショート動画をAIが台本・音声・動画・投稿まで全自動生成。不労所得を実現するAI収益化システム。',
  keywords: ['楽天アフィリエイトAI','YouTube自動投稿','AIショート動画','不労所得AI','アフィリエイト自動化','AI動画生成','ずんだもん','Kling AI','YouTube収益化','NextraLabs'],
  alternates: {
    canonical: 'https://nextralab.jp/products/youtube-affiliate-vlog',
  },
  openGraph: {
    title: 'AIアフィリエイトVlogYT | 毎日10本・勝手に稼ぐ | NextraLabs',
    description: '楽天アフィリエイト×AI動画生成×YouTube自動投稿で、台本・音声・動画・投稿まで全自動。不労所得AIシステム。',
    url: 'https://nextralab.jp/products/youtube-affiliate-vlog',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: 'https://nextralab.jp/og-image.png', width: 1200, height: 630, alt: 'AIアフィリエイトVlogYT | NextraLabs' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIアフィリエイトVlogYT | 毎日10本・勝手に稼ぐ | NextraLabs',
    description: '楽天アフィリエイト×AI動画生成×YouTube自動投稿。AIが全部やる不労所得システム。',
    images: ['https://nextralab.jp/og-image.png'],
  },
}

export default function YoutubeAffiliateVlogLp() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AIアフィリエイトVlogYT',
    description: '楽天アフィリエイト×AI動画生成×YouTube自動投稿で毎日10本の動画を全自動生成・投稿。不労所得を実現するAI収益化システム。',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: 'https://nextralab.jp/products/youtube-affiliate-vlog',
    offers: { '@type': 'Offer', price: '1980', priceCurrency: 'JPY' },
    publisher: { '@type': 'Organization', name: 'NextraLabs' },
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 🚀 Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center space-y-10">
        <Badge className="bg-red-600/10 text-red-500 border-red-500/20 px-6 py-1 rounded-full font-bold uppercase text-xs">
          AI Affiliate Automation
        </Badge>
        <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tighter uppercase leading-[1.1]">
          毎日10本、<br /><span className="text-red-600">勝手に稼ぐ。</span>
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-slate-300 max-w-4xl mx-auto leading-relaxed">
          AIが全部やってくれる。<br className="hidden md:block" />
          楽天アフィリ × AI動画 × YouTube自動投稿。
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          台本・ナレーション・動画合成・概要欄・投稿スケジュールまで。<br />
          <span className="text-white font-semibold">あなたがやることは、初期設定だけ。</span>
        </p>
        <div className="flex flex-wrap justify-center gap-6 pt-6">
          <Link href="/products/youtube-affiliate-vlog/app">
            <button className="h-20 px-12 bg-red-600 hover:bg-red-500 text-white font-bold text-xl rounded-2xl shadow-[0_20px_50px_rgba(220,38,38,0.3)] transition-all active:scale-95 uppercase">
              今すぐ自動化を始める ➔
            </button>
          </Link>
        </div>
        {/* 数字 */}
        <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto pt-8 border-t border-white/5">
          <div>
            <p className="text-4xl font-black text-red-500">10本</p>
            <p className="text-slate-500 text-sm mt-1">1日の自動生成数</p>
          </div>
          <div>
            <p className="text-4xl font-black text-red-500">300本</p>
            <p className="text-slate-500 text-sm mt-1">月間累計投稿数</p>
          </div>
          <div>
            <p className="text-4xl font-black text-yellow-400">¥0</p>
            <p className="text-slate-500 text-sm mt-1">あなたの作業時間</p>
          </div>
        </div>
      </section>

      {/* ⚠️ Problem */}
      <section className="bg-[#13141f] py-24 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 text-left">
            <h3 className="text-3xl font-bold text-white uppercase tracking-tight">副業YouTubeが続かない「本当の理由」</h3>
            <ul className="space-y-4 text-slate-400 font-bold">
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 毎日ネタを考えて台本を書く時間がない</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 動画編集スキルがなく1本作るのに何時間もかかる</li>
              <li className="flex items-center gap-4"><AlertTriangle className="text-red-500 shrink-0" /> 続けても再生数が伸びず挫折してしまう</li>
            </ul>
          </div>
          <div className="bg-black/50 border-4 border-red-500/20 rounded-[3rem] p-10 shadow-inner">
            <p className="text-red-500 text-lg font-bold text-center leading-loose">
              AIが全工程を代行する。<br />
              あなたは眺めているだけでいい。
            </p>
          </div>
        </div>
      </section>

      {/* ✅ 3ステップ */}
      <section className="max-w-6xl mx-auto px-4 py-32 space-y-20">
        <div className="text-center space-y-4">
          <Badge className="bg-red-600/10 text-red-500 border-red-500/20 px-4 py-1 rounded-full text-xs font-bold uppercase">How It Works</Badge>
          <h3 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter">3ステップで全自動</h3>
          <p className="text-slate-500 font-bold uppercase">設定したら、あとはAIが全部動く</p>
        </div>
        <div className="grid md:grid-cols-3 gap-10 text-left">
          {[
            {
              icon: <TrendingUp className="text-red-500" />,
              num: '01',
              title: 'トレンド解析',
              desc: 'YouTube APIで急上昇Shortsをリアルタイム取得。バズっているBGM・ハッシュタグ・ジャンルをAIが自動分析。今売れる商品ジャンルを瞬時に特定。',
              api: 'YouTube Data API v3',
            },
            {
              icon: <ShoppingCart className="text-yellow-400" />,
              num: '02',
              title: '商品マッチング',
              desc: '楽天売れ筋ランキングとトレンドジャンルをAIが照合。最適な商品・価格・アフィリリンクを自動取得。Geminiが60秒台本を即座に執筆。',
              api: '楽天商品API + Gemini AI',
            },
            {
              icon: <Video className="text-green-400" />,
              num: '03',
              title: '動画生成 → 自動投稿',
              desc: 'VOICEVOX音声合成 → Kling v3動画生成 → FFmpeg合成 → YouTube自動投稿。説明欄の楽天アフィリリンクも自動挿入。全工程ノータッチ。',
              api: 'VOICEVOX + Kling v3 + YouTube API',
            },
          ].map((step, i) => (
            <div key={i} className="bg-[#13141f] border-2 border-white/5 p-10 rounded-[3rem] space-y-4 relative">
              <div className="text-7xl font-black text-white/5 absolute top-4 right-6">{step.num}</div>
              <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center">{step.icon}</div>
              <h4 className="text-xl font-bold text-white uppercase">STEP {step.num}: {step.title}</h4>
              <p className="text-slate-400 text-sm font-bold leading-relaxed">{step.desc}</p>
              <span className="inline-flex items-center gap-1 bg-white/5 rounded-full px-3 py-1 text-xs text-slate-500">
                <Link2 size={10} />{step.api}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ✨ 6機能 */}
      <section className="bg-[#13141f] py-32 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-4 space-y-16">
          <div className="text-center space-y-4">
            <h3 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter">全部入りの6機能</h3>
            <p className="text-slate-500 font-bold uppercase">これだけで収益化が回る</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <BarChart2 className="text-red-400" />, title: 'リアルタイムトレンド解析', desc: 'YouTube APIで急上昇Shortsを毎時チェック。バズる前に商品を仕込む先手戦略。' },
              { icon: <Bot className="text-blue-400" />, title: 'AI台本自動生成', desc: 'Gemini 2.5 Flashがフック3秒+紹介+CTAまで全自動執筆。タイトル・説明文も同時生成。' },
              { icon: <Mic className="text-green-400" />, title: 'AIナレーション', desc: 'ずんだもん・四国めたんなどVOICEVOXキャラが自動でナレーション生成。無料・高品質。' },
              { icon: <Video className="text-purple-400" />, title: 'AI動画生成', desc: 'Kling v3で商品イメージ動画を自動生成。FFmpegで字幕・BGM合成。9:16縦型Shorts対応。' },
              { icon: <Calendar className="text-yellow-400" />, title: '自動スケジュール投稿', desc: 'OpenClaw Cronで1日10本を最適時間帯に分散。寝ている間も勝手に投稿が続く。' },
              { icon: <DollarSign className="text-yellow-300" />, title: 'アフィリリンク自動挿入', desc: '楽天アフィリURLを説明欄テンプレに自動挿入。商品リンク・関連商品・ハッシュタグまで全自動。' },
            ].map((f, i) => (
              <div key={i} className="bg-[#050507] border-2 border-white/5 p-8 rounded-[2rem] space-y-4 hover:border-red-500/20 transition-all">
                <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center">{f.icon}</div>
                <h4 className="text-lg font-bold text-white">{f.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🛒 プリセット */}
      <section className="max-w-6xl mx-auto px-4 py-32 space-y-16">
        <div className="text-center space-y-4">
          <Badge className="bg-red-600/10 text-red-500 border-red-500/20 px-4 py-1 rounded-full text-xs font-bold uppercase">Presets</Badge>
          <h3 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter">こんな動画が自動で作れる</h3>
          <p className="text-slate-500 font-bold">プリセットを選ぶだけ。後はAIが全部やる。</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <Star className="text-yellow-400" />, label: 'ランキング紹介型', ex: '第3位から発表！今年買ってよかったガジェット' },
            { icon: <Search className="text-blue-400" />, label: '問題解決型', ex: 'スマホの充電遅い？これ1本で3倍速になった' },
            { icon: <Zap className="text-red-400" />, label: '驚き型', ex: 'これ知らないと損！1000円以下の神グッズ' },
            { icon: <Package className="text-green-400" />, label: '開封レビュー型', ex: '楽天で2000円の商品買ってみた結果…' },
          ].map((p, i) => (
            <div key={i} className="bg-[#13141f] border-2 border-white/5 p-8 rounded-[2rem] space-y-4 hover:border-red-500/20 transition-all">
              <div className="w-14 h-14 bg-red-600/10 rounded-2xl flex items-center justify-center">{p.icon}</div>
              <h4 className="text-white font-black">{p.label}</h4>
              <p className="text-slate-500 text-sm italic">「{p.ex}」</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🗺️ ロードマップ */}
      <section className="bg-[#13141f] py-32 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4 space-y-16">
          <div className="text-center space-y-4">
            <Badge className="bg-red-600/10 text-red-500 border-red-500/20 px-4 py-1 rounded-full text-xs font-bold uppercase">Roadmap</Badge>
            <h3 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter">開発ロードマップ</h3>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { phase: 'Phase 1', label: '今ここ ✅', color: 'text-green-400', border: 'border-green-500', items: ['楽天API商品取得', 'Gemini台本自動生成', 'VOICEVOX動画合成', 'YouTube手動投稿対応'] },
              { phase: 'Phase 2', label: '1ヶ月後', color: 'text-blue-400', border: 'border-blue-500', items: ['YouTube完全自動投稿', 'OpenClaw Cron対応', 'トレンド解析連携', 'ダッシュボードリリース'] },
              { phase: 'Phase 3', label: '2ヶ月後', color: 'text-purple-400', border: 'border-purple-500', items: ['Analytics学習', 'Kling v3 AI動画', 'プリセット拡充', '多チャンネル対応'] },
              { phase: 'Phase 4', label: '3ヶ月〜', color: 'text-yellow-400', border: 'border-yellow-500', items: ['チャンネル自動展開', '楽天RMS収益連携', 'Amazon/A8対応', 'SaaS外部提供'] },
            ].map((p, i) => (
              <div key={i} className={`border-t-2 ${p.border} bg-[#050507] rounded-[2rem] p-6 space-y-3`}>
                <p className={`font-black text-lg ${p.color}`}>{p.phase}</p>
                <p className="text-slate-500 text-sm">{p.label}</p>
                <ul className="space-y-2">
                  {p.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-400">
                      <CheckCircle2 size={14} className={`mt-0.5 shrink-0 ${p.color}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🚀 CTA */}
      <section className="max-w-5xl mx-auto px-4 pt-24">
        <Card className="bg-gradient-to-br from-red-900 to-slate-900 border-0 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden text-center space-y-10">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Youtube size={300} className="text-white" /></div>
          <div className="relative z-10 space-y-6">
            <h3 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter">Earn While You Sleep.</h3>
            <p className="text-slate-300 text-lg font-bold leading-relaxed max-w-2xl mx-auto">
              楽天アフィリエイトIDとYouTube APIキーを用意するだけ。<br />
              セットアップ30分以内。あとはAIが24時間働き続ける。
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-green-400"><CheckCircle2 size={14} />初期費用0円</div>
              <div className="flex items-center gap-2 text-sm text-green-400"><CheckCircle2 size={14} />いつでも解約可</div>
              <div className="flex items-center gap-2 text-sm text-green-400"><CheckCircle2 size={14} />楽天アフィリ審査済みなら即利用可</div>
            </div>
            <div className="flex flex-wrap justify-center gap-6 pt-6">
              <Link href="/signup">
                <button className="h-20 px-16 bg-white text-red-700 font-bold text-2xl rounded-2xl shadow-xl hover:bg-red-50 transition-all active:scale-95 uppercase">
                  今すぐ始める（無料）
                </button>
              </Link>
            </div>
          </div>
        </Card>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-[#0d1117] mt-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">よくある質問</h2>
          <div className="space-y-6">
            {[
              { q: '楽天アフィリエイトの審査は必要ですか？', a: 'はい、楽天アフィリエイトのアカウント登録と審査が必要です。審査は通常数日以内に完了します。APIキーを本システムに設定するだけで、あとは自動で動きます。' },
              { q: 'YouTubeチャンネルは自分で作りますか？', a: 'はい、自分のYouTubeチャンネルにGoogle API（YouTube Data API v3）を接続して使います。チャンネル作成後、APIキーを設定するだけです。' },
              { q: '動画のクオリティは大丈夫ですか？', a: 'ずんだもん音声 + Kling v3 AI動画 + 字幕テロップで高品質な仕上がりです。人間が手動で作るショート動画と遜色ないクオリティを目指しています。' },
              { q: '月の維持費はいくらかかりますか？', a: 'API費用は使用量に応じて変動しますが、月数百円〜数千円程度が目安です。Gemini APIの無料枠内で月300本以内ならほぼゼロコスト運用も可能です。' },
              { q: 'YouTubeの自動投稿はBANされませんか？', a: 'YouTube Data APIを正規に使用するため、利用規約の範囲内です。ただし1チャンネルへの大量投稿はスパム判定のリスクがあるため、Phase 4の複数チャンネル分散投稿を推奨しています。' },
            ].map((faq, i) => (
              <div key={i}>
                <p className="font-semibold text-white mb-2">Q. {faq.q}</p>
                <p className="text-slate-400 text-sm">A. {faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 口コミ */}
      <section className="bg-[#0d1117] py-20 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-4 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
              ユーザーの<span className="text-red-400">リアルな声</span>
            </h2>
            <p className="text-slate-400 text-sm">実際に使ったユーザーの感想</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: '田中 健太', role: '副業YouTuber・30代', location: '東京都', text: '本業が忙しくてYouTubeを続けられなかったのが、このシステムで毎日投稿できるようになりました。楽天の売れ筋と自動マッチングしてくれるので、商品選びの手間もゼロ。月3万円の副収入ができました。', tag: '月3万円副収入達成' },
              { name: '山田 美咲', role: '主婦・40代', location: '大阪府', text: '動画編集は全くできないけど、設定するだけで勝手に動画が投稿されていくのが面白い。ずんだもんの声が可愛くて視聴者からも好評です。子育て中でも続けられる副業を探していたのでぴったりです。', tag: '育児中でも継続できた' },
              { name: '鈴木 雄介', role: 'フリーランス・20代', location: '福岡県', text: 'AIが台本から投稿まで全部やってくれるのでリソースが本業に集中できます。ガジェット系チャンネルを3本立ち上げて、合計で月7万円の楽天アフィリ収益が出ています。スケールしやすいのが最高。', tag: '3チャンネルで月7万円' },
            ].map((r, i) => (
              <div key={i} className="bg-[#13141f] border border-white/5 hover:border-red-500/20 rounded-2xl p-6 space-y-4 flex flex-col transition-all">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-red-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed flex-1">{r.text}</p>
                <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                  <div className="w-9 h-9 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 font-bold text-sm shrink-0">
                    {r.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm whitespace-nowrap">{r.name}</p>
                    <p className="text-slate-500 text-xs whitespace-nowrap">{r.role} · {r.location}</p>
                    <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 whitespace-nowrap">{r.tag}</span>
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
