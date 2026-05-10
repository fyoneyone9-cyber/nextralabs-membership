// metadataブロックの末尾 },' を '}' に修正（import の直前）
const fs = require('fs')
const path = require('path')

const prodDir = 'src/app/products'
const slugs = ['buzz-writer','closet-coach','comm-coach','pet-translator','resignation-assistant','shio-taiou','ai-exam-generator','staysee-ai-finder']

slugs.forEach(slug => {
  const filePath = path.join(prodDir, slug, 'page.tsx')
  if (!fs.existsSync(filePath)) { console.log('Not found:', slug); return }

  let content = fs.readFileSync(filePath, 'utf8')

  // パターン: },\nimport { → }\nimport {
  // metadataブロックの末尾の },' を '}' に
  const fixed = content.replace(/\},(\r?\n)(import\s*\{)/g, '}$1$2')

  if (fixed !== content) {
    fs.writeFileSync(filePath, fixed, 'utf8')
    console.log('Fixed trailing comma:', slug)
  } else {
    console.log('No trailing comma found:', slug)
  }
})
