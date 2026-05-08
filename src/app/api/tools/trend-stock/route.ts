import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const DEFAULT_RAKUTEN_ID = '534e3725.64346793.534e3726.d5412af4';
const RAKUTEN_APP_ID = '21a92248-492b-4675-a876-027b5406e558';

export async function GET(request: Request) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  let affiliateId = DEFAULT_RAKUTEN_ID;
  if (session) {
    const { data: profile } = await supabase.from('profiles').select('rakuten_affiliate_id').eq('id', session.user.id).single();
    if (profile?.rakuten_affiliate_id) affiliateId = profile.rakuten_affiliate_id;
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  
  // モデル選択（最も互換性の高い名前に固定）
  const getAIContent = async (prompt: string) => {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (e) {
      console.error('Gemini error:', e);
      throw e; // 上位のcatchでSAFE_MODEへ
    }
  };

  try {
    // 1. 楽天API試行
    const url = `https://app.rakuten.co.jp/services/api/IchibaItem/Ranking/20170628?applicationId=${RAKUTEN_APP_ID}&affiliateId=${affiliateId}&period=realtime`;
    const rakutenRes = await fetch(url);
    const rakutenData = await rakutenRes.json();

    // 2. 楽天失敗時はAI自律モード
    if (rakutenData.error || !rakutenData.Items || rakutenData.Items.length === 0) {
      const aiPrompt = `
        現在（2026年5月）の日本の楽天市場の超人気トレンド商品を5つ厳選し、以下のJSON形式のみで出力してください。
        [{"name": "商品名", "catchcopy": "売れてる理由", "imageUrl": "https://m.media-amazon.com/images/I/41-iR2uO+kL._AC_UL320_.jpg", "url": "https://hb.afl.rakuten.co.jp/hgc/${affiliateId}/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F商品名%2F"}]
      `;
      const aiText = await getAIContent(aiPrompt);
      const cleanJson = aiText.replace(/```json|```/g, '').trim();
      const aiItems = JSON.parse(cleanJson);

      return NextResponse.json({
        items: aiItems,
        insight: "【AI自律スキャン中】5月のトレンド（GW・母の日・防災）から、今SNSで最も注目されている商品をAIが抽出しました。",
        isDefaultId: affiliateId === DEFAULT_RAKUTEN_ID,
        mode: 'AI_AUTONOMOUS'
      });
    }

    // 3. 正常系
    const topItems = rakutenData.Items.slice(0, 5).map((item: any) => ({
      name: item.Item.itemName,
      catchcopy: item.Item.catchcopy,
      url: item.Item.affiliateUrl || item.Item.itemUrl,
      imageUrl: item.Item.mediumImageUrls[0]?.imageUrl,
    }));

    const insightPrompt = `楽天上位商品のトレンド分析とSNS訴求文を日本語で簡潔に作成して:\n${topItems.map((i: any) => i.name).join('\n')}`;
    const insightText = await getAIContent(insightPrompt);
    
    return NextResponse.json({
      items: topItems,
      insight: insightText,
      isDefaultId: affiliateId === DEFAULT_RAKUTEN_ID,
      mode: 'API_CONNECTED'
    });

  } catch (error: any) {
    console.error('Final Fallback Error:', error);
    // 最終防衛線: 完全に固定の静的データを返す（画面を落とさない）
    return NextResponse.json({
      items: [
        { name: "EcoFlow ポータブル電源 Delta 2", catchcopy: "防災・キャンプ需要で急上昇中", imageUrl: "https://m.media-amazon.com/images/I/41-iR2uO+kL._AC_UL320_.jpg", url: `https://hb.afl.rakuten.co.jp/hgc/${affiliateId}/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2Fポータブル電源%2F` }
      ],
      insight: "システムが一時的に制限されていますが、最重要トレンドを表示しています。",
      mode: 'SAFE_MODE'
    });
  }
}
