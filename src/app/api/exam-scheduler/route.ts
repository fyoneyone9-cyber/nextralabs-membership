// ============================================================
// 🔒 LOCKED — ExamScheduler API route
// 完成済みツール。NextraLabs様の明示的な指示なしに
// このファイルを編集・削除・移動することを禁止する。
// Locked: 2026-05-10
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { unstable_noStore as noStore } from 'next/cache'

interface ExamConfig {
  name: string
  rss: string
  studyWeeks: number
  sessionsPerWeek: number
  sessionHours: number
  examDate?: string // 手動指定も可
}

interface ScheduleEvent {
  date: string
  title: string
  description: string
  durationHours: number
}

// RSSから試験日を取得
async function fetchExamDate(rssUrl: string): Promise<string | null> {
  try {
    const res = await fetch(rssUrl, {
      headers: { 'User-Agent': 'NextraLabs-ExamScheduler/1.0' },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    const xml = await res.text()

    // 日付パターンを探す
    const patterns = [
      /(\d{4})年(\d{1,2})月(\d{1,2})日/g,
      /(\d{4})[/-](\d{1,2})[/-](\d{1,2})/g,
    ]

    const today = new Date()
    const foundDates: Date[] = []

    for (const pattern of patterns) {
      let match
      while ((match = pattern.exec(xml)) !== null) {
        const d = new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]))
        if (d > today) foundDates.push(d)
      }
    }

    if (foundDates.length === 0) return null
    foundDates.sort((a, b) => a.getTime() - b.getTime())
    return foundDates[0].toISOString().split('T')[0]
  } catch {
    return null
  }
}

// AIでスケジュール生成（Gemini Flash使用 — 1日1500回無料）
async function generateSchedule(
  examName: string,
  examDate: string,
  studyWeeks: number,
  sessionsPerWeek: number,
  sessionHours: number
): Promise<ScheduleEvent[]> {
  const today = new Date().toISOString().split('T')[0]
  const startDate = new Date(examDate)
  startDate.setDate(startDate.getDate() - studyWeeks * 7)
  const startStr = startDate.toISOString().split('T')[0] < today
    ? today
    : startDate.toISOString().split('T')[0]

  const prompt = `資格試験「${examName}」の学習スケジュールをJSON形式で作成してください。

条件:
- 試験日: ${examDate}
- 今日: ${today}
- 学習開始日: ${startStr}
- 週${sessionsPerWeek}回、1回${sessionHours}時間
- 試験1週間前はまとめ・模擬試験に充てる
- 試験当日は「試験本番」として登録

フェーズ:
1. 基礎固め（開始〜40%）
2. 応用・問題演習（40〜80%）
3. まとめ・模擬試験（80%〜1週間前）
4. 直前対策（1週間前）

以下のJSON配列のみ返してください（説明文不要）:
[{"date":"YYYY-MM-DD","title":"【${examName}】フェーズ: 内容","description":"学習内容","durationHours":数字}]

学習セッションは週${sessionsPerWeek}回（火・木・土など間隔を空けて）配置。試験本番日も必ず含めてください。`

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 8192 },
      }),
    }
  )

  if (!res.ok) {
    const errText = await res.text()
    if (res.status === 429) {
      throw new Error('Gemini API の無料枠クォータを超過しました。しばらく待ってから再試行してください（1分後〜）')
    }
    throw new Error(`Gemini API エラー: ${errText}`)
  }

  const data = await res.json() as {
    candidates: Array<{ content: { parts: Array<{ text: string }> } }>
  }
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? ''
  const match = raw.match(/\[[\s\S]*\]/)
  if (!match) throw new Error('AIのレスポンスをパースできませんでした')
  return JSON.parse(match[0]) as ScheduleEvent[]
}

export async function POST(req: NextRequest) {
  noStore()
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  try {
    const body = await req.json() as {
      exams: ExamConfig[]
      googleAccessToken: string
    }

    if (!body.exams || !Array.isArray(body.exams)) {
      return NextResponse.json({ error: '試験リストが必要です' }, { status: 400 })
    }

    const results = []

    for (const exam of body.exams) {
      // 試験日の取得
      let examDate = exam.examDate || null

      if (!examDate) {
        examDate = await fetchExamDate(exam.rss)
      }

      if (!examDate) {
        results.push({ name: exam.name, status: 'skipped', reason: 'RSSから試験日を取得できませんでした' })
        continue
      }

      // スケジュール生成
      const schedule = await generateSchedule(
        exam.name,
        examDate,
        exam.studyWeeks,
        exam.sessionsPerWeek,
        exam.sessionHours
      )

      // Google Calendar登録
      const registered = []
      const failed = []

      for (const ev of schedule) {
        const startHour = ev.title.includes('本番') ? 10 : 9
        const durationH = typeof ev.durationHours === 'number' && ev.durationHours > 0 ? ev.durationHours : 1
        const endHour = startHour + Math.floor(durationH)
        const endMin = Math.round((durationH % 1) * 60)
        const startTime = `${ev.date}T${String(startHour).padStart(2, '0')}:00:00+09:00`
        const endTime = `${ev.date}T${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}:00+09:00`

        try {
          const gcalRes = await fetch(
            'https://www.googleapis.com/calendar/v3/calendars/primary/events',
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${body.googleAccessToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                summary: ev.title,
                description: ev.description,
                start: { dateTime: startTime, timeZone: 'Asia/Tokyo' },
                end: { dateTime: endTime, timeZone: 'Asia/Tokyo' },
              }),
            }
          )

          if (gcalRes.ok) {
            registered.push(ev.date)
          } else {
            const err = await gcalRes.json()
            failed.push({ date: ev.date, error: err.error?.message || 'Unknown error' })
          }
        } catch (e) {
          failed.push({ date: ev.date, error: String(e) })
        }
      }

      const daysUntil = Math.ceil(
        (new Date(examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )

      results.push({
        name: exam.name,
        status: 'done',
        examDate,
        daysUntil,
        registered: registered.length,
        failed: failed.length,
        failedDetails: failed,
      })
    }

    return NextResponse.json({ results })
  } catch (e) {
    console.error('exam-scheduler error:', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
