import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const { tasks, examName } = await req.json()

    // ここに Google Calendar API への書き込みロジックを実装します
    // ※ ユーザーのGoogleアクセストークンが session.provider_token に含まれている必要があります

    console.log(`Syncing ${tasks.length} tasks for ${examName} to calendar for user ${session.user.email}`)

    return NextResponse.json({ success: true, message: 'カレンダーとの同期リクエストを受け付けました' })
  } catch (error) {
    console.error('Calendar sync error:', error)
    return NextResponse.json({ error: '同期に失敗しました' }, { status: 500 })
  }
}
