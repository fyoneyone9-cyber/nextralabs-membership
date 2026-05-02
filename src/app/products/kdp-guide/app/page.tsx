import KdpGuide from '@/components/tools/KdpGuide'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kindle出版手順ナビ | NextraLabs',
  description: 'Amazon Kindle出版の手順をステップ形式でガイド。アカウント設定から出版申請まで迷わず進められる。',
}

export default function KdpGuideAppPage() {
  return <KdpGuide />
}
