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
  { key: 'lawson', label: '繝ｭ繝ｼ繝√こ', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
  { key: 'pia', label: '繝√こ繝・ヨ縺ｴ縺・, color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
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
        setError(data.error ?? '繧ｨ繝ｩ繝ｼ縺檎匱逕溘＠縺ｾ縺励◆')
        return
      }
      setEvents(data.events ?? [])
      setCalendarResults(data.calendarResults ?? [])
      setSearched(true)
    } catch {
      setError('騾壻ｿ｡繧ｨ繝ｩ繝ｼ縺檎匱逕溘＠縺ｾ縺励◆')
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
      setError('繧ｫ繝ｬ繝ｳ繝繝ｼ逋ｻ骭ｲ縺ｫ螟ｱ謨励＠縺ｾ縺励◆')
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
          <div className="text-5xl mb-3">辞</div>
          <h1 className="text-3xl font-bold mb-2">Ticket Scout</h1>
          <p className="text-gray-400 text-sm">縺頑ｰ励↓蜈･繧翫い繝ｼ繝・ぅ繧ｹ繝医・蜈ｬ貍斐ｒ荳諡ｬ讀懃ｴ｢ 竊・逋ｺ螢ｲ譌･繧竪oogle Calendar縺ｫ閾ｪ蜍慕匳骭ｲ</p>
        </div>

        {/* Search */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 mb-6">
          {/* Artist input */}
          <label className="block text-sm font-medium text-gray-300 mb-2">繧｢繝ｼ繝・ぅ繧ｹ繝亥錐</label>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={artist}
              onChange={e => setArtist(e.target.value)}
              placeholder="萓・ 邀ｳ豢･邇・ｸｫ縲〆OASOBI縲゜ing Gnu..."
              className="flex-1 bg-gray-900 border border-gray-600 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
              onKeyDown={e => e.key === 'Enter' && !loading && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={loading || !artist.trim() || selectedSites.length === 0}
              className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-5 py-3 rounded-xl flex items-center gap-2 transition-colors"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {loading ? '讀懃ｴ｢荳ｭ...' : '讀懃ｴ｢'}
            </button>
          </div>

          {/* Site selection */}
          <label className="block text-sm font-medium text-gray-300 mb-2">讀懃ｴ｢繧ｵ繧､繝・/label>
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
              <p className="text-sm font-medium">Google Calendar騾｣謳ｺ</p>
              <p className="text-xs text-gray-500">
                {oauthToken ? '騾｣謳ｺ貂医∩縲ら匱螢ｲ譌･縺瑚・蜍慕匳骭ｲ縺輔ｌ縺ｾ縺・笨・ : '騾｣謳ｺ縺吶ｋ縺ｨ繝√こ繝・ヨ逋ｺ螢ｲ譌･繧定・蜍慕匳骭ｲ'}
              </p>
            </div>
          </div>
          {!oauthToken && (
            <button
              onClick={handleGoogleAuth}
              className="bg-white text-gray-900 text-sm font-medium px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              Google縺ｧ騾｣謳ｺ
            </button>
          )}
          {oauthToken && (
            <span className="text-green-400 text-sm font-medium flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> 騾｣謳ｺ貂医∩
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
            <p className="text-gray-400 text-sm">蜷・し繧､繝医ｒ讀懃ｴ｢荳ｭ...</p>
            <p className="text-gray-600 text-xs mt-1">隍・焚繧ｵ繧､繝医ｒ荳ｦ蛻励〒讀懃ｴ｢縺励※縺・∪縺・/p>
          </div>
        )}

        {/* Results */}
        {searched && !loading && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">
                縲鶏artist}縲阪・蜈ｬ貍・<span className="text-white font-bold">{events.length}莉ｶ</span> 縺瑚ｦ九▽縺九ｊ縺ｾ縺励◆
              </p>
              {events.length > 0 && !oauthToken && (
                <button
                  onClick={handleGoogleAuth}
                  className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Calendar className="w-3 h-3" />
                  繧ｫ繝ｬ繝ｳ繝繝ｼ縺ｫ霑ｽ蜉
                </button>
              )}
              {events.length > 0 && oauthToken && calendarAdded === 0 && (
                <button
                  onClick={handleAddAllToCalendar}
                  disabled={addingCalendar}
                  className="text-xs bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  {addingCalendar ? <Loader2 className="w-3 h-3 animate-spin" /> : <Calendar className="w-3 h-3" />}
                  蜈ｨ莉ｶ繧ｫ繝ｬ繝ｳ繝繝ｼ縺ｫ霑ｽ蜉
                </button>
              )}
            </div>

            {/* Calendar added notice */}
            {calendarAdded > 0 && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl px-5 py-3 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {calendarAdded}莉ｶ縺ｮ逋ｺ螢ｲ譌･繧竪oogle Calendar縺ｫ逋ｻ骭ｲ縺励∪縺励◆
              </div>
            )}

            {/* Event cards */}
            {events.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Music className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">蜈ｬ貍疲ュ蝣ｱ縺瑚ｦ九▽縺九ｊ縺ｾ縺帙ｓ縺ｧ縺励◆</p>
                <p className="text-xs mt-1">繧｢繝ｼ繝・ぅ繧ｹ繝亥錐繧・､懃ｴ｢繧ｵ繧､繝医ｒ螟峨∴縺ｦ縺願ｩｦ縺励￥縺縺輔＞</p>
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
                        <p className="text-xs text-gray-500 mb-1">蜈ｬ貍疲律</p>
                        <p className="text-sm font-medium">{event.eventDate || '譛ｪ螳・}</p>
                      </div>
                      <div className="bg-gray-900/50 rounded-xl p-3">
                        <p className="text-xs text-gray-500 mb-1">辞 逋ｺ螢ｲ譌･</p>
                        <p className="text-sm font-medium text-violet-400">
                          {event.saleDate || '譛ｪ螳・}
                          {event.saleStartTime && event.saleDate ? ` ${event.saleStartTime}~` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      {calResult?.success ? (
                        <span className="text-xs text-green-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> 繧ｫ繝ｬ繝ｳ繝繝ｼ逋ｻ骭ｲ貂医∩
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
                        隧ｳ邏ｰ繧定ｦ九ｋ <ExternalLink className="w-3 h-3" />
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


