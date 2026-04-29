import { NextRequest, NextResponse } from 'next/server'

// Rakuten API must be called client-side (requires browser Referer header)
// This route acts as a fallback for non-Rakuten searches and returns config

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const brand = searchParams.get('brand') || ''
  const keywords = searchParams.get('keywords') || ''
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const condition = searchParams.get('condition') || ''

  // Return Rakuten API config for client-side calling
  return NextResponse.json({
    rakuten: {
      appId: process.env.RAKUTEN_APP_ID || '',
      accessKey: process.env.RAKUTEN_ACCESS_KEY || '',
    },
    query: { brand, keywords, minPrice, maxPrice, condition },
  })
}
