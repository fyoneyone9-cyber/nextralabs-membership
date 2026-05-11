import { NextRequest, NextResponse } from 'next/server'

const VERCEL_TOKEN = process.env.VERCEL_TOKEN || 'vcp_7fOOK0MRM13q7oHT4vkHljgJBsSPmHZ2JDwuUw9RHggEqApOEr09hz77'
const PROJECT_ID = 'prj_yaUSZdabp1yiMBuVALpqm2rgjV7D'
const TEAM_ID = 'team_T4YEOSuj882rQycFBmlrGDay'

export async function GET(req: NextRequest) {
  // 管理者チェック（簡易）
  const adminKey = req.headers.get('x-admin-key')
  if (adminKey !== 'nextra-admin-2026' && adminKey !== process.env.DMS_ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const res = await fetch(
      `https://api.vercel.com/v6/deployments?projectId=${PROJECT_ID}&teamId=${TEAM_ID}&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
        },
      }
    )

    if (!res.ok) {
      const err = await res.json()
      return NextResponse.json({ error: err.message }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
