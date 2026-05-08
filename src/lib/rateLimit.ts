import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_EMAIL = "f.yoneyone9@gmail.com";

// ツール別1日制限
const TOOL_DAILY_LIMITS: Record<string, Record<string, number>> = {
  "staysee-ai-finder": { free: 0, light: 0, standard: 0, premium: 10 },
  "comp-price-monitor": { free: 0, light: 0, standard: 3, premium: 20 },
  "hotel-affiliate":    { free: 0, light: 0, standard: 5, premium: 20 },
  "gmail-reply":        { free: 0, light: 0, standard: 0, premium: 10 },
  "default":            { free: 3, light: 5, standard: 10, premium: 50 },
};

export async function checkRateLimit(
  req: NextRequest,
  toolId: string
): Promise<{ allowed: boolean; response?: NextResponse }> {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // ── ユーザー取得：BearerトークンとCookieセッションの両方に対応 ──
    let user: any = null

    // 1. Authorizationヘッダーから試みる
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "").trim();
    if (token) {
      const { data } = await supabaseAdmin.auth.getUser(token);
      user = data?.user ?? null;
    }

    // 2. ヘッダーになければCookieセッションから取得
    if (!user) {
      try {
        const cookieStore = cookies();
        const supabaseCookie = createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            cookies: {
              get(name: string) { return cookieStore.get(name)?.value },
              set() {},
              remove() {},
            },
          }
        );
        const { data } = await supabaseCookie.auth.getUser();
        user = data?.user ?? null;
      } catch {}
    }

    if (!user) {
      return {
        allowed: false,
        response: NextResponse.json(
          { error: "認証が必要です。ログインしてください。" },
          { status: 401 }
        ),
      };
    }

    // 管理者は無制限
    if (user.email === ADMIN_EMAIL) return { allowed: true };

    // プラン取得
    const { data: sub } = await supabaseAdmin
      .from("subscriptions")
      .select("plan")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();
    const plan = sub?.plan ?? "free";

    // 制限値取得
    const limits = TOOL_DAILY_LIMITS[toolId] ?? TOOL_DAILY_LIMITS["default"];
    const dailyLimit = limits[plan] ?? limits["free"] ?? 0;

    if (dailyLimit === 0) {
      return {
        allowed: false,
        response: NextResponse.json(
          { error: "このツールをご利用いただくには上位プランが必要です。" },
          { status: 403 }
        ),
      };
    }

    if (dailyLimit >= 999) return { allowed: true };

    // 使用回数チェック
    const today = new Date().toISOString().slice(0, 10);
    const { data: usage } = await supabaseAdmin
      .from("api_usage")
      .select("count")
      .eq("user_id", user.id)
      .eq("tool_id", toolId)
      .eq("date", today)
      .maybeSingle();

    const currentCount = usage?.count ?? 0;
    if (currentCount >= dailyLimit) {
      return {
        allowed: false,
        response: NextResponse.json(
          { error: `本日の利用制限（${dailyLimit}回）に達しました。明日また利用できます。` },
          { status: 429 }
        ),
      };
    }

    // カウントアップ
    await supabaseAdmin.from("api_usage").upsert(
      { user_id: user.id, tool_id: toolId, date: today, count: currentCount + 1 },
      { onConflict: "user_id,tool_id,date" }
    );

    return { allowed: true };
  } catch (err) {
    console.error("[RATE_LIMIT_ERROR]", err);
    // DBエラー時はサービス継続優先で通す
    return { allowed: true };
  }
}
