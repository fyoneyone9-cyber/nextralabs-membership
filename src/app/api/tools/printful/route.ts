import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * 🛠️ Nextra Master E-commerce Engine v15.6
 * Fix: [API] Invalid API key or access token
 * 憲法：本物の認証情報（shpat_...）を環境変数から取得、または確実に注入する。
 */

const PRINTFUL_API_KEY = 'suHaJYIsHrfarAJXAApi6tetzLMmoZvD5qfZgaHN';
const PRINTFUL_STORE_ID = '18088076';
const SHOPIFY_DOMAIN = 'z5ju1n-vs.myshopify.com';

// 🚀 【重要】スクショ等で提供された正しい Admin Access Token に更新
// shpat_ で始まるトークンを正確に記述する必要があります。
const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN || 'shpat_06214389946487532321484b5a7db00'; 

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, keyword, style, mockupUrl } = body;

    if (action === 'create-product') {
      let finalImageUrl = mockupUrl;

      // 1. Supabaseへデザイン画像を保存
      if (mockupUrl.startsWith('data:image')) {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
        const base64Data = mockupUrl.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        const filename = `design-${Date.now()}.png`;
        const { error: uploadError } = await supabase.storage.from('designs').upload(filename, buffer, { contentType: 'image/png' });
        if (uploadError) throw new Error(`Upload Failed: ${uploadError.message}`);
        const { data: urlData } = supabase.storage.from('designs').getPublicUrl(filename);
        finalImageUrl = urlData.publicUrl;
      }

      // 2. Printful API 実行 (製造指示)
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
      
      // 3. Shopify 直接 Push (API Version 2024-04)
      // ヘッダー名を 'X-Shopify-Access-Token' に固定し、トークンを再検証
      const shopifyPayload = {
        product: {
          title: `Nextra_${keyword}_${style}`,
          body_html: `NextraLabs Master Design: ${keyword}`,
          vendor: 'NextraLabs',
          product_type: 'Apparel',
          status: 'active',
          images: [{ src: finalImageUrl }],
          variants: [
            { option1: 'M', price: '35.00', sku: `NX-${keyword}-M` }
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
        throw new Error(`Shopify API: ${JSON.stringify(sData.errors)}`);
      }

      return NextResponse.json({ 
        success: true, 
        shopify: { url: `https://${SHOPIFY_DOMAIN}/admin/products` } 
      });
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    console.error(`[SYNC_ERROR]`, error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
