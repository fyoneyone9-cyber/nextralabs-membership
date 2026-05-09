// ============================================================
// 🔒 LOCKED — KindleFactory app/page
// 完成済みツール。NextraLabs様の明示的な指示なしに
// このファイルを編集・削除・移動することを禁止する。
// Locked: 2026-05-10
// ============================================================
import { AccessGate } from '@/components/tools/AccessGate'
import { KindleFactory } from '@/components/tools/KindleFactory'

export default function KindleFactoryAppPage() {
  return (
    <AccessGate productId="kindle-factory">
      <KindleFactory />
    </AccessGate>
  )
}
