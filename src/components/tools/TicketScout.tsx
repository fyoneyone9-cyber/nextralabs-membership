'use client'

import { useState } from 'react'
import { Loader2, Search, Calendar, ExternalLink, CheckCircle2, AlertTriangle, Music } from 'lucide-react'

interface TicketEvent {
  title: string
  venue: string
  eventDate: string
  saleDate: string
  saleStartTime: string
  url: string
  site: string
}

interface CalendarResult {
  event: TicketEvent
  success: boolean
  error?: string
}

const SITES = [
  { key: 'eplus', label: 'e+', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { key: 'lawson', label: 'ローチケ', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
  { key: 'pia', label: 'チケットぴあ', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
]

export function TicketScout() {
  const [artist, setArtist] = useState('')
  const [selectedSites, setSelectedSites] = useState<string[]>(['eplus', 'lawson', 'pia'])
  const [loading, setLoading] = useState(false)
  const [events, setEvents] = useState<TicketEvent[]>([])
  const [calendarResults, setCalendarResults] = useState<CalendarResult[]>([])
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)
  const [addingCalendar, setAddingCalendar] = useState(false)
  const [oauthToken, setOauthToken] = useState<string | null>(null)

  const toggleSite = (key: string) => {
    setSelectedSites(prev =>
      prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key]
    )
  }

  // Google OAuth
  const handleGoogleAuth = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    const redirectUri = `${window.location.origin}/api/auth/google/callback`
    const scope = encodeURIComponent('https://www.googleapis.com/auth/calendar.events')
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}&prompt=consent`
    const popup = window.open(url, 'google-auth', 'width=500,height=600')

    const timer = setInterval(() => {
      try {
        if (popup?.location?.hash) {
          const params = new URLSearchParams(popup.location.hash.slice(1))
          const token = params.get('access_token')
          if (token) {
            setOauthToken(token)
            popup.close()
            clearInterval(timer)
          }
        }
      } catch {}
    }, 500)
  }

  const handleSearch = async () => {
    if (!artist.trim() || selectedSites.length === 0) return
    setLoading(true)
    setError('')
    setEvents([])
    setCalendarResults([])
    setSearched(false)

    try {
      const res = await fetch('/api/ticket-scout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artist: artist.trim(),
          sites: selectedSites,
          accessToken: oauthToken,
          addToCalendar: !!oauthToken,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'エラーが発生しました')
        return
      }
      setEvents(data.events ?? [])
      setCalendarResults(data.calendarResults ?? [])
      setSearched(true)
    } catch {
      setError('通信エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleAddAllToCalendar = async () => {
    if (!oauthToken) {
      handleGoogleAuth()
      return
    }
    setAddingCalendar(true)
    try {
      const res = await fetch('/api/ticket-scout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artist: artist.trim(),
          sites: selectedSites,
          accessToken: oauthToken,
          addToCalendar: true,
        }),
      })
      const data = await res.json()
      setCalendarResults(data.calendarResults ?? [])
    } catch {
      setError('カレンダー登録に失敗しました')
    } finally {
      setAddingCalendar(false)
    }
  }

  const calendarAdded = calendarResults.filter(r => r.success).length

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white p-4">
      <div className="max-w-2xl mx-auto py-10">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">🎫</div>
          <h1 className="text-3xl font-bold mb-2">Ticket Scout</h1>
          <p className="text-gray-400 text-sm">お気に入りアーティストの公演を一括検索 → 発売日をGoogle Calendarに自動登録</p>
        </div>

        {/* Search */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 mb-6">
          {/* Artist input */}
          <label className="block text-sm font-medium text-gray-300 mb-2">アーティスト名</label>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={artist}
              onChange={e => setArtist(e.target.value)}
              placeholder="例: 米津玄師、YOASOBI、King Gnu..."
              className="flex-1 bg-gray-900 border border-gray-600 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
              onKeyDown={e => e.key === 'Enter' && !loading && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={loading || !artist.trim() || selectedSites.length === 0}
              className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-5 py-3 rounded-xl flex items-center gap-2 transition-colors"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {loading ? '検索中...' : '検索'}
            </button>
          </div>

          {/* Site selection */}
          <label className="block text-sm font-medium text-gray-300 mb-2">検索サイト</label>
          <div className="flex gap-2 flex-wrap">
            {SITES.map(site => (
              <button
                key={site.key}
                onClick={() => toggleSite(site.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                  selectedSites.includes(site.key)
                    ? site.color
                    : 'bg-gray-800 text-gray-500 border-gray-700'
                }`}
              >
                {site.label}
              </button>
            ))}
          </div>
        </div>

        {/* Google Calendar Auth */}
        <div className={`border rounded-2xl p-4 mb-6 flex items-center justify-between ${
          oauthToken ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-800/50 border-gray-700'
        }`}>
          <div className="flex items-center gap-3">
            <Calendar className={`w-5 h-5 ${oauthToken ? 'text-green-400' : 'text-gray-400'}`} />
            <div>
              <p className="text-sm font-medium">Google Calendar連携</p>
              <p className="text-xs text-gray-500">
                {oauthToken ? '連携済み。発売日が自動登録されます ✓' : '連携するとチケット発売日を自動登録'}
              </p>
            </div>
          </div>
          {!oauthToken && (
            <button
              onClick={handleGoogleAuth}
              className="bg-white text-gray-900 text-sm font-medium px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              Googleで連携
            </button>
          )}
          {oauthToken && (
            <span className="text-green-400 text-sm font-medium flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> 連携済み
            </span>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-5 py-4 mb-6 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="w-10 h-10 animate-spin text-violet-400 mx-auto mb-4" />
            <p className="text-gray-400 text-sm">各サイトを検索中...</p>
            <p className="text-gray-600 text-xs mt-1">複数サイトを並列で検索しています</p>
          </div>
        )}

        {/* Results */}
        {searched && !loading && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">
                「{artist}」の公演 <span className="text-white font-bold">{events.length}件</span> が見つかりました
              </p>
              {events.length > 0 && !oauthToken && (
                <button
                  onClick={handleGoogleAuth}
                  className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Calendar className="w-3 h-3" />
                  カレンダーに追加
                </button>
              )}
              {events.length > 0 && oauthToken && calendarAdded === 0 && (
                <button
                  onClick={handleAddAllToCalendar}
                  disabled={addingCalendar}
                  className="text-xs bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  {addingCalendar ? <Loader2 className="w-3 h-3 animate-spin" /> : <Calendar className="w-3 h-3" />}
                  全件カレンダーに追加
                </button>
              )}
            </div>

            {/* Calendar added notice */}
            {calendarAdded > 0 && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl px-5 py-3 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {calendarAdded}件の発売日をGoogle Calendarに登録しました
              </div>
            )}

            {/* Event cards */}
            {events.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Music className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">公演情報が見つかりませんでした</p>
                <p className="text-xs mt-1">アーティスト名や検索サイトを変えてお試しください</p>
              </div>
            ) : (
              events.map((event, i) => {
                const calResult = calendarResults.find(r => r.event.title === event.title)
                return (
                  <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-white leading-snug">{event.title}</h3>
                        <p className="text-sm text-gray-400 mt-0.5">{event.venue}</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full border shrink-0 ${
                        SITES.find(s => s.label === event.site)?.color ?? 'bg-gray-700 text-gray-400 border-gray-600'
                      }`}>
                        {event.site}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-gray-900/50 rounded-xl p-3">
                        <p className="text-xs text-gray-500 mb-1">公演日</p>
                        <p className="text-sm font-medium">{event.eventDate || '未定'}</p>
                      </div>
                      <div className="bg-gray-900/50 rounded-xl p-3">
                        <p className="text-xs text-gray-500 mb-1">🎫 発売日</p>
                        <p className="text-sm font-medium text-violet-400">
                          {event.saleDate || '未定'}
                          {event.saleStartTime && event.saleDate ? ` ${event.saleStartTime}~` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      {calResult?.success ? (
                        <span className="text-xs text-green-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> カレンダー登録済み
                        </span>
                      ) : (
                        <span />
                      )}
                      <a
                        href={event.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        詳細を見る <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>
    </div>
  )
}
