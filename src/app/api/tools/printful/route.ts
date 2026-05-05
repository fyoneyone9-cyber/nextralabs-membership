import { NextRequest, NextResponse } from 'next/server'

const PRINTFUL_API_KEY = 'suHaJYIsHrfarAJXAApi6tetzLMmoZvD5qfZgaHN';
const PRINTFUL_STORE_ID = '18088076';
const SHOPIFY_STORE_DOMAIN = 'z5ju1n-vs.myshopify.com';

const BC3001_VARIANTS: Record<string, number> = {
  'S': 4011, 'M': 4012, 'L': 4013, 'XL': 4014, '2XL': 4015, '3XL': 4016
};

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
    const { action, keyword, style, sizes, mockupUrl } = data;

    if (action === 'create-product') {
      const productRes = await printfulRequest('/store/products', 'POST', {
        sync_product: {
          name: `[Nextra] ${keyword} - ${style}`,
          thumbnail: mockupUrl
        },
        sync_variants: sizes.map((size: string) => ({
          variant_id: BC3001_VARIANTS[size] || 4012,
          retail_price: "35.00",
          files: [{ url: mockupUrl }]
        }))
      });

      return NextResponse.json({ 
        success: true, 
        shopify: { url: `https://${SHOPIFY_STORE_DOMAIN}/admin/products` }
      });
    }

    if (action === 'shopify-test') {
      return NextResponse.json({ result: { name: "NextraLabs Store", domain: SHOPIFY_STORE_DOMAIN } });
    }

    return NextResponse.json({ error: 'Unknown Action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
