'use client'
import React, { useState, useEffect } from 'react'
import { 
  Rocket, Activity, CheckCircle2, AlertCircle, 
  Clock, ExternalLink, RefreshCw, Github, GitCommit
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

interface Deployment {
  uid: string
  url: string
  state: string
  created: number
  creator: { username: string; email: string }
  meta: {
    githubCommitMessage?: string
    githubCommitSha?: string
    githubCommitRef?: string
  }
  inspectorUrl: string
}

export default function VercelDeploymentsPage() {
  const [deployments, setDeployments] = useState<Deployment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchDeployments = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/deployments', {
        headers: { 'x-admin-key': 'nextra-admin-2026' }
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setDeployments(data.deployments || [])
      }
    } catch (e) {
      setError('データの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDeployments()
    const timer = setInterval(fetchDeployments, 30000) // 30秒ごとに自動更新
    return () => clearInterval(timer)
  }, [])

  const getStatusColor = (state: string) => {
    switch (state) {
      case 'READY': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
      case 'BUILDING': return 'text-blue-400 bg-blue-500/10 border-blue-500/30'
      case 'ERROR': return 'text-red-400 bg-red-500/10 border-red-500/30'
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/30'
    }
  }

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'たった今'
    if (mins < 60) return `${mins}分前`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}時間前`
    return new Date(ts).toLocaleDateString('ja-JP')
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-0.5 rounded-full text-[10px] font-bold">SYSTEM OPS</Badge>
              <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Vercel Fleet Monitor</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <Rocket className="text-emerald-500" />
              デプロイ状況
            </h1>
          </div>
          <button 
            onClick={fetchDeployments}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-semibold hover:bg-white/10 transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            手動更新
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: '最新ステータス', val: deployments[0]?.state || 'N/A', icon: Activity, color: 'text-emerald-400' },
            { label: 'プロジェクト', val: 'membership-site', icon: Github, color: 'text-slate-400' },
            { label: 'ブランチ', val: deployments[0]?.meta?.githubCommitRef || 'main', icon: GitCommit, color: 'text-blue-400' },
            { label: '更新頻度', val: '30s Auto', icon: Clock, color: 'text-slate-500' },
          ].map((s, i) => (
            <Card key={i} className="bg-[#0d1117] border-white/5">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`p-2 rounded-lg bg-white/5 ${s.color}`}><s.icon size={18} /></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">{s.label}</p>
                  <p className="text-sm font-bold text-white">{s.val}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-3">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* List */}
        <div className="space-y-3">
          {loading && deployments.length === 0 ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse border border-white/5" />
            ))
          ) : (
            deployments.map((d) => (
              <div 
                key={d.uid} 
                className="group bg-[#0d1117] border border-white/5 hover:border-emerald-500/30 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all shadow-sm"
              >
                <div className="flex items-start gap-5 min-w-0">
                  <div className={`mt-1 h-10 w-10 rounded-xl flex items-center justify-center border shrink-0 ${getStatusColor(d.state)}`}>
                    {d.state === 'READY' ? <CheckCircle2 size={20} /> : <Clock size={20} className="animate-pulse" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="text-sm font-bold text-white truncate max-w-[400px]">
                        {d.meta?.githubCommitMessage?.split('\n')[0] || 'No commit message'}
                      </p>
                      <Badge className={`px-2 py-0 text-[9px] font-black tracking-tight ${getStatusColor(d.state)}`}>
                        {d.state}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock size={12} /> {formatTime(d.created)}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <GitCommit size={12} /> {d.meta?.githubCommitSha?.substring(0, 7)}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        by {d.creator.username}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a 
                    href={`https://${d.url}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 h-10 px-4 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:border-emerald-500/50 transition-all"
                  >
                    <ExternalLink size={14} /> プレビュー
                  </a>
                  <a 
                    href={d.inspectorUrl}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 h-10 px-4 bg-emerald-500 text-slate-950 rounded-xl text-xs font-bold hover:bg-emerald-400 transition-all"
                  >
                    ログ
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="text-center pt-8 opacity-20">
          <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">© 2026 NextraLabs Operations</p>
        </div>
      </div>
    </div>
  )
}
