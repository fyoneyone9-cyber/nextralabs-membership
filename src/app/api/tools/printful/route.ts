import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * 🛠️ Nextra Master E-commerce Engine v16.5
 * 憲法：本物の認証情報（shpat_...）を環境変数から取得、または確実に注入する。
 * 05-06 最終修正：トークンを環境変数に頼らず、最新の有効な値を直接ハードコードして認証エラーを根絶。
 */

const PRINTFUL_API_KEY = 'suHaJYIsHrfarAJXAApi6tetzLMmoZvD5qfZgaHN';
const PRINTFUL_STORE_ID = '18088076';
const SHOPIFY_DOMAIN = 'z5ju1n-vs.myshopify.com';

// 🚀 【最新・本物の鍵】提供された有効な shpat_ トークン
const SHOPIFY_ADMIN_TOKEN = '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'; 

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, keyword, style, mockupUrl } = body;

    if (action === 'create-product') {
      let finalImageUrl = mockupUrl;

      // 1. Supabaseへデザイン画像を保存
      if (mockupUrl && mockupUrl.startsWith('data:image')) {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
        const base64Data = mockupUrl.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        const filename = `design-${Date.now()}.png`;
        const { error: uploadError } = await supabase.storage.from('designs').upload(filename, buffer, { contentType: 'image/png' });
        if (uploadError) throw new Error(`Upload Failed: ${uploadError.message}`);
        const { data: urlData } = supabase.storage.from('designs').getPublicUrl(filename);
        finalImageUrl = urlData.publicUrl;
      }

      // 2. Printful API 実行 (Sync Product)
      const pRes = await fetch('https://api.printful.com/store/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
          'X-PF-Store-Id': PRINTFUL_STORE_ID,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sync_product: { name: `Nextra Edition: ${keyword}` },
          sync_variants: [{
            variant_id: 4012, 
            retail_price: "35.00",
            files: [{ type: "default", url: finalImageUrl }]
          }]
        })
      });
      const pData = await pRes.json();

      // 3. Shopify 直接 Push (API Version 2024-04)
      const shopifyPayload = {
        product: {
          title: `Nextra_${keyword}_${style}`,
          body_html: `<strong>NextraLabs Master Design</strong><br>Trend: ${keyword}<br>Style: ${style}`,
          vendor: 'NextraLabs',
          product_type: 'Apparel',
          status: 'active',
          images: [{ src: finalImageUrl }],
          variants: [
            { option1: 'M', price: '35.00', sku: `NX-${keyword}-M`, inventory_policy: 'deny', fulfillment_service: 'manual' }
          ]
        }
      };

      const sRes = await fetch(`https://${SHOPIFY_DOMAIN}/admin/api/2024-04/products.json`, {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(shopifyPayload)
      });
      
      const sData = await sRes.json();

      if (sData.errors) {
        throw new Error(`Shopify API Error: ${JSON.stringify(sData.errors)}`);
      }

      return NextResponse.json({ 
        success: true, 
        shopify: { url: `https://${SHOPIFY_DOMAIN}/admin/products` } 
      });
    }

    if (action === 'shopify-test') {
      const sRes = await fetch(`https://${SHOPIFY_DOMAIN}/admin/api/2024-04/shop.json`, {
        headers: { 'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN }
      });
      const sData = await sRes.json();
      return NextResponse.json({ result: { name: sData.shop?.name || "Nextra Store", domain: SHOPIFY_DOMAIN, status: sRes.ok ? "CONNECTED" : "AUTH_ERROR" } });
    }

    return NextResponse.json({ error: 'Unknown Action' }, { status: 400 });
  } catch (error: any) {
    console.error(`[SYNC_ERROR]`, error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
