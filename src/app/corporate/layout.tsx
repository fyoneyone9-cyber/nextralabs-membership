import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '法人プラン | NextraLabs — AIツールをチームに導入',
  description: 'NextraLabsの法人向けプラン。AIツール30種類以上をチーム全員で活用。スターター・スタンダード・エンタープライズの3プランから、御社の規模に合わせてご提案します。',
}

export default function CorporateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
