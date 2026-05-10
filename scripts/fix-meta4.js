// metadataブロックの末尾 },' を '}' に修正（import または空行+exportの直前）
const fs = require('fs')
const path = require('path')

const prodDir = 'src/app/products'

// 全ページのpage.tsxを対象
const walk = (dir) => {
  const result = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) result.push(...walk(full))
    else if (entry.name === 'page.tsx') result.push(full)
  }
  return result
}

const files = walk(prodDir)
let fixedCount = 0

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8')

  // パターン: },\n\nimport または },\n\nexport または },\nimport または },\nexport
  const fixed = content
    .replace(/\},(\r?\n)(\r?\n)(import\s)/g, '}$1$2$3')     // },\n\nimport
    .replace(/\},(\r?\n)(\r?\n)(export\s)/g, '}$1$2$3')     // },\n\nexport
    .replace(/\},(\r?\n)(import\s)/g, '}$1$2')               // },\nimport
    .replace(/\},(\r?\n)(export\s)/g, '}$1$2')               // },\nexport

  if (fixed !== content) {
    fs.writeFileSync(filePath, fixed, 'utf8')
    const slug = filePath.split(path.sep).slice(-3, -1).join('/')
    console.log('Fixed:', slug)
    fixedCount++
  }
})

console.log(`\nTotal fixed: ${fixedCount} files`)
