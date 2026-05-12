import { Metadata } from 'next'
import dynamic from 'next/dynamic'

export const metadata: Metadata = {
  title: 'Google天気連動型 館内消費ブースト | 悪天候を売上に変えるホテルDXツール',
  description: '雨が降り出した瞬間、滞在中のゲストへバー・売店・スパのクーポンを自動送信。天気APIとLINE/メール通知で「不運な天気」をホテルの収益チャンスに変えます。',
  keywords: ['ホテルDX', '天気API', '館内消費', 'クーポン自動送信', 'LINE通知', 'ゲスト体験'],
  alternates: {
    canonical: 'https://nextralab.jp/products/weather-boost',
  },
  openGraph: {
    title: 'Google天気連動型 館内消費ブースト | NextraLabs',
    description: '雨が降り出した瞬間、滞在中のゲストへバー・売店・スパのクーポンを自動送信。悪天候を売上機会に変えるホテルDXツール。',
    url: 'https://nextralab.jp/products/weather-boost',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: 'https://nextralab.jp/og-image.png', width: 1200, height: 630, alt: 'Google天気連動型 館内消費ブースト' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Google天気連動型 館内消費ブースト | NextraLabs',
    description: '雨が降り出した瞬間、滞在中のゲストへクーポンを自動送信。悪天候を売上に変えるホテルDXツール。',
    images: ['https://nextralab.jp/og-image.png'],
  },
}

const WeatherBoostLP = dynamic(() => import('@/components/tools/WeatherBoostLP'), { ssr: false })

export default function Page() {
  return <WeatherBoostLP />
}
