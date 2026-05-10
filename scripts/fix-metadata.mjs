import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'

const base = new URL('../src/app/products/', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')
const repoRoot = new URL('..', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')

const slugs = ['buzz-writer','closet-coach','comm-coach','pet-translator','resignation-assistant','shio-taiou','ai-exam-generator','staysee-ai-finder']

for (const slug of slugs) {
  const filePath = join(base, slug, 'page.tsx')
  if (!existsSync(filePath)) { console.log('Not found:', slug); continue }

  // HEADのgit内容を取得
  let content
  try {
    content = execSync(`git show HEAD:src/app/products/${slug}/page.tsx`, {
      cwd: repoRoot.replace(/\\/g, '/'),
      encoding: 'buffer'
    }).toString('utf8')
  } catch {
    content = readFileSync(filePath, 'utf8')
  }

  const lines = content.split('\n')
  const fixed = []
  let i = 0
  let insideMetadata = false
  let braceDepth = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    // metadataブロックの開始検出
    if (trimmed.startsWith('export const metadata')) {
      insideMetadata = true
      braceDepth = 0
    }

    if (insideMetadata) {
      braceDepth += (line.match(/\{/g) || []).length
      braceDepth -= (line.match(/\}/g) || []).length
      if (braceDepth <= 0) insideMetadata = false
    }

    // 問題パターン: alternates閉じの直後に title: が孤立している
    // → その前に openGraph: { を挿入
    if (
      insideMetadata &&
      trimmed.startsWith("title: '") &&
      fixed.length > 0 &&
      (fixed[fixed.length-1].trim() === '},' || fixed[fixed.length-1].trim() === '},')
    ) {
      // 直前がalternatesかtwitter以外の閉じなら openGraph: { を挿入
      const prevContent = fixed.slice(-5).join('\n')
      const hasAlternates = prevContent.includes('canonical:')
      const hasOG = prevContent.includes('openGraph:')
      if (hasAlternates && !hasOG) {
        const indent = line.match(/^(\s*)/)[1]
        fixed.push(indent + 'openGraph: {')
        // この孤立したtitle〜から始まるブロックをopenGraphに入れる
        // },で終わるまでを収集してopenGraph: { ... }として閉じる
        let j = i
        let innerDepth = 1
        while (j < lines.length && innerDepth > 0) {
          const l = lines[j]
          fixed.push(l)
          innerDepth += (l.match(/\{/g) || []).length
          innerDepth -= (l.match(/\}/g) || []).length
          j++
        }
        // openGraphの閉じ } を追加（すでに }, で閉じているはず）
        i = j
        console.log(`  → Inserted openGraph: { for slug ${slug} around line ${i}`)
        continue
      }
    }

    // twitter重複除去: twitter: { ... } が2回出たら2回目を削除
    fixed.push(line)
    i++
  }

  // twitter重複チェック
  const result = fixed.join('\n')
  const twitterMatches = result.match(/\n\s*twitter:\s*\{/g) || []
  if (twitterMatches.length >= 2) {
    console.log(`  → twitter duplicate found in ${slug}, removing second`)
    // 2回目のtwitter: { ... } を除去
    const firstIdx = result.indexOf('\n  twitter:')
    const secondIdx = result.indexOf('\n  twitter:', firstIdx + 1)
    if (secondIdx !== -1) {
      // secondIdxから次の },まで削除
      const afterSecond = result.indexOf('\n  }', secondIdx)
      const cleaned = result.substring(0, secondIdx) + result.substring(afterSecond + 4)
      writeFileSync(filePath, cleaned, 'utf8')
      console.log('Fixed (twitter dup):', slug)
      continue
    }
  }

  if (result !== readFileSync(filePath, 'utf8')) {
    writeFileSync(filePath, result, 'utf8')
    console.log('Fixed:', slug)
  } else {
    console.log('No change needed:', slug)
  }
}
