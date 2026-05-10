import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/dashboard/', '/auth/'] }],
    sitemap: 'https://membership-site-nextralabos.vercel.app/sitemap.xml',
    host: 'https://membership-site-nextralabos.vercel.app',
  }
}
