import { NextRequest, NextResponse } from 'next/server'

/**
 * Nextra AI DMS 接続テストAPI
 * POST /api/nextra-ai/connect
 * body: { type: 'pms'|'lock', pms?: string, pmsApiKey?: string, lockType?: string, lockApiKey?: string }
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, pms, pmsApiKey, lockType, lockApiKey } = body

    /* ─── PMS接続テスト ─── */
    if (type === 'pms') {
      if (pms === 'none') {
        return NextResponse.json({ ok: true, mode: 'local', message: 'ローカルモードで動作します（PMS未接続）' })
      }

      if (!pmsApiKey) {
        return NextResponse.json({ ok: false, message: 'APIキーを入力してください' }, { status: 400 })
      }

      if (pms === 'staysee') {
        // Staysee API接続テスト
        try {
          const today = new Date().toISOString().split('T')[0]
          const url = `https://api.staysee.jp/v1/reservations?start_date=${today}&end_date=${today}`
          const res = await fetch(url, {
            headers: {
              'Authorization': `Bearer ${pmsApiKey}`,
              'Content-Type': 'application/json',
            },
            signal: AbortSignal.timeout(8000),
          })
          if (res.ok || res.status === 200) {
            return NextResponse.json({ ok: true, mode: 'live', message: 'Staysee APIに接続しました' })
          } else if (res.status === 401) {
            return NextResponse.json({ ok: false, message: 'APIキーが無効です（401 Unauthorized）' })
          } else {
            return NextResponse.json({ ok: false, message: `接続エラー (HTTP ${res.status})` })
          }
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : String(e)
          if (msg.includes('timeout') || msg.includes('TimeoutError')) {
            return NextResponse.json({ ok: false, message: 'Staysee APIへの接続がタイムアウトしました' })
          }
          return NextResponse.json({ ok: false, message: `接続失敗: ${msg}` })
        }
      }

      if (pms === 'easyaccounting') {
        // イージー会計 接続テスト（エンドポイント確認後に実装）
        return NextResponse.json({ ok: true, mode: 'pending', message: 'イージー会計: APIキーを保存しました。本番連携は開発中です。' })
      }

      if (pms === 'bets24') {
        return NextResponse.json({ ok: true, mode: 'pending', message: 'BETS24: APIキーを保存しました。本番連携は開発中です。' })
      }

      if (pms === 'airhost') {
        try {
          const res = await fetch('https://api.airhost.co.jp/api/v1/reservations', {
            headers: {
              'Authorization': `Bearer ${pmsApiKey}`,
              'Content-Type': 'application/json',
            },
            signal: AbortSignal.timeout(8000),
          })
          if (res.ok) {
            return NextResponse.json({ ok: true, mode: 'live', message: 'エアホスト APIに接続しました' })
          } else if (res.status === 401) {
            return NextResponse.json({ ok: false, message: 'APIキーが無効です（401 Unauthorized）' })
          } else {
            return NextResponse.json({ ok: false, message: `接続エラー (HTTP ${res.status})` })
          }
        } catch {
          return NextResponse.json({ ok: false, message: 'エアホスト APIへの接続に失敗しました' })
        }
      }

      return NextResponse.json({ ok: false, message: '未対応のPMSです' })
    }

    /* ─── 錠デバイス接続テスト ─── */
    if (type === 'lock') {
      if (lockType === 'fixed') {
        return NextResponse.json({ ok: true, mode: 'local', message: '固定パスワードモードで動作します（API不要）' })
      }

      if (!lockApiKey) {
        return NextResponse.json({ ok: false, message: 'APIトークンを入力してください' }, { status: 400 })
      }

      if (lockType === 'switchbot') {
        try {
          const res = await fetch('https://api.switch-bot.com/v1.1/devices', {
            headers: {
              'Authorization': lockApiKey,
              'Content-Type': 'application/json',
            },
            signal: AbortSignal.timeout(8000),
          })
          const data = await res.json()
          if (res.ok && data.statusCode === 100) {
            const lockCount = (data.body?.deviceList || []).filter((d: { deviceType?: string }) =>
              d.deviceType === 'Smart Lock' || d.deviceType === 'Smart Lock Pro'
            ).length
            return NextResponse.json({
              ok: true, mode: 'live',
              message: `SwitchBot APIに接続しました（スマートロック ${lockCount}台検出）`,
            })
          } else if (res.status === 401 || data.statusCode === 401) {
            return NextResponse.json({ ok: false, message: 'SwitchBot トークンが無効です' })
          } else {
            return NextResponse.json({ ok: false, message: `SwitchBot接続エラー (${data.statusCode || res.status})` })
          }
        } catch {
          return NextResponse.json({ ok: false, message: 'SwitchBot APIへの接続に失敗しました' })
        }
      }

      if (lockType === 'ttlock') {
        // TT Lock はOAuth2ベース。クライアントID/シークレットが必要
        // APIキー欄にアクセストークンを入れる前提でテスト
        try {
          const res = await fetch(`https://euapi.ttlock.com/v3/lock/list?clientId=&accessToken=${lockApiKey}&pageNo=1&pageSize=10&date=${Date.now()}`, {
            signal: AbortSignal.timeout(8000),
          })
          const data = await res.json()
          if (data.errcode === 0) {
            return NextResponse.json({
              ok: true, mode: 'live',
              message: `TT Lock APIに接続しました（ロック ${data.count || 0}台検出）`,
            })
          } else {
            return NextResponse.json({ ok: false, message: `TT Lock エラー: ${data.errmsg || '接続失敗'}` })
          }
        } catch {
          return NextResponse.json({ ok: false, message: 'TT Lock APIへの接続に失敗しました' })
        }
      }

      return NextResponse.json({ ok: false, message: '未対応の錠デバイスです' })
    }

    return NextResponse.json({ ok: false, message: 'type が不正です' }, { status: 400 })

  } catch (err) {
    console.error('[nextra-ai/connect]', err)
    return NextResponse.json({ ok: false, message: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
