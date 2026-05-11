'use client'
import React, { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Mail, Zap, Clock, ListChecks, Filter, Trash2,
  ChevronDown, ChevronUp, Copy, Send,
  RotateCw, Loader2, ShieldCheck, Archive
} from 'lucide-react'

const GOOGLE_CLIENT_ID = '239583936801-ev71grs66ehp0kn3kahr2bdrl0v9iidj.apps.googleusercontent.com'
const GOOGLE_SCOPES = 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.compose https://www.googleapis.com/auth/gmail.send'

const quadrantConfig = [
  { id: 'urgent_important',     label: '今すぐ対応',  color: 'text-red-400',      border: 'border-red-500/30',      icon: Zap },
  { id: 'urgent_not_important', label: '早めに対応',  color: 'text-emerald-400',    border: 'border-emerald-500/30',    icon: Clock },
  { id: 'not_urgent_important', label: '計画対応',    color: 'text-emerald-400',  border: 'border-emerald-500/30',  icon: ListChecks },
  { id: 'not_urgent_not_important', label: '整理対象', color: 'text-slate-500',  border: 'border-slate-700',       icon: Filter },
  { id: 'pending',              label: '未分類',      color: 'text-slate-600',    border: 'border-slate-800',       icon: Mail },
]

function getQuadrant(id: string) {
  return quadrantConfig.find(q => q.id === id) || quadrantConfig[quadrantConfig.length - 1]
}

const MasterEngine = () => {
  const [googleToken, setGoogleToken] = useState<string | null>(null)
  const [emails, setEmails] = useState<any[]>([])
  const [sentMessages, setSentMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({})
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({})
  const [isDrafting, setIsDrafting] = useState<Record<string, boolean>>({})
  const [isActing, setIsActing] = useState<Record<string, boolean>>({})
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const hashStr = window.location.hash.slice(1)
      if (!hashStr) {
        const saved = localStorage.getItem('nextra_google_token')
        if (saved) {
          setGoogleToken(saved)
          fetchEmails(saved)
        }
        return
      }

      const params = new URLSearchParams(hashStr)
      const token = params.get('access_token')
      const state = params.get('state')

      if (token) {
        setGoogleToken(token)
        localStorage.setItem('nextra_google_token', token)
        // URLからハッシュを消す
        window.history.replaceState(null, '', window.location.pathname)

        // stateにリダイレクト先が指定されている場合（営業メール等からの認証）はそちらに戻る
        if (state && state.startsWith('redirect:')) {
          try {
            const returnPath = decodeURIComponent(state.replace('redirect:', ''))
            if (returnPath.startsWith('/')) {
              window.location.href = returnPath
              return
            }
          } catch (e) {
            console.error('Redirect failed:', e)
          }
        }
        fetchEmails(token)
      }
    } catch (err) {
      console.error('Hash parsing error:', err)
    }
  }, [])

  const fetchEmails = async (token: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/tools/gmail-fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: token }),
      })
      if (res.status === 401) {
        localStorage.removeItem('nextra_google_token')
        setGoogleToken(null)
        return
      }
      const data = await res.json()
      if (data.error) {
        localStorage.removeItem('nextra_google_token')
        setGoogleToken(null)
        return
      }
      if (data.messages) setEmails(data.messages)
      if (data.sentMessages) setSentMessages(data.sentMessages)
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  // 返信生成（RAGコンテキスト付き）＋ quadrant分類
  const generateAiReply = async (email: any) => {
    setIsGenerating(prev => ({ ...prev, [email.id]: true }))
    try {
      const res = await fetch('/api/tools/gmail-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: email.subject,
          from: email.from,
          body: email.body,
          sentMessages, // ← RAGコンテキスト（送信済みメール）
        }),
      })
      const data = await res.json()
      if (data.error) { showToast('生成失敗: ' + data.error); return }
      setReplyTexts(prev => ({ ...prev, [email.id]: data.reply }))
      // quadrant を更新
      if (data.quadrant) {
        setEmails(prev => prev.map(e => e.id === email.id ? { ...e, quadrant: data.quadrant } : e))
      }
    } catch (e) { console.error(e) } finally { setIsGenerating(prev => ({ ...prev, [email.id]: false })) }
  }

  const saveDraft = async (email: any) => {
    const text = replyTexts[email.id]
    if (!text) return
    setIsDrafting(prev => ({ ...prev, [email.id]: true }))
    try {
      const res = await fetch('/api/tools/gmail-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: googleToken, threadId: email.threadId || email.id, replyBody: text }),
      })
      const data = await res.json()
      if (data.success) showToast('✅ 下書きに保存しました')
      else showToast('❌ 下書き保存失敗: ' + (data.error || 'Unknown'))
    } catch (e) { console.error(e) } finally { setIsDrafting(prev => ({ ...prev, [email.id]: false })) }
  }

  const doAction = async (email: any, action: 'trash' | 'archive') => {
    setIsActing(prev => ({ ...prev, [email.id]: true }))
    try {
      const res = await fetch('/api/tools/gmail-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: googleToken, messageId: email.id, action }),
      })
      const data = await res.json()
      if (data.success) {
        setEmails(prev => prev.filter(e => e.id !== email.id))
        showToast(action === 'trash' ? '🗑️ ゴミ箱に移動しました' : '📁 アーカイブしました')
      } else {
        showToast('❌ 操作失敗: ' + (data.error || 'Unknown'))
      }
    } catch (e) { console.error(e) } finally { setIsActing(prev => ({ ...prev, [email.id]: false })) }
  }

  const login = () => {
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: window.location.origin + window.location.pathname,
      response_type: 'token',
      scope: GOOGLE_SCOPES,
      prompt: 'consent',
    })
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[999] bg-[#13141f] border border-emerald-500/50 text-emerald-400 font-bold text-sm px-6 py-3 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
          {toast}
        </div>
      )}

      {!googleToken ? (
        <Card className="bg-[#13141f] border-2 border-emerald-500/20 rounded-[2rem] p-12 text-center shadow-2xl">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Mail className="h-10 w-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-semibold text-white tracking-tight mb-4">Connect Gmail</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-2">AIが未読メールを瞬時に整理・解析します</p>
          <p className="text-slate-500 text-xs mb-10">🧠 あなたの文体を学習してパーソナライズ返信</p>
          <button onClick={login} className="h-12 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-base rounded-lg shadow-lg transition-all"
            style={{ boxShadow: '0 0 12px rgba(16,185,129,0.3)' }}>
            連携を開始する →
          </button>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* ヘッダー：更新ボタン ＋ 4象限カウンター */}
          <div className="sticky top-0 z-[50] pt-4 pb-2 bg-[#050507]/80 backdrop-blur-md space-y-2">
            <Button onClick={() => fetchEmails(googleToken)} disabled={loading} className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-base rounded-lg transition-all active:scale-95"
              style={{ boxShadow: '0 0 12px rgba(16,185,129,0.3)' }}>
              {loading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <RotateCw className="h-5 w-5 mr-2" />}
              最新メールを解析
            </Button>
            <div className="grid grid-cols-4 gap-2">
              {quadrantConfig.filter(q => q.id !== 'pending').map(q => (
                <div key={q.id} className={`bg-black/60 backdrop-blur-md border ${q.border} p-2 rounded-xl text-center`}>
                  <q.icon className={`h-4 w-4 mx-auto mb-1 ${q.color}`} />
                  <div className="text-[10px] font-bold text-white ">{emails.filter(e => e.quadrant === q.id).length}</div>
                  <div className={`text-[8px] font-bold ${q.color}`}>{q.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* メールリスト */}
          <div className="space-y-3">
            {emails.length === 0 && !loading ? (
              <div className="py-20 text-center opacity-20 font-bold uppercase text-xl">Inbox Zero Achieved</div>
            ) : (
              emails.map((email) => {
                const q = getQuadrant(email.quadrant)
                return (
                  <Card key={email.id} className={`bg-[#13141f] border-2 ${q.border} rounded-2xl overflow-hidden shadow-xl transition-all hover:border-emerald-500/30`}>
                    <CardContent className="p-4 space-y-4">
                      {/* メールヘッダー */}
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className={`text-[8px] font-bold ${q.color} border-current/30 uppercase tracking-tighter`}>
                              {q.label}
                            </Badge>
                            <span className="text-[9px] font-bold text-slate-500 truncate ">{email.from}</span>
                          </div>
                          <h4 className="text-base font-bold text-white leading-tight ">{email.subject}</h4>
                          <p className="text-[11px] text-slate-500 truncate">{email.snippet}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setExpandedId(expandedId === email.id ? null : email.id)} className="h-8 w-8 p-0 text-slate-500 flex-shrink-0">
                          {expandedId === email.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </Button>
                      </div>

                      {/* 本文展開 */}
                      {expandedId === email.id && (
                        <div className="animate-in slide-in-from-top-2 duration-300">
                          <div className="bg-black/40 rounded-xl p-4 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap border border-white/5 mb-2 max-h-60 overflow-y-auto">
                            {email.body || email.snippet}
                          </div>
                        </div>
                      )}

                      {/* アクションボタン */}
                      <div className="space-y-3">
                        {!replyTexts[email.id] ? (
                          <div className="flex gap-2">
                            <Button
                              onClick={() => generateAiReply(email)}
                              disabled={isGenerating[email.id]}
                              className="flex-1 h-12 bg-white/5 hover:bg-white/10 text-emerald-400 border border-emerald-500/30 font-bold text-xs rounded-xl transition-all uppercase "
                            >
                              {isGenerating[email.id] ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Zap size={14} className="mr-2" />}
                              {isGenerating[email.id] ? '文体学習中...' : 'AI返信案を生成'}
                            </Button>
                            <Button
                              onClick={() => doAction(email, 'archive')}
                              disabled={isActing[email.id]}
                              className="h-12 w-12 bg-white/5 hover:bg-slate-500/20 text-slate-400 border border-slate-500/20 rounded-xl"
                              title="アーカイブ"
                            >
                              {isActing[email.id] ? <Loader2 className="animate-spin h-4 w-4" /> : <Archive size={14} />}
                            </Button>
                            <Button
                              onClick={() => doAction(email, 'trash')}
                              disabled={isActing[email.id]}
                              className="h-12 w-12 bg-white/5 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl"
                              title="ゴミ箱"
                            >
                              {isActing[email.id] ? <Loader2 className="animate-spin h-4 w-4" /> : <Trash2 size={14} />}
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-3 animate-in fade-in duration-500">
                            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                              <p className="text-xs text-emerald-400 font-bold mb-2 uppercase flex items-center gap-2">
                                <ShieldCheck size={12} /> AI Draft — 文体学習済み
                              </p>
                              <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">{replyTexts[email.id]}</p>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <Button
                                onClick={() => { navigator.clipboard.writeText(replyTexts[email.id]); showToast('📋 コピーしました') }}
                                className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-[10px] rounded-lg h-10"
                              >
                                <Copy size={12} className="mr-1" /> COPY
                              </Button>
                              <Button
                                onClick={() => saveDraft(email)}
                                disabled={isDrafting[email.id]}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] rounded-lg h-10"
                              >
                                {isDrafting[email.id] ? <Loader2 className="animate-spin h-3 w-3" /> : <Send size={12} className="mr-1" />} DRAFT
                              </Button>
                              <Button
                                onClick={() => doAction(email, 'trash')}
                                disabled={isActing[email.id]}
                                className="bg-red-900/40 hover:bg-red-800/60 text-red-400 font-bold text-[10px] rounded-lg h-10"
                              >
                                {isActing[email.id] ? <Loader2 className="animate-spin h-3 w-3" /> : <Trash2 size={12} className="mr-1" />} TRASH
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>

          <Button onClick={() => { localStorage.removeItem('nextra_google_token'); setGoogleToken(null); setEmails([]); }} variant="ghost" className="w-full text-slate-600 hover:text-red-400 text-[10px] font-bold uppercase py-8">
            <Trash2 size={12} className="mr-2" /> Terminate Session
          </Button>
        </div>
      )}
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(MasterEngine), { ssr: false })

export default function InboxOrganizer() {
  const router = useRouter()

  // ブラウザバック・マウスサイドボタン対応
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const handlePopState = () => {
      const ok = window.confirm('ツールを終了しますか？')
      if (ok) {
        router.push('/dashboard')
      } else {
        window.history.pushState(null, '', window.location.href)
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [router])

  // タブ閉じ・URL直打ち対応
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  const handleBack = useCallback(() => {
    const ok = window.confirm('ツールを終了しますか？')
    if (ok) router.push('/dashboard')
  }, [router])

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 font-sans p-4 pb-20 selection:bg-emerald-500/30">
      <div className="text-center mb-6">
        <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 font-medium px-4 py-0.5 text-xs rounded-full mb-3">
          Nextra Intelligence MASTER
        </Badge>
        <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight leading-[1.15]">
          Gmail <span className="text-emerald-400">AI Accelerator</span>
        </h1>
        <p className="text-slate-500 text-sm mt-2 leading-relaxed">🧠 送信履歴から文体を学習してパーソナライズ返信</p>
      </div>
      <NoSSRWrapper />
    </div>
  )
}
