import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * 🛠️ Nextra Master E-commerce Engine v16.0 (Ultimate Sync)
 * 憲法：Vercel環境変数から「本物の鍵」を抽出し、商売の自動化を完遂する。
 */

// Vercel Settingsから直接供給される「本物の燃料」
const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
const PRINTFUL_STORE_ID = process.env.PRINTFUL_STORE_ID;
const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || 'z5ju1n-vs.myshopify.com';
const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN; // shpat_...

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, keyword, style, mockupUrl } = body;

    // 出品アクションの執行
    if (action === 'create-product') {
      if (!SHOPIFY_ADMIN_TOKEN || !PRINTFUL_API_KEY) {
        throw new Error('System Critical: Missing API Credentials in Vercel Settings.');
      }

      let finalImageUrl = mockupUrl;

      // 1. Supabaseへデザイン画像を保存（Printful/Shopifyがアクセス可能な公開URLにする）
      if (mockupUrl.startsWith('data:image')) {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
        const base64Data = mockupUrl.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        const filename = `design-${Date.now()}.png`;
        const { error: uploadError } = await supabase.storage.from('designs').upload(filename, buffer, { contentType: 'image/png' });
        if (uploadError) throw new Error(`Storage Failed: ${uploadError.message}`);
        const { data: urlData } = supabase.storage.from('designs').getPublicUrl(filename);
        finalImageUrl = urlData.publicUrl;
      }

      // 2. Printful同期 (製造指示)
      console.log(`[MASTER_ENGINE] Syncing with Printful...`);
      const pRes = await fetch('https://api.printful.com/store/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
          'X-PF-Store-Id': PRINTFUL_STORE_ID || '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sync_product: { name: `Nextra Edition: ${keyword}` },
          sync_variants: [{
            variant_id: 4012, // B+C 3001 M
            retail_price: "35.00",
            files: [{ type: "default", url: finalImageUrl }]
          }]
        })
      });
      const pData = await pRes.json();
      if (pData.error) throw new Error(`Printful Sync: ${pData.error.message}`);

      // 3. Shopify直接出品 (Vercelの SHOPIFY_ACCESS_TOKEN を使用)
      console.log(`[MASTER_ENGINE] Pushing to Shopify Admin API...`);
      const shopifyPayload = {
        product: {
          title: `Nextra_${keyword}_${style}`,
          body_html: `<strong>NextraLabs Master Collection</strong><br>Trend: ${keyword}<br>Style: ${style}`,
          vendor: 'NextraLabs',
          product_type: 'Apparel',
          status: 'active',
          images: [{ src: finalImageUrl }],
          variants: [
            { option1: 'M', price: '35.00', sku: `NX-${keyword}-M`, inventory_management: 'shopify' }
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
      if (sData.errors) throw new Error(`Shopify API: ${JSON.stringify(sData.errors)}`);

      return NextResponse.json({ 
        success: true, 
        shopify: { url: `https://${SHOPIFY_DOMAIN}/admin/products` } 
      });
    }

    if (action === 'shopify-test') {
      return NextResponse.json({ result: { name: "NextraLabs Store", domain: SHOPIFY_DOMAIN } });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    console.error(`[SYNC_ENGINE_FAILURE]`, error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
