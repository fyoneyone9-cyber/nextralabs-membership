import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from 'next/cache'

export async function GET() {
  noStore()
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  // システム全体の健康診断情報を私(AI)に伝えるためのエンドポイント
  const diagnostics = {
    timestamp: new Date().toISOString(),
    config: {
      has_gemini_key: !!process.env.GEMINI_API_KEY,
      has_gemini_key1: !!process.env.GEMINI_API_KEY1,
      has_supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      node_version: process.version,
      vercel_region: process.env.VERCEL_REGION || "local",
    },
    system_status: "Operational"
  };
  return NextResponse.json(diagnostics);
}
