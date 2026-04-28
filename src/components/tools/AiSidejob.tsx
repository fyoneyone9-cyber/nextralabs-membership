'use client'

import { useState, useEffect, useCallback } from 'react'

// ==================== TYPES ====================
type Tab = 'diagnosis' | 'roadmap' | 'simulator' | 'templates' | 'tools' | 'log'

interface DiagnosisAnswer {
  questionIdx: number
  optionIdx: number
}

interface JobRecord {
  id: string
  category: string
  title: string
  revenue: number
  expense: number
  hours: number
  date: string
  note: string
}

// ==================== CONSTANTS ====================
const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: 'diagnosis', icon: '🧭', label: '適性診断' },
  { id: 'roadmap', icon: '📋', label: 'ロードマップ' },
  { id: 'simulator', icon: '💰', label: '収益シミュレーター' },
  { id: 'templates', icon: '✍️', label: 'テンプレート集' },
  { id: 'tools', icon: '🛠️', label: 'AIツール辞典' },
  { id: 'log', icon: '📊', label: '活動ログ' },
]

interface SidejobCategory {
  id: string
  num: number
  name: string
  icon: string
  level: 'beginner' | 'advanced'
  description: string
  avgRevenue: string
  startCost: string
  timeToFirst: string
  difficulty: number // 1-5
  tags: string[]
  roadmapSteps: string[]
  requiredTools: string[]
  priceRange: { label: string; min: number; max: number }
  tips: string[]
  aiTools: { name: string; desc: string; free: boolean; url: string }[]
}

const CATEGORIES: SidejobCategory[] = [
  {
    id: 'image-design', num: 1, name: '画像制作・バナー・サムネ', icon: '🖼️', level: 'beginner',
    description: 'AI画像生成ツールでバナー・サムネイル・SNS素材を制作して販売',
    avgRevenue: '月3〜15万円', startCost: '0〜3,000円/月', timeToFirst: '1〜2週間', difficulty: 2,
    tags: ['Midjourney', 'Canva', 'DALL-E', 'デザイン'],
    roadmapSteps: ['AIツール選定（Canva無料 or Midjourney $10/月）', 'バナー10枚の練習ポートフォリオ作成', 'ココナラ/クラウドワークスに出品', '最初の1件を低価格（¥1,000〜）で受注', 'ポートフォリオ拡充→単価アップ（¥3,000〜¥10,000）', 'リピーター獲得→月10件安定'],
    requiredTools: ['Canva', 'Midjourney or DALL-E', 'Photoshop（あれば尚可）'],
    priceRange: { label: 'バナー1枚', min: 1000, max: 10000 },
    tips: ['最初は「修正2回無料」で差別化', 'ジャンル特化（飲食店バナー専門等）が強い', 'テンプレート販売で不労所得化も可能'],
    aiTools: [
      { name: 'Canva', desc: 'テンプレート豊富なデザインツール。AI画像生成内蔵', free: true, url: 'https://www.canva.com/' },
      { name: 'Midjourney', desc: '高品質AI画像生成。$10/月〜', free: false, url: 'https://www.midjourney.com/' },
      { name: 'Adobe Firefly', desc: 'Adobe製AI画像生成。商用利用安心', free: true, url: 'https://firefly.adobe.com/' },
      { name: 'Leonardo AI', desc: '無料枠あり。細かい制御が可能', free: true, url: 'https://leonardo.ai/' },
    ],
  },
  {
    id: 'writing', num: 2, name: 'ライティング・記事編集', icon: '✍️', level: 'beginner',
    description: 'AI活用でSEO記事・ブログ・商品説明文などを執筆',
    avgRevenue: '月5〜20万円', startCost: '0〜2,000円/月', timeToFirst: '1週間', difficulty: 2,
    tags: ['ChatGPT', 'Claude', 'SEO', 'WordPress'],
    roadmapSteps: ['ChatGPT/Claudeの基本操作を習得', 'SEOライティングの基礎学習（1〜2日）', 'サンプル記事3本作成', 'クラウドソーシングで文字単価0.5〜1円の案件に応募', '実績5件→プロフィール強化', '文字単価2〜5円に交渉アップ'],
    requiredTools: ['ChatGPT or Claude', 'Googleドキュメント', 'WordPress（納品形式による）'],
    priceRange: { label: '3000字記事', min: 1500, max: 15000 },
    tips: ['AI丸投げは必ずバレる。構成→AI下書き→人間が編集のフロー', '専門ジャンル（医療/金融/IT）は単価2倍以上', '取材記事・インタビュー記事はAI競合が少なく高単価'],
    aiTools: [
      { name: 'ChatGPT', desc: '汎用ライティング。GPT-4oで高品質', free: true, url: 'https://chat.openai.com/' },
      { name: 'Claude', desc: '長文・構成に強い。日本語品質が高い', free: true, url: 'https://claude.ai/' },
      { name: 'Notion AI', desc: 'ドキュメント内でAI補完', free: false, url: 'https://www.notion.so/' },
      { name: 'Perplexity', desc: 'リサーチ特化AI。ソース付き', free: true, url: 'https://www.perplexity.ai/' },
    ],
  },
  {
    id: 'sns-management', num: 3, name: 'SNS運用', icon: '📱', level: 'beginner',
    description: 'AI活用で企業・個人のSNS投稿代行・コンテンツ企画',
    avgRevenue: '月3〜10万円/アカウント', startCost: '0円', timeToFirst: '2〜3週間', difficulty: 2,
    tags: ['Instagram', 'X', 'TikTok', '運用代行'],
    roadmapSteps: ['自分のSNSアカウントでAI活用投稿を実践', '30日間連続投稿でノウハウ蓄積', '運用実績をポートフォリオ化', '個人店舗・小規模事業者に営業', '月額契約（3〜5万円/アカウント）を提案', '複数アカウント運用で収入安定'],
    requiredTools: ['ChatGPT（投稿文生成）', 'Canva（画像制作）', '各SNSアプリ'],
    priceRange: { label: '月額運用代行', min: 30000, max: 100000 },
    tips: ['まず自分のアカウントで成果を出すのが最大の営業材料', '地元の飲食店・美容室が狙い目', '投稿スケジュール管理まで含めると付加価値UP'],
    aiTools: [
      { name: 'ChatGPT', desc: '投稿文・キャプション生成', free: true, url: 'https://chat.openai.com/' },
      { name: 'Canva', desc: 'SNS用テンプレートが豊富', free: true, url: 'https://www.canva.com/' },
      { name: 'CapCut', desc: 'リール/ショート動画編集', free: true, url: 'https://www.capcut.com/' },
    ],
  },
  {
    id: 'web-creation', num: 4, name: 'Web制作', icon: '🌐', level: 'beginner',
    description: 'AIノーコードツールでLP・Webサイトを制作',
    avgRevenue: '月5〜30万円', startCost: '0〜5,000円/月', timeToFirst: '2〜4週間', difficulty: 3,
    tags: ['v0', 'Bolt', 'ノーコード', 'LP'],
    roadmapSteps: ['v0/BoltでLP制作を練習（3〜5作品）', 'ポートフォリオサイト作成', 'ココナラで「AIでLP制作」出品', 'LP1ページ¥30,000〜で受注開始', '保守・更新の月額契約を提案', 'WordPress→AIノーコード移行案件も狙う'],
    requiredTools: ['v0 by Vercel', 'Bolt.new', 'GitHub（基本操作）'],
    priceRange: { label: 'LP1ページ', min: 30000, max: 150000 },
    tips: ['「AIで早い・安い」ではなく「品質が高いのにこの価格」で売る', 'レスポンシブ対応は必須', '保守契約（月5,000〜10,000円）が安定収入の鍵'],
    aiTools: [
      { name: 'v0 by Vercel', desc: 'プロンプトからReactコンポーネント生成', free: true, url: 'https://v0.dev/' },
      { name: 'Bolt.new', desc: 'フルスタックアプリをAIで構築', free: true, url: 'https://bolt.new/' },
      { name: 'Cursor', desc: 'AIコーディングエディタ', free: true, url: 'https://cursor.sh/' },
    ],
  },
  {
    id: 'note-ebook', num: 5, name: 'note・電子書籍', icon: '📝', level: 'beginner',
    description: 'AIで執筆→note有料記事や電子書籍として販売',
    avgRevenue: '月1〜10万円', startCost: '0円', timeToFirst: '1〜2週間', difficulty: 2,
    tags: ['note', 'Kindle', 'Brain', '有料記事'],
    roadmapSteps: ['ニッチジャンルの選定（AI活用/副業/ノウハウ系）', 'AIで下書き→人間が編集・体験談追加', '無料記事5本で集客', '有料記事（¥500〜¥1,500）を販売開始', 'Kindle出版で長期収益化', 'noteメンバーシップで月額課金モデルへ'],
    requiredTools: ['ChatGPT/Claude', 'note.com', 'Kindle Direct Publishing'],
    priceRange: { label: 'note有料記事', min: 300, max: 3000 },
    tips: ['AI100%の記事は売れない。実体験・独自データが価値', 'タイトルとサムネイルで8割決まる', 'シリーズ化して固定読者を獲得'],
    aiTools: [
      { name: 'ChatGPT', desc: '構成・下書き・推敲', free: true, url: 'https://chat.openai.com/' },
      { name: 'Claude', desc: '長文執筆に強い', free: true, url: 'https://claude.ai/' },
      { name: 'Gamma', desc: 'スライド/ドキュメント自動生成', free: true, url: 'https://gamma.app/' },
    ],
  },
  {
    id: 'video-editing', num: 6, name: '動画制作・編集', icon: '🎬', level: 'beginner',
    description: 'AI動画ツールでYouTube編集・ショート動画制作',
    avgRevenue: '月5〜20万円', startCost: '0〜3,000円/月', timeToFirst: '2〜3週間', difficulty: 3,
    tags: ['CapCut', 'Runway', 'Kling', 'YouTube'],
    roadmapSteps: ['CapCut/Runway等でAI編集を習得', 'サンプル動画3本制作', 'YouTuber向けに「AI編集で納期半分」を訴求', '1本¥5,000〜で受注開始', 'テンプレート化して効率UP', 'ショート動画量産型の月額契約を狙う'],
    requiredTools: ['CapCut', 'Runway ML or Kling', 'DaVinci Resolve（無料）'],
    priceRange: { label: 'YouTube動画1本（10分）', min: 5000, max: 30000 },
    tips: ['テロップ・カット編集はAIが最も得意な領域', 'ショート動画量産は単価低いが件数で稼げる', 'ジャンル特化（ゲーム実況/ビジネス等）で差別化'],
    aiTools: [
      { name: 'CapCut', desc: 'AI字幕・AI編集内蔵。無料', free: true, url: 'https://www.capcut.com/' },
      { name: 'Runway ML', desc: 'AI動画生成・編集の先駆者', free: true, url: 'https://runwayml.com/' },
      { name: 'Kling', desc: '高品質AI動画生成', free: true, url: 'https://klingai.com/' },
      { name: 'Descript', desc: '文字起こし→動画編集', free: true, url: 'https://www.descript.com/' },
    ],
  },
  {
    id: 'line-stamp', num: 7, name: 'LINEスタンプ販売', icon: '💬', level: 'beginner',
    description: 'AI画像生成でLINEスタンプを制作・販売',
    avgRevenue: '月1,000〜3万円', startCost: '0円', timeToFirst: '2〜4週間（審査込み）', difficulty: 1,
    tags: ['LINE', 'AI画像生成', '不労所得'],
    roadmapSteps: ['AIでキャラクターデザイン（統一感が重要）', '8/16/24/32/40個セットを制作', '背景透過処理（remove.bg等）', 'LINE Creators Marketに登録・申請', '審査通過後に販売開始', '複数セット展開で収益拡大'],
    requiredTools: ['Midjourney or DALL-E', 'remove.bg', 'LINE Creators Market'],
    priceRange: { label: 'スタンプ1セット/月', min: 100, max: 5000 },
    tips: ['キャラの一貫性が最重要。同じseed/スタイルで統一', '日常あいさつ系が一番売れる', '40個セットが売上効率最高', '一度作れば永続的に収益発生（不労所得型）'],
    aiTools: [
      { name: 'Midjourney', desc: 'キャラクターの一貫性が高い', free: false, url: 'https://www.midjourney.com/' },
      { name: 'DALL-E 3', desc: 'ChatGPT内で直接生成', free: true, url: 'https://chat.openai.com/' },
      { name: 'remove.bg', desc: '背景透過（スタンプ必須）', free: true, url: 'https://www.remove.bg/' },
    ],
  },
  {
    id: 'audio-content', num: 8, name: '耳学（音声コンテンツ）', icon: '🎧', level: 'beginner',
    description: 'AI音声・台本生成でPodcast・音声教材を制作',
    avgRevenue: '月1〜10万円', startCost: '0〜1,000円/月', timeToFirst: '1〜2週間', difficulty: 2,
    tags: ['Podcast', 'Voicy', 'TTS', '音声'],
    roadmapSteps: ['ジャンル選定（ビジネス/自己啓発/ニュース解説）', 'AIで台本生成→自分の声で収録 or AI音声', 'Anchor/Spotifyで配信開始', '週2〜3エピソードを継続', 'スポンサー獲得 or 有料コンテンツ化', 'Audible/audiobook.jpで音声教材販売'],
    requiredTools: ['ChatGPT（台本）', 'ElevenLabs or VOICEVOX', 'Anchor for Podcasters'],
    priceRange: { label: 'スポンサー収入/月', min: 5000, max: 50000 },
    tips: ['AI音声だけだと差別化困難。自分の声+AIアシストが理想', 'ニッチジャンルほどリスナーの熱量が高い', 'テキストコンテンツの音声版リパーパスが効率的'],
    aiTools: [
      { name: 'ElevenLabs', desc: '高品質AI音声生成', free: true, url: 'https://elevenlabs.io/' },
      { name: 'VOICEVOX', desc: '無料の日本語音声合成', free: true, url: 'https://voicevox.hiroshiba.jp/' },
      { name: 'ChatGPT', desc: '台本・構成の生成', free: true, url: 'https://chat.openai.com/' },
    ],
  },
  {
    id: 'presentation', num: 9, name: '資料作成', icon: '📊', level: 'beginner',
    description: 'AIでビジネス資料・プレゼン・提案書を代行制作',
    avgRevenue: '月3〜15万円', startCost: '0円', timeToFirst: '1〜2週間', difficulty: 2,
    tags: ['Gamma', 'PowerPoint', 'Googleスライド'],
    roadmapSteps: ['Gamma/Beautiful.aiでAI資料制作を練習', 'サンプル資料5種作成（営業/企画/報告/提案/セミナー）', 'ココナラ「AI資料作成代行」出品', '1資料¥5,000〜で受注', 'テンプレート販売（¥1,000〜）も並行', '法人直契約で月額案件獲得'],
    requiredTools: ['Gamma', 'PowerPoint or Googleスライド', 'Canva'],
    priceRange: { label: 'プレゼン資料（20P）', min: 5000, max: 30000 },
    tips: ['「デザインがきれい」より「論理構成が明確」が評価される', 'テンプレート販売は不労所得型', '英語資料は単価2〜3倍'],
    aiTools: [
      { name: 'Gamma', desc: 'プロンプト→プレゼン自動生成', free: true, url: 'https://gamma.app/' },
      { name: 'Beautiful.ai', desc: 'AIデザインスライド', free: false, url: 'https://www.beautiful.ai/' },
      { name: 'Canva', desc: 'プレゼンテンプレート豊富', free: true, url: 'https://www.canva.com/' },
    ],
  },
  // === Advanced ===
  {
    id: 'online-course', num: 10, name: 'オンライン教材販売', icon: '📚', level: 'advanced',
    description: 'AI活用ノウハウをオンライン教材として販売',
    avgRevenue: '月5〜50万円', startCost: '0〜5,000円', timeToFirst: '1〜2ヶ月', difficulty: 4,
    tags: ['Udemy', 'Brain', 'Tips', '教材'],
    roadmapSteps: ['自分の得意ジャンル×AI活用のカリキュラム設計', 'AIで構成・テキスト生成→動画撮影/スライド制作', 'Udemy/Brainに出品', 'SNSで集客→初期レビュー獲得', '受講者フィードバックで改善', 'シリーズ化・上級コース追加'],
    requiredTools: ['ChatGPT/Claude', 'Gamma/Canva', '画面録画ソフト', 'Udemy/Brain'],
    priceRange: { label: '教材1コース', min: 3000, max: 30000 },
    tips: ['「AI×○○」のニッチが狙い目（AI×不動産投資等）', '完璧を目指さず早くリリース→改善が鉄則', 'Udemyはセール時に大量購入されるので数が命'],
    aiTools: [
      { name: 'ChatGPT', desc: 'カリキュラム設計・台本', free: true, url: 'https://chat.openai.com/' },
      { name: 'Gamma', desc: '教材スライド自動生成', free: true, url: 'https://gamma.app/' },
      { name: 'Loom', desc: '画面録画+共有', free: true, url: 'https://www.loom.com/' },
    ],
  },
  {
    id: 'prompt-sales', num: 11, name: 'AIプロンプト販売', icon: '🤖', level: 'advanced',
    description: '高品質なAIプロンプトを制作・販売',
    avgRevenue: '月1〜10万円', startCost: '0円', timeToFirst: '1〜2週間', difficulty: 3,
    tags: ['PromptBase', 'プロンプト', 'Midjourney'],
    roadmapSteps: ['特定ジャンルの高品質プロンプト開発', '出力サンプル画像/テキストを用意', 'PromptBase/note/Brainで販売', 'SNSでプロンプトの出力例を投稿→集客', 'プロンプトパック（10個セット等）で単価UP', 'サブスク型（月額プロンプト配信）へ発展'],
    requiredTools: ['各AIツール（Midjourney/ChatGPT等）', 'PromptBase', 'note（日本市場）'],
    priceRange: { label: 'プロンプト1個', min: 200, max: 5000 },
    tips: ['「再現性」が最重要。誰が使っても同じ品質が出ること', 'ビフォーアフター画像が最強の販促', '日本語プロンプトは競合少なく狙い目'],
    aiTools: [
      { name: 'PromptBase', desc: 'プロンプト専門マーケットプレイス', free: true, url: 'https://promptbase.com/' },
      { name: 'Midjourney', desc: '画像プロンプト販売の主戦場', free: false, url: 'https://www.midjourney.com/' },
    ],
  },
  {
    id: 'chatbot-build', num: 12, name: 'AIチャットボット構築', icon: '🤖', level: 'advanced',
    description: '企業向けFAQ自動化・カスタムチャットボットを構築',
    avgRevenue: '月10〜50万円', startCost: '0〜10,000円/月', timeToFirst: '1〜2ヶ月', difficulty: 4,
    tags: ['Dify', 'GPTs', 'FAQ自動化', '法人向け'],
    roadmapSteps: ['Dify/GPTsでチャットボット構築スキル習得', 'デモボット3つ作成（EC/飲食/クリニック）', '地元企業にデモ提案', '構築費¥100,000〜+月額保守¥10,000〜', '業種別テンプレートで横展開', '導入実績を使って新規営業'],
    requiredTools: ['Dify', 'OpenAI API', 'GPTs（ChatGPT Plus）'],
    priceRange: { label: 'ボット構築', min: 50000, max: 300000 },
    tips: ['「問い合わせ件数○%削減」の数字が最強の提案材料', '最初は無料で1社構築→実績を作る', '保守契約が本当の収益源'],
    aiTools: [
      { name: 'Dify', desc: 'ノーコードAIアプリ構築', free: true, url: 'https://dify.ai/' },
      { name: 'GPTs', desc: 'カスタムChatGPTを作成', free: false, url: 'https://chat.openai.com/' },
      { name: 'Coze', desc: 'バイトダンス製AIボットビルダー', free: true, url: 'https://www.coze.com/' },
    ],
  },
  {
    id: 'ai-consulting', num: 13, name: 'AI活用コンサル', icon: '🎓', level: 'advanced',
    description: '企業・個人にAI導入/活用のコンサルティング',
    avgRevenue: '月10〜100万円', startCost: '0円', timeToFirst: '1〜3ヶ月', difficulty: 5,
    tags: ['コンサル', '法人向け', 'DX', '研修'],
    roadmapSteps: ['自分のAI活用実績をドキュメント化', 'AI活用セミナー資料作成（無料登壇用）', '地元商工会議所/コミュニティで無料セミナー実施', '個別相談→有料コンサル契約', '月額顧問契約（¥50,000〜/月）を提案', '企業研修（1回¥100,000〜）に展開'],
    requiredTools: ['各AIツールの実践知識', '提案資料（Gamma/PowerPoint）', 'Zoom/Google Meet'],
    priceRange: { label: 'コンサル（月額）', min: 30000, max: 300000 },
    tips: ['「教える」より「一緒にやる」スタイルが信頼される', '業界特化（飲食×AI/医療×AI等）が単価を上げる', '自分の副業実績がそのまま営業材料になる'],
    aiTools: [
      { name: 'ChatGPT', desc: '提案書・資料作成', free: true, url: 'https://chat.openai.com/' },
      { name: 'Gamma', desc: 'プレゼン資料生成', free: true, url: 'https://gamma.app/' },
      { name: 'Notion', desc: '知識管理・ドキュメント', free: true, url: 'https://www.notion.so/' },
    ],
  },
]

const DIAGNOSIS_QUESTIONS = [
  { q: 'あなたのパソコンスキルは？', options: ['ほぼ初心者', '基本操作はOK', 'ある程度使いこなせる', 'エンジニアレベル'] },
  { q: '1日に副業に使える時間は？', options: ['30分〜1時間', '1〜2時間', '2〜4時間', '4時間以上'] },
  { q: '初期投資はいくらまでOK？', options: ['0円（完全無料のみ）', '月1,000円まで', '月5,000円まで', '月10,000円以上OK'] },
  { q: 'どちらが得意？', options: ['文章を書くこと', 'ビジュアル（画像/動画）', '人と話すこと', 'データ分析・論理的思考'] },
  { q: '副業の目標月収は？', options: ['月1〜3万円', '月3〜10万円', '月10〜30万円', '月30万円以上'] },
  { q: 'リスク許容度は？', options: ['確実に小さく稼ぎたい', 'ある程度のリスクはOK', '大きく稼ぐためならリスクも取る', '投資型も視野に入れたい'] },
  { q: 'すぐに収入が欲しい？', options: ['今すぐ（1〜2週間以内）', '1ヶ月以内', '3ヶ月以内でOK', '半年かけてもいい'] },
  { q: '英語力は？', options: ['まったくダメ', '翻訳ツールで読める程度', '日常会話レベル', 'ビジネスレベル'] },
  { q: '顔出し・実名は？', options: ['絶対NG', 'できれば避けたい', '必要ならOK', '積極的にやりたい'] },
  { q: '興味のある分野は？', options: ['クリエイティブ（デザイン/動画）', 'ライティング/情報発信', 'ビジネス/コンサル', 'テクニカル（プログラミング/ボット）'] },
]

const PROPOSAL_TEMPLATES = [
  {
    title: 'クラウドソーシング応募テンプレート',
    content: `【応募文テンプレート】

○○様

はじめまして。[名前]と申します。
[案件名]に応募させていただきます。

■ 対応可能な理由
・[関連スキル/経験を記載]
・AI活用により高品質かつ迅速な納品が可能です

■ 実績
・[ポートフォリオURL or 過去実績]
・[具体的な成果物の説明]

■ 納期
ご依頼から[○日]以内に初稿をお送りします。
修正は[○回]まで無料で対応いたします。

■ お見積もり
[金額]（税込）

ご検討のほど、よろしくお願いいたします。`
  },
  {
    title: 'ポートフォリオ自己紹介テンプレート',
    content: `【ポートフォリオ自己紹介】

■ プロフィール
[名前] ｜ [肩書き]
AI活用×[専門分野]のクリエイター

■ 提供サービス
1. [サービス1]（¥○○〜）
2. [サービス2]（¥○○〜）
3. [サービス3]（¥○○〜）

■ 使用ツール
[ツール名を列挙]

■ 実績・サンプル
[画像/URL/実績を記載]

■ 強み
・AIを活用した高速制作（通常の○倍速）
・[独自の強み]
・修正対応の柔軟さ

■ 連絡先
[メール/SNS/プロフィールURL]`
  },
  {
    title: '料金表テンプレート',
    content: `【料金表テンプレート】

━━━━━━━━━━━━━━━
[サービス名] 料金表
━━━━━━━━━━━━━━━

【ライトプラン】¥○○
・[内容]
・修正○回まで
・納期: ○営業日

【スタンダードプラン】¥○○
・[内容]
・修正○回まで
・納期: ○営業日

【プレミアムプラン】¥○○
・[内容]
・修正無制限
・納期: ○営業日
・[追加特典]

※ 上記は税込価格です
※ 内容により別途お見積もり
※ 急ぎ対応は+○%`
  },
  {
    title: '請求書テンプレート',
    content: `【請求書】

発行日: 20XX年XX月XX日
請求番号: INV-XXXX

■ 請求先
[クライアント名] 御中

■ 請求元
[あなたの名前]
[住所]
[連絡先]

■ 明細
━━━━━━━━━━━━━━━
品目: [作業内容]
数量: [○] 単価: ¥[○○] 小計: ¥[○○]
━━━━━━━━━━━━━━━
小計: ¥[○○]
消費税(10%): ¥[○○]
合計: ¥[○○]
━━━━━━━━━━━━━━━

■ お振込先
[銀行名] [支店名] [口座種別] [口座番号]
[口座名義]

■ お支払い期限
20XX年XX月XX日`
  },
  {
    title: 'SNS営業DMテンプレート',
    content: `【SNS営業DMテンプレート】

[相手の名前]さん

いつも投稿拝見しています！
[具体的に良いと思った投稿/活動に触れる]

突然のDM失礼します。
[自分の肩書き]の[名前]と申します。

[相手の課題/ニーズに触れる]について、
AI活用で[具体的なメリット]を実現するお手伝いができればと思いご連絡しました。

例えば：
・[具体例1]
・[具体例2]

まずは無料で[○○]を1つお試しで作成しますので、
ご興味があればお気軽にご返信ください！

[名前]
[ポートフォリオURL]`
  },
]

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

// ==================== COMPONENT ====================
export function AiSidejob() {
  const [tab, setTab] = useState<Tab>('diagnosis')
  // Diagnosis
  const [answers, setAnswers] = useState<DiagnosisAnswer[]>([])
  const [showResult, setShowResult] = useState(false)
  // Roadmap
  const [selectedCatId, setSelectedCatId] = useState(CATEGORIES[0].id)
  // Simulator
  const [simCatId, setSimCatId] = useState(CATEGORIES[0].id)
  const [simCount, setSimCount] = useState(5)
  const [simPrice, setSimPrice] = useState(5000)
  const [simHours, setSimHours] = useState(20)
  // Templates
  const [selectedTemplateIdx, setSelectedTemplateIdx] = useState(0)
  const [copied, setCopied] = useState(false)
  // Tools dictionary
  const [toolFilter, setToolFilter] = useState<'all' | 'beginner' | 'advanced'>('all')
  // Log
  const [logs, setLogs] = useState<JobRecord[]>([])
  const [logForm, setLogForm] = useState({ category: CATEGORIES[0].name, title: '', revenue: 0, expense: 0, hours: 0, date: new Date().toISOString().split('T')[0], note: '' })

  const selectedCat = CATEGORIES.find(c => c.id === selectedCatId) || CATEGORIES[0]
  const simCat = CATEGORIES.find(c => c.id === simCatId) || CATEGORIES[0]
  const filteredCats = toolFilter === 'all' ? CATEGORIES : CATEGORIES.filter(c => c.level === toolFilter)

  // localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ai-sidejob-logs')
      if (saved) setLogs(JSON.parse(saved))
    } catch { /* */ }
  }, [])

  const saveLogs = useCallback((l: JobRecord[]) => {
    setLogs(l)
    localStorage.setItem('ai-sidejob-logs', JSON.stringify(l))
  }, [])

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Diagnosis scoring
  const getDiagnosisResults = () => {
    const scores: Record<string, number> = {}
    CATEGORIES.forEach(c => { scores[c.id] = 0 })

    answers.forEach(a => {
      const qIdx = a.questionIdx
      const oIdx = a.optionIdx

      // Q0: PC skill
      if (qIdx === 0) {
        if (oIdx <= 1) { scores['image-design'] += 3; scores['line-stamp'] += 3; scores['note-ebook'] += 2; scores['sns-management'] += 2 }
        if (oIdx >= 2) { scores['web-creation'] += 3; scores['chatbot-build'] += 3; scores['prompt-sales'] += 2 }
        if (oIdx === 3) { scores['chatbot-build'] += 3; scores['ai-consulting'] += 2 }
      }
      // Q1: Time
      if (qIdx === 1) {
        if (oIdx <= 1) { scores['line-stamp'] += 2; scores['note-ebook'] += 2; scores['prompt-sales'] += 2 }
        if (oIdx >= 2) { scores['video-editing'] += 2; scores['web-creation'] += 2; scores['online-course'] += 2; scores['ai-consulting'] += 2 }
      }
      // Q2: Budget
      if (qIdx === 2) {
        if (oIdx === 0) { scores['writing'] += 3; scores['note-ebook'] += 3; scores['sns-management'] += 2; scores['presentation'] += 2; scores['ai-consulting'] += 2 }
        if (oIdx >= 2) { scores['image-design'] += 2; scores['video-editing'] += 2 }
      }
      // Q3: Strength
      if (qIdx === 3) {
        if (oIdx === 0) { scores['writing'] += 4; scores['note-ebook'] += 3; scores['audio-content'] += 2 }
        if (oIdx === 1) { scores['image-design'] += 4; scores['video-editing'] += 3; scores['line-stamp'] += 3 }
        if (oIdx === 2) { scores['ai-consulting'] += 4; scores['sns-management'] += 3; scores['online-course'] += 2 }
        if (oIdx === 3) { scores['chatbot-build'] += 4; scores['web-creation'] += 3; scores['prompt-sales'] += 2 }
      }
      // Q4: Revenue target
      if (qIdx === 4) {
        if (oIdx <= 1) { scores['line-stamp'] += 2; scores['note-ebook'] += 2; scores['prompt-sales'] += 2 }
        if (oIdx >= 2) { scores['ai-consulting'] += 3; scores['chatbot-build'] += 3; scores['web-creation'] += 2; scores['online-course'] += 2 }
      }
      // Q5: Risk
      if (qIdx === 5) {
        if (oIdx <= 1) { scores['writing'] += 2; scores['presentation'] += 2; scores['line-stamp'] += 2 }
        if (oIdx >= 2) { scores['ai-consulting'] += 2; scores['online-course'] += 2 }
      }
      // Q6: Speed
      if (qIdx === 6) {
        if (oIdx === 0) { scores['writing'] += 3; scores['image-design'] += 2; scores['presentation'] += 2 }
        if (oIdx >= 2) { scores['online-course'] += 2; scores['ai-consulting'] += 2; scores['chatbot-build'] += 2 }
      }
      // Q7: English
      if (qIdx === 7) {
        if (oIdx >= 2) { scores['prompt-sales'] += 2; scores['writing'] += 1 }
      }
      // Q8: Public identity
      if (qIdx === 8) {
        if (oIdx <= 1) { scores['line-stamp'] += 2; scores['writing'] += 2; scores['prompt-sales'] += 2 }
        if (oIdx >= 2) { scores['ai-consulting'] += 3; scores['audio-content'] += 2; scores['online-course'] += 2 }
      }
      // Q9: Interest
      if (qIdx === 9) {
        if (oIdx === 0) { scores['image-design'] += 4; scores['video-editing'] += 3; scores['line-stamp'] += 3 }
        if (oIdx === 1) { scores['writing'] += 4; scores['note-ebook'] += 3; scores['sns-management'] += 2; scores['audio-content'] += 2 }
        if (oIdx === 2) { scores['ai-consulting'] += 4; scores['online-course'] += 3; scores['presentation'] += 2 }
        if (oIdx === 3) { scores['chatbot-build'] += 4; scores['web-creation'] += 3; scores['prompt-sales'] += 3 }
      }
    })

    return CATEGORIES.map(c => ({ ...c, score: scores[c.id] || 0 })).sort((a, b) => b.score - a.score)
  }

  // Revenue simulator
  const monthlyRevenue = simCount * simPrice
  const monthlyHourlyRate = simHours > 0 ? Math.round(monthlyRevenue / simHours) : 0
  const yearlyRevenue = monthlyRevenue * 12

  // Log stats
  const totalRevenue = logs.reduce((s, l) => s + l.revenue, 0)
  const totalExpense = logs.reduce((s, l) => s + l.expense, 0)
  const totalHours = logs.reduce((s, l) => s + l.hours, 0)
  const avgHourlyRate = totalHours > 0 ? Math.round((totalRevenue - totalExpense) / totalHours) : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-gray-950/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚀</span>
              <h1 className="text-lg font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">AI副業スタートダッシュ</h1>
            </div>
            <div className="text-xs text-white/40">13カテゴリ対応</div>
          </div>
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${tab === t.id ? 'bg-white/15 text-white' : 'text-white/50 hover:text-white/80 hover:bg-white/5'}`}>
                <span>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* ==================== DIAGNOSIS ==================== */}
        {tab === 'diagnosis' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">🧭 AI副業 適性診断</h2>
              <p className="text-sm text-white/50">10問の質問に答えて、あなたに最適なAI副業を発見</p>
            </div>

            {!showResult ? (
              <div className="space-y-4">
                {DIAGNOSIS_QUESTIONS.map((q, qi) => {
                  const answered = answers.find(a => a.questionIdx === qi)
                  return (
                    <div key={qi} className="bg-white/5 rounded-xl p-4">
                      <div className="text-sm font-medium mb-2">Q{qi + 1}. {q.q}</div>
                      <div className="grid grid-cols-2 gap-2">
                        {q.options.map((o, oi) => (
                          <button key={oi} onClick={() => setAnswers(prev => { const next = prev.filter(a => a.questionIdx !== qi); next.push({ questionIdx: qi, optionIdx: oi }); return next })} className={`text-left px-3 py-2 rounded-lg text-xs transition-all border ${answered?.optionIdx === oi ? 'bg-orange-500/20 border-orange-500/40 text-orange-400' : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'}`}>{o}</button>
                        ))}
                      </div>
                    </div>
                  )
                })}
                <div className="text-sm text-white/40 text-center">{answers.length}/10 回答済み</div>
                <button onClick={() => setShowResult(true)} disabled={answers.length < 10} className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-30 transition-opacity">
                  🚀 診断結果を見る
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 rounded-2xl p-5">
                  <h3 className="font-bold text-lg mb-2">🏆 あなたにおすすめのAI副業 TOP3</h3>
                  {getDiagnosisResults().slice(0, 3).map((cat, i) => (
                    <div key={cat.id} className="flex items-center gap-3 bg-black/20 rounded-xl p-3 mb-2">
                      <span className="text-2xl">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{cat.icon} {cat.name}</div>
                        <div className="text-xs text-white/50">{cat.description}</div>
                        <div className="text-xs text-orange-400 mt-1">{cat.avgRevenue} ・ 難易度{'⭐'.repeat(cat.difficulty)}</div>
                      </div>
                      <button onClick={() => { setSelectedCatId(cat.id); setTab('roadmap') }} className="px-3 py-1.5 bg-orange-500/20 text-orange-400 rounded-lg text-xs hover:bg-orange-500/30">詳細</button>
                    </div>
                  ))}
                </div>

                <h3 className="text-sm font-bold text-white/60">全カテゴリランキング</h3>
                <div className="space-y-1">
                  {getDiagnosisResults().slice(3).map((cat, i) => (
                    <div key={cat.id} className="flex items-center gap-3 bg-white/5 rounded-lg p-2.5">
                      <span className="text-xs text-white/30 w-6">{i + 4}位</span>
                      <span>{cat.icon}</span>
                      <div className="flex-1 text-xs">{cat.name}</div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${cat.level === 'beginner' ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'}`}>{cat.level === 'beginner' ? '初心者向け' : '経験者向け'}</span>
                    </div>
                  ))}
                </div>

                <button onClick={() => { setShowResult(false); setAnswers([]) }} className="w-full py-2 bg-white/10 rounded-xl text-sm text-white/60 hover:bg-white/15">もう一度診断する</button>
              </div>
            )}
          </div>
        )}

        {/* ==================== ROADMAP ==================== */}
        {tab === 'roadmap' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">📋 ロードマップ</h2>
              <p className="text-sm text-white/50">0→収益化までのステップガイド</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-[240px] overflow-y-auto pr-1">
              {CATEGORIES.map(c => (
                <button key={c.id} onClick={() => setSelectedCatId(c.id)} className={`text-left p-2.5 rounded-xl text-xs transition-all border ${selectedCatId === c.id ? 'bg-orange-500/20 border-orange-500/40 text-white' : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'}`}>
                  <span className="text-base">{c.icon}</span>
                  <div className="font-medium mt-0.5 leading-tight">{c.name}</div>
                </button>
              ))}
            </div>

            <div className="bg-white/5 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{selectedCat.icon}</span>
                <div>
                  <h3 className="font-bold">{selectedCat.name}</h3>
                  <p className="text-xs text-white/50">{selectedCat.description}</p>
                </div>
                <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${selectedCat.level === 'beginner' ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'}`}>{selectedCat.level === 'beginner' ? '初心者向け' : '経験者向け'}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                <div className="bg-black/20 rounded-lg p-2 text-center"><div className="text-xs text-white/40">目安収入</div><div className="text-sm font-bold text-orange-400">{selectedCat.avgRevenue}</div></div>
                <div className="bg-black/20 rounded-lg p-2 text-center"><div className="text-xs text-white/40">初期費用</div><div className="text-sm font-bold text-green-400">{selectedCat.startCost}</div></div>
                <div className="bg-black/20 rounded-lg p-2 text-center"><div className="text-xs text-white/40">初収益まで</div><div className="text-sm font-bold text-blue-400">{selectedCat.timeToFirst}</div></div>
                <div className="bg-black/20 rounded-lg p-2 text-center"><div className="text-xs text-white/40">難易度</div><div className="text-sm font-bold text-yellow-400">{'⭐'.repeat(selectedCat.difficulty)}</div></div>
              </div>

              <h4 className="text-sm font-bold mb-2 text-orange-400">📍 ロードマップ（6ステップ）</h4>
              <div className="space-y-2 mb-4">
                {selectedCat.roadmapSteps.map((step, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="shrink-0 w-7 h-7 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold">{i + 1}</div>
                    <div className="text-sm text-white/70 pt-1">{step}</div>
                  </div>
                ))}
              </div>

              <h4 className="text-sm font-bold mb-2 text-green-400">💡 成功のコツ</h4>
              <div className="space-y-1 mb-4">
                {selectedCat.tips.map((tip, i) => (
                  <div key={i} className="text-xs text-white/60 bg-black/20 rounded-lg px-3 py-2">• {tip}</div>
                ))}
              </div>

              <h4 className="text-sm font-bold mb-2 text-blue-400">🔧 必要ツール</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCat.requiredTools.map(t => (
                  <span key={t} className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded-lg">{t}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== SIMULATOR ==================== */}
        {tab === 'simulator' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">💰 収益シミュレーター</h2>
              <p className="text-sm text-white/50">副業カテゴリ別の収入をシミュレーション</p>
            </div>

            <div>
              <label className="text-xs text-white/50 mb-2 block">カテゴリ</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto">
                {CATEGORIES.map(c => (
                  <button key={c.id} onClick={() => { setSimCatId(c.id); setSimPrice(c.priceRange.min) }} className={`text-left p-2 rounded-lg text-xs border transition-all ${simCatId === c.id ? 'bg-orange-500/20 border-orange-500/40' : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'}`}>{c.icon} {c.name}</button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-sm font-bold mb-3">{simCat.icon} {simCat.name}</div>
              <div className="text-xs text-white/40 mb-3">相場: {simCat.priceRange.label} ¥{simCat.priceRange.min.toLocaleString()}〜¥{simCat.priceRange.max.toLocaleString()}</div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-white/50">月間案件数: {simCount}件</label>
                  <input type="range" min={1} max={30} value={simCount} onChange={e => setSimCount(Number(e.target.value))} className="w-full accent-orange-500" />
                </div>
                <div>
                  <label className="text-xs text-white/50">1件あたりの単価: ¥{simPrice.toLocaleString()}</label>
                  <input type="range" min={simCat.priceRange.min} max={simCat.priceRange.max} step={Math.max(100, Math.round((simCat.priceRange.max - simCat.priceRange.min) / 20))} value={simPrice} onChange={e => setSimPrice(Number(e.target.value))} className="w-full accent-orange-500" />
                </div>
                <div>
                  <label className="text-xs text-white/50">月間作業時間: {simHours}時間</label>
                  <input type="range" min={1} max={160} value={simHours} onChange={e => setSimHours(Number(e.target.value))} className="w-full accent-orange-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 text-center">
                <div className="text-xs text-white/40">月収</div>
                <div className="text-xl font-bold text-orange-400">¥{monthlyRevenue.toLocaleString()}</div>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                <div className="text-xs text-white/40">年収</div>
                <div className="text-xl font-bold text-green-400">¥{yearlyRevenue.toLocaleString()}</div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
                <div className="text-xs text-white/40">時給換算</div>
                <div className="text-xl font-bold text-blue-400">¥{monthlyHourlyRate.toLocaleString()}</div>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-center">
                <div className="text-xs text-white/40">日給換算</div>
                <div className="text-xl font-bold text-purple-400">¥{Math.round(monthlyRevenue / 22).toLocaleString()}</div>
              </div>
            </div>

            {monthlyHourlyRate > 0 && (
              <div className="bg-white/5 rounded-xl p-4 text-sm text-white/60">
                💡 時給 ¥{monthlyHourlyRate.toLocaleString()} は{monthlyHourlyRate >= 3000 ? '会社員の副業としてかなり優秀！' : monthlyHourlyRate >= 1500 ? 'アルバイトより効率的。スキルUPでさらに上がります。' : 'まだ成長段階。実績を積んで単価UPを目指しましょう。'}
              </div>
            )}
          </div>
        )}

        {/* ==================== TEMPLATES ==================== */}
        {tab === 'templates' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">✍️ テンプレート集</h2>
              <p className="text-sm text-white/50">応募文・ポートフォリオ・料金表・請求書・営業DMのひな形</p>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {PROPOSAL_TEMPLATES.map((t, i) => (
                <button key={i} onClick={() => setSelectedTemplateIdx(i)} className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${selectedTemplateIdx === i ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>{t.title}</button>
              ))}
            </div>

            <div className="bg-white/5 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold">{PROPOSAL_TEMPLATES[selectedTemplateIdx].title}</h3>
                <button onClick={() => handleCopy(PROPOSAL_TEMPLATES[selectedTemplateIdx].content)} className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-lg text-xs hover:bg-orange-500/30">{copied ? '✅ コピー済み' : '📋 コピー'}</button>
              </div>
              <pre className="text-sm text-white/70 whitespace-pre-wrap bg-black/30 rounded-lg p-4 font-mono leading-relaxed">{PROPOSAL_TEMPLATES[selectedTemplateIdx].content}</pre>
            </div>
          </div>
        )}

        {/* ==================== TOOLS DICTIONARY ==================== */}
        {tab === 'tools' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">🛠️ AIツール辞典</h2>
              <p className="text-sm text-white/50">カテゴリ別おすすめAIツール一覧</p>
            </div>

            <div className="flex gap-2">
              {[
                { id: 'all' as const, label: 'すべて (13)' },
                { id: 'beginner' as const, label: '🟢 初心者 (9)' },
                { id: 'advanced' as const, label: '🟣 経験者 (4)' },
              ].map(f => (
                <button key={f.id} onClick={() => setToolFilter(f.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${toolFilter === f.id ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>{f.label}</button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredCats.map(cat => (
                <div key={cat.id} className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{cat.icon}</span>
                    <span className="font-bold text-sm">{cat.name}</span>
                    <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${cat.level === 'beginner' ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'}`}>{cat.level === 'beginner' ? '初心者' : '経験者'}</span>
                  </div>
                  <div className="space-y-2">
                    {cat.aiTools.map(tool => (
                      <div key={tool.name} className="flex items-center gap-3 bg-black/20 rounded-lg p-2.5">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white/80">{tool.name}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded ${tool.free ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>{tool.free ? '無料' : '有料'}</span>
                          </div>
                          <div className="text-xs text-white/40">{tool.desc}</div>
                        </div>
                        <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-xs text-orange-400 hover:text-orange-300 shrink-0">🔗</a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== ACTIVITY LOG ==================== */}
        {tab === 'log' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">📊 活動ログ</h2>
              <p className="text-sm text-white/50">案件記録・売上管理・時給換算</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 text-center"><div className="text-xs text-white/40">総売上</div><div className="text-lg font-bold text-orange-400">¥{totalRevenue.toLocaleString()}</div></div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center"><div className="text-xs text-white/40">総経費</div><div className="text-lg font-bold text-red-400">¥{totalExpense.toLocaleString()}</div></div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center"><div className="text-xs text-white/40">純利益</div><div className="text-lg font-bold text-green-400">¥{(totalRevenue - totalExpense).toLocaleString()}</div></div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-center"><div className="text-xs text-white/40">平均時給</div><div className="text-lg font-bold text-blue-400">¥{avgHourlyRate.toLocaleString()}</div></div>
            </div>

            {/* Add form */}
            <div className="bg-white/5 rounded-xl p-4">
              <h3 className="text-sm font-bold mb-3">📝 案件を記録</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/50">カテゴリ</label>
                  <select value={logForm.category} onChange={e => setLogForm({ ...logForm, category: e.target.value })} className="w-full bg-gray-900 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white [&>option]:bg-gray-900">
                    {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/50">案件名</label>
                  <input value={logForm.title} onChange={e => setLogForm({ ...logForm, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs" placeholder="バナー制作" />
                </div>
                <div>
                  <label className="text-xs text-white/50">売上(¥)</label>
                  <input type="number" value={logForm.revenue || ''} onChange={e => setLogForm({ ...logForm, revenue: Number(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs" placeholder="5000" />
                </div>
                <div>
                  <label className="text-xs text-white/50">経費(¥)</label>
                  <input type="number" value={logForm.expense || ''} onChange={e => setLogForm({ ...logForm, expense: Number(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs" placeholder="0" />
                </div>
                <div>
                  <label className="text-xs text-white/50">作業時間(h)</label>
                  <input type="number" value={logForm.hours || ''} onChange={e => setLogForm({ ...logForm, hours: Number(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs" placeholder="3" />
                </div>
                <div>
                  <label className="text-xs text-white/50">日付</label>
                  <input type="date" value={logForm.date} onChange={e => setLogForm({ ...logForm, date: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs" />
                </div>
              </div>
              <button onClick={() => { if (!logForm.title) return; saveLogs([{ id: generateId(), ...logForm }, ...logs]); setLogForm({ ...logForm, title: '', revenue: 0, expense: 0, hours: 0, note: '' }) }} disabled={!logForm.title} className="w-full mt-3 py-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg text-xs font-bold hover:opacity-90 disabled:opacity-30">記録する</button>
            </div>

            {/* Log list */}
            {logs.length === 0 ? (
              <div className="bg-white/5 rounded-xl p-8 text-center text-white/40">
                <p className="text-3xl mb-2">📊</p>
                <p className="text-sm">まだ記録がありません</p>
              </div>
            ) : (
              <div className="space-y-2">
                {logs.map(l => (
                  <div key={l.id} className="bg-white/5 rounded-lg p-3 flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white/80">{l.title}</span>
                        <span className="text-xs text-white/30">{l.category}</span>
                      </div>
                      <div className="text-xs text-white/40">{l.date} ・ {l.hours}h</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-orange-400">¥{l.revenue.toLocaleString()}</div>
                      {l.expense > 0 && <div className="text-xs text-red-400">-¥{l.expense.toLocaleString()}</div>}
                    </div>
                    <button onClick={() => saveLogs(logs.filter(r => r.id !== l.id))} className="text-xs text-red-400 hover:text-red-300">🗑</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 border-t border-white/10 mt-8">
        <p className="text-xs text-white/30 text-center">※ すべてのデータはブラウザ内に保存されます。サーバーへの送信はありません。</p>
      </div>
    </div>
  )
}
