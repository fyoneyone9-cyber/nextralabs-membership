/**
 * NextraLabs 共通APIフェッチユーティリティ
 * 【憲法8条準拠】
 * - 401 (unauthenticated) → /auth/login にリダイレクト
 * - 429 (limit_exceeded) → エラーメッセージを返す
 */

type ApiFetchOptions = {
  url: string;
  body?: Record<string, unknown>;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  onUnauth?: () => void; // 未認証時のカスタムハンドラ（省略時は/auth/loginへリダイレクト）
};

export async function apiFetch<T = unknown>({
  url,
  body,
  method = 'POST',
  onUnauth,
}: ApiFetchOptions): Promise<{ data: T | null; error: string | null; status: number }> {
  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });

    // 【憲法8条】未認証 → ログインページへ
    if (res.status === 401) {
      const data = await res.json().catch(() => ({}));
      if (data.reason === 'unauthenticated') {
        if (onUnauth) {
          onUnauth();
        } else if (typeof window !== 'undefined') {
          // 現在のURLをredirectパラメータとして引き渡す
          const current = encodeURIComponent(window.location.pathname);
          window.location.href = `/auth/login?redirect=${current}`;
        }
        return {
          data: null,
          error: 'このツールの利用には会員登録が必要です。',
          status: 401,
        };
      }
    }

    // 利用制限超過
    if (res.status === 429) {
      return {
        data: null,
        error: '本日の利用制限に達しました。明日またご利用ください。',
        status: 429,
      };
    }

    if (!res.ok) {
      const errData = await res.json().catch(() => ({ error: '不明なエラーが発生しました。' }));
      return { data: null, error: errData.error || `エラー: ${res.status}`, status: res.status };
    }

    const data = await res.json();
    return { data, error: null, status: res.status };
  } catch (e) {
    return { data: null, error: 'ネットワークエラーが発生しました。', status: 0 };
  }
}
