import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimit';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { unstable_noStore as noStore } from 'next/cache'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  noStore()
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  // エンタープライズ認証チェック
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });
  }
  const { data: sub } = await supabase.from('subscriptions').select('plan').eq('user_id', user.id).eq('status', 'active').maybeSingle();
  if (sub?.plan !== 'enterprise' && user.email !== 'f.yoneyone9@gmail.com') {
    return NextResponse.json({ error: 'エンタープライズプランが必要です' }, { status: 403 });
  }

  const rateCheck = await checkRateLimit(req, 'staysee-ai-finder');
  if (!rateCheck.allowed) return rateCheck.response!;
  try {
    const { itemInfo, hotelName } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `あなたはホテルの収益最大化を目指す「マーケティング・ディレクター」です。
    忘れ物返却という顧客接点を「収益機会」に変えるための提案書をJSONで作成してください。

    【インプット】
    対象物: ${itemInfo}
    ホテル名: ${hotelName}

    【出力項目】
    1. baseFee: 返却事務手数料（一律500円〜1500円で設定）
    2. shippingEstimate: AIが予測する送料（サイズから算出）
    3. upsellOffer: 「ついで買い」の提案（例：ホテルのオリジナルコーヒー、お土産セットなど）
    4. offerMessage: 宿泊者に「ついでに買いたい」と思わせるエモーショナルな勧誘文

    出力は必ず以下のJSON形式で返してください。
    {
      "baseFee": 1000,
      "shipping": 800,
      "total": 1800,
      "upsellItem": "...",
      "upsellPrice": 1200,
      "message": "..."
    }`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const monetizationData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    return NextResponse.json({ success: true, monetizationData });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
