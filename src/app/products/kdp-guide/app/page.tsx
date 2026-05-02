import KdpGuide from '@/components/tools/KdpGuide'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'KDP出版ナビ | NextraLabs',
  description: 'Amazon Kindle出版（KDP）の手順をステップ形式でガイド。アカウント設定から出版申請まで迷わず進められる。',
}

export default function KdpGuideAppPage() {
  return <KdpGuide />
}
