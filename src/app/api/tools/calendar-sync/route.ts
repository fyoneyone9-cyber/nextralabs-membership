import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const { tasks, examName } = await req.json()

    console.log(`Syncing ${tasks.length} tasks for ${examName} to calendar for user ${user.email}`)

    return NextResponse.json({ success: true, message: 'カレンダーとの同期リクエストを受け付けました' })
  } catch (error) {
    console.error('Calendar sync error:', error)
    return NextResponse.json({ error: '同期に失敗しました' }, { status: 500 })
  }
}
