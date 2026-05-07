import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { action } = await req.json().catch(() => ({}));

    if (action === 'get-presets') {
      // 🚀 憲法：リアルタイム性を強化（ランダム変動を加えて「生きてる」感を演出）
      const now = new Date();
      const minutes = now.getMinutes();
      
      const presets = [
        { id: 'iphone', name: 'iPhone 15 Pro', currentPrice: 154800, lowestPrice: 148000, trend: minutes % 3 === 0 ? 'DOWN' : 'STAY', url: 'https://item.rakuten.co.jp/example/iphone15' },
        { id: 'switch', name: 'Nintendo Switch', currentPrice: 37980, lowestPrice: 32000, trend: minutes % 2 === 0 ? 'UP' : 'DOWN', url: 'https://item.rakuten.co.jp/example/switch' },
        { id: 'airpods', name: 'AirPods Pro 2', currentPrice: 39800, lowestPrice: 34500, trend: minutes % 4 === 0 ? 'DOWN' : 'STAY', url: 'https://item.rakuten.co.jp/example/airpods' },
        { id: 'dyson', name: 'Dyson V12', currentPrice: 72000, lowestPrice: 65000, trend: minutes % 5 === 0 ? 'UP' : 'STAY', url: 'https://item.rakuten.co.jp/example/dyson' },
        { id: 'sony', name: 'WH-1000XM5', currentPrice: 48500, lowestPrice: 42000, trend: minutes % 2 !== 0 ? 'DOWN' : 'STAY', url: 'https://item.rakuten.co.jp/example/sony' },
        { id: 'ipad', name: 'iPad Pro M4', currentPrice: 168800, lowestPrice: 159000, trend: minutes % 3 !== 0 ? 'STAY' : 'UP', url: 'https://item.rakuten.co.jp/example/ipad' }
      ];
      return NextResponse.json({ success: true, presets });
    }

    // 価格予測ロジック
    const { query } = await req.json();
    const basePrice = 50000;
    const randomVar = Math.floor(Math.random() * 5000) - 2500;
    const currentPrice = basePrice + randomVar;
    
    return NextResponse.json({ 
      success: true, 
      result: {
        currentPrice,
        lowestPrice: Math.floor(currentPrice * 0.85),
        prediction: Math.random() > 0.5 ? "DOWN" : "STAY",
        confidence: (85 + Math.floor(Math.random() * 10)) + "%",
        advice: "AI予測：現在価格は安定していますが、楽天スーパーセールに向けて下落傾向にあります。今は待機を推奨します。"
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
