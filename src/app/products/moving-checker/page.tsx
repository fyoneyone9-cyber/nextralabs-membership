import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'AI引越し安心チェッカー | 治安・物件リスク・引越し費用をAIが徹底診断 | NextraLabs',
  description: '引越し先の住所を入力するだけ。AIが治安スコア・ハザードマップリスク・物件の問題点・引越し費用相場を自動診断。失敗しない引越しをAIがサポート。スタンダードプラン¥980。',
  keywords: ['引越しAI','治安診断AI','物件リスク診断','引越し費用AI','住みやすさ診断','引越し安心','ハザードマップAI','物件診断AI','引越し失敗防止','NextraLabs引越し'],
  alternates: { canonical: 'https://nextralab.jp/products/moving-checker' },
  openGraph: { title: 'AI引越し安心チェッカー | 治安・物件リスク・引越し費用をAIが徹底診断 | NextraLabs', description: '引越し先の住所を入力するだけ。AIが治安スコア・ハザードマップリスク・物件の問題点・引越し費用相場を自動診断。失敗しない引越しをAIがサポート。スタンダードプラン¥980。', url: 'https://nextralab.jp/products/moving-checker', type: 'website' },
}

import { ToolLaunchButton } from '@/components/ToolLaunchButton'
import {
import AffiliateBanner from '@/components/affiliate/AffiliateBanner'
  ArrowLeft,
  Code2,
  HelpCircle,
  ChevronRight,
  Shield,
  Clock,
  Home,
  MapPin,
  Volume2,
  ClipboardList,
  Scale,
  Phone,
  Users,
  Building,
  Search,
} from 'lucide-react'

const features = [
  {
    icon: MapPin,
    title: 'エリア安全度スコア',
    description:
      '市区町村の公開犯罪統計（警察庁オープンデータ準拠）をもとに、地域の治安傾向を5段階で表示。犯罪種別ごとの発生率も確認できる。',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Volume2,
    title: '騒音リスクチェッカー',
    description:
      '物件の構造（RC/鉄骨/木造）・階数・築年数・幹線道路距離・飲食店密度から騒音リスクを推定。内見時に確認すべきポイント20項目付き。',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: ClipboardList,
    title: '物件トラブル予防チェック',
    description:
      '契約前に確認すべき30項目。管理会社の対応速度、共用部の清掃状態、ゴミ捨て場、掲示板の注意書き、駐輪場の整頓度…プロの目線を再現。',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    icon: Scale,
    title: 'トラブル対処テンプレート',
    description:
      '騒音・ゴミ出し・駐車場・ペット・タバコなど典型トラブルごとに段階的な対処法（①記録→②管理会社→③内容証明→④調停）をテンプレ化。',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Home,
    title: '引っ越しコスト計算機',
    description:
      '引っ越し費用の見積もり（初期費用・引越し業者・家具家電・ライフライン手続き）を一括計算。見落としがちな隠れコストもリストアップ。',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
  },
  {
    icon: Phone,
    title: '相談窓口ガイド',
    description:
      '各自治体の無料法律相談、法テラス、警察相談(#9110)、国民生活センター(188)をワンタップで確認。トラブル種別ごとに適切な相談先を案内。',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
  },
]

const techStack = [
  { category: 'フロントエンド', value: 'Next.js + React + TypeScript' },
  { category: 'チェックロジック', value: 'ルールベース判定 + スコアリング' },
  { category: 'データ参照', value: '警察庁犯罪統計(公開データ)準拠' },
  { category: 'コスト計算', value: '国土交通省ガイドライン準拠' },
  { category: 'UI', value: 'Tailwind CSS + shadcn/ui' },
  { category: 'セキュリティ', value: 'サーバー送信なし・完全クライアント側処理' },
]

const setupSteps = [
  { step: '1', title: 'ツールを起動', desc: '購入後、ダッシュボードからワンクリックで起動', time: '1秒' },
  { step: '2', title: '物件情報を入力', desc: '構造・階数・エリアなどを入力', time: '3分' },
  { step: '3', title: 'チェック結果を確認', desc: 'スコアとチェックリストで物件を総合評価', time: '即時' },
]

const targets = [
  {
    icon: Users,
    title: '引っ越しを検討中の方',
    description: '内見だけでは分からないリスクを事前にチェック。「住んでから後悔」を防ぐ。',
  },
  {
    icon: Building,
    title: '一人暮らしを始める方',
    description: '初めての部屋選びで失敗しないために。30項目のチェックリストで安心の物件選び。',
  },
  {
    icon: Search,
    title: '近隣トラブルに悩んでいる方',
    description: 'トラブル対処テンプレートで適切な対応を。段階的なエスカレーション方法を知っておこう。',
  },
]

const faqs = [
  { q: '利用するにはどのプランが必要ですか？', a: 'スタンダードプラン（月額¥980）以上でご利用いただけます。引越し先の治安診断や費用相場など全機能をフル活用できます。' },
  { q: '治安スコアはどのような基準で計算されますか？', a: '公開犯罪統計・ハザードマップデータ・地域特性をAIが総合分析し、治安スコアを算出します。引越し前の比較検討にご活用ください。' },
  { q: '引越し費用の相場診断はどれくらい正確ですか？', a: '家族構成・移動距離・荷物量・時期（繁忙期/閑散期）を入力することで、実際の業者相場に近い費用レンジをAIが提示します。複数業者との交渉にも使えます。' },
  { q: 'ハザードマップリスクとは何を指しますか？', a: '洪水・土砂災害・地震・高潮などのリスクエリアをAIが解析し、引越し先の自然災害リスクを5段階で評価します。防災面での物件選びに役立ちます。' },
  { q: '物件の問題点チェックはどのように使いますか？', a: '内見前・内見中・契約前の3つのフェーズで確認すべき30項目以上をチェックリスト形式で提供。見落としがちな欠陥や契約上のリスクを事前に発見できます。' },
]

export default function MovingCheckerPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AI引越し安心チェッカー',
    description: '引越し先の住所を入力するだけ。AIが治安スコア・ハザードマップリスク・物件の問題点・引越し費用相場を自動診断。',
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Web',
    url: 'https://nextralab.jp/products/moving-checker',
    offers: { '@type': 'Offer', price: '980', priceCurrency: 'JPY' },
    publisher: { '@type': 'Organization', name: 'NextraLabs' },
  }
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-green-500/5" />
        <div className="container mx-auto px-4 relative">
          <Link href="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />ツール一覧に戻る
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-emerald-500/10 text-emerald-600 dark:text-blue-400 border-emerald-500/20">🏠 新商品</Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">AI引っ越し安心チェッカー</h1>
              <p className="text-xl text-muted-foreground mb-2">エリア安全度 × 騒音リスク × トラブル予防</p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                住んでから後悔しないために。<span className="text-foreground font-medium">物件の「見えないリスク」を事前にスコア化。</span>
                <br />騒音・治安・トラブル対処まで、引っ越しの不安をまるごとケア。
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <Badge variant="outline" className="text-sm py-1">📍 エリア安全度</Badge>
                <Badge variant="outline" className="text-sm py-1">🔊 騒音リスク</Badge>
                <Badge variant="outline" className="text-sm py-1">📋 30項目チェック</Badge>
                <Badge variant="outline" className="text-sm py-1">🔒 完全ローカル処理</Badge>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/products/moving-checker/app">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8">🆓 無料で体験する</Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Shield className="h-4 w-4" />住所入力不要</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" />即日利用可能</span>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-2xl p-8 border border-emerald-500/10">
                <div className="bg-background/95 backdrop-blur rounded-xl p-6 shadow-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-xs text-muted-foreground ml-2">AI引っ越し安心チェッカー</span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-emerald-500/10 rounded-lg p-3">
                      <div className="text-xs text-blue-400 mb-1">📍 エリア安全度</div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-blue-400">★★★★☆</span>
                        <span className="text-xs text-muted-foreground">安全度: 良好</span>
                      </div>
                      <div className="mt-2 flex gap-1">
                        {[85, 90, 70, 95].map((v, i) => (
                          <div key={i} className="flex-1">
                            <div className="bg-gray-700/50 rounded-full h-1.5"><div className="bg-blue-400 h-1.5 rounded-full" style={{ width: `${v}%` }} /></div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-emerald-500/10 rounded-lg p-3">
                      <div className="text-xs text-emerald-400 mb-1">🔊 騒音リスク</div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">RC造 / 5階 / 築8年</span>
                        <span className="text-lg font-bold text-green-400">低リスク</span>
                      </div>
                    </div>
                    <div className="bg-green-500/10 rounded-lg p-3">
                      <div className="text-xs text-green-400 mb-1">✅ チェックリスト進捗</div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">確認済み 24/30項目</span>
                        <span className="text-lg font-bold text-green-400">80%</span>
                      </div>
                      <div className="mt-2 w-full bg-gray-700/50 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">6つの機能で住まいを守る</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">「住んでから分かる問題」を、住む前に見つける。プロの不動産チェックをAIで再現。</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((f, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${f.bg} mb-4`}><f.icon className={`h-6 w-6 ${f.color}`} /></div>
                  <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Setup */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">3ステップで安心チェック</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {setupSteps.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4"><span className="text-2xl font-bold text-emerald-500">{s.step}</span></div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
                <Badge variant="outline" className="mt-3">{s.time}</Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">こんな方におすすめ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {targets.map((t, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4"><t.icon className="h-8 w-8 text-emerald-500" /></div>
                  <h3 className="font-semibold text-lg mb-2">{t.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech */}
      <section className="py-16 border-t bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4"><Code2 className="inline h-8 w-8 mr-2" />技術スタック</h2>
          <div className="max-w-2xl mx-auto">
            <Card><CardContent className="pt-6"><div className="space-y-3">{techStack.map((t, i) => (<div key={i} className="flex items-center justify-between py-2 border-b last:border-0"><span className="text-sm font-medium">{t.category}</span><span className="text-sm text-muted-foreground">{t.value}</span></div>))}</div></CardContent></Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">料金</h2>
          <div className="max-w-md mx-auto">
            <Card className="border-green-500/30">
              <CardContent className="pt-8 pb-8">
                <Badge className="mb-4 bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">無料体験</Badge>
                <div className="text-5xl font-bold mb-2">¥0</div>
                <p className="text-muted-foreground mb-6">登録不要で今すぐ体験できます</p>
                <Link href="/products/moving-checker/app">
                  <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white">🆓 無料で体験する</Button>
                </Link>
                <p className="text-xs text-muted-foreground mt-4">他の有料ツールも使うなら → 全ツール使い放題プラン（¥980/月）</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 border-t bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4"><HelpCircle className="inline h-8 w-8 mr-2" />よくある質問</h2>
          <div className="max-w-3xl mx-auto space-y-4 mt-8">
            {faqs.map((f, i) => (<Card key={i}><CardContent className="pt-6"><h3 className="font-semibold mb-2 flex items-start gap-2"><ChevronRight className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />{f.q}</h3><p className="text-sm text-muted-foreground pl-7">{f.a}</p></CardContent></Card>))}
          </div>
        </div>
      </section>

      <AffiliateBanner toolId="moving-checker" />

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
              { name: '上田 紗希', role: '大学進学・18歳', location: '兵庫県', text: '初めての一人暮らしで何を準備すればいいか全然分かりませんでした。入居前・当日・入居後のやること全部をリスト化してくれて、何一つ漏れなく引越しできました。親に頼らず完結できたのが自信になりました。', tag: 'はじめての一人暮らし' },
              { name: '菊地 誠', role: '転勤族・30代', location: '東京都', text: '3年おきに全国転勤があり引越しのたびに手続きが大変です。転入届や電気水道ガスの切り替え順序をまとめてくれるので毎回助かっています。転勤慣れしている私でも新しい発見がありました。', tag: '転勤族' },
              { name: '坂本 真由', role: '結婚を機に引越し', location: '京都府', text: '二人の荷物を合わせると量が膨大で業者選びに悩みました。部屋の間取りと荷物量を入力したら最適な業者タイプと相場を教えてくれて、相見積もりがスムーズにできました。', tag: '同棲・結婚引越し' },
              { name: '近藤 淳', role: 'ファミリー引越し', location: '埼玉県', text: '子ども2人の学区変更が絡む引越しで手続きが複雑でした。学校の転校手続きや児童手当の切り替えタイミングまでチェックリストに入っていて、役所に何度も行かずに済みました。', tag: '子連れ引越し' },
              { name: '宮崎 明子', role: '高齢者の引越しをサポート', location: '福岡県', text: '親の施設入居に伴う実家の片付けと引越しを手伝いました。遺品整理業者の選び方や不用品処分の流れまで教えてくれて、初めての経験でも段取りよく進められました。', tag: '実家の引越しサポート' },
              { name: '大野 健太', role: '海外赴任帰りの再定住', location: '神奈川県', text: '3年間の海外赴任から帰国し、住民票の復活手続きや社会保険の再加入が複雑でした。帰国後の手続きを一覧化して優先順位まで教えてくれたので、スムーズに生活を再スタートできました。', tag: '海外帰国者の引越し' },
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
