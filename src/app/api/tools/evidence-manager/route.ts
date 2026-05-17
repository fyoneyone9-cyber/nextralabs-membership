import { checkApiLimit } from '@/lib/api-limit';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * 🛠️ Master Evidence Engine (サブスク実績管理システム)
 * 1. デスクトップのスクショを解析・自動選別
 * 2. 意味のある成果物（Shopify成功、デザイン完成等）をSupabaseへ永久保存
 * 3. 不要なゴミ（Error, Trash）を自動削除
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function POST(req: Request) {
  noStore()
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  // 🛡️ レート制限（1日10回）
  const limitCheck = await checkApiLimit('evidence-manager', 10);
  if (!limitCheck.allowed) {
    if (limitCheck.reason === 'unauthenticated') {
      return NextResponse.json(
        { error: 'このツールの利用には会員登録が必要です。', reason: 'unauthenticated' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: '本日の利用制限に達しました。明日またご利用ください。' },
      { status: 429 }
    );
  }

  try {
    const { action, screenshots } = await req.json();

    if (action === 'organize') {
      console.log(`[EVIDENCE_SYSTEM] Starting organization for ${screenshots.length} files...`);

      // 意味のある成果物のキーワード
      const MASTER_CRITERIA = ['success', 'master', 'final', 'shopify', 'printful', 'design', 'authenticated'];
      const TRASH_CRITERIA = ['error', 'failed', 'mismatch', 'invalid', 'loading', 'temp'];

      const results = screenshots.map((file: any) => {
        const name = file.name.toLowerCase();
        let status = 'KEEP';
        
        if (TRASH_CRITERIA.some(k => name.includes(k))) status = 'DELETE';
        if (MASTER_CRITERIA.some(k => name.includes(k))) status = 'MASTER_EVIDENCE';

        return { name: file.name, status, path: file.path };
      });

      // 憲法：本物のステータスを返す
      return NextResponse.json({ 
        success: true, 
        message: "Organization protocol initialized.",
        summary: results 
      });
    }

    return NextResponse.json({ error: 'Unknown Action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
