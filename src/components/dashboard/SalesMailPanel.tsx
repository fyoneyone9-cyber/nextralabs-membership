'use client'
import React, { useState, useEffect, useCallback } from 'react'
import {
  Mail, Send, CheckCircle2, Building2, Heart, RefreshCw,
  Trash2, FileText, ChevronDown, ChevronUp, Loader2, AlertCircle, LogIn,
  Search, Globe, Phone, Star, PlusCircle, MapPin
} from 'lucide-react'

// ─────────────────────────────────────────────
// 型定義
// ─────────────────────────────────────────────
interface Prospect {
  place_id: string
  name: string
  address: string
  phone: string | null
  website: string | null
  email: string | null
  rating: number | null
}

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

━━━━━━━━━━━━━━━━
NextraLabs
米山 文貴
Email: info@marriage-road.jp
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
米山 文貴
Email: info@marriage-road.jp
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
米山 文貴
Email: info@marriage-road.jp
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
米山 文貴
Email: info@marriage-road.jp
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
  if (!res.ok) throw new Error(data?.error?.message || 'Gmail send failed')
  return data.id as string
}

// Gmail OAuth（InboxOrganizerページを中継してダッシュボードに戻る）
function startGmailAuth() {
  const scopes = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.compose',
    'https://www.googleapis.com/auth/gmail.send',
  ].join(' ')

  const returnPath = window.location.pathname + window.location.search
  const callbackUrl = `${window.location.origin}/products/inbox-organizer/app`

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: callbackUrl,
    response_type: 'token',
    scope: scopes,
    prompt: 'consent',
    state: `redirect:${encodeURIComponent(returnPath)}`,
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

  // 見込み客検索
  const [searchRegion, setSearchRegion] = useState('神奈川県')
  const [searchCategory, setSearchCategory] = useState('ホテル・旅館')
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [searching, setSearching] = useState(false)
  const [searchDone, setSearchDone] = useState(false)

  // トークン復元
  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem(GMAIL_TOKEN_KEY)
    if (saved) {
      setGmailToken(saved)
      fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${saved}` },
      }).then(r => r.json()).then(p => {
        if (p.email) setGmailEmail(p.email)
      }).catch(() => {
        localStorage.removeItem(GMAIL_TOKEN_KEY)
        setGmailToken(null)
      })
    }
    setSentList(loadSentList())
  }, [])

  // 見込み客検索
  const handleSearch = async () => {
    setSearching(true)
    setSearchDone(false)
    setProspects([])
    try {
      const res = await fetch('/api/sales/prospect-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: searchCategory, region: searchRegion }),
      })
      const data = await res.json()
      setProspects(data.results || [])
    } catch {
      // ignore
    } finally {
      setSearching(false)
      setSearchDone(true)
    }
  }

  // 見込み客をフォームにセット
  const applyProspect = (p: Prospect) => {
    setName(p.name)
    setTo(p.email || '')
    setCategory(searchCategory)
    const tmpl = TEMPLATES.find(t => t.category === searchCategory) || TEMPLATES[3]
    setSubject(tmpl.subject)
    setBody(tmpl.body)
    setTimeout(() => {
      document.getElementById('sales-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

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
      setSendResult({ ok: true, msg: '✅ 送信完了！Gmailの送信済みフォルダに記録されました。' })
      setTo(''); setName(''); setSubject(''); setBody('')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.includes('401') || msg.includes('invalid_token') || msg.includes('Invalid Credentials')) {
        localStorage.removeItem(GMAIL_TOKEN_KEY)
        setGmailToken(null)
        setSendResult({ ok: false, msg: '❌ Gmailトークンの期限切れ。再ログインしてください。' })
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

  // ─── JSX ───────────────────────────────────
  return (
    <div className="space-y-8">

      {/* Gmail認証バナー */}
      {!gmailToken ? (
        <div className="bg-[#0d1117] border border-yellow-500/20 rounded-xl p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle size={18} className="text-yellow-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-yellow-400">Gmail連携が必要です</p>
              <p className="text-xs text-slate-500 mt-0.5">Gmailから直接営業メールを送信するにはGoogleアカウントと連携してください。</p>
            </div>
          </div>
          <button onClick={startGmailAuth}
            className="shrink-0 h-10 px-5 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 text-yellow-400 font-semibold text-sm rounded-lg transition-all flex items-center gap-2">
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
          <button onClick={() => { localStorage.removeItem(GMAIL_TOKEN_KEY); setGmailToken(null); setGmailEmail('') }}
            className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
            ログアウト
          </button>
        </div>
      )}

      {/* ─── 🔍 見込み客検索 ─── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-l-4 border-emerald-500/30 pl-4">
          <Search size={16} className="text-emerald-400" />
          <h2 className="font-semibold text-lg text-emerald-400">営業先を検索</h2>
          <span className="text-xs text-slate-500 ml-1">Google Mapsから企業・メアドを自動取得</span>
        </div>

        <div className="bg-[#0d1117] border border-white/5 rounded-xl p-5 space-y-4">
          <div className="flex gap-3 flex-wrap">
            {/* カテゴリ */}
            <div className="flex-1 min-w-[160px] space-y-1">
              <label className="text-xs text-slate-400 font-medium">業種</label>
              <select
                value={searchCategory}
                onChange={e => setSearchCategory(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50"
              >
                <option>ホテル・旅館</option>
                <option>結婚相談所</option>
                <option>民泊・短期賃貸</option>
                <option>その他</option>
              </select>
            </div>
            {/* 地域 */}
            <div className="flex-1 min-w-[160px] space-y-1">
              <label className="text-xs text-slate-400 font-medium">地域</label>
              <select
                value={searchRegion}
                onChange={e => setSearchRegion(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50"
              >
                <option value="北海道">北海道</option>
                <option value="青森県">青森県</option>
                <option value="岩手県">岩手県</option>
                <option value="宮城県">宮城県</option>
                <option value="秋田県">秋田県</option>
                <option value="山形県">山形県</option>
                <option value="福島県">福島県</option>
                <option value="茨城県">茨城県</option>
                <option value="栃木県">栃木県</option>
                <option value="群馬県">群馬県</option>
                <option value="埼玉県">埼玉県</option>
                <option value="千葉県">千葉県</option>
                <option value="東京都">東京都</option>
                <option value="神奈川県">神奈川県</option>
                <option value="新潟県">新潟県</option>
                <option value="富山県">富山県</option>
                <option value="石川県">石川県</option>
                <option value="福井県">福井県</option>
                <option value="山梨県">山梨県</option>
                <option value="長野県">長野県</option>
                <option value="岐阜県">岐阜県</option>
                <option value="静岡県">静岡県</option>
                <option value="愛知県">愛知県</option>
                <option value="三重県">三重県</option>
                <option value="滋賀県">滋賀県</option>
                <option value="京都府">京都府</option>
                <option value="大阪府">大阪府</option>
                <option value="兵庫県">兵庫県</option>
                <option value="奈良県">奈良県</option>
                <option value="和歌山県">和歌山県</option>
                <option value="鳥取県">鳥取県</option>
                <option value="島根県">島根県</option>
                <option value="岡山県">岡山県</option>
                <option value="広島県">広島県</option>
                <option value="山口県">山口県</option>
                <option value="徳島県">徳島県</option>
                <option value="香川県">香川県</option>
                <option value="愛媛県">愛媛県</option>
                <option value="高知県">高知県</option>
                <option value="福岡県">福岡県</option>
                <option value="佐賀県">佐賀県</option>
                <option value="長崎県">長崎県</option>
                <option value="熊本県">熊本県</option>
                <option value="大分県">大分県</option>
                <option value="宮崎県">宮崎県</option>
                <option value="鹿児島県">鹿児島県</option>
                <option value="沖縄県">沖縄県</option>
              </select>
            </div>
            {/* 検索ボタン */}
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={searching}
                className="h-10 px-6 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition-all flex items-center gap-2"
              >
                {searching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                {searching ? '検索中...' : '検索'}
              </button>
            </div>
          </div>

          {/* 検索結果 */}
          {searching && (
            <div className="text-center py-8 text-slate-500 text-sm flex flex-col items-center gap-3">
              <Loader2 size={20} className="animate-spin text-emerald-500" />
              Google Mapsから施設情報とメールアドレスを取得中...
            </div>
          )}

          {searchDone && prospects.length === 0 && (
            <div className="text-center py-6 text-slate-500 text-sm">
              該当する施設が見つかりませんでした。地域や業種を変えてみてください。
            </div>
          )}

          {prospects.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-slate-500">{prospects.length}件見つかりました。クリックでフォームに自動入力します。</p>
              {prospects.map((p) => (
                <div key={p.place_id}
                  className="bg-black/30 border border-white/5 rounded-xl p-4 flex items-start justify-between gap-4 hover:border-emerald-500/30 transition-all group">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Building2 size={13} className="text-emerald-400 shrink-0" />
                      <p className="text-sm font-medium text-white truncate">{p.name}</p>
                      {p.rating && (
                        <span className="flex items-center gap-0.5 text-xs text-yellow-400 shrink-0">
                          <Star size={10} fill="currentColor" /> {p.rating}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      {p.address && (
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <MapPin size={10} /> {p.address.replace('日本、', '').slice(0, 40)}
                        </span>
                      )}
                      {p.phone && (
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Phone size={10} /> {p.phone}
                        </span>
                      )}
                      {p.website && (
                        <a href={p.website} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1 text-xs text-slate-500 hover:text-emerald-400 transition-colors"
                          onClick={e => e.stopPropagation()}>
                          <Globe size={10} /> サイト
                        </a>
                      )}
                    </div>
                    {p.email ? (
                      <span className="inline-flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2 py-0.5">
                        <Mail size={10} /> {p.email}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                        <Mail size={10} /> メアド未取得
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => applyProspect(p)}
                    className="shrink-0 flex items-center gap-1.5 text-xs bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 rounded-lg px-3 py-2 transition-all"
                  >
                    <PlusCircle size={13} /> フォームに入力
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── 送信済み履歴 ─── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 border-l-4 border-emerald-500/30 pl-4">
            <Mail size={16} className="text-emerald-400" />
            <h2 className="font-semibold text-lg text-emerald-400">送信済み営業メール</h2>
            <span className="text-xs text-slate-500 ml-1">{sentList.length}件</span>
          </div>
          <button onClick={handleRefresh}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors px-3 py-1.5 rounded-lg border border-white/5 hover:border-emerald-500/30">
            <RefreshCw size={12} /> 更新
          </button>
        </div>

        {sentList.length === 0 ? (
          <div className="bg-[#0d1117] border border-white/5 rounded-xl p-8 text-center">
            <Mail size={24} className="text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">まだ送信履歴がありません。</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sentList.map((item) => (
              <div key={item.id} className="bg-[#0d1117] border border-white/5 rounded-xl p-4 flex items-center justify-between gap-4 group hover:border-white/10 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  {item.category === '結婚相談所' ? <Heart size={16} className="text-pink-400 shrink-0" /> : <Building2 size={16} className="text-emerald-400 shrink-0" />}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{item.name}</p>
                    <p className="text-xs text-slate-500 truncate">{item.email}</p>
                    {item.subject && <p className="text-xs text-slate-600 truncate mt-0.5">{item.subject}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-slate-600">{item.date}</span>
                  <span className="inline-flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-3 py-1">
                    <CheckCircle2 size={11} /> 送信済み
                  </span>
                  <button onClick={() => handleDelete(item.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 hover:text-red-400" title="削除">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── 新規送信フォーム ─── */}
      <div id="sales-form" className="space-y-4">
        <div className="flex items-center gap-2 border-l-4 border-emerald-500/30 pl-4">
          <Send size={16} className="text-emerald-400" />
          <h2 className="font-semibold text-lg text-emerald-400">新規営業メール送信</h2>
        </div>

        <div className="bg-[#0d1117] border border-white/5 rounded-xl p-6 space-y-4">

          {/* 雛形選択 */}
          <div>
            <button onClick={() => setShowTemplates(v => !v)}
              className="w-full flex items-center justify-between px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-sm text-emerald-400 hover:bg-emerald-500/15 transition-colors">
              <span className="flex items-center gap-2"><FileText size={14} />雛形テンプレートを選択して本文を自動入力</span>
              {showTemplates ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {showTemplates && (
              <div className="mt-2 space-y-1.5 pl-1">
                {TEMPLATES.map(tmpl => (
                  <button key={tmpl.id} onClick={() => applyTemplate(tmpl)}
                    className="w-full text-left px-4 py-2.5 bg-black/30 border border-white/5 rounded-lg text-sm text-slate-300 hover:border-emerald-500/30 hover:text-emerald-400 transition-all">
                    {tmpl.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 宛先名 + カテゴリ */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium">相手先名称</label>
              <input value={name} onChange={e => setName(e.target.value)}
                placeholder="HOTEL PLUMM 横浜"
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium">カテゴリ</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50">
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
            <input value={to} onChange={e => setTo(e.target.value)}
              placeholder="info@example.com" type="email"
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50" />
          </div>

          {/* 件名 */}
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium">件名 <span className="text-red-400">*</span></label>
            <input value={subject} onChange={e => setSubject(e.target.value)}
              placeholder="【ご提案】..."
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50" />
          </div>

          {/* 本文 */}
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium">本文 <span className="text-red-400">*</span></label>
            <textarea value={body} onChange={e => setBody(e.target.value)} rows={14}
              placeholder="上の「雛形テンプレートを選択」か「営業先を検索」から自動入力できます"
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 resize-y font-mono text-xs leading-relaxed" />
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
          <button onClick={handleSend} disabled={sending || !gmailToken}
            className="h-12 px-8 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg transition-all flex items-center gap-2">
            {sending ? <><Loader2 size={15} className="animate-spin" /> 送信中...</> : <><Send size={14} /> Gmailから送信する</>}
          </button>
          {!gmailToken && (
            <p className="text-xs text-slate-600 text-center">※ 上の「Gmailでログイン」ボタンで連携後に送信できます</p>
          )}
        </div>
      </div>
    </div>
  )
}
