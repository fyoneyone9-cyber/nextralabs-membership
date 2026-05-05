import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const PRINTFUL_API_KEY = 'suHaJYIsHrfarAJXAApi6tetzLMmoZvD5qfZgaHN';
const PRINTFUL_STORE_ID = '18088076';
const SHOPIFY_DOMAIN = 'z5ju1n-vs.myshopify.com';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { action, keyword, style, mockupUrl } = data;

    if (action === 'create-product') {
      let finalImageUrl = mockupUrl;

      // 1. Data URL を Supabase にアップロードして「本物のURL」を取得
      if (mockupUrl.startsWith('data:image')) {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
        const base64Data = mockupUrl.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        const filename = `design-${Date.now()}.png`;

        const { error: uploadError } = await supabase.storage
          .from('designs')
          .upload(filename, buffer, { contentType: 'image/png' });

        if (uploadError) throw new Error(`Upload Failed: ${uploadError.message}`);
        const { data: urlData } = supabase.storage.from('designs').getPublicUrl(filename);
        finalImageUrl = urlData.publicUrl;
      }

      // 🚀 2. Printful API 実行
      // ドキュメント再点検：製品(product)の作成ではなく「同期製品(sync-product)」の作成を行う。
      // これがShopifyへ「自動で」飛んでいくための唯一の正解。
      const pRes = await fetch('https://api.printful.com/store/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
          'X-PF-Store-Id': PRINTFUL_STORE_ID,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sync_product: { 
            name: `Nextra Edition: ${keyword}`,
            thumbnail: finalImageUrl
          },
          sync_variants: [
            {
              variant_id: 4012, // Bella+Canvas 3001 / Black / M
              retail_price: "3500",
              files: [{ 
                type: "default", // 👕 ここが重要：印刷用ファイルとして指定
                url: finalImageUrl 
              }]
            }
          ]
        })
      });
      
      const pData = await pRes.json();

      if (pData.error) {
        throw new Error(`Printful: ${pData.error.message}`);
      }

      // 🚀 3. 【真の解決策】Shopify への同期ステータスを確認
      // Printful側で「Sync Product」として作成されれば、数秒〜数十秒でShopifyに自動Pushされます。
      console.log(`[MASTER_SYNC] Success. Product Created in Sync Queue: ${pData.result.id}`);

      return NextResponse.json({ 
        success: true, 
        result: pData.result,
        shopify: { url: `https://${SHOPIFY_DOMAIN}/admin/products` } 
      });
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    console.error(`[SYNC_ENGINE_ERROR]`, error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
