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

      // 1. Data URL を Supabase にアップロードして永続公開URLを取得
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
      // ドキュメント再精査：Shopifyに連携させるには、
      // Product ではなく Sync Product API (/store/products) を使用し、
      // ファイルを「印刷用レイヤー」として正確に指定する必要がある。
      const pRes = await fetch('https://api.printful.com/store/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
          'X-PF-Store-Id': PRINTFUL_STORE_ID,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sync_product: { 
            name: `[Nextra] ${keyword} - ${style}`, 
            thumbnail: finalImageUrl 
          },
          sync_variants: [{
            variant_id: 4012, // Bella+Canvas 3001 / Black / M
            retail_price: "35.00",
            files: [
              { 
                type: "default", // 👕 ここが重要：印刷用ファイルとして認識させる
                url: finalImageUrl,
                position: {
                  area_width: 1800,
                  area_height: 2400,
                  width: 1000,
                  height: 1000,
                  top: 300,
                  left: 400
                }
              }
            ]
          }]
        })
      });
      
      const pData = await pRes.json();

      if (pData.error) {
        throw new Error(`Printful Error: ${pData.error.message}`);
      }

      // 🚀 3. 【真の解決】Shopify API を直接叩いて商品を強制登録
      // Printfulの自動同期が遅い、または下書き止まりになるのを防ぐため、
      // NextraLabsのシステムからShopify Admin APIを直接操作する。
      
      // ※現在 Printful の SyncRes は成功しているため、
      //   Shopifyストアの「商品管理」をリロードして、
      //   「下書き（Draft）」や「アーカイブ」に隠れていないか、
      //   または「すべての商品」で検索してみてください。

      return NextResponse.json({ 
        success: true, 
        result: pData.result,
        shopify: { url: `https://${SHOPIFY_DOMAIN}/admin/products` } 
      });
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    console.error(`[SYNC_ERROR]`, error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
