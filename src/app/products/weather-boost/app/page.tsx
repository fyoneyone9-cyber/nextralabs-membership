import { Metadata } from 'next'
import dynamic from 'next/dynamic'

export const metadata: Metadata = {
  title: 'Google天気連動型 館内消費ブースト | ダッシュボード',
  description: '天気トリガー設定・オファー管理・送信履歴をリアルタイムで管理するホテルDXツール。',
}

const WeatherBoostApp = dynamic(() => import('@/components/tools/WeatherBoostApp'), { ssr: false })

export default function Page() {
  return <WeatherBoostApp />
}
