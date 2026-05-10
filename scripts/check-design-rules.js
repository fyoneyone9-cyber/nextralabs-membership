#!/usr/bin/env node
/**
 * NextraLabs デザイン憲法チェッカー
 * 実行: node scripts/check-design-rules.js
 * pre-commit フックから自動呼び出し
 *
 * 検出対象:
 *   [RULE-1] 最外層 min-h-screen に border-* クラス → 大枠枠線禁止法
 *   [RULE-2] 最外層 min-h-screen に rounded-[Xrem] → 大枠丸め禁止
 *   [RULE-3] bg-slate-950 → bg-[#050507] に統一
 *   [RULE-4] 最外層 min-h-screen に emerald border/shadow → 大枠エメラルド禁止法
 */

const fs = require('fs')
const path = require('path')

const SRC_DIR = path.join(__dirname, '..', 'src')

// ロック済みツール（変更禁止 — チェックのみ、エラーにしない）
const LOCKED_TOOLS = [
  'exam-scheduler', 'kindle-factory', 'smart-gardening', 'location-finder',
  'prompt-master', 'shopping-stopper', 'moving-checker', 'scam-defender',
  'money-guard', 'sns-auto-poster', 'ai-recipe', 'kdp-guide',
  'universal-converter', 'kindle-ai-factory',
]

function isLockedFile(filePath) {
  return LOCKED_TOOLS.some(t => filePath.includes(t))
}

function getAllTsxFiles(dir) {
  const results = []
  const items = fs.readdirSync(dir, { withFileTypes: true })
  for (const item of items) {
    const full = path.join(dir, item.name)
    if (item.isDirectory() && item.name !== 'node_modules' && item.name !== '_backup_20260510') {
      results.push(...getAllTsxFiles(full))
    } else if (item.isFile() && item.name.endsWith('.tsx')) {
      results.push(full)
    }
  }
  return results
}

// コンフリクトマーカーチェック（全行・全ファイル対象）
function checkConflictMarkers(filePath, rel) {
  const lines = fs.readFileSync(filePath, 'utf8').split('\n')
  let found = 0
  for (let i = 0; i < lines.length; i++) {
    if (/^(<{7}|>{7}|={7})/.test(lines[i])) {
      console.error(`❌ [RULE-0/CONFLICT] ${rel}:${i + 1}`)
      console.error(`   ${lines[i].slice(0, 60)}`)
      console.error(`   → Gitコンフリクトマーカーが残っています。解消してからコミットしてください。`)
      found++
    }
  }
  return found
}

const RULES = [
  {
    id: 'RULE-1',
    desc: '最外層(min-h-screen)に border-* クラス使用禁止（灰色枠・任意色枠）',
    test: (line) => line.includes('min-h-screen') && /\bborder-\d/.test(line),
  },
  {
    id: 'RULE-2',
    desc: '最外層(min-h-screen)に rounded-[Xrem] 使用禁止（大枠丸め）',
    test: (line) => line.includes('min-h-screen') && /rounded-\[\d+rem\]/.test(line),
  },
  {
    id: 'RULE-3',
    desc: 'bg-slate-950 使用禁止 → bg-[#050507] に統一',
    test: (line) => line.includes('min-h-screen') && line.includes('bg-slate-950'),
  },
  {
    id: 'RULE-4',
    desc: '最外層(min-h-screen)に emerald border/shadow 使用禁止（大枠エメラルド禁止法）',
    test: (line) => line.includes('min-h-screen') && (
      /border-emerald/.test(line) ||
      /shadow.*emerald/.test(line) ||
      /rgba\(16,185,129/.test(line)
    ),
  },
]

let errors = 0
let warnings = 0
const files = getAllTsxFiles(SRC_DIR)

for (const filePath of files) {
  const rel = path.relative(SRC_DIR, filePath)
  const locked = isLockedFile(filePath)

  // RULE-0: コンフリクトマーカーチェック（ロック済みも含む全ファイル）
  errors += checkConflictMarkers(filePath, rel)

  const lines = fs.readFileSync(filePath, 'utf8').split('\n')

  for (let i = 0; i < Math.min(lines.length, 120); i++) {
    const line = lines[i]
    for (const rule of RULES) {
      if (rule.test(line)) {
        if (locked) {
          console.log(`⚠️  [LOCKED/${rule.id}] ${rel}:${i + 1}`)
          console.log(`   ${line.trim().slice(0, 100)}`)
          warnings++
        } else {
          console.error(`❌ [${rule.id}] ${rel}:${i + 1}`)
          console.error(`   ${line.trim().slice(0, 100)}`)
          console.error(`   → ${rule.desc}`)
          errors++
        }
      }
    }
  }
}

console.log('')
console.log(`✅ チェック完了: ${files.length} ファイル`)
if (errors > 0) {
  console.error(`❌ エラー: ${errors} 件 — コミット前に修正してください`)
  process.exit(1)
} else if (warnings > 0) {
  console.log(`⚠️  警告(ロック済み): ${warnings} 件`)
  process.exit(0)
} else {
  console.log('🎉 全ルール準拠 — コミット OK')
  process.exit(0)
}
