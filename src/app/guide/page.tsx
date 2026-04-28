import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, ShoppingBag, Palette, Truck, Settings, CreditCard, CheckCircle, AlertTriangle, Store, Printer, Globe } from 'lucide-react'

export const metadata = {
  title: 'ご利用ガイド | NextraLabs',
  description: 'NextraLabsのAIツール、Printful連携、Shopifyストアの使い方を分かりやすく解説します。',
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
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent"> 完全ガイド</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            アカウント登録からAIツールの使い方、Tシャツ販売まで。<br />
            すべてのステップを分かりやすく解説します。
          </p>
        </div>

        {/* Table of Contents */}
        <Card className="mb-12 border-amber-500/20 bg-amber-50/50 dark:bg-amber-950/10">
          <CardContent className="p-6">
            <h2 className="font-bold text-lg mb-4">📋 目次</h2>
            <nav className="grid md:grid-cols-2 gap-2">
              {[
                { id: 'account', icon: '👤', label: '1. アカウント登録・ログイン' },
                { id: 'plans', icon: '💎', label: '2. プランと料金' },
                { id: 'tools', icon: '🛠️', label: '3. AIツールの使い方' },
                { id: 'select-shop', icon: '🏪', label: '4. AIセレクトショップ詳細' },
                { id: 'printful', icon: '🖨️', label: '5. Printful連携（Tシャツ販売）' },
                { id: 'shopify', icon: '🛍️', label: '6. Shopifyストア連携' },
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

        {/* Section 1: Account */}
        <section id="account" className="mb-16 scroll-mt-20">
          <SectionHeader icon={<ShoppingBag className="w-6 h-6" />} number={1} title="アカウント登録・ログイン" />
          
          <div className="space-y-6">
            <StepCard step={1} title="サイトにアクセス">
              <p>
                <a href="https://membership-site-nextralabos.vercel.app" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline font-medium">
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
                パスワードを忘れた場合は「パスワードを忘れた方」リンクから再設定できます。
              </p>
            </StepCard>
          </div>
        </section>

        {/* Section 2: Plans */}
        <section id="plans" className="mb-16 scroll-mt-20">
          <SectionHeader icon={<CreditCard className="w-6 h-6" />} number={2} title="プランと料金" />
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary">無料プラン</Badge>
                </div>
                <p className="text-3xl font-bold mb-2">¥0</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> アカウント作成</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> 商品ページの閲覧</li>
                  <li className="flex items-center gap-2 line-through opacity-50"><AlertTriangle className="w-4 h-4" /> AIツールの利用</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-amber-500 ring-2 ring-amber-500/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">プレミアム ✨</Badge>
                </div>
                <p className="text-3xl font-bold mb-2">¥980<span className="text-base font-normal text-muted-foreground">/月</span></p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> <strong className="text-foreground">全AIツール使い放題</strong></li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> 新ツール追加時も無料</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> 優先サポート</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-blue-50/50 dark:bg-blue-950/10 border-blue-200">
            <CardContent className="p-6">
              <p className="text-sm">
                💡 <strong>単品購入も可能：</strong>月額プランに加入しなくても、気になるツールだけを個別に購入して永久に使えます。
                各ツールの商品ページから「購入する」ボタンでStripe決済に進めます。
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Section 3: Tools Overview */}
        <section id="tools" className="mb-16 scroll-mt-20">
          <SectionHeader icon={<Settings className="w-6 h-6" />} number={3} title="AIツールの使い方" />
          
          <p className="text-muted-foreground mb-6">
            NextraLabsには5つのAIツールがあります。プレミアム会員なら全て使い放題、単品購入も可能です。
          </p>

          <div className="space-y-4">
            {[
              { emoji: '🔍', name: 'AI古着ハンター', price: '¥9,800', path: '/products/vintage-hunter', desc: 'メルカリの新着を24時間AI監視。お買い得古着を自動検出してDiscordに通知。' },
              { emoji: '🏢', name: '社内政治 相関図ツール', price: '¥4,980', path: '/products/office-politics-graph', desc: '組織の人間関係をAIが分析し、インタラクティブな相関図を自動生成。' },
              { emoji: '🐾', name: 'AIペット翻訳モニター', price: '¥4,980', path: '/products/pet-translator', desc: 'ペットの鳴き声・行動をAIが「翻訳」してリアルタイム表示。' },
              { emoji: '🛑', name: 'AI買い物依存ストッパー', price: '¥4,980', path: '/products/shopping-stopper', desc: '衝動買いをAIが診断。本当に必要かどうかを冷静にアドバイス。' },
              { emoji: '🏪', name: '「在庫ゼロ」AIセレクトショップ', price: '¥9,800', path: '/products/ai-select-shop', desc: 'AIでTシャツデザインを生成し、Printful連携で在庫なしオンデマンド販売。' },
            ].map(tool => (
              <Card key={tool.path} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{tool.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold">{tool.name}</h3>
                        <Badge variant="outline" className="text-xs">{tool.price}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{tool.desc}</p>
                      <a href={tool.path} className="text-sm text-amber-600 hover:underline inline-flex items-center gap-1">
                        詳しく見る <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200">
            <CardContent className="p-6">
              <h3 className="font-bold mb-2">🚀 ツールの使い方（共通）</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>ログインする</li>
                <li>使いたいツールの商品ページを開く</li>
                <li>「ツールを使う」ボタンをクリック（プレミアム会員 or 購入済みの場合）</li>
                <li>ツールが起動し、ブラウザ上ですぐに使えます</li>
              </ol>
            </CardContent>
          </Card>
        </section>

        {/* Section 4: AI Select Shop Detail */}
        <section id="select-shop" className="mb-16 scroll-mt-20">
          <SectionHeader icon={<Store className="w-6 h-6" />} number={4} title="AIセレクトショップ 詳細ガイド" />
          
          <p className="text-muted-foreground mb-6">
            AIでオリジナルTシャツをデザインし、在庫を持たずにオンデマンド販売できるツールです。
          </p>

          <div className="space-y-6">
            <StepCard step={1} title="キーワードでデザイン生成" emoji="🎨">
              <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                <li>「デザイン生成」タブを開く</li>
                <li>キーワードを入力（例：「東京 ネオン サイバーパンク」）</li>
                <li>スタイルを選択（ミニマル、ストリート、和風、レトロ、ポップアートなど）</li>
                <li>「AIでデザイン生成」ボタンをクリック</li>
                <li>AIがオリジナルデザインを自動生成します</li>
              </ul>
            </StepCard>

            <StepCard step={2} title="Tシャツのカスタマイズ" emoji="👕">
              <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                <li>生成されたデザインのプレビューを確認</li>
                <li>Tシャツの色を選択（白、黒、グレー、ネイビー）</li>
                <li>サイズを選択（S〜2XL、複数選択可）</li>
                <li>販売価格を設定（推奨：¥2,400〜¥3,980）</li>
              </ul>
            </StepCard>

            <StepCard step={3} title="Printfulへ出品" emoji="🖋️">
              <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                <li>「出品」ボタンをクリック</li>
                <li>デザイン画像が自動アップロードされます</li>
                <li>Printfulに商品が登録されます</li>
                <li>Shopify連携済みなら、Shopifyストアにも自動同期</li>
              </ul>
            </StepCard>

            <StepCard step={4} title="注文が入ったら" emoji="📦">
              <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                <li>お客様がShopifyストアで購入</li>
                <li>Printfulが自動的にTシャツを印刷</li>
                <li>お客様に直接発送（あなたは在庫を持たない）</li>
                <li>利益 = 販売価格 − 原価 − 送料</li>
              </ul>
            </StepCard>
          </div>
        </section>

        {/* Section 5: Printful */}
        <section id="printful" className="mb-16 scroll-mt-20">
          <SectionHeader icon={<Printer className="w-6 h-6" />} number={5} title="Printful連携（Tシャツ販売）" />
          
          <p className="text-muted-foreground mb-6">
            Printfulはオンデマンド印刷・発送サービスです。在庫を持たずに世界中に商品を販売できます。
          </p>

          <div className="space-y-6">
            <StepCard step={1} title="Printfulアカウント作成" emoji="📝">
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground text-sm">
                <li>
                  <a href="https://www.printful.com/jp" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">
                    printful.com/jp
                  </a>
                  {' '}にアクセス
                </li>
                <li>「無料で始める」をクリック</li>
                <li>メール、Google、またはAppleで登録</li>
                <li>アカウント作成は<strong className="text-foreground">完全無料</strong>（注文が入った時だけ原価が発生）</li>
              </ol>
            </StepCard>

            <StepCard step={2} title="APIキーを取得" emoji="🔑">
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground text-sm">
                <li>Printfulダッシュボードにログイン</li>
                <li>左メニュー「Settings」→「API access」</li>
                <li>「Create new API token」をクリック</li>
                <li>トークン名を入力（例：「NextraLabs」）</li>
                <li>「Generate」→ 表示されたAPIキーをコピー</li>
              </ol>
              <Card className="mt-3 bg-red-50/50 dark:bg-red-950/10 border-red-200">
                <CardContent className="p-3">
                  <p className="text-xs text-red-600">
                    ⚠️ APIキーは一度しか表示されません。必ずコピーして安全な場所に保存してください。
                  </p>
                </CardContent>
              </Card>
            </StepCard>

            <StepCard step={3} title="Store IDを確認" emoji="🏪">
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground text-sm">
                <li>Printfulダッシュボード →「Stores」</li>
                <li>対象ストアをクリック</li>
                <li>URLに含まれる数字がStore ID（例：<code className="bg-muted px-1 rounded">18088205</code>）</li>
              </ol>
            </StepCard>

            <StepCard step={4} title="AIセレクトショップに設定" emoji="⚙️">
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground text-sm">
                <li>AIセレクトショップを開く</li>
                <li>「⚙️ 設定」タブをクリック</li>
                <li>「🖨️ Printful連携」セクションを見つける</li>
                <li>APIキーとStore IDを入力</li>
                <li>「接続テスト」ボタンで確認</li>
                <li>ストア名と商品一覧が表示されたら連携完了！</li>
              </ol>
            </StepCard>
          </div>
        </section>

        {/* Section 6: Shopify */}
        <section id="shopify" className="mb-16 scroll-mt-20">
          <SectionHeader icon={<Globe className="w-6 h-6" />} number={6} title="Shopifyストア連携" />
          
          <p className="text-muted-foreground mb-6">
            Shopifyストアを作ってPrintfulと連携すると、商品の販売・決済・発送がすべて自動化されます。
          </p>

          <div className="space-y-6">
            <StepCard step={1} title="Shopifyストア作成" emoji="🛍️">
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground text-sm">
                <li>
                  <a href="https://www.shopify.com/jp" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">
                    shopify.com/jp
                  </a>
                  {' '}にアクセス
                </li>
                <li>「無料体験をはじめる」をクリック（3日間無料 → ¥150/月〜）</li>
                <li>メールアドレスで登録</li>
                <li>ストア名を入力して作成</li>
              </ol>
            </StepCard>

            <StepCard step={2} title="カスタムアプリを作成（API連携用）" emoji="🔧">
              <p className="text-muted-foreground text-sm mb-4">
                AIセレクトショップからShopifyに商品を自動登録するために、API連携用のカスタムアプリを作成します。
              </p>

              {/* Sub-step 2-1 */}
              <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border/50">
                <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-bold">1</span>
                  Dev Dashboardを開く
                </h4>
                <ol className="list-none space-y-2 text-muted-foreground text-sm ml-8">
                  <li>Shopify管理画面の左下「⚙️ <strong className="text-foreground">設定</strong>」をクリック</li>
                  <li>左メニューの「<strong className="text-foreground">アプリ</strong>」をクリック</li>
                  <li>「<strong className="text-foreground">アプリを開発する</strong>」ボタンをクリック → Dev Dashboardが新しいタブで開きます</li>
                </ol>
              </div>

              {/* Sub-step 2-2 */}
              <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border/50">
                <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-bold">2</span>
                  アプリを新規作成
                </h4>
                <ol className="list-none space-y-2 text-muted-foreground text-sm ml-8">
                  <li>Dev Dashboardの右上「<strong className="text-foreground">アプリを作成</strong>」ボタンをクリック</li>
                  <li>アプリ名を入力（例：<code className="bg-muted px-1 rounded text-xs">NextraLabs API</code>）</li>
                  <li>「<strong className="text-foreground">作成</strong>」をクリック</li>
                </ol>
              </div>

              {/* Sub-step 2-3 */}
              <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border/50">
                <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-bold">3</span>
                  APIスコープを設定してリリース
                </h4>
                <ol className="list-none space-y-2 text-muted-foreground text-sm ml-8">
                  <li>アプリが作成されたら、左メニューの「<strong className="text-foreground">バージョン</strong>」をクリック</li>
                  <li>「<strong className="text-foreground">新しいバージョン</strong>」をクリック</li>
                  <li>「Access scopes」欄に以下をコピペ：<br />
                    <code className="bg-muted px-2 py-1 rounded text-xs mt-1 inline-block text-amber-600 dark:text-amber-400 font-mono">write_products, read_products</code>
                  </li>
                  <li>その他の設定はそのまま（App URLは <code className="bg-muted px-1 rounded text-xs">https://example.com</code> でOK）</li>
                  <li>「<strong className="text-foreground">リリース</strong>」をクリック</li>
                </ol>
                <Card className="mt-3 bg-yellow-50/50 dark:bg-yellow-950/10 border-yellow-200/50">
                  <CardContent className="p-2">
                    <p className="text-xs text-yellow-700 dark:text-yellow-400">
                      ⚠️ App URLやRedirect URLは <code className="text-xs">https://example.com</code> で問題ありません。API連携のみなので実際のURLは不要です。
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Sub-step 2-4 */}
              <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border/50">
                <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-bold">4</span>
                  Client IDとClient Secretをコピー
                </h4>
                <ol className="list-none space-y-2 text-muted-foreground text-sm ml-8">
                  <li>左メニューの「<strong className="text-foreground">設定</strong>」をクリック</li>
                  <li>「資格情報」セクションが表示されます：</li>
                  <li className="ml-4">📋 <strong className="text-foreground">クライアントID</strong>（例：<code className="bg-muted px-1 rounded text-xs">67b4f4e9...</code>）→ コピーボタン 📋 で控える</li>
                  <li className="ml-4">🔑 <strong className="text-foreground">シークレット</strong>（目のアイコン 👁 で表示可能）→ コピーして控える</li>
                </ol>
                <Card className="mt-3 bg-red-50/50 dark:bg-red-950/10 border-red-200/50">
                  <CardContent className="p-2">
                    <p className="text-xs text-red-700 dark:text-red-400">
                      🔒 シークレットは他人に共有しないでください。漏洩した場合は「ローテーション」ボタンで再生成できます。
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Sub-step 2-5 */}
              <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-bold">5</span>
                  アプリをストアにインストール
                </h4>
                <ol className="list-none space-y-2 text-muted-foreground text-sm ml-8">
                  <li>Dev Dashboardのアプリ「概要」ページに戻る</li>
                  <li>右上の「<strong className="text-foreground">アプリをインストール</strong>」ボタンをクリック</li>
                  <li>Shopify管理画面にリダイレクトされ、権限の確認画面が表示されます</li>
                  <li>「<strong className="text-foreground">インストール</strong>」をクリックして完了</li>
                </ol>
                <Card className="mt-3 bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-200/50">
                  <CardContent className="p-2">
                    <p className="text-xs text-emerald-700 dark:text-emerald-400">
                      ✅ インストールが完了すると、Shopify管理画面の「アプリ」一覧に表示されます。
                    </p>
                  </CardContent>
                </Card>
              </div>
            </StepCard>

            <StepCard step={3} title="Printfulアプリをインストール" emoji="📲">
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground text-sm">
                <li>Shopify管理画面 → 左メニュー「アプリ」</li>
                <li>「Shopify App Store」で「Printful」を検索</li>
                <li>「インストール」をクリック</li>
                <li>Printfulアカウントでログイン</li>
                <li>連携を承認</li>
              </ol>
            </StepCard>

            <StepCard step={4} title="AIセレクトショップに設定" emoji="⚙️">
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground text-sm">
                <li>AIセレクトショップの「⚙️ 設定」タブを開く</li>
                <li>「🛍️ Shopify連携」セクションを見つける</li>
                <li>ストアドメイン（<code className="bg-muted px-1 rounded text-xs">your-store.myshopify.com</code>）を入力</li>
                <li>Client IDとClient Secretを入力</li>
                <li>「接続テスト」ボタンで確認</li>
                <li>ストア名と商品数が表示されたら連携完了！</li>
              </ol>
            </StepCard>

            <StepCard step={5} title="出品は全自動！" emoji="🔄">
              <p className="text-muted-foreground text-sm mb-3">
                Printful + Shopifyの両方を設定した状態で「出品」ボタンを押すと、<strong className="text-foreground">1クリックで両方に自動登録</strong>されます：
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
                <li>🖨️ <strong className="text-foreground">Printful</strong>に商品登録（印刷・発送用）</li>
                <li>🛍️ <strong className="text-foreground">Shopify</strong>に商品登録（販売・決済用）</li>
                <li>デザイン画像も自動でアップロード</li>
                <li>あとはお客様の注文を待つだけ！</li>
              </ul>
              <Card className="mt-3 bg-blue-50/50 dark:bg-blue-950/10 border-blue-200">
                <CardContent className="p-3">
                  <p className="text-xs text-blue-700 dark:text-blue-400">
                    💡 <strong>Shopify未設定でも出品可能：</strong>Printfulのみ設定している場合は、Printfulにだけ商品が登録されます。
                    「マイストア」がShopify連携ストア（実際の販売先）です。
                    Printfulダッシュボード左上のストア切り替えで確認できます。
                  </p>
                </CardContent>
              </Card>
            </StepCard>

            <StepCard step={6} title="決済設定" emoji="💳">
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground text-sm">
                <li>Shopify管理画面 →「設定」→「決済」</li>
                <li>「Shopify Payments」を有効化（日本対応）</li>
                <li>銀行口座情報を入力</li>
                <li>クレジットカード・コンビニ決済等が使えるようになる</li>
              </ol>
            </StepCard>

            <StepCard step={7} title="注文処理（全自動）" emoji="📦">
              <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                <li>お客様がShopifyストアで商品を購入</li>
                <li>Printfulに注文が自動送信される</li>
                <li>Printfulが印刷 → 梱包 → 発送</li>
                <li>追跡番号がお客様に自動通知</li>
                <li>あなたは何もしなくてOK！</li>
              </ul>
            </StepCard>
          </div>

          <Card className="mt-6 bg-green-50/50 dark:bg-green-950/10 border-green-200">
            <CardContent className="p-6">
              <h3 className="font-bold mb-2 text-green-800 dark:text-green-400">✅ 全体の流れ</h3>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                {['AIでデザイン生成', '→', '出品ボタン1クリック', '→', 'Printful + Shopifyに自動登録', '→', 'お客様が購入', '→', 'Printfulが自動で印刷・発送', '→', '利益がShopifyに入金'].map((item, i) => (
                  item === '→' ? 
                    <span key={i} className="text-green-500 font-bold">→</span> :
                    <Badge key={i} variant="outline" className="border-green-300 text-green-700 dark:text-green-400">{item}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 7: FAQ */}
        <section id="faq" className="mb-16 scroll-mt-20">
          <SectionHeader icon={<CheckCircle className="w-6 h-6" />} number={7} title="よくある質問" />
          
          <div className="space-y-4">
            {[
              { q: '初期費用はかかりますか？', a: 'NextraLabsのアカウント作成は無料です。全ツール使い放題プランは月額¥980。Printfulも登録無料で、注文が入った時のみ原価が発生します。' },
              { q: '在庫を持つ必要がありますか？', a: 'いいえ。Printfulのオンデマンド印刷なので、在庫は一切不要です。注文が入ってから1枚ずつ印刷・発送されます。' },
              { q: '海外にも発送できますか？', a: 'はい。Printfulは世界中に発送対応しています。Shopifyストアの配送設定で対象国を設定できます。' },
              { q: '返品・返金はどうなりますか？', a: 'Printfulの品質保証が適用されます。印刷不良・破損の場合は無料で再印刷。ストアの返品ポリシーはShopifyで設定できます。' },
              { q: 'デザインの著作権は？', a: 'AIで生成したデザインの商用利用は可能です。ただし、既存のブランドロゴや著作物に似たデザインの使用は避けてください。' },
              { q: '原価はいくらですか？', a: 'Tシャツ1枚あたり約$10.95〜（約¥1,600〜）+ 送料（日本国内約¥500〜）。販売価格との差額が利益になります。' },
              { q: '全ツール使い放題プランの解約はできますか？', a: 'はい。いつでも解約可能です。解約後も期間終了まではご利用いただけます。' },
            ].map((faq, i) => (
              <Card key={i}>
                <CardContent className="p-5">
                  <h3 className="font-bold mb-2 flex items-start gap-2">
                    <span className="text-amber-500">Q.</span>
                    {faq.q}
                  </h3>
                  <p className="text-sm text-muted-foreground pl-6">
                    <span className="text-blue-500 font-bold">A.</span> {faq.a}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">さあ、始めましょう！</h2>
            <p className="text-white/80 mb-6">
              AIの力で、あなただけのオリジナルブランドを今すぐ立ち上げよう。
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/signup" className="inline-flex items-center gap-2 bg-white text-amber-600 font-bold px-6 py-3 rounded-lg hover:bg-white/90 transition-colors">
                無料で登録する
              </Link>
              <Link href="/products" className="inline-flex items-center gap-2 bg-white/20 text-white font-bold px-6 py-3 rounded-lg hover:bg-white/30 transition-colors border border-white/30">
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
    <div className="flex items-center gap-3 mb-6 pb-3 border-b">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/10 text-amber-600">
        {icon}
      </div>
      <h2 className="text-2xl font-bold">
        <span className="text-amber-500">0{number}.</span> {title}
      </h2>
    </div>
  )
}

function StepCard({ step, title, emoji, children }: { step: number; title: string; emoji?: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500 text-white text-sm font-bold flex-shrink-0">
            {emoji || step}
          </span>
          <h3 className="font-bold text-lg">Step {step}: {title}</h3>
        </div>
        <div className="pl-11">
          {children}
        </div>
      </CardContent>
    </Card>
  )
}
