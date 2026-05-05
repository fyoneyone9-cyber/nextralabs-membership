import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * 🛠️ Nextra Master E-commerce Engine v15.5
 * Shopify Admin API スコープ: read_products, write_products に完全対応
 * Shopify API Version: 2024-04 (スクショに基づき最新化)
 */

const PRINTFUL_API_KEY = 'suHaJYIsHrfarAJXAApi6tetzLMmoZvD5qfZgaHN';
const PRINTFUL_STORE_ID = '18088076';
const SHOPIFY_DOMAIN = 'z5ju1n-vs.myshopify.com';

// 🔑 スクショ「nextralabs-api-2」のマスターアクセストークン
const SHOPIFY_ADMIN_TOKEN = 'shpat_06214389946487532321484b5a7db00'; 

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, keyword, style, mockupUrl } = body;

    if (action === 'create-product') {
      let finalImageUrl = mockupUrl;

      // 1. Supabaseへデザイン画像を保存（Printful/Shopifyがアクセス可能な公開URLにする）
      if (mockupUrl.startsWith('data:image')) {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
        const base64Data = mockupUrl.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        const filename = `design-${Date.now()}.png`;
        const { error: uploadError } = await supabase.storage.from('designs').upload(filename, buffer, { contentType: 'image/png' });
        if (uploadError) throw new Error(`Image Upload Failed: ${uploadError.message}`);
        const { data: urlData } = supabase.storage.from('designs').getPublicUrl(filename);
        finalImageUrl = urlData.publicUrl;
      }

      // 2. Printful同期 (製造ラインの確保)
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
            variant_id: 4012, // Bella+Canvas 3001 M
            retail_price: "35.00",
            files: [{ type: "default", url: finalImageUrl }]
          }]
        })
      });
      const pData = await pRes.json();

      // 3. Shopify直接出品 (スクショの権限スコープ read_products, write_products を使用)
      // API Version 2024-04 を明示的に指定
      const shopifyPayload = {
        product: {
          title: `Nextra_${keyword}_${style}`,
          body_html: `<strong>NextraLabs Master Design</strong><br>Trend: ${keyword}<br>Style: ${style}<br>Base: Bella+Canvas 3001 Premium`,
          vendor: 'NextraLabs',
          product_type: 'Apparel',
          status: 'active',
          images: [{ src: finalImageUrl }],
          variants: [
            { option1: 'S', price: '35.00', sku: `NX-${keyword}-S`, inventory_policy: 'deny', fulfillment_service: 'manual' },
            { option1: 'M', price: '35.00', sku: `NX-${keyword}-M`, inventory_policy: 'deny', fulfillment_service: 'manual' },
            { option1: 'L', price: '35.00', sku: `NX-${keyword}-L`, inventory_policy: 'deny', fulfillment_service: 'manual' }
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
        console.error('[SHOPIFY_API_ERROR]', sData.errors);
        throw new Error(`Shopify API: ${JSON.stringify(sData.errors)}`);
      }

      return NextResponse.json({ 
        success: true, 
        result: pData.result,
        shopify: { url: `https://${SHOPIFY_DOMAIN}/admin/products` } 
      });
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    console.error(`[CRITICAL_SYNC_ERROR]`, error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
