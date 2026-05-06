import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * 🛠️ Nextra Master E-commerce Engine v16.8 (Final Emergency Fix)
 * 【不整合の最終解決】
 * 1. API Version: 以前の成功確実な 2024-01 へ強制ロールバック
 * 2. Auth Header: X-Shopify-Access-Token を徹底検証
 * 3. Domain: .myshopify.com 形式に完全固定
 */

const PRINTFUL_API_KEY = 'suHaJYIsHrfarAJXAApi6tetzLMmoZvD5qfZgaHN';
const PRINTFUL_STORE_ID = '18088076';
const SHOPIFY_DOMAIN = 'z5ju1n-vs.myshopify.com';

// 🚀 提供された本物の最新トークン（余計な文字・空白を完全排除）
const SHOPIFY_ADMIN_TOKEN = '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'.trim(); 

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
        if (uploadError) throw new Error(`Storage Failed: ${uploadError.message}`);
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

      // 3. Shopify 直接 Push (以前の成功バージョン 2024-01 へ戻す)
      const shopifyPayload = {
        product: {
          title: `Nextra_${keyword}_${style}`,
          body_html: `<strong>NextraLabs Master Design</strong><br>Trend: ${keyword}`,
          vendor: 'NextraLabs',
          product_type: 'Apparel',
          status: 'active',
          images: [{ src: finalImageUrl }],
          variants: [
            { option1: 'M', price: '35.00', sku: `NX-${keyword}-${Date.now()}` }
          ]
        }
      };

      const sRes = await fetch(`https://${SHOPIFY_DOMAIN}/admin/api/2024-01/products.json`, {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(shopifyPayload)
      });
      
      const sData = await sRes.json();

      if (sData.errors) {
        throw new Error(`Shopify Auth Failed (2024-01): ${JSON.stringify(sData.errors)}`);
      }

      return NextResponse.json({ 
        success: true, 
        shopify: { url: `https://${SHOPIFY_DOMAIN}/admin/products` } 
      });
    }

    if (action === 'shopify-test') {
      const sRes = await fetch(`https://${SHOPIFY_DOMAIN}/admin/api/2024-01/shop.json`, {
        headers: { 'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN }
      });
      const sData = await sRes.json();
      return NextResponse.json({ result: { name: sData.shop?.name || "Nextra Store", status: sRes.ok ? "CONNECTED" : "FAILED" } });
    }

    return NextResponse.json({ error: 'Unknown Action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
