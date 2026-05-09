import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// 環境変数の読み込み（プロジェクトルートの .env から）
dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY // サーバーサイド用キーが必要

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials missing.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)
const MEMORY_PATH = path.join(process.cwd(), 'MEMORY.md')

async function sync() {
  console.log('🔄 Syncing Nextra Knowledge...')

  // 1. クラウドから最新のナレッジを取得 (ai_knowledgeテーブルを想定)
  const { data: cloudData, error: pullError } = await supabase
    .from('ai_knowledge')
    .select('content')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  if (pullError) {
    console.log('ℹ️ Cloud knowledge not found or empty. Skipping pull.')
  } else if (cloudData) {
    // ローカルのMEMORY.mdとマージ（または更新）
    // シンプルに最新版で上書きする例（必要に応じてマージロジックを追加）
    // fs.writeFileSync(MEMORY_PATH, cloudData.content)
    console.log('✅ Pulled latest knowledge from Cloud.')
  }

  // 2. ローカルの最新状態をクラウドへPush
  if (fs.existsSync(MEMORY_PATH)) {
    const localContent = fs.readFileSync(MEMORY_PATH, 'utf-8')
    const { error: pushError } = await supabase
      .from('ai_knowledge')
      .upsert({ 
        id: 'main_memory', // 固定IDで常に最新を保持
        content: localContent,
        updated_at: new Date().toISOString()
      })

    if (pushError) {
      console.error('❌ Push failed:', pushError.message)
    } else {
      console.log('🚀 Local knowledge pushed to Cloud.')
    }
  }

  console.log('✨ Sync process completed.')
}

sync()
