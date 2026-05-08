import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ガードをかける対象のパス
const PROTECTED_PATHS = [
  '/products',
  '/dms',
  '/dashboard',
  '/admin',
  '/profile'
];

// ログインしていなくても見れる例外パス（ホワイトリスト）
const PUBLIC_PATHS = [
  '/login',
  '/signup',
  '/dms/login',
  '/pricing',
  '/terms',
  '/privacy',
  '/tool-guide',
  '/contact',
  '/_next',
  '/favicon.ico',
  '/api' // APIは内部で別途ガード
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. 公開パスならスルー
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 2. 保護対象パスへのアクセスチェック
  if (PROTECTED_PATHS.some(path => pathname.startsWith(path))) {
    // クッキーベースの認証チェック（SSR/Middleware用）
    // localStorageはサーバーから見えないため、ログイン時にCookieにもセッションを保存する運用へ変更
    const token = request.cookies.get('nextra_auth_session');

    // 本来はここにデコード/検証ロジックを入れる
    if (!token) {
      // ログインしていない場合、トップまたはログインへ強制送還
      const loginUrl = pathname.startsWith('/dms') ? '/dms/login' : '/login';
      return NextResponse.redirect(new URL(loginUrl, request.url));
    }
  }

  return NextResponse.next();
}

// ミドルウェアを適用する範囲
export const config = {
  matcher: [
    /*
     * match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
