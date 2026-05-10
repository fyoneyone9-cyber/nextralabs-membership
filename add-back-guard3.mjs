import { readFileSync, writeFileSync } from 'fs'

const files = [
  'src/components/tools/KindleFactory.tsx',
  'src/components/tools/LoanAdvisor.tsx',
]

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

for (const file of files) {
  let src = readFileSync(file, 'utf-8')

  if (src.includes('popstate') || src.includes('handleBack')) {
    console.log(`⏭️  SKIP (already done): ${file}`)
    continue
  }

  // useRouter import
  if (!src.includes('useRouter')) {
    src = src.replace(/('use client'\n)/, `$1import { useRouter } from 'next/navigation'\n`)
    src = src.replace(/(\uFEFF'use client'\n)/, `$1import { useRouter } from 'next/navigation'\n`)
  }

  // useCallback/useEffect import
  src = src.replace(
    /import\s+(?:React,\s*)?\{([^}]+)\}\s+from\s+'react'/,
    (m, inner) => {
      const parts = inner.split(',').map(s => s.trim()).filter(Boolean)
      if (!parts.includes('useCallback')) parts.push('useCallback')
      if (!parts.includes('useEffect')) parts.push('useEffect')
      const prefix = m.startsWith('import React') ? 'import React, ' : 'import '
      return `${prefix}{ ${parts.join(', ')} } from 'react'`
    }
  )

  // export function XXX() { パターン
  const fnMatch = src.match(/export (?:default )?function \w+[^{]*\{/)
  if (!fnMatch) {
    console.log(`⚠️  SKIP (no fn found): ${file}`)
    continue
  }
  const insertPos = src.indexOf(fnMatch[0]) + fnMatch[0].length
  src = src.slice(0, insertPos) + backGuardCode + src.slice(insertPos)

  if (src.includes('<div className="h-1 bg-emerald-500 w-full" />')) {
    src = src.replace(
      '<div className="h-1 bg-emerald-500 w-full" />',
      '<div className="h-1 bg-emerald-500 w-full" />' + backBtn
    )
  }

  writeFileSync(file, src, 'utf-8')
  console.log(`✅ DONE: ${file}`)
}
