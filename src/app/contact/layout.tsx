import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'お問い合わせ | NextraLabs',
  description: 'NextraLabsへのお問い合わせフォーム。ご質問・ご要望・不具合報告はこちらから。通常24時間以内にご返答します。',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://nextralab.jp/contact' },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
