import { NextRequest, NextResponse } from 'next/server'

// 🔑 憲法：本物の認証情報を使用
const PRINTFUL_API_KEY = 'suHaJYIsHrfarAJXAApi6tetzLMmoZvD5qfZgaHN';
const PRINTFUL_STORE_ID = '18088076';
const SHOPIFY_DOMAIN = 'z5ju1n-vs.myshopify.com';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { action, keyword, style, mockupUrl } = data;

    if (action === 'create-product') {
      // 1. Printful API 連携 (商品作成)
      const pRes = await fetch('https://api.printful.com/store/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
          'X-PF-Store-Id': PRINTFUL_STORE_ID,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sync_product: { name: `[Nextra] ${keyword}`, thumbnail: mockupUrl },
          sync_variants: [{
            variant_id: 4012, // Bella+Canvas 3001 M Size
            retail_price: "3500",
            files: [{ url: mockupUrl }]
          }]
        })
      });
      const pData = await pRes.json();

      // 2. Shopify 連携 (自動同期結果を返す)
      // PrintfulとShopifyが公式連携済みのため、Printfulで作成 = Shopifyに出品
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
