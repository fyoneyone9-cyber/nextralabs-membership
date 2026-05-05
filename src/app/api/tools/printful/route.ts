import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const PRINTFUL_API_KEY = 'suHaJYIsHrfarAJXAApi6tetzLMmoZvD5qfZgaHN';
const PRINTFUL_STORE_ID = '18088076';
const SHOPIFY_DOMAIN = 'z5ju1n-vs.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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'; // 以前成功していたマスターアクセストークン

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, keyword, style, mockupUrl } = body;

    if (action === 'create-product') {
      let finalImageUrl = mockupUrl;

      // 1. Supabaseアップロード (永続URL生成)
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

      // 2. Printful API 実行 (Sync Product)
      const pRes = await fetch('https://api.printful.com/store/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
          'X-PF-Store-Id': PRINTFUL_STORE_ID,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sync_product: { name: `Nextra: ${keyword}` },
          sync_variants: [{
            variant_id: 4012, // Bella+Canvas 3001 M
            retail_price: "35.00",
            files: [{ type: "default", url: finalImageUrl }]
          }]
        })
      });
      const pData = await pRes.json();
      if (pData.error) throw new Error(`Printful: ${pData.error.message}`);

      // 🚀 3. 数日前に大正解だった「Shopify APIを直接叩く」ロジックの完全復活
      // Printfulの自動同期を待たず、こちらからShopify Admin APIへ製品を直接ねじ込みます
      const shopifyBody = {
        product: {
          title: `Nextra Edition: ${keyword}`,
          body_html: `<p>AI-generated ${style} design on Bella+Canvas 3001.</p>`,
          vendor: 'NextraLabs',
          product_type: 'T-Shirt',
          status: 'active',
          images: [{ src: finalImageUrl }],
          variants: [
            { option1: 'S', price: '35.00', inventory_management: 'shopify', sku: `NX-${keyword}-S` },
            { option1: 'M', price: '35.00', inventory_management: 'shopify', sku: `NX-${keyword}-M` },
            { option1: 'L', price: '35.00', inventory_management: 'shopify', sku: `NX-${keyword}-L` }
          ]
        }
      };

      const sRes = await fetch(`https://${SHOPIFY_DOMAIN}/admin/api/2024-01/products.json`, {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(shopifyBody)
      });
      
      const sData = await sRes.json();
      if (!sData.product) {
        console.warn('[SHOPIFY_DIRECT_PUSH_FAILED]', sData);
      }

      return NextResponse.json({ 
        success: true, 
        shopify: { url: `https://${SHOPIFY_DOMAIN}/admin/products` } 
      });
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
