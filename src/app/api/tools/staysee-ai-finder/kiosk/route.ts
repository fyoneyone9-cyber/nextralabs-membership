import { NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache'

/**
 * 🤖 Kiosk Automation API (MASTERMODEL)
 * 憲法：無人フロント用キオスク端末からのリクエストを処理し、発送ラベルデータを作成。
 */

export async function POST(req: Request) {
  noStore()
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  try {
    const { action, matchData, shippingInfo } = await req.json();

    if (action === 'generate-label') {
      // 🚀 発送ラベル用のデータを生成（将来的にヤマト等のAPI連携へ拡張可能）
      const labelId = `LABEL-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      const labelContent = `
======= 発送ラベル / SHIPPING LABEL =======
管理番号: ${labelId}
お届け先: ${shippingInfo.name} 様
住所: ${shippingInfo.address}
電話: ${shippingInfo.tel}
-------------------------------------------
品名: ${matchData.itemName}
発送元: NextraLabs Hotel (無人管理)
===========================================
      `;

      return NextResponse.json({ 
        success: true, 
        labelId,
        labelContent,
        printableCommand: "PRINT_RAW_TEXT" // レシートプリンターへのコマンド
      });
    }

    return NextResponse.json({ error: 'Invalid kiosk action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
