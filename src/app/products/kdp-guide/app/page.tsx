import KdpGuide from '@/components/tools/KdpGuide'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kindle出版手順ナビ | NextraLabs',
  description: 'Amazon Kindleでの出版手順をステップ形式でガイド。アカウント設定から原稿作成・価格設定・出版申請まで迷わず進められる。',
}

export default function KdpGuideAppPage() {
  return <KdpGuide />
}
