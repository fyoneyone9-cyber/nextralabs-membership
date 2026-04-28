import { NextRequest, NextResponse } from 'next/server'

// 気象庁の地域コードマッピング (都道府県名 → area code)
const PREF_CODES: Record<string, string> = {
  '北海道': '010100', '青森県': '020000', '岩手県': '030000', '宮城県': '040000',
  '秋田県': '050000', '山形県': '060000', '福島県': '070000', '茨城県': '080000',
  '栃木県': '090000', '群馬県': '100000', '埼玉県': '110000', '千葉県': '120000',
  '東京都': '130000', '神奈川県': '140000', '新潟県': '150000', '富山県': '160000',
  '石川県': '170000', '福井県': '180000', '山梨県': '190000', '長野県': '200000',
  '岐阜県': '210000', '静岡県': '220000', '愛知県': '230000', '三重県': '240000',
  '滋賀県': '250000', '京都府': '260000', '大阪府': '270000', '兵庫県': '280000',
  '奈良県': '290000', '和歌山県': '300000', '鳥取県': '310000', '島根県': '320000',
  '岡山県': '330000', '広島県': '340000', '山口県': '350000', '徳島県': '360000',
  '香川県': '370000', '愛媛県': '380000', '高知県': '390000', '福岡県': '400000',
  '佐賀県': '410000', '長崎県': '420000', '熊本県': '430000', '大分県': '440000',
  '宮崎県': '450000', '鹿児島県': '460100', '沖縄県': '471000',
}

interface AlertInfo {
  title: string
  area: string
  severity: string
  status: string
  description: string
}

export async function GET(request: NextRequest) {
  const prefecture = request.nextUrl.searchParams.get('prefecture') || '神奈川県'
  const code = PREF_CODES[prefecture]

  if (!code) {
    return NextResponse.json({ alerts: [], error: 'Unknown prefecture' })
  }

  try {
    // 気象庁 警報・注意報 JSON API
    const res = await fetch(`https://www.jma.go.jp/bosai/warning/data/warning/${code}.json`, {
      next: { revalidate: 300 }, // 5分キャッシュ
    })

    if (!res.ok) {
      return NextResponse.json({ alerts: [] })
    }

    const data = await res.json()
    const alerts: AlertInfo[] = []

    // Parse the JMA warning JSON structure
    if (data.areaTypes) {
      for (const areaType of data.areaTypes) {
        if (areaType.areas) {
          for (const area of areaType.areas) {
            if (area.warnings) {
              for (const warning of area.warnings) {
                if (warning.status === '発表' || warning.status === '継続') {
                  let severity = '注意報'
                  const code = warning.code
                  // Code classification: 33=大雨特別警報, 03=大雨警報, 10=大雨注意報 etc.
                  if (code && String(code).startsWith('3')) severity = '特別警報'
                  else if (code && (String(code) === '03' || String(code) === '04' || String(code) === '05' || String(code) === '06' || String(code) === '07' || String(code) === '08' || String(code) === '09')) severity = '警報'

                  // Use the warning name from JMA data
                  const warningName = warning.name || `警報コード${code}`

                  alerts.push({
                    title: warningName,
                    area: area.name || prefecture,
                    severity,
                    status: warning.status || '',
                    description: '',
                  })
                }
              }
            }
          }
        }
      }
    }

    return NextResponse.json({ alerts, prefecture, updatedAt: new Date().toISOString() })
  } catch (error) {
    console.error('Weather API error:', error)
    return NextResponse.json({ alerts: [], error: 'Failed to fetch weather data' })
  }
}
