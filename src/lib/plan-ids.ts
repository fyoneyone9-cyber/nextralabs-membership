// =============================================
// プラン別ツールID 一元管理
// check-access/route.ts と AccessGate.tsx の両方がここを参照する
// ここだけ編集すれば全体に反映される
// =============================================

// 👑 プレミアム専用 (¥1,980/月)
export const PREMIUM_IDS = [
  'inbox-organizer',        // Gmail AI Accelerator
  'youtube-producer',       // AI YouTubeプロデューサー
  'youtube-coordinator',    // YouTube AI Sync
  'sns-auto-poster',        // AI SNSオートポスター
  'ai-select-shop',         // AIセレクトショップ
  'trend-stock',            // SNSトレンドAI分析
  'prompt-master',          // AI画像プロンプトマスター
]

// ⚡ スタンダード以上 (¥980/月〜)
export const STANDARD_IDS = [
  'ai-sidejob',             // AI副業スタートダッシュ
  'disaster-guard',         // AI防災パーソナルガイド
  'scam-defender',          // AI詐欺ディフェンダー
  'money-guard',            // AI家計防衛シミュレーター
  'moving-checker',         // AI引越し安心チェッカー
  'buy-smart-nav',          // 中古・新品AI比較ナビ
  'location-finder',        // AI Location Finder
  'ai-recipe',              // AIレシピ献立コーチ
  'ai-konkatsu',            // AI婚活コーチ
  'exam-scheduler',         // AI試験スケジューラー
  'kindle-factory',         // Kindle AI Factory
  'smart-gardening',        // AIスマートガーデニング
  'buzz-writer',            // BuzzWriter
  'closet-coach',           // ClosetCoach
  'comm-coach',             // CommCoach
  'evidence-manager',       // エビデンスAIマネージャー
  'gift-advisor',           // AIギフトアドバイザー
  'travel-concierge',       // AI旅行コンシェルジュ
  'pilgrimage-planner',     // 推し活聖地巡礼プランナー
  'kindle-ai-factory',      // Kindle AI ファクトリー
  'repair-parts-finder',    // AI修理パーツ診断くん
  'ai-exam-generator',      // AI問題生成＆苦手分析
  'konkatsu-scheduler',     // AI婚活スケジューラー
  'nostalgic-recom',        // あの頃の僕へ タイムトラベルレコメンド
  'cross-checker',          // AIクロスチェッカー — Gemini + GPT-4o
]

// 🔵 ライト以上 (¥480/月〜)
export const LIGHT_IDS = [
  'expense-sync',           // Expense AI Sync
  'contact-sync',           // Contact AI Sync
]

// 🏨 エンタープライズ専用（別見積もり・直接契約のみ）
export const ENTERPRISE_IDS = [
  'staysee-ai-finder',
  'nextra-ai',
  'weather-boost',
  'voice-guest-assist',
]
