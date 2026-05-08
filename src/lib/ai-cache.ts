import { NextResponse } from 'next/server';
import crypto from 'crypto';

// セマンティックキャッシュ（保存して消えない）用の外部データベース接続を想定
// デモ用にグローバル変数で簡易実装。本来は Supabase や Redis を使用。
const cache: Record<string, string> = {};

export async function checkCache(query: string) {
  // 1. クエリからハッシュ生成（完全一致用）
  const hash = crypto.createHash('md5').update(query).digest('hex');
  
  if (cache[hash]) {
    console.log('💰 [CACHE HIT] クレジット節約に成功しました');
    return cache[hash];
  }
  return null;
}

export async function saveToCache(query: string, response: string) {
  const hash = crypto.createHash('md5').update(query).digest('hex');
  cache[hash] = response;
  console.log('✅ [CACHE SAVED] 次回の同じ質問は無料になります');
}

export async function handleAiRequest(query: string, aiCall: () => Promise<string>) {
  // キャッシュ確認
  const cached = await checkCache(query);
  if (cached) return cached;

  // AI呼び出し（クレジット消費）
  const response = await aiCall();

  // 保存
  await saveToCache(query, response);
  
  return response;
}
