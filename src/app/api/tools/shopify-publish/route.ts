import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { shopifyDomain, shopifyToken, printifyShopId, printifyToken, keyword, style, imageBase64 } = await req.json();

    if (!shopifyDomain || !shopifyToken || !printifyShopId || !printifyToken) {
      return NextResponse.json({ error: 'APIキーが設定されていません' }, { status: 400 });
    }
    if (!imageBase64 || !keyword) {
      return NextResponse.json({ error: 'デザインデータがありません' }, { status: 400 });
    }

    // Step1: PrintifyにBase64画像をアップロード
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const printifyUploadRes = await fetch('https://api.printify.com/v1/uploads/images.json', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${printifyToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file_name: `${keyword}-design.png`,
        contents: base64Data,
      }),
    });

    if (!printifyUploadRes.ok) {
      const err = await printifyUploadRes.text();
      return NextResponse.json({ error: `Printify画像アップロード失敗: ${err}` }, { status: 500 });
    }

    const uploadData = await printifyUploadRes.json();
    const imageId = uploadData.id;

    // Step2: Printifyで商品作成（Gildan 64000 Tシャツ: blueprint_id=6）
    const printifyProductRes = await fetch(`https://api.printify.com/v1/shops/${printifyShopId}/products.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${printifyToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: `${keyword} Tシャツ【${style}スタイル】`,
        description: `AIが生成したオリジナルデザイン。スタイル: ${style}。NextraLabsのAIセレクトショップで作成。`,
        blueprint_id: 6,
        print_provider_id: 1,
        variants: [
          { id: 17887, price: 3500, is_enabled: true }, // S
          { id: 17888, price: 3500, is_enabled: true }, // M
          { id: 17889, price: 3500, is_enabled: true }, // L
          { id: 17890, price: 3500, is_enabled: true }, // XL
        ],
        print_areas: [
          {
            variant_ids: [17887, 17888, 17889, 17890],
            placeholders: [
              {
                position: 'front',
                images: [
                  { id: imageId, x: 0.5, y: 0.5, scale: 1, angle: 0 },
                ],
              },
            ],
          },
        ],
      }),
    });

    if (!printifyProductRes.ok) {
      const err = await printifyProductRes.text();
      return NextResponse.json({ error: `Printify商品作成失敗: ${err}` }, { status: 500 });
    }

    const printifyProduct = await printifyProductRes.json();
    const printifyProductId = printifyProduct.id;

    // Step3: PrintifyからShopifyへ公開
    const publishRes = await fetch(`https://api.printify.com/v1/shops/${printifyShopId}/products/${printifyProductId}/publish.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${printifyToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: true,
        description: true,
        images: true,
        variants: true,
        tags: true,
        keyFeatures: true,
        shipping_template: true,
      }),
    });

    if (!publishRes.ok) {
      const err = await publishRes.text();
      return NextResponse.json({ error: `Shopify公開失敗: ${err}` }, { status: 500 });
    }

    // Step4: ShopifyのストアURLを構築して返す
    const storeDomain = shopifyDomain.replace(/https?:\/\//, '').replace(/\/$/, '');
    const productUrl = `https://${storeDomain}/products`;

    return NextResponse.json({
      success: true,
      printifyProductId,
      productUrl,
      message: `「${keyword}」Tシャツの出品が完了しました！`,
    });

  } catch (e: any) {
    console.error('[shopify-publish]', e);
    return NextResponse.json({ error: e.message || '不明なエラー' }, { status: 500 });
  }
}
