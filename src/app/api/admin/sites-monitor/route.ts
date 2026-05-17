import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const SITES = [
  {
    id: 'nextralab',
    name: 'nextralab.jp',
    url: 'https://nextralab.jp',
    vercelProject: 'nextralab-portfolio',
  },
  {
    id: 'ai-adult',
    name: 'ai-adult.jp',
    url: 'https://ai-adult.jp',
    vercelProject: 'sensual-hub',
  },
  {
    id: 'marriage-road',
    name: 'marriage-road-site',
    url: 'https://marriage-road-site.vercel.app',
    vercelProject: 'marriage-road-site',
  },
]

async function checkAlive(url: string) {
  const start = Date.now()
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      signal: AbortSignal.timeout(6000),
    })
    return { alive: res.ok, httpStatus: res.status, responseMs: Date.now() - start }
  } catch {
    return { alive: false, httpStatus: 0, responseMs: null }
  }
}

async function checkVercel(projectName: string) {
  const token = process.env.VERCEL_TOKEN
  if (!token) return null
  try {
    const res = await fetch(
      `https://api.vercel.com/v6/deployments?app=${projectName}&limit=1`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(5000),
      }
    )
    if (!res.ok) return null
    const data = await res.json()
    const dep = data.deployments?.[0]
    if (!dep) return null
    return { state: dep.state, createdAt: new Date(dep.createdAt).toISOString() }
  } catch {
    return null
  }
}

async function checkGoogleIndex(domain: string) {
  const apiKey = process.env.GOOGLE_CSE_API_KEY
  const cx = process.env.GOOGLE_CSE_ID
  if (!apiKey || !cx) return null
  try {
    const res = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=site:${domain}&num=1`,
      { signal: AbortSignal.timeout(8000) }
    )
    if (!res.ok) return null
    const data = await res.json()
    return parseInt(data.searchInformation?.totalResults || '0', 10)
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  noStore()
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const isOwner = user.email === 'f.yoneyone9@gmail.com'
  const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', user.id).single()
  if (!isOwner && profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const results = await Promise.all(
    SITES.map(async (site) => {
      const domain = new URL(site.url).hostname
      const [alive, vercel, indexCount] = await Promise.all([
        checkAlive(site.url),
        checkVercel(site.vercelProject),
        checkGoogleIndex(domain),
      ])
      return {
        id: site.id,
        name: site.name,
        url: site.url,
        ...alive,
        indexCount,
        vercel,
        checkedAt: new Date().toISOString(),
      }
    })
  )

  return NextResponse.json({ sites: results })
}
