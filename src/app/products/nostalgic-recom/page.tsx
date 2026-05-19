import { Metadata } from 'next'
import dynamic from 'next/dynamic'

export const metadata: Metadata = {
  title: 'あの頃の僕へ タイムトラベルレコメンド | AIが青春時代の名作を発掘',
  description: '○年前の自分が夢中になった作品に、AIが再会させてくれる。年代とジャンルを選ぶだけで、あなたの青春時代の名作を厳選レコメンド。',
  keywords: ['タイムトラベル', 'レコメンド', '青春', '名作', 'AI', 'レトロ', '懐かしい', '音楽', '映画', 'アニメ', 'ゲーム'],
  alternates: {
    canonical: 'https://nextralab.jp/products/nostalgic-recom',
  },
  openGraph: {
    title: 'あの頃の僕へ タイムトラベルレコメンド | NextraLabs',
    description: '○年前の青春に戻る。AIがあなたの時代の名作を発掘します。',
    url: 'https://nextralab.jp/products/nostalgic-recom',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: 'https://nextralab.jp/og-image.png', width: 1200, height: 630, alt: 'あの頃の僕へ' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'あの頃の僕へ タイムトラベルレコメンド | NextraLabs',
    description: '○年前の青春に戻る。AIがあなたの時代の名作を発掘します。',
    images: ['https://nextralab.jp/og-image.png'],
  },
}

const NostalgicRecomLP = dynamic(() => import('@/components/tools/NostalgicRecomLP'), { ssr: false })

export default function Page() {
  return <NostalgicRecomLP />
}
