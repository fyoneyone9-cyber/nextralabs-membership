import { MetadataRoute } from 'next'

const BASE = 'https://membership-site-nextralabos.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/auth/',
          '/admin/',
          '/profile/',
          '/_next/',
          '/dms/',
          '/products/*/app',
        ],
      },
      // 主要クローラーは全て許可
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/auth/', '/admin/', '/dms/', '/products/*/app'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/auth/', '/admin/', '/dms/', '/products/*/app'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  }
}
