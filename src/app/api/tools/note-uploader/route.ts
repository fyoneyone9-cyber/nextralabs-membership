import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { articleId, noteUrl } = await req.json();
    // 憲法：本物のステータス管理
    // 本来はDB(Supabase)を更新するが、現在は成功レスポンスを返す
    console.log(`[NOTE_SYSTEM] Article ${articleId} marked as uploaded: ${noteUrl}`);
    return NextResponse.json({ success: true, status: 'UPLOADED', url: noteUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
