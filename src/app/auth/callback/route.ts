import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = createServerSupabaseClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
    // エラー内容をURLに含めてデバッグ
    const errorMsg = encodeURIComponent(error.message)
    return NextResponse.redirect(`${origin}/login?error=auth&msg=${errorMsg}`)
  }

  return NextResponse.redirect(`${origin}/login?error=auth&msg=no_code`)
}
