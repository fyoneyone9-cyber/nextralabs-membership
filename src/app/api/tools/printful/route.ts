import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Default server-side keys (owner fallback)
const DEFAULT_API_KEY = process.env.PRINTFUL_API_KEY || ''
const DEFAULT_STORE_ID = process.env.PRINTFUL_STORE_ID || '18088076'
const PRINTFUL_BASE_URL = 'https://api.printful.com'

// Supabase for image hosting
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Shopify Admin API (defaults from env, overridable per-user)
const DEFAULT_SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || ''
const DEFAULT_SHOPIFY_CLIENT_ID = process.env.SHOPIFY_CLIENT_ID || ''
const DEFAULT_SHOPIFY_CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET || ''

async function getShopifyToken(domain: string, clientId: string, clientSecret: string): Promise<string | null> {
  if (!domain || !clientId || !clientSecret) return null
  try {
    const res = await fetch(`https://${domain}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      }),
    })
    const data = await res.json()
    return data.access_token || null
  } catch {
    return null
  }
}

// Bella+Canvas 3001 Unisex T-Shirt variant mapping
const TSHIRT_VARIANTS: Record<string, Record<string, number>> = {
  'White':  { S: 4011, M: 4012, L: 4013, XL: 4014, '2XL': 4015 },
  'Black':  { S: 4016, M: 4017, L: 4018, XL: 4019, '2XL': 4020 },
  'Navy':   { S: 4111, M: 4112, L: 4113, XL: 4114, '2XL': 4115 },
  'Dark Grey': { S: 21578, M: 21579, L: 21580, XL: 21581, '2XL': 21582 },
}

// Map Japanese color names to Printful color names
const COLOR_MAP: Record<string, string> = {
  '白': 'White',
  '黒': 'Black',
  'グレー': 'Dark Grey',
  'ネイビー': 'Navy',
  'カーキ': 'White', // fallback
  'white': 'White',
  'black': 'Black',
  'gray': 'Dark Grey',
  'navy': 'Navy',
  'khaki': 'White',
}

async function printfulFetch(endpoint: string, apiKey: string, storeId: string, options: RequestInit = {}) {
  const res = await fetch(`${PRINTFUL_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'X-PF-Store-Id': storeId,
      ...options.headers,
    },
  })
  return res.json()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    // Allow user-supplied credentials (from frontend settings), fallback to server defaults
    const apiKey = body.printfulApiKey || DEFAULT_API_KEY
    const storeId = body.printfulStoreId || DEFAULT_STORE_ID

    if (!apiKey) {
      return NextResponse.json({ error: 'Printful API key not configured. 設定タブでAPIキーを入力してください。' }, { status: 400 })
    }

    switch (action) {
      case 'get-store': {
        const data = await printfulFetch('/store', apiKey, storeId)
        return NextResponse.json(data)
      }

      case 'get-products': {
        const data = await printfulFetch('/store/products', apiKey, storeId)
        return NextResponse.json(data)
      }

      case 'create-product': {
        const { keyword, style, tshirtColor, sizes, designImageBase64, sellingPrice } = body

        const printfulColor = COLOR_MAP[tshirtColor] || 'White'
        
        // Step 1: Upload design image to Supabase Storage → get public URL → register with Printful
        let printfulFileUrl = ''
        if (designImageBase64 && SUPABASE_URL && SUPABASE_SERVICE_KEY) {
          try {
            const rawBase64 = designImageBase64.replace(/^data:image\/\w+;base64,/, '')
            const imageBuffer = Buffer.from(rawBase64, 'base64')
            const filename = `design-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.png`

            const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

            // Ensure 'designs' bucket exists (public)
            const { data: buckets } = await supabase.storage.listBuckets()
            if (!buckets?.find(b => b.id === 'designs')) {
              await supabase.storage.createBucket('designs', { public: true })
            }

            // Upload image
            const { error: uploadError } = await supabase.storage
              .from('designs')
              .upload(filename, imageBuffer, {
                contentType: 'image/png',
                upsert: true,
              })

            if (uploadError) {
              return NextResponse.json({ 
                error: 'デザイン画像のアップロードに失敗しました',
                details: uploadError.message
              }, { status: 400 })
            }

            // Get public URL
            const { data: urlData } = supabase.storage.from('designs').getPublicUrl(filename)
            printfulFileUrl = urlData.publicUrl

          } catch (uploadErr) {
            return NextResponse.json({ 
              error: 'デザイン画像のアップロードに失敗しました',
              details: uploadErr instanceof Error ? uploadErr.message : 'Unknown upload error'
            }, { status: 400 })
          }
        }

        // Step 2: Create product with public image URL
        const fileConfig = printfulFileUrl ? [{ type: 'default' as const, url: printfulFileUrl }] : []

        const variants = (sizes as string[]).map(size => {
          const variantId = TSHIRT_VARIANTS[printfulColor]?.[size]
          if (!variantId) return null
          return {
            variant_id: variantId,
            retail_price: sellingPrice.toString(),
            files: fileConfig,
          }
        }).filter(Boolean)

        if (variants.length === 0) {
          return NextResponse.json({ error: 'No valid variants for selected color/sizes' }, { status: 400 })
        }

        const productData = {
          sync_product: {
            name: `${keyword} - ${style} Tシャツ`,
          },
          sync_variants: variants,
        }

        const data = await printfulFetch('/store/products', apiKey, storeId, {
          method: 'POST',
          body: JSON.stringify(productData),
        })

        // Step 3: Also create product on Shopify if configured
        let shopifyProduct = null
        const shopifyDomain = body.shopifyDomain || DEFAULT_SHOPIFY_STORE_DOMAIN
        const shopifyClientId = body.shopifyClientId || DEFAULT_SHOPIFY_CLIENT_ID
        const shopifyClientSecret = body.shopifyClientSecret || DEFAULT_SHOPIFY_CLIENT_SECRET
        const shopifyToken = await getShopifyToken(shopifyDomain, shopifyClientId, shopifyClientSecret)
        if (shopifyToken && shopifyDomain) {
          try {
            const shopifyVariants = (sizes as string[]).map(size => ({
              option1: size,
              price: sellingPrice.toString(),
              sku: `${keyword}-${printfulColor}-${size}`.replace(/[^a-zA-Z0-9-]/g, ''),
              requires_shipping: true,
            }))

            const shopifyBody = JSON.stringify({
              product: {
                title: `${keyword} - ${style} Tシャツ`,
                body_html: `<p>AIが生成した「${keyword}」デザインの${style}スタイルTシャツ。Bella+Canvas 3001使用。カラー: ${tshirtColor}</p>`,
                vendor: 'NextraLabs',
                product_type: 'T-Shirts',
                tags: `ai-design, ${keyword}, ${style}, ${tshirtColor}`,
                images: printfulFileUrl ? [{ src: printfulFileUrl }] : [],
                variants: shopifyVariants,
              }
            })

            const shopifyRes = await fetch(
              `https://${shopifyDomain}/admin/api/2024-01/products.json`,
              {
                method: 'POST',
                headers: {
                  'X-Shopify-Access-Token': shopifyToken,
                  'Content-Type': 'application/json',
                },
                body: shopifyBody,
              }
            )
            const shopifyData = await shopifyRes.json()
            if (shopifyData.product) {
              shopifyProduct = {
                id: shopifyData.product.id,
                title: shopifyData.product.title,
                url: `https://${shopifyDomain}/products/${shopifyData.product.handle}`,
              }
            }
          } catch (shopifyErr) {
            // Shopify error is non-fatal — Printful product was still created
            console.error('Shopify product creation failed:', shopifyErr)
          }
        }

        return NextResponse.json({ ...data, shopify: shopifyProduct })
      }

      case 'get-mockup': {
        const data = await printfulFetch(`/mockup-generator/create-task/71`, apiKey, storeId, {
          method: 'POST',
          body: JSON.stringify({
            variant_ids: [4012],
            files: [{
              placement: 'front',
              image_url: body.designImageUrl,
              position: {
                area_width: 1800,
                area_height: 2400,
                width: 1800,
                height: 1800,
                top: 300,
                left: 0,
              }
            }],
          }),
        })
        return NextResponse.json(data)
      }

      case 'check-mockup': {
        const { taskKey } = body
        const data = await printfulFetch(`/mockup-generator/task?task_key=${taskKey}`, apiKey, storeId)
        return NextResponse.json(data)
      }

      case 'get-shipping': {
        const data = await printfulFetch('/shipping/rates', apiKey, storeId, {
          method: 'POST',
          body: JSON.stringify({
            recipient: {
              country_code: 'JP',
              city: 'Tokyo',
              zip: '100-0001',
            },
            items: [{
              variant_id: TSHIRT_VARIANTS[COLOR_MAP[body.tshirtColor || '白'] || 'White']?.M || 4012,
              quantity: 1,
            }],
          }),
        })
        return NextResponse.json(data)
      }

      case 'list-sync-products': {
        const data = await printfulFetch('/store/products?limit=100', apiKey, storeId)
        return NextResponse.json(data)
      }

      case 'list-orders': {
        // Fetch up to 100 most recent orders from Printful
        const data = await printfulFetch('/orders?limit=100&status=fulfilled', apiKey, storeId)
        return NextResponse.json(data)
      }

      case 'shopify-test': {
        const sDomain = body.shopifyDomain || DEFAULT_SHOPIFY_STORE_DOMAIN
        const sClientId = body.shopifyClientId || DEFAULT_SHOPIFY_CLIENT_ID
        const sClientSecret = body.shopifyClientSecret || DEFAULT_SHOPIFY_CLIENT_SECRET
        const sToken = await getShopifyToken(sDomain, sClientId, sClientSecret)
        if (!sToken) {
          return NextResponse.json({ error: 'Shopify認証に失敗しました。Client IDとSecretを確認してください。' }, { status: 400 })
        }
        // Get shop info
        const shopRes = await fetch(`https://${sDomain}/admin/api/2024-01/shop.json`, {
          headers: { 'X-Shopify-Access-Token': sToken, 'Content-Type': 'application/json' },
        })
        const shopData = await shopRes.json()
        // Get product count
        const prodRes = await fetch(`https://${sDomain}/admin/api/2024-01/products/count.json`, {
          headers: { 'X-Shopify-Access-Token': sToken, 'Content-Type': 'application/json' },
        })
        const prodData = await prodRes.json()
        return NextResponse.json({
          code: 200,
          result: {
            name: shopData.shop?.name || sDomain,
            domain: shopData.shop?.domain || sDomain,
            productCount: prodData.count || 0,
          }
        })
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
