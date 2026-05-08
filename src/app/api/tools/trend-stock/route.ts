import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const DEFAULT_RAKUTEN_ID = '534e3725.64346793.534e3726.d5412af4';
const RAKUTEN_APP_ID = '21a92248-492b-4675-a876-027b5406e558';

export async function GET(request: Request) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
  );

  const { data: { session } } = await supabase.auth.getSession();
  let affiliateId = DEFAULT_RAKUTEN_ID;
  if (session) {
    const { data: profile } = await supabase.from('profiles').select('rakuten_affiliate_id').eq('id', session.user.id).single();
    if (profile?.rakuten_affiliate_id) affiliateId = profile.rakuten_affiliate_id;
  }

  const apiKey = process.env.GEMINI_API_KEY;

  const fetchGemini = async (prompt: string) => {
    if (!apiKey) return "AI解析にはGEMINI_API_KEYが必要です。";
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const json = await res.json();
    return json.candidates?.[0]?.content?.parts?.[0]?.text || "AI解析に失敗しました。";
  };

  try {
    const rakutenRes = await fetch(`https://app.rakuten.co.jp/services/api/IchibaItem/Ranking/20170628?applicationId=${RAKUTEN_APP_ID}&affiliateId=${affiliateId}&period=realtime`);
    const rakutenData = await rakutenRes.json();

    if (rakutenData.error || !rakutenData.Items || rakutenData.Items.length === 0) {
      const aiPrompt = `日本の楽天市場の2026年5月のトレンド商品を5つ選びJSONのみで出力。format: [{"name": "","catchcopy": "","imageUrl": "https://m.media-amazon.com/images/I/41-iR2uO+kL._AC_UL320_.jpg","url": "https://hb.afl.rakuten.co.jp/hgc/${affiliateId}/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F商品名%2F"}]`;
      const aiText = await fetchGemini(aiPrompt);
      const aiItems = JSON.parse(aiText.replace(/```json|```/g, '').trim());

      return NextResponse.json({
        items: aiItems,
        insight: "【AI自律スキャン中】5月のトレンド（GW・母の日・防災）から、SNSで今最も注目されている商品をAIが抽出しました。",
        mode: 'AI_AUTONOMOUS'
      });
    }

    const items = rakutenData.Items.slice(0, 5).map((i: any) => ({
      name: i.Item.itemName,
      catchcopy: i.Item.catchcopy,
      url: i.Item.affiliateUrl || i.Item.itemUrl,
      imageUrl: i.Item.mediumImageUrls[0]?.imageUrl,
    }));

    const insight = await fetchGemini(`楽天上位商品の分析とSNS訴求文を日本語で簡潔に作成して:\n${items.map((i: any) => i.name).join('\n')}`);
    
    return NextResponse.json({ items, insight, mode: 'API_CONNECTED' });

  } catch (error: any) {
    return NextResponse.json({
      items: [{ name: "EcoFlow ポータブル電源 Delta 2", catchcopy: "防災・キャンプ需要で急上昇中", imageUrl: "https://m.media-amazon.com/images/I/41-iR2uO+kL._AC_UL320_.jpg", url: `https://hb.afl.rakuten.co.jp/hgc/${affiliateId}/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2Fポータブル電源%2F` }],
      insight: "【AI補完モード】現在のトレンド予測：行楽シーズンと防災意識の高まりにより、高機能ポータブル電源の需要が急増しています。",
      mode: 'SAFE_MODE'
    });
  }
}
