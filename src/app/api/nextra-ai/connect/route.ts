import { NextRequest, NextResponse } from 'next/server'
import { unstable_noStore as noStore } from 'next/cache'
import crypto from 'crypto'

/**
 * Nextra AI DMS 接続テストAPI
 * POST /api/nextra-ai/connect
 * body: {
 *   type: 'pms' | 'lock'
 *   pms?: string
 *   lockType?: string
 *   fields?: Record<string, string>   // 各サービスの必須フィールド群
 * }
 */

export async function POST(req: NextRequest) {
  noStore()
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  try {
    const body = await req.json()
    const { type, pms, lockType, fields = {} } = body as {
      type: string
      pms?: string
      lockType?: string
      fields?: Record<string, string>
    }

    /* ══════════ PMS接続テスト ══════════ */
    if (type === 'pms') {

      // ── ローカルモード ──
      if (pms === 'none')    return NextResponse.json({ ok: true, mode: 'local', message: 'ローカルモードで動作します（PMS未接続）' })
      if (pms === 'offline') return NextResponse.json({ ok: true, mode: 'local', message: 'オフラインモードで動作します' })

      // ── 開発中PMS（先行保存） ──
      const PENDING_PMS = ['easyaccounting', 'bets24', 'neppan', 'apaleo', 'hostaway', 'little_hotelier', 'opera']
      if (PENDING_PMS.includes(pms ?? '')) {
        return NextResponse.json({
          ok: true, mode: 'pending',
          message: `${pms} のAPIキーを保存しました。本番連携は開発中です（リリース後すぐ使えます）。`,
        })
      }

      // ── Staysee ──
      if (pms === 'staysee') {
        const apiKey = fields.apiKey
        if (!apiKey) return NextResponse.json({ ok: false, message: 'APIキーを入力してください' }, { status: 400 })
        try {
          const today = new Date().toISOString().split('T')[0]
          const res = await fetch(`https://api.staysee.jp/v1/reservations?start_date=${today}&end_date=${today}`, {
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            signal: AbortSignal.timeout(8000),
          })
          if (res.ok) return NextResponse.json({ ok: true, mode: 'live', message: 'Staysee APIに接続しました ✓' })
          if (res.status === 401) return NextResponse.json({ ok: false, message: 'APIキーが無効です（401 Unauthorized）' })
          return NextResponse.json({ ok: false, message: `接続エラー (HTTP ${res.status})` })
        } catch { return NextResponse.json({ ok: false, message: 'Staysee APIへの接続に失敗しました' }) }
      }

      // ── エアホスト ──
      if (pms === 'airhost') {
        const apiKey = fields.apiKey
        if (!apiKey) return NextResponse.json({ ok: false, message: 'APIキーを入力してください' }, { status: 400 })
        try {
          const res = await fetch('https://api.airhost.co.jp/api/v1/reservations', {
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            signal: AbortSignal.timeout(8000),
          })
          if (res.ok) return NextResponse.json({ ok: true, mode: 'live', message: 'エアホスト APIに接続しました ✓' })
          if (res.status === 401) return NextResponse.json({ ok: false, message: 'APIキーが無効です（401 Unauthorized）' })
          return NextResponse.json({ ok: false, message: `接続エラー (HTTP ${res.status})` })
        } catch { return NextResponse.json({ ok: false, message: 'エアホスト APIへの接続に失敗しました' }) }
      }

      // ── Beds24 ──
      if (pms === 'beds24') {
        const propKey = fields.propKey
        if (!propKey) return NextResponse.json({ ok: false, message: 'Prop Key（APIトークン）を入力してください' }, { status: 400 })
        try {
          const res = await fetch('https://beds24.com/api/v2/authentication/setup', {
            method: 'GET',
            headers: { 'token': propKey, 'Content-Type': 'application/json' },
            signal: AbortSignal.timeout(8000),
          })
          if (res.ok) return NextResponse.json({ ok: true, mode: 'live', message: 'Beds24 APIに接続しました ✓' })
          if (res.status === 401) return NextResponse.json({ ok: false, message: 'Beds24 Prop Keyが無効です' })
          return NextResponse.json({ ok: false, message: `Beds24 接続エラー (HTTP ${res.status})` })
        } catch { return NextResponse.json({ ok: false, message: 'Beds24 APIへの接続に失敗しました' }) }
      }

      // ── Cloudbeds (OAuth2 client credentials) ──
      if (pms === 'cloudbeds') {
        const { clientId, clientSecret } = fields
        if (!clientId || !clientSecret) return NextResponse.json({ ok: false, message: 'Client ID と Client Secret を入力してください' }, { status: 400 })
        try {
          const tokenRes = await fetch('https://hotels.cloudbeds.com/api/v1.1/oauth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ grant_type: 'client_credentials', client_id: clientId, client_secret: clientSecret }),
            signal: AbortSignal.timeout(10000),
          })
          if (tokenRes.ok) {
            const data = await tokenRes.json()
            if (data.access_token) return NextResponse.json({ ok: true, mode: 'live', message: 'Cloudbeds APIに接続しました ✓' })
          }
          if (tokenRes.status === 401) return NextResponse.json({ ok: false, message: 'Client ID / Client Secretが無効です' })
          return NextResponse.json({ ok: false, message: `Cloudbeds 接続エラー (HTTP ${tokenRes.status})` })
        } catch { return NextResponse.json({ ok: false, message: 'Cloudbeds APIへの接続に失敗しました' }) }
      }

      return NextResponse.json({ ok: false, message: '未対応のPMSです' })
    }

    /* ══════════ 錠デバイス接続テスト ══════════ */
    if (type === 'lock') {

      // ── ローカルモード ──
      if (lockType === 'fixed')   return NextResponse.json({ ok: true, mode: 'local', message: '固定パスワードモード（API不要）で動作します ✓' })
      if (lockType === 'offline') return NextResponse.json({ ok: true, mode: 'local', message: 'オフライン（手渡し）モードで動作します ✓' })

      // ── 開発中デバイス（先行保存） ──
      const PENDING_LOCKS = ['remotelock', 'salto']
      if (PENDING_LOCKS.includes(lockType ?? '')) {
        return NextResponse.json({
          ok: true, mode: 'pending',
          message: `${lockType} のAPIキーを保存しました。本番連携は開発中です。`,
        })
      }

      // ── SwitchBot v1.1（Token + Secret → HMAC-SHA256署名） ──
      if (lockType === 'switchbot') {
        const { token, secret } = fields
        if (!token || !secret) return NextResponse.json({ ok: false, message: 'Open Token と Secret Key の両方を入力してください' }, { status: 400 })
        try {
          const t  = Date.now().toString()
          const nonce = crypto.randomBytes(8).toString('hex')
          const sign = crypto.createHmac('sha256', secret)
            .update(token + t + nonce)
            .digest('base64')
          const res = await fetch('https://api.switch-bot.com/v1.1/devices', {
            headers: {
              'Authorization': token,
              'sign': sign,
              't': t,
              'nonce': nonce,
              'Content-Type': 'application/json',
            },
            signal: AbortSignal.timeout(8000),
          })
          const data = await res.json()
          if (res.ok && data.statusCode === 100) {
            const lockCount = (data.body?.deviceList || []).filter((d: { deviceType?: string }) =>
              ['Smart Lock', 'Smart Lock Pro', 'Lock Ultra', 'Lock Lite'].includes(d.deviceType ?? '')
            ).length
            return NextResponse.json({
              ok: true, mode: 'live',
              message: `SwitchBot APIに接続しました ✓（スマートロック ${lockCount}台検出）`,
            })
          }
          if (res.status === 401 || data.statusCode === 401) return NextResponse.json({ ok: false, message: 'Token/Secret Keyが無効です（認証失敗）' })
          return NextResponse.json({ ok: false, message: `SwitchBot接続エラー (${data.statusCode ?? res.status})` })
        } catch { return NextResponse.json({ ok: false, message: 'SwitchBot APIへの接続に失敗しました' }) }
      }

      // ── TT Lock（OAuth2 Password Grant） ──
      if (lockType === 'ttlock') {
        const { clientId, clientSecret, username, password } = fields
        if (!clientId || !clientSecret || !username || !password) {
          return NextResponse.json({ ok: false, message: 'Client ID・Client Secret・ログインID・パスワードすべて入力してください' }, { status: 400 })
        }
        try {
          // MD5ハッシュ化パスワード（TTLock仕様）
          const md5pw = crypto.createHash('md5').update(password).digest('hex')
          const tokenRes = await fetch('https://euapi.ttlock.com/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              client_id: clientId,
              client_secret: clientSecret,
              grant_type: 'password',
              username,
              password: md5pw,
            }),
            signal: AbortSignal.timeout(10000),
          })
          const data = await tokenRes.json()
          if (data.access_token) {
            // ロック一覧も取得して台数表示
            const listRes = await fetch(
              `https://euapi.ttlock.com/v3/lock/list?clientId=${clientId}&accessToken=${data.access_token}&pageNo=1&pageSize=10&date=${Date.now()}`,
              { signal: AbortSignal.timeout(8000) }
            )
            const listData = await listRes.json()
            const count = listData.list?.length ?? 0
            return NextResponse.json({ ok: true, mode: 'live', message: `TT Lock APIに接続しました ✓（ロック ${count}台検出）` })
          }
          return NextResponse.json({ ok: false, message: `TT Lock 認証失敗: ${data.errmsg ?? '入力値を確認してください'}` })
        } catch { return NextResponse.json({ ok: false, message: 'TT Lock APIへの接続に失敗しました' }) }
      }

      // ── SESAME ──
      if (lockType === 'sesame') {
        const apiKey = fields.apiKey
        if (!apiKey) return NextResponse.json({ ok: false, message: 'API Keyを入力してください' }, { status: 400 })
        try {
          const res = await fetch('https://app.candyhouse.co/api/sesame2', {
            headers: { 'x-api-key': apiKey },
            signal: AbortSignal.timeout(8000),
          })
          if (res.ok) {
            const data = await res.json()
            const count = Array.isArray(data) ? data.length : 0
            return NextResponse.json({ ok: true, mode: 'live', message: `SESAME APIに接続しました ✓（デバイス ${count}台検出）` })
          }
          if (res.status === 401 || res.status === 403) return NextResponse.json({ ok: false, message: 'SESAME API Keyが無効です' })
          return NextResponse.json({ ok: false, message: `SESAME 接続エラー (HTTP ${res.status})` })
        } catch { return NextResponse.json({ ok: false, message: 'SESAME APIへの接続に失敗しました' }) }
      }

      // ── igloohome（OAuth2 client_credentials） ──
      if (lockType === 'igloohome') {
        const { clientId, clientSecret } = fields
        if (!clientId || !clientSecret) return NextResponse.json({ ok: false, message: 'Client ID と Client Secret を入力してください' }, { status: 400 })
        try {
          const tokenRes = await fetch('https://api.igloohome.co/v1/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ grant_type: 'client_credentials', client_id: clientId, client_secret: clientSecret }),
            signal: AbortSignal.timeout(10000),
          })
          const data = await tokenRes.json()
          if (data.access_token) return NextResponse.json({ ok: true, mode: 'live', message: 'igloohome APIに接続しました ✓' })
          if (tokenRes.status === 401) return NextResponse.json({ ok: false, message: 'Client ID / Client Secretが無効です' })
          return NextResponse.json({ ok: false, message: `igloohome 接続エラー (HTTP ${tokenRes.status})` })
        } catch { return NextResponse.json({ ok: false, message: 'igloohome APIへの接続に失敗しました' }) }
      }

      // ── Nuki Web API ──
      if (lockType === 'nuki') {
        const apiToken = fields.apiToken
        if (!apiToken) return NextResponse.json({ ok: false, message: 'API Tokenを入力してください' }, { status: 400 })
        try {
          const res = await fetch('https://api.nuki.io/smartlock', {
            headers: { 'Authorization': `Bearer ${apiToken}` },
            signal: AbortSignal.timeout(8000),
          })
          if (res.ok) {
            const data = await res.json()
            const count = Array.isArray(data) ? data.length : 0
            return NextResponse.json({ ok: true, mode: 'live', message: `Nuki APIに接続しました ✓（スマートロック ${count}台検出）` })
          }
          if (res.status === 401) return NextResponse.json({ ok: false, message: 'Nuki API Tokenが無効です' })
          return NextResponse.json({ ok: false, message: `Nuki 接続エラー (HTTP ${res.status})` })
        } catch { return NextResponse.json({ ok: false, message: 'Nuki APIへの接続に失敗しました' }) }
      }

      return NextResponse.json({ ok: false, message: '未対応の錠デバイスです' })
    }

    return NextResponse.json({ ok: false, message: 'type が不正です' }, { status: 400 })

  } catch (err) {
    console.error('[nextra-ai/connect]', err)
    return NextResponse.json({ ok: false, message: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
