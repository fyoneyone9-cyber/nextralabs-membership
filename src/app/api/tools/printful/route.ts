import { checkApiLimit } from '@/lib/api-limit';
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * 🛠️ Nextra Master E-commerce Engine v17.0 (TRUE RESTORATION)
 * 数日前に成功していた「本物のロジック」を完全復元。
 * shopifyClientId + shopifyClientSecret を使った OAuth 認証で
 * Shopify Admin APIに接続し、商品を直接出品する。
 */

const PRINTFUL_API_KEY = 'suHaJYIsHrfarAJXAApi6tetzLMmoZvD5qfZgaHN';
const PRINTFUL_STORE_ID = '18088076';
const SHOPIFY_DOMAIN = 'z5ju1n-vs.myshopify.com';
const SHOPIFY_CLIENT_ID = '67b4f4e95c3a421925f45fffc42b7327';
const SHOPIFY_CLIENT_SECRET = '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';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function getShopifyToken(): Promise<string | null> {
  try {
    const res = await fetch(`https://${SHOPIFY_DOMAIN}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: SHOPIFY_CLIENT_ID,
        client_secret: SHOPIFY_CLIENT_SECRET,
        grant_type: 'client_credentials',
      }),
    });
    const data = await res.json();
    return data.access_token || null;
  } catch (e) {
    return null;
  }
}

export async function POST(request: NextRequest) {
  // 🛡️ レート制限（1日10回）
  const limitCheck = await checkApiLimit('printful', 10);
  if (!limitCheck.allowed) {
    return NextResponse.json(
      { error: '本日の利用上限に達しました。明日またご利用ください。' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { action, keyword, style, mockupUrl, tshirtColor, sizes } = body;

    if (action === 'create-product') {
      let finalImageUrl = mockupUrl;

      // 1. Supabase Storage に画像保存
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

      // 2. Printful API で製造同期
      const pRes = await fetch('https://api.printful.com/store/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
          'X-PF-Store-Id': PRINTFUL_STORE_ID,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sync_product: { name: `Nextra Edition: ${keyword}`, thumbnail: finalImageUrl },
          sync_variants: [{
            variant_id: 4012, 
            retail_price: "35.00",
            files: [{ type: "default", url: finalImageUrl }]
          }]
        })
      });
      const pData = await pRes.json();

      // 3. Shopify 出品 (数日前の成功ロジック: OAuth access_token 方式)
      const shopifyToken = await getShopifyToken();
      
      let shopifyProduct = null;
      if (shopifyToken) {
        const sRes = await fetch(`https://${SHOPIFY_DOMAIN}/admin/api/2024-01/products.json`, {
          method: 'POST',
          headers: {
            'X-Shopify-Access-Token': shopifyToken,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            product: {
              title: `${keyword} - ${style} Tシャツ`,
              body_html: `<p>AIが生成した「${keyword}」デザイン。Bella+Canvas 3001使用。</p>`,
              vendor: 'NextraLabs',
              product_type: 'T-Shirts',
              status: 'active',
              images: finalImageUrl ? [{ src: finalImageUrl }] : [],
              variants: (sizes || ['S','M','L','XL']).map((s: string) => ({
                option1: s,
                price: '3500',
                requires_shipping: true,
              }))
            }
          })
        });
        const sData = await sRes.json();
        if (sData.product) {
          shopifyProduct = {
            id: sData.product.id,
            title: sData.product.title,
            url: `https://${SHOPIFY_DOMAIN}/products/${sData.product.handle}`
          };
        }
      }

      return NextResponse.json({ 
        success: true, 
        result: pData.result,
        shopify: shopifyProduct || { url: `https://${SHOPIFY_DOMAIN}/admin/products` }
      });
    }

    if (action === 'shopify-test') {
      const token = await getShopifyToken();
      if (!token) return NextResponse.json({ result: { name: 'Auth Failed', domain: SHOPIFY_DOMAIN, status: 'ERROR' }});
      const sRes = await fetch(`https://${SHOPIFY_DOMAIN}/admin/api/2024-01/shop.json`, {
        headers: { 'X-Shopify-Access-Token': token }
      });
      const sData = await sRes.json();
      return NextResponse.json({ result: { name: sData.shop?.name || "Nextra Store", domain: SHOPIFY_DOMAIN, status: sRes.ok ? 'CONNECTED' : 'FAILED' } });
    }

    return NextResponse.json({ error: 'Unknown Action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
