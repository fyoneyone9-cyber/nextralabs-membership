'use client'
import { useEffect, useState, useCallback } from 'react'
import { RefreshCw, ExternalLink, Globe, Server, CheckCircle, XCircle, AlertCircle, Clock, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SiteStatus {
  id: string
  name: string
  url: string
  alive: boolean
  httpStatus: number
  responseMs: number | null
  indexCount: number | null
  vercel: { state: string; createdAt: string } | null
  checkedAt: string
}

function StatusBadge({ alive, responseMs }: { alive: boolean; responseMs: number | null }) {
  if (!alive) return (
    <span className="flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/30 px-2.5 py-1 rounded-full">
      <XCircle size={12} /> OFFLINE
    </span>
  )
  if (responseMs && responseMs > 2000) return (
    <span className="flex items-center gap-1.5 text-xs font-bold text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 px-2.5 py-1 rounded-full">
      <AlertCircle size={12} /> SLOW {responseMs}ms
    </span>
  )
  return (
    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
      <CheckCircle size={12} /> ONLINE {responseMs ? `${responseMs}ms` : ''}
    </span>
  )
}

function VercelBadge({ vercel }: { vercel: SiteStatus['vercel'] }) {
  if (!vercel) return <span className="text-xs text-slate-600">Vercel情報なし</span>
  const isReady = vercel.state === 'READY'
  const date = new Date(vercel.createdAt).toLocaleString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  return (
    <div className="flex items-center gap-2">
      <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${isReady ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30' : 'text-red-400 bg-red-500/10 border border-red-500/30'}`}>
        {isReady ? <CheckCircle size={10} /> : <XCircle size={10} />}
        {vercel.state}
      </span>
      <span className="text-[10px] text-slate-500">{date}</span>
    </div>
  )
}

function SiteCard({ site }: { site: SiteStatus }) {
  return (
    <div className="bg-[#0d1117] border border-white/5 hover:border-emerald-500/20 rounded-2xl p-5 transition-all space-y-3">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe size={14} className="text-emerald-400 shrink-0" />
          <span className="text-sm font-bold text-white">{site.name}</span>
          <a href={site.url} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-emerald-400 transition-colors">
            <ExternalLink size={12} />
          </a>
        </div>
        <StatusBadge alive={site.alive} responseMs={site.responseMs} />
      </div>

      {/* 詳細 */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {/* HTTPステータス */}
        <div className="bg-white/5 rounded-xl px-3 py-2">
          <p className="text-slate-500 mb-0.5">HTTPステータス</p>
          <p className={`font-bold ${site.httpStatus === 200 ? 'text-emerald-400' : site.httpStatus === 0 ? 'text-red-400' : 'text-yellow-400'}`}>
            {site.httpStatus === 0 ? 'タイムアウト' : site.httpStatus}
          </p>
        </div>

        {/* レスポンスタイム */}
        <div className="bg-white/5 rounded-xl px-3 py-2">
          <p className="text-slate-500 mb-0.5 flex items-center gap-1"><Zap size={9} />レスポンス</p>
          <p className={`font-bold ${!site.responseMs ? 'text-slate-600' : site.responseMs < 1000 ? 'text-emerald-400' : site.responseMs < 2000 ? 'text-yellow-400' : 'text-red-400'}`}>
            {site.responseMs ? `${site.responseMs}ms` : '—'}
          </p>
        </div>

        {/* Googleインデックス */}
        <div className="bg-white/5 rounded-xl px-3 py-2">
          <p className="text-slate-500 mb-0.5 flex items-center gap-1"><Globe size={9} />インデックス</p>
          <p className="font-bold text-slate-200">
            {site.indexCount === null ? <span className="text-slate-600">未取得</span> : `約${site.indexCount.toLocaleString()}件`}
          </p>
        </div>

        {/* Vercel */}
        <div className="bg-white/5 rounded-xl px-3 py-2">
          <p className="text-slate-500 mb-0.5 flex items-center gap-1"><Server size={9} />Vercel</p>
          <VercelBadge vercel={site.vercel} />
        </div>
      </div>

      {/* 最終チェック */}
      <p className="text-[10px] text-slate-600 flex items-center gap-1">
        <Clock size={9} />
        最終チェック: {new Date(site.checkedAt).toLocaleString('ja-JP')}
      </p>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-[#0d1117] border border-white/5 rounded-2xl p-5 space-y-3 animate-pulse">
      <div className="flex justify-between">
        <div className="h-4 bg-white/10 rounded w-32" />
        <div className="h-5 bg-white/10 rounded-full w-20" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-white/5 rounded-xl" />)}
      </div>
      <div className="h-3 bg-white/5 rounded w-40" />
    </div>
  )
}

export default function SitesMonitorPanel() {
  const [sites, setSites] = useState<SiteStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/sites-monitor')
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setSites(data.sites)
      setLastRefresh(new Date())
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    const interval = setInterval(load, 30000)
    return () => clearInterval(interval)
  }, [load])

  const allOnline = sites.length > 0 && sites.every(s => s.alive)
  const anyOffline = sites.some(s => !s.alive)

  return (
    <Card className="bg-[#13141f] border-2 border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl p-8">
      <CardHeader className="p-0 border-b border-white/5 mb-6 pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
            <Globe className="h-6 w-6 text-emerald-400" />
            3大サイト監視
            <span className={`text-xs font-normal px-2 py-0.5 rounded-full border ${
              anyOffline
                ? 'text-red-400 bg-red-500/10 border-red-500/20'
                : allOnline
                ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
                : 'text-slate-400 bg-white/5 border-white/10'
            }`}>
              {anyOffline ? '🔴 障害あり' : allOnline ? '🟢 全サイト正常' : '確認中...'}
            </span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-600">30秒ごと自動更新</span>
            <button
              onClick={load}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
        {lastRefresh && (
          <p className="text-[10px] text-slate-600 mt-2 flex items-center gap-1">
            <Clock size={9} /> 最終更新: {lastRefresh.toLocaleString('ja-JP')}
          </p>
        )}
      </CardHeader>

      <CardContent className="p-0 space-y-3">
        {error && (
          <div className="text-red-400 text-sm p-4 bg-red-500/10 rounded-xl border border-red-500/20">
            エラー: {error}
          </div>
        )}

        {loading && sites.length === 0 ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          sites.map(site => <SiteCard key={site.id} site={site} />)
        )}
      </CardContent>
    </Card>
  )
}
