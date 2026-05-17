<<<<<<< HEAD
import { checkApiLimit } from '@/lib/api-limit';
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { unstable_noStore as noStore } from 'next/cache'

/**
 * 🛠️ Nextra Master E-commerce Engine v18.0 (Per-User Settings)
 * - ユーザーがShopify/Printful設定を登録していればそのアカウントで動作
 * - 未設定の場合は環境変数（NextraLabsオーナー設定）で動作
 */

// ── オーナーデフォルト設定（環境変数から取得） ──
const DEFAULT_PRINTFUL_API_KEY      = process.env.PRINTFUL_API_KEY || '';
const DEFAULT_PRINTFUL_STORE_ID     = process.env.PRINTFUL_STORE_ID || '18088076';
const DEFAULT_SHOPIFY_DOMAIN        = process.env.SHOPIFY_DOMAIN || 'z5ju1n-vs.myshopify.com';
const DEFAULT_SHOPIFY_CLIENT_ID     = process.env.SHOPIFY_CLIENT_ID || '';
const DEFAULT_SHOPIFY_CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET || '';

const SUPABASE_URL         = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// ── Supabaseからユーザー設定を取得 ──
async function getUserShopSettings(userId: string) {
  if (!userId || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) return null;
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const { data, error } = await supabase
    .from('user_shop_settings')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error || !data) return null;
  return data;
}

// ── Shopifyアクセストークン取得 ──
async function getShopifyToken(domain: string, clientId: string, clientSecret: string): Promise<string | null> {
  try {
    const res = await fetch(`https://${domain}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
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
  noStore()
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  // 🛡️ レート制限（1日10回）
  const limitCheck = await checkApiLimit('printful', 10);
  if (!limitCheck.allowed) {
    if (limitCheck.reason === 'unauthenticated') {
      return NextResponse.json(
        { error: 'このツールの利用には会員登録が必要です。', reason: 'unauthenticated' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: '本日の利用制限に達しました。明日またご利用ください。' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { action, keyword, style, mockupUrl, tshirtColor, sizes, userId } = body;

    // ── ユーザー設定取得（あれば優先、なければデフォルト） ──
    const userSettings = userId ? await getUserShopSettings(userId) : null;

    const PRINTFUL_API_KEY      = userSettings?.printful_api_key      || DEFAULT_PRINTFUL_API_KEY;
    const PRINTFUL_STORE_ID     = userSettings?.printful_store_id     || DEFAULT_PRINTFUL_STORE_ID;
    const SHOPIFY_DOMAIN        = userSettings?.shopify_domain        || DEFAULT_SHOPIFY_DOMAIN;
    const SHOPIFY_CLIENT_ID     = userSettings?.shopify_client_id     || DEFAULT_SHOPIFY_CLIENT_ID;
    const SHOPIFY_CLIENT_SECRET = userSettings?.shopify_client_secret || DEFAULT_SHOPIFY_CLIENT_SECRET;

    // ── 設定保存API ──
    if (action === 'save-settings') {
      if (!userId) return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });
      const { shopifyDomain, shopifyClientId, shopifyClientSecret, printfulApiKey, printfulStoreId } = body;
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
      const { error } = await supabase
        .from('user_shop_settings')
        .upsert({
          user_id: userId,
          shopify_domain: shopifyDomain || null,
          shopify_client_id: shopifyClientId || null,
          shopify_client_secret: shopifyClientSecret || null,
          printful_api_key: printfulApiKey || null,
          printful_store_id: printfulStoreId || null,
        }, { onConflict: 'user_id' });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    // ── 設定取得API ──
    if (action === 'get-settings') {
      if (!userId) return NextResponse.json({ settings: null });
      const settings = await getUserShopSettings(userId);
      return NextResponse.json({ settings });
    }

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

      // 3. Shopify 出品（OAuth access_token 方式）
      const shopifyToken = await getShopifyToken(SHOPIFY_DOMAIN, SHOPIFY_CLIENT_ID, SHOPIFY_CLIENT_SECRET);

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
        shopify: shopifyProduct || { url: `https://${SHOPIFY_DOMAIN}/admin/products` },
        usedDefaultSettings: !userSettings,
      });
    }

    if (action === 'shopify-test') {
      const token = await getShopifyToken(SHOPIFY_DOMAIN, SHOPIFY_CLIENT_ID, SHOPIFY_CLIENT_SECRET);
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
=======
﻿import { checkApiLimit } from '@/lib/api-limit';
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { unstable_noStore as noStore } from 'next/cache'

/**
 * 🛠️ Nextra Master E-commerce Engine v17.0 (TRUE RESTORATION)
 * 数日前に成功していた「本物のロジック」を完全復元。
 * shopifyClientId + shopifyClientSecret を使った OAuth 認証で
 * Shopify Admin APIに接続し、商品を直接出品する。
 */

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY || '';
const PRINTFUL_STORE_ID = process.env.PRINTFUL_STORE_ID || '18088076';
const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN || 'z5ju1n-vs.myshopify.com';
const SHOPIFY_CLIENT_ID = process.env.SHOPIFY_CLIENT_ID || '';
const SHOPIFY_CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET || '';

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
  noStore()
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  // 🛡️ レート制限（1日10回）
  const limitCheck = await checkApiLimit('printful', 10);
  if (!limitCheck.allowed) {
    if (limitCheck.reason === 'unauthenticated') {
      return NextResponse.json(
        { error: 'このツールの利用には会員登録が必要です。', reason: 'unauthenticated' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: '本日の利用制限に達しました。明日またご利用ください。' },
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
>>>>>>> 17436ab6a8a863e16f26b310a156860204e412ee
