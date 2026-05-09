import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, ShoppingBag, Palette, Truck, Settings, CreditCard, CheckCircle, AlertTriangle, Store, Printer, Globe, Zap, Shield, Briefcase, Mail } from 'lucide-react'

export const metadata = {
  title: 'ご利用ガイド | NextraLabs',
  description: 'NextraLabsのAIツール、MASTERMODEL、Printful連携、Shopifyストアの使い方を分かりやすく解説します。',
}

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            トップページに戻る
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Page Title */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-sm px-4 py-1">📖 ご利用ガイド</Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            NextraLabs
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent"> MASTERMODEL</span>
            <span className="bg-gradient-to-r from-emerald-500 to-emerald-500 bg-clip-text text-transparent"> 完全ガイド</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            アカウント登録から「本物」のデータで動くAIマスタツールの使い方まで。<br />
            NextraLabsの全機能を使いこなすためのステップを解説します。
          </p>
        </div>

        {/* Table of Contents */}
        <Card className="mb-12 border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/10">
          <CardContent className="p-6">
            <h2 className="font-bold text-lg mb-4 text-emerald-700 dark:text-emerald-400">📋 目次</h2>
            <nav className="grid md:grid-cols-2 gap-2">
              {[
                { id: 'mastermodel', icon: '💎', label: '1. MASTERMODEL（品質保証）' },
                { id: 'account', icon: '👤', label: '2. アカウント登録・ログイン' },
                { id: 'plans', icon: '💰', label: '3. プランと料金' },
                { id: 'tools', icon: '🛠️', label: '4. 4大マスタツールの使い方' },
                { id: 'usage-limit', icon: '🛡️', label: '5. 利用制限とクレジット保護' },
                { id: 'select-shop', icon: '🏪', label: '6. AIセレクトショップ詳細' },
                { id: 'faq', icon: '❓', label: '7. よくある質問' },
              ].map(item => (
                <a key={item.id} href={`#${item.id}`} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-background/80 transition-colors text-sm">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Section 1: MASTERMODEL */}
        <section id="mastermodel" className="mb-16 scroll-mt-20">
          <SectionHeader icon={<Zap className="w-6 h-6" />} number={1} title="MASTERMODEL（品質保証）" />
          
          <Card className="border-emerald-500 ring-2 ring-emerald-500/20 mb-6 bg-emerald-50/30 dark:bg-emerald-950/20">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-4 text-emerald-600 dark:text-emerald-400">
                <Shield className="w-10 h-10" />
                <h3 className="text-xl font-bold">エメラルドグリーンの枠は「信頼」の証</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                NextraLabsでは、特定の基準をクリアしたツールを<strong>「MASTERMODEL（マスタモデル）」</strong>として認定しています。これらのツールには共通UIとして<strong>「エメラルドグリーンの外枠」</strong>が表示され、以下の品質を保証します。
              </p>
              <ul className="grid md:grid-cols-2 gap-4 mt-6">
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span><strong>本物データ連携:</strong> ダミーデータではなく、GmailやGPS、リアルタイム気象データ等の「本物」と連携して動作します。</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span><strong>最新AI搭載:</strong> Gemini 2.5 Flashを中心とした、最高水準かつ高速なAIモデルを搭載しています。</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span><strong>魂の注入:</strong> NextraLabs代表による徹底したUI/UX調整が行われ、直感的な操作が可能です。</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span><strong>クレジット保護:</strong> ユーザーと運営の両方を守るため、適切な利用制限とコスト管理が施されています。</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Section 2: Account */}
        <section id="account" className="mb-16 scroll-mt-20">
          <SectionHeader icon={<ShoppingBag className="w-6 h-6" />} number={2} title="アカウント登録・ログイン" />
          
          <div className="space-y-6">
            <StepCard step={1} title="サイトにアクセス">
              <p>
                <a href="https://membership-site-nextralabos.vercel.app" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline font-medium">
                  https://membership-site-nextralabos.vercel.app
                </a>
                {' '}にアクセスします。
              </p>
            </StepCard>

            <StepCard step={2} title="新規登録">
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>右上の「<strong className="text-foreground">新規登録</strong>」ボタンをクリック</li>
                <li>メールアドレスとパスワードを入力</li>
                <li>「アカウント作成」をクリック</li>
                <li>すぐにログインできます（メール確認不要）</li>
              </ol>
            </StepCard>

            <StepCard step={3} title="ログイン">
              <p className="text-muted-foreground">
                登録済みの方は「ログイン」からメールアドレスとパスワードでログインしてください。
                Googleアカウント等でのソーシャルログインも順次対応予定です。
              </p>
            </StepCard>
          </div>
        </section>

        {/* Section 3: Plans */}
        <section id="plans" className="mb-16 scroll-mt-20">
          <SectionHeader icon={<CreditCard className="w-6 h-6" />} number={3} title="プランと料金" />
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary">スタンダードプラン</Badge>
                </div>
                <p className="text-3xl font-bold mb-2">¥980<span className="text-base font-normal text-muted-foreground">/月</span></p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> スタンダード対象ツール使い放題</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> 基本的なAI機能の利用</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-emerald-500 ring-2 ring-emerald-500/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-500 text-white">プレミアムプラン ✨</Badge>
                </div>
                <p className="text-3xl font-bold mb-2">¥1,980<span className="text-base font-normal text-muted-foreground">/月</span></p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> <strong className="text-foreground">全マスタツール使い放題</strong></li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Gmail AI Accelerator利用権</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> 高度な画像解析・出品機能</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 4: 4大マスタツール */}
        <section id="tools" className="mb-16 scroll-mt-20">
          <SectionHeader icon={<Settings className="w-6 h-6" />} number={4} title="4大マスタツールの使い方" />
          
          <p className="text-muted-foreground mb-6">
            エメラルドグリーンの枠がついた「マスタモデル」たちの特徴と使い方を解説します。
          </p>

          <div className="space-y-6">
            <Card className="hover:shadow-lg transition-all border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500"><Mail className="w-8 h-8" /></div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 ">Inbox Zero (Gmail AI Accelerator)</h3>
                    <p className="text-sm text-muted-foreground mb-4">最新10件のメールを爆速解析。AIが返信ドラフトを作成し、Gmailの下書きへ1クリック保存。不要なメールは即座にTrashへ移動可能。</p>
                    <div className="bg-muted/50 p-4 rounded-lg text-xs space-y-1">
                      <p>✅ **使い方のコツ:** 「READ FULL CONTENT」で内容を確認後、「AI返信ドラフトを自動生成」をタップ。生成された「緑のボタン」で保存します。</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500"><Briefcase className="w-8 h-8" /></div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 ">AI Sidejob (AI副業スタートダッシュ)</h3>
                    <p className="text-sm text-muted-foreground mb-4">個人の適性を診断し、AIを活用した最適な副業を3つ提案。選んだ副業に対する具体的な「0→1ロードマップ」もAIが作成します。</p>
                    <div className="bg-muted/50 p-4 rounded-lg text-xs space-y-1">
                      <p>✅ **使い方のコツ:** 診断でチェックを入れたら「診断指示をコピー」して、下のChatGPT等のリンクからAIに貼り付けてください。</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-500/10 rounded-xl text-red-500"><Shield className="w-8 h-8" /></div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 ">Money Guard (AI家計防衛シミュレーター)</h3>
                    <p className="text-sm text-muted-foreground mb-4">購入前の迷いやレシートをカメラでスキャン。最強の警告 UI がドーパミンを抑止し、AIによる厳しいアドバイスで無駄遣いを未然に防ぎます。</p>
                    <div className="bg-muted/50 p-4 rounded-lg text-xs space-y-1">
                      <p>✅ **使い方のコツ:** 「TAP TO SCAN」で画像を保存したら、AIに「画像を添付」して指示を投げるのがポイントです。</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all border-l-4 border-l-sky-500">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-sky-500/10 rounded-xl text-sky-500"><Globe className="w-8 h-8" /></div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 ">Disaster Guard (AI防災パーソナルガイド)</h3>
                    <p className="text-sm text-muted-foreground mb-4">GPSと連動し、現在の座標・天気を自動特定。その瞬間の気象条件に基づいた、命を守るための72時間生存戦略をAIが立案します。</p>
                    <div className="bg-muted/50 p-4 rounded-lg text-xs space-y-1">
                      <p>✅ **使い方のコツ:** 📍ボタンでGPS特定を行うだけで、AIへの指示文に位置情報と気象情報が自動的に組み込まれます。</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 5: Usage Limit */}
        <section id="usage-limit" className="mb-16 scroll-mt-20">
          <SectionHeader icon={<Shield className="w-6 h-6" />} number={5} title="利用制限とクレジット保護" />
          
          <Card className="bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-200">
            <CardContent className="p-8">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <AlertTriangle className="w-5 h-5" /> 運営とユーザーを守るための「憲法」
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                NextraLabsでは、最高品質のAI機能を維持するため、一部のツールに以下の利用制限を設けています。
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-border/50">
                  <span className="font-bold text-sm">高コストAPI（Money Guard等）</span>
                  <Badge variant="destructive">1日1回まで</Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-border/50">
                  <span className="font-bold text-sm">大量データ処理（Gmail解析等）</span>
                  <Badge variant="outline" className="border-emerald-500 text-emerald-600">最新10件まで</Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-6 ">
                ※ 管理者によるメンテナンスや、特定プランの特典として制限が緩和される場合があります。
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Section 6: AI Select Shop */}
        <section id="select-shop" className="mb-16 scroll-mt-20">
          <SectionHeader icon={<Store className="w-6 h-6" />} number={6} title="AIセレクトショップ 詳細ガイド" />
          
          <p className="text-muted-foreground mb-6">
            AIでオリジナルTシャツをデザインし、在庫を持たずにオンデマンド販売できるツールです。
          </p>

          <div className="space-y-6">
            <StepCard step={1} title="トレンドからキーワード選定" emoji="📈">
              <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                <li>「Step 1」で今まさに日本でバズっているトレンドワードを確認</li>
                <li>気になるワードをタップしてデザイン画面へ</li>
              </ul>
            </StepCard>

            <StepCard step={2} title="AIスタイル生成" emoji="🎨">
              <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                <li>和風、サイバー、レトロなど多彩なパレットから選択</li>
                <li>Tシャツの地色（黒・白・紺）を選んでプレビューを確認</li>
              </ul>
            </StepCard>

            <StepCard step={3} title="Shopify / Printfulへ出品" emoji="🚀">
              <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                <li>「SHOPIFY 出品」ボタンを1クリック</li>
                <li>Printfulへのデザイン登録と、Shopifyストアへの商品掲載が全自動で行われます</li>
              </ul>
            </StepCard>
          </div>
        </section>

        {/* Section 7: FAQ */}
        <section id="faq" className="mb-16 scroll-mt-20">
          <SectionHeader icon={<CheckCircle className="w-6 h-6" />} number={7} title="よくある質問" />
          
          <div className="space-y-4">
            {[
              { q: 'MASTERMODELとは何ですか？', a: 'NextraLabs独自の品質基準をクリアし、魂の注入が完了した最高傑作のツールです。エメラルドグリーンの枠で表示されます。' },
              { q: '利用制限はリセットできますか？', a: '1日1回の制限は、毎日午前0時にリセットされます。' },
              { q: 'AIの回答が返ってきません。', a: '一部のメール内容（極端に長いものや広告）によってAIが解析をブロックする場合があります。その際は「外部AI用プロンプトをコピー」ボタンをお試しください。' },
              { q: '初期費用はかかりますか？', a: 'NextraLabsのアカウント作成は無料です。プレミアムプランや個別ツールの購入により、全ての機能が解放されます。' },
              { q: 'デザインの著作権は？', a: 'AIで生成したデザインの商用利用は可能です。ただし、既存のブランドロゴや著作物に似たデザインの使用は避けてください。' },
            ].map((faq, i) => (
              <Card key={i}>
                <CardContent className="p-5">
                  <h3 className="font-bold mb-2 flex items-start gap-2">
                    <span className="text-emerald-500">Q.</span>
                    {faq.q}
                  </h3>
                  <p className="text-sm text-muted-foreground pl-6">
                    <span className="text-emerald-500 font-bold">A.</span> {faq.a}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 shadow-2xl">
          <CardContent className="p-10 text-center">
            <h2 className="text-3xl font-bold mb-4 uppercase tracking-tighter">Enter the MASTERMODEL Era</h2>
            <p className="text-white/80 mb-8 font-medium">
              最新のAIテクノロジーと、洗練されたユーザー体験を、あなたの手に。
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/signup" className="inline-flex items-center gap-2 bg-white text-emerald-600 font-bold px-10 py-4 rounded-2xl hover:bg-emerald-50 transition-all shadow-xl active:scale-95 uppercase ">
                無料で参加する
              </Link>
              <Link href="/products" className="inline-flex items-center gap-2 bg-emerald-700/30 text-white font-bold px-10 py-4 rounded-2xl hover:bg-emerald-700/50 transition-all border-2 border-emerald-400/30 uppercase ">
                ツール一覧を見る
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ---------- Sub-components ----------

function SectionHeader({ icon, number, title }: { icon: React.ReactNode; number: number; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-8 pb-4 border-b-2 border-muted">
      <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600">
        {icon}
      </div>
      <h2 className="text-2xl font-bold uppercase tracking-tight">
        <span className="text-emerald-500/50">0{number}.</span> {title}
      </h2>
    </div>
  )
}

function StepCard({ step, title, emoji, children }: { step: number; title: string; emoji?: string; children: React.ReactNode }) {
  return (
    <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500 text-white text-sm font-bold ">
            {emoji || step}
          </span>
          <h3 className="font-bold text-xl uppercase tracking-tight">{title}</h3>
        </div>
        <div className="pl-14">
          {children}
        </div>
      </CardContent>
    </Card>
  )
}
