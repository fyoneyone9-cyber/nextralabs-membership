'use client'
import React, { useState, useEffect, useCallback } from 'react'
import {
  Mail, Send, CheckCircle2, Building2, Heart, RefreshCw,
  Trash2, FileText, ChevronDown, ChevronUp, Loader2, AlertCircle, LogIn
} from 'lucide-react'

// ─────────────────────────────────────────────
// 型定義
// ─────────────────────────────────────────────
interface SentItem {
  id: string
  name: string
  email: string
  category: string
  date: string
  subject: string
}

// ─────────────────────────────────────────────
// Google OAuth 定数
// ─────────────────────────────────────────────
const GOOGLE_CLIENT_ID = '239583936801-ev71grs66ehp0kn3kahr2bdrl0v9iidj.apps.googleusercontent.com'
const GMAIL_TOKEN_KEY = 'nextra_google_token'

// ─────────────────────────────────────────────
// 雛形テンプレート
// ─────────────────────────────────────────────
const TEMPLATES = [
  {
    id: 'hotel',
    label: '🏨 ホテル・旅館向け',
    category: 'ホテル・旅館',
    subject: '【ご提案】AIを活用した宿泊施設向けサービスのご紹介',
    body: `ご担当者様

突然のご連絡失礼いたします。
NextraLabsの米山と申します。

この度は、AIを活用した宿泊施設向けの業務効率化サービスをご提案させていただきたく、ご連絡いたしました。

■ 主なサービス内容
・多言語対応チャットボット（日英中韓に対応）
・予約管理の自動化・AI分析
・口コミ分析・返信文の自動生成
・スタッフのシフト最適化支援

初回無料デモのご案内も可能です。
まずはオンラインにてご説明の機会をいただけますと幸いです。

お忙しいところ恐れ入りますが、ご検討のほどよろしくお願い申し上げます。

━━━━━━━━━━━━━━━━
NextraLabs
米山 文貴（Ninja3）
Email: f.yoneyone9@gmail.com
Tel: 080-3207-8422
https://membership-site-nextralabos.vercel.app
━━━━━━━━━━━━━━━━`,
  },
  {
    id: 'bridal',
    label: '💍 結婚相談所・ブライダル向け',
    category: '結婚相談所',
    subject: '【ご提案】結婚相談所・ブライダル業向けAIサービスのご紹介',
    body: `ご担当者様

突然のご連絡失礼いたします。
NextraLabsの米山と申します。

弊社代表自身も「マレッジロードジャパン」という結婚相談所を運営しており、
現場のニーズを熟知した上でサービスを設計しております。

■ 主なサービス内容
・会員マッチングの精度向上AI分析
・お見合いセッティング業務の自動化
・会員向け自動フォローアップメール生成
・成婚率アップのためのデータ分析ダッシュボード

まずは無料にてサービスのデモをご覧いただけます。
ご都合のよい日程をお知らせいただければ幸いです。

━━━━━━━━━━━━━━━━
NextraLabs / マレッジロードジャパン
米山 文貴（Ninja3）
Email: f.yoneyone9@gmail.com
Tel: 080-3207-8422
https://www.youtube.com/@marriage_road
━━━━━━━━━━━━━━━━`,
  },
  {
    id: 'minpaku',
    label: '🏠 民泊・Airbnb運営者向け',
    category: '民泊・短期賃貸',
    subject: '【ご提案】民泊・短期賃貸向けAI管理ツールのご紹介',
    body: `ご担当者様

突然のご連絡失礼いたします。
NextraLabsの米山と申します。

民泊・短期賃貸物件の管理効率化を支援するAIツールをご提案させていただきます。

■ 主なサービス内容
・スマートロック一元管理（SwitchBot / TT Lock / SESAME 対応）
・ゲスト向け多言語自動返信メッセージ生成
・清掃スタッフへの自動スケジュール通知
・レビュー分析・改善提案

まずは無料相談・デモのご案内が可能です。
お気軽にお問い合わせください。

━━━━━━━━━━━━━━━━
NextraLabs
米山 文貴（Ninja3）
Email: f.yoneyone9@gmail.com
Tel: 080-3207-8422
https://membership-site-nextralabos.vercel.app
━━━━━━━━━━━━━━━━`,
  },
  {
    id: 'general',
    label: '📋 汎用営業テンプレート',
    category: 'その他',
    subject: '【ご提案】AI業務効率化サービスのご紹介',
    body: `ご担当者様

突然のご連絡失礼いたします。
NextraLabsの米山と申します。

貴社の業務効率化を支援するAIサービスをご提案させていただきたく、ご連絡いたしました。

■ 主なサービス
・業務自動化ツール（メール返信・レポート生成）
・データ分析・可視化ダッシュボード
・AI搭載チャットボット導入支援

まずはオンラインにて15分程度のご説明の機会をいただけますと幸いです。

━━━━━━━━━━━━━━━━
NextraLabs
米山 文貴（Ninja3）
Email: f.yoneyone9@gmail.com
Tel: 080-3207-8422
https://membership-site-nextralabos.vercel.app
━━━━━━━━━━━━━━━━`,
  },
]

const STORAGE_KEY = 'nextra_sales_mail_sent'

function loadSentList(): SentItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveSentList(list: SentItem[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

// Gmail send via Google API directly
async function sendGmail(accessToken: string, to: string, subject: string, body: string): Promise<string> {
  // RFC 2822 raw email
  const lines = [
    `To: ${to}`,
    `Subject: =?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: quoted-printable',
    '',
    body,
  ]
  const rawEmail = lines.join('\r\n')

  // base64url encode
  const encoded = btoa(unescape(encodeURIComponent(rawEmail)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: encoded }),
  })

  const data = await res.json()
  if (!res.ok) {
    const msg = data?.error?.message || 'Gmail send failed'
    throw new Error(msg)
  }
  return data.id as string
}

// Gmail OAuth login with send scope
function startGmailAuth() {
  const scopes = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.compose',
    'https://www.googleapis.com/auth/gmail.send',
  ].join(' ')

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: window.location.origin + window.location.pathname,
    response_type: 'token',
    scope: scopes,
    prompt: 'consent',
    state: 'sales-mail',
  })

  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`
}

// ─────────────────────────────────────────────
// メインコンポーネント
// ─────────────────────────────────────────────
export default function SalesMailPanel() {
  const [gmailToken, setGmailToken] = useState<string | null>(null)
  const [gmailEmail, setGmailEmail] = useState<string>('')
  const [sentList, setSentList] = useState<SentItem[]>([])
  const [to, setTo] = useState('')
  const [name, setName] = useState('')
  const [category, setCategory] = useState('ホテル・旅館')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ ok: boolean; msg: string } | null>(null)
  const [showTemplates, setShowTemplates] = useState(false)

  // OAuthコールバック処理 & トークン復元
  useEffect(() => {
    if (typeof window === 'undefined') return
    const hash = new URLSearchParams(window.location.hash.slice(1))
    const token = hash.get('access_token')
    const state = hash.get('state')
    if (token && state === 'sales-mail') {
      setGmailToken(token)
      localStorage.setItem(GMAIL_TOKEN_KEY, token)
      window.history.replaceState(null, '', window.location.pathname)
      // Get email address
      fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      }).then(r => r.json()).then(p => {
        if (p.email) setGmailEmail(p.email)
      }).catch(() => {})
    } else {
      const saved = localStorage.getItem(GMAIL_TOKEN_KEY)
      if (saved) setGmailToken(saved)
    }

    setSentList(loadSentList())
  }, [])

  // リスト更新
  const handleRefresh = useCallback(() => {
    setSentList(loadSentList())
    setSendResult({ ok: true, msg: '✅ リストを更新しました' })
    setTimeout(() => setSendResult(null), 2000)
  }, [])

  // 雛形適用
  const applyTemplate = (tmpl: typeof TEMPLATES[0]) => {
    setSubject(tmpl.subject)
    setBody(tmpl.body)
    setCategory(tmpl.category)
    setShowTemplates(false)
  }

  // 送信
  const handleSend = async () => {
    if (!to.trim() || !subject.trim() || !body.trim()) {
      setSendResult({ ok: false, msg: '⚠️ 宛先・件名・本文をすべて入力してください' })
      return
    }
    if (!gmailToken) {
      setSendResult({ ok: false, msg: '⚠️ Gmailにログインしてから送信してください' })
      return
    }

    setSending(true)
    setSendResult(null)

    try {
      const messageId = await sendGmail(gmailToken, to.trim(), subject.trim(), body.trim())

      // 成功 → localStorageに追記
      const newItem: SentItem = {
        id: messageId || Date.now().toString(),
        name: name.trim() || to.trim(),
        email: to.trim(),
        category,
        date: new Date().toISOString().slice(0, 10),
        subject: subject.trim(),
      }
      const updated = [newItem, ...sentList]
      setSentList(updated)
      saveSentList(updated)

      setSendResult({ ok: true, msg: '✅ 送信完了しました！Gmailの送信済みフォルダに記録されています。' })

      // フォームリセット
      setTo('')
      setName('')
      setSubject('')
      setBody('')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      // token期限切れ
      if (msg.includes('401') || msg.includes('invalid_token') || msg.includes('Invalid Credentials')) {
        localStorage.removeItem(GMAIL_TOKEN_KEY)
        setGmailToken(null)
        setSendResult({ ok: false, msg: '❌ Gmailトークンの期限が切れました。再ログインしてください。' })
      } else {
        setSendResult({ ok: false, msg: `❌ 送信失敗: ${msg}` })
      }
    } finally {
      setSending(false)
    }
  }

  // 履歴削除
  const handleDelete = (id: string) => {
    const updated = sentList.filter(item => item.id !== id)
    setSentList(updated)
    saveSentList(updated)
  }

  return (
    <div className="space-y-8">

      {/* ─── Gmail認証バナー ─── */}
      {!gmailToken ? (
        <div className="bg-[#0d1117] border border-yellow-500/20 rounded-xl p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle size={18} className="text-yellow-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-yellow-400">Gmail連携が必要です</p>
              <p className="text-xs text-slate-500 mt-0.5">実際のGmailから営業メールを送信するには、Googleアカウントと連携してください。</p>
            </div>
          </div>
          <button
            onClick={startGmailAuth}
            className="shrink-0 h-10 px-5 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 text-yellow-400 font-semibold text-sm rounded-lg transition-all flex items-center gap-2"
          >
            <LogIn size={14} /> Gmailでログイン
          </button>
        </div>
      ) : (
        <div className="bg-[#0d1117] border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span className="text-sm text-emerald-400 font-medium">Gmail連携済み</span>
            {gmailEmail && <span className="text-xs text-slate-500">（{gmailEmail}）</span>}
          </div>
          <button
            onClick={() => { localStorage.removeItem(GMAIL_TOKEN_KEY); setGmailToken(null); setGmailEmail('') }}
            className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
          >
            ログアウト
          </button>
        </div>
      )}

      {/* ─── 送信済み履歴 ─── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 border-l-4 border-emerald-500/30 pl-4">
            <Mail size={16} className="text-emerald-400" />
            <h2 className="font-semibold text-lg text-emerald-400">送信済み営業メール</h2>
            <span className="text-xs text-slate-500 ml-1">{sentList.length}件</span>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors px-3 py-1.5 rounded-lg border border-white/5 hover:border-emerald-500/30"
          >
            <RefreshCw size={12} />
            更新
          </button>
        </div>

        {sentList.length === 0 ? (
          <div className="bg-[#0d1117] border border-white/5 rounded-xl p-8 text-center">
            <Mail size={24} className="text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">まだ送信履歴がありません。</p>
            <p className="text-slate-600 text-xs mt-1">下のフォームから最初のメールを送ってみましょう。</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sentList.map((item) => (
              <div key={item.id} className="bg-[#0d1117] border border-white/5 rounded-xl p-4 flex items-center justify-between gap-4 group hover:border-white/10 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  {item.category === '結婚相談所' || item.category === 'ブライダル'
                    ? <Heart size={16} className="text-pink-400 shrink-0" />
                    : <Building2 size={16} className="text-emerald-400 shrink-0" />
                  }
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{item.name}</p>
                    <p className="text-xs text-slate-500 truncate">{item.email}</p>
                    {item.subject && (
                      <p className="text-xs text-slate-600 truncate mt-0.5">{item.subject}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-slate-600">{item.date}</span>
                  <span className="inline-flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-3 py-1">
                    <CheckCircle2 size={11} /> 送信済み
                  </span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 hover:text-red-400"
                    title="履歴から削除"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── 新規送信フォーム ─── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-l-4 border-emerald-500/30 pl-4">
          <Send size={16} className="text-emerald-400" />
          <h2 className="font-semibold text-lg text-emerald-400">新規営業メール送信</h2>
        </div>

        <div className="bg-[#0d1117] border border-white/5 rounded-xl p-6 space-y-4">

          {/* 雛形選択 */}
          <div>
            <button
              onClick={() => setShowTemplates(v => !v)}
              className="w-full flex items-center justify-between px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-sm text-emerald-400 hover:bg-emerald-500/15 transition-colors"
            >
              <span className="flex items-center gap-2">
                <FileText size={14} />
                雛形テンプレートを選択して本文を自動入力
              </span>
              {showTemplates ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {showTemplates && (
              <div className="mt-2 space-y-1.5 pl-1">
                {TEMPLATES.map(tmpl => (
                  <button
                    key={tmpl.id}
                    onClick={() => applyTemplate(tmpl)}
                    className="w-full text-left px-4 py-2.5 bg-black/30 border border-white/5 rounded-lg text-sm text-slate-300 hover:border-emerald-500/30 hover:text-emerald-400 transition-all"
                  >
                    {tmpl.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 宛先名 + カテゴリ */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium">相手先名称（履歴表示用）</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="HOTEL PLUMM 横浜"
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium">カテゴリ</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50"
              >
                <option>ホテル・旅館</option>
                <option>結婚相談所</option>
                <option>民泊・短期賃貸</option>
                <option>その他</option>
              </select>
            </div>
          </div>

          {/* メールアドレス */}
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium">宛先メールアドレス <span className="text-red-400">*</span></label>
            <input
              value={to}
              onChange={e => setTo(e.target.value)}
              placeholder="info@example.com"
              type="email"
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* 件名 */}
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium">件名 <span className="text-red-400">*</span></label>
            <input
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="【ご提案】..."
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* 本文 */}
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium">本文 <span className="text-red-400">*</span></label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              rows={14}
              placeholder="上の「雛形テンプレートを選択」から自動入力できます"
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 resize-y font-mono text-xs leading-relaxed"
            />
            <p className="text-xs text-slate-600 text-right">{body.length}文字</p>
          </div>

          {/* 結果メッセージ */}
          {sendResult && (
            <div className={`flex items-start gap-2 px-4 py-3 rounded-lg text-sm ${sendResult.ok ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              {sendResult.msg}
            </div>
          )}

          {/* 送信ボタン */}
          <button
            onClick={handleSend}
            disabled={sending || !gmailToken}
            className="h-12 px-8 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg transition-all flex items-center gap-2"
          >
            {sending ? (
              <><Loader2 size={15} className="animate-spin" /> 送信中...</>
            ) : (
              <><Send size={14} /> Gmailから送信する</>
            )}
          </button>
          {!gmailToken && (
            <p className="text-xs text-slate-600 text-center">※ 上の「Gmailでログイン」ボタンで連携後に送信できます</p>
          )}
        </div>
      </div>
    </div>
  )
}
