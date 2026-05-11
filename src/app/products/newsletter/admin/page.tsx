'use client'
import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import {
  Mail, Users, Send, FileText, Trash2, Plus, RefreshCw,
  CheckCircle2, AlertCircle, ArrowLeft, Save, Eye, ChevronRight, Tag, X
} from 'lucide-react'

const ADMIN_EMAIL = 'f.yoneyone9@gmail.com'

// ─── 型 ───
interface Subscriber { id: string; email: string; name: string | null; tags: string[]; status: string; subscribed_at: string }
interface Template    { id: string; title: string; subject: string; body: string; updated_at: string }
interface Campaign    { id: string; subject: string; sent_count: number; failed_count: number; status: string; sent_at: string; tag_filter: string | null }

// ─── タブ定義 ───
const TABS = [
  { id: 'compose',     label: '✉️ メール作成・配信', icon: Send },
  { id: 'subscribers', label: '👥 読者一覧',         icon: Users },
  { id: 'templates',   label: '📄 テンプレート',      icon: FileText },
  { id: 'history',     label: '📊 送信履歴',          icon: Mail },
]

// ─── ユーティリティ ───
function adminHeaders(email: string) {
  return { 'Content-Type': 'application/json', 'x-admin-email': email }
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    sent: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    failed: 'bg-red-500/20 text-red-400 border-red-500/30',
    partial: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    unsubscribed: 'bg-slate-700/50 text-slate-500 border-white/10',
  }
  const label: Record<string, string> = { sent: '送信完了', failed: '失敗', partial: '一部失敗', active: '有効', unsubscribed: '停止中' }
  return (
    <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${map[status] ?? map['active']}`}>
      {label[status] ?? status}
    </span>
  )
}

// ─── コンポーズタブ ───
function ComposeTab({ adminEmail, templates, onSent }: { adminEmail: string; templates: Template[]; onSent: () => void }) {
  const [subject, setSubject]     = useState('')
  const [body, setBody]           = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [preview, setPreview]     = useState(false)
  const [sending, setSending]     = useState(false)
  const [result, setResult]       = useState<{ ok: boolean; message: string } | null>(null)
  const [saveTitle, setSaveTitle] = useState('')
  const [savingTpl, setSavingTpl] = useState(false)

  const loadTemplate = (tpl: Template) => {
    setSubject(tpl.subject)
    setBody(tpl.body)
    setResult(null)
  }

  const handleSend = async () => {
    if (!subject || !body) { setResult({ ok: false, message: '件名と本文を入力してください' }); return }
    if (!confirm(`配信します。よろしいですか？\n\n件名: ${subject}\nタグ絞り込み: ${tagFilter || '全員'}`)) return
    setSending(true)
    setResult(null)
    try {
      const res  = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: adminHeaders(adminEmail),
        body: JSON.stringify({ subject, body, tagFilter: tagFilter || null }),
      })
      const data = await res.json()
      setResult({ ok: data.ok, message: data.message })
      if (data.ok) { setSubject(''); setBody(''); setTagFilter(''); onSent() }
    } catch {
      setResult({ ok: false, message: '通信エラーが発生しました' })
    } finally {
      setSending(false)
    }
  }

  const handleSaveTpl = async () => {
    if (!saveTitle || !subject || !body) return
    setSavingTpl(true)
    await fetch('/api/newsletter/templates', {
      method: 'POST',
      headers: adminHeaders(adminEmail),
      body: JSON.stringify({ title: saveTitle, subject, body }),
    })
    setSavingTpl(false)
    setSaveTitle('')
    alert('テンプレートを保存しました')
  }

  return (
    <div className="space-y-5 max-w-2xl">
      {/* テンプレート選択 */}
      {templates.length > 0 && (
        <div className="bg-[#0d1117] border border-white/5 rounded-2xl p-4 space-y-2">
          <p className="text-xs font-semibold text-slate-400 flex items-center gap-2">
            <FileText size={13} className="text-emerald-400" /> テンプレートから読み込む
          </p>
          <div className="flex flex-wrap gap-2">
            {templates.map(t => (
              <button
                key={t.id}
                onClick={() => loadTemplate(t)}
                className="text-[11px] font-medium px-3 py-1.5 rounded-lg border border-white/10 text-slate-400 hover:border-emerald-500/40 hover:text-emerald-400 transition-all"
              >
                {t.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-[#0d1117] border border-white/5 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200 border-b border-white/5 pb-4">
          <Send size={14} className="text-emerald-400" /> メール作成
        </div>

        {/* 件名 */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">件名</label>
          <input
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="例：【NextraLabs】新ツール「○○」リリースのお知らせ"
            className="w-full h-11 rounded-lg px-4 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors"
            style={{ background: '#13141f', border: '1px solid #334155' }}
            onFocus={e => (e.target.style.borderColor = '#10b981')}
            onBlur={e => (e.target.style.borderColor = '#334155')}
          />
        </div>

        {/* タグ絞り込み */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
            <Tag size={11} /> タグ絞り込み（空欄 = 全読者に配信）
          </label>
          <input
            value={tagFilter}
            onChange={e => setTagFilter(e.target.value)}
            placeholder="例：premium / free / member（空白で全員）"
            className="w-full h-10 rounded-lg px-4 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors"
            style={{ background: '#13141f', border: '1px solid #334155' }}
            onFocus={e => (e.target.style.borderColor = '#10b981')}
            onBlur={e => (e.target.style.borderColor = '#334155')}
          />
        </div>

        {/* 本文 */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">本文</label>
            <button
              onClick={() => setPreview(!preview)}
              className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-emerald-400 transition-colors"
            >
              <Eye size={11} /> {preview ? '編集に戻る' : 'プレビュー'}
            </button>
          </div>
          {preview ? (
            <div className="w-full min-h-[240px] rounded-lg p-4 text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed"
              style={{ background: '#13141f', border: '1px solid #334155' }}>
              {body || '（本文が空です）'}
            </div>
          ) : (
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder={`例：
こんにちは、{{name}}さん！

NextraLabsから新しいツールのお知らせです。

（本文をここに書きます）

引き続きよろしくお願いします。
NextraLabs 米山文貴`}
              rows={12}
              className="w-full rounded-lg px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors resize-y font-mono leading-relaxed"
              style={{ background: '#13141f', border: '1px solid #334155' }}
              onFocus={e => (e.target.style.borderColor = '#10b981')}
              onBlur={e => (e.target.style.borderColor = '#334155')}
            />
          )}
          <p className="text-[10px] text-slate-600">💡 <code className="text-slate-500">{'{{name}}'}</code> は読者名に自動置換されます</p>
        </div>

        {/* テンプレ保存 */}
        <div className="flex items-center gap-2 pt-1 border-t border-white/5">
          <input
            value={saveTitle}
            onChange={e => setSaveTitle(e.target.value)}
            placeholder="テンプレート名（例：新ツール告知）"
            className="flex-1 h-9 rounded-lg px-3 text-xs text-slate-200 placeholder-slate-600 outline-none"
            style={{ background: '#13141f', border: '1px solid #334155' }}
            onFocus={e => (e.target.style.borderColor = '#10b981')}
            onBlur={e => (e.target.style.borderColor = '#334155')}
          />
          <button
            onClick={handleSaveTpl}
            disabled={!saveTitle || !subject || !body || savingTpl}
            className="h-9 px-4 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-white/10 text-slate-400 hover:border-emerald-500/30 hover:text-emerald-400 transition-all disabled:opacity-40"
          >
            <Save size={12} /> テンプレ保存
          </button>
        </div>

        {result && (
          <div className={`flex items-start gap-2 text-xs p-3 rounded-lg border ${result.ok ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
            {result.ok ? <CheckCircle2 size={14} className="shrink-0 mt-0.5" /> : <AlertCircle size={14} className="shrink-0 mt-0.5" />}
            {result.message}
          </div>
        )}

        <button
          onClick={handleSend}
          disabled={sending || !subject || !body}
          className="w-full h-12 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          style={{ background: '#10b981', color: '#fff' }}
        >
          {sending
            ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />送信中...</>
            : <><Send size={15} />配信する</>}
        </button>
      </div>
    </div>
  )
}

// ─── 読者一覧タブ ───
function SubscribersTab({ adminEmail }: { adminEmail: string }) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const res  = await fetch('/api/newsletter/subscribers?status=active', { headers: { 'x-admin-email': adminEmail } })
    const data = await res.json()
    if (data.ok) setSubscribers(data.data)
    setLoading(false)
  }, [adminEmail])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`「${email}」を削除しますか？`)) return
    setDeletingId(id)
    await fetch('/api/newsletter/subscribers', {
      method: 'DELETE',
      headers: adminHeaders(adminEmail),
      body: JSON.stringify({ id }),
    })
    setSubscribers(prev => prev.filter(s => s.id !== id))
    setDeletingId(null)
  }

  const filtered = subscribers.filter(s =>
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    (s.name || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="メアド・名前で検索"
              className="pl-8 pr-4 py-2 text-xs rounded-lg outline-none w-52 text-slate-300 placeholder-slate-600"
              style={{ background: '#13141f', border: '1px solid #334155' }}
            />
            <svg className="absolute left-2.5 top-2.5 text-slate-600" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </div>
          <span className="text-xs text-slate-600">計 {subscribers.length} 名</span>
        </div>
        <button onClick={load} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-400 transition-colors">
          <RefreshCw size={12} /> 更新
        </button>
      </div>

      <div className="bg-[#0d1117] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-600 text-xs">読み込み中...</div>
        ) : subscribers.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Users size={28} className="text-slate-700 mx-auto" />
            <p className="text-slate-600 text-xs">まだ読者が登録されていません</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] whitespace-nowrap">
              <thead className="border-b border-white/5 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">名前</th>
                  <th className="px-5 py-3">メールアドレス</th>
                  <th className="px-5 py-3">タグ</th>
                  <th className="px-5 py-3">登録日</th>
                  <th className="px-5 py-3 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-white/5 transition-all">
                    <td className="px-5 py-3 text-slate-200 font-medium">{s.name || <span className="text-slate-600">—</span>}</td>
                    <td className="px-5 py-3 text-slate-400 font-mono">{s.email}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {s.tags?.length ? s.tags.map(t => (
                          <span key={t} className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{t}</span>
                        )) : <span className="text-slate-700">—</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {new Date(s.subscribed_at).toLocaleDateString('ja-JP')}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() => handleDelete(s.id, s.email)}
                        disabled={deletingId === s.id}
                        className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-red-500/20 text-red-500/50 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400 transition-all disabled:opacity-30"
                      >
                        <Trash2 size={11} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-5 py-3 border-t border-white/5">
          <p className="text-[10px] text-slate-700">表示: {filtered.length} 件 / 全 {subscribers.length} 件</p>
        </div>
      </div>
    </div>
  )
}

// ─── テンプレートタブ ───
function TemplatesTab({ adminEmail, templates, onRefresh }: { adminEmail: string; templates: Template[]; onRefresh: () => void }) {
  const [editing, setEditing] = useState<Template | null>(null)
  const [title, setTitle]     = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody]       = useState('')
  const [saving, setSaving]   = useState(false)

  const openNew = () => { setEditing(null); setTitle(''); setSubject(''); setBody('') }
  const openEdit = (t: Template) => { setEditing(t); setTitle(t.title); setSubject(t.subject); setBody(t.body) }

  const handleSave = async () => {
    if (!title || !subject || !body) return
    setSaving(true)
    await fetch('/api/newsletter/templates', {
      method: 'POST',
      headers: adminHeaders(adminEmail),
      body: JSON.stringify({ id: editing?.id, title, subject, body }),
    })
    setSaving(false)
    setEditing(null); setTitle(''); setSubject(''); setBody('')
    onRefresh()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('このテンプレートを削除しますか？')) return
    await fetch('/api/newsletter/templates', {
      method: 'DELETE',
      headers: adminHeaders(adminEmail),
      body: JSON.stringify({ id }),
    })
    onRefresh()
  }

  const isFormOpen = title !== '' || subject !== '' || body !== ''

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">テンプレートを保存しておくと、配信画面から素早く読み込めます。</p>
        <button
          onClick={openNew}
          className="flex items-center gap-1.5 h-8 px-4 rounded-lg text-xs font-semibold"
          style={{ background: '#10b981', color: '#fff' }}
        >
          <Plus size={12} /> 新規作成
        </button>
      </div>

      {/* フォーム */}
      {isFormOpen && (
        <div className="bg-[#0d1117] border border-emerald-500/20 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-300">{editing ? 'テンプレートを編集' : '新規テンプレート'}</p>
            <button onClick={() => { setTitle(''); setSubject(''); setBody('') }} className="text-slate-600 hover:text-slate-400">
              <X size={14} />
            </button>
          </div>
          {[
            { label: 'テンプレート名', value: title, set: setTitle, ph: '例：新ツール告知' },
            { label: '件名',         value: subject, set: setSubject, ph: '例：【NextraLabs】○○リリースのお知らせ' },
          ].map(f => (
            <div key={f.label} className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">{f.label}</label>
              <input value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.ph}
                className="w-full h-10 rounded-lg px-4 text-sm text-slate-200 placeholder-slate-600 outline-none"
                style={{ background: '#13141f', border: '1px solid #334155' }}
                onFocus={e => (e.target.style.borderColor = '#10b981')}
                onBlur={e => (e.target.style.borderColor = '#334155')}
              />
            </div>
          ))}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">本文</label>
            <textarea value={body} onChange={e => setBody(e.target.value)} rows={8} placeholder="本文を入力..."
              className="w-full rounded-lg px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none resize-y font-mono"
              style={{ background: '#13141f', border: '1px solid #334155' }}
              onFocus={e => (e.target.style.borderColor = '#10b981')}
              onBlur={e => (e.target.style.borderColor = '#334155')}
            />
          </div>
          <button onClick={handleSave} disabled={saving || !title || !subject || !body}
            className="h-10 px-6 rounded-lg text-xs font-semibold flex items-center gap-2 disabled:opacity-40"
            style={{ background: '#10b981', color: '#fff' }}>
            <Save size={12} /> {saving ? '保存中...' : '保存する'}
          </button>
        </div>
      )}

      {/* テンプレート一覧 */}
      <div className="space-y-3">
        {templates.length === 0 ? (
          <div className="py-12 text-center text-slate-700 text-xs">テンプレートがまだありません</div>
        ) : templates.map(t => (
          <div key={t.id} className="bg-[#0d1117] border border-white/5 rounded-xl p-4 flex items-start justify-between gap-4 hover:border-white/10 transition-all">
            <div className="space-y-1 min-w-0">
              <p className="text-sm font-semibold text-slate-200">{t.title}</p>
              <p className="text-xs text-slate-500 truncate">{t.subject}</p>
              <p className="text-[10px] text-slate-700">{new Date(t.updated_at).toLocaleDateString('ja-JP')} 更新</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => openEdit(t)}
                className="h-8 px-3 rounded-lg text-xs border border-white/10 text-slate-400 hover:border-emerald-500/30 hover:text-emerald-400 transition-all">
                編集
              </button>
              <button onClick={() => handleDelete(t.id)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-500/20 text-red-500/50 hover:bg-red-500/10 hover:text-red-400 transition-all">
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 送信履歴タブ ───
function HistoryTab({ adminEmail }: { adminEmail: string }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    supabase.from('newsletter_campaigns').select('*').order('sent_at', { ascending: false }).then(({ data }) => {
      if (data) setCampaigns(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="bg-[#0d1117] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-600 text-xs">読み込み中...</div>
        ) : campaigns.length === 0 ? (
          <div className="py-16 text-center text-slate-700 text-xs">送信履歴がまだありません</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] whitespace-nowrap">
              <thead className="border-b border-white/5 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">件名</th>
                  <th className="px-5 py-3">対象</th>
                  <th className="px-5 py-3 text-center">成功</th>
                  <th className="px-5 py-3 text-center">失敗</th>
                  <th className="px-5 py-3">ステータス</th>
                  <th className="px-5 py-3">送信日時</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {campaigns.map(c => (
                  <tr key={c.id} className="hover:bg-white/5 transition-all">
                    <td className="px-5 py-3 text-slate-200 font-medium max-w-[200px] truncate">{c.subject}</td>
                    <td className="px-5 py-3 text-slate-500">{c.tag_filter || '全員'}</td>
                    <td className="px-5 py-3 text-center text-emerald-400 font-bold">{c.sent_count}</td>
                    <td className="px-5 py-3 text-center text-red-400">{c.failed_count || 0}</td>
                    <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-5 py-3 text-slate-600">
                      {new Date(c.sent_at).toLocaleString('ja-JP', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── メイン管理画面 ───
export default function NewsletterAdminPage() {
  const [activeTab, setActiveTab] = useState('compose')
  const [adminEmail, setAdminEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [templates, setTemplates] = useState<Template[]>([])

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email === ADMIN_EMAIL) {
        setAdminEmail(user.email)
        loadTemplates(user.email)
      }
      setLoading(false)
    })
  }, [])

  const loadTemplates = async (email: string) => {
    const res  = await fetch('/api/newsletter/templates', { headers: { 'x-admin-email': email } })
    const data = await res.json()
    if (data.ok) setTemplates(data.data)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center">
        <span className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!adminEmail) {
    return (
      <div className="min-h-screen bg-[#050507] flex flex-col items-center justify-center gap-4 text-center px-4">
        <AlertCircle size={36} className="text-red-400" />
        <p className="text-white font-semibold">管理者専用ページです</p>
        <p className="text-slate-500 text-sm">f.yoneyone9@gmail.com でログインしてください</p>
        <Link href="/login" className="mt-2 h-10 px-6 rounded-lg text-sm font-semibold flex items-center gap-2"
          style={{ background: '#10b981', color: '#fff' }}>
          ログイン
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 pb-20">
      {/* ヘッダー */}
      <div className="border-b border-white/5 bg-[#0d1117]/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/products" className="text-slate-600 hover:text-slate-400 transition-colors">
              <ArrowLeft size={16} />
            </Link>
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-emerald-400" />
              <span className="text-sm font-semibold text-white">メルマガ管理</span>
            </div>
            <ChevronRight size={14} className="text-slate-700" />
            <span className="text-xs text-slate-500">Admin</span>
          </div>
          <Link href="/products/newsletter"
            className="text-xs text-slate-500 hover:text-emerald-400 transition-colors flex items-center gap-1">
            登録ページを見る →
          </Link>
        </div>

        {/* タブ */}
        <div className="max-w-5xl mx-auto px-4 flex gap-1 pb-0 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* コンテンツ */}
      <div className="max-w-5xl mx-auto px-4 pt-8">
        {activeTab === 'compose'     && <ComposeTab adminEmail={adminEmail} templates={templates} onSent={() => loadTemplates(adminEmail)} />}
        {activeTab === 'subscribers' && <SubscribersTab adminEmail={adminEmail} />}
        {activeTab === 'templates'   && <TemplatesTab adminEmail={adminEmail} templates={templates} onRefresh={() => loadTemplates(adminEmail)} />}
        {activeTab === 'history'     && <HistoryTab adminEmail={adminEmail} />}
      </div>
    </div>
  )
}
