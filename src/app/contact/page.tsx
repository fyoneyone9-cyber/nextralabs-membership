import Script from 'next/script'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'お問い合わせ | NextraLabs',
  description: 'NextraLabs AIツールストアへのお問い合わせはこちらから。',
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link
        href="/"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        トップに戻る
      </Link>

      <h1 className="text-3xl font-bold mb-2">📩 お問い合わせ</h1>
      <p className="text-muted-foreground mb-8">
        ご質問・ご要望・不具合報告など、お気軽にお問い合わせください。
        <br />
        通常1〜2営業日以内にご返信いたします。
      </p>

      {/* formrun embed */}
      <div
        className="formrun-embed"
        data-formrun-form="@f-yoneyone--ABUwdyWcQYQjoKio9JKu"
        data-formrun-redirect="true"
      />

      <Script
        src="https://sdk.form.run/js/v2/embed.js"
        strategy="afterInteractive"
      />
    </div>
  )
}
