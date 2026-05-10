/**
 * 既存製品ページのSEOメタデータを強化するスクリプト
 * ロック済みツールは変更しない
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BASE_URL = 'https://membership-site-nextralabos.vercel.app'
const PRODUCTS_DIR = path.join(__dirname, '../src/app/products')

// ロック済みツール（絶対に変更しない）
const LOCKED_TOOLS = [
  'exam-scheduler',
  'kindle-factory',
  'smart-gardening',
  'location-finder',
  'sns-auto-poster',
  'shopping-stopper',
  'moving-checker',
  'scam-defender',
  'money-guard',
  'prompt-master',
  'ai-recipe',
  'kdp-guide',
  'universal-converter',
  'loan-advisor',
]

// 強化するメタデータ（ロックされていないツールのみ）
const ENHANCED_METADATA = {
  'scam-defender': {
    title: 'AI詐欺ディフェンダー | 詐欺メール・特殊詐欺・闇バイトを瞬時に判定',
    description: '詐欺メール・フィッシング・特殊詐欺・闇バイト勧誘をAIが即座に判定。家族見守りプランで高齢者の被害も防止。月額980円〜のNextraLabsプレミアムプラン。',
    keywords: ['AI詐欺判定', '詐欺メール検出', 'フィッシング対策', '特殊詐欺AI', '闇バイト判定'],
  },
  'buzz-writer': {
    title: 'AIバズライター（Buzz Writer）| バズるブログ記事・SNS投稿を一発生成',
    description: 'キーワードを入力するだけでSEO最適化済みのブログ記事・SNS投稿をAIが自動生成。Googleで上位表示されるコンテンツを最短5分で作成。NextraLabs会員限定。',
    keywords: ['AIライター', 'ブログ自動生成', 'SEOコンテンツAI', 'SNS投稿AI', 'バズるAI記事'],
  },
  'closet-coach': {
    title: 'AIクローゼットコーチ | タンスの肥やしをゼロにする断捨離AI',
    description: '持ち服を撮影するだけでAIがコーデ提案・不要品判定・フリマ出品サポートまで。クローゼット整理でお金も生み出す。NextraLabsライトプラン以上。',
    keywords: ['AI断捨離', 'クローゼット整理AI', 'コーデAI', 'フリマ出品AI', '服整理'],
  },
  'comm-coach': {
    title: 'AIコミュニケーションコーチ | 職場・恋愛・家族の人間関係をAIが改善',
    description: '苦手な人との会話・上司への報告・恋愛トーク・家族関係まで。AIがシチュエーション別の最適な言葉を提案。コミュ力を劇的に上げる。NextraLabsプラン。',
    keywords: ['AIコミュニケーション', '人間関係AI', '会話術AI', 'コミュ力向上', '職場関係改善AI'],
  },
  'ai-exam-generator': {
    title: 'AI試験問題ジェネレーター | 資格試験の模擬問題を無制限自動生成',
    description: 'CompTIA・FP・宅建・情報処理など各種資格試験の模擬問題をAIが自動生成。解説付きで理解が深まる。過去問だけでは足りない演習量を補う。',
    keywords: ['AI試験問題', '資格試験AI', '模擬試験自動生成', 'CompTIA AI', 'FP試験AI'],
  },
  'pet-translator': {
    title: 'AIペット通訳士（Pet Translator）| 愛犬・愛猫の気持ちをAIが解読',
    description: '愛犬・愛猫の行動・鳴き声・表情をAIが分析して気持ちを翻訳。健康状態のチェックや行動改善アドバイスも。ペットとの絆が深まるNextraLabs無料ツール。',
    keywords: ['AIペット翻訳', '犬の気持ちAI', '猫の気持ちAI', 'ペット行動分析', 'AIペット通訳'],
  },
  'shio-taiou': {
    title: 'AI塩対応ジェネレーター | 面倒な人間関係をスマートに断る',
    description: '迷惑な勧誘・しつこいLINE・断りにくい頼まれごとをスマートに断る文章をAIが生成。角が立たず・後腐れなし・でも確実に断れる魔法の言葉。',
    keywords: ['AI塩対応', '断り方AI', '迷惑対応AI', '人間関係断り文句', 'LINEブロック文章AI'],
  },
  'resignation-assistant': {
    title: 'AI退職アシスタント | 退職届・引き継ぎ書類をAIが自動作成',
    description: '退職届・退職理由・引き継ぎ書類・上司への伝え方までAIが完全サポート。円満退職を実現する文章テンプレートと段取りを提案。NextraLabs無料〜利用可能。',
    keywords: ['AI退職届', '退職理由AI', '円満退職AI', '引き継ぎ書類AI', '退職手続きAI'],
  },
  'youtube-producer': {
    title: 'AI YouTubeプロデューサー | 台本・サムネ・SEO最適化を全自動',
    description: 'YouTubeの台本・タイトル・説明文・サムネイルをAIが全自動生成。検索上位に表示されるSEO最適化タグも自動設定。チャンネル登録者数を爆増させる。',
    keywords: ['YouTubeAI台本', 'YouTube SEO', 'サムネイルAI', 'YouTube自動化', 'YouTubeプロデューサーAI'],
  },
  'staysee-ai-finder': {
    title: 'Staysee AI Finder | 旅行の宿泊先をAIが予算・条件から最速提案',
    description: '予算・エリア・人数・目的を入力するだけでAIが最適な宿を提案。楽天トラベル・じゃらん連携で最安値をリアルタイム比較。旅行準備を10倍速く。',
    keywords: ['AI宿探し', '旅行AI', 'ホテルAI検索', '楽天トラベルAI', '宿泊先AI提案'],
  },
}

let successCount = 0
let skippedLocked = 0
let skippedOther = 0

for (const [product, seo] of Object.entries(ENHANCED_METADATA)) {
  // ロック済みチェック
  if (LOCKED_TOOLS.includes(product)) {
    console.log(`🔒 LOCKED (skipping): ${product}`)
    skippedLocked++
    continue
  }

  const filePath = path.join(PRODUCTS_DIR, product, 'page.tsx')

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  FILE NOT FOUND: ${product}`)
    skippedOther++
    continue
  }

  let content = fs.readFileSync(filePath, 'utf-8')

  // 既存のmetadata titleのみ差し替える（簡易パッチ）
  // export const metadata のブロック全体を置き換える
  const metadataRegex = /export const metadata[^=]*=\s*\{[^}]*(?:\{[^}]*\}[^}]*)*\}/s

  if (!metadataRegex.test(content)) {
    console.log(`⚠️  No metadata block found: ${product} — skipping`)
    skippedOther++
    continue
  }

  const newMetadata = `export const metadata: Metadata = {
  title: '${seo.title}',
  description: '${seo.description}',
  keywords: ${JSON.stringify(seo.keywords)},
  alternates: {
    canonical: '${BASE_URL}/products/${product}',
  },
  openGraph: {
    title: '${seo.title} | NextraLabs',
    description: '${seo.description}',
    url: '${BASE_URL}/products/${product}',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: '${BASE_URL}/og-image.png', width: 1200, height: 630, alt: '${seo.title}' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '${seo.title}',
    description: '${seo.description}',
    images: ['${BASE_URL}/og-image.png'],
  },
}`

  content = content.replace(metadataRegex, newMetadata)

  // Metadata型をimportしていない場合は追加
  if (!content.includes("import { Metadata }") && !content.includes("import type { Metadata }")) {
    content = `import { Metadata } from 'next'\n` + content
  }

  fs.writeFileSync(filePath, content, 'utf-8')
  console.log(`✅ Enhanced: ${product}`)
  successCount++
}

console.log(`\n📊 結果: ${successCount}件強化, ロック除外:${skippedLocked}件, その他スキップ:${skippedOther}件`)
