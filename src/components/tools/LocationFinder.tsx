'use client'


import { useState } from 'react'
import { Loader2, MapPin, Search, AlertTriangle, ExternalLink } from 'lucide-react'

interface AnalysisResult {
  videoId: string
  thumbnailUrls: string[]
  analysis: string
  locationQuery: string
  confidence: string
  reason: string
  geocode: { lat: number; lng: number; formatted: string } | null
  place: { name: string; address: string; placeId: string } | null
}

export function LocationFinder() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!url.trim()) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/location-finder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtubeUrl: url }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? '繧ｨ繝ｩ繝ｼ縺檎匱逕溘＠縺ｾ縺励◆')
        return
      }
      setResult(data)
    } catch {
      setError('騾壻ｿ｡繧ｨ繝ｩ繝ｼ縺檎匱逕溘＠縺ｾ縺励◆')
    } finally {
      setLoading(false)
    }
  }

  const confidenceColor = (c: string) => {
    if (c === '鬮・) return 'text-green-400 bg-green-400/10'
    if (c === '荳ｭ') return 'text-yellow-400 bg-yellow-400/10'
    return 'text-red-400 bg-red-400/10'
  }

  const mapsUrl = result?.geocode
    ? `https://www.google.com/maps?q=${result.geocode.lat},${result.geocode.lng}`
    : result?.locationQuery
    ? `https://www.google.com/maps/search/${encodeURIComponent(result.locationQuery)}`
    : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white p-4">
      <div className="max-w-2xl mx-auto py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">桃</div>
          <h1 className="text-3xl font-bold mb-2">AI Location Scout</h1>
          <p className="text-gray-400 text-sm">YouTube蜍慕判縺ｮ繧ｵ繝繝阪う繝ｫ繧歎ision AI縺ｧ隗｣譫舌＠縲∵聴蠖ｱ蝣ｴ謇繧竪oogle Maps縺ｧ迚ｹ螳壹＠縺ｾ縺・/p>
          <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-yellow-400 bg-yellow-400/10 px-3 py-1.5 rounded-full">
            <AlertTriangle className="w-3 h-3" />
            1譌･1蝗槭∪縺ｧ蛻ｩ逕ｨ蜿ｯ閭ｽ
          </div>
        </div>

        {/* Input */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">YouTube URL</label>
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1 bg-gray-900 border border-gray-600 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
              onKeyDown={e => e.key === 'Enter' && !loading && handleAnalyze()}
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !url.trim()}
              className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-5 py-3 rounded-xl flex items-center gap-2 transition-colors"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {loading ? '隗｣譫蝉ｸｭ...' : '隗｣譫・}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">窶ｻ 蜈ｬ髢句虚逕ｻ縺ｮ縺ｿ蟇ｾ蠢懊ゅし繝繝阪う繝ｫ3譫壹ｒAI縺ｧ隗｣譫舌＠縺ｾ縺吶・/p>
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
            <p className="text-gray-400 text-sm">繧ｵ繝繝阪う繝ｫ繧貞叙蠕励＠縺ｦAI縺瑚ｧ｣譫蝉ｸｭ...</p>
            <p className="text-gray-600 text-xs mt-1">30遘偵・蛻・°縺九ｋ蝣ｴ蜷医′縺ゅｊ縺ｾ縺・/p>
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <div className="space-y-4">
            {/* Thumbnails */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-5">
              <h2 className="text-sm font-medium text-gray-300 mb-3">隗｣譫舌＠縺溘し繝繝阪う繝ｫ</h2>
              <div className="grid grid-cols-3 gap-2">
                {result.thumbnailUrls.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`繧ｵ繝繝阪う繝ｫ${i + 1}`}
                    className="w-full aspect-video object-cover rounded-lg border border-gray-700"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                ))}
              </div>
            </div>

            {/* Location Result */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-violet-400" />
                  迚ｹ螳壹＆繧後◆蝣ｴ謇
                </h2>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${confidenceColor(result.confidence)}`}>
                  菫｡鬆ｼ蠎ｦ: {result.confidence}
                </span>
              </div>

              {result.place ? (
                <div className="space-y-2">
                  <p className="text-xl font-bold text-white">{result.place.name}</p>
                  <p className="text-sm text-gray-400">{result.place.address}</p>
                </div>
              ) : result.geocode ? (
                <div className="space-y-2">
                  <p className="text-lg font-bold text-white">{result.locationQuery}</p>
                  <p className="text-sm text-gray-400">{result.geocode.formatted}</p>
                </div>
              ) : (
                <div>
                  <p className="text-base font-medium text-white">{result.locationQuery || '蝣ｴ謇繧堤音螳壹〒縺阪∪縺帙ｓ縺ｧ縺励◆'}</p>
                </div>
              )}

              {result.reason && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-xs text-gray-500 mb-1">迚ｹ螳壽ｹ諡</p>
                  <p className="text-sm text-gray-300">{result.reason}</p>
                </div>
              )}
            </div>

            {/* Map Link */}
            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3.5 rounded-xl transition-colors"
              >
                <MapPin className="w-4 h-4" />
                Google Maps縺ｧ髢九￥
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {/* Embed Map */}
            {result.geocode && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${result.geocode.lat},${result.geocode.lng}&zoom=16`}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}

            {/* Disclaimer */}
            <div className="text-xs text-gray-600 text-center leading-relaxed">
              窶ｻ 隗｣譫千ｵ先棡縺ｯAI縺ｫ繧医ｋ謗ｨ螳壹〒縺吶ょｿ・★縺励ｂ豁｣遒ｺ縺ｧ縺ｯ縺ゅｊ縺ｾ縺帙ｓ縲・br />
              縺薙・繝・・繝ｫ繧剃ｻ冶・・繝励Λ繧､繝舌す繝ｼ萓ｵ螳ｳ繝ｻ繧ｹ繝医・繧ｭ繝ｳ繧ｰ逶ｮ逧・〒菴ｿ逕ｨ縺吶ｋ縺薙→縺ｯ遖∵ｭ｢縺輔ｌ縺ｦ縺・∪縺吶・            </div>
          </div>
        )}
      </div>
    
      </div>
  )
}


