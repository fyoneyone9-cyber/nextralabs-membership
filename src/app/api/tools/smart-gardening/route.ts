import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // プレ解析（速報）はUI側での演出に任せ、APIは成功レスポンスを返すのみにする
    // （将来的に内製解析に戻すためのエンドポイントとして維持）
    return NextResponse.json({ 
      name: "解析完了", 
      status: "詳細診断の準備が整いました", 
      environment: "連携済み", 
      confidence: "100" 
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'System Error' }, { status: 500 });
  }
}
