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

      // 🚀 2. Printful API 実行 (Shopifyへの自動同期を確実にするための全パラメータ)
      // https://developers.printful.com/docs/#operation/createSyncProduct
      const pRes = await fetch('https://api.printful.com/store/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
          'X-PF-Store-Id': PRINTFUL_STORE_ID,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sync_product: { 
            name: `Nextra_${keyword}_${style}`, 
            thumbnail: finalImageUrl 
          },
          sync_variants: [{
            variant_id: 4012, // Bella+Canvas 3001 / Black / M
            retail_price: "35.00",
            files: [
              { 
                type: "default",
                url: finalImageUrl 
              }
            ]
          }]
        })
      });
      
      const pData = await pRes.json();

      if (pData.error) {
        // Printful側で詳細なエラーを吐いている可能性をフロントに返す
        throw new Error(`Printful: ${pData.error.message} (${pData.error.code})`);
      }

      // 🚀 重要: Shopifyへの連携は、Printful側のステータスが「Synced」になる必要があります
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
