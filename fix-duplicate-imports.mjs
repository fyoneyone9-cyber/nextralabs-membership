import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'

const targets = [
  'src/app/products/ai-select-shop/app/page.tsx',
  'src/app/products/ai-sidejob/app/page.tsx',
  'src/app/products/dms/app/page.tsx',
  'src/app/products/kdp-guide/app/page.tsx',
  'src/app/products/youtube-producer/app/page.tsx',
  'src/app/products/ai-exam-generator/app/page.tsx',
  'src/app/products/staysee-ai-finder/app/page.tsx',
  'src/app/products/travel-concierge/app/page.tsx',
  'src/app/products/universal-converter/app/page.tsx',
]

const compDir = 'src/components/tools'
const compFiles = readdirSync(compDir).map(f => join(compDir, f))
const allFiles = [...targets, ...compFiles]

let fixed = 0

for (const file of allFiles) {
  if (!existsSync(file)) continue
  if (!file.endsWith('.tsx') && !file.endsWith('.ts')) continue

  let src = readFileSync(file, 'utf-8')
  let changed = false

  // 1. useRouter import の重複除去（2行目以降を消す）
  const importPattern = "import { useRouter } from 'next/navigation'"
  const lines = src.split('\n')
  let useRouterSeen = false
  let routerDeclSeen = false
  const newLines = lines.filter(line => {
    // useRouter import の重複（セミコロンあり・なし両対応）
    const trimmed = line.trim().replace(/;$/, '')
    if (trimmed === importPattern) {
      if (useRouterSeen) { changed = true; return false }
      useRouterSeen = true
      return true
    }
    // const router = useRouter() の重複
    if (trimmed === 'const router = useRouter()') {
      if (routerDeclSeen) { changed = true; return false }
      routerDeclSeen = true
      return true
    }
    return true
  })

  if (changed) {
    writeFileSync(file, newLines.join('\n'), 'utf-8')
    fixed++
    console.log(`✅ Fixed: ${file}`)
  }
}

console.log(`\n📊 完了: ${fixed}件修正`)
