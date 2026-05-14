import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BASE_URL = 'https://nextralab.jp'
const PRODUCTS_DIR = path.join(__dirname, '../src/app/products')

// 各製品のSEOメタデータ定義
const SEO_DATA = {
  'ai-select-shop': {
    title: 'AIセレクトショップ | トレンド解析×Shopify連携で売上を最大化',
    description: 'AIがトレンドを先読みしてECサイトの商品選定・仕入れを最適化。Shopify連携でリアルタイム在庫管理も。NextraLabsプレミアムプラン専用ツール。',
    keywords: 'AIセレクトショップ,Shopify AI,トレンド解析,EC自動化,AIマーチャンダイジング',
  },
  'ai-sidejob': {
    title: 'AI副業スタートダッシュ | 初月から収益化できる副業ロードマップ',
    description: '副業未経験でもAIが最適な副業を診断・サポート。ブログ・ハンドメイド・Kindle出版など30種の副業を月収目標に合わせて提案。NextraLabs会員限定。',
    keywords: 'AI副業,副業スタート,副業ロードマップ,在宅副業AI,月収副業',
  },
  'buy-smart-nav': {
    title: 'AI買い物ナビ（Buy Smart Nav）| 最安値×最適タイミングで賢く購入',
    description: '購入前にAIが価格履歴・口コミ分析・最安値タイミングを自動調査。衝動買いゼロで年間数万円の節約を実現。NextraLabsプレミアムプラン。',
    keywords: 'AI買い物,価格比較AI,最安値タイミング,賢い買い物,節約AI',
  },
  'disaster-guard': {
    title: 'AI防災パーソナルガイド | 家族の避難ルート×備蓄を自動最適化',
    description: 'あなたの住所・家族構成に合わせた避難ルート・備蓄リストをAIが自動作成。ハザードマップ解析で最短避難経路を提示。NextraLabsスタンダードプラン。',
    keywords: 'AI防災,避難ルートAI,備蓄リスト,ハザードマップAI,防災対策',
  },
  'inbox-organizer': {
    title: 'AI受信トレイ整理（Inbox Organizer）| Gmailを自動分類・返信',
    description: 'AIがメールを自動分類・優先度付け・返信文を生成。受信トレイを常にゼロに。Gmail連携でビジネスメールを10倍効率化。NextraLabsライトプラン以上。',
    keywords: 'AIメール整理,Gmail自動分類,受信トレイゼロ,AIメール返信,メール効率化',
  },
  'kindle-factory': {
    title: 'Kindle AIファクトリー | AI原稿自動生成でKDP出版を最速完成',
    description: 'テーマを入力するだけでAIが目次・章立て・本文を自動生成。KDP（Kindle Direct Publishing）入稿可能なdocx形式で出力。最短1日で電子書籍を完成。',
    keywords: 'Kindle出版AI,KDP自動生成,電子書籍AI,Kindleファクトリー,AI原稿生成',
  },
  'loan-advisor': {
    title: 'AI借金完済・おまとめ診断 | 最短完済ルートをAIが無料で計算',
    description: '複数の借金をまとめておまとめローンで一本化。AIが毎月の返済額・利息・完済期間を複数シナリオで比較。完全無料で使えるNextraLabs公開ツール。',
    keywords: 'AI借金診断,おまとめローン,債務整理AI,完済シミュレーション,借金相談AI',
  },
  'money-guard': {
    title: 'AI家計防衛シミュレーター | 衝動買いを心理的に阻止して月3万節約',
    description: '購入前に「本当に必要？」とAIが問いかけ、衝動買いを防止。固定費見直し・節約シミュレーションで家計を自動最適化。NextraLabsスタンダードプラン。',
    keywords: 'AI家計管理,衝動買い防止,節約シミュレーション,家計防衛AI,固定費見直し',
  },
  'nextra-ai': {
    title: 'Nextra AI（ホテルDX）| チェックイン・予約・解錠を完全自動化',
    description: '中小ホテル・旅館向けのAI DXソリューション。フロントレス運営・スマートチェックイン・多言語対応を月額で実現。NextraLabsプレミアムプラン。',
    keywords: 'ホテルAI,ホテルDX,スマートチェックイン,旅館AI,フロントレス運営',
  },
  'sns-auto-poster': {
    title: 'AI SNSオートポスター | X・Instagram・TikTokを完全自動投稿',
    description: 'AIがバズるコンテンツを生成し、最適な時間帯に自動投稿。フォロワー増加・エンゲージメント向上を自動化。NextraLabsライトプラン以上。',
    keywords: 'SNS自動投稿,AIインスタ投稿,TwitterAI自動,TikTokAI,SNSマーケティングAI',
  },
  'staysee-ai-finder': {
    title: 'Staysee AI Finder | 最高の宿をAIが条件から完全自動で発見',
    description: 'ホテル・旅館・民泊をAIが予算・立地・口コミから最適な宿を自動提案。楽天トラベル・じゃらんとも連携。NextraLabsライトプラン以上。',
    keywords: 'AI宿探し,ホテル検索AI,旅行AI,宿泊AI,じゃらんAI',
  },
  'youtube-coordinator': {
    title: 'YouTube AI Sync | 動画解析×楽天コーチで収益を最大化',
    description: '動画のパフォーマンスをAIが解析し、改善案を自動提示。楽天アフィリエイト連携で動画からの収益を倍増。YouTubeチャンネル成長を加速。',
    keywords: 'YouTube AI,YouTubeアナリティクスAI,動画収益化AI,楽天アフィリエイトYouTube,YouTubeコーチ',
  },
}

let successCount = 0
let skipCount = 0

for (const [product, seo] of Object.entries(SEO_DATA)) {
  const filePath = path.join(PRODUCTS_DIR, product, 'page.tsx')
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  SKIP (file not found): ${product}`)
    skipCount++
    continue
  }

  const content = fs.readFileSync(filePath, 'utf-8')
  
  // 既にmetadataが存在する場合はスキップ
  if (content.includes('export const metadata')) {
    console.log(`⏭️  SKIP (metadata exists): ${product}`)
    skipCount++
    continue
  }

  const metadataBlock = `import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '${seo.title}',
  description: '${seo.description}',
  keywords: ['${seo.keywords.split(',').join("', '")}'],
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
}

`

  // importの後ろ（最初のimport行の後）にmetadataを挿入
  // ファイルの先頭に追加する
  const newContent = metadataBlock + content
  fs.writeFileSync(filePath, newContent, 'utf-8')
  console.log(`✅ Added metadata: ${product}`)
  successCount++
}

console.log(`\n📊 結果: ${successCount}件追加, ${skipCount}件スキップ`)
