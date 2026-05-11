import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const files = [
  'src/components/tools/BuzzWriter.tsx',
  'src/components/tools/ClosetCoach.tsx',
  'src/components/tools/CommCoach.tsx',
  'src/components/tools/ExamScheduler.tsx',
  'src/components/tools/KindleFactory.tsx',
  'src/components/tools/LoanAdvisor.tsx',
  'src/components/tools/LocationFinder.tsx',
  'src/components/tools/MoneyGuard.tsx',
  'src/components/tools/MovingChecker.tsx',
  'src/components/tools/PetTranslator.tsx',
  'src/components/tools/PromptMaster.tsx',
  'src/components/tools/ResignationAssistant.tsx',
  'src/components/tools/ShioTaiou.tsx',
  'src/components/tools/SmartGardening.tsx',
  'src/components/tools/YoutubeCoordinatorSystem.tsx',
]

const IMPORT_LINE = "import { useRouter } from 'next/navigation'"

for (const rel of files) {
  const full = join(process.cwd(), rel)
  // UTF-8のまま読み込み（BOMあり・なし両対応）
  const buf = readFileSync(full)
  let text = buf.toString('utf8')

  // 既にimportがあればスキップ
  if (text.includes("from 'next/navigation'") || text.includes('from "next/navigation"')) {
    console.log(`SKIP (already has next/navigation): ${rel}`)
    continue
  }

  // useRouter() を使っていなければスキップ
  if (!text.includes('useRouter()')) {
    console.log(`SKIP (no useRouter): ${rel}`)
    continue
  }

  // BOM除去せずそのまま、最初の "import React" 行の次にimportを挿入
  const lines = text.split('\n')
  let inserted = false
  const newLines = []
  for (const line of lines) {
    newLines.push(line)
    if (!inserted && line.match(/^import React/)) {
      newLines.push(IMPORT_LINE)
      inserted = true
    }
  }

  if (!inserted) {
    console.log(`WARN: import React not found, prepending: ${rel}`)
    newLines.unshift(IMPORT_LINE)
  }

  const newText = newLines.join('\n')
  // 元のバッファと同じエンコーディングで書き戻し（BOM保持）
  writeFileSync(full, newText, 'utf8')
  console.log(`FIXED: ${rel}`)
}

console.log('Done.')
