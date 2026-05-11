import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // 認証が必要なルートの保護
  const protectedRoutes = ['/dashboard', '/profile', '/content']
  const adminRoutes = ['/admin']
  const authRoutes = ['/login', '/signup', '/forgot-password']

  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some(route => request.nextUrl.pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => request.nextUrl.pathname.startsWith(route))

  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAdminRoute) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle()

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // ── DMS 独自Cookie認証ガード ──
  // /dms/login と /dms/admin/login は認証不要（ログインページ自体）
  // /dms/* それ以外は dms_session cookie が必要
  const pathname = request.nextUrl.pathname
  const isDmsRoute      = pathname.startsWith('/dms')
  const isDmsLoginPage  = pathname === '/dms/login'
  const isDmsAdminRoute = pathname.startsWith('/dms/admin')

  // ── KIOSK ガード（/products/nextra-ai/app はDMSセッション必須、LPページは除外） ──
  if (pathname.startsWith('/products/nextra-ai') && pathname !== '/products/nextra-ai') {
    const dmsSession = request.cookies.get('dms_session')?.value
    let isStaff = false
    if (dmsSession) {
      try {
        const s = JSON.parse(dmsSession)
        isStaff = !!(s.role && s.login_id)
      } catch { /* ignore */ }
    }
    // Supabase authで管理者メールもOK
    const { data: { user: supaUser } } = await supabase.auth.getUser()
    const isAdmin = supaUser?.email === 'f.yoneyone9@gmail.com'

    if (!isStaff && !isAdmin) {
      return NextResponse.redirect(new URL('/dms/login?from=kiosk', request.url))
    }
  }

  if (isDmsRoute && !isDmsLoginPage) {
    const dmsSessionCookie = request.cookies.get('dms_session')?.value

    // Cookieが無い場合はログインへリダイレクト
    if (!dmsSessionCookie) {
      return NextResponse.redirect(new URL('/dms/login', request.url))
    }

    // Cookieをパースしてroleチェック
    try {
      const session = JSON.parse(dmsSessionCookie)

      // /dms/admin は super_admin のみ
      if (isDmsAdminRoute && session.role !== 'super_admin') {
        return NextResponse.redirect(new URL('/dms', request.url))
      }

      // role が無効（不正Cookie）
      if (!session.role || !session.login_id) {
        const res = NextResponse.redirect(new URL('/dms/login', request.url))
        res.cookies.delete('dms_session')
        return res
      }
    } catch {
      // JSON parse 失敗 = 不正Cookie → 削除してログインへ
      const res = NextResponse.redirect(new URL('/dms/login', request.url))
      res.cookies.delete('dms_session')
      return res
    }
  }

  return response
}
