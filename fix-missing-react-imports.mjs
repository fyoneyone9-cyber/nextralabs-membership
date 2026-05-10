import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'

// app/page.tsx と components/tools/*.tsx 全部チェック
const appFiles = []
const productsDir = 'src/app/products'
for (const tool of readdirSync(productsDir)) {
  const f = join(productsDir, tool, 'app', 'page.tsx')
  if (existsSync(f)) appFiles.push(f)
}
const compDir = 'src/components/tools'
const compFiles = readdirSync(compDir)
  .filter(f => f.endsWith('.tsx') || f.endsWith('.ts'))
  .map(f => join(compDir, f))

const allFiles = [...appFiles, ...compFiles]

let fixed = 0

for (const file of allFiles) {
  let src = readFileSync(file, 'utf-8')

  // useEffect または useCallback を使っているのに import がない場合
  const usesEffect = src.includes('useEffect(')
  const usesCallback = src.includes('useCallback(')

  if (!usesEffect && !usesCallback) continue

  // すでに react から import されているか確認
  const hasReactImport = /from\s+'react'/.test(src)
  const importedFromReact = src.match(/import\s+(?:React,\s*)?\{([^}]+)\}\s+from\s+'react'/)

  if (importedFromReact) {
    const inner = importedFromReact[1]
    const parts = inner.split(',').map(s => s.trim()).filter(Boolean)
    let changed = false
    if (usesEffect && !parts.includes('useEffect')) { parts.push('useEffect'); changed = true }
    if (usesCallback && !parts.includes('useCallback')) { parts.push('useCallback'); changed = true }
    if (changed) {
      const prefix = importedFromReact[0].startsWith('import React') ? 'import React, ' : 'import '
      src = src.replace(importedFromReact[0], `${prefix}{ ${parts.join(', ')} } from 'react'`)
      writeFileSync(file, src, 'utf-8')
      console.log(`✅ Fixed existing import: ${file}`)
      fixed++
    }
  } else if (!hasReactImport) {
    // react import が全くない → 追加
    const needed = []
    if (usesEffect) needed.push('useEffect')
    if (usesCallback) needed.push('useCallback')
    src = src.replace(
      /('use client'\n)/,
      `$1import { ${needed.join(', ')} } from 'react'\n`
    )
    src = src.replace(
      /(\uFEFF'use client'\n)/,
      `$1import { ${needed.join(', ')} } from 'react'\n`
    )
    writeFileSync(file, src, 'utf-8')
    console.log(`✅ Added new import: ${file}`)
    fixed++
  }
}

console.log(`\n📊 完了: ${fixed}件修正`)
