import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'プライバシーポリシー | NextraLabs',
  description: 'NextraLabs AIツールストアのプライバシーポリシー',
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link
        href="/"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        トップに戻る
      </Link>

      <h1 className="text-3xl font-bold mb-2">🔒 プライバシーポリシー</h1>
      <p className="text-sm text-muted-foreground mb-8">最終更新日: 2026年4月29日</p>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-bold mb-3">1. はじめに</h2>
          <p className="text-muted-foreground leading-relaxed">
            NextraLabs（以下「当社」）は、「NextraLabs AI Tool Store」（以下「本サービス」）をご利用いただくユーザーの個人情報の保護を重要視しています。
            本プライバシーポリシーは、当社が収集する情報の種類、利用目的、管理方法について説明します。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">2. 収集する情報</h2>
          <h3 className="text-lg font-semibold mt-4 mb-2">2.1 アカウント登録時</h3>
          <ul className="list-disc pl-5 text-muted-foreground space-y-1">
            <li>メールアドレス</li>
            <li>パスワード（ハッシュ化して保存）</li>
            <li>表示名（任意）</li>
          </ul>

          <h3 className="text-lg font-semibold mt-4 mb-2">2.2 決済時</h3>
          <ul className="list-disc pl-5 text-muted-foreground space-y-1">
            <li>決済情報はStripe社が直接管理し、当社はクレジットカード番号等を保持しません</li>
            <li>購入履歴（商品ID、日時、金額）</li>
          </ul>

          <h3 className="text-lg font-semibold mt-4 mb-2">2.3 お問い合わせ時</h3>
          <ul className="list-disc pl-5 text-muted-foreground space-y-1">
            <li>お名前</li>
            <li>メールアドレス</li>
            <li>お問い合わせ内容</li>
          </ul>

          <h3 className="text-lg font-semibold mt-4 mb-2">2.4 ツール利用時</h3>
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-sm">
            <p className="font-bold text-green-600 dark:text-green-400 mb-1">✅ ツールのデータは収集しません</p>
            <p className="text-muted-foreground">
              各AIツールで入力されたデータ（メッセージ、診断回答、チェックリスト等）は、すべてお使いのブラウザ内（localStorage）にのみ保存されます。
              当社のサーバーに送信・保存されることはありません。
            </p>
          </div>

          <h3 className="text-lg font-semibold mt-4 mb-2">2.5 自動収集情報</h3>
          <ul className="list-disc pl-5 text-muted-foreground space-y-1">
            <li>アクセスログ（IPアドレス、ブラウザ情報、アクセス日時）</li>
            <li>Cookie（セッション管理、認証状態の維持に使用）</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">3. 利用目的</h2>
          <p className="text-muted-foreground mb-2">収集した情報は以下の目的で利用します。</p>
          <ul className="list-disc pl-5 text-muted-foreground space-y-1">
            <li>本サービスの提供・運営・改善</li>
            <li>ユーザー認証・アカウント管理</li>
            <li>決済処理・購入履歴の管理</li>
            <li>お問い合わせへの対応</li>
            <li>サービスに関するお知らせの送付</li>
            <li>不正利用の防止・セキュリティの確保</li>
            <li>利用状況の分析（サービス改善のため）</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">4. 第三者への提供</h2>
          <p className="text-muted-foreground leading-relaxed mb-2">
            当社は、以下の場合を除き、ユーザーの個人情報を第三者に提供しません。
          </p>
          <ul className="list-disc pl-5 text-muted-foreground space-y-1">
            <li>ユーザーの同意がある場合</li>
            <li>法令に基づく場合（裁判所の命令等）</li>
            <li>人の生命・身体・財産の保護のために必要な場合</li>
          </ul>

          <h3 className="text-lg font-semibold mt-4 mb-2">利用する外部サービス</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-medium">サービス</th>
                  <th className="text-left py-2 px-3 font-medium">提供元</th>
                  <th className="text-left py-2 px-3 font-medium">利用目的</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b">
                  <td className="py-2 px-3">Supabase</td>
                  <td className="py-2 px-3">Supabase Inc.</td>
                  <td className="py-2 px-3">認証・データベース</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-3">Stripe</td>
                  <td className="py-2 px-3">Stripe, Inc.</td>
                  <td className="py-2 px-3">決済処理</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-3">Vercel</td>
                  <td className="py-2 px-3">Vercel Inc.</td>
                  <td className="py-2 px-3">ホスティング</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-3">Resend</td>
                  <td className="py-2 px-3">Resend Inc.</td>
                  <td className="py-2 px-3">メール送信</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">5. データの保護</h2>
          <ul className="list-disc pl-5 text-muted-foreground space-y-1">
            <li>通信はSSL/TLSにより暗号化されています</li>
            <li>パスワードはハッシュ化して保存しています</li>
            <li>決済情報はStripe社のPCI DSS準拠環境で処理されます</li>
            <li>データベースへのアクセスはRow Level Security（RLS）で制御しています</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">6. Cookieについて</h2>
          <p className="text-muted-foreground leading-relaxed">
            本サービスでは、認証状態の維持およびセッション管理のためにCookieを使用しています。
            ブラウザの設定によりCookieを無効にすることができますが、一部の機能が利用できなくなる場合があります。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">7. ユーザーの権利</h2>
          <p className="text-muted-foreground mb-2">ユーザーは以下の権利を有します。</p>
          <ul className="list-disc pl-5 text-muted-foreground space-y-1">
            <li><strong>開示請求:</strong> 当社が保有する個人情報の開示を求めることができます</li>
            <li><strong>訂正・削除:</strong> 個人情報の訂正または削除を求めることができます</li>
            <li><strong>利用停止:</strong> 個人情報の利用停止を求めることができます</li>
            <li><strong>アカウント削除:</strong> アカウントの削除を依頼することができます</li>
          </ul>
          <p className="text-muted-foreground mt-2">
            上記の請求は、<Link href="/contact" className="text-primary hover:underline">お問い合わせフォーム</Link>よりご連絡ください。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">8. 未成年者の利用</h2>
          <p className="text-muted-foreground leading-relaxed">
            本サービスは、原則として18歳以上の方を対象としています。
            18歳未満の方は、保護者の同意を得た上でご利用ください。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">9. ポリシーの変更</h2>
          <p className="text-muted-foreground leading-relaxed">
            当社は、必要に応じて本プライバシーポリシーを変更することがあります。
            重要な変更がある場合は、本サービス上で通知します。
          </p>
        </section>

        <section className="border-t pt-6">
          <h2 className="text-xl font-bold mb-3">お問い合わせ</h2>
          <p className="text-muted-foreground">
            本プライバシーポリシーに関するお問い合わせは、以下までご連絡ください。
          </p>
          <div className="text-muted-foreground mt-2 space-y-1">
            <p><strong>事業者名:</strong> NextraLabs（個人事業）</p>
            <p><strong>代表者:</strong> 米山 文貴</p>
            <p><strong>メール:</strong> f.yoneyone9@gmail.com</p>
            <p><strong>お問い合わせ:</strong> <Link href="/contact" className="text-primary hover:underline">お問い合わせフォーム</Link></p>
          </div>
        </section>
      </div>
    </div>
  )
}
