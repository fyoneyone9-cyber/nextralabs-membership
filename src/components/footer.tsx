import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              NextraLabs AI Tool Store
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              AIを活用した業務効率化・自動化ツールを開発・販売しています。
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">リンク</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/products" className="hover:text-primary transition-colors">ツール一覧</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors">料金プラン</Link></li>
              <li><Link href="/signup" className="hover:text-primary transition-colors">会員登録</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">サポート</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/terms" className="hover:text-primary transition-colors">利用規約</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">プライバシーポリシー</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">お問い合わせ</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} NextraLabs. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
