import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, MapPin, Users, ClipboardCheck, AlertTriangle, Phone, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'AI防災パーソナルガイド',
  description: '現在地から最寄り避難所を自動検索。家族の避難プランを事前作成。気象庁APIで警報をリアルタイム確認。月額¥1,980。',
  alternates: { canonical: 'https://membership-site-nextralabos.vercel.app/products/disaster-guard' },
  openGraph: { title: 'AI防災パーソナルガイド | NextraLabs', description: '現在地から最寄り避難所を自動検索。家族の避難プランを事前作成。気象庁APIで警報をリアルタイム確認。', url: 'https://membership-site-nextralabos.vercel.app/products/disaster-guard', type: 'website' },
}

export default function DisasterGuardPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-1" />
        ツール一覧に戻る
      </Link>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700 p-8 md:p-12 text-white mb-12">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IGZpbGw9InVybCgjZykiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIi8+PC9zdmc+')] opacity-30" />
        <div className="relative z-10">
          <div className="text-sm font-medium bg-white/20 backdrop-blur-sm rounded-full px-4 py-1 inline-block mb-4">
            🛡️ 防衛シリーズ
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            AI防災<br />パーソナルガイド
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl">
            あなたの現在地に合わせた避難所検索、家族の防災プラン作成、
            気象警報リアルタイムモニター。「その時」に慌てないための準備を。
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm">GPS避難所検索</span>
            <span className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm">家族防災プラン</span>
            <span className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm">気象警報API</span>
            <span className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm">防災クイズ</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { value: '68%', label: '避難場所を知らない人' },
          { value: '85%', label: '防災備蓄が不十分な家庭' },
          { value: '171', label: '災害伝言ダイヤル' },
          { value: '6タブ', label: '搭載機能' },
        ].map((s, i) => (
          <div key={i} className="bg-muted/50 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <h2 className="text-2xl font-bold mb-6">搭載機能</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-12">
        {[
          { icon: <MapPin className="h-6 w-6" />, title: '🗺️ マイ避難マップ', desc: 'GPS現在地から最寄り避難所を自動検索・距離順表示。ハザードマップ情報（浸水・土砂・地震）とあわせて確認。' },
          { icon: <Users className="h-6 w-6" />, title: '👨‍👩‍👧 家族防災プラン', desc: '家族の名前・普段いる場所を登録。災害種別ごとに「誰がどこに逃げるか」を事前シミュレーション。集合場所も設定。' },
          { icon: <ClipboardCheck className="h-6 w-6" />, title: '📋 防災チェックリスト', desc: '備蓄品（水・食料・薬）、持ち出し袋、連絡手段、集合場所。チェック進捗をlocalStorageに保存。' },
          { icon: <AlertTriangle className="h-6 w-6" />, title: '⚠️ 気象警報モニター', desc: '気象庁XMLフィードから地域の警報・注意報をリアルタイム取得。設定した地域の情報を優先表示。' },
          { icon: <Phone className="h-6 w-6" />, title: '🆘 緊急連絡ガイド', desc: '災害伝言ダイヤル(171)の使い方、緊急連絡先一覧、安否確認サービス（web171・J-anpi）まとめ。' },
          { icon: <BookOpen className="h-6 w-6" />, title: '📖 防災知識クイズ', desc: '地震・津波・洪水・火災の正しい行動をクイズ形式で学習。家族で一緒に取り組める。スコア記録機能付き。' },
        ].map((f, i) => (
          <Link key={i} href="/products/disaster-guard/app" className="border rounded-2xl p-5 hover:border-sky-300 hover:bg-sky-500/5 transition-all group block">
            <div className="flex items-start justify-between">
              <div className="text-sky-500 mb-2">{f.icon}</div>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="font-bold mb-1">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </Link>
        ))}
      </div>

      {/* Synergy */}
      <div className="bg-sky-500/10 border border-sky-500/30 rounded-2xl p-6 mb-12">
        <h3 className="font-bold text-sky-600 dark:text-sky-400 mb-2">🔗 防衛シリーズの連携</h3>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>🏠 <strong>AI引っ越し安心チェッカー</strong>（Tool #10）で引っ越し前にエリアの災害リスクを確認</li>
          <li>🛡️ <strong>AI防災パーソナルガイド</strong>（本ツール）で引っ越し後の避難計画を作成</li>
          <li>💰 <strong>AI家計防衛シミュレーター</strong>（Tool #9）で防災備蓄の予算計画</li>
        </ul>
      </div>

      {/* How to use */}
      <h2 className="text-2xl font-bold mb-6">使い方</h2>
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          { step: '1', title: '位置情報を許可', desc: 'ブラウザのGPSで現在地を取得。最寄り避難所が自動表示' },
          { step: '2', title: '家族情報を登録', desc: '家族の名前と普段いる場所を入力。災害別の避難プランが完成' },
          { step: '3', title: '定期的に確認', desc: 'チェックリストで備蓄を見直し。気象警報は常に最新情報' },
        ].map((s, i) => (
          <div key={i} className="text-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-3">{s.step}</div>
            <h3 className="font-bold mb-1">{s.title}</h3>
            <p className="text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Important Notice */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 mb-12">
        <h3 className="font-bold text-amber-600 dark:text-amber-400 mb-2">⚠️ 重要事項</h3>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• 本ツールは防災の<strong>事前準備・学習</strong>を支援するものです</li>
          <li>• 災害発生時は必ず<strong>自治体・気象庁の公式情報</strong>に従ってください</li>
          <li>• 避難所データは国土地理院等の公開情報に基づきますが、最新情報は各自治体でご確認ください</li>
          <li>• このツールの情報のみに依存せず、日頃から複数の情報源で防災情報を確認してください</li>
        </ul>
      </div>

      {/* Tech */}
      <div className="bg-muted/30 rounded-2xl p-6 mb-12">
        <h3 className="font-bold mb-3">技術仕様</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          {['ブラウザ完結', 'GPS位置情報', '気象庁API連携', 'localStorage保存', 'スマホ対応', 'オフライン一部対応', 'ダークモード', '家族共有機能'].map(t => (
            <div key={t} className="flex items-center gap-1.5"><span className="text-sky-500">✓</span> {t}</div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="border-2 rounded-3xl p-8 text-center mb-12">
        <h2 className="text-2xl font-bold mb-2">AI防災パーソナルガイド</h2>
        <div className="flex items-baseline justify-center gap-1 mb-4">
          <span className="text-3xl font-bold">¥980</span>
          <span className="text-base font-normal text-muted-foreground">/月</span>
        </div>
        <p className="text-sm text-muted-foreground mb-6">スタンダードプラン対応 — 全ツール使い放題</p>
        <Link href="/pricing">
          <Button className="w-full max-w-xs">プランを見る →</Button>
        </Link>
      </div>

      {/* FAQ */}
      <h2 className="text-2xl font-bold mb-6">よくある質問</h2>
      <div className="space-y-4 mb-12">
        {[
          { q: '位置情報は必須ですか？', a: 'いいえ。GPS不使用でも、住所や地域名を手動入力して避難所を検索できます。位置情報を許可するとより正確な結果が得られます。' },
          { q: '気象警報はリアルタイムですか？', a: 'はい。気象庁のXMLフィードから最新の警報・注意報を取得します。ただし更新頻度は気象庁の配信タイミングに依存します。' },
          { q: '家族の位置がリアルタイムでわかりますか？', a: 'いいえ。プライバシー保護のため、家族のリアルタイム位置追跡機能はありません。家族の「普段いる場所」を事前登録し、災害別の避難プランを作成する機能です。' },
          { q: 'オフラインでも使えますか？', a: '防災チェックリスト・家族プラン・緊急連絡ガイドはオフラインでも閲覧可能です。気象警報と避難所検索はインターネット接続が必要です。' },
          { q: '避難所データはどこから取得していますか？', a: '国土地理院の指定緊急避難場所データ等の公開情報をもとにしています。最新情報は各自治体の公式サイトでもご確認ください。' },
        ].map((faq, i) => (
          <div key={i} className="border rounded-xl p-5">
            <h3 className="font-bold mb-2">Q. {faq.q}</h3>
            <p className="text-sm text-muted-foreground">{faq.a}</p>
          </div>
        ))}
      </div>

      {/* Amazon アソシエイト */}
      <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-2xl p-6 mb-12 text-center">
        <p className="text-sm text-muted-foreground mb-3">🛒 防災グッズをAmazonでチェック</p>
        <a
          href="https://www.amazon.co.jp/s?k=防災グッズ&tag=nextralabs-22"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-6 rounded-full text-sm transition-colors"
        >
          Amazonで見る →
        </a>
      </div>
    </div>
  )
}
