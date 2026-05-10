const fs = require('fs')
const path = require('path')

const prodDir = 'src/app/products'
const slugs = ['buzz-writer','closet-coach','comm-coach','pet-translator','resignation-assistant','shio-taiou','ai-exam-generator','staysee-ai-finder']

slugs.forEach(slug => {
  const filePath = path.join(prodDir, slug, 'page.tsx')
  if (!fs.existsSync(filePath)) { console.log('Not found:', slug); return }

  const content = fs.readFileSync(filePath, 'utf8')
  const lines = content.split('\n')
  const fixed = []
  let inMetadata = false
  let metaBrace = 0
  let prevWasAlternatesClose = false
  let openGraphInserted = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    if (/^export const metadata/.test(trimmed)) {
      inMetadata = true
      metaBrace = 0
      openGraphInserted = false
    }
    if (inMetadata) {
      metaBrace += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length
      if (metaBrace <= 0) inMetadata = false
    }

    // alternates閉じ後にtitle:が来ていたら openGraph: { を挿入
    if (prevWasAlternatesClose && inMetadata && trimmed.startsWith('title:') && !openGraphInserted) {
      fixed.push('  openGraph: {')
      openGraphInserted = true
      prevWasAlternatesClose = false
    }

    fixed.push(line)

    // alternatesの }, を検出（直近5行にcanonical:がある場合）
    const recent = fixed.slice(-6).join('\n')
    prevWasAlternatesClose = inMetadata && trimmed === '},' && recent.includes('canonical:') && !recent.includes('openGraph:')
  }

  let result = fixed.join('\n')

  // twitter重複を除去
  const twitterMatches = result.match(/\n  twitter:/g) || []
  if (twitterMatches.length >= 2) {
    const idx1 = result.indexOf('\n  twitter:')
    const idx2 = result.indexOf('\n  twitter:', idx1 + 1)
    if (idx2 !== -1) {
      const endIdx = result.indexOf('\n  }', idx2)
      if (endIdx !== -1) {
        result = result.substring(0, idx2) + result.substring(endIdx + 4)
        console.log('  Removed twitter duplicate:', slug)
      }
    }
  }

  if (result !== content) {
    fs.writeFileSync(filePath, result, 'utf8')
    console.log('Fixed:', slug)
  } else {
    console.log('No change needed:', slug)
  }
})
