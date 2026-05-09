import { checkApiLimit } from '@/lib/api-limit';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// プラン別制限（憲法遵守：極小・安全）
const PLAN_LIMITS: Record<string, { daily: number; maxSize: number }> = {
  '無料': { daily: 0, maxSize: 0 },
  'ライト': { daily: 1, maxSize: 3 * 1024 * 1024 }, // 3MB
  'スタンダード': { daily: 3, maxSize: 5 * 1024 * 1024 }, // 5MB
  'プレミアム': { daily: 10, maxSize: 10 * 1024 * 1024 }, // 10MB
};

export async function POST(req: Request) {
  // 🛡️ レート制限（1日10回）
  const limitCheck = await checkApiLimit('pdf-compress', 10);
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
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value },
        },
      }
    );

    // 1. 認証チェック
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });
    }

    // 2. プラン取得
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    const role = profile?.role || 'ライト'; // デフォルトはライト
    const limit = PLAN_LIMITS[role] || PLAN_LIMITS['ライト'];

    // 3. 本日の利用回数チェック
    const today = new Date().toISOString().split('T')[0];
    const { data: usage, error: usageError } = await supabase
      .from('api_usage')
      .select('count')
      .eq('user_id', user.id)
      .eq('tool_id', 'pdf-compressor')
      .eq('usage_date', today)
      .single();

    if (usage && usage.count >= limit.daily) {
      return NextResponse.json({ 
        error: `本日の利用上限（${limit.daily}回）に達しました。憲法により無制限提供は禁止されています。` 
      }, { status: 429 });
    }

    // 4. ファイル受信 & サイズチェック
    const formData = await req.json();
    const { pdfBase64, fileName } = formData;
    
    if (!pdfBase64) return NextResponse.json({ error: 'ファイルがありません' }, { status: 400 });

    const buffer = Buffer.from(pdfBase64, 'base64');
    if (buffer.length > limit.maxSize) {
      return NextResponse.json({ 
        error: `ファイルサイズが大きすぎます（上限: ${limit.maxSize / (1024 * 1024)}MB）` 
      }, { status: 413 });
    }

    // 5. 圧縮処理（本来はここでgskやpdf-libを使用）
    // 今回は「最小限」の実装として、成功レスポンスのみ返す（フロントでデモ的に処理、または簡易的なライブラリを後ほど導入）
    // NextraLabsの要件に合わせて、回数カウントを更新
    
    const { error: updateError } = await supabase
      .from('api_usage')
      .upsert({
        user_id: user.id,
        tool_id: 'pdf-compressor',
        usage_date: today,
        count: (usage?.count || 0) + 1
      }, { onConflict: 'user_id,tool_id,usage_date' });

    if (updateError) throw updateError;

    // 実際には圧縮した結果を返すが、ここでは一旦そのまま返す（モック）
    // 本番では gsk drive 等の外部APIを叩くロジックをここに入れる
    return NextResponse.json({ 
      success: true, 
      message: '圧縮が完了しました（デモ：憲法に基づき回数を消費しました）',
      downloadUrl: `data:application/pdf;base64,${pdfBase64}` // 本来は圧縮後のデータ
    });

  } catch (error: any) {
    console.error('PDF Compress Error:', error);
    return NextResponse.json({ error: '予期せぬエラーが発生しました' }, { status: 500 });
  }
}
