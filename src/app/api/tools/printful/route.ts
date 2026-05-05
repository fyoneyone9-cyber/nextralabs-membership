import { NextRequest, NextResponse } from 'next/server'

/**
 * 🛠️ Master E-commerce Engine v14.0 (Final Architecture)
 * Printful API 経由で製品を生成し、連携済みの Shopify ストアへ自動同期させる。
 */

const PRINTFUL_API_KEY = 'suHaJYIsHrfarAJXAApi6tetzLMmoZvD5qfZgaHN';
const PRINTFUL_STORE_ID = '18088076';

async function printfulRequest(endpoint: string, method = 'GET', body?: any) {
  const res = await fetch(`https://api.printful.com${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
      'X-PF-Store-Id': PRINTFUL_STORE_ID,
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  return res.json();
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { action, keyword, style, mockupUrl } = data;

    if (action === 'create-product') {
      console.log(`[SYSTEM_ACTIVATE] Publishing to Store: ${keyword}`);

      // 🚀 1. Printful 側に「Sync Product（同期商品）」を作成
      // これを行うと、PrintfulとShopifyが連携済みであれば、自動的にShopifyへ商品がPushされる
      const syncRes = await printfulRequest('/store/products', 'POST', {
        sync_product: {
          name: `Nextra Edition: ${keyword}`,
          thumbnail: mockupUrl
        },
        sync_variants: [
          {
            variant_id: 4012, // Bella+Canvas 3001 / Black / M
            retail_price: "3500",
            files: [{ type: "default", url: mockupUrl }]
          },
          {
            variant_id: 4011, // Bella+Canvas 3001 / Black / S
            retail_price: "3500",
            files: [{ type: "default", url: mockupUrl }]
          },
          {
            variant_id: 4013, // Bella+Canvas 3001 / Black / L
            retail_price: "3500",
            files: [{ type: "default", url: mockupUrl }]
          }
        ]
      });

      if (syncRes.error) {
        console.error('[PRINTFUL_ERROR]', syncRes.error);
        throw new Error(syncRes.error.message || 'Printful API Error');
      }

      console.log('[SYSTEM_SUCCESS] Product Pushed to Printful/Shopify Pipeline.');

      return NextResponse.json({ 
        success: true, 
        result: syncRes.result,
        shopify: { url: `https://z5ju1n-vs.myshopify.com/admin/products` }
      });
    }

    return NextResponse.json({ error: 'Unknown Action' }, { status: 400 });

  } catch (error: any) {
    console.error(`[CRITICAL_FAILURE]`, error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
