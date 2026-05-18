import Link from 'next/link'
import { Youtube } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-emerald-400">
              NextraLabs AI Tool Store
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              AIを活用した業務効率化・自動化ツールを開発・販売しています。
            </p>
            <a
              href="https://www.youtube.com/@NextraLab"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 text-xs font-medium transition-all"
            >
              <Youtube size={14} />
              公式YouTube チャンネル
            </a>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">リンク</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/products" className="hover:text-primary transition-colors">ツール一覧</Link></li>
              <li><Link href="/tool-guide" className="hover:text-primary transition-colors">ツール説明</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors">料金プラン</Link></li>
              <li><Link href="/interview" className="hover:text-primary transition-colors">代表インタビュー</Link></li>
              <li><a href="https://nextralabos.booth.pm/items/8321436" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">公式BOOTHショップ ↗</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">サポート</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/terms" className="hover:text-primary transition-colors">利用規約</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">プライバシーポリシー</Link></li>
              <li><Link href="/tokusho" className="hover:text-primary transition-colors">特定商取引法に基づく表記</Link></li>
              <li><Link href="/enterprise" className="hover:text-primary transition-colors">法人向け相談</Link></li>
            </ul>
            <h4 className="text-sm font-semibold mt-6 mb-3">関連サービス</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="https://ai-adult.jp" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">
                  NextraLabsAdult ↗
                </a>
              </li>
              <li>
                <a href="https://marriage-road-site.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">
                  マレッジロードジャパン ↗
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground flex flex-wrap items-center justify-center gap-3">
          <span>© {new Date().getFullYear()} NextraLabs. All rights reserved.</span>

        </div>
      </div>
    </footer>
  )
}