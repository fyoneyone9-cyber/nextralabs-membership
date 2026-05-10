import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'

const productsDir = 'src/app/products'
const tools = readdirSync(productsDir)

const SKIP = ['sns-auto-poster'] // 手動対応済み

let modified = 0
let skipped = 0

const backGuardCode = `
  const router = useRouter()

  // ブラウザバック・マウスサイドボタン対応
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const handlePopState = () => {
      const ok = window.confirm('ツールを終了しますか？')
      if (ok) {
        router.push('/dashboard')
      } else {
        window.history.pushState(null, '', window.location.href)
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [router])

  // タブ閉じ・URL直打ち対応
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  const handleBack = useCallback(() => {
    const ok = window.confirm('ツールを終了しますか？')
    if (ok) router.push('/dashboard')
  }, [router])
`

const backBtn = `
      {/* 戻るボタン */}
      <div className="max-w-3xl mx-auto px-4 pt-4">
        <button onClick={handleBack} className="flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-400 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
          ダッシュボードへ戻る
        </button>
      </div>
`

for (const toolName of tools) {
  if (SKIP.includes(toolName)) {
    console.log(`⏭️  SKIP (already done): ${toolName}`)
    skipped++
    continue
  }

  const file = join(productsDir, toolName, 'app', 'page.tsx')
  if (!existsSync(file)) {
    console.log(`⏭️  SKIP (no app/page.tsx): ${toolName}`)
    skipped++
    continue
  }

  let src = readFileSync(file, 'utf-8')

  if (src.includes('popstate') || src.includes('handleBack')) {
    console.log(`⏭️  SKIP (already has back guard): ${toolName}`)
    skipped++
    continue
  }

  if (!src.includes("'use client'") && !src.includes('"use client"')) {
    console.log(`⏭️  SKIP (not client component): ${toolName}`)
    skipped++
    continue
  }

  // 1. useRouter import追加
  if (!src.includes('useRouter')) {
    src = src.replace(
      /('use client')/,
      `$1\nimport { useRouter } from 'next/navigation'`
    )
    src = src.replace(
      /(\uFEFF'use client')/,
      `$1\nimport { useRouter } from 'next/navigation'`
    )
  }

  // 2. useCallback をimportに追加
  if (!src.includes('useCallback')) {
    src = src.replace(
      /import React,\s*\{([^}]+)\}\s*from\s*'react'/,
      (m, inner) => {
        const parts = inner.split(',').map(s => s.trim()).filter(Boolean)
        if (!parts.includes('useCallback')) parts.push('useCallback')
        if (!parts.includes('useEffect')) parts.push('useEffect')
        return `import React, { ${parts.join(', ')} } from 'react'`
      }
    )
    // React単体import ({ なし) のパターン
    if (!src.includes('useCallback')) {
      src = src.replace(
        /import\s*\{([^}]+)\}\s*from\s*'react'/,
        (m, inner) => {
          const parts = inner.split(',').map(s => s.trim()).filter(Boolean)
          if (!parts.includes('useCallback')) parts.push('useCallback')
          if (!parts.includes('useEffect')) parts.push('useEffect')
          if (!parts.includes('useRouter')) {} // useRouter is from next
          return `import { ${parts.join(', ')} } from 'react'`
        }
      )
    }
  }

  // 3. export default function の直後にhooks注入
  const fnMatch = src.match(/export default function \w+[^{]*\{/)
  if (!fnMatch) {
    console.log(`⚠️  SKIP (no default export fn): ${toolName}`)
    skipped++
    continue
  }
  const insertPos = src.indexOf(fnMatch[0]) + fnMatch[0].length
  src = src.slice(0, insertPos) + backGuardCode + src.slice(insertPos)

  // 4. 戻るボタンUIを挿入（emeraldバー直後）
  if (src.includes('<div className="h-1 bg-emerald-500 w-full" />')) {
    src = src.replace(
      '<div className="h-1 bg-emerald-500 w-full" />',
      '<div className="h-1 bg-emerald-500 w-full" />' + backBtn
    )
  }

  writeFileSync(file, src, 'utf-8')
  console.log(`✅ DONE: ${toolName}`)
  modified++
}

console.log(`\n📊 完了: ${modified}件修正, ${skipped}件スキップ`)
