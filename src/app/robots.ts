import { MetadataRoute } from 'next'

const BASE = 'https://nextralab.jp'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/pricing/',
          '/guide/',
          '/products/',
          '/corporate/',
          '/interview/',
        ],
        disallow: [
          '/api/',
          '/dashboard/',
          '/auth/',
          '/admin/',
          '/profile/',
          '/_next/',
          '/dms/',
          '/products/*/app',
          '/reset-password/',
          '/forgot-password/',
          '/signup/',
          '/gate/',
        ],
      },
      // 主要クローラーは全て許可
      {
        userAgent: 'Googlebot',
        allow: [
          '/pricing/',
          '/guide/',
          '/products/',
          '/corporate/',
          '/interview/',
        ],
        disallow: [
          '/api/',
          '/dashboard/',
          '/auth/',
          '/admin/',
          '/dms/',
          '/products/*/app',
          '/reset-password/',
          '/forgot-password/',
          '/signup/',
          '/gate/',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: [
          '/pricing/',
          '/guide/',
          '/products/',
          '/corporate/',
          '/interview/',
        ],
        disallow: [
          '/api/',
          '/dashboard/',
          '/auth/',
          '/admin/',
          '/dms/',
          '/products/*/app',
          '/reset-password/',
          '/forgot-password/',
          '/signup/',
          '/gate/',
        ],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  }
}
