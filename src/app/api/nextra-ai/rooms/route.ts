import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/nextra-ai/rooms
 * PMS（Staysee）から部屋一覧を取得。
 * APIキーなし or エラー時はエラーを返す（クライアント側でローカルにフォールバック）
 */
export async function GET(req: NextRequest) {
  // PMS APIキーをヘッダーから受け取るか、環境変数からフォールバック
  const authHeader = req.headers.get('x-pms-api-key') || ''

  // Staysee 部屋一覧API
  if (authHeader) {
    try {
      const res = await fetch('https://api.staysee.jp/v1/rooms', {
        headers: {
          'Authorization': `Bearer ${authHeader}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(8000),
      })

      if (res.ok) {
        const data = await res.json()
        const rooms = (data.rooms || data || []).map((r: {
          id?: string | number
          room_id?: string | number
          name?: string
          room_type?: string
          capacity?: number
          floor?: string | number
          property_name?: string
        }) => ({
          id:           String(r.id || r.room_id || ''),
          pms_room_id:  String(r.id || r.room_id || ''),
          name:         r.name || String(r.id || r.room_id || ''),
          room_type:    r.room_type || null,
          capacity:     r.capacity  || null,
          floor:        r.floor ? `${r.floor}F` : null,
          property_name: r.property_name || '',
        }))
        return NextResponse.json({ rooms, source: 'pms' })
      }

      if (res.status === 401) {
        return NextResponse.json({ error: 'Staysee APIキーが無効です（401）', rooms: [] }, { status: 401 })
      }
      return NextResponse.json({ error: `Staysee 接続エラー (HTTP ${res.status})`, rooms: [] }, { status: res.status })

    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      return NextResponse.json({ error: `PMS接続失敗: ${msg}`, rooms: [] }, { status: 503 })
    }
  }

  // APIキーなし → ローカルモード用の空レスポンス
  return NextResponse.json({
    rooms: [],
    source: 'local',
    message: 'PMS APIキーが設定されていません。ローカル管理モードで動作します。'
  })
}
